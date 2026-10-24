/* 07 — Scene Transitions
   Every transition cuts between the same Scene A (desert) and Scene B
   (city), with the same holds, so the transition is the only variable.
   Timeline: hold A (0.9s) → transition → hold B (1.1s). */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, rng, A } = window.VML;
  const CAT = 'transitions';
  const HOLD_A = 0.9, HOLD_B = 1.1;

  const scene = (k, img, title, sub) => `<div class="trs" data-r="${k}"><div class="photo fill" data-r="${k}img" style="background-image:url(${A.imgPath(img)})"></div>
    <div class="trs__label"><span class="t-eyebrow">${sub}</span><b class="t-sans">${title}</b></div><span class="trs__tag">${k.toUpperCase()}</span></div>`;
  const SCENE_A = scene('a', 'dunes', 'Desert', 'Scene A · Day 01');
  const SCENE_B = scene('b', 'city', 'City', 'Scene B · Day 02');

  /* Each entry → one demo. render(c, p) receives the eased transition progress. */
  const T = [
    {
      id: 'cross-dissolve', name: 'Cross Dissolve', aka: ['Dissolve', 'Crossfade', 'Mix'], d: 0.9, e: 'sine.inOut', char: ['Calm', 'Classic', 'Soft'],
      what: 'Scene B fades in on top of Scene A, so for a moment both are visible. The softest transition: it implies continuity and the passing of time rather than a sharp change.',
      good: ['Passage of time', 'Calm, emotional or documentary edits', 'Moving between related shots'], avoid: 'Fast-paced social edits — a dissolve slows rhythm and can look dated when overused.',
      tf: 'B opacity 0 → 1 over A', render(c, p) { c.set(c.$.b, { o: p }); },
      prompt: 'Cross-dissolve from scene A to scene B: place B above A and fade its opacity from 0 to 1 over 900ms with a sine in-out ease. Keep both scenes still or moving slowly so the overlap stays clean.',
    },
    {
      id: 'fade-dip', name: 'Fade to Black / White', aka: ['Dip to black', 'Dip to white', 'Fade through colour'], d: 1.0, e: 'linear', char: ['Cinematic', 'Chapter break'],
      variants: [['black', 'Fade to black'], ['white', 'Fade to white']],
      what: 'The image fades fully to a solid colour, then the next scene fades up from it. Black reads as an ending, a time skip or a chapter break; white reads as a memory, a flash, a dream or a bright new start.',
      good: ['Chapter breaks and endings (black)', 'Memories, dreams, “new beginning” (white)', 'Resetting pace in a long edit'], avoid: 'Short social videos where 1s of empty frame costs attention.',
      tf: 'Overlay opacity 0 → 1 (A) → 0 (B)', extra: '<i data-r="dip" class="fill"></i>',
      render(c, p, r) {
        c.$.dip.style.background = c.v === 'white' ? '#fff' : '#000';
        c.set(c.$.dip, { o: bump(r) ** 0.8 });
        c.set(c.$.b, { o: r >= 0.5 ? 1 : 0 });
      },
      prompt: (v) => `Fade to ${v}: fade a solid ${v} overlay from 0 to 100% over the first half (≈500ms), swap scene A for scene B while fully covered, then fade the overlay back to 0 over the second half. Hold the solid frame for 1–3 frames if the cut needs more weight.`,
    },
    {
      id: 'directional-wipe', name: 'Directional Wipe', aka: ['Linear wipe', 'Soft wipe', 'Gradient wipe'], d: 0.9, e: 'inOut', char: ['Clean', 'Graphic'],
      what: 'Scene B is revealed by an edge sweeping across the frame. A soft (feathered) edge feels smoother than a hard line; the direction can follow the action (left-to-right = forward in time for most readers).',
      good: ['Sequence and progress (left → right)', 'Before / after reveals', 'Clean corporate edits'], avoid: 'Wiping against the direction of on-screen movement — it feels like going backwards.',
      tf: 'B mask-image: feathered linear gradient moves across', render(c, p) {
        const x = lerp(-20, 120, p);
        const m = `linear-gradient(90deg, #000 ${x - 12}%, transparent ${x + 12}%)`;
        c.set(c.$.b, { css: { webkitMaskImage: m, maskImage: m }, o: 1 });
      },
      prompt: 'Wipe from scene A to scene B with a feathered vertical edge travelling left to right over 900ms (cubic in-out): animate a mask-image linear-gradient on scene B whose opaque/transparent boundary moves across the frame with ~20% feather.',
    },
    {
      id: 'push-transition', name: 'Push Transition', aka: ['Push', 'Slide push'], d: 0.8, e: 'expo.inOut', char: ['Clean', 'Dynamic', 'UI-like'],
      what: 'Scene B pushes Scene A out of frame — both move together, connected like panels on a strip. It reads as “next”, the language of stories, carousels and app screens.',
      good: ['Story-like sequences', 'Carousel and app-style content', 'Lists of products or tips'], avoid: 'Pushing in random directions within one video; keep a consistent direction.',
      tf: 'A translateX 0 → −100%, B 100% → 0 (together)', render(c, p) { c.set(c.$.a, { xp: -100 * p }); c.set(c.$.b, { xp: 100 * (1 - p), o: 1 }); },
      prompt: 'Push from scene A to scene B: move both scenes left together — A from 0 to −100%, B from +100% to 0 — over 800ms with an expo in-out ease, so B physically pushes A out of frame.',
    },
    {
      id: 'slide-transition', name: 'Slide Transition', aka: ['Cover slide', 'Slide over', 'Overlay slide'], d: 0.8, e: 'expo.out', char: ['Layered', 'Premium', 'UI-like'],
      what: 'Scene B slides over a stationary Scene A, which recedes slightly (scales down and darkens). Unlike a push, the scenes are stacked in depth — B lands on top, like a card or sheet.',
      good: ['Layered storytelling (detail over overview)', 'App-like “open a card” moments', 'Premium product sequences'], avoid: 'Very similar scenes — the layering is lost.',
      tf: 'B translateX 100% → 0 over A; A scale 1 → 0.92 + darken', extra: '<i data-r="shade" class="fill" style="background:#000"></i>',
      render(c, p) { c.set(c.$.a, { s: lerp(1, 0.92, p) }); c.set(c.$.shade, { o: 0.5 * p }); c.set(c.$.b, { xp: 100 * (1 - p), o: 1 }); },
      prompt: 'Slide scene B over scene A from the right over 800ms with an expo-out ease, while A stays in place but scales down to 0.92 and darkens by ~50%, so B feels like a card landing on top.',
    },
    {
      id: 'zoom-transition', name: 'Zoom Transition', aka: ['Zoom through', 'Punch zoom transition'], d: 0.6, e: 'linear', char: ['Energetic', 'Social', 'Dynamic'],
      what: 'The camera zooms hard into Scene A, cuts at peak speed while everything is blurred, and Scene B arrives already zoomed in, settling back to normal. The speed hides the cut.',
      good: ['Energetic travel and lifestyle edits', 'Hooks and fast montages', 'Moving “into” a detail'], avoid: 'Calm content — zooms are loud.',
      tf: 'A scale 1 → 2.2 + blur (accelerate) · cut · B scale 1.8 → 1 + blur → 0 (decelerate)',
      render(c, p, r) {
        if (r < 0.5) { const q = ease('expo.in')(r * 2); c.set(c.$.a, { s: lerp(1, 2.2, q), blur: 4 * q }); c.set(c.$.b, { o: 0 }); }
        else { const q = ease('expo.out')((r - 0.5) * 2); c.set(c.$.a, { s: 2.2 }); c.set(c.$.b, { o: 1, s: lerp(1.8, 1, q), blur: 4 * (1 - q) }); }
      },
      prompt: 'Create a zoom transition: zoom scene A from scale 1 to 2.2 with an expo-in ease while adding blur (300ms), hard-cut at peak speed, then bring scene B in from scale 1.8 to 1 with an expo-out ease while the blur clears (300ms). The cut must happen at maximum speed.',
    },
    {
      id: 'spin-transition', name: 'Spin Transition', aka: ['Rotate transition', 'Spin blur cut'], d: 0.7, e: 'linear', char: ['Energetic', 'Playful', 'Social'],
      what: 'Scene A spins and zooms away with blur; Scene B spins in from the opposite rotation and settles. Like the zoom transition, the cut hides in the fastest frame.',
      good: ['Music and dance edits', 'Playful social content', 'Fast product montages'], avoid: 'Serious or premium tone; also avoid overuse — it gets dizzying.',
      tf: 'A rotate 0 → 90° + scale + blur · cut · B rotate −90° → 0',
      render(c, p, r) {
        if (r < 0.5) { const q = ease('cubic.in')(r * 2); c.set(c.$.a, { r: 90 * q, s: lerp(1, 1.8, q), blur: 3 * q }); c.set(c.$.b, { o: 0 }); }
        else { const q = ease('expo.out')((r - 0.5) * 2); c.set(c.$.b, { o: 1, r: -90 * (1 - q), s: lerp(1.8, 1, q), blur: 3 * (1 - q) }); }
      },
      prompt: 'Create a spin transition: rotate scene A from 0° to 90° while scaling to 1.8 and blurring (cubic-in, 350ms), cut at the fastest frame, then rotate scene B from −90° to 0° while scaling from 1.8 to 1 and clearing the blur (expo-out, 350ms).',
    },
    {
      id: 'whip-transition', name: 'Whip Pan Transition', aka: ['Swish transition', 'Whip cut'], d: 0.5, e: 'expo.inOut', char: ['Energetic', 'Travel', 'Social'],
      what: 'Both scenes travel sideways at extreme speed with horizontal motion blur, as if the camera whipped from one place to the other. Blur peaks at the middle, where the cut is invisible.',
      good: ['Location changes in travel content', 'Before → after reveals', 'Fast, energetic edits'], avoid: 'Long whips (> 0.5s) — they lose energy.',
      tf: 'A and B translateX together + horizontal blur ∝ speed', blur: 'h',
      render(c, p) {
        c.set(c.$.a, { xp: -100 * p }); c.set(c.$.b, { xp: 100 * (1 - p), o: 1 });
        A.setDirBlur(c, c.$.both, c.$.mbf, c.speed('tr') * 2.4, 0);
      },
      prompt: 'Create a whip-pan transition: move scene A out to the left and scene B in from the right together over 500ms with an expo in-out ease, applying a horizontal-only motion blur proportional to speed (strongest at the midpoint). No camera shake.',
    },
    {
      id: 'blur-transition', name: 'Blur Transition', aka: ['Defocus transition', 'Soft focus cut'], d: 1.0, e: 'smooth', char: ['Dreamy', 'Soft', 'Cinematic'],
      what: 'Scene A goes out of focus, the scenes crossfade while both are blurred, and Scene B comes back into focus. It mimics a lens refocusing and feels gentle and dreamlike.',
      good: ['Dreamy, beauty and wellness edits', 'Flashbacks and memories', 'Hiding a cut between dissimilar shots'], avoid: 'Text-heavy scenes — blurred text looks like a rendering bug.',
      tf: 'A blur 0 → 10px · crossfade · B blur 10px → 0',
      render(c, p) { const b = bump(p) * 3.5; c.set(c.$.a, { blur: b }); c.set(c.$.b, { o: clamp((p - 0.35) / 0.3), blur: b }); },
      prompt: 'Blur transition: defocus scene A to ~10px blur over the first half, crossfade to scene B in the middle third while both are blurred, then bring B back into focus — 1s total with a smooth in-out ease.',
    },
    {
      id: 'motion-blur-transition', name: 'Motion Blur Transition', aka: ['Vertical whip', 'Speed blur push'], d: 0.55, e: 'expo.inOut', char: ['Energetic', 'Sporty'],
      what: 'A vertical push with strong directional blur and speed lines — the frame is smeared along the direction of travel. Vertical movement feels native on 9:16, matching the swipe-up gesture.',
      good: ['Vertical (9:16) edits', 'Sports and action', 'Swipe-style story transitions'], avoid: 'Combining with other heavy effects — motion blur is costly to render.',
      tf: 'A/B translateY together + vertical blur ∝ speed + speed lines', blur: 'v', extra: '<div data-r="lines" class="speedlines"></div>',
      render(c, p) {
        c.set(c.$.a, { yp: -100 * p }); c.set(c.$.b, { yp: 100 * (1 - p), o: 1 });
        const v = c.speed('tr');
        A.setDirBlur(c, c.$.both, c.$.mbf, 0, v * 2.6);
        c.set(c.$.lines, { o: clamp(v / 3), yp: -p * 40 });
      },
      prompt: 'Create a vertical motion-blur transition: push scene A up and out while scene B comes up from below, over 550ms with an expo in-out ease. Apply a vertical-only blur proportional to speed and briefly overlay thin vertical speed lines at peak velocity.',
    },
    {
      id: 'mask-transition', name: 'Mask Transition', aka: ['Text mask zoom', 'Type mask reveal', 'Matte transition'], d: 1.3, e: 'expo.in', char: ['Bold', 'Editorial', 'Clever'],
      what: 'Scene B first appears only inside the letters of a big word over Scene A; the word then scales up until the letters fill the whole frame and B takes over. The word acts as a matte (mask) between the scenes.',
      good: ['Title → scene transitions', 'Destination or product names', 'Bold brand edits'], avoid: 'Thin typefaces — the mask needs heavy letters.',
      tf: 'Word with B as background-clip:text; scale 1 → 40 (origin inside a letter)', extra: `<div class="center mt-wrap"><b data-r="mword" class="t-display mt-word" style="background-image:url(${A.imgPath('city')})">C<span data-r="mI">I</span>TY</b></div>`,
      render(c, p, r) {
        if (!c.data.mo && c.$.mI) {
          // Scale around the centre of the letter I so the zoom ends inside solid letterform.
          const w = c.$.mword.getBoundingClientRect(), i = c.$.mI.getBoundingClientRect();
          if (w.width) c.data.mo = `${(((i.left + i.width / 2 - w.left) / w.width) * 100).toFixed(1)}% ${(((i.top + i.height * 0.55 - w.top) / w.height) * 100).toFixed(1)}%`;
          if (c.data.mo) c.$.mword.style.transformOrigin = c.data.mo;
        }
        const s = lerp(1, 42, p);
        c.set(c.$.mword, { s, o: r > 0 ? 1 : 0 });
        c.set(c.$.b, { o: r > 0.92 ? 1 : 0 });
      },
      prompt: 'Create a text-mask transition: show a heavy word over scene A whose letters are filled with scene B (background-clip: text). Then scale the word from 1 to ~40 with an expo-in ease over 1.3s, with the transform origin inside a letter’s counter-space, until the letters cover the whole frame — then switch to scene B fully.',
    },
    {
      id: 'shape-transition', name: 'Shape Transition', aka: ['Shape wipe', 'Graphic cover', 'Brand shape transition'], d: 1.0, e: 'linear', char: ['Graphic', 'Brand', 'Playful'],
      what: 'A solid brand-coloured shape grows to cover the frame, the scene changes underneath, and the shape exits to reveal Scene B. The shape can carry brand identity (a logo form, a pill, a blob).',
      good: ['Branded content series', 'Explainers and social templates', 'Hiding a cut between unrelated scenes'], avoid: 'Shapes unrelated to the brand — it looks like a stock template.',
      tf: 'Rounded square scale 0 → covers (rotate) · cut · scale/translate out',
      extra: '<div class="center"><i data-r="shape" class="st-shape"></i></div>',
      render(c, p, r) {
        if (r < 0.5) { const q = ease('expo.inOut')(r * 2); c.set(c.$.shape, { s: lerp(0, 1, q), r: lerp(-45, 0, q) }); c.set(c.$.b, { o: 0 }); }
        else { const q = ease('expo.inOut')((r - 0.5) * 2); c.set(c.$.shape, { s: 1, yh: -140 * q }); c.set(c.$.b, { o: 1, s: lerp(1.1, 1, q) }); }
      },
      prompt: 'Create a shape transition: grow a rounded brand-coloured square from the centre (scale 0 → covering the frame, rotating −45° → 0) over 500ms with an expo in-out ease, swap scene A for B underneath while covered, then slide the shape up and out over 500ms while B settles from scale 1.1 to 1.',
    },
    {
      id: 'circular-reveal', name: 'Circular Reveal', aka: ['Radial reveal', 'Circle wipe', 'Tap-origin reveal'], d: 0.9, e: 'expo.inOut', char: ['Clean', 'UI-like', 'Modern'],
      what: 'Scene B expands as a circle from a specific point — here the bottom-right, where a button would be tapped. Unlike an iris, the circle has an origin that means something (a tap, an icon, an object).',
      good: ['App demos (reveal from a tapped button)', 'Revealing from an object in the shot', 'Theme / mode switches'], avoid: 'Origins in the centre with no reason — then use a simple iris or dissolve.',
      tf: 'B clip-path circle(0 at origin) → circle(150%)', extra: '<i data-r="tap" class="cr-tap"></i>',
      render(c, p, r) {
        c.set(c.$.b, { clip: `circle(${lerp(0, 150, p)}% at 80% 82%)`, o: 1 });
        c.set(c.$.tap, { s: lerp(0.6, 1.4, clamp(r * 3)), o: r > 0 && r < 0.4 ? 1 - r * 2.5 : 0 });
      },
      prompt: 'Reveal scene B with a circle expanding from the point where the user taps (bottom-right): animate clip-path circle() from 0 to 150% radius at that origin over 900ms with an expo in-out ease, and show a small tap ripple at the origin as it starts.',
    },
    {
      id: 'iris-transition', name: 'Iris Transition', aka: ['Iris in / iris out', 'Circle in', 'Vignette cut'], d: 1.2, e: 'linear', char: ['Retro', 'Playful', 'Cinematic'],
      what: 'The classic silent-film move: Scene A closes down to a small circle (iris out) around the subject, black fills the frame, then Scene B opens from a circle (iris in). It frames a subject and adds a vintage or comedic wink.',
      good: ['Retro and comedic edits', 'Ending on a subject (“that’s all, folks”)', 'Playful brand content'], avoid: 'Modern premium tone, unless the retro reference is intentional.',
      tf: 'A clip circle 120% → 0 · black · B clip circle 0 → 120%', extra: '<i class="fill" style="background:#000;z-index:-1"></i>',
      render(c, p, r) {
        const out = ease('cubic.in')(clamp(r / 0.45)), inn = ease('cubic.out')(clamp((r - 0.55) / 0.45));
        c.set(c.$.a, { clip: `circle(${lerp(80, 0, out)}% at 52% 74%)` });
        c.set(c.$.b, { o: r > 0.5 ? 1 : 0, clip: `circle(${lerp(0, 80, inn)}% at 50% 50%)` });
      },
      prompt: 'Create an iris transition: close scene A down to a circle centred on the subject (clip-path circle 80% → 0, cubic-in, ~550ms), hold black for a beat, then open scene B from a central circle (0 → 80%, cubic-out, ~550ms).',
    },
    {
      id: 'light-flash', name: 'Light Flash', aka: ['Flash cut', 'White flash', 'Exposure flash'], d: 0.45, e: 'linear', char: ['Energetic', 'Impact', 'Music'],
      what: 'A burst of overexposed white light hides the cut: Scene A blows out to white in a few frames, and Scene B emerges from the glare. Very fast, very punchy — it works best on a beat.',
      good: ['Beat drops and music edits', 'Photo-camera / flash themes', 'Impact moments'], avoid: 'Repeated flashes in quick succession (photosensitivity) — keep flashes rare and short.',
      tf: 'A brightness ↑ + white overlay peak · cut · B brightness ↓ to normal', extra: '<i data-r="flash" class="flash"></i>',
      render(c, p, r) {
        const f = r < 0.35 ? ease('expo.in')(r / 0.35) : 1 - ease('cubic.out')((r - 0.35) / 0.65);
        c.set(c.$.flash, { o: f * 0.95 });
        c.set(c.$.a, { bright: 1 + f * 1.5 }); c.set(c.$.b, { o: r > 0.35 ? 1 : 0, bright: 1 + f * 1.5 });
      },
      prompt: 'Create a light-flash cut on the beat: over ~150ms, push scene A’s brightness up and fade a white overlay to ~95%, cut to scene B at the peak, then let the overlay and brightness decay over ~300ms. Avoid repeating flashes rapidly (photosensitivity).',
    },
    {
      id: 'glitch-transition', name: 'Glitch Transition', aka: ['Digital glitch', 'Data error cut', 'Slice glitch'], d: 0.5, e: 'linear', char: ['Tech', 'Edgy', 'Music'],
      what: 'For a few frames the image breaks into horizontally displaced slices with colour shifts and flicker, then resolves into Scene B. Deterministic “randomness” makes it repeatable.',
      good: ['Tech, gaming and music content', 'Edgy fashion edits', 'Signalling a twist or error'], avoid: 'Premium, calm or trust-sensitive brands (finance, health) — glitches read as broken.',
      tf: 'Slices offset X (random per frame) + hue/brightness flicker; scene swaps mid-way', glitch: true,
      render(c, p, r) {
        const on = r > 0 && r < 1;
        const step = Math.floor(c.t * 30);
        c.set(c.$.b, { o: r > 0.5 ? 1 : 0 });
        c.$$.gs.forEach((el, i) => {
          const h = hash(step * 7 + i), show = on && h > 0.35;
          el.style.backgroundImage = `url(${A.imgPath(r > 0.5 ? 'city' : 'dunes')})`;
          c.set(el, { o: show ? 1 : 0, xw: show ? (hash(step + i * 3) - 0.5) * 30 * bump(r) : 0, hue: show ? hash(i + step) * 180 : 0 });
        });
        c.set(c.$.both, { bright: on && hash(step) > 0.75 ? 1.6 : 1 });
      },
      prompt: 'Create a glitch transition lasting ~500ms: on each frame (≈30fps), pick a seeded-random set of horizontal slices of the image and offset them sideways by up to 15% of the frame with a hue shift; flicker brightness occasionally; swap from scene A to scene B halfway. Use a seeded random so it is identical on replay.',
    },
    {
      id: 'rgb-split-transition', name: 'RGB Split Transition', aka: ['Chromatic split', 'Channel shift', 'RGB shift'], d: 0.6, e: 'linear', char: ['Tech', 'Music', 'Edgy'],
      what: 'The red and blue colour channels separate in opposite directions, peak at the cut, and snap back together in Scene B. Cleaner and more controlled than a full glitch.',
      good: ['Music, gaming and fashion edits', 'Beat-synced cuts', 'Tech launches'], avoid: 'Large offsets for long durations — it becomes uncomfortable to watch.',
      tf: 'SVG filter: red channel offset +x, blue −x; bump to peak at the cut', rgb: true,
      render(c, p, r) { A.setRGB(c, c.$.both, bump(r) * 6, 0); c.set(c.$.b, { o: r > 0.5 ? 1 : 0 }); c.set(c.$.both, { s: 1 + bump(r) * 0.05 }); },
      prompt: 'Create an RGB-split transition: separate the red and blue channels horizontally in opposite directions (green fixed), ramping the offset from 0 to ~6% of the frame at the cut point and back to 0 over 600ms, with a tiny scale bump. Swap scenes exactly at peak offset.',
    },
    {
      id: 'pixel-transition', name: 'Pixel Transition', aka: ['Pixelate', 'Mosaic blur', 'Resolution drop'], d: 0.9, e: 'linear', char: ['Retro', 'Gaming', 'Playful'],
      what: 'Scene A drops in resolution until it becomes big blocky pixels, swaps to Scene B at the coarsest point, then sharpens back. Rendered on a canvas by drawing the frame tiny and scaling it up without smoothing.',
      good: ['Gaming and retro themes', 'Tech and digital products', 'Censor-style reveals'], avoid: 'Fine detail scenes that are the point of the shot.',
      tf: 'Canvas: draw at 1/blockSize resolution → upscale with smoothing off; block size bump 1 → 40px', pixel: true,
      render(c, p, r) {
        const { g, w, h } = c.data.cv;
        const img = r < 0.5 ? c.data.ia : c.data.ib;
        if (!img) return;
        const block = Math.max(1, Math.round(lerp(1, Math.min(w, h) / 9, bump(r) ** 1.4)));
        const sw = Math.max(1, Math.round(w / block)), sh = Math.max(1, Math.round(h / block));
        const o = c.data.off, og = c.data.og;
        if (o.width !== sw || o.height !== sh) { o.width = sw; o.height = sh; }
        og.imageSmoothingEnabled = true;
        A.drawCover(og, img, sw, sh);
        g.imageSmoothingEnabled = false;
        g.clearRect(0, 0, w, h);
        g.drawImage(o, 0, 0, sw, sh, 0, 0, w, h);
        c.set(c.$.a, { o: r > 0 && r < 1 ? 0 : r === 0 ? 1 : 0 });
        c.set(c.$.b, { o: r >= 1 ? 1 : 0 });
        c.set(c.$.cvs, { o: r > 0 && r < 1 ? 1 : 0 });
      },
      prompt: 'Create a pixelate transition on a canvas: each frame draw the current scene into a tiny offscreen canvas (width/blockSize × height/blockSize) and scale it back up with image smoothing disabled. Ramp blockSize from 1 to ~40px and back over 900ms, swapping scene A for scene B at the coarsest frame.',
    },
    {
      id: 'mosaic-transition', name: 'Mosaic Transition', aka: ['Tile transition', 'Grid reveal', 'Block dissolve'], d: 1.1, e: 'linear', char: ['Graphic', 'Playful', 'Tech'],
      what: 'Scene B is assembled from a grid of tiles that pop in one by one in a spreading, slightly random order. Structured yet lively — it shows the image being “built”.',
      good: ['Gallery and collection edits', 'Tech / data themes', 'Revealing a hero image'], avoid: 'Too many tiles — beyond ~100 tiles it becomes noise and costs performance.',
      tf: '8×8 tiles of B: scale 0 → 1, delay by distance from centre + jitter', mosaic: true,
      render(c, p, r) {
        c.$$.tile.forEach((el, i) => {
          const d = c.data.delay[i];
          const q = ease('back.out')(clamp((r - d * 0.6) / 0.4));
          c.set(el, { s: q, o: q > 0 ? 1 : 0 });
        });
        c.set(c.$.b, { o: r >= 1 ? 1 : 0 });
      },
      prompt: 'Create a mosaic transition: split scene B into an 8×8 grid of tiles (each tile shows its part of the image). Pop each tile in from scale 0 to 1 with a back-out ease, delayed by its distance from the centre plus a little seeded jitter, so B assembles outward over ~1.1s on top of scene A.',
    },
    {
      id: 'match-cut-transition', name: 'Match Cut', aka: ['Graphic match', 'Shape anchor cut', 'Position match'], d: 0, e: 'linear', char: ['Clever', 'Cinematic', 'Editorial'],
      what: 'A hard cut between two different scenes where one element keeps the same shape, size and position — here a red disc. The eye stays locked on the disc, so the cut feels like a continuation, not an interruption.',
      good: ['Connecting two places, times or products', 'Brand films with a recurring object', 'Satisfying social edits'], avoid: 'Matching elements that drift in position between the shots.',
      tf: 'Hard cut; the anchor element stays identical across the cut', match: true,
      render(c, p, r) {
        const cut = c.t >= c.tl.map.tr.start;
        c.set(c.$.b, { o: cut ? 1 : 0 });
        const pulse = 1 + 0.06 * Math.max(0, 1 - Math.abs(c.t - c.tl.map.tr.start) * 4);
        c.set(c.$.disc, { s: pulse });
        c.set(c.$.mtag, { o: Math.abs(c.t - c.tl.map.tr.start) < 0.45 ? 1 : 0 });
      },
      prompt: 'Create a match cut: in both scenes place the same anchor element (a red disc) at exactly the same position and size, then hard-cut from scene A to scene B with no transition effect. Give the anchor a tiny pulse on the cut frame so the eye stays on it.',
    },
    {
      id: 'object-wipe', name: 'Object Wipe', aka: ['Pass-by wipe', 'Natural wipe', 'Wipe by object'], d: 0.8, e: 'inOut', char: ['Cinematic', 'Clever', 'Seamless'],
      what: 'A large object (here a rolling sphere) passes across the camera and completely fills the frame for a moment; the cut happens behind it. Filmmakers plan these with people, cars or doors passing the lens.',
      good: ['Seamless location changes', 'Product passes the camera to reveal a new scene', 'Hiding cuts in one-take style edits'], avoid: 'Objects that never fully cover the frame — the cut becomes visible.',
      tf: 'Sphere translateX across + rotate; scene swap when coverage is complete', extra: '<div data-r="ball" class="ow-ball"><i></i></div>',
      render(c, p, r) {
        c.set(c.$.ball, { xp: lerp(-110, 110, p), r: p * 260, o: r > 0 && r < 1 ? 1 : 0 });
        c.set(c.$.b, { o: p >= 0.5 ? 1 : 0 });
      },
      prompt: 'Create an object wipe: a large sphere (bigger than the frame) rolls across the camera from left to right over 800ms with a cubic in-out ease, rotating as it moves. Cut from scene A to scene B at the exact moment the sphere fully covers the frame, so the cut is invisible.',
    },
    {
      id: 'occlusion-transition', name: 'Foreground Occlusion Transition', aka: ['Pillar wipe', 'Foreground pass', 'Hidden cut'], d: 0.9, e: 'inOut', char: ['Cinematic', 'Seamless', 'Premium'],
      what: 'The camera trucks past something close to the lens — a pillar, a tree, a wall — which fills the frame for a moment. Because the foreground moves much faster than the background (parallax), it feels like real camera movement, and the cut hides behind it.',
      good: ['Premium brand films and real-estate', 'Continuous “one-take” sequences', 'Moving between two locations naturally'], avoid: 'A foreground that moves at the same speed as the background — it looks pasted on.',
      tf: 'Foreground pillar translateX fast (parallax ≈ 6× scene); scenes drift slowly; swap behind pillar', extra: '<div data-r="pillar" class="oc-pillar"></div>',
      render(c, p, r) {
        c.set(c.$.pillar, { xw: lerp(120, -160, p) });
        c.set(c.$.a, { xp: -6 * p, s: 1.08 }); c.set(c.$.b, { o: p >= 0.5 ? 1 : 0, xp: 6 * (1 - p), s: 1.08 });
      },
      prompt: 'Create a foreground-occlusion transition: simulate the camera trucking past a dark pillar close to the lens — the pillar crosses the frame quickly (much faster than the background, ~6× parallax) over 900ms while both scenes drift slightly in the same direction. Swap scene A for B while the pillar fully covers the frame.',
    },
    {
      id: 'liquid-transition', name: 'Liquid Transition', aka: ['Wave wipe', 'Fluid reveal', 'Splash transition'], d: 1.2, e: 'smooth', char: ['Fluid', 'Playful', 'Beverage'],
      what: 'A wavy liquid edge rises through the frame — first a wave of brand colour, then Scene B right behind it. The moving sine edge makes a simple wipe feel fluid. Simplified: polygons with a wave edge, no fluid simulation.',
      good: ['Drinks, cosmetics and food brands', 'Playful explainers', 'Swapping colourways'], avoid: 'Serious or technical content.',
      tf: 'clip-path polygon with a sine-wave top edge rising; colour layer leads B by ~10%', extra: '<i data-r="liq" class="fill" style="background:#ef4b36"></i>', liquid: true,
      render(c, p) {
        const wave = (lead, amp) => {
          const base = lerp(115, -15, p) - lead;
          let pts = '0% 100%';
          for (let i = 0; i <= 24; i++) {
            const x = (i / 24) * 100;
            const y = base + Math.sin(i * 0.55 + c.t * 9) * amp + Math.sin(i * 0.23 - c.t * 5) * amp * 0.6;
            pts += `, ${x.toFixed(1)}% ${y.toFixed(1)}%`;
          }
          return `polygon(${pts}, 100% 100%)`;
        };
        c.set(c.$.liq, { clip: wave(10, 3.5), o: p > 0 && p < 1 ? 1 : 0 });
        c.set(c.$.b, { clip: p >= 1 ? 'none' : wave(0, 2.5), o: p > 0 ? 1 : 0 });
      },
      note: 'Simplified liquid: a sine-wave polygon edge, not a fluid simulation.',
      prompt: 'Create a liquid wipe: reveal scene B behind a wavy edge that rises from the bottom to the top over 1.2s (smooth ease). Build the edge as a clip-path polygon whose top vertices follow two layered, moving sine waves; lead it with a brand-coloured liquid layer ~10% ahead so the colour wave passes first.',
    },
  ];

  const tags = (t) => ['transition'].concat(t.tags || []);
  T.forEach((t) => {
    const extraFor = () => {
      let x = t.extra || '';
      if (t.glitch) x += Array.from({ length: 10 }, (_, i) => `<div data-r="gs" class="gl-slice" style="top:${i * 10}%;height:${4 + (i % 3) * 3}%;background-position:center calc((100cqh - max(100cqw, 100cqh)) / 2 - ${i * 10}cqh)"></div>`).join('');
      return x;
    };
    demo({
      id: t.id, cat: CAT, name: t.name, aka: t.aka, tags: tags(t), char: t.char, variants: t.variants || null, note: t.note,
      what: t.what, good: t.good, avoid: t.avoid,
      anatomy: ['Cut point between two scenes', 'Scene A → Scene B', t.tf, t.d ? `${t.d}s, between a 0.9s hold on A and 1.1s on B` : 'Instant (hard cut)', t.e === 'linear' ? 'Custom per phase (see transformation)' : t.e, 'Hold A → transition → hold B'],
      tracks: [['ha', 'Scene A (hold)', 0, HOLD_A, 'linear', 'image'], ['tr', t.d ? t.name : 'Hard cut', HOLD_A, t.d, t.e, t.d ? 'fx' : 'cut'], ['hb', 'Scene B (hold)', HOLD_A + t.d, HOLD_B, 'linear', 'image']],
      html: () => {
        const b = t.blur ? A.dirBlur() : t.rgb ? A.rgbFilter() : null;
        const filt = b ? ` data-filter="${b.id}"` : '';
        let inner = SCENE_A + SCENE_B;
        if (t.match) inner = SCENE_A + SCENE_B + '<div class="center"><i data-r="disc" class="mc-disc"></i></div><span data-r="mtag" class="tag" style="left:50%;top:6%;transform:translateX(-50%)">anchor: red disc</span>';
        if (t.mosaic) {
          const tiles = [];
          for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) tiles.push(`<div data-r="tile" class="mos" style="left:${x * 12.5}%;top:${y * 12.5}%"><div class="photo" style="left:${-x * 100}%;top:${-y * 100}%;background-image:url(${A.imgPath('city')})"></div></div>`);
          inner += `<div class="fill" style="z-index:3">${tiles.join('')}</div>`;
        }
        if (t.pixel) inner += '<canvas data-r="cvs" class="canvas-fill" style="z-index:3"></canvas>';
        return (b ? b.html : '') + `<div class="fill" data-r="both"${filt}>${inner}${extraFor()}</div>`;
      },
      init(c) {
        if (t.pixel) {
          c.data.cv = c.canvas(c.$.cvs);
          c.data.off = document.createElement('canvas');
          c.data.og = c.data.off.getContext('2d');
          A.loadImage(A.imgPath('dunes')).then((im) => { c.data.ia = im; });
          A.loadImage(A.imgPath('city')).then((im) => { c.data.ib = im; });
        }
        if (t.mosaic) {
          const r = rng(3);
          c.data.delay = c.$$.tile.map((_, i) => {
            const x = i % 8, y = Math.floor(i / 8);
            return clamp(Math.hypot(x - 3.5, y - 3.5) / 5 * 0.8 + r() * 0.2);
          });
        }
      },
      render(time, c) {
        const r = t.d ? c.r.tr : time >= c.tl.map.tr.start ? 1 : 0;
        const p = t.d ? c.p.tr : r;
        // Reset both scene layers every frame, so each render stays a pure function of time.
        c.set(c.$.a, { o: 1, s: 1, xp: 0, yp: 0, r: 0, blur: 0, bright: 1, clip: 'none' });
        c.set(c.$.b, { o: 0, s: 1, xp: 0, yp: 0, r: 0, blur: 0, bright: 1, clip: 'none' });
        t.render(c, p, r);
      },
      prompt: t.prompt,
    });
  });

  /* Seamless loop: last frame = first frame */
  demo({
    id: 'seamless-loop', cat: CAT, name: 'Seamless Loop Transition', aka: ['Perfect loop', 'Loop cut', 'Infinite loop edit'],
    tags: ['transition', 'social'], char: ['Social', 'Satisfying', 'Clever'],
    what: 'The video ends exactly where it began, so when the platform replays it the viewer cannot see the seam. Here A pushes up to B, then B pushes up to a fresh copy of A — whose final frame is identical to the first frame. Loops increase watch time because many viewers watch twice without noticing.',
    good: ['Reels, TikTok and Shorts (auto-replay)', 'Product turntables and ambient loops', 'GIF-like social posts'], avoid: 'Loops that “almost” match — a tiny jump on the seam is more visible than a clear ending.',
    anatomy: ['Platform auto-replay', 'A → B → A', 'Vertical pushes; the final frame equals frame 1', '0.7s pushes · 1s holds', 'expo.inOut', 'A hold → push → B hold → push → A (= first frame)'],
    tracks: [['ha', 'Scene A', 0, 1, 'linear', 'image'], ['t1', 'Push to B', '>', 0.7, 'expo.inOut', 'fx'], ['hb', 'Scene B', '>', 1, 'linear', 'image'], ['t2', 'Push back to A', '>', 0.7, 'expo.inOut', 'fx'], ['seam', 'Loop seam (= frame 1)', '>', 0, 'linear', 'cut']],
    dur: 3.4, noLoop: false,
    html: `<div class="fill sl-strip" data-r="strip"><div class="sl-cell">${SCENE_A.replace('data-r="a"', '')}</div><div class="sl-cell">${SCENE_B.replace('data-r="b"', '')}</div><div class="sl-cell">${SCENE_A.replace('data-r="a"', '')}</div></div>
      <span data-r="seam" class="tag tag--light" style="left:50%;top:6%;transform:translateX(-50%)">last frame = first frame</span>`,
    render(t, c) {
      const pos = c.p.t1 + c.p.t2;
      c.set(c.$.strip, { yp: (-pos * 100) / 3 });
      c.set(c.$.seam, { o: t > 3.1 || t < 0.25 ? 1 : 0 });
    },
    prompt: 'Make the edit loop seamlessly: structure it as A → B → A where the final frame is pixel-identical to the first frame (same position, scale and timing of every element). Use vertical pushes (700ms, expo in-out) between 1s holds, and end exactly on the frame that matches frame 1 so the platform’s auto-replay hides the seam.',
  });
})();
