/* 10 — Logo & Brand Motion
   Placeholder brand “AKSA”: mark = sun (circle) + peak (chevron) + horizon (bar). */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, rng, hash, A } = window.VML;
  const CAT = 'brand';
  const B = ['brand'];
  const LOGO = (cls = '', sub = 'studio') => A.logo({ cls, sub });
  const parts = (c) => [c.$['m-sun'], c.$['m-peak'], c.$['m-bar']];

  /* 01 Fade & scale */
  demo({
    id: 'logo-fade-scale', cat: CAT, name: 'Logo Fade & Scale', aka: ['Logo fade in', 'Logo scale in', 'Simple logo reveal'],
    tags: B, char: ['Premium', 'Corporate', 'Safe'], covers: 2,
    variants: [['fade', 'Fade'], ['scale', 'Scale']],
    what: 'The two most basic logo entrances. A fade (with a hint of blur) is the quietest and safest — nothing about the logo is distorted. A scale-in from 0.85 adds a little presence without becoming playful.',
    good: ['Corporate and financial brands', 'Start and end of any video', 'Brands with strict logo guidelines'],
    avoid: 'Scaling from 0 (feels cheap) or adding bounce to a serious brand.',
    anatomy: ['Scene time', 'Full logo', 'Fade: opacity + blur · Scale: scale 0.85 → 1 + opacity', '1s', 'sine.out / premium', 'Logo → tagline 0.3s later'],
    tracks: (v) => [['logo', v === 'fade' ? 'Logo fade' : 'Logo scale', 0.3, 1, v === 'fade' ? 'sine.out' : 'premium'], ['tag', 'Tagline', '<0.45', 0.7, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="stackc" style="gap:5cqmin"><div data-r="lw">${LOGO()}</div><span data-r="tag" class="t-eyebrow">Design that moves</span></div>`,
    render(t, c) {
      const p = c.p.logo;
      c.set(c.$.lw, c.v === 'fade' ? { o: p, blur: 1.2 * (1 - p) } : { o: clamp(c.r.logo * 2.5), s: lerp(0.85, 1, p) });
      c.set(c.$.tag, { o: c.p.tag, y: 2 * (1 - c.p.tag) });
    },
    prompt: (v) => v === 'fade'
      ? 'Reveal the logo with a calm fade: opacity 0 → 1 with a slight blur clearing (≈4px → 0) over 1s using a sine ease-out, then fade the tagline in 450ms later.'
      : 'Reveal the logo with a restrained scale-in: from scale 0.85 to 1 over 1s with a premium ease-out (cubic-bezier .22,1,.36,1), fading in during the first 40%. No bounce. Bring the tagline in 450ms later.',
  });

  /* 02 Logo draw */
  demo({
    id: 'logo-draw', cat: CAT, name: 'Logo Draw', aka: ['Stroke reveal', 'Line logo animation', 'Self-drawing logo'],
    tags: B, char: ['Elegant', 'Craft', 'Premium'],
    what: 'The mark draws itself stroke by stroke — horizon, peak, then the sun — and the wordmark fades in as the last stroke completes. Drawing shows craft and intention; it works best for line-based marks.',
    good: ['Studios, architecture, craft brands', 'Logo stings at the start of a film', 'Line-art and monoline marks'],
    avoid: 'Filled, complex logos — trace them as centre-line strokes or use a mask reveal instead.',
    anatomy: ['Scene time', 'Three mark strokes + wordmark', 'stroke-dashoffset 1 → 0 per stroke', 'Bar 0.5s · peak 0.9s · sun 0.7s (overlapping) · word 0.6s', 'inOut / out', 'Horizon → peak → sun → wordmark'],
    tracks: [['bar', 'Horizon', 0.3, 0.5, 'inOut'], ['peak', 'Peak', '<0.2', 0.9, 'inOut'], ['sun', 'Sun', '<0.55', 0.7, 'inOut'], ['word', 'Wordmark', '-=0.3', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="center">${LOGO('logo--ink')}</div>`,
    render(t, c) {
      c.set(c.$['m-bar'], { dash: 1 - c.p.bar });
      c.set(c.$['m-peak'], { dash: 1 - c.p.peak });
      c.set(c.$['m-sun'], { dash: 1 - c.p.sun });
      c.set(c.$['l-word'], { o: c.p.word, x: -2 * (1 - c.p.word) });
      c.set(c.$['l-sub'], { o: c.p.word * 0.6 });
    },
    prompt: 'Make the logo mark draw itself: give each stroke pathLength="1" and stroke-dasharray 1, then animate stroke-dashoffset from 1 to 0 — the horizon bar first (500ms), the peak 200ms later (900ms), the sun circle last (700ms), all with a cubic in-out ease. Fade and slide the wordmark in as the sun completes.',
  });

  /* 03 Mask reveal */
  demo({
    id: 'logo-mask', cat: CAT, name: 'Logo Mask Reveal', aka: ['Wipe-on logo', 'Clip reveal', 'Logo slide-out'],
    tags: B, char: ['Clean', 'Editorial', 'Modern'],
    what: 'The mark is revealed through an expanding circle, then the wordmark slides out from behind the mark, as if it was hidden inside it. Nothing scales or distorts — the logo is respected, only its visibility is animated.',
    good: ['Modern tech and design brands', 'Logo reveals that must keep exact proportions', 'Short intros (≤ 2s)'],
    avoid: 'Masks that cut through letters for too long — keep the reveal quick.',
    anatomy: ['Scene time', 'Mark (circle clip) + wordmark (clip from left)', 'clip-path circle 0 → 75% · word translateX −40% → 0 inside an overflow mask', '0.7s mark · 0.7s word', 'expo.inOut / expo.out', 'Mark → word slides out of it'],
    tracks: [['mark', 'Mark circle reveal', 0.3, 0.7, 'expo.inOut'], ['word', 'Word slides out', '-=0.2', 0.7, 'expo.out'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-red',
    html: `<div class="center">${LOGO('logo--masked')}</div>`,
    render(t, c) {
      c.set(c.$.mark, { clip: `circle(${lerp(0, 75, c.p.mark)}% at 50% 50%)` });
      c.set(c.$['l-word'], { xp: -110 * (1 - c.p.word) });
      c.set(c.$['l-sub'], { xp: -110 * (1 - c.p.word), o: c.p.word });
    },
    prompt: 'Reveal the logo with masks: open the mark through a growing circular clip-path (0 → 75%, 700ms, expo in-out); 200ms before it finishes, slide the wordmark out from behind the mark — the type sits in an overflow-hidden container and translates from −110% to 0 (700ms, expo-out). The logo never scales.',
  });

  /* 04 Logo morph */
  demo({
    id: 'logo-morph', cat: CAT, name: 'Logo Morph', aka: ['Shape-to-logo', 'Morphing mark', 'Icon morph'],
    tags: B, char: ['Clever', 'Fluid', 'Premium'],
    what: 'A simple dot grows into a large disc, then reshapes into the mark: the disc shrinks into the sun while the horizon line stretches out and rises into the peak. One continuous shape tells the story of the brand’s geometry.',
    good: ['Brands with geometric marks', 'Transitions from a UI element (a dot, a button) into the logo', 'Intros that should feel smart rather than flashy'],
    avoid: 'Morphing between unrelated shapes — it reads as random.',
    anatomy: ['Scene time', 'Sun circle, peak polyline, bar', 'Circle radius/centre; peak vertex y; bar width', 'Grow 0.5s · morph 1.1s', 'back.out / expo.inOut', 'Dot → disc → split into mark'],
    tracks: [['grow', 'Dot → disc', 0.3, 0.5, 'back.out'], ['morph', 'Disc → mark', '>', 1.1, 'expo.inOut'], ['word', 'Wordmark', '-=0.3', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="center">${LOGO('logo--fill')}</div>`,
    render(t, c) {
      const g = c.p.grow, m = c.p.morph;
      const sun = c.$['m-sun'];
      sun.setAttribute('r', lerp(lerp(2, 34, g), 12, m).toFixed(2));
      sun.setAttribute('cy', lerp(52, 35, m).toFixed(2));
      sun.style.fill = m < 0.5 ? '#ef4b36' : 'none';
      sun.style.fillOpacity = (1 - m * 2).toFixed(2);
      const py = lerp(84, 26, m);
      c.$['m-peak'].setAttribute('d', `M${lerp(50, 16, m)} 84 L50 ${py} L${lerp(50, 84, m)} 84`);
      c.set(c.$['m-peak'], { o: m > 0 ? 1 : 0 });
      c.$['m-bar'].setAttribute('d', `M${lerp(50, 31, m)} 68 H${lerp(50, 69, m)}`);
      c.set(c.$['m-bar'], { o: m > 0.2 ? 1 : 0 });
      c.set(c.$['l-word'], { o: c.p.word, x: -2 * (1 - c.p.word) });
      c.set(c.$['l-sub'], { o: c.p.word * 0.6 });
    },
    prompt: 'Morph a simple shape into the logo mark: a small dot pops into a large filled disc (back-out, 500ms); then over 1.1s (expo in-out) the disc shrinks into the outlined sun at its final position while the horizon bar stretches out from the centre and the peak rises from a flat line into its chevron. Fade the wordmark in as the morph settles.',
  });

  /* 05 Logo assemble */
  demo({
    id: 'logo-assemble', cat: CAT, name: 'Logo Assemble', aka: ['Pieces come together', 'Logo build', 'Construct logo'],
    tags: B, char: ['Playful', 'Energetic', 'Clever'],
    what: 'The logo’s pieces fly in from different directions with rotation and snap together with a slight overshoot, then the wordmark follows. It visualises “coming together” — collaboration, assembly, building.',
    good: ['Agencies, builders, platforms', 'Event openers', 'Brands whose story is about connecting parts'],
    avoid: 'Very long flights — pieces should arrive within ~1s or the logo is unreadable for too long.',
    anatomy: ['Scene time', 'Sun, peak, bar (+ wordmark)', 'translate from off-centre + rotate → 0, back.out landing', '0.8s each · 120ms stagger', 'back.out', 'Peak → bar → sun (last piece completes it)'],
    tracks: [['pc', 'Pieces ×3 (120ms)', 0.3, 0.8, 'back.out', { n: 3, each: 0.12 }], ['snap', 'Snap', '>', 0, 'linear', 'beat'], ['word', 'Wordmark', '<0.05', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-blue',
    html: `<div class="center">${LOGO()}</div>`,
    render(t, c) {
      const from = [[0, -60, -200], [-70, 30, 90], [70, 40, -120]];
      const order = [c.$['m-peak'], c.$['m-bar'], c.$['m-sun']];
      order.forEach((el, i) => {
        const p = c.st('pc', i), [x, y, r] = from[i];
        c.set(el, { x: x * (1 - p), y: y * (1 - p), r: r * (1 - p), o: clamp(p * 4) });
      });
      const snapT = c.tl.map.snap.start;
      c.set(c.$.mark, { s: t > snapT && t < snapT + 0.2 ? 1 + 0.06 * (1 - (t - snapT) / 0.2) : 1 });
      c.set(c.$['l-word'], { o: c.p.word, x: -3 * (1 - c.p.word) });
      c.set(c.$['l-sub'], { o: c.p.word * 0.6 });
    },
    prompt: 'Assemble the logo from its parts: the peak, horizon bar and sun each fly in from a different direction with 90–200° of rotation, landing with a back-out ease over 800ms and a 120ms stagger. On the final snap, pulse the whole mark to 1.06 and back, then bring in the wordmark.',
  });

  /* 06 Logo rotation */
  demo({
    id: 'logo-rotation', cat: CAT, name: 'Logo Rotation', aka: ['Coin flip', '3D logo spin', 'Y-axis logo'],
    tags: B, char: ['Dynamic', 'Premium', 'Tech'],
    what: 'The mark spins around its vertical axis in perspective and decelerates into a front-facing rest, like a coin settling. The spin draws attention; the deceleration lands it with weight.',
    good: ['Coins, badges and emblem-style logos', 'Gaming, fintech and rewards', 'Stingers between segments'],
    avoid: 'Logos with text inside the mark — mirrored text mid-spin looks wrong.',
    anatomy: ['Scene time', 'Mark disc (front/back)', 'rotateY 720° → 0 (decelerating) in perspective', '1.6s', 'expo.out', 'Fast spin → settle → wordmark'],
    tracks: [['spin', 'Spin 720° → rest', 0.3, 1.6, 'expo.out'], ['word', 'Wordmark', '-=0.5', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-studio',
    html: `<div class="stackc pu-3d" style="gap:5cqmin"><div data-r="coin" class="lg-coin">${A.logoMark({ sw: 8 })}</div><div data-r="wd" class="logo__type" style="text-align:center"><b>AKSA</b><span>studio</span></div></div>`,
    render(t, c) {
      c.set(c.$.coin, { ry: 720 * (1 - c.p.spin), s: lerp(0.7, 1, c.p.spin) });
      c.set(c.$.wd, { o: c.p.word, y: 3 * (1 - c.p.word) });
    },
    prompt: 'Spin the logo emblem like a coin: rotate it around the Y axis from 720° to 0° in CSS 3D perspective over 1.6s with an expo-out ease (fast spin that settles), scaling from 0.7 to 1. Fade the wordmark in below as the spin settles.',
  });

  /* 07 Logo stamp */
  demo({
    id: 'logo-stamp', cat: CAT, name: 'Logo Stamp', aka: ['Stamp in', 'Slam logo', 'Impact logo'],
    tags: B.concat('social'), char: ['Energetic', 'Bold', 'Streetwear'],
    what: 'The logo slams down from above the camera like a rubber stamp: fast fall, a frame shake on impact, an ink ring, then a tiny settle. Pure energy — the opposite of a fade.',
    good: ['Sports, streetwear and gaming brands', 'Beat-synced logo endings', '“Approved / certified” moments'],
    avoid: 'Premium or calm brands — the stamp is loud by design.',
    anatomy: ['Beat (impact frame)', 'Logo, ink ring, frame', 'scale 3 → 1 + rotate −12° → −4°; shake; ring scale + fade', 'Fall 0.28s · shake 0.3s · ring 0.5s', 'expo.in fall · decay shake', 'Fall → impact → shake + ring → settle'],
    tracks: [['fall', 'Fall', 0.4, 0.28, 'expo.in'], ['hit', 'Impact', '>', 0, 'linear', 'beat'], ['ring', 'Ink ring', '<', 0.5, 'expo.out', 'fx'], ['shake', 'Shake', '<', 0.3, 'linear', 'camera'], ['hold', 'Hold', '>', 1.4, 'linear']],
    cls: 'bg-yellow',
    html: `<div data-r="frame" class="fill"><div class="center"><i data-r="ring" class="lg-ink"></i></div><div class="center"><div data-r="lw" class="lg-stamp">${LOGO('logo--ink')}</div></div></div>`,
    render(t, c) {
      c.set(c.$.lw, { s: lerp(3, 1, c.p.fall), r: lerp(-12, -4, c.p.fall), o: c.r.fall > 0 ? 1 : 0 });
      c.set(c.$.ring, { s: lerp(0.6, 1.5, c.p.ring), o: c.r.ring > 0 && c.r.ring < 1 ? 0.9 * (1 - c.p.ring) : 0 });
      const st = t - c.tl.map.shake.start, amp = st > 0 ? Math.exp(-st * 11) * 2.4 : 0;
      c.set(c.$.frame, { x: Math.sin(st * 80) * amp, y: Math.cos(st * 63) * amp });
    },
    prompt: 'Stamp the logo onto the frame: it falls from scale 3 to 1 in 280ms with an expo-in ease while rotating from −12° to a slightly tilted −4°. On the impact frame, shake the whole frame with an exponentially decaying offset (~300ms) and burst a thick ink ring outward that fades. Sync the impact with the beat.',
  });

  /* 08 Logo glow */
  demo({
    id: 'logo-glow', cat: CAT, name: 'Logo Glow', aka: ['Neon logo', 'Light-up logo', 'Glow pulse'],
    tags: B, char: ['Nightlife', 'Tech', 'Atmospheric'],
    what: 'The logo lights up like a neon sign: a few uneven flickers, then a steady glow that slowly breathes. Glow = drop-shadow layers in the brand colour; flicker = stepped opacity.',
    good: ['Nightlife, music and gaming', 'Dark-mode tech brands', 'Event and festival intros'],
    avoid: 'Light backgrounds (glow disappears) and fast strobing (photosensitivity).',
    anatomy: ['Scene time + loop', 'Logo with layered drop-shadows', 'Stepped flicker → glow radius breathing', 'Flicker 0.6s · breathing 2s cycle', 'Stepped, then sine', 'Off → flicker → on → breathe'],
    tracks: [['flick', 'Neon flicker', 0.3, 0.6, 'linear', 'fx'], ['on', 'Glow on', '>', 0.5, 'out', 'fx'], ['breathe', 'Breathing glow', '>', 2, 'linear', 'fx']],
    cls: 'bg-night',
    html: `<div class="center"><div data-r="lw" class="lg-neon">${LOGO()}</div></div>`,
    render(t, c) {
      let o = 0.12;
      if (c.r.flick > 0) o = [1, 0.2, 1, 1, 0.3, 1, 0.6, 1][Math.floor(c.r.flick * 7.99)] || 1;
      const br = c.r.breathe > 0 ? 0.5 + 0.5 * Math.sin((t - c.tl.map.breathe.start) * Math.PI) : 0;
      const g = c.p.on * (0.75 + 0.25 * br);
      c.set(c.$.lw, { o, css: { filter: `drop-shadow(0 0 ${(g * 1.4).toFixed(2)}cqmin #ff4a7a) drop-shadow(0 0 ${(g * 4.5).toFixed(2)}cqmin rgba(255,74,122,.6))` } });
    },
    prompt: 'Light the logo up like neon: start dim, flicker on with an irregular stepped opacity pattern over 600ms, then switch on a layered glow (two drop-shadows in the brand colour, small and large radius) that slowly breathes ±25% on a 2s sine. Keep flicker short and never strobe continuously.',
  });

  /* 09 Logo shimmer */
  demo({
    id: 'logo-shimmer', cat: CAT, name: 'Logo Shimmer', aka: ['Shine sweep', 'Gloss sweep', 'Metallic shine'],
    tags: B, char: ['Premium', 'Luxury', 'Polished'],
    what: 'A band of light sweeps diagonally across the logo once, like light catching a metal sign. A single pass says “premium”; a repeating shimmer says “loading”.',
    good: ['Luxury, jewellery and automotive', 'Ending a premium ad', 'Gold / silver brand treatments'],
    avoid: 'Repeating it constantly — one sweep per appearance.',
    anatomy: ['Scene time', 'Logo with a masked highlight band', 'Highlight translateX across, clipped to the logo', '1.2s', 'smooth', 'Logo in → single sweep → hold'],
    tracks: [['in', 'Logo in', 0.2, 0.7, 'premium'], ['sweep', 'Shine sweep', '+=0.2', 1.2, 'smooth', 'fx'], ['hold', 'Hold', '>', 0.8, 'linear']],
    cls: 'bg-coal',
    html: `<div class="center"><div data-r="lw" class="lg-gold">${LOGO()}<div data-r="shine" class="lg-shine-copy">${LOGO()}</div></div></div>`,
    render(t, c) {
      c.set(c.$.lw, { o: c.p.in, s: lerp(0.95, 1, c.p.in) });
      // A bright copy of the logo, visible only inside a moving gradient band (so the shine stays on the letterforms).
      const x = lerp(-30, 130, c.p.sweep);
      const m = `linear-gradient(105deg, transparent ${x - 14}%, #000 ${x}%, transparent ${x + 14}%)`;
      c.set(c.$.shine, { css: { webkitMaskImage: m, maskImage: m }, o: c.r.sweep > 0 && c.r.sweep < 1 ? 1 : 0 });
    },
    prompt: 'Give the logo a single premium shimmer: after it fades in, sweep a soft diagonal band of light across it once over 1.2s with a smooth in-out ease. Keep the shine on the letterforms: layer a bright copy of the logo on top and reveal it only through a moving linear-gradient mask band. Do not loop it.',
  });

  /* 10 Particle assemble */
  demo({
    id: 'logo-particles', cat: CAT, name: 'Logo Particle Assemble', aka: ['Particles to logo', 'Dust assemble', 'Swarm logo'],
    tags: B.concat('advanced'), char: ['Tech', 'Magical', 'Experimental'],
    what: 'Hundreds of particles start scattered and fly into position to form the mark, each with its own delay, then the solid logo crossfades in. Target positions are sampled from the mark’s pixels on a hidden canvas.',
    good: ['Tech, AI and data brands', 'Launch intros', '“Coming together” metaphors'],
    avoid: 'Very detailed logos — particles cannot represent small text.',
    anatomy: ['Scene time', '~500 particles (Canvas 2D) + final logo', 'Each particle lerps from random start to a sampled target (curved path)', '1.6s with per-particle delay (0–0.5s)', 'expo.out', 'Swarm → form mark → solid logo crossfade'],
    tracks: [['form', 'Particles form', 0.2, 2.1, 'linear', 'fx'], ['solid', 'Solid logo', '-=0.3', 0.5, 'smooth'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    note: 'Simplified: particles are sampled from the mark drawn on a hidden canvas.',
    html: `<canvas data-r="cv" class="canvas-fill"></canvas><div class="center"><div data-r="lw" style="opacity:0">${A.logoMark({ sw: 7 })}</div></div>`,
    init(c) {
      c.data.cv = c.canvas(c.$.cv);
      const off = document.createElement('canvas');
      off.width = off.height = 120;
      const g = off.getContext('2d');
      g.strokeStyle = '#fff'; g.lineWidth = 8; g.lineCap = 'round'; g.lineJoin = 'round';
      g.scale(1.2, 1.2);
      g.beginPath(); g.arc(50, 35, 12, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(16, 84); g.lineTo(50, 26); g.lineTo(84, 84); g.stroke();
      g.beginPath(); g.moveTo(31, 68); g.lineTo(69, 68); g.stroke();
      const data = g.getImageData(0, 0, 120, 120).data;
      const pts = [];
      for (let y = 0; y < 120; y += 3) for (let x = 0; x < 120; x += 3) if (data[(y * 120 + x) * 4 + 3] > 128) pts.push([x / 120 - 0.5, y / 120 - 0.5]);
      const r = rng(9);
      c.data.pts = pts.map(([x, y]) => ({ x, y, sx: lerp(-0.9, 0.9, r()), sy: lerp(-0.9, 0.9, r()), d: r() * 0.5, curve: lerp(-0.3, 0.3, r()) }));
    },
    render(t, c) {
      const { g, w, h } = c.data.cv;
      g.clearRect(0, 0, w, h);
      const S = Math.min(w, h) * 0.34;
      const tt = t - c.tl.map.form.start;
      g.fillStyle = '#ef4b36';
      const fade = 1 - c.p.solid;
      if (fade > 0.01) {
        g.globalAlpha = fade;
        c.data.pts.forEach((p) => {
          const k = ease('expo.out')(clamp((tt - p.d) / 1.6));
          const bend = Math.sin(k * Math.PI) * p.curve;
          const x = w / 2 + lerp(p.sx * w * 0.6, p.x * S * 2.2, k) + bend * S;
          const y = h / 2 + lerp(p.sy * h * 0.6, p.y * S * 2.2, k) - bend * S * 0.5;
          const sz = lerp(1.2, 2.2, k);
          g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        });
        g.globalAlpha = 1;
      }
      c.set(c.$.lw, { o: c.p.solid });
    },
    prompt: 'Assemble the logo mark from particles: draw the mark on a hidden canvas, sample its opaque pixels on a grid to get ~500 target points, then animate particles from seeded random positions to their targets along slightly curved paths (expo-out, 1.6s each, random 0–0.5s delays). When formed, crossfade to the crisp vector logo. Compute positions from time so it scrubs.',
  });

  /* 11 Reveal through shape */
  demo({
    id: 'logo-shape-reveal', cat: CAT, name: 'Logo Reveal Through Shape', aka: ['Shape wipe logo', 'Colour block reveal', 'Window reveal'],
    tags: B, char: ['Graphic', 'Bold', 'Modern'],
    what: 'A brand-coloured shape grows from the centre and the logo appears only inside it — as if the shape is a window onto the brand. Then the shape keeps expanding to fill the frame and becomes the background.',
    good: ['Brands with a signature shape or colour', 'Intros that set the brand colour for the rest of the video', 'Social templates'],
    avoid: 'Shapes that cut through the logo at the end — the final frame must show the full logo cleanly.',
    anatomy: ['Scene time', 'Shape (clip window) containing the logo', 'Window clip circle 0 → 30% → 150%; logo scale 1.1 → 1', '0.6s open · hold · 0.7s fill', 'back.out / expo.inOut', 'Window opens → logo inside → window fills frame'],
    tracks: [['open', 'Window opens', 0.3, 0.6, 'back.out', 'fx'], ['logo', 'Logo settles', '<0.1', 0.9, 'premium'], ['fill', 'Window fills frame', '+=0.4', 0.7, 'expo.inOut', 'fx'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: `<div data-r="win" class="fill bg-red"><div class="center"><div data-r="lw">${LOGO()}</div></div></div>`,
    render(t, c) {
      const r = lerp(0, 34, c.p.open) + c.p.fill * 120;
      c.set(c.$.win, { clip: `circle(${r}% at 50% 50%)` });
      c.set(c.$.lw, { s: lerp(1.15, 1, c.p.logo) });
    },
    prompt: 'Reveal the logo through a shape: a brand-coloured circle grows from the centre to ~34% radius (back-out, 600ms) acting as a window — the logo is visible only inside it and settles from scale 1.15 to 1. After a short hold, expand the window until it fills the whole frame (expo in-out, 700ms) so the brand colour becomes the background.',
  });

  /* 12 Brand pattern */
  demo({
    id: 'brand-pattern', cat: CAT, name: 'Brand Pattern Motion', aka: ['Pattern loop', 'Repeating mark', 'Brand texture'],
    tags: B, char: ['Graphic', 'Loop', 'Brand'],
    what: 'A grid of the brand mark scrolls diagonally in a seamless loop while alternate rows rotate slightly — a living brand texture for backgrounds, transitions and end cards. The logo itself sits calmly on top.',
    good: ['Backgrounds for brand videos and stories', 'Transitions between segments', 'Merch and event screens'],
    avoid: 'High contrast patterns behind text — keep the pattern low-contrast.',
    anatomy: ['Continuous loop', 'Tiled marks + centred logo card', 'Pattern translate by exactly one tile per loop; row rotation', '6s loop', 'linear', 'Seamless'],
    tracks: [['loop', 'Pattern scroll (seamless)', 0, 6, 'linear', 'bg'], ['card', 'Logo card', 0.2, 0.7, 'back.soft']],
    dur: 6, poster: 1.5,
    cls: 'bg-red',
    html: `<div class="bp-wrap"><div data-r="grid" class="bp-grid">${Array.from({ length: 128 }, (_, i) => `<i data-r="tile" class="bp-tile">${A.logoMark({ sw: 8 })}</i>`).join('')}</div></div>
      <div class="center"><div data-r="card" class="bp-card">${LOGO('logo--ink')}</div></div>`,
    render(t, c) {
      const u = c.r.loop;
      c.set(c.$.grid, { xp: (-u * 100) / 8, yp: (-u * 100) / 16 });
      c.$$.tile.forEach((el, i) => c.set(el, { r: Math.floor(i / 8) % 2 ? u * 90 : -u * 90 }));
      c.set(c.$.card, { s: lerp(0.8, 1, c.p.card), o: clamp(c.r.card * 3) });
    },
    prompt: 'Create a brand pattern loop: tile the brand mark in a grid and translate the grid diagonally by exactly one tile per 6s loop (linear) so it repeats seamlessly, rotating alternate rows ±90° per loop. Keep the pattern low-contrast and place the logo on a calm card in the centre.',
  });

  /* 13 Brand colour wipe */
  const BC = ['#f2c14e', '#3e63dd', '#13392d', '#ef4b36'];
  demo({
    id: 'brand-color-wipe', cat: CAT, name: 'Brand Color Wipe', aka: ['Colour panels', 'Palette wipe', 'Stacked wipes'],
    tags: B.concat('transition'), char: ['Graphic', 'Energetic', 'Brand'],
    what: 'Panels in each brand colour wipe across the frame in quick succession, stacking on top of each other, until the final colour holds the logo. It introduces the whole palette in under a second.',
    good: ['Brand intros and rebrands', 'Transitions in branded series', 'Showing a colour system'],
    avoid: 'Too many colours (> 5) or slow wipes — it becomes a slideshow.',
    anatomy: ['Scene time', 'Four colour panels + logo', 'Each panel translateX −100% → 0 (stacking)', '0.5s each · 0.12s stagger', 'expo.inOut', 'Panels stack → logo on the last colour'],
    tracks: [['w', 'Panels ×4 (120ms)', 0.3, 0.5, 'expo.inOut', { n: 4, each: 0.12 }], ['logo', 'Logo', '>-0.1', 0.6, 'premium'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-ink',
    html: `${BC.map((col) => `<i data-r="pn" class="fill" style="background:${col}"></i>`).join('')}<div class="center"><div data-r="lw">${LOGO()}</div></div>`,
    render(t, c) {
      c.$$.pn.forEach((el, i) => c.set(el, { xp: -100 * (1 - c.st('w', i)) }));
      c.set(c.$.lw, { o: c.p.logo, y: 3 * (1 - c.p.logo) });
    },
    prompt: 'Wipe the brand palette across the frame: four full-frame panels (one per brand colour) slide in from the left one after another (500ms each, expo in-out, 120ms stagger), each landing on top of the previous. Reveal the logo on the final colour.',
  });

  /* 14 Logo outro */
  demo({
    id: 'logo-outro', cat: CAT, name: 'Logo Outro', aka: ['End sting', 'Closing logo', 'Brand end card'],
    tags: B.concat('cta'), char: ['Premium', 'Concise', 'Brand'],
    what: 'A compact 2-second ending: the last scene darkens, the logo resolves in the centre, a tagline and a handle follow, and everything fades to black. Short, consistent outros build brand memory across a series.',
    good: ['End of every video in a series', 'Ads (brand recall)', 'YouTube intros/outros'],
    avoid: 'Long outros on social — viewers swipe away. Keep it 1–2s, or put the CTA before it.',
    anatomy: ['End of video', 'Previous scene, logo, tagline, handle, black', 'Scene darken; logo scale 0.92 → 1; text fade; fade to black', '2.2s total', 'premium / sine.inOut', 'Darken → logo → tagline → handle → black'],
    tracks: [['dark', 'Scene darkens', 0, 0.5, 'smooth', 'fx'], ['logo', 'Logo resolves', 0.25, 0.7, 'premium'], ['tag', 'Tagline', '<0.3', 0.5, 'premium'], ['url', 'Handle', '<0.2', 0.5, 'premium'], ['hold', 'Hold', '>', 0.6, 'linear'], ['black', 'Fade to black', '>', 0.45, 'sine.inOut', 'fx']],
    dur: 2.9,
    html: `${A.photo('city', { cls: 'fill' })}<i data-r="dark" class="fill" style="background:#0e0e10"></i>
      <div class="stackc" style="gap:4cqmin;color:#f1eee8"><div data-r="lw">${LOGO()}</div><span data-r="tag" class="t-serif" style="font-size:6cqmin"><i>Design that moves.</i></span><span data-r="url" class="t-eyebrow">@aksa.studio</span></div>
      <i data-r="black" class="fill" style="background:#000"></i>`,
    render(t, c) {
      c.set(c.$.dark, { o: c.p.dark * 0.9 });
      c.set(c.$.lw, { o: c.p.logo, s: lerp(0.92, 1, c.p.logo) });
      c.set(c.$.tag, { o: c.p.tag });
      c.set(c.$.url, { o: c.p.url * 0.75 });
      c.set(c.$.black, { o: c.p.black });
    },
    prompt: 'Create a 2–3s logo outro: darken the last scene to ~90% over 500ms, resolve the logo in the centre (scale 0.92 → 1, premium ease), then fade in the tagline and the handle 200–300ms apart, hold briefly and fade everything to black over 450ms.',
  });
})();
