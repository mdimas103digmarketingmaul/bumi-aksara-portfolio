import type { PetaBencanaReport } from '../types/petabencana';
/** Authored fixtures, never fetched or written to the live-source cache. */
export const petaBencanaDemoReports: PetaBencanaReport[] = [
  { id: 'petabencana-demo:flood', reportId: 'DEMO-01', source: 'PetaBencana', sourceType: 'community-report', disasterType: 'flood', title: 'DEMO · Contoh laporan banjir', description: 'SIMULASI untuk memperlihatkan detail laporan komunitas. Bukan kejadian nyata dan bukan laporan yang diterbitkan PetaBencana.', latitude: -6.2, longitude: 106.82, city: 'Jakarta (lokasi contoh)', reportedAt: '2026-11-01T08:00:00Z', simulated: true },
  { id: 'petabencana-demo:wind', reportId: 'DEMO-02', source: 'PetaBencana', sourceType: 'community-report', disasterType: 'wind', title: 'DEMO · Contoh laporan angin', description: 'SIMULASI tampilan kategori angin. Tidak menunjukkan dampak, korban, atau respons Humanies yang nyata.', latitude: -7.25, longitude: 112.75, city: 'Surabaya (lokasi contoh)', reportedAt: '2026-11-01T09:00:00Z', simulated: true },
];
