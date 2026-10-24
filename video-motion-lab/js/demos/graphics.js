/* 05 — Shape & Graphic Elements
   Supporting graphics: they lead the eye or mark a moment. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, rng, noise2, A } = window.VML;
  const CAT = 'shape';
  const S = ['object'];
  let uid = 0;

  /* 01 Shape scale & rotate */
  demo({
    id: 'shape-scale-rotate', cat: CAT, name: 'Shape Scale & Rotate', aka: ['Shape pop', 'Spin', 'Geometric entrance'],
    tags: S, char: ['Graphic', 'Playful', 'Bauhaus'],
    variants: [['scale', 'Scale'], ['rotate', 'Rotate'], ['both', 'Scale + rotate']],
    what: 'Three primitive shapes enter one after another. Scale makes them grow from their centre; rotation makes them turn into place; combined, they feel like pieces snapping into a composition. Compare the three variants — the shapes are identical.',
    good: ['Graphic backgrounds and frames', 'Accents around a title', 'Bauhaus / geometric brand styles'],
    avoid: 'Rotating shapes that have no clear orientation (perfect circles) — the rotation is invisible and only costs time.',
    anatomy: ['Scene time', 'Circle, square, triangle', 'scale 0 → 1 · rotate −90° → 0', '0.7s each · 0.15s stagger', 'back.out', 'Big shape first, then smaller'],
    covers: 2,
    tracks: [['s', 'Shapes ×3 (150ms)', 0.3, 0.7, 'back.out', { n: 3, each: 0.15 }], ['idle', 'Idle drift', '>', 1.6, 'linear', 'bg']],
    cls: 'bg-cream',
    html: `<div class="center"><div class="ssr">
      <i data-r="sh" class="shp circle c-red" style="width:42cqmin;height:42cqmin;left:-24cqmin;top:-30cqmin"></i>
      <i data-r="sh" class="shp c-blue" style="width:34cqmin;height:34cqmin;left:2cqmin;top:-2cqmin"></i>
      <i data-r="sh" class="shp ssr-tri" style="left:-26cqmin;top:10cqmin"></i></div></div>`,
    render(t, c) {
      const idle = t - c.tl.map.idle.start;
      c.$$.sh.forEach((el, i) => {
        const p = c.st('s', i);
        const sc = c.v !== 'rotate' ? p : Math.min(1, p * 4);
        const r = c.v !== 'scale' ? lerp(-90, 0, p) : 0;
        c.set(el, { s: Math.max(0, sc), r: r + (idle > 0 ? Math.sin(idle * 1.4 + i) * 2 : 0), o: c.v === 'rotate' ? Math.min(1, p * 4) : 1 });
      });
    },
    prompt: (v) => `Bring in three primitive shapes (circle, square, triangle) one after another with a 150ms stagger, each over 700ms with a back-out ease, ${v === 'scale' ? 'scaling from 0 to 1 around its centre' : v === 'rotate' ? 'rotating from −90° to 0° while fading in quickly' : 'scaling from 0 to 1 while rotating from −90° to 0°'}. After they land, let them drift with a tiny idle rotation.`,
  });

  /* 02 Shape morph */
  const R_CIRCLE = () => 1;
  const R_SQUARE = (a) => 0.9 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
  const R_BLOB = (a) => 1 + 0.16 * Math.sin(3 * a + 0.6) + 0.08 * Math.cos(5 * a);
  function radialPath(fn, cx = 50, cy = 50, R = 30, N = 120) {
    let d = '';
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, r = fn(a) * R;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2);
    }
    return d + 'Z';
  }
  demo({
    id: 'shape-morph', cat: CAT, name: 'Shape Morph', aka: ['Path morph', 'Shape tween', 'Morphing'],
    tags: S, char: ['Fluid', 'Playful', 'Premium'],
    what: 'One shape smoothly becomes another: circle → square → blob → circle. Each shape is sampled at the same set of angles, so every point has a partner to travel to. Morphing keeps continuity — the viewer sees one object changing, not three objects.',
    good: ['Icon and state changes (play → pause, menu → close)', 'Abstract brand loops', 'Transitions between sections'],
    avoid: 'Morphing between shapes with very different point structures without care — they twist and fold mid-way.',
    anatomy: ['Scene time (loop)', 'One SVG path', 'Radius per angle interpolates between shape functions; colour shifts', '0.8s per morph · 0.7s holds', 'smooth', 'circle → square → blob → circle (seamless)'],
    tracks: [['m1', 'Circle → square', 0.4, 0.8, 'smooth'], ['m2', 'Square → blob', '+=0.7', 0.8, 'smooth'], ['m3', 'Blob → circle', '+=0.7', 0.8, 'smooth']],
    dur: 4.6, poster: 1.6,
    cls: 'bg-ink',
    html: `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path data-r="path" fill="#ef4b36"/></svg>
      <div class="morph-labels"><span data-r="lb">circle</span><span data-r="lb">square</span><span data-r="lb">blob</span></div>`,
    render(t, c) {
      const { m1, m2, m3 } = c.p;
      const fn = (a) => {
        if (c.r.m1 < 1) return lerp(R_CIRCLE(a), R_SQUARE(a), m1);
        if (c.r.m2 < 1) return lerp(R_SQUARE(a), R_BLOB(a), m2);
        return lerp(R_BLOB(a), R_CIRCLE(a), m3);
      };
      c.$.path.setAttribute('d', radialPath(fn));
      const hue = c.r.m1 < 1 ? lerp(0, 1, m1) : c.r.m2 < 1 ? 1 + m2 : 2 + m3;
      const cols = ['#ef4b36', '#3e63dd', '#f2c14e', '#ef4b36'];
      c.$.path.setAttribute('fill', cols[Math.round(hue) % 4]);
      const active = c.r.m1 < 0.5 ? 0 : c.r.m2 < 0.5 ? 1 : c.r.m3 < 0.5 ? 2 : 0;
      c.$$.lb.forEach((el, i) => el.classList.toggle('on', i === active));
    },
    prompt: 'Morph one SVG shape through circle → square → organic blob → circle in a seamless loop. Sample every shape at the same number of points (e.g. 120 points by angle) so each point interpolates to its partner; morph over 800ms with a smooth in-out ease and hold each shape ~0.7s. Snap the fill colour to a new brand colour at each midpoint.',
  });

  /* 03 Line draw */
  demo({
    id: 'line-draw', cat: CAT, name: 'Line Draw', aka: ['Stroke animation', 'Self-drawing line', 'Path draw'],
    tags: S.concat('brand'), char: ['Elegant', 'Explanatory', 'Handmade'],
    what: 'Strokes draw themselves from start to end, as if being sketched live. Implemented by animating stroke-dashoffset on a path whose dash is as long as the path. Multiple strokes staggered build an illustration.',
    good: ['Icons and illustrations', 'Signatures and handwritten notes', 'Maps, routes and diagrams', 'Logo reveals (line versions)'],
    avoid: 'Filled shapes — only strokes can draw. Convert artwork to centre-line strokes first.',
    anatomy: ['Scene time', 'Five strokes', 'stroke-dashoffset 1 → 0 (pathLength = 1)', '0.6–1.2s each, staggered', 'inOut (cubic)', 'Ground → mountains → sun → birds → underline'],
    tracks: [['l0', 'Horizon', 0.3, 0.8, 'inOut'], ['l1', 'Mountains', '<0.3', 1.2, 'inOut'], ['l2', 'Sun', '<0.6', 0.9, 'inOut'], ['l3', 'Birds', '<0.5', 0.6, 'inOut'], ['l4', 'Caption underline', '>', 0.6, 'expo.out'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-paper',
    html: `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#16151a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.9" stroke-dasharray="1 1">
      <path data-r="l" pathLength="1" d="M10 68 H90"/>
      <path data-r="l" pathLength="1" d="M14 68 L32 40 L42 54 L56 30 L74 60 L80 52 L88 68"/>
      <circle data-r="l" pathLength="1" cx="70" cy="28" r="7" stroke="#ef4b36" transform="rotate(-90 70 28)"/>
      <path data-r="l" pathLength="1" d="M30 26 q2.5 -2.5 5 0 q2.5 -2.5 5 0 M42 20 q2 -2 4 0 q2 -2 4 0"/>
      <path data-r="l" pathLength="1" d="M34 82 C 44 79, 58 85, 66 81" stroke="#ef4b36" stroke-width="1.2"/>
      </svg><div class="ld-cap t-serif" data-r="cap"><i>Weekend</i> escapes</div>`,
    render(t, c) {
      c.$$.l.forEach((el, i) => c.set(el, { dash: 1 - c.p['l' + i] }));
      c.set(c.$.cap, { o: c.p.l3, y: 2 * (1 - c.p.l3) });
    },
    prompt: 'Make an illustration draw itself: set pathLength="1" and stroke-dasharray: 1 on each stroke, then animate stroke-dashoffset from 1 to 0. Draw the horizon first (0.8s), the mountains 0.3s later (1.2s), then the sun, birds and finally an accent underline under the caption, each with a cubic in-out ease and overlapping starts.',
  });

  /* 04 Path animation */
  demo({
    id: 'path-animation', cat: CAT, name: 'Path Animation', aka: ['Motion path', 'Follow path', 'Path following'],
    tags: S, char: ['Playful', 'Explanatory', 'Travel'],
    what: 'An object follows a curved SVG path and rotates to match the direction of travel (the tangent). A dashed trail draws behind it. Unlike a straight tween, the path itself becomes a story: a journey, a delivery, a connection.',
    good: ['Delivery, travel and logistics stories', 'Connecting two points or ideas', 'Paper planes, cursors, vehicles'],
    avoid: 'Paths with sharp corners — the object spins abruptly at each corner.',
    anatomy: ['Scene time', 'Paper plane + trail', 'Position = getPointAtLength(p · length), rotation = tangent angle', '3.2s', 'inOut (cubic)', 'Start pin → flight → destination pin pops'],
    tracks: [['pinA', 'Start pin', 0.2, 0.4, 'back.out'], ['fly', 'Flight along path', '>', 3.2, 'inOut'], ['pinB', 'Destination pin', '-=0.2', 0.5, 'back.out'], ['hold', 'Hold', '>', 0.8, 'linear']],
    cls: 'bg-blue',
    html: `<svg class="fill" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet">
      <path data-r="path" d="M18 136 C 0 96, 70 110, 66 78 S 12 52, 40 30 S 88 26, 82 16" fill="none" stroke="rgba(255,255,255,.25)" stroke-width=".6" stroke-dasharray="1.5 2"/>
      <path data-r="trail" d="M18 136 C 0 96, 70 110, 66 78 S 12 52, 40 30 S 88 26, 82 16" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="1.5 2"/>
      <g data-r="pa" transform="translate(18 136)"><circle r="3.2" fill="#f2c14e"/><circle r="1.2" fill="#2c4bd6"/></g>
      <g data-r="pb" transform="translate(82 16)"><circle r="3.2" fill="#ef4b36"/><circle r="1.2" fill="#fff"/></g>
      <g data-r="plane"><path d="M-5 -3.5 L6 0 L-5 3.5 L-2.5 0 Z" fill="#fff"/></g></svg>`,
    init(c) { c.data.len = c.$.path.getTotalLength(); },
    render(t, c) {
      const L = c.data.len || c.$.path.getTotalLength();
      const d = c.p.fly * L;
      const pt = c.$.path.getPointAtLength(d);
      const pt2 = c.$.path.getPointAtLength(Math.min(L, d + 0.5));
      const pt0 = c.$.path.getPointAtLength(Math.max(0, d - 0.5));
      const ang = (Math.atan2(pt2.y - pt0.y, pt2.x - pt0.x) * 180) / Math.PI;
      c.$.plane.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${ang.toFixed(1)}) scale(${(0.8 + 0.4 * bump(c.r.fly)).toFixed(3)})`);
      c.$.plane.style.opacity = c.r.fly > 0 ? 1 : 0;
      c.$.trail.style.strokeDasharray = `${d} ${L}`;
      c.$.pa.setAttribute('transform', `translate(18 136) scale(${c.p.pinA})`);
      c.$.pb.setAttribute('transform', `translate(82 16) scale(${Math.max(0, c.p.pinB)})`);
    },
    prompt: 'Animate a paper plane along a curved SVG motion path: sample the path with getPointAtLength(progress × length) every frame and rotate the plane to the path tangent. Fly over 3.2s with a cubic in-out ease, grow it slightly mid-flight (as if closer to camera), reveal a trail behind it, pop a start pin before take-off and a destination pin on arrival.',
  });

  /* 05 Ring animation */
  demo({
    id: 'ring-animation', cat: CAT, name: 'Ring Animation', aka: ['Concentric rings', 'Arc draw', 'Radial lines'],
    tags: S, char: ['Technical', 'Premium', 'Data'],
    what: 'Concentric arcs draw around a centre at different lengths and speeds, then keep rotating slowly in opposite directions. It frames a central number, icon or product with a precise, technical energy.',
    good: ['Framing a stat or a product', 'Tech / health / fitness visuals', 'Loading and scanning moments'],
    avoid: 'Too many rings or fast rotation — it starts to feel like a sci-fi HUD.',
    anatomy: ['Scene time + ambient rotation', 'Four arcs + centre label', 'stroke-dashoffset draw + rotate (alternating directions)', 'Draw 1s · 120ms stagger; rotation continuous', 'expo.out draw · linear spin', 'Outer ring first, inward'],
    tracks: [['r', 'Rings draw ×4', 0.3, 1.0, 'expo.out', { n: 4, each: 0.12 }], ['label', 'Centre value', '-=0.6', 0.6, 'premium'], ['spin', 'Slow spin', 0.3, 3.4, 'linear', 'bg']],
    cls: 'bg-navy',
    html: `<div class="center"><svg class="rings" viewBox="0 0 100 100">${[[46, 0.7, '#7fd1b0', 1.4], [38, 0.55, '#ef4b36', 2.4], [30, 0.82, '#f2c14e', 1.4], [22, 0.4, '#eaf0ff', 3]].map(([r, len, col, w]) =>
      `<g data-r="rg"><circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${w}"/><circle data-r="arc" cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="${len} 1" style="--len:${len}"/></g>`).join('')}</svg></div>
      <div class="center"><div data-r="label" class="col"><b class="t-sans" style="font-size:12cqmin">86%</b><span class="t-eyebrow">recovery</span></div></div>`,
    render(t, c) {
      const sp = t - 0.3;
      c.$$.rg.forEach((el, i) => c.set(el, { r: -90 + (i % 2 ? -1 : 1) * Math.max(0, sp) * (14 + i * 6) }));
      c.$$.arc.forEach((el, i) => {
        const len = parseFloat(el.style.getPropertyValue('--len'));
        el.setAttribute('stroke-dasharray', `${(len * c.st('r', i)).toFixed(4)} 1`);
      });
      c.set(c.$.label, { o: c.p.label, s: lerp(0.9, 1, c.p.label) });
    },
    prompt: 'Frame a central value with four concentric arcs of different lengths and colours. Draw each arc from 0 to its target length over 1s (expo-out), outer ring first with a 120ms stagger, then keep the rings rotating slowly in alternating directions. Fade the centre value in as the inner ring finishes.',
  });

  /* 06 Blob morph */
  demo({
    id: 'blob-morph', cat: CAT, name: 'Blob Morph', aka: ['Organic blob', 'Amorphous shape', 'Living shape'],
    tags: S.concat('brand'), char: ['Organic', 'Calm', 'Friendly'],
    what: 'An organic shape continuously changes outline, driven by smooth noise around its circumference. It never repeats exactly, but it loops seamlessly because the noise travels in a circle. Feels alive, soft and approachable.',
    good: ['Backgrounds behind people or products', 'Wellness, beauty and friendly tech brands', 'Ambient loops'],
    avoid: 'Fast or high-amplitude wobble — it starts to look like a liquid simulation gone wrong.',
    anatomy: ['Continuous loop', 'One SVG path (two layers)', 'Radius per angle = 1 + noise(angle, time)', '6s per loop', 'Implicit (noise is smooth)', 'Seamless: time moves around a circle in noise space'],
    tracks: [['loop', 'Morph loop (seamless)', 0, 6, 'linear', 'bg'], ['in', 'Scale in', 0, 1, 'premium']],
    dur: 6, poster: 2,
    cls: 'bg-lilac',
    html: `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="bm-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9fb2"/><stop offset="1" stop-color="#6f5bff"/></linearGradient></defs>
      <path data-r="b2" fill="#fff" opacity=".35"/><path data-r="b1" fill="url(#bm-g)"/></svg>`,
    render(t, c) {
      const a0 = c.r.loop * Math.PI * 2;
      const s = lerp(0.5, 1, c.p.in);
      const blob = (seed, amp) => (a) => s * (1 + amp * noise2(Math.cos(a) * 1.3 + Math.cos(a0) * 0.8 + seed, Math.sin(a) * 1.3 + Math.sin(a0) * 0.8));
      c.$.b1.setAttribute('d', radialPath(blob(0, 0.22), 50, 50, 28, 90));
      c.$.b2.setAttribute('d', radialPath(blob(7, 0.3), 52, 48, 33, 90));
    },
    prompt: 'Create a seamless organic blob loop: draw a closed SVG path whose radius at each angle is 1 + 0.22 × noise(cos(angle), sin(angle), loopPhase), where the loop phase travels around a circle in noise space over 6s so the loop is seamless. Layer a lighter, larger blob behind with a different seed. Keep amplitude low and motion slow.',
  });

  /* 07 Liquid shape (goo) */
  demo({
    id: 'liquid-shape', cat: CAT, name: 'Liquid Shape', aka: ['Gooey effect', 'Metaballs', 'Blob merge'],
    tags: S.concat('advanced'), char: ['Fluid', 'Playful', 'Organic'],
    what: 'Separate circles move around, and when they come close they melt together like drops of liquid. The trick is a blur + high-contrast alpha filter (“goo” filter): blurred shapes overlap, then the alpha is sharpened back into a clean edge.',
    good: ['Playful brand loops', 'Liquid / drink / cosmetics products', 'Loading and transition moments'],
    avoid: 'Large areas or many shapes on mobile — SVG blur filters are costly. This is a simplified, lightweight version.',
    anatomy: ['Continuous loop', 'Six circles inside a filtered group', 'translate on circular paths; filter merges overlaps', '5s loop', 'Sine paths (seamless)', 'Drops orbit, merge and split'],
    tracks: [['loop', 'Orbit loop (seamless)', 0, 5, 'linear', 'bg']],
    dur: 5, poster: 1.4,
    cls: 'bg-ink',
    note: 'Simplified fluid look using an SVG blur + alpha-threshold filter, not a fluid simulation.',
    html: () => {
      const id = 'goo' + ++uid;
      return `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="3"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></defs>
        <g filter="url(#${id})" fill="#ef4b36"><circle cx="50" cy="50" r="13"/>${Array.from({ length: 5 }, () => '<circle data-r="d" r="7"/>').join('')}</g></svg>`;
    },
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      c.$$.d.forEach((el, i) => {
        const k = i + 1;
        const R = 12 + 14 * (0.5 + 0.5 * Math.sin(a * (k % 3 + 1) + i));
        const ang = a * (i % 2 ? 1 : -1) + (i * Math.PI * 2) / 5;
        el.setAttribute('cx', (50 + Math.cos(ang) * R).toFixed(2));
        el.setAttribute('cy', (50 + Math.sin(ang) * R).toFixed(2));
        el.setAttribute('r', (5 + 2.5 * Math.sin(a * 2 + i)).toFixed(2));
      });
    },
    prompt: 'Create a gooey liquid shape: animate several circles orbiting a central circle on sine-modulated radii in a seamless 5s loop, inside an SVG group with a “goo” filter (feGaussianBlur ~3, then feColorMatrix alpha 22 −9) so overlapping drops melt together and split apart with smooth edges. Keep the element small for performance.',
  });

  /* 08 Geometric assembly */
  const GEO = [
    ['circle c-red', 34, 34, -26, -40, 0, -120], ['sq c-ink', 30, 30, 4, -26, 45, 90], ['pill-shape c-yellow', 56, 14, -28, 6, 0, 0],
    ['circle c-blue', 18, 18, 14, 10, 0, 0], ['ssr-tri', 0, 0, -12, 26, 0, 180], ['sq c-green', 16, 16, 18, 30, 0, -45],
  ];
  demo({
    id: 'geometric-assembly', cat: CAT, name: 'Geometric Assembly', aka: ['Shape build', 'Compose from pieces', 'Bauhaus assemble'],
    tags: S.concat('brand'), char: ['Graphic', 'Bauhaus', 'Clever'],
    what: 'Scattered primitive shapes travel, rotate and scale into place to form one composition. The motion explains the design: the viewer sees the parts before the whole.',
    good: ['Brand and poster animations', 'Building an illustration or icon', 'Intros for design studios and events'],
    avoid: 'Pieces arriving all at once — stagger them so the construction is readable.',
    anatomy: ['Scene time', 'Six shapes', 'translate from scattered positions + rotate + scale to final layout', '0.9s each · 0.12s stagger', 'expo.out', 'Large pieces first, small details last'],
    tracks: [['g', 'Pieces assemble ×6', 0.3, 0.9, 'expo.out', { n: 6, each: 0.12 }], ['title', 'Title', '>-0.2', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="center"><div class="ssr">${GEO.map(([cls, w, h, x, y, r]) => `<i data-r="g" class="shp ${cls}" style="${w ? `width:${w}cqmin;height:${h}cqmin;` : ''}left:${x}cqmin;top:${y}cqmin;rotate:${r}deg"></i>`).join('')}</div></div>
      <div class="ga-title" data-r="title"><b class="t-sans">Form follows</b><span class="t-serif"><i>function.</i></span></div>`,
    init(c) { const r = rng(5); c.data.from = GEO.map(() => [lerp(-80, 80, r()), lerp(-90, 90, r()), lerp(-1, 1, r())]); },
    render(t, c) {
      c.$$.g.forEach((el, i) => {
        const p = c.st('g', i), [fx, fy] = c.data.from[i];
        c.set(el, { x: fx * (1 - p), y: fy * (1 - p), r: GEO[i][6] * (1 - p), s: lerp(0.4, 1, p), o: Math.min(1, p * 3) });
      });
      c.set(c.$.title, { o: c.p.title, y: 3 * (1 - c.p.title) });
    },
    prompt: 'Assemble a geometric composition from six primitive shapes: each starts at a scattered off-centre position, rotated and at scale 0.4, then travels to its final place over 900ms with an expo-out ease, one after another with a 120ms stagger (largest pieces first). Bring the title in once the composition is complete.',
  });

  /* 09 Shape burst */
  const BURST = 14;
  demo({
    id: 'shape-burst', cat: CAT, name: 'Shape Burst', aka: ['Radial burst', 'Explosion accent', 'Pop lines'],
    tags: S.concat('social'), char: ['Energetic', 'Playful', 'Promo'],
    what: 'Small shapes and lines shoot out from a centre point and fade, punctuating a moment — the visual equivalent of an exclamation mark. It lasts well under a second and should sync with the key beat or word.',
    good: ['Accenting a word, price or button', 'Beat drops', 'Success / achievement moments'],
    avoid: 'Long bursts or repeated bursts — they turn from accent into noise.',
    anatomy: ['Beat / impact', 'Word + 14 shapes', 'Shapes translate outward along rays + rotate + shrink; word punch', '0.7s burst · word 0.4s', 'expo.out', 'Impact frame → burst + word punch together'],
    tracks: [['word', 'Word punch', 0.4, 0.4, 'back.out'], ['hit', 'Impact', '<', 0, 'linear', 'beat'], ['burst', 'Burst', '<', 0.7, 'expo.out', 'fx'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-yellow',
    html: `<div class="center">${Array.from({ length: BURST }, (_, i) => `<i data-r="b" class="burst burst--${i % 3}"></i>`).join('')}</div>
      <div class="center"><b data-r="word" class="t-display" style="font-size:24cqmin;color:#1d1708">Wow!</b></div>`,
    render(t, c) {
      const p = c.p.burst, on = c.r.burst > 0 && c.r.burst < 1;
      c.$$.b.forEach((el, i) => {
        const a = (i / BURST) * Math.PI * 2 + 0.2, d = lerp(18, 46 + (i % 3) * 6, p);
        c.set(el, { x: Math.cos(a) * d, y: Math.sin(a) * d, r: (a * 180) / Math.PI + p * 90, s: lerp(1, 0.2, p), o: on ? 1 : 0 });
      });
      c.set(c.$.word, { s: lerp(0.3, 1, c.p.word), o: c.r.word > 0 ? 1 : 0 });
    },
    prompt: 'On the impact frame, punch a word in (scale 0.3 → 1, back-out, 400ms) and burst 14 small shapes (dots, dashes, triangles) outward from behind it along evenly spaced rays over 700ms with an expo-out ease, rotating slightly and shrinking to nothing. The burst lasts under a second.',
  });

  /* 10 Confetti */
  const CONF = 120;
  const COLS = ['#ef4b36', '#f2c14e', '#3e63dd', '#7fd1b0', '#ff9fb2', '#ffffff'];
  demo({
    id: 'confetti', cat: CAT, name: 'Confetti Burst', aka: ['Celebration', 'Party particles', 'Confetti cannon'],
    tags: S.concat('social'), char: ['Celebratory', 'Playful', 'Energetic'],
    what: 'Paper pieces shoot up from two cannons, slow down with air drag, then flutter down under gravity while spinning. Tasteful confetti uses a limited brand palette, a short burst and natural physics — not an endless rain.',
    good: ['Success states and milestones', 'Giveaway / winner announcements', 'Launch moments'],
    avoid: 'Serious or financial-loss contexts, and covering the message — keep the centre readable.',
    anatomy: ['Event (success)', '120 paper pieces (Canvas 2D)', 'Ballistic motion with drag + gravity, spin, flutter', 'Burst 0.3s, fall ≈2.5s', 'Physics (no easing curve)', 'Burst → peak → flutter down'],
    tracks: [['msg', 'Message', 0.15, 0.5, 'back.out'], ['burst', 'Confetti physics', 0.25, 3, 'linear', 'fx']],
    cls: 'bg-ink',
    html: `<canvas data-r="cv" class="canvas-fill"></canvas><div class="center"><div data-r="msg" class="col" style="gap:2cqmin"><b class="t-sans" style="font-size:11cqmin">You did it!</b><span class="t-eyebrow">1,000 orders shipped</span></div></div>`,
    init(c) {
      c.data.cv = c.canvas(c.$.cv);
      const r = rng(11);
      c.data.p = Array.from({ length: CONF }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return { side, ang: lerp(-1.42, -0.9, r()) * (side > 0 ? 1 : -1) + (side > 0 ? 0 : -Math.PI), v: lerp(1.5, 2.7, r()), w: lerp(0.018, 0.032, r()), h: lerp(0.009, 0.016, r()), spin: lerp(4, 11, r()), ph: r() * 6, col: COLS[i % COLS.length], fl: lerp(0.02, 0.05, r()) };
      });
    },
    render(t, c) {
      const { g, w, h } = c.data.cv;
      g.clearRect(0, 0, w, h);
      c.set(c.$.msg, { s: lerp(0.6, 1, c.p.msg), o: c.p.msg });
      const tt = t - c.tl.map.burst.start;
      if (tt <= 0) return;
      const k = 2.4, G = 0.75, S = Math.min(w, h);
      c.data.p.forEach((p) => {
        const e = (1 - Math.exp(-k * tt)) / k;
        const vx = Math.cos(p.ang) * p.v, vy = Math.sin(p.ang) * p.v;
        const x = (p.side > 0 ? 0.08 : 0.92) * w + (vx * e + Math.sin(tt * 5 + p.ph) * p.fl * (1 - Math.exp(-tt))) * S * (p.side > 0 ? 1 : 1);
        const y = 0.95 * h + (vy * e + (G / k) * tt - (G / (k * k)) * (1 - Math.exp(-k * tt))) * S;
        const fade = clamp(1 - (tt - 2.4) / 0.6);
        g.save();
        g.translate(x, y);
        g.rotate(tt * p.spin + p.ph);
        g.scale(1, Math.cos(tt * p.spin * 0.7 + p.ph));
        g.globalAlpha = fade;
        g.fillStyle = p.col;
        g.fillRect((-p.w * S) / 2, (-p.h * S) / 2, p.w * S, p.h * S);
        g.restore();
      });
    },
    prompt: 'Fire a tasteful confetti burst from two cannons at the bottom corners: ~120 small paper rectangles in a limited brand palette, launched upward and inward with random angles, slowed by air drag (velocity decays exponentially), then falling under gravity while spinning and fluttering (3D flip via scaleY = cos). Fade pieces out after ~2.5s. Render on a canvas and compute positions from time so it scrubs.',
  });

  /* 11 Orbiting */
  const ORB = ['star', 'heart', 'bolt', 'leaf', 'chat', 'music'];
  demo({
    id: 'orbiting', cat: CAT, name: 'Orbiting Elements', aka: ['Orbit', 'Satellite icons', 'Elliptical rotation'],
    tags: S, char: ['Playful', 'Product', 'Loop'],
    what: 'Icons travel around a central element on a tilted ellipse. Items in front are bigger and on top; items behind are smaller and dimmer — a cheap but convincing 3D orbit that keeps the centre as the hero.',
    good: ['Showing features around a product or logo', 'App integrations and ecosystems', 'Loopable hero visuals'],
    avoid: 'Text labels on orbiting items — they are hard to read while moving.',
    anatomy: ['Continuous loop', 'Centre product + six icons', 'Position on ellipse; scale, opacity and z-order from depth (sin)', '8s per orbit', 'linear', 'Seamless loop'],
    tracks: [['loop', 'Orbit (seamless)', 0, 8, 'linear', 'bg'], ['in', 'Centre pop', 0, 0.8, 'back.soft']],
    dur: 8, poster: 1,
    cls: 'bg-studio',
    html: `<div class="center"><i class="orb-ring"></i></div><div class="center"><div data-r="hub" class="orb-hub">${A.logoMark({ sw: 8 })}</div></div>
      ${ORB.map((n) => `<div class="center"><span data-r="o" class="orb-ico">${A.icon(n)}</span></div>`).join('')}`,
    render(t, c) {
      const a0 = c.r.loop * Math.PI * 2;
      c.set(c.$.hub, { s: lerp(0.5, 1, c.p.in), o: c.p.in });
      c.$$.o.forEach((el, i) => {
        const a = a0 + (i / ORB.length) * Math.PI * 2;
        const depth = Math.sin(a);
        c.set(el, { x: Math.cos(a) * 36, y: depth * 12, s: lerp(0.62, 1.08, (depth + 1) / 2), o: lerp(0.45, 1, (depth + 1) / 2), css: { zIndex: depth > 0 ? 3 : 1 } });
      });
    },
    prompt: 'Orbit six icons around a central logo on a tilted ellipse (x radius ≈ 36%, y radius ≈ 12%), completing one orbit every 8s with linear easing for a seamless loop. Derive depth from sin(angle): items in front scale up to 1.08 at full opacity and render above the centre; items behind shrink to 0.62, dim to 45% and render behind it.',
  });

  /* 12 Pulsing ring */
  demo({
    id: 'pulsing-ring', cat: CAT, name: 'Pulsing Ring', aka: ['Ping', 'Radar pulse', 'Live indicator'],
    tags: S.concat('ui'), char: ['Calm', 'Attention', 'Technical'],
    what: 'Rings expand from a point and fade away at regular intervals, like a radar ping or a “live” indicator. Its job is to say “look here” or “this is active” without moving the element itself.',
    good: ['Map locations and pins', 'Live / recording indicators', 'Pointing at a button or feature'],
    avoid: 'Multiple pulsing elements in one frame — the eye cannot tell which matters.',
    anatomy: ['Continuous loop', 'Dot + three rings', 'Each ring scale 0.2 → 3 + opacity 0.8 → 0, phase-offset', '2.4s loop, rings ⅓ apart', 'sine.out', 'Seamless loop'],
    tracks: [['loop', 'Pulse loop (seamless)', 0, 2.4, 'linear', 'fx']],
    dur: 2.4, poster: 0.9,
    cls: 'bg-coal',
    html: `<div class="center">${[0, 1, 2].map(() => '<i data-r="ring" class="pulse-ring"></i>').join('')}<i class="pulse-dot"></i></div>
      <div class="center" style="padding-top:34cqmin"><span class="badge"><i class="live-dot"></i>Live now</span></div>`,
    render(t, c) {
      c.$$.ring.forEach((el, i) => {
        const u = (c.r.loop + i / 3) % 1;
        const e = ease('sine.out')(u);
        c.set(el, { s: lerp(0.2, 3, e), o: 0.8 * (1 - u) });
      });
    },
    prompt: 'Create a pulsing location ring: from a solid dot, emit three rings phase-offset by a third of a 2.4s loop; each ring scales from 0.2 to 3 with a sine-out ease while fading from 80% opacity to 0, looping seamlessly. The dot itself does not move.',
  });

  /* 13 Wave motion */
  demo({
    id: 'wave-motion', cat: CAT, name: 'Wave Motion', aka: ['Sine waves', 'Flowing lines', 'Audio wave'],
    tags: S, char: ['Calm', 'Fluid', 'Loop'],
    what: 'Layered sine waves flow sideways with different phases and amplitudes. Each line is redrawn every frame from a formula, and the phase completes a full cycle per loop so it repeats seamlessly. Calm, rhythmic, and great as a background.',
    good: ['Audio, music and podcast visuals', 'Water, wellness and travel themes', 'Ambient backgrounds behind text'],
    avoid: 'High amplitude and speed — waves should breathe, not vibrate.',
    anatomy: ['Continuous loop', 'Five SVG wave lines', 'y = A·sin(kx + phase) per line, phase advances 2π per loop', '4s loop', 'linear', 'Seamless loop'],
    tracks: [['loop', 'Wave phase (seamless)', 0, 4, 'linear', 'bg']],
    dur: 4, poster: 1.3,
    cls: 'bg-navy',
    html: `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="none">${[0, 1, 2, 3, 4].map((i) => `<path data-r="w" fill="none" stroke="${i === 2 ? '#ef4b36' : 'rgba(234,240,255,' + (0.25 + i * 0.1) + ')'}" stroke-width="${i === 2 ? 1.2 : 0.6}" vector-effect="non-scaling-stroke"/>`).join('')}</svg>
      <div class="stackc"><b class="t-serif" style="font-size:11cqmin;margin-top:40cqmin">Breathe <i>in.</i></b></div>`,
    render(t, c) {
      const ph = c.r.loop * Math.PI * 2;
      c.$$.w.forEach((el, i) => {
        let d = '';
        for (let x = 0; x <= 100; x += 2) {
          const y = 40 + i * 4 + Math.sin(x * 0.07 + ph * (i % 2 ? 1 : 2) + i) * (5 + i * 1.5) * Math.sin(x * 0.03 + 0.3);
          d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2);
        }
        el.setAttribute('d', d);
      });
    },
    prompt: 'Draw five layered sine-wave lines across the frame and animate their phase so they flow sideways; each line has its own amplitude, offset and speed multiple, and the phase completes whole cycles in a 4s loop so it repeats seamlessly. Highlight one line in the accent colour and keep amplitudes gentle.',
  });
})();
