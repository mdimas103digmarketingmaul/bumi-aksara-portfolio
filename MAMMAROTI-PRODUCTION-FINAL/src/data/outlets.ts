export type OutletRegion = { name: string; places: readonly string[]; className?: string };

export const outletColumns: readonly (readonly OutletRegion[])[] = [
  [
    { name: 'Jakarta', places: ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara'] },
    { name: 'Banten', places: ['Serang'], className: 'banten' },
    { name: 'Tangerang', places: ['Tangerang Selatan', 'Tangerang Kota'], className: 'tangerang' },
  ],
  [
    { name: 'Jateng', places: ['Demak', 'Solo'] },
    { name: 'Jabar', places: ['Kab. Bandung', 'Kota Bandung', 'Subang', 'Bogor', 'Bekasi', 'Mall Indramayu'] },
    { name: 'Jatim', places: ['Malang', 'Sidoarjo', 'Surabaya', 'Madura'] },
  ],
  [
    { name: 'Sumatera', places: ['Dumai', 'Jambi', 'Padang Sidempuan'] },
    { name: 'Kalimantan', places: ['IKN', 'Balikpapan', 'Banjarmasin'] },
    { name: 'Sulawesi', places: ['Morowali'], className: 'sulawesi' },
    { name: 'KP. Banka', places: ['Sungailiat', 'Pangkal Pinang'] },
  ],
];

export const exclusiveOutlets: readonly OutletRegion[] = [
  { name: 'Soekarno-Hatta International Airport', places: ['Terminal 3 Domestic', 'Terminal 2 E Arrival', 'Terminal 2 F Shelter Damri', 'Terminal 2 F Arrival'] },
  { name: 'Kereta Api Indonesia', places: ['St. Pasar Senen', 'St. Jatinegara'] },
  { name: 'Syamsudinnoor International Airport', places: ['Terminal Keberangkatan', 'Terminal Kedatangan', 'Ruang Tunggu Keberangkatan'] },
  { name: 'I Gusti Ngurah Rai Airport', places: ['International', 'Domestic'] },
];
