'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ASSET, doughs, type DoughKey } from '../data';
import s from './DoughSwitch.module.css';

const keys = Object.keys(doughs) as DoughKey[];

export function DoughSwitch() {
  const [variant, setVariant] = useState<DoughKey>('original');
  const [phase, setPhase] = useState<'idle' | 'out'>('idle');
  const [cue, setCue] = useState(false);
  const timer = useRef<number>(0);
  const cueTimer = useRef<number>(0);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const startX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // 'pending' until the one-time Original → Taro reveal fires or the user picks a dough themselves.
  const auto = useRef<'pending' | 'done'>('pending');

  useEffect(() => () => { window.clearTimeout(timer.current); window.clearTimeout(cueTimer.current); }, []);

  const choose = (next: DoughKey, focus = false, byAuto = false) => {
    if (!byAuto) auto.current = 'done';
    if (focus) tabs.current[next]?.focus();
    if (next === variant) return;
    window.clearTimeout(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVariant(next); return; }
    setPhase('out');
    timer.current = window.setTimeout(() => { setVariant(next); setPhase('idle'); }, 260);
  };
  const chooseRef = useRef(choose);
  chooseRef.current = choose;

  /*
   * Auto-reveal Taro once per page load. The bun stage is "armed" while it is on screen with its centre
   * below the 45% line; when a downward scroll carries the centre above that line (and the stage is still
   * visible), we switch. Passive listener only: no scroll lock, snap or programmatic scrolling.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let armed = false;
    let frame = 0;
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
    };
    const check = () => {
      frame = 0;
      if (auto.current !== 'pending') { stop(); return; }
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top + r.height / 2 > vh * 0.45) { armed = r.top < vh; return; }
      if (!armed) return;
      armed = false;
      if (r.bottom <= 0) return; // flung past in one frame: wait until the user comes back down
      auto.current = 'done';
      stop();
      chooseRef.current('taro', false, true);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Start the tab cue once Taro is actually selected (after the 260ms swap in choose()).
        cueTimer.current = window.setTimeout(() => {
          setCue(true);
          cueTimer.current = window.setTimeout(() => setCue(false), 1400);
        }, 260);
      }
    };
    function onScroll() { if (!frame) frame = window.requestAnimationFrame(check); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();
    return stop;
  }, []);
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
    <section id="adonan" className={s.section} data-variant={variant} data-cue={cue} aria-labelledby="o1-dough-title">
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
          ref={stageRef}
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
