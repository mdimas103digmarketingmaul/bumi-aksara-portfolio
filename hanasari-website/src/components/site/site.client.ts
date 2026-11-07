/*
 * Interaksi website Hanasari Catering — vanilla TS, tanpa dependency.
 * Semua konten sudah dirender di server; skrip ini hanya menambah perilaku.
 */

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Header: state saat scroll + menu mobile ---------- */
const header = $('[data-header]');
const navToggle = $<HTMLButtonElement>('[data-nav-toggle]');
const nav = $('#o1-nav');

const setNavTop = () => {
  if (!header) return;
  document.documentElement.style.setProperty('--nav-top', `${Math.max(0, header.getBoundingClientRect().bottom)}px`);
};

const closeNav = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove('is-open');
  header?.classList.remove('is-menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Buka navigasi');
  document.body.style.overflow = '';
};

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  if (!open) return closeNav();
  setNavTop();
  nav?.classList.add('is-open');
  header?.classList.add('is-menu-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Tutup navigasi');
  document.body.style.overflow = 'hidden';
});
$$('a', nav ?? undefined).forEach((a) => a.addEventListener('click', closeNav));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('is-open')) {
    closeNav();
    navToggle?.focus();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 1060) closeNav(); }, { passive: true });

const floatWa = $('[data-float-wa]');
const hero = $('.o1-hero') ?? $('[data-float-anchor]');
// Sembunyikan tombol mengambang saat formulir konsultasi / footer terlihat agar tidak menutupi konten.
let footerInView = false;
const quietZones = $$('.o1-form, .o1-footer__bottom');
if (quietZones.length && 'IntersectionObserver' in window) {
  const visible = new Set<Element>();
  const zoneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    footerInView = visible.size > 0;
    onScroll();
  });
  quietZones.forEach((el) => zoneObserver.observe(el));
}
let ticking = false;
const onScroll = () => {
  ticking = false;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  if (floatWa && hero) floatWa.classList.toggle('is-visible', y > hero.offsetTop + hero.offsetHeight * 0.6 && !footerInView);
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

/* ---------- Reveal saat elemen masuk viewport ---------- */
const revealTargets = $$('[data-reveal], [data-steps]');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-in'));
}

/* ---------- Tab generik (keyboard: panah kiri/kanan, Home, End) ---------- */
type TabConfig = { tabs: HTMLElement[]; select: (id: string, focus?: boolean) => void; idOf: (tab: HTMLElement) => string };
const wireTabKeys = ({ tabs, select, idOf }: TabConfig) => {
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(idOf(tab)));
    tab.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      select(idOf(tabs[next]), true);
    });
  });
};

/* ---------- Menu: tab kategori + slider ---------- */
const menuTabs = $('[data-tabs]');
if (menuTabs) {
  const tabs = $$<HTMLButtonElement>('[data-tab]', menuTabs);
  const panels = $$('[data-panel]', menuTabs);
  const activePanel = () => $<HTMLElement>('.o1-tabs__panel.is-active', menuTabs);
  const activeTrack = () => $<HTMLElement>('.o1-tabs__panel.is-active [data-track]', menuTabs);

  const update = () => {
    const panel = activePanel();
    const track = activeTrack();
    if (!panel || !track) return;
    const max = track.scrollWidth - track.clientWidth;
    const bar = $<HTMLElement>('[data-progress]', panel);
    const prev = $<HTMLButtonElement>('[data-slide-prev]', panel);
    const next = $<HTMLButtonElement>('[data-slide-next]', panel);
    if (prev) prev.disabled = track.scrollLeft <= 4;
    if (next) next.disabled = track.scrollLeft >= max - 4;
    if (bar) {
      const ratio = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      bar.style.width = `${Math.min(100, ratio * 100)}%`;
      const pos = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = `translateX(${pos * ((1 - Math.min(1, ratio)) / Math.min(1, ratio)) * 100}%)`;
    }
  };

  const catRail = $<HTMLElement>('[data-cats]', menuTabs);
  const select = (id: string, focus = false) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
      // Rail kategori bisa digeser di layar kecil; geser tanpa ikut menggulir halaman.
      if (on && catRail && catRail.scrollWidth > catRail.clientWidth) {
        catRail.scrollTo({ left: tab.offsetLeft - (catRail.clientWidth - tab.offsetWidth) / 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    });
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === id));
    const track = activeTrack();
    if (track) track.scrollLeft = 0;
    requestAnimationFrame(update);
  };

  wireTabKeys({ tabs, select, idOf: (t) => t.dataset.tab || 'nasi-box' });

  const step = (dir: number) => {
    const track = activeTrack();
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.o1-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const amount = card ? (card.offsetWidth + gap) * Math.max(1, Math.floor(track.clientWidth / (card.offsetWidth + gap))) : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  };
  $$('[data-slide-prev]', menuTabs).forEach((btn) => btn.addEventListener('click', () => step(-1)));
  $$('[data-slide-next]', menuTabs).forEach((btn) => btn.addEventListener('click', () => step(1)));

  $$<HTMLElement>('[data-track]', menuTabs).forEach((track) => {
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(menuTabs);
  update();

  // Tautan lain (mis. kartu tumpeng di hero, daftar paket di Racik isi box) bisa langsung
  // membuka tab tertentu, dan opsional menggeser slider ke kartu paketnya (data-card).
  $$<HTMLAnchorElement>('[data-tab-link]').forEach((link) => link.addEventListener('click', (e) => {
    select(link.dataset.tabLink || 'nasi-box');
    const card = link.dataset.card ? document.getElementById(link.dataset.card) : null;
    const track = activeTrack();
    if (!card || !track) return;
    e.preventDefault();
    menuTabs.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => {
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      const left = track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left - pad;
      track.scrollTo({ left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  }));
}

/* ---------- Racik isi box: tab chip ---------- */
const chipWrap = $('[data-chips]');
if (chipWrap) {
  const tabs = $$<HTMLButtonElement>('[data-chip-tab]', chipWrap);
  const panels = $$('[data-chip-panel]', chipWrap);
  const select = (id: string, focus = false) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.chipTab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on) {
        if (focus) tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    });
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.chipPanel === id));
  };
  wireTabKeys({ tabs, select, idOf: (t) => t.dataset.chipTab || 'ayam' });
}

