import { Activity } from 'lucide-react';
import type { BMKGEarthquake } from '../types/bmkg';
import { BMKG_CONFIG, BMKG_SOURCE, formatWIB } from '../services/bmkg';
import { DrawerFrame } from './drawer/parts';
export const BMKGDisclaimer = () => <p className="bmkg-note">Informasi gempa bersumber dari BMKG. Untuk peringatan dan informasi keselamatan terkini, selalu merujuk pada kanal resmi BMKG.</p>;
export function BMKGDetail({ event, top, fetchedAt, stale }: { event: BMKGEarthquake; top: React.ReactNode; fetchedAt?: string; stale: boolean }) {
  return <DrawerFrame top={top} footer={<a className="btn btn--secondary btn--block" href={BMKG_SOURCE} target="_blank" rel="noopener noreferrer">Lihat Sumber Resmi ↗</a>}>
    <header className="detail-heading"><p className="detail-heading__type">INFORMASI GEMPA BMKG</p><p className="data-label">BMKG · Official Source</p><h2 className="detail-heading__title" id="drawer-title" tabIndex={-1}>Gempa Bumi</h2><p className="detail-heading__place">Magnitudo {event.magnitude.toFixed(1)}</p></header>
    <dl className="facts">{[
      ['Lokasi', event.region], ['Waktu kejadian', formatWIB(event.eventDateTime)], ['Koordinat (lat, lon)', `${event.latitude}, ${event.longitude}`],
      ['Kedalaman', event.depthKm === undefined ? 'Tidak tersedia' : `${event.depthKm} km`], ['Potensi tsunami', event.tsunamiPotential ?? 'Tidak dicantumkan pada feed BMKG'], ['Dirasakan', event.feltInformation ?? 'Tidak dicantumkan pada feed BMKG'],
      ['Sumber', 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)'], ['Terakhir berhasil diambil', fetchedAt ? formatWIB(fetchedAt) : '—'],
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {stale && <p className="bmkg-note">Data tersimpan; belum berhasil diperbarui.</p>}<BMKGDisclaimer />
  </DrawerFrame>;
}
export function BMKGList({ events, selectedId, onSelect }: { events: BMKGEarthquake[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return <section className="bmkg-list" aria-label="BMKG Earthquakes"><h3>BMKG Earthquakes · {events.length}</h3><p className="bmkg-note">Kejadian dalam {BMKG_CONFIG.days} hari terakhir · Sumber: BMKG</p>
    {!events.length && <p className="bmkg-note">Tidak ada gempa BMKG yang sesuai dengan filter/periode ini.</p>}
    <div className="bmkg-list__rows">{events.map(e => <button type="button" className="bmkg-row" key={e.id} aria-pressed={selectedId === e.id} onClick={() => onSelect(e.id)}><strong><Activity size={14} aria-hidden="true" /> M {e.magnitude.toFixed(1)}</strong><span>{e.region}</span><small>{formatWIB(e.eventDateTime)}</small></button>)}</div>
  </section>;
}
