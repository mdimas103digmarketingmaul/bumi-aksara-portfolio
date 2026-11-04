# Iterasi 3 — panduan showcase Humanies

> Pembaruan Iterasi 4: konfigurasi akses cuaca dan preview di dokumen ini merupakan catatan historis. Gunakan `docs/iteration-4-production-readiness.md` untuk endpoint same-origin Pages Functions dan preview Wrangler terbaru. Model data manual/demo di bawah tetap berlaku.

## Menjalankan presentasi lokal

```sh
npm run build:showcase
npm run preview -- --host 127.0.0.1 --port 4181
```

Buka **http://127.0.0.1:4181/humanies-exploration/**. Pilih Weather Warnings untuk melihat warning aktif, Humanies untuk respons manual, Earthquakes untuk gempa. Search menyaring judul, provinsi, kota/lokasi yang tersedia, tanpa geocoding.

Klik **Explore Demo** untuk empat skenario fiktif Monitoring, Active Response, Recovery, Resolved. Gunakan filter Active / Alerts / Recovery / Archived. Klik Kembali ke data sumber untuk mengembalikan dataset manual. Gempa dan cuaca tidak diubah saat mode demo aktif. Tidak perlu login, input data, atau akun.

Mode showcase menggunakan `.env.showcase` untuk mengarahkan cuaca ke relay **lokal Vite**. Relay hanya menerima URL RSS dan nama file CAP pada domain resmi BMKG. Ini bukan Cloudflare Function, bukan third-party CORS bypass, dan tidak membuat infrastruktur. Jangan menganggap build showcase sebagai deploy production siap pakai.

## Hasil akses API cuaca

Dokumentasi: https://data.bmkg.go.id/peringatan-dini-cuaca/

RSS: https://www.bmkg.go.id/alerts/nowcast/id

RSS menyediakan `item/link` ke CAP XML. Contoh yang benar-benar diperiksa pada 4 November 2026: `CJI20261103006_alert.xml` (Jambi). Kedua response HTTP 200 melalui curl, tetapi tidak menyertakan `Access-Control-Allow-Origin`. Chromium dari preview lokal menolak keduanya dengan pesan CORS: **No 'Access-Control-Allow-Origin' header is present**. Jadi cuaca tidak bisa direct fetch browser pada saat pengujian; gempa tetap direct fetch dengan CORS `*`.

`npm run build` adalah build standar (tanpa relay URL). Jika belum ada proxy yang disetujui, cuaca menampilkan error yang jujur dan tautan kanal resmi; gempa dan Humanies tetap berjalan. Jangan memakai `mode: no-cors`: response opaque tidak bisa diparse.

Untuk production, opsi selanjutnya adalah proxy Cloudflare ringan: allowlist persis RSS/CAP, GET saja, limit ukuran/timeout/rate, cache bersama singkat, CORS hanya origin portfolio, error upstream diteruskan dengan jujur. Tetapkan `VITE_BMKG_WEATHER_PROXY` ke path proxy yang sudah direview. Pemasangan proxy production dan perubahan parent/deployment belum dilakukan.

## Pemrosesan RSS/CAP

