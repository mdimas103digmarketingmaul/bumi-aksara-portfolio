/* =========================================================================
   05 · Image & Media
   ========================================================================= */
(function () {
  'use strict';
  const { damp, clamp } = Lab;

  function restart(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  Lab.define({
    id: 'ken-burns',
    category: 'media',
    name: 'Ken Burns',
    aliases: ['Slow Zoom', 'Pan and Zoom', 'Documentary Zoom'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'First slide only in reduced mode',
    hint: 'A slow slideshow: each image drifts and zooms while it is on screen, then crossfades.',
    anatomy: {
      trigger: 'Time (18s loop, 6s per slide)',
      target: 'Each slide image',
      transform: 'scale 1 → 1.18 · translate · opacity crossfade',
      character: 'Linear and very slow (barely noticeable)',
    },
    tech: 'CSS keyframes with per-slide delays',
    does: 'Named after the documentary filmmaker who animated still photos. Each image slowly scales up and drifts in its own direction, which turns a static photo into something that feels filmed. The slides crossfade, so there is never a hard cut.',
    goodFor: ['Hero slideshows', 'Hospitality and real estate', 'Storytelling / documentary pages', 'Background imagery'],
    prompt: 'Turn the hero image set into a Ken Burns slideshow: stack 3 slides, crossfade them on an 18s loop (6s each, ~1s fade), and while each slide is visible slowly scale its image from 1 to 1.18 with a slight translate in a different direction per slide (set via --tx/--ty). Use linear timing, animate only transform and opacity, pause off-screen, and show the first image statically for reduced motion.',
    init() {},
  });

  Lab.define({
    id: 'curtain-reveal',
    category: 'media',
    name: 'Image Curtain / Wipe Reveal',
    aliases: ['Block Reveal', 'Split Reveal', 'Cover Wipe'],
    triggers: ['load', 'scroll'],
    level: 2,
    complexity: 2,
    hint: 'Plays when it enters the viewport. Press Replay to compare both techniques.',
    anatomy: {
      trigger: 'Entering the viewport (or Replay)',
      target: 'Cover panels / colour block + image',
      transform: 'translateX (panels) · scaleX + origin swap (block)',
      character: 'Ease-in-out, sequenced',
    },
    tech: 'CSS keyframes, transform-origin switch at 50%',
    does: 'Curtain: two panels cover the image and slide apart while the image settles from 1.2× to 1×. Wipe: a colour block grows from the left to cover the frame, the image switches on underneath, then the block shrinks away to the right because transform-origin flips at the midpoint.',
    goodFor: ['Portfolio case-study openers', 'Editorial image entrances', 'Product launches', 'Gallery transitions'],
    prompt: 'Add a block wipe reveal to project images on scroll entry: an accent-coloured overlay scales X from 0 to 1 with transform-origin left (0–50% of a 1.4s ease-in-out timeline), the image becomes visible at 50%, then the overlay scales back to 0 with transform-origin right. Trigger once via IntersectionObserver, animate only transform/opacity, and show the image without the overlay for reduced motion.',
    init(stage) {
      const play = () => restart(stage, 'is-playing');
      Lab.onEnter(stage, play, { once: true, threshold: 0.45 });
      return { replay: play };
    },
  });

  Lab.define({
    id: 'image-hover-reveal',
    category: 'media',
    name: 'Image Hover Reveal',
    aliases: ['Floating Preview', 'Cursor Image Follow', 'Hover Thumbnail'],
    triggers: ['hover', 'mouse'],
    level: 2,
    complexity: 2,
    pointer: true,
    hint: 'Move across the project names. On touch, tap a name; keyboard focus works too.',
    anatomy: {
      trigger: 'Hovering a list item + pointer movement',
      target: 'A floating preview image',
      transform: 'translate (follow) · rotate (from velocity) · scale · opacity',
      character: 'Smooth inertia, velocity-based tilt',
    },
    tech: 'JS rAF loop with damping + CSS transitions',
    does: 'One preview element is reused for every row. Hovering a row swaps its image and fades it in. The preview follows the pointer with lag, and tilts in proportion to horizontal speed, so quick movements make it swing like a card on a string.',
    goodFor: ['Agency project indexes', 'Minimal portfolio lists', 'Menus and directories', 'Editorial archives'],
    prompt: 'Add an image hover reveal to the project list: a single floating preview (220px, 4:3) that swaps to the hovered row’s image, fades and scales in, follows the pointer with frame-rate independent damping, and rotates up to ±10° based on horizontal pointer velocity. Position it near the row on keyboard focus, show it at the tap point on touch, hide it on leave, and only run the rAF loop while it is moving.',
    init(stage) {
      const preview = stage.querySelector('.hreveal__preview');
      const img = preview.querySelector('img');
      let x = 0, y = 0, tx = 0, ty = 0, rot = 0, scale = 0.85, targetScale = 0.85, lastTx = 0;
      const ticker = Lab.loop(stage, (dt) => {
        const lambda = Lab.reduced ? 60 : 8;
        x = damp(x, tx, lambda, dt);
        y = damp(y, ty, lambda, dt);
        const vx = dt > 0 ? (tx - lastTx) / dt : 0;
        lastTx = tx;
        const targetRot = Lab.reduced ? 0 : clamp(vx * 0.012 * Lab.k, -10, 10);
        rot = damp(rot, targetRot, 6, dt);
        scale = damp(scale, targetScale, 10, dt);
        preview.style.setProperty('--px', x.toFixed(1) + 'px');
        preview.style.setProperty('--py', y.toFixed(1) + 'px');
        preview.style.setProperty('--pr', rot.toFixed(2) + 'deg');
        preview.style.setProperty('--ps', scale.toFixed(3));
        return Math.abs(x - tx) > 0.3 || Math.abs(y - ty) > 0.3 || Math.abs(rot) > 0.05 || Math.abs(scale - targetScale) > 0.002;
      });
      const show = (row, px, py, jump) => {
        if (img.getAttribute('src') !== row.dataset.img) img.src = row.dataset.img;
        tx = px; ty = py;
        if (jump || !stage.classList.contains('is-previewing')) { x = lastTx = tx; y = ty; }
        targetScale = 1;
        stage.classList.add('is-previewing');
        ticker.wake();
      };
      const hide = () => { stage.classList.remove('is-previewing'); targetScale = 0.85; ticker.wake(); };

      stage.addEventListener('pointermove', (e) => {
        const row = e.target.closest('.hreveal__row');
        const r = stage.getBoundingClientRect();
        if (row) show(row, e.clientX - r.left, e.clientY - r.top);
        else hide();
      }, { passive: true });
      stage.addEventListener('pointerleave', hide);
      stage.querySelectorAll('.hreveal__row').forEach((row) => {
        row.addEventListener('focus', () => {
          const r = stage.getBoundingClientRect();
          const rr = row.getBoundingClientRect();
          show(row, rr.right - r.left - 160, rr.top - r.top + rr.height / 2, true);
        });
        row.addEventListener('blur', hide);
      });
    },
  });

  Lab.define({
    id: 'blur-focus',
    category: 'media',
    name: 'Blur-to-Focus',
    aliases: ['Focus Pull', 'Deblur Reveal', 'Rack Focus'],
    triggers: ['load', 'scroll'],
    level: 1,
    complexity: 1,
    hint: 'Plays on entry. Replay to watch the image pull into focus.',
    anatomy: {
      trigger: 'Entering the viewport (or Replay)',
      target: 'The image',
      transform: 'filter: blur · scale · opacity',
      character: 'Ease-out, cinematic (1.4–1.6s)',
    },
    tech: 'CSS filter + transform transitions',
    does: 'The image starts soft, slightly enlarged and dim, like a camera finding focus, then sharpens and settles. Blur is more expensive than transform, so it is used once on entry and never in a continuous loop.',
    goodFor: ['Hero images', 'Photography portfolios', 'Lazy-loaded media', 'Cinematic brand pages'],
    prompt: 'Add a blur-to-focus entrance to the hero image: start at filter: blur(18px), scale(1.12) and opacity 0.4, and when the image enters the viewport (or finishes loading) transition to blur(0), scale(1) and opacity 1 over ~1.5s with an ease-out curve. Animate it only once, avoid continuous blur animations, and show the sharp image immediately for reduced motion.',
    init(stage) {
      const play = () => {
        stage.classList.remove('is-focused');
        void stage.offsetWidth;
        requestAnimationFrame(() => stage.classList.add('is-focused'));
      };
      Lab.onEnter(stage, play, { once: true, threshold: 0.5 });
      return { replay: play };
    },
  });
})();
