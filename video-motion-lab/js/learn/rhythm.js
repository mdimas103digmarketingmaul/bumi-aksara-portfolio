/* Learn F — Music, rhythm & pacing.
   No audio: beats are drawn in the stage and on the timeline (yellow
   markers) so the relationship between motion and music is visible. */
(function () {
  'use strict';
  const { demo, block, lerp, clamp, ease, bump, A } = window.VML;
  const BPM = 120, B = 60 / BPM; // 0.5s per beat
  const half = (k, label) => `<span class="split-label ${k === 'bad' ? 'split-label--bad' : 'split-label--good'}" style="left:3cqmin">${label}</span>`;

  block('rhythm', `<div class="learn-beat"><div><b>BEAT</b>${'<i>●</i>'.repeat(8)}</div><div><b>MOTION</b>${'<i>↑</i>'.repeat(8)}</div></div>
    <p class="learn-note">Viewers feel sync even on mute: a cut, scale hit or flash that lands <b>on</b> the beat reads as intentional; motion <b>between</b> beats (off-beat) feels bouncy and syncopated; a <b>build-up</b> shortens intervals to create tension, and the <b>drop</b> releases it with the biggest change in the video. Demos here assume 120 BPM (one beat every 0.5s).</p>`);

  /* Beat sync */
  const BEATS = Array.from({ length: 8 }, (_, i) => 0.3 + i * B);
  const EV = {
    hit: { label: 'Beat hit', ev: BEATS.map((t) => [t, 1]), words: ['ON', 'THE', 'BEAT', 'EVERY', 'TIME', 'HIT', 'HIT', 'HIT'], note: 'Every motion starts exactly on a beat.' },
    off: { label: 'Off-beat', ev: BEATS.map((t) => [t + B / 2, 0.8]), words: ['AND', 'AND', 'AND', 'AND', 'AND', 'AND', 'AND', 'AND'], note: 'Motion lands between beats (“and”) — syncopated, bouncy.' },
    build: { label: 'Build-up', ev: [0.3, 1.3, 2.05, 2.55, 2.9, 3.15, 3.32, 3.44, 3.52].map((t, i) => [t, 0.4 + i * 0.07]), words: ['3', '2', '1', 'GO', 'GO', 'GO', 'GO', 'GO'], note: 'Intervals shrink and intensity grows; tension before the drop.' },
    drop: { label: 'Drop', ev: [[0.3, 0.3], [0.8, 0.3], [1.3, 0.3], [1.8, 0.3], [2.3, 1.6], [2.8, 0.7], [3.3, 0.7], [3.8, 0.7]], words: ['.', '..', '...', '....', 'DROP', 'NOW', 'WE', 'GO'], note: 'Quiet beats, then the biggest change of the video on the drop.' },
    accent: { label: 'Accent hit', ev: BEATS.map((t, i) => [t, i % 4 === 3 ? 1.5 : 0.35]), words: ['1', '2', '3', '4!', '1', '2', '3', '4!'], note: 'Small pulses on every beat, one big accent per bar.' },
  };
  demo({
    id: 'beat-sync', cat: 'rhythm', name: 'Beat Sync', aka: ['Cut on the beat', 'Music sync', 'Rhythmic editing'], covers: 5,
    keywords: ['beat hit', 'off-beat', 'build up', 'drop', 'accent hit'],
    tags: ['social', 'text'], char: ['Rhythmic', 'Music', 'Reference'],
    variants: Object.entries(EV).map(([k, v]) => [k, v.label]),
    what: 'The beat lane at the bottom lights up on every beat (120 BPM); the motion lane shows when the visuals react. Switch variants to compare beat hits, off-beat motion, a build-up, a drop and accent hits — the same word-and-scale system, timed differently.',
    good: ['Music-driven reels and ads', 'Planning edit points before animating', 'Briefing editors'], avoid: 'Syncing every element to every beat — pick what hits (cuts, scale, flash) and let the rest breathe.',
    anatomy: ['Music beats (shown as markers)', 'Word + scale + flash', 'Envelope: instant attack, exponential decay per event', 'Beat = 0.5s (120 BPM)', 'Decay e^(−6t)', 'Depends on the variant'],
    tracks: (v) => BEATS.map((t, i) => [`b${i}`, 'Beat', t, 0, 'linear', 'beat']).concat(EV[v].ev.map(([t], i) => [`e${i}`, 'Motion hit', t, 0, 'linear', 'cut'])).concat([['hold', 'End', 4.4, 0.4, 'linear']]),
    cls: 'bg-ink',
    html: (v) => `<i data-r="flash" class="flash"></i><div class="stackc"><b data-r="word" class="t-display rh-word">·</b><span class="t-eyebrow rh-note">${EV[v].note}</span></div>
      <div class="rh-lanes"><div><span>Beat</span>${BEATS.map(() => '<i data-r="bd"></i>').join('')}</div><div><span>Motion</span>${BEATS.map(() => '<i data-r="md"></i>').join('')}</div></div>`,
    render(t, c) {
      const ev = EV[c.v].ev;
      let env = 0, idx = -1, big = 0;
      ev.forEach(([te, s], i) => { if (t >= te) { idx = i; const e = Math.exp(-(t - te) * 6) * s; if (e > env) { env = e; big = s; } } });
      c.set(c.$.word, { s: 1 + env * 0.35, o: idx >= 0 ? 1 : 0.2 });
      const w = idx >= 0 ? EV[c.v].words[Math.min(idx, 7)] : '·';
      if (c.$.word.textContent !== w) c.$.word.textContent = w;
      c.set(c.$.flash, { o: big > 1 ? clamp(env - 1) * 0.6 : 0 });
      c.$$.bd.forEach((el, i) => el.classList.toggle('on', t >= BEATS[i] && t < BEATS[i] + 0.15));
      c.$$.md.forEach((el, i) => { const e = ev[i]; el.classList.toggle('on', !!e && t >= e[0] && t < e[0] + 0.15); if (e) el.style.left = ((e[0] - 0.3) / (B * 8)) * 100 + '%'; });
    },
    prompt: (v) => `Sync the motion to music at 120 BPM (beat = 0.5s): ${EV[v].note} For each event trigger an envelope with an instant attack and exponential decay (≈e^(−6t)) that drives a scale hit (+35%), a word change and — only on the biggest hit — a short flash.`,
  });

  /* Speed ramp */
  const SP = (t) => { // speed multiplier over time
    if (t < 1) return 1;
    if (t < 1.35) return lerp(1, 5, ease('cubic.in')((t - 1) / 0.35));
    if (t < 1.65) return 5;
    if (t < 2.0) return lerp(5, 0.2, ease('cubic.out')((t - 1.65) / 0.35));
    if (t < 3.0) return 0.2;
    if (t < 3.4) return lerp(0.2, 1, ease('inOut')((t - 3) / 0.4));
    return 1;
  };
  const POS = (() => { const a = [0]; let x = 0; for (let i = 1; i <= 500; i++) { x += SP((i - 0.5) / 100) / 100; a.push(x); } return a; })();
  const posAt = (t) => { const i = clamp(t, 0, 4.99) * 100, f = Math.floor(i); return lerp(POS[f], POS[Math.min(f + 1, 500)], i - f); };
  demo({
    id: 'speed-ramp', cat: 'rhythm', name: 'Speed Ramp', aka: ['Time remapping', 'Ramp to slow-mo', 'Velocity edit'],
    tags: ['camera', 'social'], char: ['Dynamic', 'Sporty', 'Cinematic'],
    what: 'Playback speed itself is animated: normal → FAST → slow motion → normal. The rolling ball and the scrolling ground both follow the remapped time; the graph shows speed over time. Ramps emphasise the key moment by slowing it down right after a rush.',
    good: ['Sports, action and dance', 'Product hero moments (rush → slow-mo detail)', 'Transitions between clips'], avoid: 'Ramping footage shot at normal frame rates into deep slow-mo — it stutters (real slow-mo needs high-fps footage).',
    anatomy: ['Edit time → media time', 'Ball, ground, speed graph', 'Media time = ∫ speed(t) dt; blur ∝ speed', 'Normal 1s · ramp up · FAST · ramp down · slow 1s · back', 'cubic in/out on the speed curve', 'normal → FAST → slow → normal'],
    tracks: [['n1', 'Normal 1×', 0, 1, 'linear', 'camera'], ['up', 'Ramp up', 1, 0.35, 'cubic.in', 'fx'], ['fast', 'FAST 5×', '>', 0.3, 'linear', 'camera'], ['down', 'Ramp down', '>', 0.35, 'cubic.out', 'fx'], ['slow', 'Slow-mo 0.2×', '>', 1, 'linear', 'camera'], ['back', 'Back to 1×', '>', 0.4, 'inOut', 'fx'], ['n2', 'Normal 1×', '>', 1, 'linear', 'camera']],
    dur: 4.4,
    cls: 'bg-coal',
    html: () => { const b = A.dirBlur(); return `${b.html}<div class="rh-ground" data-r="ground" data-filter="${b.id}"></div><div data-r="ball" class="rh-ball"></div>
      <div class="rh-speed"><b data-r="sv">1.0×</b><span data-r="sl">normal</span></div>
      <svg class="rh-graph" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M${Array.from({ length: 89 }, (_, i) => `${(i / 88) * 100} ${40 - SP(i * 0.05) * 7}`).join(' L')}" fill="none" stroke="#f2c14e" stroke-width="1.5" vector-effect="non-scaling-stroke"/><line data-r="cur" x1="0" x2="0" y1="0" y2="40" stroke="#fff" vector-effect="non-scaling-stroke"/></svg>`; },
    render(t, c) {
      const x = posAt(t), sp = SP(t);
      c.set(c.$.ground, { xp: -((x * 30) % 20) });
      c.set(c.$.ball, { r: x * 300 });
      A.setDirBlur(c, c.$.ground, c.$.mbf, sp > 1.5 ? (sp - 1) * 0.8 : 0, 0);
      c.$.sv.textContent = sp.toFixed(1) + '×';
      c.$.sl.textContent = sp > 1.5 ? 'FAST' : sp < 0.6 ? 'slow-mo' : 'normal';
      const cx = (t / 4.4) * 100; c.$.cur.setAttribute('x1', cx); c.$.cur.setAttribute('x2', cx);
    },
    prompt: 'Apply a speed ramp: animate playback speed from 1× to 5× over 350ms (cubic ease-in), hold briefly, ramp down to 0.2× slow motion (cubic ease-out), hold the slow-mo for ~1s on the key moment, then ease back to 1×. Drive the media time by integrating the speed curve and add motion blur only during the fast section.',
  });

  /* Hold frames */
  const LINES = ['Plan once.', 'Save daily.', 'Grow yearly.'];
  demo({
    id: 'hold-frames', cat: 'rhythm', name: 'Hold Frames', aka: ['Pauses', 'Dwell time', 'Breathing room'],
    tags: ['text'], char: ['Comparison', 'Readable'], wide: true, fixed: '16:9',
    what: 'Left: each line arrives and immediately leaves — always moving, never readable. Right: motion → HOLD → motion. The holds (striped bars on the timeline) are when reading actually happens. Video that never pauses tires viewers and hides the message.',
    good: ['Any text-on-screen video', 'Explainers and promos', 'Subtitles and lower thirds'], avoid: 'Cutting holds to “keep it fast” — fast without readability is just noise.',
    anatomy: ['Scene time', 'Three lines (×2)', 'Bad: in + out back-to-back · Good: in → hold 0.7s → out', '≈4s', 'expo.out / expo.in', 'Motion → HOLD → motion'],
    tracks: [0, 1, 2].flatMap((i) => [[`bi${i}`, `No hold · line ${i + 1}`, 0.3 + i * 0.7, 0.35, 'expo.out', 'text'], [`bo${i}`, 'Out', '>', 0.35, 'expo.in', 'text']]).concat([0, 1, 2].flatMap((i) => [[`gi${i}`, `Line ${i + 1} in`, 0.3 + i * 1.3, 0.35, 'expo.out', 'text'], [`gh${i}`, 'HOLD (read)', '>', 0.6, 'linear', 'hold'], [`go${i}`, 'Out', '>', 0.3, 'expo.in', 'text']])),
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'Always moving' : 'Motion → hold → motion')}${LINES.map((l) => `<div class="center"><b data-r="${k}l" class="t-sans rh-hold">${l}</b></div>`).join('')}</div>`).join('')}</div>`,
    render(t, c) {
      c.$$.badl.forEach((el, i) => { const pi = c.p['bi' + i], po = c.p['bo' + i]; c.set(el, { o: pi * (1 - po), x: 8 * (1 - pi) - 8 * po }); });
      c.$$.goodl.forEach((el, i) => { const pi = c.p['gi' + i], po = c.p['go' + i]; c.set(el, { o: pi * (1 - po), x: 8 * (1 - pi) - 8 * po }); });
    },
    prompt: 'Give every on-screen line a hold: animate it in (≈350ms, expo-out), hold it still for at least ~0.6–1s (longer for longer text), then animate it out (≈300ms, expo-in) before the next line. Never chain entrances and exits back-to-back for text the viewer must read.',
  });

  /* Visual rhythm */
  const RB = [0.3, 0.75, 1.2, 1.65, 2.1, 2.55, 3.0]; // even
  const RG = [[0.3, 'FAST', 0.2], [1.1, 'MEDIUM', 0.6], [2.4, 'FAST', 0.2], [2.7, 'FAST', 0.2]];
  demo({
    id: 'learn-visual-rhythm', cat: 'rhythm', name: 'Visual Rhythm', aka: ['Pacing pattern', 'Fast–hold–medium', 'Edit rhythm'],
    tags: ['object'], char: ['Comparison', 'Rhythmic'], wide: true, fixed: '16:9',
    what: 'Left: FAST FAST FAST FAST — equal hits at an even interval. It feels mechanical and the viewer quickly tunes it out. Right: FAST · HOLD · MEDIUM · HOLD · FAST-FAST — variation in speed and spacing creates phrasing, like music. Rhythm is contrast over time.',
    good: ['Planning montage edits', 'Pacing promos and hooks', 'Any sequence of more than three moments'], avoid: 'Uniform pacing for a whole video.',
    anatomy: ['Scene time', 'Pulse disc (×2)', 'Scale pulses with different durations and gaps', '≈3.4s', 'expo.out', 'Even pattern vs phrased pattern'],
    tracks: RB.map((t, i) => [`r${i}`, 'Even hit', t, 0, 'linear', 'beat']).concat(RG.map(([t, l, d], i) => [`g${i}`, l, t, d, 'expo.out', 'object'])).concat([['gh1', 'HOLD', 0.5, 0.6, 'linear', 'hold'], ['gh2', 'HOLD', 1.7, 0.7, 'linear', 'hold'], ['end', 'End', 3.0, 0.5, 'linear']]),
    html: `<div class="split">${['bad', 'good'].map((k) => `<div>${half(k, k === 'bad' ? 'FAST FAST FAST FAST' : 'FAST · HOLD · MEDIUM · HOLD · FAST')}<div class="center"><i data-r="${k}d" class="rh-disc"></i></div><div class="center" style="padding-top:34cqmin"><span data-r="${k}w" class="t-eyebrow">·</span></div></div>`).join('')}</div>`,
    render(t, c) {
      let eb = 0; RB.forEach((b) => { if (t >= b) eb = Math.max(eb, Math.exp(-(t - b) * 9)); });
      c.set(c.$.badd, { s: 1 + eb * 0.5 });
      c.$.badw.textContent = 'fast';
      let eg = 0, lbl = 'hold';
      RG.forEach(([b, l, d]) => { if (t >= b) { const e = Math.exp(-(t - b) / (d * 0.6)); if (e > eg) { eg = e; } if (t < b + d + 0.05) lbl = l.toLowerCase(); } });
      c.set(c.$.goodd, { s: 1 + eg * 0.5 });
      c.$.goodw.textContent = eg > 0.25 ? lbl : 'hold';
    },
    prompt: 'Phrase the edit rhythm instead of hitting at an even interval: alternate fast hits (~200ms) with holds (~0.6s) and a medium move (~600ms), e.g. FAST · HOLD · MEDIUM · HOLD · FAST-FAST, so the sequence has musical phrasing.',
  });
})();
