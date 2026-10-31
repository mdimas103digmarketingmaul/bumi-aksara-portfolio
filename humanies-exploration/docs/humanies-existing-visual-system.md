# Humanies — existing visual system (audit)

Internal redesign reference. Measured on 31 Oct 2026 from computed styles (headless Chrome,
1440 / 768 / 390 px) on `humaniesproject.org/home-12` (primary), `/impact-stories` and `/`.
The site is built in Framer (`generator: Framer 0784c89`), so values come from rendered
output, not source tokens. Framer exposes no CSS colour variables (`--token-*`) on these pages.
Screenshots and assets live in `reference/existing-humanies/`.

---

## Typography

Three families are loaded. Two are actual brand choices.

| Role | Family | Weight | Size / line-height | Where |
|---|---|---|---|---|
| Display / hero | **Fraunces** | 700 | 40 / 48, +0.02em | "Change Begins with Caring." (white on video) |
| Page title | Fraunces | 700 | 48 / 57.6 | "Impact Stories" (`#1A2BC3`) |
| Statement / band | Fraunces | 400–700 | 36–40 / 1.2 | "Terus bergerak! …", "We are building a global community…", "Jadi Bagian Dari Perubahan!" (600) |
| Card title on photo | Fraunces | 500 | 24 / 28.8 | Story tiles on `/home-12` |
| Small caps heading | Fraunces | 700 | 24, uppercase | "LOYALTY PROGRAM", "MEMBER" |
| Section title | **Poppins** | 600 | 32 / 38.4 | "Our Programs", "Humanies In Number", "Impact Stories" (on `/`), `#011F53` |
| Hero (root `/`) | Poppins | 600 / 700 | 48 / 57.6–60 | "Anak Muda Harus / Peduli Pendidikan / Untuk Perubahan" (animated word swap) |
| Big numbers | Poppins | 900 | 56 | "Humanies In Number" (`#0C0EB8`) |
| Program name | Poppins | 600 | 32 | Program list rows |
| Navigation | Poppins | 600 | 14 / 16.8, +0.02em | Grey `#A6A6A6`, hover `#422DFC` |
| Button | Poppins | 600–700 | 16 | All CTAs |
| Body | Poppins | 300–500 | 16 / 19.2 (1.2) | Very tight leading throughout |
| Meta / label | Poppins | 400 | 12 / 18 | "Contribution" (`#A4B4D1`), story dates |
| Footer | Inter | 400 / 600 | 16 | Framer default, not a brand choice |

Wordmark: custom high-contrast "Humanies" with a sparkle dotting the *i*, over spaced
uppercase "PROJECT". It is an image, not a font.

**Licences.** Poppins and Fraunces are SIL OFL on Google Fonts, so they are safe to use. Inter is
also OFL but should be dropped (it is a Framer leftover).

## Colors

| Token | Value | Use |
|---|---|---|
| Humanies Blue | **`#1A2BC3`** | Primary on `/home-12`: buttons, blue bands, H monogram (`#192BC2`), card titles |
| Sapphire | `#0C0EB8` | Primary on `/` (buttons, big numbers). Near-duplicate of the above. |
| Electric blue | `#0025E5` | `/home-12` header logo |
| Hover violet | `#422DFC` | Nav link hover |
| Navy | `#011F53` | Section titles, program rows, story titles |
| Deep indigo | `#0E0F52` / `#0E0E53` | Body text in "Join", footer text, navy logo |
| Page lavender | `#F5F5FE` | `body` background on all pages |
| Lavender tints | `#E5E5FF`, `#E5E5F2`, `#E0E3FF`, `#CCD1FF` | Program rows (alternating), icon fills, dividers |
| Muted blue-grey | `#A4B4D1` | Card meta label (low contrast) |
| Greys | `#A6A6A6` (nav), `#2A2A2A`, `#B5B5B5` (disabled "Donasi Ditutup") | |
| White | `#FFFFFF` / `#FDFDFD` | Header, cards, white sections |

There is no warm accent colour. Imagery supplies the warmth.

## Layout

- **Header:** sticky, 74 px, white, no border or shadow. Logo left (150 px wide). Nav plus one solid CTA right.
- **Content width:** 1200 px (120 px side margins at 1440). Narrower blocks are 900 px (program list) and 1000 px (collab card).
- **Page gutter:** 32 px (hero copy, footer).
- **Sections** alternate white / lavender `#F5F5FE` / solid blue `#1A2BC3`. Vertical padding is 56–120 px.
- Section titles are centred. Card groups are centred grids of 3 (≈300 px cards, 20 px gaps).
- **Mobile:** hamburger nav, stacked hero, horizontal-scroll story and contribution carousels, full-width buttons.

