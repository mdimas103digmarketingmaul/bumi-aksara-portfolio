# Website Thufeil — Option 2

Konsep kedua untuk website **Thufeil M. Tyansah, CFP® — Gen-Z Financial Planner**, sebagai
pembanding dari versi pertama di folder induk (`website-thufeil-cfp/`).

## Konsep

Identitas visual diambil dari Thufeil sendiri, bukan template:

- **Warna:** navy malam dari jaket varsity + kuning dari `#semuamampusejahtera` dan carousel Instagram-nya.
- **Tipografi:** Archivo Variable dipakai kondensed tebal (lebar 62%) untuk display, menggemakan
  carousel "SAHAM / EMAS / HARGA / PHK". Body memakai Geist.
- **Pengalaman:** satu halaman yang terasa seperti perjalanan. Ada smooth scroll, section yang
  saling menimpa seperti lembaran, dan motion yang mengikuti scroll, bukan animasi tempelan.

### Urutan & motion

| Section | Yang terjadi |
| --- | --- |
| Preloader | "Gaji. Cicilan. Investasi. Zakat. **Kamu.**" Hanya di kunjungan pertama per sesi |
| Hero | Nama raksasa di belakang portrait, foto memudar ke latar, parallax scroll + kursor. Ukuran nama menyesuaikan tinggi layar supaya teks & tombol selalu punya ruang |
| Tentang | Kalimat profil menyala kata per kata; angka 5+ dan 100+ menghitung naik, misi 2035 sebagai kalimat; filosofi dengan highlight + quote |
| Kredensial | Sertifikat CFP® tegak dari sudut miring (3D), tilt + kilau mengikuti kursor, buka lightbox |
| Keahlian | Judul sticky di kiri, enam kartu kecil di kanan; semua terbaca sekaligus, tanpa pin |
| Testimoni | Carousel bingkai ponsel, geser otomatis (tertahan saat kursor/fokus di kartu, berhenti saat di-swipe; tombol jeda/putar), tombol panah |
| Insight | Carousel postingan 1–9 (geser / tombol panah), langsung bisa dilewati |
| Konsultasi | "Yuk, ngobrol." per huruf, langkah, panel booking |
| Footer | Nama lengkap, lokasi, kontak, navigasi, topik diskusi, logo IFAC, ikon Instagram & Threads |

Carousel adalah scroller native (`src/scripts/rail.ts`), jadi swipe, trackpad, dan keyboard tetap jalan,
dan halaman bisa terus di-scroll melewatinya.

Tombol memakai efek magnetic + label roll, hanya di perangkat dengan mouse.

## Stack

- Astro 7 + TypeScript (statis)
- [GSAP](https://gsap.com) + ScrollTrigger untuk semua animasi scroll
- [Lenis](https://lenis.darkroom.engineering) untuk smooth scroll
- `astro:assets` + sharp untuk gambar responsif WebP
- Fontsource: Archivo Variable (axis lebar) + Geist Variable



## Menjalankan

```bash
cd website-thufeil-cfp/option-2
npm install
npm run dev       # http://localhost:4322
npm run build
npm run preview
npm run check
```

## Konfigurasi (sama seperti versi 1)

Semua link & kontak ada di **`src/config/site.ts`**:

- **Cal.com:** isi `booking.calUrl`, ubah `booking.enabled` menjadi `true`. Panel konsultasi
  langsung menampilkan kalender inline tanpa redesign.
- **WhatsApp:** isi `whatsapp.number` (format `628…`, angka saja), ubah `whatsapp.enabled` menjadi `true`.
- **Domain:** isi `site.siteUrl` untuk canonical & URL absolut OG image.
- **Instagram / Threads / IFAC:** `links.*`. Lokasi footer: `site.location`.
- **Angka profil (5+, 100+) dan kalimat misi:** `about.stats` dan `about.mission` di `src/data/content.ts`.

Konten (kredensial, keahlian, caption Instagram, alt testimoni) ada di `src/data/content.ts`.

## Aset

Disalin dari `../src/assets/` (yang sebelumnya disiapkan dari `~/Downloads/Project Website Thufeil/`).
Project ini tidak bergantung pada folder induk maupun Downloads.

| Aset | Lokasi |
| --- | --- |
| Foto profil | `src/assets/profile/thufeil-portrait.png` |
| Sertifikat CFP® | `src/assets/credentials/sertifikat-cfp.jpg` |
| Logo IFAC | `src/assets/brand/ifac-logo.png` (dipangkas dari `~/Downloads/ifacid_logo.jpeg`) |
| Postingan Instagram 1–9 | `src/assets/instagram/post-01.jpg` … `post-09.jpg` |
| Testimoni | `src/assets/testimonials/testimoni-01.webp` … `-12.webp` |
| Social preview | `public/og-image.jpg` (dibuat ulang dengan `node scripts/make-og.mjs`) |

## Aksesibilitas

- `prefers-reduced-motion`: tanpa preloader, tanpa smooth scroll, tanpa animasi. Semua konten tampil
  statis, dan carousel testimoni tidak berputar otomatis.
- Tanpa JS: konten tetap tampil; jika bundle motion gagal dimuat, timer pengaman di `<head>` membuka semuanya.
- Teks yang dipecah per kata tetap terbaca utuh oleh screen reader. Nama raksasa di hero memakai
  `aria-hidden` dengan teks alternatif.
- Lightbox: `<dialog>` native, ESC, panah kiri/kanan, swipe, fokus kembali ke pemicu.
