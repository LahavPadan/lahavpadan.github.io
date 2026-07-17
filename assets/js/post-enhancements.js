/**
 * Image lightbox, and the sizing and theming of the visualization iframes.
 *
 * Visualizations are declared in the article source with
 * {% include visualization.html %}, so nothing here decides where they belong;
 * it only measures them and keeps their palette in step with the page.
 */
(function () {
  'use strict';

  function each(nodes, fn) {
    Array.prototype.forEach.call(nodes || [], fn);
  }

  function cssValue(style, name, fallback) {
    var value = style.getPropertyValue(name);
    return value ? value.trim() : fallback;
  }

  function currentVisualizationPalette() {
    var post = document.querySelector('.post-page') || document.documentElement;
    var postStyle = window.getComputedStyle(post);
    var rootStyle = window.getComputedStyle(document.documentElement);
    var value = function (name, fallback) {
      return cssValue(postStyle, name, cssValue(rootStyle, name, fallback));
    };

    return {
      theme: document.documentElement.dataset.theme || 'light',
      page: value('--page', '#fbfbf8'),
      surface: value('--surface', '#ffffff'),
      surfaceMuted: value('--surface-muted', '#f4f5f1'),
      ink: value('--ink', '#1c2420'),
      muted: value('--muted', '#667169'),
      border: value('--border', '#d6ddd7'),
      borderStrong: value('--border-strong', '#a6b2a9'),
      accent: value('--post-accent', value('--accent', '#0d7659')),
      accentSoft: value('--post-accent-soft', value('--accent-soft', '#dcefe7')),
      accentBorder: value('--post-accent-border', value('--border-strong', '#a6b2a9')),
      accentInk: value('--post-accent-ink', value('--accent', '#0d7659'))
    };
  }

  function setVisualizationVariables(root, palette) {
    var style = root.style;
    var exact = {
      '--viz-page': palette.page,
      '--viz-surface': palette.surface,
      '--viz-surface-muted': palette.surfaceMuted,
      '--viz-ink': palette.ink,
      '--viz-muted': palette.muted,
      '--viz-border': palette.border,
      '--viz-border-strong': palette.borderStrong,
      '--viz-accent': palette.accent,
      '--viz-accent-soft': palette.accentSoft,
      '--viz-accent-border': palette.accentBorder,
      '--viz-accent-ink': palette.accentInk
    };
    Object.keys(exact).forEach(function (name) {
      style.setProperty(name, exact[name]);
    });

    /* Aliases are stable references to the exact variables above, so they only
       need to be installed once per iframe document. Theme switching then
       updates eleven values instead of rewriting the full compatibility map. */
    if (root.dataset.articleVisualizationAliasesReady === 'true') return;

    /* All diagram roles inherit from the article palette. The variables only
       have to live on the iframe root; copying the entire declaration set onto
       every top-level child caused a full visualization re-style on each theme
       switch and was the main source of the visible dark/light-mode pause. */
    var aliases = {
      '--page': 'var(--viz-page)',
      '--paper': 'var(--viz-surface)',
      '--bg': 'var(--viz-page)',
      '--auc-bg': 'var(--viz-page)',
      '--tw-bg': 'var(--viz-page)',

      '--surface': 'var(--viz-surface)',
      '--panel': 'var(--viz-surface)',
      '--auc-surface': 'var(--viz-surface)',
      '--tw-surface': 'var(--viz-surface)',
      '--rls-surface': 'var(--viz-surface)',
      '--eg-surface': 'var(--viz-surface)',

      '--surface-muted': 'var(--viz-surface-muted)',
      '--surface-2': 'var(--viz-surface-muted)',
      '--panel-2': 'var(--viz-surface-muted)',
      '--auc-surface-soft': 'var(--viz-surface-muted)',
      '--tw-surface-soft': 'var(--viz-surface-muted)',
      '--rls-muted-surface': 'var(--viz-surface-muted)',
      '--eg-surface-muted': 'var(--viz-surface-muted)',

      '--ink': 'var(--viz-ink)',
      '--text': 'var(--viz-ink)',
      '--auc-text': 'var(--viz-ink)',
      '--tw-text': 'var(--viz-ink)',
      '--rls-ink': 'var(--viz-ink)',
      '--eg-ink': 'var(--viz-ink)',

      '--muted': 'var(--viz-muted)',
      '--faint': 'color-mix(in srgb, var(--viz-muted) 76%, transparent)',
      '--auc-muted': 'var(--viz-muted)',
      '--auc-faint': 'color-mix(in srgb, var(--viz-muted) 76%, transparent)',
      '--auc-gray': 'var(--viz-muted)',
      '--auc-white': 'var(--viz-ink)',
      '--tw-muted': 'var(--viz-muted)',
      '--rls-muted': 'var(--viz-muted)',
      '--eg-muted': 'var(--viz-muted)',

      '--border': 'var(--viz-border)',
      '--line': 'var(--viz-border)',
      '--rule': 'var(--viz-border)',
      '--grid': 'color-mix(in srgb, var(--viz-border) 72%, transparent)',
      '--auc-grid': 'color-mix(in srgb, var(--viz-border) 72%, transparent)',
      '--auc-line': 'var(--viz-border)',
      '--tw-border': 'var(--viz-border)',
      '--rls-border': 'var(--viz-border)',
      '--eg-border': 'var(--viz-border)',

      '--border-strong': 'var(--viz-border-strong)',
      '--line-strong': 'var(--viz-border-strong)',
      '--rule-strong': 'var(--viz-border-strong)',
      '--rls-border-strong': 'var(--viz-border-strong)',

      '--accent': 'var(--viz-accent)',
      '--post-accent': 'var(--viz-accent)',
      '--card-accent': 'var(--viz-accent)',
      '--rt-accent': 'var(--viz-accent)',
      '--eg-accent': 'var(--viz-accent)',
      '--tw-accent': 'var(--viz-accent)',
      '--rls-g': 'var(--viz-accent)',
      '--auc-purple': 'var(--viz-accent)',
      '--curve': 'var(--viz-accent)',
      '--good': 'var(--viz-accent)',
      '--result': 'var(--viz-accent)',
      '--real': 'var(--viz-accent)',
      '--positive': 'var(--viz-accent)',
      '--ray': 'var(--viz-accent)',
      '--field': 'var(--viz-accent)',
      '--teal': 'var(--viz-accent)',
      '--blue': 'var(--viz-accent)',

      '--accent-ink': 'var(--viz-accent-ink)',
      '--accent-deep': 'var(--viz-accent-ink)',
      '--accent-strong': 'var(--viz-accent-ink)',
      '--strong': 'var(--viz-accent-ink)',
      '--post-accent-ink': 'var(--viz-accent-ink)',
      '--eg-accent-border': 'var(--viz-accent-border)',
      '--tw-accent-ink': 'var(--viz-accent-ink)',
      '--auc-purple-strong': 'var(--viz-accent-ink)',
      '--curve-dark': 'var(--viz-accent-ink)',
      '--math': 'var(--viz-accent-ink)',

      '--accent-soft': 'var(--viz-accent-soft)',
      '--post-accent-soft': 'var(--viz-accent-soft)',
      '--card-accent-soft': 'var(--viz-accent-soft)',
      '--rt-soft': 'var(--viz-accent-soft)',
      '--eg-accent-soft': 'var(--viz-accent-soft)',
      '--tw-accent-soft': 'var(--viz-accent-soft)',
      '--tw-accent-softer': 'color-mix(in srgb, var(--viz-accent-soft) 62%, var(--viz-surface))',
      '--rls-g-soft': 'var(--viz-accent-soft)',
      '--auc-purple-soft': 'var(--viz-accent-soft)',
      '--auc-purple-fill': 'color-mix(in srgb, var(--viz-accent-soft) 82%, transparent)',
      '--result-soft': 'var(--viz-accent-soft)',
      '--real-soft': 'var(--viz-accent-soft)',
      '--ray-soft': 'var(--viz-accent-soft)',
      '--field-soft': 'var(--viz-accent-soft)',
      '--teal-soft': 'var(--viz-accent-soft)',
      '--blue-soft': 'var(--viz-accent-soft)',
      '--soft': 'var(--viz-accent-soft)',

      '--accent-border': 'var(--viz-accent-border)',
      '--post-accent-border': 'var(--viz-accent-border)',
      '--card-accent-border': 'var(--viz-accent-border)',
      '--rt-border': 'var(--viz-accent-border)'
    };

    var secondary = 'color-mix(in oklab, var(--viz-accent) 68%, var(--viz-ink))';
    var secondarySoft = 'color-mix(in srgb, var(--viz-accent-soft) 72%, var(--viz-surface))';
    var tertiary = 'color-mix(in oklab, var(--viz-accent) 52%, var(--viz-muted))';
    var tertiarySoft = 'color-mix(in srgb, var(--viz-accent-soft) 52%, var(--viz-surface-muted))';

    [
      '--warm', '--violet', '--path', '--turn', '--negative', '--imag',
      '--compression', '--tangent', '--singular', '--orange', '--red',
      '--rls-k', '--tw-blue'
    ].forEach(function (name) { aliases[name] = secondary; });
    [
      '--warm-soft', '--violet-soft', '--path-soft', '--turn-soft',
      '--imag-soft', '--compression-soft', '--orange-soft', '--red-soft',
      '--rls-k-soft'
    ].forEach(function (name) { aliases[name] = secondarySoft; });
    [
      '--third', '--gold', '--success', '--warn', '--neutral-spring'
    ].forEach(function (name) { aliases[name] = tertiary; });
    [
      '--success-soft', '--warn-soft'
    ].forEach(function (name) { aliases[name] = tertiarySoft; });

    Object.keys(aliases).forEach(function (name) {
      style.setProperty(name, aliases[name]);
    });
    root.dataset.articleVisualizationAliasesReady = 'true';
  }

  var visualizationViewportObserver = null;

  function frameIsNearViewport(frame) {
    return !visualizationViewportObserver || frame.dataset.visualizationNearViewport === 'true';
  }

  function visualizationPaletteSignature(palette) {
    return [
      palette.theme, palette.page, palette.surface, palette.surfaceMuted,
      palette.ink, palette.muted, palette.border, palette.borderStrong,
      palette.accent, palette.accentSoft, palette.accentBorder, palette.accentInk
    ].join('|');
  }

  function syncVisualizationTheme(frame, suppliedPalette) {
    var doc;
    try { doc = frame.contentDocument; }
    catch (_e) { return; }
    if (!doc || !doc.documentElement || !doc.body) return;

    var palette = suppliedPalette || currentVisualizationPalette();
    var signature = visualizationPaletteSignature(palette);
    var root = doc.documentElement;
    if (frame.dataset.visualizationPalette === signature &&
        root.dataset.theme === palette.theme) return;

    /* Theme propagation changes colours only, never geometry. Suppress the
       ResizeObserver echo caused by the iframe style recalculation; measuring
       every diagram again was the main pause after toggling dark/light mode. */
    frame.__lahavIgnoreVisualizationResizeUntil =
      (window.performance && performance.now ? performance.now() : Date.now()) + 220;

    root.dataset.theme = palette.theme;
    root.style.colorScheme = palette.theme;
    setVisualizationVariables(root, palette);

    /* CSS custom properties inherit from :root. Only the canvas itself needs
       an !important override for older visualizations that hard-coded a body
       background; keeping this style tiny avoids a document-wide re-style. */
    var override = doc.getElementById('article-visualization-theme-override');
    if (!override) {
      override = doc.createElement('style');
      override.id = 'article-visualization-theme-override';
      override.textContent =
        'html,body{background:var(--viz-page)!important;color:var(--viz-ink)!important;color-scheme:inherit;}';
      (doc.head || root).appendChild(override);
    }

    frame.style.backgroundColor = palette.page;
    frame.dataset.visualizationPalette = signature;
  }

  function visualizationContentHeight(frame, deepScan) {
    var doc;
    try { doc = frame.contentDocument; }
    catch (_e) { return 0; }
    if (!doc || !doc.body || !doc.documentElement) return 0;

    var root = doc.documentElement;
    var body = doc.body;
    var maxBottom = Math.max(
      root.scrollHeight, root.offsetHeight, root.clientHeight,
      body.scrollHeight, body.offsetHeight, body.clientHeight
    );

    /* One geometric scan after load catches older diagrams whose final card is
       absolutely positioned outside normal flow. ResizeObserver and explicit
       postMessage heights handle subsequent interaction without repeating this
       expensive child-by-child computed-style walk. */
    if (deepScan) {
      var win = frame.contentWindow;
      each(body.children, function (node) {
        if (!node || /^(SCRIPT|STYLE|LINK)$/.test(node.tagName)) return;
        var style = win.getComputedStyle(node);
        if (style.display === 'none' || style.position === 'fixed') return;
        var rect = node.getBoundingClientRect();
        if (!isFinite(rect.bottom)) return;
        var marginBottom = parseFloat(style.marginBottom) || 0;
        maxBottom = Math.max(maxBottom, rect.bottom + win.scrollY + marginBottom);
      });
    }

    return Math.ceil(maxBottom);
  }

  function applyVisualizationHeight(frame, rawHeight, allowShrink) {
    var height = Number(rawHeight);
    if (!isFinite(height) || height <= 0) return;
    height = Math.max(240, Math.min(20000, Math.ceil(height)));

    var current = frame.offsetHeight || parseFloat(frame.style.height) || 0;
    if (!allowShrink && height <= current + 3) return;
    if (Math.abs(height - current) < 3) return;
    frame.style.height = height + 'px';
    document.dispatchEvent(new CustomEvent('lahav:visualization-resize', {
      detail: { frame: frame, height: height }
    }));
  }

  function measureVisualizationFrame(frame, deepScan) {
    /* Theme synchronization is handled on iframe load, theme mutation, and
       viewport entry. Keeping it out of the resize path avoids forced parent
       getComputedStyle reads every time an internal control changes height. */
    applyVisualizationHeight(frame, visualizationContentHeight(frame, deepScan), false);
  }

  function wireVisualizationFrame(frame) {
    if (!frame || frame.dataset.visualizationWired === 'true') return;
    frame.dataset.visualizationWired = 'true';

    var measureFrame = 0;
    var needsDeepScan = false;

    function scheduleMeasure(deepScan) {
      needsDeepScan = needsDeepScan || Boolean(deepScan);
      if (measureFrame) return;
      measureFrame = window.requestAnimationFrame(function () {
        measureFrame = 0;
        var deep = needsDeepScan;
        needsDeepScan = false;
        measureVisualizationFrame(frame, deep);
      });
    }

    function installResizeObserver() {
      var doc;
      try { doc = frame.contentDocument; }
      catch (_e) { return; }
      if (!doc || !doc.body || !doc.documentElement) return;

      if (frame.__lahavVisualizationResizeObserver) {
        frame.__lahavVisualizationResizeObserver.disconnect();
      }

      var ViewResizeObserver = frame.contentWindow && frame.contentWindow.ResizeObserver;
      if (ViewResizeObserver) {
        var observer = new ViewResizeObserver(function () {
          var now = window.performance && performance.now ? performance.now() : Date.now();
          if (now < (frame.__lahavIgnoreVisualizationResizeUntil || 0)) return;
          scheduleMeasure(false);
        });
        observer.observe(doc.documentElement);
        observer.observe(doc.body);
        frame.__lahavVisualizationResizeObserver = observer;
      }

      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(function () { scheduleMeasure(true); }).catch(function () {});
      }
    }

    function loaded() {
      delete frame.dataset.visualizationPalette;
      syncVisualizationTheme(frame);
      installResizeObserver();
      scheduleMeasure(true);
      window.setTimeout(function () { scheduleMeasure(true); }, 260);
    }

    frame.addEventListener('load', loaded);

    /* A newly-created lazy iframe initially exposes a complete about:blank
       document. Treating that as the real load caused duplicate theming,
       observers and deep measurements before the visualization even started. */
    try {
      if (frame.contentDocument &&
          frame.contentDocument.readyState === 'complete' &&
          frame.contentWindow.location.href !== 'about:blank') loaded();
    } catch (_error) {}

    if (visualizationViewportObserver) visualizationViewportObserver.observe(frame);
  }

  var visualizationResizingInitialized = false;

  function initVisualizationResizing() {
    if (visualizationResizingInitialized) return;
    visualizationResizingInitialized = true;

    var selector = 'iframe[data-article-visualization]';

    if ('IntersectionObserver' in window) {
      visualizationViewportObserver = new IntersectionObserver(function (entries) {
        var palette = null;
        entries.forEach(function (entry) {
          var frame = entry.target;
          var near = entry.isIntersecting || entry.intersectionRatio > 0;
          frame.dataset.visualizationNearViewport = near ? 'true' : 'false';
          if (near) {
            if (!palette) palette = currentVisualizationPalette();
            syncVisualizationTheme(frame, palette);
          }
        });
      }, { rootMargin: '800px 0px' });
    }

    each(document.querySelectorAll(selector), wireVisualizationFrame);

    /* Messages remain the most accurate source for interactive controls that
       change a visualization after load. */
    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      var height = Number(data.height || data.value || data.documentHeight);
      if (!isFinite(height) || height <= 0) return;

      each(document.querySelectorAll(selector), function (frame) {
        if (frame.contentWindow !== event.source) return;
        applyVisualizationHeight(frame, height, true);
      });
    });

    if (window.MutationObserver) {
      var themeFrame = 0;
      var themeTimer = 0;
      new MutationObserver(function () {
        if (themeFrame) return;
        themeFrame = window.requestAnimationFrame(function () {
          themeFrame = 0;
          if (themeTimer) window.clearTimeout(themeTimer);

          /* Let the parent page paint its new palette first. Iframe propagation
             runs in the next task, so the theme button never waits behind
             cross-document style recalculation. */
          themeTimer = window.setTimeout(function () {
            themeTimer = 0;
            var palette = currentVisualizationPalette();

            /* Update diagrams in or near the viewport. Off-screen iframes keep
               their old palette until IntersectionObserver brings them close
               to view, avoiding a synchronous restyle of the entire article. */
            each(document.querySelectorAll(selector), function (frame) {
              if (frameIsNearViewport(frame)) syncVisualizationTheme(frame, palette);
            });
          }, 0);
        });
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
  }


  /* -------------------------------------------------------------- TOC ---- */

  var lightboxState = { node: null, lastFocus: null, onKey: null };

  function closeLightbox() {
    if (!lightboxState.node) return;
    document.body.classList.remove('has-lightbox');
    document.removeEventListener('keydown', lightboxState.onKey, true);
    if (lightboxState.node.parentNode) lightboxState.node.parentNode.removeChild(lightboxState.node);
    var focus = lightboxState.lastFocus;
    lightboxState = { node: null, lastFocus: null, onKey: null };
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
    lightboxState.onKey = function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }
    };
    document.addEventListener('keydown', lightboxState.onKey, true);
    lightboxState.lastFocus = document.activeElement;
    lightboxState.node = backdrop;
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
    initVisualizationResizing();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else boot();
}());
