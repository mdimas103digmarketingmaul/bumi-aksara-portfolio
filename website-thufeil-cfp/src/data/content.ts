/**
 * Page content for the main page (/). The persona, numbers, certificate
 * details and testimonials are placeholders for the design proposal.
 * Replace them with verified facts before the site goes live.
 */
import type { ImageMetadata } from 'astro';
import postTalk from '../assets/insight/post-talk.jpg';
import postDesk from '../assets/insight/post-desk.jpg';
import postFamily from '../assets/insight/post-family.jpg';
import postHustle from '../assets/insight/post-hustle.jpg';

export const certificate = {
  mark: 'CFP®',
  name: 'Certified Financial Planner',
  issuer: 'FPSB Indonesia',
  number: '2500 1384',
  validUntil: '31 Desember 2028',
};

export const about = {
  stats: [
    { value: 15, suffix: '+', label: 'Tahun berkecimpung di dunia keuangan dan perbankan syariah' },
    { value: 10000, suffix: '+', label: 'Klien dan peserta kelas yang sudah didampingi' },
  ],
  /** A goal, not a track record: shown as a sentence, never as a big number. */
  mission: 'Membawa 10 juta anak muda Indonesia melek keuangan syariah pada 2040.',
  principle: 'Rezeki yang berkah bukan soal seberapa banyak, tapi seberapa tenang kita menjalaninya.',
};

export const credentials: { code: string; name: string }[] = [
  { code: 'AWPs®', name: 'Associate Wealth Planner Syariah' },
  { code: 'CSFT', name: 'Certified Sakinah Finance Trainer' },
  { code: 'AASI', name: 'Lisensi Asosiasi Asuransi Syariah Indonesia' },
  { code: 'ToT', name: 'Training of Trainers Pasar Modal Syariah Indonesia' },
  { code: 'SMI', name: 'Sekolah Muamalah Indonesia' },
  { code: 'S.E.', name: 'Sarjana Ekonomi Syariah' },
];

export interface Expertise {
  title: string;
  question: string;
  body: string;
}

export const expertise: Expertise[] = [
  {
    title: 'Financial Check-Up',
    question: 'Gajian tanggal 25, tanggal 5 sudah tipis?',
    body: 'Membedah arus kas, aset, utang, dan dana darurat supaya jelas mana yang paling mendesak untuk dibenahi.',
  },
  {
    title: 'Investasi & Produk Syariah',
    question: 'Reksa dana, sukuk, atau emas dulu?',
    body: 'Menghitung target dana pendidikan, pensiun, atau ibadah, lalu memilih instrumen sesuai profil risiko, bukan sesuai tren.',
  },
  {
    title: 'Utang & Pemulihan',
    question: 'Paylater numpuk, mulai lunasin dari mana?',
    body: 'Mendata semua kewajiban, termasuk kartu kredit dan pinjol, lalu menyusun urutan pelunasan yang masuk akal.',
  },
  {
    title: 'Asuransi Syariah',
    question: 'Sudah punya BPJS, masih perlu asuransi?',
    body: 'Menakar kebutuhan proteksi kesehatan, penyakit kritis, dan jiwa sesuai anggaran, lalu meninjaunya secara berkala.',
  },
  {
    title: 'Fiqh Muamalah',
    question: 'Transaksi ini halal nggak, ya?',
    body: 'Membahas akad sehari-hari: jual beli, utang piutang, kongsi usaha, hingga produk keuangan digital.',
  },
  {
    title: 'Zakat & Waris',
    question: 'Gimana cara hitung zakat penghasilan?',
    body: 'Menghitung zakat harta dan penghasilan, merencanakan waris sesuai ketentuan, dan menjaga likuiditas keluarga.',
  },
];

// ─── Insight posts (placeholders: generated photos + coded slides) ──

export type SlideTone = 'sun' | 'night' | 'cream' | 'navy';

export interface InsightPost {
  kind: string;
  title: string;
  /** Large text printed on the post itself. */
  headline: string;
  /** Photo posts use a generated image; slide posts are drawn in CSS. */
  image?: ImageMetadata;
  imageAlt?: string;
  tone?: SlideTone;
  slides?: number;
}

