/* =========================================================================
   04 · Typography Motion
   Splitting text keeps a visually-hidden copy for screen readers
   (see Lab.split in core.js), so animated letters never break reading.
   ========================================================================= */
(function () {
  'use strict';

  /* Restart a CSS animation by toggling a class across a reflow. */
  function restart(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  Lab.define({
    id: 'split-text',
    category: 'typography',
    name: 'Split Text / Staggered Reveal',
    aliases: ['SplitText', 'Letter Stagger', 'Character Animation'],
    triggers: ['load', 'scroll'],
    level: 2,
    complexity: 2,
    hint: 'Switch between characters and words. Each switch replays with its own stagger.',
    anatomy: {
      trigger: 'Entering the viewport (or Replay)',
      target: 'Each character or each word',
      transform: 'opacity · translateY · slight rotate',
      character: 'Ease-out with stagger (28ms / 70ms)',
    },
    tech: 'JS text splitting + CSS keyframes with calc() delays',
    does: 'The heading is broken into individual spans, each with an index (--i). All spans share one animation, but each waits --i × stagger before starting. That small offset turns one movement into a wave that reads left to right.',
    goodFor: ['Hero headlines', 'Section titles', 'Campaign slogans', 'Loading-screen wordmarks'],
    prompt: 'Animate the hero headline with a split-text stagger: split it into word wrappers containing character spans (keep a visually-hidden copy of the full text for screen readers), give each character an index --i, and animate opacity 0→1, translateY 0.8em→0 and rotate 6°→0 over 900ms ease-out with a 28ms per-character delay. Trigger once when the heading enters the viewport and show static text for reduced motion.',
    init(stage) {
      const title = stage.querySelector('.split-demo__title');
      const seg = stage.querySelector('.seg');
      const readout = stage.querySelector('[data-readout]');
      const play = () => {
        const by = title.dataset.by;
        const pieces = Lab.split(title, by);
        const stagger = by === 'chars' ? 28 : 70;
        title.style.setProperty('--stagger', stagger + 'ms');
        restart(title, 'is-playing');
        readout.innerHTML = `${pieces.length} ${by === 'chars' ? 'characters' : 'words'} · stagger <b>${stagger}ms</b> · total <b>${((pieces.length - 1) * stagger + 900) / 1000}s</b>`;
      };
      seg.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        title.dataset.by = btn.dataset.by;
        seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        play();
      });
      Lab.split(title, 'chars');
      Lab.onEnter(stage, play, { once: true, threshold: 0.5 });
      return { replay: play };
    },
  });

  Lab.define({
    id: 'masked-lines',
    category: 'typography',
    name: 'Masked Line Reveal',
    aliases: ['Line Mask Reveal', 'Text Slide-up Mask', 'Overflow Reveal'],
    triggers: ['load', 'scroll'],
    level: 2,
    complexity: 1,
    hint: 'Tick “Show masks” and press Replay to see the clipping boxes at work.',
    anatomy: {
      trigger: 'Entering the viewport (or Replay)',
      target: 'Each line of text inside its own mask',
      transform: 'translateY 110% → 0 (clipped by overflow)',
      character: 'Ease-out, 120ms line stagger',
    },
    tech: 'CSS overflow: clip + keyframes',
    does: 'Each line is wrapped twice: an outer box that clips anything outside it, and an inner line that starts pushed down below that edge. Sliding the inner line up makes the text appear to rise from nowhere, because the mask hides it until it arrives.',
    goodFor: ['Editorial headings', 'Luxury and fashion sites', 'Case-study intros', 'Quotes'],
    prompt: 'Add a masked line reveal to the section heading: wrap each line in an overflow: clip container and an inner block that starts at translateY(110%). When the heading enters the viewport, animate each inner line to translateY(0) over 1s with cubic-bezier(0.22, 1, 0.36, 1), staggering lines by 120ms. Keep the real text in the DOM in reading order and skip the animation for reduced motion.',
    init(stage) {
      const toggle = stage.querySelector('input');
      toggle.addEventListener('change', () => stage.classList.toggle('show-masks', toggle.checked));
      const play = () => restart(stage, 'is-playing');
      Lab.onEnter(stage, play, { once: true, threshold: 0.5 });
      return { replay: play };
    },
  });

  Lab.define({
    id: 'typewriter',
    category: 'typography',
    name: 'Typewriter',
    aliases: ['Typing Effect', 'Type-on', 'Terminal Text'],
    triggers: ['load', 'time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Static text in reduced mode',
    hint: 'It types, pauses, deletes and moves to the next phrase. It pauses when off-screen.',
    anatomy: {
      trigger: 'Time (sequence of timeouts)',
      target: 'Text content + caret',
      transform: 'number of visible characters · caret opacity',
      character: 'Stepped, slightly irregular rhythm',
    },
    tech: 'JS setTimeout chain + CSS steps() blinking caret',
    does: 'Characters are added one at a time with a small random variation in delay, which feels more human than a perfectly even rhythm. The caret stays solid while typing and blinks while waiting. The full sentences sit in a visually-hidden element so screen readers don’t hear it letter by letter.',
    goodFor: ['Developer tools', 'AI products', 'Search placeholders', 'Terminal-style heroes'],
    prompt: 'Add a typewriter effect to the hero subtitle that cycles through three phrases: type each character every ~55ms with ±20ms random variation, pause 1.4s, delete at 28ms per character, then type the next phrase. Show a caret that is solid while typing and blinks with steps(1) while idle. Pause the loop when the element is off-screen, put the full phrases in a visually-hidden element for screen readers, and show the first phrase statically for reduced motion.',
    init(stage) {
      const out = stage.querySelector('.typewriter__text');
      const readout = stage.querySelector('[data-readout]');
      const PHRASES = ['Design with intent.', 'Animate with purpose.', 'Describe it precisely.'];
      let phrase = 0, chars = 0, deleting = false, timer = 0, visible = false;

      const schedule = (ms) => { clearTimeout(timer); timer = setTimeout(step, ms); };
      function step() {
        if (!visible) return;
        if (Lab.reduced) { out.textContent = PHRASES[0]; stage.classList.remove('is-typing'); return; }
        const text = PHRASES[phrase];
        chars += deleting ? -1 : 1;
        out.textContent = text.slice(0, chars);
        stage.classList.add('is-typing');
        readout.innerHTML = `phrase <b>${phrase + 1}/3</b> · ${deleting ? 'deleting' : 'typing'} · <b>${chars}</b>/${text.length} chars`;
        if (!deleting && chars === text.length) {
          deleting = true;
          stage.classList.remove('is-typing');
          return schedule(1400);
        }
        if (deleting && chars === 0) {
          deleting = false;
          phrase = (phrase + 1) % PHRASES.length;
          stage.classList.remove('is-typing');
          return schedule(400);
        }
        schedule(deleting ? 28 : 55 + (Math.random() * 40 - 20));
      }
      Lab.onVisible(stage, (v) => { visible = v; if (v) schedule(300); else clearTimeout(timer); });
      Lab.onChange(() => schedule(50));
      return {
        replay() { phrase = 0; chars = 0; deleting = false; out.textContent = ''; schedule(200); },
      };
    },
  });

  Lab.define({
    id: 'text-scramble',
    category: 'typography',
    name: 'Text Scramble / Decode',
    aliases: ['Decrypt Text', 'Glyph Shuffle', 'Matrix Text'],
    triggers: ['hover', 'load'],
    level: 2,
    complexity: 2,
    hint: 'The headline decodes on entry. Hover or focus each button to scramble it again.',
    anatomy: {
      trigger: 'Viewport entry · hover / focus',
      target: 'Each character of the label',
      transform: 'character content (random glyph → final)',
      character: 'Rapid random flicker resolving left to right',
    },
    tech: 'JS requestAnimationFrame (Lab.scramble helper)',
    does: 'Every character gets its own reveal time, roughly left to right with a bit of randomness. Until that moment it shows a random glyph each frame, then it locks into the real letter. The result reads as a message being decoded.',
    goodFor: ['Tech and security brands', 'Navigation hovers', 'Data / AI products', 'Portfolio headings'],
    prompt: 'Add a text scramble effect to the navigation labels: on hover/focus, give each character a reveal time spread across ~900ms (left to right plus a little randomness) and show random glyphs from A–Z, 0–9 and symbols until each character’s time arrives. Run it with requestAnimationFrame, cancel any running scramble before starting a new one, keep the accessible label as the final text, and show the final text immediately for reduced motion.',
    init(stage) {
      const headline = stage.querySelector('.scramble__headline');
      const playHeadline = () => Lab.scramble(headline, headline.dataset.final, { duration: 1300 });
      stage.querySelectorAll('.scramble__item').forEach((btn) => {
        const run = () => Lab.scramble(btn, btn.dataset.final, { duration: 700 });
        btn.addEventListener('pointerenter', run);
        btn.addEventListener('focus', run);
      });
      Lab.onEnter(stage, playHeadline, { once: true, threshold: 0.5 });
      return { replay: playHeadline };
    },
  });

  Lab.define({
    id: 'gradient-text',
    category: 'typography',
    name: 'Animated Gradient Text',
    aliases: ['Gradient Shift', 'Shimmer Text', 'Background-clip Text'],
    triggers: ['time'],
    level: 1,
    complexity: 1,
    reducedNote: 'Static gradient in reduced mode',
    hint: 'Just watch. Intensity changes the speed.',
    anatomy: {
      trigger: 'Time (infinite loop)',
      target: 'The background behind the letters',
      transform: 'background-position',
      character: 'Linear, continuous loop',
    },
    tech: 'CSS background-clip: text + keyframes',
    does: 'The text is transparent and the background is clipped to the letter shapes, so you only see the gradient through the text. A gradient three times wider than the text slides along forever, and because the last colour equals the first, the loop has no visible seam.',
    goodFor: ['Highlighted words in headlines', 'AI / creative product names', 'Event titles'],
    prompt: 'Animate a gradient through the highlighted headline words: set background: linear-gradient(90deg, amber, pink, blue, mint, amber) with background-size 300% 100%, clip it to the text (background-clip: text, color: transparent), and animate background-position from 0 to 300% linearly over 8s, infinitely. Keep contrast high on the darkest stop and stop the animation for reduced motion.',
    init() {},
  });

  Lab.define({
    id: 'kinetic-type',
    category: 'typography',
    name: 'Kinetic Typography',
    aliases: ['Motion Type', 'Type Composition', 'Expressive Typography'],
    triggers: ['time'],
    level: 3,
    complexity: 2,
    hint: 'A small composition: stretch, slot, weight and orbit all play together.',
    anatomy: {
      trigger: 'Time (looping timeline)',
      target: 'Letters, a word slot, a variable-weight word, a ring',
      transform: 'scaleY · translateY · font-weight · rotate',
      character: 'Ease-in-out loops with offset phases',
    },
    tech: 'CSS keyframes + variable font weight + SVG textPath',
    does: 'Typography becomes the image itself. Letters stretch in a wave, a slot machine swaps the word after “with”, a variable font breathes between light and bold, and an outlined band and a ring of text drift behind. Each loop has a different length, so the composition keeps feeling alive.',
    goodFor: ['Brand campaigns', 'Music and event sites', 'Title sequences', 'Creative studio heroes'],
    prompt: 'Create a kinetic typography hero composition: a huge word whose letters stretch vertically in a staggered wave (scaleY 1 → 1.45 → 1, origin bottom, 140ms stagger), a line “with ___” where the blank cycles through three words in a vertically clipped slot, a word that animates its variable font-weight between 300 and 700, and an outlined background band drifting slowly. Use CSS keyframes with different durations so the loops desync, pause when off-screen, and freeze for reduced motion.',
    init(stage) {
      Lab.split(stage.querySelector('.kt__stretch'), 'chars');
      return {
        replay() {
          stage.classList.add('is-restarting');
          void stage.offsetWidth;
          stage.classList.remove('is-restarting');
        },
      };
    },
  });
})();
