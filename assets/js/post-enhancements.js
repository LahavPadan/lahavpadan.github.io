/**
 * Site-wide post enhancements plus the July 2026 article-visualization overlay.
 * This is a normal production asset loaded by the existing site layout; it is
 * not an installer or repository-update script.
 */
(function () {
  'use strict';

  function each(nodes, fn) {
    Array.prototype.forEach.call(nodes || [], fn);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function lowerText(value) {
    return normalizeText(value).toLowerCase();
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0590-\u05ff]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function findByText(root, selector, fragments, startNode) {
    if (!root) return null;
    var wanted = (fragments || []).map(lowerText);
    var nodes = root.querySelectorAll(selector);
    var started = !startNode;
    for (var i = 0; i < nodes.length; i += 1) {
      if (!started) {
        if (nodes[i] === startNode) started = true;
        continue;
      }
      var text = lowerText(nodes[i].textContent);
      var ok = wanted.every(function (fragment) {
        return text.indexOf(fragment) !== -1;
      });
      if (ok) return nodes[i];
    }
    return null;
  }

  function closestBlock(node) {
    if (!node) return null;
    return node.closest('figure, p, .image-zoom-trigger') || node;
  }

  function isCaptionParagraph(node) {
    if (!node || node.tagName !== 'P') return false;
    var text = normalizeText(node.textContent);
    if (!text) return false;
    if (node.children.length === 1 &&
        (node.firstElementChild.tagName === 'EM' ||
         node.firstElementChild.tagName === 'I')) return true;
    return node.querySelectorAll('img, iframe, a, button').length === 0 &&
      node.innerHTML.replace(/\s+/g, '').indexOf('<em>') === 0;
  }

  function removeBlockAndCaption(node) {
    var block = closestBlock(node);
    if (!block || !block.parentNode) return;
    var next = block.nextElementSibling;
    block.parentNode.removeChild(block);
    if (isCaptionParagraph(next) && next.parentNode) {
      next.parentNode.removeChild(next);
    }
  }

  function makeFrame(src, title, key, compact) {
    var frame = document.createElement('iframe');
    frame.className = 'article-visualization';
    frame.setAttribute('data-article-visualization', compact ? 'compact' : 'responsive');
    frame.setAttribute('data-visualization-key', key);
    frame.setAttribute('src', src);
    frame.setAttribute('title', title);
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('scrolling', 'no');
    return frame;
  }

  function alreadyInserted(root, key) {
    return Boolean(root && root.querySelector('[data-visualization-key="' + key + '"]'));
  }

  function insertAfter(anchor, frame) {
    if (!anchor || !anchor.parentNode) return false;
    anchor.parentNode.insertBefore(frame, anchor.nextSibling);
    return true;
  }

  function insertBefore(anchor, frame) {
    if (!anchor || !anchor.parentNode) return false;
    anchor.parentNode.insertBefore(frame, anchor);
    return true;
  }

  function findImage(root, altFragment, srcFragment) {
    var images = root ? root.querySelectorAll('img') : [];
    var altNeedle = lowerText(altFragment);
    var srcNeedle = String(srcFragment || '').toLowerCase();
    for (var i = 0; i < images.length; i += 1) {
      var alt = lowerText(images[i].getAttribute('alt'));
      var src = String(images[i].getAttribute('src') || '').toLowerCase();
      if ((altNeedle && alt.indexOf(altNeedle) !== -1) ||
          (srcNeedle && src.indexOf(srcNeedle) !== -1)) return images[i];
    }
    return null;
  }

  function replaceImageWithFrame(root, alt, src, frame) {
    var image = findImage(root, alt, src);
    if (!image) return false;
    var block = closestBlock(image);
    if (!block || !block.parentNode) return false;
    var next = block.nextElementSibling;
    block.parentNode.replaceChild(frame, block);
    if (isCaptionParagraph(next) && next.parentNode) next.parentNode.removeChild(next);
    return true;
  }

  function removeImagesBetweenHeadings(root, currentHeading, nextHeadingText) {
    if (!root || !currentHeading) return;

    var subsection = currentHeading.closest('.article-subsection');
    if (subsection) {
      each(subsection.querySelectorAll('img'), removeBlockAndCaption);
      return;
    }

    var node = currentHeading.nextElementSibling;
    while (node) {
      if (/^H[1-4]$/.test(node.tagName) &&
          lowerText(node.textContent).indexOf(lowerText(nextHeadingText)) !== -1) break;
      var next = node.nextElementSibling;
      if (node.tagName === 'IMG' || node.querySelector('img')) {
        removeBlockAndCaption(node.tagName === 'IMG' ? node : node.querySelector('img'));
      }
      node = next;
    }
  }

  function ensureEllipticAcknowledgment(prose) {
    if (!prose) return;
    var badNodes = prose.querySelectorAll('blockquote, p');
    each(badNodes, function (node) {
      var text = lowerText(node.textContent);
      if (text.indexOf('reference document built bottom-up') !== -1 ||
          text.indexOf('by such-and-such theorem') !== -1) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    });

    if (prose.querySelector('a[href*="xperimex.com/blog/quantum-elliptic-curves"]')) return;

    var quote = document.createElement('blockquote');
    quote.className = 'elliptic-acknowledgment';
    var p = document.createElement('p');
    var strong = document.createElement('strong');
    strong.textContent = 'Acknowledgment. ';
    var link = document.createElement('a');
    link.href = 'https://xperimex.com/blog/quantum-elliptic-curves/';
    link.textContent = 'Adi Mittal’s “Introductory Quantum Elliptic Curve Cryptography” on Delta Thoughts';
    p.appendChild(strong);
    p.appendChild(document.createTextNode('A major early push for this article came from '));
    p.appendChild(link);
    p.appendChild(document.createTextNode('. It gave me a giant leap forward when I was first getting oriented in the subject, and I am grateful for the clear starting point it provided.'));
    quote.appendChild(p);

    var firstSection = prose.querySelector('h2');
    if (firstSection) insertBefore(firstSection, quote);
    else prose.insertBefore(quote, prose.firstChild);
  }

  function integrateCoupled(prose) {
    var base = './visualizations/';

    if (!alreadyInserted(prose, 'coupled-oscillators')) {
      var osc = makeFrame(base + 'coupled-oscillators.html',
        'Coupled mechanical oscillators and the coupling matrix',
        'coupled-oscillators', false);
      if (!replaceImageWithFrame(prose,
          'coupling-spring extension from endpoint displacements',
          'coupling-spring-extension.png', osc)) {
        var oscHeading = findByText(prose, 'h2, h3', ['coupled mechanical oscillators']);
        if (oscHeading) insertAfter(oscHeading, osc);
      }
    }

    if (!alreadyInserted(prose, 'eigenvalue-gap')) {
      var gap = makeFrame(base + 'eigenvalue-gap.html',
        'The selected-detuning eigenvalue separation and minimum gap',
        'eigenvalue-gap', true);
      if (!replaceImageWithFrame(prose,
          'coupling changes a crossing into an avoided crossing',
          'avoided-crossing.svg', gap)) {
        var gapHeading = findByText(prose, 'h2, h3', ['eigenvalue hyperbola', 'definition of gap']);
        if (gapHeading) insertAfter(gapHeading, gap);
      }
    }

    if (!alreadyInserted(prose, 'hyperbola-propagation')) {
      var hyperHeading = findByText(prose, 'h2, h3', ['reading the hyperbola']);
      if (hyperHeading) {
        removeImagesBetweenHeadings(prose, hyperHeading, '0.7');
        var hyper = makeFrame(base + 'hyperbola-propagation.html',
          'Reading propagation and evanescence from the dispersion hyperbola',
          'hyperbola-propagation', false);
        var qAnchor = findByText(prose, 'p, .math-copy-shell, mjx-container', ['q', 'delta', 'kappa'], hyperHeading);
        insertAfter(qAnchor || hyperHeading, hyper);
      }
    }

    if (!alreadyInserted(prose, 'kramers-kronig')) {
      var kk = makeFrame(base + 'kramers-kronig.html',
        'Causality linking the real and imaginary response spectra',
        'kramers-kronig', false);
      if (!replaceImageWithFrame(prose,
          'cauchy contour, real-axis pole, principal value, and kramers-kronig pair',
          'kramers-kronig-cauchy-contour.png', kk)) {
        var kkHeading = findByText(prose, 'h2, h3', ['kramers', 'kronig']);
        if (kkHeading) insertAfter(kkHeading, kk);
      }
    }

    if (!alreadyInserted(prose, 'bragg-path-difference')) {
      var pathFrame = makeFrame(base + 'bragg-path-difference.html',
        'Classical Bragg path difference and constructive reflection',
        'bragg-path-difference', false);
      var pathAnchor = findByText(prose, 'p', ['formula is intuitive', 'two limitations']);
      if (pathAnchor) insertBefore(pathAnchor, pathFrame);
      else {
        var braggHeading = findByText(prose, 'h2, h3', ['bragg']);
        if (braggHeading) insertAfter(braggHeading, pathFrame);
      }
    }

    if (!alreadyInserted(prose, 'bragg-reciprocal-lattice')) {
      var reciprocalFrame = makeFrame(base + 'bragg-reciprocal-lattice.html',
        'Elastic reciprocal-lattice scattering construction',
        'bragg-reciprocal-lattice', false);
      var reciprocalAnchor = findByText(prose, 'p', ['same formula as picture 1']);
      if (reciprocalAnchor) insertAfter(reciprocalAnchor, reciprocalFrame);
      else {
        var reciprocalHeading = findByText(prose, 'h2, h3', ['reciprocal-lattice']);
        if (reciprocalHeading) insertAfter(reciprocalHeading, reciprocalFrame);
      }
    }

    if (!alreadyInserted(prose, 'two-wave-truncation')) {
      var truncHeading = findByText(prose, 'h2, h3, h4', ['two-wave truncation', 'amplitude suppression']);
      if (truncHeading) {
        insertAfter(truncHeading, makeFrame(base + 'two-wave-truncation.html',
          'Why the full Fourier matrix reduces to two near-resonant waves',
          'two-wave-truncation', false));
      }
    }

    if (!alreadyInserted(prose, 'gyroscopic-precession')) {
      var gyroHeading = findByText(prose, 'h2, h3, h4', ['gyroscopic precession', 'underlying mechanism']);
      if (gyroHeading) {
        insertAfter(gyroHeading, makeFrame(base + 'gyroscopic-precession.html',
          'Gyroscopic precession as the origin of the transverse response',
          'gyroscopic-precession', false));
      }
    }
  }

  function integrateElliptic(prose) {
    var base = './visualizations/';
    ensureEllipticAcknowledgment(prose);

    if (!alreadyInserted(prose, 'chord-and-tangent')) {
      var chordAnchor = findByText(prose, 'p', ['for doubling', 'tangent line']);
      var chordHeading = findByText(prose, 'h2, h3', ['chord-and-tangent construction']);
      insertAfter(chordAnchor || chordHeading,
        makeFrame(base + 'chord-and-tangent.html',
          'The chord-and-tangent construction on an elliptic curve',
          'chord-and-tangent', false));
    }

    if (!alreadyInserted(prose, 'node-cusp-smooth')) {
      var singularAnchor = findByText(prose, 'p', ['topological obstruction', 'genuinely new structure']);
      var singularHeading = findByText(prose, 'h2, h3', ['why non-singular']);
      var singularFrame = makeFrame(base + 'node-cusp-smooth.html',
        'Node, cusp, and smooth cubic comparison through line slopes',
        'node-cusp-smooth', false);
      if (singularAnchor) insertBefore(singularAnchor, singularFrame);
      else insertAfter(singularHeading, singularFrame);
    }

    if (!alreadyInserted(prose, 'elliptic-torus')) {
      var torusHeading = findByText(prose, 'h2, h3, h4', ['weierstrass parameterization']);
      if (!torusHeading) torusHeading = findByText(prose, 'h2, h3', ['complex', 'torus']);
      if (torusHeading) {
        insertBefore(torusHeading, makeFrame(base + 'elliptic-curve-torus.html',
          'From the two-sheeted complex curve to a torus and period lattice',
          'elliptic-torus', false));
      }
    }
  }

  function integrateOrthogonal(prose) {
    var base = './visualizations/';

    if (!alreadyInserted(prose, 'chebyshev-coordinate')) {
      var coordinateAnchor = findByText(prose, 'p', ['everything about', 'literally']);
      if (!coordinateAnchor) coordinateAnchor = findByText(prose, 'p', ['cos', 'chebyshev']);
      if (!coordinateAnchor) coordinateAnchor = findByText(prose, 'h2, h3', ['chebyshev polynomials']);
      if (coordinateAnchor) {
        insertAfter(coordinateAnchor, makeFrame(base + 'chebyshev.html#coordinate',
          'Chebyshev polynomials as ordinary cosine modes under t equals cos theta',
          'chebyshev-coordinate', false));
      }
    }

    if (!alreadyInserted(prose, 'chebyshev-trace')) {
      var traceAnchor = findByText(prose, 'p', ['natural coordinate', 'su(2)']);
      if (!traceAnchor) traceAnchor = findByText(prose, 'h2, h3', ['chebyshev', 'su(2)']);
      if (!traceAnchor) traceAnchor = findByText(prose, 'p', ['trigonometric identity', 'diagonal']);
      if (traceAnchor) {
        insertAfter(traceAnchor, makeFrame(base + 'chebyshev.html#trace',
          'Chebyshev polynomials from traces of opposite phases',
          'chebyshev-trace', false));
      }
    }

    if (!alreadyInserted(prose, 'bessel')) {
      var besselAnchor = findByText(prose, 'p', ['this is why bessel functions describe']);
      if (!besselAnchor) besselAnchor = findByText(prose, 'h2, h3', ['bessel functions']);
      if (besselAnchor) {
        insertAfter(besselAnchor, makeFrame(base + 'bessel.html',
          'Why circular geometry and plane-wave symmetry produce Bessel modes',
          'bessel', false));
      }
    }
  }

  function integrateWhoami() {
    if (window.location.pathname.indexOf('/whoami') === -1) return;
    var heading = findByText(document, 'h2', ['blogs i would recommend to others']);
    if (!heading) return;
    var node = heading.nextElementSibling;
    while (node && node.tagName !== 'UL') node = node.nextElementSibling;
    if (!node) return;
    node.classList.add('whoami-blog-grid');
    each(node.children, function (item) { item.classList.add('whoami-blog-card'); });
  }

  function integrateArticleVisualizations() {
    var prose = document.querySelector('.article-prose');
    var path = window.location.pathname.replace(/\/+$/, '');
    if (prose) {
      if (path.indexOf('/posts/coupled-modes-bragg-structures-and-photonic-bandgaps') !== -1) {
        integrateCoupled(prose);
      } else if (path.indexOf('/posts/elliptic-curves') !== -1) {
        integrateElliptic(prose);
      } else if (path.indexOf('/posts/orthogonal-transforms-as-characters-and-representations') !== -1) {
        integrateOrthogonal(prose);
      }
    }
    integrateWhoami();
  }

  function initVisualizationResizing() {
    /* Guards against the "iframe grows by 2px forever" bug.

       Every article-visualization iframe includes a bridge script that
       measures its own body/root scrollHeight, adds a fudge of `+2`
       "to avoid a scrollbar", and posts the number back for the parent
       to apply as `iframe.style.height`. Independently, that bridge
       also runs a ResizeObserver on the body, which fires when the
       iframe's viewport height changes (parent-driven resizes bubble
       into the child as a body resize). Combined, the sequence is:

         child measures H → posts H+2 → parent sets iframe = H+2
         → child's body ResizeObserver fires → child measures H+2
         → posts H+4 → parent sets iframe = H+4 → ... forever

       That's the "drifting whitespace below the visualization until
       infinity" the reader sees. Fixing every child's bridge script
       is safer as a one-off cleanup but doesn't help older cached
       copies of the visualization HTML that browsers may serve after
       a redeploy, and doesn't help future visualizations that get
       copy-pasted from the old pattern. So we harden the parent side
       here: ignore sub-6-pixel deltas from the current height. The
       real content-change signal easily exceeds that; the +2 drift
       never does. Combined with the child-side cleanup (see
       posts/*/visualizations/*.html), this makes the whole path
       double-safe. */
    var HYSTERESIS_PX = 6;

    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      var accepted = data.type === 'article-visualization:resize' ||
        data.type === 'article-visualization-height' ||
        data.type === 'singular-cubic-height';
      if (!accepted) return;
      var height = Number(data.height || data.value || data.documentHeight);
      if (!isFinite(height) || height <= 0) return;
      height = Math.max(320, Math.min(3000, Math.ceil(height)));
      each(document.querySelectorAll('iframe[data-article-visualization]'), function (frame) {
        if (frame.contentWindow !== event.source) return;
        /* Skip micro-adjustments that don't reflect real content
           changes. This is the drift guard: even if the child
           reports height+2 forever, we never grow. */
        var currentHeight = frame.offsetHeight;
        if (Math.abs(height - currentHeight) < HYSTERESIS_PX) return;
        frame.style.height = height + 'px';
      });
    });
  }

  /* -------------------------------------------------------------- TOC ---- */

  function buildToc() {
    var nav = document.getElementById('post-toc');
    var listEl = document.getElementById('post-toc-list');
    var prose = document.querySelector('.article-prose');
    if (!nav || !listEl || !prose) return null;

    var headings = Array.prototype.slice.call(prose.querySelectorAll('h2, h3, h4'));
    if (headings.length < 2) {
      if (nav.parentNode) nav.parentNode.removeChild(nav);
      return null;
    }

    var hasH2 = headings.some(function (heading) { return heading.tagName === 'H2'; });
    var topTag = hasH2 ? 'H2' : 'H3';
    function isTop(heading) { return heading.tagName === topTag; }
    function isSub(heading) {
      return topTag === 'H2'
        ? (heading.tagName === 'H3' || heading.tagName === 'H4')
        : heading.tagName === 'H4';
    }

    var linkable = headings.filter(function (heading) { return isTop(heading) || isSub(heading); });
    var includeSubs = linkable.length <= 40;
    var used = {};

    function ensureId(heading) {
      if (heading.id) { used[heading.id] = true; return; }
      var base = slugify(heading.textContent) || 'section';
      var id = base;
      var n = 1;
      while (document.getElementById(id) || used[id]) {
        id = base + '-' + n;
        n += 1;
      }
      heading.id = id;
      used[id] = true;
    }

    function makeItem(heading, cls) {
      var item = document.createElement('li');
      item.className = 'post-toc__item ' + cls;
      var link = document.createElement('a');
      link.className = 'post-toc__link';
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      return item;
    }

    listEl.textContent = '';
    var fragment = document.createDocumentFragment();
    var currentSub = null;
    var currentTopItem = null;
    var linked = [];

    headings.forEach(function (heading) {
      if (isTop(heading)) {
        ensureId(heading);
        currentSub = null;
        currentTopItem = makeItem(heading, 'post-toc__item--top');
        fragment.appendChild(currentTopItem);
        linked.push(heading);
      } else if (isSub(heading) && includeSubs) {
        ensureId(heading);
        if (!currentSub) {
          currentSub = document.createElement('ol');
          currentSub.className = 'post-toc__sublist';
          (currentTopItem || fragment).appendChild(currentSub);
        }
        currentSub.appendChild(makeItem(heading, 'post-toc__item--sub'));
        linked.push(heading);
      }
    });

    listEl.appendChild(fragment);
    nav.hidden = false;
    nav.setAttribute('data-toc-ready', '');
    return { nav: nav, linked: linked };
  }

  function initTocSpy(state) {
    if (!state || !state.linked.length) return;
    var entries = [];
    each(state.nav.querySelectorAll('.post-toc__link'), function (link) {
      var raw = link.getAttribute('href').slice(1);
      var id;
      try { id = decodeURIComponent(raw); } catch (_error) { id = raw; }
      var heading = document.getElementById(id);
      if (heading) entries.push({ heading: heading, link: link });
    });
    if (!entries.length) return;

    var offsets = [];
    var active = -1;
    var scrollFrame = 0;
    var measureFrame = 0;
    var headerOffset = 96;

    function setActive(index) {
      if (index === active) return;
      if (active >= 0 && entries[active]) {
        entries[active].link.classList.remove('is-active');
        entries[active].link.removeAttribute('aria-current');
      }
      active = index;
      if (active >= 0 && entries[active]) {
        entries[active].link.classList.add('is-active');
        entries[active].link.setAttribute('aria-current', 'location');
      }
    }

    function update() {
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
        } else high = middle - 1;
      }
      setActive(chosen);
    }

    function scheduleUpdate() {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(update);
    }

    function measure() {
      measureFrame = 0;
      offsets = entries.map(function (entry) {
        return entry.heading.getBoundingClientRect().top + window.scrollY;
      });
      update();
    }

    function scheduleMeasure() {
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(measure);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('load', scheduleMeasure, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleMeasure).catch(function () {});
    }
    measure();
  }

  /* ----------------------------------------------------- Formula copy ---- */

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var ok = false;
    try { ok = document.execCommand('copy'); }
    finally { document.body.removeChild(textarea); }
    return ok;
  }

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function showCopiedState(target) {
    if (!target) return;
    var isButton = target.matches('[data-copy-math-button]');
    var oldLabel = isButton ? target.textContent : '';
    target.classList.add('is-copied');
    if (isButton) target.textContent = 'copied';
    window.setTimeout(function () {
      target.classList.remove('is-copied');
      if (isButton) target.textContent = oldLabel;
    }, 1200);
  }

  function copyFormula(container, feedbackTarget) {
    if (!container) return;
    var tex = container.getAttribute('data-tex');
    if (!tex) return;
    writeClipboard(tex).then(function (ok) {
      if (ok) showCopiedState(feedbackTarget || container);
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
      var inline = event.target.closest('mjx-container[data-copy-math-inline][data-tex]');
      if (!inline) return;
      var selection = window.getSelection && window.getSelection();
      if (selection && String(selection).trim()) return;
      copyFormula(inline, inline);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var target = event.target.closest('mjx-container[data-copy-math-inline][data-tex]');
      if (!target) return;
      event.preventDefault();
      copyFormula(target, target);
    });
  }

  function buildSelectionTextWithTex(selection) {
    var mathHit = false;
    var parts = [];
    for (var r = 0; r < selection.rangeCount; r += 1) {
      var range = selection.getRangeAt(r);
      if (range.collapsed) continue;
      var fragment = range.cloneContents();
      var math = fragment.querySelectorAll('mjx-container[data-tex]');
      if (math.length) mathHit = true;
      each(math, function (container) {
        var tex = container.getAttribute('data-tex') || '';
        var display = container.getAttribute('display') === 'true';
        container.parentNode.replaceChild(
          document.createTextNode(display ? '\n$$' + tex + '$$\n' : '$' + tex + '$'),
          container
        );
      });
      var wrapper = document.createElement('div');
      wrapper.appendChild(fragment);
      parts.push(wrapper.textContent);
    }
    if (!mathHit) return null;
    return parts.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  }

  function initFormulaSelectionCopy() {
    document.addEventListener('copy', function (event) {
      var selection = window.getSelection && window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
      var text = buildSelectionTextWithTex(selection);
      if (text == null) return;
      try {
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
      } catch (_error) {}
    }, true);
  }

  /* -------------------------------------------------- Image lightbox ---- */

  var lightboxState = { node: null, lastFocus: null, onKey: null };

  function closeLightbox() {
    if (!lightboxState.node) return;
    document.body.classList.remove('has-lightbox');
    document.removeEventListener('keydown', lightboxState.onKey, true);
    if (lightboxState.node.parentNode) lightboxState.node.parentNode.removeChild(lightboxState.node);
    var focus = lightboxState.lastFocus;
    lightboxState = { node: null, lastFocus: null, onKey: null };
    if (focus && typeof focus.focus === 'function') {
      try { focus.focus(); } catch (_error) {}
    }
  }

  function openLightbox(sourceImage) {
    var src = sourceImage.currentSrc || sourceImage.src;
    if (!src) return;
    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', sourceImage.alt ? 'Image: ' + sourceImage.alt : 'Image preview');
    backdrop.tabIndex = -1;

    var image = document.createElement('img');
    image.className = 'lightbox__image';
    image.src = src;
    image.alt = sourceImage.alt || '';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox__close';
    close.setAttribute('aria-label', 'Close image');
    close.innerHTML = '&times;';

    backdrop.appendChild(image);
    backdrop.appendChild(close);
    backdrop.addEventListener('click', function (event) {
      if (event.target !== image) closeLightbox();
    });
    lightboxState.onKey = function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }
    };
    document.addEventListener('keydown', lightboxState.onKey, true);
    lightboxState.lastFocus = document.activeElement;
    lightboxState.node = backdrop;
    document.body.appendChild(backdrop);
    document.body.classList.add('has-lightbox');
    backdrop.focus();
  }

  function initImageLightbox() {
    var prose = document.querySelector('.article-prose');
    if (!prose) return;
    prose.addEventListener('click', function (event) {
      var image = event.target.closest('img');
      if (!image || !prose.contains(image) || image.closest('a')) return;
      event.preventDefault();
      openLightbox(image);
    });
  }

  function watchForArticleReplacement() {
    var prose = document.querySelector('.article-prose');
    if (!prose || !window.MutationObserver) return;
    var timer = 0;
    var observer = new MutationObserver(function () {
      if (timer) return;
      timer = window.setTimeout(function () {
        timer = 0;
        integrateArticleVisualizations();
      }, 90);
    });
    observer.observe(prose, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); }, 12000);
  }

  function boot() {
    integrateArticleVisualizations();
    initVisualizationResizing();
    if (!document.querySelector('.post-page--guided')) {
      initTocSpy(buildToc());
    }
    initFormulaCopying();
    initFormulaSelectionCopy();
    initImageLightbox();
    watchForArticleReplacement();

    document.addEventListener('lahav:math-ready', integrateArticleVisualizations, { once: true });
    window.addEventListener('load', integrateArticleVisualizations, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else boot();
}());
