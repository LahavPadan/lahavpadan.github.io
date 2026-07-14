/**
 * Runs alongside MathJax on posts where `math: true`. Two hooks:
 *
 *   window.__lahavMathPrep()  — called from the head of `startup.pageReady`,
 *     after DOMContentLoaded but before MathJax scans the DOM for math
 *     delimiters. (Not `startup.ready`, which can fire before DOM ready
 *     when the MathJax bundle is served from cache.)
 *
 *   window.__lahavMathPost()  — called after MathJax's `pageReady` resolves,
 *     i.e. after all typesetting is done.
 *
 * The prep step fixes two things:
 *
 *   1. Kramdown intra-word emphasis mangles inline math like
 *      `Y$_3$Fe$_5$O$_{12}$`: the first `_` (inside `$_3$`) matches the `_`
 *      inside `$_{12}$` as an emphasis pair, so the HTML server-side becomes
 *      `Y$<em>3$Fe$_5$O$</em>{12}$`. MathJax then sees a text stream with an
 *      `<em>` boundary in the middle of a math region and either drops the
 *      element letters (Ga, O, Fe…) or renders a mash-up like `Y$3_5{12}^{3+}$`.
 *      This affects the "LaTeX broken inside tables" issue in the coupled-modes
 *      and Taylor posts, and also stray inline math in bulleted lists. The
 *      repair walks `<em>` elements inside `.article-prose` and, wherever an
 *      `<em>`'s text contains a `$`, replaces the element with the plain
 *      `_content_` string that the article source actually intended. That
 *      leaves genuine emphasis (which never contains `$`) untouched.
 *
 *   2. On a repeat visit to the same article we may have a fully-typeset
 *      snapshot of `.article-prose` in sessionStorage. Restoring it before
 *      MathJax starts turns typesetting into a no-op — the mjx-container SVG
 *      is already in the DOM. Cache key is (URL, build-version) so publishing
 *      new content automatically invalidates the cache.
 *
 * The post step:
 *
 *   - Copies each math item's TeX source onto its typeset root via a
 *     `data-tex` attribute, so the copy handlers in post-enhancements.js can
 *     read it back.
 *   - Marks inline math with `data-copy-math-inline` + keyboard affordances so
 *     click/enter/space copies the source (handler lives in post-enhancements.js).
 *   - Wraps display math in `<div class="math-copy-shell">` with a copy button.
 *   - Writes the typeset article body to sessionStorage for the next visit.
 */
