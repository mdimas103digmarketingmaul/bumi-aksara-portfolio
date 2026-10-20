# MammaRoti — Project Checkpoint

Tanggal audit: 2026-10-20
Dasar: kode repository dan status Git pada tanggal tersebut. Tidak ada kode website yang diubah selama audit; satu-satunya file yang dibuat adalah dokumen ini.

## 1. Ringkasan

- Website MammaRoti (Next.js App Router, React, TypeScript) dibangun dari `docs/Draft-Web.pdf`, dengan static export (`output: "export"`).
- Halaman production (`/`) lengkap: 10 section dari PDF, 16 produk, aset lokal.
- Playground desain tersedia di `/playground`. Pekerjaan nyata baru ada di Section 02 (Sensory), Section 03 (Dough), tiga komposisi A/B/C, dan **Redesign Option 1**. Sisanya masih placeholder.
- **Formulir kontak production tidak berfungsi sebagaimana didokumentasikan README** (lihat bagian 6, risiko R1).

## 2. Konfigurasi dan build

| Item | Keadaan saat ini |
| --- | --- |
| Framework | `next` 16.4.0, `react`/`react-dom` 19.3.0, TypeScript ^5.9.3 |
| Node | `engines` >=20.9.0; lingkungan audit memakai v24.21.0 |
| `next.config.ts` | `output: "export"`, `images.unoptimized: true`, `poweredByHeader: false`, `reactStrictMode: true` |
| Script | `dev`, `build`, `start`, `typecheck` (`next typegen && tsc --noEmit`), `check` (`scripts/check-assets.mjs`), `test` (`scripts/test-contact.cjs`) |
| Font | Poppins 400/600 dan Bebas Neue, lokal di `public/fonts` lewat `next/font/local` |
| Env | `.env.example` mendefinisikan `CONTACT_WEBHOOK_URL` dan `CONTACT_WEBHOOK_TOKEN`; tidak ada kode yang membacanya (lihat R1) |
| Hosting | PLAYGROUND_README menyebut Cloudflare Pages; belum ada deploy yang diperiksa dalam audit ini |

## 3. Struktur repository

Git root berada satu tingkat di atas: `bumi-aksara-portfolio/`. Folder `mammaroti_2/` adalah salah satu proyek di dalamnya, berdampingan dengan `hanasari-astro`, `hanasari-website`, `mammaroti`, `Beliayamcom`, dan file HTML lama. Karena itu pesan commit terbaru (Hanasari, Decap CMS, artikel promo) **bukan** riwayat proyek ini. Commit yang relevan: `dc16e06` (static website), `0b7e15a` (Redesign Option 1), `391310f` hanya menyentuh `hanasari-astro` (diperiksa lewat `git show --stat`), jadi bukan bagian proyek ini.

```
mammaroti_2/
  src/app/                       route App Router (page.tsx, layout.tsx, globals.css, playground/)
  src/components/                Header, ContactForm, Divider, BrandPattern
  src/sections/                  10 section production
  src/data/                      products.ts (16 produk), outlets.ts, site.ts
  src/styles/                    tokens.css, home.css
  src/playground/                kode playground (sections/, compositions/, components/, config/)
  public/{fonts,icons,images,logos,videos,redesign/option-1}
  docs/                          QA.md, ASSETS.md, DESIGN-ANALYSIS.md, Draft-Web.pdf
  scripts/                       check-assets.mjs, test-contact.cjs
```

## 4. Sudah diterapkan

### 4.1 Production (`/`)

`src/app/page.tsx` merakit: Header, Hero, Sensory, Divider, Dough Original, Dough Taro, CertificationStrip, Products, Outlets, Partnership, News, Divider, Contact, Footer. Semua ada di `src/sections/` dan `src/components/`. Teks dummy dari PDF (Lorem ipsum, "empty image", ejaan "Rasberry", "Yogja", dll.) sengaja dipertahankan sesuai README.

### 4.2 Playground

Route playground statis, `noindex, nofollow` lewat `src/app/playground/layout.tsx`.

**Section hub (10 section, 3–4 option per section).**

| Section | Option | Status implementasi |
| --- | --- | --- |
| 01 Hero | 1–3 | Placeholder (15 baris, `OptionPlaceholder`) |
| 02 Sensory | 1–4 | Terimplementasi (51–64 baris + CSS Module) |
| 03 Dough | 1–4 | Terimplementasi (59–88 baris + CSS Module; data di `doughData.ts`) |
| 04 Certifications | 1–3 | Placeholder |
| 05 Products | 1–3 | Placeholder |
| 06 Outlets | 1–3 | Placeholder |
| 07 Partnership | 1–3 | Placeholder |
| 08 News | 1–3 | Placeholder |
| 09 Contact | 1–3 | Placeholder |
| 10 Footer | 1–3 | Placeholder |

