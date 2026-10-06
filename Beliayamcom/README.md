# Beliayam.com — Website satu halaman

Website statis HTML, CSS, dan JavaScript. Tidak memerlukan instalasi, build, server backend, atau API key. Seluruh gambar berada di folder lokal; tidak menggunakan CDN atau font eksternal.

## Preview di VS Code
1. Ekstrak seluruh ZIP.
2. Buka folder `beliayam-website` melalui **File → Open Folder** di VS Code Desktop.
3. Klik kanan `index.html` → **Open with Live Server** (ekstensi Live Server perlu terpasang). File juga bisa langsung dibuka di browser dengan klik dua kali.

## Deploy
Upload **isi folder** ini ke root repository, sehingga `index.html` langsung ada di root. Pertahankan folder `assets` beserta semua isinya.

- **GitHub Pages:** pilih branch yang digunakan dan folder `/ (root)` pada Settings → Pages. File `.nojekyll` disertakan.
- **Cloudflare Pages:** gunakan situs statis tanpa build. Pilih direktori yang berisi `index.html` sebagai direktori output. Untuk upload langsung, unggah folder atau ZIP yang isinya dimulai dengan `index.html`.
- **Hosting biasa:** letakkan isinya pada document root, biasanya `public_html`.
- Semua path aset bersifat relatif sehingga situs juga dapat dipasang pada subfolder.

## Struktur
```
index.html
assets/css/style.css
assets/js/script.js
assets/images/
README.md
CATATAN-KONTEN.md
.nojekyll
```

## Fitur
- Desain responsif desktop, tablet, dan ponsel.
- 15 jenis produk: 12 jenis potongan, broiler, pejantan, dan kampung.
- 7 ukuran broiler dan masing-masing 6 ukuran pejantan/kampung.
- Kategori produk dan katalog yang dapat digeser.
- Pemilihan beberapa produk, ukuran, jumlah, satuan, tanggal, lokasi, dan catatan.
- Form membentuk pesan WhatsApp ke **6281808051777 / 0818-0805-1777**.
- Validasi form, tanggal minimum, menu mobile, FAQ, link sosial, dan peta wilayah Bogor.
- Tidak menyimpan data form, tidak mengirim pesanan otomatis, tidak menghitung harga yang belum tersedia.

## Edit konten
- Teks, tautan sosial, section, testimoni: `index.html`.
- Warna dan tampilan: variabel warna di awal `assets/css/style.css`.
- Produk, ukuran, dan nomor WhatsApp: awal `assets/js/script.js`.
- Jika nomor diganti, perbarui juga nomor tertulis dan seluruh tautan fallback pada `index.html`.
- Ganti foto pada `assets/images` dengan nama yang sama agar tidak perlu mengubah referensi. Alternatifnya ubah properti `image` di daftar `PRODUCTS`.

Lihat `CATATAN-KONTEN.md` untuk hal yang perlu dilengkapi sebelum peluncuran final.