/* ---------- Testimoni: spotlight ---------- */
const reviewWrap = $('[data-reviews]');
if (reviewWrap) {
  const slides = $$('[data-review-slide]', reviewWrap);
  const dots = $$<HTMLButtonElement>('[data-review-go]', reviewWrap);
  const indexEl = $('[data-review-index]', reviewWrap);
  let current = 0;
  const go = (i: number) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === current;
      s.classList.toggle('is-active', on);
      s.toggleAttribute('inert', !on);
    });
    dots.forEach((d, n) => d.setAttribute('aria-pressed', String(n === current)));
    if (indexEl) indexEl.textContent = String(current + 1).padStart(2, '0');
  };
  // Auto-slide: jalan saat section terlihat; berhenti sementara saat kursor/fokus di dalam,
  // tab tidak aktif, atau dialog terbuka. Interaksi manual menunda autoplay beberapa detik.
  const AUTOPLAY_MS = 6500;
  const RESUME_MS = 12000;
  let timer = 0;
  let resumeTimer = 0;
  let inView = false;
  let hovering = false;
  let manualHold = false;
  const canPlay = () => !reduceMotion.matches && inView && !hovering && !manualHold && !document.hidden && !$<HTMLDialogElement>('[data-proof-dialog]')?.open;
  const stop = () => { window.clearInterval(timer); timer = 0; reviewWrap.classList.remove('is-playing'); };
  const restartBar = () => {
    // Ulang animasi progress bar setiap pergantian slide
    reviewWrap.classList.remove('is-playing');
    void reviewWrap.offsetWidth;
    reviewWrap.classList.add('is-playing');
  };
  const play = () => {
    stop();
    if (!canPlay()) return;
    restartBar();
    timer = window.setInterval(() => { go(current + 1); restartBar(); }, AUTOPLAY_MS);
  };
  const userGo = (i: number) => {
    go(i);
    stop();
    manualHold = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => { manualHold = false; play(); }, RESUME_MS);
  };
  reviewWrap.style.setProperty('--autoplay', `${AUTOPLAY_MS}ms`);

  dots.forEach((d) => d.addEventListener('click', () => userGo(Number(d.dataset.reviewGo))));
  $('[data-review-prev]', reviewWrap)?.addEventListener('click', () => userGo(current - 1));
  $('[data-review-next]', reviewWrap)?.addEventListener('click', () => userGo(current + 1));

  // Geser (swipe) di layar sentuh
  const stage = $('.o1-reviews__slides', reviewWrap);
  let startX = 0;
  stage?.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stage?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) userGo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  reviewWrap.addEventListener('mouseenter', () => { hovering = true; stop(); });
  reviewWrap.addEventListener('mouseleave', () => { hovering = false; play(); });
  // Hanya fokus keyboard yang menahan autoplay; fokus sisa klik mouse tidak.
  reviewWrap.addEventListener('focusin', (e) => {
    if ((e.target as Element).matches(':focus-visible')) { hovering = true; stop(); }
  });
  reviewWrap.addEventListener('focusout', (e) => {
    if (!reviewWrap.contains(e.relatedTarget as Node | null)) { hovering = false; play(); }
  });
  document.addEventListener('visibilitychange', play);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; play(); }, { threshold: 0.35 }).observe(reviewWrap);
  }
  go(0);

  // Dialog tangkapan layar ulasan
  const dialog = $<HTMLDialogElement>('[data-proof-dialog]');
  const dialogImg = $<HTMLImageElement>('[data-proof-img]');
  const dialogTitle = $('#o1-dialog-title');
  let opener: HTMLElement | null = null;
  $$<HTMLButtonElement>('[data-proof]').forEach((btn) => btn.addEventListener('click', () => {
    if (!dialog || !dialogImg) return;
    opener = btn;
    dialogImg.src = btn.dataset.proof || '';
    dialogImg.alt = `Tangkapan layar ulasan Google dari ${btn.dataset.proofName}`;
    if (dialogTitle) dialogTitle.textContent = `Ulasan ${btn.dataset.proofName}`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.open(dialogImg.src, '_blank', 'noopener');
  }));
  $('[data-proof-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => { opener?.focus(); play(); });
}

