/**
 * Galeri hero: garis emas arch sebagai "timer" bercahaya.
 *
 * Jalur cahaya dihitung ulang dari ukuran nyata .o1-hero__arch-outline (border-radius CSS 999px/36px
 * diskalakan browser, jadi rumus skalanya ditiru di sini) dan titik awalnya mengikuti posisi medalion,
 * sehingga tetap pas di semua breakpoint.
 */
const DURATION = 3500; // ms per foto
const RUSH = 420; // ms untuk menuntaskan sisa garis saat pengguna klik "berikutnya"
const REVEAL = 1200; // ms, harus >= durasi animasi reveal di CSS

export function initHeroGallery() {
  const root = document.querySelector<HTMLElement>('[data-hero-gallery]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const visual = root.closest<HTMLElement>('.o1-hero__visual')!;
  const outline = visual.querySelector<HTMLElement>('.o1-hero__arch-outline')!;
  const trace = outline.querySelector<SVGSVGElement>('[data-hero-trace]')!;
  const line = trace.querySelector<SVGPathElement>('[data-trace-line]')!;
  const flash = trace.querySelector<SVGPathElement>('[data-trace-flash]')!;
  const head = trace.querySelector<SVGCircleElement>('[data-trace-head]')!;
  const seal = visual.querySelector<HTMLElement>('.o1-hero__seal');
  const status = root.querySelector<HTMLElement>('[data-hero-status]')!;
  const slides = Array.from(root.querySelectorAll<HTMLImageElement>('[data-hero-slide]'));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (slides.length < 2) return;

  let index = 0;
  let progress = 0; // 0..1
  let length = 0;
  let raf = 0;
  let last = 0;
  let rushFrom = -1; // progress saat klik, -1 = tidak sedang dipercepat
  let rushStart = 0;
  let hovered = false;
  let userPaused = false;
  let visible = true;
  let swapping = false;
  let revealTimer = 0;

  /* ---------- Gambar ---------- */
  const load = (img: HTMLImageElement) => {
    if (!img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
    return img.decode().catch(() => undefined);
  };
  const at = (i: number) => slides[(i + slides.length) % slides.length];

  /* ---------- Geometri jalur ---------- */
  const layout = () => {
    const W = outline.offsetWidth;
    const H = outline.offsetHeight;
    if (!W || !H) return;
    const b = parseFloat(getComputedStyle(outline).borderTopWidth) || 1.5;
    const k = b / 2; // garis tengah border
    // Skala radius CSS: semua radius dikali faktor yang sama bila jumlahnya melebihi sisi kotak.
    const f = Math.min(1, W / (999 * 2), H / (999 + 36));
    const R = 999 * f;
    const Rb = 36 * f;
    const r = R - k;
    const rb = Math.max(0.01, Rb - k);

    // Titik awal: sudut pada lengkung kiri-atas yang paling dekat dengan pusat medalion.
    let a = Math.PI * 1.25;
    if (seal) {
      const o = outline.getBoundingClientRect();
      const s = seal.getBoundingClientRect();
      const sx = s.left + s.width / 2 - o.left;
      const sy = s.top + s.height / 2 - o.top;
      a = Math.atan2(sy - R, sx - R);
      if (a < 0) a += Math.PI * 2;
      a = Math.min(Math.PI * 1.5, Math.max(Math.PI + 0.02, a));
    }
    const x0 = R + r * Math.cos(a);
    const y0 = R + r * Math.sin(a);
    const tail = Math.min(28, Math.max(0, H - Rb - R)); // sedikit naik di sisi kanan, masuk ke balik foto

    const d = [
      `M${x0.toFixed(2)} ${y0.toFixed(2)}`,
      `A${r} ${r} 0 0 0 ${k} ${R}`,
      `L${k} ${H - Rb}`,
      `A${rb} ${rb} 0 0 0 ${Rb} ${H - k}`,
      `L${W - Rb} ${H - k}`,
      `A${rb} ${rb} 0 0 0 ${W - k} ${H - Rb}`,
      `L${W - k} ${H - Rb - tail}`
    ].join(' ');

    trace.style.left = trace.style.top = `${-b}px`; // SVG menutup border-box, bukan padding-box
    trace.setAttribute('viewBox', `0 0 ${W} ${H}`);
    trace.style.width = `${W}px`;
    trace.style.height = `${H}px`;
    line.setAttribute('d', d);
    flash.setAttribute('d', d);
    length = line.getTotalLength();
    line.style.strokeDasharray = flash.style.strokeDasharray = `${length} ${length}`;
    flash.style.strokeDashoffset = '0';
    draw();
  };

  /* ---------- Gambar cahaya ---------- */
  const ease = (p: number) => 0.55 * p + 0.45 * (0.5 - Math.cos(Math.PI * p) / 2);
  const draw = () => {
    if (!length) return;
    const e = ease(Math.min(1, progress));
    line.style.strokeDashoffset = String(length * (1 - e));
    const pt = line.getPointAtLength(length * e);
    head.setAttribute('cx', pt.x.toFixed(2));
    head.setAttribute('cy', pt.y.toFixed(2));
    // Kepala cahaya muncul perlahan dari balik medalion dan meredup saat masuk ke balik foto.
    head.style.opacity = String(Math.min(1, progress / 0.06, (1 - progress) / 0.05));
  };

  const pulseFull = () => {
    flash.classList.remove('is-on');
    void flash.getBoundingClientRect(); // restart transisi
    flash.classList.add('is-on');
    requestAnimationFrame(() => requestAnimationFrame(() => flash.classList.remove('is-on')));
  };

  /* ---------- Ganti foto ---------- */
  const show = (next: number, announce: boolean) => {
    const to = (next + slides.length) % slides.length;
    if (to === index) return;
    const prev = slides[index];
    const incoming = slides[to];
    slides.forEach((s) => s.classList.remove('is-prev'));
    prev.classList.remove('is-active', 'is-entering');
    prev.classList.add('is-prev');
    prev.setAttribute('aria-hidden', 'true');
    incoming.classList.remove('is-prev');
    incoming.classList.add('is-active', 'is-entering');
    incoming.removeAttribute('aria-hidden');
    index = to;
    clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => {
      prev.classList.remove('is-prev');
      incoming.classList.remove('is-entering');
    }, REVEAL);
    if (announce) status.textContent = `Foto ${to + 1} dari ${slides.length}: ${incoming.alt}`;
    load(at(to + 1)); // siapkan foto berikutnya
  };

  const complete = async (announce: boolean, target = index + 1) => {
    if (swapping) return;
    swapping = true;
    stop();
    progress = 1;
    draw();
    await load(at(target)); // tahan garis penuh bila foto berikutnya belum siap
    pulseFull();
    show(target, announce);
    progress = 0;
    rushFrom = -1;
    draw();
    swapping = false;
    play();
  };

  /* ---------- Loop ---------- */
  const autoplay = () => !reduce.matches && !userPaused && !hovered && visible && !document.hidden;
  const tick = (now: number) => {
    raf = 0;
    if (rushFrom >= 0) {
      progress = rushFrom + (1 - rushFrom) * Math.min(1, (now - rushStart) / RUSH);
    } else {
      progress += (now - last) / DURATION;
    }
    last = now;
    draw();
    if (progress >= 1) { complete(rushFrom >= 0); return; }
    raf = requestAnimationFrame(tick);
  };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  const play = () => {
    trace.classList.toggle('is-paused', userPaused || hovered);
    trace.classList.toggle('is-static', reduce.matches);
    if (raf || swapping) return;
    if (rushFrom < 0 && !autoplay()) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const refresh = () => { if (!autoplay() && rushFrom < 0) stop(); play(); };

  const next = () => {
    if (swapping || rushFrom >= 0) return;
    if (reduce.matches) { void complete(true); return; }
    rushFrom = progress;
    rushStart = performance.now();
    stop();
    play();
  };
  const previous = async () => {
    if (swapping) return;
    swapping = true;
    stop();
    rushFrom = -1;
    await load(at(index - 1));
    show(index - 1, true);
    progress = 0;
    draw();
    swapping = false;
    play();
  };

  /* ---------- Interaksi ---------- */
  let down: { x: number; y: number; t: number } | undefined;
  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  root.addEventListener('pointerup', (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    down = undefined;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : void previous(); return; }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) next();
  });
  root.addEventListener('pointercancel', () => { down = undefined; });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); void previous(); }
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      userPaused = !userPaused;
      status.textContent = userPaused ? 'Pergantian foto dijeda' : 'Pergantian foto dilanjutkan';
      refresh();
    }
  });
  // Hover hanya untuk mouse; di layar sentuh, "hover" palsu akan membekukan galeri.
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovered = true; refresh(); } });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovered = false; refresh(); } });
  document.addEventListener('visibilitychange', refresh);
  reduce.addEventListener('change', () => { progress = 0; draw(); refresh(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); }, { threshold: 0.2 }).observe(root);
  new ResizeObserver(layout).observe(outline);

  layout();
  load(at(1));
  play();
}
