/**
 * Stable MathJax integration for article pages.
 *
 * The important ordering rule is:
 *
 *   raw Markdown HTML
 *     -> repair mangled inline math
 *     -> split display math away from neighbouring prose
 *     -> build the guided-reading hierarchy
 *     -> let MathJax scan and typeset that final DOM
 *
 * MathJax output is never reparented after typesetting. Reparenting an
 * mjx-container invalidates the source/output ownership recorded by MathJax
 * and is the mechanism that can leave equations visually collected at the
 * end of a long article.
 */
(function () {
  'use strict';

  var CACHE_PREFIX = 'lahav-math-cache:v3:';

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
    catch (_e) { /* quota/private mode: rendering must still work */ }
  }

  function repairMangledMath(root) {
    var ems = root.querySelectorAll('em');
    for (var i = ems.length - 1; i >= 0; i--) {
      var em = ems[i];
      var text = em.textContent;
      if (text.indexOf('$') === -1) continue;
      em.parentNode.replaceChild(document.createTextNode('_' + text + '_'), em);
    }
    root.normalize();
  }

  function hasRenderableContent(html) {
    if (!html || !html.trim()) return false;
    var template = document.createElement('template');
    template.innerHTML = html;
    if (template.content.textContent.trim()) return true;
    return Boolean(template.content.querySelector(
      'img,svg,video,audio,iframe,object,embed,br,hr,input,button'
    ));
  }

  function nextDisplayOpen(html, from) {
    var dollar = html.indexOf('$$', from);
    var bracket = html.indexOf('\\[', from);
    if (dollar === -1 && bracket === -1) return null;
    if (dollar !== -1 && (bracket === -1 || dollar < bracket)) {
      return { index: dollar, open: '$$', close: '$$' };
    }
    return { index: bracket, open: '\\[', close: '\\]' };
  }

  function parseDisplaySegments(html) {
    var segments = [];
    var cursor = 0;
    var found = false;

    while (cursor < html.length) {
      var marker = nextDisplayOpen(html, cursor);
      if (!marker) {
        segments.push({ type: 'text', html: html.slice(cursor) });
        break;
      }

      var end = html.indexOf(marker.close, marker.index + marker.open.length);
      if (end === -1) return null; // Never rewrite malformed/unbalanced source.

      found = true;
      segments.push({ type: 'text', html: html.slice(cursor, marker.index) });
      segments.push({
        type: 'math',
        html: html.slice(marker.index, end + marker.close.length)
      });
      cursor = end + marker.close.length;
    }

    return found ? segments : null;
  }

  function cloneParagraphShell(source, keepId) {
    var clone = source.cloneNode(false);
    if (!keepId) clone.removeAttribute('id');
    return clone;
  }

  /**
   * Kramdown can legally emit this source as one paragraph when no blank line
   * follows the closing delimiter:
   *
   *   <p>$$ ... $$The next sentence...</p>
   *
   * That is exactly the shape present around the equations in §0.2. Split it
   * before MathJax scans the page. Every display expression then owns a stable
   * block in normal document flow; no post-typeset relocation is necessary.
   */
  function normalizeDisplayMathBlocks(root) {
    var paragraphs = Array.prototype.slice.call(root.querySelectorAll('p'));
    var changed = 0;

    paragraphs.forEach(function (paragraph) {
      if (!paragraph.parentNode) return;
      if (paragraph.closest('pre, code, script, style, textarea')) return;

      var segments = parseDisplaySegments(paragraph.innerHTML);
      if (!segments) return;

      var meaningful = segments.filter(function (segment) {
        return segment.type === 'math' || hasRenderableContent(segment.html);
      });
      if (!meaningful.some(function (segment) { return segment.type === 'math'; })) return;

      /* A paragraph containing only one display expression is already stable. */
      if (meaningful.length === 1 && meaningful[0].type === 'math') {
        paragraph.classList.add('math-source-block');
        return;
      }

      var fragment = document.createDocumentFragment();
      var firstOutput = true;

      meaningful.forEach(function (segment) {
        var block = cloneParagraphShell(paragraph, firstOutput);
        firstOutput = false;
        block.innerHTML = segment.html;
        if (segment.type === 'math') block.classList.add('math-source-block');
        fragment.appendChild(block);
      });

      paragraph.parentNode.replaceChild(fragment, paragraph);
      changed += 1;
    });

    if (changed) root.setAttribute('data-math-blocks-normalized', String(changed));
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
    var html = root.innerHTML;
    if (html.length > 500000) return;
    safeSessionSet(key, html);
  }

  window.__lahavMathPrep = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    /* These passes operate on the raw server-rendered Markdown DOM. */
    repairMangledMath(prose);
    normalizeDisplayMathBlocks(prose);

    /* Guided reading now receives already-separated, stable math blocks. */
    if (typeof window.__lahavPrepareGuidedReading === 'function') {
      window.__lahavPrepareGuidedReading();
    }

    if (tryRestoreCache(prose)) {
      prose.setAttribute('data-math-restored', 'true');
    }
  };

  function decorateInline(container, lightweight) {
    container.setAttribute('data-copy-math-inline', '');
    if (lightweight) return;
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', 'Copy formula');
    container.setAttribute('title', 'click to copy TeX');
  }

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
    if (!shell || shell.nodeType !== 1) return;
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

  /**
   * Add the copy shell in place. The fallback deliberately does not move the
   * mjx-container: even malformed/mixed markup remains in its authored parent.
   */
  function decorateDisplay(container) {
    if (!container.parentNode) return;
    var parent = container.parentNode;

    if (parent.classList && parent.classList.contains('math-copy-shell')) {
      appendDisplayCopyButton(parent);
      return;
    }

    if (isEquationOnlyParagraph(parent, container)) {
      parent.classList.add('math-copy-shell');
      appendDisplayCopyButton(parent);
      return;
    }

    if (parent.nodeType === 1) {
      parent.classList.add('math-copy-shell', 'math-copy-shell--mixed');
      appendDisplayCopyButton(parent);
    }
  }

  function stampMathSources() {
    if (!window.MathJax || !MathJax.startup || !MathJax.startup.document) return;
    var math = MathJax.startup.document.math;
    if (!math || typeof math.toArray !== 'function') return;

    math.toArray().forEach(function (item) {
      if (!item.typesetRoot || typeof item.math !== 'string') return;
      if (!item.typesetRoot.hasAttribute('data-tex')) {
        item.typesetRoot.setAttribute('data-tex', item.math);
      }
    });
  }

  window.__lahavMathPost = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    stampMathSources();

    var guided = isGuidedReadingPage(prose);
    var containers = prose.querySelectorAll('mjx-container[data-tex]');
    containers.forEach(function (container) {
      var display = container.getAttribute('display') === 'true';
      if (!guided) attachSelectableSource(container);
      if (display) decorateDisplay(container);
      else decorateInline(container, guided);
    });

    prose.setAttribute('data-math-decorated', 'true');
    writeCache(prose);
    document.documentElement.dataset.mathReady = 'true';
    document.dispatchEvent(new CustomEvent('lahav:math-ready'));
  };
}());
