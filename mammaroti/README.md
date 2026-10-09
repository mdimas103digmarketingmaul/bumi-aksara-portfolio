# MammaRoti — Your Everyday Coffeebun

Website statis berdasarkan `Draft Web.pdf`. Semua aset tampilan dan font ada di dalam paket. Tidak perlu npm, build, API key, atau koneksi internet untuk tampilan dan interaksi lokal.

## Mulai dalam 1 menit

1. Ekstrak ZIP.
2. Drag folder hasil ekstrak ke VS Code.
3. Buka `index.html` dengan Live Server, atau klik dua kali file tersebut untuk membuka langsung di browser.

## Unggah ke GitHub Pages

1. Upload seluruh ISI folder: `index.html`, folder `assets`, README, dan `.nojekyll` ke root repository. Jangan mengunggah file ZIP sebagai website.
2. Commit changes.
3. Pada repository pilih Settings → Pages → Deploy from a branch → main → /(root) → Save.
4. Tunggu proses publikasi selesai. Situs mendukung alamat project/subfolder karena seluruh aset memakai path relatif.

Untuk Cloudflare Pages gunakan unggahan aset statis atau repository ini tanpa perintah build, dengan root proyek sebagai direktori output. Tidak diperlukan backend untuk menampilkan website.

## Isi paket

- `index.html`: struktur, judul, copy utama, kontak, dan footer.
- `assets/style.css`: desain, responsive layout, animasi, dan reduced-motion.
- `assets/app.js`: data produk/outlet/artikel dan seluruh interaksi.
- `assets/config.js`: alamat email dan URL sosial resmi (opsional).
- `assets/images/`: foto, logo, peta, dan identitas dari PDF, dioptimalkan menjadi WebP.
- `assets/fonts/`: font lokal, lisensi, dan file sumber font.
- `assets/favicon.svg`: favicon huruf M.

## Interaksi yang tersedia

- Navigasi mobile, anchor antarbagian, dan skip link.
- Pilihan Original/Taro dengan pergantian foto, warna, dan daftar custard.
- Kategori Buns, Coffee, Non-Coffee; detail produk dalam dialog.
- Pencarian kota/wilayah/bandara, kondisi hasil kosong, dan tombol reset.
- Link Google Maps berbentuk pencarian; bukan pin alamat outlet terverifikasi.
- Tiga artikel pengenalan produk dengan dialog baca.
- Form kritik & saran: validasi input, draf email, dan salin pesan sebagai alternatif.
- Keyboard navigation, Escape untuk menutup dialog/menu, dan pengembalian fokus.
- Animasi muncul saat scroll, ticker, gerak ringan foto, serta dukungan prefers-reduced-motion.

## Konten dan penyesuaian

- Nama menu, wilayah outlet, informasi 130+ store, alamat kantor, email, sertifikasi, dan penghargaan mengikuti PDF yang diberikan. Data tersebut belum diverifikasi ulang secara independen. Tinjau kemutakhirannya sebelum website dipublikasikan.
- Teks kemitraan dan tiga artikel adalah copy editorial baru untuk mengganti Lorem ipsum/placeholder. Tidak ada tanggal berita, promo, testimoni, harga, atau peristiwa bisnis yang direkayasa.
- Foto roti/minuman dari PDF digunakan sebagai ilustrasi lintas-varian, sama seperti pada draft. Khusus Non-Coffee, foto sumber masih berupa kopi. Ganti foto tiap produk dengan foto resmi yang sesuai ketika tersedia; catatan ilustrasi ditampilkan pada katalog dan detail produk.
- Logo dari PDF beresolusi terbatas; ganti `assets/images/logo.webp` dengan versi resmi berkualitas tinggi jika tersedia.
- Seluruh kategori, termasuk semua 16 menu, tersedia melalui filter. Original/Taro ditampilkan pada satu bagian interaktif agar halaman lebih ringkas.
- Ejaan dirapikan: Raspberry, Kopi Susu, Tangerang, dan Kep. Bangka. Footer memakai kota yang tersedia dalam daftar outlet; Yogyakarta dari footer draft tidak ditambahkan ke daftar karena tidak memiliki rincian outlet di sumber.
- Link sosial dan nomor WhatsApp resmi tidak tercantum dalam PDF. Isikan URL lengkap di `assets/config.js`; tautan otomatis muncul setelah diisi. Tidak ada nomor/akun sosial yang ditebak.

## Form email: cara kerja

Form ini TIDAK mengirim email otomatis dan TIDAK menyimpan data pengunjung. Tombol “Siapkan Email” membuka aplikasi email melalui `mailto:`. Pengunjung harus menekan Kirim di aplikasi emailnya. Salinan pesan ditampilkan agar dapat disalin jika aplikasi email tidak terbuka. Tidak ada notifikasi palsu “pesan terkirim”. Pesan yang sangat panjang mungkin perlu disalin manual bila dibatasi aplikasi email.

Untuk pengiriman langsung di website, hubungkan backend/form service pilihanmu; jangan menaruh secret/API key di JavaScript publik.

## Mengubah konten

- Warna: token di `:root` pada `assets/style.css`.
- Produk: objek `products` dalam `assets/app.js`.
- Foto per produk: ubah renderer produk/detail jika ingin menambahkan field image per item.
- Outlet: array `regions` dan `exclusive` dalam `assets/app.js`.
- Artikel: array `stories` dalam `assets/app.js`.
- Kontak/sosial: `assets/config.js`; alamat kantor ada di `index.html`.

## Aset dan lisensi

Aset merek/foto diekstrak dari PDF milik pengguna untuk proyek ini. Hak merek dan foto tetap pada pemiliknya. Pastikan hak penggunaannya sesuai tujuan publikasi.

Font Nimbus Sans dan Nimbus Sans Narrow berasal dari URW Base35. Lisensi lengkap ada di `assets/fonts/LICENSE.txt`, sumber OTF disertakan di `assets/fonts/source/`. WOFF dibuat dari OTF dengan fontTools, tanpa perubahan bentuk huruf. Ikuti lisensi font untuk redistribusi.

Kode HTML/CSS/JS ditulis untuk proyek ini, tanpa pustaka/CDN pihak ketiga. Gunakan browser modern. Link Maps, email, dan sosial memerlukan aplikasi/koneksi internet yang sesuai; tampilan lokal tidak memerlukan layanan eksternal.

## Pemeriksaan paket

Diuji pada Chromium: desktop 1440px serta viewport 768px, 390px, dan 320px tanpa overflow horizontal. Pergantian adonan, 3 kategori menu, dialog produk/artikel, pencarian/reset/hasil kosong, navigasi mobile, dan persiapan draf email berjalan tanpa error JavaScript. Pembukaan langsung melalui file:// juga diuji. Uji ini tidak mengirim email atau memverifikasi lokasi Google Maps.
