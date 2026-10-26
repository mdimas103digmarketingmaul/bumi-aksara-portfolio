import type Lenis from 'lenis';

/**
 * Shared scroll state. motion.ts registers the Lenis instance; the menu and
 * lightbox lock scrolling through here so both smooth and native scrolling
 * behave the same way.
 */

let lenis: Lenis | null = null;
let locks = 0;

export const setLenis = (instance: Lenis) => {
  lenis = instance;
};

export const getLenis = () => lenis;

export function lockScroll() {
  locks += 1;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.style.overflow = '';
  lenis?.start();
}

/** Smooth in-page navigation that also moves keyboard focus to the target. */
export function scrollToHash(hash: string) {
  const target = hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const focusTarget = () => {
    if (target === document.body) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(target === document.body ? 0 : target, {
      offset: 0,
      duration: 1.4,
      onComplete: focusTarget,
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
    focusTarget();
  }
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href')!;
  if (hash.length < 2) return;
  e.preventDefault();
  scrollToHash(hash);
});
