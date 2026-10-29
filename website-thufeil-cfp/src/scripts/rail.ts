/**
 * Horizontal rails (testimonials, Instagram). The track is a native scroller;
 * this adds prev/next buttons, a progress bar and an optional autoplay that
 * pauses on hover, focus, touch, when off-screen, or via its pause button.
 *
 * Markup:
 *   [data-rail] (optional data-autoplay="ms")
 *     [data-rail-track]  [data-rail-prev]  [data-rail-next]
 *     [data-rail-bar]    [data-rail-toggle] (optional)
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupRail(rail: HTMLElement) {
  const track = rail.querySelector<HTMLElement>('[data-rail-track]');
  if (!track) return;
  const prev = rail.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = rail.querySelector<HTMLButtonElement>('[data-rail-next]');
  const bar = rail.querySelector<HTMLElement>('[data-rail-bar]');
  const toggle = rail.querySelector<HTMLButtonElement>('[data-rail-toggle]');

  const max = () => track.scrollWidth - track.clientWidth;
  const step = () => {
    const first = track.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first ? first.offsetWidth + gap : track.clientWidth * 0.8;
  };
  // Replaced by the autoplay section when autoplay is on.
  let restart = () => {};

  const go = (dir: 1 | -1) =>
    track.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });

  const update = () => {
    const m = max();
    const x = track.scrollLeft;
    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= m - 2;
    if (bar) bar.style.transform = `scaleX(${0.1 + (m > 0 ? x / m : 1) * 0.9})`;
  };

  prev?.addEventListener('click', () => {
    go(-1);
    restart();
  });
  next?.addEventListener('click', () => {
    go(1);
    restart();
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Arrow keys move one card at a time when the track has focus.
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      go(e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  // ─── Autoplay ───
  const delay = Number(rail.dataset.autoplay) || 0;
  if (!delay || reduced) {
    if (toggle) toggle.hidden = true;
    return;
  }

  let timer = 0;
  let visible = false;
  let hovered = false; // pointer or keyboard focus on the cards: a temporary hold
  let paused = false; // set by the visitor (toggle, or swiping the track)

  const tick = () => {
    if (track.scrollLeft >= max() - 2) track.scrollTo({ left: 0, behavior: 'smooth' });
    else go(1);
  };
  const running = () => visible && !hovered && !paused && !document.hidden;
  restart = () => {
    window.clearInterval(timer);
    timer = running() ? window.setInterval(tick, delay) : 0;
  };

  const setPaused = (value: boolean) => {
    paused = value;
    if (toggle) {
      toggle.setAttribute('aria-label', value ? 'Putar otomatis' : 'Jeda putar otomatis');
      toggle.dataset.state = value ? 'paused' : 'playing';
    }
    restart();
  };

  toggle?.addEventListener('click', () => {
    setPaused(!paused);
    // Move right away so pressing play gives visible feedback.
    if (!paused) tick();
  });

  // Only the cards hold the autoplay, so the controls stay usable while hovered.
  const hold = (value: boolean) => {
    hovered = value;
    restart();
  };
  track.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && hold(true));
  track.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && hold(false));
  track.addEventListener('focusin', () => hold(true));
  track.addEventListener('focusout', () => hold(false));
  // Swiping means the visitor has taken over; the toggle shows play again.
  track.addEventListener('touchstart', () => setPaused(true), { passive: true });
  document.addEventListener('visibilitychange', restart);

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      restart();
    },
    { threshold: 0.35 },
  ).observe(track);
}

document.querySelectorAll<HTMLElement>('[data-rail]').forEach(setupRail);

// Module scope, so these names do not clash with other copies of this script.
export {};
