# Hanasari Astro Playground

Playground terpisah untuk belajar Astro + Decap CMS tanpa mengubah `hanasari-website` existing.

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
│   ├── ArticleCard.astro
│   ├── Header.astro
│   └── Footer.astro
├── content/
│   └── articles/
│       └── *.md
├── pages/
│   ├── index.astro
│   └── artikel/
│       ├── index.astro
│       └── [slug].astro
└── content.config.ts
```

### Cara kerja artikel
1. Client membuat artikel lewat `/admin/`.
2. Decap membuat satu file Markdown baru di `src/content/articles/`.
3. Publish membuat commit GitHub.
4. Cloudflare menjalankan `npm run build`.
5. Astro membuat HTML statis untuk setiap artikel.
6. URL artikel menjadi `/artikel/<slug>/`.

## Cloudflare Pages playground
Buat Pages project baru dari repository yang sama.

- Root directory: `hanasari-astro`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: `22.12.0` atau lebih baru

Jangan ubah Pages project existing `bumi-aksara-portfolio` dulu.
