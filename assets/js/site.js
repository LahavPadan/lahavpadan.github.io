/**
 * Site-wide chrome. The only behaviour every page shares is the colour-theme
 * toggle; the initial theme is already resolved in the document head before
 * first paint, so this just handles the button and remembers the choice.
 *
 * The posts index carries its own search and tag filtering inline, next to the
 * markup it drives.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  function reflectState() {
    var isDark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Use light theme' : 'Use dark theme');
  }

  reflectState();

  toggle.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (_blocked) {}
    reflectState();
  });
}());
