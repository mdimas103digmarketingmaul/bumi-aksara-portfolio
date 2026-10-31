import type { DisasterEvent } from '../types/disaster';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL DISASTER DATA LIVES HERE — edit by hand, no API / CMS needed.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Add an event:    copy one object below, give it a unique `id`, edit fields.
 *  Change status:   edit `incidentStatus` ("alert" | "active-response" | "recovery" | "resolved")
 *                   and/or `fundraisingStatus` ("none" | "open" | "closed").
 *  Donation link:   set `actionUrl`, `actionLabel` and `platform` (e.g. "Kitabisa", "Mayar").
 *                   The button only shows while `fundraisingStatus` is "open".
 *  Resolved cases:  keep them here as history; they are not shown on the map.
 *  Sources:         set `source` + `sourceUrl` so every figure can be traced.
 *
 *  See `src/types/disaster.ts` for every field and which ones are optional.
 *
 *  DATA STATUS — 31 October 2026
 *  • Disaster events, figures and dates are REAL, compiled from BNPB, BPBD, PVMBG/Badan
 *    Geologi and news reports (see `source` / `sourceUrl` on each record). Figures are
 *    early reports and change as data collection continues — re-check before presenting.
 *  • Humanies response for the Sumatra recovery is REAL (campaign "INDONESIA DARURAT
 *    BENCANA" on Mayar, now closed).
 *  • Records with `simulated: true` carry a SIMULATED Humanies response and campaign on top
 *    of a real disaster, so the Active Response state can be demonstrated. Their donate
 *    links are placeholders. No live Humanies active response was found on this date.
 *  • Coordinates are approximate (regency level).
 */
export const disasters: DisasterEvent[] = [
  /* ───────────── Active response (SIMULATED response on a real event) ───────────── */
  {
    id: 'banjir-medan-deli-serdang-2026-10',
    title: 'Banjir Medan & Deli Serdang',
    disasterType: 'flood',
    province: 'Sumatera Utara',
    city: 'Kab. Deli Serdang & Kota Medan',
    latitude: 3.66,
    longitude: 98.63,
    incidentStatus: 'active-response',
    fundraisingStatus: 'open',
    eventDate: '2026-10-27',
    lastUpdated: '2026-10-30',
    timeZone: 'WIB',
    affectedPeople: 18940,
    description:
      'Luapan Sungai Ular, Belumai, Deli, Babura dan Belawan merendam permukiman pada 27–29 Oktober. Menurut BPBD Deli Serdang, 5.367 rumah terendam di 15 desa dan 11 rumah hanyut di Galang; Hamparan Perak terdampak paling parah. Di Medan, empat kecamatan terendam dan 562 warga mengungsi. Pendataan masih berjalan dan angka antarsumber berbeda.',
    responseSummary:
      'Tim Humanies Bersiaga membuka dapur umum dan menyalurkan paket logistik untuk warga di titik pengungsian.',
    responseItems: ['Dapur umum', 'Paket sembako', 'Air bersih', 'Hygiene kit'],
    responseTeam: 'Tim Humanies Bersiaga',
    campaignTitle: 'Bantu Warga Terdampak Banjir Medan & Deli Serdang',
    actionLabel: 'Donate Now',
    actionUrl: 'https://example.com/simulasi/humanies/banjir-medan-deli-serdang',
    platform: 'Mayar',
    simulated: true,
    source: 'BPBD Deli Serdang via VIVA Medan; Sumut Pos',
    sourceUrl:
      'https://medan.viva.co.id/amp/sumut/15622-banjir-di-deli-serdang-merendam-5367-rumah-11-rumah-hanyut-dan-18940-jiwa-terdampak',
  },

  /* ───────────── Disaster alerts (real; no Humanies response) ───────────── */
  {
    id: 'banjir-longsor-cilacap-2026-10-31',
    title: 'Banjir & Tanah Longsor',
    disasterType: 'flood',
    province: 'Jawa Tengah',
    city: 'Kab. Cilacap',
    latitude: -7.63,
    longitude: 109.14,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-31',
    lastUpdated: '2026-10-31T12:19:00+07:00',
    timeZone: 'WIB',
    description:
      'Hujan sedang hingga lebat sejak malam merendam permukiman di Maos dan Kroya (Mujur Lor, Sikampuh) serta Desa Karangreja, dengan genangan hingga 50 cm. Longsor terjadi di Desa Mandala, Jeruklegi. BPBD Cilacap meminta alat berat untuk membersihkan sungai dan material longsor; dapur umum disiapkan di balai desa Karangreja.',
    monitoringStatus: 'monitoring',
    source: 'BPBD Cilacap via ANTARA',
    sourceUrl: 'https://en.antaranews.com/news/439111/cilacap-authorities-respond-to-floods-landslide-after-heavy-rain',
  },
  {
    id: 'erupsi-semeru-2026-10',
    title: 'Erupsi Gunung Semeru',
    disasterType: 'volcanic-eruption',
    province: 'Jawa Timur',
    city: 'Kab. Lumajang',
    latitude: -8.11,
    longitude: 112.92,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-26',
    lastUpdated: '2026-10-30T06:00:00+07:00',
    timeZone: 'WIB',
    description:
      'Status Level III (Siaga). PVMBG mencatat lima kali erupsi pada 26 Oktober. Warga diminta tidak beraktivitas di sektor tenggara sepanjang Besuk Kobokan hingga 13 km dari puncak, 500 m dari sempadan sungai, dan dalam radius 5 km dari kawah.',
    monitoringStatus: 'monitoring',
    source: 'PVMBG via IDX Channel; BNPB via Liputan6',
    sourceUrl:
      'https://www.rctiplus.com/news/detail/idxchannel/5501845/gunung-semeru-lima-kali-erupsi-pada-senin-pagi-26-oktober-2026--status-siaga',
  },
  {
    id: 'erupsi-anak-krakatau-2026-10',
    title: 'Erupsi Gunung Anak Krakatau',
    disasterType: 'volcanic-eruption',
    province: 'Lampung',
    city: 'Kab. Lampung Selatan',
    latitude: -6.1,
    longitude: 105.42,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-30',
    lastUpdated: '2026-10-30T07:48:00+07:00',
    timeZone: 'WIB',
    description:
      'Status Level III (Siaga). Erupsi tercatat pada 30 Oktober pukul 01.40 WIB; tinggi kolom tidak teramati. Dilarang beraktivitas dalam radius 5 km. Warga pesisir Banten dan Lampung diminta tenang dan tidak terpancing isu tsunami.',
    monitoringStatus: 'monitoring',
    source: 'Badan Geologi via detikNews',
    sourceUrl: 'https://news.detik.com/berita/d-8730421/gunung-anak-krakatau-erupsi-dini-hari-warga-diimbau-waspada',
  },
  {
    id: 'gunung-merapi-siaga-2026-10',
    title: 'Gunung Merapi Siaga',
    disasterType: 'volcanic-eruption',
    province: 'DI Yogyakarta & Jawa Tengah',
    city: 'Sleman · Magelang · Boyolali · Klaten',
    latitude: -7.54,
    longitude: 110.45,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-30',
    lastUpdated: '2026-10-30T06:00:00+07:00',
    timeZone: 'WIB',
    description:
      'Status Level III (Siaga) per data PVMBG 30 Oktober. Awan panas guguran dapat terjadi sewaktu-waktu. Radius bahaya 3 km; waspadai lahar hujan di alur Sungai Boyong, Bedog, Krasak, Bebeng, Woro dan Gendol.',
    monitoringStatus: 'monitoring',
    source: 'PVMBG / BNPB via Liputan6',
    sourceUrl: 'https://www.liputan6.com/news/read/8325224/tiga-gunung-api-berstatus-siaga-ini-imbauan-bnpb',
  },
  {
    id: 'angin-kencang-lhokseumawe-2026-10-25',
    title: 'Angin Kencang',
    disasterType: 'extreme-weather',
    province: 'Aceh',
    city: 'Kota Lhokseumawe',
    latitude: 5.18,
    longitude: 97.14,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-25',
    lastUpdated: '2026-10-26T07:00:00+07:00',
    timeZone: 'WIB',
    description:
      'Angin kencang pada 25 Oktober pukul 20.20 WIB merusak 27 rumah kos (rusak berat) dan 1 rumah (rusak ringan) di Gampong Pusong Lama (Banda Sakti) dan Gampong Meunasah Mee (Muara Dua). BPBD mengerahkan kendaraan operasional dan rescue.',
    monitoringStatus: 'monitoring',
    source: 'BNPB via Ketik.com',
    sourceUrl: 'https://ketik.com/jakarta/daerah/bnpb-laporkan-banjir-longsor-hingga-kebakaran-tpa-di-sejumlah-wilayah-indonesia',
  },
  {
    id: 'banjir-tapanuli-tengah-2026-10-23',
    title: 'Banjir',
    disasterType: 'flood',
    province: 'Sumatera Utara',
    city: 'Kab. Tapanuli Tengah',
    latitude: 1.72,
    longitude: 98.8,
    incidentStatus: 'alert',
    fundraisingStatus: 'none',
    eventDate: '2026-10-23',
    lastUpdated: '2026-10-26T07:00:00+07:00',
    timeZone: 'WIB',
    affectedPeople: 424,
    description:
      'Banjir pada 23 Oktober melanda empat kecamatan dan enam kelurahan: 106 rumah terdampak dan 1 rumah hanyut. Air surut pada 25 Oktober, namun hujan masih turun sehingga banjir susulan berpotensi terjadi.',
    monitoringStatus: 'monitoring',
    source: 'BNPB via Ketik.com',
    sourceUrl: 'https://ketik.com/jakarta/daerah/bnpb-laporkan-banjir-longsor-hingga-kebakaran-tpa-di-sejumlah-wilayah-indonesia',
  },

  /* ───────────── Recovery (real Humanies response, campaign closed) ───────────── */
  {
    id: 'pemulihan-sumatera-aceh',
    title: 'Pemulihan Pascabanjir Aceh',
    disasterType: 'flash-flood',
    province: 'Aceh',
    city: 'Pidie Jaya · Bireuen · Lhokseumawe · Aceh Singkil',
    latitude: 5.15,
    longitude: 96.2,
    incidentStatus: 'recovery',
    fundraisingStatus: 'closed',
    eventDate: '2025-11-26',
    lastUpdated: '2026-10-29',
    description:
      'Banjir bandang dan longsor akhir November 2025 (Siklon Senyar) menewaskan sedikitnya 561 orang di Aceh. Per Oktober 2026, Satgas PRR mencatat 20.770 dari 20.803 hunian sementara di Aceh, Sumatera Utara dan Sumatera Barat telah rampung dan jalan nasional pulih; pembangunan hunian tetap masih berjalan.',
    responseSummary:
      'Humanies menggalang donasi publik lewat kampanye “INDONESIA DARURAT BENCANA” untuk korban banjir bandang dan longsor di Aceh, Sumatera Utara dan Sumatera Barat. Hingga 31 Oktober 2026, halaman kampanye di Mayar mencatat donasi terkumpul Rp 3.778.804.624.',
    actionLabel: 'Donasi',
    actionUrl: 'https://humanies-project.myr.id/galang-dana/v2/darurat-bencana-sumatra',
    platform: 'Mayar',
    recoveryPhase: 'Hunian tetap',
    relatedProgram: {
      name: 'Humanies Bersiaga',
      description: 'Inisiatif tanggap bencana Humanies — respons darurat dan pemulihan bersama relawan lokal.',
      url: '#',
    },
    source: 'BNPB (per 24 Jan 2026) via Wikipedia; Satgas PRR via CNBC Indonesia; Humanies Project (Mayar, X)',
    sourceUrl: 'https://www.cnbcindonesia.com/news/20261029180440-4-780711/progres-pemulihan-sumatra-20770-huntara-rampung-jalan-nasional-pulih',
  },
  {
    id: 'pemulihan-sumatera-barat',
    title: 'Pemulihan Pascabanjir Sumatera Barat',
    disasterType: 'flash-flood',
    province: 'Sumatera Barat',
    city: 'Agam · Padang Pariaman · Tanah Datar',
    latitude: -0.25,
    longitude: 100.15,
    incidentStatus: 'recovery',
    fundraisingStatus: 'closed',
    eventDate: '2025-11-26',
    lastUpdated: '2026-10-29',
    description:
      'Banjir bandang dan longsor akhir November 2025 menewaskan 264 orang di Sumatera Barat; Kabupaten Agam terdampak paling parah (163 meninggal, 38 hilang). Hunian sementara hampir seluruhnya rampung; fokus kini pada hunian tetap dan pemulihan layanan dasar.',
    responseSummary:
      'Humanies menggalang donasi publik lewat kampanye “INDONESIA DARURAT BENCANA”, yang mencakup Agam, Padang Pariaman dan Tanah Datar. Hingga 31 Oktober 2026, halaman kampanye di Mayar mencatat donasi terkumpul Rp 3.778.804.624.',
    actionLabel: 'Donasi',
    actionUrl: 'https://humanies-project.myr.id/galang-dana/v2/darurat-bencana-sumatra',
    platform: 'Mayar',
    recoveryPhase: 'Hunian tetap',
    relatedProgram: {
      name: 'Humanies Bersiaga',
      description: 'Inisiatif tanggap bencana Humanies — respons darurat dan pemulihan bersama relawan lokal.',
      url: '#',
    },
    source: 'BNPB (per 24 Jan 2026) via Wikipedia; Satgas PRR via CNBC Indonesia; Humanies Project (Mayar)',
    sourceUrl: 'https://en.wikipedia.org/wiki/2025_Sumatra_floods_and_landslides',
  },

  /* ───────────── Resolved (history — not shown on the map) ───────────── */
  {
    id: 'erupsi-semeru-2025-11',
    title: 'Erupsi Gunung Semeru',
    disasterType: 'volcanic-eruption',
    province: 'Jawa Timur',
    city: 'Kab. Lumajang',
    latitude: -8.11,
    longitude: 112.92,
    incidentStatus: 'resolved',
    fundraisingStatus: 'closed',
    eventDate: '2025-11-19',
    lastUpdated: '2025-11-19',
    description:
      'Awan panas meluncur sekitar 14 km dari puncak dan status dinaikkan ke Level IV (Awas); ribuan warga mengungsi.',
    responseSummary: 'Humanies menggalang donasi “SEMERU KEMBALI ERUPSI!” untuk warga terdampak.',
    actionLabel: 'Donasi',
    actionUrl: 'https://humanies-project.myr.id/galang-dana/v2/semeru-kembali-erupsi',
    platform: 'Mayar',
    source: 'Humanies Project (Mayar)',
    sourceUrl: 'https://humanies-project.myr.id/galang-dana/v2/semeru-kembali-erupsi',
  },
];