(function () {
  'use strict';

  var CACHE_PREFIX = 'lahav-math-cache:v2:';

  /* Guided-reading articles skip both cache-restore and cache-write.
     Two reasons:

     1. Guided pages are restructured before MathJax scans them so the
        article route appears immediately and equation source ranges stay
        stable. Restoring a cached pre- or post-restructure snapshot would
        either wipe out that structure or duplicate a very large generated
        DOM. Simpler: do not cache guided pages.

     2. Memory. These are also the math-heaviest articles
        (elliptic-curves, 4G, coupled-modes), whose fully-typeset
        innerHTML is the single biggest per-tab memory item on the
        site. sessionStorage of that size effectively doubles the
        memory footprint until the tab closes. Skipping the cache
        here is the largest single reduction available without
        changing MathJax's renderer. */
  function isGuidedReadingPage(root) {
    return root && root.getAttribute('data-reading-mode') === 'guided';
  }

  function cacheKey() {
    var prose = document.querySelector('.article-prose');
    if (!prose) return null;
    var url = prose.getAttribute('data-article-url') || window.location.pathname;
    var version = prose.getAttribute('data-build-version') || '0';
    return CACHE_PREFIX + version + ':' + url;
  }

  function safeSessionGet(key) {
    try { return window.sessionStorage.getItem(key); }
    catch (_e) { return null; }
  }

  function safeSessionSet(key, value) {
    try { window.sessionStorage.setItem(key, value); }
    catch (_e) { /* quota, private-mode — ignore */ }
  }

  function repairMangledMath(root) {
    /* Unwrap <em> elements whose text content contains `$`. Those are almost
       certainly kramdown emphasis errors that split an inline-math run. */
    var ems = root.querySelectorAll('em');
    for (var i = ems.length - 1; i >= 0; i--) {
      var em = ems[i];
      var text = em.textContent;
      if (text.indexOf('$') === -1) continue;
      var replacement = document.createTextNode('_' + text + '_');
      em.parentNode.replaceChild(replacement, em);
    }
    root.normalize();
  }

  function tryRestoreCache(root) {
    if (isGuidedReadingPage(root)) return false;
    var key = cacheKey();
    if (!key) return false;
    var cached = safeSessionGet(key);
    if (!cached) return false;
    root.innerHTML = cached;
    return true;
  }

  function writeCache(root) {
    if (isGuidedReadingPage(root)) return;
    var key = cacheKey();
    if (!key) return;
    /* Only cache once MathJax has finished — the container has SVG glyphs and
       styling attributes at this point, so restoring on next load looks
       identical without waiting for typesetting. Cap at ~500 KB (down from
       1.5 MB) to keep per-tab memory small on the middle-sized articles
       where caching still makes sense. Bigger articles fall through this
       cap and re-typeset on refresh instead of doubling their footprint. */
    var html = root.innerHTML;
    if (html.length > 500000) return;
    safeSessionSet(key, html);
  }

  window.__lahavMathPrep = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    /* Guided mode must establish its final DOM structure before MathJax scans
       delimiter ranges. Doing this in MathJax's own pre-scan hook makes the
       ordering deterministic: the article route appears immediately, and no
       equation can be inserted later into a chapter it no longer belongs to. */
    if (typeof window.__lahavPrepareGuidedReading === 'function') {
      window.__lahavPrepareGuidedReading();
    }

    /* Step 1: heal any kramdown-mangled inline math. Runs on the live DOM
       regardless of whether we later restore from cache. */
    repairMangledMath(prose);

    /* Step 2: if the previous visit left a typeset snapshot, drop it in.
       MathJax will still walk the DOM but will find no unprocessed math. */
    if (tryRestoreCache(prose)) {
      prose.setAttribute('data-math-restored', 'true');
    }
  };

  function decorateInline(container, lightweight) {
    container.setAttribute('data-copy-math-inline', '');

    /* Guided articles can contain hundreds of inline expressions. Giving every
       one a tab stop, tooltip and ARIA button role creates an enormous focus /
       accessibility tree and noticeably delays both first render and global
       theme recalculation. Pointer copy still works through the data attribute;
       the full keyboard affordance remains on ordinary-sized posts. */
    if (lightweight) return;
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', 'Copy formula');
    container.setAttribute('title', 'click to copy TeX');
  }

  /* Inject a hidden, selectable TeX overlay into a typeset container.
     The overlay sits absolutely inside the mjx-container so drag-select
     over the equation region actually creates a text selection (browsers
     don't select MathJax's SVG glyphs on their own), and the browser's
     native copy path carries the LaTeX along. The overlay's text is
     transparent-on-transparent so the SVG stays the only visible thing;
     `pointer-events: none` keeps the click-to-copy affordance on the
     mjx-container itself intact. Idempotent — safe to re-run after a
     cache restore even if the overlay is already in place. */
  function attachSelectableSource(container) {
    if (container.querySelector(':scope > .mjx-source')) return;
    var tex = container.getAttribute('data-tex');
    if (typeof tex !== 'string' || !tex) return;
    var display = container.getAttribute('display') === 'true';
    var src = document.createElement('span');
    src.className = 'mjx-source';
    src.textContent = display ? '$$' + tex + '$$' : '$' + tex + '$';
    container.appendChild(src);
  }

  function appendDisplayCopyButton(shell) {
    if (shell.querySelector(':scope > .math-copy-button')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'math-copy-button';
    btn.setAttribute('data-copy-math-button', '');
    btn.setAttribute('aria-label', 'Copy formula TeX source');
    btn.textContent = 'copy tex';
    shell.appendChild(btn);
  }

  function isEquationOnlyParagraph(parent, container) {
    if (!parent || parent.nodeType !== 1 || parent.tagName !== 'P') return false;
    for (var node = parent.firstChild; node; node = node.nextSibling) {
      if (node === container) continue;
      if (node.nodeType === 3 && !node.nodeValue.trim()) continue;
      return false;
    }
    return true;
  }

  function wrapDisplay(container) {
    if (!container.parentNode) return;
    var parent = container.parentNode;
    if (parent.classList && parent.classList.contains('math-copy-shell')) {
      appendDisplayCopyButton(parent);
      return;
    }

    /* Kramdown normally places a display delimiter in its own paragraph. Turn
       that existing paragraph into the shell instead of moving MathJax's
       typesetRoot after typesetting. Avoiding the move is both faster and,
       more importantly, keeps MathJax's source/output ownership stable. */
    if (isEquationOnlyParagraph(parent, container)) {
      parent.classList.add('math-copy-shell');
      appendDisplayCopyButton(parent);
      return;
    }

    var shell = document.createElement('div');
    shell.className = 'math-copy-shell';
    parent.insertBefore(shell, container);
    shell.appendChild(container);
    appendDisplayCopyButton(shell);
  }

  window.__lahavMathPost = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    /* Stamp the original TeX source onto each typeset container so the
       copy handlers in post-enhancements.js have it to hand. On a cache-
       restore path this is a no-op (the cached HTML already carries the
       attribute); on the initial-typeset path we're the sole writer. */
    if (window.MathJax && MathJax.startup && MathJax.startup.document) {
      var items = MathJax.startup.document.math.toArray();
      items.forEach(function (item) {
        if (item.typesetRoot && typeof item.math === 'string'
            && !item.typesetRoot.hasAttribute('data-tex')) {
          item.typesetRoot.setAttribute('data-tex', item.math);
        }
      });
    }

    var guided = isGuidedReadingPage(prose);
    var containers = prose.querySelectorAll('mjx-container[data-tex]');
    containers.forEach(function (c) {
      var display = c.getAttribute('display') === 'true';

      /* The selectable helper span is useful on shorter posts, but on guided
         pages it adds one extra DOM node per expression. Those pages retain
         click-to-copy for inline formulas and a visible copy button for every
         display formula, so the helper can be omitted without losing the main
         copy affordances. */
      if (!guided) attachSelectableSource(c);
      if (display) wrapDisplay(c);
      else decorateInline(c, guided);
    });

    prose.setAttribute('data-math-decorated', 'true');
    writeCache(prose);

    /* The guided hierarchy is already final before MathJax scans it. This event
       now only asks scroll/visualization code to refresh final measurements. */
    document.documentElement.dataset.mathReady = 'true';
    document.dispatchEvent(new CustomEvent('lahav:math-ready'));
  };
}());
