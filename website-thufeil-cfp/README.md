# Website Personal Branding Financial Planner

Website one-page untuk perencana keuangan syariah, gaya **Bold Editorial + Kinetic Typography**.
Build menghasilkan dua halaman:

- `/` (halaman utama): desain Option 2 dengan **persona placeholder "Haikal R. Pradana, CFP®"**,
  untuk penawaran ke klien. Nama, foto, kontak, angka, sertifikat, testimoni, dan konten insight
  adalah contoh, bukan data asli.
- `/option-2/`: desain Option 2 asli dengan data Thufeil M. Tyansah. Tidak diubah.

## Stack

- [Astro](https://astro.build) 7 + TypeScript (output statis, tanpa framework UI)
- GSAP + ScrollTrigger dan Lenis untuk motion dan smooth scroll
- `astro:assets` + sharp untuk optimasi gambar (WebP responsif, lazy-load)
- Font self-hosted via Fontsource: Archivo Variable (display) + Geist Variable (body)

## Menjalankan

Butuh Node.js ≥ 22.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # hasil di dist/
npm run preview   # pratinjau hasil build
npm run check     # typecheck Astro + TypeScript
```

`dist/` bisa di-deploy ke hosting statis mana pun (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Struktur

```text
website-thufeil-cfp/
├── public/
│   ├── favicon.svg            # favicon halaman utama
│   ├── og-image.jpg           # social preview halaman utama (1200×630)
│   ├── placeholder/           # certificate.svg (placeholder sertifikat, dibuat dengan kode)
│   ├── option-2/              # favicon + social preview /option-2/
│   └── robots.txt
├── scripts/
│   ├── make-og.mjs            # generator social preview halaman utama
│   ├── make-option-2-og.mjs   # generator social preview /option-2/
│   └── prepare-assets.mjs     # persiapan aset Thufeil (dipakai /option-2/)
└── src/
    ├── assets/
    │   ├── profile/           # haikal-portrait.png (utama), thufeil-portrait.png (/option-2/)
    │   ├── insight/           # foto placeholder konten insight (utama)
    │   ├── brand/             # logo IFAC (dipakai keduanya)
    │   └── credentials/, instagram/, testimonials/   # aset asli Thufeil (/option-2/)
    ├── components/            # komponen halaman utama
    ├── config/
    │   ├── profile.ts         # ← persona, kontak placeholder, booking halaman utama
    │   └── site.ts            # konfigurasi Thufeil, diimpor oleh /option-2/
    ├── data/content.ts        # konten halaman utama
    ├── layouts/Base.astro     # <head>, SEO, Open Graph, JSON-LD halaman utama
    ├── scripts/               # motion.ts, rail.ts, scroll.ts halaman utama
    ├── styles/global.css      # token warna, tipografi, tombol halaman utama
    ├── option-2/              # komponen, data, CSS, dan animasi /option-2/ (tidak diubah)
    ├── pages/index.astro      # /
    └── pages/option-2/index.astro # /option-2/
```

Halaman utama dan `/option-2/` berdiri sendiri: komponen, layout, CSS, dan script masing-masing
terpisah. Yang dipakai bersama hanya logo IFAC dan file-file di `src/assets/` yang tidak diubah.

## Halaman utama: konten placeholder

| Bagian | Isi sekarang | Lokasi |
| --- | --- | --- |
| Nama, peran, lokasi | Haikal Rasyid Pradana · Gen-Z Financial Planner · Bandung | `src/config/profile.ts` → `site` |
| Gelar | S.E., CFP®, AWPs® (dipertahankan) | `src/layouts/Base.astro`, `src/data/content.ts` |
| Foto hero | Dibuat dengan AI (Magnific), PNG transparan | `src/assets/profile/haikal-portrait.png` |
| Angka profil & misi | 15+ tahun, 10.000+ klien, misi 2040 | `src/data/content.ts` → `about` |
| Sertifikat CFP® | Placeholder SVG bertuliskan "Certificate", No. 2500 1384 | `public/placeholder/certificate.svg`, `certificate` |
| IFAC | Teks dan logo tetap, tanpa link | `Credentials.astro`, `Footer.astro` |
| Kontak & sosial media | Instagram, Threads, WhatsApp tampil sebagai teks/tombol nonaktif ("Segera") | `src/config/profile.ts` → `contact` |
| Testimoni | Kartu gaya Instagram Story dibuat dengan HTML/CSS, teks ilustrasi | `src/data/content.ts` → `testimonials` |
| Insight | 4 foto AI + 4 slide carousel dibuat dengan CSS, tidak bisa diklik | `src/data/content.ts` → `insightPosts` |

Semua kanal kontak dirender sebagai elemen nonaktif (`aria-disabled`), tidak ada link palsu.
Komponen `Button` otomatis nonaktif bila `href` tidak diisi.

### Mengganti dengan data klien asli

1. Isi `site` dan `contact` di `src/config/profile.ts`.
2. Ganti foto di `src/assets/profile/` dan import-nya di `Hero.astro` (rasio potret saat ini 0,756;
   sesuaikan angka itu di `.hero__figure` bila rasio foto baru berbeda).
3. Lebar nama raksasa di hero diatur `--giant-ratio` di `Hero.astro` (lebar nama dalam em untuk
   Archivo 62%/820). "HAIKAL" = 2,86 (dengan letter-spacing 0,03em).
4. Beri `href` pada `Button` yang sekarang nonaktif (`BookingPanel.astro`, `Insight.astro`),
   kembalikan link di `Footer.astro`, `Nav.astro`, dan `Credentials.astro`.
5. Ganti testimoni, insight, dan sertifikat dengan aset asli, lalu jalankan `node scripts/make-og.mjs`.

### Integrasi Cal.com

Isi `booking.calUrl` dan ubah `booking.enabled` menjadi `true` di `src/config/profile.ts`.
Section Konsultasi akan menampilkan kalender Cal.com secara inline. Script Cal.com hanya dimuat
saat booking aktif.

## Aksesibilitas & motion

- Preloader hanya muncul sekali per sesi; seluruh animasi dimatikan saat `prefers-reduced-motion: reduce`.
- Konten tetap tampil tanpa JS (timer pengaman menampilkan semuanya bila motion gagal dimuat).
- Lightbox sertifikat memakai `<dialog>` native: ESC menutup, fokus kembali ke pemicu.
- Carousel testimoni punya autoplay dengan tombol jeda; berhenti saat hover, fokus, atau disentuh.

