'use client';

import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { productGroups } from '@/data/products';
import { displayName, flavourColour } from '../data';
import root from '../root.module.css';
import s from './MenuStage.module.css';

type Group = (typeof productGroups)[number];

const photo = {
  bun: { src: '/images/bun.webp', w: 922, h: 689 },
  drink: { src: '/images/iced-drink.webp', w: 277, h: 423 },
} as const;

export function MenuStage() {
  const [groupIndex, setGroupIndex] = useState(0);
  const group: Group = productGroups[groupIndex];
  const [activeId, setActiveId] = useState<string>(group.items[0].id);
  const active = group.items.find((i) => i.id === activeId) ?? group.items[0];
  const colour = flavourColour[active.id] ?? '#f89f48';
  const pic = photo[group.kind];

  const pickGroup = (i: number) => {
    setGroupIndex(i);
    setActiveId(productGroups[i].items[0].id);
  };
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (groupIndex + dir + productGroups.length) % productGroups.length;
    pickGroup(next);
    document.getElementById(`o1-menu-tab-${next}`)?.focus();
  };

  return (
    <section id="menu" className={s.section} aria-labelledby="o1-menu-title">
      <div className={root.wrap}>
        <div className={s.head}>
          <h2 id="o1-menu-title" className={root.h2}>Produk Lainnya</h2>
          <div className={s.tabs} role="tablist" aria-label="Kategori menu" onKeyDown={onTabKey}>
            {productGroups.map((g, i) => (
              <button
                key={g.name}
                id={`o1-menu-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === groupIndex}
                aria-controls="o1-menu-panel"
                tabIndex={i === groupIndex ? 0 : -1}
                className={s.tab}
                onClick={() => pickGroup(i)}
              >
                {g.name}
                <span className={s.count}>{g.items.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          id="o1-menu-panel"
          role="tabpanel"
          aria-labelledby={`o1-menu-tab-${groupIndex}`}
          className={s.body}
          style={{ '--flavour': colour } as CSSProperties}
        >
          <div className={s.stage}>
            <div className={s.disc} aria-hidden="true" />
            <img
              key={active.id}
              className={`${s.photo} ${group.kind === 'drink' ? s.drink : ''}`}
              src={pic.src}
              width={pic.w}
              height={pic.h}
              alt={`${displayName(active.name)} MammaRoti`}
              loading="lazy"
            />
            <p key={`n-${active.id}`} className={s.stageName}>{displayName(active.name)}</p>
            <p className={s.stageGroup}>{group.name}</p>
          </div>

          <ul className={s.list} aria-label={`Daftar ${group.name}`}>
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={s.item}
                  aria-pressed={item.id === active.id}
                  style={{ '--dot': flavourColour[item.id] ?? '#f89f48' } as CSSProperties}
                  onClick={() => setActiveId(item.id)}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                >
                  <span className={s.dot} aria-hidden="true" />
                  {displayName(item.name)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
