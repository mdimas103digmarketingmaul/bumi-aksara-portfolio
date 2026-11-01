/* RJS Cottage — Option 01 interactions.
 * Progressive: the page is complete without this file. GSAP/ScrollTrigger/Lenis are
 * optional enhancements; with prefers-reduced-motion nothing moves on its own.
 */
(() => {
  'use strict';

  // ─── Config (single place to edit) ──────────────────────────────
  const CONFIG = {
    // International format without "+", e.g. '6281234567890'.
    // Empty = WhatsApp opens with the message and lets the user pick a contact.
    // TODO(client): fill in the official reservation number.
    whatsapp: '',
    rates: {
      1: { name: 'RJS Cottage 1', cap: 20, wk: 1800000, fri: 2300000, sat: 3700000 },
      2: { name: 'RJS Cottage 2', cap: 25, wk: 2000000, fri: 2700000, sat: 3800000 },
      3: { name: 'RJS Cottage 3', cap: 25, wk: 2000000, fri: 2700000, sat: 3800000 },
    },
    extraGuest: 50000,
  };

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduced && hasGsap;

  root.classList.add('is-ready');
  if (!motion) root.classList.replace('motion', 'no-motion');

  const rupiah = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
  const rupiahShort = (n) => {
    const jt = n / 1e6;
    return 'Rp' + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.', ',')) + ' jt';
  };
  const waLink = (msg) =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  // ─── Smooth scroll ──────────────────────────────────────────────
  let lenis = null;
  if (motion) gsap.registerPlugin(ScrollTrigger);
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    root.classList.add('has-lenis');
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) * 16 || 68;
  function scrollToTarget(el) {
    if (lenis) lenis.scrollTo(el, { offset: -navH() + 1, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  // ─── WhatsApp links ─────────────────────────────────────────────
  // Anchors keep href="#booking" as a no-JS fallback; with JS they open WhatsApp.
  $$('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // In-page anchors (not WhatsApp links).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-wa')) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
    history.replaceState(null, '', id);
  });

  // ─── Nav: solid after hero, hide on scroll down ─────────────────
  const nav = $('[data-nav]');
  const hero = $('[data-hero]');
  const mqDesktop = window.matchMedia('(min-width: 56rem)');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const threshold = mqDesktop.matches ? 40 : hero.offsetHeight - navH();
    nav.classList.toggle('is-solid', y > threshold);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!document.body.classList.contains('menu-open')) {
      if (goingDown && y > hero.offsetHeight * 0.6) nav.classList.add('is-hidden');
      else if (goingUp || y < 80) nav.classList.remove('is-hidden');
    }
    if (goingDown || goingUp) lastY = y;
    updateDock(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section in nav.
  const navLinks = $$('.nav__links a');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  ['cottage', 'sehari', 'galeri', 'lokasi', 'faq'].forEach((id) => { const s = $('#' + id); if (s) io.observe(s); });

  // ─── Mobile menu ────────────────────────────────────────────────
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
    $('.sr-only', toggle).textContent = 'Tutup menu';
    document.body.classList.add('menu-open', 'is-locked');
    nav.classList.remove('is-hidden');
    lenis?.stop();
    setTimeout(() => $('a', menu)?.focus(), 150);
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    $('.sr-only', toggle).textContent = 'Buka menu';
    document.body.classList.remove('menu-open', 'is-locked');
    lenis?.start();
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700);
  }
  toggle.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  $$('[data-menu-link]').forEach((a) => a.addEventListener('click', closeMenu));

  // ─── Hero video ─────────────────────────────────────────────────
  const video = $('[data-hero-video]');
  const vToggle = $('[data-video-toggle]');
  let userPaused = reduced; // Reduced motion: start paused on the poster.
  function setPaused(p) {
    vToggle.setAttribute('aria-pressed', String(p));
    $('[data-video-label]').textContent = p ? 'Putar video' : 'Jeda video';
  }
  if (reduced) { video.removeAttribute('autoplay'); video.pause(); setPaused(true); }
  vToggle.addEventListener('click', () => {
    userPaused = !video.paused ? true : false;
    if (userPaused) video.pause(); else video.play().catch(() => {});
    setPaused(userPaused);
  });
  new IntersectionObserver(([en]) => {
    if (userPaused) return;
    if (en.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }).observe(video);

  // ─── Reveals ────────────────────────────────────────────────────
  if (root.classList.contains('motion')) {
    const rio = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    $$('[data-reveal]').forEach((el) => rio.observe(el));
  }

  // ─── Cottage picker (tabs) ──────────────────────────────────────
  const picker = $('[data-picker]');
  const tabs = $$('[role="tab"]', picker);
  const panels = $$('[role="tabpanel"]', picker);
  function selectTab(i, focus = false) {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
      if (on) {
        panels[j].classList.remove('is-entering');
        void panels[j].offsetWidth;
        if (!reduced) panels[j].classList.add('is-entering');
      }
    });
    picker.style.setProperty('--i', i);
    $('[data-picker-ink]').style.setProperty('--i', i);
    if (focus) tabs[i].focus();
    if (motion) ScrollTrigger.refresh();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); selectTab((i + map[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
    });
  });

  // ─── Facilities: floating image follows the cursor ──────────────
  const fac = $('[data-fac]');
  const float = $('[data-fac-float]');
  if (fac && finePointer && !reduced) {
    const img = $('img', float);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      float.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    fac.addEventListener('pointermove', (e) => {
      const r = fac.getBoundingClientRect();
      tx = e.clientX - r.left + 24; ty = e.clientY - r.top - 120;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    $$('[data-fac-img]', fac).forEach((li) => {
      li.addEventListener('pointerenter', () => { img.src = li.dataset.facImg; float.classList.add('is-on'); });
      li.addEventListener('pointerleave', () => float.classList.remove('is-on'));
    });
  }

  // ─── Stories: drag to scroll (mouse) ────────────────────────────
  const rail = $('[data-rail]');
  if (rail && finePointer) {
    let down = false, startX = 0, startLeft = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-dragging'); }
      rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      setTimeout(() => rail.classList.remove('is-dragging'), 0);
    });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  // ─── Gallery filter + autoplaying video tile ────────────────────
  const grid = $('[data-grid]');
  $$('[data-filter]').forEach((b) => {
    b.addEventListener('click', () => {
      const f = b.dataset.filter;
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $$('.g', grid).forEach((g) => {
        const show = f === 'all' || g.dataset.unit === f;
        g.hidden = !show;
        g.classList.remove('is-showing');
        if (show && !reduced) { void g.offsetWidth; g.classList.add('is-showing'); }
      });
      if (motion) ScrollTrigger.refresh();
    });
  });
  if (!reduced) {
    const vio = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }), { threshold: 0.25 });
    $$('video[data-autoplay]').forEach((v) => vio.observe(v));
  }

  // ─── Lightbox ───────────────────────────────────────────────────
  const lb = $('[data-lb]');
  const stage = $('[data-lb-stage]');
  const cap = $('[data-lb-cap]');
  let lbItems = [], lbIndex = 0, lbReturn = null;
  function renderLb() {
    const it = lbItems[lbIndex];
    stage.innerHTML = '';
    let media;
    if (it.dataset.video) {
      media = document.createElement('video');
      Object.assign(media, { src: it.dataset.video, poster: it.dataset.src, controls: true, loop: true, playsInline: true, muted: true });
      if (!reduced) media.autoplay = true;
    } else {
      media = document.createElement('img');
      media.src = it.dataset.src;
      media.alt = $('img', it)?.alt || it.dataset.caption || '';
    }
    stage.append(media);
    cap.textContent = `${it.dataset.caption || ''}  ·  ${lbIndex + 1}/${lbItems.length}`;
  }
  function openLb(trigger) {
    const group = trigger.dataset.lightbox;
    lbItems = $$(`[data-lightbox="${group}"]`).filter((el) => !el.closest('[hidden]'));
    lbIndex = Math.max(0, lbItems.indexOf(trigger));
    lbReturn = trigger;
    renderLb();
    lb.showModal();
    lenis?.stop();
  }
  const stepLb = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; renderLb(); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lightbox]');
    if (t) openLb(t);
  });
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  $('[data-lb-prev]').addEventListener('click', () => stepLb(-1));
  $('[data-lb-next]').addEventListener('click', () => stepLb(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === stage) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft') stepLb(-1);
  });
  lb.addEventListener('close', () => { stage.innerHTML = ''; lenis?.start(); lbReturn?.focus(); });

  // ─── Booking enquiry builder ────────────────────────────────────
  const form = $('[data-enquiry]');
  const state = { nights: 1, guests: 15 };
  const limits = { nights: [1, 14], guests: [1, 60] };
  const checkin = $('[data-checkin]', form);
  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  checkin.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const fmtDate = (d) => `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const parseDate = (v) => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };

  function estimate() {
    const unit = form.unit.value;
    const r = CONFIG.rates[unit];
    const totalEl = $('[data-estimate-total]');
    const detailEl = $('[data-estimate-detail]');
    if (!r) {
      totalEl.textContent = 'Rp1,8–3,8 jt';
      detailEl.innerHTML = 'Per malam, tergantung cottage dan hari. Admin akan menyarankan cottage sesuai jumlah tamu.';
      return null;
    }
    const notes = [];
    if (state.guests > r.cap) {
      const over = state.guests - r.cap;
      notes.push(`<span class="warn">${over} tamu di atas kapasitas ${r.cap} orang: +${rupiah(CONFIG.extraGuest)}/orang, dikonfirmasi admin.</span>`);
      if (unit === '1' && state.guests <= 25) notes.push('Cottage 2 atau 3 muat hingga 25 tamu.');
    }
    if (!checkin.value) {
      totalEl.textContent = `Mulai ${rupiahShort(r.wk)}`;
      detailEl.innerHTML = ['Per malam (Minggu–Kamis). Pilih tanggal check-in untuk perkiraan total.', ...notes].join('<br>');
      return null;
    }
    const start = parseDate(checkin.value);
    let total = 0;
    const counts = { wk: 0, fri: 0, sat: 0 };
    for (let i = 0; i < state.nights; i++) {
      const d = new Date(start); d.setDate(d.getDate() + i);
      const k = d.getDay() === 5 ? 'fri' : d.getDay() === 6 ? 'sat' : 'wk';
      counts[k]++; total += r[k];
    }
    const parts = [];
    if (counts.wk) parts.push(`${counts.wk}× weekday`);
    if (counts.fri) parts.push(`${counts.fri}× Jumat`);
    if (counts.sat) parts.push(`${counts.sat}× Sabtu`);
    totalEl.textContent = rupiah(total);
    detailEl.innerHTML = [`${state.nights} malam (${parts.join(' + ')}) · ${r.name}`, ...notes].join('<br>');
    return total;
  }

  $$('[data-step]', form).forEach((b) => {
    b.addEventListener('click', () => {
      const k = b.dataset.step;
      const [min, max] = limits[k];
      state[k] = Math.min(max, Math.max(min, state[k] + Number(b.dataset.dir)));
      form.elements[k].value = state[k];
      estimate();
    });
  });
  form.addEventListener('input', estimate);
  form.addEventListener('change', estimate);
  estimate();

  // Unit CTAs in the picker also preselect the form.
  $$('[data-unit-pick]').forEach((a) => a.addEventListener('click', () => {
    const radio = $(`input[name="unit"][value="${a.dataset.unitPick}"]`, form);
    if (radio) { radio.checked = true; estimate(); }
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const unit = form.unit.value;
    const r = CONFIG.rates[unit];
    const total = estimate();
    const lines = ['Halo RJS Cottage, saya mau cek ketersediaan:', ''];
    lines.push(`• Cottage: ${r ? r.name : 'belum yakin, mohon dibantu pilihkan'}`);
    lines.push(`• Check-in: ${checkin.value ? fmtDate(parseDate(checkin.value)) : 'tanggal belum pasti'} (${state.nights} malam)`);
    lines.push(`• Jumlah tamu: ${state.guests} orang`);
    if (total) lines.push(`• Perkiraan dari website: ${rupiah(total)}`);
    const name = form.elements.name.value.trim();
    if (name) lines.push('', `Nama: ${name}`);
    lines.push('', 'Terima kasih!');
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  });

  // ─── Mobile dock ────────────────────────────────────────────────
  const dock = $('[data-dock]');
  const dockBtn = $('a', dock);
  const booking = $('#booking');
  const footer = $('.footer');
  function updateDock(y) {
    const vh = window.innerHeight;
    const pastHero = y > hero.offsetHeight * 0.85;
    const b = booking.getBoundingClientRect();
    const f = footer.getBoundingClientRect();
    const nearConvert = (b.top < vh && b.bottom > 0) || f.top < vh;
    const show = pastHero && !nearConvert;
    dock.classList.toggle('is-visible', show);
    dock.setAttribute('aria-hidden', String(!show));
    dockBtn.tabIndex = show ? 0 : -1;
  }
  onScroll();

  // ─── Motion (GSAP) ──────────────────────────────────────────────
  if (!motion) return;

  // Hero entrance.
  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroTl
    .from('[data-hero-title] .li', { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.15)
    .from('[data-hero-fade]', { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.08 }, 0.35)
    .from('[data-hero-arch]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0)
    .from('[data-hero-video]', { scale: 1.25, duration: 2.2 }, 0)
    .from('[data-hero-card]', { autoAlpha: 0, y: 40, rotate: 4, duration: 1.4 }, 0.7);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 56rem)', () => {
    // Hero parallax: card drifts faster than the arch.
    gsap.to('[data-hero-media]', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('[data-hero-card]', { y: -90, rotate: -7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  });
  mm.add('(max-width: 55.99rem)', () => {
    gsap.to('[data-hero-video]', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  });

  // Manifesto: words light up as you read.
  const text = $('[data-words]');
  if (text) {
    const words = splitWords(text);
    gsap.fromTo(words, { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 52%', scrub: true },
    });
    gsap.from($$('.pill', text), {
      scale: 0.4, autoAlpha: 0, ease: 'back.out(1.6)', duration: 0.9, stagger: 0.15,
      scrollTrigger: { trigger: text, start: 'top 70%' },
    });
  }

  // Breather: the pool opens to full bleed.
  const breather = $('[data-breather]');
  if (breather) {
    const frame = $('[data-breather-frame]');
    const small = window.matchMedia('(max-width: 55.99rem)').matches;
    gsap.set(frame, { '--cy': small ? '18%' : '14%', '--cx': small ? '6%' : '18%' });
    gsap.timeline({ scrollTrigger: { trigger: breather, start: 'top top', end: 'bottom bottom', scrub: true } })
      .to(frame, { '--cy': '0%', '--cx': '0%', '--cr': '0rem', '--s': 1, ease: 'none', duration: 1 })
      .to('[data-breather-quote]', { '--qo': 1, ease: 'none', duration: 0.35 }, 0.55);
  }

  // A day at RJS: horizontal travel + morning-to-night colour.
  const day = $('[data-day]');
  if (day) {
    const moments = $$('.moment', day);
    const timeEl = $('[data-day-time]');
    const prog = $('[data-day-progress]');
    // Paper morning → warm afternoon → dusk → night.
    const stops = [
      [0, [244, 241, 234]],
      [0.4, [240, 230, 210]],
      [0.62, [228, 200, 156]],
      [0.78, [42, 58, 50]],
      [1, [14, 27, 21]],
    ];
    const lerp = (a, b, t) => a + (b - a) * t;
    function colorAt(p) {
      for (let i = 1; i < stops.length; i++) {
        if (p <= stops[i][0]) {
          const [p0, c0] = stops[i - 1], [p1, c1] = stops[i];
          const t = (p - p0) / (p1 - p0);
          return c0.map((v, k) => Math.round(lerp(v, c1[k], t)));
        }
      }
      return stops[stops.length - 1][1];
    }
    let lastIdx = -1;
    function updateDay(p) {
      const [r, g, b] = colorAt(p);
      const dark = (0.299 * r + 0.587 * g + 0.114 * b) < 140;
      day.style.setProperty('--bg', `rgb(${r} ${g} ${b})`);
      day.style.setProperty('--fg', dark ? '#f4f1ea' : '#13241c');
      day.style.setProperty('--soft', dark ? 'rgb(244 241 234 / 0.72)' : 'rgb(19 36 28 / 0.7)');
      day.style.setProperty('--em', dark ? '#f1b86a' : '#1f5fd6');
      prog.style.setProperty('--p', p.toFixed(3));
      const idx = Math.min(moments.length - 1, Math.round(p * (moments.length - 1)));
      if (idx !== lastIdx) { timeEl.textContent = moments[idx].dataset.time; lastIdx = idx; }
    }

    mm.add('(min-width: 56rem)', () => {
      const list = $('.day__list', day);
      const dist = () => Math.max(0, list.scrollWidth - window.innerWidth);
      const travel = gsap.to(list, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: $('[data-day-pin]'),
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateDay(self.progress),
        },
      });
      // Each image eases open as it enters the stage.
      moments.forEach((m) => {
        gsap.from($('img', m), { scale: 1.2, ease: 'none', scrollTrigger: { trigger: m, containerAnimation: travel, start: 'left right', end: 'center center', scrub: true } });
      });
    });
    mm.add('(max-width: 55.99rem)', () => {
      ScrollTrigger.create({
        trigger: $('.day__list', day),
        start: 'top 70%',
        end: 'bottom 70%',
        onUpdate: (self) => updateDay(self.progress),
      });
    });
  }

  // Route line draws itself.
  const path = $('[data-route-path]');
  if (path) {
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: '.route', start: 'top 85%', end: 'bottom 55%', scrub: true },
    });
    gsap.from('.route__stops li', {
      autoAlpha: 0, x: -10, stagger: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.route', start: 'top 75%', end: 'bottom 55%', scrub: true },
    });
  }

  // Cottage main image: slow drift for depth.
  $$('.unit__main img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.closest('.unit'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Footer mark rises.
  gsap.from('.footer__mark', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Layout settles after fonts/images.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ─── Helpers ────────────────────────────────────────────────────
  function splitWords(el) {
    const out = [];
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            out.push(w);
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('pill')) {
          walk(child);
        }
      });
    };
    walk(el);
    return out;
  }
})();