/* ---------- Formulir konsultasi → WhatsApp (dengan pratinjau langsung) ---------- */
const form = $<HTMLFormElement>('[data-inquiry]');
if (form) {
  const number = form.dataset.waNumber || '628563050300';
  const preview = $('[data-preview]');
  const bubble = preview?.closest<HTMLElement>('.o1-chat__bubble') ?? null;
  const errorEl = $('[data-form-error]', form);
  const resultEl = $('[data-form-result]', form);
  const fallback = $<HTMLAnchorElement>('[data-form-fallback]', form);

  const val = (name: string) => {
    const el = form.elements.namedItem(name);
    if (el instanceof RadioNodeList) return String(el.value || '').trim();
    return el && 'value' in el ? String((el as HTMLInputElement).value || '').trim() : '';
  };
  const fmtDate = (v: string) => {
    if (!v) return '';
    const d = new Date(`${v}T00:00:00`);
    return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  };
  const buildMessage = () => {
    const lines: (string | null)[] = [
      'Halo Hanasari Catering, saya datang dari website Hanasari.',
      '',
      `Saya ${val('nama') || '…'} ingin konsultasi catering.`,
      `• Jenis acara: ${val('acara') || '-'}`,
      `• Pilihan menu: ${val('paket') || '-'}`,
      val('porsi') ? `• Jumlah: ${val('porsi')} porsi/box` : null,
      val('tanggal') ? `• Tanggal: ${fmtDate(val('tanggal'))}` : null,
      val('lokasi') ? `• Lokasi: ${val('lokasi')}` : null,
      val('catatan') ? `• Catatan: ${val('catatan')}` : null,
      '',
      'Sumber: Website Hanasari — Formulir konsultasi'
    ];
    return lines.filter((l) => l !== null).join('\n');
  };

  let bumpTimer = 0;
  const renderPreview = () => {
    if (!preview) return;
    preview.textContent = buildMessage();
    if (bubble && !reduceMotion.matches) {
      bubble.classList.remove('is-updated');
      window.clearTimeout(bumpTimer);
      void bubble.offsetWidth;
      bubble.classList.add('is-updated');
      bumpTimer = window.setTimeout(() => bubble.classList.remove('is-updated'), 400);
    }
  };
  form.addEventListener('input', renderPreview);
  form.addEventListener('change', renderPreview);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.elements.namedItem('nama') as HTMLInputElement;
    const chipset = $('.o1-field--chips', form);
    const missing: string[] = [];
    nameInput.removeAttribute('aria-invalid');
    chipset?.classList.remove('is-invalid');
    if (!val('nama')) { missing.push('nama'); nameInput.setAttribute('aria-invalid', 'true'); }
    if (!val('acara')) { missing.push('jenis acara'); chipset?.classList.add('is-invalid'); }
    if (missing.length) {
      if (errorEl) { errorEl.textContent = `Mohon lengkapi ${missing.join(' dan ')} terlebih dahulu.`; errorEl.hidden = false; }
      (missing[0] === 'nama' ? nameInput : $<HTMLInputElement>('input[name="acara"]', form))?.focus();
      return;
    }
    if (errorEl) errorEl.hidden = true;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`;
    if (fallback) fallback.href = url;
    if (resultEl) resultEl.hidden = false;
    window.open(url, '_blank', 'noopener');
  });
}
