# Iteration 5 — PetaBencana dan kejelasan multi-sumber

Status: selesai untuk review lokal, **belum commit, push, atau deploy**. Preview Cloudflare lokal: **http://127.0.0.1:8788/humanies-exploration/**. Situs publik belum diperbarui.

## 1. API dan hasil verifikasi aktual

Diuji 4 November 2026 sekitar 08.13–08.25 WIB:

- Upstream tetap: `https://api.petabencana.id/reports?geoformat=geojson&timeperiod=604800`.
- Curl dengan User-Agent Humanies dan Origin localhost: HTTP 200, `application/json`, `Access-Control-Allow-Origin: *`.
- Fetch Chromium dari halaman localhost: HTTP 200, GeoJSON dapat dibaca; direct frontend **tidak terhalang CORS**.
- Respons: `{ statusCode: 200, result: { type: "FeatureCollection", features: [...] } }`. Tidak perlu konversi TopoJSON.
- Snapshot: **54 record**, termasuk **14 `is_training: true`**. UI live menampilkan **40 laporan nonlatihan** yang valid dan berada dalam 7 hari terakhir. Angka berubah mengikuti feed.
- Semua geometri pada snapshot adalah Point. Status sumber yang terlihat: `confirmed`; ini disimpan sebagai nilai sumber, bukan klaim verifikasi independen Humanies.
- `geoformat=invalid` menghasilkan HTTP 400, `{"statusCode":400,"error":"Error while formatting"}`.
- `timeperiod=604801` ternyata diterima HTTP 200. Dokumentasi menyebut batas 604800, sehingga proxy selalu memakai 604800 dan frontend memfilter waktu lagi. Jangan mengandalkan validasi upstream saja.
- Tidak ditemukan kuota numerik atau header rate-limit pada respons/dokumentasi route yang diperiksa. Tidak dilakukan load test. Tetap tangani HTTP 429 dan hindari polling agresif.

Jenis laporan nonlatihan pada snapshot:

| Nilai API | Label UI | Jumlah |
| --- | --- | ---: |
| fire | Kebakaran | 18 |
| flood | Banjir | 12 |
| wind | Angin kencang | 5 |
| haze | Kabut asap | 3 |
| earthquake | Gempa bumi | 1 |
| volcano | Gunung api | 1 |

