/* 13 — CTA & End Cards
   One clear action, enough hold time to read it, small purposeful motion. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, rng, A } = window.VML;
  const CAT = 'cta';
  const C = ['ui', 'social'];
  const btn = (label = 'Daftar sekarang', cls = '', r = 'btn') => `<span data-r="${r}" class="cta ${cls}">${label} ${A.icon('arrow')}</span>`;

  /* 01 Button entrance */
  demo({
    id: 'cta-entrance', cat: CAT, name: 'CTA Button Entrance', aka: ['Button reveal', 'CTA pop-in', 'Action button in'],
    tags: C, char: ['Clean', 'Clear', 'Confident'],
    what: 'The button grows horizontally from a pill, its label slides up inside it, and the arrow arrives last with a small nudge. Building the button in three small steps makes the eye land on it without any loud effect.',
    good: ['End of ads and explainers', 'App promo endings', 'Any “next step” moment'],
    avoid: 'Animating the CTA so late that it is on screen for less than ~1.5s.',
    anatomy: ['Scene time', 'Button shape, label, arrow', 'Width scaleX 0.3 → 1; label translateY; arrow translateX', 'Shape 0.5s · label 0.4s · arrow 0.35s', 'expo.out / back.out', 'Shape → label → arrow'],
    tracks: [['head', 'Headline', 0.1, 0.5, 'premium'], ['shape', 'Button shape', '>-0.1', 0.5, 'expo.out', 'cta'], ['label', 'Label', '<0.2', 0.4, 'premium', 'cta'], ['arrow', 'Arrow nudge', '>-0.1', 0.35, 'back.out', 'cta'], ['hold', 'Hold', '>', 1.3, 'linear']],
    cls: 'bg-ink',
    html: `<div class="stackc" style="gap:6cqmin"><b data-r="head" class="t-sans" style="font-size:9cqmin;text-align:center">Mulai nabung<br/>hari ini.</b>
      <div data-r="shape" class="cta cta-build"><span data-r="lbl">Daftar sekarang</span><i data-r="arr">${A.icon('arrow')}</i></div></div>`,
    render(t, c) {
      c.set(c.$.head, { o: c.p.head, y: 3 * (1 - c.p.head) });
      c.set(c.$.shape, { sx: lerp(0.3, 1, c.p.shape), o: clamp(c.r.shape * 3) });
      c.set(c.$.lbl, { yp: 120 * (1 - c.p.label), o: c.p.label });
      c.set(c.$.arr, { x: -3 * (1 - c.p.arrow), o: c.p.arrow });
    },
    prompt: 'Build the CTA button in three small steps: the pill shape grows horizontally from 30% to full width (expo-out, 500ms), the label slides up into it from below 200ms later, and the arrow arrives last with a small back-out nudge. Then hold the finished button for at least 1.5s.',
  });

  /* 02 Pulse */
  demo({
    id: 'cta-pulse', cat: CAT, name: 'CTA Pulse', aka: ['Breathing button', 'Attention pulse', 'Heartbeat CTA'],
    tags: C, char: ['Calm', 'Attention', 'Loop'],
    what: 'Once the button is on screen, it breathes: a gentle 4% scale pulse and a ring that expands and fades every 1.4s. It keeps attention on the action without looking desperate.',
    good: ['End cards that hold for several seconds', 'Story ads with a link button', 'Waiting moments in app demos'],
    avoid: 'Fast or large pulses (> 8%) — they feel like an alarm.',
    anatomy: ['Continuous loop', 'Button + ring', 'Button scale 1 → 1.04 → 1; ring scale 1 → 1.35 + fade', '1.4s cycle', 'sine', 'Seamless loop'],
    tracks: [['loop', 'Pulse cycle (×2, seamless)', 0, 2.8, 'linear', 'cta']],
    dur: 2.8, poster: 0.5,
    cls: 'bg-blue',
    html: `<div class="stackc" style="gap:6cqmin"><b class="t-sans" style="font-size:8cqmin;text-align:center">Promo berakhir<br/>Minggu ini</b><div style="position:relative;display:grid;place-items:center"><i data-r="ring" class="cta-ring"></i>${btn('Ambil promo', 'cta--light')}</div></div>`,
    render(t, c) {
      const u = (t % 1.4) / 1.4;
      c.set(c.$.btn, { s: 1 + 0.04 * Math.sin(u * Math.PI * 2) ** 2 });
      c.set(c.$.ring, { s: lerp(1, 1.35, ease('sine.out')(u)), o: 0.7 * (1 - u) });
    },
    prompt: 'Give the CTA a gentle breathing pulse: scale it 1 → 1.04 → 1 on a 1.4s sine loop and emit a thin ring from its outline that scales to 1.35 and fades each cycle. Keep it calm — attention, not alarm.',
  });

  /* 03 Shine */
  demo({
    id: 'cta-shine', cat: CAT, name: 'CTA Shine', aka: ['Button glint', 'Sheen sweep', 'Shimmer button'],
    tags: C, char: ['Premium', 'Polished', 'Subtle'],
    what: 'A diagonal band of light glides across the button every couple of seconds. It suggests “this is clickable and new” with almost no movement, which makes it the most premium CTA accent.',
    good: ['Premium and luxury promos', 'Upgrade / subscribe buttons', 'Gold and gradient buttons'],
    avoid: 'Constant fast shimmer — once every 2–3s is enough.',
    anatomy: ['Loop', 'Button + skewed light band', 'Band translateX −120% → 420%', '0.8s sweep · 1.6s rest', 'smooth', 'Sweep → rest → sweep'],
    tracks: [['s1', 'Shine sweep', 0.4, 0.8, 'smooth', 'fx'], ['s2', 'Shine sweep', '+=1.4', 0.8, 'smooth', 'fx'], ['hold', 'Rest', '>', 0.4, 'linear']],
    cls: 'bg-coal',
    html: `<div class="stackc" style="gap:6cqmin"><b class="t-serif" style="font-size:10cqmin;text-align:center"><i>Go</i> Premium</b><span class="cta cta-gold">Upgrade sekarang ${A.icon('sparkle')}<i data-r="sh" class="shine"></i></span></div>`,
    render(t, c) {
      const p = c.r.s2 > 0 ? c.p.s2 : c.p.s1;
      c.set(c.$.sh, { xp: lerp(-120, 420, p) });
    },
    prompt: 'Add a shine to the CTA: every ~2.2s sweep a skewed white-to-transparent band across the button from left to right over 800ms with a smooth ease, clipped to the button shape (overflow hidden). Rest between sweeps.',
  });

  /* 04 Arrow motion */
  demo({
    id: 'cta-arrow', cat: CAT, name: 'CTA Arrow Motion', aka: ['Arrow nudge', 'Directional hint', 'Arrow bounce'],
    tags: C, char: ['Directional', 'Clear', 'Friendly'],
    what: 'Only the arrow moves: it pulls back slightly (anticipation) and pushes forward, twice, then rests. The motion literally points in the direction of the action — forward.',
    good: ['“Next / continue / learn more” buttons', 'Swipe-right and carousel prompts', 'Subtle CTA emphasis'],
    avoid: 'Moving the whole button — keep the label still and readable.',
    anatomy: ['Loop', 'Arrow icon only', 'translateX −1 → +4 → 0 (anticipation + push)', '0.5s per nudge, ×2 then rest', 'back.out', 'Nudge-nudge-rest'],
    tracks: [['n1', 'Nudge', 0.4, 0.5, 'linear', 'cta'], ['n2', 'Nudge', '>', 0.5, 'linear', 'cta'], ['rest', 'Rest', '>', 1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="stackc" style="gap:6cqmin"><b class="t-sans" style="font-size:8.5cqmin;text-align:center;color:#1a1712">Lihat cara<br/>kerjanya</b><span class="cta cta--dark">Selengkapnya <i data-r="arr" class="cta-arr">${A.icon('arrow')}</i></span></div>`,
    render(t, c) {
      const nud = (r) => (r <= 0 || r >= 1 ? 0 : r < 0.25 ? -1.4 * Math.sin((r / 0.25) * Math.PI / 2) : lerp(-1.4, 0, ease('back.out')((r - 0.25) / 0.75)) + 4 * Math.sin(((r - 0.25) / 0.75) * Math.PI));
      c.set(c.$.arr, { x: nud(c.r.n1) + nud(c.r.n2) });
    },
    prompt: 'Animate only the CTA arrow: pull it back ~1% (anticipation), push it forward ~4% and settle, twice in a row (0.5s each), then rest 1s and repeat. The label never moves.',
  });

  /* 05 Swipe up cue */
  demo({
    id: 'swipe-up', cat: CAT, name: 'Swipe Up Cue', aka: ['Swipe gesture hint', 'Chevron cascade', 'Scroll cue'],
    tags: C, char: ['Directional', 'Native', 'Loop'],
    what: 'Three chevrons light up from bottom to top in a cascade, then the whole stack drifts up and resets. The sequence draws the gesture itself, so it needs almost no words.',
    good: ['Story / Reel link stickers', 'App onboarding hints', '“See more” moments'],
    avoid: 'Placing the cue inside the platform’s bottom UI zone — turn on Safe Zone to check.',
    anatomy: ['Loop', 'Three chevrons + label', 'Opacity cascade bottom → top; group translateY', '0.9s cycle', 'sine', 'Cascade repeats'],
    tracks: [['loop', 'Cascade (seamless)', 0, 2.7, 'linear', 'cta']],
    dur: 2.7, poster: 0.5,
    html: `${A.photo('fabric', { cls: 'fill' })}<div class="stackc" style="justify-content:flex-end;padding-bottom:30cqmin;gap:2cqmin"><div data-r="grp" class="sw-chev">${[0, 1, 2].map(() => `<i data-r="ch">${A.icon('up', { sw: 2.4 })}</i>`).join('')}</div><span class="badge badge--light">Geser ke atas</span></div>`,
    render(t, c) {
      const u = (t % 0.9) / 0.9;
      c.$$.ch.forEach((el, i) => { const k = (u - (2 - i) * 0.2 + 1) % 1; c.set(el, { o: 0.25 + 0.75 * bump(clamp(k * 1.6)) }); });
      c.set(c.$.grp, { y: -2 * Math.sin(u * Math.PI) });
    },
    prompt: 'Create a swipe-up cue: three stacked chevrons light up in a cascade from bottom to top (opacity 0.25 → 1 → 0.25, ~0.2s offsets) on a 0.9s loop while the group drifts up slightly, above a “Geser ke atas” label. Keep it above the bottom UI zone.',
  });

  /* 06 Tap cue */
  demo({
    id: 'tap-cue', cat: CAT, name: 'Tap Cue', aka: ['Hand tap hint', 'Press hint', 'Touch indicator'],
    tags: C, char: ['Friendly', 'Instructive', 'Loop'],
    what: 'A hand icon presses the button: it tilts in, presses (the button squashes), a ripple expands, and the hand lifts. A literal demonstration of the action works for every audience.',
    good: ['Playable / interactive ad endings', 'App store CTAs', 'Tutorials for less tech-savvy audiences'],
    avoid: 'Hands that cover the button label at the moment of the press.',
    anatomy: ['Loop', 'Hand icon, button, ripple', 'Hand translate + rotate in; press scale 0.92; ripple scale + fade', '1.6s cycle', 'back.out / out', 'Approach → press → ripple → lift'],
    tracks: [['in', 'Hand approaches', 0.2, 0.45, 'back.out', 'cta'], ['press', 'Press', '>', 0.18, 'out', 'cta'], ['rip', 'Ripple', '<', 0.6, 'expo.out', 'fx'], ['lift', 'Lift', '>-0.3', 0.4, 'in', 'cta'], ['hold', 'Rest', '>', 0.5, 'linear']],
    cls: 'bg-lilac',
    html: `<div class="center"><div style="position:relative">${btn('Main sekarang', 'cta--dark')}<i data-r="rip" class="tap-rip"></i><span data-r="hand" class="tap-hand">${A.icon('hand', { sw: 1.6 })}</span></div></div>`,
    render(t, c) {
      const pressed = c.r.press > 0 && c.r.lift < 0.2;
      c.set(c.$.hand, { x: lerp(14, 0, c.p.in) + 6 * c.p.lift, y: lerp(14, 0, c.p.in) + 6 * c.p.lift, r: lerp(25, 0, c.p.in), s: pressed ? 0.9 : 1, o: c.p.in * (1 - c.p.lift) });
      c.set(c.$.btn, { s: pressed ? 0.93 : 1 });
      c.set(c.$.rip, { s: lerp(0.4, 1.8, c.p.rip), o: c.r.rip > 0 && c.r.rip < 1 ? 1 - c.p.rip : 0 });
    },
    prompt: 'Demonstrate the tap: a hand icon swings in toward the button (back-out, 450ms), presses (hand scales to 0.9, button to 0.93 for ~180ms), a ripple expands from the press point and fades, and the hand lifts away. Loop with a short rest.',
  });

  /* 07 Download app */
  demo({
    id: 'download-cta', cat: CAT, name: 'Download App CTA', aka: ['App install end card', 'Store badges', 'Get the app'],
    tags: C.concat('brand'), char: ['Product', 'Clear', 'Trustworthy'],
    what: 'The app icon drops in with a spring, the name and rating follow, then two generic store-style buttons slide up. A complete install end card in the order the viewer decides: what → is it good → where.',
    good: ['App install campaigns', 'End of app feature demos', 'Pre-registration ads'],
    avoid: 'Using official store badges incorrectly; follow each store’s badge guidelines in production (generic buttons here).',
    anatomy: ['End card', 'Icon, name, rating, two buttons', 'Icon spring scale; text fade-up; buttons slide stagger', 'Icon 0.6s · text 0.4s · buttons 0.45s @120ms', 'spring / premium / expo.out', 'Icon → name → rating → buttons'],
    tracks: [['icon', 'App icon', 0.1, 0.7, 'spring', 'brand'], ['name', 'Name + rating', '>-0.3', 0.45, 'premium'], ['b', 'Buttons ×2', '>-0.1', 0.45, 'expo.out', { n: 2, each: 0.12, kind: 'cta' }], ['hold', 'Hold', '>', 1.4, 'linear']],
    cls: 'bg-ink',
    html: `<div class="stackc" style="gap:4cqmin"><div data-r="icon" class="dl-icon">${A.logoMark({ sw: 8 })}</div>
      <div data-r="name" class="col" style="gap:1.4cqmin"><b class="t-sans" style="font-size:7cqmin">Wallet</b><span class="t-body" style="font-size:3cqmin">★ 4.9 · 1 jt+ unduhan</span></div>
      <div class="dl-btns"><span data-r="sb" class="dl-btn">${A.icon('play')}<span><small>Download di</small><b>Android</b></span></span><span data-r="sb" class="dl-btn">${A.icon('lock')}<span><small>Download di</small><b>iOS</b></span></span></div></div>`,
    render(t, c) {
      c.set(c.$.icon, { s: c.p.icon, r: lerp(-20, 0, c.p.icon) });
      c.set(c.$.name, { o: c.p.name, y: 3 * (1 - c.p.name) });
      c.$$.sb.forEach((el, i) => { const p = c.st('b', i); c.set(el, { y: 8 * (1 - p), o: p }); });
    },
    prompt: 'Build an app-install end card: the app icon springs in (scale 0 → 1, slight rotation), then the app name and rating fade up, then two store-style download buttons slide up 120ms apart (expo-out). Hold for at least 1.5s. Use official store badges only per their guidelines.',
  });

  /* 08 QR reveal */
  demo({
    id: 'qr-reveal', cat: CAT, name: 'QR Code Reveal', aka: ['Scan me', 'QR build', 'QR scan line'],
    tags: C, char: ['Technical', 'Clear', 'Utility'],
    what: 'The three finder squares land first, the data modules fill in a spreading random order, then a scan line sweeps once to say “scan me”. This placeholder QR encodes nothing — swap in a real, tested code in production.',
    good: ['TV, DOOH and YouTube (viewer has a second device)', 'Event and in-store screens', 'Presentations'],
    avoid: 'Mobile-first social video — the viewer is already on the phone; use a link sticker instead.',
    anatomy: ['End card', 'Finder squares, modules, scan line', 'Finders scale; modules opacity by random delay; scan line translateY', 'Finders 0.4s · modules 0.9s · scan 0.9s', 'back.out / linear / smooth', 'Finders → modules → scan → label'],
    tracks: [['fd', 'Finder squares ×3', 0.2, 0.4, 'back.out', { n: 3, each: 0.1 }], ['mod', 'Modules fill', '>-0.1', 0.9, 'linear'], ['scan', 'Scan line', '>', 0.9, 'smooth', 'fx'], ['lbl', 'Label', '<0.3', 0.4, 'premium'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-paper',
    note: 'Placeholder QR pattern: it does not encode a URL.',
    html: `<div class="stackc" style="gap:5cqmin"><div class="qr-wrap">${A.qr({ seed: 11 })}<i data-r="scan" class="qr-scan"></i></div><div data-r="lbl" class="col" style="gap:1cqmin"><b class="t-sans" style="font-size:6cqmin;color:#16151a">Scan untuk daftar</b><span class="t-eyebrow" style="color:#16151a">placeholder · bukan kode asli</span></div></div>`,
    init(c) { const r = rng(4); c.data.d = c.$$['qr-cell'].map(() => r()); },
    render(t, c) {
      c.$$['qr-finder'].forEach((el, i) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; c.set(el, { s: c.st('fd', i) }); });
      const m = c.r.mod;
      c.$$['qr-cell'].forEach((el, i) => { el.style.opacity = m > c.data.d[i] ? 1 : 0; });
      c.set(c.$.scan, { yp: lerp(0, 1000, c.p.scan) / 10, o: c.r.scan > 0 && c.r.scan < 1 ? 1 : 0 });
      c.set(c.$.lbl, { o: c.p.lbl });
    },
    prompt: 'Reveal a QR code: pop the three finder squares in first (back-out, 100ms apart), then fill the data modules in a seeded random order over 0.9s, then sweep a glowing scan line once from top to bottom. Add a short label. Always test the real code at the final on-screen size.',
  });

  /* 09 URL reveal */
  demo({
    id: 'url-reveal', cat: CAT, name: 'URL Reveal', aka: ['Website end card', 'Link reveal', 'Domain type-on'],
    tags: C.concat('text'), char: ['Clean', 'Clear', 'Corporate'],
    what: 'The domain types itself into a browser-like pill, the path appears in a second colour, and an underline draws to finish. Typing slows the URL down enough to be remembered.',
    good: ['YouTube and long-form endings', 'Podcasts, webinars, events', 'B2B and corporate ads'],
    avoid: 'Long URLs with tracking parameters — use a short, memorable path.',
    anatomy: ['End card', 'Pill, domain text, path, underline', 'Type-on per character; underline scaleX', 'Type 1.1s · underline 0.5s', 'stepped / expo.out', 'Pill → domain → path → underline'],
    tracks: [['pill', 'Pill', 0.1, 0.4, 'back.soft', 'ui'], ['type', 'Type URL', '>', 1.1, 'linear', 'text'], ['line', 'Underline', '>', 0.5, 'expo.out', 'fx'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-navy',
    html: `<div class="stackc" style="gap:5cqmin"><span class="t-eyebrow">Info lengkap</span><div data-r="pill" class="url-pill">${A.icon('lock')}<span><b data-r="dom"></b><em data-r="path"></em></span><i data-r="caret" class="tw-caret"></i></div><i data-r="line" class="url-line"></i></div>`,
    render(t, c) {
      const dom = 'yourbrand.com', path = '/promo';
      const n = Math.floor((dom.length + path.length) * c.p.type);
      c.$.dom.textContent = dom.slice(0, n);
      c.$.path.textContent = n > dom.length ? path.slice(0, n - dom.length) : '';
      c.set(c.$.pill, { s: c.p.pill, o: clamp(c.r.pill * 3) });
      c.set(c.$.caret, { o: c.r.type < 1 || Math.sin(t * 7) > 0 ? 1 : 0 });
      c.set(c.$.line, { sx: c.p.line });
    },
    prompt: 'Reveal the website on the end card: a browser-style pill pops in, the domain types on character by character (~1s) with the path in an accent colour, then an underline draws beneath. Use a short, memorable path (placeholder: yourbrand.com/promo).',
  });

  /* 10 Social handle */
  demo({
    id: 'handle-reveal', cat: CAT, name: 'Social Handle Reveal', aka: ['Follow us', '@handle end card', 'Social links'],
    tags: C.concat('brand'), char: ['Friendly', 'Community', 'Clean'],
    what: 'The @handle slides out from behind an avatar, then small platform-neutral icon chips pop in underneath. One handle used everywhere is easier to remember than several.',
    good: ['Creator and brand endings', 'Collaboration credits', 'Event and community promos'],
    avoid: 'Listing many different handles — pick one primary.',
    anatomy: ['End card', 'Avatar, handle text, icon chips', 'Avatar scale; handle slides out of a mask; chips pop stagger', 'Avatar 0.5s · handle 0.5s · chips 0.3s @80ms', 'back.out / expo.out', 'Avatar → handle → chips'],
    tracks: [['av', 'Avatar', 0.1, 0.5, 'back.out', 'brand'], ['h', 'Handle', '>-0.2', 0.5, 'expo.out', 'text'], ['ch', 'Chips ×3', '>-0.1', 0.3, 'back.out', { n: 3, each: 0.08, kind: 'cta' }], ['hold', 'Hold', '>', 1.3, 'linear']],
    cls: 'bg-red',
    html: `<div class="stackc" style="gap:4cqmin"><div class="hd-row"><i data-r="av" class="hd-av">${A.logoMark({ sw: 9 })}</i><span class="hd-mask"><b data-r="h">@aksa.studio</b></span></div>
      <div class="hd-chips">${['play', 'music', 'chat'].map((i) => `<span data-r="chip">${A.icon(i)}</span>`).join('')}</div></div>`,
    render(t, c) {
      c.set(c.$.av, { s: c.p.av });
      c.set(c.$.h, { xp: -105 * (1 - c.p.h) });
      c.$$.chip.forEach((el, i) => c.set(el, { s: c.st('ch', i) }));
    },
    prompt: 'Reveal the social handle: pop the round avatar in (back-out), slide “@handle” out from behind it inside an overflow-hidden mask (expo-out, 500ms), then pop three small platform-neutral icon chips beneath with an 80ms stagger. Hold 1.5s.',
  });

  /* 11 End card logo + CTA */
  demo({
    id: 'endcard-logo', cat: CAT, name: 'End Card Logo + CTA', aka: ['Brand end card', 'Logo + button outro', 'Closing frame'],
    tags: C.concat('brand'), char: ['Premium', 'Brand', 'Clear'],
    what: 'The classic end card: logo first, a one-line promise, then the CTA button, with a slow background push so the frame is not frozen. Hierarchy is strict: brand → message → action.',
    good: ['Ending every ad or brand video', 'YouTube end screens (leave room for elements)', 'Campaign templates'],
    avoid: 'Two CTAs competing, or text smaller than ~4% of frame height.',
    anatomy: ['End card', 'Background, logo, line, CTA', 'Background slow scale; logo scale; line fade; CTA slide-up', 'Logo 0.7s · line 0.5s · CTA 0.5s', 'premium / back.soft', 'Logo → line → CTA → hold'],
    tracks: [['bg', 'Background push', 0, 3.6, 'linear', 'bg'], ['logo', 'Logo', 0.2, 0.7, 'premium', 'brand'], ['line', 'Promise line', '>-0.3', 0.5, 'premium'], ['cta', 'CTA', '>-0.1', 0.5, 'back.soft', 'cta'], ['hold', 'Hold', '>', 1.4, 'linear']],
    html: `${A.photo('alpine', { r: 'bg', cls: 'fill' })}<i class="fill" style="background:rgba(10,12,14,.62)"></i>
      <div class="stackc" style="gap:5cqmin;color:#fff"><div data-r="logo">${A.logo()}</div><span data-r="line" class="t-serif" style="font-size:6.4cqmin"><i>Design that moves.</i></span>${btn('Mulai proyek', 'cta--light')}</div>`,
    render(t, c) {
      c.set(c.$.bg, { s: lerp(1.05, 1.15, c.p.bg) });
      c.set(c.$.logo, { s: lerp(0.9, 1, c.p.logo), o: c.p.logo });
      c.set(c.$.line, { o: c.p.line });
      c.set(c.$.btn, { y: 5 * (1 - c.p.cta), o: c.p.cta });
    },
    prompt: 'Create a brand end card: a dimmed background image pushes in slowly the whole time; the logo resolves first (scale 0.9 → 1, 700ms), the one-line promise fades in, and the CTA button slides up last with a soft back-out. Hold the complete frame at least 1.5s.',
  });

  /* 12 End card product + CTA */
  demo({
    id: 'endcard-product', cat: CAT, name: 'End Card Product + CTA', aka: ['Packshot end card', 'Product outro', 'Buy now frame'],
    tags: C.concat('object'), char: ['Product', 'Persuasive', 'Clean'],
    what: 'Product, price and button share the final frame: the product slides in from the side, the price drops beside it, and the “Beli sekarang” button arrives last with a single shine. Everything the viewer needs to decide is visible at once.',
    good: ['E-commerce and DTC ads', 'Marketplace and catalogue videos', 'Retargeting ads'],
    avoid: 'Hiding the price — viewers who reach the end want it.',
    anatomy: ['End card', 'Product, name, price, CTA', 'Product translateX + rotate; price drop; CTA slide + shine', 'Product 0.7s · price 0.45s · CTA 0.45s · shine 0.7s', 'expo.out / back.out', 'Product → name/price → CTA → shine'],
    tracks: [['prod', 'Product slides in', 0.1, 0.7, 'expo.out', 'object'], ['info', 'Name + price', '>-0.3', 0.45, 'back.out', 'text'], ['cta', 'CTA', '>-0.1', 0.45, 'back.soft', 'cta'], ['shine', 'Shine', '>', 0.7, 'smooth', 'fx'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-studio-light',
    html: `<div class="ec-prod"><div data-r="prod">${A.product('serum', { style: '--ph:58cqmin' })}</div><div class="ec-prod__info"><div data-r="info" class="col" style="align-items:flex-start;gap:1.4cqmin"><span class="t-eyebrow">Séra</span><b class="t-serif" style="font-size:8cqmin">Daily serum</b><em>Rp 189.000</em></div>
      <span data-r="cta" class="cta" style="margin-top:4cqmin">Beli sekarang<i data-r="sh" class="shine"></i></span></div></div>`,
    render(t, c) {
      c.set(c.$.prod, { xw: -40 * (1 - c.p.prod), r: lerp(-10, 0, c.p.prod), o: c.p.prod });
      c.set(c.$.info, { y: -4 * (1 - c.p.info), o: c.p.info });
      c.set(c.$.cta, { y: 4 * (1 - c.p.cta), o: c.p.cta });
      c.set(c.$.sh, { xp: lerp(-120, 420, c.p.shine) });
    },
    prompt: 'Create a product end card: slide the product in from the left while it straightens from −10° (expo-out, 700ms), drop the name and price in beside it, bring the “Beli sekarang” button up last and pass one shine across it. Product, price and CTA must all be visible together for at least 1s.',
  });

  /* 13 End card loop */
  demo({
    id: 'endcard-loop', cat: CAT, name: 'End Card Loop', aka: ['Loopable outro', 'Seamless end card', 'Replay-friendly ending'],
    tags: C.concat('transition'), char: ['Clever', 'Social', 'Seamless'],
    what: 'The end card does not stop: after the CTA holds, the logo shrinks into a dot that becomes the starting dot of the video’s first frame, so the platform’s auto-replay flows straight back into the hook. The last frame matches frame 1.',
    good: ['Reels / TikTok / Shorts (auto-replay)', 'Product loops', 'Branded series with a recurring opener'],
    avoid: 'Ending on a CTA that disappears too fast — give it a full hold before looping.',
    anatomy: ['End → replay', 'Hook text, CTA card, collapsing dot', 'Hook in → CTA hold → card collapses to the dot that starts the hook', '≈4s total; last frame = first frame', 'expo.inOut', 'Hook → CTA → collapse → (= frame 1)'],
    tracks: [['hook', 'Hook (frame 1 state)', 0, 0.6, 'expo.out', 'text'], ['card', 'CTA card', 0.9, 0.6, 'expo.out', 'cta'], ['hold', 'Hold CTA', '>', 1.2, 'linear'], ['col', 'Collapse to dot', '>', 0.7, 'expo.inOut', 'fx'], ['seam', 'Loop seam', '>', 0, 'linear', 'cut']],
    dur: 4.0,
    cls: 'bg-ink',
    html: `<div class="center"><i data-r="dot" class="el-dot"></i></div><div class="stackc"><b data-r="hook" class="t-display" style="font-size:20cqmin">Nabung<br/>tanpa ribet</b></div>
      <div class="center"><div data-r="card" class="el-card">${A.logo({ cls: 'logo--ink' })}${btn('Coba gratis')}</div></div>`,
    render(t, c) {
      const hookVis = 1 - c.p.card;
      c.set(c.$.dot, { s: c.r.hook < 1 ? lerp(1, 0, c.p.hook) : c.p.col, o: (c.r.hook < 1 ? 1 - c.p.hook : c.p.col) });
      c.set(c.$.hook, { s: lerp(0.3, 1, c.p.hook), o: c.p.hook * hookVis });
      c.set(c.$.card, { s: lerp(0.9, 1, c.p.card) * lerp(1, 0.05, c.p.col), o: c.p.card * (1 - c.p.col * 0.6), r: 0 });
    },
    prompt: 'Make the end card loop back into the opening: the video opens with a dot that expands into the hook text; at the end, after the CTA card holds for ~1.2s, collapse the card (scale → 0.05, expo in-out) into that same dot so the final frame matches frame 1 and the auto-replay continues seamlessly.',
  });
})();
