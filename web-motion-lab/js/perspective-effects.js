/* =========================================================================
   08 · 3D & Perspective
   Pure CSS 3D (perspective + preserve-3d + translateZ), driven by JS input.
   ========================================================================= */
(function () {
  'use strict';
  const { clamp } = Lab;

  Lab.define({
    id: 'perspective-card',
    category: 'perspective',
    name: 'Perspective Card',
    aliases: ['Depth Card', 'Parallax Card', 'Layered 3D Card'],
    triggers: ['mouse', 'hover'],
    level: 2,
    complexity: 2,
    pointer: true,
    hint: 'Move over the card. The badge, sun and title float at different depths.',
    anatomy: {
      trigger: 'Pointer position over the stage',
      target: 'Card + child layers at different Z depths',
      transform: 'rotateX / rotateY (card) · translateZ (layers)',
      character: 'Spring follow, returns to a resting angle',
    },
    tech: 'CSS perspective + transform-style: preserve-3d + JS springs',
    does: 'Unlike a simple tilt, the children live in real 3D space: the badge sits 80px in front of the card, the title 50px, the sun 60px. When the card rotates, those layers shift against the background (parallax for free) because the browser renders true perspective.',
    goodFor: ['Collectible / product cards', 'Event tickets', 'Album and book covers', 'Hero feature cards'],
    prompt: 'Turn the product card into a layered perspective card: set perspective: 1000px on the container and transform-style: preserve-3d on the card, place child elements at translateZ depths (background 0, title 50px, badge 80px), and rotate the card up to 16° on X/Y based on pointer position using spring physics. Rest at a slight angle (rotateX 6°, rotateY −10°) so the depth reads at a glance, and keep that static pose for touch and reduced motion.',
    init(stage) {
      const card = stage.querySelector('.pcard__card');
      const readout = stage.querySelector('[data-readout]');
      const REST_X = 6, REST_Y = -10;
      const rx = Lab.spring({ stiffness: 120, damping: 14, value: REST_X });
      const ry = Lab.spring({ stiffness: 120, damping: 14, value: REST_Y });
      const render = () => {
        card.style.setProperty('--rx', rx.value.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.value.toFixed(2) + 'deg');
        readout.innerHTML = `rotateX <b>${rx.value.toFixed(1)}°</b> · rotateY <b>${ry.value.toFixed(1)}°</b> · badge translateZ <b>${(80 * Lab.k).toFixed(0)}px</b>`;
      };
      const ticker = Lab.loop(stage, (dt) => {
        const a = rx.step(dt);
        const b = ry.step(dt);
        render();
        return a || b;
      });
      Lab.pointer(stage, {
        move(p) {
          if (Lab.reduced || p.type !== 'mouse') return;
          const max = 16 * Lab.k;
          ry.target = clamp(p.nx * 1.4, -1, 1) * max;
          rx.target = -clamp(p.ny * 1.4, -1, 1) * max;
          ticker.wake();
        },
        leave() { rx.target = REST_X; ry.target = REST_Y; ticker.wake(); },
      });
      Lab.onChange(render);
      render();
    },
  });

  Lab.define({
    id: 'layer-stack',
    category: 'perspective',
    name: '3D Layer Stack',
    aliases: ['Exploded View', 'Isometric Layers', 'Z-axis Stack'],
    triggers: ['mouse'],
    level: 2,
    complexity: 2,
    hint: 'Drag the slider to separate the layers. Pointer movement adjusts the viewing angle.',
    anatomy: {
      trigger: 'Slider input + pointer position',
      target: 'Three UI planes (background, content, foreground)',
      transform: 'translateZ per plane · scene rotateX / rotateZ',
      character: 'Ease-out on separation, light linear follow on tilt',
    },
    tech: 'CSS 3D transforms with custom properties',
    does: 'The scene is rotated into an isometric view, and each plane is pushed along Z by its index × the gap. At gap 0 it looks like a flat interface; increasing the gap “explodes” it, showing that the UI is built from stacked layers. It’s a great way to explain hierarchy and z-index.',
    goodFor: ['Explaining UI architecture', 'Product feature breakdowns', 'Design system documentation', 'Tech hero visuals'],
    prompt: 'Create an exploded 3D layer stack illustration of our UI: rotate a preserve-3d scene to an isometric angle (rotateX 56°, rotateZ −38°), place background, content and foreground planes at translateZ = index × --gap, and animate --gap from 0 to ~80px on scroll entry (or via a slider) with ease-out. Let the pointer adjust the viewing angle by ±8°, label each layer, and show a flat static view for reduced motion.',
    init(stage) {
      const scene = stage.querySelector('.lstack__scene');
      const range = stage.querySelector('input');
      const readout = stage.querySelector('[data-readout]');
      const apply = () => {
        const gap = (range.value / 100) * 140 * Lab.k;
        scene.style.setProperty('--gap', gap.toFixed(1) + 'px');
        readout.innerHTML = `translateZ gap <b>${gap.toFixed(0)}px</b> · planes at <b>0 / ${gap.toFixed(0)} / ${(gap * 2).toFixed(0)}px</b>`;
      };
      range.addEventListener('input', apply);
      Lab.onChange(apply);
      Lab.pointer(stage, {
        move(p, e) {
          if (Lab.reduced || p.type !== 'mouse' || e.target === range) return;
          scene.style.setProperty('--tilt-x', (-p.ny * 8).toFixed(2) + 'deg');
          scene.style.setProperty('--tilt-y', (p.nx * 8).toFixed(2) + 'deg');
        },
        leave() { scene.style.setProperty('--tilt-x', '0deg'); scene.style.setProperty('--tilt-y', '0deg'); },
      });
      apply();
    },
  });

  Lab.define({
    id: 'carousel-3d',
    category: 'perspective',
    name: '3D Carousel',
    aliases: ['Ring Carousel', 'Cylinder Slider', 'Rotating Gallery'],
    triggers: ['click', 'mouse'],
    level: 2,
    complexity: 2,
    hint: 'Use the arrows, drag/swipe sideways, or focus the ring and press ← →.',
    anatomy: {
      trigger: 'Click · drag · arrow keys',
      target: 'A ring of six cards',
      transform: 'rotateY of the ring (cards fixed at 60° steps)',
      character: 'Ease-out snap to the nearest card',
    },
    tech: 'CSS 3D (rotateY + translateZ) + pointer drag',
    does: 'Each card is rotated by its index × 60° and pushed outward by the ring radius, so together they form a cylinder. Navigation rotates the entire ring, not individual cards. While dragging, the ring follows your finger directly, and on release it snaps to the nearest card with an ease-out.',
    goodFor: ['Product showcases', 'Portfolio highlights', 'Event line-ups', 'Playful galleries'],
    prompt: 'Build a 3D carousel of 6 cards: place each card with rotateY(i × 60°) translateZ(radius) where radius = (cardWidth / 2) / tan(π / 6), and rotate the preserve-3d ring (not the cards) to navigate. Support prev/next buttons, arrow keys on the focused carousel and horizontal drag that follows the pointer and snaps to the nearest card with an 800ms ease-out on release. Dim non-front cards, keep vertical page scrolling on touch (touch-action: pan-y), and announce “3 / 6” in an aria-live region.',
    init(stage) {
      const viewport = stage.querySelector('.carousel__viewport');
      const ring = stage.querySelector('.carousel__ring');
      const cards = [...ring.children];
      const status = stage.querySelector('.carousel__status');
      const n = cards.length;
      const step = 360 / n;
      let index = 0;

      cards.forEach((card, i) => card.style.setProperty('--i', i));
      const setRadius = () => {
        const radius = Math.round((ring.offsetWidth / 2) / Math.tan(Math.PI / n)) + 24;
        stage.style.setProperty('--radius', radius + 'px');
      };
      const render = (angle = -index * step) => {
        ring.style.setProperty('--ring-angle', angle + 'deg');
        const front = ((index % n) + n) % n;
        cards.forEach((card, i) => card.classList.toggle('is-front', i === front));
        status.textContent = `${front + 1} / ${n}`;
      };
      const go = (dir) => { index += dir; render(); };

      stage.querySelectorAll('[data-dir]').forEach((btn) => btn.addEventListener('click', () => go(Number(btn.dataset.dir))));
      viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      });

      let startX = 0, dragging = false, pointerId = null;
      viewport.addEventListener('pointerdown', (e) => {
        dragging = true; startX = e.clientX; pointerId = e.pointerId;
        viewport.setPointerCapture(pointerId);
        stage.classList.add('is-dragging');
      });
      viewport.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        render(-index * step + (e.clientX - startX) * 0.35);
      });
      const end = (e) => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('is-dragging');
        if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
        const dragged = ((e.clientX || startX) - startX) * 0.35;
        index -= Math.round(dragged / step);
        render();
      };
      viewport.addEventListener('pointerup', end);
      viewport.addEventListener('pointercancel', end);

      new ResizeObserver(setRadius).observe(ring);
      setRadius();
      render();
    },
  });
})();
