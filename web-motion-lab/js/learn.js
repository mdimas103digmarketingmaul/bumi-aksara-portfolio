/* =========================================================================
   Web Motion Lab — learning sections
   Hero anatomy map, easing playground, vocabulary filter, prompt builder
   and the signature-motion wireframe.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- Hero: anatomy map with live specimens ---------- */
  const EXAMPLES = {
    magnetic: {
      trigger: 'Pointer within ~60px of the button',
      target: 'The button',
      transform: 'translate(x, y) toward the pointer',
      character: 'Spring return, slight overshoot',
      sentence: 'When the <b class="s-trigger">pointer comes near</b>, move <b class="s-target">the button</b> with a <b class="s-transform">translate toward the pointer</b>, and return it with a <b class="s-character">spring</b>.',
    },
    reveal: {
      trigger: 'Entering the viewport',
      target: 'Three cards',
      transform: 'opacity 0 → 1 · translateY 30px → 0',
      character: 'Ease-out, 80ms stagger',
      sentence: 'When <b class="s-target">the cards</b> <b class="s-trigger">enter the viewport</b>, <b class="s-transform">fade them in and move them up 30px</b> with an <b class="s-character">ease-out curve and an 80ms stagger</b>.',
    },
    scramble: {
      trigger: 'Hover · focus · click',
      target: 'Each character of the label',
      transform: 'glyph content (random → final)',
      character: 'Rapid flicker, resolves left → right',
      sentence: 'On <b class="s-trigger">hover or focus</b>, cycle <b class="s-target">each character</b> through <b class="s-transform">random glyphs until it lands on the real letter</b>, resolving <b class="s-character">quickly from left to right</b>.',
    },
  };

  const map = document.getElementById('anatomy-map');
  if (map) {
    const tabs = map.querySelector('[data-anatomy-tabs]');
    const nodes = map.querySelectorAll('[data-node]');
    const specimens = map.querySelectorAll('[data-specimen]');
    const specimenStage = document.getElementById('specimen-stage');
    const revealRow = map.querySelector('.specimen-reveal');
    const scrambleBtn = map.querySelector('.specimen-scramble');

    const playReveal = () => {
      revealRow.classList.remove('is-in');
      void revealRow.offsetWidth;
      requestAnimationFrame(() => revealRow.classList.add('is-in'));
    };
    const show = (key) => {
      const ex = EXAMPLES[key];
      nodes.forEach((node) => {
        const field = node.dataset.node;
        if (field === 'sentence') node.innerHTML = ex.sentence;
        else node.textContent = ex[field];
        node.classList.remove('is-swapping');
        void node.offsetWidth;
        node.classList.add('is-swapping');
      });
      specimens.forEach((s) => { s.hidden = s.dataset.specimen !== key; });
      tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.example === key)));
      if (key === 'reveal') playReveal();
      if (key === 'scramble') Lab.scramble(scrambleBtn, 'DECODE ME', { duration: 900 });
    };

    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-example]');
      if (btn) show(btn.dataset.example);
    });
    Lab.magnet(map.querySelector('.specimen-btn'), specimenStage, { radius: 60, strength: 0.35 });
    map.querySelector('.specimen-replay').addEventListener('click', playReveal);
    ['pointerenter', 'focus', 'click'].forEach((type) => scrambleBtn.addEventListener(type, () => Lab.scramble(scrambleBtn, 'DECODE ME', { duration: 900 })));
    show('magnetic');
  }

  /* ---------- Easing playground ---------- */
  // Sample a loosely damped oscillation into CSS linear() so "Elastic" is a real curve.
  if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)')) {
    const points = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      points.push((1 - Math.exp(-6 * t) * Math.cos(2 * Math.PI * 3.2 * t)).toFixed(3));
    }
    points[points.length - 1] = '1';
    document.documentElement.style.setProperty('--elastic', `linear(${points.join(', ')})`);
  }
  const easing = document.getElementById('easing-playground');
  const easingBtn = document.getElementById('easing-play');
  if (easing && easingBtn) {
    easingBtn.addEventListener('click', () => {
      const on = easing.classList.toggle('is-on');
      easingBtn.textContent = on ? 'Play back' : 'Play';
    });
  }

  /* ---------- Vocabulary filter ---------- */
  const vocabSearch = document.getElementById('vocab-search');
  if (vocabSearch) {
    const items = [...document.querySelectorAll('#vocab-list .vocab__item')];
    const empty = document.getElementById('vocab-empty');
    vocabSearch.addEventListener('input', () => {
      const q = vocabSearch.value.toLowerCase().trim();
      let shown = 0;
      items.forEach((item) => {
        const match = !q || item.textContent.toLowerCase().includes(q);
        item.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  }

  /* ---------- Prompt builder ---------- */
  const PARTS = {
    target: [
      ['Hero illustration', 'the hero illustration'],
      ['Primary CTA button', 'the primary CTA button'],
      ['Project cards', 'the project cards'],
      ['Section heading', 'the section heading'],
      ['Product image', 'the product image'],
      ['Page background', 'the page background'],
    ],
    trigger: [
      ['Pointer movement', 'in response to pointer movement within its section'],
      ['Hover / focus', 'on hover and keyboard focus'],
      ['Scroll position (scrubbed)', 'driven by the scroll position'],
      ['Entering the viewport', 'when it enters the viewport'],
      ['Click / tap', 'on click or tap'],
      ['Page load', 'once on page load'],
      ['Time (ambient loop)', 'on a slow continuous loop'],
    ],
    transform: [
      ['Translate (move)', 'translate it on x/y'],
      ['Scale', 'scale it'],
      ['Rotate', 'rotate it'],
      ['Fade + rise (reveal)', 'fade it in while moving it up about 40px'],
      ['Blur → focus', 'transition it from blurred to sharp'],
      ['Clip-path / mask reveal', 'reveal it with an animated clip-path'],
      ['3D tilt (perspective)', 'tilt it in 3D with rotateX/rotateY under perspective'],
      ['Colour / gradient', 'shift its colour or gradient'],
    ],
    relationship: [
      ['Layered depth', 'foreground layers move more strongly than background layers'],
      ['Linked to progress', 'its progress is directly linked to the input and reverses when the input reverses'],
      ['Staggered sequence', 'child elements animate one after another with a small stagger'],
      ['Follows the pointer', 'it follows the pointer position'],
      ['Plays once', 'it plays once and then rests in its final state'],
      ['Independent loop', 'it loops continuously, independent of user input'],
    ],
    character: [
      ['Smooth inertia', 'smooth inertia (frame-rate independent damping)'],
      ['Ease-out', 'an ease-out curve (fast start, soft landing)'],
      ['Ease-in-out', 'an ease-in-out curve'],
      ['Spring (slight overshoot)', 'spring physics with a slight overshoot before settling'],
      ['Linear', 'linear timing'],
      ['Elastic', 'an elastic, bouncy settle'],
    ],
    intensity: [
      ['Subtle / premium', 'Keep it subtle and premium: small distances, nothing that competes with the content'],
      ['Expressive', 'Make it expressive but controlled: clearly noticeable, supporting the story'],
      ['Experimental', 'Make it bold and experimental, while keeping it smooth and performant'],
    ],
    fallback: [
      ['Touch + reduced motion', 'Disable pointer-only behaviour on touch devices and show a static state for prefers-reduced-motion'],
      ['Reduced motion only', 'Show a static state for prefers-reduced-motion'],
      ['Touch alternative', 'Provide a touch-friendly alternative on devices without hover'],
    ],
  };
  const builder = document.getElementById('prompt-builder');
  if (builder) {
    const output = document.getElementById('builder-output');
    const selects = [...builder.querySelectorAll('select[data-part]')];
    selects.forEach((select) => {
      PARTS[select.dataset.part].forEach(([label], i) => select.add(new Option(label, String(i))));
    });
    const pick = (part) => PARTS[part][Number(builder.querySelector(`[data-part="${part}"]`).value)][1];
    const update = () => {
      output.textContent = `Animate ${pick('target')} ${pick('trigger')}: ${pick('transform')} so that ${pick('relationship')}. Use ${pick('character')}. ${pick('intensity')}. ${pick('fallback')}. Animate only transform and opacity where possible.`;
    };
    selects.forEach((s) => s.addEventListener('change', update));
    update();
  }

  /* ---------- Signature motion wireframe ---------- */
  const site = document.querySelector('.sig-site');
  if (site) {
    const panel = site.closest('.signature');
    document.querySelectorAll('.sig-list li').forEach((li) => {
      li.tabIndex = 0;
      const focus = () => { site.dataset.focus = li.dataset.zone; };
      const blur = () => { delete site.dataset.focus; };
      li.addEventListener('pointerenter', focus);
      li.addEventListener('focus', focus);
      li.addEventListener('pointerleave', blur);
      li.addEventListener('blur', blur);
    });
    const dots = site.querySelectorAll('.sig-dot');
    Lab.pointer(site, {
      move(p) {
        if (Lab.reduced) return;
        dots.forEach((dot, i) => {
          const depth = (i + 1) * 4 * Lab.k;
          dot.style.setProperty('--dx', (-p.nx * depth).toFixed(1) + 'px');
          dot.style.setProperty('--dy', (-p.ny * depth).toFixed(1) + 'px');
        });
      },
      leave() { dots.forEach((dot) => { dot.style.setProperty('--dx', '0px'); dot.style.setProperty('--dy', '0px'); }); },
    });
    Lab.magnet(site.querySelector('.sig-cta'), site, { radius: 40, strength: 0.3 });
    const product = site.querySelector('.sig-hero__product');
    Lab.onScroll(site, ({ progress }) => {
      const p = Lab.reduced ? 0.5 : progress;
      product.style.setProperty('--s', Lab.lerp(0.78, 1.08, p).toFixed(3));
      product.style.setProperty('--r', (Lab.lerp(-16, 12, p) * Lab.k).toFixed(2) + 'deg');
    });
    Lab.onVisible(panel, (visible) => panel.classList.toggle('is-paused', !visible));
  }
})();
