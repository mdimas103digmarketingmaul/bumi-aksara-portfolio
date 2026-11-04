# Integrasi informasi gempa BMKG

Data manual tetap di `src/data/disasters.ts` dan `src/data/campaigns.ts`. Tidak ada proses yang menulis ulang data, status incident, fundraising, atau link campaign. Resolved tetap mengikuti perilaku existing (tersimpan, tidak ditampilkan di map); closed tidak dihapus. Gempa BMKG tidak mempunyai model campaign/donasi.

## Sumber dan pengujian akses

Dokumentasi resmi: https://data.bmkg.go.id/gempabumi/

- https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json — 15 gempa M 5.0+ terbaru.
- https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json — 15 gempa dirasakan terbaru.

Kedua URL diuji pada 4 November 2026: HTTP 200, JSON `Infogempa.gempa` array, `Access-Control-Allow-Origin: *`, cache server 60 detik. Permintaan frontend menggunakan GET tanpa kredensial/header khusus. Tidak membutuhkan proxy. Batas yang tercantum pada dokumentasi BMKG: 60 request/menit/IP; aplikasi melakukan dua request per siklus 10 menit per tab aktif.

Uji independen:

```sh
curl -i -H 'Origin: http://localhost:4181' https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json
curl -i -H 'Origin: http://localhost:4181' https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json
npm run build
npm run preview -- --host 127.0.0.1 --port 4181
node --test tests/bmkg.test.mjs
# Browser test membutuhkan Playwright dan Chromium tersedia:
PLAYWRIGHT_PATH=/path/to/playwright BROWSER_PATH=/path/to/chromium node tests/browser.cjs
```

Buka http://127.0.0.1:4181/humanies-exploration/ dan lihat Network untuk memverifikasi akses browser, bukan hanya curl.

## Model dan validasi

`src/types/bmkg.ts` memisahkan `BMKGEarthquake` dari `DisasterEvent`; union hanya untuk map/drawer. Field: id, source, sourceType, eventDateTime, latitude, longitude, magnitude, depthKm?, region, tsunamiPotential?, feltInformation?.

Service `src/services/bmkg.ts` membaca `DateTime` ISO berzona waktu, menyimpan UTC, menampilkan lewat `Intl.DateTimeFormat` dengan `Asia/Jakarta` (WIB). `Tanggal`/`Jam` tidak diparse. Coordinates BMKG adalah latitude,longitude; MapLibre mendapat longitude,latitude. Angka/koordinat di luar rentang ditolak. Record invalid dilewati; struktur rusak atau feed nonkosong tanpa record valid dianggap gagal. Kedalaman opsional harus angka km. Potensi/Dirasakan kosong menjadi optional, tidak diinterpretasi sebagai aman/tidak ada dampak.

Deduplikasi memakai timestamp UTC dan koordinat numerik identik. Wilayah tidak dijadikan identitas. Potensi dan Dirasakan digabung dari dua feed; nilai pertama yang tersedia dipertahankan. Ini konservatif: revisi waktu/koordinat BMKG dapat muncul sebagai kejadian terpisah karena tidak tersedia ID kejadian resmi.

## Refresh dan cache

`src/hooks/useBMKG.ts`: fetch saat mount, kemudian 10 menit. Request paralel untuk dua sumber, tidak ada siklus tumpang tindih; timeout 15 detik; abort saat unmount. Startup ditunda satu task agar React StrictMode tidak menggandakan request. Tab tersembunyi tidak melakukan refresh baru; ketika kembali aktif, refresh hanya jika sudah waktunya. Request yang sudah berjalan saat tab disembunyikan boleh selesai.

Snapshot diganti hanya jika kedua feed berhasil divalidasi. Jika satu gagal, snapshot lengkap sebelumnya tetap dipakai dengan label belum diperbarui; tidak mencampur waktu pengambilan berbeda. Cache localStorage menyimpan raw feed dan waktu berhasil diambil, divalidasi ulang saat dibaca, kedaluwarsa 24 jam. Storage diblokir/penuh tidak merusak UI. Cache kadaluwarsa tidak ditampilkan. Label membedakan waktu kejadian dan waktu fetch. Tidak ada retry agresif.

