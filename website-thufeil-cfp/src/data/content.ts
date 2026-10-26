/**
 * Page content. Every fact here is sourced from Thufeil's IFAC profile
 * (ifac.or.id/thufeil), his CFP® certificate, or the supplied Instagram assets.
 * Do not add numbers or claims that cannot be checked against a source.
 */
import type { ImageMetadata } from 'astro';

export const certificate = {
  mark: 'CFP®',
  name: 'Certified Financial Planner',
  issuer: 'FPSB Indonesia',
  number: '2500 0725',
  validUntil: '31 Desember 2027',
};

export const credentials: { code: string; name: string }[] = [
  { code: 'AWPs®', name: 'Associate Wealth Planner Syariah' },
  { code: 'CSFT', name: 'Certified Sakinah Finance Trainer' },
  { code: 'AASI', name: 'Lisensi Asosiasi Asuransi Syariah Indonesia' },
  { code: 'ToT', name: 'Training of Trainers Pasar Modal Syariah Indonesia' },
  { code: 'SMI', name: 'Sekolah Muamalah Indonesia' },
  { code: 'S.E.', name: 'Lulusan terbaik Ekonomi Syariah' },
];

export interface Expertise {
  title: string;
  question: string;
  body: string;
}

export const expertise: Expertise[] = [
  {
    title: 'Financial Check-Up',
    question: 'Sebenarnya keuanganku sehat nggak, sih?',
    body: 'Memetakan arus kas, aset, utang, dan dana darurat untuk menentukan apa yang perlu dibereskan lebih dulu.',
  },
  {
    title: 'Investasi & Produk Syariah',
    question: 'Mulai investasi syariah dari mana?',
    body: 'Menghitung kebutuhan dana pendidikan anak, hari tua, atau ibadah, lalu memilih instrumen yang sesuai profil risiko — bukan yang sedang ramai.',
  },
  {
    title: 'Utang & Pemulihan',
    question: 'Cicilan banyak, yang mana dulu?',
    body: 'Memetakan semua kewajiban, termasuk utang konsumtif dan pinjol, lalu menyusun rencana pelunasan yang realistis.',
  },
  {
    title: 'Asuransi Syariah',
    question: 'Perlu proteksi apa, dan seberapa besar?',
    body: 'Menghitung kebutuhan asuransi kesehatan, sakit kritis, dan jiwa sesuai anggaran, lalu mengevaluasinya berkala.',
  },
  {
    title: 'Fiqh Muamalah',
    question: 'Akad ini sudah sesuai syariah?',
    body: 'Diskusi soal akad dan transaksi sehari-hari: jual beli, utang piutang, kerja sama usaha, sampai produk keuangan modern.',
  },
  {
    title: 'Zakat & Waris',
    question: 'Zakat hartaku berapa?',
    body: 'Menghitung zakat harta, merencanakan pembagian waris sesuai hukum yang berlaku, dan menyiapkan likuiditas keluarga.',
  },
];

// ─── Instagram posts (order 1–9 follows the supplied files) ───────

const igImages = import.meta.glob<{ default: ImageMetadata }>('../assets/instagram/*.jpg', { eager: true });
const ig = (n: number) => igImages[`../assets/instagram/post-${String(n).padStart(2, '0')}.jpg`].default;

