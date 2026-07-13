/**
 * Loaded on every page. Wires up four features that only exist on posts:
 *
 *   1. Table of contents: build the nav list from the article's headings,
 *      then run a rAF-throttled scroll-spy with a binary-searched active
 *      heading. Replaces the old IntersectionObserver approach, which called
 *      back on every heading that entered or left the viewport — for the
 *      elliptic-curves and 4G articles that fires dozens of times per scroll
 *      frame and stalls the main thread.
 *
 *   2. Formula copy-to-clipboard. Reads the TeX source from `data-tex`
 *      attributes that mathjax-setup.js writes onto every mjx-container.
 *      Inline formulas copy on click / Enter / Space; display formulas have
 *      an explicit button injected into a `.math-copy-shell` wrapper.
 *
 *   3. Formula copy-via-selection. A capture-phase `copy` handler on the
 *      document walks the current Range, replaces each `mjx-container` that
 *      lands in the selection with its TeX source (wrapped in $…$ or $$…$$),
 *      and writes the result to text/plain. That way a normal drag-select
 *      + Ctrl-C over a paragraph carries the LaTeX with it, instead of
 *      producing an empty clipboard entry because the visible glyphs are
 *      unselectable SVG.
 *
 *   4. Image lightbox. Every content image in `.article-prose` is wrapped
 *      in a semantic `<button class="image-zoom-trigger">` on init; clicking
 *      one opens a full-viewport overlay with the image at natural size,
 *      dismissible by Escape, backdrop click, or the explicit close button.
 *
 * None of these features run on pages that don't contain the corresponding
 * DOM, so the module is safe to load site-wide.
 */
