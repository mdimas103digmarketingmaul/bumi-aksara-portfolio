# Aset

Semua aset yang dibutuhkan untuk tampilan sekarang sudah disertakan. Tidak perlu memasukkan foto terpisah agar website dapat berjalan.

| File / kelompok | Asal |
| --- | --- |
| `hero-bun.webp`, `split-bun.webp` | Foto embedded dari PDF, area transparan kosong dipangkas |
| `original-dough.webp`, `taro-dough.webp` | Foto embedded dari PDF |
| `bun.webp`, `iced-drink.webp` | Foto embedded yang berulang pada kartu produk |
| `label-*.svg` | Path vektor nama produk + bayangan raster asli dari PDF |
| `stepped-divider.svg` | Path vektor divider asli dari PDF |
| `icons/arrow-*.svg` | Path vektor panah asli dari PDF |
| `logos/*.webp` | Logo embedded dari PDF |
| `outlet-map.webp` | Crop ilustrasi peta dan pin dari PDF |
| `wheat.webp`, `wheat-strip.webp` | Crop motif gandum dari PDF |
| `fonts/*.woff2` | Poppins Regular/Semibold, Bebas Neue Regular; paket Fontsource 5.3.0 |

Tidak ada gambar berita asli dalam PDF. Lima kotak `empty image` sengaja dibangun dengan HTML/CSS sesuai sumber, bukan broken-image placeholders. Jika kelak foto berita final diberikan, gunakan nama seperti `public/images/news-01.webp` sampai `news-05.webp` dan edit `NewsSection.tsx`.

Desain juga belum memberikan URL media sosial, nomor WhatsApp, link detail berita, atau endpoint penerima formulir. Pengisian data tersebut dijelaskan di README. Video tidak diperlukan oleh desain.