- `src/services/weather.ts` memisahkan service cuaca dari earthquake dan file manual.
- `DOMParser` bawaan browser, tanpa dependency XML besar. XML rusak, DTD/entity, namespace selain CAP 1.2, URL di luar allowlist, tanggal tanpa timezone atau masa berlaku terbalik ditolak.
- Data memakai `identifier`, `sent`, `status`, `scope`, `msgType`, `references` dan info berbahasa Indonesia: event/headline, effective, expires, description, instruction, urgency, severity, certainty, areaDesc, polygon.
- Hanya Actual/Public Alert atau Update yang dapat tampil. Test/Exercise/Draft tidak muncul. Identifier dideduplikasi; references pada Update/Cancel menyingkirkan pesan yang digantikan. Ini bukan implementasi seluruh fitur CAP 1.2.
- `sent`, `effective`, `expires` dinormalisasi ke ISO UTC dan ditampilkan dalam WIB. Hanya warning dengan waktu terbit dan effective <= sekarang < expires yang tampil. Clock lokal memeriksa expiry setiap detik, termasuk menutup detail yang sudah tidak aktif; tab aktif kembali segera dievaluasi.
- Polygon: pasangan CAP lat,lon menjadi GeoJSON lon,lat; angka/rentang, jumlah vertex, penutupan ring, titik unik dan luas nonzero divalidasi. Ring tidak ditutup/ditambal secara otomatis. Tidak melakukan perbaikan topologi, antimeridian, circle/geocode conversion, atau geocoding lokasi.
- Polygon valid digambar sebagai fill tipis dan garis halus tanpa click handler yang menghalangi marker. Marker memakai titik batas CAP pertama yang valid, bukan titik pusat bencana. Klik warning memuat semua polygon pada kamera. Tanpa polygon valid, warning tetap ada dalam daftar dan drawer tanpa marker/area buatan.
- Teks BMKG ditampilkan sebagai teks React, tidak sebagai HTML. Link sumber menggunakan URL CAP resmi dari RSS; infografik tidak diasumsikan sebagai laporan dampak.

Kode urgency/severity/certainty mengikuti dokumen rujukan yang ditautkan BMKG:
https://github.com/infoBMKG/data-cap/blob/main/urgency%2C%20severity%2C%20and%20certainty%20-%20%28en-id%29.pdf

Urgency membedakan kebutuhan waktu respons (Immediate, Expected, Future, Past, Unknown); severity tingkat ancaman (Extreme, Severe, Moderate, Minor, Unknown); certainty tingkat kepastian (Observed, Likely, Possible, Unlikely, Unknown). UI menampilkan label Indonesia serta kode asli. Nilai Observed tidak diubah menjadi klaim banjir, kerusakan, korban, atau aktivitas Humanies.

## Refresh, cache, dan fallback

Refresh cuaca 10 menit selama tab aktif; timer pengecek 30 detik, tidak membuat request sebelum interval terpenuhi. Satu siklus aktif, timeout 90 detik untuk seluruh batch, abort saat unmount, startup deferred agar StrictMode tidak menggandakan request. Request CAP berurutan dengan jeda 1,2 detik untuk menjaga budget batas BMKG 60 request/menit/IP; maksimum 45 detail per siklus. Banyak tab/pengguna dari satu IP tetap perlu rate limiting bersama untuk production.

Cache raw CAP localStorage maksimal 30 menit; parsing dan expiry tetap dijalankan saat cache dipakai. Snapshot diganti hanya bila semua CAP batch berhasil. Kegagalan sebagian mempertahankan snapshot sebelumnya sebagai stale, sehingga pembatalan baru mungkin belum diketahui; karena itu selalu rujuk sumber resmi. Warning yang melewati expires tetap dibuang walau fetch gagal. Data kosong setelah fetch sukses berbeda dari tidak dapat mengambil data. Cache yang diblokir tidak merusak UI.

## Pengelolaan manual

Tetap edit `src/data/disasters.ts` untuk kejadian dan `src/data/campaigns.ts` untuk carousel campaign. File data existing tidak diubah dalam iterasi ini. Field lama tetap berlaku. Tidak ada konversi otomatis gempa/cuaca menjadi respons atau campaign.

Incident: `alert` (Monitoring) → `active-response` → `recovery` → `resolved`.
Fundraising terpisah: `none` / `open` / `closed`. Perubahan dilakukan manual; UI tidak menyatakan seluruh tahapan sudah dilalui hanya karena status terakhir berubah. Resolved dapat dibuka melalui Archived, closed tidak dihapus. All menampilkan kejadian non-resolved agar arsip tidak menumpuk di peta default.

