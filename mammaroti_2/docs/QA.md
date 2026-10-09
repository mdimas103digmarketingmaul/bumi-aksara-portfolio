# Pemeriksaan delivery

## Dilakukan

- Seluruh artboard PDF dirender dan dibaca dalam 7 potongan vertikal sebelum implementasi.
- Urutan semua section dan 16 produk diperiksa terhadap PDF.
- Koordinat, warna, tinggi section, serta posisi aset diambil dari struktur PDF.
- Semua 16 grafis nama produk hasil ekstraksi dirender terpisah dan diperiksa secara visual.
- Foto, logo, panah dan ilustrasi diambil dari sumber; tidak menggunakan gambar substitusi.
- `npm run build`: berhasil, halaman utama diprerender dan route `/api/contact` tersedia.
- `npm run typecheck`: berhasil.
- `npm run check`: referensi aset tersedia, 16 produk, anchor section utama, dan 5 placeholder berita diperiksa.
- `npm test`: 10 pemeriksaan route kontak berhasil: fallback email, validasi nama/email/panjang pesan, honeypot, origin, JSON, ukuran payload, webhook berhasil dan gagal. Fetch webhook dimock; tidak ada pesan nyata yang dikirim.
- ZIP diperiksa integritasnya dan hanya berisi source, lockfile, dokumentasi, referensi PDF, aset, dan konfigurasi. Dependency/build cache tidak disertakan.

## Belum terverifikasi

Screenshot browser untuk viewport desktop, tablet, dan mobile belum tersedia di lingkungan pembuatan. Tidak dilakukan klaim lulus visual regression atau pixel-perfect 100%. Responsive telah ditulis dan ditinjau dari CSS, belum diuji dengan browser nyata. Keyboard interaction dan pembukaan aplikasi email juga perlu diperiksa di browser pengguna.

Layanan penerima formulir, akun sosial, nomor WhatsApp, dan artikel berita asli tidak diberikan oleh sumber. Mode default formulir adalah draf email; tautan sosial belum diaktifkan. Integrasi eksternal tidak diklaim sudah tersambung.

## Checklist browser saat dijalankan lokal

1. Buka 1440px pada zoom 100%, bandingkan dengan `Draft-Web.pdf`.
2. Periksa 1920, 1024, 768, 375, dan 320px: gambar, wrapping heading, urutan section, dan tidak ada overflow halaman.
3. Klik Lokasi / Menu / Kritik & Saran / Temukan Kami / Keep Scrolling.
4. Pada mobile, buka menu; gunakan Tab dan Escape; pilih anchor dan pastikan menu menutup.
5. Scroll berita secara horizontal.
6. Kirim form kosong/invalid untuk validasi, lalu data valid untuk membuka draf email. Jangan menganggap draf sebagai pesan terkirim.
7. Bila webhook sudah dikonfigurasi, verifikasi penerimaan melalui layanan Anda.
8. Uji prefers-reduced-motion dan fokus keyboard.

## Perbedaan yang diketahui dari sumber

- Font Poppins/Bebas Neue merupakan pilihan dari inspeksi visual karena PDF tidak mengungkap nama font. Grafik label produk tetap memakai bentuk path asli.
- Pola logo di latar ditata ulang dari logo sumber sebagai tile untuk mengisi layout responsif.
- Tampilan mobile merupakan adaptasi karena desain hanya menyediakan desktop.
- Beberapa teks sumber masih dummy atau mengandung ejaan yang tidak lazim; sengaja dipertahankan.
