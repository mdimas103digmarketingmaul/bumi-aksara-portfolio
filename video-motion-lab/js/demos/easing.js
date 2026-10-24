/* 02 — Easing & Physics
   Same start, same end, same duration — different speed profile. */
(function () {
  'use strict';
  const { demo, lerp, clamp, E, spring, A } = window.VML;
  const CAT = 'easing';

  const EASES = [
    ['linear', 'Linear', 'linear', 'Constant speed. Mechanical; useful for loops, marquees and progress.'],
    ['in', 'Ease In', 'cubic.in', 'Starts slow, ends fast. Good for exits — things accelerating away.'],
    ['out', 'Ease Out', 'cubic.out', 'Starts fast, lands softly. The default for entrances.'],
    ['inOut', 'Ease In Out', 'cubic.inOut', 'Slow → fast → slow. Good for moves from one rest point to another.'],
    ['bez', 'Cubic Bézier', 'snap', 'Custom curve (.8, 0, .1, 1): a hard, snappy in-out. Bezier = full control.'],
    ['expo', 'Expo Out', 'expo.out', 'Very fast start, very long tail. Feels expensive and decisive.'],
    ['back', 'Back / Overshoot', 'back.out', 'Goes past the target, then returns. Confident and energetic.'],
    ['elastic', 'Elastic', 'elastic.out', 'Several decaying oscillations. Cartoonish — use rarely.'],
    ['bounce', 'Bounce', 'bounce.out', 'Hits the end like a dropped ball. Playful only.'],
    ['spring', 'Spring', 'spring', 'Physical spring (ζ≈0.38): one natural overshoot, quick settle.'],
    ['damped', 'Damped Spring', 'spring.damped', 'Heavier damping (ζ≈0.72): barely overshoots. Premium UI feel.'],
    ['inertia', 'Inertia', 'inertia', 'Velocity decays exponentially — a puck on ice. Like a flick.'],
    ['momentum', 'Momentum', 'momentum', 'Pushed (accelerates), released, then coasts to a stop.'],
    ['friction', 'Friction', 'friction', 'Constant deceleration (= quadratic ease-out). Braking evenly.'],
  ];
  const BY = Object.fromEntries(EASES.map((e) => [e[0], e]));
  /* SVG path of an easing curve in a w×h box; y range −0.35…1.35 so overshoot is visible. */
  function curve(fn, w = 100, h = 100) {
    let d = '';
    for (let i = 0; i <= 64; i++) {
      const u = i / 64, y = fn(u);
      d += (i ? 'L' : 'M') + (u * w).toFixed(2) + ' ' + (h - ((y + 0.35) / 1.7) * h).toFixed(2);
    }
    return d;
  }
  const gy = (y, h = 100) => h - ((y + 0.35) / 1.7) * h;

  /* 01 Easing race */
  demo({
    id: 'easing-race', cat: CAT, name: 'Easing Playground (all curves)', aka: ['Easing race', 'Timing functions', 'Interpolation curves'],
    tags: ['object'], char: ['Technical', 'Reference'], fixed: '16:9', wide: true, covers: 14,
    keywords: ['linear', 'ease in', 'ease out', 'ease in out', 'cubic bezier', 'expo', 'back', 'elastic', 'bounce', 'spring', 'damped', 'inertia', 'momentum', 'friction', 'deceleration'],
    what: 'Fourteen dots travel from A to B in exactly the same 1.6 seconds. Only the easing differs. Watch where each dot is at the halfway mark — that is the whole personality of the curve. The small graph next to each label plots position (up) against time (right).',
    good: ['Choosing an ease by feel instead of by name', 'Explaining easing to a team or client', 'Understanding why linear looks robotic'],
    avoid: 'Picking a curve here and using it for every element. Entrances, exits and loops want different curves.',
    anatomy: ['Scene time', '14 identical dots', 'translateX A → B', '1.6s, all start together', 'One curve per lane', 'Simultaneous comparison'],
    tracks: [['go', 'Travel A → B (all lanes)', 0.5, 1.6, 'linear'], ['hold', 'Hold at B', '>', 1, 'linear']],
    html: `<div class="race">${EASES.map(([id, label, fn]) => `<div class="race__row">
        <span class="race__label">${label}</span>
        <svg class="race__graph" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${curve(E[fn])}" vector-effect="non-scaling-stroke"/></svg>
        <div class="race__track"><i class="race__a"></i><i class="race__b"></i><span data-r="dot" class="runner"><i class="race__dot"></i></span></div></div>`).join('')}</div>`,
    render(t, c) {
      const u = c.r.go;
      c.$$.dot.forEach((el, i) => c.set(el, { xp: E[EASES[i][2]](u) * 100 }));
    },
    prompt: 'Build an easing comparison: 14 identical dots in horizontal lanes move from A to B over the same 1.6s, each using a different easing (linear, ease-in, ease-out, ease-in-out, a custom cubic-bezier, expo-out, back-out, elastic, bounce, spring, damped spring, inertia, momentum, friction). Show a tiny position-vs-time graph next to each lane label.',
  });

  /* 02 Graph inspector */
  demo({
    id: 'easing-inspector', cat: CAT, name: 'Easing Graph Inspector', aka: ['Easing curve', 'Value over time', 'Interpolation graph'],
    tags: ['object'], char: ['Technical', 'Reference'], fixed: '16:9', wide: true,
    variants: EASES.map((e) => [e[0], e[1]]),
    what: 'One easing applied to three different properties at once — position, scale and opacity — next to its graph. The graph is the universal language of motion editors: the steeper the curve, the faster the change at that moment.',
    good: ['Learning to read graph editors (After Effects, Figma, Rive)', 'Seeing that the same curve feels different on different properties'],
    avoid: '—',
    anatomy: ['Scene time', 'Dot, square, disc', 'translateX · scale · opacity', '1.8s', 'Selected variant', 'All three properties share one curve'],
    tracks: (v) => [['go', 'Interpolate 0 → 1', 0.4, 1.8, BY[v][2]], ['hold', 'Hold', '>', 1, 'linear']],
    html: (v) => `<div class="insp">
        <div class="insp__graph"><svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path class="insp__grid" d="M0 ${gy(0)} H100 M0 ${gy(1)} H100" vector-effect="non-scaling-stroke"/>
          <path class="insp__curve" d="${curve(E[BY[v][2]])}" vector-effect="non-scaling-stroke"/>
          <line data-r="cursor" class="insp__cursor" x1="0" x2="0" y1="0" y2="100" vector-effect="non-scaling-stroke"/></svg>
          <i data-r="gdot" class="insp__gdot"></i>
          <span class="lane-label" style="left:2%;top:${gy(1) - 7}%">1 · end value</span><span class="lane-label" style="left:2%;top:${gy(0) + 2}%">0 · start value</span>
          <span class="lane-label" style="right:2%;bottom:2%">time →</span></div>
        <div class="insp__props">
          <div><span class="lane-label">position</span><div class="insp__lane"><span data-r="pdot" class="runner"><i class="insp__pdot"></i></span></div></div>
          <div><span class="lane-label">scale</span><div class="insp__box"><i data-r="sq" class="insp__sq"></i></div></div>
          <div><span class="lane-label">opacity</span><div class="insp__box"><i data-r="op" class="insp__op"></i></div></div>
          <p class="insp__desc">${BY[v][3]}</p>
          <b data-r="val" class="insp__val t-mono">0.00</b>
        </div></div>`,
    render(t, c) {
      const u = c.r.go, y = c.p.go;
      c.$.cursor.setAttribute('x1', u * 100); c.$.cursor.setAttribute('x2', u * 100);
      c.$.gdot.style.left = u * 100 + '%';
      c.$.gdot.style.top = gy(y) + '%';
      c.set(c.$.pdot, { xp: y * 100 });
      c.set(c.$.sq, { s: Math.max(0, lerp(0.15, 1, y)) });
      c.set(c.$.op, { o: clamp(y) });
      c.$.val.textContent = 'value ' + y.toFixed(2) + ' · time ' + u.toFixed(2);
    },
    prompt: (v) => `Animate the element using a ${BY[v][1].toLowerCase()} easing (${BY[v][2]}): ${BY[v][3]} Apply the same curve to position, scale and opacity over 1.8s so the motion keeps one consistent character.`,
  });

  /* 03 Springs */
  const SPRINGS = { wobbly: [0.22, 16, 'Wobbly'], bouncy: [0.38, 15, 'Bouncy'], smooth: [0.62, 14, 'Smooth'], critical: [1, 11, 'Critical'], over: [1.6, 9, 'Overdamped'] };
  const springFor = (v) => { const [z, w] = SPRINGS[v]; const f = spring(z, w); f.label = `spring(ζ ${z}, ω ${w})`; return f; };
  demo({
    id: 'spring-damping', cat: CAT, name: 'Spring & Damping', aka: ['Spring physics', 'Damped harmonic motion', 'Stiffness / damping'],
    tags: ['object', 'ui'], char: ['Physical', 'Playful', 'Premium (when damped)'],
    variants: Object.entries(SPRINGS).map(([k, [z, , l]]) => [k, `${l} ζ ${z}`]),
    what: 'A spring is defined by physics, not by a curve: stiffness (how strongly it pulls to the target) and damping ratio ζ (how fast oscillation dies). ζ < 1 bounces, ζ = 1 arrives as fast as possible without overshoot, ζ > 1 creeps in slowly.',
    good: ['UI cards, sheets, toggles (damped, ζ 0.7–0.9)', 'Playful stickers and icons (ζ 0.3–0.5)', 'Anything that may be interrupted mid-motion'],
    avoid: 'Very low damping on large surfaces — a whole screen wobbling looks broken, not playful.',
    anatomy: ['Scene time', 'Card dropping onto a target line', 'translateY with spring physics', '≈1.4s to settle', 'Damped harmonic oscillator', 'Drop → oscillate (or not) → rest'],
    tracks: (v) => [['drop', 'Spring to target', 0.4, 1.5, springFor(v)], ['hold', 'Rest', '>', 0.8, 'linear']],
    html: (v) => `<div class="spr-target"><span class="t-mono">target</span></div>
      <div class="center"><div data-r="card" class="spr-card"><div class="photo" style="background-image:url(${A.imgPath('ocean')})"></div><b>Coastline</b><span class="t-mono">ζ ${SPRINGS[v][0]} · ω ${SPRINGS[v][1]}</span></div></div>
      <div class="spr-graph"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path class="insp__grid" d="M0 ${gy(1)} H100" vector-effect="non-scaling-stroke"/><path class="insp__curve" d="${curve(springFor(v))}" vector-effect="non-scaling-stroke"/></svg><i data-r="gdot" class="insp__gdot"></i></div>`,
    render(t, c) {
      const y = c.p.drop;
      c.set(c.$.card, { yh: lerp(-62, 0, y) });
      c.$.gdot.style.left = c.r.drop * 100 + '%';
      c.$.gdot.style.top = gy(y) + '%';
    },
    prompt: (v) => `Animate the card into place with spring physics instead of a fixed curve: damping ratio ${SPRINGS[v][0]} (${SPRINGS[v][2].toLowerCase()}), so it ${SPRINGS[v][0] < 1 ? 'overshoots the target and settles naturally' : 'arrives without overshoot'}. In GSAP approximate with an elastic/back ease or a custom ease; in Framer Motion use type: "spring" with matching stiffness and damping.`,
  });

  /* 04 Inertia / momentum / friction */
  const PHYS = [['inertia', 'Inertia', 'Flick: fast start, exponential slow-down'], ['momentum', 'Momentum', 'Push builds speed, then it coasts'], ['friction', 'Friction', 'Constant braking: even deceleration']];
  demo({
    id: 'physics-motion', cat: CAT, name: 'Inertia, Momentum & Friction', aka: ['Deceleration', 'Coasting', 'Flick physics'],
    tags: ['object', 'ui'], char: ['Physical', 'Natural'], covers: 3,
    keywords: ['inertia', 'momentum', 'friction', 'deceleration', 'velocity'],
    what: 'Three ways an object can lose speed. The bar under each puck is its velocity. Inertia starts at full speed and decays smoothly; momentum first builds speed (a push), then coasts; friction brakes evenly to zero. Swipes, carousels and product spins should use one of these.',
    good: ['Carousels and swipe gestures', 'Product spins that slow to a stop', 'Scrolling text and marquees that settle', 'Whip pans that decelerate'],
    avoid: 'Short UI feedback (< 200ms) — physics needs time to read; use a simple ease-out instead.',
    anatomy: ['Scene time (simulated flick)', 'Three pucks', 'translateX by a physics model', '2.2s', 'Exponential decay · push+coast · quadratic', 'Simultaneous comparison'],
    tracks: [['go', 'Travel (physics)', 0.4, 2.2, 'linear'], ['hold', 'Rest', '>', 0.8, 'linear']],
    html: `<div class="phys">${PHYS.map(([id, l, d]) => `<div class="phys__lane"><b>${l}</b><span>${d}</span>
      <div class="phys__track"><span data-r="puck" class="runner"><i class="phys__puck"></i></span></div><div class="phys__vel"><em data-r="vel"></em></div></div>`).join('')}</div>`,
    render(t, c) {
      const u = c.r.go;
      PHYS.forEach(([id], i) => {
        const f = E[id], h = 0.01;
        const v = u > 0 && u < 1 ? (f(Math.min(1, u + h)) - f(Math.max(0, u - h))) / (2 * h) : 0;
        c.set(c.$$.puck[i], { xp: f(u) * 100 });
        c.set(c.$$.vel[i], { sx: clamp(v / 6) });
      });
    },
    prompt: 'Make the element decelerate like a real object after a flick: start at its highest velocity and let the speed decay exponentially (inertia) so it coasts to a stop over about 2s. Avoid a linear stop. For a pushed object, accelerate for the first third, then coast with friction.',
  });

  /* 05 Same motion, different ease */
  const CTX = [
    ['linear', 'Linear', 'linear', 'Mechanical — constant speed, abrupt stop.'],
    ['in', 'Ease in', 'cubic.in', 'Sluggish start, harsh landing. Wrong for entrances.'],
    ['out', 'Ease out', 'premium', 'Natural arrival. The safe default. ✓'],
    ['spring', 'Spring', 'spring', 'Lively and physical. Good for playful brands.'],
    ['bounce', 'Bounce', 'bounce.out', 'Comedic. Wrong for a premium skincare ad.'],
  ];
  const CB = Object.fromEntries(CTX.map((e) => [e[0], e]));
  demo({
    id: 'ease-in-context', cat: CAT, name: 'Same Motion, Different Ease', aka: ['Easing in context', 'Ease personality'],
    tags: ['object'], char: ['Comparison'],
    variants: CTX.map((e) => [e[0], e[1]]),
    what: 'A real product entrance with only the easing changed. In context the choice is obvious: the curve sets the brand’s tone of voice before a single word is read.',
    good: ['Deciding the motion language of a brand', 'Showing clients why “just make it bounce” can hurt a premium product'],
    avoid: '—',
    anatomy: ['Scene time', 'Serum bottle + headline', 'translateY 60% → 0 · headline fade-up', '1.0s bottle · 0.7s headline', 'Selected variant (bottle)', 'Bottle → headline overlaps by 0.5s'],
    tracks: (v) => [['prod', 'Product rise', 0.3, 1.0, CB[v][2]], ['head', 'Headline', '-=0.5', 0.7, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    html: (v) => `<div class="stackc" style="gap:4cqmin;padding-bottom:6cqmin">
        <div data-r="prod">${A.product('serum', { style: '--ph:52cqmin' })}</div>
        <div data-r="head" class="col" style="gap:1.6cqmin"><b class="t-serif" style="font-size:9cqmin">Glow, <i>daily.</i></b><span class="t-eyebrow">Séra · Daily serum</span></div></div>
      <div class="ctx-verdict"><b>${CB[v][1]}</b><span>${CB[v][3]}</span></div>`,
    cls: 'bg-studio-light',
    render(t, c) {
      c.set(c.$.prod, { yh: lerp(70, 0, c.p.prod) });
      c.set(c.$.head, { y: 5 * (1 - c.p.head), o: c.p.head });
    },
    prompt: (v) => `Bring the product up into frame over 1s using ${CB[v][1].toLowerCase()} easing (${CB[v][2]}), then fade the headline up with a premium ease-out, overlapping the product by 0.5s. Note: ${CB[v][3]}`,
  });
})();
