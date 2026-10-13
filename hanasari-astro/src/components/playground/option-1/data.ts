/*
 * Hanasari — Visual Option 1 (playground)
 * Satu sumber data untuk halaman /playground/option-1/.
 * Konten disalin dari homepage production (home-content.js & komponen home)
 * dan katalog Agustus 2026. Edit di sini tanpa menyentuh production.
 */

export const WA_NUMBER = '628563050300';
export const PHONE_ALT = '+628561095500';
export const MAPS_URL = 'https://maps.app.goo.gl/J5xKt56AYwhPnQ7c7';
export const CATALOG_URL = '/assets/docs/katalog-hanasari-agustus-2026.pdf';
export const LINKS_URL = 'https://berbagi.link/HanasariCatering';
export const INSTAGRAM_URL = 'https://www.instagram.com/hanasaricatering/';
export const TIKTOK_URL = 'https://www.tiktok.com/@hanasaricatering';

/** Link WhatsApp dengan pesan pembuka yang sama seperti production. */
export const waLink = (message: string, source: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo Hanasari Catering, saya datang dari website Hanasari.\n\n${message}\n\nSumber: Website Hanasari — ${source}`
  )}`;

export const rupiah = (value: number) => 'Rp' + new Intl.NumberFormat('id-ID').format(value);

export type Category = 'nasi' | 'snack' | 'spesial';

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: number | null;
  image?: string;
  tag: string;
  items: string[];
  pack?: string;
  note?: string;
  featured?: boolean;
}

export const categories: { id: Category; label: string; short: string; intro: string }[] = [
  { id: 'nasi', label: 'Nasi Box', short: 'Nasi Box', intro: 'Lima tingkatan paket, dari makan siang praktis sampai box paling lengkap dengan dua lauk utama.' },
  { id: 'snack', label: 'Snack Box', short: 'Snack', intro: 'Teman jeda rapat dan acara. Pilih jumlah snack sesuai kebutuhan Anda.' },
  { id: 'spesial', label: 'Tumpeng & Lainnya', short: 'Spesial', intro: 'Untuk syukuran, perayaan, dan bingkisan. Komposisi dan harga didiskusikan bersama admin.' }
];