export interface InstagramPost {
  image: ImageMetadata;
  kind: string;
  title: string;
  alt: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    image: ig(1),
    kind: 'Carousel',
    title: 'Saham rungkad, harga naik, PHK di mana-mana',
    alt: 'Slide kuning bertuliskan saham, emas, harga, dan PHK, dengan kalimat: yang kita punya turun, yang harus kita beli naik.',
  },
  {
    image: ig(2),
    kind: 'Talk',
    title: 'Sakinah Finance Talks: Boost Your Career in Sharia Finance',
    alt: 'Poster Sakinah Finance Talks dengan foto Thufeil sebagai pembicara topik Boost Your Career in Sharia Finance.',
  },
  {
    image: ig(3),
    kind: 'Kolaborasi',
    title: 'Ngatur keuangan itu kebutuhan sehari-hari',
    alt: 'Ilustrasi uang dan koin bertuliskan budget for success, dengan judul: ngatur keuangan itu bukan pilihan, tapi kebutuhan sehari-hari.',
  },
  {
    image: ig(4),
    kind: 'Carousel',
    title: 'Anak lahir bersama rezekinya?',
    alt: 'Slide bertanya apakah anak lahir bersama rezekinya, disertai tangkapan layar unggahan thufeil.cfp.',
  },
  {
    image: ig(5),
    kind: 'IG Live',
    title: 'Stay Tenang, Stay on Track bersama Bank Hijra',
    alt: 'Poster IG Live Bank Hijra bersama Thufeil bertema mengatur keuangan di tengah ekonomi yang tidak pasti.',
  },
  {
    image: ig(6),
    kind: 'Kolaborasi',
    title: 'Pemasukan kurang? Cari side hustle',
    alt: 'Ilustrasi dua panel: seseorang cemas karena pemasukan kurang, lalu bersemangat mengerjakan usaha sampingan.',
  },
  {
    image: ig(7),
    kind: 'Webinar',
    title: 'Membangun kekayaan dari investasi syariah',
    alt: 'Poster webinar Savvy Society berjudul Membangun Kekayaan dari Investasi Syariah dengan Thufeil sebagai pembicara.',
  },
  {
    image: ig(8),
    kind: 'Kolaborasi',
    title: 'Capek sekarang, atau lebih capek nanti',
    alt: 'Foto perbandingan: kerja sampingan sampai malam di usia muda, dan tetap bekerja keras di usia lanjut.',
  },
  {
    image: ig(9),
    kind: 'Kolaborasi',
    title: 'Wajib halal: tidak siap atau tidak serius?',
    alt: 'Slide Rabu Hijrah dan Sharia Future Network berjudul Wajib Halal: tidak siap atau tidak serius?',
  },
];

// ─── Testimonials (original Instagram Story screenshots) ──────────
// Alt text describes what is visible; it is not a quote.

const tImages = import.meta.glob<{ default: ImageMetadata }>('../assets/testimonials/*.webp', { eager: true });
const ts = (n: number) => tImages[`../assets/testimonials/testimoni-${String(n).padStart(2, '0')}.webp`].default;

export interface Testimonial {
  image: ImageMetadata;
  alt: string;
}

export const testimonials: Testimonial[] = [
  'Story dari sesi diskusi keuangan via video call. Peserta menulis bahwa Thufeil tidak menghakimi dan memberi saran pengembangan yang konkret.',
  'Story berisi foto laptop saat financial check-up online yang membahas cash flow, dana darurat, dan investasi.',
  'Story dengan slide Rule of Thumb Budgeting. Peserta menyebut sesinya nyaman untuk berdiskusi dan membantu Gen-Z merencanakan keuangan.',
  'Story berisi foto laptop saat sesi online. Peserta merasa terbantu mengecek dan mengelola kondisi keuangannya.',
  'Story dengan tangkapan layar template Financial Check-Up. Peserta menyebut penjelasannya detail, mudah dipahami, dan disertai contoh konkret.',
  'Story berisi percakapan WhatsApp. Klien menulis bahwa sarannya memberi insight yang tidak didapat di kelas dan bisa menjadi second opinion.',
  'Story di atas cuplikan template perencanaan keuangan. Peserta menceritakan sesi tentang budgeting dan menilai kesehatan keuangan.',
  'Story berisi tangkapan layar sesi check-up keuangan pribadi lewat video call di akhir pekan.',
  'Story dengan slide Piramida Financial Planning. Peserta bercerita jadi lebih melek soal keuangannya setelah ngobrol santai.',
  'Story berisi slide Piramida Financial Planning dan pesan terima kasih atas materi yang mudah dipahami.',
  'Story dari sesi Financial Discussion 101 dengan slide Fundamental Financial Planning.',
  'Story berisi foto laptop saat sesi online dengan slide Rule of Thumb Budgeting.',
].map((alt, i) => ({ image: ts(i + 1), alt: `Testimoni ${i + 1}: ${alt}` }));