Total 32 option section: 8 terimplementasi, 24 placeholder.

**Komposisi A/B/C** (`/playground/compositions/option-a|b|c`). Ketiganya terimplementasi, memakai Sensory Option 3 dan Dough Option 2, section lain dari production. Perbedaannya pada urutan section.

**Redesign (`/playground/compositions/redesign`).**

| Slot | Route | Status nyata di kode |
| --- | --- | --- |
| option-1 "Pull-apart" | `redesign/option-1` | **Terimplementasi.** `Composition.tsx` plus 11 komponen ber-CSS Module dan `data.ts` di `src/playground/compositions/redesign/option-1/`. Aset di `public/redesign/option-1/` (19 file, 820 KB) |
| option-2 sampai option-6 | `redesign/option-N` | Kosong; memakai `RedesignPlaceholder` |

### 4.3 Hasil pemeriksaan (dijalankan 2026-10-20)

| Perintah | Hasil |
| --- | --- |
| `npm run typecheck` | Lulus (route types dibuat; tidak ada error) |
| `npx tsc --noEmit` | Lulus, exit 0 |
| `npm run build` | Lulus, exit 0. Semua route prerender statis (`○`): `/`, `/_not-found`, `/playground`, 4 route komposisi, hub dan 6 redesign, 10 hub section, 32 option section |
| `npm run check` | Lulus: 36 referensi aset, 16 produk. Pemeriksaan section dan 5 placeholder berita hanya jalan bila `.next/server/app/index.html` ada; dengan `output: "export"` file itu belum tentu dibuat, jadi bagian ini kemungkinan terlewati tanpa pesan |
| `npm test` | **Gagal.** `ENOENT: src/app/api/contact/route.ts` |
| Pemeriksaan browser (desktop/mobile, interaksi) | **Tidak dijalankan** dalam audit ini |

Setelah build, `next-env.d.ts` kembali ke isi yang tercatat di Git (perubahan `dev/types` dari `npm run dev` hilang). Status Git akhir: hanya `../.DS_Store` (modified) dan `CLAUDE.md` (untracked), ditambah dokumen ini.

## 5. Perbedaan dokumentasi lama dan kode saat ini

| Dokumen | Klaim | Keadaan kode |
| --- | --- | --- |
| `README.md` | Ada route server `/api/contact`; deployment butuh hosting Node.js | `src/app/api/` tidak ada dan tidak pernah ada di riwayat Git. Konfigurasi memakai `output: "export"`, yang tidak mendukung route handler. `out/` tidak berisi `api/` |
| `README.md` | `.env.example` mengaktifkan webhook formulir | Tidak ada kode yang membaca `CONTACT_WEBHOOK_URL`/`TOKEN` |
| `README.md` dan `docs/QA.md` | `npm test` lulus 10 pemeriksaan; build menyebut `/api/contact` tersedia | Tes gagal (file route hilang); build tidak memuat `/api/contact` |
| `README.md` | `npm start` untuk production | Dengan static export, `next start` tidak sesuai; hasil build adalah folder `out/` |
| `README.md` | Perilaku formulir: membuka draf email secara default | `ContactForm.tsx` tetap memanggil `fetch('/api/contact')`; tanpa endpoint, ia menampilkan pesan galat dan tidak membuka draf email (perilaku tepat belum diuji di browser; lihat R1) |
| `docs/QA.md` | Screenshot browser belum tersedia | Masih benar; belum ada bukti pemeriksaan visual sampai audit ini |
| `PLAYGROUND_README.md` | Paket "3 full-page composition placeholder" | Komposisi A/B/C sudah terimplementasi dengan Sensory Option 3 dan Dough Option 2 |
| `src/playground/config/sections.ts` | Status section | Hanya `03-dough` bertanda `exploring`; 02-sensory tertulis `not-started` dan tidak ada `selectedOption`, padahal README_SCOPE komposisi menyebut Sensory Option 3 dan Dough Option 2 "locked" |
| `redesignOptions.ts` | Semua enam opsi `status: "empty"`, `source: "Unassigned AI"` | Option 1 sebenarnya terimplementasi (route dan komponen ada). Metadata ini kedaluwarsa, tetapi **tidak diubah** dalam audit ini |
| `redesign/option-1/README_SCOPE.md` | "IMPLEMENTED — Pull-apart" | Sesuai kode |
| Pesan commit `391310f`, `b2aa06e`, `2f545bd` | Terkesan tentang proyek ini | Menyangkut Hanasari/Astro/Decap di folder lain pada repo yang sama |

