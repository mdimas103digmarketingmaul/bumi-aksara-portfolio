/* 12 — Promo & Advertising Motion
   Reusable ad patterns. Urgency is honest and tasteful: no fake scarcity,
   no fake timers. Prices and brands are placeholders. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, rng, A } = window.VML;
  const CAT = 'promo';
  const P = ['social', 'object'];
  const rp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  /* 01 Promo badge pop */
  demo({
    id: 'promo-badge', cat: CAT, name: 'Promo Badge Pop', aka: ['Sale sticker', 'Starburst badge', 'Promo stamp'],
    tags: P, char: ['Energetic', 'Promo', 'Playful'],
    what: 'A starburst sticker pops onto the product with a spin and overshoot, then keeps a very slow idle rotation so it stays alive. The badge is a secondary element: it must not cover the product or the price.',
    good: ['E-commerce and retail ads', 'Marketplace thumbnails', 'Flash sale announcements'],
    avoid: 'Several badges competing on one frame — one badge, one message.',
    anatomy: ['Scene time', 'Product + starburst badge', 'scale 0 → 1 + rotate −120° → 12°; idle rotation', '0.6s pop · slow idle', 'back.out', 'Product → badge pop → idle'],
    tracks: [['prod', 'Product in', 0.1, 0.6, 'premium', 'object'], ['pop', 'Badge pop', '>-0.15', 0.6, 'back.out'], ['idle', 'Idle rotation', '>', 1.6, 'linear', 'bg']],
    cls: 'bg-studio-light',
    html: `<div class="center"><div data-r="prod">${A.product('box', { style: '--ph:56cqmin' })}</div></div>
      <div class="center"><div data-r="badge" class="ad-burst" style="margin:-44cqmin 0 0 40cqmin"><span><b>PROMO</b><small>s/d 30%</small></span></div></div>`,
    render(t, c) {
      c.set(c.$.prod, { y: 8 * (1 - c.p.prod), o: c.p.prod });
      const idle = Math.max(0, t - c.tl.map.idle.start) * 12;
      c.set(c.$.badge, { s: c.p.pop, r: lerp(-120, 12, c.p.pop) + idle });
    },
    prompt: 'Pop a starburst “PROMO” sticker onto the top-right of the product: scale it from 0 to 1 while rotating from −120° to 12° with a back-out ease (600ms) just as the product settles, then give it a very slow idle rotation (~12°/s). Keep it clear of the product and price.',
  });

  /* 02 Discount percentage */
  demo({
    id: 'discount-pct', cat: CAT, name: 'Discount Percentage', aka: ['% OFF', 'Sale number', 'Discount hero'],
    tags: P.concat('text'), char: ['Energetic', 'Promo', 'Bold'],
    what: 'The discount is the hero: the number rolls up quickly to 50, slams with “% OFF”, and rays burst behind it. The motion makes a number feel like an event — but it lands fast so the viewer can read it.',
    good: ['Sale campaigns (11.11, 12.12, Ramadan)', 'Price-led ads', 'Story and Reels promos'],
    avoid: 'Rolling for too long — the final number must be readable within ~0.6s.',
    anatomy: ['Scene time', 'Number, % OFF, rays, terms', 'count 0 → 50 · slam scale 1.3 → 1 · rays rotate + scale', 'Count 0.45s · slam 0.3s · rays 0.6s', 'expo.out', 'Count → slam → rays → small print'],
    tracks: [['count', 'Count 0 → 50', 0.2, 0.45, 'expo.out'], ['slam', 'Slam', '>', 0.3, 'expo.out'], ['rays', 'Rays burst', '<', 0.6, 'expo.out', 'fx'], ['terms', 'Small print', '>', 0.4, 'premium'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-red',
    html: `<div class="center"><i data-r="rays" class="ad-rays"></i></div><div class="stackc"><div data-r="num" class="ad-pct t-display"><b data-r="n">0</b><span><i>%</i><em>OFF</em></span></div>
      <span data-r="terms" class="t-mono ad-terms">*S&amp;K berlaku · 1–3 Nov</span></div>`,
    render(t, c) {
      c.$.n.textContent = Math.round(50 * c.p.count);
      c.set(c.$.num, { s: c.r.slam > 0 ? lerp(1.3, 1, c.p.slam) : lerp(0.8, 1, c.p.count) });
      c.set(c.$.rays, { s: lerp(0.3, 1, c.p.rays), r: t * 14, o: c.p.rays * 0.9 });
      c.set(c.$.terms, { o: c.p.terms * 0.85 });
    },
    prompt: 'Make the discount the hero: count the number from 0 to 50 in 450ms (expo-out), then slam it with “% OFF” from scale 1.3 to 1 (300ms) while a ray burst scales up and slowly rotates behind it. Fade in the terms line last. Readable within 0.6s.',
  });

  /* 03 Price reveal */
  demo({
    id: 'price-reveal', cat: CAT, name: 'Price Reveal', aka: ['Slot price', 'Price drop-in', 'Price tag reveal'],
    tags: P.concat('text'), char: ['Exciting', 'Promo', 'Clean'],
    what: 'Each digit of the price rolls like a slot machine and locks in from left to right, then the price card settles. A short suspense moment makes the price itself memorable.',
    good: ['Product launches with an attractive price', 'Bundles and subscriptions', 'Price-led hooks'],
    avoid: 'Hiding a high price behind theatrics — reveals work when the price is the good news.',
    anatomy: ['Scene time', 'Price digit columns + card', 'Each digit strip rolls several cycles and stops on its value; card scale', '0.9s per digit · 120ms stagger', 'expo.out', 'Card in → digits lock left → right → tag'],
    tracks: [['card', 'Card in', 0.1, 0.5, 'back.soft', 'ui'], ['d', 'Digits lock ×5', 0.3, 0.9, 'expo.out', { n: 5, each: 0.12 }], ['tag', '“Mulai dari” tag', '>-0.2', 0.4, 'back.soft'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-blue',
    html: `<div class="stackc" style="gap:4cqmin"><span data-r="tag" class="badge badge--light">Mulai dari</span><div data-r="card" class="ad-price"><span class="ad-price__rp">Rp</span>
      ${'49.900'.split('').map((ch) => ch === '.' ? '<span class="ad-price__dot">.</span>' : `<span class="odo__col"><span data-r="col" class="odo__strip">${'0123456789'.split('').join('<br/>')}<br/>0</span></span>`).join('')}<span class="ad-price__per">/bln</span></div></div>`,
    render(t, c) {
      c.set(c.$.card, { s: lerp(0.85, 1, c.p.card), o: clamp(c.r.card * 3) });
      const digits = [4, 9, 9, 0, 0];
      c.$$.col.forEach((el, i) => {
        const p = c.st('d', i);
        const pos = (digits[i] + 30 * (1 - p)) % 10;
        c.set(el, { yp: -(pos / 11) * 100 });
      });
      c.set(c.$.tag, { s: c.p.tag, o: clamp(c.r.tag * 3) });
    },
    prompt: 'Reveal the price with slot-machine digits: each digit is a 0–9 strip in an overflow-hidden column that spins through ~3 full cycles and decelerates onto its final value (expo-out, 900ms), locking in left to right with a 120ms stagger. Pop a small “Mulai dari” tag above when the last digit lands.',
  });

  /* 04 Old → new price (strikethrough) */
  demo({
    id: 'old-new-price', cat: CAT, name: 'Old Price → New Price', aka: ['Strikethrough animation', 'Price drop', 'Was / now'],
    tags: P.concat('text'), char: ['Persuasive', 'Clear', 'Promo'], covers: 2,
    what: 'The original price appears, a line strikes through it, the old price shrinks and dims, and the new price drops into the hero position in the accent colour with a “hemat” chip. The strikethrough is the key gesture — it visibly cancels the old number.',
    good: ['Sales and markdowns', 'Bundle savings', 'Membership discounts'],
    avoid: 'Fake “original” prices — show real reference prices only.',
    anatomy: ['Scene time', 'Old price, strike line, new price, savings chip', 'Strike scaleX; old price scale 1 → 0.6 + move up; new price drop + scale', 'Strike 0.35s · move 0.5s · new 0.5s', 'expo.out / back.out', 'Old → strike → shrink → new → saving'],
    tracks: [['old', 'Old price', 0.1, 0.4, 'premium'], ['strike', 'Strikethrough', '+=0.25', 0.35, 'expo.out', 'fx'], ['shrink', 'Old shrinks', '>', 0.5, 'expo.inOut'], ['new', 'New price drops', '<0.15', 0.5, 'back.out'], ['save', 'Savings chip', '>-0.1', 0.4, 'back.soft'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-cream',
    html: `<div class="stackc" style="gap:2cqmin"><div data-r="old" class="ad-old t-sans"><span>Rp 899.000</span><i data-r="strike"></i></div>
      <b data-r="new" class="t-display ad-new">Rp 599.000</b><span data-r="save" class="badge">Hemat Rp 300.000</span></div>`,
    render(t, c) {
      c.set(c.$.old, { o: c.p.old * lerp(1, 0.5, c.p.shrink), s: lerp(1, 0.62, c.p.shrink), y: lerp(10, -2, c.p.shrink) });
      c.set(c.$.strike, { sx: c.p.strike });
      c.set(c.$.new, { y: lerp(-8, 0, c.p.new), s: lerp(0.6, 1, c.p.new), o: clamp(c.r.new * 3) });
      c.set(c.$.save, { s: c.p.save, o: clamp(c.r.save * 3) });
    },
    prompt: 'Animate a price drop: show the old price large, then draw a strikethrough line across it from left to right (scaleX, 350ms, expo-out). Shrink the old price to 0.62 and dim it while it moves up, and drop the new price into the hero position in the accent colour with a back-out ease. Finish with a savings chip.',
  });

  /* 05 Limited-time badge */
  demo({
    id: 'limited-badge', cat: CAT, name: 'Limited-Time Badge', aka: ['Time-limited ribbon', 'Ends soon tag', 'Corner ribbon'],
    tags: P, char: ['Urgent', 'Clean', 'Promo'],
    what: 'A ribbon slides in across the corner with a clock icon whose hand ticks around, and a soft shine passes once. It communicates a real deadline without shouting.',
    good: ['Promos with a genuine end date', 'Launch-week pricing', 'Seasonal campaigns'],
    avoid: 'Permanent “limited time” claims — urgency must be true.',
    anatomy: ['Scene time', 'Corner ribbon + clock hand + shine', 'Ribbon translateX −100% → 0; hand rotate; shine sweep', 'Slide 0.6s · ticking continuous · shine 0.8s', 'expo.out / linear', 'Card → ribbon → shine → ticking'],
    tracks: [['card', 'Card', 0.1, 0.5, 'premium', 'ui'], ['rib', 'Ribbon slides', '>-0.1', 0.6, 'expo.out'], ['shine', 'Shine', '>', 0.8, 'smooth', 'fx'], ['tick', 'Clock ticking', 0.6, 2.4, 'linear', 'fx']],
    cls: 'bg-ink',
    html: `<div class="center"><div data-r="card" class="ad-card">${A.photo('food', { cls: 'ad-card__img' })}<div class="ad-card__body"><b>Paket Keluarga</b><span>4 porsi · gratis es teh</span><em>Rp 99.000</em></div>
      <div data-r="rib" class="ad-ribbon"><svg viewBox="0 0 24 24" class="ad-clock"><circle cx="12" cy="12" r="9"/><path data-r="hand" d="M12 12 V6"/></svg><span>Hanya s/d 31 Okt</span><i data-r="shine" class="shine"></i></div></div></div>`,
    render(t, c) {
      c.set(c.$.card, { y: 6 * (1 - c.p.card), o: c.p.card });
      c.set(c.$.rib, { xp: -110 * (1 - c.p.rib) });
      c.set(c.$.shine, { xp: lerp(-120, 420, c.p.shine) });
      c.$.hand.setAttribute('transform', `rotate(${Math.floor(Math.max(0, t - 0.6) * 4) * 30} 12 12)`);
    },
    prompt: 'Add a limited-time ribbon to a promo card: slide a ribbon in from the left edge across the top-left corner (expo-out, 600ms) containing a clock icon and the real end date; tick the clock hand in 30° steps, and pass a single soft shine across the ribbon once. Keep it calm and truthful.',
  });

  /* 06 Countdown timer */
  demo({
    id: 'countdown-timer', cat: CAT, name: 'Countdown Timer', aka: ['Flip clock', 'Promo timer', 'Ends in…'],
    tags: P.concat('ui'), char: ['Urgent', 'Technical', 'Clear'],
    what: 'An hours : minutes : seconds timer counts down, and each changing digit flips over like a split-flap display. The flip gives every second a visible beat. Use only with a real end time.',
    good: ['Flash sales with a real deadline', 'Live events and launches', 'Pre-order windows'],
    avoid: 'Fake or resetting timers — it erodes trust and is a dark pattern.',
    anatomy: ['Real clock (simulated)', 'Six digit cards', 'On change: top half folds down (rotateX 0 → −90°), new digit unfolds', '0.4s flip per change', 'cubic.in then out', 'Seconds flip every second; minutes when seconds wrap'],
    tracks: [['in', 'Timer in', 0.1, 0.5, 'back.soft', 'ui'], ['s1', 'Tick', 1, 0, 'linear', 'beat'], ['s2', 'Tick', 2, 0, 'linear', 'beat'], ['s3', 'Tick', 3, 0, 'linear', 'beat'], ['hold', 'Run', 0.6, 3.2, 'linear']],
    dur: 3.8,
    cls: 'bg-coal',
    html: `<div class="stackc" style="gap:4cqmin"><span class="t-eyebrow">Flash sale berakhir dalam</span><div data-r="clock" class="ad-flip">${[0, 1, 2, 3, 4, 5].map((i) => `${i === 2 || i === 4 ? '<i class="ad-flip__sep">:</i>' : ''}<span class="ad-fd"><b data-r="dn">0</b><em data-r="flap"><b data-r="dflap">0</b></em></span>`).join('')}</div>
      <div class="ad-flip__labels"><span>jam</span><span>menit</span><span>detik</span></div></div>`,
    render(t, c) {
      c.set(c.$.clock, { s: lerp(0.85, 1, c.p.in), o: c.p.in });
      const total = 2 * 3600 + 14 * 60 + 2 - Math.floor(Math.max(0, t - 0.0));
      const frac = Math.max(0, t) % 1;
      const str = (n) => { const h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60), s = n % 60; return [h, m, s].map((v) => String(v).padStart(2, '0')).join(''); };
      const now = str(total), prev = str(total + 1);
      c.$$.dn.forEach((el, i) => {
        if (el.textContent !== now[i]) el.textContent = now[i];
        const changed = now[i] !== prev[i] && t >= 1;
        const fp = changed ? clamp(frac / 0.4) : 1;
        c.$$.dflap[i].textContent = fp < 0.5 ? prev[i] : now[i];
        c.set(c.$$.flap[i], { rx: changed && fp < 1 ? (fp < 0.5 ? -180 * fp : 180 * (1 - fp)) : 0, o: changed && fp < 1 ? 1 : 0 });
      });
    },
    prompt: 'Build an honest flip-clock countdown (hours : minutes : seconds) to a real end time: each digit card flips like a split-flap display when its value changes — the top half folds down (rotateX 0 → −90°, ease-in) and the new digit unfolds (ease-out), ~400ms total. Use tabular figures and never reset the timer.',
  });

  /* 07 Feature stack */
  const FEAT = ['Gratis biaya admin', 'Transfer instan 24/7', 'Cashback tiap transaksi'];
  demo({
    id: 'feature-stack', cat: CAT, name: 'Feature Stack', aka: ['Benefit list', 'Checklist', 'Bullet stack'],
    tags: P.concat('text', 'ui'), char: ['Clear', 'Persuasive', 'Clean'],
    what: 'Benefits arrive one per beat as cards that slide up and stack, each with a check that draws itself. A stack builds value cumulatively — by the third item, the offer feels substantial.',
    good: ['Explaining 3 key benefits', 'Comparison with competitors', 'Mid-section of an ad'],
    avoid: 'More than 3–4 benefits or long sentences.',
    anatomy: ['Beat-synced', 'Three benefit cards + checks', 'Card translateY 40% → 0 + opacity; check draw', '0.5s each · 0.45s apart', 'expo.out', 'Benefit 01 → 02 → 03'],
    tracks: [['b', 'Benefits ×3 (450ms)', 0.2, 0.5, 'expo.out', { n: 3, each: 0.45 }], ['ck', 'Checks ×3', 0.4, 0.35, 'out', { n: 3, each: 0.45 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-lilac',
    html: `<div class="stackc pad" style="align-items:stretch;gap:3cqmin"><b class="t-sans" style="font-size:8cqmin;margin-bottom:2cqmin;color:#17122e">Kenapa pindah ke Wallet?</b>
      ${FEAT.map((f, i) => `<div data-r="card" class="ad-feat"><span class="t-mono">0${i + 1}</span><b>${f}</b><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path data-r="ck" d="M7 12.5l3.2 3.2L17 9" pathLength="1" stroke-dasharray="1 1"/></svg></div>`).join('')}</div>`,
    render(t, c) {
      c.$$.card.forEach((el, i) => { const p = c.st('b', i); c.set(el, { yp: 40 * (1 - p), o: p }); });
      c.$$.ck.forEach((el, i) => c.set(el, { dash: 1 - c.st('ck', i) }));
    },
    prompt: 'Stack three benefits on consecutive beats: each benefit card slides up 40% and fades in (500ms, expo-out), 450ms apart, and its check mark draws itself 200ms later (stroke-dashoffset, 350ms). Keep each benefit under five words.',
  });

  /* 08 Product + benefit composition */
  const BEN = [['Zero sugar', -1, -26], ['Real yuzu', 1, -4], ['330 ml', -1, 20]];
  demo({
    id: 'product-benefits', cat: CAT, name: 'Product + Benefit Composition', aka: ['Product callouts', 'Benefit layout', 'Hero + claims'],
    tags: P, char: ['Product', 'Clean', 'Persuasive'],
    what: 'The product holds the centre while benefit labels appear around it, alternating left and right, each connected by a short line. The product stays still; the benefits orbit its meaning.',
    good: ['Packshot ads', 'Product launches', 'Marketplace video listings'],
    avoid: 'Labels covering the product or each other; keep 3 short claims.',
    anatomy: ['Scene time', 'Product + three labels with leader lines', 'Product rise; line scaleX; label slide from the line end', 'Product 0.8s · labels 0.45s @250ms', 'premium / expo.out', 'Product → claim 1 → 2 → 3'],
    tracks: [['prod', 'Product rise', 0.1, 0.8, 'premium', 'object'], ['l', 'Benefits ×3 (250ms)', '>-0.3', 0.45, 'expo.out', { n: 3, each: 0.25 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-studio-warm',
    html: `<div class="center"><div data-r="prod">${A.product('can', { style: '--ph:56cqmin' })}</div></div>
      ${BEN.map(([l, side, y]) => `<div class="center"><div data-r="ben" class="ad-ben ad-ben--${side > 0 ? 'r' : 'l'}" style="margin-top:${y * 2}cqmin"><i data-r="ln"></i><span>${l}</span></div></div>`).join('')}`,
    render(t, c) {
      c.set(c.$.prod, { y: 10 * (1 - c.p.prod), o: c.p.prod });
      c.$$.ben.forEach((el, i) => {
        const p = c.st('l', i);
        c.set(c.$$.ln[i], { sx: p });
        c.set(el.querySelector('span'), { x: BEN[i][1] * -3 * (1 - p), o: p });
      });
    },
    prompt: 'Compose a product with three benefit callouts: the product rises into the centre (800ms, premium ease), then each benefit appears alternating left and right — a short leader line grows out from the product edge (scaleX) and the label slides in from the line’s end — 250ms apart.',
  });

  /* 09 Promo card entrance */
  demo({
    id: 'promo-card', cat: CAT, name: 'Promo Card Entrance', aka: ['Offer card', 'Deal card', 'Banner card'],
    tags: P.concat('ui'), char: ['Clean', 'Promo', 'Premium'],
    what: 'A promo card flips up in 3D from below like a card being dealt, then its contents build in: image, title, price, button. The 3D flip makes the card feel like a physical object.',
    good: ['App and marketplace promos', 'Offer reveals inside a video', 'Carousel ad frames'],
    avoid: 'Over-rotating (> 60°) — the card becomes unreadable mid-flip.',
    anatomy: ['Scene time', 'Card + content', 'rotateX 55° → 0 + translateY; content stagger', 'Card 0.8s · content 0.4s @80ms', 'expo.out / premium', 'Card lands → content builds'],
    tracks: [['card', 'Card flips up', 0.1, 0.8, 'expo.out', 'ui'], ['c', 'Content ×4 (80ms)', '-=0.35', 0.4, 'premium', { n: 4, each: 0.08 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-mesh',
    html: `<div class="center pu-3d"><div data-r="card" class="ad-promo" style="transform-origin:50% 100%">${A.photo('coffee', { r: 'ci', cls: 'ad-promo__img' })}
      <span data-r="ci" class="badge">Member only</span><b data-r="ci">Kopi susu<br/>buy 1 get 1</b><div data-r="ci" class="ad-promo__row"><em>Rp 28.000</em><span class="cta cta--dark">Klaim ${A.icon('arrow')}</span></div></div></div>`,
    render(t, c) {
      c.set(c.$.card, { rx: lerp(55, 0, c.p.card), yh: lerp(30, 0, c.p.card), o: clamp(c.r.card * 3) });
      c.$$.ci.forEach((el, i) => { const p = c.st('c', i); c.set(el, { o: p, y: 2 * (1 - p) }); });
    },
    prompt: 'Deal a promo card into frame: it flips up from rotateX(55°) to 0 around its bottom edge while rising 30% (800ms, expo-out, perspective ~1000px), then build its content in order — image, badge, title, price + button — with an 80ms stagger.',
  });

  /* 10 Voucher */
  demo({
    id: 'voucher', cat: CAT, name: 'Voucher Animation', aka: ['Ticket voucher', 'Promo code reveal', 'Gift voucher'],
    tags: P.concat('ui'), char: ['Rewarding', 'Playful', 'Promo'],
    what: 'A ticket-shaped voucher slides out of an envelope, tilts and settles, and its code is revealed by a scratch-like wipe. The physical metaphor (envelope, ticket, scratch) makes a digital discount feel like a gift.',
    good: ['Promo codes and referral rewards', 'Welcome offers', 'Giveaway winners'],
    avoid: 'Long, unreadable codes — keep them short and high contrast.',
    anatomy: ['Scene time', 'Envelope, voucher, code mask', 'Voucher translateY out of envelope + rotate; code clip-path wipe', 'Slide 0.8s · wipe 0.6s', 'back.out / inOut', 'Envelope → voucher pulls out → code revealed'],
    tracks: [['env', 'Envelope', 0.1, 0.4, 'premium', 'object'], ['pull', 'Voucher slides out', '>', 0.8, 'back.out', 'ui'], ['code', 'Code reveal', '>-0.1', 0.6, 'inOut', 'fx'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-wine',
    html: `<div class="center"><div class="ad-env" data-r="env"><div data-r="v" class="ad-voucher"><div class="ad-voucher__l"><small>Voucher</small><b>Diskon 25%</b><span>min. belanja Rp 100rb</span></div><div class="ad-voucher__r"><small>Kode</small><b class="ad-code"><span data-r="code">HEMAT25</span></b></div></div><i class="ad-env__front"></i></div></div>`,
    render(t, c) {
      c.set(c.$.env, { o: c.p.env, y: 4 * (1 - c.p.env) });
      c.set(c.$.v, { yp: lerp(55, -38, c.p.pull), r: lerp(0, -4, c.p.pull) });
      c.set(c.$.code, { clip: `inset(0 ${100 - c.p.code * 100}% 0 0)` });
    },
    prompt: 'Animate a voucher reveal: an envelope fades up, then a ticket-shaped voucher slides up out of it with a back-out ease and settles at a slight tilt (800ms). Reveal the code with a left-to-right scratch wipe (clip-path, 600ms). Keep the code short and high contrast.',
  });

  /* 11 Coupon tear */
  demo({
    id: 'coupon-tear', cat: CAT, name: 'Coupon Tear / Reveal Concept', aka: ['Tear-off coupon', 'Rip reveal', 'Perforation tear'],
    tags: P.concat('ui'), char: ['Playful', 'Tactile', 'Rewarding'],
    what: 'A coupon’s stub tears away along the perforation — rotating and falling — to reveal the reward underneath. Simplified 2D concept: the jagged edge and the falling piece sell the tear.',
    good: ['Rewards and loyalty programs', 'Gamified promos', 'Scratch-and-win style reveals'],
    avoid: 'Complex paper simulations on mobile — keep it a simple, fast gesture.',
    anatomy: ['Scene time', 'Coupon body + tear-off stub + reward', 'Stub rotate 0 → 35° around the tear edge + fall + fade; reward scale', 'Tug 0.25s · tear 0.8s · reward 0.5s', 'back.in / cubic.in / back.out', 'Tug (anticipation) → tear → reveal'],
    tracks: [['in', 'Coupon in', 0.1, 0.5, 'premium', 'ui'], ['tug', 'Tug', '+=0.2', 0.25, 'sine.inOut', 'object'], ['tear', 'Tear + fall', '>', 0.8, 'cubic.in', 'object'], ['rew', 'Reward reveal', '<0.2', 0.5, 'back.out'], ['hold', 'Hold', '>', 1.1, 'linear']],
    note: '2D concept: the tear is a rotation along a jagged clip edge, not a paper simulation.',
    cls: 'bg-sand',
    html: `<div class="center"><div data-r="cp" class="ad-coupon"><div class="ad-coupon__body"><small>Kupon kamu</small><b data-r="rew">GRATIS ONGKIR</b><span>berlaku 7 hari</span></div><div data-r="stub" class="ad-coupon__stub"><b>Sobek di sini</b><span>✂</span></div></div></div>`,
    render(t, c) {
      c.set(c.$.cp, { o: c.p.in, s: lerp(0.9, 1, c.p.in) });
      const tug = Math.sin(c.r.tug * Math.PI) * 3;
      c.set(c.$.stub, { r: tug + 38 * c.p.tear, yh: 70 * c.p.tear * c.p.tear, x: 4 * c.p.tear, o: 1 - clamp((c.r.tear - 0.6) / 0.4) });
      c.set(c.$.rew, { s: lerp(0.7, 1, c.p.rew), o: lerp(0.15, 1, c.p.rew) });
    },
    prompt: 'Create a coupon tear concept: after the coupon appears, tug the stub slightly (anticipation), then tear it off along a jagged perforation — rotate it ~38° around the tear edge while it falls and fades (800ms, ease-in). As it goes, reveal the reward text with a back-out scale.',
  });

  /* 12 Product comparison */
  const CMP = [['Gula', '0 g', '27 g'], ['Kalori', '5 kkal', '140 kkal'], ['Rasa asli', '✓', '✕']];
  demo({
    id: 'product-comparison', cat: CAT, name: 'Product Comparison', aka: ['Side-by-side', 'Spec compare', 'Us vs them table'],
    tags: P, char: ['Persuasive', 'Clear', 'Informative'],
    what: 'Two products sit side by side, then comparison rows appear one at a time, each revealing both values at once so the viewer compares row by row. Our column is highlighted with a soft panel.',
    good: ['Healthier / cheaper alternatives', 'Plan or tier comparisons', 'Before/after specs'],
    avoid: 'Naming or showing real competitor brands without legal clearance — use “Soda biasa”.',
    anatomy: ['Scene time', 'Two products + three rows', 'Products slide from sides; rows fade + slide with stagger; highlight panel scaleY', 'Products 0.6s · rows 0.4s @220ms', 'expo.out', 'Products → highlight → rows'],
    tracks: [['prods', 'Products in', 0.1, 0.6, 'expo.out', 'object'], ['hi', 'Highlight column', '>-0.2', 0.5, 'expo.out', 'fx'], ['r', 'Rows ×3 (220ms)', '>-0.2', 0.4, 'premium', { n: 3, each: 0.22 }], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-paper',
    html: `<div class="ad-cmp"><i data-r="hi" class="ad-cmp__hi"></i><div class="ad-cmp__head"><div data-r="pa">${A.product('can', { style: '--ph:30cqmin' })}<b>FIZZ</b></div><div data-r="pb"><div class="ad-cmp__generic"></div><b>Soda biasa</b></div></div>
      ${CMP.map(([k, a, b]) => `<div data-r="row" class="ad-cmp__row"><span>${a}</span><small>${k}</small><span>${b}</span></div>`).join('')}</div>`,
    render(t, c) {
      c.set(c.$.pa, { xw: -40 * (1 - c.p.prods), o: c.p.prods });
      c.set(c.$.pb, { xw: 40 * (1 - c.p.prods), o: c.p.prods });
      c.set(c.$.hi, { sy: c.p.hi });
      c.$$.row.forEach((el, i) => { const p = c.st('r', i); c.set(el, { o: p, y: 3 * (1 - p) }); });
    },
    prompt: 'Compare two products side by side: slide them in from opposite sides (600ms, expo-out), grow a soft highlight panel behind our column (scaleY from the top), then reveal three comparison rows one at a time (220ms apart), each row showing both values at once. Use a generic competitor label.',
  });

  /* 13 Testimonial card */
  demo({
    id: 'testimonial', cat: CAT, name: 'Testimonial Card', aka: ['Review card', 'Customer quote', 'UGC quote'],
    tags: P.concat('text', 'ui'), char: ['Trustworthy', 'Warm', 'Calm'],
    what: 'A quote card rises in, the stars fill one by one, the quote appears word by word at speaking pace, and the customer’s name and verified badge close it. Calm motion keeps it credible.',
    good: ['Social proof inside ads', 'Landing-page style videos', 'App store review highlights'],
    avoid: 'Fabricated testimonials or flashy effects that make it feel fake.',
    anatomy: ['Scene time', 'Card, stars, quote words, author', 'Card rise; stars scale; words fade-up; author slide', 'Card 0.6s · stars 0.25s @80ms · words @60ms', 'premium / back.out', 'Card → stars → quote → author'],
    tracks: [['card', 'Card rises', 0.1, 0.6, 'premium', 'ui'], ['st', 'Stars ×5', '>-0.2', 0.25, 'back.out', { n: 5, each: 0.08 }], ['w', 'Quote words ×12', '>-0.1', 0.4, 'premium', { n: 12, each: 0.06 }], ['who', 'Author', '>-0.1', 0.45, 'premium'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-cream',
    html: `<div class="center"><div data-r="card" class="ad-testi"><div class="stars">${'<span data-r="star">' + A.icon('star') + '</span>'}${('<span data-r="star">' + A.icon('star') + '</span>').repeat(4)}</div>
      <p>“${'Baru sebulan pakai, tabunganku udah naik dua kali lipat. Simpel banget!'.split(' ').map((w) => `<span data-r="w" class="wd">${w}</span>`).join(' ')}”</p>
      <div data-r="who" class="ad-testi__who"><i></i><div><b>Sari, 27</b><small>${A.icon('check')} Pengguna terverifikasi</small></div></div></div></div>`,
    render(t, c) {
      c.set(c.$.card, { y: 8 * (1 - c.p.card), o: c.p.card });
      c.$$.star.forEach((el, i) => c.set(el, { s: c.st('st', i) }));
      c.$$.w.forEach((el, i) => { const p = c.st('w', i); c.set(el, { o: p, y: 1.5 * (1 - p) }); });
      c.set(c.$.who, { o: c.p.who, x: -3 * (1 - c.p.who) });
    },
    prompt: 'Animate a testimonial card calmly: the card rises 8% and fades in (600ms, premium ease), five stars pop in left to right (back-out, 80ms stagger), the quote appears word by word at speaking pace (60ms stagger, gentle fade-up), and the author with a verified badge slides in last. Hold for reading.',
  });

  /* 14 Rating animation */
  demo({
    id: 'rating', cat: CAT, name: 'Rating Animation', aka: ['Star rating', '4.9 stars', 'Review score'],
    tags: P.concat('ui'), char: ['Trustworthy', 'Rewarding', 'Clean'],
    what: 'Five outlined stars fill one by one with a small bounce while the score counts to 4.9; the last star fills only 90%. The partial star keeps it honest — precision builds trust.',
    good: ['App and product ratings', 'Service quality claims', 'End cards with social proof'],
    avoid: 'Rounding up ratings visually (filling 5 full stars for 4.6).',
    anatomy: ['Scene time', 'Five star outlines + fills + score + count', 'Fill clip per star (last 90%); star scale bounce; score count', '0.3s per star @140ms · score 1s', 'back.out / expo.out', 'Stars fill left → right while score counts'],
    tracks: [['s', 'Stars fill ×5', 0.3, 0.3, 'back.out', { n: 5, each: 0.14 }], ['score', 'Score count', 0.3, 1, 'expo.out'], ['cnt', 'Review count', '>-0.3', 0.5, 'premium'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-navy',
    html: `<div class="stackc" style="gap:4cqmin"><b data-r="score" class="t-sans" style="font-size:24cqmin;letter-spacing:-0.05em">0.0</b>
      <div class="ad-stars">${[0, 1, 2, 3, 4].map(() => `<span data-r="sw" class="ad-star"><svg viewBox="0 0 24 24" class="ad-star__o">${A.ICONS.star}</svg><span data-r="sf" class="ad-star__f"><svg viewBox="0 0 24 24">${A.ICONS.star}</svg></span></span>`).join('')}</div>
      <span data-r="cnt" class="t-eyebrow">dari 38.240 ulasan</span></div>`,
    render(t, c) {
      c.$$.sf.forEach((el, i) => {
        const p = c.st('s', i, 'expo.out'), full = i === 4 ? 0.9 : 1;
        c.set(el, { clip: `inset(0 ${100 - p * full * 100}% 0 0)` });
        c.set(c.$$.sw[i], { s: 1 + 0.18 * bump(c.st('s', i, 'linear')) });
      });
      c.$.score.textContent = (4.9 * c.p.score).toFixed(1);
      c.set(c.$.cnt, { o: c.p.cnt });
    },
    prompt: 'Animate a star rating honestly: five outlined stars fill left to right (clip each fill layer from the left), 140ms apart with a small scale bounce as each fills, while the score counts from 0.0 to 4.9 with an expo-out ease. Fill the last star only 90% to match 4.9.',
  });

  /* 15 Social proof number */
  demo({
    id: 'social-proof', cat: CAT, name: 'Social Proof Number', aka: ['Users count', '“Join 12k people”', 'Avatar stack'],
    tags: P.concat('text'), char: ['Trustworthy', 'Community', 'Persuasive'],
    what: 'Avatars stack in one after another, overlapping, then the big number counts up to the community size. Faces first make the number feel like people, not a statistic.',
    good: ['Community and waitlist growth', 'App installs and memberships', 'Event attendance'],
    avoid: 'Real people’s photos without consent — use illustrated or generic avatars.',
    anatomy: ['Scene time', 'Avatar stack + number + label', 'Avatars translateX + scale (overlapping); number count', 'Avatars 0.4s @90ms · count 1.2s', 'back.out / expo.out', 'Faces → number → label'],
    tracks: [['av', 'Avatars ×6 (90ms)', 0.1, 0.4, 'back.out', { n: 6, each: 0.09 }], ['count', 'Count 12.000+', '>-0.2', 1.2, 'expo.out'], ['lbl', 'Label', '-=0.4', 0.5, 'premium'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-blue',
    html: `<div class="stackc" style="gap:4cqmin"><div class="ad-avs">${['#f2c14e', '#ef4b36', '#7fd1b0', '#b9a7ff', '#ff9fb2', '#fff'].map((col, i) => `<i data-r="av" style="background:linear-gradient(135deg, ${col}, #2c4bd6)">${i === 5 ? '+' : ''}</i>`).join('')}</div>
      <b data-r="n" class="t-sans" style="font-size:16cqmin;letter-spacing:-0.05em">0</b><span data-r="lbl" class="t-body" style="font-size:4cqmin;opacity:.9">orang sudah gabung minggu ini</span></div>`,
    render(t, c) {
      c.$$.av.forEach((el, i) => { const p = c.st('av', i); c.set(el, { s: p, x: -4 * (1 - p) }); });
      c.$.n.textContent = Math.round(12000 * c.p.count).toLocaleString('id-ID') + (c.r.count >= 1 ? '+' : '');
      c.set(c.$.lbl, { o: c.p.lbl });
    },
    prompt: 'Build a social-proof moment: generic avatars pop into an overlapping stack one after another (back-out, 90ms stagger), then the community number counts up to “12.000+” (1.2s, expo-out, Indonesian separators) with a label underneath.',
  });

  /* 16 Offer highlight */
  demo({
    id: 'offer-highlight', cat: CAT, name: 'Offer Highlight', aka: ['Circle the deal', 'Hand-drawn marker', 'Annotation highlight'],
    tags: P.concat('text'), char: ['Playful', 'Handmade', 'Clear'],
    what: 'A hand-drawn ellipse circles the key offer in a menu or price list, and an arrow with a scribbled note points at it. The imperfect line feels human — like a friend recommending it.',
    good: ['Menus, price lists and plans', 'Pointing at the best-value option', 'Creator-style promos'],
    avoid: 'Overusing scribbles — one annotation per frame.',
    anatomy: ['Scene time', 'Price list + scribble ellipse + arrow + note', 'Ellipse stroke draw; arrow draw; note pop', 'Ellipse 0.7s · arrow 0.4s · note 0.4s', 'inOut / back.out', 'List → circle → arrow → note'],
    tracks: [['list', 'Price list', 0.1, 0.5, 'premium', 'ui'], ['circle', 'Circle the offer', '+=0.2', 0.7, 'inOut', 'fx'], ['arrow', 'Arrow', '>-0.1', 0.4, 'out', 'fx'], ['note', 'Note', '>-0.1', 0.4, 'back.out'], ['hold', 'Hold', '>', 1.1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="center"><div data-r="list" class="ad-menu">${[['Basic', 'Rp 29rb'], ['Plus', 'Rp 49rb'], ['Family', 'Rp 79rb']].map(([n, p], i) => `<div class="ad-menu__row${i === 1 ? ' hi' : ''}"><b>${n}</b><span>${p}</span></div>`).join('')}
      <svg class="ad-scribble" viewBox="0 0 120 50" preserveAspectRatio="none"><path data-r="circ" d="M10 26 C 8 8, 104 4, 112 22 C 118 40, 30 50, 12 36 C 6 30, 20 14, 60 10" pathLength="1" stroke-dasharray="1 1"/></svg>
      <svg class="ad-arrow" viewBox="0 0 60 60"><path data-r="arr" d="M54 8 C 40 14, 28 26, 14 46 M14 46 L13 32 M14 46 L27 42" pathLength="1" stroke-dasharray="1 1"/></svg>
      <span data-r="note" class="ad-note">paling worth it!</span></div></div>`,
    render(t, c) {
      c.set(c.$.list, { o: c.p.list, y: 4 * (1 - c.p.list) });
      c.set(c.$.circ, { dash: 1 - c.p.circle });
      c.set(c.$.arr, { dash: 1 - c.p.arrow });
      c.set(c.$.note, { s: c.p.note, r: -6, o: clamp(c.r.note * 3) });
    },
    prompt: 'Highlight the best offer like a hand-drawn annotation: after the price list appears, draw an imperfect ellipse around the middle option (stroke-dashoffset, 700ms, in-out), then draw a curved arrow toward it and pop a handwritten-style note (“paling worth it!”) with a slight tilt.',
  });

  /* 17 Urgency pulse */
  demo({
    id: 'urgency-pulse', cat: CAT, name: 'Urgency Pulse', aka: ['Low stock indicator', 'Gentle urgency', 'Attention pulse'],
    tags: P.concat('ui'), char: ['Honest', 'Calm', 'Attention'],
    what: 'A small “stock terbatas” pill breathes with a soft ring pulse and the stock bar shows a real remaining amount. Urgency is communicated calmly and truthfully — attention without pressure.',
    good: ['Genuinely limited stock or seats', 'Event tickets and pre-orders', 'Closing slots for services'],
    avoid: 'Fake scarcity, aggressive flashing red, or numbers that never change — those are dark patterns.',
    anatomy: ['Continuous loop', 'Pill + ring + stock bar', 'Ring scale 1 → 1.6 + fade; dot pulse; bar fills to the real value once', '1.6s pulse cycle', 'sine.out', 'Bar fills once → gentle pulse loop'],
    tracks: [['bar', 'Stock bar (real value)', 0.2, 0.8, 'expo.out', 'ui'], ['pulse', 'Gentle pulse loop', 0, 3.2, 'linear', 'fx']],
    dur: 3.2, poster: 1.2,
    cls: 'bg-ink',
    html: `<div class="stackc pad" style="gap:4cqmin"><div class="ad-urg"><i data-r="ring" class="ad-urg__ring"></i><span class="ad-urg__pill"><i data-r="dot"></i>Stok terbatas</span></div>
      <div class="ad-stock"><div class="ad-stock__top"><span>Tersisa 18 dari 100</span><b>82% terjual</b></div><div class="ad-stock__track"><i data-r="bar"></i></div></div>
      <span class="t-body" style="font-size:3.2cqmin;opacity:.6">Data stok diperbarui real time</span></div>`,
    render(t, c) {
      const u = (t % 1.6) / 1.6;
      c.set(c.$.ring, { s: lerp(1, 1.5, ease('sine.out')(u)), o: 0.55 * (1 - u) });
      c.set(c.$.dot, { o: 0.6 + 0.4 * Math.cos(u * Math.PI * 2) });
      c.set(c.$.bar, { sx: 0.82 * c.p.bar });
    },
    prompt: 'Show honest, tasteful urgency: a small “Stok terbatas” pill with a soft ring that pulses outward and fades every 1.6s (sine-out), and a stock bar that fills once to the real sold percentage with an expo-out ease. Avoid flashing, aggressive red or fake numbers.',
  });
})();
