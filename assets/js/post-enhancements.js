/**
 * Post behaviour outside the reading flow: sizing and theming the embedded
 * visualizations, and the image lightbox.
 *
 * A visualization is a self-contained document in an iframe. Each one carries
 * its own light and dark palette and repaints itself from a single signal:
 * the `data-theme` attribute on its own root. The parent's whole part in
 * theming is therefore to copy the page theme onto each frame's root — one
 * attribute — and let the frame's stylesheet do the rest. A small set of base
 * surface colours is handed over once, for the few diagrams that inherit the
 * article's palette instead of defining their own.
 *
 * Height is the other thing that has to cross the boundary: only the frame
 * knows how tall its content is. Frames report it by message; the parent also
 * measures once on load for older diagrams that never post.
 */
(function () {
  'use strict';

  var FRAME_SELECTOR = 'iframe[data-article-visualization]';

  function frames() {
    return Array.prototype.slice.call(document.querySelectorAll(FRAME_SELECTOR));
  }

  function frameDocument(frame) {
    try {
      var doc = frame.contentDocument;
      return doc && doc.documentElement ? doc : null;
    } catch (_crossOrigin) {
      return null;
    }
  }

  // -- theme ----------------------------------------------------------------

  // Handed to frames that have no dark palette of their own, so they can borrow
  // the article's surfaces. Frames that theme themselves ignore these.
  var INHERITED = ['--page', '--surface', '--surface-muted', '--ink', '--muted',
    '--border', '--border-strong', '--post-accent', '--post-accent-soft',
    '--post-accent-border', '--post-accent-ink'];

  function basePalette() {
    var host = document.querySelector('.post-page') || document.documentElement;
    var style = window.getComputedStyle(host);
    return INHERITED.reduce(function (palette, name) {
      var value = style.getPropertyValue(name);
      if (value) palette[name] = value.trim();
      return palette;
    }, {});
  }

  function themeFrame(frame, theme, palette) {
    var doc = frameDocument(frame);
    if (!doc) return;
    doc.documentElement.dataset.theme = theme;
    doc.documentElement.style.colorScheme = theme;
    if (frame.dataset.visualizationInherited === 'true') return;
    Object.keys(palette).forEach(function (name) {
      doc.documentElement.style.setProperty(name, palette[name]);
    });
    frame.dataset.visualizationInherited = 'true';
  }

  function themeAllFrames() {
    var theme = document.documentElement.dataset.theme || 'light';
    var palette = basePalette();
    frames().forEach(function (frame) { themeFrame(frame, theme, palette); });
  }

  function watchPageTheme() {
    if (!window.MutationObserver) return;
    var scheduled = false;
    new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      // Let the parent paint its own theme first; the frames follow next frame.
      window.requestAnimationFrame(function () {
        scheduled = false;
        themeAllFrames();
      });
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  // -- height ---------------------------------------------------------------

  function applyHeight(frame, rawHeight) {
    var height = Math.round(Number(rawHeight));
    if (!isFinite(height) || height <= 0) return;
    height = Math.max(240, Math.min(20000, height));
    if (Math.abs(height - (parseFloat(frame.style.height) || 0)) < 2) return;
    frame.style.height = height + 'px';
    document.dispatchEvent(new CustomEvent('lahav:visualization-resize', {
      detail: { frame: frame, height: height }
    }));
  }

  // A frame that never posts its height (older diagrams) is measured once its
  // document settles. Frames that do post are handled by the message listener.
  function measureOnLoad(frame) {
    var doc = frameDocument(frame);
    if (!doc || !doc.body) return;
    applyHeight(frame, Math.max(
      doc.documentElement.scrollHeight, doc.body.scrollHeight
    ));
  }

  function wireFrame(frame) {
    if (frame.dataset.visualizationWired === 'true') return;
    frame.dataset.visualizationWired = 'true';

    var theme = document.documentElement.dataset.theme || 'light';
    var palette = basePalette();

    function settle() {
      themeFrame(frame, theme, palette);
      measureOnLoad(frame);
    }

    frame.addEventListener('load', settle);

    // A lazy iframe can already be complete when this runs.
    var doc = frameDocument(frame);
    if (doc && doc.readyState === 'complete') settle();
  }

  function initVisualizations() {
    if (!frames().length) return;

    frames().forEach(wireFrame);
    watchPageTheme();

    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      var height = data.visualizationHeight || data.height ||
        data.documentHeight || data.value;
      if (!height) return;
      frames().forEach(function (frame) {
        if (frame.contentWindow === event.source) applyHeight(frame, height);
      });
    });
  }

  // -- image lightbox -------------------------------------------------------

  var lightbox = { node: null, lastFocus: null, onKey: null };

  function closeLightbox() {
    if (!lightbox.node) return;
    document.body.classList.remove('has-lightbox');
    document.removeEventListener('keydown', lightbox.onKey, true);
    if (lightbox.node.parentNode) lightbox.node.parentNode.removeChild(lightbox.node);
    var focus = lightbox.lastFocus;
    lightbox = { node: null, lastFocus: null, onKey: null };
    if (focus && typeof focus.focus === 'function') {
      try { focus.focus(); } catch (_error) {}
    }
  }

  function openLightbox(sourceImage) {
    var src = sourceImage.currentSrc || sourceImage.src;
    if (!src) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', sourceImage.alt ? 'Image: ' + sourceImage.alt : 'Image preview');
    backdrop.tabIndex = -1;

    var image = document.createElement('img');
    image.className = 'lightbox__image';
    image.src = src;
    image.alt = sourceImage.alt || '';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox__close';
    close.setAttribute('aria-label', 'Close image');
    close.innerHTML = '&times;';

    backdrop.appendChild(image);
    backdrop.appendChild(close);
    backdrop.addEventListener('click', function (event) {
      if (event.target !== image) closeLightbox();
    });

    lightbox.onKey = function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }
    };
    document.addEventListener('keydown', lightbox.onKey, true);
    lightbox.lastFocus = document.activeElement;
    lightbox.node = backdrop;
    document.body.appendChild(backdrop);
    document.body.classList.add('has-lightbox');
    backdrop.focus();
  }

  function initImageLightbox() {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;
    prose.addEventListener('click', function (event) {
      var image = event.target.closest('img');
      if (!image || !prose.contains(image) || image.closest('a')) return;
      event.preventDefault();
      openLightbox(image);
    });
  }

  function boot() {
    initImageLightbox();
    initVisualizations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}());
