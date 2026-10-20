# MammaRoti Website

Next.js static site. The homepage is `src/app/page.tsx`; sections live in `src/components/`, content in `src/data/`, images and fonts in `public/`.

## Local Development

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:3000).

## Production Check

```bash
npm run build
```

The static site is written to `out/`.

## Cloudflare Pages

- Root directory: `/`
- Build command: `npx next build`
- Output directory: `out`
- Node.js 20.9 or newer
