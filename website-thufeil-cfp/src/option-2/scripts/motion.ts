import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setLenis } from './scroll';

/**
 * All page motion lives here. Everything is progressive: without JS or with
 * prefers-reduced-motion the page renders fully and statically. The
 * horizontal rails live in rail.ts and work without this file.
 */

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

// ─── Text splitting ───────────────────────────────────────────────

/** Wraps every word in a mask (.w) + inner (.wi). Keeps spaces and nested markup. */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (!el.dataset.splitDone) {
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(document.createTextNode(part));
              return;
            }
            const w = document.createElement('span');
            w.className = 'w';
            const wi = document.createElement('span');
            wi.className = 'wi';
            wi.textContent = part;
            w.append(wi);
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child instanceof HTMLElement) {
          if (child.matches('sup, br')) {
            if (child.matches('sup')) {
              const w = document.createElement('span');
              w.className = 'w';
              const wi = document.createElement('span');
              wi.className = 'wi';
              child.replaceWith(w);
              wi.append(child);
              w.append(wi);
            }
            return;
          }
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
  }
  return $$('.wi', el);
}

/** Splits plain text into per-character masks. */
function splitChars(el: HTMLElement): HTMLElement[] {
  if (!el.dataset.splitDone) {
    const label = el.textContent ?? '';
    el.setAttribute('aria-label', label);
    el.innerHTML = '';
    // Characters are grouped per word so a line can only break between words.
    label.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        el.append(document.createTextNode(' '));
        return;
      }
      const word = document.createElement('span');
      word.className = 'word';
      word.setAttribute('aria-hidden', 'true');
      for (const ch of part) {
        const w = document.createElement('span');
        w.className = 'w';
        const wi = document.createElement('span');
        wi.className = 'wi';
        wi.textContent = ch;
        w.append(wi);
        word.append(w);
      }
      el.append(word);
    });
    el.dataset.splitDone = '1';
  }
  return $$('.wi', el);
}

// ─── Reduced motion: nothing to do beyond showing everything ──────

if (reduced) {
  root.classList.add('motion-ready');
} else {
  init();
}

function init() {
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('motion-ready');

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.2 });
  setLenis(lenis);
  root.classList.add('has-lenis');
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hold scrolling while the first-visit intro plays.
  if (root.classList.contains('intro')) lenis.stop();
  intro().then(() => lenis.start());

  setupReveals();
  setupHeroScroll();
  setupManifesto();
  setupCounters();
  setupHighlights();
  setupCertificate();
  setupClosing();
  setupMagnetic();

  // Fonts and lazy images change layout; re-measure once they settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ─── Intro: preloader (first visit) → hero entrance ───────────────

function intro(): Promise<void> {
  const pre = $('[data-pre]');
  const firstVisit = root.classList.contains('intro') && pre;
  const tl = gsap.timeline();

  const giant = $('[data-hero-giant]');
  const chars = giant ? splitChars(giant) : [];
  if (giant) gsap.set(giant, { visibility: 'visible' });
  gsap.set(chars, { yPercent: 108 });

  if (firstVisit) {
    const words = $$('[data-pre-word]', pre);
    const count = $('[data-pre-count]', pre);
    const bar = $('[data-pre-bar]', pre);
    const counter = { v: 0 };
    const step = 0.32;

    tl.to(counter, {
      v: 100,
      duration: words.length * step + 0.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(counter.v));
      },
    }, 0);
    tl.to(bar, { scaleX: 1, duration: words.length * step + 0.2, ease: 'power2.inOut' }, 0);
    words.forEach((w, i) => {
      const last = i === words.length - 1;
      tl.fromTo(w, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.28, ease: 'power3.out' }, i * step);
      if (!last) tl.to(w, { yPercent: -60, opacity: 0, duration: 0.24, ease: 'power3.in' }, i * step + step - 0.04);
    });
    tl.to(pre, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.05,
      ease: 'expo.inOut',
      onComplete: () => {
        root.classList.remove('intro');
        try {
          sessionStorage.setItem('tf-intro', '1');
        } catch {
          /* private mode */
        }
      },
    }, '+=0.15');
    tl.addLabel('hero', '-=0.45');
  } else {
    tl.addLabel('hero', 0.05);
  }

  tl.to('[data-hero-glow]', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 'hero');
  tl.to(chars, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.055 }, 'hero');
  tl.fromTo(
    '[data-hero-portrait]',
    { opacity: 0, yPercent: 10, scale: 1.05 },
    { opacity: 1, yPercent: 0, scale: 1, duration: 1.8, ease: 'expo.out' },
    'hero+=0.15',
  );
  tl.fromTo(
    '[data-hero-fade]',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
    'hero+=0.55',
  );

  return new Promise((resolve) => tl.eventCallback('onComplete', () => resolve()));
}

