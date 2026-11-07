# Hanasari Catering — backup tampilan final

Backup source Astro dari versi terakhir `hanasari-astro`. Folder ini bukan repository production. CMS/admin dan halaman eksperimen `/revisi/` telah dilepas; konten artikel Markdown tetap digunakan oleh website.

## Menjalankan backup

Gunakan Node.js 22.12.0 atau versi kompatibel lebih baru, lalu dari folder ini:

```sh
npm ci
npm run dev
```

Untuk hasil statis:

```sh
npm run build
npm run preview
```

Root project langsung di `hanasari-website`. Output build berada di `dist`. Preview harus dilayani dari root server karena URL aset menggunakan `/assets/`.

Halaman yang dipertahankan: homepage, tentang kami, testimoni, daftar artikel dan empat artikel. Source tampilan dan aset tidak diubah. Backup ini tidak membutuhkan Decap OAuth Worker atau kredensial Cloudflare.

Repository production terpisah: https://github.com/mdimas103digmarketingmaul/hanasari-website

Temuan security dependencies dan SEO lama tidak diperbaiki dalam cleanup ini. Jangan menganggap backup ini sebagai konfigurasi deployment production terbaru.
