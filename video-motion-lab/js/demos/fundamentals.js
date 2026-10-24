/* 01 — Motion Fundamentals
   How things enter, move and leave, plus the classic animation principles.
   Many demos show a live readout of the property that is changing. */
(function () {
  'use strict';
  const { demo, lerp, clamp, seg, ease, bump, A } = window.VML;
  const CAT = 'fundamentals';
  const readout = (label, extra = '') => `<div class="readout"><span>${label}</span><b data-r="ro">0.00</b><i><em data-r="robar"></em></i>${extra}</div>`;
  const setRO = (c, value, frac, digits = 2) => {
    c.$.ro.textContent = typeof value === 'number' ? value.toFixed(digits) : value;
    if (c.$.robar) c.set(c.$.robar, { sx: clamp(frac, 0, 1.4) });
  };

  /* 01 Fade */
  demo({
    id: 'fade', cat: CAT, name: 'Fade In / Fade Out', aka: ['Opacity transition', 'Dissolve in', 'Fade up'],
    tags: ['object', 'text'], char: ['Editorial', 'Premium', 'Calm'],
    what: 'Only opacity changes: the element appears and disappears without moving. The calmest entrance there is — it adds no direction and no energy, so the content itself carries the moment.',
    good: ['Quiet editorial titles and quotes', 'Subtitles and lower thirds', 'Ending a scene softly before a cut', 'A base layer under slide or scale'],
    avoid: 'The video needs energy or direction. A lone fade feels passive in a fast hook, and a slow fade over busy footage looks like a mistake.',
    anatomy: ['Scene time (no interaction)', 'Title block', 'opacity 0 → 1 → 0', '0.8s in · 1.4s hold · 0.6s out', 'sine.inOut in · quad.in out', 'Fade in → hold → fade out'],
    tracks: [['in', 'Fade in', 0.3, 0.8, 'sine.inOut'], ['hold', 'Hold to read', '>', 1.4, 'linear'], ['out', 'Fade out', '>', 0.6, 'quad.in']],
    html: `<div class="stackc pad"><div data-r="card" class="col" style="gap:3.4cqmin">
        <span class="t-eyebrow">Chapter 01</span>
        <h4 class="t-serif" style="font-size:14cqmin;margin:0">Quiet <i>morning</i><br/>light</h4>
        <p class="t-body" style="max-width:62cqmin;margin:0">A slow fade lets words arrive without asking for attention.</p>
      </div></div>${readout('opacity')}`,
    render(t, c) {
      const o = c.p.in * (1 - c.p.out);
      c.set(c.$.card, { o });
      setRO(c, o, o);
    },
    prompt: 'Create a calm fade-in / fade-out title moment. Fade the title block from opacity 0 to 1 over 800ms with a sine ease-in-out, hold it fully visible for about 1.4s so it can be read, then fade it out over 600ms with an ease-in. Animate opacity only — no movement — so the motion stays quiet and editorial.',
  });

  /* 02 Slide in */
  const SLIDE = { bottom: { yh: 75 }, top: { yh: -75 }, left: { xw: -95 }, right: { xw: 95 } };
  const ROT = { bottom: -90, top: 90, left: 0, right: 180 };
  demo({
    id: 'slide-in', cat: CAT, name: 'Slide In', aka: ['Translate in', 'Move in', 'Fly in'],
    tags: ['object'], char: ['Clean', 'Directional', 'Corporate'],
    variants: [['bottom', 'From bottom'], ['top', 'From top'], ['left', 'From left'], ['right', 'From right']],
    what: 'The element travels into place from outside the frame. Unlike a fade, a slide has direction — and direction carries meaning: up feels like rising, left-to-right feels like progress.',
    good: ['Introducing a product card or image', 'Lower thirds and side panels', 'Showing sequence or progress (left → right)', 'Mobile-native feeling (bottom → up)'],
    avoid: 'Elements come from random directions in one scene. Pick one or two directions per scene so the viewer can predict the flow.',
    anatomy: ['Scene time', 'Image card, then caption', 'translate off-frame → 0 (+ opacity)', 'Card 0.9s · caption 0.6s, overlapping', 'expo.out (fast start, soft landing)', 'Card → caption (starts 0.45s before card ends)'],
    tracks: [['card', 'Card slide', 0.3, 0.9, 'expo.out'], ['cap', 'Caption', '-=0.45', 0.6, 'premium']],
    html: (v) => `<div class="center"><div class="slide-guide" style="transform:rotate(${ROT[v]}deg)"></div></div>
      <div class="stackc" style="gap:5cqmin">
        <div data-r="card" class="frame" style="position:relative;width:58cqmin;height:70cqmin">${A.photo('alpine')}</div>
        <div data-r="cap" class="col" style="gap:1.6cqmin"><span class="t-eyebrow">New collection</span><b class="t-sans" style="font-size:7cqmin">Alpine Series</b></div>
      </div>${readout('translate')}`,
    render(t, c) {
      const from = SLIDE[c.v];
      const k = 1 - c.p.card;
      c.set(c.$.card, { xw: (from.xw || 0) * k, yh: (from.yh || 0) * k, o: Math.min(1, c.r.card * 4) });
      c.set(c.$.cap, { y: 6 * (1 - c.p.cap), o: c.p.cap });
      setRO(c, Math.round(k * 100) + '%', k);
    },
    prompt: (v) => `Create a slide-in entrance for an image card coming from the ${v} edge of a vertical 9:16 frame. Start fully off-frame, travel to its resting position over 900ms with an expo-out ease (fast start, long soft landing), fading opacity in during the first 25% of the move. Start the caption 450ms before the card lands, sliding up 6% with a short fade. Keep a single direction for the whole scene.`,
  });

  /* 03 Scale in */
  demo({
    id: 'scale-in', cat: CAT, name: 'Scale In', aka: ['Pop in', 'Grow in', 'Zoom in (element)'],
    tags: ['object'], char: ['Energetic', 'Playful', 'Punchy'],
    what: 'The element grows from a smaller scale to its final size. Scale draws the eye to the centre of the element, so it is ideal for badges, icons and stickers that need to be noticed.',
    good: ['Badges, stickers, icons', 'Price tags and “NEW” labels', 'Emphasis on a beat', 'Buttons appearing on an end card'],
    avoid: 'Large photos or paragraphs: scaling big surfaces from tiny feels cheap. For big elements start at 0.9–0.95, not 0.',
    anatomy: ['Scene time', 'Circular badge, then label', 'scale 0.3 → 1 + opacity', '0.6s badge · 0.5s label', 'back.soft (slight overshoot)', 'Badge → label 0.25s later'],
    tracks: [['pop', 'Badge scale', 0.35, 0.6, 'back.soft'], ['label', 'Label', '<0.25', 0.5, 'premium']],
    html: `<div class="stackc" style="gap:6cqmin">
        <div style="position:relative;width:44cqmin;height:44cqmin">
          <div class="scale-ghost"></div>
          <div data-r="badge" class="scale-badge"><span class="t-display">New</span><small>Drop 04</small></div>
          <i class="origin-dot"></i>
        </div>
        <p data-r="label" class="t-eyebrow">transform-origin: center</p>
      </div>${readout('scale')}`,
    render(t, c) {
      const s = lerp(0.3, 1, c.p.pop);
      c.set(c.$.badge, { s, o: Math.min(1, c.r.pop * 3) });
      c.set(c.$.label, { y: 3 * (1 - c.p.label), o: c.p.label });
      setRO(c, c.r.pop > 0 ? s : 0.3, s);
    },
    prompt: 'Create a scale-in “pop” for a circular NEW badge. Scale from 0.3 to 1 over 600ms around its centre with a soft back-out ease (about 5% overshoot), fading opacity in during the first 200ms. 250ms after the badge starts, fade and slide a small label up 3% below it. Keep the overshoot subtle so it feels confident, not cartoonish.',
  });

  /* 04 Scale out */
  demo({
    id: 'scale-out', cat: CAT, name: 'Scale Out', aka: ['Shrink out', 'Zoom through', 'Scale exit'],
    tags: ['object', 'transition'], char: ['Clean', 'Energetic'],
    variants: [['shrink', 'Shrink + fade'], ['grow', 'Grow + fade (zoom through)']],
    what: 'The exit counterpart of scale-in. Shrinking pushes an element “away”; growing past full size feels like flying through it into the next scene. Exits should accelerate (ease-in) — they are leaving, not arriving.',
    good: ['Clearing a card before the next scene', 'Zoom-through transitions between ideas', 'Dismissing pop-ups and stickers'],
    avoid: 'The exit is slower or more dramatic than the entrance. Exits are usually 20–40% shorter.',
    anatomy: ['Scene time', 'Photo card', 'Shrink: scale 1 → 0.7 · Grow: 1 → 1.8, + fade/blur', '0.5s in · 1.2s hold · 0.55s out', 'premium in · cubic.in out', 'Enter → hold → exit → next scene'],
    tracks: [['in', 'Enter', 0.2, 0.5, 'premium'], ['hold', 'Hold', '>', 1.2, 'linear'], ['out', 'Scale out', '>', 0.55, 'cubic.in'], ['next', 'Next scene', '-=0.15', 0.5, 'premium']],
    html: `<div class="center"><div data-r="next" class="col" style="gap:2cqmin"><span class="t-eyebrow">Scene 02</span><b class="t-serif" style="font-size:12cqmin"><i>Next idea</i></b></div></div>
      <div class="center"><div data-r="card" class="frame" style="position:relative;width:60cqmin;height:74cqmin">${A.photo('portrait')}<b class="frame-title">Portraits<br/>in warm light</b></div></div>${readout('scale')}`,
    render(t, c) {
      const grow = c.v === 'grow';
      const out = c.p.out;
      const s = lerp(0.94, 1, c.p.in) * lerp(1, grow ? 1.8 : 0.7, out);
      c.set(c.$.card, { s, o: c.p.in * (1 - out), blur: grow ? out * 2.5 : 0 });
      c.set(c.$.next, { s: lerp(grow ? 0.85 : 1.08, 1, c.p.next), o: c.p.next });
      setRO(c, s, s / 1.8);
    },
    prompt: (v) => v === 'grow'
      ? 'Create a zoom-through exit: after a 1.2s hold, scale the photo card from 1 to 1.8 over 550ms with a cubic ease-in while fading it out and adding a little blur, so it feels like the camera flies through it. Overlap the next scene by 150ms, scaling it from 0.85 to 1 with a soft ease-out.'
      : 'Create a shrink-and-fade exit: after a 1.2s hold, scale the photo card from 1 to 0.7 over 550ms with a cubic ease-in while fading it to 0, as if it moves away from the viewer. Bring the next title in 150ms before the exit ends, settling from scale 1.08 to 1. Keep the exit shorter than the entrance.',
  });

  /* 05 Rotate in */
  demo({
    id: 'rotate-in', cat: CAT, name: 'Rotate In', aka: ['Spin in', 'Swing in'],
    tags: ['object'], char: ['Playful', 'Energetic'],
    variants: [['center', 'Center pivot'], ['corner', 'Corner pivot (swing)']],
    what: 'The element rotates into its resting angle. The pivot changes everything: a centre pivot spins like a sticker, a corner pivot swings like a sign on a hinge.',
    good: ['Stickers, stamps and labels', 'Playful social graphics', 'Hanging signs, tags, price cards'],
    avoid: 'Text-heavy elements — rotated text is hard to read mid-motion. Keep large rotations for short, simple shapes.',
    anatomy: ['Scene time', 'Sticker card', 'rotate −120° → 0 (+ scale) · or −75° from a corner', '0.8s', 'back.out (center) · spring.soft (corner)', 'Single move, then rest'],
    tracks: (v) => [['rot', v === 'corner' ? 'Swing from corner' : 'Spin + scale', 0.3, v === 'corner' ? 1.3 : 0.8, v === 'corner' ? 'spring.soft' : 'back.out']],
    html: (v) => `<div class="center"><div style="position:relative">
        <div data-r="card" class="rot-card" style="transform-origin:${v === 'corner' ? '0% 0%' : '50% 50%'}"><span class="t-eyebrow">Hot pick</span><b class="t-display">Weekend<br/>Edit</b></div>
        <i class="origin-dot" style="${v === 'corner' ? 'left:0;top:0' : ''}"></i></div></div>${readout('rotate')}`,
    render(t, c) {
      const corner = c.v === 'corner';
      const r = lerp(corner ? -75 : -120, 0, c.p.rot);
      c.set(c.$.card, corner ? { r, o: Math.min(1, c.r.rot * 5) } : { r, s: lerp(0.5, 1, c.p.rot), o: Math.min(1, c.r.rot * 4) });
      setRO(c, Math.round(r) + '°', Math.abs(r) / 120);
    },
    prompt: (v) => v === 'corner'
      ? 'Create a swing-in for a sticker card hinged at its top-left corner: set transform-origin to the corner, rotate from −75° to 0° over about 1.3s with a soft spring so it swings past rest once and settles, fading in during the first 20% of the motion.'
      : 'Create a spin-in for a sticker card: rotate from −120° to 0° around its centre while scaling from 0.5 to 1 over 800ms with a back-out ease, fading in during the first quarter. Keep it to one rotation — this is an accent, not a loop.',
  });

  /* 06 Combined entrance */
  demo({
    id: 'combined-entrance', cat: CAT, name: 'Combined Entrance', aka: ['Layered properties', 'Fade-up', 'Multi-property tween'],
    tags: ['object', 'text'], char: ['Premium', 'Clean'],
    what: 'Professional entrances rarely animate one property. Each tile adds one more layer to the same move: opacity, then translate, then scale, then blur. Small amounts of each, combined, read as one smooth arrival.',
    good: ['Default entrance for titles and cards', 'Premium brand content', 'Anywhere a single-property move feels flat'],
    avoid: 'Each property is pushed to the maximum. Combined motion only works when each part is subtle (translate 4–8%, scale 0.9–0.96, blur ≤ 8px).',
    anatomy: ['Scene time', 'The same word, four times', 'opacity → + translateY → + scale → + blur', 'All 0.9s, identical start', 'premium (cubic-bezier .22,1,.36,1)', 'Simultaneous — compare the four results'],
    tracks: [['go', 'Entrance (all tiles)', 0.4, 0.9, 'premium'], ['hold', 'Hold', '>', 1.1, 'linear']],
    html: `<div class="tiles4">${['opacity', '+ translate', '+ scale', '+ blur'].map((l, i) =>
      `<div><span class="lane-label" style="left:3.5cqmin;top:3.5cqmin">${String(i + 1).padStart(2, '0')} · ${l}</span><b data-r="word" class="t-sans" style="font-size:11cqmin">Arrive</b></div>`).join('')}</div>`,
    render(t, c) {
      const p = c.p.go;
      c.$$.word.forEach((el, i) => {
        c.set(el, { o: p, y: i >= 1 ? 8 * (1 - p) : 0, s: i >= 2 ? lerp(0.86, 1, p) : 1, blur: i >= 3 ? 3 * (1 - p) : 0 });
      });
    },
    prompt: 'Create a premium combined entrance for a headline: animate opacity 0 → 1, translateY from +8% to 0, scale from 0.86 to 1 and blur from 8px to 0, all together over 900ms with the cubic-bezier(0.22, 1, 0.36, 1) ease. Keep every property subtle; the combination should read as one smooth arrival, not four effects.',
  });

  /* 07 Stagger */
  demo({
    id: 'stagger', cat: CAT, name: 'Stagger Entrance', aka: ['Cascade', 'Offset start', 'Ripple-in list'],
    tags: ['object', 'text'], char: ['Clean', 'Rhythmic', 'Corporate'],
    what: 'Several similar elements play the same animation with a small delay between each start. The delay creates a reading order and a rhythm, instead of everything popping at once.',
    good: ['Lists, tips and steps', 'Grids of products or icons', 'Feature stacks in ads', 'Letters and words in titles'],
    avoid: 'The stagger is so long that the last item arrives after the viewer has lost interest. Keep total stagger under ~0.6s for 5–7 items.',
    anatomy: ['Scene time', 'Title + five list rows', 'translateY 5% → 0 + opacity', 'Each row 0.6s · 90ms stagger', 'premium', 'Title, then rows one after another (overlapping)'],
    tracks: [['title', 'Title', 0.2, 0.6, 'premium'], ['rows', 'Rows ×5 (90ms stagger)', '<0.3', 0.6, 'premium', { n: 5, each: 0.09 }]],
    html: `<div class="fill pad col" style="align-items:stretch;justify-content:center;gap:2.6cqmin">
      <b data-r="title" class="t-sans" style="font-size:8.5cqmin;margin-bottom:2cqmin">5 habits of<br/>great motion</b>
      ${['Start with hierarchy', 'Overlap your moves', 'Hold to read', 'Ease out entrances', 'One hero at a time'].map((s, i) =>
        `<div data-r="row" class="list-row"><span class="t-mono">0${i + 1}</span><b>${s}</b></div>`).join('')}
    </div>`,
    render(t, c) {
      c.set(c.$.title, { y: 5 * (1 - c.p.title), o: c.p.title });
      c.$$.row.forEach((el, i) => { const p = c.st('rows', i); c.set(el, { y: 5 * (1 - p), o: p }); });
    },
    prompt: 'Create a stagger entrance for a list of five rows under a title. The title fades up first over 600ms. Starting 300ms later, each row fades in and moves up 5% over 600ms with a premium ease-out, each one 90ms after the previous. The total stagger stays under 0.4s so the list reads as one cascading gesture.',
  });

  /* 08 Sequential */
  demo({
    id: 'sequential', cat: CAT, name: 'Sequential Animation', aka: ['Chained animation', 'A → B → C'],
    tags: ['object'], char: ['Clear', 'Instructional'],
    what: 'Each motion starts exactly when the previous one ends. Very clear and easy to follow, which makes it good for instructions — but with no overlap it can feel slow and robotic. Compare with the next demo.',
    good: ['Step-by-step explainers', 'Tutorial and UI walkthroughs', 'When each step must be understood before the next'],
    avoid: 'Fast social content: strict sequence wastes the first seconds. Use overlap instead.',
    anatomy: ['Scene time', 'Icon, headline, button', 'scale in → slide up → pop in', '0.5s each, no overlap', 'back.out / premium / back.soft', 'A ends → B starts → C starts (position “>”)'],
    tracks: [['a', 'A · Icon', 0.3, 0.5, 'back.out'], ['b', 'B · Headline', '>', 0.5, 'premium'], ['c', 'C · Button', '>', 0.5, 'back.soft']],
    html: `<div class="stackc" style="gap:5cqmin">
      <div data-r="a" class="seq-icon">${A.icon('bolt')}</div>
      <b data-r="b" class="t-sans" style="font-size:9cqmin;text-align:center">Charge in<br/>15 minutes</b>
      <span data-r="c" class="cta">Learn more ${A.icon('arrow')}</span>
      <div class="seq-steps"><span data-r="sa">A</span><i></i><span data-r="sb">B</span><i></i><span data-r="sc">C</span></div>
    </div>`,
    render(t, c) {
      c.set(c.$.a, { s: c.p.a, o: Math.min(1, c.r.a * 3) });
      c.set(c.$.b, { y: 6 * (1 - c.p.b), o: c.p.b });
      c.set(c.$.c, { s: lerp(0.6, 1, c.p.c), o: c.p.c });
      ['a', 'b', 'c'].forEach((k) => c.$['s' + k].classList.toggle('on', c.r[k] > 0 && c.r[k] < 1));
    },
    prompt: 'Create a strictly sequential animation: (A) an icon scales in over 500ms with back-out; when it finishes, (B) the headline slides up 6% and fades in over 500ms; when that finishes, (C) the button pops from scale 0.6 to 1 over 500ms. No overlap — each step starts exactly when the previous ends.',
  });

  /* 09 Overlapping */
  const ovRow = (k, label, time) => `<div><span class="split-label ${k === 's' ? 'split-label--bad' : 'split-label--good'}" style="left:3cqmin">${label}</span>
      <span class="lane-label" style="right:3cqmin;top:3.6cqmin">${time}</span>
      <div class="ov-row"><div data-r="${k}1" class="ov-img">${A.photo('coffee')}</div><div class="col" style="align-items:flex-start;gap:1.4cqmin"><b data-r="${k}2" class="t-sans" style="font-size:7cqmin">Slow coffee</b><span data-r="${k}3" class="t-body" style="font-size:3.2cqmin">Single origin · 250 g</span></div></div></div>`;
  demo({
    id: 'overlapping', cat: CAT, name: 'Overlapping Animation', aka: ['Overlapping action', 'Offset timing', 'Negative delay'],
    tags: ['object'], char: ['Fluid', 'Premium', 'Natural'],
    what: 'The next motion starts before the previous one ends. Same three moves as a sequence, but the scene finishes almost twice as fast and feels like one fluid gesture instead of three separate steps. This is the single biggest upgrade most motion needs.',
    good: ['Almost every title + image + caption group', 'Social video where time is short', 'Making motion feel natural and continuous'],
    avoid: 'Overlap is so large that everything moves at once — then hierarchy disappears. Overlap 30–60% of the previous move.',
    anatomy: ['Scene time', 'Image, title, caption (two versions)', 'Same moves in both halves', 'Top: 0.5s each in sequence · bottom: starts 0.16s apart', 'premium', 'Top “>” chaining vs bottom “<0.16” offsets'],
    tracks: [
      ['s1', 'Seq · image', 0.3, 0.5, 'premium'], ['s2', 'Seq · title', '>', 0.5, 'premium'], ['s3', 'Seq · caption', '>', 0.5, 'premium'],
      ['o1', 'Overlap · image', 0.3, 0.5, 'premium'], ['o2', 'Overlap · title', '<0.16', 0.5, 'premium'], ['o3', 'Overlap · caption', '<0.16', 0.5, 'premium'],
      ['hold', 'Hold', 1.8, 1, 'linear'],
    ],
    html: `<div class="split">${ovRow('s', 'Sequential', '1.50s total')}${ovRow('o', 'Overlapping', '0.82s total')}</div>`,
    render(t, c) {
      ['s', 'o'].forEach((k) => {
        c.set(c.$[k + '1'], { s: lerp(0.9, 1, c.p[k + '1']), o: c.p[k + '1'] });
        c.set(c.$[k + '2'], { x: 6 * (1 - c.p[k + '2']), o: c.p[k + '2'] });
        c.set(c.$[k + '3'], { x: 6 * (1 - c.p[k + '3']), o: c.p[k + '3'] });
      });
    },
    prompt: 'Animate an image, a title and a caption with overlapping timing: each element fades in and moves 6% over 500ms with a premium ease-out, but each starts 160ms after the previous one starts (not after it ends). The group should finish in about 0.8s and read as one continuous gesture.',
  });

  /* 10 Anticipation */
  const puck = (k, label) => `<div><span class="split-label ${k === 'a' ? 'split-label--bad' : 'split-label--good'}" style="left:3cqmin">${label}</span>
    <div class="track-line"></div><div class="puck-wrap"><div data-r="${k}" class="puck"></div></div></div>`;
  demo({
    id: 'anticipation', cat: CAT, name: 'Anticipation', aka: ['Wind-up', 'Pull back', 'Preparation'],
    tags: ['object'], char: ['Playful', 'Energetic', 'Physical'],
    what: 'A small move in the opposite direction before the main action — the wind-up before a throw. It tells the viewer something is about to happen and makes the main move feel stronger.',
    good: ['Characters, mascots and icons', 'Buttons and stickers that jump', 'Whip transitions (pull back before the whip)', 'Making a fast move readable'],
    avoid: 'Premium or corporate content where restraint matters — anticipation reads as cartoony when exaggerated. Keep it to 5–10% of the travel.',
    anatomy: ['Scene time', 'Puck (two versions)', 'Bottom: pull back −8% + squash, then launch', 'Wind-up 0.35s · move 0.8s', 'sine.inOut wind-up · expo.out launch', 'Top: move only · bottom: wind-up → move'],
    tracks: [['a', 'Without · move', 0.6, 0.9, 'cubic.inOut'], ['anti', 'With · wind-up', 0.4, 0.35, 'sine.inOut'], ['b', 'With · launch', '>', 0.8, 'expo.out'], ['hold', 'Hold', '+=0.2', 0.8, 'linear']],
    html: `<div class="split">${puck('a', 'Without anticipation')}${puck('b', 'With anticipation')}</div>`,
    render(t, c) {
      const W = 56;
      c.set(c.$.a, { x: c.p.a * W });
      const back = -8 * c.p.anti * (1 - c.p.b);
      const v = c.speed('b');
      const squash = c.r.b === 0 ? 0.16 * c.p.anti : 0;
      const stretch = Math.min(0.35, v * 0.05);
      c.set(c.$.b, { x: back + c.p.b * (W + 8), sx: 1 - squash + stretch, sy: 1 + squash - stretch * 0.6 });
    },
    prompt: 'Add anticipation to a quick horizontal move: before travelling right, the object pulls back about 8% of the distance over 350ms with a sine ease while squashing slightly (scaleX 0.85, scaleY 1.15). Then it launches to the target over 800ms with an expo-out ease, stretching a little along the direction of travel while it is fastest. Keep the wind-up small and short.',
  });

  /* 11 Overshoot */
  demo({
    id: 'overshoot', cat: CAT, name: 'Overshoot', aka: ['Back ease', 'Overshoot & settle', 'Snap past'],
    tags: ['object'], char: ['Energetic', 'Playful', 'Confident'],
    what: 'The element travels past its target and comes back to rest. The dashed line is the target; the faint outline shows the same move without overshoot. A little overshoot adds confidence and life; a lot adds comedy.',
    good: ['Badges and labels landing', 'UI cards snapping into place', 'Energetic social and promo graphics'],
    avoid: 'Long, slow moves or premium scenes — overshoot on a slow move looks like a wobble. Use it on short moves (≤ 600ms).',
    anatomy: ['Scene time', 'Label pill (+ ghost reference)', 'translateX off-frame → target', '0.75s', 'back.out (≈10% overshoot) vs expo.out ghost', 'Single move'],
    tracks: [['go', 'Slide + overshoot', 0.4, 0.75, 'back.out'], ['hold', 'Hold', '>', 1.2, 'linear']],
    html: `<div class="center"><div class="target-line"><span class="t-mono">target</span></div></div>
      <div class="center"><div data-r="ghost" class="os-pill os-pill--ghost">Sale ends Sunday</div></div>
      <div class="center"><div data-r="pill" class="os-pill">Sale ends Sunday</div></div>
      <div class="center"><div style="transform:translateY(-12cqmin)"><span data-r="tag" class="tag tag--light" style="position:relative">overshoot</span></div></div>${readout('position')}`,
    render(t, c) {
      const from = -110;
      const x = lerp(from, 0, c.p.go);
      const xg = lerp(from, 0, ease('expo.out')(c.r.go));
      c.set(c.$.pill, { xw: x * 0.9 });
      c.set(c.$.ghost, { xw: xg * 0.9, o: 0.5 });
      c.set(c.$.tag, { o: x > 0.4 ? 1 : 0 });
      setRO(c, Math.round(100 + x) + '%', (100 + x) / 100);
    },
    prompt: 'Slide a label pill in from the left edge to its resting position over 750ms using a back-out ease so it overshoots its target by about 10% and settles back. Keep the move short and horizontal; the overshoot should feel like a confident snap, not a bounce.',
  });

  /* 12 Follow through */
  demo({
    id: 'follow-through', cat: CAT, name: 'Follow Through', aka: ['Drag', 'Overlapping action (secondary)', 'Settle'],
    tags: ['object'], char: ['Physical', 'Playful', 'Natural'],
    what: 'When the main object stops, loose parts keep moving and settle a moment later — like a hanging tag that swings after the card lands, or text that drags slightly behind its container. It sells weight and momentum.',
    good: ['Hanging tags, ribbons, lanyards', 'Text inside moving cards', 'Characters (hair, clothes)', 'Logo elements settling'],
    avoid: 'Flat corporate UI where nothing should feel loose, or when the swing continues so long it distracts from the message.',
    anatomy: ['Scene time', 'Price card + hanging tag + card text', 'Card translateX → 0; tag rotates; text lags', 'Card 0.9s · tag settles over ~1.6s after', 'expo.out card · damped oscillation for the tag', 'Card stops → tag swings past → settles'],
    tracks: [['card', 'Card slide', 0.3, 0.9, 'expo.out'], ['swing', 'Tag swing (follow-through)', '<0.2', 1.8, 'linear'], ['hold', 'Hold', '>', 0.5, 'linear']],
    html: `<div class="center"><div data-r="card" class="ft-card">
        <div data-r="text" class="col" style="align-items:flex-start;gap:1.6cqmin"><span class="t-eyebrow" style="color:#7a6a58">Linen shirt</span><b class="t-serif" style="font-size:10cqmin">Rp 349.000</b><span class="t-body" style="font-size:3cqmin;color:#5b5348">Natural fibre · 4 colours</span></div>
        <div data-r="tag" class="ft-tag"><i class="ft-string"></i><span>−30%</span></div>
      </div></div>`,
    render(t, c) {
      const x = lerp(90, 0, c.p.card);
      c.set(c.$.card, { xw: x });
      const lag = c.at(c.tl.map.card.start + 0.07, 0.9, 'expo.out');
      c.set(c.$.text, { xw: lerp(90, 0, lag) - x });
      // Lean against the motion while the card decelerates, then a damped swing.
      const tau = t - (c.tl.map.swing.start + 0.15);
      const lean = -c.speed('card') * 4;
      const swing = tau > 0 ? 34 * Math.exp(-2.6 * tau) * Math.sin(8.5 * tau) : 0;
      c.set(c.$.tag, { r: lean + swing });
    },
    prompt: 'Add follow-through to a price card that slides in and stops: attach a tag hanging from a short string at the card’s top edge. While the card decelerates, the tag leans back; when the card stops, the tag swings past vertical by about 30° and settles with a damped oscillation over ~1.5s. Make the text inside the card lag the card by about 70ms so it drags slightly before settling.',
  });

  /* 13 Secondary motion */
  demo({
    id: 'secondary-motion', cat: CAT, name: 'Secondary Motion', aka: ['Supporting motion', 'Reactive elements'],
    tags: ['object'], char: ['Premium', 'Lively', 'Product'],
    what: 'The hero (the can) does the main move; smaller elements react with less amplitude and a slight delay — the ice cubes drift, the bubbles rise, the shadow tightens as the can lifts. Secondary motion adds life without competing.',
    good: ['Product hero shots', 'Floating compositions', 'Making a still product feel alive', 'Background accents around a headline'],
    avoid: 'Secondary elements move as much as the hero, or in random directions — then they are noise, not support.',
    anatomy: ['Scene time + ambient float', 'Can (hero), ice, bubbles, shadow', 'Hero rises; others follow with smaller, delayed moves', 'Hero 1.1s rise then 2.4s float cycle', 'premium rise · sine float', 'Hero first → secondary 0.1–0.3s later'],
    tracks: [['rise', 'Hero rise', 0.2, 1.1, 'premium'], ['sec', 'Secondary react', '<0.15', 1.2, 'premium'], ['float', 'Ambient float', '>-0.4', 2.6, 'linear']],
    html: `<div class="floor-shadow" data-r="shadow" style="left:50%;top:79%;margin-left:-17cqmin"></div>
      ${[[-30, -18, 9, 'ice'], [28, -26, 7, 'ice'], [-24, 20, 6, 'ice'], [32, 14, 8, 'ice'], [-12, -36, 2.2, 'bub'], [14, -40, 1.6, 'bub'], [20, -30, 2.6, 'bub'], [-20, -8, 1.8, 'bub']].map(([x, y, s, k]) =>
        `<i data-r="sec" class="abs sm-${k}" style="left:calc(50% + ${x}cqmin);top:calc(50% + ${y}cqmin);width:${s}cqmin;height:${s}cqmin;margin:-${s / 2}cqmin"></i>`).join('')}
      <div class="center"><div data-r="can">${A.product('can', { style: '--ph:58cqmin' })}</div></div>`,
    cls: 'bg-studio-warm',
    render(t, c) {
      const float = Math.sin((t - 1.1) * 2.4) * (t > 1.1 ? 1.6 : 0) * c.r.float ** 0.3;
      const canY = lerp(30, 0, c.p.rise) + float;
      c.set(c.$.can, { y: canY, r: lerp(-6, 0, c.p.rise) });
      c.set(c.$.shadow, { sx: lerp(0.5, 1, c.p.rise) - float * 0.02, o: lerp(0.2, 1, c.p.rise) });
      c.$$.sec.forEach((el, i) => {
        const d = c.at(c.tl.map.sec.start + i * 0.04, 1.2, 'premium');
        const f = Math.sin((t - 1.2) * 2.4 - i * 0.7) * (t > 1.2 ? 2.2 : 0) * c.r.float ** 0.3;
        c.set(el, { y: lerp(18, 0, d) + f, r: lerp(40, 0, d) + f * 6, o: d });
      });
    },
    prompt: 'Create a product hero with secondary motion: the can rises 30% into place over 1.1s with a premium ease-out and a slight rotation correction, then floats gently (±1.5%, ~2.6s cycle). Ice cubes and bubbles around it follow 150–300ms later with smaller, slower moves and gentle rotation, and the floor shadow tightens as the can lifts. Secondary elements must always move less than the hero.',
  });

  /* 14 Squash & stretch */
  const BOUNCES = (() => {
    const hs = [1, 0.55, 0.3, 0.14, 0.05];
    const T0 = 0.78;
    const segs = [];
    let t = 0;
    hs.forEach((h, i) => {
      const T = T0 * Math.sqrt(h);
      if (i === 0) { segs.push({ t0: t, T: T / 2, h, half: true }); t += T / 2; }
      else { segs.push({ t0: t, T, h }); t += T; }
    });
    return { segs, end: t };
  })();
  function bounceAt(tt) {
    for (const s of BOUNCES.segs) {
      if (tt < s.t0 + s.T) {
        let u = (tt - s.t0) / s.T;
        if (s.half) u = 0.5 + u / 2;
        const y = s.h * (1 - Math.pow(2 * u - 1, 2));
        const vel = Math.abs(2 * u - 1) * Math.sqrt(s.h);
        const impact = Math.max(0, 1 - Math.min(u, 1 - u) * 14) * Math.sqrt(s.h);
        return { y, vel, impact };
      }
    }
    return { y: 0, vel: 0, impact: 0 };
  }
  const ballHalf = (k, label) => `<div><span class="split-label ${k === 'r' ? 'split-label--bad' : 'split-label--good'}" style="left:3cqmin">${label}</span>
    <div class="ss-floor"></div><div class="ss-shadow" data-r="${k}sh"></div><div class="ss-ball-wrap"><div data-r="${k}" class="ss-ball"></div></div></div>`;
  demo({
    id: 'squash-stretch', cat: CAT, name: 'Squash & Stretch', aka: ['Deformation', 'Elasticity'],
    tags: ['object'], char: ['Playful', 'Physical', 'Energetic'],
    what: 'The shape deforms with speed and impact: it stretches along its path when fast and squashes when it hits something, keeping roughly the same volume. Even small amounts make graphics feel soft and alive. Compare the rigid ball with the deforming one.',
    good: ['Icon and button bounces', 'Mascots and playful brands', 'Logo drops', 'Liquid / jelly product graphics'],
    avoid: 'Text, logos with strict guidelines, or premium/serious brands. Never deform typography for legibility-critical messages.',
    anatomy: ['Scene time', 'Ball (rigid vs elastic)', 'scaleY/scaleX trade-off (volume kept) + shadow', '≈2.0s for 4 decaying bounces', 'Gravity parabola per bounce', 'Fall → impact squash → rebound stretch → settle'],
    tracks: [['drop', 'Bounces (gravity)', 0.3, BOUNCES.end, 'linear'], ['hold', 'Rest', '>', 0.7, 'linear']],
    html: `<div class="split">${ballHalf('r', 'Rigid')}${ballHalf('e', 'Squash & stretch')}</div>`,
    render(t, c) {
      const tt = t - c.tl.map.drop.start;
      const b = tt < 0 ? { y: 1, vel: 0, impact: 0 } : bounceAt(tt);
      const H = 60;
      ['r', 'e'].forEach((k) => {
        const elastic = k === 'e';
        const st = elastic ? Math.min(0.32, b.vel * 0.3) : 0;
        const sq = elastic ? b.impact * 0.42 : 0;
        const sy = 1 + st - sq, sx = 1 / Math.sqrt(sy);
        c.set(c.$[k], { yh: -b.y * H * 0.62, sx, sy: sy });
        c.set(c.$[k + 'sh'], { s: lerp(1, 0.4, b.y), o: lerp(0.9, 0.25, b.y) });
      });
    },
    prompt: 'Create a bouncing ball with squash and stretch: drop it under gravity with four bounces of decreasing height (each bounce ~55% of the previous). Stretch it vertically up to 30% when moving fastest, squash it about 40% on each impact for a few frames, and keep its volume roughly constant (scaleX ≈ 1/√scaleY). Scale the floor shadow with height. Origin at the bottom of the ball.',
  });

  /* 15 Arc motion */
  const P0 = [16, 80], P2 = [80, 24], P1 = [14, 18];
  const quad = (a, b, cc, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * cc;
  demo({
    id: 'arc-motion', cat: CAT, name: 'Arc Motion', aka: ['Arcs', 'Curved path', 'Motion path'],
    tags: ['object'], char: ['Natural', 'Elegant', 'Physical'],
    what: 'Living things and thrown objects move along curves, not straight lines. Both dots travel from the same start to the same end in the same time — the arc feels organic, the straight line feels mechanical.',
    good: ['Objects flying into a frame', 'Icons travelling to a cart / button', 'Camera moves and transitions', 'Anything that should feel organic'],
    avoid: 'Precise technical / UI motion where a straight, predictable path is clearer (e.g. a cursor moving to a button in a tutorial).',
    anatomy: ['Scene time', 'Two dots, same start and end', 'Straight line vs quadratic Bézier path', '1.4s each', 'smooth (inOut) on both', 'Simultaneous comparison'],
    tracks: [['go', 'Travel (both)', 0.4, 1.4, 'smooth'], ['hold', 'Hold', '>', 0.9, 'linear']],
    html: `<svg class="fill" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M${P0} L${P2}" class="arc-guide" vector-effect="non-scaling-stroke"/>
        <path d="M${P0} Q${P1} ${P2}" class="arc-guide arc-guide--b" vector-effect="non-scaling-stroke"/></svg>
      <span class="lane-label" style="left:46%;top:58%">straight line</span><span class="lane-label" style="left:6%;top:12%;color:#ef4b36;opacity:1">arc</span>
      <div data-r="lin" class="arc-dot"></div><div data-r="arc" class="arc-dot arc-dot--b"></div>
      <i class="arc-end" style="left:${P2[0]}%;top:${P2[1]}%"></i><i class="arc-end" style="left:${P0[0]}%;top:${P0[1]}%"></i>`,
    render(t, c) {
      const u = c.p.go;
      c.set(c.$.lin, { xw: lerp(P0[0], P2[0], u), yh: lerp(P0[1], P2[1], u) });
      c.set(c.$.arc, { xw: quad(P0[0], P1[0], P2[0], u), yh: quad(P0[1], P1[1], P2[1], u) });
    },
    prompt: 'Move an object from the bottom-left to the top-right of the frame along a curved arc (quadratic Bézier with the control point near the top-left) instead of a straight line, over 1.4s with a smooth ease-in-out. Optionally rotate the object to follow the path tangent. The arc should feel like a natural throw.',
  });
})();
