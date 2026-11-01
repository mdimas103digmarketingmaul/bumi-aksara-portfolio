# RJS Cottage — Design Direction · Option 01

**"Kumpul dulu, pulangnya nanti."** (Gather first, go home later.)

A warm, editorial website that sells *the weekend your group will have* before it sells specifications.
Facts come from `RESEARCH.md`. Anything not verified is listed at the end as needing client confirmation.

---

## 1. Concept

RJS Cottage is not a luxury resort and shouldn't pretend to be one. Its strength is simple and very
Indonesian: **one group gets one whole house**, with its own pool, billiard table, karaoke, yard and kitchen,
about 90 minutes from Jakarta. The guest Stories confirm the audience: extended families, office outings,
community *makrab* nights and school groups.

So the site is built around **togetherness and time**:

1. **Hero:** an invitation, not a spec sheet ("Kumpul dulu, pulangnya nanti.").
2. **Manifesto:** what a stay *feels* like, written as people doing things (kids swimming until their
   fingers wrinkle, aunties and uncles playing billiard, cousins fighting over the karaoke mic).
3. **Choose your cottage:** a calm decision tool with honest differences.
4. **Sehari di RJS:** a day from 07.00 to 22.00. The page colour shifts from morning paper to night pine as you scroll.
5. **Proof, practicalities, booking:** real guest Stories, house rules up front, a WhatsApp enquiry builder.

## 2. Art direction

| Element | Decision | Why |
|---|---|---|
| **Motif** | The **arch** ("jendela"). Hero video, cottage photos, timeline stills and the route map all sit in a semicircle-topped frame. | Each image becomes a window you look *through*. It feels homely and architectural, and it's ownable without being a gimmick. It also gives vertical social video a natural frame. |
| **Composition** | Asymmetric editorial: big serif headlines, generous whitespace, overlapping photo cards, one strong image per idea. | Avoids the hotel-template grid of small cards and icons. |
| **Photography** | Real property photos and client video only. No stock. | The pool blue, white houses and Puncak greenery *are* the brand. |
| **Texture** | Flat paper colour and soft shadows. No glassmorphism, no gold, no gradients except functional overlays. | Premium through restraint, not ornament. |

## 3. Typography

- **Fraunces** (variable, OFL) for display. Set with `SOFT 100` so the serifs are rounded and friendly.
  The italic with `WONK 1` marks the *emotional word* in each headline ("*nanti.*", "*akhir pekan.*",
  "*pulang bawa cerita.*"). It's warm and editorial without being a wedding serif.
- **Instrument Sans** (variable, OFL) for body, UI and labels. Contemporary, slightly narrow and very legible on mobile.
- Labels use small uppercase tracking. Numbers (prices, capacities) are tabular.
- Both fonts are self-hosted (`assets/fonts/`), with no Google Fonts request.

This deliberately differs from Maul's own site (Inter + JetBrains Mono, technical) and from the Thufeil
project (Archivo + Geist, bold kinetic). It shares their discipline: one clear voice, precise small details, hierarchy through scale.

## 4. Colour

| Token | Hex | Role |
|---|---|---|
| Paper | `#F4F1EA` | Main canvas, like morning mist and linen |
| Paper 2 | `#EBE6DA` | Alternate sections (stories, location, rules) |
| Pine | `#13241C` | Text, primary buttons, booking and footer |
| Moss | `#557050` | Eyebrow labels |
| **Pool** | `#1F5FD6` | **The one accent:** italic emphasis, active states, button hover fill |
| Pool light | `#6F9CF5` | Accent on dark backgrounds |
| Lamp | `#F1B86A` | Evening only (night state of the timeline, warnings) |

The accent is taken from the property itself: every photo and video has the same vivid blue pool.
The "Sehari di RJS" section interpolates paper → warm afternoon → dusk → night as you scroll, so the colour also tells the story.

## 5. Motion

Motion follows Maul's principle (*subtle at rest, responsive on interaction, expressive on scroll*):

- **Hero:** headline lines rise out of a mask, the video arch wipes open, and the photo card settles in.
  Parallax on scroll (desktop) or a slow zoom (mobile).