## Layer, periode, dan tampilan

Konfigurasi `BMKG_CONFIG` pada service: enabled, days (default 7), refreshMs, cacheMaxAgeMs, timeoutMs. `enabled: false` mematikan fetch/layer. Pilihan All / Humanies Responses / BMKG Earthquakes hanya mengatur tampilan; filter Active/Alerts/Recovery hanya berlaku pada Humanies. Semua marker BMKG dalam periode ditampilkan, daftar memiliki scroll maksimal 320px agar sidebar/mobile tetap ringkas. Drawer reuse frame existing, sumber resmi menggunakan portal dokumentasi karena feed tidak menyediakan URL detail terverifikasi. BMKG selalu diatribusikan; tidak ada CTA donasi/target/campaign otomatis.

## Error dan keterbatasan

Loading, error, kosong dan stale cache memiliki teks tersendiri. Kegagalan BMKG tidak memengaruhi data Humanies. Tidak ada third-party CORS bypass. Jika kebijakan CORS BMKG berubah, UI tetap fallback aman; opsi berikutnya proxy Cloudflare kecil dengan allowlist dua endpoint dan cache, harus ditinjau terpisah sebelum mengubah konfigurasi parent/deployment.

Feed hanya daftar terbaru, bukan seluruh riwayat gempa Indonesia. Periode tujuh hari tidak menjamin semua kejadian dalam tujuh hari tersedia. Tidak ada inferensi korban, kerusakan, tsunami, atau kebutuhan donasi dari magnitude. Bukan emergency alert system. Refresh hanya selama halaman terbuka; antar-tab tidak memakai distributed lock. Untuk monitoring produksi: evaluasi ingestion terjadwal, arsip/identitas revisi kejadian, cache bersama, observability/SLA, pemantauan perubahan skema/CORS, aksesibilitas dan QA lintas browser, serta validasi manusia sebelum respons atau campaign. Semua itu di luar scope prototype ini.

## Hasil verifikasi implementasi (4 November 2026)

- Chromium pada production subpath berhasil direct fetch kedua endpoint (HTTP 200), dua request startup, 18 kejadian unik dalam periode tujuh hari pada snapshot pengujian.
- Empat tes Node lulus: normalisasi/koordinat/magnitude/WIB/deduplikasi/periode, record invalid, cache/failure, kontrak link Mayar/Kitabisa dan campaign closed.
- Browser: marker Humanies/BMKG, filter sumber, klik marker dan detail, BMKG hanya mempunyai link sumber resmi, desktop 1440px dan mobile 390px tanpa horizontal overflow.
- Browser: kegagalan dengan cache mempertahankan data berlabel; tanpa cache Humanies tetap tampil; feed kosong memberi empty state; tidak ada JavaScript page error.
- Normal wheel menggulir halaman; Ctrl+wheel mengubah posisi marker melalui zoom tanpa menggulir halaman. Opsi MapLibre cooperativeGestures tetap dipertahankan untuk Cmd di Mac. Cmd dan touch gesture belum diuji pada perangkat fisik.
- `npm run build` dan `git diff --check` lulus. Tidak melakukan commit, push, atau deploy. Link donasi diuji sebagai URL/aturan render; transaksi dan layanan tujuan tidak dijalankan.

## Pembaruan Iterasi 3

Lihat `docs/iteration-3-showcase.md` untuk cuaca, pencarian, dan lifecycle. Resolved kini tersedia melalui filter Archived. Donasi pada record simulasi dinonaktifkan. Service gempa dan data manual tetap terpisah dari cuaca; build standar dan build showcase lokal memiliki konfigurasi akses cuaca berbeda.
