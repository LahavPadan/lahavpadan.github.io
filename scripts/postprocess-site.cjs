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
 * A page is rendered as one document, not as a bag of separate expressions.
 * That is what makes the output correct rather than merely fast:
 *
 *   - The built HTML that kramdown emits has already escaped the three markup
 *     characters — `a > b` reaches the file as `a &gt; b`. A browser decodes
 *     that back to `>` before MathJax ever reads the text node; a renderer that
 *     scanned the raw file with a regular expression would instead hand `&gt;`
 *     to the TeX parser, which reads the bare `&` as a misplaced alignment tab
 *     and turns the whole equation into an error box. Parsing the page as a
 *     document reproduces the browser's own decoding, so the parser sees `>`.
 *
 *   - `\label`, `\eqref` and equation numbering are properties of a document,
 *     not of one equation. A cross-reference resolves only when every equation
 *     on the page is processed together, in order, against one shared counter —
 *     exactly what the browser did on load, and exactly what one document pass
 *     here reproduces. Rendering each expression alone would leave every
 *     `\eqref` dangling.
 *
 * The renderer is MathJax itself, run over the built HTML through the same tex
 * packages, delimiters and skip-list the pages were authored with, so the
 * output is the geometry the browser used to compute.
 */

const fs = require('fs/promises');
const path = require('path');

const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { MathML } = require('mathjax-full/js/input/mathml.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

// -- MathJax -----------------------------------------------------------------
//
// The delimiters, the skip-list and the tag mode mirror the browser
// configuration in _layouts/default.html, so a page typesets here the way it
// would have typeset on load. `tags: 'ams'` is what lets `\label`/`\eqref`
// resolve and what numbers the equations. Both TeX and MathML input are
// installed, matching the `tex-mml-svg` bundle the pages load: an article
// writes `\(…\)`, while a diagram may author a matrix as an `<math>` element,
// and either must render here for the runtime to be safely removed.

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const TEX_OPTIONS = {
  packages: AllPackages,
  inlineMath: [['\\(', '\\)']],
  displayMath: [['\\[', '\\]']],
  tags: 'ams'
};

const SKIP_HTML_TAGS = ['script', 'noscript', 'style', 'textarea', 'pre', 'code'];

// A fresh input and output jax per page keeps each page's equation counter and
// its glyph-id numbering independent — page two does not inherit page one's
// equation (3) or its `MJX-2-…` ids.
function renderPage(html) {
  const output = new SVG({ fontCache: 'local' });
  const document = mathjax.document(html, {
    InputJax: [new TeX(TEX_OPTIONS), new MathML()],
    OutputJax: output,
    skipHtmlTags: SKIP_HTML_TAGS
  });

  document.render();

  const rendered = adaptor.outerHTML(adaptor.root(document.document));
  const css = adaptor.textContent(output.styleSheet(document));
  // One container is emitted per typeset expression; counting them tells us
  // whether the page had any renderable mathematics outside the skip-list.
  const count = (rendered.match(/<mjx-container\b/g) || []).length;
  return { rendered, css, count };
}

// -- MathJax runtime removal -------------------------------------------------
//
// A page keeps the engine only if it drives it after load — a diagram that
// retypesets a label when the reader moves a slider. The presence of a real API
// call is the test; the delimiter configuration alone does not count. Such a
// page is left exactly as built: its mathematics is not fixed, so it is neither
// pre-rendered nor stripped here.

const USES_RUNTIME = /MathJax\.(?:typeset|tex2svg|tex2chtml|tex2mml)/;

// Whether a page carries the loader at all.
const LOADS_ENGINE = /\bid=["']MathJax-script["']/;

// Whether a page holds anything to typeset. The configuration assigns the
// delimiters as script strings — `inlineMath: [['\\(', '\\)']]` — so those
// script blocks are set aside before looking for real expressions in the
// content: a `\(…\)` or `\[…\]` in the markup, or an authored `<math>` element.
function hasRenderableMath(html) {
  const content = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  return /\\\(|\\\[|<math[\s>]/.test(content);
}

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

  // Interactive pages retypeset on their own after load; leave them untouched.
  if (USES_RUNTIME.test(original)) return { status: 'interactive' };

  // A page with no fixed mathematics has nothing to pre-render. If it still
  // pulls the engine — a diagram left with the loader but no expressions — the
  // dead weight is dropped; otherwise the page is already final. Either way it
  // never reaches the renderer, so a diagram built from markup the lite DOM
  // cannot parse is not a reason for the build to fail.
  if (!hasRenderableMath(original)) {
    if (!LOADS_ENGINE.test(original)) return { status: 'unchanged' };
    await fs.writeFile(file, stripRuntime(original), 'utf8');
    return { status: 'stripped' };
  }

  // Render the whole page so equation numbering and cross-references resolve
  // together. A page that the lite DOM cannot parse is reported and left as
  // built rather than aborting every other page's processing.
  let rendered;
  let css;
  let count;
  try {
    ({ rendered, css, count } = renderPage(original));
  } catch (error) {
    console.warn(`postprocess-site: skipped ${file} (${error.message})`);
    return { status: 'skipped' };
  }

  if (count === 0) {
    if (!LOADS_ENGINE.test(original)) return { status: 'unchanged' };
    await fs.writeFile(file, stripRuntime(original), 'utf8');
    return { status: 'stripped' };
  }

  // The engine is now redundant: every equation is final SVG, every reference
  // resolved. Drop the runtime and install the container stylesheet the SVG
  // depends on — the one the engine would have installed on load.
  const html = injectStyleSheet(stripRuntime(rendered), css);

  if (html === original) return { status: 'unchanged' };
  await fs.writeFile(file, html, 'utf8');
  return { status: 'rendered', expressions: count };
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

  const tally = { rendered: 0, stripped: 0, skipped: 0, interactive: 0, unchanged: 0 };
  let expressions = 0;
  for await (const file of htmlFiles(site)) {
    const result = await processFile(file);
    tally[result.status] += 1;
    if (result.status === 'rendered') expressions += result.expressions;
  }

  console.log(
    `postprocess-site: pre-rendered ${expressions} expressions across ` +
    `${tally.rendered} pages; stripped the unused engine from ${tally.stripped}; ` +
    `kept the runtime on ${tally.interactive} interactive diagrams` +
    (tally.skipped ? `; skipped ${tally.skipped} unparseable pages` : '')
  );
}

// A page that cannot be parsed must not take the build down with it.
process.on('unhandledRejection', (reason) => {
  console.warn(`postprocess-site: ignored async error (${reason && reason.message ? reason.message : reason})`);
});

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
