/* 09 — Data & Infographics
   Motion that explains numbers: values land, charts grow from a shared
   baseline, steps appear in reading order. All data is generic. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, rng, A } = window.VML;
  const CAT = 'data';
  const D = ['object', 'text'];
  /* Self-drawing paths need uniform scaling (stroke dashes break on stretched SVGs), so these
     SVGs use a viewBox in real pixels and their paths are rebuilt from % points on resize. */
  function fitSvg(svg, paths) {
    const r = svg.getBoundingClientRect();
    if (!r.width) return false;
    svg.setAttribute('viewBox', `0 0 ${r.width.toFixed(1)} ${r.height.toFixed(1)}`);
    paths.forEach(([el, pts]) => el.setAttribute('d', pts.map(([x, y], i) => (i ? 'L' : 'M') + ((x / 100) * r.width).toFixed(1) + ' ' + ((y / 100) * r.height).toFixed(1)).join(' ')));
    return true;
  }
  const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* 01 Animated counter */
  const CNT = { int: [128450, '', '', 'downloads this year', 0], pct: [87.5, '', '%', 'customer satisfaction', 1], cur: [2.4, 'Rp', ' M', 'average monthly savings', 1] };
  demo({
    id: 'animated-counter', cat: CAT, name: 'Animated Counter', aka: ['Count up', 'Percentage counter', 'Currency counter'],
    tags: D, char: ['Clean', 'Data', 'Confident'], covers: 2,
    variants: [['int', 'Integer'], ['pct', 'Percentage'], ['cur', 'Currency']],
    what: 'A key number counts up from zero and decelerates into its final value, with a progress line underneath that fills at the same rate. Formatting (separators, decimals, units) is applied every frame so it always reads as a real number.',
    good: ['Hero statistics', 'Results and impact numbers', 'Percentages and currency in reports'],
    avoid: 'Showing several counters at the same speed — stagger them or the eye cannot follow any.',
    anatomy: ['Scene time', 'Number text + progress line + label', 'value = target × ease(p), formatted per frame', '1.6s count', 'expo.out', 'Label → count + line → hold'],
    tracks: [['label', 'Label', 0.2, 0.5, 'premium'], ['count', 'Count up', '<0.2', 1.6, 'expo.out'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="stackc pad" style="align-items:flex-start;text-align:left"><span data-r="label" class="t-eyebrow" style="margin-bottom:3cqmin"></span>
      <b data-r="num" class="t-sans ig-big">0</b><div class="ig-line"><i data-r="bar"></i></div></div>`,
    init(c) { c.$.label.textContent = CNT[c.v][3]; },
    render(t, c) {
      const [to, pre, suf, , dec] = CNT[c.v];
      c.$.num.textContent = pre + fmt(to * c.p.count, dec) + suf;
      c.set(c.$.bar, { sx: c.p.count });
      c.set(c.$.label, { o: c.p.label });
    },
    prompt: (v) => `Count a key statistic up from 0 to ${CNT[v][1]}${CNT[v][0]}${CNT[v][2]} over 1.6s with an expo-out ease, formatting the value every frame (${v === 'int' ? 'thousands separators' : v === 'pct' ? 'one decimal and a % sign' : 'currency prefix, one decimal and a unit'}) and using tabular figures. Fill a thin progress line underneath at the same eased rate. Hold the final value at least 1s.`,
  });

  /* 02 Progress bars */
  const PB = [['Design', 92], ['Strategy', 76], ['Motion', 64], ['Code', 48]];
  demo({
    id: 'progress-bar', cat: CAT, name: 'Progress Bar', aka: ['Bar fill', 'Skill bars', 'Loading bar'],
    tags: D, char: ['Clean', 'Corporate', 'Readable'],
    what: 'Bars fill from the left to their value while the percentage counts alongside. Staggering the bars lets the eye read each one; ending at different times makes the differences obvious.',
    good: ['Comparisons and rankings', 'Goal progress (savings, fundraising)', 'Skill or feature breakdowns'],
    avoid: 'Bars that fill at a constant speed regardless of value — let the bigger value take a little longer.',
    anatomy: ['Scene time', 'Four bars + percentages', 'scaleX 0 → value (origin left); text counts', '0.9–1.3s (by value) · 120ms stagger', 'expo.out', 'Top bar first'],
    tracks: [['b', 'Bars fill ×4 (120ms)', 0.3, 1.2, 'expo.out', { n: 4, each: 0.12 }], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc pad" style="align-items:stretch;gap:5cqmin">${PB.map(([n]) => `<div class="ig-pb"><div class="ig-pb__top"><span>${n}</span><b data-r="pv">0%</b></div><div class="ig-pb__track"><i data-r="pf"></i></div></div>`).join('')}</div>`,
    render(t, c) {
      PB.forEach(([, v], i) => {
        const p = c.st('b', i);
        c.set(c.$$.pf[i], { sx: (p * v) / 100 });
        c.$$.pv[i].textContent = Math.round(p * v) + '%';
      });
    },
    prompt: 'Animate four horizontal progress bars filling from the left to 92%, 76%, 64% and 48%: each bar scales on X from 0 to its value over 1.2s with an expo-out ease while its percentage label counts up in sync, staggered 120ms top to bottom.',
  });

  /* 03 Circular progress */
  demo({
    id: 'circular-progress', cat: CAT, name: 'Circular Progress', aka: ['Progress ring', 'Radial gauge', 'Donut gauge'],
    tags: D.concat('ui'), char: ['Clean', 'Tech', 'Health'],
    what: 'A ring fills clockwise from the top while the value counts in the centre. Rings are compact and work well in 9:16, especially for goals and completion.',
    good: ['Goals, completion and scores', 'Health and fitness stats', 'App UI (storage, budget used)'],
    avoid: 'Comparing several values with rings — bars are easier to compare.',
    anatomy: ['Scene time', 'SVG ring + centre value', 'stroke-dasharray length 0 → value (pathLength = 1)', '1.6s', 'expo.out', 'Track appears → fill + count → caption'],
    tracks: [['track', 'Ring track', 0.2, 0.4, 'out'], ['fill', 'Fill to 72%', '>-0.1', 1.6, 'expo.out'], ['cap', 'Caption', '-=0.5', 0.6, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-green',
    html: `<div class="stackc" style="gap:5cqmin"><div style="position:relative;width:62cqmin;height:62cqmin"><svg viewBox="0 0 100 100" class="ig-ring">
      <circle data-r="track" cx="50" cy="50" r="42" class="ig-ring__track"/><circle data-r="fill" cx="50" cy="50" r="42" class="ig-ring__fill" pathLength="1" stroke-dasharray="0 1"/></svg>
      <div class="center"><div class="col"><b data-r="num" class="t-sans" style="font-size:14cqmin">0%</b><span class="t-eyebrow">of goal</span></div></div></div>
      <span data-r="cap" class="t-body" style="font-size:3.6cqmin">Rp 7,2 jt saved of Rp 10 jt</span></div>`,
    render(t, c) {
      c.set(c.$.track, { o: c.p.track });
      c.$.fill.setAttribute('stroke-dasharray', `${(0.72 * c.p.fill).toFixed(4)} 1`);
      c.$.num.textContent = Math.round(72 * c.p.fill) + '%';
      c.set(c.$.cap, { o: c.p.cap, y: 3 * (1 - c.p.cap) });
    },
    prompt: 'Animate a circular progress ring to 72%: fade the grey track in, then grow the coloured arc clockwise from 12 o’clock (stroke-dasharray with pathLength="1", rotated −90°) over 1.6s with an expo-out ease while the centre percentage counts up in sync. Fade the caption in as it lands.',
  });

  /* 04 Bar chart */
  const BARS = [42, 58, 51, 74, 66, 92];
  demo({
    id: 'bar-chart', cat: CAT, name: 'Bar Chart Animation', aka: ['Column chart grow', 'Bars rising', 'Histogram build'],
    tags: D, char: ['Clean', 'Data', 'Corporate'],
    what: 'Gridlines and the baseline appear first, then columns grow up from the baseline one after another, and the last (highlighted) bar gets its value label. Growing from a shared baseline keeps the comparison honest.',
    good: ['Growth over time (monthly revenue, users)', 'Reports and investor content', 'Before/after comparisons'],
    avoid: 'Bars growing from different directions or with bounce — it distorts how the values compare.',
    anatomy: ['Scene time', 'Grid, six columns, highlight label', 'scaleY 0 → 1 (origin bottom)', 'Grid 0.4s · bars 0.8s @90ms · label 0.4s', 'expo.out', 'Grid → bars left to right → highlight'],
    tracks: [['grid', 'Grid + baseline', 0.2, 0.4, 'out', 'bg'], ['b', 'Bars ×6 (90ms)', '>-0.1', 0.8, 'expo.out', { n: 6, each: 0.09 }], ['lab', 'Highlight label', '-=0.2', 0.45, 'back.soft'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-navy',
    html: `<div class="ig-chart"><span class="t-eyebrow ig-chart__title">Monthly active users</span><div data-r="grid" class="ig-grid"><i></i><i></i><i></i><i></i></div>
      <div class="ig-bars">${BARS.map((v, i) => `<div class="ig-bar${i === 5 ? ' ig-bar--hi' : ''}"><i data-r="bar" style="height:${v}%"></i><span>${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span></div>`).join('')}</div>
      <span data-r="lab" class="badge ig-hi-label">+39%</span></div>`,
    render(t, c) {
      c.set(c.$.grid, { o: c.p.grid });
      c.$$.bar.forEach((el, i) => c.set(el, { sy: c.st('b', i) }));
      c.set(c.$.lab, { s: c.p.lab, o: clamp(c.r.lab * 3) });
    },
    prompt: 'Animate a column chart: fade in gridlines and the baseline first, then grow six bars up from the baseline (scaleY 0 → 1, origin bottom) left to right with a 90ms stagger, each over 800ms with an expo-out ease. Highlight the last bar in the accent colour and pop its “+39%” label in after it lands.',
  });

  /* 05 Line chart */
  const LP = [[0, 70], [16, 62], [32, 66], [48, 44], [64, 50], [80, 28], [100, 18]];
  demo({
    id: 'line-chart', cat: CAT, name: 'Line Chart Draw', aka: ['Line draw', 'Trend line', 'Sparkline draw'],
    tags: D, char: ['Clean', 'Technical', 'Data'],
    what: 'The trend line draws itself from left to right like a pen, with data points popping as the line reaches them. Drawing in time order matches how people read time series: the story unfolds.',
    good: ['Trends, growth, performance over time', 'Stock / crypto style visuals (generic data)', 'Explainers about change'],
    avoid: 'Drawing several lines simultaneously at the same speed — highlight one, fade the rest.',
    anatomy: ['Scene time', 'Grid, line path, points, end label', 'stroke-dashoffset 1 → 0; points scale when the line passes', '1.8s', 'inOut (cubic)', 'Grid → line draws → points pop in passing → end label'],
    tracks: [['grid', 'Grid', 0.2, 0.4, 'out', 'bg'], ['draw', 'Line draws', '>-0.1', 1.8, 'inOut', 'object'], ['end', 'End label', '-=0.1', 0.45, 'back.soft'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="ig-chart"><span class="t-eyebrow ig-chart__title">Portfolio value · 6 months</span><div data-r="grid" class="ig-grid"><i></i><i></i><i></i><i></i></div>
      <div class="ig-plot"><svg data-r="lsvg" preserveAspectRatio="none"><path data-r="line" class="ig-lpath" pathLength="1" stroke-dasharray="1 1"/></svg>
      ${LP.map(([x, y]) => `<i data-r="pt" class="ig-pt" style="left:${x}%;top:${y}%"></i>`).join('')}<span data-r="end" class="badge ig-end" style="left:100%;top:${LP[6][1]}%">+42%</span></div></div>`,
    resize(c) { c.data.fit = fitSvg(c.$.lsvg, [[c.$.line, LP]]); },
    render(t, c) {
      if (!c.data.fit) this.resize(c);
      c.set(c.$.grid, { o: c.p.grid });
      c.set(c.$.line, { dash: 1 - c.p.draw });
      c.$$.pt.forEach((el, i) => { const at = LP[i][0] / 100; const k = clamp((c.p.draw - at) * 8 + 0.1); c.set(el, { s: ease('back.out')(k), o: k > 0 ? 1 : 0 }); });
      c.set(c.$.end, { s: c.p.end, o: clamp(c.r.end * 3) });
    },
    prompt: 'Draw a line chart: fade the grid in, then draw the trend line from left to right (stroke-dashoffset 1 → 0 with pathLength="1") over 1.8s with a cubic in-out ease; pop each data point (back-out) at the moment the line reaches it. Finish with a “+42%” label at the end of the line.',
  });

  /* 06 Area chart */
  const AP = [[0, 78], [14, 70], [28, 72], [42, 55], [56, 58], [70, 40], [84, 34], [100, 22]];
  demo({
    id: 'area-chart', cat: CAT, name: 'Area Chart Reveal', aka: ['Area fill', 'Wipe-on chart', 'Gradient area'],
    tags: D, char: ['Premium', 'Data', 'Smooth'],
    what: 'A filled area is revealed from left to right by a moving clip edge, with its top line and a vertical cursor travelling at the front. The gradient fill shows volume; the cursor shows “now”.',
    good: ['Volume over time (traffic, savings, energy)', 'Premium dashboards in ads', 'Cumulative growth stories'],
    avoid: 'Overlapping areas with similar colours — they become unreadable.',
    anatomy: ['Scene time', 'Area path, top line, cursor', 'clip-path inset right 100% → 0; cursor translateX', '2s', 'smooth', 'Reveal left → right, cursor leads'],
    tracks: [['rev', 'Area reveal', 0.3, 2, 'smooth', 'object'], ['tag', 'Value tag', '-=0.2', 0.45, 'back.soft'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-wine',
    html: `<div class="ig-chart"><span class="t-eyebrow ig-chart__title">Total saved</span><div class="ig-plot"><svg data-r="area" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id="ig-ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a62" stop-opacity=".75"/><stop offset="1" stop-color="#ff7a62" stop-opacity="0"/></linearGradient></defs>
      <path d="M${AP.map((p) => p.join(' ')).join(' L')} L100 100 L0 100 Z" fill="url(#ig-ag)"/><path d="M${AP.map((p) => p.join(' ')).join(' L')}" fill="none" stroke="#ffd7cc" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
      <i data-r="cur" class="ig-cursor"></i><span data-r="tag" class="badge badge--light ig-end" style="left:100%;top:22%">Rp 18,4 jt</span></div></div>`,
    render(t, c) {
      c.set(c.$.area, { clip: `inset(0 ${100 - c.p.rev * 100}% 0 0)` });
      c.$.cur.style.left = c.p.rev * 100 + '%';
      c.set(c.$.cur, { o: c.r.rev > 0 && c.r.rev < 1 ? 1 : 0 });
      c.set(c.$.tag, { s: c.p.tag, o: clamp(c.r.tag * 3) });
    },
    prompt: 'Reveal an area chart from left to right: clip the filled area and its top line with clip-path inset(0 X% 0 0), animating X from 100% to 0 over 2s with a smooth in-out ease, while a thin vertical cursor travels at the reveal edge. Pop the final value tag at the end.',
  });

  /* 07 Donut */
  const DN = [[0.42, '#ef4b36', 'Needs'], [0.28, '#f2c14e', 'Wants'], [0.2, '#7fd1b0', 'Savings'], [0.1, '#8fb3ff', 'Giving']];
  demo({
    id: 'donut-chart', cat: CAT, name: 'Donut Chart', aka: ['Pie chart', 'Segment draw', 'Ring chart'],
    tags: D, char: ['Clean', 'Explanatory', 'Data'],
    what: 'Each segment of the donut draws in sequence, continuing from where the previous one ended, and its legend row appears in sync. Sequencing turns a static breakdown into a short explanation.',
    good: ['Budgets and allocation', 'Survey results and market share', 'Composition of a whole (max ~5 segments)'],
    avoid: 'More than 5–6 segments or near-equal values — use a bar chart instead.',
    anatomy: ['Scene time', 'Four arcs + legend', 'Each arc dasharray 0 → share, offset by the previous total', '0.55s per segment', 'inOut', 'Segment + legend row, one after another'],
    tracks: [['s', 'Segments ×4', 0.3, 0.55, 'inOut', { n: 4, each: 0.5 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-coal',
    html: `<div class="stackc" style="gap:6cqmin"><div style="position:relative;width:56cqmin;height:56cqmin"><svg viewBox="0 0 100 100" class="ig-donut">${DN.map(([, col]) => `<circle data-r="seg" cx="50" cy="50" r="38" stroke="${col}" pathLength="1" stroke-dasharray="0 1"/>`).join('')}</svg>
      <div class="center"><div class="col"><b class="t-sans" style="font-size:8cqmin">50/30/20</b><span class="t-eyebrow">budget rule+</span></div></div></div>
      <div class="ig-legend">${DN.map(([v, col, n]) => `<span data-r="lg"><i style="background:${col}"></i>${n}<b>${Math.round(v * 100)}%</b></span>`).join('')}</div></div>`,
    render(t, c) {
      let acc = 0;
      DN.forEach(([v], i) => {
        const p = c.st('s', i);
        const el = c.$$.seg[i];
        el.setAttribute('stroke-dasharray', `${(v * p).toFixed(4)} 1`);
        el.setAttribute('stroke-dashoffset', (-acc).toFixed(4));
        acc += v;
        c.set(c.$$.lg[i], { o: p, x: -2 * (1 - p) });
      });
    },
    prompt: 'Animate a donut chart segment by segment: each arc draws from 0 to its share of the circle (stroke-dasharray with pathLength="1"), starting where the previous segment ended (negative stroke-dashoffset = sum of previous shares), 0.55s each with a cubic in-out ease, 0.5s apart. Reveal the matching legend row as each segment draws.',
  });

  /* 08 Comparison bars */
  demo({
    id: 'comparison-bars', cat: CAT, name: 'Comparison Bars', aka: ['Us vs them', 'Head-to-head bars', 'Versus chart'],
    tags: D.concat('social'), char: ['Persuasive', 'Clear', 'Promo'],
    what: 'Two bars grow side by side — the competitor first, then ours — and the difference is called out at the end. Growing them in sequence builds a small story: setup, then payoff.',
    good: ['Pricing and fee comparisons (generic)', 'Speed, savings, performance claims', 'Ads with a clear advantage'],
    avoid: 'Truncated axes or exaggerated scales — keep comparisons honest and sourced.',
    anatomy: ['Scene time', 'Two bars + values + difference badge', 'scaleX 0 → value; values count', 'Other 0.9s · ours 0.9s · badge 0.4s', 'expo.out / back.soft', 'Them → us → difference'],
    tracks: [['a', 'Typical bank', 0.3, 0.9, 'expo.out', 'object'], ['b', 'Our app', '>-0.2', 0.9, 'expo.out', 'object'], ['diff', 'Difference badge', '>-0.1', 0.45, 'back.soft'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc pad" style="align-items:stretch;gap:6cqmin"><b class="t-sans" style="font-size:7cqmin">Transfer fee per month</b>
      <div class="ig-vs"><span>Typical bank</span><div class="ig-vs__track"><i data-r="ba" style="background:#a9a39a"></i></div><b data-r="va">Rp 0</b></div>
      <div class="ig-vs"><span>Our app</span><div class="ig-vs__track"><i data-r="bb" style="background:#ef4b36"></i></div><b data-r="vb">Rp 0</b></div>
      <span data-r="diff" class="badge badge--dark" style="align-self:flex-start">Save Rp 117.500 / month</span></div>`,
    render(t, c) {
      c.set(c.$.ba, { sx: c.p.a });
      c.set(c.$.bb, { sx: 0.06 * c.p.b });
      c.$.va.textContent = 'Rp ' + Math.round(125000 * c.p.a).toLocaleString('id-ID');
      c.$.vb.textContent = 'Rp ' + Math.round(7500 * c.p.b).toLocaleString('id-ID');
      c.set(c.$.diff, { s: c.p.diff, o: clamp(c.r.diff * 3) });
    },
    prompt: 'Compare two values with horizontal bars: grow the competitor bar first (scaleX 0 → 1, 900ms, expo-out) with its value counting, then our much shorter bar 0.2s before the first finishes, then pop a dark badge stating the difference. Keep the scale honest — both bars share the same axis.',
  });

  /* 09 Before / after number */
  demo({
    id: 'before-after-number', cat: CAT, name: 'Before / After Number', aka: ['Value change', 'Old vs new number', 'Transformation stat'],
    tags: D.concat('social'), char: ['Persuasive', 'Clear', 'Bold'],
    what: 'The “before” number appears, gets struck through and dims, an arrow points down, and the “after” number lands larger in the accent colour. The motion makes the improvement feel like an event.',
    good: ['Time saved, cost reduced, speed improved', 'Product benefit hooks', 'Case-study results'],
    avoid: 'Unverifiable claims; always pair with a real basis.',
    anatomy: ['Scene time', 'Before value, strike line, arrow, after value', 'Strike scaleX; before dims; arrow draw; after scale 1.3 → 1', 'Before 0.5s · strike 0.4s · after 0.5s', 'premium / expo.out / back.soft', 'Before → strike → arrow → after'],
    tracks: [['before', 'Before value', 0.3, 0.5, 'premium'], ['strike', 'Strike', '+=0.3', 0.4, 'expo.out', 'fx'], ['arrow', 'Arrow', '-=0.1', 0.35, 'out', 'object'], ['after', 'After value', '>-0.1', 0.5, 'back.soft'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="stackc" style="gap:3cqmin"><span class="t-eyebrow">Monthly report time</span>
      <div data-r="before" class="ig-ba-before t-sans"><span>45 min</span><i data-r="strike"></i></div>
      <svg class="ig-ba-arrow" viewBox="0 0 24 24"><path data-r="arrow" d="M12 3v16M6 13l6 6 6-6" pathLength="1" stroke-dasharray="1 1"/></svg>
      <b data-r="after" class="t-display ig-ba-after">5 min</b></div>`,
    render(t, c) {
      c.set(c.$.before, { o: c.p.before * (1 - 0.55 * c.p.strike), y: 3 * (1 - c.p.before) });
      c.set(c.$.strike, { sx: c.p.strike });
      c.set(c.$.arrow, { dash: 1 - c.p.arrow });
      c.set(c.$.after, { s: lerp(1.35, 1, c.p.after), o: clamp(c.r.after * 3) });
    },
    prompt: 'Show a before/after number: fade up the old value (“45 min”), then strike it through with a line that scales in from the left (400ms, expo-out) while the value dims to ~45%. Draw a down arrow, then land the new value (“5 min”) larger, in the accent colour, from scale 1.35 to 1 with a soft back-out.',
  });

  /* 10 Stat cards */
  const SC = [['users', '2.4M', 'Active users', 2.4, 'M'], ['star', '4.9', 'App rating', 4.9, ''], ['shield', '99.9%', 'Uptime', 99.9, '%']];
  demo({
    id: 'stat-cards', cat: CAT, name: 'Statistic Cards', aka: ['KPI cards', 'Number tiles', 'Stats grid'],
    tags: D.concat('ui'), char: ['Clean', 'Corporate', 'Trustworthy'],
    what: 'Three stat cards rise in one after another, and each number counts up after its card lands. Card first, number second — the container sets the stage, the value delivers the message.',
    good: ['Trust and social-proof sections', 'Company or campaign results', 'End-of-year recap posts'],
    avoid: 'More than 3–4 numbers in one frame on mobile.',
    anatomy: ['Scene time', 'Three cards with icon, value, label', 'Card translateY + opacity; value counts', 'Cards 0.6s @150ms · counts 1s', 'premium / expo.out', 'Card lands → its number counts'],
    tracks: [['c', 'Cards ×3 (150ms)', 0.3, 0.6, 'premium', { n: 3, each: 0.15 }], ['n', 'Counts ×3 (150ms)', '<0.35', 1, 'expo.out', { n: 3, each: 0.15 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-grid',
    html: `<div class="stackc pad" style="gap:3.4cqmin">${SC.map(([ic, , l]) => `<div data-r="card" class="ig-stat"><i>${A.icon(ic === 'users' ? 'user' : ic)}</i><div><b data-r="v">0</b><span>${l}</span></div></div>`).join('')}</div>`,
    render(t, c) {
      SC.forEach(([, , , to, suf], i) => {
        const p = c.st('c', i), n = c.st('n', i);
        c.set(c.$$.card[i], { y: 6 * (1 - p), o: p });
        c.$$.v[i].textContent = fmt(to * n, to % 1 ? 1 : 0) + suf;
      });
    },
    prompt: 'Animate three KPI cards: each card fades in and rises 6% over 600ms (premium ease), 150ms apart; 350ms after each card starts, its number counts up to the final value over 1s with an expo-out ease (keep decimals and units). Hold the finished grid for at least 1s.',
  });

  /* 11 Icon + number stagger */
  const IN = [['leaf', '12k', 'trees planted'], ['bolt', '38%', 'less energy'], ['heart', '4.2k', 'donations'], ['pin', '27', 'cities']];
  demo({
    id: 'icon-number', cat: CAT, name: 'Icon + Number Stagger', aka: ['Icon stats', 'Impact grid', 'Pictogram numbers'],
    tags: D, char: ['Friendly', 'Clear', 'Impact'],
    what: 'Each icon pops in first, then its number and label slide out beside it, in a 2×2 grid that cascades diagonally. Icons give instant meaning; numbers give scale.',
    good: ['Impact reports (sustainability, social good)', 'Feature summaries', 'Year-in-review content'],
    avoid: 'Decorative icons that do not match their stat — they slow comprehension.',
    anatomy: ['Scene time', 'Four icon + number pairs', 'Icon scale 0 → 1; text translateX + opacity', 'Icon 0.45s · text 0.5s · 140ms stagger', 'back.out / premium', 'Diagonal cascade, icon before text'],
    tracks: [['ic', 'Icons ×4 (140ms)', 0.3, 0.45, 'back.out', { n: 4, each: 0.14 }], ['tx', 'Numbers ×4 (140ms)', '<0.18', 0.5, 'premium', { n: 4, each: 0.14 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-green',
    html: `<div class="stackc pad"><b class="t-serif" style="font-size:9cqmin;margin-bottom:6cqmin">2026 <i>impact</i></b><div class="ig-icgrid">${IN.map(([ic, n, l]) => `<div><i data-r="ic">${A.icon(ic)}</i><div data-r="tx"><b>${n}</b><span>${l}</span></div></div>`).join('')}</div></div>`,
    render(t, c) {
      c.$$.ic.forEach((el, i) => { const p = c.st('ic', i); c.set(el, { s: p, o: clamp(p * 3) }); });
      c.$$.tx.forEach((el, i) => { const p = c.st('tx', i); c.set(el, { x: -4 * (1 - p), o: p }); });
    },
    prompt: 'Build an impact grid of four icon + number pairs: each icon pops from scale 0 with a back-out ease (450ms), then 180ms later its number and label slide in from the left; cascade the four pairs 140ms apart in reading order.',
  });

  /* 12 Timeline */
  const TL = [['2019', 'Founded'], ['2021', '1M users'], ['2023', 'Regional'], ['2026', 'Today']];
  demo({
    id: 'timeline-animation', cat: CAT, name: 'Timeline Animation', aka: ['Milestones', 'History line', 'Roadmap'],
    tags: D, char: ['Storytelling', 'Corporate', 'Clear'],
    what: 'A vertical line grows down the frame and each milestone appears exactly when the line reaches it: the dot pops, the year and label slide in. The line is a progress bar through time.',
    good: ['Company history and milestones', 'Product roadmaps', 'Process timelines'],
    avoid: 'Too many milestones for the frame — keep 3–5 in 9:16.',
    anatomy: ['Scene time', 'Line + four milestones', 'Line scaleY 0 → 1; each node pops when the line passes it', '2.4s line', 'linear line · back.out nodes', 'Line grows → nodes in sync'],
    tracks: [['line', 'Line grows', 0.3, 2.4, 'smooth', 'object'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-ink',
    html: `<div class="ig-tl"><i class="ig-tl__rail"></i><i data-r="line" class="ig-tl__line"></i>${TL.map(([y, l], i) => `<div class="ig-tl__node" style="top:${8 + i * 28}%"><i data-r="dot"></i><div data-r="lab"><b>${y}</b><span>${l}</span></div></div>`).join('')}</div>`,
    render(t, c) {
      const p = c.p.line;
      c.set(c.$.line, { sy: p });
      TL.forEach((_, i) => {
        const at = (8 + i * 28) / 92;
        const k = clamp((p - at) * 7 + 0.15);
        c.set(c.$$.dot[i], { s: ease('back.out')(k) });
        c.set(c.$$.lab[i], { o: k, x: -4 * (1 - ease('premium')(k)) });
      });
    },
    prompt: 'Animate a vertical timeline: grow the line from the top (scaleY 0 → 1) over 2.4s with a smooth ease; as the line passes each milestone, pop its dot (back-out) and slide the year and label in from the left. Keep milestones evenly spaced.',
  });

  /* 13 Steps */
  const ST = ['Download', 'Verify ID', 'Top up', 'Start saving'];
  demo({
    id: 'step-process', cat: CAT, name: 'Step-by-Step Process', aka: ['How it works', '01-02-03-04', 'Process steps'],
    tags: D.concat('ui'), char: ['Explanatory', 'Clear', 'Friendly'],
    what: 'Numbered steps are all visible but dimmed; an active highlight moves from 01 to 04 while a progress line fills between them. Viewers see the whole process and where they are in it.',
    good: ['“How it works” explainers', 'Onboarding and sign-up flows', 'Recipes and tutorials'],
    avoid: 'Long text per step; one short verb phrase each.',
    anatomy: ['Scene time', 'Four steps + progress line', 'Active step scale + colour; line scaleY to the active step', '0.4s per activation · 0.75s apart', 'expo.out', '01 → 02 → 03 → 04'],
    tracks: [['s', 'Activate ×4 (750ms)', 0.4, 0.4, 'expo.out', { n: 4, each: 0.75 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="ig-steps"><i class="ig-steps__rail"></i><i data-r="fill" class="ig-steps__fill"></i>${ST.map((s, i) => `<div data-r="st" class="ig-step"><b>0${i + 1}</b><span>${s}</span></div>`).join('')}</div>`,
    render(t, c) {
      let active = -1;
      ST.forEach((_, i) => {
        const p = c.st('s', i);
        if (p > 0) active = i;
        c.$$.st[i].classList.toggle('on', p > 0);
        c.set(c.$$.st[i], { s: lerp(1, 1.06, p) - (i < ST.length - 1 ? 0.06 * c.st('s', i + 1) : 0), o: lerp(0.45, 1, p) });
      });
      const prog = ST.reduce((a, _, i) => a + (i ? c.st('s', i) : 0), 0) / (ST.length - 1);
      c.set(c.$.fill, { sy: prog });
    },
    prompt: 'Show a four-step process (01–04) with all steps visible but dimmed. Every 750ms activate the next step: brighten it, scale it up slightly, fill its number badge with the accent colour, and grow a progress line from the previous step to it (expo-out, 400ms).',
  });

  /* 14 Map pins */
  const PINS = [[30, 38, 'Jakarta'], [56, 52, 'Bandung'], [74, 30, 'Semarang']];
  demo({
    id: 'map-pins', cat: CAT, name: 'Map Pin Animation', aka: ['Location drop', 'Pin drop', 'Store locator'],
    tags: D.concat('ui'), char: ['Friendly', 'Clear', 'Local'],
    what: 'Pins drop onto a stylised map with a small bounce, each followed by a pulse ring, then a dashed route connects them. Drops are staggered so each location registers.',
    good: ['New store / branch openings', 'Delivery coverage and logistics', 'Travel routes and events'],
    avoid: 'Detailed real maps behind fast pins — keep maps simplified so pins stay readable.',
    anatomy: ['Scene time', 'Map, three pins, pulses, route', 'Pin translateY −30% → 0 (bounce); pulse ring scale + fade; route draw', 'Pin 0.6s @300ms · route 1s', 'bounce.out / expo.out / inOut', 'Pins drop → pulse → route connects'],
    tracks: [['p', 'Pins drop ×3 (300ms)', 0.3, 0.6, 'bounce.out', { n: 3, each: 0.3 }], ['route', 'Route draws', '>', 1, 'inOut', 'object'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="ig-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" class="fill"><path d="M-5 60 C 20 40, 30 75, 55 62 S 90 30, 105 46 L105 105 L-5 105Z" fill="#e3dccd"/><path d="M-5 20 C 15 30, 40 10, 60 18 S 90 8, 105 14" fill="none" stroke="#cfe0e8" stroke-width="5" vector-effect="non-scaling-stroke"/>
</svg>
      <svg data-r="rsvg" class="fill" preserveAspectRatio="none"><path data-r="route" fill="none" stroke="#ef4b36" stroke-width="2.5" stroke-dasharray="1 1" pathLength="1"/></svg>
      ${PINS.map(([x, y, n]) => `<div class="ig-pin" style="left:${x}%;top:${y}%"><i data-r="ring" class="ig-pin__ring"></i><div data-r="pin" class="ig-pin__body">${A.icon('pin', { sw: 2 })}</div><span data-r="pn">${n}</span></div>`).join('')}</div>`,
    resize(c) { c.data.fit = fitSvg(c.$.rsvg, [[c.$.route, PINS]]); },
    render(t, c) {
      if (!c.data.fit) this.resize(c);
      PINS.forEach((_, i) => {
        const p = c.st('p', i), raw = c.st('p', i, 'linear');
        c.set(c.$$.pin[i], { yp: -160 * (1 - p), o: raw > 0 ? 1 : 0 });
        const pr = clamp((raw - 0.55) / 0.45);
        c.set(c.$$.ring[i], { s: lerp(0.3, 2.6, pr), o: pr > 0 && pr < 1 ? 1 - pr : 0 });
        c.set(c.$$.pn[i], { o: clamp((raw - 0.6) * 3) });
      });
      c.set(c.$.route, { dash: 1 - c.p.route });
    },
    prompt: 'Drop three location pins onto a simplified map one after another (300ms apart): each falls a short distance with a bounce-out ease (600ms) and emits a pulse ring that scales up and fades on landing; then draw a dashed route connecting the pins (1s, in-out) and fade in the city labels.',
  });

  /* 15 Flow diagram */
  const FD = [[18, 'Order'], [50, 'Payment'], [82, 'Delivery']];
  demo({
    id: 'flow-diagram', cat: CAT, name: 'Flow Diagram', aka: ['Process flow', 'Pipeline', 'System diagram'],
    tags: D.concat('advanced'), char: ['Technical', 'Clear', 'Explanatory'],
    what: 'Boxes appear one by one, connectors draw between them, and then small packets travel along the connectors to show data or goods moving through the system. Motion shows direction and flow that a static diagram cannot.',
    good: ['Explaining how a system or service works', 'Fintech and logistics explainers', 'Tech product architecture'],
    avoid: 'Diagrams with many crossing lines — simplify before animating.',
    anatomy: ['Scene time', 'Three nodes, two connectors, packets', 'Nodes scale; connectors scaleY; packets translate along connectors (loop)', 'Nodes 0.45s @350ms · connectors 0.35s · packets 1.2s loop', 'back.out / out / linear', 'Node → connector → node … then packets flow'],
    tracks: [['n', 'Nodes ×3 (350ms)', 0.2, 0.45, 'back.out', { n: 3, each: 0.35 }], ['l1', 'Connector 1', 0.55, 0.35, 'out', 'object'], ['l2', 'Connector 2', 0.9, 0.35, 'out', 'object'], ['flow', 'Packets flow', 1.4, 2.6, 'linear', 'fx']],
    cls: 'bg-navy',
    html: `<div class="ig-flow">${FD.map(([y, l], i) => `<div data-r="node" class="ig-node" style="top:${y}%"><i>${A.icon(['cart', 'card', 'send'][i])}</i><b>${l}</b></div>`).join('')}
      <i data-r="con" class="ig-con" style="top:26%;height:16%"></i><i data-r="con" class="ig-con" style="top:58%;height:16%"></i>
      ${[0, 1, 2, 3].map(() => '<i data-r="pk" class="ig-packet"></i>').join('')}</div>`,
    render(t, c) {
      c.$$.node.forEach((el, i) => { const p = c.st('n', i); c.set(el, { s: p, o: clamp(p * 3) }); });
      c.set(c.$$.con[0], { sy: c.p.l1 }); c.set(c.$$.con[1], { sy: c.p.l2 });
      const ft = t - c.tl.map.flow.start;
      c.$$.pk.forEach((el, i) => {
        const u = ((ft / 1.2 + i / 4) % 1 + 1) % 1;
        const seg = u < 0.5 ? 0 : 1, k = (u % 0.5) * 2;
        const y = seg === 0 ? lerp(26, 42, k) : lerp(58, 74, k);
        el.style.top = y + '%';
        c.set(el, { o: ft > 0 ? bump(k) : 0 });
      });
    },
    prompt: 'Animate a three-step flow diagram: pop each node in (back-out, 450ms, 350ms apart), draw the connector to the next node as soon as the previous node lands, then loop small glowing packets travelling down the connectors (1.2s per trip, linear, fading in and out at the ends) to show the flow.',
  });

  /* 16 Connecting lines */
  const NODES = (() => { const r = rng(21); return Array.from({ length: 11 }, () => [lerp(10, 90, r()), lerp(14, 86, r())]); })();
  const EDGES = (() => {
    const e = [];
    NODES.forEach((a, i) => NODES.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 30) e.push([i, j]); }));
    return e;
  })();
  demo({
    id: 'connecting-lines', cat: CAT, name: 'Connecting Lines', aka: ['Network graph', 'Constellation', 'Node links'],
    tags: D.concat('advanced'), char: ['Tech', 'Abstract', 'Connected'],
    what: 'Nodes appear across the frame and lines grow between nearby nodes, building a network — a visual metaphor for connection, community or infrastructure. Lines draw from one node toward the other.',
    good: ['Community, network and platform stories', 'Tech and AI backgrounds', 'Partnership and ecosystem visuals'],
    avoid: 'Too many lines — prune to nearby connections so the structure stays legible.',
    anatomy: ['Scene time', '11 nodes, edges between nearby nodes', 'Node scale; edge stroke-dashoffset (draw); hub glow', 'Nodes 0.4s @70ms · edges 0.5s @40ms', 'back.out / inOut', 'Nodes appear → links grow'],
    tracks: [['n', 'Nodes ×11', 0.2, 0.4, 'back.out', { n: 11, each: 0.07 }], ['e', 'Links ×' + EDGES.length, 0.7, 0.5, 'inOut', { n: EDGES.length, each: 0.04 }], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-night',
    html: `<svg data-r="esvg" class="fill" preserveAspectRatio="none">${EDGES.map(() => `<path data-r="edge" class="ig-edge" pathLength="1" stroke-dasharray="1 1"/>`).join('')}</svg>
      ${NODES.map(([x, y], i) => `<i data-r="nd" class="ig-nd${i === 4 ? ' ig-nd--hub' : ''}" style="left:${x}%;top:${y}%"></i>`).join('')}`,
    resize(c) { c.data.fit = fitSvg(c.$.esvg, EDGES.map(([i, j], k) => [c.$$.edge[k], [NODES[i], NODES[j]]])); },
    render(t, c) {
      if (!c.data.fit) this.resize(c);
      c.$$.nd.forEach((el, i) => c.set(el, { s: c.st('n', i) }));
      c.$$.edge.forEach((el, i) => c.set(el, { dash: 1 - c.st('e', i) }));
    },
    prompt: 'Build a network animation: scatter ~11 nodes (seeded positions), pop them in one by one (back-out, 70ms stagger), then draw lines between nodes closer than a threshold distance, each line drawing from one node to the other (stroke-dashoffset 1 → 0, 500ms, 40ms stagger). Give one hub node a soft glow.',
  });

  /* 17 Data pulse */
  demo({
    id: 'data-pulse', cat: CAT, name: 'Data Pulse', aka: ['Live data', 'Heartbeat line', 'Real-time ticker'],
    tags: D.concat('ui'), char: ['Tech', 'Live', 'Loop'],
    what: 'A live signal scrolls across the frame like a heart monitor while a value updates and a “live” dot pulses. The constant, rhythmic movement says “real time” without any text.',
    good: ['Live dashboards and monitoring', 'Health, fintech and analytics apps', 'Background for “real-time” claims'],
    avoid: 'Using pulse animations for static data — it implies something live that is not.',
    anatomy: ['Continuous loop', 'Signal line, value, live dot', 'Line path regenerated from time; dot scale pulse; value steps', '3s loop (beat every 0.75s)', 'linear', 'Seamless loop'],
    tracks: [['loop', 'Signal loop (seamless)', 0, 3, 'linear', 'bg'], ['b1', 'Beat', 0.375, 0, 'linear', 'beat'], ['b2', 'Beat', 1.125, 0, 'linear', 'beat'], ['b3', 'Beat', 1.875, 0, 'linear', 'beat'], ['b4', 'Beat', 2.625, 0, 'linear', 'beat']],
    dur: 3, poster: 1,
    cls: 'bg-ink',
    html: `<div class="ig-pulse-head"><span class="badge"><i class="live-dot" data-r="live"></i>Live</span><b data-r="val" class="t-sans">72 bpm</b></div>
      <svg class="ig-pulse" viewBox="0 0 100 50" preserveAspectRatio="none"><path data-r="sig" fill="none" stroke="#7fd1b0" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="M0 25 H100" stroke="rgba(255,255,255,.08)" vector-effect="non-scaling-stroke"/></svg>`,
    render(t, c) {
      const ph = c.r.loop * 4; // 4 beats per loop
      const beat = (x) => { const u = ((x % 1) + 1) % 1; return u > 0.42 && u < 0.58 ? Math.sin(((u - 0.42) / 0.16) * Math.PI * 2) * (u < 0.5 ? 1 : 0.45) : 0; };
      let d = '';
      for (let i = 0; i <= 100; i++) {
        const x = i / 25 + ph;
        d += (i ? 'L' : 'M') + i + ' ' + (25 - beat(x) * 20).toFixed(2);
      }
      c.$.sig.setAttribute('d', d);
      const u = (c.r.loop * 4) % 1;
      c.set(c.$.live, { s: 1 + 0.6 * Math.max(0, 1 - Math.abs(u - 0.5) * 6) });
      c.$.val.textContent = [72, 74, 73, 71][Math.floor(c.r.loop * 4) % 4] + ' bpm';
    },
    prompt: 'Create a live data pulse: regenerate an ECG-style signal path every frame from a periodic function so it scrolls continuously (4 beats per 3s seamless loop), pulse a “live” dot on each beat, and update the displayed value in small steps. Keep the colours calm (mint on dark).',
  });
})();
