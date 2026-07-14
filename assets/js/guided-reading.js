(() => {
  "use strict";

  const TOP_OFFSET = 150;

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
    /* Work with childNodes rather than children. Kramdown normally wraps
       display equations in paragraphs, but a few valid Markdown/HTML mixes
       leave whitespace or raw math delimiters as direct text nodes. Moving
       every node after the first h2 guarantees that MathJax cannot leave an
       equation behind at the root of .article-prose, where it would appear
       after the chapter that originally contained it. */
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
    if (!button || !toc) return;

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
    const headings = chapters.map((chapter) => chapter.querySelector(":scope > h2"));
    let ticking = false;
    let activeIndex = -1;

    const update = () => {
      ticking = false;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.transform = `scaleX(${Math.min(1, scrollTop / maxScroll)})`;

      let current = 0;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= TOP_OFFSET) current = index;
      });

      if (current === activeIndex) return;
      activeIndex = current;
      const chapter = chapters[current];
      if (!chapter) return;

      if (number) number.textContent = `§ ${chapter.dataset.chapterNumber}`;
      if (title) title.textContent = chapter.dataset.chapterTitle;

      linkMap.forEach(({ item, link }) => {
        item.classList.remove("is-current");
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });
      const active = linkMap.get(headings[current]);
      if (active) {
        active.item.classList.add("is-current");
        active.link.classList.add("is-active");
        active.link.setAttribute("aria-current", "location");
        active.item.scrollIntoView({ block: "nearest" });
      }
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();
  }

  let initialized = false;
  let scrollWired = false;

  /* DOM restructuring and TOC rendering.

     On math-heavy guided articles this deliberately runs *after* MathJax.
     MathJax records source-node ranges while it scans the document. Moving
     those nodes into chapter/subsection wrappers during the scan creates a
     timing-dependent failure in which the final SVG equation is inserted at
     the end of the chapter (sometimes after the chapter navigation) rather
     than where its delimiters appeared. Waiting for `lahav:math-ready` makes
     the typeset DOM stable before any structural move and removes that race.

     Articles without MathJax still initialize immediately. */
  function init() {
    if (initialized) return;

    const page = document.querySelector(".post-page--guided");
    const prose = page?.querySelector(".article-prose[data-reading-mode='guided']");
    if (!page || !prose) return;

    initialized = true;
    prose.dataset.guidedReady = "true";

    const internalTitle = directChildren(prose, "h1")[0];
    if (internalTitle) internalTitle.classList.add("article-internal-title");

    directChildren(prose, "hr").forEach((rule) => rule.classList.add("chapter-divider-source"));
    ensureHeadingIds(prose);
    const chapters = wrapChapters(prose);
    chapters.forEach(wrapSubsections);
    const disclosures = prepareSemanticDisclosures(prose);
    ensureHeadingIds(prose);

    const linkMap = buildToc(chapters);
    wireMobileToc();
    wirePrintDisclosureState(disclosures);

    /* Phase 2 — scroll-spy.
       Deferred until MathJax has finished so that heading
       bounding-rect offsets reflect final equation heights. Without
       this wait, the "current chapter" indicator lags behind the
       reader on pages where math pushes headings down after the
       initial render. A fallback timeout ensures the spy still wires
       up even if MathJax fails to load. */
    const wireScroll = () => {
      if (scrollWired) return;
      scrollWired = true;
      wireScrollState(chapters, linkMap);
    };

    if (document.documentElement.dataset.mathReady === "true") {
      wireScroll();
    } else if (document.getElementById("MathJax-script")) {
      document.addEventListener("lahav:math-ready", wireScroll, { once: true });
      window.setTimeout(wireScroll, 8000);
    } else {
      wireScroll();
    }
  }

  function initWhenArticleIsStable() {
    const start = () => {
      if (document.documentElement.dataset.mathReady === "true" ||
          !document.getElementById("MathJax-script")) {
        init();
        return;
      }

      document.addEventListener("lahav:math-ready", init, { once: true });
      /* A failed CDN request must not leave the page without its reading
         layout. Eight seconds matches the existing scroll-spy fallback and
         is long enough for a slow MathJax load without reintroducing the
         normal successful-load race. */
      window.setTimeout(init, 8000);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
  }

  initWhenArticleIsStable();
})();