Campaign nyata yang open: isi `actionUrl`, `actionLabel`, `platform`, opsional `campaignTitle`. Tetap mendukung Mayar, Kitabisa, atau URL HTTPS resmi lain. Jangan mengarang URL. CTA hanya aktif untuk respons active/recovery, fundraising open, URL valid, dan bukan simulasi. Closed tidak mempunyai tombol donasi walau actionUrl tersimpan. View Response membuka journey dalam drawer; `reportUrl` yang sah menghasilkan View Response Report / View Impact Report untuk resolved. Jika belum ada laporan, jangan mengisi URL palsu.

Contoh field tambahan (opsional; sesuaikan dengan catatan nyata):

```ts
timeline: [
  { date: '2026-10-27', title: 'Situasi dipantau', description: 'Contoh pembaruan.', demo: true },
],
documentation: [
  // Hanya isi URL foto yang relevan, berizin, dengan caption dan credit.
],
accountability: {
  demo: true,
  activities: ['Contoh aktivitas'],
  assistance: ['Contoh bantuan tanpa klaim jumlah'],
  note: 'DEMO, bukan laporan kegiatan nyata.',
},
```

Timeline tidak wajib. `documentation` kosong tidak menampilkan foto buatan. `reportUrl` opsional. Jangan mengubah `simulated`/`demoOnly` menjadi false sebelum seluruh isi diverifikasi. Tidak ditambahkan progress donasi atau angka fundraising baru.

## Transparansi data

- **LIVE SOURCE DATA · BMKG**: asal data otomatis, bukan jaminan realtime. Waktu kejadian/penerbitan berbeda dari waktu fetch. Status cache/error ditampilkan terpisah.
- **HUMANIES MANAGED DATA**: data existing yang diedit manual dan memiliki sumber masing-masing; bukan verifikasi ulang seluruh fakta pada iterasi ini.
- **DEMO / SIMULATED RESPONSE**: respons existing yang disimulasikan diberi label; tombol donasi placeholder dinonaktifkan.
- **Explore Demo**: `src/data/showcase.ts` terpisah, seluruh kejadian/aktivitas/timeline/campaign fiktif. Lokasi kota hanya untuk ilustrasi; tidak ada angka korban, bantuan, foto, URL campaign, maupun impact report palsu. Skenario resolved/recovery menunjukkan struktur accountability, bukan klaim kegiatan selesai nyata.

## Testing

```sh
node --test tests/bmkg.test.mjs
npm run build
npm run build:showcase
# Jalankan preview 4181 dan dev 5180 (untuk import parser di browser)
npm run dev -- --mode showcase --host 127.0.0.1 --port 5180
# Playwright/Chromium tersedia via environment lokal:
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/chromium node tests/browser.cjs
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/chromium node tests/iteration3.cjs
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/chromium node tests/weather-reliability.cjs
```

Pengujian live tergantung feed saat itu. Pada pengujian 4 November: 18 gempa dan 5 warning cuaca aktif; polygon Jambi terlihat. Tes parser/expiry dan reliability menggunakan fixture khusus tes, tidak dimasukkan ke data aplikasi. Ukuran desktop 1440px dan mobile 390px, tanpa horizontal overflow. Normal scroll dan Ctrl+scroll diuji lewat browser; Cmd/touch fisik masih perlu QA perangkat. Tidak melakukan transaksi donasi.

## Keterbatasan dan pengembangan berikutnya

Prototype bukan emergency monitoring system. Ketersediaan weather production bergantung proxy yang belum dipasang; preview lokal butuh internet dan server Vite. Tidak ada notifikasi, database, arsip live CAP, CMS, atau sinkronisasi lintas tab. Perlu hardening topologi, lifecycle CAP lintas snapshot, rate limiting bersama, monitoring upstream, QA lintas perangkat dan peninjauan konten/URL manual sebelum production. Tidak ada commit, push, atau perubahan Cloudflare.
