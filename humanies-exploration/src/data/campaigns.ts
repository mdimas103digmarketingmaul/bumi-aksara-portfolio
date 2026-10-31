/**
 * ─────────────────────────────────────────────────────────────────────────
 *  HUMANIES CAMPAIGNS (Mayar) — edit by hand.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Mirrors https://humanies-project.myr.id/ as of 31 October 2026:
 *  "Penggalangan Dana Terbaru" → status "open", "Penggalangan Selesai" → status "closed".
 *  Titles, categories, links and banners are real. `note` is a short context line
 *  written for this prototype from the campaign banner/title.
 *
 *  Add a campaign:  copy one object, set `url` to its Mayar page.
 *  Banner:          put the image in /public/images/campaigns/ and set `image`.
 *                   Without `image`, a branded Humanies cover is generated.
 */

export type CampaignCategory = 'bencana-alam' | 'kegiatan-sosial' | 'bantuan-pendidikan' | 'kemanusiaan';

export interface Campaign {
  id: string;
  title: string;
  category: CampaignCategory;
  /** "open" shows a donate button; "closed" is shown as Selesai with a link to the page. */
  status: 'open' | 'closed';
  url: string;
  image?: string;
  /** CSS object-position for banners that are not 16:9 (e.g. square posters). */
  imagePosition?: string;
  note?: string;
}

export const CAMPAIGN_CATEGORY_LABEL: Record<CampaignCategory, string> = {
  'bencana-alam': 'Bencana Alam',
  'kegiatan-sosial': 'Kegiatan Sosial',
  'bantuan-pendidikan': 'Bantuan Pendidikan',
  kemanusiaan: 'Kemanusiaan',
};

export const MAYAR_HOME = 'https://humanies-project.myr.id/';

const MAYAR = 'https://humanies-project.myr.id/galang-dana/v2/';

export const campaigns: Campaign[] = [
  /* ───────────── Penggalangan Dana Terbaru (open) ───────────── */
  {
    id: 'more-than-just-school',
    title: 'More Than Just School',
    category: 'bantuan-pendidikan',
    status: 'open',
    url: `${MAYAR}more-than-just-school/`,
    note: 'Membangun ulang MIS Al-Furqon di Manggarai Timur, NTT — sekolah tahan gempa untuk 43 siswa.',
  },
  {
    id: 'dukung-humanies-project',
    title: 'Dukung Humanies Project',
    category: 'kegiatan-sosial',
    status: 'open',
    url: `${MAYAR}dukung-humanies-project/`,
    // Mayar banner is the logo on white; the generated cover reads better in the row.
    note: 'Donasi umum untuk seluruh program dan gerakan Humanies.',
  },

  /* ───────────── Penggalangan Selesai (closed) ───────────── */
  {
    id: 'darurat-bencana-sumatra',
    title: 'Indonesia Darurat Bencana',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}darurat-bencana-sumatra/`,
    image: '/images/campaigns/darurat-bencana-sumatra.jpg',
    note: 'Bantuan kemanusiaan banjir bandang Sumatera — Aceh, Sumut, Sumbar.',
  },
  {
    id: 'semeru-kembali-erupsi',
    title: 'Semeru Kembali Erupsi!',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}semeru-kembali-erupsi/`,
    image: '/images/campaigns/semeru-kembali-erupsi.jpg',
    note: 'Posko Hangat untuk warga terdampak erupsi Semeru, Lumajang.',
  },
  {
    id: 'bantu-warga-ntt',
    title: 'Bantu Warga Nusa Tenggara Timur',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}bantu-warga-nusa-tenggara-timur-55969/`,
    image: '/images/campaigns/bantu-warga-ntt.jpg',
    note: 'Bantuan kemanusiaan untuk warga terdampak gempa bumi NTT.',
  },
  {
    id: 'darurat-kebakaran-kalimantan',
    title: 'Darurat Bencana Kebakaran Kalimantan',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}darurat-bencana-kebakaran-kalimantan/`,
    image: '/images/campaigns/darurat-kebakaran-kalimantan.jpg',
    note: 'Respons darurat kebakaran hutan dan lahan di Kalimantan.',
  },
  {
    id: 'posko-hangat-sukabumi',
    title: 'Humanies Bersiaga: Posko Hangat Sukabumi',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}humanies-bersiaga-posko-hangat-sukabumi/`,
    image: '/images/campaigns/posko-hangat-sukabumi.jpg',
    note: 'Posko Humanies Bersiaga untuk warga terdampak di Sukabumi.',
  },
  {
    id: 'dapur-umum-bekasi-bogor',
    title: 'Bantu Dapur Umum untuk Korban Banjir di Bekasi & Bogor',
    category: 'bencana-alam',
    status: 'closed',
    url: `${MAYAR}bantu-dapur-umum-untuk-korban-banjir-di-bekasi-bogor/`,
    note: 'Dapur umum untuk warga terdampak banjir Bekasi dan Bogor.',
  },
  {
    id: 'sharing-ramadhan-2026',
    title: 'Sharing All You Can Share: Semarak Ramadhan Humanies 2026',
    category: 'kegiatan-sosial',
    status: 'closed',
    url: `${MAYAR}sharing-all-you-can-share-semarak-ramadhan-humanies-2026/`,
    image: '/images/campaigns/sharing-ramadhan-2026.jpg',
    note: 'Rangkaian berbagi Ramadhan di beberapa kota.',
  },
  {
    id: 'sedekah-kurban',
    title: 'Sedekah Kurban: Berbagi Kebaikan, Merayakan Kepedulian',
    category: 'kegiatan-sosial',
    status: 'closed',
    url: `${MAYAR}sedekah-kurban-berbagi-kebaikan-merayakan-kepedulian/`,
    image: '/images/campaigns/sedekah-kurban.jpg',
    note: 'Semarak Kurban Humanies di Tangerang, Bandung dan Semarang.',
  },
  {
    id: 'bem-berani-bersuara',
    title: 'BEM Berani Bersuara',
    category: 'bantuan-pendidikan',
    status: 'closed',
    url: `${MAYAR}bem-berani-bersuara/`,
    image: '/images/campaigns/bem-berani-bersuara.jpg',
    imagePosition: '50% 62%',
    note: 'Pendanaan dari rakyat untuk BEM yang mau bersuara lewat diskusi dan pengabdian.',
  },
  {
    id: 'kita-kelas-pekerja',
    title: '#KitaKelasPekerja Bantuan Medis Untuk Buruh',
    category: 'kemanusiaan',
    status: 'closed',
    url: `${MAYAR}kitakelaspekerja-bantuan-medis-untuk-buruh/`,
    image: '/images/campaigns/kita-kelas-pekerja.jpg',
    note: 'Solidaritas bantuan medis untuk buruh Indonesia.',
  },
];