- **Manifesto:** words light up as you read (scrubbed), and inline photo pills pop in.
- **Cottage tabs:** images wipe open and the copy rises when switching units.
- **Breather:** a pool photo opens from a framed card to full bleed, then the quote fades in.
- **Sehari di RJS:** pinned horizontal travel on desktop with a live clock (07.00 → 22.00) and a
  day-to-night colour change. On mobile it becomes a vertical timeline with the same colour change.
- **Facilities:** on desktop, a photo floats beside the cursor when you hover a facility.
- **Route:** the Jakarta → Cisarua line draws itself.
- Lenis smooth scroll. Everything is GSAP/ScrollTrigger and progressive.
- **`prefers-reduced-motion`:** no smooth scroll, pins or scrubs. The hero video starts paused on its poster, and all content is visible.
- The hero video has a pause button (WCAG 2.2.2) and pauses when off-screen.

## 6. Information architecture (and why it changed from the brief)

| # | Section | Notes |
|---|---|---|
| 1 | Hero | Headline, one-line value prop, **two CTAs** (WhatsApp first), price anchor "Mulai Rp1,8 jt/malam · satu cottage utuh" |
| 2 | Manifesto + 4 facts | 3 cottages · 20–25 guests · ±800 mdpl · ±90 minutes |
| 3 | **Pilih cottage** | Tabbed picker: arch photo, kicker ("Yang paling hangat / terang / teduh"), specs, **full weekday/Friday/Saturday price table**, facility chips, honest slope note, unit-specific WhatsApp CTA |
| 4 | Breather | Emotional pause before the experience section |
| 5 | **Sehari di RJS** | Replaces a generic "experience" icon grid with a day timeline. Each moment maps to a verified facility (pool, kitchen, billiard, BBQ, karaoke) and quiet hours (22.00). |
| 6 | Fasilitas + **Sebelum booking** | Typographic facility list, then the house rules *before* booking (check-out, DP, quiet hours, extra guests, pets/alcohol). This answers the questions guests otherwise ask on WhatsApp and builds trust. |
| 7 | Cerita tamu | The real Instagram Story screenshots in a draggable, slightly tilted rail. Authentic and not retyped. |
| 8 | Galeri | Filterable by cottage, video tile, keyboard-accessible lightbox |
| 9 | Lokasi | Area-level address (see conflict A in research), access notes (toll, altitude, one-way schedule), Google Maps CTA, illustrated route |
| 10 | **Booking** | 4-step booking flow plus an **enquiry builder**: cottage, check-in, nights, guests, optional name, a **live price estimate** (weekday/Fri/Sat logic and over-capacity warning), then a prefilled WhatsApp message. Clearly labelled "not a payment". |
| 11 | FAQ | `<details>` accordion with the 7 most likely questions |
| 12 | Footer | Closing line, CTA, address, socials |

The brief's "Property details" and "Experience" are merged and reframed. The rules block and the
enquiry builder are additions based on the research (friction points: DP, slope, capacity, weekend pricing).

## 7. Major UX & conversion decisions

- **WhatsApp is the only booking path**, and it is honest: no fake calendar or engine.
  - Every primary CTA opens WhatsApp with a prefilled, context-specific message (hero, nav, each cottage, route request, FAQ).
  - The booking form writes a structured message, so the admin gets dates, unit and group size in the first message.
- **Prices are visible.** The research showed a large weekday/Saturday gap, so the full price table is shown per
  unit, and the estimator teaches the logic ("1× Jumat + 1× Sabtu").
- **Mobile sticky dock** ("Mulai Rp1,8 jt/malam · Cek tanggal") appears after the hero. It hides over the booking form and footer so it never doubles up.
- **Mobile hero** is the full-bleed vertical video (the footage is 9:16). **Desktop** frames that same video in an arch beside the headline. One asset, two art-directed layouts.
- **Honesty as trust:** the slope warning, non-refundable DP, quiet hours and "no pets/alcohol" are stated plainly before the guest contacts anyone.
- **Accessibility:**
  - Semantic landmarks and a skip link.
  - ARIA tabs with arrow/Home/End keys.
  - `<dialog>` lightbox with arrow keys and focus return.
  - A real form with radio group, steppers and live region.
  - Visible focus states, descriptive Indonesian alt text, and a video pause control.
- **SEO/quality:**
  - Metadata, Open Graph (1200×630 image), canonical, and `LodgingBusiness` JSON-LD with only verified fields (locality-level address, price range, checkout time, amenities).
  - Responsive WebP (`srcset` 720/1400), lazy loading, a 0.9 MB hero reel with poster, and preloaded fonts.
  - Static HTML with no framework runtime.
  - **`noindex` is on for this exploration.** Remove it at launch, along with the preview canonical.

