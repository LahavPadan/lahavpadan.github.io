'use strict';

/**
 * Post-build processing of the generated site.
 *
 * The site is served as static files, yet its mathematics was typeset in the
 * reader's browser: every page pulled the MathJax engine from a CDN and ran it
 * on load, and a long article kept the reader waiting while a hundred and fifty
 * equations were laid out one by one. An article and its embedded diagrams are
 * separate documents, so a single post paid that cost many times over.
 *
 * None of that work depends on the reader. The expressions are fixed once the
 * site is built, so they are rendered here, once, into the SVG the browser
 * would have produced — and the engine is dropped from the pages that only ever
 * needed it for this. What arrives is final: the mathematics is painted with
 * the first frame and never reflows. The few diagrams that retypeset a label as
 * the reader drags a control keep the engine, since their mathematics is not
 * fixed.
 *
 * The renderer is MathJax itself, run over the built HTML, so the output is the
 * same geometry the browser used to compute. Expressions are read only from
 * text — never from script or style, never from an attribute — matched by the
 * same `\(…\)` and `\[…\]` delimiters the pages were authored with,
 * deduplicated within a page, and replaced in place.
 */

const fs = require('fs/promises');
const path = require('path');

const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

// -- MathJax -----------------------------------------------------------------

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathDocument = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages, inlineMath: [], displayMath: [] }),
  OutputJax: new SVG({ fontCache: 'local' })
});

function renderExpression(tex, display) {
  const node = mathDocument.convert(tex, { display });
  return adaptor.outerHTML(node);
}

function styleSheet() {
  return adaptor.textContent(mathDocument.outputJax.styleSheet(mathDocument));
}

// -- HTML scanning -----------------------------------------------------------
//
// Delimited expressions are replaced only where they are content, never where
// they are code. The scan first sets aside every script and style element
// whole, then, in what remains, finds the math directly by its delimiters.
//
// Math is matched before any notion of tags, because an expression may contain
// a bare `<` — `x<0`, a literal `\langle` — that a tag-first pass would mistake
// for the start of an element and tear the expression in half. Working from the
// delimiters instead means the only thing ever handed to the renderer is what
// stood between `\(`…`\)` or `\[`…`\]`.

const SKIP_ELEMENTS = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const MATH = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;

function protectedRanges(html) {
  const ranges = [];
  let match;
  SKIP_ELEMENTS.lastIndex = 0;
  while ((match = SKIP_ELEMENTS.exec(html))) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function insideAny(ranges, index) {
  for (const [start, end] of ranges) {
    if (index >= start && index < end) return true;
    if (start > index) break;
  }
  return false;
}

// An expression is content only if it is not sitting inside an element's start
// tag — a `\(…\)` written in a title or aria-label attribute is not typeset by
// the browser either, so it is left untouched here too. The test is whether the
// nearest unquoted angle bracket before the match is a `>` (we are in text) or a
// `<` (we are still inside a tag).
function inMarkupText(html, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const ch = html[i];
    if (ch === '>') return true;
    if (ch === '<') return false;
  }
  return true;
}

function renderMath(html, cache) {
  const protectedSpans = protectedRanges(html);
  let anyMath = false;

  const out = html.replace(MATH, (whole, display, inline, offset) => {
    if (insideAny(protectedSpans, offset)) return whole;
    if (!inMarkupText(html, offset)) return whole;

    const isDisplay = display !== undefined;
    const body = (isDisplay ? display : inline).trim();
    const key = (isDisplay ? 'D:' : 'I:') + body;
    let svg = cache.get(key);
    if (svg === undefined) {
      svg = renderExpression(body, isDisplay);
      cache.set(key, svg);
    }
    anyMath = true;
    return svg;
  });

  return { out, anyMath };
}

// -- MathJax runtime removal -------------------------------------------------
//
// A page keeps the engine only if it drives it after load — a diagram that
// retypesets a label when the reader moves a slider. The presence of a real API
// call is the test; the delimiter configuration alone does not count.

const USES_RUNTIME = /MathJax\.(?:typeset|tex2svg|tex2chtml|tex2mml)/;

function stripRuntime(html) {
  return html
    .replace(/<script\b[^>]*\bid=["']MathJax-script["'][^>]*>\s*<\/script>/gi, '')
    .replace(/<script\b[^>]*>\s*window\.MathJax\s*=[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*(?:mathjax|tex-mml)[^>]*>\s*/gi, '');
}

function injectStyleSheet(html, css) {
  const tag = `<style id="mathjax-prerendered">${css}</style>`;
  return html.includes('</head>') ? html.replace('</head>', tag + '</head>') : tag + html;
}

// -- per file ----------------------------------------------------------------

async function processFile(file) {
  const original = await fs.readFile(file, 'utf8');
  const cache = new Map();

  const { out, anyMath } = renderMath(original, cache);
  const keepsRuntime = USES_RUNTIME.test(out);

  let html = keepsRuntime ? out : stripRuntime(out);
  // The container stylesheet is only needed where the engine is gone. A page
  // that keeps MathJax installs the same stylesheet itself on load.
  if (anyMath && !keepsRuntime) html = injectStyleSheet(html, styleSheet());

  if (html === original) return { changed: false, expressions: 0 };
  await fs.writeFile(file, html, 'utf8');
  return { changed: true, expressions: cache.size };
}

async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

async function main() {
  const site = process.argv[2] || '_site';
  try {
    await fs.access(site);
  } catch {
    console.error(`postprocess-site: no such directory: ${site}`);
    process.exit(1);
  }

  let pages = 0;
  let mathPages = 0;
  let expressions = 0;
  for await (const file of htmlFiles(site)) {
    pages += 1;
    const result = await processFile(file);
    if (result.changed && result.expressions > 0) {
      mathPages += 1;
      expressions += result.expressions;
    }
  }

  console.log(
    `postprocess-site: pre-rendered ${expressions} expressions across ` +
    `${mathPages} of ${pages} pages; runtime MathJax kept only where a ` +
    'diagram retypesets on interaction'
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
