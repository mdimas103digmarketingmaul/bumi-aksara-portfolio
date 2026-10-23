/* =========================================================================
   07 · Microinteractions
   ========================================================================= */
(function () {
  'use strict';

  Lab.define({
    id: 'ripple',
    category: 'micro',
    name: 'Ripple Interaction',
    aliases: ['Material Ripple', 'Ink Ripple', 'Touch Feedback'],
    triggers: ['click'],
    level: 1,
    complexity: 1,
    hint: 'Click or tap different spots. Keyboard (Enter/Space) ripples from the centre.',
    anatomy: {
      trigger: 'Press (pointer, touch or keyboard)',
      target: 'A circle injected at the press point',
      transform: 'scale 0 → 1 · opacity 0.3 → 0',
      character: 'Ease-out, quick (650ms), fades as it grows',
    },
    tech: 'JS creates a span · CSS keyframes · removed on animationend',
    does: 'On press, a circle is created exactly where you touched, sized to cover the farthest corner. It expands while fading out, then deletes itself. The press point is the origin of the motion, which is what makes it feel physical.',
    goodFor: ['Buttons and list items', 'Mobile-first apps', 'Material-style UIs', 'Large tappable cards'],
    prompt: 'Add a ripple interaction to all buttons with [data-ripple]: on pointerdown create a circular span at the press position, sized to 2× the distance to the farthest corner, animate scale 0→1 and opacity 0.3→0 over 650ms ease-out, and remove it on animationend. For keyboard activation start the ripple from the centre, keep it behind the label (z-index), clip with overflow: hidden, and skip it for reduced motion.',
    init(stage) {
      const spawn = (el, x, y) => {
        if (Lab.reduced) return;
        const r = el.getBoundingClientRect();
        const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
        const dot = document.createElement('span');
        dot.className = 'ripple';
        dot.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
        dot.addEventListener('animationend', () => dot.remove());
        el.appendChild(dot);
      };
      stage.querySelectorAll('[data-ripple]').forEach((el) => {
        el.addEventListener('pointerdown', (e) => {
          const r = el.getBoundingClientRect();
          spawn(el, e.clientX - r.left, e.clientY - r.top);
        });
        el.addEventListener('click', (e) => {
          if (e.detail !== 0) return; // keyboard-triggered clicks have detail 0
          spawn(el, el.offsetWidth / 2, el.offsetHeight / 2);
        });
      });
    },
  });

  Lab.define({
    id: 'icon-morph',
    category: 'micro',
    name: 'Icon Morph',
    aliases: ['Hamburger to Close', 'Animated Icon', 'Shape Tween'],
    triggers: ['click'],
    level: 1,
    complexity: 2,
    hint: 'Toggle each icon. The same pieces rearrange instead of swapping images.',
    anatomy: {
      trigger: 'Click / tap / Enter',
      target: 'The icon’s bars or polygons',
      transform: 'rotate · translate · scaleX · clip-path polygon',
      character: 'Ease-out (menu, play) · spring (plus)',
    },
    tech: 'CSS transitions on the same elements · clip-path polygons with equal point counts',
    does: 'The morph feels connected because nothing is replaced: the hamburger’s top and bottom bars travel to the centre and rotate into an X while the middle bar collapses. Play → pause morphs two clip-path polygons with the same number of points, so the browser can interpolate between them.',
    goodFor: ['Mobile menu buttons', 'Media players', 'Expand / collapse controls', 'Toolbar toggles'],
    prompt: 'Animate the mobile menu button from hamburger to close: move the top and bottom bars to the centre and rotate them ±45°, collapse the middle bar with scaleX(0) and opacity 0, using 450ms ease-out transitions on the same elements (no icon swap). Toggle aria-pressed/aria-expanded and update the aria-label between “Open menu” and “Close menu”.',
    init(stage) {
      const labels = { 'menu-icon': ['Open menu', 'Close menu'], 'play-icon': ['Play', 'Pause'], 'plus-icon': ['Expand', 'Collapse'] };
      stage.querySelectorAll('button').forEach((btn) => {
        const [off, on] = labels[btn.className];
        btn.addEventListener('click', () => {
          const pressed = btn.getAttribute('aria-pressed') !== 'true';
          btn.setAttribute('aria-pressed', String(pressed));
          btn.setAttribute('aria-label', pressed ? on : off);
        });
      });
    },
  });

  Lab.define({
    id: 'spring-toggle',
    category: 'micro',
    name: 'Spring Toggle',
    aliases: ['Bouncy Switch', 'iOS-style Switch', 'Elastic Toggle'],
    triggers: ['click'],
    level: 1,
    complexity: 1,
    hint: 'Flip the top two, then the linear one. Press and hold to see the knob squish.',
    anatomy: {
      trigger: 'Click / tap / Space',
      target: 'The switch knob (+ track colour)',
      transform: 'translateX · width (squish while pressed)',
      character: 'Spring: a small overshoot, then settles',
    },
    tech: 'CSS transition with a linear() spring curve',
    does: 'The knob’s transition uses a spring curve sampled into CSS linear(). It travels a little past its destination (about 16% overshoot) and settles back, like a real switch. While pressed, the knob stretches slightly, which signals that it is being held.',
    goodFor: ['Settings screens', 'Preference panels', 'Mobile apps', 'Onboarding choices'],
    prompt: 'Restyle the settings toggles as spring switches: role="switch" buttons with aria-checked, a knob that translates with a 600ms spring easing (use CSS linear() with a sampled damped spring, ~15% overshoot, falling back to cubic-bezier(0.34, 1.56, 0.64, 1)), a track colour transition, and a slight knob stretch on :active. Keep the overshoot tasteful and use a plain 150ms transition for reduced motion.',
    init(stage) {
      stage.querySelectorAll('.switch').forEach((sw) => {
        sw.addEventListener('click', () => sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true')));
      });
    },
  });

  Lab.define({
    id: 'accordion',
    category: 'micro',
    name: 'Accordion Motion',
    aliases: ['Expand / Collapse', 'Disclosure', 'Collapsible Panel'],
    triggers: ['click'],
    level: 1,
    complexity: 2,
    hint: 'Open and close the questions. Height animates smoothly to the content’s natural size.',
    anatomy: {
      trigger: 'Click / Enter / Space on the header',
      target: 'Panel height · text · plus icon',
      transform: 'grid-template-rows 0fr → 1fr · opacity · rotate',
      character: 'Ease-out, content follows 100ms later',
    },
    tech: 'CSS grid-template-rows transition + ARIA',
    does: 'Animating to height: auto isn’t possible in most browsers, so the panel is a one-row grid that transitions from 0fr to 1fr. That reaches the content’s natural height without measuring it in JavaScript. The text fades in slightly after the panel starts opening, and the plus rotates into a minus.',
    goodFor: ['FAQs', 'Product specifications', 'Filters and settings', 'Mobile navigation'],
    prompt: 'Make the FAQ accordion expand smoothly: render each header as a <button> with aria-expanded and aria-controls, make the panel a one-row grid that transitions grid-template-rows from 0fr to 1fr over 450ms ease-out (inner wrapper min-height: 0; overflow: hidden), fade and slide the text in 100ms after opening starts, and rotate the plus icon into a minus. Hide collapsed content with visibility so screen readers skip it.',
    init(stage) {
      stage.querySelectorAll('.acc__trigger').forEach((btn) => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const sync = () => panel.classList.toggle('is-open', btn.getAttribute('aria-expanded') === 'true');
        btn.addEventListener('click', () => {
          btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
          sync();
        });
        sync();
      });
    },
  });
})();
