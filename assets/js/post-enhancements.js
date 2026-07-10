(function () {
  'use strict';

  function initTableOfContents() {
    var nav = document.getElementById('post-toc');
    if (!nav || !nav.hasAttribute('data-toc-ready')) return;

    var links = Array.prototype.slice.call(
      nav.querySelectorAll('.post-toc__link[href^="#"]')
    );

    var entries = links.map(function (link) {
      var rawId = link.getAttribute('href').slice(1);
      var id;
      try {
        id = decodeURIComponent(rawId);
      } catch (_error) {
        id = rawId;
      }
      return { link: link, heading: document.getElementById(id) };
    }).filter(function (entry) {
      return Boolean(entry.heading);
    });

    if (!entries.length) return;

    var offsets = [];
    var activeIndex = -1;
    var scrollFrame = 0;
    var measureFrame = 0;
    var headerOffset = 96;

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

    function updateActiveHeading() {
      scrollFrame = 0;
      if (!offsets.length) return;

      var target = window.scrollY + headerOffset;
      var low = 0;
      var high = offsets.length - 1;
      var chosen = 0;

      while (low <= high) {
        var middle = (low + high) >> 1;
        if (offsets[middle] <= target) {
          chosen = middle;
          low = middle + 1;
        } else {
          high = middle - 1;
        }
      }

      setActive(chosen);
    }

    function scheduleUpdate() {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateActiveHeading);
    }

    function measureHeadings() {
      measureFrame = 0;
      offsets = entries.map(function (entry) {
        return entry.heading.getBoundingClientRect().top + window.scrollY;
      });
      updateActiveHeading();
    }

    function scheduleMeasure() {
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(measureHeadings);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('load', scheduleMeasure, { once: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleMeasure).catch(function () {});
    }

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        window.setTimeout(scheduleMeasure, 350);
      });
    });

    measureHeadings();
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
    return copied;
  }

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function showCopiedState(target) {
    if (!target) return;

    var oldLabel = target.textContent;
    target.classList.add('is-copied');

    if (target.matches('[data-copy-math-button]')) {
      target.textContent = 'copied';
    }

    window.setTimeout(function () {
      target.classList.remove('is-copied');
      if (target.matches('[data-copy-math-button]')) {
        target.textContent = oldLabel;
      }
    }, 1200);
  }

  function copyFormula(container, feedbackTarget) {
    if (!container) return;
    var tex = container.getAttribute('data-tex');
    if (!tex) return;

    writeClipboard(tex).then(function (copied) {
      if (copied) showCopiedState(feedbackTarget || container);
    });
  }

  function initFormulaCopying() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-copy-math-button]');
      if (button) {
        var shell = button.closest('.math-copy-shell');
        copyFormula(shell && shell.querySelector('mjx-container[data-tex]'), button);
        return;
      }

      var inlineFormula = event.target.closest(
        'mjx-container[data-copy-math-inline][data-tex]'
      );
      if (!inlineFormula) return;

      var selection = window.getSelection && window.getSelection();
      if (selection && String(selection).trim()) return;
      copyFormula(inlineFormula, inlineFormula);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var formula = event.target.closest(
        'mjx-container[data-copy-math-inline][data-tex]'
      );
      if (!formula) return;
      event.preventDefault();
      copyFormula(formula, formula);
    });
  }

  initTableOfContents();
  initFormulaCopying();
}());
