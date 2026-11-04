# Humanies Disaster Watch — client preview

React + TypeScript + Vite + MapLibre, dengan informasi gempa/cuaca BMKG, respons Humanies manual, campaign external links, arsip, dan showcase DEMO yang berlabel.

## Review di Cloudflare Pages lokal

```sh
npm install
npm run prepare:pages
npm run preview:pages
```

Buka http://127.0.0.1:8788/humanies-exploration/. Ini menjalankan static portfolio dan Pages Functions di workerd lokal; tidak melakukan deploy. Tutup preview sebelum prepare ulang.

Editing cepat: `npm run dev`. Build standar: `npm run build`. Tes unit: `npm test`.

## Deployment existing

Pages project `bumi-aksara-portfolio` menggunakan Git, build command kosong, root repository, output `.`. Hasil frontend ada di `humanies-exploration/deploy/` (`npm run build:deploy`), disajikan lewat `_redirects` root.

API same-origin `/humanies-exploration/api/weather` (beserta CAP) dan `/humanies-exploration/api/petabencana` memakai root Pages Functions, dengan implementasi di `server/`. `_routes.json` root membatasi Functions hanya ke endpoint tersebut. Tidak perlu API key atau perubahan setting Cloudflare.

Deployment berjalan otomatis setelah push ke `main` yang disetujui. Sertakan hasil `deploy/`, frontend, server handlers, kedua entry point Functions root, dan `_routes.json` dalam perubahan yang sama.

## Data dan demo

- `src/data/disasters.ts`: kejadian/response manual; status alert, active-response, recovery, resolved.
- `src/data/campaigns.ts`: carousel campaign manual.
- Fundraising none/open/closed terpisah; closed tetap tersedia, tanpa tombol donasi.
- `actionUrl`, `actionLabel`, `platform`: link campaign nyata. `reportUrl`: laporan nyata jika tersedia.
- `src/data/showcase.ts`: skenario fiktif berlabel DEMO; tidak mengubah BMKG atau data manual.

Normal scroll menggulir halaman; Cmd/Ctrl + scroll memperbesar map. Filter mempertahankan kamera; pilih kejadian untuk mendekat dan Reset View untuk kembali ke Indonesia.

Panduan lengkap: [Iteration 4 production readiness](docs/iteration-4-production-readiness.md). Model timeline/accountability: [Iteration 3 showcase](docs/iteration-3-showcase.md). Integrasi gempa: [BMKG integration](docs/bmkg-integration.md).

Iteration 5 menambahkan laporan PetaBencana melalui Pages Function same-origin. Lihat [panduan PetaBencana](docs/iteration-5-petabencana.md) untuk hasil verifikasi API, pengecualian training reports, demo, caching, lisensi, dan pengujian. Jalankan `node tests/petabencana-browser.cjs` setelah preview Pages aktif. Preview publik telah disetujui pemilik project; penggunaan publik/komersial lanjutan tetap memerlukan pemeriksaan izin. Izin komersial PetaBencana belum dinyatakan diperoleh.
