/**
 * MathJax preparation for article pages.
 *
 * Ownership rule:
 * - guided-reading.js constructs chapters, subsections and disclosures first;
 * - MathJax scans that final DOM once;
 * - closed disclosure bodies are excluded from the initial scan and are
 *   typeset in place when first opened;
 * - rendered MathJax nodes are never cached, cloned, wrapped or reparented.
 */
(function () {
  "use strict";

  let prepared = false;
  let copyWired = false;
  let deferredTypesetQueue = Promise.resolve();

  function articleRoot() {
    return document.querySelector(".article-prose");
  }

  function clearLegacyMathCache() {
    try {
      const prefixes = ["lahav-math-cache:", "lahav:math-cache:"];
      for (let i = sessionStorage.length - 1; i >= 0; i -= 1) {
        const key = sessionStorage.key(i) || "";
        if (prefixes.some((prefix) => key.startsWith(prefix))) {
          sessionStorage.removeItem(key);
        }
      }
    } catch (_error) {
      /* Storage can be unavailable in private/security-restricted contexts. */
    }
  }

  function repairMangledInlineMath(root) {
    const nodes = Array.from(root.querySelectorAll("em"));
    nodes.reverse().forEach((node) => {
      const text = node.textContent || "";
      if (text.indexOf("$") === -1 || !node.parentNode) return;
      node.parentNode.replaceChild(document.createTextNode(`_${text}_`), node);
    });
    root.normalize();
  }

  function hasRenderableContent(html) {
    if (!html || !html.trim()) return false;
    const template = document.createElement("template");
    template.innerHTML = html;
    if ((template.content.textContent || "").trim()) return true;
    return Boolean(
      template.content.querySelector(
        "img,svg,video,audio,iframe,object,embed,br,hr,input,button"
      )
    );
  }

  function nextDisplayDelimiter(html, from) {
    const dollar = html.indexOf("$$", from);
    const bracket = html.indexOf("\\[", from);
    if (dollar === -1 && bracket === -1) return null;
    if (dollar !== -1 && (bracket === -1 || dollar < bracket)) {
      return { index: dollar, open: "$$", close: "$$" };
    }
    return { index: bracket, open: "\\[", close: "\\]" };
  }

  function parseDisplaySegments(html) {
    const segments = [];
    let cursor = 0;
    let found = false;

    while (cursor < html.length) {
      const marker = nextDisplayDelimiter(html, cursor);
      if (!marker) {
        segments.push({ type: "text", html: html.slice(cursor) });
        break;
      }

      const end = html.indexOf(marker.close, marker.index + marker.open.length);
      if (end === -1) return null;

      found = true;
      segments.push({ type: "text", html: html.slice(cursor, marker.index) });
      segments.push({
        type: "math",
        html: html.slice(marker.index, end + marker.close.length),
      });
      cursor = end + marker.close.length;
    }

    return found ? segments : null;
  }

  function cloneParagraphShell(source, keepId) {
    const clone = source.cloneNode(false);
    if (!keepId) clone.removeAttribute("id");
    return clone;
  }

  /*
   * Kramdown can emit a display expression and neighbouring prose in one <p>.
   * Split only the raw delimiter form, before guided reading and before
   * MathJax. No rendered equation node is ever moved.
   */
  function normalizeDisplayMathBlocks(root) {
    const paragraphs = Array.from(root.querySelectorAll("p"));
    let changed = 0;

    paragraphs.forEach((paragraph) => {
      if (!paragraph.parentNode) return;
      if (paragraph.closest("pre, code, script, style, textarea")) return;

      const segments = parseDisplaySegments(paragraph.innerHTML);
      if (!segments) return;

      const meaningful = segments.filter(
        (segment) => segment.type === "math" || hasRenderableContent(segment.html)
      );
      if (!meaningful.some((segment) => segment.type === "math")) return;

      if (meaningful.length === 1 && meaningful[0].type === "math") {
        paragraph.classList.add("math-source-block");
        return;
      }

      const fragment = document.createDocumentFragment();
      let firstOutput = true;

      meaningful.forEach((segment) => {
        const block = cloneParagraphShell(paragraph, firstOutput);
        firstOutput = false;
        block.innerHTML = segment.html;
        if (segment.type === "math") block.classList.add("math-source-block");
        fragment.appendChild(block);
      });

      paragraph.parentNode.replaceChild(fragment, paragraph);
      changed += 1;
    });

    if (changed) root.dataset.mathBlocksNormalized = String(changed);
  }

  function stampMathSources(root) {
    const mathDocument = window.MathJax?.startup?.document;
    if (!root || !mathDocument?.math?.toArray) return;

    mathDocument.math.toArray().forEach((item) => {
      const container = item.typesetRoot;
      if (!container || typeof item.math !== "string") return;
      if (container !== root && !root.contains(container)) return;
      container.dataset.tex = item.math;
      container.dataset.copyMath = "true";
      container.setAttribute("tabindex", "0");
      container.setAttribute("role", "button");
      container.setAttribute("aria-label", "Copy formula TeX source");
      container.setAttribute("title", "click to copy TeX");
    });
  }

  async function copyMath(container) {
    const tex = container?.dataset?.tex;
    if (!tex) return;
    const display = container.getAttribute("display") === "true";
    const source = display ? `$$\n${tex}\n$$` : `$${tex}$`;
    try {
      await navigator.clipboard.writeText(source);
      container.dataset.copied = "true";
      window.setTimeout(() => delete container.dataset.copied, 900);
    } catch (_error) {
      /* Clipboard permission can be denied; leave the equation untouched. */
    }
  }

  function wireMathCopy() {
    if (copyWired) return;
    copyWired = true;

    document.addEventListener("click", (event) => {
      const container = event.target.closest?.("mjx-container[data-copy-math='true']");
      if (container) copyMath(container);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const container = event.target.closest?.("mjx-container[data-copy-math='true']");
      if (!container) return;
      event.preventDefault();
      copyMath(container);
    });
  }

  function decorateMathRoot(root) {
    stampMathSources(root);
    wireMathCopy();
  }

  function waitForInitialMathJax() {
    const promise = window.MathJax?.startup?.promise;
    if (promise && typeof promise.then === "function") return promise;
    if (window.MathJax?.typesetPromise) return Promise.resolve();
    return new Promise((resolve) => {
      document.addEventListener("lahav:math-ready", resolve, { once: true });
    });
  }

  window.__lahavTypesetDeferredMath = function (root) {
    if (!root) return Promise.resolve();

    deferredTypesetQueue = deferredTypesetQueue
      .catch(() => {})
      .then(waitForInitialMathJax)
      .then(() => {
        root.classList.remove("tex2jax_ignore");
        root.classList.add("tex2jax_process");
        if (!window.MathJax?.typesetPromise) return undefined;
        return window.MathJax.typesetPromise([root]);
      })
      .then(() => {
        root.classList.remove("tex2jax_process");
        decorateMathRoot(root);
        document.dispatchEvent(
          new CustomEvent("lahav:deferred-math-ready", { detail: { root } })
        );
      });

    return deferredTypesetQueue;
  };

  window.__lahavDecorateMath = decorateMathRoot;

  window.__lahavMathPrep = function () {
    if (prepared) return;
    prepared = true;

    clearLegacyMathCache();
    const prose = articleRoot();
    if (!prose) return;

    repairMangledInlineMath(prose);
    normalizeDisplayMathBlocks(prose);

    if (typeof window.__lahavPrepareGuidedReading === "function") {
      window.__lahavPrepareGuidedReading();
    }
  };

  window.__lahavMathPost = function () {
    const prose = articleRoot();
    if (prose) decorateMathRoot(prose);
    document.documentElement.dataset.mathReady = "true";
    document.dispatchEvent(new CustomEvent("lahav:math-ready"));
  };
})();