## 8. Implementation

Plain static **HTML + CSS + vanilla JS** in `/rjs-cottage/`. This matches how Cloudflare Pages serves the
repo (as-is, no build step), so it deploys at `/rjs-cottage/` with no `_redirects` change.

- GSAP 3.15 + ScrollTrigger + Lenis 1.3 are vendored in `js/vendor/`.
- `scripts/prepare-assets.sh` and `images.mjs` rebuild every asset from the raw sources (ffmpeg + sharp).
- **WhatsApp number:** one constant at the top of `js/main.js` (`CONFIG.whatsapp`). While it is empty, WhatsApp opens with the message and asks the user to pick a contact.

## 9. Key factual sources

| Information | Source |
|---|---|
| Capacity, bedrooms, bathrooms, parking, prices (weekday/Friday/Saturday), facilities | therainvillas.com/rjs-cottage-1, -2, -3 (1 Nov 2026) |
| Booking steps, DP 30%, H-3, H-7 reschedule, check-out 12.00, Rp500k late fee, Rp50k extra guest, quiet hours 22.00, no pets/alcohol | therainvillas.com unit FAQ + /syarat-ketentuan |
| Slope note (Units 2 and 3) | therainvillas.com unit pages |
| ±800 mdpl, ±90 min via Ciawi toll, Cisarua/Tugu Utara | therainvillas.com unit pages |
| Guest types and stories | Instagram @rjscottage "REVIEW" highlight (client screenshots) |
| Social links, Google Maps pin | Client brief |

## 10. Assets used

See `assets/SOURCES.md` for the full list with origins.

- **Client video** (`snapgram.io_mlktakg9hdki.mp4`):
  - Four caption-free windows are cut into a 5.9 s hero reel.
  - Five stills (window, billiard, evening slide, dusk pool, plus the poster).
  - The top 210 px are cropped to remove a third-party watermark.
- **Client testimonials:** 6 of 9 Story screenshots. Three were left out: one was low-resolution, one was a night view not clearly at RJS, and one was a pre-departure photo at a school.
- **Operator photography** (therainvillas.com galleries): 21 photos across the three units. **Third-party, for this exploration only.** Replace with owner-approved photography before production.
- Videos A and C were **not used**. Captions are burned into almost every frame, video C is 360p, and both carry the operator watermark.

## 11. Needs client confirmation before production

1. **Official WhatsApp number.** The site uses a placeholder. Two different public numbers exist.
2. **Exact address and Maps pin per unit.** The site shows area-level "Cisarua, Puncak" only (OTA addresses conflict).
3. **Prices, holiday/long-weekend rates, check-in time, DP and house rules** for *direct* bookings (current data is the operator's).
4. **Pets:** "not allowed" per operator; one OTA says allowed.
5. **Unit 1 details** described from photos: the kids' slide, gazebo and bamboo billiard hut.
   **Unit 2/3 descriptions** ("terang", "teduh", stone-step pool) are copywriting from photos.
6. Whether the thatched hut (gallery, Cottage 3) is on the property.
7. Whether events, makrab or bonfires are allowed. The FAQ says groups are welcome but makes no bonfire claim.
8. **Permission to show guests' Stories** (faces and usernames) on the website.
9. **Logo files.** The header uses a typographic placeholder wordmark.
10. **Photo rights.** Use owner-shot photos and clean (caption-free, horizontal and vertical) video for production.
11. Relationship with The Rain Villas, which affects how booking and contact are presented.

## 12. Next iteration ideas

- **Owner photo/video shoot** (half a day). Capture morning mist, the pool at golden hour, a real group BBQ,
  karaoke at night and a horizontal hero clip. This alone lifts the site more than any code change.
- Add unit-specific galleries and a "compare all three" table if analytics show people jumping between tabs.
- Connect a real availability calendar (Google Calendar or the operator's /availability) as read-only "tanggal terisi" dots.
- An "Acara & gathering" page for offices and communities (capacity across 3 units, packages if offered).
- An English toggle only if analytics show non-Indonesian visitors.
- Replace the placeholder wordmark with the real script logo from the pool-side sign.
