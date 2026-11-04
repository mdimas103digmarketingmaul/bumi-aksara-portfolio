import type { DisasterEvent } from '../types/disaster';
import { safeExternalUrl } from '../lib/actions';
import { formatEventDate } from '../lib/format';
import { SimulationNotice } from './drawer/parts';
const steps = [['alert', 'Monitoring'], ['active-response', 'Active Response'], ['recovery', 'Recovery'], ['resolved', 'Resolved']];
export function ResponseJourney({ event }: { event: DisasterEvent }) {
  return <section className="response-journey" id={`${event.id}-journey`} aria-label="Humanies response journey">
    <p className="data-label">{event.simulated ? 'DEMO / SIMULATED RESPONSE' : 'HUMANIES MANAGED DATA'}</p>
    <SimulationNotice event={event} />
    <h3 className="section-label">Humanies response journey</h3>
    <ol className="journey-steps">{steps.map(([id, title]) => <li key={id} aria-current={event.incidentStatus === id ? 'step' : undefined}>{title}</li>)}</ol>
    <p className="bmkg-note">Tahap saat ini ditandai; tahapan lain tidak menyatakan kegiatan sudah dilakukan.</p>
    <p className="campaign-note">Fundraising: <strong>{event.fundraisingStatus === 'none' ? 'None · tidak ada campaign' : event.fundraisingStatus === 'open' ? 'Open · terbuka' : 'Closed · ditutup'}</strong></p>
    <p className="detail-copy">{event.incidentStatus === 'alert' ? 'Berikutnya: pantau pembaruan sumber resmi. Respons dan campaign hanya dibuka melalui keputusan manual Humanies.' : event.incidentStatus === 'resolved' ? 'Respons selesai. Catatan kegiatan tetap tersedia sebagai arsip publik.' : event.incidentStatus === 'recovery' ? 'Berikutnya: pembaruan pemulihan dan laporan kegiatan saat tersedia.' : 'Berikutnya: pembaruan respons, distribusi bantuan, dan tindak lanjut pemulihan.'}</p>
    {event.simulated && event.fundraisingStatus === 'open' && <p className="sim-notice">DEMO · Donasi Sekarang ↗ — placeholder tidak aktif. Pada campaign nyata, tombol menuju Mayar atau Kitabisa.</p>}
    {event.timeline?.length ? <section><h3 className="section-label">Response Timeline</h3><ol className="response-timeline">{event.timeline.map((item, index) => <li key={`${item.date}-${index}`}><time dateTime={item.date}>{formatEventDate(item.date)}</time><strong>{item.title} {(item.demo || event.demoOnly) && <span className="sim-tag">DEMO</span>}</strong>{item.description && <p>{item.description}</p>}</li>)}</ol></section> : null}
    {event.accountability && <section className="accountability"><h3 className="section-label">Impact & transparency {event.accountability.demo && <span className="sim-tag">DEMO</span>}</h3><h4>Activities completed</h4><ul>{event.accountability.activities.map(x => <li key={x}>{x}</li>)}</ul><h4>Assistance delivered</h4><ul>{event.accountability.assistance.map(x => <li key={x}>{x}</li>)}</ul><h4>Documentation & impact report</h4><p>{event.accountability.note}</p>{!event.reportUrl && <p className="bmkg-note">Laporan belum tersedia. {event.demoOnly ? 'DEMO · placeholder laporan tidak aktif.' : 'Tautan akan ditambahkan manual setelah terbit.'}</p>}</section>}
    {!!event.documentation?.length && <div className="response-gallery">{event.documentation.filter(photo => safeExternalUrl(photo.url)).map(photo => <figure key={photo.url}><img src={photo.url} alt={photo.caption} loading="lazy" /><figcaption>{photo.caption} · {photo.credit}</figcaption></figure>)}</div>}
  </section>;
}
