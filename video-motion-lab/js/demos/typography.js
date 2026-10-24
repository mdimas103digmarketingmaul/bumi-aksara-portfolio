/* 03 — Typography Motion
   Text carries most short-form video (most viewers watch muted), so these
   demos focus on reading order, rhythm and legibility while moving. */
(function () {
  'use strict';
  const { demo, lerp, clamp, seg, ease, bump, hash, chars, words, esc, A } = window.VML;
  const CAT = 'typography';
  const T = ['text'];

  /* 01 Character stagger */
  demo({
    id: 'char-stagger', cat: CAT, name: 'Character Stagger', aka: ['Letter-by-letter', 'Split text (chars)', 'Per-character animation'],
    tags: T, char: ['Energetic', 'Bold', 'Social'],
    what: 'The word is split into letters and each letter runs the same entrance a few dozen milliseconds after the previous one. The eye reads the cascade left to right, so a single word gets a rhythm.',
    good: ['Short, bold words and title cards', 'Hook words (“WAIT”, “NEW”, “SALE”)', 'Logo wordmarks'],
    avoid: 'Long sentences — per-letter staggers on 40+ characters take too long and are tiring to read.',
    anatomy: ['Scene time', 'Each letter of one word', 'translateY 110% → 0 inside a mask + rotate 8° → 0', '0.65s per letter · 45ms stagger · exit 35ms stagger', 'expo.out in · cubic.in out', 'Letters cascade in → hold → cascade out upwards'],
    tracks: [['in', 'Letters in ×6', 0.3, 0.65, 'expo.out', { n: 6, each: 0.045 }], ['hold', 'Hold', '>', 0.9, 'linear'], ['out', 'Letters out ×6', '>', 0.4, 'cubic.in', { n: 6, each: 0.035 }]],
    cls: 'bg-red',
    html: `<div class="stackc"><div class="t-display cs-word">${[...'MOTION'].map((ch) => `<span class="cs-mask"><span data-r="ch" class="ch">${ch}</span></span>`).join('')}</div>
      <span class="t-eyebrow" data-r="sub" style="margin-top:4cqmin">Episode 07 · Typography</span></div>`,
    render(t, c) {
      c.$$.ch.forEach((el, i) => {
        const a = c.st('in', i), b = c.st('out', i);
        c.set(el, { yp: 110 * (1 - a) - 110 * b, r: 8 * (1 - a) });
      });
      c.set(c.$.sub, { o: c.at(0.7, 0.5) * (1 - c.r.out) });
    },
    prompt: 'Split the word into individual letters, each inside its own overflow-hidden mask. Animate each letter from translateY(110%) and rotate(8°) to rest over 650ms with an expo-out ease, staggering 45ms per letter. Hold for ~0.9s, then exit upwards letter by letter (35ms stagger, cubic ease-in). Keep a hidden accessible copy of the full word for screen readers.',
  });

  /* 02 Word stagger */
  demo({
    id: 'word-stagger', cat: CAT, name: 'Word Stagger', aka: ['Word-by-word', 'Split text (words)', 'Phrase build'],
    tags: T, char: ['Editorial', 'Calm', 'Readable'],
    what: 'Words arrive one at a time at roughly reading pace. It feels like a voice speaking the sentence, which is why it works so well for quotes and captions.',
    good: ['Quotes and statements', 'Captions synced to a voiceover', 'Editorial and documentary titles'],
    avoid: 'Very fast cuts: if the shot changes before the last word lands, nobody reads it.',
    anatomy: ['Scene time (or voiceover)', 'Each word', 'opacity + translateY 30% + blur 6px → sharp', '0.7s per word · 110ms stagger', 'premium', 'Words in reading order'],
    tracks: [['w', 'Words ×9 (110ms)', 0.3, 0.7, 'premium', { n: 9, each: 0.11 }], ['who', 'Attribution', '>-0.2', 0.6, 'premium'], ['hold', 'Hold to read', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc pad"><p class="t-serif ws-quote">${words('Design is how it works.')} <br/>${words('Not how it looks.').replace('Not', '<i>Not</i>')}</p>
      <span data-r="who" class="t-eyebrow" style="margin-top:5cqmin">— A design principle</span></div>`,
    render(t, c) {
      c.$$.w.forEach((el, i) => { const p = c.st('w', i); c.set(el, { yp: 30 * (1 - p), o: p, blur: 1.2 * (1 - p) }); });
      c.set(c.$.who, { o: c.p.who });
    },
    prompt: 'Reveal the quote word by word: each word fades in, rises 30% of its height and un-blurs from 6px over 700ms with a premium ease-out, 110ms after the previous word. Bring the attribution in last. Then hold the full quote for at least 1.2s so it can be read.',
  });

  /* 03 Line reveal */
  demo({
    id: 'line-reveal', cat: CAT, name: 'Line Reveal', aka: ['Masked lines', 'Line-by-line reveal', 'Slide-up lines'],
    tags: T, char: ['Premium', 'Editorial', 'Clean'],
    what: 'Each line slides up from behind an invisible edge (a mask). Because the text appears from nowhere instead of fading, it looks crisp and intentional — the house style of premium brand films.',
    good: ['Headlines of 2–4 lines', 'Premium product and brand films', 'Section titles in explainers'],
    avoid: 'Lines wrap differently on different formats — always break lines manually for each aspect ratio.',
    anatomy: ['Scene time', 'Three lines, each in an overflow-hidden mask', 'translateY 105% → 0 (in) · 0 → −105% (out)', '0.8s per line · 120ms stagger', 'expo.out in · expo.in out', 'Top line first, overlapping'],
    tracks: [['in', 'Lines in ×3', 0.3, 0.8, 'expo.out', { n: 3, each: 0.12 }], ['hold', 'Hold', '>', 1, 'linear'], ['out', 'Lines out ×3', '>', 0.5, 'expo.in', { n: 3, each: 0.08 }]],
    cls: 'bg-ink',
    html: `<div class="stackc pad" style="align-items:flex-start;text-align:left">
      ${['Make every', 'second count', '<span class="accent">on screen.</span>'].map((l) => `<span class="mask t-sans lr-line"><span data-r="line">${l}</span></span>`).join('')}</div>`,
    render(t, c) {
      c.$$.line.forEach((el, i) => c.set(el, { yp: 105 * (1 - c.st('in', i)) - 105 * c.st('out', i) }));
    },
    prompt: 'Reveal a three-line headline line by line: wrap each line in an overflow-hidden container and slide the inner text from translateY(105%) to 0 over 800ms with an expo-out ease, staggering lines by 120ms. Hold for 1s, then slide the lines up and out (expo-in, 80ms stagger). Set manual line breaks.',
  });

  /* 04 Masked reveal (block wipe) */
  demo({
    id: 'masked-reveal', cat: CAT, name: 'Masked Typography Reveal', aka: ['Block reveal', 'Clip-path text reveal', 'Wipe-on text'],
    tags: T, char: ['Editorial', 'Bold', 'Fashion'],
    what: 'A solid block sweeps across, and the text is revealed behind it as the block leaves. The text itself never moves — only its clipping changes. Strong, graphic and very legible.',
    good: ['Fashion and editorial titles', 'Chapter cards', 'Names and lower thirds'],
    avoid: 'Busy footage with many colours — the block needs a clear colour relationship to the background.',
    anatomy: ['Scene time', 'Coloured block + clipped word', 'block scaleX 0→1 (origin left) then 1→0 (origin right); text clip-path inset', 'Block in 0.45s · out 0.45s; text revealed at the midpoint', 'expo.inOut', 'Block grows → text appears under it → block retracts'],
    tracks: [['bin', 'Block wipe in', 0.3, 0.45, 'expo.inOut'], ['bout', 'Block wipe out + text', '>', 0.45, 'expo.inOut'], ['sub', 'Subtitle', '-=0.15', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="stackc"><div class="mr-wrap"><b data-r="word" class="t-display mr-word">Editorial</b><i data-r="block" class="mr-block"></i></div>
      <span data-r="sub" class="t-serif" style="font-size:6cqmin;margin-top:3cqmin"><i>Spring / Summer 2026</i></span></div>`,
    render(t, c) {
      const a = c.p.bin, b = c.p.bout;
      c.set(c.$.block, { sx: a < 1 ? a : 1 - b });
      c.$.block.style.transformOrigin = a < 1 ? 'left center' : 'right center';
      c.set(c.$.word, { clip: `inset(0 ${a < 1 ? 100 : 0}% 0 0)` });
      c.set(c.$.sub, { y: 3 * (1 - c.p.sub), o: c.p.sub });
    },
    prompt: 'Create a block-reveal title: a solid accent-coloured block grows from the left edge across the word (scaleX 0 → 1, 450ms, expo in-out). At the moment it fully covers the word, make the word visible underneath, then retract the block to the right (scaleX 1 → 0 with origin right, 450ms). The text itself never moves. Fade the subtitle up 150ms before the block finishes.',
  });

  /* 05 Kinetic typography */
  const KT = [['STOP', 0.2, 'punch'], ['SCROLLING', 0.75, 'slide'], ['START', 1.3, 'drop'], ['WATCHING', 1.85, 'spin']];
  demo({
    id: 'kinetic-type', cat: CAT, name: 'Kinetic Typography', aka: ['Motion type', 'Typographic animation', 'Lyric-video style'],
    tags: T.concat('social'), char: ['Energetic', 'Bold', 'Rhythmic'],
    what: 'Typography becomes the main visual: words replace each other in rhythm, each with its own motion, often synced to music or voice. No footage needed — the type is the shot.',
    good: ['Hooks and intros without footage', 'Lyric and voiceover videos', 'Manifesto / brand statement edits'],
    avoid: 'Every word gets a different random effect. Pick 2–3 moves and repeat them so the rhythm reads.',
    anatomy: ['Beat-synced time', 'Four words, one at a time', 'Scale punch · slide · drop · rotate', 'Each word ≈0.55s, cut on the beat', 'punch / expo.out / back.out', 'Word → word on a 0.55s pulse'],
    tracks: KT.map(([w, at], i) => [`k${i}`, w, at, 0.5, i === 0 ? 'punch' : i === 2 ? 'back.out' : 'expo.out']).concat([['beat', 'Beat', 0.2, 0, 'linear', 'beat'], ['b2', 'Beat', 0.75, 0, 'linear', 'beat'], ['b3', 'Beat', 1.3, 0, 'linear', 'beat'], ['b4', 'Beat', 1.85, 0, 'linear', 'beat'], ['hold', 'Hold', 2.4, 0.9, 'linear']]),
    cls: 'bg-ink',
    html: `<div class="center"><i data-r="flash" class="kt-flash"></i></div>${KT.map(([w], i) =>
      `<div class="center"><b data-r="w" class="t-display kt-word ${i % 2 ? 'accent' : ''}" style="font-size:${w.length > 6 ? 19 : 30}cqmin">${w}</b></div>`).join('')}`,
    render(t, c) {
      c.$$.w.forEach((el, i) => {
        const p = c.p['k' + i];
        const next = i < 3 ? c.r['k' + (i + 1)] > 0 : false;
        const vis = c.r['k' + i] > 0 && !next;
        const kind = KT[i][2];
        const o = vis ? 1 : 0;
        if (kind === 'punch') c.set(el, { s: lerp(2.4, 1, p), o });
        else if (kind === 'slide') c.set(el, { xw: lerp(60, 0, p), skx: lerp(-14, 0, p), o });
        else if (kind === 'drop') c.set(el, { yh: lerp(-40, 0, p), o });
        else c.set(el, { r: lerp(-25, 0, p), s: lerp(0.6, 1, p), o });
      });
      let flash = 0;
      KT.forEach(([, at]) => { if (t >= at && t < at + 0.18) flash = 0.22 * (1 - (t - at) / 0.18); });
      c.set(c.$.flash, { o: flash });
    },
    prompt: 'Create kinetic typography for a 2.5s hook: show four words one at a time on a 0.55s pulse — “STOP” punches in from scale 2.4, “SCROLLING” slides in with a skew that straightens, “START” drops in with a back-out ease, “WATCHING” rotates in from −25°. Hard-cut between words on each beat, add a faint flash on each cut, and alternate white and accent colour.',
  });

  /* 06 Scale typography */
  demo({
    id: 'scale-type', cat: CAT, name: 'Scale Typography', aka: ['Zoom text', 'Type zoom-through', 'Oversized type'],
    tags: T, char: ['Cinematic', 'Bold', 'Dramatic'],
    what: 'Huge type scales from far beyond the frame down to its resting size, then later scales up past the camera to exit — a typographic “camera move”. Scale, not position, carries the drama.',
    good: ['Intro titles and big statements', 'Transitions into a new chapter', 'Event / campaign names'],
    avoid: 'Text that must be read during the move — mid-scale, only the final frame is legible.',
    anatomy: ['Scene time', 'One oversized word + small subline', 'scale 6 → 1 (in) · 1 → 9 (out) + opacity', '1.1s in · 1.1s hold · 0.7s out', 'expo.out in · expo.in out', 'Zoom in → subline → hold → zoom through'],
    tracks: [['in', 'Scale down in', 0.2, 1.1, 'expo.out'], ['sub', 'Subline', '-=0.4', 0.6, 'premium'], ['hold', 'Hold', '>', 0.9, 'linear'], ['out', 'Zoom through', '>', 0.7, 'expo.in']],
    cls: 'bg-night',
    html: `<div class="center"><b data-r="w" class="t-display" style="font-size:34cqmin">Bold</b></div>
      <div class="center" style="padding-top:44cqmin"><span data-r="sub" class="t-eyebrow">The 2026 campaign</span></div>`,
    render(t, c) {
      const s = lerp(6, 1, c.p.in) * lerp(1, 9, c.p.out);
      c.set(c.$.w, { s, o: Math.min(1, c.r.in * 3) * (1 - c.p.out * 0.9) });
      c.set(c.$.sub, { o: c.p.sub * (1 - c.r.out * 2), y: 3 * (1 - c.p.sub) });
    },
    prompt: 'Animate an oversized title word from scale 6 (far larger than the frame) down to 1 over 1.1s with an expo-out ease, fading in during the first third. Fade a small subline in below 400ms before the scale finishes. After a 0.9s hold, exit by scaling the word up to 9 over 700ms with expo-in so it feels like the camera flies through the letters.',
  });

  /* 07 Tracking animation */
  demo({
    id: 'tracking', cat: CAT, name: 'Tracking Animation', aka: ['Letter-spacing animation', 'Cinematic tracking', 'Text expand'],
    tags: T, char: ['Cinematic', 'Premium', 'Slow'],
    what: 'Letter-spacing widens slowly while the title fades in — the classic movie-poster title. It feels expansive and calm because the word grows outward from its centre without moving.',
    good: ['Film, travel and luxury titles', 'Slow intros', 'Place names over landscapes'],
    avoid: 'Long words in narrow 9:16 frames — check the final width fits the safe zone.',
    anatomy: ['Scene time', 'Title word + subline', 'letter-spacing −0.05em → 0.4em + opacity + blur', '3.2s (deliberately slow)', 'quart.out (most change early)', 'One continuous move while the subline fades in'],
    tracks: [['track', 'Tracking out', 0.2, 3.2, 'quart.out'], ['fade', 'Fade in', '<', 1.2, 'sine.inOut'], ['sub', 'Subline', '<0.9', 1, 'sine.inOut']],
    cls: 'bg-night',
    html: `<div class="center"><div class="col" style="gap:4cqmin"><b data-r="w" class="t-serif" style="font-size:12cqmin;text-transform:uppercase">Horizon</b><span data-r="sub" class="t-eyebrow">A film by Nobody Studio</span></div></div>`,
    render(t, c) {
      c.set(c.$.w, { o: c.p.fade, blur: 1.5 * (1 - c.p.fade), css: { letterSpacing: lerp(-0.05, 0.42, c.p.track).toFixed(3) + 'em', marginRight: (-lerp(-0.05, 0.42, c.p.track)).toFixed(3) + 'em' } });
      c.set(c.$.sub, { o: c.p.sub * 0.8 });
    },
    prompt: 'Create a cinematic tracking title: fade the title in over 1.2s while its letter-spacing expands from −0.05em to 0.4em over 3.2s with a quart-out ease, so most of the expansion happens early and it keeps drifting. Add a slight blur that clears as it fades in. Keep the word centred (compensate the trailing letter-spacing).',
  });

  /* 08 Text stretch */
  demo({
    id: 'text-stretch', cat: CAT, name: 'Text Stretch', aka: ['Squash & stretch type', 'Elastic text', 'Scale-Y text'],
    tags: T, char: ['Playful', 'Bold', 'Experimental'],
    variants: [['v', 'Vertical'], ['h', 'Horizontal']],
    what: 'The word is scaled along one axis — stretched tall or wide — then springs back to normal. Works best with condensed, heavy type where the distortion reads as a graphic gesture rather than a mistake.',
    good: ['Sports, streetwear and music content', 'Beat drops', 'Playful brand moments'],
    avoid: 'Serif or delicate typefaces, and brands with strict typography rules.',
    anatomy: ['Scene time', 'One heavy word (origin bottom or left)', 'scaleY (or scaleX) 0 → 1.5 → 1', '1.0s', 'spring.wobbly', 'Single elastic move'],
    tracks: [['go', 'Stretch in', 0.3, 1.0, 'spring.wobbly'], ['hold', 'Hold', '>', 0.8, 'linear'], ['out', 'Squash out', '>', 0.35, 'back.in']],
    cls: 'bg-yellow',
    html: (v) => `<div class="center"><b data-r="w" class="t-display" style="font-size:24cqmin;transform-origin:${v === 'v' ? '50% 85%' : '0% 50%'}">Stretch</b></div>`,
    render(t, c) {
      const p = c.p.go, o = c.p.out;
      if (c.v === 'v') c.set(c.$.w, { sy: Math.max(0, p * (1 - o)), sx: 1 + 0.12 * o });
      else c.set(c.$.w, { sx: Math.max(0, p * (1 - o)), sy: 1 + 0.1 * o });
    },
    prompt: (v) => `Stretch a heavy condensed word into view along its ${v === 'v' ? 'vertical axis from the baseline (scaleY 0 → overshoot ~1.5 → 1)' : 'horizontal axis from its left edge (scaleX 0 → overshoot → 1)'} using a wobbly spring over about 1s. After a short hold, squash it out with a back-in ease.`,
  });

  /* 09 Rolling text */
  const ROLL = ['fast.', 'simple.', 'secure.', 'yours.'];
  demo({
    id: 'rolling-text', cat: CAT, name: 'Rolling Text', aka: ['Text roll', 'Rotating words', 'Slot text'],
    tags: T, char: ['Clean', 'Product', 'Corporate'],
    what: 'One word in a sentence keeps changing: the old word rolls up and out of a slot while the new one rolls in from below. The sentence stays still, so the eye only has to read the new word.',
    good: ['Value propositions (“Banking that’s fast / simple / secure”)', 'Listing benefits in one line', 'Product taglines'],
    avoid: 'The rolling word changes the line length a lot — reserve the width of the longest word.',
    anatomy: ['Scene time', 'The changing word inside a mask', 'Old: translateY 0 → −100% · new: 100% → 0', '0.55s per roll · 0.9s between', 'expo.inOut', 'Roll → hold → roll …'],
    tracks: [1, 2, 3].map((n) => [`r${n}`, `Roll ${n}`, 0.6 + (n - 1) * 1.05, 0.55, 'expo.inOut']).concat([['hold', 'Hold', '>', 1, 'linear']]),
    cls: 'bg-blue',
    html: `<div class="stackc pad" style="align-items:flex-start;text-align:left"><span class="t-sans rt-line">Banking<br/>that’s</span>
      <span class="rt-slot t-sans">${ROLL.map((w) => `<span data-r="w" class="rt-word">${w}</span>`).join('')}</span></div>`,
    render(t, c) {
      const ps = [c.p.r1, c.p.r2, c.p.r3];
      c.$$.w.forEach((el, i) => {
        const pin = i === 0 ? 1 : ps[i - 1];
        const pout = i < 3 ? ps[i] : 0;
        c.set(el, { yp: 100 * (1 - pin) - 100 * pout });
      });
    },
    prompt: 'Create rolling text: in the line “Banking that’s ___”, make the last word cycle through “fast.”, “simple.”, “secure.”, “yours.” Each change rolls the old word up out of an overflow-hidden slot while the new word rolls in from below (550ms, expo in-out), with ~0.9s between rolls. Reserve the width of the longest word.',
  });

  /* 10 Text swap */
  const SWAP = [['CREATE', '#ef4b36'], ['DESIGN', '#3e63dd'], ['BUILD', '#2f7d62'], ['GROW', '#f2c14e']];
  demo({
    id: 'text-swap', cat: CAT, name: 'Text Swap', aka: ['Word swap', 'Hard-cut text', 'Word replacement'],
    tags: T.concat('social'), char: ['Energetic', 'Rhythmic', 'Bold'],
    what: 'The main word is replaced on a hard cut, each new word landing with a small scale punch and a background colour change. Unlike rolling text, there is no in-between — the swap itself is the rhythm.',
    good: ['Fast intros and hooks', 'Listing services (“Create · Design · Build · Grow”)', 'Beat-synced edits'],
    avoid: 'Swaps faster than ~0.35s per word — viewers cannot read them.',
    anatomy: ['Beat-synced time', 'Main word + background', 'Hard cut; new word scale 1.25 → 1 + background colour', '0.6s per word', 'expo.out (punch)', 'Cut → punch → hold … on every beat'],
    tracks: SWAP.map(([w], i) => [`s${i}`, w, 0.2 + i * 0.6, 0.35, 'expo.out']).concat([['hold', 'Hold', '>', 1, 'linear']]),
    html: `<div data-r="bg" class="fill"></div><div class="stackc"><span class="t-eyebrow" style="margin-bottom:3cqmin;color:#fff">We help you</span>
      <div class="ts-stack">${SWAP.map(([w]) => `<b data-r="w" class="t-display">${w}</b>`).join('')}</div></div>`,
    render(t, c) {
      let cur = -1;
      SWAP.forEach((_, i) => { if (c.r['s' + i] > 0) cur = i; });
      c.$$.w.forEach((el, i) => c.set(el, { o: i === cur ? 1 : 0, s: i === cur ? lerp(1.25, 1, c.p['s' + i]) : 1 }));
      c.$.bg.style.background = cur >= 0 ? SWAP[cur][1] : '#141416';
      c.$.bg.style.color = '#fff';
    },
    prompt: 'Create a text swap: the main word hard-cuts through CREATE → DESIGN → BUILD → GROW every 0.6s. Each new word lands with a quick scale punch from 1.25 to 1 (350ms, expo-out) and the background switches to a new brand colour on the same frame. No crossfade — the cut is the rhythm.',
  });

  /* 11 Scramble */
  const SCR = 'NEW FEATURE UNLOCKED';
  const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>';
  demo({
    id: 'scramble', cat: CAT, name: 'Text Scramble', aka: ['Decode effect', 'Random characters', 'Glitch type-on'],
    tags: T.concat('advanced'), char: ['Technical', 'Tech', 'Mysterious'],
    what: 'Each character cycles through random glyphs before locking into its final letter, left to right. It reads as “decoding” — perfect for tech, security, gaming and reveal moments.',
    good: ['Tech / AI / security products', 'Feature unlock and reveal moments', 'Code-themed titles'],
    avoid: 'Proportional fonts — use a monospace font so the width does not jump while scrambling.',
    anatomy: ['Scene time', 'Each character (monospace)', 'Random glyph every ~40ms → final letter', '0.35s scramble per char · 45ms stagger', 'Stepped (no interpolation)', 'Left-to-right lock-in'],
    tracks: [['dec', 'Decode ×' + SCR.length, 0.3, 0.35, 'linear', { n: SCR.length, each: 0.045 }], ['line', 'Underline', '>-0.2', 0.6, 'expo.out'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-grid',
    html: `<div class="stackc pad"><span class="t-eyebrow" style="color:#7fd1b0;margin-bottom:4cqmin">&gt; system.update()</span>
      <div class="t-mono scr-text">${[...SCR].map((ch) => `<span data-r="ch" class="scr-ch">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</div>
      <i data-r="line" class="scr-line"></i></div>`,
    render(t, c) {
      const tr = c.tl.map.dec;
      const tick = Math.floor(t * 24);
      c.$$.ch.forEach((el, i) => {
        const ch = SCR[i];
        if (ch === ' ') return;
        const s = tr.start + i * tr.each;
        let out;
        if (t < s) out = '·';
        else if (t < s + tr.dur) out = GLYPHS[Math.floor(hash(i * 31 + tick) * GLYPHS.length)];
        else out = ch;
        if (el.textContent !== out) el.textContent = out;
        el.classList.toggle('is-final', t >= s + tr.dur);
      });
      c.set(c.$.line, { sx: c.p.line });
    },
    prompt: 'Create a text-scramble reveal in a monospace font: each character starts as a dot, then cycles through random glyphs (A–Z, 0–9, symbols) every ~40ms for 350ms before locking into its final letter. Lock in left to right with a 45ms stagger, then draw an underline. Use a seeded random so the effect is identical on every replay.',
  });

  /* 12 Typewriter */
  const TW = 'Ide kamu, siap tayang. Ketik, lalu publish.';
  const twTimes = (() => {
    const out = []; let acc = 0;
    [...TW].forEach((ch, i) => { out.push(acc); acc += ch === ',' ? 0.28 : ch === '.' ? 0.42 : ch === ' ' ? 0.07 : 0.05 + hash(i) * 0.03; });
    return { out, total: acc };
  })();
  demo({
    id: 'typewriter', cat: CAT, name: 'Typewriter', aka: ['Type-on', 'Typing effect', 'Text reveal by character'],
    tags: T.concat('ui'), char: ['Conversational', 'Tech', 'Casual'],
    what: 'Characters appear one by one with a blinking caret, as if someone is typing. Irregular timing (longer pauses after commas and full stops) makes it feel human instead of mechanical.',
    good: ['Search bars, prompts and chat UIs', 'Storytelling captions', 'AI / productivity products'],
    avoid: 'Long paragraphs. Typing at reading speed is slow; keep it to one short sentence.',
    anatomy: ['Scene time', 'Characters + caret', 'Visible character count steps up; caret blinks', '≈2.6s for 44 characters', 'Stepped, with pauses at punctuation', 'Type → pause at punctuation → type'],
    tracks: [['type', 'Typing (with pauses)', 0.4, twTimes.total, 'linear', 'text'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc pad"><div class="tw-card"><div class="tw-bar"><i></i><i></i><i></i><span>draft.txt</span></div>
      <p class="tw-text"><span data-r="txt"></span><i data-r="caret" class="tw-caret"></i></p></div></div>`,
    render(t, c) {
      const tt = t - c.tl.map.type.start;
      let n = 0;
      while (n < TW.length && twTimes.out[n] <= tt) n++;
      const s = TW.slice(0, n);
      if (c.$.txt.textContent !== s) c.$.txt.textContent = s;
      const typing = tt > 0 && n < TW.length;
      c.set(c.$.caret, { o: typing ? 1 : Math.sin(t * Math.PI * 2.2) > 0 ? 1 : 0 });
    },
    prompt: 'Create a typewriter effect for one short sentence: reveal it character by character at about 50–80ms per character with slight random variation, pause ~280ms after commas and ~420ms after full stops, and show a caret that stays solid while typing and blinks (~1s cycle) when idle. Keep a full accessible copy of the text.',
  });

  /* 13 Counter / number roll */
  const ODO = 4;
  demo({
    id: 'number-roll', cat: CAT, name: 'Counter / Number Roll', aka: ['Odometer', 'Count up', 'Rolling digits'],
    tags: T, char: ['Clean', 'Data', 'Corporate'],
    variants: [['odo', 'Odometer (rolling digits)'], ['count', 'Counter (text count-up)']],
    what: 'A number counts up to its final value. The odometer version rolls each digit like a mechanical counter; the counter version just updates the text. Both should slow down as they approach the final value so the result lands.',
    good: ['Stats, users, downloads', 'Prices and savings', 'Percentages in infographics'],
    avoid: 'Counting for too long (> 2s) or with linear easing — the final number is what matters, so ease out into it.',
    anatomy: ['Scene time', 'Digit columns (or text)', 'Each column translateY by its digit value · or text = round(value)', '1.8s', 'expo.out (fast, then settles)', 'Count → land → label'],
    tracks: [['count', 'Count 0 → 2,847', 0.3, 1.8, 'expo.out'], ['label', 'Label', '-=0.5', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: (v) => `<div class="stackc"><span class="t-eyebrow" style="margin-bottom:3cqmin">Active creators</span>
      ${v === 'odo'
        ? `<div class="odo t-sans">${Array.from({ length: ODO }, (_, i) => `${i === 1 ? '<span class="odo__sep">,</span>' : ''}<span class="odo__col"><span data-r="col" class="odo__strip">${'0123456789'.split('').join('<br/>')}<br/>0</span></span>`).join('')}</div>`
        : `<b data-r="num" class="t-sans odo">0</b>`}
      <span data-r="label" class="t-body" style="margin-top:3cqmin">and growing every week</span></div>`,
    render(t, c) {
      const val = 2847 * c.p.count;
      if (c.v === 'odo') {
        c.$$.col.forEach((el, i) => {
          const pow = Math.pow(10, ODO - 1 - i);
          const pos = (val / pow) % 10;
          c.set(el, { yp: -(pos / 11) * 100 });
        });
      } else {
        c.$.num.textContent = Math.round(val).toLocaleString('en-US');
      }
      c.set(c.$.label, { o: c.p.label, y: 3 * (1 - c.p.label) });
    },
    prompt: (v) => v === 'odo'
      ? 'Create an odometer number roll to 2,847: each digit is a vertical strip of 0–9 inside an overflow-hidden column, translated so the visible digit follows the animated value. Animate the value over 1.8s with an expo-out ease so the digits spin fast, then settle on the final number. Use tabular figures.'
      : 'Create a count-up from 0 to 2,847 over 1.8s with an expo-out ease, formatting with thousands separators every frame and using tabular figures so the width does not jitter. Fade the label in as the count lands.',
  });

  /* 14 Number impact */
  const NUM = { pct: ['10%', 'cashback'], plus: ['200+', 'new arrivals'], rp: ['Rp1JT', 'total hadiah'] };
  demo({
    id: 'number-impact', cat: CAT, name: 'Number Impact', aka: ['Number slam', 'Stat punch', 'Big number hit'],
    tags: T.concat('social'), char: ['Energetic', 'Promo', 'Bold'],
    variants: [['pct', '10%'], ['plus', '200+'], ['rp', 'Rp1JT']],
    what: 'A big number slams into frame — oversized, fast, with a camera shake and a ring burst on impact — then a small label explains it. The number is the hook; the label is the context.',
    good: ['Discounts, cashback, prizes', 'Statistic hooks', 'Beat drops in promo videos'],
    avoid: 'More than one impact per few seconds — impacts lose power when repeated.',
    anatomy: ['Scene time (impact on a beat)', 'Number, ring, label, frame', 'scale 3 → 1 · shake 0.25s · ring scale + fade', 'Slam 0.32s · ring 0.6s · label 0.5s', 'expo.in for the fall, then shake decay', 'Slam → impact (shake + ring) → label'],
    tracks: [['slam', 'Slam in', 0.3, 0.32, 'expo.in'], ['impact', 'Impact', '>', 0, 'linear', 'beat'], ['ring', 'Ring burst', '<', 0.6, 'expo.out', 'fx'], ['shake', 'Shake', '<', 0.28, 'linear', 'camera'], ['label', 'Label', '<0.15', 0.5, 'back.soft'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-red',
    html: (v) => `<div data-r="frame" class="fill"><div class="center"><i data-r="ring" class="ni-ring"></i></div>
      <div class="stackc"><b data-r="num" class="t-display ni-num">${NUM[v][0]}</b><span data-r="label" class="badge badge--light" style="margin-top:3cqmin">${NUM[v][1]}</span></div></div>`,
    render(t, c) {
      c.set(c.$.num, { s: lerp(3.2, 1, c.p.slam), o: c.r.slam > 0 ? 1 : 0 });
      const sh = c.r.shake > 0 && c.r.shake < 1 ? (1 - c.r.shake) * 2.2 : 0;
      c.set(c.$.frame, { x: Math.sin(t * 90) * sh, y: Math.cos(t * 73) * sh });
      c.set(c.$.ring, { s: lerp(0.4, 2.2, c.p.ring), o: c.r.ring > 0 ? 1 - c.p.ring : 0 });
      c.set(c.$.label, { s: lerp(0.6, 1, c.p.label), o: c.p.label });
    },
    prompt: (v) => `Create a number impact for “${NUM[v][0]}”: the number falls from scale 3.2 to 1 over 320ms with an expo-in ease (accelerating into the hit). On impact, shake the whole frame for ~280ms with decaying amplitude and burst a thin ring outward from the centre while it fades. 150ms after impact, pop the label “${NUM[v][1]}” in with a soft back-out.`,
  });

  /* 15 Marquee */
  demo({
    id: 'marquee', cat: CAT, name: 'Text Marquee', aka: ['Ticker', 'Infinite scroll text', 'Kinetic band'],
    tags: T, char: ['Energetic', 'Fashion', 'Loop'],
    what: 'Large type scrolls endlessly in a band. Two rows moving in opposite directions add energy without needing any cuts. Linear speed is correct here — a marquee should never ease.',
    good: ['Backgrounds behind products', 'Sale / event banners', 'Seamless loops for social'],
    avoid: 'Text the viewer must read in full — marquees are texture and atmosphere, not information.',
    anatomy: ['Continuous loop', 'Two text bands (content duplicated for a seamless wrap)', 'translateX 0 → −50% (and reverse)', '6s per cycle', 'linear', 'Seamless: last frame = first frame'],
    tracks: [['loop', 'Loop (linear, seamless)', 0, 6, 'linear']],
    dur: 6, poster: 1.2,
    cls: 'bg-ink',
    html: `<div class="mq">${[0, 1, 2].map((r) => `<div class="mq__band ${r === 1 ? 'mq__band--accent' : ''}"><div data-r="band" class="mq__run t-display">${('NEW SEASON ✦ FREE SHIPPING ✦ LIMITED DROP ✦ ').repeat(2)}</div></div>`).join('')}</div>`,
    render(t, c) {
      const u = c.r.loop;
      c.$$.band.forEach((el, i) => c.set(el, { xp: i === 1 ? -50 + u * 50 : -u * 50 }));
    },
    prompt: 'Create a seamless text marquee: duplicate the band content twice inside one row and translate the row from 0 to −50% with linear easing over 6s, so the end frame equals the first frame. Run a second band in the opposite direction with an accent background. Never ease a marquee.',
  });

  /* 16 Circular typography */
  demo({
    id: 'circular-type', cat: CAT, name: 'Circular Typography', aka: ['Text on a circle', 'Rotating badge', 'Spinning text ring'],
    tags: T.concat('brand'), char: ['Playful', 'Premium', 'Loop'],
    what: 'Text set on a circular path rotates slowly around a central icon — a “stamp” or badge. The rotation is ambient and seamless; the centre stays still as an anchor.',
    good: ['“Scroll / swipe / shop now” badges', 'Brand seals and stamps', 'Loopable corner elements'],
    avoid: 'Fast rotation (< 6s per turn) — it becomes illegible and distracting.',
    anatomy: ['Continuous loop', 'Ring of text (SVG textPath)', 'rotate 0 → 360°', '8s per turn', 'linear', 'Seamless loop; centre arrow stays still'],
    tracks: [['loop', 'Rotation 360° (linear)', 0, 8, 'linear'], ['in', 'Badge pop-in', 0, 0.7, 'back.soft']],
    dur: 8, poster: 2,
    cls: 'bg-sand',
    html: `<div class="center"><div data-r="badge" class="ct-badge"><svg data-r="ring" viewBox="0 0 200 200"><defs><path id="ct-c" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0"/></defs>
      <text><textPath href="#ct-c" textLength="460">SWIPE UP ✦ NEW DROP 2026 ✦ SHOP NOW ✦</textPath></text></svg><div class="ct-center">${A.icon('up', { sw: 2 })}</div></div></div>`,
    render(t, c) {
      c.set(c.$.ring, { r: c.r.loop * 360 });
      c.set(c.$.badge, { s: lerp(0.6, 1, c.p.in), o: c.p.in });
    },
    prompt: 'Create a circular text badge: set a short repeating line (“SWIPE UP ✦ NEW DROP ✦ SHOP NOW ✦”) on a circular SVG textPath around a central arrow icon. Rotate only the text ring 360° every 8s with linear easing so it loops seamlessly; the centre icon stays still. Pop the badge in once with a soft back-out.',
  });

  /* 17 Text along path */
  demo({
    id: 'text-path', cat: CAT, name: 'Text Along Path', aka: ['Path text', 'Motion-path typography', 'Flowing text'],
    tags: T, char: ['Playful', 'Organic', 'Editorial'],
    what: 'The text flows along a curved line, moving forward by animating its start offset on the path. It feels like a ribbon or a river of words, and can lead the eye across the frame.',
    good: ['Travel and music edits', 'Leading the eye towards a product', 'Decorative ribbons in promos'],
    avoid: 'Tight curves — letters overlap and become unreadable on sharp bends.',
    anatomy: ['Scene time', 'One line of text on an SVG path', 'textPath startOffset 100% → −60%', '4.5s', 'linear (constant flow)', 'Single pass across the frame'],
    tracks: [['flow', 'Flow along path', 0.2, 4.5, 'linear'], ['line', 'Guide path draw', 0, 1, 'premium', 'object']],
    cls: 'bg-green',
    html: `<svg class="fill" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice"><path id="tp-p" data-r="guide" d="M-20 120 C 20 40, 50 170, 80 80 S 110 20, 130 40" fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".4" pathLength="1" stroke-dasharray="1 1"/>
      <text class="tp-text"><textPath data-r="tp" href="#tp-p" startOffset="100%">wherever the road goes ✦ wherever the road goes</textPath></text></svg>`,
    render(t, c) {
      c.$.tp.setAttribute('startOffset', lerp(100, -95, c.p.flow) + '%');
      c.set(c.$.guide, { dash: 1 - c.p.line });
    },
    prompt: 'Place one line of text on a smooth S-curve SVG path and animate the textPath startOffset from 100% to about −95% over 4.5s with linear easing, so the words flow along the curve across the frame. Draw the faint guide path first. Keep curves gentle so letters never overlap.',
  });

  /* 18 Blur reveal */
  demo({
    id: 'blur-reveal', cat: CAT, name: 'Text Blur Reveal', aka: ['Blur to sharp', 'Focus-in text', 'Soft reveal'],
    tags: T, char: ['Cinematic', 'Dreamy', 'Premium'],
    what: 'Words come out of a heavy blur into sharp focus, as if a lens is focusing on them. Softer than a slide, more physical than a fade.',
    good: ['Atmospheric intros', 'Beauty, fragrance and wellness', 'Over slow-motion footage'],
    avoid: 'Many simultaneous blurred layers — blur is expensive to render, especially on mobile and in browsers.',
    anatomy: ['Scene time', 'Each word', 'blur 14px → 0 + opacity + scale 1.15 → 1', '1.2s per word · 180ms stagger', 'sine.out', 'Words focus in reading order'],
    tracks: [['w', 'Words focus ×5', 0.3, 1.2, 'sine.out', { n: 5, each: 0.18 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-wine',
    html: `<div class="stackc pad"><p class="t-serif br-text">${words('Out of focus,')}<br/>${words('into frame.').replace('frame.', '<i>frame.</i>')}</p></div>`,
    render(t, c) {
      c.$$.w.forEach((el, i) => { const p = c.st('w', i); c.set(el, { o: p, blur: 3.2 * (1 - p), s: lerp(1.15, 1, p) }); });
    },
    prompt: 'Reveal the line word by word from blur to sharp: each word starts at blur(14px), opacity 0 and scale 1.15, and resolves to sharp, opaque and scale 1 over 1.2s with a sine ease-out, staggered by 180ms. Keep the total number of simultaneously blurred elements small for performance.',
  });

  /* 19 Focus pull */
  const FP = ['Save', 'Spend', 'Grow'];
  demo({
    id: 'focus-pull-text', cat: CAT, name: 'Text Focus Pull', aka: ['Selective focus', 'Spotlight word', 'Rack focus (text)'],
    tags: T, char: ['Cinematic', 'Editorial', 'Explanatory'],
    what: 'All words are on screen, but only one is in focus at a time; focus moves from word to word like a camera rack focus. It guides reading order without anything moving position.',
    good: ['Three-part messages (“Save · Spend · Grow”)', 'Comparisons and lists', 'Voiceover emphasis'],
    avoid: 'Moving the focus too fast — each word needs ~0.6s+ in focus to register.',
    anatomy: ['Scene time (or voiceover)', 'Three words', 'Focused word: blur 0, opacity 1, scale 1 · others: blur 6px, opacity 0.35', '0.45s pull · 0.8s hold per word', 'smooth', 'Word 1 → word 2 → word 3'],
    tracks: [['f0', 'Focus · Save', 0.3, 0.45, 'smooth'], ['f1', 'Focus · Spend', '+=0.8', 0.45, 'smooth'], ['f2', 'Focus · Grow', '+=0.8', 0.45, 'smooth'], ['hold', 'Hold', '>', 0.9, 'linear']],
    cls: 'bg-coal',
    html: `<div class="stackc" style="gap:2cqmin">${FP.map((w) => `<b data-r="w" class="t-sans fp-word">${w}<span class="accent">.</span></b>`).join('')}<span class="t-eyebrow" style="margin-top:4cqmin">One app. Three habits.</span></div>`,
    render(t, c) {
      const f = [c.p.f0 * (1 - c.p.f1), c.p.f1 * (1 - c.p.f2), c.p.f2];
      c.$$.w.forEach((el, i) => c.set(el, { blur: lerp(2, 0, f[i]), o: lerp(0.3, 1, f[i]), s: lerp(0.94, 1, f[i]) }));
    },
    prompt: 'Show three stacked words at once, all blurred (6px) and dimmed to 35% opacity. Pull focus to one word at a time: animate that word to blur 0, full opacity and scale 1 over 450ms (smooth in-out) while the previous word returns to blurred, holding each focus about 0.8s. Nothing changes position.',
  });

  /* 20 Highlight sweep */
  demo({
    id: 'highlight-sweep', cat: CAT, name: 'Text Highlight Sweep', aka: ['Marker highlight', 'Gradient sweep', 'Shine text'],
    tags: T, char: ['Clean', 'Explanatory', 'Promo'],
    variants: [['marker', 'Marker'], ['gradient', 'Gradient shine']],
    what: 'A highlight passes across the key words. The marker version draws a bar behind the phrase like a highlighter pen; the gradient version sweeps a light band through the letters. Both point at the important part of a sentence.',
    good: ['Emphasising the key phrase in a caption', 'Explainers and tutorials', 'Premium titles (gradient shine)'],
    avoid: 'Highlighting everything — one highlight per sentence.',
    anatomy: ['Scene time', 'Key phrase', 'Marker: scaleX 0 → 1 behind text · Gradient: background-position sweep', '0.7s marker · 1.4s shine', 'expo.out / smooth', 'Sentence in → highlight sweeps the key phrase'],
    tracks: (v) => [['text', 'Sentence in', 0.2, 0.6, 'premium'], ['hl', v === 'marker' ? 'Marker sweep' : 'Gradient sweep', '>-0.1', v === 'marker' ? 0.7 : 1.4, v === 'marker' ? 'expo.out' : 'smooth'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: (v) => (v === 'marker' ? 'bg-paper' : 'bg-ink'),
    html: (v) => v === 'marker'
      ? `<div class="stackc pad"><p data-r="text" class="t-sans hs-text">Spend less time editing,<br/><span class="hs-key"><i data-r="mark" class="hs-mark"></i><span>more time creating.</span></span></p></div>`
      : `<div class="stackc pad"><p data-r="text" class="t-serif hs-text hs-text--grad"><span data-r="grad" class="hs-grad">Light that<br/><i>moves</i> you.</span></p></div>`,
    render(t, c) {
      c.set(c.$.text, { o: c.p.text, y: 3 * (1 - c.p.text) });
      if (c.v === 'marker') c.set(c.$.mark, { sx: c.p.hl });
      else c.$.grad.style.backgroundPosition = lerp(120, -20, c.p.hl) + '% 0';
    },
    prompt: (v) => v === 'marker'
      ? 'Fade the sentence up, then draw a highlighter-style bar behind the key phrase “more time creating”: a solid accent bar slightly taller than the x-height, scaling from 0 to 1 on the X axis from its left edge over 700ms with expo-out, sitting behind the text.'
      : 'Fade the title up, then sweep a soft light band through the letters: use a wide linear-gradient (base colour → bright highlight → base colour) clipped to the text and move its background-position across over 1.4s with a smooth in-out ease. Keep the highlight subtle.',
  });
})();