## Components

- **Buttons:** solid `#1A2BC3`, white Poppins 600 16 px, **radius 4 px**, padding 12 × 16. Secondary is white fill with blue text (on dark), or a 1 px blue outline (on `/`). Disabled is grey `#B5B5B5` ("Donasi Ditutup"). No measurable hover change on buttons.
- **Story tiles (`/home-12`):** full-bleed photo, dark gradient, Fraunces 500 24 px title, thin white rule, "Lihat Kisah" link. 330 × 508, edge to edge, 10 px gap.
- **Story cards (`/impact-stories`):** 300 × 200 image with 8 px radius, date (Poppins 12), title (Poppins 600 16 / 1.6), navy.
- **Contribution cards:** white, radius 6, heavy shadow `2px 10px 7.4px rgba(0,0,0,.25)`. Small "Contribution" label, blue title, "Dana Dibutuhkan" plus amount, full-width blue button. Sits on a solid blue band with a sparkle cluster.
- **Program rows:** 900 px, radius 8, tinted `#E5E5F2` / `#E5E5FF`. Name in Poppins 600 32, year, light description, thin ↗ arrow.
- **Stat cards ("Humanies In Number"):** white, 1 px grey border, radius 4. Huge Poppins 900 blue number, navy label.
- **Feature block:** solid blue, **radius 41 px**, Fraunces 700 statement plus Poppins 22 supporting text, white button.
- **Footer:** white. Big blue "H + sparkle" monogram, "Explore" / "Contact" bullet lists, one-paragraph mission, "© Humanies Project 2024".
- **Icons:** thin outline (↗ arrows). Brand icons are flat concentric shapes in blue plus lavender.

## Brand characteristics — what makes it feel "Humanies"

1. **Humanies Blue as a surface,** not just an accent. Whole bands and cards are solid `#1A2BC3`.
2. **Fraunces Bold for statements** against **Poppins for everything else.** Warm, slightly quirky serif voice over a friendly geometric sans.
3. **The sparkle** (four-point star, one outlined). It appears in the logo, the monogram, beside headlines and on blue bands.
4. **Lavender-tinted whites** (`#F5F5FE`) instead of neutral grey or beige.
5. **Small, practical radii** (4–8 px) on controls and cards, with occasional big soft blocks (26–41 px).
6. **Youthful, casual Indonesian voice:** "Terus bergerak! Karena peduli itu nggak pernah sia-sia." "Jadi Bagian Dari Perubahan!" "Let's Collab!" It mixes ID and EN freely.
7. **Real people at real events** (mangrove planting, Kampung Bayam) is the strongest imagery.

## Current inconsistencies (do not reproduce)

- **Two primary blues** (`#1A2BC3` on `/home-12` vs `#0C0EB8` on `/`) and **two logo colours** (electric blue vs navy).
- **Headings switch family by page:** Fraunces on `/home-12` and `/impact-stories`, Poppins on `/`. Footer and some buttons fall back to Inter.
- **Navigation differs by page:** 4 links plus CTA on `/home-12`, 2 links plus CTA on `/`. The header CTA is "Unlock Behind" (a single program) rather than a support action.
- **Test content live:** "test title 1/2" stories, "Tentang Kami" posted as a story, stock photos in the gallery and on story cards.
- **Language mixing** within one section (EN section titles, ID body and buttons).
- **Hard-coded "Rp … Dana Dibutuhkan" amounts** with no progress context. "Donasi Ditutup" looks like a broken button.
- **Low-contrast text:** nav `#A6A6A6` on white (2.5:1), meta `#A4B4D1` (2.1:1), white body text on the busy video.
- **Body line-height 1.2** is cramped for paragraphs. Tight 16 px leading is used everywhere.
- **Stale footer** ("© Humanies Project 2024") and default Framer-style metadata. The page title is the same on every page.
- **Heavy, uneven shadows** (contribution cards) next to flat, borderless sections.

## Applied in the Disaster Watch prototype

- Fonts: Poppins (UI, body, section titles) plus Fraunces 600–700 (display and statements). Inter removed.
- One primary blue, `#1A2BC3`, with lavender tints. Navy `#011F53` for headings and deep indigo for text.
- Darker muted text (`#5A6385`) and nav text, for AA contrast.
- Body line-height 1.5.
- 6 px buttons, 8–12 px cards, one large rounded blue block.
- The sparkle motif, "Humanies In Number"-style stat cards, program rows and story cards.
- Disaster Watch is framed as part of **Humanies Bersiaga**, the existing disaster-response program.