export const insightPosts: InsightPost[] = [
  {
    kind: 'Carousel',
    title: 'Gaji naik, tabungan kok tetap segitu?',
    headline: 'Gaji naik, tabungan kok tetap segitu?',
    tone: 'sun',
    slides: 7,
  },
  {
    kind: 'Talk',
    title: 'Sharia Money Talks: karier di keuangan syariah',
    headline: 'Karier di keuangan syariah',
    image: postTalk,
    imageAlt: 'Pembicara muda memegang mikrofon di panggung seminar kecil, penonton terlihat dari belakang.',
  },
  {
    kind: 'Carousel',
    title: 'Dana darurat dulu, investasi kemudian',
    headline: 'Dana darurat dulu. Investasi kemudian.',
    tone: 'night',
    slides: 5,
  },
  {
    kind: 'Tutorial',
    title: 'Template budgeting 50/30/20 versi syariah',
    headline: 'Budgeting 50/30/20 versi syariah',
    image: postDesk,
    imageAlt: 'Meja kerja dari atas: laptop dengan grafik anggaran, buku catatan, kalkulator, kopi, dan beberapa koin.',
  },
  {
    kind: 'Carousel',
    title: 'Paylater itu utang, bukan diskon',
    headline: 'Paylater itu utang. Bukan diskon.',
    tone: 'cream',
    slides: 6,
  },
  {
    kind: 'Webinar',
    title: 'Siapkan dana pendidikan anak sejak dini',
    headline: 'Dana pendidikan anak, mulai kapan?',
    image: postFamily,
    imageAlt: 'Pasangan muda berdiskusi di sofa sambil melihat tablet, anak kecil bermain balok di dekat mereka.',
  },
  {
    kind: 'Edukasi',
    title: 'Zakat penghasilan: cara hitungnya',
    headline: 'Zakat penghasilan: hitungnya gimana?',
    tone: 'navy',
    slides: 4,
  },
  {
    kind: 'Kolaborasi',
    title: 'Side hustle boleh, asal nggak burnout',
    headline: 'Side hustle boleh, burnout jangan.',
    image: postHustle,
    imageAlt: 'Perempuan muda mengemas kotak produk di meja kerja pada malam hari, diterangi lampu meja dan laptop.',
  },
];

// ─── Testimonials (illustrative text, drawn as Story cards) ───────

export interface Testimonial {
  name: string;
  detail: string;
  topic: string;
  quote: string;
  tone: SlideTone;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Nadia',
    detail: 'Karyawan swasta, 24',
    topic: 'Financial Check-Up',
    quote: 'Akhirnya tahu uangku bocor ke mana. Dijelasin pelan-pelan, sama sekali nggak di-judge.',
    tone: 'sun',
  },
  {
    name: 'Rizal',
    detail: 'Software engineer, 27',
    topic: 'Investasi Syariah',
    quote: 'Dulu ikut-ikutan beli saham karena FOMO. Sekarang punya rencana yang jelas dan sesuai syariah.',
    tone: 'night',
  },
  {
    name: 'Salsa & Dimas',
    detail: 'Pengantin baru',
    topic: 'Keuangan Keluarga',
    quote: 'Ngobrolin uang sama pasangan jadi nggak canggung lagi. Pulang sesi langsung bikin anggaran bareng.',
    tone: 'cream',
  },
  {
    name: 'Fajar',
    detail: 'Pemilik kedai kopi, 30',
    topic: 'Utang & Pemulihan',
    quote: 'Cicilan paylater sempat bikin pusing. Urutan pelunasannya realistis, enam bulan kemudian lunas.',
    tone: 'navy',
  },
  {
    name: 'Ayu',
    detail: 'Guru SD, 29',
    topic: 'Asuransi Syariah',
    quote: 'Baru paham bedanya BPJS dan asuransi tambahan. Nggak ada paksaan beli produk apa pun.',
    tone: 'sun',
  },
  {
    name: 'Bagas',
    detail: 'Fresh graduate, 22',
    topic: 'Gaji Pertama',
    quote: 'Gaji pertama langsung dibagi pos-posnya. Dana darurat jalan, sedekah juga jalan.',
    tone: 'night',
  },
  {
    name: 'Mira',
    detail: 'Desainer lepas, 26',
    topic: 'Penghasilan Tidak Tetap',
    quote: 'Penghasilan freelance naik turun, tapi sekarang punya sistem. Contoh kasusnya relate banget.',
    tone: 'cream',
  },
  {
    name: 'Hendra',
    detail: 'ASN, 33',
    topic: 'Zakat & Waris',
    quote: 'Hitungan zakat dan rencana waris keluarga jadi jelas. Orang tua juga ikut tenang.',
    tone: 'navy',
  },
];
