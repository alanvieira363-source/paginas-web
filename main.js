/* =====================================================================
   JEROME · main.js
   Todo el comportamiento de la web. No hace falta tocar este archivo
   para cambiar textos: eso se hace en lib/manifest.js.
   Cada bloque va envuelto en safe(): si uno falla, el resto sigue vivo.
   ===================================================================== */
(function () {
  'use strict';

  var D = document, W = window, root = D.documentElement;
  var DATA = W.__JEROME__ || null;
  var hasGSAP = !!(W.gsap && W.ScrollTrigger);
  if (hasGSAP) { try { W.gsap.registerPlugin(W.ScrollTrigger); } catch (e) { hasGSAP = false; } }

  function safe(fn, name) {
    try { fn(); } catch (e) { if (W.console) console.warn('[Jerome] "' + name + '" falló:', e); }
  }
  function $(s, c) { return (c || D).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function mm(q) { return !!(W.matchMedia && W.matchMedia(q).matches); }
  var finePointer = mm('(hover: hover) and (pointer: fine)');

  /*<render>*/
  // Plantillas HTML: las usa la web para pintar el contenido de lib/manifest.js
  var R = {};
  R.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  R.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  R.GLASS_NAMES = {
    coupe: 'Copa coupe', highball: 'Vaso highball', martini: 'Copa martini', old_fashioned: 'Vaso old fashioned',
    rocks: 'Vaso rocks', wine: 'Copa de vino', flute: 'Copa flauta', mug: 'Taza pequeña', snifter: 'Copa balón',
    hurricane: 'Copa hurricane'
  };
  R.cocktail = function (c, i, n) {
    var e = R.esc, casa = /casa/i.test(c.series || '');
    var ing = (c.ingredients || []).map(function (x, k) {
      return '<li style="--k:' + k + '"><span>' + R.pad(k + 1) + '</span>' + e(x) + '</li>';
    }).join('');
    return '' +
      '<article class="cocktail' + (casa ? ' cocktail--casa' : '') + '" data-index="' + i + '" style="--accent:' + e(c.accent || '#FF3D8B') + ';--liquid:' + e(c.liquid || '#7a2a1c') + '" aria-label="' + e(c.name) + ', ' + (i + 1) + ' de ' + n + '">' +
        '<span class="cocktail__num" aria-hidden="true">' + R.pad(i + 1) + '</span>' +
        '<div class="cocktail__stage" data-cursor="girar">' +
          '<svg class="glass" data-glass="' + e(c.glass || 'coupe') + '" viewBox="0 0 400 520" role="img" aria-label="Dibujo de ' + e((R.GLASS_NAMES[c.glass] || 'copa').toLowerCase()) + ' con ' + e(c.name) + '"></svg>' +
          '<span class="cocktail__glassname">' + e(R.GLASS_NAMES[c.glass] || 'Copa') + '</span>' +
        '</div>' +
        '<div class="cocktail__body">' +
          '<p class="cocktail__series"><span class="tag' + (casa ? ' tag--casa' : '') + '">' + e(c.series || '') + '</span><span class="cocktail__count">' + R.pad(i + 1) + ' / ' + R.pad(n) + '</span></p>' +
          '<h3 class="cocktail__name">' + e(c.name) + '</h3>' +
          '<p class="cocktail__sub">' + e(c.subtitle || '') + '</p>' +
          '<ul class="cocktail__ing" aria-label="Ingredientes">' + ing + '</ul>' +
          '<p class="cocktail__desc">' + e(c.description || '') + '</p>' +
        '</div>' +
      '</article>';
  };
  R.ICONS = {
    vinyl: '<svg viewBox="0 0 48 48" class="ico ico--vinyl"><g class="spin"><circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="15" opacity=".45"/><circle cx="24" cy="24" r="11" opacity=".3"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="1.4" class="fill"/><path d="M12 13a16 16 0 0 1 9-5" opacity=".8"/></g></svg>',
    house: '<svg viewBox="0 0 48 48" class="ico ico--house"><path d="M6 22 24 7l18 15v19H6z"/><g class="eq"><rect x="14" y="26" width="3.5" height="11" rx="1"/><rect x="20" y="22" width="3.5" height="15" rx="1"/><rect x="26" y="28" width="3.5" height="9" rx="1"/><rect x="32" y="24" width="3.5" height="13" rx="1"/></g></svg>',
    disco: '<svg viewBox="0 0 48 48" class="ico ico--disco"><path d="M24 2v8"/><circle cx="24" cy="27" r="15"/><g class="mer"><ellipse cx="24" cy="27" rx="7" ry="15"/><ellipse cx="24" cy="27" rx="12" ry="15" opacity=".5"/></g><path d="M9.5 22h29M9 27h30M9.5 32h29M12 17.5h24M12 36.5h24" opacity=".6"/><path class="spark" d="M41 8v6M38 11h6"/></svg>',
    wave: '<svg viewBox="0 0 48 48" class="ico ico--wave"><path class="w1" d="M2 24c4-9 8-9 11 0s7 9 11 0 7-9 11 0 7 9 11 0"/><path class="w2" d="M2 32c4-5 8-5 11 0s7 5 11 0 7-5 11 0 7 5 11 0" opacity=".45"/></svg>'
  };
  R.session = function (s, i) {
    var e = R.esc;
    return '' +
      '<li class="session reveal" style="--accent:' + e(s.accent || '#C9A35B') + ';--d:' + (i * 90) + 'ms" data-day="' + e(s.day) + '" data-cursor="oír">' +
        '<span class="session__icon" aria-hidden="true">' + (R.ICONS[s.icon] || R.ICONS.wave) + '</span>' +
        '<span class="session__idx">' + R.pad(i + 1) + '</span>' +
        '<h3 class="session__day">' + e(s.day) + '</h3>' +
        '<p class="session__genre">' + e(s.genre) + '</p>' +
        '<p class="session__note">' + e(s.note) + '</p>' +
        '<span class="session__tonight">Esta noche</span>' +
      '</li>';
  };
  R.shot = function (g, dupe) {
    var e = R.esc;
    return '<figure class="shot"' + (dupe ? ' aria-hidden="true"' : '') + ' data-cursor="mirar">' +
      '<img src="' + e(g.src) + '" alt="' + (dupe ? '' : e(g.alt || '')) + '" loading="lazy" decoding="async">' +
      '<figcaption>' + e(g.tag || '') + '</figcaption></figure>';
  };
  R.galleryRows = function (list) {
    var rows = [[], [], []];
    (list || []).forEach(function (g, i) { rows[i % 3].push(g); });
    return rows.map(function (r) {
      var a = r.map(function (g) { return R.shot(g, false); }).join('');
      var b = r.map(function (g) { return R.shot(g, true); }).join('');
      return a + b;
    });
  };
  R.ingredients = function (list) {
    var seen = {}, out = [];
    (list || []).forEach(function (c) {
      (c.ingredients || []).forEach(function (x) { var k = x.toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(x); } });
    });
    var one = out.map(function (x) { return '<span>' + R.esc(x) + '</span><i>✦</i>'; }).join('');
    return '<div class="ing-marquee__run">' + one + '</div><div class="ing-marquee__run" aria-hidden="true">' + one + '</div>';
  };
  /*</render>*/

  /* ------------------------------------------------------------------
     1. SPLASH · doble red: CSS lo oculta solo a los 4.5s; aquí lo
        quitamos en cuanto la página está lista.
     ------------------------------------------------------------------ */
  var readyDone = false;
  function ready() {
    if (readyDone) return; readyDone = true;
    var sp = $('.splash');
    if (sp) { sp.classList.add('is-done'); setTimeout(function () { sp.setAttribute('hidden', ''); }, 900); }
    root.classList.add('is-ready');
    if (hasGSAP) setTimeout(function () { safe(function () { W.ScrollTrigger.refresh(); }, 'refresh'); }, 120);
  }
  safe(function () {
    root.classList.add('js-ready');
    var t0 = Date.now();
    function go() { setTimeout(ready, Math.max(0, 1500 - (Date.now() - t0))); }
    if (D.readyState === 'complete') go(); else W.addEventListener('load', go);
    setTimeout(ready, 3200);           // aunque alguna imagen tarde, no esperamos más
  }, 'splash');
  setTimeout(ready, 4600);             // última red, fuera de cualquier try

  /* ------------------------------------------------------------------
     2. DATOS DE MARCA (lib/manifest.js → elementos con data-b-*)
     ------------------------------------------------------------------ */
  function waLink(text) {
    var num = (DATA && DATA.brand && DATA.brand.whatsapp) || '5491164723635';
    return 'https://wa.me/' + String(num).replace(/\D/g, '') + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  safe(function () {
    if (!DATA || !DATA.brand) return;
    var b = DATA.brand;
    $$('[data-b-text]').forEach(function (el) {
      var v = b[el.getAttribute('data-b-text')];
      if (v != null && v !== '') el.textContent = v;
    });
    $$('[data-b-tel]').forEach(function (el) { if (b.phoneLink) el.setAttribute('href', 'tel:' + b.phoneLink); });
    $$('[data-b-wa]').forEach(function (el) {
      el.setAttribute('href', waLink((el.getAttribute('data-b-wa') || '').replace(/\{name\}/g, b.name || 'Jerome')));
    });
    $$('[data-b-ig]').forEach(function (el) { if (b.instagram) el.setAttribute('href', 'https://www.instagram.com/' + b.instagram + '/'); });
    $$('[data-b-ig-text]').forEach(function (el) { if (b.instagram) el.textContent = '@' + b.instagram; });
    $$('[data-b-map]').forEach(function (el) {
      if (b.mapQuery) el.setAttribute('src', 'https://www.google.com/maps?q=' + encodeURIComponent(b.mapQuery) + '&output=embed');
    });
    $$('[data-b-maplink]').forEach(function (el) {
      if (b.mapQuery) el.setAttribute('href', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(b.mapQuery));
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }, 'brand');

  /* ------------------------------------------------------------------
     3. MONTAJE DE CONTENIDO (idempotente)
     ------------------------------------------------------------------ */
  function mount(target, html) {
    if (!target || target.getAttribute('data-mounted') === '1') return false;
    target.innerHTML = html;
    target.setAttribute('data-mounted', '1');
    return true;
  }
  safe(function () {
    if (!DATA || !DATA.cocktails || !DATA.cocktails.length) return;
    var n = DATA.cocktails.length;
    mount($('[data-mount="cocktails"]'), DATA.cocktails.map(function (c, i) { return R.cocktail(c, i, n); }).join(''));
    mount($('[data-mount="ingredients"]'), R.ingredients(DATA.cocktails));
    $$('[data-total]').forEach(function (el) { el.textContent = R.pad(n); });
  }, 'mount-cocktails');
  safe(function () {
    if (!DATA || !DATA.sessions || !DATA.sessions.length) return;
    mount($('[data-mount="sessions"]'), DATA.sessions.map(R.session).join(''));
  }, 'mount-sessions');
  safe(function () {
    if (!DATA || !DATA.gallery || !DATA.gallery.length) return;
    var rows = R.galleryRows(DATA.gallery);
    $$('[data-mount^="gallery-"]').forEach(function (el, i) { if (rows[i]) mount(el, rows[i]); });
  }, 'mount-gallery');

  /* ------------------------------------------------------------------
     4. COPAS 3D POLIGONALES (SVG puro, sin librerías)
        Cada copa es un torno low-poly: un perfil que gira sobre su eje,
        proyectado en 3D, que se traza solo y se llena de líquido.
     ------------------------------------------------------------------ */
  var GLASSES = {
    coupe:         { p: [[.42, 0], [.42, .02], [.07, .05], [.045, .1], [.04, .4], [.07, .46], [.3, .52], [.5, .6], [.58, .68], [.6, .72]], seg: 14, liq: [.47, .665], x: ['cube1'] },
    highball:      { p: [[.3, 0], [.33, .04], [.33, .3], [.335, .6], [.34, .9], [.345, 1.18]], seg: 12, liq: [.05, .98], x: ['ice3', 'spiral', 'bubbles'] },
    martini:       { p: [[.4, 0], [.4, .02], [.06, .05], [.04, .12], [.035, .45], [.07, .49], [.32, .7], [.66, .98]], seg: 14, liq: [.5, .9], x: ['foam', 'beans'] },
    old_fashioned: { p: [[.42, 0], [.45, .07], [.46, .25], [.47, .42], [.48, .58]], seg: 12, liq: [.08, .44], x: ['cube1', 'peel'] },
    rocks:         { p: [[.4, 0], [.43, .05], [.44, .22], [.45, .46]], seg: 8, liq: [.06, .36], x: ['cube1', 'peel'] },
    wine:          { p: [[.38, 0], [.38, .02], [.06, .05], [.04, .12], [.035, .36], [.09, .4], [.27, .46], [.37, .56], [.39, .68], [.35, .84], [.31, .94]], seg: 14, liq: [.41, .64], x: ['ice2', 'bubbles'] },
    flute:         { p: [[.3, 0], [.3, .02], [.05, .05], [.035, .12], [.03, .4], [.08, .44], [.14, .5], [.17, .64], [.18, .82], [.17, 1.02], [.165, 1.14]], seg: 12, liq: [.45, .96], x: ['bubbles'] },
    mug:           { p: [[.44, -.04], [.5, 0], [.33, 0], [.34, .04], [.36, .3], [.37, .48], [.38, .52]], seg: 12, liq: [.05, .44], x: ['handle', 'cream'], pad: .1 },
    snifter:       { p: [[.32, 0], [.32, .02], [.06, .05], [.045, .16], [.13, .2], [.36, .3], [.46, .42], [.47, .55], [.4, .7], [.3, .8]], seg: 14, liq: [.21, .42], x: ['foam', 'drops'] },
    hurricane:     { p: [[.32, 0], [.32, .02], [.07, .05], [.065, .14], [.2, .2], [.3, .32], [.27, .5], [.2, .62], [.23, .8], [.33, .98], [.36, 1.12]], seg: 14, liq: [.17, 1.0], x: ['ice3', 'lime'], pad: .08 }
  };
  var TAU = Math.PI * 2, NS = 'http://www.w3.org/2000/svg', uid = 0;

  function hex2rgb(h) {
    h = String(h || '#888').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    var x = hex2rgb(a), y = hex2rgb(b);
    return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(x[i] + (y[i] - x[i]) * t); }).join(',') + ')';
  }
  function easeIO(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeO(t) { return 1 - Math.pow(1 - t, 3); }
  function f1(n) { return (Math.round(n * 10) / 10); }
  function el(tag, attrs, parent) {
    var e = D.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function hull(pts) {
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    if (pts.length < 3) return pts;
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }
  function poly(pts) {
    if (!pts.length) return '';
    var s = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (var i = 1; i < pts.length; i++) s += 'L' + f1(pts[i][0]) + ' ' + f1(pts[i][1]);
    return s + 'Z';
  }

  function Glass(svg, accent, liquid, opts) {
    opts = opts || {};
    this.svg = svg;
    this.def = GLASSES[svg.getAttribute('data-glass')] || GLASSES.coupe;
    this.accent = accent; this.liquid = liquid;
    this.rot = opts.rot != null ? opts.rot : Math.random() * TAU;
    this.tilt = .3; this.tTilt = .3; this.boost = 0; this.tBoost = 0;
    this.draw = 0; this.fill = 0; this.started = null; this.visible = false;
    this.speed = opts.speed || .32;
    this.id = 'g' + (++uid);
    this.build();
  }
  Glass.prototype.build = function () {
    var svg = this.svg, d = this.def, id = this.id;
    if (svg.getAttribute('data-built') === '1') return;
    svg.setAttribute('data-built', '1');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = el('defs', {}, svg);
    var lg = el('linearGradient', { id: id + 'l', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': mix(this.liquid, this.accent, .35), 'stop-opacity': .95 }, lg);
    el('stop', { offset: .55, 'stop-color': this.liquid, 'stop-opacity': .9 }, lg);
    el('stop', { offset: 1, 'stop-color': mix(this.liquid, '#000000', .45), 'stop-opacity': .95 }, lg);
    var sg = el('linearGradient', { id: id + 's', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    el('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0 }, sg);
    el('stop', { offset: .16, 'stop-color': '#fff', 'stop-opacity': .32 }, sg);
    el('stop', { offset: .3, 'stop-color': '#fff', 'stop-opacity': 0 }, sg);
    el('stop', { offset: .86, 'stop-color': '#fff', 'stop-opacity': 0 }, sg);
    el('stop', { offset: .93, 'stop-color': '#fff', 'stop-opacity': .14 }, sg);
    el('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }, sg);
    var rg = el('radialGradient', { id: id + 'r' }, defs);
    el('stop', { offset: 0, 'stop-color': this.accent, 'stop-opacity': .55 }, rg);
    el('stop', { offset: 1, 'stop-color': this.accent, 'stop-opacity': 0 }, rg);
    var fl = el('filter', { id: id + 'f', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
    el('feGaussianBlur', { stdDeviation: 2.4, result: 'b' }, fl);
    var fm = el('feMerge', {}, fl);
    el('feMergeNode', { in: 'b' }, fm); el('feMergeNode', { in: 'SourceGraphic' }, fm);

    // geometría
    var P = d.p, H = -1e9, Y0 = 1e9, Rm = 0;
    P.forEach(function (p) { H = Math.max(H, p[1]); Y0 = Math.min(Y0, p[1]); Rm = Math.max(Rm, p[0]); });
    var e = .42, R0 = P[0][0], Rt = P[P.length - 1][0], Reff = Rm + (d.pad || 0);
    var s = Math.min(420 / ((H - Y0) * Math.cos(e) + (R0 + Rt) * Math.sin(e)), 330 / (2 * Reff));
    this.s = s; this.cx = 200;
    var spanH = (H - Y0) * s * Math.cos(.3) + (R0 + Rt) * s * Math.sin(.3);
    var bottom = 260 + spanH / 2 + 6;
    this.baseY = bottom + Y0 * s * Math.cos(.3) - R0 * s * Math.sin(.3);
    this.H = H; this.Rm = Rm;

    // aristas del torno en orden de trazado (de abajo arriba)
    var edges = [], L = P.length, N = d.seg, i, k;
    for (i = 0; i < L; i++) {
      if (P[i][0] > .005) for (k = 0; k < N; k++) edges.push([i, k, i, (k + 1) % N]);
      if (i < L - 1) for (k = 0; k < N; k++) edges.push([i, k, i + 1, k]);
    }
    this.edges = edges;
    // extras en coordenadas polares [r, theta, y]
    var ex = this.ex = { lines: [], glassLines: [] };
    var top = P[L - 1], self = this;
    d.x.forEach(function (x) {
      var pts = [], t, n;
      if (x === 'handle') {
        for (n = 0; n <= 14; n++) { t = n / 14 * Math.PI; pts.push([.37 + .16 * Math.sin(t), 0, .27 + .17 * Math.cos(t)]); }
        ex.glassLines.push(pts);
        var pts2 = pts.map(function (p, n2) { var t2 = n2 / 14 * Math.PI; return [.37 + .11 * Math.sin(t2), 0, .27 + .12 * Math.cos(t2)]; });
        ex.glassLines.push(pts2);
      } else if (x === 'spiral') {
        for (n = 0; n <= 60; n++) { t = n / 60; pts.push([.2, t * 3.4 * TAU, d.liq[1] - .04 - t * (d.liq[1] - d.liq[0] - .1)]); }
        ex.lines.push({ pts: pts, color: '#ff9e6e', w: 3 });
      } else if (x === 'peel') {
        for (n = 0; n <= 24; n++) { t = n / 24; pts.push([top[0] * 1.02 + .02 * Math.sin(t * 9), -.5 + t * 1.6, top[1] - .03 - .09 * t]); }
        ex.lines.push({ pts: pts, color: '#ff8a2a', w: 4.5 });
      } else if (x === 'lime') {
        var cr = top[0] * .96, cy = top[1] + .02;
        for (n = 0; n <= 14; n++) { t = n / 14 * TAU; pts.push([cr + .14 * Math.cos(t), .9, cy + .14 * Math.sin(t)]); }
        ex.lines.push({ pts: pts, color: '#b6e35a', w: 3 });
        for (n = 0; n < 5; n++) { t = n / 5 * Math.PI; ex.lines.push({ pts: [[cr + .12 * Math.cos(t), .9, cy + .12 * Math.sin(t)], [cr - .12 * Math.cos(t), .9, cy - .12 * Math.sin(t)]], color: '#b6e35a', w: 1.2 }); }
      }
    });
    this.cubes = [];
    var ncube = d.x.indexOf('cube1') > -1 ? 1 : d.x.indexOf('ice2') > -1 ? 2 : d.x.indexOf('ice3') > -1 ? 3 : 0;
    for (i = 0; i < ncube; i++) {
      var yc = d.liq[0] + (d.liq[1] - d.liq[0]) * (ncube === 1 ? .5 : .28 + i * .26);
      var rr = this.rOf(yc);
      var depth = d.liq[1] - d.liq[0];
      this.cubes.push({ r: ncube === 1 ? 0 : rr * .32, th: i * 2.2, y: yc, h: Math.min(rr * (ncube === 1 ? .5 : .38), depth * (ncube === 1 ? .36 : .14)), spin: i * .9 });
    }

    // capas
    el('ellipse', { cx: 200, cy: bottom - 4, rx: Rm * s * 1.25, ry: Rm * s * .32, fill: 'url(#' + id + 'r)', class: 'g-floor' }, svg);
    this.gBack = el('path', { class: 'g-wire g-wire--back' }, svg);
    this.gLiq = el('g', { class: 'g-liquid' }, svg);
    this.gBody = el('path', { fill: 'url(#' + id + 'l)' }, this.gLiq);
    this.gIce = el('path', { class: 'g-ice' }, this.gLiq);
    this.gSpec = el('path', { fill: 'url(#' + id + 's)' }, this.gLiq);
    this.gTop = el('path', { class: 'g-top', fill: mix(this.liquid, '#ffffff', .22), stroke: this.accent }, this.gLiq);
    this.gFoam = el('path', { class: 'g-foam' }, this.gLiq);
    this.gDots = el('path', { class: 'g-dots' }, this.gLiq);
    this.gFront = el('path', { class: 'g-wire g-wire--front', stroke: this.accent }, svg);
    this.gSil = el('path', { class: 'g-sil', stroke: this.accent, filter: 'url(#' + id + 'f)' }, svg);
    this.gExtra = el('g', { class: 'g-extra' }, svg);
    this.gLines = ex.lines.map(function (l) { return el('path', { stroke: l.color, 'stroke-width': l.w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, self.gExtra); });
    // burbujas: suben por CSS
    if (d.x.indexOf('bubbles') > -1) {
      var bg = el('g', { class: 'g-bubbles' }, this.gLiq);
      var yb = this.baseY - d.liq[0] * s * Math.cos(.3), yt = this.baseY - d.liq[1] * s * Math.cos(.3);
      var rb = this.rOf(d.liq[0] + .05) * s;
      bg.setAttribute('style', '--rise:' + f1(yt - yb + 6) + 'px');
      for (i = 0; i < 16; i++) {
        el('circle', { cx: f1(200 + (Math.random() * 2 - 1) * rb * .7), cy: f1(yb - 4), r: f1(1 + Math.random() * 2.2), style: 'animation-delay:-' + f1(Math.random() * 4) + 's;animation-duration:' + f1(2.4 + Math.random() * 2.4) + 's' }, bg);
      }
    }
    this.render();
  };
  Glass.prototype.rOf = function (y) {
    var P = this.def.p;
    for (var j = P.length - 2; j >= 0; j--) {
      var a = P[j], b = P[j + 1], lo = Math.min(a[1], b[1]), hi = Math.max(a[1], b[1]);
      if (y >= lo && y <= hi && hi > lo) return (a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])) * .9;
    }
    return P[P.length - 1][0] * .9;
  };
  Glass.prototype.proj = function (r, th, y) {
    var a = th + this.rot, x = r * Math.cos(a), z = r * Math.sin(a);
    return [this.cx + x * this.s, this.baseY - y * this.s * this.ce + z * this.s * this.se, z];
  };
  Glass.prototype.projXYZ = function (X, Y, Z) {
    var ca = Math.cos(this.rot), sa = Math.sin(this.rot);
    var x = X * ca - Z * sa, z = X * sa + Z * ca;
    return [this.cx + x * this.s, this.baseY - Y * this.s * this.ce + z * this.s * this.se, z];
  };
  Glass.prototype.render = function () {
    var d = this.def, P = d.p, N = d.seg, L = P.length, self = this, i, k;
    this.ce = Math.cos(this.tilt); this.se = Math.sin(this.tilt);
    var V = [];
    for (i = 0; i < L; i++) {
      var ring = [];
      for (k = 0; k < N; k++) ring.push(this.proj(P[i][0], k / N * TAU, P[i][1]));
      V.push(ring);
    }
    // alambre: progresión de trazado
    var E = this.edges, n = this.draw * E.length, front = '', back = '';
    for (var j = 0; j < E.length; j++) {
      var f = clamp(n - j, 0, 1); if (f <= 0) break;
      var A = V[E[j][0]][E[j][1]], B = V[E[j][2]][E[j][3]];
      var bx = A[0] + (B[0] - A[0]) * f, by = A[1] + (B[1] - A[1]) * f;
      var seg = 'M' + f1(A[0]) + ' ' + f1(A[1]) + 'L' + f1(bx) + ' ' + f1(by);
      if ((A[2] + B[2]) > -.01) front += seg; else back += seg;
    }
    // asa (mug) y otras piezas de cristal
    if (this.draw > .9) this.ex.glassLines.forEach(function (pts) {
      var q = pts.map(function (p) { return self.proj(p[0], p[1], p[2]); });
      var sgm = 'M' + q.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L');
      if (q[7][2] > 0) front += sgm; else back += sgm;
    });
    this.gFront.setAttribute('d', front);
    this.gBack.setAttribute('d', back);
    // silueta
    var lvl = Math.min(L, this.draw * L * 1.05), left = [], right = [];
    for (i = 0; i < L && i < lvl; i++) {
      var mn = 1e9, mx = -1e9, yy = this.baseY - P[i][1] * this.s * this.ce;
      for (k = 0; k < N; k++) { mn = Math.min(mn, V[i][k][0]); mx = Math.max(mx, V[i][k][0]); }
      left.push([mn, yy]); right.push([mx, yy]);
    }
    var sil = '';
    if (left.length > 1) {
      sil = 'M' + left.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') +
            'M' + right.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L');
    }
    this.gSil.setAttribute('d', sil);

    // líquido
    var fe = easeO(this.fill);
    if (fe > .001) {
      var y0 = d.liq[0], yT = y0 + (d.liq[1] - y0) * fe, K = 7, rings = [], body = '';
      for (i = 0; i <= K; i++) {
        var y = y0 + (yT - y0) * i / K, r = this.rOf(y), rr = [];
        for (k = 0; k < N; k++) rr.push(this.proj(r, k / N * TAU, y));
        rings.push(rr);
      }
      for (i = 0; i < K; i++) body += poly(hull(rings[i].concat(rings[i + 1])));
      this.gBody.setAttribute('d', body);
      this.gSpec.setAttribute('d', body);
      var topRing = rings[K];
      this.gTop.setAttribute('d', poly(topRing));
      // espuma / crema
      if (d.x.indexOf('foam') > -1 || d.x.indexOf('cream') > -1) {
        var fy = yT + .025, fr = this.rOf(Math.min(fy, d.liq[1])) * 1.02, fp = [];
        for (k = 0; k < N; k++) fp.push(this.proj(fr, k / N * TAU, fy));
        this.gFoam.setAttribute('d', poly(hull(fp.concat(topRing))) + poly(fp));
        this.gFoam.setAttribute('fill', d.x.indexOf('cream') > -1 ? '#efe3cf' : (this.def === GLASSES.martini ? '#b8743a' : '#f1ead8'));
      }
      // granos de café / gotas de amargo
      var dots = '';
      if (fe > .95 && (d.x.indexOf('beans') > -1 || d.x.indexOf('drops') > -1)) {
        var beans = d.x.indexOf('beans') > -1;
        for (k = 0; k < 3; k++) {
          var c = this.proj(this.rOf(yT) * .35, k * 2.1 + .4, yT + .03);
          var rx = beans ? 7 : 3.4, ry = beans ? 4 : 2.2;
          dots += 'M' + f1(c[0] - rx) + ' ' + f1(c[1]) + 'a' + rx + ' ' + ry + ' 0 1 0 ' + (2 * rx) + ' 0a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0Z';
        }
        this.gDots.setAttribute('fill', beans ? '#2a1208' : '#8a1a12');
      }
      this.gDots.setAttribute('d', dots);
      // hielo: cubos 3D girando dentro del líquido
      var ice = '';
      if (fe > .35) this.cubes.forEach(function (cb) {
        var cx = cb.r * Math.cos(cb.th), cz = cb.r * Math.sin(cb.th), h = cb.h, sp = cb.spin + self.rot * .35;
        var cs = Math.cos(sp), sn = Math.sin(sp), vs = [];
        [-1, 1].forEach(function (yy2) { [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
          var lx = q[0] * h, lz = q[1] * h;
          vs.push(self.projXYZ(cx + lx * cs - lz * sn, cb.y + yy2 * h * .95, cz + lx * sn + lz * cs));
        }); });
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e2) {
          ice += 'M' + f1(vs[e2[0]][0]) + ' ' + f1(vs[e2[0]][1]) + 'L' + f1(vs[e2[1]][0]) + ' ' + f1(vs[e2[1]][1]);
        });
      });
      this.gIce.setAttribute('d', ice);
      this.gIce.style.opacity = clamp((fe - .35) * 2, 0, 1);
    } else {
      this.gBody.setAttribute('d', ''); this.gSpec.setAttribute('d', ''); this.gTop.setAttribute('d', '');
    }
    // guarniciones
    var gx = clamp((this.fill - .55) * 2.4, 0, 1);
    this.ex.lines.forEach(function (l, li) {
      var m = Math.max(2, Math.round(l.pts.length * gx));
      var q = l.pts.slice(0, m).map(function (p) { return self.proj(p[0], p[1], p[2]); });
      self.gLines[li].setAttribute('d', gx > 0 ? 'M' + q.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') : '');
    });
    this.svg.classList.toggle('is-full', this.fill >= 1);
  };
  Glass.prototype.start = function () { if (this.started == null) { this.started = -1; kick(); } };
  Glass.prototype.tick = function (dt, now) {
    if (this.started === -1) this.started = now;
    if (this.started != null && this.started > 0) {
      var t = (now - this.started) / 1000;
      this.draw = easeIO(clamp(t / 2.6, 0, 1));
      this.fill = clamp((t - 1.7) / 1.8, 0, 1);
    }
    this.boost += (this.tBoost - this.boost) * Math.min(1, dt * 4);
    this.tilt += (this.tTilt - this.tilt) * Math.min(1, dt * 3);
    this.rot += dt * (this.speed + this.boost);
    this.render();
  };

  var glasses = [], running = false, lastT = 0;
  function loop(t) {
    var dt = lastT ? Math.min(.05, (t - lastT) / 1000) : .016; lastT = t;
    var any = false;
    for (var i = 0; i < glasses.length; i++) if (glasses[i].visible || glasses[i].started === -1) { glasses[i].tick(dt, t); any = true; }
    if (any) W.requestAnimationFrame(loop); else { running = false; lastT = 0; }
  }
  function kick() { if (!running) { running = true; W.requestAnimationFrame(loop); } }

  safe(function () {
    var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var g = en.target.__glass; if (!g) return;
        g.visible = en.isIntersecting;
        if (en.isIntersecting) { g.start(); kick(); }
      });
    }, { threshold: 0.05, rootMargin: '0px 120px' }) : null;
    $$('svg.glass').forEach(function (svg) {
      var card = svg.closest('[style*="--accent"]') || svg.parentNode;
      var cs = W.getComputedStyle(card);
      var accent = (cs.getPropertyValue('--accent') || '#FF3D8B').trim();
      var liquid = (cs.getPropertyValue('--liquid') || '#7a2a1c').trim();
      var g = new Glass(svg, accent, liquid, { speed: svg.hasAttribute('data-speed') ? +svg.getAttribute('data-speed') : null });
      svg.__glass = g; glasses.push(g);
      if (io) io.observe(svg); else { g.visible = true; g.start(); }
      var stage = svg.parentNode;
      if (finePointer && stage) {
        stage.addEventListener('pointermove', function (e) {
          var b = stage.getBoundingClientRect();
          var px = (e.clientX - b.left) / b.width - .5, py = (e.clientY - b.top) / b.height - .5;
          g.tTilt = clamp(.3 + py * .5, .05, .62); g.tBoost = px * 2.4;
        });
        stage.addEventListener('pointerleave', function () { g.tTilt = .3; g.tBoost = 0; });
      }
    });
    kick();
  }, 'glasses');

  /* ------------------------------------------------------------------
     5. CARRUSEL DE CÓCTELES: pin + scroll horizontal (escritorio)
        o deslizar con el dedo (móvil)
     ------------------------------------------------------------------ */
  safe(function () {
    var sec = $('.cocktails'); if (!sec) return;
    var track = $('.cocktails__track', sec), cards = $$('.cocktail', sec), n = cards.length;
    if (!track || !n) return;
    var cur = $('[data-cur]', sec), bar = $('.progress__bar i', sec), ing = $('.ing-marquee', sec);
    var active = -1, st = null;
    function setActive(i) {
      i = clamp(i, 0, n - 1);
      if (i === active) return; active = i;
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      if (cur) cur.textContent = R.pad(i + 1);
      var g = $('svg.glass', cards[i]); if (g && g.__glass) g.__glass.start();
    }
    function setProgress(p) {
      if (bar) bar.style.transform = 'scaleX(' + (1 / n + p * (1 - 1 / n)).toFixed(4) + ')';
      if (ing) ing.style.setProperty('--shift', (p * 22).toFixed(2) + 'vw');
    }
    setActive(0); setProgress(0);

    var desktop = hasGSAP && mm('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    if (desktop) {
      sec.classList.add('is-pinned');
      var dist = function () { return Math.max(0, track.scrollWidth - W.innerWidth); };
      var tween = W.gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: sec, pin: true, scrub: .7, start: 'top top',
          end: function () { return '+=' + dist(); },
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: .25, max: .7 }, delay: .08, ease: 'power2.inOut' },
          onUpdate: function (self) { setProgress(self.progress); setActive(Math.round(self.progress * (n - 1))); }
        }
      });
      st = tween.scrollTrigger;
    } else {
      var raf = 0;
      track.addEventListener('scroll', function () {
        if (raf) return;
        raf = W.requestAnimationFrame(function () {
          raf = 0;
          var max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
          setProgress(p); setActive(Math.round(p * (n - 1)));
        });
      }, { passive: true });
    }
    function go(dir) {
      var i = clamp(active + dir, 0, n - 1);
      if (st) {
        W.scrollTo({ top: st.start + (st.end - st.start) * i / (n - 1), behavior: 'smooth' });
      } else {
        var c = cards[i]; track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
      }
    }
    $$('[data-carousel]', sec).forEach(function (b) {
      b.addEventListener('click', function () { go(+b.getAttribute('data-carousel')); });
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
  }, 'carousel');

  /* ------------------------------------------------------------------
     6. NAVEGACIÓN
     ------------------------------------------------------------------ */
  safe(function () {
    var nav = $('.nav'), burger = $('.nav__burger'), menu = $('.menu');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-scrolled', W.scrollY > 40); };
    W.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    function setOpen(open) {
      root.classList.toggle('menu-open', open);
      if (burger) { burger.setAttribute('aria-expanded', open ? 'true' : 'false'); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); }
      if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (burger) burger.addEventListener('click', function () { setOpen(!root.classList.contains('menu-open')); });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    // enlace activo
    if ('IntersectionObserver' in W) {
      var links = $$('.nav__links a');
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + id); });
          var tone = en.target.getAttribute('data-tone'); if (tone) root.setAttribute('data-tone', tone);
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      $$('main section[id]').forEach(function (s) { io.observe(s); });
    }
  }, 'nav');

  /* ------------------------------------------------------------------
     7. CURSOR PERSONALIZADO (solo ratón)
     ------------------------------------------------------------------ */
  safe(function () {
    var cur = $('.cursor'); if (!cur || !finePointer) return;
    root.classList.add('has-cursor');
    var label = $('.cursor__label', cur), ring = $('.cursor__ring', cur), dot = $('.cursor__dot', cur);
    var x = -100, y = -100, rx = x, ry = y, shown = false;
    W.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; cur.classList.add('is-visible'); }
    }, { passive: true });
    D.addEventListener('pointerleave', function () { shown = false; cur.classList.remove('is-visible'); });
    D.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    D.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    D.addEventListener('pointerover', function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      var field = t.closest('input, textarea, select');
      var hit = t.closest('[data-cursor], a, button, label');
      cur.classList.toggle('is-text', !!field);
      cur.classList.toggle('is-hover', !!hit && !field);
      var txt = hit && hit.getAttribute('data-cursor');
      if (!txt && hit) txt = hit.tagName === 'A' || hit.tagName === 'BUTTON' ? 'ver' : '';
      label.textContent = txt || '';
      cur.classList.toggle('has-label', !!txt && !field);
    });
    (function frame() {
      rx += (x - rx) * .2; ry += (y - ry) * .2;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      W.requestAnimationFrame(frame);
    })();
  }, 'cursor');

  /* ------------------------------------------------------------------
     8. AURORA REACTIVA
     ------------------------------------------------------------------ */
  safe(function () {
    var a = $('.aurora'); if (!a) return;
    var tx = .5, ty = .5, cx = .5, cy = .5, sy = 0;
    W.addEventListener('pointermove', function (e) { tx = e.clientX / W.innerWidth; ty = e.clientY / W.innerHeight; }, { passive: true });
    (function frame() {
      cx += (tx - cx) * .03; cy += (ty - cy) * .03;
      sy += ((W.scrollY || 0) - sy) * .08;
      a.style.setProperty('--mx', ((cx - .5) * 8).toFixed(2) + 'vw');
      a.style.setProperty('--my', ((cy - .5) * 8).toFixed(2) + 'vh');
      a.style.setProperty('--sh', ((sy * .04) % 360).toFixed(1) + 'deg');
      W.requestAnimationFrame(frame);
    })();
  }, 'aurora');

  /* ------------------------------------------------------------------
     9. REVEALS · títulos por palabras + bloques que suben
        IntersectionObserver (threshold 0.05) + red de 6s
     ------------------------------------------------------------------ */
  var revealAll = function () {};
  safe(function () {
    // dividir títulos en palabras (respetando <em>, <br>)
    $$('[data-split]').forEach(function (h) {
      if (h.getAttribute('data-split-done')) return;
      var idx = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
          if (ch.nodeType === 3) {
            var parts = ch.textContent.split(/(\s+)/), frag = D.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(D.createTextNode(' ')); return; }
              var w = D.createElement('span'); w.className = 'w';
              var inner = D.createElement('span'); inner.textContent = p; inner.style.setProperty('--i', idx++);
              w.appendChild(inner); frag.appendChild(w);
            });
            node.replaceChild(frag, ch);
          } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
        });
      })(h);
      h.setAttribute('data-split-done', '1');
      h.classList.add('is-split');
    });
    var items = $$('.reveal, [data-split]');
    var show = function (el) { el.classList.add('is-in'); };
    revealAll = function (onlyAbove) {
      items.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        if (!onlyAbove || el.getBoundingClientRect().top < W.innerHeight) show(el);
      });
    };
    var fired = false;
    if ('IntersectionObserver' in W) {
      var io = new IntersectionObserver(function (ents) {
        fired = true;
        ents.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else revealAll(false);
    // red de seguridad: a los 6s, todo lo que siga oculto y ya esté a la vista
    // (o todo, si el observer nunca respondió) se muestra
    setTimeout(function () { revealAll(fired); }, 6000);
    W.addEventListener('scroll', function () { clearTimeout(W.__jrv); W.__jrv = setTimeout(function () { revealAll(true); }, 900); }, { passive: true });
  }, 'reveals');

  /* ------------------------------------------------------------------
     10. PARALLAX Y DETALLES CON GSAP
     ------------------------------------------------------------------ */
  safe(function () {
    if (!hasGSAP) return;
    var g = W.gsap;
    var heroImg = $('.hero__img');
    if (heroImg) g.to(heroImg, { yPercent: 14, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    var heroIn = $('.hero__inner');
    if (heroIn) g.to(heroIn, { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.watermark').forEach(function (w) {
      g.fromTo(w, { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: w.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.collage__item').forEach(function (it, i) {
      g.fromTo(it, { y: 40 + i * 30 }, { y: -40 - i * 30, ease: 'none', scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // las tiras de la galería se inclinan con la velocidad del scroll
    var rows = $$('.gallery__row');
    if (rows.length) {
      var skew = g.quickTo ? g.quickTo(rows, 'skewX', { duration: .5, ease: 'power3' }) : null;
      W.ScrollTrigger.create({
        trigger: '.gallery', start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) { if (skew) skew(clamp(self.getVelocity() / -260, -6, 6)); }
      });
    }
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { W.ScrollTrigger.refresh(); });
    W.addEventListener('load', function () { W.ScrollTrigger.refresh(); });
  }, 'parallax');

  /* ------------------------------------------------------------------
     11. MÚSICA · marca "Esta noche" (hora de Buenos Aires)
     ------------------------------------------------------------------ */
  function baNow() {
    var days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var day = new Date().getDay(), hour = new Date().getHours();
    try {
      var parts = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      parts.forEach(function (p) {
        if (p.type === 'weekday') { var k = days.indexOf(p.value.toLowerCase()); if (k > -1) day = k; }
        if (p.type === 'hour') hour = parseInt(p.value, 10);
      });
    } catch (e) {}
    return { day: day, hour: hour };
  }
  function norm(s) { return String(s).toLowerCase().normalize ? String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') : String(s).toLowerCase(); }
  safe(function () {
    var now = baNow(), d = now.hour < 6 ? (now.day + 6) % 7 : now.day;
    var names = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    $$('.session').forEach(function (s) {
      if (names.indexOf(norm(s.getAttribute('data-day'))) === d) s.classList.add('is-tonight');
    });
  }, 'tonight');

  /* ------------------------------------------------------------------
     12. EVENTOS PRIVADOS · tarjeta con inclinación suave
     ------------------------------------------------------------------ */
  safe(function () {
    var card = $('.private__card'); if (!card || !finePointer) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, on = false;
    card.addEventListener('pointermove', function (e) {
      var b = card.getBoundingClientRect();
      tx = ((e.clientX - b.left) / b.width - .5); ty = ((e.clientY - b.top) / b.height - .5);
      if (!on) { on = true; frame(); }
    });
    card.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
    function frame() {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      card.style.setProperty('--rx', (-cy * 6).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (cx * 8).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (50 + cx * 60).toFixed(1) + '%');
      card.style.setProperty('--gy', (50 + cy * 60).toFixed(1) + '%');
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > .001 || tx || ty) W.requestAnimationFrame(frame); else on = false;
    }
  }, 'tilt');

  /* ------------------------------------------------------------------
     13. FORMULARIO DE RESERVA → WhatsApp
     ------------------------------------------------------------------ */
  safe(function () {
    var form = $('#reserva-form'); if (!form) return;
    var date = form.elements['dia'], hint = $('.field__hint', form), err = $('.form__error', form);
    var openDays = (DATA && DATA.brand && DATA.brand.openDays) || [3, 4, 5, 6, 0];
    var dn = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var mn = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    function parse(v) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
    function nice(dt) { return dn[dt.getDay()] + ' ' + dt.getDate() + ' de ' + mn[dt.getMonth()]; }
    if (date) {
      var t = new Date(), iso = t.getFullYear() + '-' + R.pad(t.getMonth() + 1) + '-' + R.pad(t.getDate());
      date.setAttribute('min', iso);
      date.addEventListener('change', function () {
        var dt = parse(date.value);
        if (!hint) return;
        if (!dt) { hint.textContent = ''; return; }
        var closed = openDays.indexOf(dt.getDay()) === -1;
        hint.textContent = closed ? 'Ese día está cerrado: abrimos de miércoles a domingo.' : '→ ' + nice(dt) + (dt.getDay() >= 4 || dt.getDay() === 6 ? ' · se llena, buena idea reservar' : '');
        hint.classList.toggle('is-warn', closed);
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, name = (f['nombre'].value || '').trim(), tel = (f['telefono'].value || '').trim();
      var dt = parse(f['dia'].value), pax = f['personas'].value, note = (f['nota'].value || '').trim();
      var bad = [];
      if (!name) bad.push(f['nombre']);
      if (tel.replace(/\D/g, '').length < 6) bad.push(f['telefono']);
      if (!dt) bad.push(f['dia']);
      if (!pax) bad.push(f['personas']);
      $$('.field', form).forEach(function (x) { x.classList.remove('is-bad'); });
      bad.forEach(function (x) { var fl = x.closest('.field'); if (fl) fl.classList.add('is-bad'); });
      if (bad.length) { if (err) err.textContent = 'Te falta completar: ' + bad.map(function (x) { return x.getAttribute('data-label'); }).join(', ') + '.'; bad[0].focus(); return; }
      if (openDays.indexOf(dt.getDay()) === -1) { if (err) err.textContent = 'Ese día el bar está cerrado. Elegí de miércoles a domingo.'; f['dia'].focus(); return; }
      if (err) err.textContent = '';
      var brand = (DATA && DATA.brand && DATA.brand.name) || 'Jerome';
      var msg = '¡Hola ' + brand + '! Quiero reservar mesa 🍸\n\n' +
        '• Nombre: ' + name + '\n' +
        '• Teléfono: ' + tel + '\n' +
        '• Día: ' + nice(dt) + '\n' +
        '• Personas: ' + pax + '\n' +
        (note ? '• Nota: ' + note + '\n' : '') +
        '\n¡Gracias!';
      var url = waLink(msg);
      var w = W.open(url, '_blank', 'noopener');
      if (!w) W.location.href = url;
      form.classList.add('is-sent');
      setTimeout(function () { form.classList.remove('is-sent'); }, 4000);
    });
  }, 'form');

  /* ------------------------------------------------------------------
     14. VOLVER ARRIBA
     ------------------------------------------------------------------ */
  safe(function () {
    $$('[data-top]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); W.scrollTo({ top: 0, behavior: 'smooth' }); });
    });
  }, 'top');
})();
