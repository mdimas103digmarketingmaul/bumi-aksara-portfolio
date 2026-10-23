/* =========================================================================
   09 · Advanced / Experimental
   Heavier effects start lazily (Lab.whenNear) and their loops pause when
   the stage leaves the viewport.
   ========================================================================= */
(function () {
  'use strict';
  const { damp, clamp } = Lab;

  Lab.define({
    id: 'particle-field',
    category: 'advanced',
    name: 'Particle Field',
    aliases: ['Constellation', 'Particle Network', 'Plexus Background'],
    triggers: ['time', 'mouse'],
    level: 3,
    complexity: 3,
    pointer: true,
    reducedNote: 'Frozen in reduced mode',
    hint: 'Move through the field: particles part around the pointer and link to their neighbours.',
    anatomy: {
      trigger: 'Time (drift) + pointer position (repulsion)',
      target: 'About 60–130 particles drawn on a canvas',
      transform: 'position · velocity · line opacity by distance',
      character: 'Inertia: forces change velocity, friction settles it',
    },
    tech: 'Canvas 2D + rAF (paused off-screen), simple physics',
    does: 'Each particle has a position and velocity. Every frame it drifts, gets pushed away when the pointer is close, and loses a little speed to friction so it never explodes. Lines are drawn between particles closer than 110px, fading with distance, which creates the constellation look.',
    goodFor: ['AI / data / tech heroes', 'Network and connectivity stories', 'Interactive backgrounds', 'Event visuals'],
    prompt: 'Add an interactive particle field behind the hero using Canvas 2D: create a particle count based on area (max ~130), give each a slow random velocity, push particles away from the pointer within 120px, apply friction (velocity × 0.96 per frame), wrap them at the edges, and connect particles closer than 110px with lines whose opacity fades with distance. Respect devicePixelRatio (cap at 2), pause the rAF loop off-screen and when the tab is hidden, and render a single static frame for reduced motion.',
    init(stage) {
      const canvas = stage.querySelector('canvas');
      const readout = stage.querySelector('[data-readout]');
      const ctx = canvas.getContext('2d');
      const pointer = { x: -9999, y: -9999, active: false };
      let w = 0, h = 0, particles = [];

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = stage.clientWidth; h = stage.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(130, Math.round((w * h) / 7000));
        while (particles.length < count) {
          particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 18, vy: (Math.random() - 0.5) * 18, r: 1 + Math.random() * 1.6 });
        }
        particles.length = count;
        readout.innerHTML = `particles <b>${count}</b> · link distance <b>110px</b> · repel radius <b>120px</b>`;
      };

      const tick = (dt) => {
        const repel = 120;
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          if (pointer.active) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < repel) {
              const force = (1 - d / repel) * 900 * Lab.k;
              p.vx += (dx / d) * force * dt;
              p.vy += (dy / d) * force * dt;
            }
          }
          p.vx *= Math.pow(0.96, dt * 60);
          p.vy *= Math.pow(0.96, dt * 60);
          // A minimum drift keeps the field alive.
          const speed = Math.hypot(p.vx, p.vy);
          if (speed < 6) { p.vx += (Math.random() - 0.5) * 4; p.vy += (Math.random() - 0.5) * 4; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        });
        const link = 110;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < link * link) {
              ctx.strokeStyle = `rgba(146, 178, 255, ${(1 - Math.sqrt(d2) / link) * 0.35})`;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        particles.forEach((p) => {
          ctx.fillStyle = 'rgba(236, 235, 230, 0.85)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
      };

      Lab.whenNear(stage, () => {
        resize();
        new ResizeObserver(resize).observe(stage);
        Lab.loop(stage, tick, { continuous: true });
        Lab.pointer(stage, {
          move(p) { pointer.x = p.x; pointer.y = p.y; pointer.active = true; },
          leave() { pointer.active = false; },
        });
      });
    },
  });

  Lab.define({
    id: 'rgb-split',
    category: 'advanced',
    name: 'RGB Split / Chromatic Aberration',
    aliases: ['Channel Shift', 'Glitch Offset', 'Colour Fringing'],
    triggers: ['mouse'],
    level: 3,
    complexity: 2,
    pointer: true,
    hint: 'Move fast across the word, then stop. The channels separate with speed and rejoin.',
    anatomy: {
      trigger: 'Pointer velocity (speed, not position)',
      target: 'Red, green and blue copies of the word',
      transform: 'opposite translate for R and B channels',
      character: 'Damped: spikes with speed, settles in ~300ms',
    },
    tech: 'Three text layers + mix-blend-mode: screen + JS damping',
    does: 'Three copies of the word, pure red, green and blue, are stacked with screen blending on black, which adds up to white. When the pointer moves, red shifts one way and blue the other, proportional to pointer speed, so coloured fringes appear like a misaligned lens. They snap back together when you stop.',
    goodFor: ['Music and fashion campaigns', 'Glitch / tech aesthetics', 'Gaming and esports', 'Hover accents on headlines'],
    prompt: 'Add a tasteful chromatic aberration hover to the headline: stack three copies of the text in pure red, green and blue with mix-blend-mode: screen on a dark background, offset the red copy along the pointer’s velocity vector and the blue copy the opposite way (clamped to ~14px), and damp the offset back to zero so it only appears during movement. Keep one accessible text copy, disable it on touch, and render the plain white text for reduced motion.',
    init(stage) {
      const word = stage.querySelector('.rgb__word');
      const readout = stage.querySelector('[data-readout]');
      let ox = 0, oy = 0, tx = 0, ty = 0, lastX = null, lastY = null, lastT = 0;
      const ticker = Lab.loop(stage, (dt) => {
        tx = damp(tx, 0, 6, dt);
        ty = damp(ty, 0, 6, dt);
        ox = damp(ox, tx, 18, dt);
        oy = damp(oy, ty, 18, dt);
        word.style.setProperty('--rx', ox.toFixed(2) + 'px');
        word.style.setProperty('--ry', oy.toFixed(2) + 'px');
        readout.innerHTML = `channel offset <b>${Math.hypot(ox, oy).toFixed(1)}px</b> · R → / ← B`;
        return Math.abs(ox) > 0.05 || Math.abs(oy) > 0.05 || Math.abs(tx) > 0.05;
      });
      Lab.pointer(stage, {
        move(p) {
          const now = performance.now();
          if (lastX !== null && !Lab.reduced) {
            const dt = Math.max(now - lastT, 8) / 1000;
            const max = 14 * Lab.k;
            tx = clamp(((p.x - lastX) / dt) * 0.012, -max, max);
            ty = clamp(((p.y - lastY) / dt) * 0.012, -max, max);
            ticker.wake();
          }
          lastX = p.x; lastY = p.y; lastT = now;
        },
        leave() { lastX = null; },
      });
      readout.innerHTML = 'channel offset <b>0.0px</b> · R → / ← B';
    },
  });

  Lab.define({
    id: 'glass-lens',
    category: 'advanced',
    name: 'Glass / Refraction Style Interaction',
    aliases: ['Magnifier Lens', 'Liquid Glass', 'Loupe Effect'],
    triggers: ['mouse'],
    level: 3,
    complexity: 2,
    pointer: true,
    hint: 'Move the lens over the text and shapes. On touch, tap where you want it.',
    note: 'Honest label: this is an approximation. The lens shows a magnified copy of the scene clipped to a circle, plus highlight and edge tint. Real refraction bends every light ray differently across the curved surface (stronger at the edges), which needs a per-pixel shader like #50.',
    anatomy: {
      trigger: 'Pointer position',
      target: 'A circular lens with a scaled copy of the scene',
      transform: 'translate (lens) · scale around the lens centre (content)',
      character: 'Smooth follow (damped)',
    },
    tech: 'Cloned DOM + transform-origin maths + CSS gradients',
    does: 'A second copy of the scene sits inside a circular, clipped lens. It is scaled around the exact point under the lens centre, so whatever is beneath appears magnified in place. A specular highlight, a soft coloured rim and a shadow sell the glass material.',
    goodFor: ['Product detail inspection', 'Map and chart exploration', 'Playful portfolio heroes', 'Explaining optics or “focus”'],
    prompt: 'Add a glass lens interaction to the hero (as an approximation, not physical refraction): a 170px circular lens that follows the pointer with damping and contains a cloned copy of the scene, scaled 1.45× with transform-origin set to the point under the lens centre. Add a top-left specular highlight, a faint chromatic rim and a soft drop shadow. On touch, move the lens on tap, hide the native cursor only inside the section, and label it as an approximation if you need true refraction (that requires a WebGL shader).',
    init(stage) {
      const scene = stage.querySelector('.lens-scene');
      const lens = stage.querySelector('.lens');
      const inner = stage.querySelector('.lens__inner');
      const readout = stage.querySelector('[data-readout]');
      inner.appendChild(scene.cloneNode(true));
      let x = 0, y = 0, tx = 0, ty = 0;
      const size = () => lens.offsetWidth;

      const render = () => {
        const L = size();
        const zoom = 1 + 0.45 * Lab.k;
        lens.style.setProperty('--lx', x.toFixed(1) + 'px');
        lens.style.setProperty('--ly', y.toFixed(1) + 'px');
        inner.style.setProperty('--ix', (L / 2 - x).toFixed(1) + 'px');
        inner.style.setProperty('--iy', (L / 2 - y).toFixed(1) + 'px');
        inner.style.setProperty('--ox', x.toFixed(1) + 'px');
        inner.style.setProperty('--oy', y.toFixed(1) + 'px');
        inner.style.setProperty('--zoom', zoom.toFixed(2));
        readout.innerHTML = `magnification <b>${zoom.toFixed(2)}×</b> · approximation (no per-pixel ray bending)`;
      };
      const ticker = Lab.loop(stage, (dt) => {
        const lambda = Lab.reduced ? 60 : 10;
        x = damp(x, tx, lambda, dt);
        y = damp(y, ty, lambda, dt);
        render();
        return Math.abs(x - tx) > 0.2 || Math.abs(y - ty) > 0.2;
      });
      const fit = () => {
        stage.style.setProperty('--scene-w', stage.clientWidth + 'px');
        stage.style.setProperty('--scene-h', stage.clientHeight + 'px');
        if (!tx) { x = tx = stage.clientWidth * 0.62; y = ty = stage.clientHeight * 0.45; }
        render();
      };
      const moveTo = (p) => { tx = p.x; ty = p.y; ticker.wake(); };
      Lab.pointer(stage, { move: moveTo, down: moveTo });
      new ResizeObserver(fit).observe(stage);
      Lab.onChange(render);
      fit();
    },
  });

  /* ---------- WebGL displacement ---------- */
  const VERT = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;
  const FRAG = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_strength;
    uniform float u_aspect;
    uniform float u_showMap;
    varying vec2 v_uv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = v_uv;
      vec2 d = uv - u_mouse;
      d.x *= u_aspect;
      float falloff = exp(-dot(d, d) * 14.0);

      // The displacement map: two noise fields give an x and y push for every pixel.
      vec2 map = vec2(
        noise(uv * vec2(6.0 * u_aspect, 6.0) + vec2(u_time * 0.25, u_time * 0.12)),
        noise(uv * vec2(6.0 * u_aspect, 6.0) + vec2(17.0 - u_time * 0.18, 9.0 + u_time * 0.2))
      ) - 0.5;
      float amount = u_strength * (0.15 + falloff);

      if (u_showMap > 0.5) {
        gl_FragColor = vec4((map + 0.5) * (0.35 + 0.65 * min(amount, 1.0)), 0.55, 1.0);
        return;
      }
      vec2 offset = map * 0.09 * amount;
      float r = texture2D(u_tex, uv + offset * 1.12).r;
      float g = texture2D(u_tex, uv + offset).g;
      float b = texture2D(u_tex, uv + offset * 0.88).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }`;

  function paintTexture(canvas, w, h) {
    canvas.width = w; canvas.height = h;
    const c = canvas.getContext('2d');
    const bg = c.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1b1a24'); bg.addColorStop(1, '#0d1116');
    c.fillStyle = bg; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(236,235,230,0.08)'; c.lineWidth = Math.max(1, w / 900);
    const step = Math.round(w / 24);
    for (let x = 0; x < w; x += step) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y < h; y += step) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    const sun = c.createRadialGradient(w * 0.8, h * 0.36, 0, w * 0.8, h * 0.36, h * 0.25);
    sun.addColorStop(0, '#ffe2b0'); sun.addColorStop(0.5, '#e9b872'); sun.addColorStop(1, 'rgba(233,184,114,0)');
    c.fillStyle = sun; c.beginPath(); c.arc(w * 0.8, h * 0.36, h * 0.25, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ecebe6';
    c.font = `700 ${Math.round(h * 0.24)}px Geist, system-ui, sans-serif`;
    c.textBaseline = 'middle';
    c.fillText('DISPLACE', w * 0.06, h * 0.52);
    c.fillStyle = '#92b2ff';
    c.font = `500 ${Math.round(h * 0.045)}px "Geist Mono", ui-monospace, monospace`;
    c.fillText('uv + map(uv) × strength', w * 0.065, h * 0.74);
  }

  Lab.define({
    id: 'displacement',
    category: 'advanced',
    name: 'Distortion / Displacement',
    aliases: ['Displacement Map', 'Liquid Distortion', 'Shader Warp'],
    triggers: ['mouse', 'time'],
    level: 3,
    complexity: 3,
    pointer: true,
    reducedNote: 'Undistorted in reduced mode',
    hint: 'Hover to increase distortion near the pointer. Switch to “Displacement map” to see what drives it.',
    note: 'This is a real displacement shader, kept deliberately small: the map is procedural noise instead of an image, and the image is a canvas-drawn texture. Production work (e.g. Three.js / OGL) uses the same idea with photo textures and smoother transitions.',
    anatomy: {
      trigger: 'Pointer position + time',
      target: 'Every pixel of a texture (fragment shader)',
      transform: 'texture lookup offset (uv + map × strength)',
      character: 'Fluid, continuous; strength eases in and out',
    },
    tech: 'WebGL fragment shader (no library)',
    does: 'A displacement map is an image whose values tell each pixel where to sample from. Here the map is animated noise. For every pixel, the shader reads the map, shifts its texture coordinate by that amount, and samples the image there, slightly differently per colour channel. The strength peaks around the pointer and fades away from it.',
    goodFor: ['Experimental portfolio heroes', 'Fashion and art campaigns', 'Image hover transitions', 'Music / event visuals'],
    prompt: 'Add a WebGL displacement effect to the hero image: render a full-screen quad, and in the fragment shader build a displacement map from two animated value-noise fields, then offset each pixel’s UV by map × strength before sampling the image texture (with slightly different offsets for R, G and B). Make strength ease up around the pointer with a Gaussian falloff and back down on leave, cap devicePixelRatio at 1.5, pause rendering off-screen, fall back to the static image without WebGL, and disable distortion for reduced motion.',
    init(stage) {
      const canvas = stage.querySelector('canvas');
      const readout = stage.querySelector('[data-readout]');
      const seg = stage.querySelector('.seg');
      let showMap = 0;
      seg.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        showMap = btn.dataset.view === 'map' ? 1 : 0;
        seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      });

      Lab.whenNear(stage, () => {
        const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
        if (!gl) {
          stage.insertAdjacentHTML('beforeend', '<p class="displace__fallback">WebGL is not available in this browser, so the shader cannot run. The concept: every pixel samples the image at uv + map(uv) × strength.</p>');
          return;
        }
        const compile = (type, src) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, src); gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
          return s;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const u = (name) => gl.getUniformLocation(prog, name);
        const U = { mouse: u('u_mouse'), time: u('u_time'), strength: u('u_strength'), aspect: u('u_aspect'), showMap: u('u_showMap') };

        const tex = gl.createTexture();
        const texCanvas = document.createElement('canvas');
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        let aspect = 1;
        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          const w = Math.max(1, Math.round(stage.clientWidth * dpr));
          const h = Math.max(1, Math.round(stage.clientHeight * dpr));
          canvas.width = w; canvas.height = h;
          gl.viewport(0, 0, w, h);
          aspect = w / h;
          paintTexture(texCanvas, w, h);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
        };
        resize();
        new ResizeObserver(resize).observe(stage);
        // Repaint once web fonts are ready so the texture uses Geist.
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);

        let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5, strength = 0.35, target = 0.35, frame = 0;
        Lab.pointer(stage, {
          move(p) { tmx = p.x / p.w; tmy = 1 - p.y / p.h; target = 1.4; },
          leave() { target = 0.35; },
        });
        Lab.loop(stage, (dt, t) => {
          mx = damp(mx, tmx, 6, dt);
          my = damp(my, tmy, 6, dt);
          strength = Lab.reduced ? 0 : damp(strength, target * Lab.k, 3, dt);
          gl.uniform2f(U.mouse, mx, my);
          gl.uniform1f(U.time, t);
          gl.uniform1f(U.strength, strength);
          gl.uniform1f(U.aspect, aspect);
          gl.uniform1f(U.showMap, showMap);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (frame++ % 6 === 0) readout.innerHTML = `strength <b>${strength.toFixed(2)}</b> · pointer uv <b>${mx.toFixed(2)}, ${my.toFixed(2)}</b> · ${canvas.width}×${canvas.height}px`;
        }, { continuous: true });
      });
    },
  });
})();
