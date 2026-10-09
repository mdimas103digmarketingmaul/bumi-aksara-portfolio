# MammaRoti — website dari Draft Web.pdf

Project Next.js + TypeScript + React dengan seluruh section pada desain PDF. Bisa dibuka dan diedit di VS Code. Aset foto, logo, grafis nama produk, panah, dan motif berasal dari PDF yang diberikan. Tidak memerlukan API key untuk menjalankan tampilan website.

## Mulai dalam 3 langkah

1. Ekstrak ZIP, lalu buka folder **mammaroti-website** di VS Code (File → Open Folder).
2. Buka Terminal → New Terminal. Pastikan terminal berada di folder yang memuat `package.json`.
3. Jalankan:

```bash
npm install
npm run dev
```

Buka **http://localhost:3000**. Terminal harus tetap berjalan. Gunakan **Ctrl+C** untuk menghentikannya.

Prasyarat: Node.js 20.9 atau lebih baru beserta npm. Node.js 22/24 LTS disarankan. Internet dibutuhkan saat `npm install`; seluruh gambar dan font sudah lokal. `node_modules` dan `.next` sengaja tidak disertakan karena dibuat melalui instalasi/build.

## Production

```bash
npm run build
npm start
```

Untuk instalasi dengan versi yang persis sama seperti lockfile:

```bash
npm ci
```

Project menggunakan route server `/api/contact`, sehingga deployment production memerlukan hosting yang mendukung Next.js/Node.js. Jangan langsung membuka file `.tsx` sebagai HTML atau memakai VS Code Live Server.

## Isi project

| Lokasi | Kegunaan |
| --- | --- |
| `src/app/page.tsx` | Urutan seluruh section |
| `src/app/layout.tsx` | Metadata dan font lokal |
| `src/app/globals.css` | Reset, accessibility, reduced motion |
| `src/styles/tokens.css` | Warna dan ukuran dasar desain |
| `src/styles/home.css` | Layout desktop, tablet, mobile |
| `src/components` | Header, formulir, divider, pola logo |
| `src/sections` | Hero, sensory, dough, sertifikasi, produk, outlet, kemitraan, berita, kontak, footer |
| `src/data/products.ts` | 16 produk dan posisi grafis namanya |
| `src/data/outlets.ts` | Daftar outlet dan exclusive store |
| `src/data/site.ts` | Email, alamat, URL sosial, paragraf placeholder |
| `src/app/api/contact/route.ts` | Validasi formulir dan koneksi webhook opsional |
| `public/images` | Foto dan ilustrasi yang diekstrak dari PDF |
| `public/logos` | Logo MammaRoti dan sertifikasi |
| `public/icons` | Panah asli dari PDF |
| `public/fonts` | Poppins dan Bebas Neue, termasuk lisensinya |
| `public/videos` | Folder siap pakai; PDF tidak memuat video |
| `docs` | Referensi PDF, analisis desain, aset, dan catatan verifikasi |

## Perilaku interaktif

- Navigasi Lokasi, Menu, Kritik & Saran dan Temukan Kami menuju section terkait.
- Menu hamburger pada mobile; tombol Escape menutup menu.
- Original / Taro serta Keep Scrolling berpindah ke section terkait.
- Kartu produk memiliki hover halus. Tidak ada detail produk atau checkout fiktif.
- Berita dapat digeser horizontal; tidak membuka artikel fiktif karena PDF hanya memuat placeholder.
- Hubungi Kami membuka draf email kemitraan ke `contact@mammaroti.id`.
- Formulir memvalidasi nama, email, dan pesan. Secara bawaan, tombol Kirim membuka **draf email**, bukan mengirim email otomatis. Pengguna menyelesaikan pengiriman di aplikasi emailnya. Status ini dinyatakan dengan jelas sesudah tombol ditekan.

## Aktifkan pengiriman formulir langsung (opsional)

Tanpa konfigurasi apa pun, situs sudah berjalan menggunakan draf email. Untuk menerima pesan langsung melalui backend milik Anda:

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `CONTACT_WEBHOOK_URL` dengan endpoint HTTPS Anda. Bila diperlukan, isi `CONTACT_WEBHOOK_TOKEN`.
3. Restart development server / build ulang deployment.

Endpoint menerima POST JSON:

```json
{
  "name": "Nama pengunjung",
  "email": "pengunjung@example.com",
  "message": "Isi pesan"
}
```

Respons 2xx dianggap berhasil; error/timeout ditampilkan tanpa klaim berhasil. Token hanya dibaca di server. Sesuaikan penyimpanan, pengiriman email, serta pembatasan traffic di layanan penerima sesuai deployment Anda. Tidak ada pesan yang dikirim ke pihak ketiga selama pembuatan project ini.

## Isi yang sengaja mengikuti PDF

Teks `Lorem ipsum`, `empty image`, tanggal `10/10/2020`, ejaan `Rasberry`, `Yogja`, `Tanggerang`, dan `KP. Banka` dipertahankan. Foto minuman yang sama pada seluruh varian juga mengikuti PDF. Tidak ada stok foto pengganti.

URL akun Instagram, Facebook, Threads, dan nomor WhatsApp tidak diberikan. Labelnya tampil sesuai PDF sebagai teks. Isi `href` di `src/data/site.ts` untuk mengaktifkan masing-masing tautan; jangan mengisi akun/nomor tebakan.

Grafis nama produk adalah SVG outline asli beserta bayangan yang diekstrak. Nama tekstualnya tetap ada sebagai heading aksesibel. Untuk mengganti **tampilan** nama produk, edit/ganti file `public/images/label-*.svg`; perubahan field `name` hanya mengubah nama aksesibelnya.

## Verifikasi

```bash
npm run typecheck
npm run check
npm test
npm run build
```

Rincian hasil dan keterbatasan ada di `docs/QA.md`. Layout diukur dari PDF, tetapi belum dapat dijamin identik 100% karena pemeriksaan screenshot browser pada desktop/mobile belum tersedia di lingkungan pembuatan. Poppins dan Bebas Neue dipilih berdasarkan bentuk visual; PDF tidak menyimpan nama font aslinya.

Untuk membandingkan: buka website pada viewport **1440px**, zoom browser **100%**, kemudian bandingkan dengan `docs/Draft-Web.pdf`. Periksa juga 1920, 1024, 768, 375, dan 320px. Parameter `--u` menjadikan 1 unit desain = 1px pada viewport 1440px.

## Referensi teknis

- Next.js installation: https://nextjs.org/docs/app/getting-started/installation
- Seluruh font dilayani lokal; lisensi SIL Open Font License disertakan dalam `public/fonts`.
- Hak aset merek dan isi desain tetap mengikuti pemilik sumber yang diberikan.
