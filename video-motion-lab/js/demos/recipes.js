/* 16 — Motion Recipes
   Complete mini compositions. Each one combines techniques from the
   categories above; the timeline is the lesson — read the overlaps,
   the holds and the order of importance. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, words, A } = window.VML;
  const CAT = 'recipes';
  const fadeUp = (c, el, p, d = 4) => c.set(el, { o: p, y: d * (1 - p) });
  const shake = (c, el, start, amp = 2, k = 10) => { const st = c.t - start, a = st > 0 ? Math.exp(-st * k) * amp : 0; c.set(el, { x: Math.sin(st * 85) * a, y: Math.cos(st * 67) * a }); };

  /* 01 Premium product ad */
  demo({
    id: 'recipe-premium-product', cat: CAT, name: 'Recipe 01 · Premium Product Ad', aka: ['Luxury packshot ad', 'Beauty product film'],
    tags: ['object', 'brand', 'social'], char: ['Premium', 'Controlled', 'Elegant'], covers: 8,
    what: 'A complete premium product spot in ~5s: light opens, the product rises with a subtle overshoot, the headline is revealed through masks, supporting copy and a benefit badge follow, the CTA lands, and everything resolves into an end card. Notice how each element starts before the previous finishes, and nothing competes with the product.',
    good: ['Beauty, skincare, fragrance', 'Premium tech accessories', 'Any hero product launch'],
    avoid: 'Adding bounce, fast cuts or many effects — premium is restraint plus timing.',
    anatomy: ['Scene time', 'Light, product, headline, copy, badge, CTA, end card', 'Light scale · rise + overshoot · masked lines · fade-ups · pop · end-card re-layout', '≈5.4s', 'premium / back.soft / expo.out', 'Background → product → headline → copy → badge → CTA → end card'],
    tracks: [['bg', 'Background reveal', 0, 0.9, 'sine.inOut', 'bg'], ['prod', 'Product entrance', 0.2, 1.0, 'back.soft', 'object'], ['head', 'Headline (masked) ×2', 0.7, 0.7, 'expo.out', { n: 2, each: 0.12, kind: 'text' }], ['copy', 'Supporting copy', 1.1, 0.6, 'premium', 'text'], ['badge', 'Benefit badge', 1.6, 0.45, 'back.out', 'ui'], ['cta', 'CTA', 2.3, 0.5, 'back.soft', 'cta'], ['hold', 'Hold (read)', '>', 0.7, 'linear'], ['end', 'End card', 3.5, 0.8, 'expo.inOut', 'brand'], ['endh', 'End hold', '>', 1.1, 'linear']],
    cls: 'bg-studio-warm',
    html: `<div class="center"><i data-r="light" class="ph-light"></i></div>
      <div data-r="main" class="fill">
        <div class="rc1-head"><span class="mask"><b data-r="hl" class="t-serif">Glow that</b></span><span class="mask"><b data-r="hl" class="t-serif"><i>lasts all day.</i></b></span>
          <p data-r="copy" class="t-body">Vitamin C 10% · niacinamide · 30 ml</p></div>
        <div class="center"><div data-r="prod" style="margin-top:16cqmin">${A.product('serum', { style: '--ph:56cqmin' })}</div></div>
        <div class="center"><span data-r="badge" class="badge badge--light rc1-badge">${A.icon('leaf')} Dermatologist tested</span></div>
        <div class="rc1-cta"><span data-r="cta" class="cta cta--light">Shop now ${A.icon('arrow')}</span></div>
      </div>
      <div data-r="endc" class="rc-end"><div data-r="endl">${A.logo({ word: 'SÉRA', sub: 'skincare' })}</div><span class="t-eyebrow">sera.example · free shipping</span></div>`,
    render(t, c) {
      c.set(c.$.light, { s: lerp(0.4, 1, c.p.bg), o: c.p.bg });
      const e = c.p.end;
      c.set(c.$.prod, { yh: lerp(60, 0, c.p.prod) - e * 12, s: lerp(1, 0.78, e), bright: lerp(0.4, 1, c.p.prod) });
      c.$$.hl.forEach((el, i) => c.set(el, { yp: 105 * (1 - c.st('head', i)) }));
      fadeUp(c, c.$.copy, c.p.copy, 3);
      c.set(c.$.badge, { s: c.p.badge, o: clamp(c.r.badge * 3) * (1 - e) });
      c.set(c.$.cta, { y: 4 * (1 - c.p.cta), o: c.p.cta * (1 - e) });
      c.set(c.$.main, { o: 1 });
      c.set(c.$$.hl[0].closest('.rc1-head'), { o: 1 - e, y: -4 * e });
      c.set(c.$.endc, { o: e, y: 6 * (1 - e) });
    },
    prompt: 'Create a premium 5–6 second vertical product ad. 0.0s: a soft pool of light opens behind the product. 0.2s: the product rises from below (1s, soft back-out with a subtle overshoot) and brightens from 40% to full. 0.7s: a two-line serif headline is revealed from overflow masks (expo-out, 120ms stagger). 1.1s: supporting copy fades up. 1.6s: a small benefit badge pops. 2.3s: the CTA lands. 3.5s: the headline, badge and CTA clear while the product scales to 0.78 and moves up, and an end card with the logo and URL fades in. Keep easing smooth and restrained, no bounce beyond the product’s settle.',
  });

  /* 02 Fast social hook */
  demo({
    id: 'recipe-fast-hook', cat: CAT, name: 'Recipe 02 · Fast Social Hook', aka: ['Reels opener', 'TikTok hook sequence'],
    tags: ['social', 'text', 'transition'], char: ['Energetic', 'Fast', 'Social'], covers: 5,
    what: 'The first ~2.5 seconds of a high-retention reel: a bold statement readable on frame 1, an impact scale on the beat, a photo punched in, a secondary line that sets up the promise, then a whip transition into the content. Count the beats: something new happens every 0.3–0.6s.',
    good: ['Openers for Reels, TikTok and Shorts', 'Paid social ads (first 3s)', 'Creator content intros'],
    avoid: 'Starting with a logo, a fade-in or anything that needs more than 1s to understand.',
    anatomy: ['Frame 1 → 2.6s', 'Statement, photo, secondary line, next scene', 'Impact scale + shake · photo punch · line slide · whip with blur', '≈2.6s', 'expo.out / punch / expo.inOut', 'Statement → impact → image punch → line → whip'],
    tracks: [['st', 'Big statement (frame 1)', 0, 0.2, 'linear', 'text'], ['imp', 'Impact scale', 0.2, 0.25, 'expo.out', 'text'], ['hit', 'Beat', 0.2, 0, 'linear', 'beat'], ['img', 'Image punch', 0.5, 0.28, 'expo.out', 'image'], ['b2', 'Beat', 0.5, 0, 'linear', 'beat'], ['sec', 'Secondary text', 0.8, 0.35, 'back.soft', 'text'], ['hold', 'Hold', '>', 0.25, 'linear'], ['wh', 'Whip transition', 1.4, 0.45, 'expo.inOut', 'fx'], ['next', 'Next scene', '>', 0.8, 'linear', 'image']],
    html: () => {
      const b = A.dirBlur();
      return `${b.html}<div data-r="strip" class="rc2-strip" data-filter="${b.id}">
        <div class="rc2-cell"><div data-r="pimg" class="fill">${A.photo('food', { cls: 'fill' })}</div><i data-r="dim" class="fill" style="background:#0e0e10"></i>
          <div class="stackc" data-r="stbox"><b data-r="stt" class="t-display rc2-st">Ini bukan<br/><span class="accent">iklan biasa.</span></b><span data-r="sec" class="badge badge--light" style="margin-top:4cqmin">Makan enak, Rp15 ribu</span></div></div>
        <div class="rc2-cell bg-yellow"><div class="stackc" style="gap:3cqmin"><b class="t-display" style="font-size:16cqmin;color:#1d1708">3 tempat<br/>wajib coba</b><span class="t-eyebrow" style="color:#1d1708">di Jakarta Selatan</span></div></div></div>`;
    },
    render(t, c) {
      c.set(c.$.stt, { s: lerp(1.25, 1, c.p.imp) });
      shake(c, c.$.stbox, 0.2, 1.6);
      const ip = c.r.img > 0;
      c.set(c.$.dim, { o: ip ? 0.45 : 1 });
      c.set(c.$.pimg, { s: ip ? lerp(1.35, 1.05, c.p.img) + (t - 0.5) * 0.03 : 1 });
      c.set(c.$.sec, { s: lerp(0.6, 1, c.p.sec), o: clamp(c.r.sec * 3) });
      c.set(c.$.strip, { xp: -50 * c.p.wh });
      A.setDirBlur(c, c.$.strip, c.$.mbf, c.speed('wh') * 2.4, 0);
    },
    prompt: 'Create a 2.5s vertical hook. Frame 1 already shows a bold two-line statement in heavy condensed type on a dark frame. 0.2s (beat): punch the statement from scale 1.25 to 1 with a short decaying shake. 0.5s (beat): cut the dark background to a food photo with a punch-in (scale 1.35 → 1.05, 280ms). 0.8s: pop a light badge with the promise. 1.4s: whip-pan (450ms, expo in-out, horizontal motion blur ∝ speed) into the next scene titled “3 tempat wajib coba”.',
  });

  /* 03 Fintech promotion */
  demo({
    id: 'recipe-fintech', cat: CAT, name: 'Recipe 03 · Banking / Fintech Promotion', aka: ['Bank promo', 'Savings product ad', 'Fintech campaign'],
    tags: ['ui', 'text', 'brand'], char: ['Premium', 'Reliable', 'Modern', 'Controlled'], covers: 7,
    what: 'A trustworthy fintech promo with generic data: a percentage hero counts up with a calm, damped motion; the phone UI slides in beside it; three benefits stack; a legal/disclaimer placeholder stays readable; the CTA and an end card close. No bounce, no flashing — reliability is communicated through controlled, predictable motion.',
    good: ['Savings, deposits, cards, payments', 'Insurance and investment (with compliance review)', 'B2B finance products'],
    avoid: 'Playful springs, glitch effects or fake urgency — they erode trust. Always include real legal copy in production.',
    anatomy: ['Scene time', 'Rate hero, phone, benefits, legal line, CTA, end card', 'Count-up · slide · stagger · fade · end-card re-layout', '≈7s', 'expo.out / premium / spring.damped', 'Hero rate → product UI → benefits → legal → CTA → end'],
    tracks: [['eyebrow', 'Eyebrow', 0.1, 0.5, 'premium', 'text'], ['rate', 'Rate counts to 6%', 0.3, 1.3, 'expo.out', 'text'], ['phone', 'Phone UI slides in', 1.2, 0.9, 'spring.damped', 'ui'], ['ben', 'Benefits ×3', 2.0, 0.5, 'premium', { n: 3, each: 0.18, kind: 'text' }], ['legal', 'Legal placeholder', 2.8, 0.5, 'premium', 'text'], ['cta', 'CTA', 3.2, 0.5, 'premium', 'cta'], ['hold', 'Hold', '>', 1, 'linear'], ['end', 'End card', 4.9, 0.8, 'smooth', 'brand'], ['endh', 'End hold', '>', 1.2, 'linear']],
    cls: 'bg-navy',
    html: `<div data-r="main" class="fill">
      <div class="rc3-top"><span data-r="eb" class="t-eyebrow">Tabungan berjangka</span><div data-r="rate" class="rc3-rate"><b data-r="rv">0.0</b><span>%<small>p.a.*</small></span></div></div>
      <div class="rc3-mid"><div data-r="ph">${A.phone(A.appHome({ amount: 'Rp 25.000.000' }), { style: '--pw:min(36cqw, 22cqh)' })}</div>
        <div class="rc3-ben">${['Bunga harian', 'Tanpa biaya admin', 'Cair kapan saja'].map((b) => `<div data-r="ben">${A.icon('check')}<span>${b}</span></div>`).join('')}</div></div>
      <div class="rc3-bot"><span data-r="cta" class="cta cta--light">Buka rekening ${A.icon('arrow')}</span><p data-r="legal" class="rc3-legal">*Ilustrasi. [Placeholder disclaimer & informasi regulator — wajib diisi dengan teks hukum asli.]</p></div></div>
      <div data-r="endc" class="rc-end bg-navy"><div>${A.logo({ cls: '', sub: 'finance' })}</div><span class="t-eyebrow">Aman · Transparan · Mudah</span><p class="rc3-legal">[Placeholder legal line]</p></div>`,
    render(t, c) {
      fadeUp(c, c.$.eb, c.p.eyebrow, 2);
      c.$.rv.textContent = (6 * c.p.rate).toFixed(1);
      c.set(c.$.rate, { o: clamp(c.r.rate * 4), s: lerp(0.92, 1, c.p.rate) });
      c.set(c.$.ph, { xw: lerp(-60, 0, c.p.phone), o: clamp(c.r.phone * 3) });
      c.$$.ben.forEach((el, i) => { const p = c.st('ben', i); c.set(el, { o: p, x: 4 * (1 - p) }); });
      c.set(c.$.legal, { o: c.p.legal * 0.8 });
      fadeUp(c, c.$.cta, c.p.cta, 3);
      c.set(c.$.main, { o: 1 - c.p.end });
      c.set(c.$.endc, { o: c.p.end });
    },
    prompt: 'Create a 7s vertical fintech promo with generic data and a premium, reliable feel (no bounce, no flashing). 0.1s eyebrow fades up; 0.3s the rate counts from 0.0 to 6.0% p.a. (1.3s, expo-out); 1.2s a phone with the app UI slides in with a damped spring; 2.0s three benefits stack with an 180ms stagger; 2.8s a legal/disclaimer placeholder fades in and stays readable; 3.2s the CTA fades up; 4.9s crossfade to an end card with logo, tagline and legal line.',
  });

  /* 04 Food product ad */
  const ING = [['Telur rebus', -1, -14], ['Daun bawang', 1, -4], ['Kuah kaldu 8 jam', -1, 8], ['Cabai segar', 1, 16]];
  demo({
    id: 'recipe-food', cat: CAT, name: 'Recipe 04 · Food Product Ad', aka: ['Menu ad', 'F&B promo', 'Food reel'],
    tags: ['image', 'social', 'object'], char: ['Appetising', 'Warm', 'Promo'], covers: 5,
    what: 'Appetite first, information second: the dish is revealed through a circle, the camera pushes in slowly the whole time, ingredient labels appear around the bowl with leader lines, then the price/promo badge and CTA land. The slow push keeps the food “alive” under all the graphics.',
    good: ['Restaurants and cloud kitchens', 'F&B delivery promos', 'Packaged food launches'],
    avoid: 'Covering the food with labels — keep labels at the edges with short lines.',
    anatomy: ['Scene time', 'Food photo, ingredient labels, price badge, CTA', 'Circle reveal · slow push-in · line + label stagger · badge pop · CTA', '≈6s', 'expo.inOut / sine / back.out', 'Reveal → labels → price → CTA (push-in throughout)'],
    tracks: [['rev', 'Food reveal (circle)', 0, 0.9, 'expo.inOut', 'image'], ['push', 'Slow push-in', 0, 6, 'sine.inOut', 'camera'], ['title', 'Title', 0.7, 0.6, 'expo.out', 'text'], ['ing', 'Ingredient labels ×4', 1.3, 0.5, 'expo.out', { n: 4, each: 0.25, kind: 'text' }], ['price', 'Price / promo', 2.9, 0.5, 'back.out', 'ui'], ['cta', 'CTA', 3.5, 0.5, 'back.soft', 'cta'], ['hold', 'Hold', '>', 1.6, 'linear']],
    dur: 6,
    cls: 'bg-ink',
    html: `${A.photo('food', { r: 'img', cls: 'fill' })}<i class="fill" style="background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.55))"></i>
      <div class="rc4-title" data-r="title"><span class="t-eyebrow">Menu baru</span><b class="t-display">Ramen<br/>Kuah Pedas</b></div>
      ${ING.map(([l, side, y]) => `<div class="center"><div data-r="ing" class="ad-ben ad-ben--${side > 0 ? 'r' : 'l'} rc4-ing" style="margin-top:${y * 2}cqmin"><i></i><span>${l}</span></div></div>`).join('')}
      <div class="rc4-bot"><div data-r="price" class="rc4-price"><small>Promo</small><b>Rp 35rb</b><s>Rp 48rb</s></div><span data-r="cta" class="cta">Pesan sekarang ${A.icon('arrow')}</span></div>`,
    render(t, c) {
      c.set(c.$.img, { clip: `circle(${lerp(0, 90, c.p.rev)}% at 50% 50%)`, s: lerp(1.05, 1.22, c.p.push) });
      c.set(c.$.title, { o: c.p.title, y: -3 * (1 - c.p.title) });
      c.$$.ing.forEach((el, i) => { const p = c.st('ing', i); c.set(el.querySelector('i'), { sx: p }); c.set(el.querySelector('span'), { o: p, x: ING[i][1] * -3 * (1 - p) }); });
      c.set(c.$.price, { s: c.p.price, r: lerp(-12, -4, c.p.price), o: clamp(c.r.price * 3) });
      c.set(c.$.cta, { o: c.p.cta, y: 4 * (1 - c.p.cta) });
    },
    prompt: 'Create a 6s food ad. 0.0s: reveal the dish through an expanding circle (900ms, expo in-out) while a slow push-in (scale 1.05 → 1.22, sine in-out) runs for the whole video. 0.7s: the dish name drops in at the top. 1.3s: four ingredient labels appear around the bowl, alternating left and right — each leader line grows from the bowl edge, then its label slides in (250ms stagger). 2.9s: a tilted promo price badge pops (back-out). 3.5s: the CTA lands. Keep labels at the edges so the food stays visible.',
  });

  /* 05 App feature demo */
  demo({
    id: 'recipe-app-demo', cat: CAT, name: 'Recipe 05 · App Feature Demo', aka: ['App walkthrough', 'Feature reel', 'Product demo'],
    tags: ['ui', 'social'], char: ['Clear', 'Product', 'Modern'], covers: 6,
    what: 'Show one feature end to end: the device enters, a callout names the feature, a tap triggers it, the UI transitions (a sheet opens), a highlight points at the result, and the CTA closes. Each step has a cause and an effect — the viewer understands the feature without reading a manual.',
    good: ['App launches and feature updates', 'App-store preview videos', 'Onboarding content'],
    avoid: 'Showing five features in one 6s video — one feature per video, or chapters.',
    anatomy: ['Scene time', 'Phone, callout, touch indicator, sheet, spotlight, CTA', 'Device rise · label · tap ripple · sheet spring · spotlight · CTA', '≈6.6s', 'back.soft / spring.damped / expo.out', 'Device → callout → tap → UI change → highlight → CTA'],
    tracks: [['dev', 'Device entrance', 0, 0.9, 'back.soft', 'ui'], ['call', 'Feature callout', 0.8, 0.5, 'premium', 'text'], ['move', 'Finger moves', 1.4, 0.6, 'smooth', 'cta'], ['tap', 'Tap', '>', 0.15, 'out', 'cta'], ['rip', 'Ripple', '<', 0.5, 'expo.out', 'fx'], ['sheet', 'UI transition (sheet)', '<0.1', 0.7, 'spring.damped', 'ui'], ['hl', 'Highlight result', '>', 0.6, 'back.soft', 'fx'], ['hold', 'Hold', '>', 0.9, 'linear'], ['cta', 'CTA', '>', 0.5, 'back.soft', 'cta'], ['endh', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-lilac',
    html: `<div class="rc5-call" data-r="call"><span class="t-eyebrow">Fitur baru</span><b class="t-sans">Bagi tagihan<br/>dalam 1 ketukan</b></div>
      <div class="center" style="padding-top:8cqmin"><div data-r="pw" style="position:relative">${A.phone(A.appHome() + `<i data-r="dim" class="pu-dim"></i><div data-r="panel" class="pu-sheet"><i class="pu-grab"></i><b class="pu-sheet__title">Bagi tagihan</b><div class="pu-opt on">${A.icon('user')}<span>Dina · Rp 62.500</span><i></i></div><div class="pu-opt on">${A.icon('user')}<span>Raka · Rp 62.500</span><i></i></div><div data-r="hl" class="rc5-hl">Terkirim ke 2 teman ✓</div></div>`, { style: '--pw:min(52cqw, 34cqh)' })}
        <i data-r="ripple" class="pu-ripple"></i><i data-r="finger" class="pu-finger pu-finger--tap"></i></div></div>
      <div class="rc5-cta"><span data-r="cta" class="cta cta--dark">Coba sekarang ${A.icon('arrow')}</span></div>`,
    init(c) { c.data.target = c.$$['app-act'][0]; },
    resize(c) {
      if (!c.data.target) return;
      const b = c.$.pw.getBoundingClientRect(), r = c.data.target.getBoundingClientRect();
      if (!b.width) return;
      c.data.tx = ((r.left + r.width / 2 - b.left) / b.width) * 100; c.data.ty = ((r.top + r.height * 0.35 - b.top) / b.height) * 100;
      Object.assign(c.$.ripple.style, { left: (r.left - b.left) / b.width * 100 + '%', top: (r.top - b.top) / b.height * 100 + '%', width: r.width / b.width * 100 + '%', height: r.width / b.height * 100 + '%' });
    },
    render(t, c) {
      if (c.data.tx == null) this.resize(c);
      c.set(c.$.pw, { yh: lerp(70, 0, c.p.dev), r: lerp(8, 0, c.p.dev) });
      fadeUp(c, c.$.call, c.p.call, 3);
      const tx = c.data.tx || 20, ty = c.data.ty || 40;
      c.$.finger.style.left = lerp(tx + 35, tx, c.p.move) + '%';
      c.$.finger.style.top = lerp(ty + 40, ty, c.p.move) + '%';
      const pressed = c.r.tap > 0 && c.r.tap < 1;
      c.set(c.$.finger, { s: pressed ? 0.8 : 1, o: c.r.move > 0 && c.r.sheet < 0.3 ? 1 : 0 });
      c.set(c.data.target, { s: pressed ? 0.88 : 1 });
      c.set(c.$.ripple, { s: lerp(0.3, 2, c.p.rip), o: c.r.rip > 0 && c.r.rip < 1 ? 1 - c.p.rip : 0 });
      c.set(c.$.dim, { o: 0.5 * c.p.sheet });
      c.set(c.$.panel, { yp: 105 * (1 - c.p.sheet) });
      c.set(c.$.hl, { s: lerp(0.8, 1, c.p.hl), o: c.p.hl });
      fadeUp(c, c.$.cta, c.p.cta, 3);
    },
    prompt: 'Create a 6–7s app feature demo. 0.0s: the phone rises in (back-out, 900ms). 0.8s: a short callout names the feature above it. 1.4s: a touch indicator glides to the action button (600ms), taps (button scales 0.88, ripple expands), and a bottom sheet springs up with the result (damped spring). Then a confirmation chip inside the sheet pops as the highlight, hold ~1s, and finish with a CTA below the phone.',
  });

  /* 06 Editorial reel */
  const ED = [['portrait', 'The quiet', 'season'], ['interior', 'Rooms that', 'breathe'], ['fabric', 'Colour as', 'memory']];
  demo({
    id: 'recipe-editorial', cat: CAT, name: 'Recipe 06 · Editorial Reel', aka: ['Magazine reel', 'Lookbook reel', 'Fashion editorial'],
    tags: ['image', 'text'], char: ['Editorial', 'Elegant', 'Slow'], covers: 5,
    what: 'Bold serif typography, photography and elegant masks with slow camera motion: three chapters, each revealed through a rising arch mask while the image pushes in very slowly and a two-line serif title slides out of its own mask. Long holds give the page-turning rhythm of a magazine.',
    good: ['Fashion, interiors, hospitality', 'Brand storytelling and lookbooks', 'Portfolio reels'],
    avoid: 'Fast cuts or punchy effects — the luxury here is time.',
    anatomy: ['Scene time', 'Three photos, arch masks, serif titles, page counter', 'Arch clip rise · slow push · masked title lines · crossfades', '≈7.5s (2.5s per chapter)', 'expo.inOut / sine', 'Chapter 1 → 2 → 3, each: mask → title → hold'],
    tracks: ED.flatMap((_, i) => [[`m${i}`, `Chapter ${i + 1} mask`, i * 2.5, 1.0, 'expo.inOut', 'image'], [`t${i}`, `Title ${i + 1} ×2`, i * 2.5 + 0.6, 0.8, 'expo.out', { n: 2, each: 0.12, kind: 'text' }]]).concat([['push', 'Slow push (continuous)', 0, 7.5, 'linear', 'camera']]),
    dur: 7.5,
    cls: 'bg-cream',
    html: ED.map(([img, a, b], i) => `<div class="fill" data-r="ch"><div class="rc6-arch" data-r="arch">${A.photo(img, { r: 'eimg', cls: 'fill' })}</div>
      <div class="rc6-title"><span class="mask"><b data-r="tl${i}" class="t-serif">${a}</b></span><span class="mask"><b data-r="tl${i}" class="t-serif"><i>${b}</i></b></span></div>
      <span class="rc6-num t-mono">0${i + 1} / 03</span></div>`).join(''),
    render(t, c) {
      c.$$.ch.forEach((el, i) => {
        const p = c.p['m' + i];
        const vis = c.r['m' + i] > 0 && (i === 2 || c.r['m' + (i + 1)] < 0.5);
        c.set(el, { o: vis ? 1 : 0, css: { zIndex: i } });
        c.set(c.$$.arch[i], { clip: `inset(${lerp(100, 0, p)}% 0 0 0 round 50cqmin 50cqmin 1cqmin 1cqmin)` });
        c.set(c.$$.eimg[i], { s: 1.18 - p * 0.08 + (t - i * 2.5) * 0.012 });
        (c.$$['tl' + i] || []).forEach((tl, j) => c.set(tl, { yp: 105 * (1 - c.st('t' + i, j)) }));
      });
    },
    prompt: 'Create a 7.5s editorial reel in three 2.5s chapters on a cream background. Each chapter: a photo is revealed through an arch-shaped mask rising from the bottom (inset clip with large top radius, 1s, expo in-out) while the photo pushes in very slowly the whole time; 0.6s later a two-line serif title (second line italic) slides out of overflow masks (expo-out, 120ms stagger); a small page counter sits in a corner. Chapters stack on top of each other — no flashy transitions.',
  });

  /* 07 Energetic promo */
  const EP = [['dunes', '#ef4b36'], ['city', '#3e63dd'], ['coffee', '#f2c14e']];
  demo({
    id: 'recipe-energetic', cat: CAT, name: 'Recipe 07 · Energetic Promo', aka: ['Hype promo', 'Sale blast', 'Fast montage'],
    tags: ['social', 'transition', 'text'], char: ['Energetic', 'Loud', 'Rhythmic'], covers: 5,
    what: 'Fast cuts on every beat, image scale punches, a number impact with shake, shape bursts on the hits and a fast final card. Energy comes from rhythm (0.45s cuts) and contrast (colour blocks between photos), not from adding more effects per shot.',
    good: ['Flash sales and campaign launches', 'Events, sports and youth brands', 'Short paid-social cutdowns'],
    avoid: 'Using this pacing for premium or trust-sensitive brands; and cutting faster than viewers can read the key number.',
    anatomy: ['Beat grid (0.45s)', 'Three photos, colour cards, number, bursts, final CTA', 'Hard cuts · punch-ins · slam + shake · radial burst · final pop', '≈4.4s', 'expo.out / punch', 'Cut-cut-cut → NUMBER (hold) → CTA card'],
    tracks: EP.map((_, i) => [`c${i}`, `Cut ${i + 1} + punch`, i * 0.45, 0.25, 'expo.out', 'image']).concat(EP.map((_, i) => [`b${i}`, 'Beat', i * 0.45, 0, 'linear', 'beat'])).concat([['num', '50% slam', 1.35, 0.3, 'expo.out', 'text'], ['bn', 'Beat', 1.35, 0, 'linear', 'beat'], ['burst', 'Shape burst', '<', 0.6, 'expo.out', 'fx'], ['nh', 'Hold the number', '>', 0.9, 'linear'], ['card', 'Final card', 2.85, 0.35, 'back.out', 'cta'], ['bc', 'Beat', 2.85, 0, 'linear', 'beat'], ['hold', 'Hold', '>', 1.2, 'linear']]),
    html: `${EP.map(([img]) => `<div data-r="sh" class="fill">${A.photo(img, { r: 'simg', cls: 'fill' })}</div>`).join('')}
      <div data-r="nscene" class="fill bg-red"><div class="center">${Array.from({ length: 12 }, (_, i) => `<i data-r="bst" class="burst burst--${i % 3}" style="background-color:${i % 3 === 2 ? '' : '#fff'}"></i>`).join('')}</div>
        <div class="stackc"><b data-r="num" class="t-display rc7-num">50%</b><span class="badge badge--light">Semua item · 3 hari</span></div></div>
      <div data-r="card" class="fill bg-ink"><div class="stackc" style="gap:4cqmin"><b class="t-display" style="font-size:16cqmin">Mega<br/><span class="accent">Sale</span></b><span class="cta">Belanja sekarang ${A.icon('arrow')}</span></div></div>
      <i data-r="flash" class="flash"></i>`,
    render(t, c) {
      let cur = -1;
      EP.forEach((_, i) => { if (c.r['c' + i] > 0) cur = i; });
      const numOn = c.r.num > 0, cardOn = c.r.card > 0;
      c.$$.sh.forEach((el, i) => { c.set(el, { o: i === cur && !numOn ? 1 : 0 }); c.set(c.$$.simg[i], { s: lerp(1.35, 1, c.p['c' + i]) }); });
      c.set(c.$.nscene, { o: numOn && !cardOn ? 1 : 0 });
      c.set(c.$.num, { s: lerp(2.6, 1, c.p.num) });
      shake(c, c.$.num, 1.35 + 0.3, 2.4);
      const bp = c.p.burst;
      c.$$.bst.forEach((el, i) => { const a = (i / 12) * Math.PI * 2; c.set(el, { x: Math.cos(a) * lerp(20, 50, bp), y: Math.sin(a) * lerp(20, 50, bp), r: (a * 180) / Math.PI, s: 1 - bp * 0.7, o: c.r.burst > 0 && c.r.burst < 1 ? 1 : 0 }); });
      c.set(c.$.card, { o: cardOn ? 1 : 0, s: cardOn ? lerp(1.2, 1, c.p.card) : 1 });
      let f = 0;
      [0, 0.45, 0.9, 1.35, 2.85].forEach((b) => { if (t >= b && t < b + 0.12) f = 0.35 * (1 - (t - b) / 0.12); });
      c.set(c.$.flash, { o: f });
    },
    prompt: 'Create a 4–5s energetic promo on a 0.45s beat grid: three hard cuts between photos, each punching in from scale 1.35 to 1 with a short white flash; on the fourth beat cut to a red card where “50%” slams from scale 2.6 to 1 with a shake and a radial shape burst, hold it ~0.9s so it can be read, then cut to a dark final card with “MEGA SALE” and the CTA popping in on the next beat.',
  });

  /* 08 Cinematic brand piece */
  demo({
    id: 'recipe-cinematic', cat: CAT, name: 'Recipe 08 · Cinematic Brand Piece', aka: ['Brand film', 'Mood film', 'Manifesto film'],
    tags: ['camera', 'brand', 'image'], char: ['Cinematic', 'Atmospheric', 'Slow'], covers: 6,
    what: 'Ambient movement (layered landscape with parallax), a continuous camera push, subtle typography that fades in and out, film grain and letterbox, slow crossfades between two worlds, and a logo outro. Everything moves, but slowly — the mood is the message.',
    good: ['Brand manifestos and campaign films', 'Tourism, outdoor and lifestyle brands', 'Opening films for events'],
    avoid: 'Fast cuts or loud graphics; and text that appears/disappears faster than it can be read.',
    anatomy: ['Scene time', 'Landscape layers, city photo, two lines, grain, bars, logo', 'Dolly push + drift · fade titles · crossfade · letterbox · grain · logo outro', '≈8.4s', 'sine.inOut / smooth', 'World A + line 1 → crossfade → world B + line 2 → logo outro'],
    tracks: [['bars', 'Letterbox in', 0, 1, 'smooth', 'fx'], ['push', 'Camera push (continuous)', 0, 8.4, 'sine.inOut', 'camera'], ['l1', 'Line 1 in', 0.8, 1, 'sine.inOut', 'text'], ['l1o', 'Line 1 out', 2.8, 0.8, 'sine.inOut', 'text'], ['x', 'Slow crossfade', 3.2, 1.2, 'smooth', 'fx'], ['l2', 'Line 2 in', 4.4, 1, 'sine.inOut', 'text'], ['l2o', 'Line 2 out', 6.0, 0.7, 'sine.inOut', 'text'], ['logo', 'Logo outro', 6.4, 1, 'smooth', 'brand'], ['hold', 'Hold', '>', 1, 'linear']],
    dur: 8.4,
    html: `${A.landscape()}<div data-r="cityw" class="fill">${A.photo('city', { r: 'city', cls: 'fill' })}</div>
      <div class="stackc rc8-line"><b data-r="l1" class="t-serif"><i>Every place</i> has a pace.</b></div>
      <div class="stackc rc8-line"><b data-r="l2" class="t-serif">Find <i>yours.</i></b></div>
      <div data-r="lw" class="stackc rc8-logo"><div>${A.logo({ cls: '', sub: 'journeys' })}</div></div>
      <i data-r="grain" class="grain"></i><i data-r="bt" class="bars bars--top" style="height:9%"></i><i data-r="bb" class="bars bars--bot" style="height:9%"></i>`,
    render(t, c) {
      const z = lerp(0, 0.6, c.p.push), drift = Math.sin(t * 0.4) * 1.2;
      [['ly-sky', 1e6], ['ly-sun', 1e5], ['ly-far', 12], ['ly-mid', 7], ['ly-near', 4.5], ['ly-subject', 3], ['ly-fg', 1.6]].forEach(([k, L]) => {
        const d = L - z; c.set(c.$[k], { s: L / d * 1.04, x: -drift * 3 / d });
      });
      c.set(c.$.cityw, { o: c.p.x });
      c.set(c.$.city, { s: lerp(1.08, 1.2, c.p.push) });
      c.set(c.$.l1, { o: c.p.l1 * (1 - c.p.l1o), y: 2 * (1 - c.p.l1) });
      c.set(c.$.l2, { o: c.p.l2 * (1 - c.p.l2o), y: 2 * (1 - c.p.l2) });
      c.set(c.$.lw, { o: c.p.logo, css: { background: `rgba(10,10,12,${(c.p.logo * 0.85).toFixed(2)})` } });
      c.set(c.$.bt, { yp: -100 * (1 - c.p.bars) }); c.set(c.$.bb, { yp: 100 * (1 - c.p.bars) });
      const f = Math.floor(t * 24); c.set(c.$.grain, { o: 0.4, xp: (hash(f) - 0.5) * 20, yp: (hash(f + 3) - 0.5) * 20 });
    },
    prompt: 'Create an 8s cinematic brand piece. Thin letterbox bars slide in during the first second; film grain runs throughout. A layered landscape is filmed with a continuous slow dolly push (sine in-out over the whole duration) plus gentle drift parallax. 0.8s: a serif line fades in and out slowly (1s in, hold, 0.8s out). 3.2s: slowly crossfade (1.2s) into a city world that keeps pushing in. 4.4s: a second line fades in and out. 6.4s: darken and resolve the logo for the outro.',
  });

  /* 09 Infographic explainer */
  demo({
    id: 'recipe-infographic', cat: CAT, name: 'Recipe 09 · Infographic Explainer', aka: ['Data explainer', 'Explainer reel', 'Stats story'],
    tags: ['text', 'object'], char: ['Clear', 'Explanatory', 'Structured'], covers: 5,
    what: 'An explainer built in reading order: a question title, three numbered steps with counters, a bar chart that grows, an arrow and a callout that interprets the result. Every element appears when the voiceover would mention it, and the earlier elements dim so attention moves forward.',
    good: ['Educational and finance explainers', 'Reports and research highlights', 'Product “how it works” videos'],
    avoid: 'Showing all data at once; reveal in the order of the argument.',
    anatomy: ['Scene time (voiceover cadence)', 'Title, three steps, chart, arrow, callout', 'Fade-ups · counters · bars grow · arrow draw · callout pop · dim previous', '≈7s', 'premium / expo.out / back.out', 'Question → steps (counts) → chart → arrow → insight'],
    tracks: [['title', 'Question title', 0.1, 0.6, 'premium', 'text'], ['st', 'Steps ×3 (with counters)', 0.7, 0.6, 'expo.out', { n: 3, each: 0.5, kind: 'text' }], ['dim', 'Dim steps', 2.6, 0.5, 'smooth', 'fx'], ['bars', 'Chart bars ×4', 2.7, 0.7, 'expo.out', { n: 4, each: 0.12, kind: 'object' }], ['arrow', 'Arrow', 3.8, 0.5, 'inOut', 'fx'], ['call', 'Insight callout', 4.2, 0.5, 'back.out', 'text'], ['hold', 'Hold', '>', 1.8, 'linear']],
    dur: 6.6,
    cls: 'bg-paper',
    html: `<div class="rc9"><b data-r="title" class="t-sans rc9-title">Berapa hasil nabung<br/>Rp500rb / bulan?</b>
      <div class="rc9-steps">${[['01', 'Setor rutin', 500, 'rb/bln'], ['02', 'Bunga', 4, '% p.a.'], ['03', 'Dalam', 3, 'tahun']].map(([n, l, v, u]) => `<div data-r="step" class="rc9-step"><span>${n}</span><small>${l}</small><b><em data-r="sv" data-v="${v}">0</em>${u}</b></div>`).join('')}</div>
      <div class="rc9-chart">${[25, 48, 72, 100].map((v, i) => `<div class="rc9-bar"><i data-r="bar" style="height:${v}%"></i><span>Th ${i}</span></div>`).join('')}
        <svg class="rc9-arrow" viewBox="0 0 100 60"><path data-r="arrow" d="M8 52 C 30 48, 60 30, 88 8 M88 8 L76 10 M88 8 L86 20" pathLength="1" stroke-dasharray="1 1"/></svg>
        <span data-r="call" class="badge badge--dark rc9-call">≈ Rp19 jt di tahun ke-3</span></div></div>`,
    render(t, c) {
      fadeUp(c, c.$.title, c.p.title, 3);
      const dim = c.p.dim;
      c.$$.step.forEach((el, i) => { const p = c.st('st', i); c.set(el, { o: p * lerp(1, 0.45, dim), y: 3 * (1 - p) }); const sv = c.$$.sv[i]; sv.textContent = Math.round(+sv.dataset.v * p); });
      c.$$.bar.forEach((el, i) => c.set(el, { sy: c.st('bars', i) }));
      c.set(c.$.arrow, { dash: 1 - c.p.arrow });
      c.set(c.$.call, { s: c.p.call, o: clamp(c.r.call * 3) });
    },
    prompt: 'Create a ~6.5s infographic explainer: a question title fades up; three numbered steps appear one per 0.5s with their numbers counting up; when the chart starts, dim the steps to 45%; four bars grow from a shared baseline (expo-out, 120ms stagger); an arrow draws along the trend; and an insight callout pops (back-out). Hold the final frame ~2s for reading.',
  });

  /* 10 Seamless social loop */
  demo({
    id: 'recipe-loop', cat: CAT, name: 'Recipe 10 · Seamless Social Loop', aka: ['Perfect loop reel', 'Infinite reel', 'Loop edit'],
    tags: ['social', 'transition', 'object'], char: ['Satisfying', 'Clever', 'Social'], covers: 3,
    what: 'A product travels through three colour worlds and arrives back exactly where it started: same position, same scale, same background, same angle. Because the last frame equals the first, the auto-replay is invisible — viewers often watch twice, which platforms reward with more distribution.',
    good: ['Reels, TikTok and Shorts (auto-replay)', 'Product showcase loops', 'Satisfying / ASMR-style edits'],
    avoid: 'A “nearly” matching end frame — a small jump at the seam is more noticeable than a clear ending.',
    anatomy: ['Loop', 'Product + three background worlds + words', 'Product pushes through; backgrounds wipe; product spins 360° per world', '≈4.5s; last frame = frame 1', 'expo.inOut', 'World A → B → C → A (= frame 1)'],
    tracks: [['h0', 'World A', 0, 0.7, 'linear', 'bg'], ['w1', 'Wipe to B', '>', 0.6, 'expo.inOut', 'fx'], ['h1', 'World B', '>', 0.6, 'linear', 'bg'], ['w2', 'Wipe to C', '>', 0.6, 'expo.inOut', 'fx'], ['h2', 'World C', '>', 0.6, 'linear', 'bg'], ['w3', 'Wipe back to A', '>', 0.6, 'expo.inOut', 'fx'], ['h3', 'World A (= frame 1)', '>', 0.7, 'linear', 'bg'], ['seam', 'Loop seam', '>', 0, 'linear', 'cut']],
    noLoop: false,
    html: `${['#ef4b36', '#3e63dd', '#f2c14e', '#ef4b36'].map((col, i) => `<div data-r="w" class="fill" style="background:${col}"><div class="stackc"><b class="t-display rc10-word" style="color:${i === 2 ? '#1d1708' : '#fff'}">${['Fresh', 'Fizzy', 'Zero', 'Fresh'][i]}</b></div></div>`).join('')}
      <div class="center"><div data-r="prod">${A.product('can', { style: '--ph:58cqmin' })}</div></div>
      <span data-r="seam" class="tag tag--light" style="left:50%;bottom:5cqmin;transform:translateX(-50%)">last frame = first frame</span>`,
    render(t, c) {
      const ws = [1, c.p.w1, c.p.w2, c.p.w3];
      c.$$.w.forEach((el, i) => c.set(el, { clip: i === 0 ? 'none' : `inset(0 0 0 ${100 - ws[i] * 100}%)` }));
      const turns = c.p.w1 + c.p.w2 + c.p.w3;
      const mov = c.speed('w1') + c.speed('w2') + c.speed('w3');
      c.set(c.$.prod, { r: turns * 360, s: 1 - Math.min(0.15, mov * 0.04) });
      c.set(c.$.seam, { o: t < 0.3 || t > c.dur - 0.4 ? 1 : 0 });
    },
    prompt: 'Create a seamless 4.5s loop for Reels: the product stays centred while three colour worlds wipe in from the right (600ms, expo in-out, with a word per world). During each wipe the product spins exactly 360° and dips slightly in scale, so at the end it is back at 0° in world A with the same word — the last frame is identical to the first, making the auto-replay invisible.',
  });
})();