// ─── Generic reveals ──────────────────────────────────────────────

function setupReveals() {
  // Headings: words rise out of their masks.
  $$('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.06 }),
    });
  });

  // Blocks: fade + lift, batched so siblings stagger together.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Images: wipe up from the bottom.
  $$('[data-wipe]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    );
    const img = $('img', el);
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.25 },
        { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } },
      );
    }
  });
}

// ─── Hero: depth on scroll + pointer ──────────────────────────────

function setupHeroScroll() {
  const hero = $('[data-hero]');
  if (!hero) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  tl.to('[data-hero-name]', { yPercent: -22, ease: 'none' }, 0)
    .to('[data-hero-figure]', { yPercent: 12, scale: 0.92, ease: 'none' }, 0)
    .to(['[data-hero-inner]', '[data-hero-figure]'], { opacity: 0.35, ease: 'none' }, 0);

  if (!finePointer) return;
  const mouse = $('[data-hero-mouse]');
  const name = $('[data-hero-giant]');
  if (!mouse || !name) return;
  const mx = gsap.quickTo(mouse, 'x', { duration: 1.2, ease: 'power3' });
  const my = gsap.quickTo(mouse, 'y', { duration: 1.2, ease: 'power3' });
  const nx = gsap.quickTo(name, 'x', { duration: 1.6, ease: 'power3' });
  hero.addEventListener('pointermove', (e) => {
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    mx(px * 22);
    my(py * 12);
    nx(px * -30);
  });
}

// ─── Manifesto: words light up as you read ────────────────────────

function setupManifesto() {
  $$('[data-scrub-words]').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { opacity: 0.14 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
    });
  });
}

// Marker underlines draw from left to right once the text is on screen.
function setupHighlights() {
  $$('[data-hl]').forEach((el, i) => {
    gsap.fromTo(
      el,
      { backgroundSize: '0% 0.38em' },
      {
        backgroundSize: '100% 0.38em',
        duration: 1.1,
        delay: 0.35 + (i % 2) * 0.25,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      },
    );
  });
}

function setupCounters() {
  const fmt = new Intl.NumberFormat('id-ID');
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count) || 0;
    const state = { v: 0 };
    el.textContent = fmt.format(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = fmt.format(Math.round(state.v));
          },
        }),
    });
  });
}

// ─── Certificate: lifts from a tilted angle, follows the pointer ──

function setupCertificate() {
  const card = $('[data-cert-card]');
  const tilt = $('[data-cert-tilt]');
  if (!card || !tilt) return;

  gsap.fromTo(
    tilt,
    { rotateX: 32, rotateZ: -7, yPercent: 18, scale: 0.86 },
    {
      rotateX: 0,
      rotateZ: 0,
      yPercent: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-cert]', start: 'top bottom', end: 'center 55%', scrub: 0.8 },
    },
  );

  if (!finePointer) return;
  const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3' });
  const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3' });
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry((px - 0.5) * 12);
    rx((0.5 - py) * 10);
    tilt.style.setProperty('--sx', `${px * 100}%`);
    tilt.style.setProperty('--sy', `${py * 100}%`);
  });
  card.addEventListener('pointerleave', () => {
    ry(0);
    rx(0);
  });
}

// ─── Closing title ────────────────────────────────────────────────

function setupClosing() {
  $$('[data-chars]').forEach((el) => {
    const chars = splitChars(el);
    gsap.set(chars, { yPercent: 110, rotate: 8 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(chars, { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: 0.04 }),
    });
  });
}

// ─── Magnetic buttons ─────────────────────────────────────────────

function setupMagnetic() {
  if (!finePointer) return;
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.25);
      y((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}
