/* Learn H — Motion Prompt Builder.
   Assembles a precise, reusable prompt from motion decisions. */
(function () {
  'use strict';
  const { block, esc } = window.VML;

  const F = [
    ['type', 'Content type', ['product ad', 'social hook', 'app feature demo', 'brand film', 'promo / sale', 'infographic explainer', 'editorial reel', 'logo sting']],
    ['target', 'Hero / target', ['the product', 'the headline', 'the phone UI', 'the logo', 'the hero photo', 'the key number']],
    ['entrance', 'Entrance', ['rises from below with a subtle scale overshoot', 'is revealed through a masked line animation', 'fades up with a soft blur-to-sharp', 'punches in from scale 1.3 on the beat', 'slides in from the left with an expo-out', 'draws itself as a stroke animation', 'assembles from separate pieces']],
    ['movement', 'Supporting movement', ['supporting elements stagger in 120ms apart', 'benefits stack one per beat', 'labels appear around it with leader lines', 'a counter rolls up to the final value', 'secondary elements float gently out of phase']],
    ['exit', 'Exit', ['clears with a quick ease-in fade-up', 'scales through the camera (zoom-through)', 'wipes out with the next scene', 'stays on screen into the end card']],
    ['timing', 'Timing', ['each main move 600–800ms with 30–50% overlap', 'fast 200–350ms moves on a 0.5s beat grid', 'slow 1–1.5s moves with long holds', 'micro 150ms accents on key moments']],
    ['easing', 'Easing', ['smooth premium ease-out (cubic-bezier .22,1,.36,1), no bounce', 'expo-out for entrances and expo-in for exits', 'damped springs (barely any overshoot)', 'playful springs with visible bounce', 'linear only for loops and marquees']],
    ['camera', 'Camera', ['a slow continuous camera push-in', 'subtle handheld drift', 'a 2.5D parallax truck across depth layers', 'no camera movement (locked off)', 'a zoom punch on the key beat']],
    ['transition', 'Transition', ['a masked wipe between scenes', 'a whip-pan with directional motion blur', 'a soft cross-dissolve', 'a match cut on a shared shape', 'hard cuts on the beat', 'a seamless loop back to the first frame']],
    ['character', 'Visual character', ['premium', 'energetic', 'playful', 'corporate', 'cinematic', 'tech', 'editorial']],
    ['intensity', 'Intensity', ['subtle', 'balanced', 'bold']],
    ['format', 'Format', ['9:16', '4:5', '1:1', '16:9']],
    ['duration', 'Duration', ['3', '6', '10', '15', '30']],
  ];
  const DEF = { type: 0, target: 0, entrance: 0, movement: 0, exit: 3, timing: 0, easing: 0, camera: 0, transition: 1, character: 0, intensity: 1, format: 0, duration: 1 };

  function build(v) {
    const g = (k) => F.find((f) => f[0] === k)[2][v[k]];
    const fmt = g('format');
    const fmtName = { '9:16': 'vertical 9:16 (Reels / TikTok / Shorts)', '4:5': 'portrait 4:5 feed', '1:1': 'square 1:1', '16:9': 'horizontal 16:9' }[fmt];
    const intensity = { subtle: 'Keep every move subtle — small distances and low amplitudes.', balanced: 'Keep motion purposeful and balanced.', bold: 'Make the hero motion bold and high-contrast, but keep supporting motion restrained.' }[g('intensity')];
    const safe = fmt === '9:16' ? '\nKeep text, faces and the CTA inside the approximate social safe zone (avoid the top ~12%, bottom ~20–25% and right ~15%).' : '';
    return `Create a ${g('character')} ${g('duration')}-second ${fmtName} ${g('type')} motion composition.

Begin with ${g('target')}: it ${g('entrance')}.
Then ${g('movement')}.
Use ${g('camera')} throughout the scene, and move between scenes with ${g('transition')}.
At the end, ${g('target')} ${g('exit')}, and finish with one clear CTA and a brand end card held for at least 1.5 seconds.

Timing: ${g('timing')}. Give text a hold of at least ~1 second so it can be read.
Easing: ${g('easing')}.
Hierarchy: ${g('target')} gets the strongest motion; headline medium; supporting copy subtle; background ambient only; CTA small and purposeful.
${intensity}${safe}
Make the first frame work as a still (no fade from black) and introduce a visible change within the first second.

Format: ${fmt}. Duration: ${g('duration')}s. Build it as a single scrubbable timeline (e.g. gsap.timeline() with position parameters) so timing can be adjusted.`;
  }

  block('builder', () => `<div class="pb">
      <form class="pb__form" onsubmit="return false">${F.map(([k, label, opts]) => `<label><span>${label}</span><select data-k="${k}">${opts.map((o, i) => `<option value="${i}"${DEF[k] === i ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`).join('')}</form>
      <div class="pb__out"><div class="pb__bar"><b>Generated prompt</b><span><button type="button" class="btn" data-pb-random>Randomise</button><button type="button" class="btn btn--accent" data-pb-copy>Copy prompt</button></span></div><pre data-pb-text></pre></div></div>`,
  (root) => {
    const sel = [...root.querySelectorAll('select[data-k]')];
    const out = root.querySelector('[data-pb-text]');
    const read = () => Object.fromEntries(sel.map((s) => [s.dataset.k, +s.value]));
    const update = () => { out.textContent = build(read()); };
    sel.forEach((s) => s.addEventListener('change', update));
    root.querySelector('[data-pb-copy]').addEventListener('click', (e) => window.VML.copyText(out.textContent, e.currentTarget));
    root.querySelector('[data-pb-random]').addEventListener('click', () => { sel.forEach((s) => { s.value = Math.floor(Math.random() * s.options.length); }); update(); });
    update();
  });
})();
