/* =========================================================================
   03 · Scroll Motion
   All scroll-linked demos share core.js's single passive scroll listener
   (Lab.onScroll) and only compute while their stage is near the viewport.
   ========================================================================= */
(function () {
  'use strict';
  const { clamp, lerp, map, damp } = Lab;
  const pct = (v) => (v * 100).toFixed(0) + '%';

  Lab.define({
    id: 'scroll-reveal',
    category: 'scroll',
    name: 'Scroll-Triggered Reveal',
    aliases: ['Fade-up on Scroll', 'Reveal on Enter', 'AOS-style Animation'],
    triggers: ['scroll'],
    level: 1,
    complexity: 1,
    hint: 'Scroll slowly. Each card animates only when its top crosses the dashed line.',
    anatomy: {
      trigger: 'Element crossing a viewport threshold',
      target: 'Each content card',
      transform: 'opacity 0 → 1 · translateY 40px → 0',
      character: 'Ease-out, time-based, staggered per row',
    },
    tech: 'IntersectionObserver + CSS transitions',
    does: 'An IntersectionObserver watches each card. When the card’s top passes the trigger line (80% down the viewport), a class is added and a regular CSS transition plays. The scroll position only decides when it starts, not how far along it is. That is the difference from scrubbed motion.',
    goodFor: ['Corporate and finance sites', 'Long-form content', 'Feature lists', 'Any section entrance'],
    prompt: 'Add scroll-triggered reveals to the feature cards: use IntersectionObserver with rootMargin "0px 0px -20% 0px" so each card triggers when its top crosses 80% of the viewport. Animate opacity 0→1 and translateY 40px→0 over 800ms with cubic-bezier(0.22, 1, 0.36, 1), stagger cards in the same row by 80ms, reveal once and unobserve, and show content immediately for prefers-reduced-motion.',
    init(stage) {
      const items = [...stage.querySelectorAll('.sreveal__item')];
      const line = stage.querySelector('.sreveal__line');
      const seg = stage.querySelector('.seg');
      let mode = 'once';
      let io = null;

      const observe = () => {
        if (io) io.disconnect();
        io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              if (mode === 'once') io.unobserve(entry.target);
            } else if (mode === 'always' && entry.rootBounds && entry.boundingClientRect.top >= entry.rootBounds.bottom) {
              // Only reset items that went back below the line (scrolling up).
              entry.target.classList.remove('is-in');
            }
          });
        }, { rootMargin: '0px 0px -20% 0px', threshold: 0 });
        items.forEach((item) => io.observe(item));
      };

      seg.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        mode = btn.dataset.mode;
        seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        observe();
      });

      // Show the trigger line only while it actually crosses this demo.
      Lab.onScroll(stage, ({ rect, vh }) => {
        const y = vh * 0.8;
        const crossing = rect.top < y && rect.bottom > y;
        line.classList.toggle('is-visible', crossing);
        if (crossing) {
          line.style.setProperty('--line-left', rect.left + 'px');
          line.style.setProperty('--line-width', rect.width + 'px');
        }
      });
      Lab.onVisible(stage, (visible) => { if (!visible) line.classList.remove('is-visible'); });

      observe();
      return {
        replay() {
          items.forEach((item) => item.classList.remove('is-in'));
          requestAnimationFrame(() => requestAnimationFrame(observe));
        },
      };
    },
  });

  Lab.define({
    id: 'layered-parallax',
    category: 'scroll',
    name: 'Layered Scroll Parallax',
    aliases: ['Multi-plane Parallax', 'Depth Scroll', 'Parallax Scrolling'],
    triggers: ['scroll'],
    level: 2,
    complexity: 2,
    reducedNote: 'Static in reduced mode',
    hint: 'Scroll through the scene. The moon lags behind, the foreground rushes past.',
    anatomy: {
      trigger: 'Scroll position of the section',
      target: 'Six stacked layers (sky → foreground)',
      transform: 'translateY × (1 − layer speed)',
      character: 'Scrubbed: linear, reversible, 1:1 with scroll',
    },
    tech: 'JS scroll progress → CSS transforms',
    does: 'Each layer has a speed. Layers slower than 1 are pushed down as you scroll, so they appear to move slower than the page and feel far away. Layers faster than 1 are pulled up and feel close. Your eye reads the speed difference as depth.',
    goodFor: ['Storytelling heroes', 'Travel and outdoor brands', 'Campaign landing pages', 'Illustrated scenes'],
    prompt: 'Build a layered scroll parallax hero with 5–6 layers (sky, moon, far mountains, headline, mid hills, foreground). Give each layer a data-speed between 0.15 and 1.15 and, from the section’s scroll progress (0 when it enters, 1 when it leaves), translateY each layer by (progress − 0.5) × 260px × (1 − speed). Overscan each layer so edges never show, use one passive scroll listener with rAF, and keep layers static for prefers-reduced-motion.',
    init(stage) {
      const layers = [...stage.querySelectorAll('.lp-layer')].map((el) => ({ el, speed: parseFloat(el.dataset.speed) }));
      const readout = stage.querySelector('[data-readout]');
      let last = 0.5;
      const render = (progress) => {
        last = progress;
        const range = Lab.reduced ? 0 : 260 * Lab.k;
        layers.forEach(({ el, speed }) => {
          el.style.transform = `translate3d(0, ${((progress - 0.5) * range * (1 - speed)).toFixed(2)}px, 0)`;
        });
        readout.innerHTML = `progress <b>${progress.toFixed(2)}</b> · sky ×0.15 · title ×0.6 · foreground ×1.15`;
      };
      Lab.onScroll(stage, ({ progress }) => render(progress));
      Lab.onChange(() => render(last));
    },
  });

  Lab.define({
    id: 'scroll-scrub',
    category: 'scroll',
    name: 'Scroll-Scrubbed Animation',
    aliases: ['Scroll-linked Timeline', 'Scrub', 'ScrollTrigger scrub'],
    triggers: ['scroll'],
    level: 2,
    complexity: 2,
    reducedNote: 'Final state in reduced mode',
    hint: 'Scroll down and back up. The object follows the timeline both ways.',
    anatomy: {
      trigger: 'Scroll position (mapped to a timeline)',
      target: 'One object on a track',
      transform: 'translateX · scale (keyframed) · rotate',
      character: 'Scrubbed: progress = scroll, fully reversible',
    },
    tech: 'JS: scroll progress → keyframe interpolation',
    does: 'The animation has no duration. Its playhead is the scroll position. Between 20% and 80% of this section’s journey through the viewport, the timeline runs from 0 to 100%, with a scale keyframe at the midpoint. Stop scrolling and it stops. Scroll up and it plays backwards.',
    goodFor: ['Product reveals', 'Explainers and how-it-works', 'Data stories', 'Apple-style feature pages'],
    prompt: 'Create a scroll-scrubbed animation for the product object: map the section’s scroll progress (20%–80% of its pass through the viewport) to a 0–1 timeline, and from it set translateX from 0 to the track width, scale 0.8 → 1.15 at 50% → 1.0 at the end, and rotate 0 → 360°. It must reverse exactly when scrolling up. Use one rAF-throttled passive scroll listener (or GSAP ScrollTrigger with scrub: true) and show the end state for reduced motion.',
    init(stage) {
      const obj = stage.querySelector('.scrub__object');
      const track = stage.querySelector('.scrub__track');
      const readout = stage.querySelector('[data-readout]');
      Lab.onScroll(stage, ({ progress }) => {
        const p = Lab.reduced ? 1 : clamp(map(progress, 0.2, 0.8, 0, 1));
        const x = p * (track.clientWidth - obj.offsetWidth);
        const s = p < 0.5 ? lerp(0.8, 1.15, p / 0.5) : lerp(1.15, 1, (p - 0.5) / 0.5);
        const r = p * 360 * Lab.k;
        obj.style.setProperty('--x', x.toFixed(1) + 'px');
        obj.style.setProperty('--s', s.toFixed(3));
        obj.style.setProperty('--r', r.toFixed(1) + 'deg');
        stage.style.setProperty('--p', p.toFixed(4));
        readout.innerHTML = `scroll <b>${pct(progress)}</b> → timeline <b>${pct(p)}</b> · x <b>${x.toFixed(0)}px</b> · scale <b>${s.toFixed(2)}</b> · rotate <b>${r.toFixed(0)}°</b>`;
      });
    },
  });

  Lab.define({
    id: 'pinned-story',
    category: 'scroll',
    name: 'Pinned / Sticky Storytelling',
    aliases: ['Scrollytelling', 'Pin Section', 'Sticky Scroll Steps'],
    triggers: ['scroll'],
    level: 2,
    complexity: 3,
    hint: 'Keep scrolling. The frame stays put while steps advance and the product transforms.',
    anatomy: {
      trigger: 'Scroll progress through a tall section',
      target: 'Step list + product visual (pinned)',
      transform: 'active step · scale · rotate · colour',
      character: 'Scrubbed transform, stepped text states',
    },
    tech: 'CSS position: sticky + JS pin progress',
    does: 'The section is three screens tall, but its content is position: sticky, so it holds still while you scroll through that height. Pin progress (0 → 1) is split into three steps that swap the text. The product scale and rotation follow the progress continuously.',
    goodFor: ['Product launches', 'Feature walkthroughs', 'Annual reports', 'Case-study narratives'],
    prompt: 'Create a pinned scroll storytelling section: make the section 300vh tall with a position: sticky inner frame below the header. Compute pin progress (0 when the frame sticks, 1 when the section ends), divide it into three steps that highlight the active step text, and link the product’s scale (0.7 → 1.1) and rotation (−14° → 14°) directly to progress. Add a thin progress bar, avoid scroll-jacking, and on reduced motion keep the step changes but drop the transforms.',
    init(stage) {
      const steps = [...stage.querySelectorAll('.pin__step')];
      const product = stage.querySelector('.pin__product');
      const label = stage.querySelector('.pin__product-label');
      const readout = stage.querySelector('[data-readout]');
      const COLORS = ['#e9b872', '#92b2ff', '#8fd6bd'];
      let current = -1;
      Lab.onScroll(stage, ({ progress }) => {
        const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        if (idx !== current) {
          current = idx;
          steps.forEach((s, i) => s.classList.toggle('is-current', i === idx));
          label.textContent = String(idx + 1).padStart(2, '0');
          product.style.setProperty('--hue', COLORS[idx]);
        }
        const s = Lab.reduced ? 1 : lerp(0.7, 1.1, progress);
        const r = Lab.reduced ? 0 : lerp(-14, 14, progress) * Lab.k;
        product.style.setProperty('--s', s.toFixed(3));
        product.style.setProperty('--r', r.toFixed(2) + 'deg');
        stage.style.setProperty('--p', progress.toFixed(4));
        readout.innerHTML = `pin progress <b>${pct(progress)}</b> · step <b>0${idx + 1}</b> · scale <b>${s.toFixed(2)}</b> · rotate <b>${r.toFixed(1)}°</b>`;
      }, { mode: 'pin' });
    },
  });

  Lab.define({
    id: 'horizontal-gallery',
    category: 'scroll',
    name: 'Vertical-to-Horizontal Gallery',
    aliases: ['Horizontal Scroll Section', 'Side-scroll Gallery', 'Pinned Horizontal Track'],
    triggers: ['scroll'],
    level: 2,
    complexity: 3,
    reducedNote: 'Native swipe in reduced mode',
    hint: 'Scroll down normally. The gallery pins and travels sideways, then releases.',
    anatomy: {
      trigger: 'Vertical scroll progress through a tall section',
      target: 'A horizontal track of panels',
      transform: 'translateX = −progress × overflow width',
      character: 'Scrubbed, linear, reversible',
    },
    tech: 'CSS sticky + JS progress → translateX',
    does: 'The section’s height is the “runway”. While you scroll through it, the inner frame is sticky and the track’s translateX equals progress × (track width − viewport width). The browser still scrolls vertically, so touch and trackpads work normally; you only see horizontal movement.',
    goodFor: ['Agency work showcases', 'Product line-ups', 'Timelines', 'Fashion lookbooks'],
    prompt: 'Turn the work gallery into a vertical-to-horizontal scroll section: wrap it in a ~340vh section with a sticky inner frame, and translate the horizontal track by −progress × (track width − frame width) where progress is the pinned scroll progress. Update a “03 / 06” counter, keep native vertical scrolling (no wheel hijacking), and fall back to a native horizontal scroll-snap carousel for reduced motion.',
    init(stage) {
      const track = stage.querySelector('.hgallery__track');
      const viewport = stage.querySelector('.hgallery__viewport');
      const count = stage.querySelector('.hgallery__count b');
      const readout = stage.querySelector('[data-readout]');
      const total = track.children.length;
      const syncMode = () => {
        stage.classList.toggle('is-native', Lab.reduced);
        readout.hidden = Lab.reduced;
        if (Lab.reduced) count.textContent = '01';
      };
      Lab.onChange(syncMode);
      syncMode();
      Lab.onScroll(stage, ({ progress }) => {
        if (Lab.reduced) return;
        const max = Math.max(0, track.offsetWidth - viewport.clientWidth);
        const x = progress * max;
        track.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`;
        count.textContent = String(Math.min(total, Math.round(progress * (total - 1)) + 1)).padStart(2, '0');
        readout.innerHTML = `vertical progress <b>${pct(progress)}</b> → translateX <b>−${x.toFixed(0)}px</b>`;
      }, { mode: 'pin' });
    },
  });

  Lab.define({
    id: 'scroll-marquee',
    category: 'scroll',
    name: 'Scroll-Reactive Marquee',
    aliases: ['Infinite Ticker', 'Velocity Marquee', 'Scrolling Text Band'],
    triggers: ['time', 'scroll'],
    level: 2,
    complexity: 2,
    reducedNote: 'Static in reduced mode',
    hint: 'Watch it idle, then scroll fast down and up. It speeds up and flips direction.',
    anatomy: {
      trigger: 'Time (base loop) + scroll velocity',
      target: 'Two duplicated text bands',
      transform: 'translateX (wrapping) at variable speed',
      character: 'Linear loop + velocity boost that eases back',
    },
    tech: 'JS rAF loop (paused off-screen) + scroll velocity',
    does: 'Each band holds two copies of its content and wraps seamlessly when one copy has fully passed. A base speed keeps it drifting. Scroll velocity adds a boost that decays smoothly, and the scroll direction decides which way the bands travel.',
    goodFor: ['Brand statements', 'Client / partner logos', 'Section dividers', 'Fashion and culture sites'],
    prompt: 'Build a scroll-reactive marquee: duplicate the band content so it can loop seamlessly, move it with a rAF loop at a base speed of ~70px/s, add a boost proportional to scroll velocity that eases back to zero, and flip direction when the user scrolls up. Run the second row in the opposite direction, pause the loop when off-screen or the tab is hidden, and render a static band for reduced motion.',
    init(stage) {
      const readout = stage.querySelector('[data-readout]');
      const rows = [...stage.querySelectorAll('.marquee__inner')].map((el, i) => {
        const html = el.innerHTML;
        el.innerHTML = `<span>${html}</span><span aria-hidden="true">${html}</span>`;
        return { el, first: el.firstElementChild, dir: i === 0 ? 1 : -1, x: 0 };
      });
      let direction = 1;
      let boost = 0;
      let frame = 0;
      Lab.loop(stage, (dt) => {
        const v = Lab.scrollVelocity;
        if (Math.abs(v) > 40) direction = Math.sign(v);
        boost = damp(boost, Math.min(Math.abs(v) * 0.5, 1400), 5, dt);
        const speed = (70 + boost) * Lab.k;
        rows.forEach((row) => {
          const width = row.first.offsetWidth || 1;
          row.x = (((row.x + speed * direction * row.dir * dt) % width) + width) % width;
          row.el.style.transform = `translate3d(${(-row.x).toFixed(2)}px, 0, 0)`;
        });
        if (frame++ % 6 === 0) {
          readout.innerHTML = `scroll velocity <b>${v.toFixed(0)} px/s</b> · marquee <b>${speed.toFixed(0)} px/s</b> · <b>${direction > 0 ? 'forward' : 'reverse'}</b>`;
        }
      }, { continuous: true });
      readout.innerHTML = 'scroll velocity <b>0 px/s</b> · marquee <b>70 px/s</b> · <b>forward</b>';
    },
  });

  Lab.define({
    id: 'scroll-velocity',
    category: 'scroll',
    name: 'Scroll Velocity Effect',
    aliases: ['Skew on Scroll', 'Momentum Distortion', 'Speed Skew'],
    triggers: ['scroll'],
    level: 2,
    complexity: 2,
    reducedNote: 'Disabled in reduced mode',
    hint: 'Flick the scroll wheel or swipe fast across this section, then stop.',
    anatomy: {
      trigger: 'How fast you scroll (not where you are)',
      target: 'A row of image cards',
      transform: 'skewY + small translateY offsets',
      character: 'Damped: reacts fast, settles back smoothly',
    },
    tech: 'JS rAF loop woken by scroll; sleeps when settled',
    does: 'Scroll velocity (pixels per second) maps to a skew angle, clamped to about 7°. The value is damped, so the cards lean into fast scrolling and then ease back to straight once you stop. The middle card shifts the other way for extra parallax.',
    goodFor: ['Image-heavy portfolios', 'Editorial grids', 'Experimental brand sites'],
    prompt: 'Add a subtle scroll-velocity effect to the image grid: measure scroll velocity in px/s, map it to skewY clamped to ±7°, and damp toward the target so it reacts quickly and settles back to 0° when scrolling stops. Offset the middle column slightly in the opposite direction, only run the rAF loop while the section is visible and moving, and disable it for reduced motion.',
    init(stage) {
      const cards = [...stage.querySelectorAll('.velocity__card')];
      const readout = stage.querySelector('[data-readout]');
      let skew = 0;
      const ticker = Lab.loop(stage, (dt) => {
        const v = Lab.reduced ? 0 : Lab.scrollVelocity;
        const target = clamp(v * 0.0035 * Lab.k, -7, 7);
        skew = damp(skew, target, 9, dt);
        cards.forEach((card, i) => {
          card.style.setProperty('--skew', skew.toFixed(2) + 'deg');
          card.style.setProperty('--shift', (skew * (i === 1 ? -4 : 2)).toFixed(1) + 'px');
        });
        readout.innerHTML = `velocity <b>${v.toFixed(0)} px/s</b> · skewY <b>${skew.toFixed(2)}°</b>`;
        return Math.abs(skew) > 0.01 || Math.abs(v) > 2;
      });
      Lab.onScroll(stage, () => ticker.wake());
      readout.innerHTML = 'velocity <b>0 px/s</b> · skewY <b>0.00°</b>';
    },
  });

  Lab.define({
    id: 'scroll-zoom',
    category: 'scroll',
    name: 'Scroll Zoom',
    aliases: ['Zoom on Scroll', 'Expanding Media', 'Scale-up Reveal'],
    triggers: ['scroll'],
    level: 2,
    complexity: 1,
    reducedNote: 'Final state in reduced mode',
    hint: 'Scroll down: the frame opens to full bleed while the image pushes in.',
    anatomy: {
      trigger: 'Scroll progress',
      target: 'Image frame + image',
      transform: 'clip-path inset (frame) · scale (image)',
      character: 'Scrubbed, linear, reversible',
    },
    tech: 'JS scroll progress → clip-path + transform',
    does: 'As the section scrolls up, the frame’s clip-path inset shrinks from 24% to 0 so the visible window grows to full width, while the image inside scales from 1.0 to 1.2. Using clip-path avoids animating width/height, so there is no layout work.',
    goodFor: ['Hero video/image intros', 'Product close-ups', 'Section transitions', 'Immersive editorials'],
    prompt: 'Add a scroll zoom to the feature image: as the section moves from 15% to 60% of its scroll progress, animate the frame’s clip-path from inset(24% round 24px) to inset(0 round 0) and scale the inner image from 1.0 to 1.2, both scrubbed to scroll so they reverse on scroll up. Animate only clip-path and transform, and show the final full-bleed state for reduced motion.',
    init(stage) {
      const frame = stage.querySelector('.szoom__frame');
      const readout = stage.querySelector('[data-readout]');
      Lab.onScroll(stage, ({ progress }) => {
        const p = Lab.reduced ? 1 : clamp(map(progress, 0.15, 0.6, 0, 1));
        const inset = lerp(24, 0, p);
        const scale = lerp(1, 1 + 0.2 * Lab.k, p);
        frame.style.setProperty('--inset', inset.toFixed(2) + '%');
        frame.style.setProperty('--round', lerp(24, 0, p).toFixed(1) + 'px');
        frame.style.setProperty('--img-s', scale.toFixed(3));
        readout.innerHTML = `progress <b>${pct(p)}</b> · inset <b>${inset.toFixed(1)}%</b> · image scale <b>${scale.toFixed(2)}</b>`;
      });
    },
  });

  Lab.define({
    id: 'scroll-rotation',
    category: 'scroll',
    name: 'Scroll Rotation',
    aliases: ['Rotate on Scroll', 'Spinning Badge', 'Scroll Spin'],
    triggers: ['scroll'],
    level: 1,
    complexity: 1,
    reducedNote: 'Static in reduced mode',
    hint: 'Scroll up and down. Both shapes rotate with you, at different rates.',
    anatomy: {
      trigger: 'Scroll progress',
      target: 'Circular text badge + gear shape',
      transform: 'rotate (badge +, gear −1.5×)',
      character: 'Scrubbed, linear',
    },
    tech: 'SVG textPath + JS scroll progress → rotate',
    does: 'The rotation angle is just progress × 360°. Because it is tied to scroll, the badge stops when you stop and spins backwards when you scroll up, which makes it feel physically connected to the page.',
    goodFor: ['“Scroll down” badges', 'Logos and seals', 'Decorative section markers', 'Playful brand details'],
    prompt: 'Add a scroll-linked rotation to the circular “scroll to explore” badge: render the text on an SVG textPath and rotate it by section progress × 360°, with a secondary shape rotating −1.5× as fast for contrast. Use a single rAF-throttled passive scroll listener, keep the badge readable at rest, and leave it static for reduced motion.',
    init(stage) {
      const badge = stage.querySelector('.srotate__badge svg');
      const gear = stage.querySelector('.srotate__gear');
      const readout = stage.querySelector('[data-readout]');
      Lab.onScroll(stage, ({ progress }) => {
        const deg = Lab.reduced ? 0 : progress * 360 * Lab.k;
        badge.style.setProperty('--rot', deg.toFixed(1) + 'deg');
        gear.style.setProperty('--rot2', (-deg * 1.5).toFixed(1) + 'deg');
        readout.innerHTML = `progress <b>${pct(progress)}</b> · badge <b>${deg.toFixed(0)}°</b> · gear <b>${(-deg * 1.5).toFixed(0)}°</b>`;
      });
    },
  });

  Lab.define({
    id: 'scroll-progress',
    category: 'scroll',
    name: 'Scroll Progress Indicator',
    aliases: ['Reading Progress Bar', 'Scroll Meter', 'Progress Ring'],
    triggers: ['scroll'],
    level: 1,
    complexity: 1,
    hint: 'Look at the 2px bar at the very top of the page. It is the same value as the left meter.',
    anatomy: {
      trigger: 'Scroll position (page or section)',
      target: 'A bar and a ring',
      transform: 'scaleX (bar) · stroke-dashoffset (ring)',
      character: 'Scrubbed, linear',
    },
    tech: 'JS scroll progress → CSS variable --p',
    does: 'Progress = how far you have scrolled ÷ how far you can scroll. The bar uses transform: scaleX(progress), which is cheap to animate. The ring uses an SVG circle with pathLength="1", so dashoffset = 1 − progress.',
    goodFor: ['Long articles', 'Documentation', 'Multi-step forms', 'Section navigation'],
    prompt: 'Add a reading progress indicator: a 2px bar fixed to the top of the viewport that uses transform: scaleX(progress) with transform-origin left, where progress = scrollY / (scrollHeight − innerHeight). Add a circular variant for the current section using an SVG circle with pathLength="1" and stroke-dashoffset = 1 − progress. Update both from one passive, rAF-throttled scroll listener.',
    init(stage) {
      const pageItem = stage.querySelector('.sprogress__bar');
      const pageValue = stage.querySelector('[data-page]');
      const ring = stage.querySelector('.sprogress__ring');
      const sectionValue = stage.querySelector('[data-section]');
      const section = document.getElementById('scroll');
      Lab.onScroll(null, ({ progress }) => {
        pageItem.style.setProperty('--p', progress.toFixed(4));
        pageValue.textContent = pct(progress);
      });
      Lab.onScroll(section, ({ rect, vh }) => {
        const p = clamp((vh * 0.5 - rect.top) / rect.height);
        ring.style.setProperty('--p', p.toFixed(4));
        sectionValue.textContent = pct(p);
      });
    },
  });
})();