## 6. Risiko nyata

- **R1 (tinggi): formulir kontak production rusak.** `src/components/ContactForm.tsx` melakukan `fetch('/api/contact')`, endpoint tidak ada, dan static export tidak bisa menyajikannya. Pada hosting statis permintaan itu mendapat 404 (atau halaman HTML), sehingga `response.json()` kemungkinan melempar galat dan pengunjung melihat pesan gagal. Perilaku persisnya belum dikonfirmasi di browser. Pengunjung tidak punya jalur kirim yang bekerja selain tautan email di tempat lain pada halaman.
- **R2 (sedang): `npm test` gagal** dan tidak bisa dijadikan gerbang kualitas selama route kontak tidak ada.
- **R3 (sedang): verifikasi visual belum pernah dilakukan.** Responsive hanya ditinjau lewat CSS (QA.md). Option terimplementasi dan Redesign Option 1 belum dicek di desktop/mobile dalam audit ini.
- **R4 (rendah): metadata playground kedaluwarsa** (`redesignOptions.ts`, `sections.ts`) dapat menyesatkan siapa pun yang mengandalkannya untuk status.
- **R5 (rendah): `check-assets.mjs` tidak sepenuhnya efektif** untuk pemeriksaan section/berita bila `.next/server/app/index.html` tidak dihasilkan.
- **R6 (rendah): kebersihan Git.** `../.DS_Store` berubah; `next-env.d.ts` berganti isi setiap `npm run dev` versus `build`; `CLAUDE.md` belum dilacak. Tidak ada yang di-commit.
- **R7 (rendah): konteks monorepo.** Riwayat Git dibagi dengan proyek lain, sehingga `git log` tanpa path memberi gambaran keliru. Gunakan `git log -- mammaroti_2`.

## 7. Masih rencana / belum dikerjakan

- 24 option section placeholder (Section 01 dan 04–10).
- Redesign Option 2–6 (slot kosong untuk kandidat dari AI/model berbeda).
- Memilih opsi final per section, lalu memperbarui `sections.ts` (`status: "selected"`, `selectedOption`).
- Menggabungkan pilihan ke `src/app/page.tsx` (belum ada keputusan yang diterapkan ke production).
- URL media sosial, nomor WhatsApp, artikel berita nyata, foto berita (`news-01..05.webp`), endpoint penerima formulir: belum diberikan oleh sumber.
- Video: `public/videos` hanya berisi `.gitkeep`.

## 8. Pekerjaan berikutnya (usulan, urut prioritas; belum disetujui)

1. **Putuskan jalur formulir kontak**, lalu terapkan: (a) tetap static dan ganti `ContactForm` ke `mailto:` langsung atau layanan formulir pihak ketiga; atau (b) pindah ke hosting Node dan tambahkan `src/app/api/contact/route.ts`. Perbarui README, QA.md, `.env.example`, dan `scripts/test-contact.cjs` sesuai keputusan.
2. Jalankan pemeriksaan browser desktop (1440, 1920) dan mobile (375, 320) untuk `/`, Redesign Option 1, komposisi A/B/C, serta Section 02 dan 03; catat hasilnya di sini.
3. Sinkronkan metadata playground (`redesignOptions.ts` Option 1 menjadi `ready` atau `in-progress`; `sections.ts` untuk 02 dan 03) setelah Maul menentukan statusnya.
4. Rapikan README: hapus klaim `/api/contact`, `npm start`, dan hasil tes lama.
5. Perbaiki `check-assets.mjs` agar memeriksa `out/index.html` setelah build export.
6. Lanjutkan Redesign Option 2–6 atau section placeholder sesuai prioritas Maul; tiap kandidat tetap terisolasi.

## 9. Catatan kerja

- Tugas "Option N" dibatasi pada folder dan aset Option N (aturan di `CLAUDE.md`).
- Gaya khusus opsi memakai CSS Module lokal.
- Tidak ada commit, push, atau deploy yang dilakukan. Build lokal berhasil tidak berarti deploy berhasil.