Referensi: [Crowdsourced Reports](https://docs.petabencana.id/master-1/routes/crowdsourced-reports).

## 2. Field dan normalization

`src/types/petabencana.ts` mendefinisikan `PetaBencanaReport`, terpisah dari gempa/cuaca BMKG dan data respons Humanies.

| API | Model/UI |
| --- | --- |
| properties.pkey | reportId; id unik `petabencana:{pkey}` |
| properties.created_at | reportedAt; ISO dengan timezone, ditampilkan WIB |
| geometry.coordinates | longitude lalu latitude, sesuai GeoJSON/MapLibre |
| properties.disaster_type | disasterType; label Indonesia berdasarkan nilai API yang ditemukan |
| properties.title | title; bila kosong, label generik “Laporan {jenis}” |
| properties.text | description, optional |
| properties.status | verificationStatus, nilai asli tanpa konversi menjadi verified |
| properties.tags.city | city, optional |
| properties.tags.instance_region_code | regionCode, optional; bukan hasil reverse geocoding |
| properties.is_training | hanya `false` yang boleh masuk data live |

Field lain yang ditemukan: source, url, image_url, report_data, tags.region_code, tags.local_area_id/district_id, partner_code/icon. Field tersebut tidak diperlukan untuk fase ini. **Tidak mengunduh atau merender foto.** `url` yang ditemukan adalah UUID, bukan URL laporan lengkap; CTA membuka portal resmi dengan label “Buka Portal PetaBencana”. Tidak membuat URL detail berdasarkan dugaan.

Validasi dilakukan di `src/services/petabencana.ts`:

- Periksa envelope FeatureCollection; payload malformed menjadi error, bukan empty sukses.
- Terima Feature Point dengan longitude/latitude numerik finite dan rentang dunia yang valid; abaikan geometri lain tanpa menebak titik.
- Timestamp harus ISO dengan timezone dan tanggal kalender valid. Laporan masa depan/lebih tua dari periode dibuang.
- Dedup berdasarkan pkey, pilih record bertanggal terbaru bila ID berulang; tidak digabung lintas BMKG/Humanies.
- `is_training: true` dikeluarkan; flag hilang/ambigu juga tidak dianggap live.
- Invalid record dilewati; batch seluruhnya invalid menjadi error agar cache sebelumnya tetap bisa dipakai. Batch kosong atau seluruhnya training sah sebagai kosong.
- Text di-render sebagai React text, tanpa innerHTML; URL upstream dan HTML tidak dieksekusi.
- Jenis baru yang belum dikenal tetap memakai nilai mentah dan ikon lokasi generik; tidak mengarang kategori baru.

## 3. Arsitektur proxy dan Cloudflare

Walaupun CORS terbuka, proxy dipilih untuk mengirim **User-Agent aplikasi yang konsisten** dan memakai cache bersama. Browser tidak dapat diandalkan untuk mengatur User-Agent aplikasi sendiri lintas implementasi browser.

Frontend: `GET /humanies-exploration/api/petabencana`.

Handler: `server/petabencana-proxy.mjs`. Wrapper root: `functions/humanies-exploration/api/petabencana.js`. Root `_routes.json` ditambah hanya endpoint ini; routes weather existing tetap sama. Build command/output/dashbord Cloudflare dan `_redirects` tidak diubah. Arsitektur portfolio tetap output root `.` dengan hasil frontend pada `humanies-exploration/deploy/`.

- Endpoint GET tetap, semua query ditolak; tidak menerima URL, path upstream, token atau parameter arbitrary.
- Host upstream hanya api.petabencana.id dan route /reports dengan parameter tetap. Redirect upstream tidak diikuti.
- User-Agent: `HumaniesDisasterWatch/0.1 (+https://bumi-aksara-portfolio.pages.dev/humanies-exploration/; prototype)`.
- Tolak Origin lintas situs, method selain GET, body non-JSON, envelope salah, respons lebih dari 2 MB (termasuk tanpa Content-Length).
- Timeout 12 detik, mencakup streaming body. HTTP 429 dipetakan 503 dengan Retry-After 60; kegagalan lain 502/504. Error tidak disamarkan sebagai sukses kosong.
- Pembaca body berbatas `server/http-body.mjs` dipakai bersama weather proxy. Tes regresi weather lulus setelah ekstraksi kecil ini.
- Vite dev memakai handler yang sama melalui plugin existing, tetapi verifikasi produksi lokal dilakukan menggunakan Wrangler workerd/Pages Functions.
- Tidak ada database, credentials, API key, payment API atau backend tambahan.

## 4. Refresh, cache, dan freshness

Konfigurasi sederhana: `PETABENCANA_CONFIG` dalam `src/services/petabencana.ts`.

- Fetch frontend maksimal sekali setiap **10 menit**; tidak overlap, tidak fetch saat tab hidden, evaluasi lagi saat tab aktif. Timer/listener/request dibersihkan saat unmount.
- Pemeriksaan lokal umur report/cache setiap 30 detik pada tab aktif; pemeriksaan ini tidak menambah fetch sebelum interval 10 menit.
- Proxy cache sukses **5 menit**, pada memori isolate dan Cloudflare Cache API. Request serentak untuk satu key digabung. Error ditahan 60 detik di memori untuk meredam retry.
- Proxy mengembalikan `X-PetaBencana-Fetched-At` asli, tetap sama pada HIT, serta `X-Humanies-Cache` HIT/MISS. Browser response no-store; caching server dikelola eksplisit.
- Cache browser localStorage maksimal **30 menit**, dengan validasi ulang saat dibaca. Storage diblokir/penuh tidak membuat sumber gagal tampil.
- Setelah fetch gagal, data tersimpan yang masih relevan boleh ditampilkan dengan label “Data tersimpan, belum diperbarui.” Tidak memalsukan waktu fetch sukses.
- Snapshot cache lebih tua dari 30 menit tidak dirender. Laporan tidak ditampilkan di luar periode maksimum 7 hari; perubahan melewati batas waktu dibersihkan pada tick lokal berikutnya (maksimal sekitar 30 detik pada tab aktif).
- Waktu **Dilaporkan** berbeda dari **Terakhir berhasil diambil**. Laporan kejadian bukan warning aktif atau lifecycle respons Humanies.

`days` dapat dikurangi; normalizer membatasi rentang 1–7 hari. Query upstream tetap 7 hari sehingga satu cache key dapat melayani pengaturan frontend tersebut.

Cache Cloudflare per lokasi dan memori per isolate, bukan rate limiter global. Untuk traffic besar, perlu konfirmasi kuota PetaBencana, monitoring, dan strategi pembatasan bersama. Proxy saat ini cocok untuk prototype dengan traffic terbatas.

## 5. Sumber, status, dan lisensi

Label UI:

- BMKG · Official Source — gempa dan potensi cuaca.
- PetaBencana · Community / Platform Reports — laporan komunitas/platform.
- Humanies Managed Data — respons dan campaign manual.
- DEMO / SIMULATION — konten contoh, tidak diklaim laporan sumber.

`confirmed` ditampilkan persis sebagai **Status sumber: confirmed**, tanpa badge “verified by Humanies”. Status lain juga ditampilkan apa adanya. Jika tidak tersedia, drawer menyebut **Status verifikasi tidak tersedia**.

**Temuan lisensi penting:** halaman GitHub lama menyebut CC BY 4.0, tetapi [perjanjian resmi saat ini](https://docs.petabencana.id/perjanjian-lisensi-pengguna) membedakan CC BY-NC 4.0 untuk nonkomersial dan lisensi komersial yang harus diperoleh melalui Yayasan Peta Bencana. Jangan menganggap atribusi saja mengizinkan semua penggunaan komersial.

UI mencantumkan sumber, link portal, CC BY-NC 4.0 untuk nonkomersial, link ketentuan komersial, serta penjelasan format/label kategori disesuaikan. Normalisasi tidak mengubah klaim deskripsi atau status sumber. Konfirmasikan lingkup izin sebelum presentasi/penggunaan komersial dan sebelum launch publik; dokumen ini tidak menyatakan bahwa izin komersial telah diperoleh.

Referensi tambahan: [atribusi nonkomersial resmi](https://docs.petabencana.id/informasi-lisensi-data/penggunaan-non-komersial-cc-by-nc-4.0), [catatan lisensi lama](https://github.com/petabencana/petabencana-meta/blob/master/petabencana.id/LICENSING.md).

## 6. Cara menggunakan layer dan showcase

- Pilih **PetaBencana** untuk laporan saja, **All** untuk gabungan, atau sumber lain untuk menyembunyikan laporan PetaBencana.
- Untuk mematikan integrasi sepenuhnya (termasuk fetching), ubah `PETABENCANA_CONFIG.enabled` menjadi false dan build ulang.
- Search bekerja pada judul, jenis (Indonesia/mentah), kota dan kode wilayah yang tersedia. Tidak menebak provinsi/kota dari koordinat.
- Sidebar menampilkan 20 laporan pertama dan tombol untuk 20 berikutnya. Semua laporan valid tetap mempunyai marker; filter/search bekerja pada seluruh laporan, bukan hanya halaman yang sudah dibuka.
- Marker kecil berwarna slate dengan ikon kategori, di bawah Humanies responses pada stacking map. Seleksi menyorot marker, membuka drawer, dan fly-to dengan zoom moderat. Filter/background refresh mempertahankan kamera; Reset View kembali ke Indonesia.
- Tidak menambah clustering untuk snapshot 40 laporan. Pertimbangkan clustering MapLibre jika jumlah meningkat besar; sidebar pagination tidak mengurangi jumlah marker.
- Klik **Explore Demo**, kemudian **PetaBencana**. Dua fixture simulasi terpisah menggantikan laporan live pada layer ini; marker, row, dan drawer diberi label DEMO. Waktu fixture disebut “Waktu contoh”, tidak diberi waktu fetch live.
- Fixture ada di `src/data/petabencana-demo.ts`; bukan salinan laporan nyata, tidak disimpan dalam cache, tidak mengarang foto/link laporan. Kembali ke data sumber mengembalikan live reports. BMKG tetap data sumber selama mode demo existing.

## 7. Humanies dan campaign tetap independen

`src/data/disasters.ts` dan `src/data/campaigns.ts` tidak diubah. Status incident, fundraising, Mayar/Kitabisa, timeline, recovery, resolved dan response report tetap diedit manual melalui VS Code.

Tidak ada pemetaan otomatis laporan PetaBencana menjadi campaign atau respons Humanies. Drawer PetaBencana tidak mempunyai donation CTA, impact claims atau progress fundraising. Campaign closed tetap tersimpan dan tidak menawarkan donasi.

## 8. Pengujian dan cara menjalankan

```sh
npm test
npm run build
npm run prepare:pages
npm run preview:pages
# Terminal terpisah:
node tests/pages-http.test.mjs
node tests/petabencana-browser.cjs
node tests/browser.cjs
node tests/iteration3.cjs
node tests/weather-reliability.cjs
node tests/map-ux.cjs
```

Tutup server Pages sebelum prepare ulang. Test browser memakai Playwright/Chromium lokal dan mendukung `PLAYWRIGHT_PATH`, `BROWSER_PATH`, `PREVIEW_URL`; test HTTP memakai `PAGES_ORIGIN`. Tidak ada perintah deployment dalam langkah di atas.

Hasil:

- **16 unit tests lulus**: normalization, dedup, lon/lat, tanggal/WIB, training, geometri invalid, cache/expiry, error, raw status, proxy allowlist, User-Agent, ukuran/timeout, single-flight/cache, dan regresi weather/gempa/CTA.
- TypeScript dan Vite production build lulus, tanpa warning build. JavaScript awal 312,66 KB (gzip 96,52 KB), naik sekitar 11,31 KB raw dari Iteration 4. Map tetap lazy loaded, tanpa dependency baru.
- Pages Functions benar-benar dikompilasi workerd. HTTP live PetaBencana dan BMKG RSS/CAP/cache lulus. Route/assets subpath serta konten portfolio/RJS/Hanasari/Option 02 tetap cocok dengan file existing.
- Browser PetaBencana lulus: 40 marker nonlatihan, klik marker/row, drawer tanpa donasi/foto, source link portal, search, source filters, pagination, reset, demo terpisah, desktop/mobile, HTML dirender sebagai teks, status hilang, stale/offline/empty/cache expiry, dan frekuensi refresh.
- BMKG earthquake regression lulus (19 kejadian pada snapshot); weather live lulus (8 warning aktif pada snapshot), termasuk XML/CAP parsing, polygon/expiry, lifecycle, archive, timeline, dan campaign.
- Map UX dan weather reliability lulus: kamera stabil saat background refresh, marker tidak duplikat, sidebar scroll independen, Ctrl+scroll, responsive/drawer, weather stale/offline dan expired selection ditutup.
- Selector test gempa diperjelas menjadi aria-label sumber setelah list PetaBencana memakai komponen CSS shared; tidak lagi mengasumsikan semua list non-weather adalah gempa.
- Tidak ditemukan JavaScript page error. Tidak ada script ESLint existing; tidak mengklaim lint tambahan.

Warning tooling existing: update Wrangler tersedia, saran urutan redirect Option 02 (tidak diubah), dan API Node stripTypeScriptTypes experimental untuk tes XML. Bukan warning production build.

## 9. Sebelum production

1. Review sumber/label/demo, lalu konfirmasikan lingkup lisensi penggunaan PetaBencana sesuai tujuan sebenarnya.
2. Saat perubahan kelak disetujui, sertakan deploy assets, kedua server handler beserta utility bersama, entry Functions root, dan `_routes.json`. Output root existing tidak membangun source otomatis.
3. Setelah deployment terpisah yang diotorisasi, smoke test domain publik, endpoint PetaBencana dan weather, cache/timestamp serta Pages quotas. **Local Wrangler bukan bukti bahwa situs publik sudah berubah.**
4. Untuk traffic lebih tinggi, konfirmasi kuota upstream dan tambah observability/rate limiting bila dibutuhkan. Belum ada SLA, riwayat lengkap, notifikasi, atau dedup lintas sumber.
5. Lanjutkan QA Cmd+scroll/touch pada perangkat fisik. Pengujian di sini memakai Chromium dan viewport mobile/tablet emulation.

Ini tetap prototype informasi dan respons kemanusiaan, bukan sistem emergency monitoring production.
