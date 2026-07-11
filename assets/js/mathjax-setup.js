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
    var key = cacheKey();
    if (!key) return false;
    var cached = safeSessionGet(key);
    if (!cached) return false;
    root.innerHTML = cached;
    return true;
  }

  function writeCache(root) {
    var key = cacheKey();
    if (!key) return;
    /* Only cache once MathJax has finished — the container has SVG glyphs and
       styling attributes at this point, so restoring on next load looks
       identical without waiting for typesetting. */
    var html = root.innerHTML;
    if (html.length > 1500000) return; // ~1.5 MB soft cap
    safeSessionSet(key, html);
  }

  window.__lahavMathPrep = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    /* Step 1: heal any kramdown-mangled inline math. Runs on the live DOM
       regardless of whether we later restore from cache. */
    repairMangledMath(prose);

    /* Step 2: if the previous visit left a typeset snapshot, drop it in.
       MathJax will still walk the DOM but will find no unprocessed math. */
    if (tryRestoreCache(prose)) {
      prose.setAttribute('data-math-restored', 'true');
    }
  };

  function decorateInline(container) {
    container.setAttribute('data-copy-math-inline', '');
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', 'Copy formula');
    container.setAttribute('title', 'click to copy TeX');
  }

  function wrapDisplay(container) {
    if (!container.parentNode) return;
    if (container.parentNode.classList &&
        container.parentNode.classList.contains('math-copy-shell')) return;
    var shell = document.createElement('div');
    shell.className = 'math-copy-shell';
    container.parentNode.insertBefore(shell, container);
    shell.appendChild(container);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'math-copy-button';
    btn.setAttribute('data-copy-math-button', '');
    btn.setAttribute('aria-label', 'Copy formula TeX source');
    btn.textContent = 'copy tex';
    shell.appendChild(btn);
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

    var containers = prose.querySelectorAll('mjx-container[data-tex]');
    containers.forEach(function (c) {
      if (c.getAttribute('display') === 'true') wrapDisplay(c);
      else decorateInline(c);
    });

    writeCache(prose);
  };
}());
