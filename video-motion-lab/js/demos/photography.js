/* 04 — Image & Photography Motion
   Slow moves add time to stills; reveals add structure; punches add energy. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, A, rng } = window.VML;
  const CAT = 'image';
  const IMG = ['image'];
  const ph = (name, r, style = '') => A.photo(name, { r, cls: 'fill', style });

  /* 01 Ken Burns */
  demo({
    id: 'ken-burns', cat: CAT, name: 'Ken Burns', aka: ['Slow zoom + pan', 'Pan and scan', 'Documentary move'],
    tags: IMG.concat('camera'), char: ['Cinematic', 'Documentary', 'Calm'],
    what: 'A slow, continuous zoom combined with a gentle pan across a still photo, so it feels like footage. Two photos alternate direction (in then out) and dissolve between each other — the classic documentary pattern.',
    good: ['Photo slideshows and documentaries', 'Real-estate, travel and food', 'Giving stills duration in a video edit'],
    avoid: 'Fast or large moves — Ken Burns must be barely noticeable. If the viewer notices the zoom, it is too fast.',
    anatomy: ['Scene time', 'Photo A, photo B, lower third', 'A: scale 1 → 1.18 + pan · B: scale 1.18 → 1 + opposite pan', '≈3.6s per photo, 0.8s dissolve', 'sine.inOut (almost linear)', 'A moves → dissolve → B moves the other way'],
    tracks: [['a', 'Photo A · zoom in + pan', 0, 3.6, 'sine.inOut'], ['x', 'Cross dissolve', 2.8, 0.8, 'smooth', 'fx'], ['b', 'Photo B · zoom out + pan', 2.8, 3.6, 'sine.inOut'], ['lt', 'Lower third', 0.6, 0.8, 'premium']],
    dur: 6.4,
    html: `${ph('alpine', 'a')}${ph('ocean', 'b')}<div class="kb-lt" data-r="lt"><span class="t-eyebrow">Chapter 02</span><b class="t-serif">Into the <i>quiet</i></b></div>`,
    render(t, c) {
      c.set(c.$.a, { s: lerp(1, 1.18, c.p.a), xp: lerp(-3, 3, c.p.a) });
      c.set(c.$.b, { s: lerp(1.18, 1, c.p.b), xp: lerp(3, -3, c.p.b), o: c.p.x });
      c.set(c.$.lt, { o: c.p.lt * (1 - c.p.x), y: 3 * (1 - c.p.lt) });
    },
    prompt: 'Apply a Ken Burns move to a sequence of stills: photo A slowly scales from 1 to 1.18 while panning slightly to the right over 3.6s (sine in-out, nearly linear). Cross-dissolve into photo B over 0.8s; photo B moves the opposite way (scale 1.18 → 1, pan left). The movement must feel barely noticeable. Add a lower-third title that fades out with the dissolve.',
  });

  /* 02 Push in / pull out */
  demo({
    id: 'push-pull-image', cat: CAT, name: 'Push In / Pull Out', aka: ['Zoom in on image', 'Image zoom out', 'Scale push'],
    tags: IMG.concat('camera'), char: ['Cinematic', 'Dramatic', 'Focused'],
    variants: [['in', 'Push in'], ['out', 'Pull out']],
    what: 'A camera-style zoom on a photo. A push-in focuses attention and raises tension (moving closer to the subject); a pull-out reveals context and releases it. Unlike Ken Burns it has a clear start and end and a purpose.',
    good: ['Push in: emphasising a face, a detail, a product', 'Pull out: revealing the setting or the final layout', 'Emotional beats in storytelling'],
    avoid: 'Zooming into low-resolution images — upscale softness is very visible at 130%+.',
    anatomy: ['Scene time', 'Portrait photo + caption', 'scale 1 → 1.35 (push) / 1.35 → 1 (pull), origin on the subject', '2.6s', 'smooth (cubic in-out)', 'One deliberate move, caption lands at the end'],
    tracks: (v) => [['cam', v === 'in' ? 'Push in' : 'Pull out', 0.3, 2.6, 'smooth'], ['cap', 'Caption', '-=0.8', 0.8, 'premium'], ['hold', 'Hold', '>', 0.8, 'linear']],
    html: `${A.photo('portrait', { r: 'img', cls: 'fill', style: 'transform-origin:50% 42%' })}<div class="vignette"></div>
      <div class="pp-cap" data-r="cap"><span class="t-eyebrow">Portrait series</span><b class="t-serif">The <i>look</i> that stays.</b></div>`,
    render(t, c) {
      const s = c.v === 'in' ? lerp(1, 1.35, c.p.cam) : lerp(1.35, 1, c.p.cam);
      c.set(c.$.img, { s });
      c.set(c.$.cap, { o: c.p.cap, y: 3 * (1 - c.p.cap) });
    },
    prompt: (v) => v === 'in'
      ? 'Create a slow push-in on a portrait: scale the photo from 1 to 1.35 over 2.6s with a smooth ease-in-out, using the subject’s face as the transform origin so it stays in place while the frame tightens. Fade a caption in during the last 0.8s.'
      : 'Create a pull-out reveal: start the photo at scale 1.35 framed tightly on the subject and pull back to 1 over 2.6s with a smooth ease-in-out, revealing the surroundings. Land the caption as the move settles.',
  });

  /* 03 Pan */
  const PAN = { left: ['xp', 6, -6], right: ['xp', -6, 6], up: ['yp', 6, -6], down: ['yp', -6, 6] };
  demo({
    id: 'image-pan', cat: CAT, name: 'Image Pan', aka: ['Pan left / right', 'Pan up / down', 'Slide across image'],
    tags: IMG.concat('camera'), char: ['Cinematic', 'Calm', 'Exploratory'],
    variants: [['left', 'Pan left'], ['right', 'Pan right'], ['up', 'Pan up'], ['down', 'Pan down']],
    what: 'The frame travels across an oversized photo. Horizontal pans explore a scene (a skyline, a table); vertical pans reveal height (a building, a portrait from feet to face). Direction should follow the content.',
    good: ['Panoramas and skylines (horizontal)', 'Tall subjects (vertical)', 'Reframing a landscape photo into 9:16'],
    avoid: 'Panning across empty areas — always end on something worth looking at.',
    anatomy: ['Scene time', 'Oversized city photo (scale 1.15)', 'translateX/Y ±6% of the image', '4s', 'sine.inOut', 'One continuous move'],
    tracks: [['pan', 'Pan', 0.2, 4, 'sine.inOut'], ['title', 'Title', 0.8, 0.8, 'premium']],
    html: `${A.photo('city', { r: 'img', cls: 'fill', style: 'transform:scale(1.15)' })}<div class="pan-title" data-r="title"><b class="t-sans">After hours</b><span class="t-eyebrow">City guide · Vol. 3</span></div>`,
    render(t, c) {
      const [k, a, b] = PAN[c.v];
      c.set(c.$.img, { s: 1.15, [k]: lerp(a, b, c.p.pan) });
      c.set(c.$.title, { o: c.p.title, y: 3 * (1 - c.p.title) });
    },
    prompt: (v) => `Pan ${v} across a photo: scale the image to about 1.15 so there is room to move, then translate it ${v === 'left' || v === 'right' ? 'horizontally' : 'vertically'} by ±6% of its size over 4s with a sine ease-in-out. End the move on the most interesting part of the image.`,
  });

  /* 04 Parallax photo */
  demo({
    id: 'parallax-photo', cat: CAT, name: 'Parallax Photo', aka: ['2.5D photo', 'Layered photo', 'Photo depth'],
    tags: IMG.concat('camera'), char: ['Cinematic', 'Immersive', 'Travel'],
    what: 'The photo is split into depth layers (sky, mountains, hills, subject, foreground). Each layer moves at a different speed — near layers faster — which creates convincing depth from a single still.',
    good: ['Travel and landscape content', 'Hero intros', 'Making archive photos feel alive'],
    avoid: 'Bad layer cut-outs — edge halos ruin the illusion. Keep the move small if separation is rough.',
    anatomy: ['Scene time', 'Six depth layers', 'translateX proportional to depth + slight scale', '4.2s', 'sine.inOut', 'All layers move together, at different rates'],
    tracks: [['cam', 'Lateral move (all layers)', 0.2, 4.2, 'sine.inOut'], ['title', 'Title', 0.6, 0.9, 'premium']],
    html: `${A.landscape()}<div class="px-title" data-r="title"><span class="t-eyebrow">Parallax</span><b class="t-serif">Far, <i>near</i>, nearer.</b></div>`,
    render(t, c) {
      const m = lerp(-1, 1, c.p.cam);
      const L = { 'ly-sky': 0, 'ly-sun': 0.4, 'ly-far': 1.5, 'ly-mid': 3.5, 'ly-near': 6.5, 'ly-subject': 7.5, 'ly-fg': 13 };
      for (const k in L) c.set(c.$[k], { x: -m * L[k], s: 1 + L[k] * 0.004 });
      c.set(c.$.title, { o: c.p.title, y: 3 * (1 - c.p.title) });
    },
    prompt: 'Create a 2.5D parallax photo: separate the image into depth layers (sky, distant mountains, mid hills, near hills, subject, foreground plants). Move all layers sideways together over 4.2s with a sine ease-in-out, where the offset is proportional to depth (sky ≈ 0, foreground ≈ 13% of the frame). Add a tiny extra scale to nearer layers.',
  });

  /* 05 Mask reveal */
  const MASKS = {
    circle: (p) => `circle(${lerp(0, 75, p)}% at 50% 50%)`,
    rect: (p) => `inset(${lerp(50, 0, p)}% ${lerp(50, 0, p)}% ${lerp(50, 0, p)}% ${lerp(50, 0, p)}% round ${lerp(30, 0, p)}cqmin)`,
    arch: (p) => `inset(${lerp(100, 8, p)}% 12% 8% 12% round 40cqmin 40cqmin 2cqmin 2cqmin)`,
  };
  demo({
    id: 'mask-reveal', cat: CAT, name: 'Mask Reveal', aka: ['Shape reveal', 'Clip-path reveal', 'Iris (image)'],
    tags: IMG.concat('transition'), char: ['Editorial', 'Elegant', 'Fashion'],
    variants: [['circle', 'Circle'], ['rect', 'Rounded rect'], ['arch', 'Arch']],
    what: 'The photo is revealed through a growing shape. The image never moves; only the clipping shape changes. The shape itself becomes part of the design language — circles feel soft, arches feel architectural and premium.',
    good: ['Fashion, beauty and interiors', 'Revealing a product shot', 'Brand systems built on a shape'],
    avoid: 'Shapes that do not relate to the brand or content — a random star mask looks dated.',
    anatomy: ['Scene time', 'Photo inside a clip-path', 'clip-path grows (circle radius / inset)', '1.2s', 'expo.inOut', 'Shape grows → photo slowly settles in scale'],
    tracks: [['mask', 'Mask grows', 0.3, 1.2, 'expo.inOut'], ['settle', 'Image settle', '<', 2.4, 'out'], ['title', 'Title', '<0.8', 0.7, 'premium'], ['hold', 'Hold', '>', 0.6, 'linear']],
    cls: 'bg-cream',
    html: `${A.photo('fabric', { r: 'img', cls: 'fill' })}<div class="mr-title" data-r="title"><b class="t-serif">Rouge</b><span class="t-eyebrow">Collection 04</span></div>`,
    render(t, c) {
      c.set(c.$.img, { clip: MASKS[c.v](c.p.mask), s: lerp(1.2, 1, c.p.settle) });
      c.set(c.$.title, { o: c.p.title, y: 3 * (1 - c.p.title) });
    },
    prompt: (v) => `Reveal the photo through a growing ${v === 'circle' ? 'circle (clip-path circle from 0 to 75%)' : v === 'rect' ? 'rounded rectangle (clip-path inset from 50% to 0 with the corner radius shrinking)' : 'arch shape (clip-path inset with large top corner radii, growing upwards)'} over 1.2s with an expo in-out ease. While it opens, let the image settle from scale 1.2 to 1. Fade the title in near the end.`,
  });

  /* 06 Wipe reveal */
  const WIPES = {
    h: [(p) => `inset(0 ${100 - p * 100}% 0 0)`, (p) => ({ xw: p * 100 - 50 }), 'v'],
    v: [(p) => `inset(${100 - p * 100}% 0 0 0)`, (p) => ({ yh: 50 - p * 100 }), 'h'],
    d: [(p) => `polygon(0 0, ${p * 220}% 0, ${p * 220 - 120}% 100%, 0 100%)`, (p) => ({ xw: p * 220 - 110 }), 'd'],
  };
  demo({
    id: 'wipe-reveal', cat: CAT, name: 'Wipe Reveal', aka: ['Linear wipe', 'Edge wipe', 'Directional reveal'],
    tags: IMG.concat('transition'), char: ['Clean', 'Graphic', 'Editorial'],
    variants: [['h', 'Horizontal'], ['v', 'Vertical'], ['d', 'Diagonal']],
    what: 'A straight edge travels across the frame and reveals the new photo behind it. A thin accent line rides the edge so the eye can follow the wipe. Simple, clean and very “graphic design”.',
    good: ['Before / after comparisons', 'Editorial photo sequences', 'Revealing a second product colour'],
    avoid: 'Slow wipes over similar images — the viewer cannot tell anything changed.',
    anatomy: ['Scene time', 'Photo B over photo A + edge line', 'clip-path inset / polygon moves across', '1.1s', 'expo.inOut', 'Hold A → wipe → hold B'],
    tracks: [['hold', 'Hold A', 0, 0.6, 'linear'], ['wipe', 'Wipe', '>', 1.1, 'expo.inOut', 'fx'], ['holdb', 'Hold B', '>', 1, 'linear']],
    html: (v) => `${ph('interior', 'a')}${ph('coffee', 'b')}<div class="center"><i data-r="edge" class="wipe-edge wipe-edge--${WIPES[v][2]}"></i></div>`,
    render(t, c) {
      const [clip, edge] = WIPES[c.v];
      const p = c.p.wipe;
      c.set(c.$.b, { clip: clip(p) });
      c.set(c.$.edge, Object.assign({ o: p > 0 && p < 1 ? 1 : 0 }, edge(p)));
    },
    prompt: (v) => `Reveal photo B over photo A with a ${v === 'h' ? 'left-to-right' : v === 'v' ? 'bottom-to-top' : 'diagonal'} wipe: animate a clip-path edge across the frame over 1.1s with an expo in-out ease, and attach a thin accent line to the moving edge so the eye follows it. Hold each photo for at least 0.6s.`,
  });

  /* 07 Split reveal */
  demo({
    id: 'split-reveal', cat: CAT, name: 'Split Reveal', aka: ['Split screen open', 'Door reveal', 'Center split'],
    tags: IMG.concat('transition'), char: ['Dramatic', 'Bold', 'Editorial'],
    what: 'The current image splits down the middle and both halves slide away like doors, revealing the next image behind. It feels like opening something — great for a reveal or a “new chapter”.',
    good: ['Product launch reveals', 'Chapter breaks', 'Before → after'],
    avoid: 'Subjects sitting exactly on the split line — faces cut in half look awkward mid-move.',
    anatomy: ['Scene time', 'Two halves of photo A, photo B behind', 'Left half translateX −100%, right half +100%; B scale 1.15 → 1', '1.0s split · 1.4s settle', 'expo.inOut · premium', 'Hold → split → B settles'],
    tracks: [['hold', 'Hold A', 0, 0.7, 'linear'], ['split', 'Split open', '>', 1.0, 'expo.inOut', 'fx'], ['settle', 'B settles', '<0.1', 1.4, 'premium'], ['title', 'Title', '<0.5', 0.7, 'premium']],
    html: `${ph('food', 'b')}<div class="sr-title" data-r="title"><b class="t-display">Now open</b></div>
      <div class="sr-half sr-half--l" data-r="l"><div class="photo" style="background-image:url(${A.imgPath('interior')})"></div></div>
      <div class="sr-half sr-half--r" data-r="r"><div class="photo" style="background-image:url(${A.imgPath('interior')})"></div></div>`,
    render(t, c) {
      c.set(c.$.l, { xp: -100 * c.p.split });
      c.set(c.$.r, { xp: 100 * c.p.split });
      c.set(c.$.b, { s: lerp(1.15, 1, c.p.settle) });
      c.set(c.$.title, { o: c.p.title, s: lerp(0.9, 1, c.p.title) });
    },
    prompt: 'Create a split reveal: cut the current image vertically into two halves and slide them apart (left half to −100%, right half to +100%) over 1s with an expo in-out ease, revealing the next image underneath, which settles from scale 1.15 to 1. Bring the title in as the doors clear.',
  });

  /* 08 Slice reveal */
  const N = 7;
  demo({
    id: 'slice-reveal', cat: CAT, name: 'Venetian / Slice Reveal', aka: ['Blinds reveal', 'Strip reveal', 'Slat transition'],
    tags: IMG.concat('transition'), char: ['Graphic', 'Rhythmic', 'Fashion'],
    variants: [['up', 'Slide strips'], ['scale', 'Blinds (scale)']],
    what: 'The image appears through several vertical strips, each animating a moment after the previous. The stagger turns a simple reveal into a rhythmic, graphic gesture.',
    good: ['Fashion and music visuals', 'Revealing a hero image with energy', 'Brand systems with stripes or grids'],
    avoid: 'Too many strips (> 10) — it starts to look like a glitch instead of a design.',
    anatomy: ['Scene time', '7 strips, each a window onto the same photo', 'Strip translateY 100% → 0 (or scaleY 0 → 1)', '0.8s per strip · 70ms stagger', 'expo.out', 'Left to right cascade'],
    tracks: [['s', 'Strips ×7 (70ms)', 0.4, 0.8, 'expo.out', { n: N, each: 0.07 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-ink',
    html: Array.from({ length: N }, (_, i) => `<div class="slice" style="left:${(i * 100) / N}%;width:${100 / N + 0.2}%"><div data-r="s" class="slice__in"><div class="photo" style="width:${N * 100}%;left:${-i * 100}%;background-image:url(${A.imgPath('portrait')})"></div></div></div>`).join(''),
    render(t, c) {
      c.$$.s.forEach((el, i) => {
        const p = c.st('s', i);
        if (c.v === 'up') c.set(el, { yp: (i % 2 ? -100 : 100) * (1 - p) });
        else c.set(el, { sy: p });
      });
    },
    prompt: (v) => `Reveal the image through 7 vertical strips: each strip is a window showing its slice of the same photo (aligned so the image is continuous). Animate the strips one after another with a 70ms stagger and an expo-out ease over 800ms each, ${v === 'up' ? 'sliding alternately from the top and bottom' : 'scaling each strip from 0 to 1 vertically like opening blinds'}.`,
  });

  /* 09 Image scale punch */
  const PUNCH = ['dunes', 'city', 'food'];
  demo({
    id: 'scale-punch', cat: CAT, name: 'Image Scale Punch', aka: ['Zoom punch', 'Punch-in', 'Beat zoom'],
    tags: IMG.concat('social'), char: ['Energetic', 'Social', 'Punchy'],
    what: 'Each new image enters with a fast zoom (scale 1.3 → 1 in ~250ms) on a beat, often with a short white flash. It is the signature move of fast-paced social edits and sports promos.',
    good: ['Fast montages on a beat', 'Hooks and product highlights', 'Energetic promo edits'],
    avoid: 'Calm, premium or informational content. Repeated punches also fatigue — vary with holds.',
    anatomy: ['Beat-synced cuts', 'Three photos', 'scale 1.3 → 1 + flash on each cut', '0.28s punch every 0.7s', 'expo.out', 'Cut → punch → micro drift → cut'],
    tracks: PUNCH.map((n, i) => [`p${i}`, `Cut + punch ${i + 1}`, 0.2 + i * 0.7, 0.28, 'expo.out', 'image']).concat(PUNCH.map((n, i) => [`b${i}`, 'Beat', 0.2 + i * 0.7, 0, 'linear', 'beat'])).concat([['hold', 'Hold', 2.3, 0.9, 'linear']]),
    html: `${PUNCH.map((n) => ph(n, 'img')).join('')}<i data-r="flash" class="flash"></i>`,
    render(t, c) {
      let cur = -1;
      PUNCH.forEach((_, i) => { if (c.r['p' + i] > 0) cur = i; });
      c.$$.img.forEach((el, i) => {
        const p = c.p['p' + i];
        const drift = i === cur ? (t - c.tl.map['p' + i].start) * 0.04 : 0;
        c.set(el, { o: i === cur ? 1 : 0, s: lerp(1.3, 1, p) + drift });
      });
      let f = 0;
      PUNCH.forEach((_, i) => { const r = c.r['p' + i]; if (r > 0 && r < 1) f = Math.max(f, (1 - r) * 0.55); });
      c.set(c.$.flash, { o: f });
    },
    prompt: 'Cut between three photos on a 0.7s beat. On each cut, punch the new image in from scale 1.3 to 1 over 280ms with an expo-out ease and flash a white overlay from 55% opacity to 0 over the same time; after the punch let the image drift up very slightly until the next cut.',
  });

  /* 10 Image float */
  demo({
    id: 'image-float', cat: CAT, name: 'Image Float', aka: ['Floating photo', 'Bobbing image', 'Ambient float'],
    tags: IMG, char: ['Calm', 'Premium', 'Dreamy'],
    what: 'A framed photo drifts slowly up and down with a tiny rotation, like it is suspended in air. The shadow responds to the height. Ambient motion keeps a static layout from feeling frozen.',
    good: ['Backgrounds behind text', 'Mood boards and lookbooks', 'Loops for social posts'],
    avoid: 'Combining with lots of other motion — ambient float only works when it is the quietest thing on screen.',
    anatomy: ['Continuous loop', 'Photo card + shadow', 'translateY ±2.5% + rotate ±1.5° (offset phases)', '4s cycle', 'sine (implicit)', 'Seamless loop'],
    tracks: [['loop', 'Float cycle (seamless)', 0, 4, 'linear'], ['in', 'Fade in', 0, 0.8, 'premium']],
    dur: 4, poster: 1,
    cls: 'bg-studio-light',
    html: `<div class="center"><div class="floor-shadow" data-r="sh" style="margin-top:62cqmin;width:44cqmin"></div></div>
      <div class="center"><div data-r="card" class="frame" style="position:relative;width:54cqmin;height:68cqmin">${A.photo('coffee', { cls: 'fill' })}</div></div>`,
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      const y = Math.sin(a) * 2.5;
      c.set(c.$.card, { y, r: Math.sin(a + 1.2) * 1.5, o: c.p.in });
      c.set(c.$.sh, { sx: 1 - y * 0.03, o: 0.8 - y * 0.06 });
    },
    prompt: 'Make the photo card float: animate translateY ±2.5% and rotate ±1.5° using sine waves with slightly offset phases on a 4s seamless loop, and scale the soft floor shadow inversely with the height. Keep it subtle — this is ambient motion.',
  });

  /* 11 Photo stack */
  const STACK = [['alpine', -8, 'left'], ['dunes', 6, 'right'], ['ocean', -3, 'bottom'], ['portrait', 2, 'top']];
  demo({
    id: 'photo-stack', cat: CAT, name: 'Photo Stack', aka: ['Stacked photos', 'Card stack', 'Pile up'],
    tags: IMG, char: ['Playful', 'Personal', 'Lifestyle'],
    what: 'Photos fly in from different sides and land on top of each other with small rotation offsets, building a physical stack. Each landing has a tiny settle so the pile feels real.',
    good: ['Recaps (“my week in photos”)', 'Travel and lifestyle content', 'Introducing a collection'],
    avoid: 'Hiding the important photo under the pile — the last (top) photo is the hero.',
    anatomy: ['Scene time', 'Four photo cards', 'translate from off-frame + rotate to a resting angle + scale 1.1 → 1', '0.7s each · 0.35s apart', 'back.soft', 'Each card lands on top of the previous one'],
    tracks: [['s', 'Cards land ×4 (350ms)', 0.3, 0.7, 'back.soft', { n: 4, each: 0.35 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-sand',
    html: `<div class="center">${STACK.map(([n]) => `<div data-r="card" class="frame stack-card">${A.photo(n, { cls: 'fill' })}</div>`).join('')}</div>`,
    render(t, c) {
      const from = { left: { xw: -90 }, right: { xw: 90 }, bottom: { yh: 80 }, top: { yh: -80 } };
      c.$$.card.forEach((el, i) => {
        const p = c.st('s', i), f = from[STACK[i][2]];
        c.set(el, { xw: (f.xw || 0) * (1 - p), yh: (f.yh || 0) * (1 - p), r: lerp(STACK[i][1] * 4, STACK[i][1], p), s: lerp(1.1, 1, p), o: p > 0 ? 1 : 0 });
      });
    },
    prompt: 'Build a photo stack: four photo cards fly in one after another (350ms apart) from different edges, each rotating to a small resting angle (−8° to +6°) and scaling from 1.1 to 1 with a soft back-out over 700ms, landing on top of the previous card. The last card is the hero.',
  });

  /* 12 Polaroid scatter */
  const POL = [['dunes', 'desert', -14, -12, -9], ['coffee', 'slow mornings', 12, -18, 7], ['ocean', 'coastline', -12, 16, 5], ['alpine', 'altitude', 14, 12, -6]];
  demo({
    id: 'polaroid-scatter', cat: CAT, name: 'Polaroid Scatter', aka: ['Scattered photos', 'Photo drop', 'Memory board'],
    tags: IMG, char: ['Playful', 'Nostalgic', 'Personal'],
    what: 'Instant-photo frames drop onto a surface and scatter into a loose, overlapping layout. Rotations are random-looking but restrained (±15°), and each lands with a soft scale-down as if falling onto a table.',
    good: ['Memories, travel recaps, “behind the scenes”', 'Community / UGC compilations', 'Nostalgic campaigns'],
    avoid: 'Corporate or data content — the scrapbook look sets a casual tone.',
    anatomy: ['Scene time', 'Four polaroids', 'scale 1.6 → 1 (drop toward the table) + rotation + opacity', '0.6s each · 0.25s apart', 'expo.out', 'Drop, drop, drop, drop → hold'],
    tracks: [['d', 'Polaroids drop ×4', 0.3, 0.6, 'expo.out', { n: 4, each: 0.25 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: POL.map(([n, cap, x, y]) => `<div class="center"><div data-r="p" class="polaroid" style="position:relative;width:40cqmin;height:48cqmin;margin:${y * 2}cqmin 0 0 ${x * 2}cqmin">${A.photo(n)}<b>${cap}</b></div></div>`).join(''),
    render(t, c) {
      c.$$.p.forEach((el, i) => {
        const p = c.st('d', i);
        c.set(el, { s: lerp(1.6, 1, p), r: lerp(POL[i][4] * 2.2, POL[i][4], p), o: Math.min(1, p * 3) });
      });
    },
    prompt: 'Drop four polaroid-style photos onto the frame one after another (250ms apart): each starts at scale 1.6 and transparent, then falls to scale 1 with an expo-out ease over 600ms while rotating to a restrained random angle (between −10° and +10°). The final layout overlaps loosely like photos on a table.',
  });

  /* 13 Carousel */
  const CAR = ['alpine', 'dunes', 'ocean', 'city'];
  demo({
    id: 'photo-carousel', cat: CAT, name: 'Photo Carousel Motion', aka: ['Slider', 'Swipe carousel', 'Gallery motion'],
    tags: IMG.concat('ui'), char: ['Clean', 'Product', 'Smooth'],
    what: 'Photos slide horizontally as if swiped. The active photo is full size and bright; neighbours are smaller and dimmed, which creates focus. Each swipe uses inertia-like easing so it lands softly.',
    good: ['Showing a product range or colours', 'Carousel ads and multi-image posts', 'App gallery demos'],
    avoid: 'Auto-advancing too fast — give each slide at least ~1s.',
    anatomy: ['Scene time (simulated swipes)', 'Four slides on a track', 'Track translateX one slide per step; active scale 1, others 0.85 + dim', '0.7s per swipe · 0.9s hold', 'expo.inOut', 'Swipe → hold → swipe → hold'],
    tracks: [1, 2, 3].map((n) => [`s${n}`, `Swipe ${n}`, 0.6 + (n - 1) * 1.4, 0.7, 'expo.inOut']).concat([['hold', 'Hold', '>', 0.9, 'linear']]),
    cls: 'bg-coal',
    html: `<div class="car"><div class="car__track" data-r="track">${CAR.map((n) => `<div data-r="slide" class="car__slide frame">${A.photo(n, { cls: 'fill' })}</div>`).join('')}</div></div>
      <div class="car__dots">${CAR.map(() => '<i data-r="dot"></i>').join('')}</div>`,
    render(t, c) {
      const pos = c.p.s1 + c.p.s2 + c.p.s3;
      c.set(c.$.track, { xw: -pos * 64 });
      c.$$.slide.forEach((el, i) => { const d = Math.min(1, Math.abs(i - pos)); c.set(el, { s: lerp(1, 0.84, d), o: lerp(1, 0.45, d) }); });
      c.$$.dot.forEach((el, i) => el.classList.toggle('on', Math.round(pos) === i));
    },
    prompt: 'Animate a photo carousel: slides sit on a horizontal track; every 1.4s the track moves by one slide over 700ms with an expo in-out ease (like a swipe landing). The active slide is scale 1 at full opacity, neighbours scale 0.84 at 45% opacity, interpolated by distance from the centre. Update the pagination dots as each swipe lands.',
  });

  /* 14 Match cut */
  demo({
    id: 'image-match-cut', cat: CAT, name: 'Image Match Cut', aka: ['Graphic match', 'Shape match cut', 'Form cut'],
    tags: IMG.concat('transition'), char: ['Cinematic', 'Clever', 'Editorial'],
    what: 'Two different images are cut together where a shape lines up — here the round sun becomes a round coffee cup. The eye follows the circle across the cut, so the change feels seamless and clever. Simplified demo: the dashed circle marks the matching shape.',
    good: ['Story transitions with meaning (sunrise → morning coffee)', 'Brand films and ads', 'Connecting two products or ideas'],
    avoid: 'Shapes that do not actually match in size and position at the cut frame — then it is just a cut.',
    anatomy: ['Scene time', 'Photo A (sun), photo B (cup), guide circle', 'A pushes in toward the sun → hard cut → B pulls out from the cup', '1.4s in · cut · 1.4s out', 'expo.in into the cut · expo.out after', 'Zoom toward shape → cut on matching frame → zoom away'],
    tracks: [['a', 'Push into sun', 0.3, 1.4, 'cubic.in', 'camera'], ['cut', 'Match cut', '>', 0, 'linear', 'cut'], ['b', 'Pull out of cup', '>', 1.4, 'expo.out', 'camera'], ['guide', 'Shape guide', 0.3, 3.0, 'linear', 'fx'], ['hold', 'Hold', '>', 0.5, 'linear']],
    html: `<div class="mc-sq" data-r="a" style="transform-origin:65% 35%"><div class="photo fill" style="background-image:url(${A.imgPath('dunes')})"></div></div>
      <div class="mc-sq" data-r="b"><div class="photo fill" style="background-image:url(${A.imgPath('coffee')})"></div></div>
      <div class="mc-sq"><svg data-r="ring" class="mc-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" vector-effect="non-scaling-stroke"/></svg></div>
      <span data-r="lbl" class="tag" style="left:50%;top:6%;transform:translateX(-50%)">match: circle</span>`,
    render(t, c) {
      /* Sun: Ø 15.4% of image A at (65%, 35%). Coffee: Ø 34.2% of image B, centred.
         A is pushed so the sun is centred at 3.2× (Ø 49%); B starts at 1.44× so its coffee is also Ø 49%. */
      const cutAt = c.tl.map.cut.start;
      const before = t < cutAt;
      c.set(c.$.a, { o: before ? 1 : 0, xp: -15 * c.p.a, yp: 15 * c.p.a, s: lerp(1, 3.2, c.p.a) });
      c.set(c.$.b, { o: before ? 0 : 1, s: lerp(1.44, 1, c.p.b) });
      const rs = before ? lerp(0.154, 0.493, c.p.a) : lerp(0.493, 0.342, c.p.b);
      const k = before ? 1 - c.p.a : 0; // ring follows the sun from (65%, 35%) to the centre
      c.set(c.$.ring, { s: rs, xp: 15 * k, yp: -15 * k, o: c.r.guide > 0 && c.r.guide < 1 ? 0.9 : 0 });
      c.set(c.$.lbl, { o: Math.abs(t - cutAt) < 0.5 ? 1 : 0 });
    },
    note: 'Simplified demonstration: real match cuts are planned while shooting so the shapes align naturally.',
    prompt: 'Create a graphic match cut between two images that share a shape: push in on image A toward its circular element (the sun) over 1.4s with an accelerating ease, hard-cut on the frame where the circle reaches a set size and position, then pull out of image B from its matching circle (a coffee cup) over 1.4s with an expo-out ease. The circles must line up exactly on the cut frame.',
  });

  /* 15 Collage */
  const COL = [['alpine', 6, 6, 52, 40], ['coffee', 62, 6, 32, 24], ['portrait', 62, 34, 32, 40], ['food', 6, 50, 52, 44], ['title', 62, 78, 32, 16]];
  demo({
    id: 'photo-collage', cat: CAT, name: 'Photo Collage Motion', aka: ['Grid assemble', 'Mosaic layout', 'Collage build'],
    tags: IMG, char: ['Editorial', 'Structured', 'Lifestyle'],
    what: 'Several photos fly into a grid composition one by one, each sliding from the nearest edge. The final frame is a designed layout; the motion explains how it is built.',
    good: ['Recaps and “highlights” posts', 'Event and product collections', 'Opening frames of carousels'],
    avoid: 'All tiles arriving at once from the same direction — it hides the structure.',
    anatomy: ['Scene time', 'Five tiles in a grid', 'Each tile translate from its nearest edge + scale 1.1 → 1 inside its frame', '0.8s · 110ms stagger', 'expo.out', 'Largest tile first, title tile last'],
    tracks: [['t', 'Tiles ×5 (110ms)', 0.3, 0.8, 'expo.out', { n: 5, each: 0.11 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: COL.map(([n, x, y, w, h]) => `<div data-r="tile" class="col-tile${n === 'title' ? ' col-tile--title' : ''}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%">${n === 'title'
      ? '<div data-r="img" class="fill col-title">Highlights <i>2026</i></div>'
      : `<div data-r="img" class="photo fill" style="background-image:url(${A.imgPath(n)})"></div>`}</div>`).join(''),
    render(t, c) {
      c.$$.tile.forEach((el, i) => {
        const p = c.st('t', i);
        const [, x, y, w] = COL[i];
        const fromLeft = x < 40;
        c.set(el, { xw: (fromLeft ? -1 : 1) * 60 * (1 - p), o: p > 0 ? 1 : 0 });
        c.set(c.$$.img[i], { s: lerp(1.3, 1, p) });
      });
    },
    prompt: 'Assemble a photo collage: five tiles of different sizes slide into a grid layout from their nearest side edge, 110ms apart, each over 800ms with an expo-out ease, while the photo inside each tile settles from scale 1.3 to 1. Start with the largest tile and finish with the title.',
  });

  /* 16 Freeze frame + typography */
  demo({
    id: 'freeze-frame', cat: CAT, name: 'Image Freeze + Typography', aka: ['Freeze frame', 'Hero freeze', 'Stop-motion title'],
    tags: IMG.concat('text', 'social'), char: ['Cinematic', 'Social', 'Storytelling'],
    what: 'The shot is moving, then suddenly freezes — a flash, a slight desaturation and a white frame — and a bold title stamps on top. It marks “this is the moment” or introduces a person, a classic in sports and social storytelling.',
    good: ['Introducing a person or character', 'Highlighting the decisive moment', 'Recaps and vlogs'],
    avoid: 'Using it several times in a short video — the freeze loses its surprise.',
    anatomy: ['Scene time', 'Photo, flash, frame border, title', 'Push-in stops dead; flash + desaturate; title scale 1.4 → 1', 'Move 1.3s → freeze; title 0.35s', 'linear move · expo.out stamp', 'Motion → FREEZE (flash) → title stamp → hold'],
    tracks: [['move', 'Moving shot', 0, 1.3, 'linear', 'camera'], ['freeze', 'Freeze', '>', 0, 'linear', 'cut'], ['fx', 'Flash + desaturate', '<', 0.4, 'out', 'fx'], ['title', 'Title stamp', '<0.12', 0.35, 'expo.out'], ['sub', 'Name tag', '>-0.05', 0.5, 'back.soft'], ['hold', 'Hold (frozen)', '>', 1.4, 'linear']],
    html: `${A.photo('portrait', { r: 'img', cls: 'fill' })}<i data-r="frame" class="ff-frame"></i><i data-r="flash" class="flash"></i>
      <div class="stackc" style="justify-content:flex-end;padding-bottom:30cqmin"><b data-r="title" class="t-display ff-title">That's<br/>her.</b><span data-r="sub" class="badge" style="margin-top:2cqmin">Nadia · 24 · Designer</span></div>`,
    render(t, c) {
      const frozen = c.r.freeze >= 1;
      c.set(c.$.img, { s: lerp(1.05, 1.18, c.p.move), y: lerp(0, -3, c.p.move), gray: frozen ? 0.35 * c.p.fx : 0, contrast: frozen ? 1 + 0.12 * c.p.fx : 1 });
      c.set(c.$.flash, { o: frozen ? (1 - c.p.fx) * 0.8 : 0 });
      c.set(c.$.frame, { o: frozen ? 1 : 0, s: frozen ? lerp(1.04, 1, c.p.fx) : 1 });
      c.set(c.$.title, { s: lerp(1.5, 1, c.p.title), o: c.r.title > 0 ? 1 : 0, r: lerp(-6, -3, c.p.title) });
      c.set(c.$.sub, { s: lerp(0.6, 1, c.p.sub), o: c.p.sub });
    },
    prompt: 'Create a freeze-frame title: the shot slowly pushes in, then freezes dead on the key moment. On the freeze frame, flash white (80% → 0 over 400ms), slightly desaturate and add contrast, and snap a white inner border into place. 120ms later, stamp a bold title in from scale 1.5 to 1 with an expo-out, then pop a small name tag. Hold the frozen frame for at least 1.2s.',
  });
})();
