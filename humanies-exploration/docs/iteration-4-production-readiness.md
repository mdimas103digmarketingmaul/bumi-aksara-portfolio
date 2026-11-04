# Iteration 4 — kesiapan Cloudflare dan preview client

## Status dan cara review

Implementasi siap direview secara lokal; **belum di-commit, push, atau deploy**. Situs publik belum berubah. Preview yang merepresentasikan Cloudflare:

**http://127.0.0.1:8788/humanies-exploration/**

```sh
npm install
npm run prepare:pages
npm run preview:pages
```

`prepare:pages` membangun `deploy/` lalu menyiapkan `.pages-preview/` dari file portfolio yang tracked, hasil Humanies terbaru, dan konfigurasi Functions root yang sebenarnya. Tidak mengubah project lain. `preview:pages` memakai Wrangler 4.152.0 dan workerd lokal; bukan Vite proxy. Tutup preview dengan Ctrl+C sebelum menjalankan prepare lagi.

Untuk editing cepat, `npm run dev` masih tersedia. Vite memakai handler proxy yang sama, tetapi bukti Cloudflare tetap berasal dari tes Wrangler.

## 1. Arsitektur deployment yang ditemukan

Inspeksi dilakukan pada repository dan konfigurasi Pages read-only tanggal 4 November 2026:

| Setting | Existing |
| --- | --- |
| Pages project | `bumi-aksara-portfolio` |
| Git integration | Aktif |
| Build command | Kosong |
| Root directory | Kosong = root repository |
| Output directory | `.` |
| Compatibility date dari export | `2026-09-26` |
| Root package/build pipeline | Tidak ada package.json root |
| Pages Functions sebelumnya | Tidak ditemukan |

Pengaturan dikonfirmasi dari `wrangler pages download config` dan field build_config pada respons API yang dicatat Wrangler. Tidak mengubah setting dashboard. File hasil inspeksi disimpan sementara, tidak disalin sebagai konfigurasi deployment baru.

Root `_redirects` tetap sama:

- `/humanies-exploration` → redirect trailing slash.
- `/humanies-exploration/*` → rewrite `humanies-exploration/deploy/:splat`.
- Route Option 02 tetap memakai rewrite existing.

Vite base produksi tetap `/humanies-exploration/`. Karena Pages tidak menjalankan build, hasil `deploy/` harus ikut masuk review/commit berikutnya. Menambahkan Function hanya di folder subproject tidak cukup untuk susunan ini.

Dua tambahan kecil pada root:

1. `functions/humanies-exploration/api/weather/[[path]].js` — entry point Pages yang mengimpor handler dalam subproject.
2. `_routes.json` — Functions hanya dijalankan pada `/humanies-exploration/api/weather` dan turunannya. Static routes project lain tidak ikut dieksekusi Function.

