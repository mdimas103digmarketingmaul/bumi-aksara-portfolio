/* 08 — Product & UI Motion
   App promo and product marketing patterns with a generic phone mock,
   a fake wallet app and placeholder products. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, A } = window.VML;
  const CAT = 'product';
  const UI = ['ui'];
  const phone = (screen = A.appHome(), style = '', r = 'phone') => A.phone(screen, { r, style });

  /* Position an overlay element over a target, in % of a container (call in init/resize). */
  function place(el, target, box, pad = 0) {
    if (!el || !target || !box) return null;
    const b = box.getBoundingClientRect(), t = target.getBoundingClientRect();
    if (!b.width) return null;
    const r = { x: ((t.left - b.left) / b.width) * 100, y: ((t.top - b.top) / b.height) * 100, w: (t.width / b.width) * 100, h: (t.height / b.height) * 100 };
    Object.assign(el.style, { left: r.x - pad + '%', top: r.y - pad + '%', width: r.w + pad * 2 + '%', height: r.h + pad * 2 + '%' });
    return r;
  }
  const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  /* 01 Phone entrance */
  demo({
    id: 'phone-entrance', cat: CAT, name: 'Phone Device Entrance', aka: ['Device reveal', 'Phone rise', 'Mockup entrance'],
    tags: UI.concat('object'), char: ['Product', 'Clean', 'Premium'],
    what: 'The phone rises into frame with a slight tilt correction and a soft overshoot, then the screen “wakes” and its UI builds in. Two layers of motion — device, then screen — tell the viewer: first the product, then what it does.',
    good: ['App launch videos', 'Opening frame of an app ad', 'Feature demos'],
    avoid: 'Spinning the device wildly on entrance — keep the screen readable as soon as possible.',
    anatomy: ['Scene time', 'Phone, screen content, shadow, headline', 'translateY 75% → 0 + rotate 10° → 0; screen opacity/brightness; rows stagger', 'Phone 1.0s · wake 0.4s · rows 0.5s @60ms', 'back.soft · premium', 'Headline → phone → screen wake → UI rows'],
    tracks: [['head', 'Headline', 0.1, 0.6, 'premium'], ['rise', 'Phone rise', 0.25, 1.0, 'back.soft'], ['wake', 'Screen wake', '-=0.35', 0.4, 'out'], ['rows', 'UI rows ×8', '<0.1', 0.5, 'premium', { n: 8, each: 0.06 }], ['hold', 'Hold', '>', 0.8, 'linear']],
    cls: 'bg-studio',
    html: `<div class="pu-head" data-r="head"><span class="t-eyebrow">Introducing</span><b class="t-sans">Money, made calm.</b></div>
      <div class="center" style="padding-top:12cqmin"><div class="floor-shadow" data-r="sh" style="margin-top:calc(min(60cqw, 42cqh) * 2.25);width:40cqmin"></div></div>
      <div class="center" style="padding-top:12cqmin"><div data-r="wrap">${phone(undefined, '')}</div></div>`,
    render(t, c) {
      c.set(c.$.head, { o: c.p.head, y: 3 * (1 - c.p.head) });
      c.set(c.$.wrap, { yh: lerp(80, 0, c.p.rise), r: lerp(10, 0, c.p.rise) });
      c.set(c.$.sh, { sx: c.p.rise, o: c.p.rise });
      c.set(c.$['app-body'], { o: c.p.wake });
      const rows = [c.$['app-card'], c.$['app-actions'], ...c.$$['app-row']];
      rows.forEach((el, i) => { const p = c.st('rows', Math.min(i, 7)); c.set(el, { o: p, y: 4 * (1 - p) }); });
    },
    prompt: 'Animate a phone mockup entrance for an app promo: the headline fades up first; then the phone rises from below the frame (translateY 80% → 0) while correcting a 10° tilt, over 1s with a soft back-out ease, with a floor shadow growing under it. As it lands, wake the screen (opacity 0 → 1, 400ms) and build the UI rows in with a 60ms stagger.',
  });

  /* 02 Device float */
  demo({
    id: 'device-float', cat: CAT, name: 'Device Float', aka: ['Floating phone', 'Hover device', 'Idle device'],
    tags: UI, char: ['Calm', 'Premium', 'Loop'],
    what: 'The phone hovers in place with a slow vertical bob, a slight tilt and a breathing shadow, while small UI chips float around it out of phase. It keeps a hold shot alive without stealing attention from the screen.',
    good: ['Holding on a screen while a voiceover explains', 'Website hero loops', 'End cards with an app'],
    avoid: 'Floating while the user must read small UI text — pause the float during dense content.',
    anatomy: ['Continuous loop', 'Phone + 3 UI chips + shadow', 'translateY ±2% + rotate ±1.5° (phase-shifted per element)', '4s loop', 'Sine (seamless)', 'All elements float out of phase'],
    tracks: [['loop', 'Float loop (seamless)', 0, 4, 'linear', 'bg'], ['in', 'Fade in', 0, 0.8, 'premium']],
    dur: 4, poster: 1,
    cls: 'bg-studio-light',
    html: `<div class="center"><div class="floor-shadow" data-r="sh" style="margin-top:calc(min(60cqw, 42cqh) * 2.25);width:42cqmin"></div></div>
      <div class="center"><div data-r="ph">${phone(undefined, '')}</div></div>
      <div class="center"><div data-r="chip" class="pu-chip" style="margin:-58cqmin 0 0 -46cqmin">${A.icon('shield')}Protected</div></div>
      <div class="center"><div data-r="chip" class="pu-chip" style="margin:6cqmin 0 0 52cqmin">${A.icon('bolt')}Instant</div></div>
      <div class="center"><div data-r="chip" class="pu-chip" style="margin:62cqmin 0 0 -40cqmin">${A.icon('star')}4.9 rating</div></div>`,
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      const y = Math.sin(a) * 2;
      c.set(c.$.ph, { y, r: Math.sin(a + 1) * 1.5, o: c.p.in });
      c.set(c.$.sh, { sx: 1 - y * 0.04, o: (0.8 - y * 0.06) * c.p.in });
      c.$$.chip.forEach((el, i) => c.set(el, { y: Math.sin(a + 1.8 + i * 2.1) * 2.6, o: c.p.in }));
    },
    prompt: 'Make the phone float in a seamless 4s loop: translateY ±2% and rotate ±1.5° on offset sine waves, with the floor shadow scaling inversely to the height. Float three small UI chips around it on their own phases with slightly larger amplitude. Keep everything slow and subtle.',
  });

  /* 03 Device rotate */
  demo({
    id: 'device-rotate', cat: CAT, name: 'Device Rotate', aka: ['Phone spin', 'Y-axis rotation', 'Flip to back'],
    tags: UI.concat('object'), char: ['Product', 'Dynamic', 'Premium'],
    what: 'The phone turns a full 360° around its vertical axis in perspective, showing the back (camera module) before returning to the screen. It is how hardware is presented — the device as an object, not just a screen.',
    good: ['Hardware and accessory launches', 'Transition from “product” to “app” focus', 'Premium product intros'],
    avoid: 'Spinning while UI must be read; also avoid repeating spins — once is a reveal, twice is a gimmick.',
    anatomy: ['Scene time', 'Phone front + back faces', 'rotateY 0 → 360° in perspective (backface hidden)', '2.4s', 'inOut (cubic) with slight scale bump', 'Front → back → front'],
    tracks: [['spin', 'Rotate Y 360°', 0.4, 2.4, 'inOut'], ['hold', 'Hold', '>', 0.8, 'linear']],
    cls: 'bg-studio',
    html: `<div class="center pu-3d"><div data-r="rig" class="pu-rig" style="--pw:min(60cqw, 42cqh)">${phone(undefined, '', 'front')}<div class="phone-back"><i class="phone-back__cam"><b></b><b></b><b></b></i><span>AKSA</span></div></div></div>`,
    render(t, c) {
      c.set(c.$.rig, { ry: c.p.spin * 360, s: 1 - bump(c.r.spin) * 0.08 });
    },
    prompt: 'Rotate the phone 360° around its vertical axis in CSS 3D perspective (perspective ≈ 1200px, transform-style preserve-3d) over 2.4s with a cubic in-out ease. Build front and back faces with backface-visibility hidden so the back (camera module) shows mid-spin, and dip the scale to 0.92 at the halfway point for weight.',
  });

  /* 04 Device 3D tilt */
  demo({
    id: 'device-tilt', cat: CAT, name: 'Device 3D Tilt', aka: ['Perspective tilt', 'Isometric phone', '3D mockup tilt'],
    tags: UI.concat('object'), char: ['Premium', 'Tech', 'Dimensional'],
    what: 'The phone tilts gently in 3D on two axes, with a glare sweeping across the glass in the opposite direction. The tilt gives depth; the glare sells the glass. It works as a loop behind a headline.',
    good: ['Hero visuals for app launches', 'Showing screen depth / glass material', 'Looping product backgrounds'],
    avoid: 'Strong tilts that foreshorten the UI until it is unreadable (> 25°).',
    anatomy: ['Continuous loop', 'Phone + glare layer', 'rotateX/rotateY ±14° on a Lissajous path; glare translate opposite', '5s loop', 'Sine (seamless)', 'Continuous'],
    tracks: [['loop', 'Tilt loop (seamless)', 0, 5, 'linear', 'object']],
    dur: 5, poster: 1.2,
    cls: 'bg-navy',
    html: `<div class="center pu-3d"><div data-r="rig" class="pu-rig">${phone(undefined, '')}<i data-r="glare" class="pu-glare"></i></div></div>`,
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      const rx = Math.sin(a) * 12, ry = Math.cos(a) * 16;
      c.set(c.$.rig, { rx, ry });
      c.set(c.$.glare, { xp: -ry * 4, yp: rx * 3 });
    },
    prompt: 'Tilt the phone mockup in 3D on a slow Lissajous loop: rotateX ±12° and rotateY ±16° driven by sine and cosine of the same 5s loop phase, with perspective around 1000px. Add a soft glare gradient on the screen that moves opposite to the tilt so the glass feels real.',
  });

  /* 05 UI screen scroll */
  demo({
    id: 'ui-scroll', cat: CAT, name: 'UI Screen Scroll', aka: ['In-app scroll', 'Feed scroll', 'Flick scroll'],
    tags: UI, char: ['Product', 'Natural', 'Explanatory'],
    what: 'Content inside the phone scrolls like a real flick: fast start, inertial slow-down, then a scroll back with a small overscroll bounce. A touch indicator shows the gesture. Real-feeling physics is what makes a mock UI believable.',
    good: ['Showing long screens (feeds, lists, product pages)', 'App walkthroughs', 'Demonstrating content depth'],
    avoid: 'Constant linear scrolling — no one scrolls like that; it reads as a screen recording gone wrong.',
    anatomy: ['Simulated gesture', 'App content (inside the screen)', 'translateY with inertia, then back with overscroll', 'Flick 1.4s · hold · return 0.9s', 'inertia · back.out', 'Swipe → coast → hold → swipe back → settle'],
    tracks: [['swipe', 'Finger swipe', 0.4, 0.3, 'cubic.out', 'cta'], ['flick', 'Inertial scroll', '<0.1', 1.4, 'inertia'], ['back', 'Scroll back + overscroll', '+=0.5', 0.9, 'back.out'], ['hold', 'Hold', '>', 0.6, 'linear']],
    cls: 'bg-sand',
    html: `<div class="center"><div data-r="pw">${phone(undefined, '')}<i data-r="finger" class="pu-finger"></i></div></div>`,
    render(t, c) {
      const y = -58 * c.p.flick * (1 - c.p.back);
      c.set(c.$['app-body'], { y });
      const sw = c.r.swipe;
      c.set(c.$.finger, { o: sw > 0 && sw < 1 ? 1 : 0, yp: lerp(120, -120, c.p.swipe) });
    },
    prompt: 'Simulate a natural in-app scroll: show a touch indicator swiping up, then scroll the screen content up by ~60% of the phone width with inertia (fast start, exponential slow-down) over 1.4s. Hold 0.5s, then scroll back to the top over 900ms with a back-out ease so it overscrolls slightly and settles, like iOS rubber-banding.',
  });

  /* 06 UI tap */
  demo({
    id: 'ui-tap', cat: CAT, name: 'UI Tap Interaction', aka: ['Tap simulation', 'Finger tap', 'Cursor click demo'],
    tags: UI.concat('cta'), char: ['Explanatory', 'Product', 'Clear'],
    what: 'A touch indicator travels to a button, presses it (the button squashes and a ripple expands), and the app responds by opening a new screen. Showing cause and effect is the core of every app tutorial.',
    good: ['App walkthroughs and tutorials', 'Highlighting the one action you want users to take', 'Feature demos in ads'],
    avoid: 'Tapping too fast — give the viewer ~0.3s to see the target before the tap and ~0.6s to see the result.',
    anatomy: ['Simulated gesture', 'Touch indicator, button, ripple, next screen', 'Finger travels → press scale 0.9 → ripple → screen slides in', 'Travel 0.7s · press 0.15s · ripple 0.5s · screen 0.6s', 'smooth / spring / expo.out', 'Move → press → feedback → result'],
    tracks: [['move', 'Finger to button', 0.4, 0.7, 'smooth', 'cta'], ['press', 'Press', '>', 0.15, 'out', 'cta'], ['ripple', 'Ripple', '<', 0.5, 'expo.out', 'fx'], ['screen', 'Next screen', '<0.2', 0.6, 'expo.out', 'ui'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-lilac',
    html: `<div class="center"><div data-r="pw" style="position:relative">${phone(A.appHome() + `<div data-r="next" class="pu-next"><div class="pu-next__bar">${A.icon('arrow')}<b>Send money</b></div><div class="pu-next__amt"><small>Amount</small><b>Rp 250.000</b></div><div class="pu-next__keys">${'123456789·0⌫'.split('').map((k) => `<span>${k}</span>`).join('')}</div></div>`, '')}
      <i data-r="ripple" class="pu-ripple"></i><i data-r="finger" class="pu-finger pu-finger--tap"></i></div></div>`,
    init(c) { c.data.target = c.$$['app-act'][0]; },
    resize(c) { c.data.r = place(c.$.ripple, c.data.target, c.$.pw); },
    render(t, c) {
      if (!c.data.r) c.data.r = place(c.$.ripple, c.data.target, c.$.pw);
      const r = c.data.r || { x: 20, y: 40, w: 15, h: 10 };
      const tx = r.x + r.w / 2, ty = r.y + r.h * 0.35;
      c.$.finger.style.left = lerp(tx + 30, tx, c.p.move) + '%';
      c.$.finger.style.top = lerp(ty + 45, ty, c.p.move) + '%';
      const pressed = c.r.press > 0 && c.r.press < 1;
      c.set(c.$.finger, { s: pressed ? 0.8 : 1, o: c.r.move > 0 && c.r.screen < 0.6 ? 1 : 0 });
      c.set(c.data.target, { s: pressed ? 0.88 : 1 });
      c.set(c.$.ripple, { s: lerp(0.3, 2.2, c.p.ripple), o: c.r.ripple > 0 && c.r.ripple < 1 ? 1 - c.p.ripple : 0 });
      c.set(c.$.next, { xp: 100 * (1 - c.p.screen) });
    },
    prompt: 'Simulate a tap in an app demo: a semi-transparent touch indicator glides to the “Send” button over 700ms (smooth ease), presses for 150ms (indicator shrinks, button scales to 0.88), a ripple ring expands from the button and fades (500ms), then the next screen slides in from the right with an expo-out ease. Hold the result for 1s.',
  });

  /* 07 UI highlight (spotlight) */
  demo({
    id: 'ui-highlight', cat: CAT, name: 'UI Highlight', aka: ['Spotlight', 'Focus overlay', 'Coach mark'],
    tags: UI, char: ['Explanatory', 'Clear', 'Product'],
    what: 'Everything on the screen dims except one feature, which sits in a bright cut-out with a label. The rest of the UI stays visible for context, but the eye has only one place to go.',
    good: ['Feature callouts in app ads', 'Onboarding and tutorials', '“New feature” announcements'],
    avoid: 'Spotlighting several things at once — one highlight per moment.',
    anatomy: ['Scene time', 'Dim overlay with a rounded cut-out + label', 'Overlay opacity 0 → 0.7; cut-out scale 1.15 → 1; label slide', '0.5s dim · 0.6s cut-out · 0.5s label', 'smooth / back.soft', 'Dim → focus → label → hold'],
    tracks: [['dim', 'Dim', 0.6, 0.5, 'smooth', 'fx'], ['spot', 'Spotlight', '<0.1', 0.6, 'back.soft', 'fx'], ['label', 'Label', '-=0.2', 0.5, 'premium'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-ink',
    html: `<div class="center" style="padding-bottom:16cqmin"><div data-r="pw" style="position:relative">${phone(undefined, '--pw:min(52cqw, 36cqh)')}<i data-r="spot" class="pu-spot"></i></div></div>
      <div class="abs" style="left:0;right:0;bottom:6cqmin;display:flex;justify-content:center"><div data-r="label" class="pu-label">${A.icon('sparkle')}<span><b>Real-time balance</b><small>Updates the second money moves.</small></span></div></div>`,
    resize(c) { c.data.r = place(c.$.spot, c.$['app-card'], c.$.pw, 1.5); },
    render(t, c) {
      if (!c.data.r) c.data.r = place(c.$.spot, c.$['app-card'], c.$.pw, 1.5);
      c.set(c.$.spot, { o: c.p.dim, s: lerp(1.15, 1, c.p.spot) });
      c.set(c.$.label, { o: c.p.label, y: 4 * (1 - c.p.label) });
    },
    prompt: 'Highlight one UI feature: dim the whole screen with a 70% black overlay over 500ms, except a rounded cut-out around the balance card (use a huge box-shadow spread on a transparent rounded rectangle). Scale the cut-out from 1.15 to 1 with a soft back-out so it “focuses”, then slide a short label in below the phone. Hold 1.2s.',
  });

  /* 08 UI zoom detail */
  demo({
    id: 'ui-zoom', cat: CAT, name: 'UI Zoom Detail', aka: ['Zoom to feature', 'Screen punch-in', 'Detail zoom'],
    tags: UI.concat('camera'), char: ['Explanatory', 'Cinematic', 'Product'],
    what: 'The camera pushes into one area of the screen so small UI becomes readable, holds, then pulls back to the full device. Essential in 9:16, where a full phone is too small to read.',
    good: ['Making small UI text readable', 'Detailing a number, chart or button', 'Pacing long app demos'],
    avoid: 'Zooming into blurry raster screenshots — use vector or high-resolution captures.',
    anatomy: ['Scene time', 'Whole phone (transform-origin on the target)', 'scale 1 → 2.3 → 1', '1s in · 1.2s hold · 0.8s out', 'expo.inOut', 'Full view → zoom → read → pull back'],
    tracks: [['zin', 'Zoom in', 0.6, 1.0, 'expo.inOut', 'camera'], ['read', 'Hold (read)', '>', 1.2, 'linear', 'hold'], ['zout', 'Zoom out', '>', 0.8, 'expo.inOut', 'camera'], ['hold', 'Hold', '>', 0.5, 'linear']],
    cls: 'bg-cream',
    html: `<div class="center"><div data-r="pw" style="position:relative">${phone(undefined, '')}</div></div>`,
    resize(c) {
      const r = place(document.createElement('i'), c.$['app-actions'], c.$.pw);
      if (r) c.$.pw.style.transformOrigin = `${r.x + r.w / 2}% ${r.y + r.h / 2}%`;
    },
    render(t, c) {
      if (!c.$.pw.style.transformOrigin) this.resize(c);
      c.set(c.$.pw, { s: lerp(1, 2.3, c.p.zin * (1 - c.p.zout)) });
    },
    prompt: 'Push in on a UI detail: set the phone’s transform-origin to the centre of the target element (the action buttons), scale the whole phone from 1 to 2.3 over 1s with an expo in-out ease, hold 1.2s so it can be read, then pull back out over 800ms.',
  });

  /* 09 UI card entrance */
  demo({
    id: 'ui-cards', cat: CAT, name: 'UI Card Entrance', aka: ['Floating UI cards', 'Component stack', 'SaaS cards'],
    tags: UI, char: ['Clean', 'Tech', 'Corporate'],
    what: 'Interface components appear as floating cards, each sliding up with a slight rotation that straightens as it lands, layered at different depths. A common way to present a product without a device frame.',
    good: ['SaaS and web-app promos', 'Showing several features at once', 'Social posts about a product update'],
    avoid: 'Too many cards with tiny text — 2–4 cards, large type.',
    anatomy: ['Scene time', 'Three UI cards', 'translateY 30% → 0 + rotate ±6° → final + opacity', '0.8s each · 0.18s stagger', 'spring.damped', 'Back card first, front card last'],
    tracks: [['c', 'Cards ×3 (180ms)', 0.3, 0.9, 'spring.damped', { n: 3, each: 0.18 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-grid-light',
    html: `<div class="center"><div class="ssr">
      <div data-r="card" class="ui-card pu-card" style="left:-36cqmin;top:-48cqmin;width:58cqmin;rotate:-4deg"><small>Revenue · this week</small><b>Rp 48,2 jt</b><svg viewBox="0 0 100 30" class="pu-spark"><path d="M0 26 L12 22 L24 24 L36 15 L48 18 L60 9 L72 12 L84 4 L100 6" fill="none" stroke="#1f9d6b" stroke-width="2"/></svg></div>
      <div data-r="card" class="ui-card pu-card" style="left:-14cqmin;top:-14cqmin;width:52cqmin;rotate:3deg"><div class="pu-avatar-row"><i></i><i></i><i></i><span>+12</span></div><b style="font-size:4.4cqmin">Team synced</b><small>3 new comments</small></div>
      <div data-r="card" class="ui-card ui-card--dark pu-card" style="left:-30cqmin;top:22cqmin;width:60cqmin;rotate:-2deg"><div class="pu-toggle-row"><span>Auto-save</span><i class="pu-switch on"><b></b></i></div><div class="pu-toggle-row"><span>Smart alerts</span><i class="pu-switch on"><b></b></i></div></div></div></div>`,
    render(t, c) {
      c.$$.card.forEach((el, i) => { const p = c.st('c', i); c.set(el, { y: 30 * (1 - p), r: (i % 2 ? 6 : -6) * (1 - p), o: clamp(p * 2) }); });
    },
    prompt: 'Present a product as floating UI cards: three cards (a stat card with a sparkline, a team card, a settings card) slide up 30% into a loose overlapping composition, each straightening from a ±6° tilt, with a damped spring over ~900ms and a 180ms stagger. Use generous shadows so the cards feel layered.',
  });

  /* 10 Notification pop */
  demo({
    id: 'ui-notification', cat: CAT, name: 'UI Notification Pop', aka: ['Push notification', 'Toast', 'Banner drop'],
    tags: UI.concat('social'), char: ['Clean', 'Familiar', 'Product'],
    what: 'Notifications drop in from the top with a damped spring, and each new one pushes the stack down. Because everyone recognises this motion from their own phone, it instantly reads as “something just happened”.',
    good: ['Showing app value (“Payment received”)', 'Social proof (“12 people bought this”)', 'Hooks that mimic real phone UI'],
    avoid: 'Copying a real brand’s notification style or real app icons.',
    anatomy: ['Scene time', 'Lock screen + two notifications', 'translateY −120% → 0 + scale 0.95 → 1; previous card pushed down', '0.7s each · 0.9s apart', 'spring.damped', 'Notification 1 → notification 2 pushes 1 down'],
    tracks: [['n1', 'Notification 1', 0.5, 0.7, 'spring.damped', 'ui'], ['n2', 'Notification 2', '+=0.9', 0.7, 'spring.damped', 'ui'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-coal',
    html: `<div class="center"><div data-r="pw">${phone(`<div class="pu-lock"><span>Thursday, 23 October</span><b>9:41</b>
      <div data-r="n" class="pu-notif"><i>${A.icon('wallet')}</i><div><b>Wallet <small>now</small></b><p>You received Rp 500.000 from Dina 🎉</p></div></div>
      <div data-r="n" class="pu-notif"><i style="background:#1f9d6b">${A.icon('gift')}</i><div><b>Rewards <small>now</small></b><p>Cashback unlocked: 10% on coffee this week.</p></div></div></div>`, '')}</div></div>`,
    render(t, c) {
      const [n1, n2] = c.$$.n;
      // newest on top: n2 lands at slot 0, pushes n1 to slot 1
      c.set(n1, { yp: lerp(-160, 0, c.p.n1) + 108 * c.p.n2, s: lerp(0.95, 1, c.p.n1), o: clamp(c.r.n1 * 4) });
      c.set(n2, { yp: lerp(-160, 0, c.p.n2), s: lerp(0.95, 1, c.p.n2), o: clamp(c.r.n2 * 4) });
    },
    prompt: 'Simulate push notifications on a lock screen: the first card drops from above the top edge into place with a damped spring (≈700ms, slight scale 0.95 → 1). 0.9s later a second card drops into the top slot and pushes the first one down by one card height with the same spring. Use generic app names and icons.',
  });

  /* 11 Bottom sheet / modal */
  demo({
    id: 'ui-sheet-modal', cat: CAT, name: 'UI Bottom Sheet / Modal', aka: ['Bottom sheet', 'Modal dialog', 'Overlay panel'],
    tags: UI, char: ['Clean', 'Product', 'Native'],
    variants: [['sheet', 'Bottom sheet'], ['modal', 'Modal']],
    what: 'An overlay opens over the current screen while the background dims. A bottom sheet slides up from the edge (native on mobile, easy to reach); a modal scales up in the centre (demands a decision). Both use a backdrop so the hierarchy is clear.',
    good: ['Showing a confirmation or choice step', 'Checkout and payment flows', 'Feature details on top of a screen'],
    avoid: 'Bouncy springs on modals for serious decisions (payments, deletion) — keep them damped.',
    anatomy: ['Simulated tap', 'Backdrop + sheet/modal', 'Sheet translateY 100% → 0 · Modal scale 0.9 → 1 + opacity', '0.55s', 'spring.damped / expo.out', 'Backdrop dims → panel enters → content stagger'],
    covers: 2,
    tracks: [['dim', 'Backdrop', 0.6, 0.3, 'smooth', 'fx'], ['open', 'Panel opens', '<0.05', 0.65, 'spring.damped', 'ui'], ['items', 'Content ×3', '-=0.35', 0.4, 'premium', { n: 3, each: 0.07 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-blue',
    html: (v) => `<div class="center"><div data-r="pw">${phone(A.appHome() + `<i data-r="dim" class="pu-dim"></i><div data-r="panel" class="${v === 'sheet' ? 'pu-sheet' : 'pu-modal'}"><i class="pu-grab"></i>
      <b data-r="it" class="pu-sheet__title">${v === 'sheet' ? 'Choose a method' : 'Confirm transfer?'}</b>
      ${v === 'sheet' ? `<div data-r="it" class="pu-opt on">${A.icon('wallet')}<span>Wallet balance</span><i></i></div><div data-r="it" class="pu-opt">${A.icon('card')}<span>Debit card</span><i></i></div>`
        : `<p data-r="it">Rp 250.000 to Dina · Fee Rp 0</p><div data-r="it" class="pu-modal__btns"><span>Cancel</span><span class="on">Confirm</span></div>`}</div>`, '')}</div></div>`,
    render(t, c) {
      c.set(c.$.dim, { o: c.p.dim * 0.55 });
      if (c.v === 'sheet') c.set(c.$.panel, { yp: 105 * (1 - c.p.open) });
      else c.set(c.$.panel, { s: lerp(0.9, 1, c.p.open), o: clamp(c.r.open * 3) });
      c.$$.it.forEach((el, i) => { const p = c.st('items', i); c.set(el, { o: p, y: 2 * (1 - p) }); });
    },
    prompt: (v) => v === 'sheet'
      ? 'Open a bottom sheet over the app screen: dim the background to ~55% black over 300ms, slide the sheet up from the bottom edge (translateY 105% → 0) with a damped spring over ~650ms, then stagger its content in (70ms apart). Keep the grabber handle visible.'
      : 'Open a centred modal over the app screen: dim the background to ~55% over 300ms, scale the modal from 0.9 to 1 with a damped spring while fading it in quickly, then stagger its title, text and buttons in. Keep it calm — no bounce for a payment confirmation.',
  });

  /* 12 Toggles */
  demo({
    id: 'ui-toggle', cat: CAT, name: 'UI Toggle Motion', aka: ['Switch animation', 'On/off toggle', 'Settings switch'],
    tags: UI, char: ['Playful', 'Tactile', 'Clean'],
    what: 'The knob slides across with a slight squash (it stretches while moving) and the track fills with colour. Three switches turn on in sequence, each a satisfying micro-moment. Small physical details make UI feel tactile.',
    good: ['Settings and privacy features', 'Showing customisation in an app ad', 'Micro-interaction showcases'],
    avoid: 'Long toggle animations (> 300ms) in real UI; in videos you can slow them slightly for readability.',
    anatomy: ['Simulated taps', 'Three switches', 'Knob translateX + stretch; track colour fade', '0.35s each · 0.45s apart', 'spring.stiff', 'Toggle 1 → 2 → 3'],
    tracks: [['t', 'Toggles ×3 (450ms)', 0.5, 0.4, 'spring.stiff', { n: 3, each: 0.45 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: `<div class="center"><div class="pu-settings">${['Face ID login', 'Spending alerts', 'Round-up savings'].map((s, i) => `<div class="pu-setrow"><i class="dot dot--${'abc'[i]}">${A.icon(['lock', 'bell', 'wallet'][i])}</i><span>${s}</span><i data-r="track" class="pu-switch"><b data-r="knob"></b></i></div>`).join('')}</div></div>`,
    render(t, c) {
      c.$$.knob.forEach((el, i) => {
        const p = c.st('t', i), rr = c.st('t', i, 'linear');
        const stretch = rr > 0 && rr < 0.6 ? Math.sin((rr / 0.6) * Math.PI) * 0.35 : 0;
        c.set(el, { xp: 100 * p, sx: 1 + stretch });
        c.$$.track[i].style.background = `color-mix(in srgb, #1f9d6b ${Math.round(clamp(p) * 100)}%, #d6d1c7)`;
      });
    },
    prompt: 'Animate three settings switches turning on one after another (450ms apart): the knob slides to the right with a stiff spring over ~400ms, stretching horizontally up to 35% mid-travel (squash & stretch), while the track colour blends from grey to green. Each toggle is a crisp micro-moment.',
  });

  /* 13 UI counter */
  demo({
    id: 'ui-counter', cat: CAT, name: 'UI Counter', aka: ['Balance count-up', 'Live number update', 'Ticker'],
    tags: UI.concat('text'), char: ['Product', 'Rewarding', 'Clean'],
    what: 'A number inside the app updates by counting up to the new value, while a small delta chip pops in to explain the change. The count makes the change visible; the chip makes it understandable.',
    good: ['Fintech balances, savings, rewards', 'Fitness stats and progress', 'Showing “results” in an app ad'],
    avoid: 'Counting large jumps slowly — the viewer cares about the final value; keep it under ~1.2s.',
    anatomy: ['Event (money received)', 'Balance text + delta chip', 'Text = formatted interpolated value; chip scale + slide', 'Chip 0.4s · count 1.1s', 'back.soft chip · expo.out count', 'Chip pops → number counts → glow'],
    tracks: [['chip', 'Delta chip', 0.6, 0.45, 'back.soft', 'ui'], ['count', 'Count up', '<0.15', 1.1, 'expo.out', 'text'], ['glow', 'Glow', '>-0.3', 0.6, 'out', 'fx'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-green',
    html: `<div class="center"><div data-r="pw" style="position:relative">${phone(undefined, '')}<span data-r="chip" class="pu-delta">+Rp 500.000</span></div></div>`,
    resize(c) { const r = place(document.createElement('i'), c.$['app-bal'], c.$.pw); if (r) Object.assign(c.$.chip.style, { left: r.x + 2 + '%', top: r.y - 7 + '%' }); },
    render(t, c) {
      if (!c.$.chip.style.left) this.resize(c);
      c.$['app-bal'].textContent = rupiah(12450000 + 500000 * c.p.count);
      c.set(c.$.chip, { s: c.p.chip, o: clamp(c.r.chip * 3) });
      c.set(c.$['app-bal'], { css: { textShadow: `0 0 ${(bump(c.r.glow) * 3).toFixed(2)}cqw rgba(127,209,176,${bump(c.r.glow).toFixed(2)})` } });
    },
    prompt: 'Animate a balance update inside the app: first pop a small “+Rp 500.000” chip next to the balance (scale 0 → 1, soft back-out), then count the balance up from Rp 12.450.000 to Rp 12.950.000 over 1.1s with an expo-out ease, formatting with Indonesian thousand separators every frame and tabular figures. End with a brief green glow.',
  });

  /* 14 Success state */
  demo({
    id: 'ui-success', cat: CAT, name: 'UI Success State', aka: ['Checkmark animation', 'Payment success', 'Confirmation'],
    tags: UI, char: ['Rewarding', 'Clean', 'Trustworthy'],
    what: 'A circle pops in, a checkmark draws itself inside, a ring pulses outward, and the confirmation text follows. The drawn check is the key: it shows completion happening, not just a static icon.',
    good: ['Payments, orders, sign-ups', 'Ending an app demo on a positive note', 'Trust-building moments in fintech'],
    avoid: 'Over-celebrating serious transactions; keep confetti for milestones, not every payment.',
    anatomy: ['Event (completed)', 'Circle, check stroke, ring, text', 'Circle scale 0 → 1; check dashoffset 1 → 0; ring scale + fade', 'Circle 0.45s · check 0.45s · ring 0.7s', 'back.out / out / expo.out', 'Circle → check (overlap) → ring → text'],
    tracks: [['circle', 'Circle pop', 0.4, 0.45, 'back.out', 'ui'], ['check', 'Check draw', '-=0.15', 0.45, 'out', 'ui'], ['ring', 'Ring pulse', '<0.2', 0.7, 'expo.out', 'fx'], ['text', 'Text', '<0.1', 0.5, 'premium'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-cream',
    html: `<div class="stackc" style="gap:5cqmin"><div class="center" style="position:relative;inset:auto;width:34cqmin;height:34cqmin">
      <i data-r="ring" class="pu-sring"></i><i data-r="circle" class="pu-scircle"></i>
      <svg class="pu-scheck" viewBox="0 0 24 24"><path data-r="check" d="M6 12.5l4 4L18 8" pathLength="1" stroke-dasharray="1 1"/></svg></div>
      <div data-r="text" class="col" style="gap:1.4cqmin"><b class="t-sans" style="font-size:8cqmin">Payment sent</b><span class="t-body">Rp 250.000 to Dina · just now</span></div></div>`,
    render(t, c) {
      c.set(c.$.circle, { s: c.p.circle });
      c.set(c.$.check, { dash: 1 - c.p.check });
      c.set(c.$.ring, { s: lerp(1, 1.8, c.p.ring), o: c.r.ring > 0 && c.r.ring < 1 ? 1 - c.p.ring : 0 });
      c.set(c.$.text, { o: c.p.text, y: 3 * (1 - c.p.text) });
    },
    prompt: 'Animate a success state: a green circle pops from scale 0 to 1 with a back-out ease (450ms); 150ms before it finishes, draw a white checkmark stroke inside it (stroke-dashoffset 1 → 0, 450ms, ease-out); a thin ring pulses outward and fades; then the confirmation text fades up. Hold 1.2s.',
  });

  /* 15 Loading state */
  demo({
    id: 'ui-loading', cat: CAT, name: 'UI Loading State', aka: ['Skeleton screen', 'Shimmer', 'Spinner → content'],
    tags: UI, char: ['Clean', 'Product', 'Reassuring'],
    what: 'Grey placeholder blocks (a skeleton) shimmer while content loads, then the real content fades in exactly where the placeholders were. Skeletons feel faster than spinners because the layout is already there.',
    good: ['Showing a fast, modern app', 'Explaining perceived performance', 'Transitions into data-heavy screens'],
    avoid: 'Shimmers that are too bright or fast — they should be calm and continuous.',
    anatomy: ['Data loading', 'Skeleton blocks → real content', 'Shimmer: gradient translateX loop; crossfade to content with stagger', 'Shimmer 1.1s cycles · reveal 0.5s @70ms', 'linear shimmer · premium reveal', 'Skeleton → content replaces it in place'],
    tracks: [['shim', 'Skeleton shimmer', 0, 2, 'linear', 'fx'], ['reveal', 'Content ×4 (70ms)', '>-0.2', 0.5, 'premium', { n: 4, each: 0.07 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="center"><div class="pu-load">${[0, 1, 2, 3].map((i) => `<div class="pu-load__row"><div data-r="sk" class="pu-sk"><i class="pu-sk__a"></i><span><i></i><i></i></span><i data-r="shine" class="pu-sk__shine"></i></div>
      <div data-r="real" class="pu-real">${['<i class="dot dot--a">' + A.icon('cart') + '</i><span><b>Groceries</b><small>Today</small></span><em>−185.000</em>', '<i class="dot dot--b">' + A.icon('wallet') + '</i><span><b>Salary</b><small>Yesterday</small></span><em class="pos">+8.500.000</em>', '<i class="dot dot--c">' + A.icon('bolt') + '</i><span><b>Electricity</b><small>2 days</small></span><em>−420.000</em>', '<i class="dot dot--d">' + A.icon('heart') + '</i><span><b>Donation</b><small>3 days</small></span><em>−50.000</em>'][i]}</div></div>`).join('')}</div></div>`,
    render(t, c) {
      const sh = (t % 1.1) / 1.1;
      c.$$.shine.forEach((el) => c.set(el, { xp: lerp(-120, 220, sh) }));
      c.$$.real.forEach((el, i) => { const p = c.st('reveal', i); c.set(el, { o: p }); c.set(c.$$.sk[i], { o: 1 - p }); });
    },
    prompt: 'Show a skeleton loading state: grey placeholder rows with a soft light gradient sweeping across them every 1.1s (linear). After ~2s, crossfade each row into its real content in exactly the same position, staggered by 70ms with a premium ease-out.',
  });

  /* 16 Feature callout */
  demo({
    id: 'ui-callout', cat: CAT, name: 'UI Feature Callout', aka: ['Leader line', 'Annotation', 'Pointer label'],
    tags: UI, char: ['Explanatory', 'Technical', 'Clean'],
    what: 'A dot appears on a feature, a leader line draws out from it, and a label slides in at the end of the line. The line physically connects the explanation to the UI — the clearest way to name parts of a product.',
    good: ['Feature tours and spec explainers', 'Hardware callouts (camera, ports)', 'Educational product content'],
    avoid: 'Lines crossing each other or the key UI; plan callouts so lines stay short and clean.',
    anatomy: ['Scene time', 'Anchor dot, leader line, label', 'Dot scale; line stroke-dashoffset; label slide + fade', 'Dot 0.3s · line 0.5s · label 0.45s (×2 callouts)', 'back.out / inOut / premium', 'Dot → line → label, then the next callout'],
    tracks: [['d1', 'Dot 1', 0.5, 0.3, 'back.out', 'ui'], ['l1', 'Line 1', '>', 0.5, 'inOut', 'fx'], ['t1', 'Label 1', '-=0.15', 0.45, 'premium'], ['d2', 'Dot 2', '+=0.2', 0.3, 'back.out', 'ui'], ['l2', 'Line 2', '>', 0.5, 'inOut', 'fx'], ['t2', 'Label 2', '-=0.15', 0.45, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-studio',
    html: `<div class="center"><div data-r="pw" style="position:relative;margin-left:-30cqmin">${phone(undefined, '--pw:min(48cqw, 38cqh)')}</div></div>
      <svg data-r="svg" class="fill" style="z-index:3" preserveAspectRatio="none"><path data-r="line" fill="none" stroke="#ef4b36" stroke-width="1.5" pathLength="1" stroke-dasharray="1 1"/><path data-r="line" fill="none" stroke="#ef4b36" stroke-width="1.5" pathLength="1" stroke-dasharray="1 1"/></svg>
      <i data-r="dot" class="pu-cdot"></i><i data-r="dot" class="pu-cdot"></i>
      <div data-r="lab" class="pu-clabel"><b>Live balance</b><small>Updates instantly</small></div><div data-r="lab" class="pu-clabel"><b>One-tap actions</b><small>Send, top up, invest</small></div>`,
    resize(c) {
      const s = c.root.getBoundingClientRect();
      if (!s.width) return;
      c.$.svg.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
      const targets = [c.$['app-card'], c.$['app-actions']];
      const ys = [0.32, 0.6];
      c.data.pts = targets.map((el, i) => {
        const r = el.getBoundingClientRect();
        const a = [r.right - s.left - r.width * 0.12, r.top - s.top + r.height * 0.5];
        const b = [s.width * 0.66, s.height * ys[i]];
        c.$$.dot[i].style.left = a[0] + 'px'; c.$$.dot[i].style.top = a[1] + 'px';
        c.$$.lab[i].style.left = b[0] + 8 + 'px'; c.$$.lab[i].style.top = b[1] + 'px';
        c.$$.line[i].setAttribute('d', `M${a[0]} ${a[1]} L${(a[0] + b[0]) / 2 + 10} ${b[1]} L${b[0]} ${b[1]}`);
        return { a, b };
      });
    },
    render(t, c) {
      if (!c.data.pts) this.resize(c);
      [1, 2].forEach((n, i) => {
        c.set(c.$$.dot[i], { s: c.p['d' + n] });
        c.set(c.$$.line[i], { dash: 1 - c.p['l' + n] });
        c.set(c.$$.lab[i], { o: c.p['t' + n], x: -3 * (1 - c.p['t' + n]) });
      });
    },
    prompt: 'Add feature callouts to a phone mockup: for each feature, pop a small dot on the UI element (back-out, 300ms), draw a leader line from the dot to the side of the frame (stroke-dashoffset 1 → 0, 500ms, in-out), then slide the label in at the end of the line (450ms). Run the second callout 0.2s after the first label lands.',
  });

  /* 17 Exploded view */
  demo({
    id: 'exploded-view', cat: CAT, name: 'Product Exploded View Concept', aka: ['Exploded diagram', 'Layer separation', 'Teardown view'],
    tags: UI.concat('object', 'advanced'), char: ['Technical', 'Premium', 'Explanatory'],
    what: 'The product separates into its layers along the depth axis, revealing how it is built, then closes again. Here a phone in isometric 2.5D splits into glass, display, frame/battery and back. Labels appear as the layers separate.',
    good: ['Hardware launches and engineering stories', 'Explaining “what’s inside”', 'Premium tech brand films'],
    avoid: 'Real exploded views need accurate 3D models; this 2.5D version is a concept sketch.',
    anatomy: ['Scene time', 'Four stacked layers in an isometric container', 'translateZ per layer (spread) + labels fade', '1.2s explode · 1.2s hold · 0.9s close', 'expo.inOut', 'Explode → label → hold → collapse'],
    tracks: [['ex', 'Explode layers', 0.5, 1.2, 'expo.inOut', 'object'], ['lab', 'Labels ×4', '-=0.4', 0.4, 'premium', { n: 4, each: 0.08 }], ['hold', 'Hold', '>', 1.1, 'linear'], ['close', 'Collapse', '>', 0.9, 'expo.inOut', 'object']],
    cls: 'bg-navy',
    note: '2.5D simplification using CSS 3D transforms on flat layers, not a 3D model.',
    html: `<div class="center"><div class="ex-iso">${[['Back glass', 'ex-l--back'], ['Battery + frame', 'ex-l--frame'], ['OLED display', 'ex-l--disp'], ['Cover glass', 'ex-l--glass']].map(([n, cls]) => `<div data-r="ly" class="ex-l ${cls}"><span data-r="lab">${n}</span></div>`).join('')}</div></div>`,
    render(t, c) {
      const s = c.p.ex * (1 - c.p.close);
      c.$$.ly.forEach((el, i) => c.set(el, { z: (i - 1.5) * 16 * s }));
      c.$$.lab.forEach((el, i) => c.set(el, { o: c.st('lab', i) * (1 - c.p.close) }));
    },
    prompt: 'Create an exploded-view concept: stack four flat phone layers (back glass, battery/frame, display, cover glass) in an isometric CSS 3D container (rotateX ≈ 55°, rotate ≈ −45°, preserve-3d). Separate them along translateZ over 1.2s with an expo in-out ease, fade labels in with a small stagger, hold, then collapse them back.',
  });

  /* 18 Product rotation (turntable) */
  demo({
    id: 'product-rotation', cat: CAT, name: 'Product Rotation', aka: ['Turntable', '360 spin', 'Packshot rotation'],
    tags: ['object'], char: ['Product', 'Premium', 'Loop'],
    what: 'A cylindrical product turns on a turntable. The trick: the label artwork scrolls horizontally behind fixed cylindrical shading and highlights, so the can looks round and rotating — without a 3D model.',
    good: ['Packshots for drinks, cosmetics, jars', 'E-commerce loops', 'End cards with the product'],
    avoid: 'Box-shaped products — this illusion only works for cylinders. Use real 3D or filmed turntables for other shapes.',
    anatomy: ['Continuous loop', 'Label strip inside the can shape + shading overlay', 'Label translateX loop; shading and highlight fixed', '4s per revolution', 'linear', 'Seamless loop'],
    tracks: [['loop', 'Rotation (seamless)', 0, 4, 'linear', 'object']],
    dur: 4, poster: 1,
    cls: 'bg-studio-warm',
    note: 'Illusion for cylinders: the label scrolls behind fixed shading; there is no 3D model.',
    html: `<div class="center"><div class="pr-can"><div class="pr-can__top"></div><div class="pr-can__body"><div data-r="label" class="pr-label">${'<span class="pr-tile"><b>FIZZ</b><i>YUZU SODA · 330 ML</i></span><span class="pr-tile pr-tile--b"><b>✦</b><i>ZERO SUGAR</i></span>'.repeat(4)}</div><i class="pr-shade"></i></div><div class="pr-can__base"></div></div></div>
      <div class="center"><div class="floor-shadow" style="margin-top:78cqmin;width:40cqmin"></div></div>`,
    render(t, c) { c.set(c.$.label, { xp: -50 * c.r.loop }); },
    prompt: 'Fake a 360° turntable for a cylindrical can: inside the can silhouette, scroll a horizontally repeating label strip from 0 to −50% (one full revolution) every 4s with linear easing, behind a fixed overlay of cylindrical shading (dark edges, soft highlight band). The label should loop seamlessly.',
  });

  /* 19 Product hero reveal */
  demo({
    id: 'product-hero', cat: CAT, name: 'Product Hero Reveal', aka: ['Premium reveal', 'Light reveal', 'Hero shot'],
    tags: ['object', 'brand'], char: ['Premium', 'Cinematic', 'Luxury'],
    what: 'From darkness, a pool of light opens, the product rises into it and is lit by a rim light, then the name appears below. Light — not movement — does most of the work, which is why it feels expensive.',
    good: ['Luxury, beauty and tech launches', 'The first or last shot of a product ad', 'Pre-order and teaser videos'],
    avoid: 'Busy backgrounds or fast cuts around it — premium needs space and time.',
    anatomy: ['Scene time', 'Light pool, product, rim light, reflection, name', 'Light scale + opacity; product translateY + brightness; name tracking', 'Light 1.4s · product 1.4s · name 1s', 'sine.inOut / premium', 'Darkness → light → product → name'],
    tracks: [['light', 'Light opens', 0.2, 1.4, 'sine.inOut', 'fx'], ['rise', 'Product rises', '<0.4', 1.4, 'premium', 'object'], ['rim', 'Rim light sweep', '-=0.6', 1, 'smooth', 'fx'], ['name', 'Name', '-=0.4', 1, 'premium'], ['hold', 'Hold', '>', 0.8, 'linear']],
    cls: 'bg-ink',
    html: `<div class="center"><i data-r="light" class="ph-light"></i></div>
      <div class="center"><div data-r="prod" class="ph-prod">${A.product('serum', { style: '--ph:56cqmin' })}<i data-r="rim" class="ph-rim"></i></div></div>
      <div class="center"><div data-r="refl" class="ph-refl">${A.product('serum', { style: '--ph:56cqmin' })}</div></div>
      <div class="ph-name" data-r="name"><b class="t-serif">Séra</b><span class="t-eyebrow">Daily serum · 30 ml</span></div>`,
    render(t, c) {
      c.set(c.$.light, { s: lerp(0.3, 1, c.p.light), o: c.p.light });
      c.set(c.$.prod, { y: lerp(14, -6, c.p.rise), bright: lerp(0.15, 1, c.p.rise), o: clamp(c.r.rise * 2) });
      c.set(c.$.refl, { y: lerp(-14, 6, c.p.rise), o: c.p.rise * 0.22 });
      c.set(c.$.rim, { xp: lerp(-160, 160, c.p.rim), o: bump(c.r.rim) });
      c.set(c.$.name, { o: c.p.name, css: { letterSpacing: lerp(0.3, 0.05, c.p.name) + 'em' } });
    },
    prompt: 'Create a premium product hero reveal: start in darkness, open a soft pool of light behind the product (scale 0.3 → 1, opacity 0 → 1, 1.4s sine in-out). 0.4s later raise the product into the light while its brightness goes from 15% to 100% (1.4s, premium ease), sweep a rim highlight across it, add a faint floor reflection, and finally fade the product name in while its letter-spacing tightens.',
  });

  /* 20 Floating showcase */
  demo({
    id: 'product-floating', cat: CAT, name: 'Product Floating Showcase', aka: ['Floating products', 'Zero-gravity packshot', 'Product levitation'],
    tags: ['object'], char: ['Playful', 'Premium', 'Loop'],
    what: 'Several products hover at different depths: the back ones are smaller, softer and move less; the front one is sharp and moves most. Out-of-phase floating plus a slow sideways drift creates a calm, dimensional showcase.',
    good: ['Product range or bundle ads', 'Catalogue and e-commerce loops', 'Backgrounds behind offers'],
    avoid: 'Products touching or overlapping important text; keep clear space around each item.',
    anatomy: ['Continuous loop', 'Three products at three depths + shadows', 'translateY sine (amplitude ∝ depth) + rotate + drift; back items blurred', '5s loop', 'Sine (seamless)', 'All float out of phase'],
    tracks: [['loop', 'Float loop (seamless)', 0, 5, 'linear', 'bg'], ['in', 'Fade in', 0, 0.8, 'premium']],
    dur: 5, poster: 1.4,
    cls: 'bg-lilac',
    html: `<div class="center"><div class="ssr">
      <div data-r="pr" class="abs" style="left:-36cqmin;top:-40cqmin">${A.product('pouch', { style: '--ph:34cqmin' })}</div>
      <div data-r="pr" class="abs" style="left:4cqmin;top:-46cqmin">${A.product('can', { style: '--ph:38cqmin' })}</div>
      <div data-r="pr" class="abs" style="left:-18cqmin;top:-16cqmin">${A.product('serum', { style: '--ph:54cqmin' })}</div></div></div>`,
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      const depth = [0.45, 0.6, 1];
      c.$$.pr.forEach((el, i) => {
        const d = depth[i];
        c.set(el, { y: Math.sin(a + i * 2.1) * 3 * d, x: Math.sin(a) * 2 * d, r: Math.sin(a + i) * 4 * d, blur: (1 - d) * 0.9, bright: lerp(0.85, 1, d), o: c.p.in });
      });
    },
    prompt: 'Create a floating product showcase: place three products at different depths (back items smaller, slightly blurred and darker). Float each on its own sine phase over a 5s seamless loop, with amplitude and rotation proportional to depth, plus a gentle shared sideways drift for parallax.',
  });
})();
