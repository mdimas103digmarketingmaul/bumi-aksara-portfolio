'use client';

import { useEffect, useRef, useState } from 'react';

const links = [{ href: '#outlet', text: 'Lokasi' }, { href: '#menu', text: 'Menu' }, { href: '#kontak', text: 'Kritik & Saran' }];

export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="header">
    <a className="header-logo" href="#beranda" aria-label="MammaRoti — Beranda" onClick={() => setOpen(false)}>
      <img src="/logos/mammaroti.webp" alt="MammaRoti" width="763" height="216" />
    </a>
    <button ref={trigger} className="menu-toggle" type="button" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span /><span /><span />
    </button>
    <nav id="primary-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Navigasi utama">
      {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.text}</a>)}
    </nav>
  </header>;
}
