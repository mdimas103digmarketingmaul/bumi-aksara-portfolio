import type { DisasterEvent, IncidentStatus } from '../types/disaster';
// Entirely fictional scenarios at approximate city coordinates; never merged into live BMKG.
const stages: IncidentStatus[] = ['alert', 'active-response', 'recovery', 'resolved'];
export const showcaseEvents: DisasterEvent[] = stages.map((status, index) => ({
  id: `demo-${status}`, title: ['DEMO · Pemantauan', 'DEMO · Respons Darurat', 'DEMO · Pemulihan', 'DEMO · Respons Selesai'][index],
  disasterType: 'flood', province: 'Jawa Barat', city: ['Bandung', 'Garut', 'Tasikmalaya', 'Cirebon'][index],
  latitude: [-6.91, -7.22, -7.33, -6.73][index], longitude: [107.61, 107.9, 108.22, 108.55][index],
  incidentStatus: status, fundraisingStatus: index === 0 ? 'none' : index === 1 ? 'open' : 'closed',
  eventDate: '2026-10-27', lastUpdated: '2026-11-03', simulated: true, demoOnly: true,
  description: 'Skenario fiktif untuk memperagakan perjalanan respons banjir. Bukan laporan kejadian atau kegiatan Humanies di lokasi ini. Koordinat hanya titik kota untuk demonstrasi.',
  responseSummary: index === 0 ? undefined : 'DEMO: contoh koordinasi relawan, distribusi kebutuhan dasar, dan tindak lanjut pemulihan. Tidak menyatakan kegiatan nyata telah dilakukan.',
  responseItems: index === 0 ? undefined : ['DEMO · Koordinasi relawan', 'DEMO · Penyaluran kebutuhan dasar', 'DEMO · Pendampingan pemulihan'],
  campaignTitle: index === 1 ? 'DEMO · Dukungan respons kemanusiaan' : undefined,
  platform: index === 1 ? 'Mayar / Kitabisa (contoh)' : undefined,
  source: 'DEMO / SIMULATED DATA — bukan kejadian atau kegiatan faktual',
  timeline: [
    { date: '2026-10-27', title: 'Situasi dipantau', description: 'Contoh pencatatan informasi awal.', demo: true },
    ...(index > 0 ? [{ date: '2026-10-28', title: 'Assessment Humanies', description: 'Contoh asesmen kebutuhan oleh relawan.', demo: true }, { date: '2026-10-29', title: 'Respons darurat', description: 'Contoh koordinasi bantuan.', demo: true }] : []),
    ...(index > 1 ? [{ date: '2026-10-31', title: 'Bantuan disalurkan', description: 'Contoh catatan distribusi tanpa angka klaim.', demo: true }, { date: '2026-11-03', title: index === 3 ? 'Respons selesai' : 'Pembaruan pemulihan', description: 'Contoh pembaruan publik dan penutupan campaign.', demo: true }] : []),
  ],
  accountability: index > 1 ? { demo: true, activities: ['Koordinasi dan evaluasi relawan', 'Tindak lanjut kebutuhan warga'], assistance: ['Contoh distribusi kebutuhan dasar; tanpa klaim jumlah'], note: 'Contoh ringkasan laporan publik. Foto dan laporan nyata belum tersedia; tidak ada dokumentasi kegiatan yang direkayasa.' } : undefined,
}));
