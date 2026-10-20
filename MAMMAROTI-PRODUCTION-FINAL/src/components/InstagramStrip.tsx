'use client';

import { useEffect, useRef, useState } from 'react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, instagramTiles } from '@/data/content';
import root from '@/styles/root.module.css';
import s from './InstagramStrip.module.css';

export function InstagramStrip() {
  const track = useRef<HTMLUListElement>(null);
  const [canBack, setCanBack] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const update = () => {
      setCanBack(node.scrollLeft > 2);
      setCanNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 2);
    };
    update();
    node.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => { node.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);

  const move = (direction: number) => {
    const node = track.current;
    if (!node) return;
    const first = node.querySelector('li');
    const step = first ? first.getBoundingClientRect().width + 12 : node.clientWidth;
    const visible = Math.max(1, Math.floor((node.clientWidth + 12) / step));
    node.scrollBy({ left: direction * step * visible, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section id="instagram" className={s.section} aria-labelledby="mr-ig-title">
      <div className={`${root.wrap} ${s.head}`}>
        <h2 id="mr-ig-title" className={s.title}>Lihat yang baru di {INSTAGRAM_HANDLE}</h2>
        <a className={`${root.btn} ${root.btnGhost}`} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Buka Instagram</a>
      </div>
      <ul id="mr-instagram-track" ref={track} className={s.track} aria-label="Galeri Instagram MammaRoti, 9 foto berurutan">
        {instagramTiles.map((t, index) => (
          <li key={t.src}>
            <a className={s.tile} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Foto ${index + 1}: ${t.alt}. Buka Instagram MammaRoti`}>
              <img src={t.src} alt={t.alt} width={480} height={640} loading="lazy" />
            </a>
          </li>
        ))}
      </ul>
      <div className={`${root.wrap} ${s.controls}`}>
        <p>Geser untuk lihat cerita lainnya.</p>
        <div className={s.arrows}>
          <button type="button" onClick={() => move(-1)} disabled={!canBack} aria-label="Foto sebelumnya" aria-controls="mr-instagram-track">←</button>
          <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Foto berikutnya" aria-controls="mr-instagram-track">→</button>
        </div>
      </div>
    </section>
  );
}
