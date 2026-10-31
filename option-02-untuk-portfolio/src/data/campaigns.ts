/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CAMPAIGNS — edit by hand.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  FICTIONAL. Rangkul Project and every campaign below are invented for this
 *  portfolio concept. Illustrations were generated with Magnific (AI vector).
 *  Links are placeholders and are disabled in the UI.
 *
 *  status "open"   → shown first, with a Donasi button.
 *  status "closed" → shown as Selesai.
 *  Without `image`, a branded cover is generated.
 */

export type CampaignCategory = 'bencana-alam' | 'kegiatan-sosial' | 'bantuan-pendidikan' | 'kemanusiaan';

export interface Campaign {
  id: string;
  title: string;
  category: CampaignCategory;
  status: 'open' | 'closed';
  url: string;
  /** Shown as "via …" on the card. */
  platform: string;
  image?: string;
  imagePosition?: string;
  note?: string;
}

export const CAMPAIGN_CATEGORY_LABEL: Record<CampaignCategory, string> = {
  'bencana-alam': 'Bencana Alam',
  'kegiatan-sosial': 'Kegiatan Sosial',
  'bantuan-pendidikan': 'Bantuan Pendidikan',
  kemanusiaan: 'Kemanusiaan',
};

/** Placeholder — links are disabled in this portfolio preview. */
export const CAMPAIGNS_HOME = 'https://example.com/rangkul/galang-dana';

const URL = 'https://example.com/rangkul/galang-dana/';

export const campaigns: Campaign[] = [
  /* ───────────── Masih dibuka ───────────── */
  {
    id: 'dapur-umum-banjir',
    title: 'Dapur Umum Siaga Banjir',
    category: 'bencana-alam',
    status: 'open',
    url: `${URL}dapur-umum-banjir`,
    platform: 'Rangkul',
    image: '/images/campaigns/dapur-umum-banjir.jpg',
    note: 'Makanan hangat dan air bersih untuk keluarga di titik pengungsian banjir.',
  },
  {
    id: 'sekolah-tahan-gempa',
    title: 'Sekolah Tahan Gempa untuk Desa Terpencil',
    category: 'bantuan-pendidikan',
    status: 'open',
    url: `${URL}sekolah-tahan-gempa`,
    platform: 'Kitabisa',
    image: '/images/campaigns/sekolah-tahan-gempa.jpg',
    note: 'Membangun ruang kelas yang aman untuk anak-anak di daerah rawan gempa.',
  },
  {
    id: 'klinik-keliling',
    title: 'Klinik Keliling Kampung Nelayan',
    category: 'kemanusiaan',
    status: 'open',
    url: `${URL}klinik-keliling`,
    platform: 'Mayar',
    image: '/images/campaigns/klinik-keliling.jpg',
    note: 'Cek kesehatan gratis untuk warga pesisir yang jauh dari puskesmas.',
  },
  {
    id: 'dukung-gerakan-rangkul',
    title: 'Dukung Gerakan Rangkul',
    category: 'kegiatan-sosial',
    status: 'open',
    url: `${URL}dukung-rangkul`,
    platform: 'Rangkul',
    note: 'Donasi umum untuk seluruh program dan relawan Rangkul.',
  },

  /* ───────────── Selesai ───────────── */
  {
    id: 'huntara-gempa',
    title: 'Hunian Sementara untuk Penyintas Gempa',
    category: 'bencana-alam',
    status: 'closed',
    url: `${URL}huntara-gempa`,
    platform: 'Kitabisa',
    image: '/images/campaigns/huntara-gempa.jpg',
    note: 'Membangun huntara bersama warga setelah gempa merusak rumah mereka.',
  },
  {
    id: 'posko-erupsi',
    title: 'Posko Hangat Erupsi Gunung',
    category: 'bencana-alam',
    status: 'closed',
    url: `${URL}posko-erupsi`,
    platform: 'Rangkul',
    image: '/images/campaigns/posko-erupsi.jpg',
    note: 'Selimut, makanan hangat dan pendampingan untuk warga di pengungsian.',
  },
  {
    id: 'kabut-asap',
    title: 'Masker & Air Bersih untuk Wilayah Kabut Asap',
    category: 'bencana-alam',
    status: 'closed',
    url: `${URL}kabut-asap`,
    platform: 'Mayar',
    image: '/images/campaigns/kabut-asap.jpg',
    note: 'Masker dan air minum untuk anak dan lansia saat musim kebakaran hutan.',
  },
  {
    id: 'ramadan-pesisir',
    title: 'Berbagi Ramadan Bersama Anak Pesisir',
    category: 'kegiatan-sosial',
    status: 'closed',
    url: `${URL}ramadan-pesisir`,
    platform: 'Rangkul',
    image: '/images/campaigns/ramadan-pesisir.jpg',
    note: 'Buka puasa bersama dan bingkisan Lebaran di kampung nelayan.',
  },
  {
    id: 'beasiswa-relawan-muda',
    title: 'Beasiswa Relawan Muda',
    category: 'bantuan-pendidikan',
    status: 'closed',
    url: `${URL}beasiswa-relawan`,
    platform: 'Kitabisa',
    note: 'Beasiswa kuliah untuk relawan muda yang aktif di komunitasnya.',
  },
  {
    id: 'cek-kesehatan-pekerja',
    title: 'Cek Kesehatan Gratis untuk Pekerja Harian',
    category: 'kemanusiaan',
    status: 'closed',
    url: `${URL}cek-kesehatan-pekerja`,
    platform: 'Mayar',
    image: '/images/campaigns/cek-kesehatan-pekerja.jpg',
    note: 'Pemeriksaan kesehatan dan obat dasar bersama tenaga medis relawan.',
  },
];
