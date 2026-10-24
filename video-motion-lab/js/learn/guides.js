/* Learn E + G — social media motion guide, safe zones, and timeline
   thinking (the vocabulary of gsap.timeline()). */
(function () {
  'use strict';
  const { demo, block, lerp, clamp, ease, esc, A } = window.VML;

  /* ---------- E · social guide ---------- */
  block('social', `<div class="learn-phases">
      <div style="--w:8%"><span>0s</span><b>HOOK</b><p>Frame 1 works as a still. Something changes before 1s.</p></div>
      <div style="--w:16%"><span>1s</span><b>CONTEXT</b><p>By 3s the viewer knows what this is and why to stay.</p></div>
      <div style="--w:56%"><span>3s</span><b>VALUE</b><p>Deliver the information: one idea per beat, holds to read.</p></div>
      <div style="--w:20%"><span>END</span><b>CTA</b><p>One action + brand recall. Hold ≥ 1.5s, or loop back.</p></div></div>
    <div class="learn-cols">
      <div><h4>First frame</h4><p>Must attract attention before any motion: high contrast, one big subject, a short bold line. Never open on black, a slow fade or a logo.</p></div>
      <div><h4>First 1 second</h4><p>An immediate visual change — a punch, a cut, a word appearing — proves the video is alive and stops the thumb.</p></div>
      <div><h4>First 3 seconds</h4><p>The hook must be clear: what is this, for whom, and what will I get? Most retention is won or lost here.</p></div>
      <div><h4>Middle</h4><p>Deliver the value in a rhythm of moves and holds. Captions on screen — most people watch muted.</p></div>
      <div><h4>Final</h4><p>A single CTA and brand recall. Consider ending on a frame that loops back into the start.</p></div></div>
    <div class="learn-sz"><div class="learn-sz__frame"><i class="t"></i><i class="b"></i><i class="r"></i><span>Center safe content</span></div>
      <div><h4>Approximate Social UI Safe Zone</h4><p>On 9:16, platform UI covers the <b>top ≈12%</b> (account name, tabs), the <b>bottom ≈20–25%</b> (caption, audio, CTA buttons) and a strip on the <b>right ≈15%</b> (like, comment, share). Keep text, faces, prices and logos in the centre area. These are rounded teaching values — each platform and device differs, so check current specs before final delivery. Turn on <b>Safe zone</b> in the header to overlay it on every demo.</p></div></div>`);

  demo({
    id: 'reel-anatomy', cat: 'social', name: 'Anatomy of a Short Video', aka: ['Hook–context–value–CTA', 'Reel structure'], covers: 4,
    tags: ['social', 'text'], char: ['Reference', 'Strategic'], fixed: '9:16',
    what: 'A compressed 8-second reel structured as HOOK (0–1s) → CONTEXT (1–3s) → VALUE (3–6.5s) → CTA (end). The phase bar at the top shows where you are. In a real video the value section is longer — the proportions of hook and context stay short.',
    good: ['Planning scripts and storyboards', 'Reviewing drafts against retention', 'Briefing creators'], avoid: 'Spending the first 3 seconds on a logo or an intro.',
    anatomy: ['Scene time', 'Phase bar + four scenes', 'Hook punch → context line → three value points → CTA', '≈8s compressed', 'expo.out / premium', 'HOOK → CONTEXT → VALUE → CTA'],
    tracks: [['hook', 'HOOK', 0, 1, 'expo.out', 'text'], ['ctx', 'CONTEXT', 1, 2, 'premium', 'text'], ['val', 'VALUE ×3', 3, 0.5, 'premium', { n: 3, each: 1.1, kind: 'object' }], ['cta', 'CTA', 6.5, 0.5, 'back.soft', 'cta'], ['hold', 'CTA hold', '>', 1.2, 'linear']],
    dur: 8.2,
    cls: 'bg-ink',
    html: `<div class="ra-bar"><i data-r="ph" class="on">Hook</i><i data-r="ph">Context</i><i data-r="ph">Value</i><i data-r="ph">CTA</i><em data-r="prog"></em></div>
      <div data-r="s0" class="fill bg-yellow"><div class="stackc"><b data-r="hk" class="t-display" style="font-size:20cqmin;color:#1d1708;text-align:center">Gaji habis<br/>tanggal 20?</b></div></div>
      <div data-r="s1" class="fill bg-coal"><div class="stackc pad"><b class="t-sans" style="font-size:8cqmin;text-align:center">3 kebiasaan kecil yang bikin tabunganmu naik.</b></div></div>
      <div data-r="s2" class="fill bg-paper"><div class="stackc pad" style="align-items:stretch;gap:3cqmin">${['Pisahkan rekening tabungan', 'Auto-debit di hari gajian', 'Catat 3 pengeluaran terbesar'].map((v, i) => `<div data-r="v" class="ad-feat"><span class="t-mono">0${i + 1}</span><b>${v}</b><span></span></div>`).join('')}</div></div>
      <div data-r="s3" class="fill bg-red"><div class="stackc" style="gap:4cqmin"><b class="t-display" style="font-size:14cqmin">Mulai hari ini</b><span class="cta cta--light">Follow untuk tips lain</span></div></div>`,
    render(t, c) {
      const ph = t < 1 ? 0 : t < 3 ? 1 : t < 6.5 ? 2 : 3;
      [0, 1, 2, 3].forEach((i) => c.set(c.$['s' + i], { o: i === ph ? 1 : 0 }));
      c.$$.ph.forEach((el, i) => el.classList.toggle('on', i === ph));
      c.set(c.$.prog, { sx: t / 8.2 });
      c.set(c.$.hk, { s: lerp(1.3, 1, c.p.hook) });
      c.$$.v.forEach((el, i) => { const p = c.st('val', i); c.set(el, { o: p, y: 4 * (1 - p) }); });
    },
    prompt: 'Structure a short vertical video as HOOK (0–1s: a bold line that works as a still, punched in) → CONTEXT (1–3s: what this is and why stay) → VALUE (3s+: one point per beat with holds to read) → CTA (final 1.5s+: one action, brand recall). Keep the hook and context short regardless of total length.',
  });

  demo({
    id: 'safe-zone-guide', cat: 'social', name: 'Safe Zone Placement', aka: ['Social UI overlap', 'Caption-safe layout'],
    tags: ['social', 'ui'], char: ['Reference', 'Practical'], fixed: '9:16',
    variants: [['bad', 'Unsafe layout'], ['good', 'Safe layout']],
    what: 'The approximate social UI is drawn over the frame. In the unsafe layout the headline sits under the account bar, the price under the action buttons and the CTA under the caption. In the safe layout the same elements move into the centre area. Approximate guide — verify current platform specs.',
    good: ['Checking layouts before export', 'Templates for Reels, TikTok, Shorts'], avoid: 'Trusting a single platform’s overlay for all platforms — they differ.',
    anatomy: ['Layout check', 'Headline, price, CTA + simulated UI', 'Elements animate to their positions; UI overlay fades in', '1s', 'premium', 'Content → UI overlay → verdict'],
    tracks: [['in', 'Layout in', 0.2, 0.8, 'premium', 'ui'], ['ui', 'Platform UI overlay', '>', 0.5, 'out', 'fx'], ['hold', 'Hold', '>', 1.6, 'linear']],
    html: (v) => `${A.photo('portrait', { cls: 'fill' })}<i class="fill" style="background:rgba(0,0,0,.25)"></i>
      <div data-r="lay" class="sg-lay sg-lay--${v}"><b class="t-display sg-head">Kulit glowing<br/>dalam 7 hari</b><span class="badge sg-price">Rp 89.000</span><span class="cta sg-cta">Beli sekarang</span></div>
      <div data-r="ui" class="sg-ui"><div class="sg-ui__top"><i></i><b>@brand.example</b><span>Follow</span></div><div class="sg-ui__side">${['heart', 'chat', 'send', 'music'].map((i) => `<span>${A.icon(i)}</span>`).join('')}</div><div class="sg-ui__bot"><b>@brand.example</b><p>Caption text sits here and covers the bottom of the frame… more</p><small>♫ original audio</small></div></div>
      <span data-r="verdict" class="sg-verdict sg-verdict--${v}">${v === 'bad' ? '✕ Key info hidden by UI' : '✓ Everything readable'}</span>`,
    render(t, c) {
      c.set(c.$.lay, { o: c.p.in, y: 3 * (1 - c.p.in) });
      c.set(c.$.ui, { o: c.p.ui });
      c.set(c.$.verdict, { o: c.p.ui, s: lerp(0.8, 1, c.p.ui) });
    },
    prompt: 'Lay out the vertical ad inside the approximate social safe zone: keep headline, price, faces and CTA out of the top ~12% (account bar), the bottom ~20–25% (caption, audio, buttons) and the right ~15% strip (actions). Verify against each platform’s current guidelines before export.',
  });

  /* ---------- G · timeline thinking ---------- */
  const POSN = {
    seq: ['Sequence ( ">" / default )', ['', '', '', ''], 'Each tween starts when the timeline ends — no overlap. Clear but slow.'],
    overlap: ['Overlap ( "-=0.3" )', ['', '-=0.3', '-=0.3', '-=0.3'], 'Negative offset from the end of the timeline: the next tween starts 0.3s early.'],
    with: ['Together ( "<" )', ['', '<', '<0.15', '<'], '“<” aligns with the previous tween’s start; “<0.15” starts 0.15s after it.'],
    gap: ['Gap / delay ( "+=0.4" )', ['', '+=0.4', '+=0.2', '+=0.4'], 'Positive offset adds a pause (a hold) before the next tween.'],
    stagger: ['Stagger', ['stagger'], 'One tween on many targets with { stagger: 0.12 }: same move, offset starts.'],
  };
  const NAMES = ['intro', 'headline', 'product', 'cta'];
  const codeFor = (v) => {
    if (v === 'stagger') return `gsap.timeline()\n  .from(".item", {\n    y: 40, opacity: 0,\n    duration: 0.6, ease: "expo.out",\n    stagger: 0.12\n  });`;
    const pos = POSN[v][1];
    return 'gsap.timeline({ defaults: { duration: 0.6, ease: "expo.out" } })\n' + NAMES.map((n, i) => `  .from(".${n}", { y: 40, opacity: 0 }${pos[i] ? `, "${pos[i]}"` : ''})`).join('\n') + ';';
  };
  block('gsap', `<div class="learn-cols learn-cols--3">
      <div><h4>Timeline</h4><p>A container that holds tweens on one clock. You can play, pause, scrub, reverse or change its speed as a whole — like this lab’s transport.</p></div>
      <div><h4>Duration &amp; delay</h4><p><code>duration</code> is how long one move takes. A <code>delay</code> waits before it starts. On a timeline, prefer the <b>position parameter</b> over delays.</p></div>
      <div><h4>Position</h4><p>The third argument places a tween: <code>"&lt;"</code> with the previous, <code>"&gt;"</code> after it, <code>"-=0.3"</code> overlap, <code>"+=0.4"</code> gap, or an absolute time like <code>1.2</code>.</p></div>
      <div><h4>Overlap</h4><p>Overlap turns separate steps into one gesture. Most entrances overlap 30–60% of the previous move.</p></div>
      <div><h4>Stagger</h4><p>One tween on many targets with offset starts: <code>stagger: 0.12</code>. Use for lists, letters, grids.</p></div>
      <div><h4>Easing</h4><p><code>ease: "expo.out"</code>, <code>"back.out(1.4)"</code>, <code>"power2.inOut"</code>… set a default on the timeline and override per tween.</p></div></div>
    <pre class="learn-code">// Scene timeline: intro → headline → product → benefit → CTA
const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.7 } });
tl.from(".bg",       { opacity: 0, duration: 1 })
  .from(".headline", { yPercent: 100 }, "-=0.6")      // overlap
  .from(".product",  { y: 120, ease: "back.out(1.2)" }, "<0.15")  // with headline
  .from(".benefit",  { opacity: 0, x: -20, stagger: 0.12 }, "+=0.1")
  .from(".cta",      { scale: 0.8, opacity: 0 }, "+=0.3");      // a beat later
// tl.pause(); tl.progress(0.5); tl.timeScale(0.5); — scrubbing &amp; speed, like this lab</pre>
    <p class="learn-note">This lab does not load GSAP: each demo renders from a time value with its own small timeline model, which uses the same position syntax. Every “Timing recipe” tab shows that position column, so you can rebuild any demo with <code>gsap.timeline()</code>.</p>`);

  demo({
    id: 'gsap-position', cat: 'gsap', name: 'Position Parameter Explorer', aka: ['gsap.timeline() positions', 'Overlap / stagger / gap'], covers: 5,
    tags: ['object', 'text'], char: ['Technical', 'Reference'], wide: true, fixed: '16:9',
    variants: Object.entries(POSN).map(([k, v]) => [k, v[0].split(' (')[0]]),
    what: 'Four elements (intro, headline, product, CTA) animate with the same tween; only the position parameter changes. The code panel shows the exact gsap.timeline() that matches, and the timeline below the stage shows the result.',
    good: ['Learning GSAP sequencing', 'Translating a storyboard into code', 'Prompting AI tools with precise timing'], avoid: '—',
    anatomy: ['Timeline', 'Four blocks', 'y 40 → 0 + opacity, 0.6s each', 'Depends on position parameter', 'expo.out', 'See code panel'],
    tracks: (v) => v === 'stagger' ? [['s', 'from(".item", stagger 0.12)', 0.2, 0.6, 'expo.out', { n: 4, each: 0.12 }], ['hold', 'Hold', '>', 1, 'linear']]
      : NAMES.map((n, i) => [n, `.${n} ${POSN[v][1][i] || (i ? '(default ">")' : '')}`, i === 0 ? 0.2 : (POSN[v][1][i] || null), 0.6, 'expo.out']).concat([['hold', 'Hold', '>', 1, 'linear']]),
    cls: 'bg-ink',
    html: (v) => `<div class="gp"><div class="gp__blocks">${NAMES.map((n) => `<div data-r="blk" class="gp__blk"><span>.${n}</span></div>`).join('')}</div>
      <div class="gp__code"><pre>${esc(codeFor(v))}</pre><p>${POSN[v][2]}</p></div></div>`,
    render(t, c) {
      c.$$.blk.forEach((el, i) => { const p = c.v === 'stagger' ? c.st('s', i) : c.p[NAMES[i]]; c.set(el, { y: 8 * (1 - p), o: p }); });
    },
    prompt: (v) => `Sequence the scene with gsap.timeline() using the position parameter (${POSN[v][0]}): ${POSN[v][2]}\n\n${codeFor(v)}`,
  });
})();
