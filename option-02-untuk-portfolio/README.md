# Disaster Watch — portfolio concept (Rangkul Project)

White-label version of a Disaster Watch proposal, prepared for the digmarketingmaul portfolio.
**Rangkul Project is a fictional brand.** No client logo, name, imagery or links are used.

- Disaster events and figures: real, from BNPB, BPBD, PVMBG and news reports as of
  31 Oct 2026 (`source` / `sourceUrl` on each record in `src/data/disasters.ts`).
- Rangkul responses, campaigns and stories: simulated. Responses on real events carry
  `simulated: true` and show a "Simulasi" label.
- Every link is disabled in the UI (a notice appears instead); in-page anchors still scroll.

```bash
npm install
npm run dev            # http://localhost:5181
npm run build          # typecheck + production build (dist/, not committed)
npm run build:deploy   # build for Cloudflare Pages into deploy/ (committed)
```

Stack: Vite · React · TypeScript · MapLibre GL JS (OpenFreeMap tiles). Fonts: Poppins + Fraunces (OFL).

## Assets

| Where | What | Source |
|---|---|---|
| `src/components/ui/icons.tsx` | Rangkul logo, mark, motif, favicon | Drawn in code for this concept |
| `public/images/campaigns/` | 8 campaign illustrations | Generated with Magnific (Recraft vector), rasterised to JPEG |
| `public/images/stories/` | 3 story photos | Freepik stock via Magnific |

## Deploy

Served at `https://bumi-aksara-portfolio.pages.dev/option-02-untuk-portfolio/`.
Cloudflare Pages serves the repo as-is (no build step): the build in `deploy/` is committed
and the root `_redirects` rewrites `/option-02-untuk-portfolio/*` to it.