(function () {
  'use strict';

  /* -------------------------------------------------------------- TOC ---- */

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0590-\u05ff]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildToc() {
    var nav = document.getElementById('post-toc');
    var listEl = document.getElementById('post-toc-list');
    var prose = document.querySelector('.article-prose');
    if (!nav || !listEl || !prose) return null;

    var headings = Array.prototype.slice.call(
      prose.querySelectorAll('h2, h3, h4')
    );
    if (headings.length < 2) {
      if (nav.parentNode) nav.parentNode.removeChild(nav);
      return null;
    }

    var hasH2 = headings.some(function (h) { return h.tagName === 'H2'; });
    var topTag = hasH2 ? 'H2' : 'H3';

    function isTop(h) { return h.tagName === topTag; }
    function isSub(h) {
      return topTag === 'H2'
        ? (h.tagName === 'H3' || h.tagName === 'H4')
        : (h.tagName === 'H4');
    }

    var linkable = headings.filter(function (h) { return isTop(h) || isSub(h); });
    /* Very long references (dozens of subsections) collapse to a clean,
       section-level list; shorter ones show their subsections too. */
    var includeSubs = linkable.length <= 40;

    var used = {};
    function ensureId(h) {
      if (h.id) { used[h.id] = true; return; }
      var base = slugify(h.textContent) || 'section';
      var id = base;
      var n = 1;
      while (document.getElementById(id) || used[id]) {
        id = base + '-' + n;
        n += 1;
      }
      h.id = id;
      used[h.id] = true;
    }

    function makeItem(h, cls) {
      var li = document.createElement('li');
      li.className = 'post-toc__item ' + cls;
      var a = document.createElement('a');
      a.className = 'post-toc__link';
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      return li;
    }

    /* Build the DOM in a fragment first so we hit the live tree once. */
    var frag = document.createDocumentFragment();
    var currentSub = null;
    var currentTopLi = null;
    var linked = [];

    headings.forEach(function (h) {
      if (isTop(h)) {
        ensureId(h);
        currentSub = null;
        currentTopLi = makeItem(h, 'post-toc__item--top');
        frag.appendChild(currentTopLi);
        linked.push(h);
      } else if (isSub(h) && includeSubs) {
        ensureId(h);
        if (!currentSub) {
          currentSub = document.createElement('ol');
          currentSub.className = 'post-toc__sublist';
          (currentTopLi || frag).appendChild(currentSub);
        }
        currentSub.appendChild(makeItem(h, 'post-toc__item--sub'));
        linked.push(h);
      }
    });

    listEl.appendChild(frag);
    nav.hidden = false;
    nav.setAttribute('data-toc-ready', '');
    return { nav: nav, linked: linked };
  }

  function initTocSpy(state) {
    if (!state) return;
    var links = {};
    var linkNodes = state.nav.querySelectorAll('.post-toc__link');
    Array.prototype.forEach.call(linkNodes, function (a) {
      var raw = a.getAttribute('href').slice(1);
      var id;
      try { id = decodeURIComponent(raw); }
      catch (_e) { id = raw; }
      links[id] = a;
    });

    var entries = state.linked
      .map(function (h) { return { id: h.id, heading: h, link: links[h.id] }; })
      .filter(function (e) { return e.link; });
    if (!entries.length) return;

    /* Compact parallel arrays for the hot path. */
    var offsets = new Array(entries.length);
    var activeIndex = -1;
    var scrollFrame = 0;
    var measureFrame = 0;
    /* Header height + a little breathing room, mirroring the CSS
       scroll-margin-top used on headings. */
    var HEADER_OFFSET = 96;

    function setActive(index) {
      if (index === activeIndex) return;
      if (activeIndex >= 0 && entries[activeIndex]) {
        entries[activeIndex].link.classList.remove('is-active');
        entries[activeIndex].link.removeAttribute('aria-current');
      }
      activeIndex = index;
      if (activeIndex >= 0 && entries[activeIndex]) {
        entries[activeIndex].link.classList.add('is-active');
        entries[activeIndex].link.setAttribute('aria-current', 'location');
      }
    }

    function updateActive() {
      scrollFrame = 0;
      if (!offsets.length) return;
      var target = window.scrollY + HEADER_OFFSET;
      var low = 0;
      var high = offsets.length - 1;
      var chosen = 0;
      /* Standard binary search for the greatest offset <= target. */
      while (low <= high) {
        var mid = (low + high) >> 1;
        if (offsets[mid] <= target) { chosen = mid; low = mid + 1; }
        else high = mid - 1;
      }
      setActive(chosen);
    }

    function scheduleUpdate() {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateActive);
    }

    function measure() {
      measureFrame = 0;
      for (var i = 0; i < entries.length; i++) {
        offsets[i] = entries[i].heading.getBoundingClientRect().top
          + window.scrollY;
      }
      updateActive();
    }

    function scheduleMeasure() {
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(measure);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('load', scheduleMeasure, { once: true });

    /* Re-measure once web fonts settle: math boxes change height when the
       Roboto Mono and MathJax SVG fonts finish decoding. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleMeasure).catch(function () {});
    }

    /* And once MathJax typesets, because math grows/shrinks section heights.
       mathjax-setup.js writes data-math-restored on cache-hit; on cache-miss
       we listen for the promise indirectly via a MutationObserver on the
       article prose, throttled to a single re-measure. */
    var prose = document.querySelector('.article-prose');
    if (prose && window.MutationObserver) {
      var mutationTimer = 0;
      var mo = new MutationObserver(function () {
        if (mutationTimer) return;
        mutationTimer = window.setTimeout(function () {
          mutationTimer = 0;
          scheduleMeasure();
        }, 120);
      });
      mo.observe(prose, { childList: true, subtree: true });
      /* Stop watching once things quiet down. */
      window.setTimeout(function () { mo.disconnect(); }, 8000);
    }

    Array.prototype.forEach.call(linkNodes, function (a) {
      a.addEventListener('click', function () {
        /* After a hash-jump, the target scroll position isn't final until
           the browser has repainted; re-measure after a beat. */
        window.setTimeout(scheduleMeasure, 320);
      });
    });

    measure();
  }

  /* ----------------------------------------------------- Formula copy ---- */

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var ok = false;
    try { ok = document.execCommand('copy'); }
    finally { document.body.removeChild(textarea); }
    return ok;
  }

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function showCopiedState(target) {
    if (!target) return;
    var isButton = target.matches('[data-copy-math-button]');
    var oldLabel = isButton ? target.textContent : '';
    target.classList.add('is-copied');
    if (isButton) target.textContent = 'copied';
    window.setTimeout(function () {
      target.classList.remove('is-copied');
      if (isButton) target.textContent = oldLabel;
    }, 1200);
  }

  function copyFormula(container, feedbackTarget) {
    if (!container) return;
    var tex = container.getAttribute('data-tex');
    if (!tex) return;
    writeClipboard(tex).then(function (ok) {
      if (ok) showCopiedState(feedbackTarget || container);
    });
  }

  function initFormulaCopying() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-copy-math-button]');
      if (button) {
        var shell = button.closest('.math-copy-shell');
        copyFormula(
          shell && shell.querySelector('mjx-container[data-tex]'),
          button
        );
        return;
      }
      var inline = event.target.closest(
        'mjx-container[data-copy-math-inline][data-tex]'
      );
      if (!inline) return;
      /* Respect an active text selection so users can still highlight math
         with the mouse without triggering a copy. */
      var sel = window.getSelection && window.getSelection();
      if (sel && String(sel).trim()) return;
      copyFormula(inline, inline);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var target = event.target.closest(
        'mjx-container[data-copy-math-inline][data-tex]'
      );
      if (!target) return;
      event.preventDefault();
      copyFormula(target, target);
    });
  }

  /* ------------------------------------------ Formula copy via select ---- */

  /* Rebuild the selected content as plain text, but with every
     `mjx-container[data-tex]` replaced by its raw TeX source in delimiters.
     Returns null if the selection touches no math (let the browser handle
     the copy normally in that case). */
  function buildSelectionTextWithTex(selection) {
    var mathHit = false;
    var parts = [];

    for (var r = 0; r < selection.rangeCount; r++) {
      var range = selection.getRangeAt(r);
      if (range.collapsed) continue;

      /* Edge case: the entire selection lies inside a single mjx-container
         (user drag-selected only a formula). cloneContents on such a range
         returns an SVG fragment with no data-tex attribute in scope, so we
         short-circuit to the enclosing container's TeX. */
      var host = range.commonAncestorContainer;
      var hostEl = host.nodeType === Node.ELEMENT_NODE ? host : host.parentElement;
      var enclosing = hostEl && hostEl.closest
        ? hostEl.closest('mjx-container[data-tex]')
        : null;
      if (enclosing) {
        var etex = enclosing.getAttribute('data-tex') || '';
        var edisp = enclosing.getAttribute('display') === 'true';
        parts.push(edisp ? '$$' + etex + '$$' : '$' + etex + '$');
        mathHit = true;
        continue;
      }

      var frag = range.cloneContents();
      var mjxNodes = frag.querySelectorAll('mjx-container[data-tex]');
      if (mjxNodes.length) mathHit = true;
      for (var i = 0; i < mjxNodes.length; i++) {
        var c = mjxNodes[i];
        var tex = c.getAttribute('data-tex') || '';
        var display = c.getAttribute('display') === 'true';
        var replaced = display ? '\n$$' + tex + '$$\n' : '$' + tex + '$';
        c.parentNode.replaceChild(document.createTextNode(replaced), c);
      }

      var wrap = document.createElement('div');
      wrap.appendChild(frag);
      parts.push(wrap.textContent);
    }

    if (!mathHit) return null;
    return parts.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  }

  function initFormulaSelectionCopy() {
    /* Capture phase so we run before any application-level handler. */
    document.addEventListener('copy', function (event) {
      var sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

      var text = buildSelectionTextWithTex(sel);
      if (text == null) return; // no math in the selection — let the browser copy

      try {
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
      } catch (_e) {
        /* clipboardData not writable (very old browser); fall through to
           the default behaviour, which is at least no worse than before. */
      }
    }, true);
  }

  /* -------------------------------------------------- Image lightbox ---- */

  var lightboxState = {
    node: null,       // overlay element while open
    lastFocus: null,  // element to return focus to on close
    onKey: null       // bound keydown handler, for teardown
  };

  function closeLightbox() {
    if (!lightboxState.node) return;
    document.body.classList.remove('has-lightbox');
    document.removeEventListener('keydown', lightboxState.onKey, true);
    if (lightboxState.node.parentNode) {
      lightboxState.node.parentNode.removeChild(lightboxState.node);
    }
    var toFocus = lightboxState.lastFocus;
    lightboxState.node = null;
    lightboxState.lastFocus = null;
    lightboxState.onKey = null;
    if (toFocus && typeof toFocus.focus === 'function') {
      try { toFocus.focus(); } catch (_e) { /* detached node — ignore */ }
    }
  }

  function openLightbox(sourceImg) {
    var src = sourceImg.currentSrc || sourceImg.src;
    if (!src) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute(
      'aria-label',
      sourceImg.alt ? 'Image: ' + sourceImg.alt : 'Image preview'
    );
    backdrop.tabIndex = -1;

    var img = document.createElement('img');
    img.className = 'lightbox__image';
    img.src = src;
    img.alt = sourceImg.alt || '';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox__close';
    close.setAttribute('aria-label', 'Close image');
    close.innerHTML = '&times;';

    backdrop.appendChild(img);
    backdrop.appendChild(close);

    backdrop.addEventListener('click', function (event) {
      /* Clicking the image itself should not close; clicking the backdrop
         or the close button should. */
      if (event.target === img) return;
      closeLightbox();
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

    /* Wrap every content image in a semantic <button>. Skip images inside
       anchors (their link behaviour wins) and images already wrapped. */
    var imgs = prose.querySelectorAll('img');
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.closest('a')) return;
      if (img.parentNode &&
          img.parentNode.classList &&
          img.parentNode.classList.contains('image-zoom-trigger')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'image-zoom-trigger';
      btn.setAttribute(
        'aria-label',
        img.alt ? 'Open image: ' + img.alt : 'Open image'
      );

      var parent = img.parentNode;
      if (!parent) return;
      parent.insertBefore(btn, img);
      btn.appendChild(img);
    });

    prose.addEventListener('click', function (event) {
      var btn = event.target.closest('.image-zoom-trigger');
      if (!btn || !prose.contains(btn)) return;
      var img = btn.querySelector('img');
      if (!img) return;
      event.preventDefault();
      openLightbox(img);
    });
  }

  /* --------------------------------------------------------- Bootstrap ---- */

  function boot() {
    var tocState = buildToc();
    initTocSpy(tocState);
    initFormulaCopying();
    initFormulaSelectionCopy();
    initImageLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
