/* =========================================================================
   Video Motion Lab — generic, procedural assets
   Everything is placeholder art made for this lab: no brands, no real
   people, no real URLs. Builders return HTML strings that demos drop into
   their scene. `r` sets the data-r reference name used by render().
   ========================================================================= */
(function () {
  'use strict';
  const VML = window.VML;
  const { rng } = VML;

  const PHOTOS = ['dunes', 'city', 'ocean', 'alpine', 'portrait', 'food', 'interior', 'fabric', 'coffee'];
  const imgPath = (name) => `assets/images/${name}.svg`;
  const svgPath = (name) => `assets/svg/${name}.svg`;
  const ref = (r) => (r ? ` data-r="${r}"` : '');

  function photo(name, { r, cls = '', style = '' } = {}) {
    return `<div class="photo ${cls}"${ref(r)} style="background-image:url(${imgPath(name)});${style}"></div>`;
  }
  function product(name, { r, cls = '', style = '' } = {}) {
    return `<img class="product product--${name} ${cls}"${ref(r)} src="${svgPath(name)}" alt="" draggable="false" style="${style}" />`;
  }
  function phone(screen, { r = 'phone', cls = '', style = '' } = {}) {
    return `<div class="phone ${cls}"${ref(r)} style="${style}"><div class="phone__screen">${screen}</div><i class="phone__island"></i></div>`;
  }

  /* ---------- icons (24×24 strokes) ---------- */
  const ICONS = {
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    chat: '<path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5H4.5z"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    cart: '<path d="M3.5 4.5h2.5l2 10h10l2-7H7"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/>',
    shield: '<path d="M12 3.5l7 2.8v5.2c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6.3z"/><path d="M8.8 12l2.2 2.2 4.4-4.4"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 14-14 0 9-5.5 14-14 14zM5 19l7-7"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    wallet: '<rect x="3.5" y="6" width="17" height="13" rx="2.5"/><path d="M3.5 9.5h17M15.5 14h2"/>',
    send: '<path d="M4 12l16-7-6 16-3-6.5z"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-4-6-4-5-1.5S12 9 12 9zm0 0c1.5-4 6-4 5-1.5S12 9 12 9z"/>',
    chart: '<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    home: '<path d="M4 11l8-6.5 8 6.5v9h-5.5v-5.5h-5V20H4z"/>',
    card: '<rect x="3" y="6" width="18" height="12.5" rx="2.2"/><path d="M3 10h18M6.5 15h4"/>',
    tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
    sparkle: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    cursor: '<path d="M6 3.5l12 7.2-5.3 1.4 3.3 6-2.4 1.3-3.3-6L6.5 17z"/>',
    hand: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5c0 3.5-2.4 6-6 6-2.6 0-4-1.2-5.4-3.4L4.6 13.2a1.4 1.4 0 0 1 2.3-1.6L9 14"/>',
  };
  function icon(name, { r, cls = '', sw = 1.8 } = {}) {
    return `<svg class="ico ${cls}"${ref(r)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  /* ---------- generic brand: “AKSA” ----------
     Mark = sun (circle) + peak (chevron) + horizon (bar). Three separate
     paths so demos can draw, assemble or morph them independently.
     pathLength="1" makes stroke drawing resolution-independent. */
  function logoMark({ r = 'mark', cls = '', sw = 7 } = {}) {
    return `<svg class="mark ${cls}"${ref(r)} viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
      <circle data-r="m-sun" cx="50" cy="35" r="12" pathLength="1"/>
      <path data-r="m-peak" d="M16 84 L50 26 L84 84" pathLength="1"/>
      <path data-r="m-bar" d="M31 68 H69" pathLength="1"/>
    </svg>`;
  }
  function logo({ r = 'logo', cls = '', word = 'AKSA', sub = 'studio' } = {}) {
    return `<div class="logo ${cls}"${ref(r)}>${logoMark()}<div class="logo__type"><b data-r="l-word">${word}</b><span data-r="l-sub">${sub}</span></div></div>`;
  }

  /* ---------- placeholder QR (NOT scannable, encodes nothing) ---------- */
  function qr({ r = 'qr', cls = '', seed = 7 } = {}) {
    const n = 25, rand = rng(seed);
    let cells = '';
    const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      if (rand() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" data-r="qr-cell"/>`;
    }
    const f = (x, y) => `<g data-r="qr-finder"><rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/></g>`;
    return `<svg class="qr ${cls}"${ref(r)} viewBox="-2 -2 29 29" shape-rendering="crispEdges"><rect x="-2" y="-2" width="29" height="29" fill="#fff" rx="1.5"/><g fill="#111">${f(0, 0)}${f(n - 7, 0)}${f(0, n - 7)}${cells}</g></svg>`;
  }

  /* ---------- layered landscape for camera / parallax demos ----------
     Each layer is a full-bleed SVG anchored to the bottom, so the same set
     works in 9:16, 1:1 and 16:9. depth: 0 = far, 1 = near. */
  const LAYERS = {
    sky: '<div class="ly ly--sky" data-r="ly-sky"></div>',
    sun: '<div class="ly ly--sunwrap" data-r="ly-sun"><i class="ly-sun"></i></div>',
    far: `<div class="ly" data-r="ly-far"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><path d="M-200 620 L120 420 L330 540 L560 330 L800 560 L1010 420 L1250 580 L1460 400 L1800 600 V900 H-200Z" fill="#a9b4c2"/><path d="M560 330 L630 410 L590 405 L560 440 L530 400 L500 410Z" fill="#eef1f4"/></svg></div>`,
    mid: `<div class="ly" data-r="ly-mid"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><path d="M-200 700 C100 600 300 640 520 690 S900 600 1150 660 S1500 620 1800 680 V900 H-200Z" fill="#6f8293"/></svg></div>`,
    near: `<div class="ly" data-r="ly-near"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><path d="M-200 780 C200 720 420 760 700 790 S1200 730 1800 770 V900 H-200Z" fill="#3c4b58"/>
      <g fill="#24313b"><path d="M180 790 l40-120 40 120z"/><path d="M240 795 l30-90 30 90z"/><path d="M1240 770 l46-140 46 140z"/><path d="M1310 780 l32-96 32 96z"/></g></svg></div>`,
    subject: `<div class="ly ly--subject" data-r="ly-subject"><div class="subject"><i class="subject__glow"></i><i class="subject__body"></i></div></div>`,
    fg: `<div class="ly" data-r="ly-fg"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><g fill="#11171c">
      <g transform="translate(330 0)"><path d="M-100 900 C0 760 60 720 140 700 C100 760 90 820 120 900Z"/><path d="M60 900 C120 700 220 640 300 640 C230 720 200 800 220 900Z"/></g>
      <g transform="translate(-330 0)"><path d="M1700 900 C1600 760 1540 700 1460 690 C1500 760 1510 820 1480 900Z"/><path d="M1540 900 C1480 720 1380 650 1300 660 C1370 730 1400 810 1380 900Z"/></g></g></svg></div>`,
  };
  function landscape(list = ['sky', 'sun', 'far', 'mid', 'near', 'subject', 'fg'], { r = 'world', cls = '' } = {}) {
    return `<div class="world ${cls}"${ref(r)}>${list.map((k) => LAYERS[k]).join('')}</div>`;
  }

  /* ---------- fake fintech app screen (generic, no real bank) ---------- */
  function appHome({ amount = 'Rp 12.450.000', name = 'Hai, Raka' } = {}) {
    return `<div class="app">
      <div class="app__status"><span>9:41</span><span class="app__sig"><i></i><i></i><i></i></span></div>
      <div class="app__body" data-r="app-body">
      <div class="app__top"><div><small>${name}</small><b>Wallet</b></div><span class="app__avatar">${icon('user')}</span></div>
      <div class="app__card" data-r="app-card"><small>Total balance</small><b data-r="app-bal">${amount}</b><div class="app__card-row"><span>•••• 2048</span><span>+2.4% this month</span></div></div>
      <div class="app__actions" data-r="app-actions">
        <span data-r="app-act">${icon('send')}<em>Send</em></span><span data-r="app-act">${icon('plus')}<em>Top up</em></span>
        <span data-r="app-act">${icon('chart')}<em>Invest</em></span><span data-r="app-act">${icon('gift')}<em>Rewards</em></span>
      </div>
      <div class="app__list">
        <div class="app__row" data-r="app-row"><i class="dot dot--a">${icon('cart')}</i><div><b>Groceries</b><small>Today · 10:24</small></div><span>−185.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--b">${icon('wallet')}</i><div><b>Salary</b><small>Yesterday</small></div><span class="pos">+8.500.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--c">${icon('bolt')}</i><div><b>Electricity</b><small>2 days ago</small></div><span>−420.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--d">${icon('heart')}</i><div><b>Donation</b><small>3 days ago</small></div><span>−50.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--a">${icon('home')}</i><div><b>Rent</b><small>5 days ago</small></div><span>−3.000.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--b">${icon('gift')}</i><div><b>Cashback</b><small>6 days ago</small></div><span class="pos">+25.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--c">${icon('card')}</i><div><b>Card payment</b><small>1 week ago</small></div><span>−129.000</span></div>
        <div class="app__row" data-r="app-row"><i class="dot dot--d">${icon('send')}</i><div><b>Transfer to Dina</b><small>1 week ago</small></div><span>−250.000</span></div>
      </div>
      </div>
      <div class="app__tabbar"><span class="on">${icon('home')}</span><span>${icon('chart')}</span><span>${icon('card')}</span><span>${icon('user')}</span></div>
    </div>`;
  }

  /* ---------- grain texture (generated once, shared by CSS) ---------- */
  function makeGrain() {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const g = c.getContext('2d');
      const img = g.createImageData(160, 160);
      const rand = rng(42);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = rand() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 46;
      }
      g.putImageData(img, 0, 0);
      document.documentElement.style.setProperty('--grain', `url(${c.toDataURL('image/png')})`);
    } catch (e) { /* canvas unavailable: grain simply does not render */ }
  }
  makeGrain();

  /* Load an image once and share the promise (canvas / WebGL demos). */
  const imgCache = {};
  function loadImage(src) {
    if (!imgCache[src]) {
      imgCache[src] = new Promise((res, rej) => {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = src;
      });
    }
    return imgCache[src];
  }

  /* ---------- directional (motion) blur via an SVG filter ----------
     CSS blur() is round; real motion blur smears along the direction of travel.
     dirBlur() returns { id, html }: put html in the scene and tag the element
     with data-filter="id"; then call setDirBlur(c, el, fe, x, y) every frame. */
  let blurId = 0;
  function dirBlur(ref = 'mbf') {
    const id = 'vml-db' + ++blurId;
    return { id, html: `<svg class="svg-defs" width="0" height="0" aria-hidden="true" style="position:absolute"><filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur data-r="${ref}" stdDeviation="0 0"/></filter></svg>` };
  }
  function setDirBlur(c, el, fe, x, y = 0) {
    if (!el || !fe) return;
    const bx = Math.abs(x) * c.u, by = Math.abs(y) * c.u;
    if (bx + by < 0.3) { el.style.filter = 'none'; return; }
    fe.setAttribute('stdDeviation', bx.toFixed(2) + ' ' + by.toFixed(2));
    el.style.filter = `url(#${el.dataset.filter})`;
  }

  /* ---------- RGB channel split via an SVG filter ----------
     Separates red and blue channels and offsets them; green stays put. */
  function rgbFilter() {
    const id = 'vml-rgb' + ++blurId;
    const m = (r, g, b) => `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`;
    return { id, html: `<svg class="svg-defs" width="0" height="0" aria-hidden="true" style="position:absolute"><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" values="${m(1, 0, 0)}" result="r"/><feOffset in="r" data-r="rgbR" dx="0" dy="0" result="ro"/>
      <feColorMatrix in="SourceGraphic" values="${m(0, 1, 0)}" result="g"/>
      <feColorMatrix in="SourceGraphic" values="${m(0, 0, 1)}" result="b"/><feOffset in="b" data-r="rgbB" dx="0" dy="0" result="bo"/>
      <feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen"/></filter></svg>` };
  }
  function setRGB(c, el, dx, dy = 0) {
    if (!el) return;
    if (Math.abs(dx) + Math.abs(dy) < 0.05) { el.style.filter = 'none'; return; }
    const px = dx * c.u, py = dy * c.u;
    c.$.rgbR.setAttribute('dx', px.toFixed(2)); c.$.rgbR.setAttribute('dy', py.toFixed(2));
    c.$.rgbB.setAttribute('dx', (-px).toFixed(2)); c.$.rgbB.setAttribute('dy', (-py).toFixed(2));
    el.style.filter = `url(#${el.dataset.filter})`;
  }

  /* Draw a square image into a canvas with "cover" fitting. */
  function drawCover(g, img, w, h, scale = 1, ox = 0, oy = 0) {
    const S = Math.max(w, h) * scale;
    g.drawImage(img, (w - S) / 2 + ox, (h - S) / 2 + oy, S, S);
  }

  VML.A = { rgbFilter, setRGB, drawCover, dirBlur, setDirBlur, PHOTOS, imgPath, svgPath, photo, product, phone, icon, ICONS, logoMark, logo, qr, landscape, LAYERS, appHome, loadImage };
})();
