# Humanies Disaster Watch — prototype

Concept prototype for an interactive disaster map for Humanies Project.
**Data status (31 Oct 2026):** disaster events and figures are real, compiled from BNPB, BPBD,
PVMBG and news reports (each record has `source` + `sourceUrl`). The Sumatra recovery response
is Humanies' real (closed) Mayar campaign. Records with `simulated: true` carry a simulated
Humanies response and placeholder donate link, labelled "Simulasi" in the UI.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # typecheck + production build (dist/, not committed)
```

## Deploy (Cloudflare Pages)

Live at `https://bumi-aksara-portfolio.pages.dev/humanies-exploration/`.

The Pages project serves this repository as-is, with no build step. So the production
build is committed to `deploy/`, and the root `_redirects` rewrites
`/humanies-exploration/*` → `/humanies-exploration/deploy/*`. Source files stay unreachable.

```bash
npm run build:deploy   # rebuild deploy/ with base /humanies-exploration/
git add deploy && git commit && git push   # main auto-deploys
```

Run `build:deploy` after every change you want to publish. Public files are referenced
through `publicUrl()` (src/lib/publicUrl.ts) so they work under the subpath.

Stack: Vite · React · TypeScript · MapLibre GL JS. Basemap tiles from OpenFreeMap (no API key).
Type: Poppins + Fraunces (both SIL OFL, via Fontsource), matching humaniesproject.org.

Brand reference: `docs/humanies-existing-visual-system.md` (audit of the live site) and
`reference/existing-humanies/` (screenshots, logos, photos, `asset-inventory.md`).

## Structure

```
src/
  types/disaster.ts         data model (flat, DB/API-friendly)
  data/disasters.ts         ALL disaster data — edit by hand (sourced, see header)
  data/campaigns.ts         Humanies Mayar campaigns (real titles, categories, links, banners)
  data/indonesia-land.json  Natural Earth outline, used to tint Indonesia
  lib/                      formatting, status metadata, CTA rules (actions.ts)
  hooks/                    media-query hook
  components/
    map/                    MapLibre map, custom style, markers, controls
    drawer/                 detail panel / bottom sheet + per-status variants
    FilterBar, SituationList, Hero, SiteHeader, SiteFooter, Toast
    CampaignsSection        "Galang Dana Humanies": category chips + swipeable campaign row
    HomeContext             programs / stories / support band (placeholder homepage context)
  styles/                   tokens, base, layout, shared components
```

## Managing data

Everything comes from `src/data/disasters.ts`. Add an event by copying one object.

- `incidentStatus`: `alert` · `active-response` · `recovery` · `resolved` (resolved = history, hidden from the map)
- `fundraisingStatus`: `none` · `open` · `closed` (independent of the incident status)
- `actionUrl` / `actionLabel` / `platform`: external donate link (Mayar, Kitabisa, …).
  Shown only while fundraising is `open`, opens in a new tab.
- `reportUrl`: shown as "View Response Report" once fundraising is closed or the case is resolved.

## Map

Plain scroll scrolls the page. Zoom with ⌘ + scroll (Mac), Ctrl + scroll (Windows),
trackpad pinch or the +/− buttons. On touch, use two fingers to move the map.

## Not in this phase

No real disaster feeds (BNPB, PetaBencana), no backend, auth, CMS or Cloudflare
deployment. Internal pages ("View Details", programs) show a prototype notice.
