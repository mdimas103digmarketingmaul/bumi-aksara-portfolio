/* 06 — Camera & Composition
   A tiny 2.5D camera over a layered landscape. Every layer has a distance
   from the camera; scale, parallax and focus blur are derived from it, so
   pan vs truck vs dolly vs zoom behave like real camera moves. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, fbm1, noise1, A } = window.VML;
  const CAT = 'camera';
  const CAM = ['camera'];

  /* distance of each layer (subject = 3 units from the camera) */
  const DEPTH = [['ly-sky', 1e6], ['ly-sun', 1e5], ['ly-far', 12], ['ly-mid', 7], ['ly-near', 4.5], ['ly-subject', 3], ['ly-fg', 1.6]];
  const LS = 3;
  /* cam: x/y = camera travel (truck/pedestal), z = dolly (forward +), f = lens zoom factor,
     pan/tilt = rotation (uniform shift), rot = roll, focus = focus distance, ap = aperture (blur amount) */
  function shoot(c, cam) {
    const { x = 0, y = 0, z = 0, f = 1, pan = 0, tilt = 0, rot = 0, focus = null, ap = 0 } = cam;
    for (const [k, L] of DEPTH) {
      const el = c.$[k];
      if (!el) continue;
      const d = Math.max(0.2, L - z);
      const s = (f * L) / d;
      const par = (f * LS) / d;
      const o = { x: -x * par - pan * f, y: -y * par - tilt * f, s, r: rot };
      if (focus != null) o.blur = Math.min(4, ap * Math.abs(1 / L - 1 / focus) * 10);
      c.set(el, o);
    }
  }
  const world = (extra = '') => A.landscape(undefined, { cls: extra });
  const camLabel = (txt) => `<span class="cam-label" data-r="clabel">${txt}</span>`;

  /* 01 Push in / pull out (dolly vs zoom) */
  demo({
    id: 'camera-push', cat: CAT, name: 'Camera Push In / Pull Out', aka: ['Dolly in', 'Dolly out', 'Zoom (lens)'],
    tags: CAM, char: ['Cinematic', 'Dramatic'],
    variants: [['dolly', 'Dolly push (camera moves)'], ['zoom', 'Lens zoom'], ['pull', 'Dolly pull out']],
    what: 'Moving the camera toward the subject (dolly) and zooming the lens look similar but are not. A dolly changes perspective — the foreground rushes past faster than the mountains. A zoom magnifies everything equally, so depth flattens. Switch variants and watch the foreground plants.',
    good: ['Dolly push: building tension, entering a world', 'Zoom: fast emphasis, documentary/observational feel', 'Pull out: reveals and endings'],
    avoid: 'Fast digital zooms on stills — it reads as cheap. Prefer slow, eased dolly-style scaling with depth layers.',
    anatomy: ['Scene time', 'Six depth layers', 'Dolly: per-layer scale = L/(L − z) · Zoom: uniform scale', '3s', 'smooth', 'One continuous move'],
    covers: 3,
    tracks: (v) => [['cam', v === 'zoom' ? 'Lens zoom 1 → 1.45' : v === 'pull' ? 'Dolly out' : 'Dolly in', 0.3, 3, 'smooth'], ['hold', 'Hold', '>', 0.6, 'linear']],
    html: (v) => world() + camLabel(v === 'zoom' ? 'zoom · uniform scale · no parallax' : 'dolly · near layers grow faster'),
    render(t, c) {
      const p = c.p.cam;
      if (c.v === 'zoom') shoot(c, { f: lerp(1, 1.45, p) });
      else shoot(c, { z: c.v === 'pull' ? lerp(1.1, 0, p) : lerp(0, 1.1, p) });
    },
    prompt: (v) => v === 'zoom'
      ? 'Simulate a lens zoom: scale every layer of the scene uniformly from 1 to 1.45 over 3s with a smooth in-out ease. Because it is a zoom, there is no parallax — depth flattens.'
      : `Simulate a camera dolly ${v === 'pull' ? 'pull-out' : 'push-in'} on a layered 2.5D scene: give each layer a distance from the camera and scale it by distance / (distance − cameraZ), moving cameraZ ${v === 'pull' ? 'from 1.1 to 0' : 'from 0 to 1.1'} over 3s with a smooth in-out ease, so foreground layers grow much faster than the background.`,
  });

  /* 02 Pan / tilt */
  demo({
    id: 'camera-pan', cat: CAT, name: 'Camera Pan / Tilt', aka: ['Pan', 'Tilt', 'Swivel'],
    tags: CAM, char: ['Cinematic', 'Exploratory', 'Calm'],
    variants: [['pan', 'Pan (horizontal)'], ['tilt', 'Tilt (vertical)']],
    what: 'The camera rotates on its tripod: left/right is a pan, up/down is a tilt. Because the camera does not travel, all layers shift together — there is no parallax. That is the key difference from a truck move.',
    good: ['Following action or revealing the rest of a scene', 'Tilt up: revealing height, a title in the sky', 'Calm establishing shots'],
    avoid: 'Expecting depth from a pan — if you want parallax, truck instead.',
    anatomy: ['Scene time', 'All layers', 'Uniform translate (no depth difference)', '3.2s', 'smooth', 'One continuous move'],
    covers: 2,
    tracks: (v) => [['cam', v === 'pan' ? 'Pan left → right' : 'Tilt down → up', 0.3, 3.2, 'smooth'], ['hold', 'Hold', '>', 0.6, 'linear']],
    html: (v) => world() + camLabel('rotation · every layer moves together') + (v === 'tilt' ? '<div class="cam-sky-title" data-r="skyt"><b class="t-serif"><i>Higher</i></b></div>' : ''),
    render(t, c) {
      const p = c.p.cam;
      if (c.v === 'pan') shoot(c, { pan: lerp(7, -7, p), f: 1.12 });
      else {
        shoot(c, { tilt: lerp(6, -8, p), f: 1.14 });
        c.set(c.$.skyt, { y: lerp(-14, 8, p) - 0, o: clamp(p * 1.5) });
      }
    },
    prompt: (v) => `Simulate a camera ${v}: the camera rotates without travelling, so translate every layer of the scene by the same amount (${v === 'pan' ? 'horizontally' : 'vertically'}) over 3.2s with a smooth in-out ease. Slightly over-scale the scene so edges never show. No parallax between layers.`,
  });

  /* 03 Truck / pedestal */
  demo({
    id: 'camera-truck', cat: CAT, name: 'Camera Truck / Slide', aka: ['Truck', 'Tracking shot', 'Pedestal (vertical)', 'Slider shot'],
    tags: CAM, char: ['Cinematic', 'Premium', 'Immersive'],
    variants: [['truck', 'Truck (sideways)'], ['ped', 'Pedestal (up)']],
    what: 'The camera physically travels sideways (truck) or up (pedestal) — like a camera on a slider. Near layers sweep past quickly, far layers barely move. That difference (parallax) is what makes a 2D frame feel deep.',
    good: ['Premium product and landscape shots', 'Reveals from behind a foreground object', 'Making layered stills feel filmed'],
    avoid: 'Large moves with few layers — gaps between layers become visible.',
    anatomy: ['Scene time', 'Six depth layers', 'translate ∝ 1/distance (parallax)', '3.4s', 'smooth', 'One continuous move'],
    covers: 2,
    tracks: (v) => [['cam', v === 'truck' ? 'Truck right' : 'Pedestal up', 0.3, 3.4, 'smooth'], ['hold', 'Hold', '>', 0.6, 'linear']],
    html: () => world() + camLabel('travel · near layers move more'),
    render(t, c) {
      const p = c.p.cam;
      if (c.v === 'truck') shoot(c, { x: lerp(-4, 4, p), f: 1.08 });
      else shoot(c, { y: lerp(3, -4, p), f: 1.08 });
    },
    prompt: (v) => `Simulate a camera ${v === 'truck' ? 'truck (sideways slider move)' : 'pedestal (vertical crane move)'} over a layered scene: translate each layer by an amount inversely proportional to its distance from the camera (foreground ≈ 2×, subject 1×, mountains ≈ 0.25×, sky 0) over 3.4s with a smooth in-out ease, so near layers sweep past while the background barely moves.`,
  });

  /* 04 Orbit simulation */
  demo({
    id: 'camera-orbit', cat: CAT, name: 'Camera Orbit Simulation', aka: ['Arc shot', 'Orbit around subject', '2.5D orbit'],
    tags: CAM.concat('advanced'), char: ['Cinematic', 'Premium', 'Hero'],
    what: 'The camera circles the subject: it trucks sideways while panning back to keep the subject centred. The result — foreground and background slide in opposite directions around a fixed subject — is the signature of an orbit shot. 2.5D approximation.',
    good: ['Hero product and character moments', 'Making a single subject feel monumental', 'Looping showcase shots'],
    avoid: 'Flat artwork without depth layers — without parallax an orbit just looks like a slide.',
    anatomy: ['Scene time (loop)', 'All layers + subject', 'Truck x = sin(θ) combined with counter-pan; slight roll', '5s per arc', 'Sine (seamless)', 'Foreground and background move opposite around the subject'],
    tracks: [['orbit', 'Orbit arc (seamless)', 0, 5, 'linear']],
    dur: 5, poster: 1.25,
    note: '2.5D approximation: layers slide around a fixed subject; a true orbit needs a 3D scene.',
    html: () => world() + camLabel('truck + counter-pan · subject stays fixed'),
    render(t, c) {
      const a = Math.sin(c.r.orbit * Math.PI * 2);
      shoot(c, { x: a * 5, pan: -a * 5, f: 1.1, rot: a * 0.6 });
    },
    prompt: 'Simulate a 2.5D orbit around the subject: truck the camera sideways (layer offset ∝ 1/distance) while panning back by the same amount at the subject distance, so the subject stays centred and the foreground and background slide in opposite directions. Drive it with a sine over a 5s seamless loop and add a tiny roll.',
  });

  /* 05 Dolly zoom */
  demo({
    id: 'dolly-zoom', cat: CAT, name: 'Dolly Zoom Concept', aka: ['Vertigo effect', 'Contra-zoom', 'Trombone shot'],
    tags: CAM.concat('advanced'), char: ['Dramatic', 'Unsettling', 'Cinematic'],
    what: 'The camera moves back while the lens zooms in at exactly the rate that keeps the subject the same size. The subject stays put, but the background looms larger and perspective warps — the feeling of a realisation or vertigo.',
    good: ['A moment of realisation or shock', 'Dramatic reveals', 'Stylised storytelling'],
    avoid: 'Overuse — it is one of the most recognisable shots in film; use it once, at the right moment.',
    anatomy: ['Scene time', 'All layers (subject reference size)', 'Dolly back (z −) + zoom in (f) with f = (Ls − z)/Ls', '3s', 'smooth', 'Single dramatic move'],
    tracks: [['dz', 'Dolly back + zoom in', 0.4, 3, 'smooth'], ['hold', 'Hold', '>', 0.8, 'linear']],
    note: 'Simplified concept using depth layers. A real dolly zoom is done in-camera with a zoom lens and a dolly or slider.',
    html: () => world() + camLabel('subject constant · background grows') + '<i class="dz-ref"></i>',
    render(t, c) {
      const z = lerp(0, -2.2, c.p.dz);
      shoot(c, { z, f: (LS - z) / LS });
    },
    prompt: 'Simulate a dolly zoom on a layered scene: move the camera back (cameraZ 0 → −2.2) while increasing the lens zoom so the subject’s projected size stays constant (zoom = (subjectDistance − cameraZ) / subjectDistance). Each layer scales by zoom × distance / (distance − cameraZ). Run it over 3s with a smooth ease; the background should grow while the subject holds its size.',
  });

  /* 06 Handheld */
  demo({
    id: 'handheld', cat: CAT, name: 'Handheld Motion', aka: ['Camera drift', 'Organic camera', 'Breathing camera'],
    tags: CAM, char: ['Documentary', 'Natural', 'Intimate'],
    variants: [['subtle', 'Subtle'], ['doc', 'Documentary']],
    what: 'Very small, slow, random drift in position and rotation, like a person holding the camera and breathing. It removes the “too perfect” digital stillness from a shot. The secret is smooth noise at low frequency — never random jitter.',
    good: ['Making motion-graphics composites feel filmed', 'Documentary, UGC and lifestyle tone', 'Adding life to still compositions'],
    avoid: 'Strong or fast shake — it causes motion sickness and reads as an error. Keep it under ~1% of the frame.',
    anatomy: ['Continuous', 'Whole camera', 'translate x/y + roll from layered smooth noise', '≈0.3–0.5 Hz drift', 'Noise (smooth)', 'Constant, never repeating exactly'],
    tracks: [['hh', 'Handheld drift', 0, 6, 'linear', 'camera']],
    dur: 6, poster: 2,
    html: () => world() + camLabel('low-frequency noise · tiny amplitude'),
    render(t, c) {
      const k = c.v === 'doc' ? 1.9 : 1;
      shoot(c, { pan: fbm1(t * 0.45) * 1.2 * k, tilt: fbm1(t * 0.4 + 20) * 0.9 * k, rot: fbm1(t * 0.35 + 40) * 0.5 * k, f: 1.06, x: fbm1(t * 0.3 + 9) * 0.6 * k });
    },
    prompt: (v) => `Add ${v === 'doc' ? 'documentary-style' : 'very subtle'} handheld camera motion: drive x/y offset and roll with layered smooth noise (not random jitter) at about 0.3–0.5 Hz. Keep amplitude ${v === 'doc' ? 'around 1–1.5%' : 'under 1%'} of the frame and roll under ${v === 'doc' ? '1°' : '0.5°'}, and over-scale the shot ~6% so edges never show.`,
  });

  /* 07 Camera shake (impact) */
  demo({
    id: 'camera-shake', cat: CAT, name: 'Camera Shake', aka: ['Impact shake', 'Screen shake', 'Hit shake'],
    tags: CAM.concat('social'), char: ['Energetic', 'Impactful', 'Punchy'],
    what: 'A short, violent shake triggered by an impact, decaying to nothing in a fraction of a second. Unlike handheld drift it is event-driven: it sells weight and force — a heavy object landing, a bass drop, a big number.',
    good: ['Impacts and drops (products, titles, numbers)', 'Beat drops in music edits', 'Game-like and sports energy'],
    avoid: 'Shaking for long or without a cause; also avoid on text the viewer must read during the shake.',
    anatomy: ['Event (impact)', 'Whole frame', 'translate + roll, high frequency, exponential decay', '≈0.35s per impact', 'Decay envelope e^(−kt)', 'Drop → impact → shake → settle (second smaller bounce)'],
    tracks: [['drop', 'Box falls', 0.3, 0.55, 'expo.in'], ['hit', 'Impact', '>', 0, 'linear', 'beat'], ['shake', 'Shake (decay)', '<', 0.4, 'linear', 'camera'], ['bounce', 'Small bounce', '<', 0.4, 'linear', 'object'], ['dust', 'Dust puff', '<', 0.7, 'expo.out', 'fx'], ['title', 'Title', '<0.2', 0.5, 'back.soft'], ['hold', 'Hold', '>', 0.9, 'linear']],
    cls: 'bg-studio-warm',
    html: `<div data-r="frame" class="fill"><div class="shake-floor"></div>
      <div class="center"><div data-r="dust" class="shake-dust"><i></i><i></i><i></i><i></i></div></div>
      <div class="center"><div data-r="box" style="margin-top:6cqmin">${A.product('box', { style: '--ph:46cqmin' })}</div></div>
      <div class="stackc" style="justify-content:flex-start;padding-top:12cqmin"><b data-r="title" class="t-display" style="font-size:15cqmin">Heavy<br/>flavour.</b></div></div>`,
    render(t, c) {
      const fall = c.p.drop;
      const bt = c.r.bounce;
      const bounce = bt > 0 && bt < 1 ? Math.sin(bt * Math.PI) * 6 * (1 - bt) : 0;
      c.set(c.$.box, { yh: lerp(-80, 0, fall) - bounce, sy: bt > 0 && bt < 0.15 ? 0.9 : 1, r: lerp(-8, 0, fall) });
      const st = t - c.tl.map.shake.start;
      const amp = st > 0 ? Math.exp(-st * 9) * 3.2 : 0;
      c.set(c.$.frame, { x: Math.sin(st * 70) * amp, y: Math.cos(st * 57) * amp * 0.8, r: Math.sin(st * 40) * amp * 0.35 });
      c.set(c.$.dust, { s: lerp(0.4, 1.6, c.p.dust), o: c.r.dust > 0 ? 1 - c.p.dust : 0 });
      c.set(c.$.title, { s: lerp(0.7, 1, c.p.title), o: c.p.title });
    },
    prompt: 'Add an impact camera shake: when the product lands (it falls with an expo-in ease), shake the whole frame with high-frequency sine offsets (x, y and a little roll) multiplied by an exponential decay envelope (≈ e^(−9t)), lasting about 0.35s. Add a small rebound on the product and a dust puff that scales out and fades. Bring the title in just after the shake.',
  });

  /* 08 Whip pan */
  const WP = ['alpine', 'city', 'dunes'];
  demo({
    id: 'whip-pan', cat: CAT, name: 'Whip Pan', aka: ['Swish pan', 'Flash pan', 'Fast pan'],
    tags: CAM.concat('transition', 'social'), char: ['Energetic', 'Dynamic', 'Social'],
    what: 'An extremely fast pan that smears the image with directional motion blur. Here the camera whips from one location to the next along a panorama: accelerate hard, blur at peak speed, decelerate into the next frame. Blur strength follows the speed.',
    good: ['Travel and lifestyle montages', 'Energetic transitions between locations', 'Comedic “meanwhile…” cuts'],
    avoid: 'Whips without blur — they look like a glitchy slide.',
    anatomy: ['Scene time', 'Panorama of three photos', 'translateX one frame per whip + horizontal blur ∝ speed', '0.45s whip · 1s hold', 'expo.inOut', 'Hold → whip → hold → whip → hold'],
    tracks: [['w1', 'Whip 1', 1, 0.45, 'expo.inOut'], ['w2', 'Whip 2', '+=1', 0.45, 'expo.inOut'], ['hold', 'Hold', '>', 1, 'linear']],
    html: () => {
      const b = A.dirBlur();
      return `${b.html}<div class="whip" data-r="strip" data-filter="${b.id}">${WP.map((n) => `<div class="whip__cell">${A.photo(n, { cls: 'fill' })}</div>`).join('')}</div>${camLabel('blur strength = speed')}`;
    },
    render(t, c) {
      const pos = c.p.w1 + c.p.w2;
      c.set(c.$.strip, { xp: (-pos * 100) / WP.length });
      const v = c.speed('w1') + c.speed('w2');
      A.setDirBlur(c, c.$.strip, c.$.mbf, v * 2.2, 0);
    },
    prompt: 'Create a whip pan between locations laid out as a horizontal panorama: hold each frame ~1s, then whip to the next over ~450ms with an expo in-out ease. Apply a horizontal-only motion blur whose strength follows the instantaneous speed (0 at rest, strongest at mid-whip), using an SVG feGaussianBlur with stdDeviation "x 0". Avoid camera shake.',
  });

  /* 09 Focus pull */
  demo({
    id: 'focus-pull', cat: CAT, name: 'Focus Pull', aka: ['Pull focus', 'Focus in', 'Bring into focus'],
    tags: CAM, char: ['Cinematic', 'Dreamy', 'Intimate'],
    what: 'The shot starts soft and the focus is pulled until the subject is sharp, while the foreground stays soft. It is a reveal made with the lens: the viewer’s attention arrives exactly when the subject sharpens.',
    good: ['Opening shots and reveals', 'Directing attention to a person or product', 'Calm, cinematic intros'],
    avoid: 'Pulling focus on text — use a text blur reveal instead.',
    anatomy: ['Scene time', 'All layers (blur by distance from focus plane)', 'Focus distance 1.2 → 3 (subject)', '2.2s', 'smooth', 'Everything soft → subject sharp; foreground stays soft'],
    tracks: [['focus', 'Focus pull → subject', 0.5, 2.2, 'smooth'], ['hold', 'Hold', '>', 0.9, 'linear']],
    html: () => world() + camLabel('focus plane → subject'),
    render(t, c) {
      shoot(c, { f: 1.08, z: c.p.focus * 0.15, focus: lerp(1.2, 3, c.p.focus), ap: 1.2 });
    },
    prompt: 'Simulate a focus pull on a layered scene: blur each layer in proportion to |1/distance − 1/focusDistance| and animate the focus distance from very near (everything soft) to the subject over 2.2s with a smooth ease, so the subject becomes sharp while the foreground stays soft. Add a very slight push-in at the same time.',
  });

  /* 10 Depth parallax (2.5D) */
  demo({
    id: 'depth-parallax', cat: CAT, name: 'Depth Parallax', aka: ['2.5D camera', '3D photo', 'Camera projection (fake)'],
    tags: CAM.concat('advanced'), char: ['Immersive', 'Cinematic', 'Loop'],
    what: 'The camera drifts in a small circle while slowly pushing in, over a scene with depth of field. Parallax in two axes plus soft focus on far and near layers makes a flat illustration feel like a 3D set. This is how “3D photo” and photo-to-video effects work.',
    good: ['Hero loops and backgrounds', 'Turning stills or illustrations into video', 'Atmospheric intros'],
    avoid: 'Large circular moves — keep the orbit small or layer edges show.',
    anatomy: ['Continuous loop', 'Six layers', 'Camera x/y on a circle + gentle dolly; blur by depth', '6s loop', 'Sine (seamless)', 'Seamless circular drift'],
    tracks: [['loop', 'Circular drift (seamless)', 0, 6, 'linear', 'camera']],
    dur: 6, poster: 1.5,
    html: () => world() + camLabel('x/y parallax + depth of field'),
    render(t, c) {
      const a = c.r.loop * Math.PI * 2;
      shoot(c, { x: Math.cos(a) * 2.2, y: Math.sin(a) * 1.2, z: 0.25 + Math.sin(a) * 0.12, f: 1.08, focus: 3, ap: 0.7 });
    },
    prompt: 'Create a 2.5D depth-parallax loop: move a virtual camera in a small circle (x ±2%, y ±1%) with a gentle in-out dolly over a 6s seamless loop. Offset each depth layer in proportion to 1/distance and blur layers by their distance from the subject’s focus plane, so the still feels like a 3D set.',
  });

  /* 11 Rack focus */
  demo({
    id: 'rack-focus', cat: CAT, name: 'Rack Focus', aka: ['Focus shift', 'Focus rack', 'Pull between subjects'],
    tags: CAM, char: ['Cinematic', 'Storytelling', 'Elegant'],
    what: 'Focus jumps deliberately from one subject to another at a different depth — here from the foreground plants to the hiker and then to the mountains. It is an edit inside a single shot: the meaning moves with the focus.',
    good: ['Linking two subjects (product → person)', 'Revealing what matters after a setup', 'Calm cinematic storytelling'],
    avoid: 'Racking too often — each focus point needs to hold long enough to register.',
    anatomy: ['Scene time', 'All layers', 'Focus distance 1.6 → 3 → 12', '0.6s rack · 0.9s holds', 'smooth', 'Foreground → subject → background'],
    tracks: [['h0', 'Hold · foreground', 0.1, 0.9, 'linear', 'hold'], ['f1', 'Rack → subject', '>', 0.6, 'smooth'], ['h1', 'Hold · subject', '>', 0.9, 'linear', 'hold'], ['f2', 'Rack → mountains', '>', 0.6, 'smooth'], ['h2', 'Hold · mountains', '>', 0.9, 'linear', 'hold']],
    html: () => world() + camLabel('focus: foreground → subject → far') + '<div class="rack-tags"><span data-r="rt">foreground</span><span data-r="rt">subject</span><span data-r="rt">mountains</span></div>',
    render(t, c) {
      const inv = lerp(lerp(1 / 1.6, 1 / 3, c.p.f1), 1 / 12, c.p.f2);
      shoot(c, { f: 1.06, focus: 1 / inv, ap: 1.3 });
      const which = c.r.f2 > 0.5 ? 2 : c.r.f1 > 0.5 ? 1 : 0;
      c.$$.rt.forEach((el, i) => el.classList.toggle('on', i === which));
    },
    prompt: 'Simulate a rack focus across three depths: blur every layer in proportion to |1/distance − 1/focusDistance|. Start focused on the foreground plants, rack to the subject over 600ms (smooth ease), hold 0.9s, then rack to the distant mountains and hold. Interpolate in 1/distance (diopters) so the rack feels optical.',
  });
})();
