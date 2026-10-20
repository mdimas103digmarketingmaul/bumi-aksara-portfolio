'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { exclusiveOutlets, outletColumns, type OutletRegion } from '@/data/outlets';
import root from '@/styles/root.module.css';
import s from './OutletFinder.module.css';

const regions: OutletRegion[] = outletColumns.flat();

const norm = (v: string) => v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const i = norm(text).indexOf(q);
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

function filter(list: readonly OutletRegion[], q: string) {
  if (!q) return list;
  return list
    .map((r) => (norm(r.name).includes(q) ? r : { ...r, places: r.places.filter((p) => norm(p).includes(q)) }))
    .filter((r) => r.places.length > 0);
}

function RegionRows({ list, q, kind }: { list: readonly OutletRegion[]; q: string; kind: 'city' | 'exclusive' }) {
  return (
    <ul className={kind === 'exclusive' ? `${s.rows} ${s.exclusive}` : s.rows}>
      {list.map((r) => (
        <li key={r.name} className={s.row}>
          {kind === 'city'
            ? <h3 className={s.region}>{highlight(r.name, q)}</h3>
            : <h4 className={s.region}>{highlight(r.name, q)}</h4>}
          <ul className={s.places}>
            {r.places.map((p) => <li key={p}>{highlight(p, q)}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function OutletFinder() {
  const [query, setQuery] = useState('');
  const q = norm(query);
  const cities = useMemo(() => filter(regions, q), [q]);
  const exclusive = useMemo(() => filter(exclusiveOutlets, q), [q]);
  const total = cities.reduce((n, r) => n + r.places.length, 0) + exclusive.reduce((n, r) => n + r.places.length, 0);

  return (
    <section id="outlet" className={s.section} aria-labelledby="mr-outlet-title">
      <div className={`${root.wrap} ${s.grid}`}>
        <div className={s.intro}>
          <h2 id="mr-outlet-title" className={root.h2}>Outlet Kami</h2>
          <p className={s.big}>
            <span>130+</span> Store
          </p>
          <div className={s.search}>
            <label htmlFor="mr-outlet-search" className={s.searchLabel}>Cari outlet terdekat</label>
            <span className={s.field}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                id="mr-outlet-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik kota, mis. Bandung"
                autoComplete="off"
              />
              {query && (
                <button type="button" className={s.clear} aria-label="Hapus pencarian" onClick={() => setQuery('')}>×</button>
              )}
            </span>
          </div>
          <p className={s.status} role="status">
            {q ? (total ? `${total} area cocok dengan “${query.trim()}”` : '') : ''}
          </p>
        </div>

        <div className={s.lists}>
          {cities.length > 0 && <RegionRows list={cities} q={q} kind="city" />}

          {exclusive.length > 0 && (
            <div className={s.exclusiveBlock}>
              <h3 className={s.exclusiveTitle}>Exclusive Store</h3>
              <RegionRows list={exclusive} q={q} kind="exclusive" />
            </div>
          )}

          {q && total === 0 && (
            <div className={s.empty}>
              <p>Belum ada outlet di “{query.trim()}”.</p>
              <p>Coba nama kota lain, atau tanyakan ke tim kami lewat formulir kritik &amp; saran.</p>
              <button type="button" className={`${root.btn} ${root.btnGhost}`} onClick={() => setQuery('')}>Tampilkan semua outlet</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
