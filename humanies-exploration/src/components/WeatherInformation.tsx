import type { WeatherWarning } from '../types/weather';
import { CAP_LABELS, WEATHER_SOURCE } from '../services/weather';
import { formatWIB } from '../services/bmkg';
import { DrawerFrame } from './drawer/parts';
export function WeatherDetail({ event, top, fetchedAt, stale }: { event: WeatherWarning; top: React.ReactNode; fetchedAt?: string; stale: boolean }) {
  return <DrawerFrame top={top} footer={<a className="btn btn--secondary btn--block" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">Lihat Sumber Resmi ↗</a>}>
    <header className="detail-heading"><p className="data-label">BMKG · Official Source</p><p className="detail-heading__type">WEATHER EARLY WARNING</p><h2 className="detail-heading__title" id="drawer-title" tabIndex={-1}>{event.title}</h2><p className="detail-heading__place">{event.region}</p></header>
    <p className="monitor-note">Peringatan potensi cuaca; bukan konfirmasi bencana atau respons Humanies.</p>
    <dl className="facts">{[['Diterbitkan', formatWIB(event.issued)], ['Mulai berlaku', formatWIB(event.effective)], ['Berlaku hingga', formatWIB(event.expires)], ['Urgency', `${CAP_LABELS[event.urgency] ?? event.urgency} (${event.urgency})`], ['Severity', `${CAP_LABELS[event.severity] ?? event.severity} (${event.severity})`], ['Certainty', `${CAP_LABELS[event.certainty] ?? event.certainty} (${event.certainty})`], ['Terakhir berhasil diambil', fetchedAt ? formatWIB(fetchedAt) : '—']].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
    <p className="detail-copy">{event.description}</p>{event.instruction && <p className="detail-copy">{event.instruction}</p>}
    <p className="bmkg-note">{event.polygons.length ? 'Area mengikuti polygon CAP BMKG. Marker berada pada salah satu titik batas area, bukan pusat bencana.' : 'Geometri valid tidak tersedia. Peringatan hanya ditampilkan dalam daftar; tidak ada titik lokasi yang diperkirakan.'}</p>
    {stale && <p className="sim-notice">Data tersimpan, belum berhasil diperbarui. Peringatan yang kedaluwarsa tidak ditampilkan.</p>}
    <p className="bmkg-note">Sumber: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG). Selalu merujuk kanal resmi BMKG untuk informasi keselamatan terkini.</p>
  </DrawerFrame>;
}
export function WeatherList({ events, status, fetchedAt, stale, onSelect }: { events: WeatherWarning[]; status: string; fetchedAt?: string; stale: boolean; onSelect: (id: string) => void }) {
  return <section className="bmkg-list weather-list" aria-label="BMKG Weather Warnings"><h3>Weather Warnings · {events.length}</h3><p className="data-label">BMKG · Official Source</p>
    <div role="status" className="bmkg-note">{status === 'loading' && <p>Memuat peringatan cuaca BMKG...</p>}{status === 'error' && <p>Peringatan cuaca BMKG sementara tidak dapat diperbarui. Silakan merujuk kanal resmi BMKG untuk pembaruan.</p>}{fetchedAt && <p>Terakhir berhasil diambil: {formatWIB(fetchedAt)}{stale ? ' · Data tersimpan, belum diperbarui.' : ''}</p>}{status === 'ready' && !events.length && <p>Tidak ada peringatan cuaca aktif yang sesuai filter.</p>}</div>
    <div className="bmkg-list__rows">{events.map(e => <button className="bmkg-row weather-row" type="button" key={e.id} onClick={() => onSelect(e.id)}><strong>{e.region}</strong><span>{e.title}</span><small>Berlaku hingga {formatWIB(e.expires)}</small>{!e.polygons.length && <small>Lokasi pada daftar saja</small>}</button>)}</div>
    <a className="bmkg-note" href={WEATHER_SOURCE} target="_blank" rel="noopener noreferrer">Lihat peringatan resmi BMKG ↗</a>
  </section>;
}
