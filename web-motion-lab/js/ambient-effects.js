/* =========================================================================
   06 · Ambient Motion
   Time-driven loops. CSS loops pause off-screen through .stage.is-active;
   the JS blob uses a continuous Lab.loop that does the same.
   ========================================================================= */
(function () {
  'use strict';

  Lab.define({
    id: 'floating',
    category: 'ambient',
    name: 'Floating / Bobbing',
    aliases: ['Idle Float', 'Hover Bob', 'Levitation'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Still in reduced mode',
    hint: 'Each object has its own duration and phase, so the group never moves in lockstep.',
    anatomy: {
      trigger: 'Time (infinite alternate loop)',
      target: 'Decorative shapes',
      transform: 'translateY ±14px · rotate ±4°',
      character: 'Ease-in-out, slow, phase-shifted',
    },
    tech: 'CSS keyframes + per-object --dur / negative --delay',
    does: 'One shared keyframe moves an object up and down with a tiny rotation, and alternate direction makes it glide back smoothly. Each object gets a different duration and a negative delay, which starts it mid-cycle, so the group looks organic instead of synchronised.',
    goodFor: ['Hero decorations', '3D-style illustrations', 'Empty states', 'App landing pages'],
    prompt: 'Make the decorative hero shapes float: one shared keyframe that moves translateY between −14px and 14px with a ±4° rotation, ease-in-out, alternate, infinite. Give each shape its own duration (4–8s) and a negative animation-delay so they are out of phase, pause when off-screen, and keep them still for reduced motion.',
    init() {},
  });

  Lab.define({
    id: 'orbit',
    category: 'ambient',
    name: 'Orbit Animation',
    aliases: ['Orbital Motion', 'Satellite Loop', 'Planetary Spin'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Still in reduced mode',
    hint: 'Three rings, three speeds, one reversed. Intensity changes the speed.',
    anatomy: {
      trigger: 'Time (infinite loop)',
      target: 'Rings carrying satellite objects',
      transform: 'rotate (ring) · counter-rotate (label)',
      character: 'Linear, constant speed',
    },
    tech: 'CSS keyframes (rotate a parent, counter-rotate a child)',
    does: 'The satellite doesn’t travel along a path. It sits at the top of a ring, and the whole ring rotates. The labelled satellite counter-rotates at the same speed, so its text stays upright while it orbits.',
    goodFor: ['Integrations / ecosystem diagrams', 'AI and tech heroes', 'Loading states', 'Feature constellations'],
    prompt: 'Create an orbit animation around the central logo: three concentric rings rotating linearly at 6s, 11s (reversed) and 18s per revolution, each carrying a satellite placed at the ring’s top edge. Counter-rotate any satellite that contains text so it stays upright, animate only transform, pause when off-screen, and stop for reduced motion.',
    init() {},
  });

  Lab.define({
    id: 'aurora',
    category: 'ambient',
    name: 'Animated Aurora / Mesh Gradient',
    aliases: ['Mesh Gradient', 'Gradient Blobs', 'Ambient Glow'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Still in reduced mode',
    hint: 'Look at it for ten seconds. If it grabs your attention, it’s too fast.',
    anatomy: {
      trigger: 'Time (18–26s loops)',
      target: 'Four soft radial-gradient blobs',
      transform: 'translate · scale (blended with screen)',
      character: 'Very slow ease-in-out drift',
    },
    tech: 'CSS radial-gradients + mix-blend-mode + keyframes',
    does: 'Four large, soft radial gradients overlap with mix-blend-mode: screen, so where they meet the colours mix like light. Each drifts on its own long, alternating loop. Using radial-gradient instead of filter: blur keeps it cheap to animate.',
    goodFor: ['SaaS and AI backgrounds', 'Hero sections behind text', 'Sign-up / auth pages', 'Event pages'],
    prompt: 'Create a slow animated aurora background for the hero: 4 large radial-gradient blobs (blue, mint, lilac, amber at 35–55% alpha) blended with mix-blend-mode: screen, each drifting with translate and scale on its own 18–26s ease-in-out alternate loop with offset delays. Do not use filter: blur, keep text contrast at WCAG AA, pause off-screen, and freeze for reduced motion.',
    init() {},
  });

  Lab.define({
    id: 'morph-blob',
    category: 'ambient',
    name: 'Morphing Blob',
    aliases: ['Organic Shape', 'Liquid Blob', 'Shape Morph'],
    triggers: ['time'],
    level: 2,
    complexity: 2,
    reducedNote: 'Still in reduced mode',
    hint: 'Tick “Show control points” to see the eight points that drive the curve.',
    anatomy: {
      trigger: 'Time (continuous)',
      target: 'An SVG path',
      transform: 'path shape (8 radii) · slow rotation',
      character: 'Organic: layered sine waves, never repeating exactly',
    },
    tech: 'SVG path + JS rAF (Catmull-Rom → Bézier)',
    does: 'Eight points sit around a circle. Each point’s distance from the centre is a mix of two slow sine waves with its own speed and phase. Every frame a smooth closed curve is drawn through the points, so the shape breathes and wobbles without ever looking mechanical.',
    goodFor: ['Brand illustrations', 'Avatar / voice UI', 'Wellness and lifestyle sites', 'Background accents'],
    prompt: 'Create a morphing blob as an SVG path: place 8 points around a circle, vary each point’s radius with two layered sine waves (±13% and ±6%) using its own random speed and phase, and redraw a smooth closed curve through the points each frame (Catmull-Rom converted to cubic Béziers). Rotate the blob slowly, fill it with a soft gradient, run the rAF loop only while visible, and render a still shape for reduced motion.',
    init(stage) {
      const path = stage.querySelector('.blob__path');
      const pointsGroup = stage.querySelector('.blob__points');
      const toggle = stage.querySelector('input');
      const N = 8, CX = 200, CY = 200, R = 128;
      const seeds = Array.from({ length: N }, () => ({ a: 0.5 + Math.random() * 0.8, b: 0.3 + Math.random() * 0.5, p: Math.random() * Math.PI * 2 }));

      const NS = 'http://www.w3.org/2000/svg';
      const markers = seeds.map(() => {
        const line = document.createElementNS(NS, 'line');
        const dot = document.createElementNS(NS, 'circle');
        line.setAttribute('x1', CX); line.setAttribute('y1', CY);
        dot.setAttribute('r', 5);
        pointsGroup.append(line, dot);
        return { line, dot };
      });
      toggle.addEventListener('change', () => stage.classList.toggle('show-points', toggle.checked));

      const f = (n) => n.toFixed(1);
      Lab.loop(stage, (dt, t) => {
        const turn = t * 0.12;
        const pts = seeds.map((s, i) => {
          const angle = (i / N) * Math.PI * 2 + turn;
          const r = R * (1 + 0.13 * Lab.k * Math.sin(t * s.a + s.p) + 0.06 * Lab.k * Math.sin(t * s.b * 1.7 + s.p * 2));
          return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r };
        });
        let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
        for (let i = 0; i < N; i++) {
          const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
          d += ` C${f(p1.x + (p2.x - p0.x) / 6)},${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)},${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)},${f(p2.y)}`;
        }
        path.setAttribute('d', d + 'Z');
        // Always kept in sync (only 8 points) so toggling works even on a static frame.
        pts.forEach((p, i) => {
          markers[i].line.setAttribute('x2', f(p.x)); markers[i].line.setAttribute('y2', f(p.y));
          markers[i].dot.setAttribute('cx', f(p.x)); markers[i].dot.setAttribute('cy', f(p.y));
        });
      }, { continuous: true });
    },
  });

  Lab.define({
    id: 'grain',
    category: 'ambient',
    name: 'Animated Grain / Noise',
    aliases: ['Film Grain', 'Noise Overlay', 'Texture Overlay'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Static grain in reduced mode',
    hint: 'Toggle the grain to compare. It should be felt more than seen.',
    anatomy: {
      trigger: 'Time (fast stepped loop)',
      target: 'A noise texture overlay',
      transform: 'translate in random jumps',
      character: 'Stepped (steps(6)), jittery like film',
    },
    tech: 'Canvas-generated noise tile + CSS steps() keyframes',
    does: 'A small noise tile is generated once with canvas and repeated across an oversized overlay. The overlay jumps to a new offset six times per loop using steps(), which mimics the flicker of film grain. Each speckle is black or white at very low alpha, so it adds texture without washing out colours or hurting readability.',
    goodFor: ['Editorial and fashion sites', 'Gradient-heavy heroes', 'Film / music brands', 'Retro aesthetics'],
    prompt: 'Add a subtle animated film grain over the hero: generate a 180×180 noise tile once (canvas → data URL), make each pixel black or white at 0–13% alpha, repeat it on a slightly oversized pointer-events: none overlay (no blend mode needed), and jitter it with a 0.9s steps(6) keyframe that translates it to random offsets. Keep text contrast intact, pause off-screen, and show static grain for reduced motion.',
    init(stage) {
      const size = 180;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      const data = ctx.createImageData(size, size);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = Math.random() < 0.5 ? 0 : 255;
        data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
        data.data[i + 3] = Math.random() * 34;
      }
      ctx.putImageData(data, 0, 0);
      stage.style.setProperty('--noise', `url(${canvas.toDataURL('image/png')})`);
      const toggle = stage.querySelector('input');
      toggle.addEventListener('change', () => stage.classList.toggle('no-grain', !toggle.checked));
    },
  });
})();
