# Hanasari Catering — Website

Website statis responsif berbahasa Indonesia. Cukup HTML, CSS, dan JavaScript: tidak memerlukan npm, build, database, atau API key.

## Cara preview di VS Code

1. Ekstrak seluruh ZIP.
2. Di VS Code, pilih **File → Open Folder**, lalu buka folder `hanasari-website`.
3. Klik kanan `index.html` → **Open with Live Server** jika ekstensi Live Server sudah terpasang.
4. Alternatif: buka `index.html` langsung di browser. Seluruh font, foto, dan katalog tersedia secara lokal.

Jangan memindahkan `index.html` sendirian; sertakan folder `assets` dan `favicon.png`.

## Isi website

- Beranda dengan foto produk asli dan warna brand.
- 13 pilihan menu, filter kategori, slider horizontal, dan tombol WhatsApp per produk.
- Informasi Hanasari serta alur pemesanan.
- 6 testimoni asli dari screenshot lampiran, dengan dialog untuk membaca screenshot.
- Pilihan GoFood, GrabFood, dan kumpulan link Hanasari.
- Form konsultasi yang merangkum kebutuhan acara ke WhatsApp.
- FAQ, alamat, tautan Google Maps, Instagram, TikTok, dan kontak.
- Tombol WhatsApp mengambang dan katalog PDF.
- Navigasi mobile, fokus keyboard, dukungan reduced motion, dan label formulir.

## File yang bisa diedit

| File / folder | Kegunaan |
| --- | --- |
| `index.html` | Teks halaman, navigasi, FAQ, alamat, dan sosial media |
| `assets/style.css` | Layout responsif, warna, ukuran, serta gaya visual |
| `assets/content.js` | Data paket, harga, foto, testimoni, nomor WhatsApp, URL GoFood/GrabFood |
| `assets/app.js` | Filter menu, slider, dialog testimoni, navigasi, dan formulir WhatsApp |
| `assets/images/` | Logo dan foto produk WebP, termasuk beberapa aset cadangan dari flyer |
| `assets/testimonials/` | 6 screenshot ulasan pelanggan |
| `assets/docs/` | Katalog Agustus 2026 yang dikompres untuk website |
| `assets/fonts/` | Font Poppins lokal dan lisensi SIL OFL |

## Mengganti foto placeholder

Empat menu belum memiliki foto: Tumpeng Pecel, Hampers Buah, Hampers Kue Kering, dan Sambal Botol.

1. Simpan foto baru, misalnya `hampers-buah.webp`, di `assets/images/`.
2. Buka `assets/content.js` dan temukan produk terkait.
3. Ganti `image: null` menjadi `image: 'hampers-buah.webp'`.
4. Tambahkan `photo: true` jika ingin foto memenuhi bidang gambar. Tanpa opsi ini, gambar ditampilkan utuh agar sesuai foto produk transparan.

Nama file boleh menggunakan JPG, PNG, atau WebP. Gunakan huruf kecil dan tanda hubung agar mudah dikelola.

## Menambahkan link GoFood / GrabFood

Di `assets/content.js`, isi `gofoodUrl` dan `grabfoodUrl` dengan URL HTTPS toko resmi. Saat masih kosong, tombol meminta link toko kepada admin lewat WhatsApp; website tidak mengklaim bahwa toko sudah aktif di kedua platform.

## WhatsApp dan formulir

- Nomor utama: **628563050300**.
- Pesan diawali dengan informasi bahwa pengunjung datang dari website Hanasari.
- Tiap tombol memberi keterangan sumber, misalnya menu atau formulir konsultasi.
- Form tidak menyimpan data ke server, cookie, ataupun local storage.
- Form membuka WhatsApp dengan pesan yang sudah disiapkan. Pengunjung tetap menekan **Kirim** sendiri.
- Jika browser memblokir tab baru, tautan cadangan muncul di bawah formulir.
- Ini formulir konsultasi, bukan checkout atau konfirmasi stok otomatis.
- Jika mengganti nomor, perbarui `whatsapp` di `content.js` sekaligus kontak tampilan dan tautan cadangan `wa.me` di `index.html`.

## Sumber & hal yang perlu dilengkapi

- Palet brand: `#309c31`, `#f58e38`, `#dcaf5f`, `#134745`.
- Logo diambil dari brand guideline. Versi yang lebih tajam dapat menggantikan `assets/images/logo.webp` dan `favicon.png`.
- Font menggunakan Poppins dari brand guideline. Berkas font Montaser Arabic tidak diberikan; heading memakai Poppins agar distribusi font tetap jelas.
- Foto menu, logo Halal Indonesia, dan katalog berasal dari flyer yang dilampirkan. Logo Halal ditampilkan mengikuti materi tersebut; website tidak menambahkan nomor sertifikat atau klaim sertifikasi baru. Pemilik usaha perlu memastikan status dan penggunaan logonya tetap berlaku sebelum publikasi.
- Harga mengikuti katalog Agustus 2026. Pajak dan ongkos kirim belum termasuk, sebagaimana tertulis pada flyer. Harga menu lain tidak dikarang.
- Kutipan ulasan diambil dari enam screenshot lampiran. Sebagian dipersingkat; screenshot lengkap tetap bisa dibuka. Tidak ada rating agregat, jumlah pelanggan, atau testimoni buatan.
- Alamat mengikuti flyer, dengan ejaan kelurahan dinormalkan menjadi **Utan Kayu Selatan**. Tautan peta memakai URL yang diberikan.
- Jam buka, email, batas pengiriman, minimum order umum, serta tautan toko platform belum diberikan sehingga tidak dibuat-buat.
- Tautan berbagi.link dan Google Maps memakai alamat yang diberikan pengguna; tujuan akhir tautan tidak berhasil diverifikasi otomatis dalam sesi ini.

## Saat akan dipublikasikan

Upload isi folder ini dengan `index.html` di root hosting. Seluruh path aset bersifat relatif sehingga dapat dipasang pada domain utama atau subfolder.

Setelah domain final tersedia, tambahkan canonical URL dan URL gambar Open Graph absolut pada `<head>` untuk pratinjau berbagi yang lebih lengkap. Tidak ada domain contoh yang dipasang pada website ini.

## Pemeriksaan yang dilakukan

- Pemeriksaan sintaks JavaScript.
- Uji DOM untuk jumlah menu, filter kategori, dialog testimoni, navigasi mobile, URL WhatsApp, formulir valid, serta penolakan nama kosong.
- Pemeriksaan tujuan anchor dan kelengkapan file lokal.
- Pemeriksaan bahwa seluruh foto dapat dibaca dan tidak kosong.
- Pemeriksaan katalog PDF hasil kompresi.

Uji DOM tidak menggantikan preview visual browser. Browser preview tidak tersedia dalam sesi pembuatan ini; lakukan pemeriksaan akhir di VS Code / Live Server pada desktop dan ponsel sebelum publikasi.
