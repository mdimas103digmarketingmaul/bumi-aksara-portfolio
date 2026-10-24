/* 11 — Social Media Hooks
   Openers for Reels / TikTok / Shorts. Rule of thumb used throughout:
   frame 1 already works as a still (thumbnail), and something visibly
   changes within the first second. Copy is Indonesian, generic. */
(function () {
  'use strict';
  const { demo, lerp, clamp, ease, bump, hash, words, A } = window.VML;
  const CAT = 'hooks';
  const H = ['social', 'text'];
  const shake = (c, el, start, amp = 2.2, k = 10) => {
    const st = c.t - start, a = st > 0 ? Math.exp(-st * k) * amp : 0;
    c.set(el, { x: Math.sin(st * 85) * a, y: Math.cos(st * 67) * a });
  };

  /* 01 Big question */
  demo({
    id: 'hook-question', cat: CAT, name: 'Big Question Hook', aka: ['Question opener', 'Curiosity hook', 'Did you know?'],
    tags: H, char: ['Energetic', 'Conversational', 'Social'],
    what: 'A huge question fills the frame on the very first frame, then each word punches in harder and the question mark swings. Questions open a curiosity gap — the viewer stays to get the answer.',
    good: ['Educational and tips content', 'Myth-busting and “fakta” videos', 'Finance, health and how-to creators'],
    avoid: 'Questions with an obvious answer, or answering it too late (after ~5s viewers leave).',
    anatomy: ['First frame', 'Two-line question + subline', 'Words scale punch 1.25 → 1 · “?” rotation spring · subline slide', 'Punch 0.25s each · ? 0.6s', 'expo.out / spring.wobbly', 'Frame 1 already readable → punches → subline promise'],
    tracks: [['w1', 'TAHU', 0, 0.25, 'expo.out'], ['w2', 'NGGAK', 0.25, 0.25, 'expo.out'], ['q', '“?” swing', 0.45, 0.7, 'spring.wobbly'], ['sub', 'Promise line', 0.8, 0.45, 'back.soft'], ['hold', 'Hold', '>', 1.2, 'linear']],
    cls: 'bg-yellow',
    html: `<div class="stackc"><div class="hk-q t-display"><span data-r="w1">Tahu</span><span data-r="w2">Nggak<i data-r="q" class="hk-qm">?</i></span></div>
      <span data-r="sub" class="badge badge--dark" style="margin-top:4cqmin">3 fakta soal tabungan kamu</span></div>`,
    render(t, c) {
      c.set(c.$.w1, { s: lerp(1.25, 1, c.p.w1) });
      c.set(c.$.w2, { s: lerp(1.25, 1, c.p.w2), o: t > 0.2 ? 1 : 0.15 });
      c.set(c.$.q, { r: lerp(-35, 8, c.p.q), s: lerp(0.6, 1, c.p.q) });
      c.set(c.$.sub, { s: lerp(0.7, 1, c.p.sub), o: c.p.sub });
    },
    prompt: 'Create a big-question hook for a 9:16 reel: the question “TAHU NGGAK?” in a heavy condensed font fills the frame and is readable from frame 1. Punch each word from scale 1.25 to 1 (250ms, expo-out) on consecutive beats, swing the question mark in with a wobbly spring, then pop a dark promise badge (“3 fakta soal tabungan kamu”) within the first second.',
  });

  /* 02 Big number */
  demo({
    id: 'hook-number', cat: CAT, name: 'Big Number Hook', aka: ['Stat hook', 'Money hook', 'Number opener'],
    tags: H, char: ['Energetic', 'Bold', 'Promo'],
    what: 'A big, concrete number is the hook: it counts up fast, slams to its final value with a shake, and a short line explains it. Specific numbers (Rp1 JUTA, 10%) stop the scroll better than vague claims.',
    good: ['Savings, earnings and results content', 'Promos and giveaways', 'Case studies'],
    avoid: 'Numbers you cannot substantiate; and unreadable fast counting — land the final number early.',
    anatomy: ['First frame', 'Number, unit, explanation', 'Count 0.45s → slam scale 1.3 → 1 + shake → line slide', 'Count 0.45s · slam 0.25s · line 0.4s', 'expo.out / punch', 'Count → slam (beat) → context'],
    tracks: [['count', 'Fast count', 0, 0.45, 'expo.out'], ['slam', 'Slam', '>', 0.25, 'expo.out'], ['hit', 'Impact', '<', 0, 'linear', 'beat'], ['line', 'Context line', '<0.15', 0.4, 'back.soft'], ['hold', 'Hold', '>', 1.3, 'linear']],
    cls: 'bg-green',
    html: `<div data-r="fr" class="stackc"><span class="t-eyebrow" style="color:#7fd1b0">Hasil nabung 30 hari</span><b data-r="num" class="t-display hk-num">Rp0</b><span data-r="line" class="badge badge--light">tanpa potong gaji</span></div>`,
    render(t, c) {
      const v = Math.round(lerp(0, 1000000, c.p.count));
      c.$.num.textContent = c.r.slam > 0 ? 'Rp1 JUTA' : 'Rp' + v.toLocaleString('id-ID');
      c.set(c.$.num, { s: c.r.slam > 0 ? lerp(1.3, 1, c.p.slam) : 1 });
      shake(c, c.$.fr, c.tl.map.slam.start);
      c.set(c.$.line, { o: c.p.line, s: lerp(0.7, 1, c.p.line) });
    },
    prompt: 'Create a big-number hook: in the first 0.45s count rapidly from Rp0 up toward Rp1.000.000, then snap to the final “Rp1 JUTA” with a slam (scale 1.3 → 1, 250ms) and a short decaying shake on the beat, then pop a context badge. Keep the number large and centred from frame 1.',
  });

  /* 03 Problem hook */
  demo({
    id: 'hook-problem', cat: CAT, name: 'Problem Hook', aka: ['Pain point hook', 'Callout hook', '“Masih…?” hook'],
    tags: H, char: ['Direct', 'Energetic', 'Persuasive'],
    what: 'Name the viewer’s problem in their own words, then hit it visually: the word “MAHAL” shakes and turns red while price tags pile up. Recognition (“that’s me”) is the strongest reason to keep watching.',
    good: ['Product ads solving a pain point', 'Fintech, telco and e-commerce promos', 'Before/after narratives'],
    avoid: 'Shaming or fear-mongering; keep it relatable and light.',
    anatomy: ['First frame', 'Question lines, price tags, highlight', 'Line slide; tag drops with rotation; word shake + colour', '0.3s lines · tags 0.35s @120ms · shake 0.4s', 'expo.out / back.out', 'Problem → evidence → emphasis'],
    tracks: [['l1', 'MASIH BAYAR', 0, 0.3, 'expo.out'], ['l2', 'MAHAL?', 0.15, 0.3, 'expo.out'], ['tags', 'Price tags ×3', 0.35, 0.35, 'back.out', { n: 3, each: 0.12 }], ['hit', 'Emphasis', 0.75, 0.4, 'linear', 'fx'], ['hold', 'Hold', '>', 1.3, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc"><div class="hk-prob t-display"><span data-r="l1">Masih bayar</span><span data-r="l2" class="hk-prob__hot">mahal?</span></div>
      <div class="hk-tags">${['Rp 89.000/bln', 'Admin Rp 6.500', 'Biaya transfer'].map((s) => `<span data-r="tag" class="hk-tag">${s}</span>`).join('')}</div></div>`,
    render(t, c) {
      c.set(c.$.l1, { xp: -60 * (1 - c.p.l1) });
      c.set(c.$.l2, { xp: 60 * (1 - c.p.l2), o: t > 0.1 ? 1 : 0.2 });
      c.$$.tag.forEach((el, i) => { const p = c.st('tags', i); c.set(el, { y: -20 * (1 - p), r: [-8, 6, -3][i] * p + 20 * (1 - p), o: clamp(p * 3) }); });
      const hot = c.r.hit > 0;
      c.$.l2.style.color = hot ? '#ef4b36' : '';
      const st = t - c.tl.map.hit.start, a = st > 0 && st < 0.4 ? (1 - st / 0.4) * 1.6 : 0;
      c.set(c.$.l2, { xp: 60 * (1 - c.p.l2), x: Math.sin(st * 90) * a, r: Math.sin(st * 60) * a * 0.8 });
    },
    prompt: 'Create a problem hook: “MASIH BAYAR / MAHAL?” in heavy type, readable from frame 1, with the two lines sliding in from opposite sides in the first 0.3s. Drop three generic fee tags around it with a back-out ease and slight rotations, then on the next beat shake “MAHAL?” for 0.4s and switch it to red.',
  });

  /* 04 Statement hook */
  demo({
    id: 'hook-statement', cat: CAT, name: 'Statement Hook', aka: ['Bold claim', 'Hot take', 'Manifesto opener'],
    tags: H, char: ['Confident', 'Editorial', 'Bold'],
    what: 'A short, opinionated statement fills the screen, revealed line by line, with the key word highlighted by a marker sweep. Confident statements create tension (“is that true?”) and invite comments.',
    good: ['Opinion and thought-leadership content', 'Brand manifestos', 'Comment-driving posts'],
    avoid: 'Clickbait that the video does not pay off — retention drops and trust with it.',
    anatomy: ['First frame', 'Three lines + highlight', 'Lines rise from 45% inside masks (already legible on frame 1) + marker scaleX', '0.4s lines @100ms · marker 0.45s', 'expo.out', 'Lines → highlight the key word'],
    tracks: [['l', 'Lines ×3 (100ms)', 0, 0.45, 'expo.out', { n: 3, each: 0.1 }], ['mark', 'Highlight key word', '>', 0.45, 'expo.out', 'fx'], ['hold', 'Hold', '>', 1.4, 'linear']],
    cls: 'bg-ink',
    html: `<div class="stackc pad" style="align-items:flex-start;text-align:left">${['Berhenti', 'menabung', '<span class="hk-key"><i data-r="mark"></i><span>cara lama.</span></span>'].map((l) => `<span class="mask t-sans hk-st"><span data-r="line">${l}</span></span>`).join('')}</div>`,
    render(t, c) {
      c.$$.line.forEach((el, i) => c.set(el, { yp: 45 * (1 - c.st('l', i)) }));
      c.set(c.$.mark, { sx: c.p.mark });
    },
    prompt: 'Create a statement hook: a three-line bold statement (“Berhenti / menabung / cara lama.”) revealed line by line from overflow masks in the first ~0.6s (expo-out, 100ms stagger) — ensure frame 1 already shows the text partially. Then sweep a highlighter bar behind the key phrase. Hold long enough to read twice.',
  });

  /* 05 Breaking news style */
  demo({
    id: 'hook-news', cat: CAT, name: 'Breaking-News Style Hook', aka: ['News lower third', 'Bulletin style', 'Urgent update'],
    tags: H.concat('ui'), char: ['Urgent', 'Bold', 'Informative'],
    what: 'Borrowing the visual grammar of TV news — a red label bar, a headline strip, a scrolling ticker and a timestamp — makes an update feel important and current. Use a generic “UPDATE” style, never a real broadcaster’s branding.',
    good: ['Announcements and product updates', 'Policy / price change explainers', 'Trend-jacking commentary'],
    avoid: 'Faking real news outlets or using it for misleading claims.',
    anatomy: ['First frame', 'Label bar, headline strip, ticker, photo', 'Bars wipe in (scaleX); ticker linear scroll; photo slow push', 'Bars 0.35s @120ms · ticker continuous', 'expo.out / linear', 'Label → headline → ticker runs'],
    tracks: [['b', 'Bars wipe ×2 (120ms)', 0, 0.35, 'expo.out', { n: 2, each: 0.12 }], ['ticker', 'Ticker scroll', 0.3, 3.2, 'linear', 'text'], ['push', 'Photo push', 0, 3.5, 'linear', 'camera']],
    dur: 3.6,
    html: `${A.photo('city', { r: 'img', cls: 'fill' })}<i class="fill" style="background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.65))"></i>
      <div class="hk-news"><div data-r="bar" class="hk-news__label"><b>UPDATE</b><span>LIVE · 09:41</span></div>
      <div data-r="bar" class="hk-news__head">Biaya admin bulanan resmi dihapus</div>
      <div class="hk-news__ticker"><div data-r="tick" class="hk-news__run">${'Berlaku mulai 1 November · Tanpa syarat saldo minimum · Cek detail di bio · '.repeat(3)}</div></div></div>`,
    render(t, c) {
      c.$$.bar.forEach((el, i) => c.set(el, { sx: c.st('b', i) }));
      c.set(c.$.tick, { xp: -33.33 * c.r.ticker });
      c.set(c.$.img, { s: lerp(1.05, 1.15, c.p.push) });
    },
    prompt: 'Create a news-style hook without any real broadcaster branding: over a slowly pushing photo, wipe in a red “UPDATE · LIVE” label bar and a white headline strip from the left (scaleX, expo-out, 120ms apart) within the first 0.4s, then run a ticker band at constant linear speed underneath.',
  });

  /* 06 Search bar */
  const QUERY = 'cara nabung 10 juta';
  demo({
    id: 'hook-search', cat: CAT, name: 'Search Bar Hook', aka: ['Search query hook', 'Google-style hook', 'Typing search'],
    tags: H.concat('ui'), char: ['Relatable', 'Conversational', 'Tech'],
    what: 'A search bar types the exact question the audience has in mind, suggestions drop in, and the cursor clicks one. It frames the video as the answer to their own search.',
    good: ['How-to and educational content', 'SEO-style topics on social', 'Product discovery (“best … for …”)'],
    avoid: 'Using a real search engine’s logo or UI; keep it generic.',
    anatomy: ['First frame', 'Search field, typed text, suggestions', 'Type-on; suggestions stagger down; tap highlight', 'Type 1s · suggestions 0.3s @80ms', 'stepped / premium', 'Type → suggestions → select'],
    tracks: [['type', 'Typing', 0.1, 1, 'linear', 'text'], ['sug', 'Suggestions ×3', '>', 0.3, 'premium', { n: 3, each: 0.08 }], ['pick', 'Select', '+=0.2', 0.25, 'out', 'cta'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-paper',
    html: `<div class="stackc pad"><div class="hk-search"><div class="hk-search__bar">${A.icon('search')}<span data-r="txt"></span><i data-r="caret" class="tw-caret"></i></div>
      ${['cara nabung 10 juta dalam 1 tahun', 'cara nabung 10 juta untuk pemula', 'cara nabung 10 juta gaji UMR'].map((s) => `<div data-r="sg" class="hk-search__sug">${A.icon('search')}<span>${s.replace(QUERY, `<b>${QUERY}</b>`)}</span></div>`).join('')}</div></div>`,
    render(t, c) {
      const n = Math.floor(QUERY.length * c.p.type);
      c.$.txt.textContent = QUERY.slice(0, n);
      c.set(c.$.caret, { o: c.r.type < 1 || Math.sin(t * 7) > 0 ? 1 : 0 });
      c.$$.sg.forEach((el, i) => { const p = c.st('sug', i); c.set(el, { o: p, y: -2 * (1 - p) }); el.classList.toggle('on', i === 0 && c.r.pick > 0); });
    },
    prompt: 'Create a search-bar hook with a generic search UI: from frame 1 show an empty search field with a caret, type “cara nabung 10 juta” over ~1s, drop three autocomplete suggestions in (80ms stagger), then highlight the first one as if tapped. No real search-engine branding.',
  });

  /* 07 Chat hook */
  demo({
    id: 'hook-chat', cat: CAT, name: 'Chat / Message Hook', aka: ['DM hook', 'Text conversation', 'Message thread'],
    tags: H.concat('ui'), char: ['Relatable', 'Story', 'Casual'],
    what: 'A private-looking chat plays out: incoming bubble, typing dots, a reply that sets up the story. People instinctively read messages — it feels like peeking into a real conversation.',
    good: ['Storytelling and skits', 'Customer-problem setups', 'Relatable humour'],
    avoid: 'Fake testimonials presented as real conversations.',
    anatomy: ['First frame', 'Chat header + bubbles + typing indicator', 'Bubble scale from its corner + slide; typing dots bounce', 'Bubble 0.35s · typing 0.7s', 'back.soft', 'Them → typing… → me → them'],
    tracks: [['m1', 'Message 1', 0, 0.35, 'back.soft', 'ui'], ['typing', 'Typing…', 0.5, 0.7, 'linear', 'ui'], ['m2', 'Reply', '>', 0.35, 'back.soft', 'ui'], ['m3', 'Message 3', '+=0.35', 0.35, 'back.soft', 'ui'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-coal',
    html: `<div class="hk-chat"><div class="hk-chat__head"><i></i><div><b>Dina</b><small>online</small></div></div>
      <div class="hk-chat__body"><div data-r="b1" class="bubble bubble--them">Gajimu kan sama kayak aku… kok bisa udah nabung 10 juta? 😳</div>
      <div data-r="typing" class="bubble bubble--me hk-typing"><i></i><i></i><i></i></div>
      <div data-r="b2" class="bubble bubble--me">Rahasianya cuma 1 aplikasi 👀</div>
      <div data-r="b3" class="bubble bubble--them">SPILL SEKARANG!!</div></div></div>`,
    render(t, c) {
      c.set(c.$.b1, { s: lerp(0.8, 1, c.p.m1), o: clamp(c.r.m1 * 3 + (t === 0 ? 1 : 0)) });
      const ty = c.r.typing > 0 && c.r.typing < 1;
      c.set(c.$.typing, { o: ty ? 1 : 0, css: { display: c.r.m2 > 0 ? 'none' : '' } });
      c.$.typing.querySelectorAll('i').forEach((d, i) => c.set(d, { y: ty ? -Math.max(0, Math.sin(t * 12 - i * 0.8)) * 1.2 : 0 }));
      c.set(c.$.b2, { s: lerp(0.8, 1, c.p.m2), o: clamp(c.r.m2 * 3), css: { display: c.r.m2 > 0 ? '' : 'none' } });
      c.set(c.$.b3, { s: lerp(0.8, 1, c.p.m3), o: clamp(c.r.m3 * 3), css: { display: c.r.m3 > 0 ? '' : 'none' } });
    },
    prompt: 'Create a chat-thread hook: show a generic messenger header and an incoming bubble on frame 1 (“Gajimu kan sama… kok bisa udah nabung 10 juta?”). Show a typing indicator with bouncing dots for 0.7s, then the reply bubble pops from its corner (scale 0.8 → 1, soft back-out), followed by one more short message. Keep the text large enough to read on a phone.',
  });

  /* 08 Notification hook */
  demo({
    id: 'hook-notification', cat: CAT, name: 'Notification Hook', aka: ['Push banner hook', 'Alert hook', 'Phone ping'],
    tags: H.concat('ui'), char: ['Familiar', 'Exciting', 'Product'],
    what: 'A phone-style notification drops over a lifestyle shot with a small “ping” pulse, delivering good news in one line. It hijacks the reflex we all have to read notifications.',
    good: ['Fintech and rewards announcements', 'E-commerce “order arrived” moments', 'App feature promos'],
    avoid: 'Imitating real system notifications from a specific OS or bank.',
    anatomy: ['First frame', 'Photo + notification banner + ping rings', 'Banner translateY −120% → 0 (spring) + ping rings', 'Drop 0.5s · rings 0.6s', 'spring.damped / expo.out', 'Ping → banner → headline below'],
    tracks: [['ping', 'Ping rings', 0, 0.6, 'expo.out', 'fx'], ['drop', 'Banner drops', 0.05, 0.55, 'spring.damped', 'ui'], ['head', 'Headline', '-=0.1', 0.45, 'back.soft'], ['hold', 'Hold', '>', 1.4, 'linear']],
    html: `${A.photo('coffee', { r: 'img', cls: 'fill' })}<i class="fill" style="background:rgba(0,0,0,.25)"></i>
      <div class="center" style="align-items:start;padding-top:12cqmin"><i data-r="ping" class="hk-ping"></i><div data-r="notif" class="notif" style="position:relative"><span class="notif__icon">${A.icon('gift')}</span><div><b>Wallet <small>sekarang</small></b><p>Selamat! Cashback Rp 50.000 masuk ke saldo kamu 🎉</p></div></div></div>
      <div class="stackc" style="justify-content:flex-end;padding-bottom:26cqmin"><b data-r="head" class="t-display hk-notif-head">Ngopi tiap hari,<br/>dibayarin balik.</b></div>`,
    render(t, c) {
      c.set(c.$.ping, { s: lerp(0.4, 2.4, c.p.ping), o: c.r.ping < 1 ? 0.8 * (1 - c.p.ping) : 0 });
      c.set(c.$.notif, { yp: lerp(-160, 0, c.p.drop) });
      c.set(c.$.head, { o: c.p.head, s: lerp(0.85, 1, c.p.head) });
      c.set(c.$.img, { s: 1.05 + t * 0.015 });
    },
    prompt: 'Create a notification hook over a lifestyle photo: on frame 1 a ping ring pulses at the top, and a generic app notification drops in from above with a damped spring (≈550ms) announcing a reward. Then pop a bold two-line headline in the lower-middle area (inside the safe zone). The photo pushes in very slowly.',
  });

  /* 09 Comment bubble */
  demo({
    id: 'hook-comment', cat: CAT, name: 'Comment Bubble Hook', aka: ['Reply to comment', 'Q&A hook', 'Comment sticker'],
    tags: H.concat('ui'), char: ['Community', 'Conversational', 'Social'],
    what: 'A viewer’s comment appears as a sticker at the top of the video, as if the creator is replying to it. It signals community, answers a real question, and gives instant context for what follows.',
    good: ['Answering audience questions', 'Follow-up videos', 'Building community and social proof'],
    avoid: 'Inventing comments and presenting them as real; use a generic sticker style, not a platform’s exact UI.',
    anatomy: ['First frame', 'Comment sticker + creator photo + caption', 'Sticker scale 0.6 → 1 with tilt; avatar pop; caption words', 'Sticker 0.45s · caption 0.35s @90ms', 'back.out / expo.out', 'Comment → creator reacts → caption'],
    tracks: [['stk', 'Comment sticker', 0, 0.45, 'back.out', 'ui'], ['cap', 'Caption ×4 (90ms)', 0.45, 0.35, 'expo.out', { n: 4, each: 0.09 }], ['hold', 'Hold', '>', 1.4, 'linear']],
    html: `${A.photo('portrait', { cls: 'fill' })}<div class="center" style="align-items:start;padding-top:14cqmin"><div data-r="stk" class="hk-comment"><i></i><div><small>Balas komentar @rara.id</small><b>Kak, mulai investasi modal 100 ribu bisa?</b></div></div></div>
      <div class="stackc" style="justify-content:flex-end;padding-bottom:28cqmin"><p class="hk-cap">${words('Bisa banget. Ini caranya:', 'cw')}</p></div>`,
    render(t, c) {
      c.set(c.$.stk, { s: lerp(0.6, 1, c.p.stk), r: lerp(-8, -2, c.p.stk), o: clamp(c.r.stk * 3 + (t === 0 ? 0.6 : 0)) });
      c.$$.cw.forEach((el, i) => { const p = c.st('cap', i); c.set(el, { o: p, s: lerp(1.3, 1, p) }); });
    },
    prompt: 'Create a reply-to-comment hook: on frame 1 a white comment sticker (generic style: small avatar, “Balas komentar @user”, the question in bold) pops at the top of the frame with a back-out ease and a slight tilt over the creator’s shot, then burn in a caption word by word (scale 1.3 → 1, 90ms stagger) in the lower safe area.',
  });

  /* 10 Before / after hook */
  demo({
    id: 'hook-before-after', cat: CAT, name: 'Before / After Hook', aka: ['Transformation hook', 'Comparison slider', 'Glow-up'],
    tags: H.concat('image', 'transition'), char: ['Satisfying', 'Persuasive', 'Visual'],
    what: 'A split frame shows BEFORE and AFTER, with a divider that sweeps across to reveal the transformation. The contrast is the hook — the viewer wants to see how it happened.',
    good: ['Renovations, edits, makeovers', 'Product results (honest ones)', 'Design and photo editing content'],
    avoid: 'Manipulated or unrealistic “after” images in health/beauty claims.',
    anatomy: ['First frame', 'Two images + divider + labels', 'Divider sweeps right → left; after-image clip follows', 'Sweep 1.2s with a hold midway', 'smooth', 'Before (frame 1) → sweep → after'],
    tracks: [['s1', 'Divider to middle', 0.1, 0.6, 'smooth', 'fx'], ['hold1', 'Hold split', '>', 0.4, 'linear'], ['s2', 'Reveal after', '>', 0.7, 'smooth', 'fx'], ['hold', 'Hold', '>', 1.2, 'linear']],
    html: `${A.photo('interior', { cls: 'fill', style: 'filter:grayscale(.85) brightness(.8) contrast(.9)' })}<div data-r="after" class="fill">${A.photo('interior', { cls: 'fill', style: 'filter:saturate(1.25)' })}</div>
      <span class="badge badge--dark hk-ba hk-ba--l">Before</span><span data-r="al" class="badge hk-ba hk-ba--r">After</span><div data-r="div" class="hk-div"><i>⇆</i></div>
      <div class="stackc" style="justify-content:flex-start;padding-top:12cqmin"><b class="t-display" style="font-size:12cqmin;color:#fff;text-shadow:0 1cqmin 4cqmin rgba(0,0,0,.4)">Kamar 3×3,<br/>budget 2 juta</b></div>`,
    render(t, c) {
      const x = 100 - lerp(0, 50, c.p.s1) - lerp(0, 50, c.p.s2);
      c.set(c.$.after, { clip: `inset(0 0 0 ${x}%)` });
      c.$.div.style.left = x + '%';
      c.set(c.$.al, { o: x < 80 ? 1 : 0 });
    },
    prompt: 'Create a before/after hook: frame 1 shows the “before” image (desaturated) with a bold title. Sweep a vertical divider from the right edge to the middle (600ms, smooth), hold the split 0.4s, then continue to the left edge to reveal the full “after” image, clipping the after image at the divider. Label both sides.',
  });

  /* 11 Countdown */
  demo({
    id: 'hook-countdown', cat: CAT, name: 'Countdown Hook', aka: ['3-2-1', 'Timer opener', 'Get ready'],
    tags: H, char: ['Energetic', 'Anticipation', 'Rhythmic'],
    what: 'Big numbers count down 3-2-1 on the beat with a ring that empties each second, then “MULAI!” bursts in. A countdown creates instant anticipation and a clear rhythm to start the video.',
    good: ['Challenges, workouts and recipes', 'Launch and reveal moments', 'Live / event openers'],
    avoid: 'Slow countdowns — keep each count ≤ 0.6s on social.',
    anatomy: ['Beat-synced', 'Number, ring, final word', 'Each number scale 1.6 → 1 + ring drain; final burst', '0.55s per count', 'expo.out', '3 → 2 → 1 → MULAI!'],
    tracks: [['n3', '3', 0, 0.55, 'expo.out'], ['n2', '2', '>', 0.55, 'expo.out'], ['n1', '1', '>', 0.55, 'expo.out'], ['go', 'MULAI!', '>', 0.4, 'back.out'], ['hold', 'Hold', '>', 1, 'linear']],
    cls: 'bg-red',
    html: `<div class="center"><svg class="hk-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="hk-ring__bg"/><circle data-r="ring" cx="50" cy="50" r="44" class="hk-ring__fg" pathLength="1" stroke-dasharray="1 1"/></svg></div>
      ${['3', '2', '1'].map((n) => `<div class="center"><b data-r="n" class="t-display hk-count">${n}</b></div>`).join('')}<div class="center"><b data-r="go" class="t-display hk-go">Mulai!</b></div>`,
    render(t, c) {
      const keys = ['n3', 'n2', 'n1'];
      let cur = -1;
      keys.forEach((k, i) => { if (c.r[k] > 0 && c.r[k] < 1) cur = i; });
      c.$$.n.forEach((el, i) => c.set(el, { o: i === cur ? 1 : 0, s: i === cur ? lerp(1.6, 1, c.p[keys[i]]) : 1 }));
      const ringP = cur >= 0 ? c.r[keys[cur]] : 1;
      c.set(c.$.ring, { dash: ringP, o: c.r.go > 0 ? 0 : 1 });
      c.set(c.$.go, { s: lerp(0.4, 1, c.p.go), o: c.r.go > 0 ? 1 : 0 });
    },
    prompt: 'Create a 3-2-1 countdown hook on a 0.55s beat: each number appears at scale 1.6 and settles to 1 (expo-out) while a ring around it drains clockwise over the beat; after “1”, burst “MULAI!” in with a back-out ease. Start on frame 1 with “3” fully visible.',
  });

  /* 12 Fast typography */
  const FAST = [['STOP', '#ef4b36', 'l'], ['SCROLL', '#141416', 'r'], ['INI', '#f2c14e', 'c'], ['PENTING', '#3e63dd', 'l'], ['BANGET', '#ef4b36', 'c']];
  demo({
    id: 'hook-fast-type', cat: CAT, name: 'Fast Typography Hook', aka: ['Rapid-fire text', 'Quick cuts type', 'Word per beat'],
    tags: H, char: ['Energetic', 'Loud', 'Rhythmic'],
    what: 'One word per beat, every 0.22s, each in a new colour and position. The speed itself is the hook — it signals energy and urgency. It only works because each word is huge, short and high-contrast.',
    good: ['Very first second of energetic reels', 'Music-synced openers', 'Youth-focused brands'],
    avoid: 'Long words or important information — this is rhythm, not reading material.',
    anatomy: ['Beat-synced cuts', 'Five words', 'Hard cut per word + background colour + small scale settle', '0.22s per word', 'expo.out', 'Cut-cut-cut-cut-cut → hold'],
    tracks: FAST.map(([w], i) => [`f${i}`, w, i * 0.22, 0.18, 'expo.out']).concat([['hold', 'Hold', 1.1, 1, 'linear']]),
    html: `<div data-r="bg" class="fill"></div>${FAST.map(([w, , pos]) => `<div class="stackc hk-fast hk-fast--${pos}"><b data-r="w" class="t-display">${w}</b></div>`).join('')}`,
    render(t, c) {
      let cur = 0;
      FAST.forEach((_, i) => { if (c.r['f' + i] > 0) cur = i; });
      c.$$.w.forEach((el, i) => c.set(el, { o: i === cur ? 1 : 0, s: i === cur ? lerp(1.15, 1, c.p['f' + i]) : 1 }));
      c.$.bg.style.background = cur % 2 ? '#f6f1e7' : '#0e0e10';
      c.$$.w[cur].style.color = FAST[cur][1] === '#141416' && cur % 2 === 0 ? '#fff' : FAST[cur][1];
    },
    prompt: 'Create a rapid-fire typography hook: hard-cut through five short words (“STOP / SCROLL / INI / PENTING / BANGET”) every 0.22s, alternating dark and light backgrounds, changing colour and position each time, with a tiny scale settle (1.15 → 1) on each cut. Frame 1 shows the first word.',
  });

  /* 13 Pattern interrupt */
  demo({
    id: 'hook-interrupt', cat: CAT, name: 'Pattern Interrupt', aka: ['Visual surprise', 'Scroll breaker', 'Unexpected cut'],
    tags: H.concat('transition'), char: ['Surprising', 'Bold', 'Playful'],
    what: 'The video starts like any calm, pretty post — then breaks its own pattern within a second: hard cut to a saturated colour, a giant shape, a shake and a blunt line. The contrast between expectation and surprise is what stops the thumb.',
    good: ['Feeds full of similar aesthetic content', 'Brand awareness with humour', 'Restarting attention mid-video'],
    avoid: 'Jump-scare tactics or loud flashes; surprise, don’t assault.',
    anatomy: ['First second', 'Calm photo → bold colour scene', 'Hard cut + giant shape scale + shake + text stamp', 'Calm 0.7s · interrupt 0.4s', 'expo.out / punch', 'Calm (expected) → BREAK → message'],
    tracks: [['calm', 'Calm aesthetic shot', 0, 0.7, 'linear', 'image'], ['cut', 'Interrupt cut', '>', 0, 'linear', 'cut'], ['shape', 'Giant shape', '<', 0.4, 'expo.out', 'object'], ['txt', 'Blunt line', '<0.1', 0.35, 'punch'], ['hold', 'Hold', '>', 1.2, 'linear']],
    html: `<div data-r="calm" class="fill">${A.photo('alpine', { cls: 'fill' })}<div class="stackc" style="justify-content:flex-end;padding-bottom:30cqmin"><span class="t-serif" style="font-size:7cqmin;color:#fff"><i>a slow morning…</i></span></div></div>
      <div data-r="loud" class="fill bg-yellow"><div class="center"><i data-r="shape" class="hk-blob"></i></div><div class="stackc"><b data-r="txt" class="t-display hk-int">Bohong.<br/>Ini senin.</b></div></div>`,
    render(t, c) {
      const after = t >= c.tl.map.cut.start;
      c.set(c.$.calm, { o: after ? 0 : 1, s: 1 + t * 0.03 });
      c.set(c.$.loud, { o: after ? 1 : 0 });
      c.set(c.$.shape, { s: lerp(0.2, 1, c.p.shape), r: lerp(-40, 0, c.p.shape) });
      c.set(c.$.txt, { s: lerp(1.6, 1, c.p.txt), o: c.r.txt > 0 ? 1 : 0 });
      shake(c, c.$.loud, c.tl.map.cut.start, 2.6, 9);
    },
    prompt: 'Create a pattern-interrupt opener: start with a calm, aesthetic shot and a soft serif caption for ~0.7s, then hard-cut to a saturated yellow frame where a giant shape scales in, the frame shakes briefly and a blunt line stamps in (scale 1.6 → 1). The interrupt must happen before the 1-second mark.',
  });

  /* 14 Zoom punch hook */
  demo({
    id: 'hook-zoom-punch', cat: CAT, name: 'Zoom Punch Hook', aka: ['Crash zoom', 'Punch-in on face', 'Snap zoom'],
    tags: H.concat('camera', 'image'), char: ['Energetic', 'Comedic', 'Social'],
    what: 'A crash zoom into the subject’s face on the beat, twice in quick succession, with a caption slammed on top. It mimics a reaction meme and instantly creates emphasis — “look at THIS”.',
    good: ['Reaction and commentary content', 'Comedic emphasis', 'Highlighting a key moment in a talking-head video'],
    avoid: 'Overuse in one video, and punching into low-res footage.',
    anatomy: ['Beat-synced', 'Portrait photo + caption', 'Scale 1 → 1.4 → 1.9 (two steps) with origin on the face', '0.12s per punch', 'expo.out', 'Wide → punch → punch → caption'],
    tracks: [['p1', 'Punch 1', 0.25, 0.14, 'expo.out', 'camera'], ['p2', 'Punch 2', 0.6, 0.14, 'expo.out', 'camera'], ['cap', 'Caption slam', '<0.05', 0.25, 'expo.out'], ['hold', 'Hold', '>', 1.3, 'linear']],
    html: `${A.photo('portrait', { r: 'img', cls: 'fill', style: 'transform-origin:50% 44%' })}<i data-r="flash" class="flash"></i>
      <div class="stackc" style="justify-content:flex-end;padding-bottom:28cqmin"><b data-r="cap" class="t-display hk-zp">Liat ini<br/>baik-baik.</b></div>`,
    render(t, c) {
      c.set(c.$.img, { s: 1 * lerp(1, 1.4, c.p.p1) * lerp(1, 1.35, c.p.p2) });
      const f = Math.max(c.r.p1 > 0 && c.r.p1 < 1 ? 1 - c.r.p1 : 0, c.r.p2 > 0 && c.r.p2 < 1 ? 1 - c.r.p2 : 0);
      c.set(c.$.flash, { o: f * 0.25 });
      c.set(c.$.cap, { s: lerp(1.8, 1, c.p.cap), o: c.r.cap > 0 ? 1 : 0, r: -3 });
    },
    prompt: 'Create a zoom-punch hook on a talking-head shot: on two consecutive beats, crash-zoom into the face (scale 1 → 1.4, then → 1.9, each in ~140ms with an expo-out, transform-origin on the eyes) with a faint flash, and slam a two-line caption onto the lower safe area on the second punch.',
  });

  /* 15 Sound-impact visual cue */
  demo({
    id: 'hook-impact-cue', cat: CAT, name: 'Sound-Impact Visual Cue', aka: ['Visual SFX', 'Impact frame', 'Bass hit visual'],
    tags: H.concat('advanced'), char: ['Energetic', 'Rhythmic', 'Music'],
    what: 'Even on mute, the viewer should “feel” the sound. On each impact (the yellow beat markers) the frame flashes, an equaliser jumps, text scales and rings burst — visual sound effects that make rhythm visible.',
    good: ['Music-driven edits watched without sound', 'Product hits and drops', 'Transitions that land on a beat'],
    avoid: 'Impacts without an actual sound reason when audio is on — mismatched sync feels broken.',
    anatomy: ['Audio beats (shown as markers)', 'EQ bars, word, ring, flash', 'On each beat: bars spike + decay, word scale, ring scale/fade, flash', 'Beats at 0.5s intervals', 'Instant attack, exponential decay', 'Beat → reaction decays → next beat'],
    tracks: [0.2, 0.7, 1.2, 1.7].map((b, i) => [`b${i}`, 'Beat', b, 0, 'linear', 'beat']).concat([['drop', 'Drop (big hit)', 1.7, 0.6, 'linear', 'fx'], ['hold', 'Hold', '>', 0.9, 'linear']]),
    cls: 'bg-ink',
    html: `<i data-r="flash" class="flash"></i><div class="center"><i data-r="ring" class="hk-iring"></i></div>
      <div class="stackc" style="gap:5cqmin"><b data-r="word" class="t-display hk-boom">Boom.</b><div class="hk-eq">${Array.from({ length: 13 }, () => '<i data-r="eq"></i>').join('')}</div></div>`,
    render(t, c) {
      const beats = [0.2, 0.7, 1.2, 1.7];
      let env = 0, big = 0;
      beats.forEach((b, i) => { const d = t - b; if (d >= 0) { const e = Math.exp(-d * 7); if (e > env) { env = e; big = i === 3 ? 1 : 0.55; } } });
      const k = env * (big || 0);
      c.$$.eq.forEach((el, i) => c.set(el, { sy: 0.15 + k * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + Math.floor(t * 10)))) }));
      c.set(c.$.word, { s: 1 + k * 0.25 });
      c.set(c.$.ring, { s: lerp(0.5, 2.4, 1 - env), o: env * (big ? 1 : 0.5) });
      c.set(c.$.flash, { o: env > 0.85 ? (big === 1 ? 0.5 : 0.18) * (env - 0.85) / 0.15 : 0 });
    },
    prompt: 'Visualise sound on mute: on each beat (every 0.5s) trigger an envelope with an instant attack and an exponential decay (~e^(−7t)). Drive equaliser bar heights, a word’s scale (+25%), an expanding ring and a short white flash from that envelope, with the last beat (the drop) twice as strong.',
  });

  /* 16 Stop-scroll frame */
  demo({
    id: 'hook-stop-scroll', cat: CAT, name: 'Stop-Scroll Frame', aka: ['Thumbnail frame', 'First-frame design', 'Scroll stopper'],
    tags: H.concat('image'), char: ['Bold', 'High contrast', 'Strategic'],
    what: 'The first frame is designed as a finished poster: high contrast, one big subject, a short bold line — no fade from black, no empty intro. Motion then starts immediately (0.1s), so the frame both reads as a thumbnail and proves the video is alive. Scrub to 0:00 to see frame 1.',
    good: ['Every short-form video (first 1–2 seconds)', 'Cover/thumbnail selection', 'Ads competing in busy feeds'],
    avoid: 'Starting with a logo, a fade-in or a slow establishing shot — most viewers decide in the first second.',
    anatomy: ['Frame 1 → first second', 'Product, headline, accent shape', 'All visible at t=0; then push-in, shape spin, headline nudge start at 0.1s', 'Immediate · 2s of continuous motion', 'out / linear', 'Poster frame → immediate motion → hook line'],
    tracks: [['f1', 'Frame 1 = poster', 0, 0, 'linear', 'cut'], ['move', 'Immediate motion', 0.1, 2.2, 'out', 'camera'], ['line', 'Hook line', 0.6, 0.4, 'back.soft'], ['hold', 'Hold', '>', 0.6, 'linear']],
    cls: 'bg-red',
    html: `<div class="center"><i data-r="sh" class="hk-ss-shape"></i></div><div class="center"><div data-r="prod">${A.product('can', { style: '--ph:62cqmin' })}</div></div>
      <div class="stackc" style="justify-content:flex-start;padding-top:10cqmin"><b data-r="head" class="t-display hk-ss-head">Haus?<br/>Jangan yang biasa.</b></div>
      <div class="stackc" style="justify-content:flex-end;padding-bottom:27cqmin"><span data-r="line" class="badge badge--dark">Zero sugar · rasa yuzu</span></div>
      <span data-r="tag" class="tag tag--light" style="right:4cqmin;top:50%">frame 1 = thumbnail</span>`,
    render(t, c) {
      c.set(c.$.prod, { s: lerp(1, 1.12, c.p.move), r: lerp(-6, 0, c.p.move) });
      c.set(c.$.sh, { r: t * 30, s: lerp(1, 1.1, c.p.move) });
      c.set(c.$.head, { y: lerp(0, -2, c.p.move) });
      c.set(c.$.line, { s: lerp(0.7, 1, c.p.line), o: c.p.line });
      c.set(c.$.tag, { o: t < 0.35 ? 1 : 0 });
    },
    prompt: 'Design the first frame as a finished poster: high-contrast background, the product large in the centre, a short bold headline in the top safe area and a graphic accent behind the product — all fully visible at 0:00 (no fade-in). Start motion at 0.1s: a slow push-in on the product, the accent shape rotating, and a supporting badge popping in by 0.6s.',
  });
})();
