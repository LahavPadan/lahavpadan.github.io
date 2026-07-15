/**
 * MathJax preparation for article pages.
 *
 * Block equations are wrapped in `div.math-block` at build time by the
 * `mathjax_block` engine in _plugins/math_block_engine.rb, so nothing here
 * has to find, wrap or relocate them. What remains is one repair that the
 * build cannot yet perform, plus the ordering guarantee that the article
 * reaches its final shape before MathJax scans it.
 *
 * After typesetting, equation nodes belong to MathJax alone.
 */
(function () {
  'use strict';

  /**
   * Kramdown recognizes `$$…$$` as math and nothing else, so an inline span
   * written as `$a_1 + b_2$` is ordinary prose to it: the two underscores
   * pair up and it emits an <em> holding the rest of the span, dollar
   * delimiters included. Rebuilding the underscores hands the original text
   * back to MathJax, which does understand `$…$`.
   *
   * This is a repair, not a design. The root cause is the delimiter mismatch
   * between the authored convention and the parser, and it belongs upstream
   * in the Markdown preprocessor.
   */
  function repairMangledInlineMath(root) {
    var nodes = Array.prototype.slice.call(root.querySelectorAll('em'));

    nodes.reverse().forEach(function (node) {
      var text = node.textContent || '';
      if (text.indexOf('$') === -1 || !node.parentNode) return;
      node.parentNode.replaceChild(document.createTextNode('_' + text + '_'), node);
    });

    root.normalize();
  }

  window.__lahavMathPrep = function () {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;

    repairMangledInlineMath(prose);

    if (typeof window.__lahavPrepareGuidedReading === 'function') {
      window.__lahavPrepareGuidedReading();
    }
  };

  window.__lahavMathPost = function () {
    document.documentElement.dataset.mathReady = 'true';
    document.dispatchEvent(new CustomEvent('lahav:math-ready'));
  };
}());
