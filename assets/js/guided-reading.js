/**
 * Guided reading for long-form posts.
 *
 * The authored article remains the source of truth. This script derives only
 * semantic reading structure from existing headings and explicit fold markers.
 * It does not inspect, move, cache, or typeset MathJax output.
 */
(function () {
  'use strict';

  var TOP_OFFSET = 150;
  var DESKTOP_RAIL_QUERY = '(min-width: 1121px)';

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';
  }

  function uniqueId(base, used) {
    var candidate = base;
    var suffix = 2;
    while (used.has(candidate)) candidate = base + '-' + suffix++;
    used.add(candidate);
    return candidate;
  }

  function directChildren(root, selector) {
    return Array.prototype.filter.call(root.children, function (child) {
      return child.matches(selector);
    });
  }

  function isHeading(node, selector) {
    return node.nodeType === Node.ELEMENT_NODE && node.matches(selector);
  }

  function parseChapterHeading(heading, index) {
    var text = (heading.textContent || '').trim();
    var match = text.match(/^§\s*([^\.\s]+(?:\.[^\.\s]+)*)\.?\s*(.*)$/);

    return {
      number: match ? match[1] : String(index + 1),
      title: match && match[2] ? match[2] : text
    };
  }

  function formatChapterHeading(heading, chapter) {
    heading.textContent = '';

    var number = document.createElement('span');
    number.className = 'chapter-heading__number';
    number.textContent = '§ ' + chapter.number;

    var title = document.createElement('span');
    title.className = 'chapter-heading__title';
    title.textContent = chapter.title;

    heading.append(number, title);
  }

  /**
   * Regrouping a range of siblings must relocate every node in that range.
   * Iterating `children` would carry the elements into the new wrapper and
   * abandon every text node between them at its original depth, which is how
   * display equations came to sit after the subsection they belong to.
   */
  function wrapSubsections(chapter) {
    var nodes = Array.prototype.slice.call(chapter.childNodes);
    var current = null;
    var subsections = [];

    nodes.forEach(function (node) {
      if (isHeading(node, 'h3')) {
        current = document.createElement('section');
        current.className = 'article-subsection';
        chapter.insertBefore(current, node);
        subsections.push(current);
      }

      if (current) current.appendChild(node);
    });

    return subsections;
  }

  /**
   * Construct the complete hierarchy in a detached fragment, then commit once.
   * MathJax has not typeset yet, so no rendered equation node can be displaced.
   */
  function buildGuidedStructure(prose) {
    var source = document.createDocumentFragment();
    source.append.apply(source, Array.prototype.slice.call(prose.childNodes));

    var output = document.createDocumentFragment();
    var chapters = [];
    var currentChapter = null;

    Array.prototype.slice.call(source.childNodes).forEach(function (node) {
      if (isHeading(node, 'h2')) {
        currentChapter = document.createElement('section');
        currentChapter.className = 'article-chapter';
        currentChapter.appendChild(node);
        chapters.push(currentChapter);
        output.appendChild(currentChapter);
      } else if (currentChapter) {
        currentChapter.appendChild(node);
      } else {
        output.appendChild(node);
      }
    });

    chapters.forEach(function (chapter, index) {
      var heading = chapter.querySelector(':scope > h2');
      if (!heading) return;

      var parsed = parseChapterHeading(heading, index);
      chapter.dataset.chapterNumber = parsed.number;
      chapter.dataset.chapterTitle = parsed.title;
      formatChapterHeading(heading, parsed);

      var subsections = wrapSubsections(chapter);
      var firstParagraph = Array.prototype.find.call(chapter.children, function (node) {
        return node.matches('p');
      });
      if (firstParagraph) firstParagraph.classList.add('chapter-lead');

      subsections.forEach(function (subsection) {
        var subheading = subsection.querySelector(':scope > h3');
        if (subheading) subheading.dataset.guidedSubsection = 'true';
      });
    });

    return { output: output, chapters: chapters };
  }

  function makeDisclosureSummary(label, tone) {
    var summary = document.createElement('summary');
    summary.className = 'guided-disclosure__summary';

    var icon = document.createElement('span');
    icon.className = 'guided-disclosure__icon';
    icon.setAttribute('aria-hidden', 'true');

    var title = document.createElement('span');
    title.className = 'guided-disclosure__label';
    title.textContent = label;

    var hint = document.createElement('span');
    hint.className = 'guided-disclosure__hint';
    hint.textContent = tone === 'proof' ? 'proof' : 'derivation';

    summary.append(icon, title, hint);
    return summary;
  }

  function prepareSemanticDisclosures(prose) {
    var disclosures = [];
    var starts = Array.prototype.slice.call(
      prose.querySelectorAll('.guided-fold-start')
    );

    starts.forEach(function (start) {
      if (!start.parentNode) return;

      var parent = start.parentNode;
      var end = start.nextElementSibling;
      while (end && !end.classList.contains('guided-fold-end')) {
        end = end.nextElementSibling;
      }
      if (!end || end.parentNode !== parent) return;

      var tone = start.dataset.tone === 'proof' ? 'proof' : 'derivation';
      var label = start.dataset.label ||
        (tone === 'proof' ? 'Supporting proof' : 'Supporting derivation');

      var details = document.createElement('details');
      details.className = 'guided-disclosure guided-disclosure--' + tone;
      if (start.dataset.open === 'true') details.open = true;

      var body = document.createElement('div');
      body.className = 'guided-disclosure__body';

      details.append(makeDisclosureSummary(label, tone), body);
      parent.insertBefore(details, start);

      var node = start.nextSibling;
      while (node && node !== end) {
        var next = node.nextSibling;
        body.appendChild(node);
        node = next;
      }

      start.remove();
      end.remove();
      disclosures.push(details);
    });

    return disclosures;
  }

  function ensureHeadingIds(prose) {
    var used = new Set();

    prose.querySelectorAll('[id]').forEach(function (node) {
      if (node.id) used.add(node.id);
    });

    prose.querySelectorAll('h2, h3, h4').forEach(function (heading) {
      if (heading.id) return;
      heading.id = uniqueId(slugify(heading.textContent), used);
    });
  }

  function addTocLink(list, heading, className, number) {
    var item = document.createElement('li');
    item.className = className;
    if (number) item.dataset.chapterNumber = number;

    var link = document.createElement('a');
    link.className = 'post-toc__link';
    link.href = '#' + heading.id;
    link.textContent = heading.textContent.trim();

    item.appendChild(link);
    list.appendChild(item);
    return { item: item, link: link };
  }

  function buildToc(chapters) {
    var list = document.querySelector('#post-toc-list');
    var toc = document.querySelector('#post-toc');
    var linkMap = new Map();

    if (!list || !toc) return linkMap;
    list.textContent = '';

    chapters.forEach(function (chapter) {
      var heading = chapter.querySelector(':scope > h2');
      if (!heading) return;

      var top = addTocLink(
        list,
        heading,
        'post-toc__item post-toc__item--top',
        chapter.dataset.chapterNumber
      );
      top.link.textContent = chapter.dataset.chapterTitle || heading.textContent.trim();
      linkMap.set(heading, top);

      var subheadings = chapter.querySelectorAll('.article-subsection > h3');
      if (!subheadings.length) return;

      var sublist = document.createElement('ol');
      sublist.className = 'post-toc__sublist';
      top.item.appendChild(sublist);

      subheadings.forEach(function (subheading) {
        var sub = addTocLink(
          sublist,
          subheading,
          'post-toc__item post-toc__item--sub'
        );
        linkMap.set(subheading, sub);
      });
    });

    toc.dataset.tocReady = 'true';
    return linkMap;
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

  function wirePrintDisclosureState(disclosures) {
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

  function wireScrollState(chapters, linkMap) {
    var progress = document.querySelector('.reading-progress > span');
    var number = document.querySelector('.reading-status__number');
    var title = document.querySelector('.reading-status__title');
    var headings = chapters
      .map(function (chapter) { return chapter.querySelector(':scope > h2'); })
      .filter(Boolean);

    var offsets = [];
    var activeIndex = -1;
    var ticking = false;
    var needsMeasure = true;

    function measure() {
      offsets = headings.map(function (heading) {
        return heading.getBoundingClientRect().top + window.scrollY;
      });
      needsMeasure = false;
    }

    function currentHeadingIndex(scrollTop) {
      var index = 0;
      for (var i = 0; i < offsets.length; i += 1) {
        if (offsets[i] <= scrollTop + TOP_OFFSET) index = i;
        else break;
      }
      return index;
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

      if (!headings.length) return;
      var current = currentHeadingIndex(scrollTop);
      if (current === activeIndex) return;
      activeIndex = current;

      var chapter = chapters[current];
      if (!chapter) return;

      if (number) number.textContent = '§ ' + chapter.dataset.chapterNumber;
      if (title) title.textContent = chapter.dataset.chapterTitle;

      linkMap.forEach(function (entry) {
        entry.item.classList.remove('is-current');
        entry.link.classList.remove('is-active');
        entry.link.removeAttribute('aria-current');
      });

      var active = linkMap.get(headings[current]);
      if (!active) return;

      active.item.classList.add('is-current');
      active.link.classList.add('is-active');
      active.link.setAttribute('aria-current', 'location');

      if (window.matchMedia(DESKTOP_RAIL_QUERY).matches) {
        active.item.scrollIntoView({ block: 'nearest' });
      }
    }

    function requestUpdate(remeasure) {
      if (remeasure) needsMeasure = true;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', function () { requestUpdate(false); }, { passive: true });
    window.addEventListener('resize', function () { requestUpdate(true); }, { passive: true });
    document.addEventListener('lahav:math-ready', function () { requestUpdate(true); });
    document.addEventListener('lahav:visualization-resize', function () { requestUpdate(true); });
    document.addEventListener('toggle', function (event) {
      if (event.target.matches('.guided-disclosure')) requestUpdate(true);
    }, true);

    requestUpdate(true);
  }

  function prepareGuidedReading() {
    var page = document.querySelector('.post-page--guided');
    var prose = page && page.querySelector('.article-prose[data-reading-mode="guided"]');
    if (!prose) return;

    var internalTitle = directChildren(prose, 'h1')[0];
    if (internalTitle) internalTitle.classList.add('article-internal-title');

    directChildren(prose, 'hr').forEach(function (rule) {
      rule.classList.add('chapter-divider-source');
    });

    var structure = buildGuidedStructure(prose);
    prose.replaceChildren(structure.output);

    var disclosures = prepareSemanticDisclosures(prose);
    ensureHeadingIds(prose);

    var linkMap = buildToc(structure.chapters);
    wireMobileToc();
    wirePrintDisclosureState(disclosures);
    wireScrollState(structure.chapters, linkMap);

    document.dispatchEvent(new CustomEvent('lahav:guided-ready'));
  }

  /**
   * Restructuring has to happen before MathJax scans the article, so on a page
   * that loads MathJax its startup calls this and owns the ordering. Deferred
   * scripts run after parsing, so the tag is present here exactly when the
   * layout emitted it.
   */
  window.__lahavPrepareGuidedReading = prepareGuidedReading;

  if (!document.getElementById('MathJax-script')) {
    document.addEventListener('DOMContentLoaded', prepareGuidedReading, { once: true });
  }
}());
