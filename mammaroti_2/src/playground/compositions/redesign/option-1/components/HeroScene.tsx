'use client';

import { useEffect, useRef } from 'react';
import { ASSET } from '../data';
import root from '../root.module.css';
import s from './HeroScene.module.css';

const words = ['Crunchy', 'Melt', 'Joy', 'Sweet'] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * One orchestrated moment for the whole page:
 * the hero bun pulls apart as you scroll, the bag-yellow turns to kopi brown,
 * and the four sensory words from production land around the custard.
 * All animation is driven by CSS custom properties written once per frame.
 */
export function HeroScene() {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const write = () => {
      frame = 0;
      if (reduce.matches) return;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const p = travel > 0 ? clamp(-rect.top / travel) : 0;
      const set = (k: string, v: number) => el.style.setProperty(k, v.toFixed(4));
      set('--intro', ease(seg(p, 0, 0.16)));
      set('--dark', ease(seg(p, 0.05, 0.3)));
      set('--lift', ease(seg(p, 0, 0.32)));
      set('--crack', seg(p, 0.2, 0.25));
      set('--split', ease(seg(p, 0.22, 0.56)));
      words.forEach((_, i) => set(`--w${i + 1}`, ease(seg(p, 0.42 + i * 0.09, 0.52 + i * 0.09))));
      el.dataset.past = p > 0.15 ? 'true' : 'false';
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(write); };

    // Subtle pointer parallax on devices with a precise pointer.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let mx = 0, my = 0, tx = 0, ty = 0, pf = 0;
    const settle = () => {
      mx += (tx - mx) * 0.12;
      my += (ty - my) * 0.12;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      pf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.002 ? requestAnimationFrame(settle) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      if (!fine.matches || reduce.matches) return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pf) pf = requestAnimationFrame(settle);
    };

    write();
    el.dataset.ready = 'true';
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    el.addEventListener('pointermove', onPointer);
    reduce.addEventListener?.('change', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      el.removeEventListener('pointermove', onPointer);
      reduce.removeEventListener?.('change', request);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pf);
    };
  }, []);

  return (
    <section ref={scene} id="beranda" className={s.scene} aria-labelledby="o1-hero-title">
      <div className={s.sticky}>
        <div className={s.dark} aria-hidden="true" />

        <div className={s.copy}>
          <h1 id="o1-hero-title" className={s.title}>
            <span className={s.kicker}>Your everyday</span>
            <span className={s.giant}>Coffebun</span>
          </h1>
        </div>

        <div className={s.stage}>
          <div className={s.shadow} aria-hidden="true" />
          <img
            className={s.whole}
            src="/images/hero-bun.webp"
            alt="Coffee bun MammaRoti dengan lapisan luar keemasan"
            width={654}
            height={603}
            fetchPriority="high"
          />
          <div className={s.halves} aria-hidden="true">
            <img className={s.halfL} src={`${ASSET}/original-half-left.webp`} alt="" width={927} height={764} loading="eager" />
            <img className={s.halfR} src={`${ASSET}/original-half-right.webp`} alt="" width={927} height={764} loading="eager" />
          </div>
        </div>

        <ul className={s.words} aria-label="Crunchy, Melt, Joy, Sweet">
          {words.map((w, i) => (
            <li key={w} className={s[`word${i + 1}` as 'word1']}>{w}</li>
          ))}
        </ul>

        <div className={s.bottom}>
          <p className={s.tagline}>The Mother of All Buns</p>
          <a className={s.cue} href="#adonan" aria-label="Keep Scrolling — lanjut ke Our Dough">
            <span>Keep Scrolling...</span>
            <i aria-hidden="true" />
          </a>
          <div className={s.actions}>
            <a className={`${root.btn}`} href="#outlet">Temukan Kami</a>
            <a className={`${root.btn} ${root.btnGhost}`} href="#menu">Lihat Menu</a>
          </div>
        </div>
      </div>

      {/* Static version of the sensory moment, shown only when motion is reduced. */}
      <div className={s.still}>
        <img src="/images/original-dough.webp" alt="" width={927} height={764} loading="lazy" />
        <ul>{words.map((w) => <li key={w}>{w}</li>)}</ul>
      </div>
    </section>
  );
}
