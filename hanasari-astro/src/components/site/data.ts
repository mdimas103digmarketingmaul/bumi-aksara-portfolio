/*
 * Hanasari Catering — satu sumber data konten website (homepage & halaman artikel).
 * Harga dan isi paket mengacu pada katalog Agustus 2026.
 */

export const WA_NUMBER = '628563050300';
export const PHONE_ALT = '+628561095500';
export const MAPS_URL = 'https://maps.app.goo.gl/J5xKt56AYwhPnQ7c7';
export const CATALOG_URL = '/assets/docs/katalog-hanasari-agustus-2026.pdf';
export const LINKS_URL = 'https://berbagi.link/HanasariCatering';
export const INSTAGRAM_URL = 'https://www.instagram.com/hanasaricatering/';
export const TIKTOK_URL = 'https://www.tiktok.com/@hanasaricatering';
export const PARTNERSHIP_EMAIL = 'marketing.hanasari@gmail.com';
/** Homepage website. Dipakai header/footer di halaman selain homepage. */
export const HOME_PATH = '/';

/** Link WhatsApp dengan pesan pembuka yang sama seperti production. */
export const waLink = (message: string, source: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo Hanasari Catering, saya datang dari website Hanasari.\n\n${message}\n\nSumber: Website Hanasari — ${source}`
  )}`;

export const rupiah = (value: number) => 'Rp' + new Intl.NumberFormat('id-ID').format(value);

/** Foto lama (cut-out katalog, logo, hero) di public/assets/images/. */
export const img = (file: string) => `/assets/images/${file}`;
export const asset = (file: string) => `/assets/site/${file}`;
/** Foto produk dari dokumentasi Hanasari: public/assets/products/<kategori>/<produk>.webp */
export const productImg = (file: string) => `/assets/products/${file}`;

/* ==========================================================================
   Menu & produk
   Sumber: Flyer Hanasari 082026 (harga & isi paket), Compro B2B Hanasari Okt 2026
   (paket sarapan, kukusan, layanan), dan folder dokumentasi foto Hanasari.
   Menambah produk: tambahkan objek ke `products` dengan `category` yang sesuai.
   Menambah foto: simpan WebP ±800×600 di public/assets/products/<kategori>/,
   lalu isi `image: productImg('<kategori>/<file>.webp')` dan `imageAlt`.
   Produk tanpa `image` otomatis tampil sebagai kartu placeholder bermotif.
   ========================================================================== */

export type Category = 'nasi-box' | 'snack-box' | 'sarapan' | 'tumpeng' | 'liwet-bowl' | 'hantaran';

export interface CategoryInfo {
  id: Category;
  label: string;
  intro: string;
  /** Thumbnail bulat di tab kategori (176×176). */
  thumb: string;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  /** Harga per box dari Flyer. `null` = tampil "Tanya admin" (jangan isi tanpa sumber resmi). */
  price: number | null;
  /** Isi paket / pilihan menu, tampil sebagai chip. */
  items: string[];
  /** Judul kecil di atas `items`, mis. "Pilih salah satu". */
  itemsLabel?: string;
  pack?: string;
  /** Deskripsi singkat untuk produk yang isinya didiskusikan dengan admin. */
  note?: string;
  image?: string;
  imageAlt?: string;
  /** Teks besar di kartu tanpa foto (default: kata pertama nama produk). */
  motif?: string;
  /** 'cutout' = gambar transparan dari katalog; 'photo' = foto dokumentasi penuh. */
  imageFit?: 'cutout' | 'photo';
  featured?: boolean;
}

export const categories: CategoryInfo[] = [
  { id: 'nasi-box', label: 'Nasi Box', thumb: productImg('kategori/nasi-box.webp'), intro: 'Lima paket nasi box dengan lauk pilihan Anda.' },
  { id: 'snack-box', label: 'Snack Box', thumb: productImg('kategori/snack-box.webp'), intro: 'Snack pilihan untuk jeda rapat dan acara.' },
  { id: 'sarapan', label: 'Sarapan & Harian', thumb: productImg('kategori/sarapan.webp'), intro: 'Sarapan dan konsumsi rutin untuk kantor dan institusi.' },
  { id: 'tumpeng', label: 'Tumpeng', thumb: productImg('kategori/tumpeng.webp'), intro: 'Tumpeng sesuai selera untuk syukuran dan perayaan.' },
  { id: 'liwet-bowl', label: 'Liwet & Rice Bowl', thumb: productImg('kategori/liwet-bowl.webp'), intro: 'Sajian Nusantara dalam besek dan bowl praktis.' },
  { id: 'hantaran', label: 'Lainnya', thumb: productImg('kategori/hantaran.webp'), intro: 'Hantaran, bingkisan, dan pelengkap sajian Anda.' }
];

export const products: Product[] = [
  /* Nasi Box — Flyer 082026. Cut-out mengikuti katalog; Mantap memakai foto dokumentasi
     karena katalog memakai gambar yang sama untuk Mantap & Juragan. */
  { id: 'nasi-hemat', category: 'nasi-box', name: 'Paket Hemat', price: 23000, image: img('nasi-hemat.webp'), imageFit: 'cutout', items: ['Nasi', 'Lauk utama', 'Lalapan', 'Sambal'], pack: 'Box coklat / motif basic' },
  { id: 'nasi-reguler', category: 'nasi-box', name: 'Paket Reguler', price: 26000, image: img('nasi-reguler.webp'), imageFit: 'cutout', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Sambal', 'Kerupuk', 'Air mineral Zoom'], pack: 'Box coklat / motif basic' },
  { id: 'nasi-mantap', category: 'nasi-box', name: 'Paket Mantap', price: 35000, image: productImg('nasi-box/nasi-box-mantap.webp'), imageAlt: 'Paket Mantap Hanasari dalam Hanasari Lunch Box berisi lauk, tumisan, gorengan, sambal, kerupuk, dan jeruk', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah / air mineral Le Minerale'], pack: 'Box spesial Hanasari' },
  { id: 'nasi-juragan', category: 'nasi-box', name: 'Paket Juragan', price: 40000, image: img('nasi-juragan.webp'), imageFit: 'cutout', items: ['Nasi', 'Lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah', 'Air mineral Le Minerale'], pack: 'Box spesial Hanasari' },
  { id: 'nasi-ningrat', category: 'nasi-box', name: 'Paket Ningrat', price: 45000, image: img('nasi-ningrat.webp'), imageFit: 'cutout', items: ['Nasi', '2 lauk utama', 'Tumisan', 'Gorengan', 'Sambal', 'Kerupuk', 'Buah', 'Air mineral Le Minerale'], pack: 'Box spesial Hanasari', featured: true },

  /* Snack Box — Flyer 082026 (Compro: "Paket Meeting & Training"). */
  { id: 'snack-reguler', category: 'snack-box', name: 'Snack Reguler', price: 14000, image: img('snack-reguler.webp'), imageFit: 'cutout', items: ['2 pilihan snack', 'Minuman'], pack: 'Box putih / coklat' },
  { id: 'snack-mantap', category: 'snack-box', name: 'Snack Mantap', price: 18000, image: img('snack-mantap.webp'), imageFit: 'cutout', items: ['3 pilihan snack', 'Minuman'], pack: 'Box Hanasari' },
  { id: 'snack-juragan', category: 'snack-box', name: 'Snack Juragan', price: 23000, image: img('snack-juragan.webp'), imageFit: 'cutout', items: ['4 pilihan snack', 'Air mineral'], pack: 'Box Hanasari', featured: true },

  /* Sarapan & harian — Compro B2B Okt 2026. Compro mencantumkan harga khusus B2B
     (Reguler Rp15.000, Premium Rp20.000, kukusan mulai Rp10.000/pax); belum ditampilkan
     sampai harga untuk umum dikonfirmasi client. */
  { id: 'sarapan-reguler', category: 'sarapan', name: 'Sarapan Reguler', price: null, image: productImg('sarapan/sarapan-reguler.webp'), imageAlt: 'Paket sarapan Hanasari dalam wadah bersekat', items: [], note: 'Sarapan praktis dengan menu sesuai kebutuhan.' },
  { id: 'sarapan-premium', category: 'sarapan', name: 'Sarapan Premium', price: null, image: productImg('sarapan/sarapan-premium.webp'), imageAlt: 'Paket sarapan premium Hanasari dalam wadah bersekat', items: [], note: 'Sarapan premium dengan menu sesuai kebutuhan.' },
  { id: 'kukusan', category: 'sarapan', name: 'Kukusan', price: null, image: productImg('sarapan/kukusan.webp'), imageAlt: 'Contoh penyajian Hanasari dalam besek bambu dengan bungkusan daun pisang dan lauk pendamping', itemsLabel: 'Pilihan kukusan', items: ['Kacang Tanah', 'Ubi', 'Singkong', 'Pisang Rebus', 'Telur Rebus', 'Edamame'] },
  { id: 'catering-harian', category: 'sarapan', name: 'Catering Harian', price: null, image: productImg('sarapan/catering-harian.webp'), imageAlt: 'Catering harian Hanasari dalam ompreng bersekat berisi nasi, ayam goreng tepung, sayur, dan puding', items: [], note: 'Menu harian dalam ompreng bersekat untuk kebutuhan rutin kantor maupun institusi. Menu rotasi, jadwal, dan jumlah porsi disepakati bersama admin.' },

  /* Tumpeng — Flyer 082026 + dokumentasi. Foto Tumpeng Pecel dari folder "Tumpeng Tampah". */
  { id: 'tumpeng-nasi-kuning', category: 'tumpeng', name: 'Tumpeng Nasi Kuning', price: null, image: productImg('tumpeng/tumpeng-nasi-kuning.webp'), imageAlt: 'Tumpeng nasi kuning Hanasari dikelilingi aneka lauk di atas daun pisang', items: [], note: 'Nasi kuning dengan aneka lauk untuk syukuran dan perayaan bersama. Hiasan dapat menyesuaikan tema acara. Diskusikan lauk, ukuran, dan porsi dengan admin.' },
  { id: 'mini-tumpeng', category: 'tumpeng', name: 'Mini Tumpeng', price: null, image: productImg('tumpeng/mini-tumpeng.webp'), imageAlt: 'Mini tumpeng nasi kuning Hanasari dengan hiasan wortel dan lauk pendamping', items: [], note: 'Tumpeng ukuran kecil untuk ulang tahun dan syukuran keluarga, lengkap dengan lauk pendamping. Hiasan bisa disesuaikan.' },
  { id: 'tumpeng-pecel', category: 'tumpeng', name: 'Tumpeng Pecel', price: null, image: productImg('tumpeng/tumpeng-pecel.webp'), imageAlt: 'Tumpeng pecel Hanasari di atas tampah berisi sayuran, lontong, tahu dan tempe bacem, serta bumbu pecel', itemsLabel: 'Isi tampah', items: ['Lontong', 'Tahu Bacem', 'Tempe Bacem', 'Kangkung', 'Toge', 'Kacang Panjang', 'Kol', 'Bumbu Pecel'] },

  /* Liwet & rice bowl — folder dokumentasi "Nasi Liwet", "Ricebowl". */
  { id: 'nasi-liwet', category: 'liwet-bowl', name: 'Nasi Liwet', price: null, image: productImg('liwet-bowl/nasi-liwet.webp'), imageAlt: 'Paket nasi liwet Hanasari dalam besek bambu dengan ikan, tahu, tempe, tumisan, dan sambal', items: [], note: 'Nasi liwet dengan lauk pendamping seperti ikan, tahu, tempe, tumisan, dan sambal, dikemas dalam besek bambu. Komposisi dan porsi dikonfirmasi bersama admin.' },
  { id: 'rice-bowl', category: 'liwet-bowl', name: 'Rice Bowl', price: null, image: productImg('liwet-bowl/rice-bowl.webp'), imageAlt: 'Rice bowl Hanasari berisi ayam berbumbu dengan wijen, selada, dan mentimun', items: [], note: 'Nasi dengan lauk pilihan dalam bowl praktis, cocok untuk acara santai maupun kantor. Tanyakan pilihan lauk dan jumlah pesanan kepada admin.' },

  /* Lainnya — folder "Hantaran Nikah", "kue kering", "Kembang Goyang", "Photo Sambal". */
  { id: 'hantaran', category: 'hantaran', name: 'Hantaran', price: null, image: productImg('hantaran/hantaran.webp'), imageAlt: 'Hantaran Hanasari berisi bihun goreng, ayam bakar, nasi kuning, dan lauk dalam wadah', items: [], note: 'Nasi dan aneka lauk untuk hantaran lamaran atau pernikahan, dikemas dalam besek berpita. Isi, jumlah, dan dekorasi didiskusikan bersama admin.' },
  { id: 'hampers-kue', category: 'hantaran', name: 'Hampers Kue Kering', price: null, image: productImg('hantaran/hampers-kue-kering.webp'), imageAlt: 'Kue kering nastar Hanasari dalam toples bening', items: [], note: 'Nastar dan aneka kue kering dalam toples untuk bingkisan atau hadiah. Tanyakan varian dan kemasan yang tersedia kepada admin.' },
  { id: 'kembang-goyang', category: 'hantaran', name: 'Kembang Goyang', price: null, image: productImg('hantaran/kembang-goyang.webp'), imageAlt: 'Kembang goyang Hanasari dalam kemasan plastik berlabel', items: [], note: 'Kue kembang goyang renyah dalam kemasan berlabel, untuk suguhan, oleh-oleh, maupun bingkisan.' },
  { id: 'sambal', category: 'hantaran', name: 'Sambal Botol', price: null, image: productImg('hantaran/sambal-botol.webp'), imageAlt: 'Aneka sambal Hanasari dalam botol berlabel merah', items: [], note: 'Cita rasa sambal untuk melengkapi hidangan. Tanyakan varian, ukuran, dan harga yang tersedia.' }
];

export const categoryOf = (id: Category) => categories.find((c) => c.id === id)!;

/**
 * Pilihan isi box — dari halaman "Nasi Box & Snack Box Hanasari" pada Flyer 082026.
 * Dimsum ditambahkan dari Compro B2B Okt 2026.
 */
export const dishGroups: { id: string; label: string; items: string[]; hint?: string }[] = [
  { id: 'ayam', label: 'Lauk Ayam', items: ['Ayam Goreng', 'Ayam Bakar', 'Ayam Rica-Rica', 'Ayam Penyet', 'Ayam Kremes', 'Ayam Tepung Crispy', 'Ayam Teriyaki', 'Ayam Asam Manis', 'Ayam Kecap', 'Ayam Semur', 'Ayam Serundeng', 'Ayam Geprek', 'Ayam Taliwang', 'Ayam Gulai', 'Ayam Cabe Ijo', 'Ayam Woku', 'Soto Ayam'] },
  { id: 'daging', label: 'Lauk Daging', items: ['Daging Rendang', 'Daging Semur', 'Daging Pedas Balado', 'Daging Empal', 'Daging Teriyaki', 'Daging Asam Manis', 'Daging Gulai Cincang', 'Daging Lada Hitam', 'Daging Cabe Ijo'] },
  { id: 'ikan', label: 'Lauk Ikan', items: ['Ikan Goreng', 'Ikan Bakar', 'Ikan Pesmol', 'Ikan Saus Padang', 'Ikan Pedas Balado', 'Ikan Pindang', 'Ikan Pepes', 'Ikan Asam Manis', 'Ikan Bumbu Kuning', 'Ikan Bumbu Sarden'], hint: 'Jenis ikan: bawal, nila, gurame, emas, kembung, atau tongkol.' },
  { id: 'tumisan', label: 'Tumisan', items: ['Cah Tauge dan Tahu', 'Tumis Urap', 'Tumis Tempe Kacang Panjang', 'Tempe Orek', 'Mie Bakso', 'Cah Pakcoy', 'Tumis Sawi Tauge', 'Tumis Buncis Bakso', 'Tumis Bunga Pepaya Teri Medan', 'Tumis Terong Balado', 'Tumis Telur Tomat', 'Tumis Bakso Jamur Putren', 'Tumis Pare', 'Cah Kangkung Terasi', 'Cah Kangkung Saus Tiram'] },
  { id: 'gorengan', label: 'Gorengan', items: ['Tempe Goreng', 'Tempe Mendoan', 'Tahu Goreng', 'Bakwan Jagung', 'Kulit Ayam', 'Perkedel'] },
  { id: 'sambal', label: 'Sambal', items: ['Sambal Matah', 'Sambal Goreng', 'Sambal Bawang', 'Sambal Terasi', 'Sambal Cabe Ijo', 'Sambal Tomat', 'Sambal Dabu-Dabu', 'Sambal Kacang', 'Sambal Mangga Muda'] },
  { id: 'snack', label: 'Snack', items: ['Pastel Sayur', 'Pastel Sayur Telur', 'Pastel Sayur Daging', 'Puding Mangga', 'Puding Coklat', 'Lemper Ayam', 'Pisang Molen', 'Risoles Mayo Beef', 'Sosis Solo', 'Donat Gula', 'Donat Mesis', 'Kue Soes', 'Lontong Isi Sayur', 'Lontong Isi Sayur Ayam', 'Lontong Isi Sayur Daging', 'Lontong Isi Oncom', 'Pai Buah', 'Martabak Telur Mini', 'Panada', 'Dadar Gulung', 'Lumpur Surga', 'Roti Coklat', 'Roti Kacang Merah', 'Roti Kacang Hijau', 'Roti Srikaya', 'Roti Keju', 'Roti Pisang Coklat', 'Roti Sosis', 'Dimsum'], hint: 'Khusus roti, minimal pemesanan 40 pcs untuk paket premium.' },
  { id: 'buah', label: 'Buah', items: ['Jeruk', 'Pisang', 'Salak'] }
];

/**
 * Pelanggan yang di-highlight — daftar dari client (revisi Oktober 2026).
 * Ditampilkan sebagai tipografi; jangan ganti dengan logo kecuali logo resminya tersedia.
 */
export const clients = [
  'SLOG Polri',
  'Firman Advisory',
  'Kanwil Kemenag DKI Jakarta',
  'BTN KC Menteng',
  'Kecamatan Matraman',
  'Puskesmas Kecamatan Matraman',
  'Universitas Negeri Jakarta',
  'UMM Travel'
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
  { q: 'Apa saja pilihan menu Hanasari?', a: 'Nasi box, snack box, sarapan, catering harian, tumpeng, nasi liwet, rice bowl, hantaran, kue kering, kembang goyang, dan sambal botol. Menu dapat disesuaikan dengan kebutuhan Anda.' },
  { q: 'Apakah bisa menyesuaikan menu dan anggaran?', a: 'Ceritakan kebutuhan dan kisaran anggaran Anda melalui WhatsApp. Admin akan membantu mendiskusikan pilihan paket, lauk, serta penyesuaian yang tersedia.' },
  { q: 'Berapa minimum pesanan dan kapan harus memesan?', a: 'Minimum pesanan dan waktu persiapan dapat berbeda menurut menu, jumlah, serta tanggal acara. Hubungi admin untuk memastikan sebelum memesan. Katalog mencantumkan minimum 40 pcs khusus roti untuk paket premium.' },
  { q: 'Apakah harga sudah termasuk ongkos kirim?', a: 'Belum. Harga dalam katalog belum termasuk pajak dan ongkos kirim. Total biaya, cakupan pengiriman, dan jadwal akan dikonfirmasi berdasarkan rincian pesanan Anda.' },
  { q: 'Bagaimana jika ada alergi atau pantangan makanan?', a: 'Sampaikan alergi dan pantangan sebelum memesan agar admin dapat mengonfirmasi bahan serta proses pengolahannya. Kesesuaian menu perlu disepakati terlebih dahulu.' },
  { q: 'Apakah bisa memesan melalui E-Katalog?', a: 'Katalog Hanasari mencantumkan layanan pemesanan melalui E-Katalog. Silakan hubungi admin untuk tautan produk dan bantuan kebutuhan pengadaan.', cta: { label: 'Tanyakan E-Katalog', message: 'Saya ingin informasi pemesanan Hanasari melalui E-Katalog.', source: 'E-Katalog' } }
];

