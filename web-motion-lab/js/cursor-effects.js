/* =========================================================================
   01 · Cursor & Pointer
   Every listener is attached to its own stage — never to window — so the
   rest of the lab keeps a normal cursor and normal scrolling.
   ========================================================================= */
(function () {
  'use strict';
  const { damp, clamp } = Lab;

  Lab.define({
    id: 'cursor-spotlight',
    category: 'cursor',
    name: 'Cursor Spotlight',
    aliases: ['Mouse Spotlight', 'Flashlight Effect'],
    triggers: ['mouse'],
    level: 2,
    complexity: 1,
    pointer: true,
    hint: 'Move across the dark surface. On touch, tap to move the light.',
    anatomy: {
      trigger: 'Pointer movement inside the section',
      target: 'A radial light/shade layer over the content',
      transform: 'Gradient centre position (--x, --y)',
      character: 'Direct 1:1 tracking, no easing',
    },
    tech: 'CSS radial-gradient + JS writing CSS variables',
    does: 'A dark overlay with a transparent hole follows the pointer, so content is only readable where the “flashlight” points. JavaScript only writes two CSS variables; the browser paints the gradient.',
    goodFor: ['Dark hero sections', 'Hidden-detail reveals', 'Feature grids', 'Playful product teasers'],
    prompt: 'Add a cursor spotlight to the dark hero section: overlay a radial-gradient shade that is transparent around the pointer (about 150px radius) and darkens to ~94% opacity outside it. Track the pointer 1:1 by writing --x/--y CSS variables on pointermove inside the section only. On touch devices, move the light on tap and keep the content readable without the effect.',
    init(stage) {
      const set = (p) => {
        stage.style.setProperty('--x', p.x + 'px');
        stage.style.setProperty('--y', p.y + 'px');
      };
      Lab.pointer(stage, { move: set, down: set });
    },
  });

  Lab.define({
    id: 'cursor-glow',
    category: 'cursor',
    name: 'Cursor Glow',
    aliases: ['Pointer Glow', 'Hover Light', 'Border Glow'],
    triggers: ['mouse'],
    level: 1,
    complexity: 2,
    pointer: true,
    hint: 'Move slowly between the cards and watch the borders catch the light.',
    anatomy: {
      trigger: 'Pointer movement over the card group',
      target: 'A soft glow blob + each card’s border',
      transform: 'translate (blob) · gradient position (borders)',
      character: 'Smoothed follow (damped lerp)',
    },
    tech: 'CSS gradients + mask-composite + JS damping',
    does: 'A soft light trails slightly behind the pointer, and each card’s border lights up on the side nearest the cursor. It feels like light moving across glass rather than objects moving.',
    goodFor: ['SaaS feature grids', 'Pricing cards', 'Dark dashboards', 'Developer tool landing pages'],
    prompt: 'Add a subtle cursor glow to the feature card grid: a large blurred radial light that follows the pointer with smooth damping, plus a 1px border highlight on each card that is brightest at the point nearest the cursor (radial-gradient masked to the border with mask-composite). Scope listeners to the grid, fade the glow out on pointer leave, and skip the effect on touch.',
    init(stage) {
      const cards = [...stage.querySelectorAll('.glow-card')];
      let x = 0, y = 0, tx = 0, ty = 0;
      const ticker = Lab.loop(stage, (dt) => {
        const lambda = Lab.reduced ? 60 : 9;
        x = damp(x, tx, lambda, dt);
        y = damp(y, ty, lambda, dt);
        stage.style.setProperty('--bx', x.toFixed(1) + 'px');
        stage.style.setProperty('--by', y.toFixed(1) + 'px');
        return Math.abs(x - tx) > 0.3 || Math.abs(y - ty) > 0.3;
      });
      Lab.pointer(stage, {
        enter(p) {
          if (!stage.classList.contains('was-hovered')) { x = p.x; y = p.y; stage.classList.add('was-hovered'); }
          stage.classList.add('is-hovering');
        },
        move(p, e) {
          tx = p.x; ty = p.y;
          ticker.wake();
          cards.forEach((card) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--gx', (e.clientX - r.left).toFixed(0) + 'px');
            card.style.setProperty('--gy', (e.clientY - r.top).toFixed(0) + 'px');
          });
        },
        leave() {
          stage.classList.remove('is-hovering');
          cards.forEach((card) => { card.style.setProperty('--gx', '-500px'); card.style.setProperty('--gy', '-500px'); });
        },
      });
    },
  });

  Lab.define({
    id: 'cursor-follower',
    category: 'cursor',
    name: 'Cursor Follower',
    aliases: ['Custom Cursor', 'Lagging Cursor Ring', 'Contextual Cursor'],
    triggers: ['mouse'],
    level: 2,
    complexity: 2,
    pointer: true,
    hint: 'Move inside the frame, then hover a tile — the ring grows and labels the action.',
    anatomy: {
      trigger: 'Pointer movement + hovering interactive items',
      target: 'A dot (exact) and a ring (lagging)',
      transform: 'translate · scale · label opacity',
      character: 'Inertia / lag on the ring, ease-out on state change',
    },
    tech: 'JS rAF loop + CSS transitions',
    does: 'The real cursor is replaced by a small dot that tracks exactly and a ring that follows with a slight delay. Over interactive items the ring grows and shows a contextual label such as “View” or “Play”.',
    goodFor: ['Creative portfolios', 'Agency showcases', 'Video and gallery grids'],
    prompt: 'Add a custom cursor follower only inside the portfolio grid: a 6px dot that follows the pointer exactly and a 40px ring that follows with smooth inertia (frame-rate independent damping). When hovering an element with data-cursor="View", scale the ring up, fill it, and show the label. Keep the native cursor everywhere else, hide the follower when the pointer leaves, and disable it on touch devices.',
    init(stage) {
      const label = stage.querySelector('.follower__label');
      let rx = -100, ry = -100, tx = -100, ty = -100;
      if (Lab.fine) stage.classList.add('is-custom');
      const ticker = Lab.loop(stage, (dt) => {
        const lambda = Lab.reduced ? 80 : 11 / Lab.k;
        rx = damp(rx, tx, lambda, dt);
        ry = damp(ry, ty, lambda, dt);
        stage.style.setProperty('--rx', rx.toFixed(1) + 'px');
        stage.style.setProperty('--ry', ry.toFixed(1) + 'px');
        return Math.abs(rx - tx) > 0.2 || Math.abs(ry - ty) > 0.2;
      });
      Lab.pointer(stage, {
        enter(p) { rx = tx = p.x; ry = ty = p.y; stage.classList.add('is-hovering'); },
        move(p, e) {
          tx = p.x; ty = p.y;
          stage.style.setProperty('--fx', p.x + 'px');
          stage.style.setProperty('--fy', p.y + 'px');
          const target = e.target.closest('[data-cursor]');
          stage.classList.toggle('is-target', !!target);
          if (target) label.textContent = target.dataset.cursor;
          ticker.wake();
        },
        leave() { stage.classList.remove('is-hovering', 'is-target'); },
      });
    },
  });

  Lab.define({
    id: 'cursor-trail',
    category: 'cursor',
    name: 'Cursor Trail',
    aliases: ['Mouse Trail', 'Pointer Ribbon', 'Comet Trail'],
    triggers: ['mouse'],
    level: 2,
    complexity: 2,
    pointer: true,
    hint: 'Draw quick loops. Strong intensity keeps the trail alive longer.',
    anatomy: {
      trigger: 'Pointer movement',
      target: 'Recent pointer positions drawn on a canvas',
      transform: 'stroke width · opacity · colour by age',
      character: 'Linear fade-out over a fixed lifetime',
    },
    tech: 'Canvas 2D + rAF (sleeps when the trail is empty)',
    does: 'Each pointer position is stored with a timestamp. Every frame the canvas redraws the recent points as a ribbon that gets thinner and more transparent with age, then the loop stops once every point has expired.',
    goodFor: ['Playful campaign pages', 'Interactive art', 'Drawing / signature moments'],
    prompt: 'Add a pointer trail on a full-bleed canvas behind the hero copy. Store pointer positions (including coalesced events) with timestamps, and each frame draw them as a tapered ribbon whose width and opacity fade linearly over ~650ms, shifting from amber at the head to soft blue at the tail. Stop the animation loop when no points remain, handle devicePixelRatio, and skip on touch devices.',
    init(stage) {
      const canvas = stage.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      let points = [];
      let w = 0, h = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = stage.clientWidth; h = stage.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      new ResizeObserver(resize).observe(stage);

      const ticker = Lab.loop(stage, () => {
        const now = performance.now();
        const life = (Lab.reduced ? 160 : 650) * Lab.k;
        points = points.filter((p) => now - p.t < life);
        ctx.clearRect(0, 0, w, h);
        ctx.lineCap = 'round';
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i];
          const age = 1 - (now - b.t) / life;
          ctx.strokeStyle = `rgba(${Math.round(146 + 87 * age)}, ${Math.round(178 + 6 * age)}, ${Math.round(255 - 141 * age)}, ${age.toFixed(3)})`;
          ctx.lineWidth = 1 + age * 14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (!points.length) stage.classList.remove('is-drawing');
        return points.length > 0;
      });

      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        (events.length ? events : [e]).forEach((ev) => points.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, t: performance.now() }));
        stage.classList.add('is-drawing');
        ticker.wake();
      }, { passive: true });
    },
  });

  Lab.define({
    id: 'mouse-parallax',
    category: 'cursor',
    name: 'Mouse Parallax',
    aliases: ['Pointer Reactive Parallax', 'Depth Parallax', 'Layered Hover Parallax'],
    triggers: ['mouse'],
    level: 2,
    complexity: 2,
    pointer: true,
    reducedNote: 'Static in reduced mode',
    hint: 'Move from corner to corner. Near layers travel further than far ones.',
    anatomy: {
      trigger: 'Pointer position within the scene',
      target: 'Five stacked layers with depth values',
      transform: 'translateX / translateY × depth',
      character: 'Smooth inertia (damped follow)',
    },
    tech: 'CSS transforms + JS rAF damping',
    does: 'Each layer has a depth number. The pointer position (−1 to 1) is multiplied by that depth, so the foreground moves a lot and the sky barely moves. The difference in speed is what your eye reads as depth.',
    goodFor: ['Hero illustrations', 'Product presentations', 'Creative landing pages', 'Game / film microsites'],
    prompt: 'Add layered mouse-driven parallax to the hero illustration. Give each layer a data-depth value (0.05 for the background up to ~1.1 for the foreground) and translate it by pointer position × depth × 34px, moving opposite to the pointer. Smooth the motion with frame-rate independent damping so it has gentle inertia, return to centre on pointer leave, and disable it for touch and prefers-reduced-motion.',
    init(stage) {
      const layers = [...stage.querySelectorAll('.px-layer')].map((el) => ({ el, depth: parseFloat(el.dataset.depth) }));
      const readout = stage.querySelector('[data-readout]');
      let x = 0, y = 0, tx = 0, ty = 0;
      const render = () => {
        const range = Lab.reduced ? 0 : 34 * Lab.k;
        layers.forEach(({ el, depth }) => {
          el.style.transform = `translate3d(${(-x * range * depth).toFixed(2)}px, ${(-y * range * depth * 0.6).toFixed(2)}px, 0)`;
        });
        readout.innerHTML = `pointer <b>${x.toFixed(2)}, ${y.toFixed(2)}</b> · shift = pointer × depth × <b>${range.toFixed(0)}px</b>`;
      };
      const ticker = Lab.loop(stage, (dt) => {
        x = damp(x, tx, 4.5, dt);
        y = damp(y, ty, 4.5, dt);
        render();
        return Math.abs(x - tx) > 0.001 || Math.abs(y - ty) > 0.001;
      });
      Lab.pointer(stage, {
        move(p) { tx = p.nx; ty = p.ny; ticker.wake(); },
        leave() { tx = 0; ty = 0; ticker.wake(); },
      });
      Lab.onChange(render);
      render();
    },
  });

  Lab.define({
    id: 'tilt-3d',
    category: 'cursor',
    name: '3D Mouse Tilt',
    aliases: ['Tilt Card', 'Hover Tilt', 'Vanilla-tilt style'],
    triggers: ['mouse', 'hover'],
    level: 2,
    complexity: 2,
    pointer: true,
    reducedNote: 'Tilt disabled in reduced mode',
    hint: 'Hover the card and move around its edges.',
    anatomy: {
      trigger: 'Pointer position over the card',
      target: 'The card + a glare layer',
      transform: 'rotateX / rotateY (with perspective) · glare position',
      character: 'Spring — slight overshoot when settling',
    },
    tech: 'CSS perspective + JS spring physics',
    does: 'The card rotates so the edge under the pointer dips away, as if you were pressing on it. A soft glare follows the pointer to sell the material. On leave, springs pull it back with a tiny overshoot.',
    goodFor: ['Membership or credit cards', 'Product cards', 'Collectibles', 'Pricing highlights'],
    prompt: 'Add a 3D tilt to the product card: set perspective: 900px on the parent and rotate the card up to 12° on rotateX/rotateY based on pointer position relative to the card centre. Animate the angles with a spring (stiffness ~150, damping ~14) so it settles with a slight overshoot, add a soft radial glare that follows the pointer, and reset on pointer leave. Disable for touch and reduced motion.',
    init(stage) {
      const card = stage.querySelector('.tilt__card');
      const readout = stage.querySelector('[data-readout]');
      const rx = Lab.spring({ stiffness: 150, damping: 14 });
      const ry = Lab.spring({ stiffness: 150, damping: 14 });
      const ticker = Lab.loop(stage, (dt) => {
        const a = rx.step(dt);
        const b = ry.step(dt);
        card.style.setProperty('--rx', rx.value.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.value.toFixed(2) + 'deg');
        readout.innerHTML = `rotateX <b>${rx.value.toFixed(1)}°</b> · rotateY <b>${ry.value.toFixed(1)}°</b>`;
        return a || b;
      });
      Lab.pointer(stage, {
        move(p) {
          if (Lab.reduced) return;
          // Use the untransformed layout box so the tilt itself doesn't skew the maths.
          const nx = clamp((p.x - card.offsetLeft) / card.offsetWidth) * 2 - 1;
          const ny = clamp((p.y - card.offsetTop) / card.offsetHeight) * 2 - 1;
          const max = 12 * Lab.k;
          ry.target = nx * max;
          rx.target = -ny * max;
          card.style.setProperty('--glx', ((nx + 1) * 50).toFixed(1) + '%');
          card.style.setProperty('--gly', ((ny + 1) * 50).toFixed(1) + '%');
          card.style.setProperty('--glare', 1);
          ticker.wake();
        },
        leave() { rx.target = 0; ry.target = 0; card.style.setProperty('--glare', 0); ticker.wake(); },
      });
      readout.innerHTML = 'rotateX <b>0.0°</b> · rotateY <b>0.0°</b>';
    },
  });

  Lab.define({
    id: 'magnetic-button',
    category: 'cursor',
    name: 'Magnetic Button',
    aliases: ['Magnetic Hover', 'Sticky Cursor Button', 'Attraction Effect'],
    triggers: ['mouse'],
    level: 1,
    complexity: 2,
    pointer: true,
    hint: 'Approach a button slowly. The dashed outline is the magnetic field.',
    anatomy: {
      trigger: 'Pointer entering a radius around the button',
      target: 'The button (and its label, at a lower rate)',
      transform: 'translate toward the pointer',
      character: 'Spring return with gentle overshoot',
    },
    tech: 'JS spring physics (Lab.magnet helper)',
    does: 'When the pointer comes within ~70px of the button edge, the button drifts a fraction of the distance toward it. The label moves a bit more than the button, adding a layer of depth. Leaving the field lets a spring pull it home.',
    goodFor: ['Primary CTAs', 'Icon buttons', 'Navigation in creative sites', 'Premium landing pages'],
    prompt: 'Add a subtle magnetic interaction to the primary CTA. When the pointer comes within 70px of the button edge, move the button about 30% of the pointer offset toward it and move the inner label slightly further for depth. Return it smoothly with spring-like settling (stiffness ~220, damping ~16) when the pointer leaves. Keep displacement under control and disable the interaction on touch devices and for reduced motion.',
    init(stage) {
      const toggle = stage.querySelector('input');
      const readout = stage.querySelector('[data-readout]');
      const syncField = () => stage.classList.toggle('show-field', toggle.checked);
      toggle.addEventListener('change', syncField);
      syncField();
      stage.querySelectorAll('.magnetic__btn').forEach((btn, i) => {
        const inner = btn.firstElementChild;
        Lab.magnet(btn, stage, {
          radius: 70,
          strength: 0.3,
          onUpdate(x, y) {
            inner.style.transform = `translate3d(${(x * 0.35).toFixed(2)}px, ${(y * 0.35).toFixed(2)}px, 0)`;
            if (i === 0) readout.innerHTML = `button offset <b>${x.toFixed(1)}px, ${y.toFixed(1)}px</b>`;
          },
        });
      });
      readout.innerHTML = 'button offset <b>0.0px, 0.0px</b>';
    },
  });

  Lab.define({
    id: 'pointer-repulsion',
    category: 'cursor',
    name: 'Pointer Proximity / Repulsion',
    aliases: ['Proximity Effect', 'Repel Field', 'Cursor Avoidance'],
    triggers: ['mouse'],
    level: 2,
    complexity: 2,
    pointer: true,
    reducedNote: 'Colour only in reduced mode',
    hint: 'Sweep across the field — dots react before you touch them.',
    anatomy: {
      trigger: 'Distance between pointer and each object',
      target: 'A grid of dots',
      transform: 'translate away · scale · colour by proximity',
      character: 'Eased falloff (quadratic) + damped return',
    },
    tech: 'JS rAF loop, distance maths, CSS color-mix()',
    does: 'Instead of reacting to hover, every dot measures its distance to the pointer. Inside the radius it is pushed away along that direction, harder the closer it is (a quadratic falloff), then drifts back once the pointer leaves.',
    goodFor: ['Interactive backgrounds', 'Tech / AI brand moments', 'Empty states', 'Section dividers'],
    prompt: 'Create a proximity field behind the section: a grid of small dots where each dot measures its distance to the pointer, and within a 110px radius is pushed away along that direction with a quadratic falloff (max ~38px), scales up slightly and tints toward the accent colour. Return dots with frame-rate independent damping, run the rAF loop only while something is moving, compute positions from grid maths (no layout reads per frame), and disable on touch.',
    init(stage) {
      const grid = stage.querySelector('.repulsion__grid');
      const readout = stage.querySelector('[data-readout]');
      const ROWS = 7;
      let dots = [];
      let cols = 14;
      let px = 0, py = 0, active = false;

      const build = () => {
        const width = grid.clientWidth;
        const nextCols = width < 420 ? 8 : width < 640 ? 11 : 14;
        if (nextCols !== cols || !dots.length) {
          cols = nextCols;
          grid.style.setProperty('--cols', cols);
          grid.textContent = '';
          dots = [];
          for (let i = 0; i < cols * ROWS; i++) {
            const el = document.createElement('span');
            el.className = 'repulsion__dot';
            grid.appendChild(el);
            dots.push({ el, i, x: 0, y: 0, p: 0 });
          }
        }
        const cw = grid.clientWidth / cols;
        const ch = grid.clientHeight / ROWS;
        dots.forEach((d) => {
          d.cx = grid.offsetLeft + ((d.i % cols) + 0.5) * cw;
          d.cy = grid.offsetTop + (Math.floor(d.i / cols) + 0.5) * ch;
        });
      };

      const ticker = Lab.loop(stage, (dt) => {
        const radius = 110 * Lab.k;
        const push = Lab.reduced ? 0 : 38 * Lab.k;
        let moving = false;
        let near = 0;
        dots.forEach((d) => {
          let tx = 0, ty = 0, p = 0;
          if (active) {
            const dx = d.cx - px, dy = d.cy - py;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < radius) {
              p = 1 - dist / radius;
              tx = (dx / dist) * p * p * push;
              ty = (dy / dist) * p * p * push;
              near++;
            }
          }
          d.x = damp(d.x, tx, 10, dt);
          d.y = damp(d.y, ty, 10, dt);
          d.p = damp(d.p, p, 10, dt);
          if (Math.abs(d.x - tx) > 0.05 || Math.abs(d.y - ty) > 0.05 || Math.abs(d.p - p) > 0.01) moving = true;
          d.el.style.transform = `translate3d(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px, 0) scale(${(1 + d.p * 0.6).toFixed(3)})`;
          d.el.style.setProperty('--p', d.p.toFixed(3));
        });
        readout.innerHTML = `radius <b>${radius.toFixed(0)}px</b> · reacting <b>${near}</b> / ${dots.length}`;
        return moving;
      });

      Lab.pointer(stage, {
        move(p) { px = p.x; py = p.y; active = true; ticker.wake(); },
        leave() { active = false; ticker.wake(); },
      });
      new ResizeObserver(build).observe(grid);
      build();
      readout.innerHTML = `radius <b>110px</b> · reacting <b>0</b> / ${dots.length}`;
    },
  });
})();
