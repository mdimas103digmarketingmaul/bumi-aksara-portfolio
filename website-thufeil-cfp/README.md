# Website Thufeil M. Tyansah, CFP®

Website personal branding untuk **Thufeil M. Tyansah, CFP® — Gen-Z Financial Planner**.
Satu halaman (one-page) yang menjelaskan siapa Thufeil, kredensialnya, cara ia bekerja,
bidang keahlian, testimoni asli, konten edukasi Instagram, dan jalur konsultasi gratis 30 menit.

## Stack

- [Astro](https://astro.build) 7 + TypeScript (output statis, tanpa framework UI)
- CSS biasa: token global di `src/styles/global.css`, sisanya scoped per komponen
- Vanilla JS untuk interaksi (navigasi, carousel testimoni, lightbox)
- `astro:assets` + sharp untuk optimasi gambar (WebP responsif, lazy-load)
- Font self-hosted via Fontsource: Instrument Serif (display) + Plus Jakarta Sans (body)

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
├── public/                    # disajikan apa adanya
│   ├── favicon.svg
│   ├── og-image.jpg           # social preview 1200×630
│   ├── option-2/              # favicon + social preview desain alternatif
│   └── robots.txt
├── scripts/
│   ├── make-option-2-og.mjs   # generator social preview Option 2
│   └── prepare-assets.mjs     # salin + optimasi aset dari folder sumber (sekali jalan)
└── src/
    ├── assets/
    │   ├── brand/             # logo IFAC
    │   ├── profile/           # thufeil-portrait.png
    │   ├── credentials/       # sertifikat-cfp.jpg
    │   ├── instagram/         # post-01.jpg … post-09.jpg (urutan 1–9)
    │   └── testimonials/      # testimoni-01.webp … testimoni-12.webp
    ├── components/            # Nav, Hero, Credentials, About, Expertise,
    │                          # Testimonials, Insight, Consultation, BookingPanel,
    │                          # Footer, Lightbox, Icon
    ├── config/site.ts         # ← SEMUA link & pengaturan kontak/booking
    ├── data/content.ts        # kredensial, keahlian, caption Instagram, alt testimoni
    ├── layouts/Base.astro     # <head>, SEO, Open Graph, JSON-LD
    ├── option-2/              # komponen, layout, data, CSS, dan animasi alternatif
    ├── pages/index.astro      # /
    ├── pages/option-2/index.astro # /option-2/
    └── styles/global.css      # token warna, tipografi, tombol, motion
```

## Konfigurasi

Semua yang perlu diubah ada di **`src/config/site.ts`**.

| Yang diubah | Lokasi |
| --- | --- |
| URL Instagram / handle | `links.instagram`, `links.instagramHandle`, `links.instagramDm` |
| Link profil IFAC | `links.ifacProfile` |
| Domain produksi (canonical, og:url, URL absolut OG image) | `site.siteUrl` |
| Judul & meta description | `site.title`, `site.description` |
| Nomor WhatsApp | `whatsapp.number` |
| Mengaktifkan WhatsApp | `whatsapp.enabled` |
| URL Cal.com | `booking.calUrl` |
| Mengaktifkan Cal.com | `booking.enabled` |

### WhatsApp

1. Isi `whatsapp.number` dengan format internasional, hanya angka, mis. `6281234567890`.
2. Ubah `whatsapp.enabled` menjadi `true`.
3. (Opsional) sesuaikan `whatsapp.message`, pesan pembuka yang terisi otomatis.

Selama nomor belum diisi atau `enabled` masih `false`, tombol WhatsApp tampil dalam keadaan
nonaktif (tidak bisa diklik, tidak ada link palsu) dengan keterangan "Nomor WhatsApp belum tersedia".

### Integrasi Cal.com (nanti)

Saat ini belum ada sistem booking. Panel konsultasi mengarahkan ke kanal yang **sudah berfungsi**:
DM Instagram dan formulir konsultasi di profil IFAC.

Saat Cal.com siap:

1. Thufeil membuat akun Cal.com.
2. Buat event **"Free 30-Minute Financial Consultation"** (durasi 30 menit, lokasi: video call).
3. Salin URL publik event tersebut, mis. `https://cal.com/thufeil/konsultasi-30-menit`.
4. Tempel ke `booking.calUrl` di `src/config/site.ts`.
5. Ubah `booking.enabled` menjadi `true`, lalu `npm run build`.

Yang otomatis berubah tanpa redesign:

- Section **Konsultasi** menampilkan kalender Cal.com secara inline (embed resmi Cal.com),
  plus link cadangan "Buka kalender di tab baru".
- Langkah 1 berubah menjadi "Pilih waktu yang kosong langsung di kalender."
- Semua tombol "Jadwalkan Konsultasi" / "Konsultasi Gratis 30 Menit" tetap menuju `#konsultasi`.
- Script Cal.com hanya dimuat ketika booking aktif. Saat nonaktif, tidak ada JS pihak ketiga.

Jika domain Cal.com berbeda (self-hosted / custom domain), origin embed diambil otomatis dari URL.

## Aset

Sumber asli: `~/Downloads/Project Website Thufeil/` (tidak diubah sama sekali).
Semua aset yang dipakai sudah disalin ke `src/assets/`. Website **tidak bergantung** pada folder Downloads.

| Aset | Lokasi di project | Catatan |
| --- | --- | --- |
| Foto profil | `src/assets/profile/thufeil-portrait.png` | PNG transparan, ditampilkan utuh (wajah tidak pernah terpotong) |
| Sertifikat CFP® | `src/assets/credentials/sertifikat-cfp.jpg` | Disajikan tanpa kompresi ulang agar teks tetap terbaca |
| Postingan Instagram | `src/assets/instagram/post-01.jpg` … `post-09.jpg` | Urutan mengikuti file 1–9; maks. lebar 1080px |
| Testimoni | `src/assets/testimonials/testimoni-01.webp` … `-12.webp` | Screenshot Story asli, dikonversi dari PNG ke WebP kualitas tinggi |

Untuk mengulang persiapan aset (mis. ada testimoni baru):

```bash
npm run assets                          # dari ~/Downloads/Project Website Thufeil
npm run assets -- "/path/folder/lain"   # dari folder lain
```

Urutan testimoni diatur di `testimonialOrder` dalam `scripts/prepare-assets.mjs`; alt text per
testimoni ada di `src/data/content.ts` (urutannya harus sama).

Caption dan alt text postingan Instagram ada di `instagramPosts` (`src/data/content.ts`).
Karena URL per postingan belum tersedia, setiap postingan mengarah ke profil Instagram.

## Kebijakan konten

Semua fakta bersumber dari profil resmi IFAC (`ifac.or.id/thufeil`), sertifikat CFP®, dan aset
Instagram yang diberikan. Tidak ada angka, testimoni, atau klaim yang dikarang.

Pada desain utama, sengaja **tidak** dipakai:

- **Jumlah klien & tahun pengalaman.** Profil IFAC menyebut "5+ tahun, 100+ klien", sedangkan bio
  Instagram yang terlihat di salah satu screenshot testimoni menyebut "7+ tahun, 50+ klien".
  Karena tidak konsisten, keduanya tidak ditampilkan. Bisa ditambahkan setelah dikonfirmasi Thufeil.
- **Link `s.id/jadwalthufeil`** yang terlihat di bio Instagram lama. Tujuannya belum diverifikasi.
  Jika itu formulir jadwal yang masih aktif, bisa dijadikan kanal di `BookingPanel.astro`.

Footer memuat disclaimer bahwa konten bersifat edukasi umum, bukan nasihat keuangan personal.

## Aksesibilitas & motion — desain utama

- Lightbox memakai `<dialog>` native: ESC menutup, fokus terkunci di dalam dan kembali ke pemicu,
  panah kiri/kanan untuk berpindah, swipe di layar sentuh, tombol "Perbesar" untuk membaca detail.
- Carousel testimoni tidak auto-slide; dikontrol lewat tombol, scroll, atau keyboard.
- Semua animasi dimatikan saat `prefers-reduced-motion: reduce`. Konten tetap tampil tanpa JS.

## Option 2 — route alternatif

Build dari root project ini menghasilkan dua halaman independen:

- `src/pages/index.astro` → `/` (desain utama).
- `src/pages/option-2/index.astro` → `/option-2/` (desain alternatif existing).

Komponen, layout, CSS, data, dan animasi khusus Option 2 berada di `src/option-2/`.
CSS dan JavaScript dimuat hanya melalui layout Option 2. Foto profil, sertifikat,
Instagram, dan testimoni menggunakan `src/assets/` bersama; logo IFAC berada di
`src/assets/brand/`. Favicon dan social preview khusus desain ini berada di
`public/option-2/`. Untuk membuat ulang social preview: `node scripts/make-option-2-og.mjs`.
Konfigurasi kontak dan booking tetap bersumber dari `src/config/site.ts`;
`src/option-2/config/site.ts` menambahkan metadata khusus Option 2.

Dependency tambahan dari implementasi asli: Archivo Variable, Geist Variable,
GSAP, dan Lenis. Tidak memerlukan build terpisah atau redirect Cloudflare.
Tetap gunakan build command `npm run build` dan output directory `dist`.
Deployment memakai root project ini. Folder project mandiri lama `option-2/`
telah dihapus setelah migrasi disetujui; tidak ada install atau build kedua.

Option 2 mempertahankan preloader, GSAP + ScrollTrigger, smooth scroll Lenis,
carousel testimoni dengan autoplay/jeda, serta lightbox sertifikat dan testimoni.
Reduced motion menonaktifkan animasi dan autoplay. Konten khususnya berada di
`src/option-2/data/content.ts`, termasuk angka profil 5+ tahun / 100+ klien dan misi 2035.
