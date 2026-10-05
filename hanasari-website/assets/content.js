/* Edit file ini untuk mengganti kontak, tautan platform, produk, dan testimoni.
   Gunakan path lokal relatif dari index.html. Harga: katalog Agustus 2026. */
window.HANASARI = {
  whatsapp: '628563050300',
  // Isi URL toko resmi ketika tersedia. Jika kosong, tombol meminta link kepada admin.
  gofoodUrl: '',
  grabfoodUrl: '',
  products: [
    { id:'nasi-hemat', category:'nasi', name:'Paket Hemat', price:23000, image:'nasi-hemat.webp', tag:'Praktis & hemat', description:'Nasi, lauk utama, lalapan, dan sambal. Dikemas dalam box coklat / motif basic.' },
    { id:'nasi-reguler', category:'nasi', name:'Paket Reguler', price:26000, image:'nasi-reguler.webp', tag:'Teman makan siang', description:'Nasi, lauk utama, tumisan, sambal, kerupuk, dan air mineral Zoom. Box coklat / motif basic.' },
    { id:'nasi-mantap', category:'nasi', name:'Paket Mantap', price:35000, image:'nasi-mantap.webp', tag:'Box spesial Hanasari', description:'Nasi, lauk utama, tumisan, gorengan, sambal, kerupuk, serta buah atau air mineral Le Minerale.' },
    { id:'nasi-juragan', category:'nasi', name:'Paket Juragan', price:40000, image:'nasi-juragan.webp', tag:'Box spesial Hanasari', description:'Nasi, lauk utama, tumisan, gorengan, sambal, kerupuk, buah, dan air mineral Le Minerale.' },
    { id:'nasi-ningrat', category:'nasi', name:'Paket Ningrat', price:45000, image:'nasi-ningrat.webp', tag:'Dengan 2 lauk utama', description:'Nasi, 2 lauk utama, tumisan, gorengan, sambal, kerupuk, buah, dan air mineral Le Minerale. Box spesial Hanasari.' },
    { id:'snack-reguler', category:'snack', name:'Snack Reguler', price:14000, image:'snack-reguler.webp', tag:'Teman jeda acara', description:'2 pilihan snack dan minuman. Dikemas dalam box putih / coklat.' },
    { id:'snack-mantap', category:'snack', name:'Snack Mantap', price:18000, image:'snack-mantap.webp', tag:'Pilihan lebih beragam', description:'3 pilihan snack dan minuman. Dikemas dalam box Hanasari.' },
    { id:'snack-juragan', category:'snack', name:'Snack Juragan', price:23000, image:'snack-juragan.webp', tag:'Lengkapi kebersamaan', description:'4 pilihan snack dan air mineral. Dikemas dalam box Hanasari.' },
    { id:'tumpeng', category:'spesial', name:'Tumpeng Nasi Kuning', price:null, image:'tumpeng.webp', photo:true, tag:'Untuk hari istimewa', description:'Sajian untuk syukuran dan perayaan bersama. Diskusikan pilihan lauk, ukuran, serta jumlah porsi dengan admin.' },
    { id:'tumpeng-pecel', category:'spesial', name:'Tumpeng Pecel', price:null, image:null, tag:'Sajian untuk berbagi', description:'Pilihan tumpeng dengan cita rasa pecel. Hubungi admin untuk komposisi, ukuran, dan ketersediaan.' },
    { id:'hampers-buah', category:'spesial', name:'Hampers Buah', price:null, image:null, tag:'Bingkisan penuh perhatian', description:'Pilihan bingkisan buah untuk orang terdekat. Jenis buah dan kemasan dikonfirmasi saat pemesanan.' },
    { id:'hampers-kue', category:'spesial', name:'Hampers Kue Kering', price:null, image:null, tag:'Manisnya berbagi', description:'Lengkapi momen spesial dengan bingkisan kue kering. Tanyakan pilihan isi dan kemasan kepada admin.' },
    { id:'sambal', category:'spesial', name:'Sambal Botol', price:null, image:null, tag:'Pelengkap selera', description:'Cita rasa sambal untuk melengkapi hidangan. Tanyakan varian, ukuran, dan harga yang tersedia.' }
  ],
  // Kutipan bersumber dari screenshot lampiran; tidak menggunakan rating agregat.
  reviews: [
    { name:'Ghina Khalisa', initials:'GK', quote:'enak banget bangettt, bumbunya pas, porsinya lebih dari cukup, kakak adminnya ramah dan informatif!!', image:'review-2.webp' },
    { name:'Salsabila Aliyah', initials:'SA', quote:'Emang ayam bakarnya paling enak sih bagiku... karena bumbunya meresap, dagingnya empuk ngga alot, pendampingnya ngga cuma krupuk tapi ada bakwan dan jeruk, plus sambalnya cocok. Mantapp', image:'review-1.webp' },
    { name:'sarah nurhanifah', initials:'SN', quote:'semua rasa masakan berani bumbu, harganya buat isian lengkap kaya gini murah tapi rasa ga murahan..', image:'review-6.webp' },
    { name:'Djoko Priyanto', initials:'DP', quote:'alhamdulillah enakkk bangett. Lezat hingga gigitan terakhir.', image:'review-3.webp' },
    { name:'Tangguh Onomatua.H.', initials:'TO', quote:'Asliii rasanya woooeeenakk Polll, rasanya itu gurih banget dan rasa asinnya tuhh pas di mulut.', image:'review-4.webp' },
    { name:'Fikrar Ahmad Tafail', initials:'FA', quote:'Ayam Bakar nya tuh definisi “healing after work” sih. bumbunya meresap parah, juicy, terus ada aroma bakarnya yang bikin auto laper lagi.', image:'review-5.webp' }
  ]
};
