/* 15 — Advanced / Experimental
   Shader demos render through the single shared WebGL context (core/gl.js)
   and start only when scrolled near. Canvas demos compute everything from
   time, so they scrub. Approximations are labelled as such. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, rng, noise1, noise2, A, GL } = window.VML;
  const CAT = 'advanced';
  const ADV = ['advanced'];

  const fallback = '<span data-r="fb" class="fallback-note" hidden>WebGL is not available in this browser — showing the still image.</span>';

  /* ---------- shader demo factory ---------- */
  function shader(def) {
    const imgs = def.images || ['dunes'];
    demo({
      id: def.id, cat: CAT, name: def.name, aka: def.aka, tags: ADV.concat(def.tags || ['image']), char: def.char, note: def.note,
      what: def.what, good: def.good, avoid: def.avoid, anatomy: def.anatomy, prompt: def.prompt,
      tracks: def.tracks, dur: def.dur, poster: def.poster, variants: def.variants || null,
      html: `${A.photo(imgs[0], { r: 'still', cls: 'fill' })}<canvas data-r="cv" class="canvas-fill"></canvas>${def.overlay || ''}${fallback}`,
      init(c) {
        c.data.cv = c.canvas(c.$.cv, { webgl: true });
        c.data.cv.g = c.$.cv.getContext('2d');
        c.data.tex = {};
        imgs.forEach((name, i) => A.loadImage(A.imgPath(name)).then((img) => { c.data.tex['u_tex' + i] = { src: A.imgPath(name), img }; c.data.ready = Object.keys(c.data.tex).length === imgs.length; }));
      },
      resize(c) { if (c.data.cv) c.data.cv.g.setTransform(c.data.cv.dpr, 0, 0, c.data.cv.dpr, 0, 0); },
      render(t, c) {
        if (def.renderDom) def.renderDom(t, c);
        if (!c.data.ready) return;
        const ok = GL.draw(c.data.cv, def.id, def.frag, Object.assign({ u_time: t }, def.uniforms(t, c)), c.data.tex);
        c.$.cv.style.opacity = ok ? 1 : 0;
        c.$.fb.hidden = ok;
      },
    });
  }

  shader({
    id: 'noise-displacement', name: 'Noise Displacement', aka: ['Noise warp', 'Turbulent displacement', 'Heat haze'],
    char: ['Experimental', 'Organic', 'Dreamy'],
    what: 'Every pixel is pushed by a smooth, moving noise field, so the photo wobbles like heat haze or seen through water. The amount ramps up, holds, then calms back to the clean image.',
    good: ['Dreamy transitions and flashbacks', 'Heat / desert / water atmospheres', 'Music visuals'],
    avoid: 'Strong displacement on faces or text — it quickly becomes grotesque.',
    anatomy: ['Scene time', 'Whole image (fragment shader)', 'uv += (fbm(uv, t) − 0.5) × amount', 'Ramp 1s · hold 1.4s · ramp down 1s', 'smooth', 'Clean → warped → clean'],
    tracks: [['in', 'Distortion in', 0.3, 1, 'smooth', 'fx'], ['hold', 'Hold', '>', 1.4, 'linear', 'fx'], ['out', 'Distortion out', '>', 1, 'smooth', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform float u_amt;
      void main(){ vec2 uv = cover(v_uv);
        vec2 off = vec2(fbm(uv * 3.0 + vec2(u_time * 0.2, 0.0)), fbm(uv * 3.0 + vec2(0.0, u_time * 0.2) + 7.3)) - 0.5;
        gl_FragColor = texture2D(u_tex0, clamp(uv + off * u_amt, 0.001, 0.999)); }`,
    uniforms: (t, c) => ({ u_amt: 0.12 * c.p.in * (1 - c.p.out) }),
    prompt: 'Write a WebGL fragment shader that displaces the image UVs by a moving fractal-noise field: uv += (vec2(fbm(uv*3 + t*0.2), fbm(uv*3 + offset)) − 0.5) × amount. Ramp the amount from 0 to ~0.12 over 1s, hold, and ease back to 0 so it ends clean.',
  });

  shader({
    id: 'image-displacement', name: 'Image Displacement', aka: ['Displacement map', 'Texture-driven warp', 'Map distortion'],
    images: ['dunes', 'fabric'], char: ['Experimental', 'Graphic', 'Fashion'],
    what: 'A second image (here a fabric texture) is used as a displacement map: its brightness decides how far each pixel of the photo is pushed. The map scrolls slowly, so the distortion has the shape and rhythm of the texture.',
    good: ['Fashion and editorial transitions', 'Branded textures distorting footage', 'Glass / fabric / water looks'],
    avoid: 'High-contrast maps at high strength — the image tears apart.',
    anatomy: ['Scene time', 'Photo + displacement map texture', 'uv += (map.r − 0.5) × strength; map scrolls', 'Ramp 1s · hold', 'smooth', 'Clean → displaced by the map'],
    tracks: [['in', 'Map strength in', 0.3, 1, 'smooth', 'fx'], ['hold', 'Hold (map scrolls)', '>', 2.2, 'linear', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform sampler2D u_tex1; uniform float u_amt;
      void main(){ vec2 uv = cover(v_uv);
        float m = texture2D(u_tex1, fract(uv + vec2(u_time * 0.04, u_time * 0.02))).r;
        gl_FragColor = texture2D(u_tex0, clamp(uv + vec2(m - 0.5, (m - 0.5) * 0.6) * u_amt, 0.001, 0.999)); }`,
    uniforms: (t, c) => ({ u_amt: 0.18 * c.p.in }),
    prompt: 'Displace a photo with a second texture as a displacement map in a fragment shader: sample the map’s red channel at slowly scrolling UVs and offset the photo’s UVs by (map − 0.5) × strength, ramping strength from 0 to ~0.18 over 1s.',
  });

  shader({
    id: 'liquid-distortion', name: 'Liquid Distortion', aka: ['Domain warping', 'Liquid warp', 'Fluid shader'],
    char: ['Fluid', 'Psychedelic', 'Premium'],
    what: 'Noise is fed back into noise (“domain warping”), producing slow, swirling, liquid-like flows that drag the image along. It looks like the photo is printed on moving liquid — a classic premium shader look.',
    good: ['Luxury and beauty backgrounds', 'Music and art visuals', 'Slow ambient loops'],
    avoid: 'Fast speeds; liquid looks best slow.',
    anatomy: ['Continuous', 'Whole image', 'q = fbm(uv); r = fbm(uv + 4q); uv += (r − 0.5) × amount', 'Slow continuous drift', 'Implicit (noise)', 'Ramps in, then flows'],
    tracks: [['in', 'Liquid in', 0.2, 1.2, 'smooth', 'fx'], ['flow', 'Flow', '>', 3, 'linear', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform float u_amt;
      void main(){ vec2 uv = cover(v_uv); float t = u_time * 0.12;
        vec2 q = vec2(fbm(uv * 2.5 + t), fbm(uv * 2.5 + vec2(5.2, 1.3) - t));
        vec2 r = vec2(fbm(uv * 2.5 + 4.0 * q + vec2(1.7, 9.2) + t), fbm(uv * 2.5 + 4.0 * q + vec2(8.3, 2.8)));
        gl_FragColor = texture2D(u_tex0, clamp(uv + (r - 0.5) * u_amt, 0.001, 0.999)); }`,
    images: ['fabric'],
    uniforms: (t, c) => ({ u_amt: 0.35 * c.p.in }),
    prompt: 'Create a liquid distortion shader with domain warping: q = vec2(fbm(uv*2.5 + t), fbm(uv*2.5 + k1 − t)); r = vec2(fbm(uv*2.5 + 4q + k2 + t), fbm(uv*2.5 + 4q + k3)); sample the image at uv + (r − 0.5) × amount. Keep time slow (t = seconds × 0.12).',
  });

  shader({
    id: 'ripple-distortion', name: 'Ripple Distortion', aka: ['Water ripple', 'Shockwave', 'Drop ripple'],
    char: ['Playful', 'Water', 'Impact'],
    what: 'Concentric ripples spread from the centre, bending the image like a drop hitting water. The ring radius grows over time and the waves fade with distance. A highlight on the crests sells the water.',
    good: ['Impact / beat moments (shockwave)', 'Water, drinks and skincare', 'Tap feedback in creative UI'],
    avoid: 'Continuous ripples everywhere — it becomes nauseating.',
    anatomy: ['Event (drop)', 'Whole image', 'uv += dir × sin(dist × 45 − t × 7) × falloff, limited to the expanding front', 'Front 2.4s', 'expo.out (radius)', 'Drop → rings expand → fade'],
    tracks: [['drop', 'Drop', 0.4, 0, 'linear', 'beat'], ['ring', 'Ripple expands', '<', 2.4, 'expo.out', 'fx'], ['hold', 'Settle', '>', 0.6, 'linear']],
    frag: `uniform sampler2D u_tex0; uniform float u_rad; uniform float u_amt;
      void main(){ vec2 uv = cover(v_uv); vec2 p = (v_uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);
        float L = length(p); float front = smoothstep(u_rad, u_rad - 0.25, L);
        float w = sin(L * 45.0 - u_time * 7.0) * exp(-L * 2.0) * front * u_amt;
        uv += normalize(p + 1e-5) * w * 0.03;
        vec4 col = texture2D(u_tex0, clamp(uv, 0.001, 0.999)); col.rgb += w * 0.35; gl_FragColor = col; }`,
    images: ['ocean'],
    uniforms: (t, c) => ({ u_rad: lerp(0, 1.4, c.p.ring), u_amt: c.r.ring > 0 ? 1 - c.r.ring * 0.7 : 0 }),
    prompt: 'Write a ripple shader: from the centre, offset UVs radially by sin(distance × 45 − time × 7) × exp(−2 × distance), only inside an expanding front whose radius grows with an expo-out ease over 2.4s, with the amplitude fading out. Brighten the crests slightly to read as water.',
  });

  shader({
    id: 'wave-distortion', name: 'Wave Distortion', aka: ['Sine warp', 'Flag wave', 'Wobble'],
    char: ['Playful', 'Retro', 'Loop'],
    what: 'The image bends along travelling sine waves on both axes, like a flag or a reflection on water. The simplest distortion shader — and the clearest way to learn how UV offsets work.',
    good: ['Retro and playful edits', 'Flags, banners, reflections', 'Learning shader basics'],
    avoid: 'Text-heavy frames.',
    anatomy: ['Continuous', 'Whole image', 'uv.x += sin(uv.y × 18 + t × 3) × a; uv.y += sin(uv.x × 12 + t × 2) × a/2', 'Continuous', 'Linear time', 'Ramps in, then waves'],
    tracks: [['in', 'Wave in', 0.2, 1, 'smooth', 'fx'], ['wave', 'Waves', '>', 2.8, 'linear', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform float u_amt;
      void main(){ vec2 uv = cover(v_uv);
        uv.x += sin(uv.y * 18.0 + u_time * 3.0) * 0.02 * u_amt; uv.y += sin(uv.x * 12.0 + u_time * 2.0) * 0.01 * u_amt;
        gl_FragColor = texture2D(u_tex0, clamp(uv, 0.001, 0.999)); }`,
    images: ['city'],
    uniforms: (t, c) => ({ u_amt: c.p.in }),
    prompt: 'Write a wave distortion shader: uv.x += sin(uv.y × 18 + time × 3) × 0.02 and uv.y += sin(uv.x × 12 + time × 2) × 0.01, multiplied by an amount that ramps from 0 to 1 over 1s.',
  });

  shader({
    id: 'glass-refraction', name: 'Glass Refraction Approximation', aka: ['Lens blob', 'Glass orb', 'Magnifier'],
    char: ['Premium', 'Tech', 'Experimental'],
    what: 'A glass orb drifts over the image: inside it the image is magnified and bent toward the edges, with a bright rim and a soft highlight. A believable approximation of refraction using one magnification formula, not ray tracing.',
    good: ['Glassmorphism and premium tech visuals', 'Highlighting a detail of an image', 'Product “lens” moments'],
    avoid: 'Claiming physical accuracy; it is a stylised approximation.',
    anatomy: ['Continuous', 'Image + moving circular lens', 'Inside radius: uv = c + (p − c) × (0.55 + 0.45 r²); rim light at the edge', 'Lens drifts on a slow Lissajous path', 'Sine', 'Lens appears → drifts'],
    note: 'Approximation: magnification + edge bending, not physically based refraction.',
    tracks: [['in', 'Lens appears', 0.2, 0.8, 'back.out', 'fx'], ['drift', 'Lens drift', '>', 3, 'linear', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform vec2 u_c; uniform float u_r;
      void main(){ vec2 a = vec2(u_res.x / u_res.y, 1.0); vec2 p = v_uv * a; vec2 c = u_c * a;
        vec2 d = p - c; float r = length(d) / max(u_r, 0.001); vec2 uv = v_uv;
        vec4 col;
        if (r < 1.0) { float k = 0.55 + 0.45 * r * r; vec2 q = (c + d * k) / a; col = texture2D(u_tex0, cover(q));
          col.rgb += smoothstep(0.8, 1.0, r) * 0.35 + smoothstep(0.35, 0.0, length(d / max(u_r, 0.001) - vec2(-0.35, 0.35))) * 0.25; }
        else { col = texture2D(u_tex0, cover(uv)); col.rgb *= 1.0 - smoothstep(1.15, 1.0, r) * 0.25; }
        gl_FragColor = col; }`,
    images: ['city'],
    uniforms: (t, c) => ({ u_c: [0.5 + 0.22 * Math.sin(t * 0.7), 0.5 + 0.18 * Math.cos(t * 0.5)], u_r: 0.28 * c.p.in }),
    prompt: 'Approximate a glass orb in a fragment shader: inside a moving circle, sample the image at c + (p − c) × (0.55 + 0.45 r²) (magnified centre, compressed edge), add a bright rim near the edge and a small specular highlight, and darken slightly just outside the circle as a soft shadow. Move the orb on a slow Lissajous path.',
  });

  shader({
    id: 'shader-transition', name: 'WebGL Shader Transition', aka: ['Noise dissolve', 'Burn dissolve', 'GPU transition'],
    images: ['dunes', 'city'], char: ['Experimental', 'Premium', 'Tech'],
    what: 'Scene A dissolves into Scene B through a noise threshold: wherever the noise value is below the progress, B shows through, and a hot glowing edge marks the boundary. A GPU transition is computed per pixel, so any pattern is possible.',
    good: ['Premium transitions in brand films', 'Tech and gaming edits', 'Burn / magic / energy themes'],
    avoid: 'Overly busy noise at small sizes — use larger noise scales on mobile.',
    anatomy: ['Cut point', 'Scene A + Scene B textures', 'mix(A, B, step(noise, progress)) + glow where |noise − progress| < edge', '1.6s', 'smooth', 'Hold A → dissolve → hold B'],
    tracks: [['ha', 'Scene A', 0, 0.8, 'linear', 'image'], ['tr', 'Shader dissolve', '>', 1.6, 'smooth', 'fx'], ['hb', 'Scene B', '>', 1, 'linear', 'image']],
    frag: `uniform sampler2D u_tex0; uniform sampler2D u_tex1; uniform float u_prog;
      void main(){ vec2 uv = cover(v_uv); float n = fbm(uv * 4.0);
        float thr = u_prog * 1.2 - 0.1; vec4 a = texture2D(u_tex0, uv); vec4 b = texture2D(u_tex1, uv);
        float m = smoothstep(thr + 0.02, thr - 0.02, n); vec4 col = mix(a, b, m);
        float e = 1.0 - smoothstep(0.0, 0.05, abs(n - thr)); col.rgb += vec3(1.0, 0.45, 0.15) * e * step(0.001, u_prog) * step(u_prog, 0.999) * 1.4;
        gl_FragColor = col; }`,
    uniforms: (t, c) => ({ u_prog: c.p.tr }),
    prompt: 'Write a noise-dissolve transition shader: compute n = fbm(uv × 4); show scene B where n < threshold (threshold = progress × 1.2 − 0.1, softened with smoothstep) and scene A elsewhere; add an orange glow where |n − threshold| < 0.05. Animate progress 0 → 1 over 1.6s with a smooth ease.',
  });

  shader({
    id: 'procedural-noise', name: 'Procedural Noise', aka: ['Generative noise', 'FBM pattern', 'Noise gradient'],
    images: ['dunes'], tags: ['object'], char: ['Abstract', 'Calm', 'Generative'],
    what: 'No image at all: colour is computed from layered fractal noise warped by itself and mapped onto a brand palette. Infinite, resolution-independent texture — great for backgrounds that never look like stock footage.',
    good: ['Backgrounds for titles and products', 'Brand texture systems', 'Ambient loops on screens and events'],
    avoid: 'Loud palettes behind text — keep contrast low under copy.',
    anatomy: ['Continuous', 'Full frame (no texture used)', 'f = fbm(uv × 3 + fbm(uv × 2 + t)); colour = palette(f)', 'Slow continuous', 'Implicit', 'Endless evolution'],
    tracks: [['in', 'Fade in', 0, 0.8, 'smooth', 'fx'], ['flow', 'Evolve', '>', 3.6, 'linear', 'bg']],
    frag: `uniform float u_in;
      void main(){ vec2 uv = v_uv * vec2(u_res.x / u_res.y, 1.0); float t = u_time * 0.08;
        float w = fbm(uv * 2.0 + t); float f = fbm(uv * 3.0 + w * 2.0 - t);
        vec3 a = vec3(0.05, 0.05, 0.08), b = vec3(0.94, 0.29, 0.21), c = vec3(0.95, 0.76, 0.31), d = vec3(0.17, 0.29, 0.84);
        vec3 col = mix(a, d, smoothstep(0.2, 0.55, f)); col = mix(col, b, smoothstep(0.5, 0.7, f)); col = mix(col, c, smoothstep(0.68, 0.85, f));
        gl_FragColor = vec4(col * u_in, 1.0); }`,
    overlay: '<div class="stackc"><b class="t-display" style="font-size:16cqmin;color:#fff;mix-blend-mode:overlay">Generative</b></div>',
    uniforms: (t, c) => ({ u_in: c.p.in }),
    prompt: 'Create a procedural background shader with no textures: warp fractal noise by itself (f = fbm(uv × 3 + 2 × fbm(uv × 2 + t) − t), t = seconds × 0.08) and map f to a 4-colour brand palette with smoothsteps. Keep it slow and low-contrast behind text.',
  });

  shader({
    id: 'kaleidoscope', name: 'Kaleidoscope', aka: ['Mirror symmetry', 'Radial mirror', 'Mandala shader'],
    char: ['Psychedelic', 'Music', 'Hypnotic'],
    what: 'The image is folded into 8 mirrored wedges around the centre, and the source rotates and zooms slowly, so the mandala keeps evolving. Polar coordinates (angle + radius) are the whole trick.',
    good: ['Music and festival visuals', 'Hypnotic loops', 'Turning ordinary footage into patterns'],
    avoid: 'Long exposure in normal edits — it is a strong stylistic statement.',
    anatomy: ['Continuous', 'Whole image', 'angle = mirror(mod(angle, 2π/8)); uv = polar → cartesian, rotating', 'Continuous rotation', 'Linear', 'Ramp in, then rotate'],
    tracks: [['in', 'Segments in', 0.2, 1, 'smooth', 'fx'], ['spin', 'Rotate', '>', 3, 'linear', 'fx']],
    frag: `uniform sampler2D u_tex0; uniform float u_k;
      void main(){ vec2 p = (v_uv - 0.5) * vec2(u_res.x / u_res.y, 1.0); float r = length(p); float a = atan(p.y, p.x);
        float seg = 6.28318 / 8.0; float am = mod(a + u_time * 0.15, seg); am = abs(am - seg * 0.5);
        float aa = mix(a, am, u_k); vec2 q = vec2(cos(aa), sin(aa)) * r * (1.0 - 0.2 * u_k) + 0.5;
        gl_FragColor = texture2D(u_tex0, clamp(cover(q), 0.001, 0.999)); }`,
    images: ['food'],
    uniforms: (t, c) => ({ u_k: c.p.in }),
    prompt: 'Write a kaleidoscope shader: convert to polar coordinates around the centre, fold the angle into 8 mirrored segments (mod by 2π/8, then mirror with abs), add a slow rotation, convert back and sample the image. Blend in the effect amount over 1s.',
  });

  shader({
    id: 'datamosh', name: 'Datamosh-Inspired Transition', aka: ['Datamosh look', 'Pixel bleed', 'Block smear'],
    images: ['dunes', 'city'], char: ['Glitch', 'Edgy', 'Music'],
    what: 'Scene B arrives in compression-style blocks while the old scene smears in blocky motion trails — the look of a broken video codec. This is a datamosh-inspired visual approximation; real datamoshing manipulates video frames (removing I-frames), which a shader cannot do.',
    good: ['Music videos and edgy fashion', 'Glitch-art transitions', 'Tech and gaming content'],
    avoid: 'Brand moments that must look polished.',
    anatomy: ['Cut point', 'Scene A + B, 24×40 blocks', 'Per block: seeded motion vector smears A; blocks switch to B by random threshold', '1.6s', 'linear', 'A smears → blocks of B bleed in → B'],
    note: 'Datamosh-inspired visual approximation — not real datamoshing (no codec frames are manipulated).',
    tracks: [['ha', 'Scene A', 0, 0.8, 'linear', 'image'], ['tr', 'Block smear', '>', 1.6, 'linear', 'fx'], ['hb', 'Scene B', '>', 1, 'linear', 'image']],
    frag: `uniform sampler2D u_tex0; uniform sampler2D u_tex1; uniform float u_prog;
      void main(){ vec2 uv = cover(v_uv); vec2 grid = vec2(24.0, 40.0); vec2 b = floor(uv * grid) / grid;
        float step4 = floor(u_time * 8.0);
        vec2 mv = (vec2(hash(b + step4), hash(b + 13.1 + step4)) - 0.5) * 0.18 * sin(u_prog * 3.14159);
        float sw = hash(b * 7.3);
        vec4 a = texture2D(u_tex0, clamp(uv - mv, 0.001, 0.999)); vec4 bb = texture2D(u_tex1, clamp(uv - mv * 0.5, 0.001, 0.999));
        gl_FragColor = mix(a, bb, step(sw, u_prog)); }`,
    uniforms: (t, c) => ({ u_prog: c.r.tr }),
    prompt: 'Create a datamosh-inspired transition shader (label it as an approximation): divide the frame into blocks; each block gets a seeded motion vector that changes 8 times per second and smears the old scene; blocks switch to the new scene when a per-block random value is below the progress. Real datamoshing requires manipulating video codec frames.',
  });

  /* ---------- canvas demos ---------- */
  function canvasDemo(def) {
    demo(Object.assign({ cat: CAT, tags: ADV.concat(def.tags2 || []) }, def, {
      html: `${def.bg || ''}<canvas data-r="cv" class="canvas-fill"></canvas>${def.overlay || ''}`,
      init(c) { c.data.cv = c.canvas(c.$.cv, { cap: def.cap || 1.5 }); if (def.setup) def.setup(c); },
      render(t, c) { const { g, w, h } = c.data.cv; def.draw(g, w, h, t, c); },
    }));
  }

  /* 11 Particle system */
  const PN = 260;
  canvasDemo({
    id: 'particle-system', name: 'Particle System', aka: ['Emitter', 'Particle fountain', 'Sparks'], char: ['Energetic', 'Magical', 'Technical'], cls: 'bg-ink',
    what: 'An emitter continuously spawns particles with random velocity; each one flies under gravity, shrinks and fades over its lifetime. Births are spread evenly over a loop, so the system is deterministic and loops seamlessly.',
    good: ['Sparks, magic, celebrations', 'Energy and tech accents', 'Backgrounds behind products'],
    avoid: 'Thousands of particles on mobile; a few hundred well-designed ones read better.',
    anatomy: ['Continuous loop', '260 particles (Canvas 2D)', 'pos = origin + v·age + ½g·age²; size/alpha by age', '2.5s lifetime cycle', 'Physics', 'Seamless loop'],
    tracks: [['loop', 'Emission loop (seamless)', 0, 2.5, 'linear', 'fx']], dur: 5, poster: 2,
    setup(c) { const r = rng(2); c.data.p = Array.from({ length: PN }, (_, i) => ({ b: (i / PN) * 2.5, a: lerp(-2.05, -1.09, r()), v: lerp(0.9, 1.5, r()), s: lerp(1, 3.2, r()), hue: r() })); },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h); g.globalCompositeOperation = 'lighter';
      const S = Math.min(w, h), ox = w / 2, oy = h * 0.82;
      c.data.p.forEach((p) => {
        const age = ((t - p.b) % 2.5 + 2.5) % 2.5, life = age / 2.5;
        const x = ox + Math.cos(p.a) * p.v * age * S * 0.6, y = oy + Math.sin(p.a) * p.v * age * S * 0.6 + 0.5 * 1.1 * age * age * S * 0.6;
        const a = (1 - life) * Math.min(1, age * 8);
        g.fillStyle = p.hue > 0.5 ? `rgba(255,${(150 + 80 * (1 - life)) | 0},80,${a.toFixed(3)})` : `rgba(255,220,160,${a.toFixed(3)})`;
        g.beginPath(); g.arc(x, y, p.s * (1 - life * 0.7) * (S / 140), 0, Math.PI * 2); g.fill();
      });
      g.globalCompositeOperation = 'source-over';
    },
    prompt: 'Build a deterministic particle fountain on a canvas: spread ~260 particle births evenly over a 2.5s loop; each particle’s position is origin + velocity × age + ½ × gravity × age², with size and alpha decreasing over its lifetime, drawn additively. Compute from time so it loops seamlessly and scrubs.',
  });

  /* 12 Particle assemble */
  canvasDemo({
    id: 'particle-assemble', name: 'Particle Assemble', aka: ['Particles to text', 'Swarm typography', 'Dot assemble'], char: ['Tech', 'Magical', 'Experimental'], cls: 'bg-navy', tags2: ['text'],
    what: 'Particles start as a scattered cloud and travel along curved paths into the letters of a word, each with its own delay, then shimmer gently in place. Target points are sampled from text drawn on a hidden canvas.',
    good: ['Tech / AI announcements', 'Titles that “form” from data', 'Event intros'],
    avoid: 'Long words or small sizes — particles cannot render fine type.',
    anatomy: ['Scene time', '~700 particles', 'Lerp from random start to sampled text point along a bent path', '1.6s each, 0–0.6s delays', 'expo.out', 'Cloud → word → shimmer'],
    tracks: [['form', 'Particles form the word', 0.2, 2.2, 'linear', 'fx'], ['hold', 'Shimmer', '>', 1.2, 'linear']],
    setup(c) {
      const off = document.createElement('canvas'); off.width = 300; off.height = 120;
      const g = off.getContext('2d'); g.fillStyle = '#fff'; g.font = '800 68px Geist, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MOTION', 150, 64);
      const d = g.getImageData(0, 0, 300, 120).data, pts = [];
      for (let y = 0; y < 120; y += 3) for (let x = 0; x < 300; x += 3) if (d[(y * 300 + x) * 4 + 3] > 128) pts.push([x / 300 - 0.5, y / 120 - 0.5]);
      const r = rng(31);
      c.data.pts = pts.map(([x, y]) => ({ x, y, sx: r(), sy: r(), d: r() * 0.6, bend: lerp(-0.4, 0.4, r()), ph: r() * 6 }));
    },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      const W = Math.min(w * 0.9, h * 1.6), H = W * 0.4, tt = t - c.tl.map.form.start;
      g.fillStyle = '#eaf0ff';
      c.data.pts.forEach((p) => {
        const k = ease('expo.out')(clamp((tt - p.d) / 1.6));
        const tx = w / 2 + p.x * W, ty = h / 2 + p.y * H;
        const x = lerp(p.sx * w, tx, k) + Math.sin(k * Math.PI) * p.bend * W * 0.3 + (k > 0.99 ? Math.sin(t * 3 + p.ph) * 0.6 : 0);
        const y = lerp(p.sy * h, ty, k) - Math.sin(k * Math.PI) * p.bend * H * 0.5;
        g.globalAlpha = lerp(0.35, 1, k);
        g.fillRect(x - 1, y - 1, 2, 2);
      });
      g.globalAlpha = 1;
    },
    prompt: 'Assemble a word from particles: draw the word on a hidden canvas, sample its filled pixels on a 3px grid as targets, and move each particle from a seeded random position to its target along a slightly bent path (expo-out, 1.6s, random 0–0.6s delay). Once formed, add a tiny shimmer. Compute from time.',
  });

  /* 13 Particle dissolve */
  canvasDemo({
    id: 'particle-dissolve', name: 'Particle Dissolve', aka: ['Disintegrate', 'Dust away', 'Thanos snap effect'], char: ['Dramatic', 'Magical', 'Experimental'], cls: 'bg-ink',
    what: 'The image breaks into small square particles that lift off and drift away on a noisy wind, sweeping from left to right. Each particle keeps the colour of the pixel it came from, so the image stays recognisable as it disappears.',
    good: ['Dramatic exits and transitions', 'Fantasy, gaming and sci-fi', '“Gone” / “deleted” metaphors'],
    avoid: 'Faces of real people in sensitive contexts.',
    anatomy: ['Scene time', 'Image sampled into ~1,900 particles', 'Delay by x position; then drift up/right with noise + fade', '≈1.6s per particle, wave across 1.4s', 'cubic.in', 'Intact → dissolve wave left → right'],
    tracks: [['hold', 'Intact', 0, 0.7, 'linear', 'hold'], ['dis', 'Dissolve wave', '>', 3, 'linear', 'fx']],
    setup(c) {
      A.loadImage(A.imgPath('portrait')).then((img) => {
        const N = 60, M = 32, off = document.createElement('canvas'); off.width = M; off.height = N;
        const g = off.getContext('2d'); g.drawImage(img, (M - N) / 2, 0, N, N);
        const d = g.getImageData(0, 0, M, N).data, r = rng(8);
        c.data.cells = []; c.data.M = M; c.data.N = N;
        for (let y = 0; y < N; y++) for (let x = 0; x < M; x++) { const i = (y * M + x) * 4; c.data.cells.push({ x, y, col: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`, d: (x / M) * 1.4 + r() * 0.4, ph: r() * 9 }); }
      });
    },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      if (!c.data.cells) return;
      const { M, N } = c.data, cs = Math.min(w / M, h / N), ox = (w - cs * M) / 2, oy = (h - cs * N) / 2, tt = t - c.tl.map.dis.start;
      c.data.cells.forEach((p) => {
        const k = ease('cubic.in')(clamp((tt - p.d) / 1.6));
        if (k >= 1) return;
        const x = ox + p.x * cs + k * (w * 0.35 + noise1(p.ph + tt) * cs * 6), y = oy + p.y * cs - k * h * 0.4 + noise1(p.ph * 2 + tt) * cs * 4 * k;
        g.globalAlpha = 1 - k; g.fillStyle = p.col;
        const s = cs * (1 - k * 0.6); g.fillRect(x, y, s + 0.5, s + 0.5);
      });
      g.globalAlpha = 1;
    },
    prompt: 'Dissolve an image into particles: sample it into a grid of small squares that keep their source colour. Starting from the left edge (delay ∝ x plus jitter), each square drifts up and to the right on a noisy wind, shrinking and fading over ~1.6s with an ease-in, so a wave of disintegration sweeps across.',
  });

  /* 14 Fluid-like motion */
  canvasDemo({
    id: 'fluid-motion', name: 'Fluid-Like Motion', aka: ['Flow field', 'Swirl trails', 'Vortex particles'], char: ['Organic', 'Hypnotic', 'Calm'], cls: 'bg-ink',
    what: 'Hundreds of particles swirl around two moving vortices, each drawn as a short trail, so the frame looks like stirred ink or wind. Every position is an analytic function of time (differential rotation around a vortex), so it scrubs perfectly — an approximation, not a fluid solver.',
    good: ['Ambient backgrounds', 'Weather, air, water metaphors', 'Generative brand visuals'],
    avoid: 'Expecting real fluid behaviour (pressure, mixing) — that needs a GPU fluid solver.',
    note: 'Approximation: analytic vortex rotation, not a fluid simulation.',
    anatomy: ['Continuous', '~420 particles with trails', 'Angle around nearest vortex += speed / (r² + ε) × t; trails = earlier samples', 'Continuous', 'Physics-like', 'Endless swirl'],
    tracks: [['in', 'Fade in', 0, 0.8, 'smooth', 'fx'], ['flow', 'Swirl', '>', 4, 'linear', 'fx']],
    setup(c) { const r = rng(12); c.data.p = Array.from({ length: 420 }, () => ({ x: r(), y: r(), hue: r() })); },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      const V = [[0.35 + 0.1 * Math.sin(t * 0.3), 0.4], [0.65, 0.62 + 0.08 * Math.cos(t * 0.25)]];
      const pos = (p, tt) => {
        const v = Math.hypot(p.x - V[0][0], p.y - V[0][1]) < Math.hypot(p.x - V[1][0], p.y - V[1][1]) ? V[0] : V[1];
        const dx = p.x - v[0], dy = p.y - v[1], r2 = dx * dx + dy * dy;
        const ang = Math.atan2(dy, dx) + (v === V[0] ? 1 : -1) * tt * 0.08 / (r2 + 0.02), R = Math.sqrt(r2);
        return [(v[0] + Math.cos(ang) * R) * w, (v[1] + Math.sin(ang) * R) * h];
      };
      g.lineWidth = 1.2; g.globalAlpha = c.p.in;
      c.data.p.forEach((p) => {
        g.strokeStyle = p.hue > 0.6 ? 'rgba(239,75,54,.7)' : p.hue > 0.3 ? 'rgba(242,193,78,.55)' : 'rgba(234,240,255,.5)';
        g.beginPath();
        for (let k = 0; k <= 6; k++) { const [x, y] = pos(p, t - k * 0.06); k ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      });
      g.globalAlpha = 1;
    },
    prompt: 'Create a fluid-like swirl that scrubs: assign each particle to its nearest of two slowly moving vortex centres and compute its position analytically by rotating it around that centre with angular speed ∝ 1/(r² + ε) × time. Draw each particle as a short trail by sampling a few earlier times. Label it as an approximation.',
  });

  /* 15 Generative background */
  canvasDemo({
    id: 'generative-bg', name: 'Generative Background', aka: ['Mesh gradient', 'Aurora background', 'Ambient gradient'], char: ['Calm', 'Premium', 'Loop'], cls: 'bg-ink', tags2: ['object'],
    what: 'Five large soft colour fields drift on looping paths and blend into a living mesh gradient. It is endlessly smooth, on-brand and lightweight — a modern alternative to stock motion backgrounds.',
    good: ['Backgrounds for titles, quotes and products', 'Website hero loops', 'Brand ambient screens'],
    avoid: 'High saturation behind body text.',
    anatomy: ['Continuous loop', 'Five radial colour fields (Canvas 2D)', 'Centres on Lissajous loops; additive-ish blending', '8s loop', 'Sine (seamless)', 'Seamless'],
    tracks: [['loop', 'Mesh loop (seamless)', 0, 8, 'linear', 'bg']], dur: 8, poster: 2, cap: 1,
    overlay: '<div class="stackc"><b class="t-serif" style="font-size:12cqmin;color:#fff">Calm <i>by default.</i></b></div>',
    draw(g, w, h, t, c) {
      const a = c.r.loop * Math.PI * 2;
      g.fillStyle = '#120a14'; g.fillRect(0, 0, w, h);
      const F = [['#ef4b36', 1, 0], ['#f2c14e', 2, 1.3], ['#3e63dd', 1, 2.6], ['#b9a7ff', 2, 3.9], ['#ff9fb2', 1, 5.1]];
      g.globalCompositeOperation = 'lighter';
      F.forEach(([col, k, ph]) => {
        const x = w * (0.5 + 0.32 * Math.sin(a * k + ph)), y = h * (0.5 + 0.3 * Math.cos(a * (3 - k) + ph * 1.7)), R = Math.max(w, h) * 0.55;
        const gr = g.createRadialGradient(x, y, 0, x, y, R);
        gr.addColorStop(0, col + '66'); gr.addColorStop(1, col + '00');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      });
      g.globalCompositeOperation = 'source-over';
    },
    prompt: 'Render a generative mesh-gradient background on a canvas: five large soft radial gradients in the brand palette move on looping Lissajous paths (integer frequencies so an 8s loop is seamless) and blend additively over a dark base. Keep the motion slow.',
  });

  /* 16 Reactive grid */
  canvasDemo({
    id: 'reactive-grid', name: 'Reactive Grid', aka: ['Dot grid repel', 'Magnetic grid', 'Field of dots'], char: ['Tech', 'Interactive', 'Playful'], cls: 'bg-ink', tags2: ['ui'],
    what: 'A grid of dots reacts to a moving point: nearby dots swell and get pushed away, then relax back. Here the point follows a scripted figure-eight (so it scrubs); hover the stage with a pointer to drive it yourself.',
    good: ['Tech and AI brand visuals', 'Interactive website heroes captured for video', 'Backgrounds that respond to a product or cursor'],
    avoid: 'Too dense grids on mobile — keep a few hundred dots.',
    anatomy: ['Scripted path (or pointer)', '~400 dots', 'Offset = direction × falloff(distance); size ∝ falloff', 'Figure-eight path, 4s', 'Smooth falloff (exp)', 'Continuous'],
    tracks: [['loop', 'Pointer path (seamless)', 0, 4, 'linear', 'cta']], dur: 4, poster: 1,
    setup(c) {
      const el = c.root;
      c.data.move = (e) => { const r = el.getBoundingClientRect(); c.data.ptr = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
      c.data.leave = () => { c.data.ptr = null; };
      el.addEventListener('pointermove', c.data.move);
      el.addEventListener('pointerleave', c.data.leave);
      el.style.pointerEvents = 'auto';
    },
    destroy(c) { c.root.removeEventListener('pointermove', c.data.move); c.root.removeEventListener('pointerleave', c.data.leave); },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      const a = c.r.loop * Math.PI * 2;
      const P = c.data.ptr || [0.5 + 0.3 * Math.sin(a), 0.5 + 0.25 * Math.sin(a * 2)];
      const px = P[0] * w, py = P[1] * h, S = Math.min(w, h), step = S / 14;
      for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
        const dx = x - px, dy = y - py, d = Math.hypot(dx, dy), f = Math.exp(-((d / (S * 0.22)) ** 2));
        const ox = d > 0 ? (dx / d) * f * step * 0.9 : 0, oy = d > 0 ? (dy / d) * f * step * 0.9 : 0;
        g.fillStyle = f > 0.3 ? '#ef4b36' : 'rgba(241,238,232,.55)';
        g.beginPath(); g.arc(x + ox, y + oy, step * (0.08 + 0.22 * f), 0, Math.PI * 2); g.fill();
      }
    },
    prompt: 'Build a reactive dot grid: for each dot, compute a Gaussian falloff from a moving point; push the dot away along the direction from the point and enlarge it by the falloff, colouring the closest dots in the accent colour. Drive the point by a scripted figure-eight (for video) or the pointer (for web).',
  });

  /* 17 Tunnel */
  canvasDemo({
    id: 'tunnel', name: '3D Perspective Tunnel', aka: ['Hyperspace tunnel', 'Infinite corridor', 'Warp tunnel'], char: ['Energetic', 'Tech', 'Hypnotic'], cls: 'bg-ink',
    what: 'Square frames rush toward the camera from a vanishing point, rotating slightly as they approach, and are recycled at the far end — an endless tunnel built with simple perspective division (size ∝ 1/z).',
    good: ['Intros and transitions with speed', 'Music and gaming visuals', '“Diving into” a topic'],
    avoid: 'Long durations at high speed (motion sickness).',
    anatomy: ['Continuous loop', '26 square frames', 'z cycles 1 → 0; screen size = k / z; rotation ∝ z; alpha by depth', '2s per frame cycle', 'linear (constant speed)', 'Seamless loop'],
    tracks: [['loop', 'Fly-through (seamless)', 0, 4, 'linear', 'camera']], dur: 4, poster: 1,
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      const N = 26, S = Math.min(w, h);
      for (let i = 0; i < N; i++) {
        const z = (((i / N) - c.r.loop * 2) % 1 + 1) % 1 + 0.02;
        const size = (S * 0.12) / z;
        if (size > Math.max(w, h) * 3) continue;
        g.save(); g.translate(w / 2 + Math.sin(t + z * 3) * S * 0.02, h / 2); g.rotate(z * 1.2 + t * 0.2);
        g.strokeStyle = i % 5 === 0 ? `rgba(239,75,54,${(1 - z).toFixed(2)})` : `rgba(234,240,255,${(0.8 * (1 - z)).toFixed(2)})`;
        g.lineWidth = Math.max(1, 3 * (1 - z));
        g.strokeRect(-size / 2, -size / 2, size, size);
        g.restore();
      }
    },
    prompt: 'Draw an endless perspective tunnel: ~26 square frames with depth z cycling from 1 to 0 at constant speed (wrapping around); each frame’s on-screen size is k / z, its rotation grows with depth, and its opacity fades with distance. Every fifth frame uses the accent colour. Loop seamlessly.',
  });

  /* 18 Infinite zoom */
  const IZ = ['alpine', 'dunes', 'coffee', 'city'];
  demo({
    id: 'infinite-zoom', cat: CAT, name: 'Infinite Zoom Concept', aka: ['Droste zoom', 'Frame-in-frame', 'Endless zoom'],
    tags: ADV.concat('image', 'camera'), char: ['Hypnotic', 'Clever', 'Loop'],
    what: 'Each photo contains a smaller framed photo, which contains another… The camera zooms continuously at an exponential rate, and after four levels the frame is identical to the start, so the loop never ends.',
    good: ['Seamless social loops', 'Storytelling through nested scenes', 'Portfolio / collection reels'],
    avoid: 'Mismatched levels — the loop only works if the last level equals the first.',
    anatomy: ['Continuous loop', 'Six nested frames (4 unique + repeats)', 'Scale = 3^(4u) for the stack; each level 1/3 of the previous', '6s per loop (4 levels)', 'Exponential (constant perceived speed)', 'Seamless: level 4 = level 0'],
    tracks: [['loop', 'Zoom (seamless, 4 levels)', 0, 6, 'linear', 'camera']], dur: 6, poster: 1,
    cls: 'bg-ink',
    note: 'Concept version with framed photos; true infinite zooms use generated or matched imagery.',
    html: `<div class="center">${[-1, 0, 1, 2, 3, 4, 5].map((k) => { const i = ((k % 4) + 4) % 4; return `<div data-r="lv" class="iz-frame">${A.photo(IZ[i], { cls: 'fill' })}<span>${String(i + 1).padStart(2, '0')}</span></div>`; }).join('')}</div>`,
    render(t, c) {
      // Levels k = −1…5; level k has scale 3^(4u − k). After one loop (u = 1) level k+4 sits exactly where level k started.
      const S = Math.pow(3, 4 * c.r.loop);
      c.$$.lv.forEach((el, n) => { const s = S * Math.pow(3, -(n - 1)); c.set(el, { s, o: s > 12 ? 0 : 1, css: { zIndex: n } }); });
    },
    prompt: 'Create an infinite-zoom loop: nest framed photos so each contains the next at 1/3 size, and repeat the first levels at the end (A B C D A B). Scale the whole stack by 3^(4 × loopProgress) so the zoom speed feels constant, and after four levels the frame matches the start exactly.',
  });

  /* 19 Pixel sort */
  canvasDemo({
    id: 'pixel-sort', name: 'Pixel Sort Concept', aka: ['Pixel sorting', 'Glitch sort', 'Brightness sort'], char: ['Glitch-art', 'Experimental', 'Editorial'], cls: 'bg-ink', cap: 1,
    what: 'Within each column, bright pixel runs are sorted by brightness, producing the long vertical streaks of pixel-sort glitch art. The sorted version is precomputed once; the animation reveals it column by column from the top, then retracts.',
    good: ['Glitch-art and music visuals', 'Fashion and editorial edits', 'Album / poster motion'],
    avoid: 'Real-time full-resolution sorting in browsers — precompute or use a shader.',
    anatomy: ['Scene time', 'Photo + precomputed sorted copy', 'Per column: show sorted pixels down to a varying height', 'Reveal 1.4s · hold · retract 1s', 'smooth', 'Original → streaks grow → retract'],
    tracks: [['grow', 'Sort reveal', 0.4, 1.4, 'smooth', 'fx'], ['hold', 'Hold', '>', 0.8, 'linear'], ['back', 'Retract', '>', 1, 'smooth', 'fx']],
    setup(c) {
      A.loadImage(A.imgPath('city')).then((img) => {
        const W = 140, H = 250, a = document.createElement('canvas'); a.width = W; a.height = H;
        const g = a.getContext('2d'); g.drawImage(img, (W - H) / 2, 0, H, H);
        const id = g.getImageData(0, 0, W, H), d = id.data;
        const lum = (i) => d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
        const b = document.createElement('canvas'); b.width = W; b.height = H;
        const out = new ImageData(new Uint8ClampedArray(d), W, H);
        for (let x = 0; x < W; x++) {
          let y = 0;
          while (y < H) {
            while (y < H && lum((y * W + x) * 4) < 70) y++;
            const s = y; const run = [];
            while (y < H && lum((y * W + x) * 4) >= 70) { const i = (y * W + x) * 4; run.push([d[i], d[i + 1], d[i + 2], lum(i)]); y++; }
            run.sort((p, q) => q[3] - p[3]).forEach((px, k) => { const i = ((s + k) * W + x) * 4; out.data[i] = px[0]; out.data[i + 1] = px[1]; out.data[i + 2] = px[2]; });
          }
        }
        b.getContext('2d').putImageData(out, 0, 0);
        c.data.src = a; c.data.sorted = b; c.data.W = W; c.data.H = H;
      });
    },
    draw(g, w, h, t, c) {
      if (!c.data.src) return;
      const { W, H } = c.data, sc = Math.max(w / W, h / H), ox = (w - W * sc) / 2, oy = (h - H * sc) / 2;
      g.imageSmoothingEnabled = false;
      g.drawImage(c.data.src, ox, oy, W * sc, H * sc);
      const p = c.p.grow * (1 - c.p.back);
      for (let x = 0; x < W; x++) {
        const hh = Math.round(H * p * (0.45 + 0.55 * hash(x * 1.7)));
        if (hh > 0) g.drawImage(c.data.sorted, x, 0, 1, hh, ox + x * sc, oy, sc + 0.5, hh * sc);
      }
    },
    prompt: 'Create a pixel-sort effect: precompute a copy of the image where, in each column, contiguous runs of pixels brighter than a threshold are sorted by brightness. Then reveal the sorted copy column by column from the top down to a per-column random height that grows with progress (1.4s), hold, and retract.',
  });

  /* 20 Mesh warp */
  canvasDemo({
    id: 'mesh-warp', name: 'Mesh Warp Concept', aka: ['Grid deform', 'Puppet warp', 'Lattice distortion'], char: ['Technical', 'Organic', 'Experimental'], cls: 'bg-ink', cap: 1,
    what: 'The image is cut into a grid of cells whose corners move with smooth waves; each cell is redrawn into its displaced position and the deformed grid is overlaid. It shows the idea behind mesh warps and puppet tools used in After Effects and Rive.',
    good: ['Understanding warp/puppet tools', 'Breathing, wobbling or bulging products', 'Playful graphic distortions'],
    avoid: 'Expecting smooth results from a coarse grid — real tools interpolate with many more points.',
    note: 'Concept: each cell is drawn into an axis-aligned displaced rectangle, a simplification of a true mesh warp.',
    anatomy: ['Scene time', 'Image in a 9×14 grid', 'Vertex offset = sin waves × amount; cells redrawn into displaced bounds; grid overlay', 'Ramp 1s · wave 2.8s', 'smooth', 'Flat → warping → flat'],
    tracks: [['in', 'Warp in', 0.3, 1, 'smooth', 'fx'], ['hold', 'Waves', '>', 1.8, 'linear', 'fx'], ['out', 'Warp out', '>', 0.8, 'smooth', 'fx']],
    setup(c) { A.loadImage(A.imgPath('coffee')).then((img) => { c.data.img = img; }); },
    draw(g, w, h, t, c) {
      g.clearRect(0, 0, w, h);
      if (!c.data.img) return;
      const C = 9, R = 14, amt = c.p.in * (1 - c.p.out) * Math.min(w, h) * 0.05;
      const P = (i, j) => { const x = (i / C) * w, y = (j / R) * h; return [x + Math.sin(j * 0.7 + t * 2.2) * amt, y + Math.cos(i * 0.9 + t * 1.8) * amt]; };
      const S = Math.max(w, h), sx = (S - w) / 2, sy = (S - h) / 2, k = c.data.img.width / S;
      for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
        // Left/right edges come from the same row, top/bottom from the same column, so neighbouring cells share edges (no gaps).
        const a = P(i, j), r = P(i + 1, j), d = P(i, j + 1);
        g.drawImage(c.data.img, ((i / C) * w + sx) * k, ((j / R) * h + sy) * k, (w / C) * k, (h / R) * k, a[0], a[1], r[0] - a[0] + 0.8, d[1] - a[1] + 0.8);
      }
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
      for (let j = 0; j <= R; j++) { g.beginPath(); for (let i = 0; i <= C; i++) { const p = P(i, j); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); }
      for (let i = 0; i <= C; i++) { g.beginPath(); for (let j = 0; j <= R; j++) { const p = P(i, j); j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); }
    },
    prompt: 'Demonstrate a mesh warp: split the image into a grid (≈9×14), displace every grid vertex with smooth sine waves whose amplitude ramps in and out, redraw each cell into its displaced position, and overlay the deformed grid lines so the mechanism is visible.',
  });
})();
