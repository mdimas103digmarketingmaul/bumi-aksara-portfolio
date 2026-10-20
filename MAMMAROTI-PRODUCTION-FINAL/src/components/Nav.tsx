'use client';

import { useEffect, useRef, useState } from 'react';
import { navLinks } from '@/data/content';
import { Logo } from './Logo';
import s from './Nav.module.css';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [raised, setRaised] = useState(false);
  const [active, setActive] = useState<string>('');
  const toggle = useRef<HTMLButtonElement>(null);

  // Hide while scrolling down, reveal on scroll up. Raised shadow once off the top.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setRaised(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const targets = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = [s.bar, raised && s.raised, hidden && !open && s.hidden, open && s.open].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className={s.inner}>
        <a className={s.brand} href="#beranda" aria-label="MammaRoti — kembali ke atas" onClick={() => setOpen(false)}>
          <Logo label={null} className={s.logo} />
        </a>
        <nav id="mr-nav" className={s.links} aria-label="Navigasi utama">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={s.link}
              aria-current={active === l.id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a className={s.cta} href="#outlet">Temukan Kami</a>
        <button
          ref={toggle}
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="mr-nav"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
