/**
 * Reading behaviour for articles.
 *
 * The article arrives already sectioned and its contents list already built,
 * so nothing here constructs or moves anything. What remains is the part that
 * cannot exist until there is a viewport: where the reader is, and what the
 * navigation should say about it.
 */
(function () {
  'use strict';

  var TOP_OFFSET = 150;
  var DESKTOP_RAIL_QUERY = '(min-width: 1121px)';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function tocLink(id) {
    if (!id) return null;
    return document.querySelector('.post-toc__link[href="#' + CSS.escape(id) + '"]');
  }

  /**
   * In-page navigation without a growing history stack.
   *
   * A long article holds hundreds of anchor links — every contents entry and
   * every cross-reference. Followed with their default behaviour, each one
   * pushes a history entry, so leaving the article means pressing Back once per
   * section visited instead of once. Here a click scrolls to the target and
   * rewrites the current entry's URL, so the section stays shareable but Back
   * returns to whatever came before the article. The scroll itself is a short,
   * quiet ease, and is skipped entirely when the reader asks for reduced motion.
   */
  function wireInPageLinks() {
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', '#' + id);
    });
  }

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.scrollY - TOP_OFFSET + 8;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
    // Move focus for keyboard and screen-reader users without a second jump.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  function wireMobileToc() {
    var button = document.querySelector('.post-toc-toggle');
    var toc = document.querySelector('#post-toc');
    if (!button || !toc) return;

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      toc.classList.toggle('is-open', open);
    }

    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    toc.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest('.post-reading-rail')) return;
      setOpen(false);
    });
  }

  /**
   * A closed disclosure prints as its summary alone, which loses the
   * derivation it stands for. Printing opens every one and puts them back.
   */
  function wirePrintDisclosureState() {
    var disclosures = Array.prototype.slice.call(
      document.querySelectorAll('.guided-disclosure')
    );
    if (!disclosures.length) return;

    var previousState = [];

    window.addEventListener('beforeprint', function () {
      previousState = disclosures.map(function (details) { return details.open; });
      disclosures.forEach(function (details) { details.open = true; });
    });

    window.addEventListener('afterprint', function () {
      disclosures.forEach(function (details, index) {
        details.open = Boolean(previousState[index]);
      });
    });
  }

  function wireScrollState(chapters) {
    var progress = document.querySelector('.reading-progress > span');
    var number = document.querySelector('.reading-status__number');
    var title = document.querySelector('.reading-status__title');

    var headings = chapters.map(function (chapter) {
      return chapter.querySelector(':scope > h2');
    });
    var links = headings.map(function (heading) {
      return heading && tocLink(heading.id);
    });

    var offsets = [];
    var activeIndex = -1;
    var ticking = false;
    var needsMeasure = true;
    var desktopRail = window.matchMedia(DESKTOP_RAIL_QUERY);
    var activeLink = null;

    function measure() {
      offsets = headings.map(function (heading) {
        return heading ? heading.getBoundingClientRect().top + window.scrollY : Infinity;
      });
      needsMeasure = false;
    }

    function currentIndex(scrollTop) {
      var index = 0;
      for (var i = 0; i < offsets.length; i += 1) {
        if (offsets[i] <= scrollTop + TOP_OFFSET) index = i;
        else break;
      }
      return index;
    }

    function highlight(index) {
      var link = links[index] || null;
      if (link === activeLink) return;

      if (activeLink) {
        activeLink.classList.remove('is-active');
        activeLink.removeAttribute('aria-current');
        activeLink.parentElement.classList.remove('is-current');
      }
      activeLink = link;
      if (!link) return;

      link.classList.add('is-active');
      link.setAttribute('aria-current', 'location');
      link.parentElement.classList.add('is-current');

      if (desktopRail.matches) {
        link.parentElement.scrollIntoView({ block: 'nearest' });
      }
    }

    function update() {
      ticking = false;
      if (needsMeasure) measure();

      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      if (progress) {
        progress.style.transform = 'scaleX(' + Math.min(1, scrollTop / maxScroll) + ')';
      }

      var index = currentIndex(scrollTop);
      if (index === activeIndex) return;
      activeIndex = index;

      var chapter = chapters[index];
      if (number) number.textContent = '§ ' + chapter.dataset.chapterNumber;
      if (title) title.textContent = chapter.dataset.chapterTitle;
      highlight(index);
    }

    function requestUpdate(remeasure) {
      if (remeasure) needsMeasure = true;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', function () { requestUpdate(false); }, { passive: true });
    window.addEventListener('resize', function () { requestUpdate(true); }, { passive: true });

    // Typesetting and resizing change where every chapter starts.
    document.addEventListener('lahav:math-ready', function () { requestUpdate(true); });
    document.addEventListener('lahav:visualization-resize', function () { requestUpdate(true); });
    document.addEventListener('toggle', function (event) {
      if (event.target.matches('.guided-disclosure')) requestUpdate(true);
    }, true);

    requestUpdate(true);
  }

  function init() {
    var chapters = Array.prototype.slice.call(
      document.querySelectorAll('.article-chapter')
    );

    wireMobileToc();
    wireInPageLinks();
    wirePrintDisclosureState();
    if (chapters.length) wireScrollState(chapters);
  }

  document.addEventListener('DOMContentLoaded', init, { once: true });
}());
