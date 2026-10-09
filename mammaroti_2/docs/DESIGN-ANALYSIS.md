# Analisis referensi

Sumber: `Draft-Web.pdf`, satu artboard 1440 × 12524. Semua section dibangun sebagai komponen HTML/React; halaman tidak diganti dengan screenshot panjang.

## Peta section pada koordinat vertikal PDF

| Rentang Y | Section | Implementasi |
| --- | --- | --- |
| 0–895 | Hero oranye, tipografi besar terpotong, foto bun, navigasi kapsul | HeroSection, Header |
| 895–1790 | Roti terbelah, Crunchy / Melt / Joy / Sweet, panah, motif gandum | SensorySection |
| 1790–2108 | Divider bertingkat 9 kolom dengan sudut bulat | Divider, SVG asli |
| 2108–3076 | Our Dough Original, 4 isian | DoughSection |
| 3076–4044 | Our Dough Taro, 3 isian | DoughSection |
| 4044–4118 | Strip sertifikasi dan penghargaan, repetisi terpotong di tepi | CertificationStrip |
| 4118–7963 | Produk Lainnya: 8 Buns, 4 Coffee, 4 Non-Coffee | ProductsSection |
| 7963–9715 | Outlet Kami, 130+ Store, 10 wilayah dan 4 exclusive store | OutletsSection |
| 9715–10418 | CTA Miliki outletmu sendiri, peta, Hubungi Kami | PartnershipSection |
| 10418–11033 | Berita & Acara, 5 placeholder | NewsSection |
| 11033–11351 | Divider bertingkat kedua | Divider |
| 11351–11955 | Kritik/saran dan formulir Nama, Email, Pesan, Kirim | ContactSection |
| 11955–12524 | Logo, alamat, email, daftar kota, label sosial, ruang putih bawah | Footer |

## Sistem visual

- Latar hero #ECA259; oranye section utama #F89F48; taro #A570B1; plum #611938; cokelat #754B21.
- Kartu produk sekitar 422 × 415 unit desain, jarak 24, 3 kolom desktop, border oranye 5, radius 18.
- Header: 708 × 80, berpusat pada Y=54, tanpa sticky behavior yang tidak ada dalam referensi.
- Headline section: pendekatan Poppins Semibold 64; kategori produk 48; body outlet 24.
- Font display: pendekatan Bebas Neue 128 untuk Original/Taro; 60 untuk 130+ Store/Exclusive Store; 32 untuk isian.
- Produk mempertahankan artwork label asli dalam SVG, termasuk perspektif dan outline.
- Tidak ada UI library, stock imagery, dekorasi baru, atau animasi otomatis.

## Responsive

- Desktop/laptop/tablet mulai 768px menggunakan skala proporsional terhadap artboard; lebar maksimum halaman 1920px.
- Di bawah 768px, navigasi menjadi hamburger, bagian dough ditumpuk, daftar produk menjadi dua kolom, outlet satu kolom, kontak satu kolom.
- Di bawah 375px, produk menjadi satu kolom untuk keterbacaan.
- Berita tetap horizontal dan dapat digeser. Konten tidak dibuang pada ukuran kecil.
- Hover/focus 220ms, smooth scrolling, dan dukungan prefers-reduced-motion.

## Interpretasi sumber

Font PDF berbentuk Type3/outline sehingga tidak menyediakan nama font atau webfont yang dapat dipakai langsung. Poppins/Bebas Neue merupakan kecocokan visual, bukan identifikasi metadata yang terverifikasi. Pola logo latar ditata ulang menggunakan logo asli agar dapat mengisi area yang responsif. Perubahan line wrapping pada mobile disengaja.
