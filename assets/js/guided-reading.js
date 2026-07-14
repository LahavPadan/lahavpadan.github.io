(() => {
  "use strict";

  const TOP_OFFSET = 150;
  const DESKTOP_RAIL_QUERY = "(min-width: 1121px)";

  const slugify = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "section";

  const uniqueId = (base, used) => {
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate)) candidate = `${base}-${suffix++}`;
    used.add(candidate);
    return candidate;
  };

  const directChildren = (element, selector) =>
    Array.from(element.children).filter((child) => child.matches(selector));

  function parseChapterHeading(heading, fallbackIndex) {
    const original = heading.textContent.trim();
    const match = original.match(/^§\s*([0-9]+[A-Z]?)\.\s*(.+)$/i);
    const number = match ? match[1] : String(fallbackIndex + 1);
    const title = match ? match[2] : original;

    heading.dataset.originalTitle = original;
    heading.dataset.chapterNumber = number;
    heading.dataset.chapterTitle = title;
    heading.textContent = "";

    const numberNode = document.createElement("span");
    numberNode.className = "chapter-heading__number";
    numberNode.textContent = `§ ${number}`;

    const titleNode = document.createElement("span");
    titleNode.className = "chapter-heading__title";
    titleNode.textContent = title;

    heading.append(numberNode, titleNode);
    return { number, title };
  }

  function wrapChapters(prose) {
    /* This runs before MathJax scans the page. Moving the source nodes first
       removes the race that previously left a typeset equation at the end of
       the article, while still allowing the guided layout to appear at once. */
    const children = Array.from(prose.childNodes);
    const chapters = [];
    let currentChapter = null;

    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE && child.matches("h2")) {
        currentChapter = document.createElement("section");
        currentChapter.className = "article-chapter";
        child.before(currentChapter);
        chapters.push(currentChapter);
      }
      if (currentChapter) currentChapter.append(child);
    });

    chapters.forEach((chapter, index) => {
      const heading = directChildren(chapter, "h2")[0];
      if (!heading) return;

      const meta = parseChapterHeading(heading, index);
      chapter.dataset.chapterNumber = meta.number;
      chapter.dataset.chapterTitle = meta.title;

      const firstParagraph = directChildren(chapter, "p")[0];
      if (firstParagraph) firstParagraph.classList.add("chapter-lead");
    });

    return chapters;
  }

  function wrapSubsections(chapter) {
    const children = Array.from(chapter.children);
    const subsections = [];
    let current = null;

    children.forEach((child) => {
      if (child.matches("h3")) {
        current = document.createElement("section");
        current.className = "article-subsection";
        child.before(current);
        subsections.push(current);
      }
      if (current) current.append(child);
    });

    return subsections;
  }

  function prepareSemanticDisclosures(prose) {
    const disclosures = [];
    const starts = Array.from(prose.querySelectorAll(".guided-fold-start"));

    starts.forEach((start, index) => {
      const parent = start.parentElement;
      if (!parent) return;

      let end = start.nextElementSibling;
      while (end && !end.classList.contains("guided-fold-end")) {
        end = end.nextElementSibling;
      }
      if (!end || end.parentElement !== parent) return;

      const details = document.createElement("details");
      const tone = start.dataset.tone || "supporting";
      details.className = `guided-disclosure guided-disclosure--${tone}`;
      details.id = `supporting-detail-${index + 1}`;
      details.open = start.dataset.open === "true";

      const summary = document.createElement("summary");
      summary.className = "guided-disclosure__summary";

      const icon = document.createElement("span");
      icon.className = "guided-disclosure__icon";
      icon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "guided-disclosure__label";
      label.textContent = start.dataset.label || "Supporting detail";

      const hint = document.createElement("span");
      hint.className = "guided-disclosure__hint";
      hint.textContent = tone === "proof" ? "proof detail" : "supporting derivation";

      summary.append(icon, label, hint);

      const body = document.createElement("div");
      body.className = "guided-disclosure__body";

      let node = start.nextSibling;
      while (node && node !== end) {
        const next = node.nextSibling;
        body.append(node);
        node = next;
      }

      details.append(summary, body);
      details.addEventListener("toggle", () => {
        if (details.open && window.MathJax?.typesetPromise) {
          window.MathJax.typesetPromise([details]).catch(() => {});
        }
      });
      start.replaceWith(details);
      end.remove();
      disclosures.push(details);
    });

    prose.querySelectorAll(".guided-fold-start, .guided-fold-end").forEach((marker) => marker.remove());
    return disclosures;
  }

  function ensureHeadingIds(prose) {
    const used = new Set();
    prose.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      const current = heading.id || slugify(heading.textContent);
      heading.id = uniqueId(current, used);
    });
  }

  function buildToc(chapters) {
    const toc = document.getElementById("post-toc");
    const list = document.getElementById("post-toc-list");
    if (!toc || !list) return new Map();

    list.textContent = "";
    const linkMap = new Map();

    chapters.forEach((chapter) => {
      const h2 = chapter.querySelector(":scope > h2");
      if (!h2) return;

      const item = document.createElement("li");
      item.className = "post-toc__item post-toc__item--top";
      item.dataset.chapterNumber = chapter.dataset.chapterNumber;

      const link = document.createElement("a");
      link.className = "post-toc__link";
      link.href = `#${h2.id}`;
      link.textContent = chapter.dataset.chapterTitle;
      item.append(link);
      linkMap.set(h2, { item, link });

      const h3s = chapter.querySelectorAll(":scope > .article-subsection > h3");
      if (h3s.length) {
        const sublist = document.createElement("ol");
        sublist.className = "post-toc__sublist";
        h3s.forEach((h3) => {
          const subitem = document.createElement("li");
          subitem.className = "post-toc__item post-toc__item--sub";
          const sublink = document.createElement("a");
          sublink.className = "post-toc__link";
          sublink.href = `#${h3.id}`;
          sublink.textContent = h3.textContent.trim();
          subitem.append(sublink);
          sublist.append(subitem);
          linkMap.set(h3, { item: subitem, link: sublink });
        });
        item.append(sublist);
      }
      list.append(item);
    });

    toc.hidden = false;
    toc.dataset.tocReady = "true";
    return linkMap;
  }

  function wireMobileToc() {
    const button = document.querySelector(".post-toc-toggle");
    const toc = document.getElementById("post-toc");
    if (!button || !toc || button.dataset.tocWired === "true") return;
    button.dataset.tocWired = "true";

    const close = () => {
      button.setAttribute("aria-expanded", "false");
      toc.classList.remove("is-open");
    };

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      toc.classList.toggle("is-open", open);
    });
    toc.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
  }

  function wirePrintDisclosureState(disclosures) {
    let previousState = [];
    window.addEventListener("beforeprint", () => {
      previousState = disclosures.map((details) => details.open);
      disclosures.forEach((details) => {
        details.open = true;
      });
    });
    window.addEventListener("afterprint", () => {
      disclosures.forEach((details, index) => {
        details.open = previousState[index] ?? false;
      });
    });
  }

  function wireScrollState(chapters, linkMap) {
    const progress = document.querySelector(".reading-progress > span");
    const number = document.querySelector(".reading-status__number");
    const title = document.querySelector(".reading-status__title");
    const headings = chapters
      .map((chapter) => chapter.querySelector(":scope > h2"))
      .filter(Boolean);

    let offsets = [];
    let activeIndex = -1;
    let activeToc = null;
    let updateFrame = 0;
    let measureFrame = 0;

    const locateChapter = (position) => {
      let low = 0;
      let high = offsets.length - 1;
      let result = 0;
      while (low <= high) {
        const middle = (low + high) >> 1;
        if (offsets[middle] <= position) {
          result = middle;
          low = middle + 1;
        } else {
          high = middle - 1;
        }
      }
      return result;
    };

    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;

      const chapter = chapters[index];
      if (!chapter) return;
      if (number) number.textContent = `§ ${chapter.dataset.chapterNumber}`;
      if (title) title.textContent = chapter.dataset.chapterTitle;

      if (activeToc) {
        activeToc.item.classList.remove("is-current");
        activeToc.link.classList.remove("is-active");
        activeToc.link.removeAttribute("aria-current");
      }

      activeToc = linkMap.get(headings[index]) || null;
      if (!activeToc) return;
      activeToc.item.classList.add("is-current");
      activeToc.link.classList.add("is-active");
      activeToc.link.setAttribute("aria-current", "location");

      if (window.matchMedia(DESKTOP_RAIL_QUERY).matches) {
        activeToc.item.scrollIntoView({ block: "nearest" });
      }
    };

    const update = () => {
      updateFrame = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.transform = `scaleX(${Math.min(1, scrollTop / maxScroll)})`;
      if (offsets.length) setActive(locateChapter(scrollTop + TOP_OFFSET));
    };

    const requestUpdate = () => {
      if (!updateFrame) updateFrame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      measureFrame = 0;
      offsets = headings.map((heading) => heading.getBoundingClientRect().top + window.scrollY);
      update();
    };

    const requestMeasure = () => {
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestMeasure, { passive: true });
    window.addEventListener("load", requestMeasure, { once: true });
    document.addEventListener("lahav:math-ready", requestMeasure, { once: true });
    document.addEventListener("lahav:visualization-resize", requestMeasure);
    if (document.fonts?.ready) document.fonts.ready.then(requestMeasure).catch(() => {});

    measure();
  }

  let preparedState = null;
  let interactionsWired = false;

  function prepareGuidedReading() {
    if (preparedState) return preparedState;

    const page = document.querySelector(".post-page--guided");
    const prose = page?.querySelector(".article-prose[data-reading-mode='guided']");
    if (!page || !prose) return null;

    const internalTitle = directChildren(prose, "h1")[0];
    if (internalTitle) internalTitle.classList.add("article-internal-title");

    directChildren(prose, "hr").forEach((rule) => rule.classList.add("chapter-divider-source"));
    ensureHeadingIds(prose);
    const chapters = wrapChapters(prose);
    chapters.forEach(wrapSubsections);
    const disclosures = prepareSemanticDisclosures(prose);
    ensureHeadingIds(prose);
    const linkMap = buildToc(chapters);

    prose.dataset.guidedReady = "true";
    preparedState = { page, prose, chapters, disclosures, linkMap };

    /* Make the fast structural pass observable to MathJax and to any article
       enhancement that needs the final chapter containers. */
    document.dispatchEvent(new CustomEvent("lahav:guided-ready"));
    return preparedState;
  }

  function wireInteractions() {
    if (interactionsWired) return;
    const state = prepareGuidedReading();
    if (!state) return;
    interactionsWired = true;

    wireMobileToc();
    wirePrintDisclosureState(state.disclosures);
    wireScrollState(state.chapters, state.linkMap);
  }

  /* MathJax calls this during its pre-scan hook. That guarantees all chapter,
     subsection, and disclosure moves finish before MathJax records source
     ranges, so there is no equation-placement race and no need to hide the
     guided layout until typesetting completes. */
  window.__lahavPrepareGuidedReading = function () {
    const state = prepareGuidedReading();
    wireInteractions();
    return state;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireInteractions, { once: true });
  } else {
    wireInteractions();
  }
})();
