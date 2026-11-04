import { useState } from 'react';
import { Activity, Flame, Mountain, Waves, Wind, CloudFog, MapPin } from 'lucide-react';
import type { PetaBencanaReport } from '../types/petabencana';
import { PETABENCANA_CONFIG, PETABENCANA_SOURCE, reportTypeLabel } from '../services/petabencana';
import { formatWIB } from '../services/bmkg';
import { DrawerFrame } from './drawer/parts';
export function ReportIcon({ type, size = 15 }: { type: string; size?: number }) {
  const Icon = ({ flood: Waves, fire: Flame, wind: Wind, earthquake: Activity, volcano: Mountain, haze: CloudFog })[type] ?? MapPin;
  return <Icon size={size} aria-hidden="true" />;
}
function Attribution() {
  return <p className="bmkg-note peta-attribution">Data disediakan oleh <a href={PETABENCANA_SOURCE} target="_blank" rel="noopener noreferrer">PetaBencana.id</a>, dilisensikan di bawah <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a> untuk penggunaan nonkomersial. Format dan label kategori disesuaikan; tanpa foto laporan. <a href="https://docs.petabencana.id/perjanjian-lisensi-pengguna" target="_blank" rel="noopener noreferrer">Ketentuan penggunaan komersial ↗</a></p>;
}
export function PetaBencanaList({ events, status, fetchedAt, stale, demo, selectedId, onSelect }: { events: PetaBencanaReport[]; status: string; fetchedAt?: string; stale: boolean; demo: boolean; selectedId: string | null; onSelect: (id: string) => void }) {
  const [limit, setLimit] = useState(20);
  return <section className="bmkg-list peta-list" aria-label="PetaBencana Reports">
    <h3>PetaBencana Reports · {events.length}</h3><p className="data-label">{demo ? 'DEMO / SIMULATION · bukan laporan nyata' : 'PetaBencana · Community / Platform Reports'}</p>
    {demo ? <p className="sim-notice">Contoh buatan untuk presentasi. Data live PetaBencana tidak dicampurkan ke daftar demo.</p> : <>
      <p className="bmkg-note">Laporan {PETABENCANA_CONFIG.days} hari terakhir · laporan latihan dikecualikan. Bukan status bencana aktif.</p>
      <div role="status" className="bmkg-note">
        {status === 'loading' && <p>Memuat laporan PetaBencana...</p>}
        {status === 'error' && <p>Laporan PetaBencana sementara tidak dapat diperbarui.</p>}
        {fetchedAt && <p>Terakhir berhasil diambil: {formatWIB(fetchedAt)}{stale ? ' · Data tersimpan, belum diperbarui.' : ''}</p>}
      </div>
    </>}
    {!events.length && (demo || status !== 'loading') && <p className="bmkg-note">{status === 'error' && !demo ? 'Tidak ada laporan tersimpan yang sesuai filter dan masih dalam periode ini.' : 'Tidak ada laporan PetaBencana yang sesuai filter/periode ini.'}</p>}
    <div className="bmkg-list__rows">{events.slice(0, limit).map(e => <button className="bmkg-row peta-row" type="button" key={e.id} aria-pressed={e.id === selectedId} onClick={() => onSelect(e.id)}>
      <strong><ReportIcon type={e.disasterType} />{e.title}</strong><span>{e.city ?? e.regionCode ?? 'Nama wilayah tidak tersedia'}</span><small>{e.simulated ? 'Waktu contoh: ' : 'Dilaporkan: '}{formatWIB(e.reportedAt)}</small><small>{e.simulated ? 'DEMO / SIMULATION' : `Status sumber: ${e.verificationStatus ?? 'Status verifikasi tidak tersedia'}`}</small>
    </button>)}</div>
    {limit < events.length && <button type="button" className="peta-more" onClick={() => setLimit(v => v + 20)}>Tampilkan 20 laporan berikutnya</button>}
    {!demo && <Attribution />}
  </section>;
}
export function PetaBencanaDetail({ event, top, fetchedAt, stale }: { event: PetaBencanaReport; top: React.ReactNode; fetchedAt?: string; stale: boolean }) {
  return <DrawerFrame top={top} footer={<a className="btn btn--secondary btn--block" href={PETABENCANA_SOURCE} target="_blank" rel="noopener noreferrer">Buka Portal PetaBencana ↗</a>}>
    <header className="detail-heading"><p className="data-label">{event.simulated ? 'DEMO / SIMULATION' : 'PetaBencana · Community / Platform Reports'}</p><p className="detail-heading__type">{event.simulated ? 'CONTOH TAMPILAN LAPORAN' : 'LAPORAN PETABENCANA'}</p><h2 className="detail-heading__title" id="drawer-title" tabIndex={-1}>{event.title}</h2><p className="detail-heading__place">{event.city ?? event.regionCode ?? 'Nama wilayah tidak tersedia'}</p></header>
    {event.simulated && <p className="sim-notice">Contoh simulasi buatan Humanies Disaster Watch; bukan laporan nyata PetaBencana atau respons Humanies.</p>}
    <dl className="facts">{[
      ['Jenis', `${reportTypeLabel(event.disasterType)} (${event.disasterType})`], ['ID laporan', event.reportId], ['Lokasi dari sumber', event.city ?? 'Tidak tersedia'], ['Kode wilayah dari sumber', event.regionCode ?? 'Tidak tersedia'], ['Koordinat (lat, lon)', `${event.latitude}, ${event.longitude}`], [event.simulated ? 'Waktu contoh' : 'Dilaporkan', formatWIB(event.reportedAt)], ['Status dari sumber', event.simulated ? 'Tidak berlaku — simulasi' : event.verificationStatus ?? 'Status verifikasi tidak tersedia'], ...(!event.simulated ? [['Terakhir berhasil diambil', fetchedAt ? formatWIB(fetchedAt) : '—']] : []),
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className="detail-copy">{event.description ?? 'Deskripsi tidak tersedia dari sumber.'}</p>
    {!event.simulated && <><p className="bmkg-note">Informasi berasal dari laporan PetaBencana.id. Status verifikasi mengikuti informasi sumber; bukan verifikasi independen Humanies. Laporan kejadian tidak menyatakan bahwa kondisi masih berlangsung.</p>{stale && <p className="sim-notice">Data tersimpan; belum berhasil diperbarui. Hanya laporan dalam periode 7 hari yang ditampilkan.</p>}<Attribution /></>}
    <p className="bmkg-note">Tautan membuka portal resmi, bukan halaman laporan spesifik.</p>
  </DrawerFrame>;
}
