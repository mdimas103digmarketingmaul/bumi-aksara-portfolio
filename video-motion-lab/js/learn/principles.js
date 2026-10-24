/* Learn A–D — principles, timing, hierarchy, personalities.
   Comparisons use the same content twice (weak vs better) so the only
   difference is the motion decision being taught. */
(function () {
  'use strict';
  const { demo, block, lerp, clamp, ease, bump, A } = window.VML;
  const half = (k, label) => `<span class="split-label ${k === 'bad' ? 'split-label--bad' : 'split-label--good'}" style="left:3cqmin">${label}</span>`;

  /* ---------- A · principles glossary ---------- */
  const PRINCIPLES = [
    ['Timing', 'How long a motion takes. Duration sets weight and mood: short = light/fast, long = heavy/calm.', 'learn-timing'],
    ['Spacing', 'How far the object moves between frames. Uneven spacing is what easing creates — it is the feeling of acceleration.', 'learn-spacing'],
    ['Easing', 'The speed profile of a move. Ease-out for entrances, ease-in for exits, in-out between two rest points.', 'easing-race'],
    ['Anticipation', 'A small opposite move before the main action. Prepares the eye and adds force.', 'anticipation'],
    ['Overshoot', 'Passing the target and settling back. Confidence and life, in small doses.', 'overshoot'],
    ['Follow Through', 'Loose parts keep moving after the main body stops.', 'follow-through'],
    ['Secondary Motion', 'Smaller elements react to the hero with less amplitude and a delay.', 'secondary-motion'],
    ['Staging', 'Presenting one idea at a time so it reads instantly. Clear the stage around the important thing.', 'learn-staging'],
    ['Hierarchy', 'The most important element gets the strongest motion; everything else supports it.', 'learn-hierarchy'],
    ['Rhythm', 'The pattern of fast moments, slow moments and holds over time.', 'learn-visual-rhythm'],
    ['Contrast', 'Motion reads by difference: fast next to slow, big next to small, still next to moving.', 'learn-contrast'],
    ['Continuity', 'Elements keep their identity and direction across cuts and transitions.', 'learn-direction'],
    ['Direction', 'The path of motion leads the eye. Consistent directions make a sequence feel organised.', 'learn-direction'],
    ['Weight', 'Mass is shown by acceleration, impact and settle — heavy things start slowly and land hard.', 'learn-weight'],
    ['Momentum', 'Moving things keep moving; they slow down, they do not stop instantly.', 'physics-motion'],
    ['Balance', 'Motion spread across the frame so no area feels empty or overloaded at the end of a move.', 'geometric-assembly'],
  ];
  block('principles', () => `<div class="learn-grid">${PRINCIPLES.map(([n, d, id], i) => `<a class="learn-term" href="#d-${id}"><span>${String(i + 1).padStart(2, '0')}</span><b>${n}</b><p>${d}</p><em>See demo →</em></a>`).join('')}</div>`);

  /* Bad vs better timing */
  const rowHTML = (k) => `<div>${half(k, k === 'bad' ? 'Bad · all at once' : 'Better · hierarchy + overlap')}<div class="lp-comp">
    <div data-r="${k}img" class="lp-img">${A.photo('coffee', { cls: 'fill' })}</div><div class="lp-txt"><b data-r="${k}h" class="t-sans">Slow coffee</b><span data-r="${k}s" class="t-body">Single origin · 250 g</span><span data-r="${k}c" class="cta" style="height:8cqmin;font-size:3cqmin;padding:0 3.6cqmin">Order</span></div></div></div>`;
  demo({
    id: 'learn-timing', cat: 'principles', name: 'Bad vs Better Timing', aka: ['Hierarchy in time', 'Stagger vs simultaneous'],
    tags: ['object'], char: ['Comparison'], wide: true, fixed: '16:9',
    what: 'Top/left: every element appears at the same moment with the same move — nothing leads, so nothing is read first. Bottom/right: the image leads with the strongest move, the headline overlaps it, the supporting line follows softly and the button arrives last. Same elements, same total time.',
    good: ['Any multi-element entrance'], avoid: 'Simultaneous entrances for unrelated elements.',
    anatomy: ['Scene time', 'Image, headline, caption, button (×2)', 'Bad: identical fade-up together · Better: graded moves', 'Bad 0.6s · Better 1.3s total with overlap', 'linear vs premium/back', 'Bad: all → Better: image → title → caption → CTA'],
    tracks: [['bad', 'Bad · everything', 0.3, 0.6, 'linear'], ['g1', 'Better · image', 0.3, 0.8, 'premium', 'image'], ['g2', 'Better · headline', '<0.25', 0.6, 'expo.out', 'text'], ['g3', 'Better · caption', '<0.2', 0.5, 'premium', 'text'], ['g4', 'Better · CTA', '<0.3', 0.45, 'back.soft', 'cta'], ['hold', 'Hold', '>', 1.2, 'linear']],
    html: `<div class="split">${rowHTML('bad')}${rowHTML('good')}</div>`,
    render(t, c) {
      const b = c.p.bad;
      ['img', 'h', 's', 'c'].forEach((k) => c.set(c.$['bad' + k], { o: b, y: 4 * (1 - b) }));
      c.set(c.$.goodimg, { o: c.p.g1, s: lerp(0.9, 1, c.p.g1) });
      c.set(c.$.goodh, { o: c.p.g2, x: 5 * (1 - c.p.g2) });
      c.set(c.$.goods, { o: c.p.g3, y: 2 * (1 - c.p.g3) });
      c.set(c.$.goodc, { o: c.p.g4, s: lerp(0.8, 1, c.p.g4) });
    },
    prompt: 'Animate a card with clear hierarchy in time instead of everything at once: the image leads with the strongest move (scale 0.9 → 1 + fade, 800ms premium ease), the headline starts 250ms later sliding 5%, the caption 200ms after that with a gentle fade-up, and the button last with a small back-out pop.',
  });

  /* Spacing */
  demo({
    id: 'learn-spacing', cat: 'principles', name: 'Spacing (Onion Skin)', aka: ['Frame spacing', 'Easing visualised', 'Ghosting'],
    tags: ['object'], char: ['Technical', 'Reference'], wide: true, fixed: '16:9',
    what: 'Ghost dots show where the object is on each of 12 equally timed frames. Even spacing (top) = constant speed = mechanical. Eased spacing (bottom) = frames bunch up at the end = deceleration. Animators call this “spacing”: easing is just spacing made visible.',
    good: ['Understanding easing curves', 'Explaining motion feel to a team'], avoid: '—',
    anatomy: ['Scene time', 'Dot + 12 ghosts (×2)', 'Same distance and duration; different spacing', '1.4s', 'linear vs expo.out', 'Simultaneous comparison'],
    tracks: [['go', 'Travel (both)', 0.4, 1.4, 'linear'], ['hold', 'Hold', '>', 1.2, 'linear']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'Even spacing · linear' : 'Eased spacing · expo.out')}<div class="lp-lane">${Array.from({ length: 12 }, (_, i) => `<i class="lp-ghost" style="left:${(k === 'bad' ? i / 11 : ease('expo.out')(i / 11)) * 100}%"></i>`).join('')}<span data-r="${k}d" class="runner"><i class="lp-dot"></i></span></div></div>`).join('')}</div>`,
    render(t, c) {
      c.set(c.$.badd, { xp: c.r.go * 100 });
      c.set(c.$.goodd, { xp: ease('expo.out')(c.r.go) * 100 });
    },
    prompt: 'Visualise spacing: draw 12 ghost positions of an object sampled at equal time intervals for a linear move and for an expo-out move, then animate a dot along each lane over the same 1.4s so viewers connect the spacing with the feel.',
  });

  /* Staging */
  demo({
    id: 'learn-staging', cat: 'principles', name: 'Staging', aka: ['One idea at a time', 'Clear the stage'],
    tags: ['object'], char: ['Comparison'], wide: true, fixed: '16:9',
    what: 'Left: six things move at once in different directions — the eye has nowhere to land. Right: the background settles first, then a single hero moves while everything else stays still, then one supporting element joins. Staging means deciding what the viewer should look at, moment by moment.',
    good: ['Busy promos', 'Explainers with many elements'], avoid: 'Animating every layer just because you can.',
    anatomy: ['Scene time', 'Six shapes vs hero + support', 'Bad: random simultaneous moves · Good: sequential focus', '2s', 'mixed vs premium', 'Bad: chaos → Good: hero → support'],
    tracks: [['bad', 'Bad · all moving', 0.2, 2, 'linear'], ['hero', 'Good · hero', 0.4, 0.8, 'back.soft'], ['sup', 'Good · support', '+=0.3', 0.5, 'premium'], ['hold', 'Hold', '>', 0.8, 'linear']],
    html: `<div class="split"><div>${half('bad', 'Bad · everything moves')}${Array.from({ length: 6 }, (_, i) => `<i data-r="bs" class="lp-shape lp-shape--${i % 3}" style="left:${15 + (i % 3) * 30}%;top:${30 + Math.floor(i / 3) * 35}%"></i>`).join('')}</div>
      <div>${half('good', 'Better · one focus at a time')}${Array.from({ length: 6 }, (_, i) => `<i data-r="gs" class="lp-shape lp-shape--${i % 3}" style="left:${15 + (i % 3) * 30}%;top:${30 + Math.floor(i / 3) * 35}%"></i>`).join('')}</div></div>`,
    render(t, c) {
      c.$$.bs.forEach((el, i) => c.set(el, { x: Math.sin(t * (3 + i) + i) * 4, y: Math.cos(t * (2 + i)) * 4, r: t * (60 + i * 40) * (i % 2 ? 1 : -1), s: 1 + 0.3 * Math.sin(t * 5 + i) }));
      c.$$.gs.forEach((el, i) => {
        if (i === 4) c.set(el, { s: lerp(0.4, 1.35, c.p.hero), o: 1 });
        else if (i === 1) c.set(el, { o: lerp(0.25, 1, c.p.sup), y: 3 * (1 - c.p.sup) });
        else c.set(el, { o: 0.25 });
      });
    },
    prompt: 'Stage the scene so only one idea moves at a time: settle the background, then give a single hero element the main move (scale-in with a soft back-out), keep every other element still and dimmed, and only then bring in one supporting element.',
  });

  /* Weight */
  demo({
    id: 'learn-weight', cat: 'principles', name: 'Weight', aka: ['Mass in motion', 'Heavy vs light'],
    tags: ['object'], char: ['Physical', 'Comparison'], wide: true, fixed: '16:9',
    what: 'The same box drops twice. Light: floats down slowly, lands softly, bounces high. Heavy: accelerates hard, hits with a squash and a camera shake, barely rebounds. Weight is never a property you set — it is the acceleration, impact and settle you animate.',
    good: ['Product drops and logo stings', 'Making objects feel premium (heavy) or playful (light)'], avoid: 'Heavy products that float like feathers.',
    anatomy: ['Scene time', 'Box (×2)', 'Light: sine.inOut fall + big bounce · Heavy: expo.in fall + squash + shake', '0.9s fall', 'sine vs expo.in', 'Fall → impact → settle'],
    tracks: [['l', 'Light · fall', 0.3, 1.1, 'sine.inOut'], ['lb', 'Light · bounce', '>', 0.7, 'linear'], ['h', 'Heavy · fall', 0.5, 0.55, 'expo.in'], ['hi', 'Heavy · impact', '>', 0, 'linear', 'beat'], ['hs', 'Heavy · shake', '<', 0.35, 'linear', 'camera'], ['hold', 'Hold', 2.4, 0.6, 'linear']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div data-r="${k}fr">${half(k, k === 'bad' ? 'Light (feather)' : 'Heavy (anvil)')}<i class="lp-floor"></i><div class="lp-box-wrap"><i data-r="${k}box" class="lp-box ${k === 'good' ? 'lp-box--heavy' : ''}"></i></div></div>`).join('')}</div>`,
    render(t, c) {
      const lb = c.r.lb > 0 && c.r.lb < 1 ? Math.abs(Math.sin(c.r.lb * Math.PI * 2)) * (1 - c.r.lb) * 14 : 0;
      c.set(c.$.badbox, { yh: lerp(-60, 0, c.p.l) - lb });
      const st = t - c.tl.map.hs.start, imp = st > 0 && st < 0.12;
      c.set(c.$.goodbox, { yh: lerp(-60, 0, c.p.h), sy: imp ? 0.82 : 1, sx: imp ? 1.12 : 1 });
      const a = st > 0 ? Math.exp(-st * 12) * 2 : 0;
      c.set(c.$.goodfr, { y: Math.sin(st * 80) * a });
    },
    prompt: 'Show weight through motion: a heavy object accelerates into the ground (expo-in, ~550ms), squashes briefly on impact, shakes the frame for ~350ms and barely rebounds; a light object drifts down slowly (sine in-out, ~1.1s) and bounces softly.',
  });

  /* Direction & continuity */
  demo({
    id: 'learn-direction', cat: 'principles', name: 'Direction & Continuity', aka: ['Consistent flow', 'Screen direction'],
    tags: ['object', 'transition'], char: ['Comparison', 'Editorial'], wide: true, fixed: '16:9',
    what: 'Three cards enter in sequence. Left: each comes from a different side — the eye ping-pongs and the sequence feels random. Right: all flow in the same direction and each exits where the next enters, so the motion reads as one continuous path.',
    good: ['Carousels, lists, step sequences', 'Any series of related scenes'], avoid: 'Random entrance directions.',
    anatomy: ['Scene time', 'Three cards (×2)', 'Bad: from top/left/bottom · Good: all left → right', '0.6s each, 0.6s apart', 'expo.out', 'Card 1 → 2 → 3'],
    tracks: [['c', 'Cards ×3', 0.3, 0.6, 'expo.out', { n: 3, each: 0.6 }], ['hold', 'Hold', '>', 1, 'linear']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'Random directions' : 'One direction, continuous')}<div class="lp-cards">${[1, 2, 3].map((n) => `<i data-r="${k}card" class="lp-card">${n}</i>`).join('')}</div></div>`).join('')}</div>`,
    render(t, c) {
      const from = [{ yh: -60 }, { xw: 60 }, { yh: 60 }];
      c.$$.badcard.forEach((el, i) => { const p = c.st('c', i), f = from[i]; c.set(el, { xw: (f.xw || 0) * (1 - p), yh: (f.yh || 0) * (1 - p), o: p > 0 ? 1 : 0 }); });
      c.$$.goodcard.forEach((el, i) => { const p = c.st('c', i); c.set(el, { xw: -40 * (1 - p), o: p > 0 ? 1 : 0 }); });
    },
    prompt: 'Keep screen direction consistent: bring a sequence of cards in from the same side (e.g. all left → right, expo-out, 600ms apart) so the motion reads as one continuous flow; exits should leave toward where the next element comes from.',
  });

  /* Contrast */
  demo({
    id: 'learn-contrast', cat: 'principles', name: 'Contrast in Motion', aka: ['Fast vs slow', 'Motion contrast'],
    tags: ['object'], char: ['Comparison'], wide: true, fixed: '16:9',
    what: 'Left: four elements all move at the same medium speed — nothing stands out. Right: one element snaps in fast while the others drift slowly — the fast one becomes the focus without being bigger or brighter. Difference, not intensity, creates emphasis.',
    good: ['Emphasising a price, a word, a button'], avoid: 'Making everything fast to feel “energetic”.',
    anatomy: ['Scene time', 'Four dots (×2)', 'Bad: identical 1s moves · Good: one 0.25s snap among 2.4s drifts', 'see tracks', 'smooth vs snap', 'Simultaneous comparison'],
    tracks: [['med', 'Bad · all medium', 0.4, 1, 'smooth'], ['slow', 'Good · slow drift', 0.4, 2.4, 'sine.inOut'], ['fast', 'Good · one snap', 1.0, 0.25, 'snap', 'cta'], ['hold', 'Hold', 2.8, 0.6, 'linear']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'Same speed everywhere' : 'Contrast: one fast, rest slow')}${[0, 1, 2, 3].map((i) => `<i data-r="${k}dot" class="lp-cdot ${i === 2 ? 'lp-cdot--hero' : ''}" style="top:${22 + i * 18}%"></i>`).join('')}</div>`).join('')}</div>`,
    render(t, c) {
      c.$$.baddot.forEach((el) => c.set(el, { xw: lerp(-18, 18, c.p.med) }));
      c.$$.gooddot.forEach((el, i) => c.set(el, { xw: i === 2 ? lerp(-18, 18, c.p.fast) : lerp(-18, -6, c.p.slow) }));
    },
    prompt: 'Create emphasis through motion contrast: let the supporting elements drift slowly (≈2.4s, sine in-out) while the key element snaps into place quickly (≈250ms, sharp in-out). Avoid giving every element the same speed.',
  });

  /* ---------- B · timing ---------- */
  const DUR = [['Micro impact', 0.15, '100–200 ms', 'Taps, toggles, small feedback'], ['Fast UI', 0.3, '200–350 ms', 'UI transitions, menus, chips'], ['Normal entrance', 0.55, '400–700 ms', 'Titles, cards, images'], ['Elegant reveal', 1.0, '700–1200 ms', 'Premium titles, masks, logos'], ['Cinematic', 2.2, '1–3 s+', 'Camera moves, ambient, slow reveals']];
  block('timing', `<div class="learn-table"><div class="learn-table__row learn-table__head"><span>Category</span><span>Typical range</span><span>Use for</span></div>${DUR.map(([n, , r, u]) => `<div class="learn-table__row"><b>${n}</b><span class="mono">${r}</span><span>${u}</span></div>`).join('')}</div>
    <p class="learn-note">These ranges are a starting point, not a rule. Duration scales with <b>distance</b> (a long trip needs more time), <b>size</b> (big elements feel heavy when fast), <b>format</b> (a move across a tall 9:16 frame is longer than across a phone UI), and <b>purpose</b> (feedback must be instant; atmosphere can take seconds). Playback speed also matters — social viewers often watch at 1×, but editors preview at 2×.</p>`);
  demo({
    id: 'learn-durations', cat: 'timing', name: 'Duration Comparison', aka: ['How fast is fast?', 'Timing scale'],
    tags: ['object'], char: ['Reference', 'Technical'], wide: true, fixed: '16:9',
    what: 'Five dots travel the same distance with the same ease-out but different durations: 150 ms, 300 ms, 550 ms, 1 s and 2.2 s. Watch which ones feel snappy, natural, elegant or sluggish for this distance.',
    good: ['Calibrating your sense of duration'], avoid: '—',
    anatomy: ['Scene time', 'Five dots', 'translateX, same distance', '0.15 / 0.3 / 0.55 / 1.0 / 2.2 s', 'premium (ease-out)', 'All start together'],
    tracks: DUR.map(([n, d], i) => [`d${i}`, `${n} · ${Math.round(d * 1000)}ms`, 0.4, d, 'premium']).concat([['hold', 'Hold', 2.6, 0.8, 'linear']]),
    html: `<div class="race" style="grid-template-rows:repeat(5,minmax(0,1fr))">${DUR.map(([n, d, r]) => `<div class="race__row" style="grid-template-columns:28cqw 1fr"><span class="race__label">${n}<br/><small style="opacity:.6">${Math.round(d * 1000)} ms · ${r}</small></span><div class="race__track"><i class="race__a"></i><i class="race__b"></i><span data-r="dot" class="runner"><i class="race__dot"></i></span></div></div>`).join('')}</div>`,
    render(t, c) { c.$$.dot.forEach((el, i) => c.set(el, { xp: c.p['d' + i] * 100 })); },
    prompt: 'Pick durations by purpose and distance: ~100–200ms for micro feedback, 200–350ms for UI transitions, 400–700ms for standard entrances, 700–1200ms for elegant reveals, and 1–3s+ for cinematic camera moves. Scale up for longer distances and bigger elements.',
  });
  demo({
    id: 'learn-distance', cat: 'timing', name: 'Distance & Size Change Duration', aka: ['Duration scaling', 'Travel time'],
    tags: ['object'], char: ['Reference'], wide: true, fixed: '16:9',
    what: 'Top: a small chip moves a short distance in 300 ms (natural) and a large card crosses the whole frame in the same 300 ms (violent). Bottom: the large card gets 800 ms for its long trip, so both feel equally comfortable. Constant duration ≠ constant feel.',
    good: ['Responsive layouts and multi-format edits'], avoid: 'Using one duration for every element.',
    anatomy: ['Scene time', 'Small chip + large card (×2)', 'translateX', '300ms vs 300ms · 300ms vs 800ms', 'premium', 'Simultaneous comparison'],
    tracks: [['s', 'Small · 300ms', 0.4, 0.3, 'premium'], ['lbad', 'Large · 300ms (too fast)', 0.4, 0.3, 'premium'], ['lgood', 'Large · 800ms', 0.4, 0.8, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'Same duration for both' : 'Duration scaled to distance')}<i data-r="${k}s" class="lp-chip"></i><i data-r="${k}l" class="lp-bigcard"></i></div>`).join('')}</div>`,
    render(t, c) {
      ['bad', 'good'].forEach((k) => c.set(c.$[k + 's'], { xw: lerp(-8, 8, c.p.s) }));
      c.set(c.$.badl, { xw: lerp(-30, 25, c.p.lbad) });
      c.set(c.$.goodl, { xw: lerp(-30, 25, c.p.lgood) });
    },
    prompt: 'Scale duration with distance and size: give small, short moves ~250–300ms and large elements travelling across the frame ~700–900ms with the same easing, so every move feels equally comfortable.',
  });

  /* ---------- C · hierarchy ---------- */
  block('hierarchy', `<div class="learn-ladder">${[['Hero element', 'strongest motion', 'Scale, travel, the longest and most noticeable move'], ['Headline', 'medium motion', 'Masked reveal or slide, overlapping the hero'], ['Supporting copy', 'subtle motion', 'Short fade-up, low amplitude'], ['Background', 'ambient motion', 'Slow drift, gradient, push — barely noticed'], ['CTA', 'small purposeful interaction', 'Arrives last, then one gentle cue (pulse, arrow, shine)']].map(([a, b, d], i) => `<div style="--i:${i}"><b>${a}</b><span>→ ${b}</span><p>${d}</p></div>`).join('')}</div>
    <p class="learn-quote">“More motion does not automatically mean better motion.”</p>`);
  demo({
    id: 'learn-hierarchy', cat: 'hierarchy', name: 'Bad vs Better Hierarchy', aka: ['Motion hierarchy', 'Less is more'],
    tags: ['object', 'text'], char: ['Comparison'], wide: true, fixed: '16:9',
    what: 'Left: every element scales, rotates, glows, bounces and blurs, and particles fly — the frame is busy but says nothing. Right: the product (hero) gets the strongest move, the headline a medium one, the copy a subtle fade, the background a slow drift, and the CTA a small pulse at the end.',
    good: ['Every composition with more than two elements'], avoid: 'Applying every effect to every layer.',
    anatomy: ['Scene time', 'Product, headline, copy, background, CTA (×2)', 'Bad: everything maximal · Better: graded intensity', '≈2.4s', 'mixed', 'Hero → headline → copy → CTA'],
    tracks: [['bad', 'Bad · everything at max', 0.2, 2.2, 'linear'], ['hero', 'Better · hero', 0.3, 0.9, 'back.soft', 'object'], ['head', 'Better · headline', '<0.35', 0.6, 'expo.out', 'text'], ['copy', 'Better · copy', '<0.3', 0.5, 'premium', 'text'], ['cta', 'Better · CTA', '>', 0.45, 'back.soft', 'cta'], ['bg', 'Better · ambient bg', 0, 3.2, 'linear', 'bg']],
    html: `<div class="split">${['bad', 'good'].map((k) => `<div class="${k === 'bad' ? 'lp-h-bad' : ''}">${half(k, k === 'bad' ? 'Everything moves a lot' : 'Graded hierarchy')}<i data-r="${k}bg" class="lp-hbg"></i>
      <div class="lp-h"><div data-r="${k}prod">${A.product('can', { style: '--ph:46cqmin' })}</div><div class="lp-h__t"><b data-r="${k}head" class="t-sans">Zero sugar.<br/>Full flavour.</b><span data-r="${k}copy" class="t-body">Yuzu soda · 330 ml</span><span data-r="${k}cta" class="cta" style="height:8cqmin;font-size:3cqmin;padding:0 3.4cqmin">Try it</span></div></div>
      ${k === 'bad' ? Array.from({ length: 10 }, () => '<i data-r="pt" class="lp-pt"></i>').join('') : ''}</div>`).join('')}</div>`,
    render(t, c) {
      const b = c.r.bad, w = (f, ph) => Math.sin(t * f + ph);
      c.set(c.$.badprod, { s: 1 + 0.25 * w(6, 0), r: w(4, 1) * 25 });
      c.set(c.$.badhead, { s: 1 + 0.15 * w(7, 2), r: w(5, 0) * 8, css: { filter: `blur(${Math.abs(w(3, 1)) * 2}px) drop-shadow(0 0 ${6 + 6 * w(4, 0)}px #ff4a7a)` } });
      c.set(c.$.badcopy, { y: Math.abs(w(8, 0)) * -6 });
      c.set(c.$.badcta, { s: 1 + 0.2 * w(9, 3), r: w(9, 1) * 10 });
      c.set(c.$.badbg, { r: t * 90, s: 1.4 });
      c.$$.pt.forEach((el, i) => c.set(el, { x: Math.cos(i + t * 3) * (20 + i * 3), y: Math.sin(i * 2 + t * 4) * (15 + i * 2), o: b > 0 ? 1 : 0 }));
      c.set(c.$.goodprod, { y: 20 * (1 - c.p.hero), s: lerp(0.85, 1, c.p.hero), o: c.p.hero });
      c.set(c.$.goodhead, { o: c.p.head, x: 4 * (1 - c.p.head) });
      c.set(c.$.goodcopy, { o: c.p.copy * 0.8 });
      c.set(c.$.goodcta, { o: c.p.cta, s: c.r.cta >= 1 ? 1 + 0.03 * Math.sin((t - 2) * 5) : lerp(0.85, 1, c.p.cta) });
      c.set(c.$.goodbg, { s: 1.1 + c.p.bg * 0.1, r: c.p.bg * 6 });
    },
    prompt: 'Apply a motion hierarchy: the hero product gets the strongest move (rise + scale, soft back-out), the headline a medium move overlapping it, the supporting copy a subtle fade, the background only a slow ambient drift, and the CTA arrives last with one small pulse. Do not apply glow, blur, rotation and particles to everything.',
  });

  /* ---------- D · personalities ---------- */
  const PERS = {
    premium: ['Premium', 'Slow, controlled, long easing, subtle overshoot', { d: 1.2, e: 'premium', dist: 6, rot: 0, st: 0.22, cta: 'premium' }],
    energetic: ['Energetic', 'Fast, strong scale, punch, rapid cuts', { d: 0.3, e: 'punch', dist: 30, rot: 0, st: 0.08, cta: 'back.out', punch: true }],
    playful: ['Playful', 'Springs, bounce, exaggerated shapes', { d: 0.9, e: 'spring.wobbly', dist: 20, rot: 12, st: 0.12, cta: 'bounce.out' }],
    corporate: ['Corporate', 'Restrained, predictable, clean', { d: 0.5, e: 'cubic.out', dist: 4, rot: 0, st: 0.1, cta: 'cubic.out' }],
    cinematic: ['Cinematic', 'Slow camera, depth, grain, atmosphere', { d: 1.8, e: 'sine.inOut', dist: 3, rot: 0, st: 0.35, cta: 'sine.inOut', cine: true }],
    tech: ['Tech', 'Precise, grid, UI lines, stepped motion', { d: 0.45, e: 'expo.out', dist: 10, rot: 0, st: 0.06, cta: 'expo.out', tech: true }],
    editorial: ['Editorial', 'Typography, masks, composition, photography', { d: 1.0, e: 'expo.out', dist: 0, rot: 0, st: 0.15, cta: 'premium', mask: true }],
  };
  block('personalities', `<div class="learn-chips">${Object.values(PERS).map(([n, d]) => `<div><b>${n}</b><span>${d}</span></div>`).join('')}</div>`);
  demo({
    id: 'learn-personalities', cat: 'personalities', name: 'One Layout, Seven Personalities', aka: ['Motion tone of voice', 'Brand motion style'],
    tags: ['object', 'text', 'brand'], char: ['Reference'], covers: 7,
    variants: Object.entries(PERS).map(([k, [n]]) => [k, n]),
    what: 'The same product card — image, headline, line, button — animated in seven personalities. Only duration, easing, distance, rotation, stagger and a few finishing touches change. This is what “motion language” means in a brand system.',
    good: ['Defining a brand’s motion principles', 'Briefing editors and animators', 'Choosing the right tone for a campaign'], avoid: 'Mixing personalities within one video.',
    anatomy: ['Scene time', 'Photo, headline, line, CTA', 'Same entrance; parameters per personality', 'Varies (0.3s energetic → 1.8s cinematic)', 'Varies', 'Photo → headline → line → CTA'],
    tracks: (v) => { const o = PERS[v][2]; return [['img', 'Image', 0.2, o.d, o.e, 'image'], ['h', 'Headline', `<${o.st * 2}`, o.d * 0.8, o.e, 'text'], ['l', 'Line', `<${o.st}`, o.d * 0.7, o.e, 'text'], ['cta', 'CTA', `<${o.st * 2}`, Math.max(0.35, o.d * 0.6), o.cta, 'cta'], ['hold', 'Hold', '>', 1.2, 'linear']]; },
    cls: (v) => (v === 'tech' ? 'bg-grid' : v === 'cinematic' ? 'bg-ink' : v === 'energetic' ? 'bg-red' : v === 'playful' ? 'bg-yellow' : v === 'editorial' ? 'bg-cream' : v === 'corporate' ? 'bg-paper' : 'bg-studio-warm'),
    html: (v) => `<div class="lp-pers lp-pers--${v}"><div data-r="img" class="lp-pers__img">${A.photo(v === 'editorial' ? 'portrait' : v === 'cinematic' ? 'alpine' : 'coffee', { r: 'pimg', cls: 'fill' })}</div>
      <span class="mask"><b data-r="h" class="lp-pers__h">${v === 'energetic' ? 'NEW DROP!' : v === 'tech' ? 'Brew v2.0' : 'Morning, slower.'}</b></span><span data-r="l" class="lp-pers__l">${v === 'tech' ? '> roast_profile: optimized' : 'Single-origin coffee · 250 g'}</span><span data-r="cta" class="cta lp-pers__cta">Shop now</span>
      ${v === 'cinematic' ? '<i data-r="grain" class="grain"></i><i class="vignette"></i>' : ''}<span class="lp-pers__name">${PERS[v][0]}</span></div>`,
    render(t, c) {
      const o = PERS[c.v][2];
      const ip = c.p.img, hp = c.p.h, lp = c.p.l, cp = c.p.cta;
      c.set(c.$.img, { y: o.dist * 0.5 * (1 - ip), s: o.punch ? lerp(1.4, 1, ip) : lerp(o.cine ? 1.12 : 0.94, 1, ip), r: o.rot * (1 - ip), o: o.mask ? 1 : clamp(c.r.img * 3), clip: o.mask ? `inset(${100 - ip * 100}% 0 0 0)` : 'none' });
      if (o.cine) c.set(c.$.pimg, { s: 1 + t * 0.02 });
      c.set(c.$.h, { yp: o.mask ? 105 * (1 - hp) : 0, y: o.mask ? 0 : o.dist * 0.4 * (1 - hp), r: o.rot * 0.5 * (1 - hp), o: o.mask ? 1 : clamp(c.r.h * 3), s: o.punch ? lerp(1.5, 1, hp) : 1 });
      if (o.tech) { const n = Math.floor(clamp(c.r.l) * 26); c.$.l.textContent = '> roast_profile: optimized'.slice(0, n); }
      c.set(c.$.l, { o: o.tech ? 1 : lp, y: o.tech ? 0 : 3 * (1 - lp) });
      c.set(c.$.cta, { s: lerp(o.punch ? 0.5 : 0.9, 1, cp), o: clamp(c.r.cta * 3), r: o.rot * (1 - cp) });
      if (c.$.grain) { const f = Math.floor(t * 24); c.set(c.$.grain, { o: 0.4, xp: (Math.sin(f * 12.9) * 0.5) * 20 }); }
    },
    prompt: (v) => `Animate the product card with a ${PERS[v][0].toLowerCase()} motion personality: ${PERS[v][1].toLowerCase()}. Use ~${PERS[v][2].d}s moves with a ${PERS[v][2].e} ease, ${PERS[v][2].dist ? `about ${PERS[v][2].dist}% travel` : 'masks instead of travel'} and a ${Math.round(PERS[v][2].st * 1000)}ms stagger between image, headline, line and CTA. Keep this personality consistent across the whole video.`,
  });
})();
