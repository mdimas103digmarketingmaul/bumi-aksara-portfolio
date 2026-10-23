# Hanasari Catering — Website (Astro)

Website utama Hanasari Catering: homepage, daftar artikel, dan detail artikel, dengan artikel dikelola lewat Decap CMS.

## Stack
- Astro 6 (static site generation)
- Decap CMS
- Markdown folder collection: 1 artikel = 1 file
- Cloudflare Pages
- Tanpa React / Next.js

## Local development
Dari folder `hanasari-astro`:

```bash
node -v
npm install
npm run dev
```

Astro akan memberikan URL lokal (umumnya `http://localhost:4321`).

Untuk Decap CMS lokal, buka terminal kedua dari root repository `bumi-aksara-portfolio`:

```bash
npx decap-server
```

Lalu buka:

`http://localhost:4321/admin/`

## Struktur penting

```text
src/
├── components/
│   └── site/              # semua section & komponen website
│       ├── SiteHeader.astro, SiteFooter.astro, Hero.astro, …
│       ├── ArticleCard.astro
│       ├── data.ts        # konten: paket, menu, testimoni, kontak
│       └── site.client.ts # interaksi (vanilla TS)
├── layouts/
│   └── SiteLayout.astro   # <head>, SEO, font, script
├── styles/
│   └── site.css           # design system (class berprefix `o1-`)
├── content/
│   └── articles/
│       └── *.md           # artikel dari Decap CMS
├── pages/
│   ├── index.astro        # homepage
│   └── artikel/
│       ├── index.astro    # daftar artikel + pencarian
│       └── [slug].astro   # detail artikel
└── content.config.ts

public/assets/site/        # logo HS & font Montserrat
public/assets/images/      # cut-out paket dari katalog, foto hero & thumbnail
public/assets/products/    # foto produk dari dokumentasi (per kategori menu)
public/assets/uploads/     # unggahan dari CMS
public/admin/              # Decap CMS
```

### Menambah produk / foto menu
Semua produk homepage ada di `src/components/site/data.ts` (`categories`, `products`).
1. Tambahkan objek ke `products` dengan `category` yang sesuai. Isi `price` hanya bila ada di katalog resmi; `null` menampilkan "Tanya admin".
2. Simpan foto WebP ±800×600 di `public/assets/products/<kategori>/<produk>.webp`.
3. Isi `image: productImg('<kategori>/<produk>.webp')` dan `imageAlt`. Tanpa `image`, kartu tampil sebagai placeholder bermotif.

### Cara kerja artikel
1. Client membuat artikel lewat `/admin/`.
2. Decap membuat satu file Markdown baru di `src/content/articles/`.
3. Publish membuat commit GitHub.
4. Cloudflare menjalankan `npm run build`.
5. Astro membuat HTML statis untuk setiap artikel.
6. URL artikel menjadi `/artikel/<slug>/`.

## Cloudflare Pages

- Root directory: `hanasari-astro`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: `22.12.0` atau lebih baru

