# RJS Cottage — Option 02 · "Rame-rame. Rumah sendiri."

Built in response to feedback on Option 01: the soft serif, cream paper, italic accent words and
dotted eyebrow labels read as generic AI design. Option 02 throws all of that out.

Facts and their sources are unchanged. See `../RESEARCH.md`. Assets are shared from `../assets/`
(see `../assets/SOURCES.md`). Only the fonts and favicon live in this folder.

## Direction

**Graphic / Swiss hospitality.** Closer to Casa Bonay, Ace Hotel or Potato Head than to a luxury resort template.
It is executed with the product-UI precision of digmarketingmaul.com (home and products pages were rendered and studied):

| Taken from Maul's site | How it appears here |
|---|---|
| Heavy, tightly tracked grotesk with a coloured full stop | Every H2 ("Pilih cottage.", "FAQ."), the hero and the footer |
| Mono micro labels and numbering | Nav "01 Cottage", card meta "01 · Hingga 20 tamu", times, counters |
| Product cards on colour panels with a circular arrow | Three cottage cards on blue, lime and ink panels with tilted photo prints |
| Hanging cards on a wire | "Satu hari di RJS": draggable rail with pendulum sway |
| Step line ("How it works") | Location route: Jakarta → Tol Jagorawi → Ciawi → Jl. Raya Puncak → RJS |
| Brief form with WhatsApp preview | Booking form with a live WhatsApp chat bubble that updates as you type |
| Rotating circular text badge, header progress line, big "+" FAQ rows, giant gradient wordmark footer | Same patterns, adapted |

These patterns were adapted, not copied. The identity is RJS's own: its colours come from the property.

## Identity

- **Type:** Inter Tight (heavy weights 750–800, tracking −0.055 to −0.075em) for everything, with Geist Mono for labels and numbers.
  Both are self-hosted under the OFL. There is **no serif and no italic** anywhere.
- **Colour:**

  | Token | Hex | Role |
  |---|---|---|
  | Ink | `#0C1116` | Text, dark sections |
  | White / Mist | `#FFFFFF` / `#EEF1F4` | Cool neutrals, never cream |
  | **Pool blue** | `#2257FF` | Taken from the pool tiles in every photo. Big colour fields: marquee, location block, primary CTA |
  | **Slide lime** | `#D7F75B` | Taken from the kids' slide at Cottage 1. Small accents: badges, dots, the CTA arrow |

- **Voice:** short, colloquial Indonesian ("Rame-rame. Rumah sendiri.", "Lihat-lihat dulu.", "Sudah ada semua."),
  confident and specific. No tourism clichés.

## Revision 2 (client feedback)

- **Hero rebuilt around photos, not video:**
  - A full-bleed photo stage with six key shots: pool, pool terrace with slide, billiard hut, living room with karaoke, bedroom, and the stone-step pool.
  - Interaction: wipe transition and slow zoom on every slide, cursor parallax, swipe, prev/next arrows, and a pause button.
  - A **facilities panel** with a real photo for each facility doubles as the slide index. It auto-advances every 6 s with a progress bar and pauses on hover, when off-screen or in a hidden tab.
  - Entrance: the stage opens from a framed card and the headline rises.
- **"Sudah ada semua" merged into the hero panel.** The separate bento section is removed.
- **Rotating "Cek tanggal kosong" badge removed.**
- **CTA wording:** every CTA now says **"Diskusi"**. All of them scroll to the WhatsApp section instead of opening wa.me directly:
  - Header, hero, mobile menu, dock, footer and drawer.
  - The drawer CTA also preselects the cottage.
  - "Diskusi soal rute" also prefills the question field.
  - The form gains an optional "Pertanyaan" field. Its message opens with "saya mau diskusi soal menginap".
- **New "Lihat langsung" video section:**
  - The 6 s ambient reel.
  - A 30 s tour (client video B, trimmed and cropped).
  - A 56 s room tour of Cottage 2 (client video A, trimmed).
  - The two tours play with sound on tap. Only one plays at a time, and they pause off-screen.
- **"Sebelum booking" merged into the FAQ:**
  - Four key-fact cards (check-out 12.00, DP 30%, quiet hours 22.00, Rp50rb per extra guest).
  - Questions grouped into "Booking & pembayaran" and "Selama menginap".
- **Testimonials:** an @rjscottage Instagram button plus an Instagram link under the phone.
- **Copy:** the footer note "Tarif dan kebijakan dapat berubah" is removed. "Karaoke sampai jam 10" is now "Karaoke bareng", and the karaoke card in the day rail no longer mentions a time.

## Page structure (revision 1, superseded where noted above)

1. **Hero:** split layout. Giant two-line headline, CTA visible above the fold. The vertical video fills the right column (on mobile it goes on top). A rotating "Cek tanggal kosong" badge sits on the seam.
2. **Marquee:** blue band naming the activities.
3. **Statement + counters:** 03 cottage · 25 tamu · ±800 mdpl · ±90 menit.
4. **Pilih cottage:**
   - Product cards. Each opens a **drawer** with a photo carousel, specs, the full weekday/Friday/Saturday rates, facilities, the slope note and a unit-specific WhatsApp CTA.
   - Below the cards, a **comparison table** (all facts, scannable).
5. **Satu hari di RJS:** hanging rail with 7 moments, 07.00 → 22.00.
   - Drag, wheel, arrow keys or buttons, with an "01 / 07" counter.
   - Cards sway on a spring.
6. **Sudah ada semua:**
   - A facilities bento: pool photo, big numerals (3 bedrooms, 4 bathrooms, 5 parking), billiard, karaoke, BBQ, kitchen.
   - Then **Sebelum booking**: numbered house rules shown up front.
7. **Kata mereka:** an Instagram-style **Story viewer**.
   - Story bubbles plus a phone frame with segmented progress bars.
   - Auto-advances every 5 s, tap left/right to move, pauses on hover/focus and when off-screen.
   - Uses the real screenshots, unedited.
8. **Galeri:** filter by cottage, uniform 4:3 grid, keyboard lightbox with counter.
9. **Lokasi:** full-bleed blue block with a huge "±90 menit.", a route line that fills on scroll, three notes (altitude, slope, one-way schedule), and Maps plus "ask for directions" CTAs.
10. **Booking:** form with live price estimate and live WhatsApp preview, plus 4 booking steps.
11. **FAQ**, then a **footer** with a giant wordmark. A sticky booking dock appears on mobile.

## Technical

- Static HTML/CSS and **vanilla JS with no dependencies** (Option 01 used GSAP and Lenis). The JS is about 15 KB.
- `prefers-reduced-motion` stops autoplay, the marquee, the badge spin, rail sway, counters, Story auto-advance and reveals.
- Accessibility:
  - `<dialog>` drawer and lightbox with focus return, ARIA tabs for Story bubbles, a labelled rail region with arrow-key support, real form controls, a video pause button, and descriptive alt text.
- Same SEO baseline as Option 01: meta, OG, `LodgingBusiness` JSON-LD with verified fields only, and **`noindex` while it is an exploration**.
- WhatsApp number: `CONFIG.whatsapp` at the top of `js/main.js` (placeholder until the client confirms it).

## Open items

Same list as `../DESIGN-DIRECTION.md` §11: WhatsApp number, exact address, direct-booking prices and rules,
pet policy, photo-observed details (slide, gazebo, bamboo billiard hut), guest consent for Stories, logo, and photo rights.

The card stickers ("Ada perosotan", "Jendela besar", "Teras terbuka") describe what is visible in the photos.
They need the client's confirmation.
