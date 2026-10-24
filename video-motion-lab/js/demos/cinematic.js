/* 14 — Cinematic Effects
   Every effect sits on the same base shot. Timeline: effect OFF (0–0.8s)
   → effect ramps ON → hold, so each demo is its own before/after. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, rng, noise1, fbm1, A } = window.VML;
  const CAT = 'cinematic';
  const BASE = (img = 'city') => `<div class="fill" data-r="shot">${A.photo(img, { r: 'img', cls: 'fill' })}
    <div class="cn-title" data-r="title"><span class="t-eyebrow">Chapter 03</span><b class="t-serif">After <i>midnight</i></b></div></div>`;
  const TRACKS = [['off', 'Effect off (reference)', 0, 0.8, 'linear', 'hold'], ['on', 'Effect ramps on', '>', 0.8, 'smooth', 'fx'], ['hold', 'Effect held', '>', 2.2, 'linear', 'fx']];

  const FX = [
    {
      id: 'film-grain', name: 'Film Grain', aka: ['Noise texture', 'Analog grain', 'Grain overlay'], char: ['Cinematic', 'Analog', 'Texture'],
      what: 'A fine, constantly changing noise texture over the image, like the silver grain of film stock. It hides banding, unifies footage from different sources and makes digital graphics feel shot rather than rendered.',
      good: ['Unifying mixed footage and motion graphics', 'Nostalgic and editorial tone', 'Hiding gradient banding'],
      avoid: 'Heavy grain on small text or on platforms that re-compress hard (it turns into mush).',
      tf: 'Grain texture repositioned randomly every frame (24 fps) at ~20–35% opacity', extra: '<i data-r="grain" class="grain"></i>',
      render(c, k, t) { const f = Math.floor(t * 24); c.set(c.$.grain, { o: 0.65 * k, xp: (hash(f) - 0.5) * 20, yp: (hash(f + 9) - 0.5) * 20 }); },
      prompt: 'Add film grain: overlay a tiling monochrome noise texture at ~20–35% opacity and jump its position randomly every frame at 24 fps so it shimmers like film. Keep it fine-grained and consistent across shots.',
    },
    {
      id: 'vignette', name: 'Vignette', aka: ['Edge darkening', 'Lens falloff'], char: ['Cinematic', 'Focus', 'Moody'],
      what: 'The edges and corners darken gently, pulling the eye toward the centre — the natural light falloff of real lenses. Good vignettes are noticed only when you turn them off.',
      good: ['Focusing attention on a central subject', 'Moody, intimate scenes', 'Making flat graphics feel photographic'],
      avoid: 'Strong vignettes under platform UI in 9:16 — the darkened edges plus UI make the frame feel cramped.',
      tf: 'Radial gradient overlay: transparent centre → black edges, opacity ramp', extra: '<i data-r="vig" class="vignette"></i>',
      render(c, k) { c.set(c.$.vig, { o: k }); },
      prompt: 'Add a subtle vignette: an elliptical radial-gradient overlay that is transparent in the centre and darkens toward the edges (max ~60–75% black in the corners). Keep it soft enough that it is only noticeable when removed.',
    },
    {
      id: 'letterbox', name: 'Letterbox', aka: ['Cinema bars', '2.39:1 crop', 'Black bars'], char: ['Cinematic', 'Dramatic', 'Premium'],
      what: 'Black bars slide in from the top and bottom, cropping the frame to a wide cinema ratio. It instantly signals “film”; animating them in can mark the switch into a dramatic moment.',
      good: ['Brand films and trailers', 'Switching into a dramatic scene', 'Horizontal (16:9) content'],
      avoid: 'Full 2.39:1 bars on 9:16 — they waste most of the vertical frame. Use thin bars or a cinematic grade instead.',
      tf: 'Top/bottom bars translateY from outside to a cinema crop', extra: '<i data-r="bt" class="bars bars--top"></i><i data-r="bb" class="bars bars--bot"></i>',
      render(c, k) { c.set(c.$.bt, { yp: -100 * (1 - k) }); c.set(c.$.bb, { yp: 100 * (1 - k) }); },
      prompt: 'Slide letterbox bars in from the top and bottom over 800ms (smooth ease) to crop the frame to a cinematic ratio (≈2.39:1 on 16:9; use thinner bars on vertical formats). Keep titles inside the remaining area.',
    },
    {
      id: 'light-leak', name: 'Light Leak', aka: ['Film light leak', 'Warm flare wash', 'Burn-in light'], char: ['Nostalgic', 'Warm', 'Dreamy'],
      what: 'Soft, warm blobs of light drift across the frame and add colour in screen mode, imitating light leaking into an old camera. Great for warmth and nostalgia — and for covering transitions.',
      good: ['Travel, wedding and lifestyle edits', 'Warm, nostalgic grades', 'Soft transitions between scenes'],
      avoid: 'Clinical, technical or financial content where it reads as a defect.',
      tf: 'Large blurred orange/red gradients drifting, mix-blend-mode screen', extra: '<i data-r="lk1" class="cn-leak cn-leak--a"></i><i data-r="lk2" class="cn-leak cn-leak--b"></i>',
      render(c, k, t) { c.set(c.$.lk1, { o: k * (0.7 + 0.3 * Math.sin(t * 2)), xw: lerp(-30, 40, (t % 4) / 4), r: t * 10 }); c.set(c.$.lk2, { o: k * 0.6, yh: lerp(30, -20, (t % 4) / 4) }); },
      prompt: 'Add a light leak: two large, very soft orange-red radial gradients drifting slowly across the frame in screen blend mode, with gently pulsing opacity (60–100%). Keep them at the frame edges so faces stay clean.',
    },
    {
      id: 'lens-flare', name: 'Lens Flare', aka: ['Anamorphic streak', 'Sun flare', 'Optical flare'], char: ['Cinematic', 'Epic', 'Sci-fi'],
      what: 'A bright source creates a horizontal streak and a line of ghost reflections that mirror through the centre of the frame as the light moves. This is a tasteful approximation built from gradients, not an optical simulation.',
      good: ['Epic reveals and sunrises', 'Sci-fi / tech moments', 'Accenting a light source in the shot'],
      avoid: 'Flares with no light source in the shot, or constant flares — they become a cliché.',
      tf: 'Source glow + streak at a moving point; ghosts placed along the line source → centre → opposite', extra: '<i data-r="src" class="cn-flare-src"></i><i data-r="streak" class="cn-streak"></i>' + [0, 1, 2].map(() => '<i data-r="gh" class="cn-ghost"></i>').join(''),
      render(c, k, t) {
        const sx = lerp(20, 75, clamp((t - 0.8) / 3)), sy = 22;
        [c.$.src, c.$.streak].forEach((el) => { el.style.left = sx + '%'; el.style.top = sy + '%'; c.set(el, { o: k }); });
        c.$$.gh.forEach((el, i) => { const f = [0.6, 1.25, 1.7][i]; el.style.left = sx + (50 - sx) * f + '%'; el.style.top = sy + (50 - sy) * f + '%'; c.set(el, { o: k * [0.5, 0.35, 0.25][i], s: [0.6, 1, 1.6][i] }); });
      },
      note: 'Approximation built from gradients; real lens flares come from optics or a dedicated flare plugin.',
      prompt: 'Add a tasteful lens flare that follows the light source: a bright radial glow at the source, a thin horizontal anamorphic streak through it, and 3 soft ghost discs placed along the line from the source through the frame centre (scaled and faded progressively). Use screen blending and keep it subtle.',
    },
    {
      id: 'bloom-glow', name: 'Bloom & Glow', aka: ['Bloom', 'Glow', 'Highlight bleed'], char: ['Dreamy', 'Cinematic', 'Night'], variants: [['bloom', 'Bloom (image)'], ['glow', 'Glow (element)']],
      what: 'Bloom lets bright areas of the image bleed light into their surroundings (a blurred, brightened copy added on top). Glow is the graphic version: light around a specific element, like the title. Bloom is global and photographic; glow is local and designed.',
      good: ['Night scenes and city lights (bloom)', 'Neon titles and UI accents (glow)', 'Dreamy beauty shots'],
      avoid: 'Bloom on already bright images — everything washes out.',
      tf: 'Bloom: blurred + brightened copy, screen blend · Glow: layered drop-shadows on the title', extra: `<div data-r="bloom" class="fill cn-bloom">${A.photo('city', { cls: 'fill' })}</div>`,
      render(c, k) {
        if (c.v === 'bloom') { c.set(c.$.bloom, { o: k * 0.85 }); c.set(c.$.title, { css: { filter: 'none' } }); }
        else { c.set(c.$.bloom, { o: 0 }); c.set(c.$.title, { css: { filter: `drop-shadow(0 0 ${(k * 1.2).toFixed(2)}cqmin #ffd9a8) drop-shadow(0 0 ${(k * 4).toFixed(2)}cqmin rgba(255,170,90,.7))` } }); }
      },
      prompt: (v) => v === 'bloom' ? 'Add bloom: layer a blurred (≈2–3% of frame), brightened, high-contrast copy of the shot on top in screen blend mode so only the highlights bleed light. Ramp it in over 800ms.' : 'Add a glow to the title only: stack two drop-shadows in a warm light colour (small tight radius + large soft radius) and ramp them in over 800ms. The image itself stays untouched.',
    },
    {
      id: 'chromatic-aberration', name: 'Chromatic Aberration', aka: ['Colour fringing', 'Lens CA', 'Edge fringe'], char: ['Photographic', 'Subtle', 'Lo-fi'],
      what: 'A tiny, static separation of red and blue at the edges, like a cheap or vintage lens. Unlike an RGB split, it is subtle (≈0.5% of the frame) and does not move — a texture, not an effect.',
      good: ['Adding analog/lens character', 'Making CGI or vector shots feel photographed', 'Retro and lo-fi edits'],
      avoid: 'Strong values — text becomes hard to read.',
      tf: 'SVG filter: red channel offset +x, blue −x (small, static)', rgb: true,
      render(c, k) { A.setRGB(c, c.$.shot, k * 0.35, k * 0.1); },
      prompt: 'Add subtle chromatic aberration: offset the red channel ~0.5% of the frame to one side and the blue channel to the other (green fixed), static, via an SVG feColorMatrix + feOffset filter. It should be barely visible except on high-contrast edges.',
    },
    {
      id: 'rgb-split', name: 'RGB Split', aka: ['Channel shift', 'RGB offset', 'Colour split'], char: ['Edgy', 'Music', 'Tech'],
      what: 'The colour channels separate by a large, moving amount — pulsing on beats or jittering. It is a deliberate stylisation (music, tech, fashion), not a lens artefact like chromatic aberration.',
      good: ['Music and dance edits on beats', 'Tech / gaming promos', 'Fashion editorials'],
      avoid: 'Long continuous splits; keep them to accents and beats.',
      tf: 'SVG filter: red/blue offsets animated with beat pulses', rgb: true,
      render(c, k, t) { const beat = Math.exp(-((t * 2) % 1) * 5); A.setRGB(c, c.$.shot, k * (1.4 + beat * 4), 0); },
      prompt: 'Add a beat-driven RGB split: offset the red and blue channels horizontally in opposite directions, spiking to ~5% of the frame on each beat and decaying exponentially between beats. Use it as an accent only.',
    },
    {
      id: 'motion-dir-blur', name: 'Motion & Directional Blur', aka: ['Motion blur', 'Directional blur', 'Speed blur'], char: ['Dynamic', 'Fast', 'Cinematic'], variants: [['motion', 'Motion blur (on movement)'], ['dir', 'Directional blur (stylised)']],
      what: 'Motion blur is the smear a camera records when something moves during the exposure — it should follow speed. Directional blur is a stylised streak applied on purpose (e.g. a speed-line look) even without movement. Here: the shot moves and blurs with its speed, vs. a static streak treatment.',
      good: ['Fast moves and whip pans (motion)', 'Speed / sports aesthetics (directional)', 'Making CG motion feel filmed'],
      avoid: 'Motion blur on slow moves — it just looks out of focus.',
      tf: 'SVG feGaussianBlur stdDeviation “x 0”: ∝ speed (motion) or constant (directional)', blur: true,
      render(c, k, t) {
        if (c.v === 'motion') { const v = Math.sin(t * 3) ; c.set(c.$.img, { xp: v * 8 * k, s: 1.2 }); A.setDirBlur(c, c.$.shot, c.$.mbf, Math.abs(Math.cos(t * 3)) * 3 * k, 0); }
        else { c.set(c.$.img, { s: 1.08 }); A.setDirBlur(c, c.$.shot, c.$.mbf, 2.2 * k, 0); }
      },
      prompt: (v) => v === 'motion' ? 'Apply motion blur that follows movement: as the shot slides back and forth, set a horizontal-only blur (SVG feGaussianBlur stdDeviation "x 0") proportional to its instantaneous speed — zero at the turning points, strongest at peak speed.' : 'Apply a stylised directional blur: a constant horizontal-only blur on the background layer (SVG feGaussianBlur stdDeviation "x 0") for a speed-streak look, while titles stay sharp.',
    },
    {
      id: 'depth-of-field', name: 'Depth of Field Simulation', aka: ['DoF', 'Shallow focus', 'Background blur'], char: ['Cinematic', 'Premium', 'Focus'],
      what: 'Layers further from the focus plane get softer, so the subject separates from the background like a photo shot at a wide aperture. Here the aperture “opens” over time on a layered scene.',
      good: ['Separating a subject or product', 'Making illustrations feel photographed', 'Premium, intimate looks'],
      avoid: 'Uniform blur on a flat image — DoF needs depth layers to be believable.',
      tf: 'Per-layer blur ∝ |1/distance − 1/focus|, aperture ramps up', world: true,
      render(c, k) {
        const D = [['ly-sky', 1e6], ['ly-sun', 1e5], ['ly-far', 12], ['ly-mid', 7], ['ly-near', 4.5], ['ly-subject', 3], ['ly-fg', 1.6]];
        D.forEach(([key, L]) => c.set(c.$[key], { blur: Math.min(4, k * 1.4 * Math.abs(1 / L - 1 / 3) * 10), s: 1.04 }));
      },
      prompt: 'Simulate shallow depth of field on a layered scene: keep the subject layer sharp and blur every other layer in proportion to |1/distance − 1/focusDistance|, ramping the “aperture” from 0 to full over 800ms. Foreground and far background end up softest.',
    },
    {
      id: 'bokeh', name: 'Bokeh', aka: ['Bokeh lights', 'Out-of-focus highlights', 'Light orbs'], char: ['Dreamy', 'Romantic', 'Festive'],
      what: 'Out-of-focus points of light become soft discs that drift slowly and pulse. They add depth and atmosphere behind a subject or title — city nights, celebrations, beauty.',
      good: ['Night and festive scenes', 'Backgrounds for titles and products', 'Romantic, dreamy tone'],
      avoid: 'Too many or too bright discs competing with the subject.',
      tf: 'Blurred circles with soft edges, varied size and opacity, slow drift; background softened', extra: Array.from({ length: 16 }, (_, i) => `<i data-r="bk" class="cn-bokeh cn-bokeh--${i % 3}"></i>`).join(''),
      init(c) { const r = rng(17); c.data.bk = c.$$.bk.map(() => [r() * 100, r() * 100, lerp(6, 22, r()), r() * 6]); },
      render(c, k, t) {
        c.set(c.$.img, { blur: 1.6 * k, bright: lerp(1, 0.75, k) });
        c.$$.bk.forEach((el, i) => { const [x, y, s, ph] = c.data.bk[i]; el.style.left = x + Math.sin(t * 0.4 + ph) * 3 + '%'; el.style.top = y + Math.cos(t * 0.3 + ph) * 2 + '%'; el.style.width = el.style.height = s + 'cqmin'; c.set(el, { o: k * (0.35 + 0.25 * Math.sin(t * 1.3 + ph)) }); });
      },
      prompt: 'Create a bokeh atmosphere: soften and slightly darken the background, then add ~16 soft-edged light discs (varied sizes 6–22% of the frame, warm and cool tints) drifting very slowly and gently pulsing in opacity. Keep them behind the title.',
    },
    {
      id: 'dust-particles', name: 'Dust Particles', aka: ['Floating dust', 'Atmospheric particles', 'Light motes'], char: ['Atmospheric', 'Cinematic', 'Calm'],
      what: 'Tiny specks float slowly through a beam of light, catching it as they drift. They give a shot air and volume — the room feels real and quiet.',
      good: ['Interiors, workshops and products in light beams', 'Slow, contemplative scenes', 'Luxury product shots'],
      avoid: 'Fast particles or large ones — they read as snow or bugs.',
      tf: 'Canvas: ~120 motes with slow noise drift; brighter inside the light beam', canvas: true, img: 'interior', extra: '<i data-r="beam" class="cn-beam"></i>',
      init(c) { const r = rng(5); c.data.m = Array.from({ length: 120 }, () => [r(), r(), lerp(0.6, 2, r()), r() * 10]); },
      render(c, k, t) {
        c.set(c.$.beam, { o: k * 0.8 });
        const { g, w, h } = c.data.cv; g.clearRect(0, 0, w, h);
        c.data.m.forEach(([x, y, s, ph]) => {
          const px = ((x + noise1(t * 0.15 + ph) * 0.06 + t * 0.01) % 1) * w, py = ((y - t * 0.012 + noise1(t * 0.12 + ph + 4) * 0.05 + 1) % 1) * h;
          const inBeam = Math.abs(px / w - (0.25 + (py / h) * 0.5)) < 0.18;
          g.fillStyle = `rgba(255,240,215,${(k * (inBeam ? 0.85 : 0.25)).toFixed(3)})`;
          g.beginPath(); g.arc(px, py, s * (inBeam ? 1.2 : 1), 0, Math.PI * 2); g.fill();
        });
      },
      prompt: 'Add floating dust: on a canvas, draw ~120 tiny soft motes drifting slowly on smooth noise (no straight lines), brighter where they cross a diagonal light beam and faint elsewhere. Compute positions from time so the effect is deterministic.',
    },
    {
      id: 'film-flicker', name: 'Film Flicker', aka: ['Exposure flicker', 'Projector flicker', 'Old film'], char: ['Vintage', 'Nostalgic', 'Analog'],
      what: 'Exposure fluctuates slightly and irregularly from frame to frame, like an old projector or hand-cranked camera. It must be small: a few percent of brightness, never a strobe.',
      good: ['Archive / vintage looks', 'Flashbacks', 'Combined with grain and vignette for an old-film grade'],
      avoid: 'Strong flicker (photosensitivity) or using it on modern, clean brand content.',
      tf: 'Brightness ±6% stepped per frame (seeded) + occasional dip', extra: '<i data-r="grain" class="grain"></i>',
      render(c, k, t) { const f = Math.floor(t * 18); const b = 1 + (hash(f) - 0.5) * 0.12 * k - (hash(f * 3) > 0.93 ? 0.12 * k : 0); c.set(c.$.shot, { bright: b, sat: lerp(1, 0.75, k), contrast: lerp(1, 1.08, k) }); c.set(c.$.grain, { o: 0.45 * k, xp: (hash(f) - 0.5) * 20 }); },
      prompt: 'Add an old-film flicker: vary the brightness by ±6% with a seeded random value that changes ~18 times per second, with an occasional slightly deeper dip; slightly desaturate and add grain. Keep the flicker subtle and never strobe.',
    },
    {
      id: 'film-burn', name: 'Film Burn', aka: ['Burn transition', 'Celluloid burn', 'Overexposed burn'], char: ['Vintage', 'Intense', 'Warm'],
      what: 'Hot orange and white blooms eat into the frame from an edge, as if the film strip is burning, then recede. Often used as a transition or a dramatic accent in vintage edits.',
      good: ['Music videos and vintage edits', 'Transitions between scenes', 'Dramatic accents'],
      avoid: 'Clean corporate content; and leaving it on screen too long.',
      tf: 'Large radial gradients (white → orange → transparent), screen blend, grow from an edge and fade', extra: '<i data-r="burn1" class="cn-burn"></i><i data-r="burn2" class="cn-burn cn-burn--b"></i>',
      render(c, k, t) { const b = bump(clamp((t - 0.8) / 2.6)); c.set(c.$.burn1, { s: lerp(0.3, 1.5, b), o: k * b }); c.set(c.$.burn2, { s: lerp(0.2, 1.2, b), o: k * b * 0.8 }); },
      prompt: 'Create a film burn: grow two large radial gradients (white core → hot orange → transparent) from the frame edge in screen blend mode, swelling and then receding over ~2.5s, with a slight overall exposure boost at the peak.',
    },
    {
      id: 'scan-lines', name: 'Scan Lines', aka: ['CRT lines', 'Monitor lines', 'Raster lines'], char: ['Retro', 'Tech', 'Lo-fi'],
      what: 'Thin horizontal lines plus a slowly rolling brighter band imitate a CRT monitor. Good for screen-within-screen moments, retro tech and surveillance looks.',
      good: ['Retro tech and gaming', 'Screens inside the scene', 'Surveillance / “recording” looks'],
      avoid: 'Fine scan lines on small mobile renders — they moiré after compression; use thicker lines.',
      tf: 'Repeating-linear-gradient overlay + rolling band translateY', extra: '<i data-r="sl" class="scanlines"></i><i data-r="roll" class="cn-roll"></i>',
      render(c, k, t) { c.set(c.$.sl, { o: k }); c.set(c.$.roll, { o: k * 0.6, yp: ((t * 25) % 140) - 20 }); },
      prompt: 'Add CRT scan lines: a repeating horizontal line pattern overlay (thick enough to survive compression) plus a soft brighter band that rolls slowly down the frame and loops.',
    },
    {
      id: 'vhs', name: 'VHS Style', aka: ['VHS tape', 'Camcorder look', '90s video'], char: ['Retro', 'Nostalgic', 'Lo-fi'],
      what: 'A combination look: colour bleed (channel shift), scan lines, softness, a tracking-noise band that drifts through the frame and an on-screen PLAY timestamp. It is the sum of small imperfections that sells the tape.',
      good: ['90s / Y2K nostalgia', 'Home-video storytelling', 'Music and fashion edits'],
      avoid: 'Overdoing every artefact at once — pick 3–4 and keep text readable.',
      tf: 'RGB shift + scanlines + blur + tracking band + timestamp overlay', rgb: true, extra: '<i data-r="sl" class="scanlines"></i><i data-r="track" class="cn-track"></i><span data-r="osd" class="cn-osd">PLAY ▶<br/>OCT 23 1998</span>',
      render(c, k, t) { A.setRGB(c, c.$.shot, k * 1.2, 0); c.set(c.$.img, { sat: lerp(1, 1.3, k), contrast: lerp(1, 0.9, k) }); c.set(c.$.sl, { o: k * 0.7 }); c.set(c.$.track, { o: k * 0.8, yp: ((t * 40) % 400) - 100 }); c.set(c.$.osd, { o: k }); },
      prompt: 'Create a VHS look: shift the red/blue channels ~1% horizontally, add scan lines and slight blur, boost saturation, run a noisy tracking band that drifts down the frame, and overlay a blocky “PLAY ▶” timestamp in the corner. Keep main text readable.',
    },
    {
      id: 'digital-noise', name: 'Digital Noise', aka: ['Sensor noise', 'RGB noise', 'Static'], char: ['Gritty', 'Tech', 'Night'],
      what: 'Coloured per-pixel noise (like a phone sensor at night or TV static) regenerated every frame. Unlike film grain it is chromatic and harsh, so it reads as digital, cheap or surveillance.',
      good: ['Night / security-camera looks', 'Glitch and tech aesthetics', 'TV-static transitions'],
      avoid: 'Using it as “film grain” — it looks like an encoding error.',
      tf: 'Canvas: random RGB pixels at low resolution, regenerated at 24 fps, screen-blended', canvas: true, lowres: true,
      render(c, k, t) {
        const { g, w, h } = c.data.cv;
        const W = Math.ceil(w / 3), H = Math.ceil(h / 3);
        if (!c.data.id || c.data.id.width !== W || c.data.id.height !== H) { c.data.oc = document.createElement('canvas'); c.data.oc.width = W; c.data.oc.height = H; c.data.og = c.data.oc.getContext('2d'); c.data.id = c.data.og.createImageData(W, H); }
        const r = rng(Math.floor(t * 24) + 1), d = c.data.id.data;
        for (let i = 0; i < d.length; i += 4) { d[i] = r() * 255; d[i + 1] = r() * 255; d[i + 2] = r() * 255; d[i + 3] = 255 * k * 0.35; }
        c.data.og.putImageData(c.data.id, 0, 0);
        g.clearRect(0, 0, w, h); g.imageSmoothingEnabled = false; g.drawImage(c.data.oc, 0, 0, w, h);
      },
      prompt: 'Add digital sensor noise: render low-resolution random RGB pixels to a canvas each frame (24 fps, seeded per frame), scale it up without smoothing and blend it over the shot at ~30% opacity. Use for night or surveillance looks, not as film grain.',
    },
    {
      id: 'glitch', name: 'Glitch', aka: ['Digital glitch', 'Datamosh-lite', 'Signal error'], char: ['Edgy', 'Tech', 'Music'],
      what: 'Short bursts of broken signal: horizontal slices jump sideways with colour shifts, then the image snaps back clean. Bursts (not constant glitching) keep it readable and rhythmic.',
      good: ['Tech / gaming / music', 'Error, hacking or twist moments', 'Transitions and beat accents'],
      avoid: 'Trust-sensitive brands, and continuous glitching (fatiguing, photosensitivity).',
      tf: 'Seeded slices offset X + hue shift during short bursts', glitch: true,
      render(c, k, t) {
        const burst = ((t * 1.1) % 1) < 0.18 && k > 0.5;
        const f = Math.floor(t * 30);
        c.$$.gs.forEach((el, i) => { const on = burst && hash(f * 5 + i) > 0.4; c.set(el, { o: on ? 1 : 0, xw: on ? (hash(f + i * 7) - 0.5) * 24 : 0, hue: on ? hash(i * 3 + f) * 160 : 0 }); });
        A.setRGB(c, c.$.shot, burst ? 2.5 : 0, 0);
      },
      prompt: 'Add glitch bursts: roughly once per second, for ~180ms, offset several seeded-random horizontal slices of the image sideways (up to 12% of the frame) with hue shifts and an RGB split; outside bursts the image is clean.',
    },
    {
      id: 'exposure-flash', name: 'Exposure Flash', aka: ['Overexposure', 'Brightness pop', 'Flash frame'], char: ['Impact', 'Music', 'Energetic'],
      what: 'The image overexposes for a few frames — highlights clip to white, contrast collapses — then recovers. It is an in-camera feeling (a sudden exposure change) rather than a white overlay.',
      good: ['Beat accents in music edits', 'Camera-flash and paparazzi moments', 'Hiding a cut'],
      avoid: 'Repeated rapid flashes (photosensitivity guidelines: avoid more than 3 per second).',
      tf: 'brightness 1 → 2.2 + contrast ↓ + faint white overlay, decaying', extra: '<i data-r="fl" class="flash"></i>',
      render(c, k, t) { const d = (t - 0.8) % 1.2; const e = t > 0.8 ? Math.exp(-d * 6) : 0; c.set(c.$.img, { bright: 1 + 1.2 * e * k, contrast: 1 - 0.3 * e * k }); c.set(c.$.fl, { o: 0.35 * e * k }); },
      prompt: 'Add an exposure flash on the beat: push the shot’s brightness to ~2.2× with reduced contrast and a faint white overlay, then decay exponentially back to normal over ~0.4s. Limit flashes to well under 3 per second.',
    },
    {
      id: 'color-wash', name: 'Color Wash', aka: ['Colour grade shift', 'Tint sweep', 'Duotone wash'], char: ['Stylised', 'Brand', 'Mood'],
      what: 'A colour layer washes over the shot and shifts its mood — here a teal-to-orange grade sweeps in, then a brand-colour tint passes through. Colour moves emotion faster than any object can.',
      good: ['Changing mood between story beats', 'Applying brand colours to footage', 'Music and fashion edits'],
      avoid: 'Harsh tints on skin tones; keep the wash semi-transparent.',
      tf: 'Gradient overlay with mix-blend-mode color/overlay sweeping across + hue drift', extra: '<i data-r="wash" class="cn-wash"></i>',
      render(c, k, t) { c.set(c.$.wash, { o: k * 0.85, xp: lerp(-30, 0, k) + Math.sin(t) * 6 }); c.set(c.$.img, { hue: k * 10 * Math.sin(t * 0.7) }); },
      prompt: 'Wash a colour grade over the shot: slide in a wide teal-to-orange gradient layer in “color” or “overlay” blend mode (≈80% opacity) over 800ms, with a slight hue drift afterwards. Check skin tones stay natural.',
    },
    {
      id: 'gradient-lighting', name: 'Gradient Lighting', aka: ['Moving light', 'Light sweep (scene)', 'Relighting'], char: ['Atmospheric', 'Premium', 'Calm'],
      what: 'A soft pool of light travels across the scene and the shadow side darkens in turn, as if the light source were moving. It changes the time of day or focus without moving the camera.',
      good: ['Product and still-life shots', 'Atmospheric title backgrounds', 'Implying time passing'],
      avoid: 'Fast light movement — it feels like a torch, not the sun.',
      tf: 'Radial light gradient (soft-light/screen) + opposite shadow gradient, both translating slowly', extra: '<i data-r="lgt" class="cn-light"></i><i data-r="shd" class="cn-shade"></i>',
      render(c, k, t) { const x = lerp(-20, 30, clamp((t - 0.8) / 3)); c.set(c.$.lgt, { o: k, xw: x }); c.set(c.$.shd, { o: k * 0.8, xw: x }); },
      prompt: 'Relight the scene: move a large soft radial light (screen/soft-light blend) slowly across the frame over ~3s while a matching shadow gradient darkens the opposite side, as if the light source itself were moving.',
    },
    {
      id: 'shadow-sweep', name: 'Shadow Sweep', aka: ['Blinds shadow', 'Gobo shadow', 'Window light'], char: ['Cinematic', 'Moody', 'Premium'],
      what: 'Shadows of window blinds (a gobo pattern) slide across the scene, as if the sun moved or a car passed outside. A few bars of shadow add time, place and drama to a still shot.',
      good: ['Interiors, products and portraits', 'Noir / moody tone', 'Premium still-life'],
      avoid: 'Hard, high-contrast shadows over text.',
      tf: 'Skewed repeating dark bars (multiply) translating diagonally, softened with blur', img: 'interior', extra: '<i data-r="blinds" class="cn-blinds"></i>',
      render(c, k, t) { c.set(c.$.blinds, { o: k * 0.75, xw: lerp(-40, 20, clamp((t - 0.8) / 3)), blur: 0.8 }); },
      prompt: 'Sweep a window-blind shadow across the scene: a skewed repeating pattern of soft dark bars (multiply blend, slight blur) that slides diagonally over ~3s, as if the light outside shifted. Keep titles out of the darkest bars.',
    },
    {
      id: 'reflection-sweep', name: 'Reflection Sweep', aka: ['Glass reflection', 'Specular sweep', 'Glossy pass'], char: ['Premium', 'Product', 'Polished'],
      what: 'A soft specular highlight glides across a glossy surface (a phone, a bottle, a glass card), revealing its material. Unlike a shimmer on text, it follows the object’s shape and lighting.',
      good: ['Device and glass product shots', 'Glass-UI cards', 'Premium reveals'],
      avoid: 'Hard white bars — keep it soft and angled with the surface.',
      tf: 'Skewed soft white gradient translateX across the object, clipped to its shape', product: true,
      render(c, k, t) { c.set(c.$.refl, { xp: lerp(-160, 160, ((t - 0.8) % 2.2) / 2.2), o: k }); },
      prompt: 'Add a reflection sweep to a glossy product: clip a soft, angled white-to-transparent gradient to the product’s surface and slide it across every ~2.2s, as if light were moving over glass. Keep it soft.',
    },
  ];

  FX.forEach((f) => {
    demo({
      id: f.id, cat: CAT, name: f.name, aka: f.aka, tags: ['image'].concat(f.tags || []), char: f.char, variants: f.variants || null, note: f.note,
      covers: f.variants ? f.variants.length : 1,
      what: f.what, good: f.good, avoid: f.avoid,
      anatomy: ['Finishing layer over the whole shot', f.world ? 'Layered scene' : f.product ? 'Glossy product' : 'Base shot (photo + title)', f.tf, 'Off 0.8s → ramp 0.8s → hold 2.2s', 'smooth ramp; effect-specific timing', 'Before / after inside one timeline'],
      tracks: TRACKS,
      dur: 3.8, poster: 2.6,
      html: () => {
        const b = f.blur ? A.dirBlur() : f.rgb || f.glitch ? A.rgbFilter() : null;
        let base;
        if (f.world) base = `<div class="fill" data-r="shot">${A.landscape()}</div>`;
        else if (f.product) base = `<div class="fill bg-studio" data-r="shot"><div class="center"><div class="cn-prod">${A.product('serum', { style: '--ph:60cqmin' })}<div class="cn-prod__mask"><i data-r="refl" class="cn-refl"></i></div></div></div></div>`;
        else base = BASE(f.img);
        if (b) base = base.replace('data-r="shot"', `data-r="shot" data-filter="${b.id}"`);
        let extra = f.extra || '';
        if (f.glitch) extra += Array.from({ length: 10 }, (_, i) => `<div data-r="gs" class="gl-slice" style="top:${i * 10}%;height:${4 + (i % 3) * 3}%;background-image:url(${A.imgPath('city')});background-position:center calc((100cqh - max(100cqw, 100cqh)) / 2 - ${i * 10}cqh)"></div>`).join('');
        if (f.canvas) extra += '<canvas data-r="cv" class="canvas-fill" style="mix-blend-mode:screen"></canvas>';
        return (b ? b.html : '') + base + `<div class="fill cn-fx">${extra}</div><span data-r="state" class="cn-state"></span>`;
      },
      init(c) { if (f.canvas) c.data.cv = c.canvas(c.$.cv, { cap: f.lowres ? 1 : 1.5 }); if (f.init) f.init(c); },
      render(t, c) {
        const k = c.p.on;
        if (c.$.img) c.set(c.$.img, { s: 1.04 + t * 0.012 });
        f.render(c, k, t);
        const st = k <= 0 ? 'effect off' : k >= 1 ? 'effect on' : 'ramping…';
        if (c.$.state.textContent !== st) c.$.state.textContent = st;
      },
      prompt: f.prompt,
    });
  });
})();
