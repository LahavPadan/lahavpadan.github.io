/**
 * Runtime shared by every embedded visualization.
 *
 * A visualization is a self-contained document shown in an iframe. Two things,
 * and only two, have to cross the frame boundary: the reader's theme, which the
 * page owns and can change at any time, and the document's height, which only
 * the frame can measure. Each visualization used to carry its own copy of this
 * logic, and the copies had drifted — a dozen different message shapes, three
 * ways of reading the theme. This is the single implementation they now share,
 * so a diagram's own script holds only what draws the diagram.
 *
 * Theme is applied by mirroring the page's choice onto this document's root and
 * letting this document's stylesheet repaint. The page is read directly when
 * the frame is same-origin, and accepted as a message when it is not, so the
 * frame follows the page in either case and never has colours pushed into it.
 *
 * Height is reported as one message whenever the content resizes — after fonts
 * load, after math is typeset, after an interactive control runs — coalesced to
 * one send per frame.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  // -- theme ----------------------------------------------------------------

  function setTheme(theme) {
    var current = root.dataset.theme;
    if (theme === 'dark' || theme === 'light') {
      if (current === theme) return;
      root.dataset.theme = theme;
    } else {
      if (current == null) return;
      delete root.dataset.theme;
    }
  }

  function parentRoot() {
    try {
      return window.parent && window.parent !== window
        ? window.parent.document.documentElement
        : null;
    } catch (_crossOrigin) {
      return null;
    }
  }

  // Same-origin: read the page's theme now and follow it as it changes.
  function observeParentTheme() {
    var source = parentRoot();
    if (!source) return false;

    var apply = function () { setTheme(source.dataset.theme); };
    apply();
    if (window.MutationObserver) {
      new MutationObserver(apply).observe(source, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
    return true;
  }

  // Cross-origin fallback: the page cannot be read, so it tells us instead.
  function listenForTheme() {
    window.addEventListener('message', function (event) {
      if (event.source !== window.parent) return;
      var data = event.data;
      if (data && typeof data === 'object' && 'theme' in data) setTheme(data.theme);
    });
  }

  // -- height ---------------------------------------------------------------

  var pending = false;

  function reportHeight() {
    pending = false;
    var height = Math.ceil(Math.max(
      root.scrollHeight, root.offsetHeight,
      document.body ? document.body.scrollHeight : 0,
      document.body ? document.body.offsetHeight : 0
    ));
    if (!height || window.parent === window) return;
    try {
      window.parent.postMessage({ visualizationHeight: height }, window.location.origin);
    } catch (_blocked) { /* the parent will measure on load instead */ }
  }

  function scheduleReport() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(reportHeight);
  }

  function watchHeight() {
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(scheduleReport);
      observer.observe(root);
      if (document.body) observer.observe(document.body);
    } else {
      window.addEventListener('resize', scheduleReport, { passive: true });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleReport).catch(function () {});
    }
    // Diagrams that typeset math announce it so the new height is picked up.
    document.addEventListener('visualization:content-changed', scheduleReport);
  }

  // -- start ----------------------------------------------------------------

  function start() {
    if (!observeParentTheme()) listenForTheme();
    watchHeight();
    scheduleReport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}());
