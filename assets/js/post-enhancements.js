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
        var qAnchor = findByText(prose, 'p', ['q', 'delta', 'kappa'], hyperHeading);
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
    if (prose && prose.dataset.articleVisualizationsIntegrated !== 'true') {
      if (path.indexOf('/posts/coupled-modes-bragg-structures-and-photonic-bandgaps') !== -1) {
        integrateCoupled(prose);
      } else if (path.indexOf('/posts/elliptic-curves') !== -1) {
        integrateElliptic(prose);
      } else if (path.indexOf('/posts/orthogonal-transforms-as-characters-and-representations') !== -1) {
        integrateOrthogonal(prose);
      }
      prose.dataset.articleVisualizationsIntegrated = 'true';
    }
    integrateWhoami();
  }

  function cssValue(style, name, fallback) {
    var value = style.getPropertyValue(name);
    return value ? value.trim() : fallback;
  }

  function currentVisualizationPalette() {
    var post = document.querySelector('.post-page') || document.documentElement;
    var postStyle = window.getComputedStyle(post);
    var rootStyle = window.getComputedStyle(document.documentElement);
    var value = function (name, fallback) {
      return cssValue(postStyle, name, cssValue(rootStyle, name, fallback));
    };

    return {
      theme: document.documentElement.dataset.theme || 'light',
      page: value('--page', '#fbfbf8'),
      surface: value('--surface', '#ffffff'),
      surfaceMuted: value('--surface-muted', '#f4f5f1'),
      ink: value('--ink', '#1c2420'),
      muted: value('--muted', '#667169'),
      border: value('--border', '#d6ddd7'),
      borderStrong: value('--border-strong', '#a6b2a9'),
      accent: value('--post-accent', value('--accent', '#0d7659')),
      accentSoft: value('--post-accent-soft', value('--accent-soft', '#dcefe7')),
      accentBorder: value('--post-accent-border', value('--border-strong', '#a6b2a9')),
      accentInk: value('--post-accent-ink', value('--accent', '#0d7659'))
    };
  }

  function setVisualizationVariables(root, palette) {
    var style = root.style;
    var exact = {
      '--viz-page': palette.page,
      '--viz-surface': palette.surface,
      '--viz-surface-muted': palette.surfaceMuted,
      '--viz-ink': palette.ink,
      '--viz-muted': palette.muted,
      '--viz-border': palette.border,
      '--viz-border-strong': palette.borderStrong,
      '--viz-accent': palette.accent,
      '--viz-accent-soft': palette.accentSoft,
      '--viz-accent-border': palette.accentBorder,
      '--viz-accent-ink': palette.accentInk
    };
    Object.keys(exact).forEach(function (name) {
      style.setProperty(name, exact[name]);
    });

    /* Aliases are stable references to the exact variables above, so they only
       need to be installed once per iframe document. Theme switching then
       updates eleven values instead of rewriting the full compatibility map. */
    if (root.dataset.articleVisualizationAliasesReady === 'true') return;

    /* All diagram roles inherit from the article palette. The variables only
       have to live on the iframe root; copying the entire declaration set onto
       every top-level child caused a full visualization re-style on each theme
       switch and was the main source of the visible dark/light-mode pause. */
    var aliases = {
      '--page': 'var(--viz-page)',
      '--paper': 'var(--viz-surface)',
      '--bg': 'var(--viz-page)',
      '--auc-bg': 'var(--viz-page)',
      '--tw-bg': 'var(--viz-page)',

      '--surface': 'var(--viz-surface)',
      '--panel': 'var(--viz-surface)',
      '--auc-surface': 'var(--viz-surface)',
      '--tw-surface': 'var(--viz-surface)',
      '--rls-surface': 'var(--viz-surface)',
      '--eg-surface': 'var(--viz-surface)',

      '--surface-muted': 'var(--viz-surface-muted)',
      '--surface-2': 'var(--viz-surface-muted)',
      '--panel-2': 'var(--viz-surface-muted)',
      '--auc-surface-soft': 'var(--viz-surface-muted)',
      '--tw-surface-soft': 'var(--viz-surface-muted)',
      '--rls-muted-surface': 'var(--viz-surface-muted)',
      '--eg-surface-muted': 'var(--viz-surface-muted)',

      '--ink': 'var(--viz-ink)',
      '--text': 'var(--viz-ink)',
      '--auc-text': 'var(--viz-ink)',
      '--tw-text': 'var(--viz-ink)',
      '--rls-ink': 'var(--viz-ink)',
      '--eg-ink': 'var(--viz-ink)',

      '--muted': 'var(--viz-muted)',
      '--faint': 'color-mix(in srgb, var(--viz-muted) 76%, transparent)',
      '--auc-muted': 'var(--viz-muted)',
      '--auc-faint': 'color-mix(in srgb, var(--viz-muted) 76%, transparent)',
      '--auc-gray': 'var(--viz-muted)',
      '--auc-white': 'var(--viz-ink)',
      '--tw-muted': 'var(--viz-muted)',
      '--rls-muted': 'var(--viz-muted)',
      '--eg-muted': 'var(--viz-muted)',

      '--border': 'var(--viz-border)',
      '--line': 'var(--viz-border)',
      '--rule': 'var(--viz-border)',
      '--grid': 'color-mix(in srgb, var(--viz-border) 72%, transparent)',
      '--auc-grid': 'color-mix(in srgb, var(--viz-border) 72%, transparent)',
      '--auc-line': 'var(--viz-border)',
      '--tw-border': 'var(--viz-border)',
      '--rls-border': 'var(--viz-border)',
      '--eg-border': 'var(--viz-border)',

      '--border-strong': 'var(--viz-border-strong)',
      '--line-strong': 'var(--viz-border-strong)',
      '--rule-strong': 'var(--viz-border-strong)',
      '--rls-border-strong': 'var(--viz-border-strong)',

      '--accent': 'var(--viz-accent)',
      '--post-accent': 'var(--viz-accent)',
      '--card-accent': 'var(--viz-accent)',
      '--rt-accent': 'var(--viz-accent)',
      '--eg-accent': 'var(--viz-accent)',
      '--tw-accent': 'var(--viz-accent)',
      '--rls-g': 'var(--viz-accent)',
      '--auc-purple': 'var(--viz-accent)',
      '--curve': 'var(--viz-accent)',
      '--good': 'var(--viz-accent)',
      '--result': 'var(--viz-accent)',
      '--real': 'var(--viz-accent)',
      '--positive': 'var(--viz-accent)',
      '--ray': 'var(--viz-accent)',
      '--field': 'var(--viz-accent)',
      '--teal': 'var(--viz-accent)',
      '--blue': 'var(--viz-accent)',

      '--accent-ink': 'var(--viz-accent-ink)',
      '--accent-deep': 'var(--viz-accent-ink)',
      '--accent-strong': 'var(--viz-accent-ink)',
      '--strong': 'var(--viz-accent-ink)',
      '--post-accent-ink': 'var(--viz-accent-ink)',
      '--eg-accent-border': 'var(--viz-accent-border)',
      '--tw-accent-ink': 'var(--viz-accent-ink)',
      '--auc-purple-strong': 'var(--viz-accent-ink)',
      '--curve-dark': 'var(--viz-accent-ink)',
      '--math': 'var(--viz-accent-ink)',

      '--accent-soft': 'var(--viz-accent-soft)',
      '--post-accent-soft': 'var(--viz-accent-soft)',
      '--card-accent-soft': 'var(--viz-accent-soft)',
      '--rt-soft': 'var(--viz-accent-soft)',
      '--eg-accent-soft': 'var(--viz-accent-soft)',
      '--tw-accent-soft': 'var(--viz-accent-soft)',
      '--tw-accent-softer': 'color-mix(in srgb, var(--viz-accent-soft) 62%, var(--viz-surface))',
      '--rls-g-soft': 'var(--viz-accent-soft)',
      '--auc-purple-soft': 'var(--viz-accent-soft)',
      '--auc-purple-fill': 'color-mix(in srgb, var(--viz-accent-soft) 82%, transparent)',
      '--result-soft': 'var(--viz-accent-soft)',
      '--real-soft': 'var(--viz-accent-soft)',
      '--ray-soft': 'var(--viz-accent-soft)',
      '--field-soft': 'var(--viz-accent-soft)',
      '--teal-soft': 'var(--viz-accent-soft)',
      '--blue-soft': 'var(--viz-accent-soft)',
      '--soft': 'var(--viz-accent-soft)',

      '--accent-border': 'var(--viz-accent-border)',
      '--post-accent-border': 'var(--viz-accent-border)',
      '--card-accent-border': 'var(--viz-accent-border)',
      '--rt-border': 'var(--viz-accent-border)'
    };

    var secondary = 'color-mix(in oklab, var(--viz-accent) 68%, var(--viz-ink))';
    var secondarySoft = 'color-mix(in srgb, var(--viz-accent-soft) 72%, var(--viz-surface))';
    var tertiary = 'color-mix(in oklab, var(--viz-accent) 52%, var(--viz-muted))';
    var tertiarySoft = 'color-mix(in srgb, var(--viz-accent-soft) 52%, var(--viz-surface-muted))';

    [
      '--warm', '--violet', '--path', '--turn', '--negative', '--imag',
      '--compression', '--tangent', '--singular', '--orange', '--red',
      '--rls-k', '--tw-blue'
    ].forEach(function (name) { aliases[name] = secondary; });
    [
      '--warm-soft', '--violet-soft', '--path-soft', '--turn-soft',
      '--imag-soft', '--compression-soft', '--orange-soft', '--red-soft',
      '--rls-k-soft'
    ].forEach(function (name) { aliases[name] = secondarySoft; });
    [
      '--third', '--gold', '--success', '--warn', '--neutral-spring'
    ].forEach(function (name) { aliases[name] = tertiary; });
    [
      '--success-soft', '--warn-soft'
    ].forEach(function (name) { aliases[name] = tertiarySoft; });

    Object.keys(aliases).forEach(function (name) {
      style.setProperty(name, aliases[name]);
    });
    root.dataset.articleVisualizationAliasesReady = 'true';
  }

  var visualizationViewportObserver = null;

  function frameIsNearViewport(frame) {
    return !visualizationViewportObserver || frame.dataset.visualizationNearViewport === 'true';
  }

  function visualizationPaletteSignature(palette) {
    return [
      palette.theme, palette.page, palette.surface, palette.surfaceMuted,
      palette.ink, palette.muted, palette.border, palette.borderStrong,
      palette.accent, palette.accentSoft, palette.accentBorder, palette.accentInk
    ].join('|');
  }

  function syncVisualizationTheme(frame, suppliedPalette) {
    var doc;
    try { doc = frame.contentDocument; }
    catch (_e) { return; }
    if (!doc || !doc.documentElement || !doc.body) return;

    var palette = suppliedPalette || currentVisualizationPalette();
    var signature = visualizationPaletteSignature(palette);
    var root = doc.documentElement;
    if (frame.dataset.visualizationPalette === signature &&
        root.dataset.theme === palette.theme) return;

    /* Theme propagation changes colours only, never geometry. Suppress the
       ResizeObserver echo caused by the iframe style recalculation; measuring
       every diagram again was the main pause after toggling dark/light mode. */
    frame.__lahavIgnoreVisualizationResizeUntil =
      (window.performance && performance.now ? performance.now() : Date.now()) + 220;

    root.dataset.theme = palette.theme;
    root.style.colorScheme = palette.theme;
    setVisualizationVariables(root, palette);

    /* CSS custom properties inherit from :root. Only the canvas itself needs
       an !important override for older visualizations that hard-coded a body
       background; keeping this style tiny avoids a document-wide re-style. */
    var override = doc.getElementById('article-visualization-theme-override');
    if (!override) {
      override = doc.createElement('style');
      override.id = 'article-visualization-theme-override';
      override.textContent =
        'html,body{background:var(--viz-page)!important;color:var(--viz-ink)!important;color-scheme:inherit;}';
      (doc.head || root).appendChild(override);
    }

    frame.style.backgroundColor = palette.page;
    frame.dataset.visualizationPalette = signature;
  }

  function visualizationContentHeight(frame, deepScan) {
    var doc;
    try { doc = frame.contentDocument; }
    catch (_e) { return 0; }
    if (!doc || !doc.body || !doc.documentElement) return 0;

    var root = doc.documentElement;
    var body = doc.body;
    var maxBottom = Math.max(
      root.scrollHeight, root.offsetHeight, root.clientHeight,
      body.scrollHeight, body.offsetHeight, body.clientHeight
    );

    /* One geometric scan after load catches older diagrams whose final card is
       absolutely positioned outside normal flow. ResizeObserver and explicit
       postMessage heights handle subsequent interaction without repeating this
       expensive child-by-child computed-style walk. */
    if (deepScan) {
      var win = frame.contentWindow;
      each(body.children, function (node) {
        if (!node || /^(SCRIPT|STYLE|LINK)$/.test(node.tagName)) return;
        var style = win.getComputedStyle(node);
        if (style.display === 'none' || style.position === 'fixed') return;
        var rect = node.getBoundingClientRect();
        if (!isFinite(rect.bottom)) return;
        var marginBottom = parseFloat(style.marginBottom) || 0;
        maxBottom = Math.max(maxBottom, rect.bottom + win.scrollY + marginBottom);
      });
    }

    return Math.ceil(maxBottom);
  }

  function applyVisualizationHeight(frame, rawHeight, allowShrink) {
    var height = Number(rawHeight);
    if (!isFinite(height) || height <= 0) return;
    height = Math.max(240, Math.min(20000, Math.ceil(height)));

    var current = frame.offsetHeight || parseFloat(frame.style.height) || 0;
    if (!allowShrink && height <= current + 3) return;
    if (Math.abs(height - current) < 3) return;
    frame.style.height = height + 'px';
    document.dispatchEvent(new CustomEvent('lahav:visualization-resize', {
      detail: { frame: frame, height: height }
    }));
  }

  function measureVisualizationFrame(frame, deepScan) {
    /* Theme synchronization is handled on iframe load, theme mutation, and
       viewport entry. Keeping it out of the resize path avoids forced parent
       getComputedStyle reads every time an internal control changes height. */
    applyVisualizationHeight(frame, visualizationContentHeight(frame, deepScan), false);
  }

  function wireVisualizationFrame(frame) {
    if (!frame || frame.dataset.visualizationWired === 'true') return;
    frame.dataset.visualizationWired = 'true';

    var measureFrame = 0;
    var needsDeepScan = false;

    function scheduleMeasure(deepScan) {
      needsDeepScan = needsDeepScan || Boolean(deepScan);
      if (measureFrame) return;
      measureFrame = window.requestAnimationFrame(function () {
        measureFrame = 0;
        var deep = needsDeepScan;
        needsDeepScan = false;
        measureVisualizationFrame(frame, deep);
      });
    }

    function installResizeObserver() {
      var doc;
      try { doc = frame.contentDocument; }
      catch (_e) { return; }
      if (!doc || !doc.body || !doc.documentElement) return;

      if (frame.__lahavVisualizationResizeObserver) {
        frame.__lahavVisualizationResizeObserver.disconnect();
      }

      var ViewResizeObserver = frame.contentWindow && frame.contentWindow.ResizeObserver;
      if (ViewResizeObserver) {
        var observer = new ViewResizeObserver(function () {
          var now = window.performance && performance.now ? performance.now() : Date.now();
          if (now < (frame.__lahavIgnoreVisualizationResizeUntil || 0)) return;
          scheduleMeasure(false);
        });
        observer.observe(doc.documentElement);
        observer.observe(doc.body);
        frame.__lahavVisualizationResizeObserver = observer;
      }

      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(function () { scheduleMeasure(true); }).catch(function () {});
      }
    }

    function loaded() {
      delete frame.dataset.visualizationPalette;
      syncVisualizationTheme(frame);
      installResizeObserver();
      scheduleMeasure(true);
      window.setTimeout(function () { scheduleMeasure(true); }, 260);
    }

    frame.addEventListener('load', loaded);

    /* A newly-created lazy iframe initially exposes a complete about:blank
       document. Treating that as the real load caused duplicate theming,
       observers and deep measurements before the visualization even started. */
    try {
      if (frame.contentDocument &&
          frame.contentDocument.readyState === 'complete' &&
          frame.contentWindow.location.href !== 'about:blank') loaded();
    } catch (_error) {}

    if (visualizationViewportObserver) visualizationViewportObserver.observe(frame);
  }

  var visualizationResizingInitialized = false;

  function initVisualizationResizing() {
    if (visualizationResizingInitialized) return;
    visualizationResizingInitialized = true;

    var selector = 'iframe[data-article-visualization]';

    if ('IntersectionObserver' in window) {
      visualizationViewportObserver = new IntersectionObserver(function (entries) {
        var palette = null;
        entries.forEach(function (entry) {
          var frame = entry.target;
          var near = entry.isIntersecting || entry.intersectionRatio > 0;
          frame.dataset.visualizationNearViewport = near ? 'true' : 'false';
          if (near) {
            if (!palette) palette = currentVisualizationPalette();
            syncVisualizationTheme(frame, palette);
          }
        });
      }, { rootMargin: '800px 0px' });
    }

    each(document.querySelectorAll(selector), wireVisualizationFrame);

    /* Messages remain the most accurate source for interactive controls that
       change a visualization after load. */
    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      var height = Number(data.height || data.value || data.documentHeight);
      if (!isFinite(height) || height <= 0) return;

      each(document.querySelectorAll(selector), function (frame) {
        if (frame.contentWindow !== event.source) return;
        applyVisualizationHeight(frame, height, true);
      });
    });

    if (window.MutationObserver) {
      new MutationObserver(function (records) {
        records.forEach(function (record) {
          each(record.addedNodes, function (node) {
            if (!node || node.nodeType !== 1) return;
            if (node.matches && node.matches(selector)) wireVisualizationFrame(node);
            each(node.querySelectorAll ? node.querySelectorAll(selector) : [], wireVisualizationFrame);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });

      var themeFrame = 0;
      var themeTimer = 0;
      new MutationObserver(function () {
        if (themeFrame) return;
        themeFrame = window.requestAnimationFrame(function () {
          themeFrame = 0;
          if (themeTimer) window.clearTimeout(themeTimer);

          /* Let the parent page paint its new palette first. Iframe propagation
             runs in the next task, so the theme button never waits behind
             cross-document style recalculation. */
          themeTimer = window.setTimeout(function () {
            themeTimer = 0;
            var palette = currentVisualizationPalette();

            /* Update diagrams in or near the viewport. Off-screen iframes keep
               their old palette until IntersectionObserver brings them close
               to view, avoiding a synchronous restyle of the entire article. */
            each(document.querySelectorAll(selector), function (frame) {
              if (frameIsNearViewport(frame)) syncVisualizationTheme(frame, palette);
            });
          }, 0);
        });
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
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

  function bootVisualizations() {
    integrateArticleVisualizations();
    initVisualizationResizing();
  }

  function scheduleVisualizationBoot() {
    if (document.documentElement.dataset.visualizationsBootScheduled === 'true') return;
    document.documentElement.dataset.visualizationsBootScheduled = 'true';

    /* Keep article mutation out of MathJax's scan/typeset window, and let the
       browser paint the reading shell before running the article-specific text
       searches. Previously the same integration pass ran at DOMContentLoaded,
       math-ready and window.load, repeatedly scanning very long guided posts. */
    window.requestAnimationFrame(function () {
      window.setTimeout(bootVisualizations, 0);
    });
  }

  function boot() {
    if (!document.querySelector('.post-page--guided')) {
      initTocSpy(buildToc());
    }
    
    
    initImageLightbox();

    if (document.getElementById('MathJax-script') &&
        document.documentElement.dataset.mathReady !== 'true') {
      document.addEventListener('lahav:math-ready', scheduleVisualizationBoot, { once: true });
      /* CDN failure should not permanently suppress otherwise-static diagrams. */
      window.setTimeout(scheduleVisualizationBoot, 5000);
    } else {
      scheduleVisualizationBoot();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else boot();
}());
