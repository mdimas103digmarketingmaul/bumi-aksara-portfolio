# MammaRoti Design Playground — Installation

Paket ini bersifat **additive**: tidak mengganti file production existing.

## Cara memasang

Dari folder `ADD_TO_mammaroti_2`:

1. Copy folder `src/app/playground` ke:
   `mammaroti_2/src/app/playground`

2. Copy folder `src/playground` ke:
   `mammaroti_2/src/playground`

3. Copy `PLAYGROUND_README.md` ke root:
   `mammaroti_2/PLAYGROUND_README.md`

Tidak perlu mengubah `src/app/page.tsx` production.

## Preview

Jalankan:

`npm run dev`

Lalu buka:

- Dashboard: `http://localhost:3000/playground`
- Section 02: `http://localhost:3000/playground/sections/02-sensory`
- Sensory Option 1: `http://localhost:3000/playground/sections/02-sensory/option-1`
- Compositions: `http://localhost:3000/playground/compositions`

## Struktur kerja

Production existing tetap menjadi baseline.

Playground:
- 10 section hub
- 3 option independen per section
- 3 full-page composition placeholder
- `README_SCOPE.md` pada setiap section/option untuk memudahkan pindah percakapan AI

## Cara mulai revisi Section 02

Edit hanya:

`src/playground/sections/02-sensory/option-1/Option.tsx`
`src/playground/sections/02-sensory/option-1/styles.module.css`

Option 2 dan 3 berada di folder terpisah, sehingga tidak ikut berubah.

## Setelah memilih option

Edit:
`src/playground/config/sections.ts`

Contoh:
status: "selected"
selectedOption: "option-2"

## Build / Cloudflare

Karena semua route playground statis dan project sudah memakai static export:

`npm run build`

Cloudflare Pages akan ikut mem-publish route `/playground/...` pada deploy berikutnya.

## Catatan SEO

`src/app/playground/layout.tsx` sudah menggunakan `noindex, nofollow`.
Halaman tetap publik dan bisa dibuka dengan URL, tetapi diminta agar tidak diindeks mesin pencari.
