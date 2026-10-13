'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ASSET, doughs, type DoughKey } from '../data';
import s from './DoughSwitch.module.css';

const keys = Object.keys(doughs) as DoughKey[];

export function DoughSwitch() {
  const [variant, setVariant] = useState<DoughKey>('original');
  const [phase, setPhase] = useState<'idle' | 'out'>('idle');
  const timer = useRef<number>(0);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const startX = useRef<number | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (next: DoughKey, focus = false) => {
    if (focus) tabs.current[next]?.focus();
    if (next === variant) return;
    window.clearTimeout(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVariant(next); return; }
    setPhase('out');
    timer.current = window.setTimeout(() => { setVariant(next); setPhase('idle'); }, 260);
  };
  const other = (k: DoughKey) => keys[(keys.indexOf(k) + 1) % keys.length];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      choose(other(variant), true);
    }
  };
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current !== null && Math.abs(e.clientX - startX.current) > 40) choose(other(variant));
    startX.current = null;
  };

  const current = doughs[variant];

  return (
    <section id="adonan" className={s.section} data-variant={variant} aria-labelledby="o1-dough-title">
      <div className={s.grid}>
        <div className={s.head}>
          <h2 id="o1-dough-title" className={s.title}>Our Dough</h2>
          <div className={s.names} role="tablist" aria-label="Pilih adonan" onKeyDown={onKey}>
            {keys.map((k) => (
              <button
                key={k}
                ref={(node) => { tabs.current[k] = node; }}
                id={`o1-tab-${k}`}
                type="button"
                role="tab"
                aria-selected={variant === k}
                aria-controls="o1-dough-panel"
                tabIndex={variant === k ? 0 : -1}
                className={s.name}
                onClick={() => choose(k)}
              >
                {doughs[k].label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={s.stage}
          data-phase={phase}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => { startX.current = null; }}
        >
          {keys.map((k) => (
            <figure key={k} className={s.bun} data-dough={k} data-active={k === variant} aria-hidden={k !== variant}>
              <img className={s.halfL} src={`${ASSET}/${k}-half-left.webp`} alt={doughs[k].alt} width={927} height={764} loading="lazy" draggable={false} />
              <img className={s.halfR} src={`${ASSET}/${k}-half-right.webp`} alt="" width={927} height={764} loading="lazy" draggable={false} />
            </figure>
          ))}
          <div className={s.plate} aria-hidden="true" />
        </div>

        <div id="o1-dough-panel" className={s.panel} role="tabpanel" aria-labelledby={`o1-tab-${variant}`}>
          <p className={s.panelLabel}>Isian {current.label}</p>
          <ul key={variant} className={s.fillings}>
            {current.fillings.map((f, i) => (
              <li key={f} style={{ animationDelay: `${120 + i * 70}ms` }}>{f}</li>
            ))}
          </ul>
          <a className={s.next} href={variant === 'original' ? '#adonan' : '#menu'} onClick={(e) => {
            if (variant === 'original') { e.preventDefault(); choose('taro'); }
          }}>
            {variant === 'original' ? 'Coba yang Taro' : 'Keep Scrolling...'}
          </a>
        </div>
      </div>
    </section>
  );
}
