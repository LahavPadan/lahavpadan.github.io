/**
 * Stable MathJax preparation for article pages.
 *
 * Display math is separated while it is still raw TeX. MathJax output is never
 * reparented, wrapped, cached, duplicated, or restored from sessionStorage.
 */
(function () {
  'use strict';

  function articleRoot() {
    return document.querySelector('.article-prose');
  }

  function purgeLegacyMathCaches() {
    try {
      for (var i = window.sessionStorage.length - 1; i >= 0; i -= 1) {
        var key = window.sessionStorage.key(i);
        if (key && key.indexOf('lahav-math-cache:') === 0) {
          window.sessionStorage.removeItem(key);
        }
      }
    } catch (_error) {
      // sessionStorage can be unavailable in private or restricted contexts.
    }
  }

  function repairMangledInlineMath(root) {
    var nodes = Array.prototype.slice.call(root.querySelectorAll('em'));
    nodes.reverse().forEach(function (node) {
      var text = node.textContent || '';
      if (text.indexOf('$') === -1 || !node.parentNode) return;
      node.parentNode.replaceChild(document.createTextNode('_' + text + '_'), node);
    });
    root.normalize();
  }

  function hasRenderableContent(html) {
    if (!html || !html.trim()) return false;
    var template = document.createElement('template');
    template.innerHTML = html;
    if ((template.content.textContent || '').trim()) return true;
    return Boolean(template.content.querySelector(
      'img,svg,video,audio,iframe,object,embed,br,hr,input,button'
    ));
  }

  function nextDisplayDelimiter(html, from) {
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
      var marker = nextDisplayDelimiter(html, cursor);
      if (!marker) {
        segments.push({ type: 'text', html: html.slice(cursor) });
        break;
      }
      var end = html.indexOf(marker.close, marker.index + marker.open.length);
      if (end === -1) return null;
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
      if (!meaningful.some(function (segment) { return segment.type === 'math'; })) {
        return;
      }

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

  window.__lahavMathPrep = function () {
    var prose = articleRoot();
    if (!prose) return;

    purgeLegacyMathCaches();
    repairMangledInlineMath(prose);
    normalizeDisplayMathBlocks(prose);

    if (typeof window.__lahavPrepareGuidedReading === 'function') {
      window.__lahavPrepareGuidedReading();
    }
  };

  window.__lahavMathPost = function () {
    document.documentElement.dataset.mathReady = 'true';
    document.dispatchEvent(new CustomEvent('lahav:math-ready'));
  };
}());