Referensi Cloudflare: [routing Functions](https://developers.cloudflare.com/pages/functions/routing/), [redirects dan Functions](https://developers.cloudflare.com/pages/configuration/redirects/), [tes lokal Pages](https://developers.cloudflare.com/pages/functions/local-development/).

## 2. Proxy cuaca dan endpoint

Frontend selalu menggunakan same-origin:

- `GET /humanies-exploration/api/weather` — RSS BMKG.
- `GET /humanies-exploration/api/weather/{nama_file}_alert.xml` — CAP yang tercantum pada RSS saat ini.

Handler: `server/weather-proxy.mjs`. Endpoint upstream tetap `https://www.bmkg.go.id/alerts/nowcast/id` dan detail CAP pada path yang sama. Tidak ada URL upstream dari query/body pengguna, credential frontend, API key, atau third-party bypass.

Pemeriksaan server:

- GET saja; query parameter ditolak; Origin lintas situs ditolak.
- Nama file/path di-allowlist, lalu URL CAP harus ada dalam RSS resmi yang valid untuk cache window.
- Redirect upstream tidak diikuti, sehingga request tidak dapat berpindah host.
- Timeout 12 detik per fetch, termasuk membaca body; batas 2 MB dengan pemeriksaan stream, bukan hanya Content-Length.
- Hanya XML RSS/CAP yang diharapkan; HTML, DTD/entity, body terlalu besar, dan status upstream gagal ditolak.
- Pesan error JSON generik, tidak membocorkan detail internal; tidak ada stale response server yang diklaim berhasil.

Frontend tetap menjalankan validasi XML/CAP, status Actual/Public, references Update/Cancel, koordinat, polygon, dan effective/expires. CAP tanpa polygon valid hanya ada pada daftar. API tidak membuat campaign.

## 3. Cache dan akses BMKG

- Cache API Cloudflare: RSS 60 detik, CAP 300 detik.
- Cache memori isolate dengan TTL sama dan coalescing request bersamaan untuk key yang sama.
- Error upstream ditahan 20 detik dalam memori agar kegagalan tidak memicu retry agresif.
- Maksimal 45 outbound request per 60 detik per isolate; kelebihan mengembalikan 503 + Retry-After.
- Frontend tetap refresh setiap 10 menit pada tab aktif, tanpa overlap, CAP berurutan dengan jeda 1,2 detik.
- Respons frontend `Cache-Control: no-store`; cache bersama dilakukan secara eksplisit di server.
- Header `X-BMKG-Fetched-At` mempertahankan waktu fetch upstream asli saat cache HIT. Header `X-Humanies-Cache` membantu verifikasi HIT/MISS.
- Snapshot frontend menggunakan timestamp paling lama dalam batch RSS/CAP, bukan waktu penerimaan cache sebagai waktu data baru. Cache localStorage maksimal 30 menit tetap dilabeli stale jika belum diperbarui. Expiry warning berjalan setiap detik walau fetch gagal.

Cache Cloudflare bersifat per lokasi dan rate budget per isolate, **bukan global distributed limiter**. Ini mengurangi request untuk traffic prototype/client preview. Traffic besar memerlukan pemantauan dan rate limiting bersama yang ditinjau terpisah. Batas layanan yang dipublikasikan BMKG adalah 60 request/menit/IP: [dokumentasi BMKG](https://data.bmkg.go.id/peringatan-dini-cuaca/).

## 4. Perubahan UX map dan sidebar

- Awal halaman dan Reset View memakai framing Indonesia dengan ruang bagi sidebar.
- Filter/search tidak memindahkan kamera; lokasi dipilih dari daftar/marker untuk mendekat.
- Pilihan kejadian memakai zoom moderat; weather menyesuaikan polygon dengan batas zoom 5,8.
- Background refresh tidak memicu fly-to/fitBounds, termasuk saat drawer sedang terbuka.
- Reset View menutup pilihan/drawer dan kembali ke framing Indonesia.
- Marker direkonsiliasi berdasarkan ID; refresh tidak membongkar DOM marker yang masih ada. Humanies berada di atas marker sumber otomatis.
- Polygon diperbarui hanya saat geometri/visibility berubah dan berada di bawah label peta.
- Filter sumber memakai grid 2 kolom. Search/filter tetap di luar area daftar yang scroll independen.
- Daftar sumber tidak lagi mempunyai scroll bersarang. Mobile membatasi tinggi daftar, mempertahankan akses map dan halaman.
- Target kontrol/tombol mobile minimal 44px. Zoom +/− dan Reset tersedia pada mobile; scroll biasa tetap untuk halaman, Cmd/Ctrl + scroll untuk zoom.

## 5. Kejelasan sumber dan timestamp

- `BMKG · Official Source`: sumber otomatis dengan waktu kejadian/penerbitan, valid-until bila tersedia, dan waktu fetch upstream terpisah.
- Humanies Managed Data: data manual. Hero dan detail menyebut **Last manual update**, tidak menyiratkan seluruh feed baru diambil pada waktu tersebut.
- Demo / Simulation: semua skenario fiktif tetap dilabeli, dan respons simulasi existing tetap dibedakan dari laporan kejadian bersumber.
- Data cache lama tidak diberi label live tanpa konteks. Error BMKG tidak menghilangkan data Humanies atau campaign.

## 6. Campaign manual dan demo

Tetap edit `src/data/disasters.ts` dan `src/data/campaigns.ts` lewat VS Code. Kedua file tidak diubah pada iterasi ini.

- `incidentStatus`: alert / active-response / recovery / resolved.
- `fundraisingStatus`: none / open / closed, terpisah dari status kejadian.
- Campaign nyata open menggunakan actionUrl/actionLabel/platform yang valid untuk Mayar, Kitabisa, atau sumber resmi lain.
- Closed tidak menampilkan tombol donasi. Resolved tetap tersedia melalui Archived.
- reportUrl hanya diisi bila ada laporan nyata; tidak dibuat URL laporan palsu.
- Explore Demo tetap menunjukkan empat tahap respons, timeline dan transparansi. CTA simulasi tidak mengarah ke pembayaran nyata.

Contoh field timeline, dokumentasi dan accountability ada di `docs/iteration-3-showcase.md`. Informasi mengenai akses cuaca/deployment pada Iteration 3 digantikan oleh dokumen ini.

## 7. Build dan ukuran bundle

Ukuran hasil build, decimal KB, sebelum/sesudah iteration ini:

| Bagian | Sebelum | Sesudah |
| --- | ---: | ---: |
| JavaScript awal | 1.440,89 KB (gzip 410,36 KB) | 301,35 KB (gzip 93,53 KB) |
| JavaScript map lazy | Termasuk bundle awal | 1.142,97 KB (gzip 317,70 KB) |
| Worker MapLibre | 519,37 KB | 519,37 KB |
| CSS awal | 114,55 KB | 39,26 KB |

JavaScript awal turun sekitar 79%, gzip sekitar 77%. Total JavaScript bukan turun drastis: sekitar 1.444,32 KB setelah splitting, sedikit overhead pemisahan. Map dimuat ketika mendekati viewport (300px), sehingga halaman dapat tampil lebih dahulu. Tidak menambah dependency frontend besar. Kegagalan chunk map mempunyai fallback agar daftar tetap dapat dibaca.

## 8. Testing yang dapat dijalankan

```sh
npm test
npm run build
npm run prepare:pages
npm run preview:pages
# Di terminal lain:
node tests/pages-http.test.mjs
node tests/browser.cjs
node tests/iteration3.cjs
node tests/weather-reliability.cjs
node tests/map-ux.cjs
```

Tes browser memerlukan Playwright dan Chromium; script mendukung `PLAYWRIGHT_PATH` dan `BROWSER_PATH` jika instalasi berbeda. `PREVIEW_URL` dapat mengganti URL default Wrangler 8788. Test HTTP memakai `PAGES_ORIGIN` opsional.

Cakupan:

- Unit: validasi/dedup gempa, WIB, cache, CTA open/closed; proxy allowlist, membership RSS, method/query/origin, timeout, ukuran respons, redirect/HTML, cache/single-flight, budget request.
- HTTP pada workerd: RSS/CAP nyata, cache HIT dan timestamp yang tidak berubah, error 400/404/405, subpath redirect, JS/CSS/logo/gambar.
- Konten HTML halaman `/`, RJS Cottage, Hanasari Website, dan Option 02 dibandingkan byte-for-byte dengan file existing.
- Browser: kedua sumber BMKG, polygon, arsip, demo, timeline, search, drawer, expiry, stale cache/offline, empty state.
- Kamera/UX: framing/reset, filter/background refresh tidak menggeser kamera, DOM marker tetap, scroll sidebar independen, desktop/tablet/mobile dan drawer.
- Standard TypeScript/Vite build tanpa warning. Tidak ada lint script di project, sehingga tidak diklaim ada ESLint check.

Warning tooling yang tidak memblokir: Wrangler menginformasikan urutan redirect Option 02 dapat lebih efisien (existing, tidak diubah); tersedia versi Wrangler lebih baru; tes parser Node memakai API `stripTypeScriptTypes` yang berstatus experimental. Warning tersebut bukan error aplikasi. CORS direct weather tetap terjadi bila sengaja diuji terhadap BMKG; aplikasi sekarang melewati endpoint same-origin.

## 9. Sebelum commit/push atau launch client

1. Review preview lokal, label DEMO, sumber, dan link campaign bersama pemilik konten.
2. Pastikan `deploy/`, handler server, root Function, `_routes.json`, frontend dan docs masuk sebagai satu perubahan saat nanti disetujui. Jangan hanya commit source frontend.
3. Tetap gunakan build command kosong, root repository, output `.` yang existing. Tidak diperlukan secret/binding baru.
4. Setelah izin deployment diberikan pada tahap terpisah, lakukan smoke test URL publik dan endpoint API beserta status cache. Tes lokal tidak membuktikan deployment yang belum dilakukan.
5. QA Cmd+scroll dan touch pada perangkat fisik; tes otomatis yang sudah dilakukan menggunakan Chromium desktop/mobile emulation dan Ctrl+scroll.

## 10. Batasan produksi

Tidak ada database/CMS/payment API/notifikasi. Bukan sistem emergency alert. Feed terbaru tidak mencakup seluruh riwayat; API dan tile provider eksternal dapat gagal. Cache belum terkoordinasi global dan belum ada observability/SLA. Rate limits/kuota Pages Functions pada akun perlu dipantau setelah release. Validasi polygon masih pemeriksaan numerik/ring dasar, bukan perbaikan topologi penuh. Urutan Update/Cancel yang tidak pernah tertangkap saat offline tidak dapat direkonstruksi.

Semua fitur tetap tersedia untuk review lokal. Status publik baru dapat diverifikasi setelah deployment yang secara eksplisit disetujui; belum dilakukan pada iterasi ini.

## Hasil akhir verifikasi 4 November 2026

- 9 tes unit lulus.
- `npm run build`, build deploy, kompilasi Pages Function, dan `git diff --check` lulus.
- Tes HTTP Pages, regresi browser existing, Iteration 3, weather reliability, serta map UX semuanya lulus.
- Pada snapshot uji browser: 18 gempa dan 7 warning cuaca aktif; jumlah berubah mengikuti feed BMKG.
- Kamera terbukti tetap saat refresh 10 menit yang dijalankan dengan clock tes; elemen marker tetap sama dan tidak duplikat.
- Tidak ada JavaScript page error pada pengujian browser. Build tanpa warning; catatan warning tooling ada di bagian testing.
- Data manual, root `_redirects`, dan file project lain tidak berubah. Tambahan root dibatasi pada Function dan `_routes.json` yang disebutkan di atas.
