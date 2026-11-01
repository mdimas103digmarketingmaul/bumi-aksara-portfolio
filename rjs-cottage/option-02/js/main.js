/* RJS Cottage — Option 02. Vanilla JS, no dependencies.
 * The page is complete without it; with prefers-reduced-motion nothing moves on its own.
 *
 *  1. Config + helpers           6. Hanging rail (drag, keys, pendulum)
 *  2. "Diskusi" links → form     7. Cottage drawer
 *  3. Header, progress, sheet    8. Stories viewer
 *  4. Hero photo stage           9. Gallery filter + lightbox
 *  5. Reveals, counters, video   10. Route, form, dock
 */
(() => {
  'use strict';

  // ─── 1. Config ───────────────────────────────────────────────────
  const CONFIG = {
    // International format without "+", e.g. '6281234567890'. TODO(client): official number.
    whatsapp: '',
    slideMs: 6000,
    extraGuest: 50000,
    units: {
      1: {
        name: 'RJS Cottage 1', cap: 20, wk: 1800000, fri: 2300000, sat: 3700000,
        desc: 'Kolam dengan perosotan kecil, gazebo, dan saung billiard berdinding bambu. Pas untuk keluarga yang membawa anak-anak.',
        facilities: ['Private pool', 'Gazebo', 'Billiard', 'Karaoke', 'Smart TV & WiFi', 'BBQ space', 'Halaman', 'Chill space', 'Kitchen set', 'Water heater'],
        note: '',
        photos: [
          ['c1-pool-sign-lg', 'Kolam RJS Cottage 1 di samping dinding bertuliskan RJS Cottage.'],
          ['c1-pool-terrace-lg', 'Teras beratap di tepi kolam dengan perosotan anak.'],
          ['c1-billiard-lg', 'Meja billiard di saung bambu.'],
          ['c1-garden-lg', 'Kursi kayu di halaman rumput.'],
          ['c1-living-lg', 'Ruang keluarga dengan karpet motif.'],
          ['c1-bedroom-lg', 'Kamar tidur dengan lampu plafon hangat.'],
        ],
      },
      2: {
        name: 'RJS Cottage 2', cap: 25, wk: 2000000, fri: 2700000, sat: 3800000,
        desc: 'Jendela kaca tinggi, ruang keluarga yang lapang, dan teras billiard beratap. Untuk rombongan sampai 25 orang.',
        facilities: ['Private pool', 'Billiard', 'Karaoke', 'Smart TV & WiFi', 'BBQ space', 'Halaman', 'Chill space', 'Kitchen set', 'Water heater'],
        note: 'Akses ke cottage menanjak/menurun, kurang ideal untuk lansia. Ceritakan kebutuhan rombonganmu ke admin.',
        photos: [
          ['c2-pool-house-lg', 'Kolam renang di depan bangunan putih RJS Cottage 2.'],
          ['c2-lounge-lg', 'Sofa kulit menghadap jendela kaca tinggi.'],
          ['c2-living-lg', 'Ruang keluarga dengan lampu gantung kristal dan TV.'],
          ['c2-billiard-lg', 'Meja billiard di teras beratap.'],
          ['c2-bedroom-lg', 'Kamar tidur dengan kasur besar.'],
          ['c2-kitchen-lg', 'Kitchen set putih.'],
        ],
      },
      3: {
        name: 'RJS Cottage 3', cap: 25, wk: 2000000, fri: 2700000, sat: 3800000,
        desc: 'Kolam bertangga batu berlatar dinding hijau, dan teras billiard yang terbuka ke pepohonan.',
        facilities: ['Private pool', 'Billiard', 'Karaoke', 'Smart TV & WiFi', 'BBQ space', 'Halaman', 'Chill space', 'Kitchen set', 'Water heater'],
        note: 'Akses ke cottage menanjak/menurun, kurang ideal untuk lansia. Ceritakan kebutuhan rombonganmu ke admin.',
        photos: [
          ['c3-pool-steps-lg', 'Tangga batu menuju kolam dengan dinding tanaman.'],
          ['c3-pool-lg', 'Kolam biru dengan dinding batu.'],
          ['c3-billiard-view-lg', 'Teras billiard yang terbuka ke pepohonan.'],
          ['c3-living-lg', 'Ruang keluarga dengan sofa dan karpet.'],
          ['c3-bedroom-lg', 'Kamar tidur dengan jendela besar.'],
          ['c3-karaoke-lg', 'Smart TV dan perangkat karaoke.'],
        ],
      },
    },
    stories: [
      ['story-1', 'Keluarga besar, tiga generasi', 'Instagram Story: keluarga besar berfoto di tepi kolam depan dinding RJS Cottage, dengan ucapan terima kasih dari RJS Cottage.'],
      ['story-3', 'Malam keakraban komunitas', 'Instagram Story: kolase malam keakraban di halaman dengan api unggun, ditandai @RJSCOTTAGE Puncak Cisarua.'],
      ['story-2', 'Satu rombongan, satu frame', 'Instagram Story: rombongan keluarga berfoto di bawah kanopi tepi kolam dengan perosotan.'],
      ['story-8', 'Games di halaman', 'Instagram Story: tamu bermain games di halaman rumput, dengan teks Moving Family.'],
      ['story-4', 'Rombongan kantor', 'Instagram Story: rombongan berfoto di bawah kanopi dengan stiker Arigato dan tag @rjscottage.'],
      ['story-5', 'Tertawa lepas, rame-rame', 'Instagram Story: rombongan besar duduk berjajar di dinding teras.'],
    ],
  };

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = (n) => String(n).padStart(2, '0');
  const rupiah = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const IMG = (n) => `../assets/images/${n}.webp`;
  root.classList.add('ready');

  const form = $('[data-form]');
  const booking = $('#booking');

  // ─── 2. Every "Diskusi" button leads to the WhatsApp section ─────
  function toBooking({ unit, ask } = {}) {
    if (unit) { const r = $(`input[name="unit"][value="${unit}"]`, form); if (r) r.checked = true; }
    if (ask) form.elements.ask.value = ask;
    updateForm();
    form.classList.remove('flash'); void form.offsetWidth; form.classList.add('flash');
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#booking"]');
    if (!a || a.hasAttribute('data-d-cta')) return;
    closeSheet();
    toBooking({ ask: a.dataset.ask });
  });

  // ─── 3. Header progress, active link, mobile sheet ───────────────
  const progress = $('[data-progress]');
  const links = $$('.hdr__nav a');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['cottage', 'video', 'sehari', 'cerita', 'lokasi'].forEach((id) => io.observe($('#' + id)));

  const sheet = $('[data-sheet]');
  const burger = $('[data-burger]');
  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('open'));
    burger.setAttribute('aria-expanded', 'true');
    $('[data-burger-label]').textContent = 'Tutup menu';
    document.body.classList.add('lock');
  }
  function closeSheet() {
    if (!sheet.classList.contains('open')) return;
    sheet.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    $('[data-burger-label]').textContent = 'Buka menu';
    document.body.classList.remove('lock');
    setTimeout(() => { if (!sheet.classList.contains('open')) sheet.hidden = true; }, 600);
  }
  burger.addEventListener('click', () => (sheet.classList.contains('open') ? closeSheet() : openSheet()));
  $$('[data-sheet-link]').forEach((a) => a.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  // ─── 4. Hero photo stage ─────────────────────────────────────────
  const hero = $('[data-hero]');
  const visual = $('[data-visual]');
  const slides = $$('.slide', visual);
  const fis = $$('.fi', hero);
  const chip = $('.vchip', visual);
  const nowFacil = $('[data-facil-now]');
  const facilList = $('.facil__list', hero);
  const toggleBtn = $('[data-autoplay-toggle]');
  hero.style.setProperty('--slide-ms', CONFIG.slideMs + 'ms');
  let cur = 0, autoplay = !reduced, cleanup = 0;
  const pauseWhy = new Set();

  function syncPause() { hero.classList.toggle('paused', pauseWhy.size > 0); }
  function setRun() {
    fis.forEach((f) => f.classList.remove('run'));
    if (!autoplay) return;
    void fis[cur].offsetWidth;
    fis[cur].classList.add('run');
  }
  function goSlide(n, dir = 1) {
    n = (n + slides.length) % slides.length;
    if (n === cur) return;
    const prev = slides[cur], next = slides[n];
    slides.forEach((s) => s.classList.remove('leave', 'enter'));
    prev.classList.remove('on');
    prev.classList.add('leave');
    prev.style.setProperty('--leave-x', dir > 0 ? '-5%' : '5%');
    next.style.setProperty('--wipe-from', dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)');
    next.classList.add('on', 'enter');
    clearTimeout(cleanup);
    cleanup = setTimeout(() => { prev.classList.remove('leave'); next.classList.remove('enter'); }, 1250);
    cur = n;
    fis.forEach((f, i) => f.setAttribute('aria-pressed', String(i === n)));
    chip.textContent = next.dataset.cap;
    nowFacil.textContent = pad2(n + 1);
    // Keep the active facility visible in the mobile strip without moving the page.
    const li = fis[n].parentElement;
    if (facilList.scrollWidth > facilList.clientWidth) facilList.scrollTo({ left: li.offsetLeft - 8, behavior: reduced ? 'auto' : 'smooth' });
    setRun();
  }
  fis.forEach((f, i) => {
    f.addEventListener('click', () => goSlide(i, i >= cur ? 1 : -1));
    $('.fi__bar i', f).addEventListener('animationend', () => { if (autoplay && i === cur) goSlide(cur + 1); });
  });
  $('[data-next]', visual).addEventListener('click', () => goSlide(cur + 1, 1));
  $('[data-prev]', visual).addEventListener('click', () => goSlide(cur - 1, -1));
  toggleBtn.addEventListener('click', () => {
    autoplay = !autoplay;
    toggleBtn.setAttribute('aria-pressed', String(!autoplay));
    $('[data-autoplay-label]').textContent = autoplay ? 'Jeda slideshow' : 'Putar slideshow';
    setRun();
  });
  if (!autoplay) { toggleBtn.setAttribute('aria-pressed', 'true'); $('[data-autoplay-label]').textContent = 'Putar slideshow'; }
  hero.addEventListener('keydown', (e) => {
    if (!e.target.closest('.visual, .facil')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goSlide(cur + 1, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goSlide(cur - 1, -1); }
  });
  // Swipe on the photo.
  let sx = null, sy = 0;
  visual.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) { sx = e.clientX; sy = e.clientY; } });
  visual.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goSlide(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  // Cursor parallax.
  if (fine && !reduced) {
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      visual.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3) * 2);
      visual.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3) * 2);
    });
    visual.addEventListener('pointerleave', () => { visual.style.setProperty('--mx', 0); visual.style.setProperty('--my', 0); });
  }
  // Pause the timer while reading the facility list, off-screen, or in a hidden tab.
  const facil = $('[data-facil]');
  facil.addEventListener('pointerenter', () => { if (fine) { pauseWhy.add('hover'); syncPause(); } });
  facil.addEventListener('pointerleave', () => { pauseWhy.delete('hover'); syncPause(); });
  new IntersectionObserver(([e]) => { e.isIntersecting ? pauseWhy.delete('view') : pauseWhy.add('view'); syncPause(); }, { threshold: 0.2 }).observe(visual);
  document.addEventListener('visibilitychange', () => { document.hidden ? pauseWhy.add('tab') : pauseWhy.delete('tab'); syncPause(); });
  requestAnimationFrame(() => setTimeout(() => { hero.classList.add('go'); setRun(); }, 60));

  // ─── 5. Reveals, counters, magnetic, video section ───────────────
  if (root.classList.contains('motion')) {
    const rio = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    $$('[data-in]').forEach((el) => {
      const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-in'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.07}s`);
      rio.observe(el);
    });
  }
  if (!reduced) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, pad = +(el.dataset.pad || 0), t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1), v = Math.round(to * (1 - Math.pow(1 - p, 4)));
        el.textContent = String(v).padStart(pad, '0');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach((el) => cio.observe(el));
  }
  if (fine && !reduced) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
  const ambient = $('[data-ambient]');
  if (ambient && !reduced) new IntersectionObserver(([e]) => { e.isIntersecting ? ambient.play().catch(() => {}) : ambient.pause(); }, { threshold: 0.4 }).observe(ambient);
  const players = $$('[data-player]');
  $$('[data-play]').forEach((btn) => btn.addEventListener('click', () => {
    const card = btn.closest('.vcard');
    const v = $('video', card);
    v.controls = true;
    v.muted = false;
    v.play().catch(() => {});
    card.classList.add('playing');
    v.focus({ preventScroll: true });
  }));
  players.forEach((v) => {
    v.addEventListener('play', () => players.forEach((p) => { if (p !== v) p.pause(); }));
    new IntersectionObserver(([e]) => { if (!e.isIntersecting) v.pause(); }, { threshold: 0.2 }).observe(v);
  });

  // ─── 6. Hanging rail ─────────────────────────────────────────────
  const rail = $('[data-rail]');
  const track = $('[data-rail-track]');
  const hangs = $$('[data-hang]', track);
  const nowEl = $('[data-rail-now]');
  $('[data-rail-total]').textContent = pad2(hangs.length);
  let x = 0, target = 0, vel = 0, dragging = false, startX = 0, startT = 0;
  const angles = hangs.map(() => ({ a: 0, v: 0 }));
  const maxX = () => Math.max(0, track.scrollWidth - rail.clientWidth);
  const step = () => (hangs[1] ? hangs[1].offsetLeft - hangs[0].offsetLeft : 300);
  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const go = (t) => { target = clamp(t, 0, maxX()); kick(); };
  function loop() {
    const prev = x;
    x += (target - x) * (dragging ? 0.5 : 0.12);
    vel = x - prev;
    track.style.transform = `translate3d(${-x}px,0,0)`;
    let active = false;
    if (!reduced) hangs.forEach((h, i) => {
      // Pendulum: rail velocity pushes the card, a spring pulls it back.
      const s = angles[i];
      s.v += (-vel * 0.6 - s.a) * 0.07;
      s.v *= 0.88;
      s.a = clamp(s.a + s.v, -14, 14);
      h.style.transform = `rotate(${s.a.toFixed(2)}deg)`;
      if (Math.abs(s.a) > 0.05 || Math.abs(s.v) > 0.05) active = true;
    });
    nowEl.textContent = pad2(clamp(Math.round(x / step()) + 1, 1, hangs.length));
    raf = Math.abs(target - x) > 0.3 || active || dragging ? requestAnimationFrame(loop) : 0;
  }
  rail.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startT = target;
    rail.setPointerCapture(e.pointerId);
    rail.classList.add('dragging');
    kick();
  });
  rail.addEventListener('pointermove', (e) => { if (dragging) target = clamp(startT - (e.clientX - startX), -60, maxX() + 60); });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove('dragging');
    go(Math.round((target + vel * 8) / step()) * step());
  };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    go(target + e.deltaX);
  }, { passive: false });
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(target + step()); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(target - step()); }
  });
  $('[data-rail-next]').addEventListener('click', () => go(Math.round(target / step() + 1) * step()));
  $('[data-rail-prev]').addEventListener('click', () => go(Math.round(target / step() - 1) * step()));
  window.addEventListener('resize', () => go(target));
  if (!reduced) new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    angles.forEach((s, i) => { s.v = 1.6 - i * 0.12; });
    kick();
  }, { threshold: 0.3 }).observe(rail);

  // ─── 7. Cottage drawer ───────────────────────────────────────────
  const drawer = $('[data-drawer]');
  let dUnit = null, dN = 0, dIdx = 0, dReturn = null;
  function renderSlide() {
    $$('img', $('[data-d-slides]')).forEach((im, i) => im.classList.toggle('on', i === dIdx));
    $('[data-d-count]').textContent = `${pad2(dIdx + 1)} / ${pad2(dUnit.photos.length)}`;
  }
  function openDrawer(n, trigger) {
    const u = CONFIG.units[n];
    dUnit = u; dN = n; dIdx = 0; dReturn = trigger;
    $('[data-d-meta]').textContent = `0${n} · hingga ${u.cap} tamu`;
    $('[data-d-title]').textContent = u.name;
    $('[data-d-desc]').textContent = u.desc;
    $('[data-d-slides]').innerHTML = u.photos.map(([f, alt], i) => `<img src="${IMG(f)}" alt="${alt}" ${i ? 'loading="lazy"' : ''}>`).join('');
    $('[data-d-specs]').innerHTML = [['Tamu', u.cap], ['Kamar tidur', 3], ['Kamar mandi', 4], ['Parkir', 5]]
      .map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');
    $('[data-d-rates]').innerHTML = [['Minggu–Kamis', u.wk], ['Jumat', u.fri], ['Sabtu', u.sat]]
      .map(([t, v]) => `<tr><th scope="row">${t}</th><td>${rupiah(v)}</td></tr>`).join('');
    $('[data-d-chips]').innerHTML = u.facilities.map((f) => `<li>${f}</li>`).join('');
    $('[data-d-note]').textContent = u.note;
    $('[data-d-cta-label]').textContent = `Diskusi soal ${u.name.replace('RJS ', '')}`;
    renderSlide();
    drawer.showModal();
    drawer.scrollTop = 0;
  }
  $$('[data-unit-open]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openDrawer(a.dataset.unitOpen, a); }));
  $('[data-drawer-close]').addEventListener('click', () => drawer.close());
  drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });
  drawer.addEventListener('close', () => { dReturn?.focus({ preventScroll: true }); dReturn = null; });
  $('[data-d-cta]').addEventListener('click', (e) => {
    e.preventDefault();
    dReturn = null;
    drawer.close();
    toBooking({ unit: dN });
    booking.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#booking');
  });
  const dStep = (d) => { dIdx = (dIdx + d + dUnit.photos.length) % dUnit.photos.length; renderSlide(); };
  $('[data-d-prev]').addEventListener('click', () => dStep(-1));
  $('[data-d-next]').addEventListener('click', () => dStep(1));
  drawer.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') dStep(1); if (e.key === 'ArrowLeft') dStep(-1); });

  // ─── 8. Stories viewer ───────────────────────────────────────────
  const phone = $('[data-phone]');
  const bars = $('[data-bars]');
  const sImg = $('[data-story-img]');
  const sCap = $('[data-story-cap]');
  const bubbles = $$('[data-story]');
  bars.innerHTML = CONFIG.stories.map(() => '<span><i></i></span>').join('');
  const barEls = $$('span', bars);
  let sIdx = 0, sStarted = false;
  function showStory(i) {
    sIdx = (i + CONFIG.stories.length) % CONFIG.stories.length;
    const [f, cap, alt] = CONFIG.stories[sIdx];
    sImg.src = `../assets/testimonials/${f}.webp`;
    sImg.alt = alt;
    sImg.classList.remove('swap'); void sImg.offsetWidth; sImg.classList.add('swap');
    sCap.textContent = cap;
    barEls.forEach((b, j) => {
      b.classList.toggle('done', j < sIdx);
      b.classList.remove('now');
      if (j === sIdx) { void b.offsetWidth; b.classList.add('now'); }
    });
    bubbles.forEach((b, j) => b.setAttribute('aria-selected', String(j === sIdx)));
  }
  barEls.forEach((b) => b.firstChild.addEventListener('animationend', () => { if (!reduced && sStarted) showStory(sIdx + 1); }));
  $('[data-story-next]').addEventListener('click', () => showStory(sIdx + 1));
  $('[data-story-prev]').addEventListener('click', () => showStory(sIdx - 1));
  bubbles.forEach((b, i) => b.addEventListener('click', () => showStory(i)));
  phone.addEventListener('pointerenter', () => phone.classList.add('paused'));
  phone.addEventListener('pointerleave', () => phone.classList.remove('paused'));
  phone.addEventListener('focusin', () => phone.classList.add('paused'));
  phone.addEventListener('focusout', () => phone.classList.remove('paused'));
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !sStarted) { sStarted = true; showStory(0); }
    phone.classList.toggle('paused', !e.isIntersecting);
  }, { threshold: 0.4 }).observe(phone);

  // ─── 9. Gallery filter + lightbox ────────────────────────────────
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-photos] li').forEach((li) => {
      const show = f === 'all' || li.dataset.u === f;
      li.hidden = !show;
      li.classList.remove('show');
      if (show && !reduced) { void li.offsetWidth; li.classList.add('show'); }
    });
  }));
  const lb = $('[data-lbox]');
  const lbImg = $('[data-lb-img]');
  let lbItems = [], lbI = 0, lbRet = null;
  function lbShow() {
    const b = lbItems[lbI];
    lbImg.src = b.dataset.src;
    lbImg.alt = $('img', b).alt;
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    $('[data-lb-cap]').textContent = `${b.dataset.cap} — ${pad2(lbI + 1)} / ${pad2(lbItems.length)}`;
  }
  $$('[data-lb]').forEach((b) => b.addEventListener('click', () => {
    lbItems = $$('[data-lb]').filter((x) => !x.closest('[hidden]'));
    lbI = lbItems.indexOf(b); lbRet = b;
    lbShow(); lb.showModal();
  }));
  const lbStep = (d) => { lbI = (lbI + d + lbItems.length) % lbItems.length; lbShow(); };
  $('[data-lb-prev]').addEventListener('click', () => lbStep(-1));
  $('[data-lb-next]').addEventListener('click', () => lbStep(1));
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') lbStep(1); if (e.key === 'ArrowLeft') lbStep(-1); });
  lb.addEventListener('close', () => lbRet?.focus({ preventScroll: true }));

  // ─── 10. Route, form, dock ───────────────────────────────────────
  const route = $('[data-route]');
  const routeFill = $('[data-route-fill]');
  const stops = $$('li', route);

  const preview = $('[data-preview]');
  const st = { nights: 1, guests: 15 };
  const lim = { nights: [1, 14], guests: [1, 60] };
  const checkin = $('[data-checkin]');
  const today = new Date();
  checkin.min = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
  const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const parse = (v) => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmt = (d) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;

  function estimate() {
    const u = CONFIG.units[form.unit.value];
    const tot = $('[data-est-total]'), det = $('[data-est-detail]');
    if (!u) { tot.textContent = 'Rp1,8–3,8 jt'; det.textContent = 'Per malam, tergantung cottage dan hari. Admin akan menyarankan cottage sesuai jumlah tamu.'; return null; }
    const notes = [];
    if (st.guests > u.cap) {
      notes.push(`<span class="warn">${st.guests - u.cap} tamu di atas kapasitas ${u.cap}: +${rupiah(CONFIG.extraGuest)}/orang, dikonfirmasi admin.</span>`);
      if (u.cap === 20 && st.guests <= 25) notes.push('Cottage 2 atau 3 muat hingga 25 tamu.');
    }
    if (!checkin.value) { tot.textContent = `Mulai ${rupiah(u.wk)}`; det.innerHTML = ['Per malam, Minggu–Kamis. Pilih rencana check-in untuk perkiraan total.', ...notes].join('<br>'); return null; }
    const s = parse(checkin.value); let sum = 0; const c = { wk: 0, fri: 0, sat: 0 };
    for (let i = 0; i < st.nights; i++) { const d = new Date(s); d.setDate(d.getDate() + i); const k = d.getDay() === 5 ? 'fri' : d.getDay() === 6 ? 'sat' : 'wk'; c[k]++; sum += u[k]; }
    const parts = [c.wk && `${c.wk}× weekday`, c.fri && `${c.fri}× Jumat`, c.sat && `${c.sat}× Sabtu`].filter(Boolean);
    tot.textContent = rupiah(sum);
    det.innerHTML = [`${st.nights} malam (${parts.join(' + ')})`, ...notes].join('<br>');
    return sum;
  }
  function message(total) {
    const u = CONFIG.units[form.unit.value];
    const lines = ['Halo RJS Cottage, saya mau diskusi soal menginap:', ''];
    lines.push(`• Cottage: ${u ? u.name : 'belum yakin, mohon dibantu pilihkan'}`);
    lines.push(`• Rencana check-in: ${checkin.value ? fmt(parse(checkin.value)) : 'belum pasti'} (${st.nights} malam)`);
    lines.push(`• Jumlah tamu: ${st.guests} orang`);
    if (total) lines.push(`• Perkiraan dari website: ${rupiah(total)}`);
    const ask = form.elements.ask.value.trim();
    if (ask) lines.push('', `Pertanyaan: ${ask}`);
    const name = form.elements.name.value.trim();
    if (name) lines.push('', `Nama: ${name}`);
    lines.push('', 'Terima kasih!');
    return lines.join('\n');
  }
  function updateForm() { preview.textContent = message(estimate()); }
  $$('[data-step]', form).forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.step;
    st[k] = clamp(st[k] + +b.dataset.d, ...lim[k]);
    form.elements[k].value = st[k];
    updateForm();
  }));
  form.addEventListener('input', updateForm);
  form.addEventListener('change', updateForm);
  form.addEventListener('submit', (e) => { e.preventDefault(); window.open(waLink(message(estimate())), '_blank', 'noopener'); });
  updateForm();

  const dock = $('[data-dock]');
  const dockA = $('a', dock);
  const foot = $('.foot');
  function onScroll() {
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    progress.style.setProperty('--p', (y / max).toFixed(4));
    const r = route.getBoundingClientRect();
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.5), 0, 1);
    routeFill.style.setProperty('--p', p.toFixed(3));
    stops.forEach((s, i) => s.classList.toggle('lit', reduced || p >= i / (stops.length - 1) - 0.02));
    const b = booking.getBoundingClientRect(), f = foot.getBoundingClientRect();
    const show = y > hero.offsetHeight * 0.8 && !(b.top < vh && b.bottom > 0) && f.top > vh;
    dock.classList.toggle('on', show);
    dock.setAttribute('aria-hidden', String(!show));
    dockA.tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