export const products: Product[] = [
  { id: 'nasi-hemat', category: 'nasi', name: 'Paket Hemat', price: 23000, image: 'nasi-hemat.webp', tag: 'Praktis & hemat', items: ['Nasi', 'Lauk utama', 'Lalapan', 'Sambal'], pack: 'Box coklat / motif basic' },
  { id: 'nasi-reguler', category: 'nasi', name: 'Paket Reguler', price: 26000, image: 'nasi-reguler.webp', tag: 'Teman makan siang', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Sambal', 'Kerupuk', 'Air mineral Zoom'], pack: 'Box coklat / motif basic' },
  { id: 'nasi-mantap', category: 'nasi', name: 'Paket Mantap', price: 35000, image: 'nasi-mantap.webp', tag: 'Box spesial Hanasari', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah / air mineral Le Minerale'], pack: 'Box spesial Hanasari' },
  { id: 'nasi-juragan', category: 'nasi', name: 'Paket Juragan', price: 40000, image: 'nasi-juragan.webp', tag: 'Box spesial Hanasari', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah', 'Air mineral Le Minerale'], pack: 'Box spesial Hanasari' },
  { id: 'nasi-ningrat', category: 'nasi', name: 'Paket Ningrat', price: 45000, image: 'nasi-ningrat.webp', tag: 'Dengan 2 lauk utama', items: ['Nasi', '2 lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah', 'Air mineral Le Minerale'], pack: 'Box spesial Hanasari', featured: true },
  { id: 'snack-reguler', category: 'snack', name: 'Snack Reguler', price: 14000, image: 'snack-reguler.webp', tag: 'Teman jeda acara', items: ['2 pilihan snack', 'Minuman'], pack: 'Box putih / coklat' },
  { id: 'snack-mantap', category: 'snack', name: 'Snack Mantap', price: 18000, image: 'snack-mantap.webp', tag: 'Pilihan lebih beragam', items: ['3 pilihan snack', 'Minuman'], pack: 'Box Hanasari' },
  { id: 'snack-juragan', category: 'snack', name: 'Snack Juragan', price: 23000, image: 'snack-juragan.webp', tag: 'Lengkapi kebersamaan', items: ['4 pilihan snack', 'Air mineral'], pack: 'Box Hanasari', featured: true },
  { id: 'tumpeng', category: 'spesial', name: 'Tumpeng Nasi Kuning', price: null, image: 'tumpeng.webp', tag: 'Untuk hari istimewa', items: [], note: 'Sajian untuk syukuran dan perayaan bersama. Diskusikan pilihan lauk, ukuran, serta jumlah porsi dengan admin.', featured: true },
  { id: 'tumpeng-pecel', category: 'spesial', name: 'Tumpeng Pecel', price: null, tag: 'Sajian untuk berbagi', items: [], note: 'Pilihan tumpeng dengan cita rasa pecel. Hubungi admin untuk komposisi, ukuran, dan ketersediaan.' },
  { id: 'hampers-buah', category: 'spesial', name: 'Hampers Buah', price: null, tag: 'Bingkisan penuh perhatian', items: [], note: 'Pilihan bingkisan buah untuk orang terdekat. Jenis buah dan kemasan dikonfirmasi saat pemesanan.' },
  { id: 'hampers-kue', category: 'spesial', name: 'Hampers Kue Kering', price: null, tag: 'Manisnya berbagi', items: [], note: 'Lengkapi momen spesial dengan bingkisan kue kering. Tanyakan pilihan isi dan kemasan kepada admin.' },
  { id: 'sambal', category: 'spesial', name: 'Sambal Botol', price: null, tag: 'Pelengkap selera', items: [], note: 'Cita rasa sambal untuk melengkapi hidangan. Tanyakan varian, ukuran, dan harga yang tersedia.' }
];

/** Pilihan isi box — disalin dari halaman "Nasi Box & Snack Box Hanasari" pada katalog Agustus 2026. */
export const dishGroups: { id: string; label: string; items: string[] }[] = [
  { id: 'ayam', label: 'Lauk Ayam', items: ['Ayam Goreng', 'Ayam Bakar', 'Ayam Rica-Rica', 'Ayam Penyet', 'Ayam Kremes', 'Ayam Tepung Crispy', 'Ayam Teriyaki', 'Ayam Asam Manis', 'Ayam Kecap', 'Ayam Semur', 'Ayam Serundeng', 'Ayam Geprek', 'Ayam Taliwang', 'Ayam Gulai', 'Ayam Cabe Ijo', 'Ayam Woku', 'Soto Ayam'] },
  { id: 'daging', label: 'Lauk Daging', items: ['Daging Rendang', 'Daging Semur', 'Daging Pedas Balado', 'Daging Empal', 'Daging Teriyaki', 'Daging Asam Manis', 'Daging Gulai Cincang', 'Daging Lada Hitam', 'Daging Cabe Ijo'] },
  { id: 'ikan', label: 'Lauk Ikan', items: ['Ikan Goreng', 'Ikan Bakar', 'Ikan Pesmol', 'Ikan Saus Padang', 'Ikan Pedas Balado', 'Ikan Pindang', 'Ikan Pepes', 'Ikan Asam Manis', 'Ikan Bumbu Kuning', 'Ikan Bumbu Sarden'] },
  { id: 'tumisan', label: 'Tumisan', items: ['Cah Tauge dan Tahu', 'Tumis Urap', 'Tumis Tempe Kacang Panjang', 'Tempe Orek', 'Mie Bakso', 'Cah Pakcoy', 'Tumis Sawi Tauge', 'Tumis Buncis Bakso', 'Tumis Bunga Pepaya Teri Medan', 'Tumis Terong Balado', 'Tumis Telur Tomat', 'Tumis Bakso Jamur Putren', 'Tumis Pare', 'Cah Kangkung Terasi', 'Cah Kangkung Saus Tiram'] },
  { id: 'gorengan', label: 'Gorengan', items: ['Tempe Goreng', 'Tempe Mendoan', 'Tahu Goreng', 'Bakwan Jagung', 'Kulit Ayam', 'Perkedel'] },
  { id: 'sambal', label: 'Sambal', items: ['Sambal Matah', 'Sambal Goreng', 'Sambal Bawang', 'Sambal Terasi', 'Sambal Cabe Ijo', 'Sambal Tomat', 'Sambal Dabu-Dabu', 'Sambal Kacang', 'Sambal Mangga Muda'] },
  { id: 'snack', label: 'Snack', items: ['Pastel Sayur', 'Pastel Sayur Telur', 'Pastel Sayur Daging', 'Puding Mangga', 'Puding Coklat', 'Lemper Ayam', 'Pisang Molen', 'Risoles Mayo Beef', 'Sosis Solo', 'Donat Gula', 'Donat Mesis', 'Kue Soes', 'Lontong Isi Sayur', 'Lontong Isi Sayur Ayam', 'Lontong Isi Sayur Daging', 'Lontong Isi Oncom', 'Pai Buah', 'Martabak Telur Mini', 'Panada', 'Dadar Gulung', 'Lumpur Surga', 'Roti Coklat', 'Roti Kacang Merah', 'Roti Kacang Hijau', 'Roti Srikaya', 'Roti Keju', 'Roti Pisang Coklat', 'Roti Sosis'] }
];

/** Daftar "Customer Kami" dari halaman terakhir katalog Agustus 2026. */
export const clients = [
  'Kecamatan Matraman',
  'Sudin Perindustrian, Perdagangan, Koperasi & UKM Jaktim',
  'Kelurahan Utan Kayu Selatan',
  'Puskesmas Utan Kayu Selatan 2',
  'Universitas Negeri Jakarta',
  'Institut Bisnis & Multimedia ASMI',
  'SMKN 40',
  'BNPB',
  'SLOG Polri',
  'Mahkamah Agung',
  'Kemenkeu',
  'BPOM',
  'Inotek',
  'PT IMS Jakarta',
  'Salsa Tour and Travel',
  'PT Reasuransi Syariah Indonesia',
  'Fitness Time'
];

export const reviews = [
  { name: 'Ghina Khalisa', initials: 'GK', quote: 'enak banget bangettt, bumbunya pas, porsinya lebih dari cukup, kakak adminnya ramah dan informatif!!', image: 'review-2.webp' },
  { name: 'Salsabila Aliyah', initials: 'SA', quote: 'Emang ayam bakarnya paling enak sih bagiku... karena bumbunya meresap, dagingnya empuk ngga alot, pendampingnya ngga cuma krupuk tapi ada bakwan dan jeruk, plus sambalnya cocok. Mantapp', image: 'review-1.webp' },
  { name: 'sarah nurhanifah', initials: 'SN', quote: 'semua rasa masakan berani bumbu, harganya buat isian lengkap kaya gini murah tapi rasa ga murahan..', image: 'review-6.webp' },
  { name: 'Djoko Priyanto', initials: 'DP', quote: 'alhamdulillah enakkk bangett. Lezat hingga gigitan terakhir.', image: 'review-3.webp' },
  { name: 'Tangguh Onomatua.H.', initials: 'TO', quote: 'Asliii rasanya woooeeenakk Polll, rasanya itu gurih banget dan rasa asinnya tuhh pas di mulut.', image: 'review-4.webp' },
  { name: 'Fikrar Ahmad Tafail', initials: 'FA', quote: 'Ayam Bakar nya tuh definisi “healing after work” sih. bumbunya meresap parah, juicy, terus ada aroma bakarnya yang bikin auto laper lagi.', image: 'review-5.webp' }
];

export const faqs = [
  { q: 'Apa saja pilihan menu Hanasari?', a: 'Hanasari menyediakan nasi box, snack box, tumpeng nasi kuning, tumpeng pecel, hampers buah, hampers kue kering, serta sambal botol. Lihat katalog untuk pilihan lauk dan snack, lalu konfirmasikan ketersediaan kepada admin.' },
  { q: 'Apakah bisa menyesuaikan menu dan anggaran?', a: 'Ceritakan kebutuhan dan kisaran anggaran Anda melalui WhatsApp. Admin akan membantu mendiskusikan pilihan paket, lauk, serta penyesuaian yang tersedia.' },
  { q: 'Berapa minimum pesanan dan kapan harus memesan?', a: 'Minimum pesanan dan waktu persiapan dapat berbeda menurut menu, jumlah, serta tanggal acara. Hubungi admin untuk memastikan sebelum memesan. Katalog mencantumkan minimum 40 pcs khusus roti untuk paket premium.' },
  { q: 'Apakah harga sudah termasuk ongkos kirim?', a: 'Belum. Harga dalam katalog belum termasuk pajak dan ongkos kirim. Total biaya, cakupan pengiriman, dan jadwal akan dikonfirmasi berdasarkan rincian pesanan Anda.' },
  { q: 'Bagaimana jika ada alergi atau pantangan makanan?', a: 'Sampaikan alergi dan pantangan sebelum memesan agar admin dapat mengonfirmasi bahan serta proses pengolahannya. Kesesuaian menu perlu disepakati terlebih dahulu.' },
  { q: 'Apakah bisa memesan melalui E-Katalog?', a: 'Katalog Hanasari mencantumkan layanan pemesanan melalui E-Katalog. Silakan hubungi admin untuk tautan produk dan bantuan kebutuhan pengadaan.', cta: { label: 'Tanyakan E-Katalog', message: 'Saya ingin informasi pemesanan Hanasari melalui E-Katalog.', source: 'E-Katalog' } }
];

export const img = (file: string) => `/assets/images/${file}`;
export const asset = (file: string) => `/assets/playground/option-1/${file}`;
