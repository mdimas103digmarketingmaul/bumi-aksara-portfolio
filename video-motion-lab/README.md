# Video Motion Lab

**An interactive dictionary and playground for motion design in video** — Instagram Reels and feed,
TikTok, YouTube Shorts and YouTube, digital ads, product marketing, brand campaigns, UI/product motion,
promos and explainers.

Every technique is a live mini-scene on a **scrubbable timeline**. Each one explains its motion
anatomy, its timing recipe, when to use it and when not to, and ends with a **copyable prompt** for
Claude Code (or any AI coding tool).

- Production: <https://bumi-aksara-portfolio.pages.dev/video-motion-lab/>
- Local: <http://localhost:8000/video-motion-lab/> (see [Run locally](#run-locally))
- Sibling project: [`../web-motion-lab/`](../web-motion-lab/) (web interaction motion)

---

## What is inside

**271 interactive demos covering 400+ named techniques**, in 16 categories plus 8 learning sections.

| # | Category | Demos | Highlights |
| --- | --- | --- | --- |
| 01 | Motion Fundamentals | 15 | fade, slide (4 directions), scale in/out, rotate, combined, stagger, sequential vs overlapping, anticipation, overshoot, follow-through, secondary motion, squash & stretch, arcs |
| 02 | Easing & Physics | 5 | 14-curve easing race, graph inspector, spring/damping, inertia/momentum/friction, ease in context |
| 03 | Typography | 20 | char/word stagger, line & masked reveals, kinetic type, tracking, stretch, rolling, swap, scramble, typewriter, odometer, number impact, marquee, circular & path text, blur reveal, focus pull, highlight sweep |
| 04 | Image & Photography | 16 | Ken Burns, push/pull, pan, parallax, mask/wipe/split/slice reveals, scale punch, float, stack, polaroids, carousel, match cut, collage, freeze frame |
| 05 | Shape & Graphics | 13 | scale/rotate, morph, line draw, motion path, rings, blob, gooey liquid, assembly, burst, confetti, orbit, pulse, waves |
| 06 | Camera & Composition | 11 | dolly vs zoom, pan/tilt, truck/pedestal, orbit, dolly zoom, handheld, shake, whip pan, focus pull, depth parallax, rack focus (2.5D camera over depth layers) |
| 07 | Scene Transitions | 24 | dissolve, dip to black/white, wipes, push, slide, zoom, spin, whip, blur, motion blur, text mask, shape, circular, iris, flash, glitch, RGB split, pixel, mosaic, match cut, object wipe, occlusion, liquid, seamless loop |
| 08 | Product & UI | 20 | device entrance/float/rotate/tilt, in-app scroll, tap, spotlight, zoom detail, UI cards, notifications, sheet/modal, toggles, counter, success, skeleton loading, callouts, exploded view, turntable, hero reveal, floating showcase |
| 09 | Data & Infographics | 17 | counters, progress bars & rings, bar/line/area/donut charts, comparisons, before/after numbers, stat cards, timelines, steps, map pins, flow diagram, network lines, live data pulse |
| 10 | Logo & Brand | 14 | fade/scale, draw, mask, morph, assemble, coin spin, stamp, neon glow, shimmer, particle assemble, shape reveal, pattern, colour wipe, outro |
| 11 | Social Media Hooks | 16 | question, number, problem, statement, news-style, search bar, chat, notification, comment reply, before/after, countdown, fast type, pattern interrupt, zoom punch, visual SFX, stop-scroll frame |
| 12 | Promo & Advertising | 17 | badges, discount, price reveal, old → new price, limited time, flip timer, feature stack, benefits, promo card, voucher, coupon tear, comparison, testimonial, rating, social proof, offer highlight, honest urgency |
| 13 | CTA & End Cards | 13 | button entrance, pulse, shine, arrow, swipe-up, tap cue, app install, QR (placeholder), URL, handle, logo/product end cards, looping end card |
| 14 | Cinematic Effects | 23 | grain, vignette, letterbox, light leak, lens flare, bloom/glow, chromatic aberration, RGB split, motion/directional blur, DoF, bokeh, dust, flicker, film burn, scan lines, VHS, digital noise, glitch, exposure flash, colour wash, gradient lighting, shadow & reflection sweeps |
| 15 | Advanced / Experimental | 20 | WebGL: noise/image/liquid/ripple/wave displacement, glass refraction, shader transition, procedural noise, kaleidoscope, datamosh-inspired · Canvas: particle system/assemble/dissolve, fluid-like swirl, generative background, reactive grid, tunnel, infinite zoom, pixel sort, mesh warp |
| 16 | Motion Recipes | 10 | full compositions: premium product ad, fast social hook, fintech promotion, food ad, app feature demo, editorial reel, energetic promo, cinematic brand piece, infographic explainer, seamless loop |

Learning sections (also with live demos):

| | Section | Content |
| --- | --- | --- |
| A | Motion Principles | 16-term glossary (timing, spacing, easing, anticipation… balance) + bad-vs-better comparisons for timing, spacing, staging, weight, direction, contrast |
| B | How Fast Should Motion Be? | duration table (micro → cinematic), duration comparison, distance & size vs duration |
| C | Motion Hierarchy | hero → headline → copy → background → CTA ladder, bad vs better |
| D | Motion Personalities | premium, energetic, playful, corporate, cinematic, tech, editorial on one layout |
| E | Social Media Motion Guide | hook/context/value/CTA, first frame / first second / first 3 seconds, safe-zone guide + placement demo |
| F | Music, Rhythm & Pacing | beat sync (beat hit, off-beat, build-up, drop, accent), speed ramp, hold frames, visual rhythm |
| G | Timeline Thinking | `gsap.timeline()` vocabulary and a position-parameter explorer with matching code |
| H | Motion Prompt Builder | 13 fields → a complete, copyable prompt |

## How every demo is described

| Field | Meaning |
| --- | --- |
| Name · aliases | What it is called, and what else it is called |
| Live preview | The motion itself, on a stage in the chosen format |
| Motion anatomy | Trigger · Target · Transformation · Timing · Easing · Sequence |
| What it does / Visual character | Plain explanation + tone chips (premium, energetic, editorial…) |
| Good for / Avoid when | Use cases and anti-patterns |
| Timing recipe | Generated from the demo's real tracks: event, window, ease, **GSAP-style position** |
| Prompt recipe | A reusable prompt, often variant-specific |

## Playback system

Every stage has a transport: **Play / Pause, Restart (jump to 0), Replay, frame step (±1/30s),
scrubber, current time / duration, speed (0.5× / 1× / 1.5× / 2×)**. Below it, a mini timeline shows
each event as a bar (markers for cuts and beats, stripes for holds, segmented bars for staggers);
drag the lanes to scrub. **Study** opens a large focus view with all explanations, prev/next
navigation and keyboard control.

Keys on a focused stage: `Space`/`K` play-pause · `←`/`→` frame step · `Shift`+arrows 0.5s · `R`
replay · `Home` start. In Study mode `[` / `]` go to the previous/next demo, `Esc` closes.

Global controls (header): **Format** 9:16 (default) / 4:5 / 1:1 / 16:9 · **Speed** · **Safe zone**
on/off · **Labels** (shows the active timeline events on the stage) · **Stage** dark/light · **Loop**
· **Motion** on/reduced · Play visible / Pause all / Replay visible. Settings persist in
`localStorage`.

### Format selector and safe zones

Stages are CSS size containers; scenes are laid out with container units (`cqmin`, `cqw`, `cqh`), so
the same demo adapts to every format. Comparison studies use a fixed format (marked “Fixed 16:9”).

The safe-zone overlay is an **approximate teaching aid**, not a platform spec:

- **9:16**: top ≈12% (account, tabs, title), bottom ≈24% (caption, CTA, audio), right ≈15% between
  40–76% height (action buttons), plus the centre safe area.
- **16:9**: action-safe ≈93%, title-safe ≈90%, bottom ≈15% for player controls/captions.
- **4:5 / 1:1**: title-safe ≈90% and a central guide, since grid previews crop edges.

Platforms change their UI and differ per device — check current specs before final delivery.

## Architecture

```text
video-motion-lab/
├── index.html                 # page shell, header controls, sidebar, study dialog, script order
├── README.md
├── css/
│   ├── styles.css             # design tokens, layout, header, sidebar, cards, tabs, study dialog
│   ├── stage.css              # stage + formats, safe zone, HUD, transport, mini timeline
│   ├── scenes.css             # scene building blocks (type, phone/app UI, products, logo, layers)
│   ├── motion.css             # per-demo styles, grouped by category
│   └── learn.css              # learning blocks, prompt builder, learn demo styles
├── js/
│   ├── core/
│   │   ├── utils.js           # VML namespace, maths, seeded random, noise, easing & springs, settings
│   │   ├── timeline.js        # track model with GSAP-style positions, progress per frame
│   │   ├── stage.js           # demo registry, Scene runtime (ctx), style writer, safe-zone markup
│   │   ├── assets.js          # placeholder assets, motion-blur & RGB-split SVG filters, grain
│   │   ├── gl.js              # one shared WebGL context for every shader demo
│   │   └── playback.js        # single rAF scheduler, Player (stage + transport + timeline)
│   ├── demos/                 # one file per category (fundamentals.js … recipes.js)
│   ├── learn/                 # principles.js, rhythm.js, guides.js, prompt-builder.js
│   └── app.js                 # builds sections/cards, search & filter, controls, Study, scrollspy
└── assets/
    ├── images/                # 9 procedural SVG “photos” (no stock or real people)
    └── svg/                   # generic products (serum, can, box, pouch) + favicon
```

Classic scripts loaded with `defer` (same convention as `web-motion-lab`): no build step, no modules.

### The core idea: motion as a pure function of time

A demo never stores animation state between frames. Its `render(t, c)` computes the look from the
time `t` and per-track progress, so **pause, scrub, speed changes, frame stepping and looping are
exact** for DOM, SVG, Canvas and WebGL alike. Even particles, confetti, the fluid swirl and the
tunnel are computed analytically from time.

### Technology

- HTML, CSS (container queries, `clip-path`, masks, 3D transforms, blend modes), vanilla JavaScript.
- SVG (strokes, morphs, text on path, filters for directional blur and RGB split).
- Canvas 2D (particles, noise, pixel sort, mesh warp…) and WebGL 1 (fragment shaders).
- Google Fonts: Geist, Geist Mono, Instrument Serif, Anton. Without them, system fallbacks work.

**No JavaScript libraries.** GSAP was considered: its timelines would work well for authoring, but a
small deterministic engine was enough here, keeps scrubbing exact for canvas/WebGL too, and keeps the
mechanics readable. The track model deliberately uses **GSAP's position syntax** (`"<"`, `">"`,
`"-=0.3"`, `"+=0.4"`, stagger), every Timing recipe shows that column, and section G maps the
vocabulary to `gsap.timeline()`, so every demo can be rebuilt with GSAP in production.

## Adding a demo

Add a `VML.demo({...})` call to the matching file in `js/demos/` (or `js/learn/`). Cards, numbering,
search, filters, timeline and recipe tabs are generated automatically.

```js
VML.demo({
  id: 'my-demo', cat: 'typography', name: 'My Demo', aka: ['Other name'],
  tags: ['text'],                  // filters: text image object camera transition ui brand social advanced
  char: ['Premium'],               // visual character chips
  what: '…', good: ['…'], avoid: '…',
  anatomy: ['Trigger', 'Target', 'Transformation', 'Timing', 'Easing', 'Sequence'],
  // [key, label, position, duration, ease, extra] — position uses GSAP syntax
  tracks: [
    ['title', 'Title', 0.2, 0.6, 'expo.out'],
    ['sub', 'Subline', '-=0.3', 0.5, 'premium'],
    ['rows', 'Rows ×4', '>', 0.5, 'premium', { n: 4, each: 0.08 }],  // stagger
  ],
  html: `<div class="stackc"><b data-r="title" class="t-sans">Hello</b><span data-r="sub">world</span></div>`,
  render(t, c) {
    c.set(c.$.title, { y: 6 * (1 - c.p.title), o: c.p.title });  // y in cqmin, o = opacity
    c.set(c.$.sub, { o: c.p.sub });
  },
  prompt: 'Reusable prompt…',
  // optional: variants: [['a', 'Variant A'], …] (fields can be functions of the variant),
  //           fixed: '16:9', wide: true, dur, poster, note, init(c), resize(c), destroy(c)
});
```

Context helpers: `c.p.key` eased progress · `c.r.key` linear progress · `c.st(key, i)` stagger item
· `c.at(start, dur, ease)` ad-hoc window · `c.speed(key)` rate of change (for stretch/blur) ·
`c.$.name` / `c.$$.name` refs from `data-r` · `c.set(el, { x, y, xw, yh, xp, yp, s, sx, sy, r, rx,
ry, o, blur, bright, clip, dash, css })` · `c.canvas(el)` DPR-capped canvas · `c.W`, `c.H`, `c.u`.

## Run locally

From the **repository root**:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/video-motion-lab/>. VS Code Live Server also works (open
`video-motion-lab/index.html`). If you edit CSS/JS and do not see changes, hard-reload
(`Cmd+Shift+R`) — the simple Python server lets the browser cache files.

## Deployment (Cloudflare Pages)

The repository root is deployed as static files without a build step, so this folder is served at
`/video-motion-lab/` with **no configuration changes**. All paths are relative (`css/…`, `js/…`,
`assets/…`; the one CSS mask uses `../assets/…` relative to the stylesheet). The homepage and
`web-motion-lab/` are untouched. The page sets `noindex` because it is a personal learning space.

## Performance

- **One** `requestAnimationFrame` loop drives every running player; a player runs only while it is
  playing, visible (IntersectionObserver) and the tab is in the foreground. Off-screen demos cost
  nothing.
- Scenes mount lazily as you approach them (700px margin); canvas setup and image loading happen at
  mount.
- All shader demos share a **single WebGL context** (browsers cap live contexts), render at CSS-pixel
  resolution and copy into their own canvas.
- Canvas DPR is capped at 1.5 (1 for noise-heavy demos). Assets are small SVGs (~1–3 KB each); there
  are no video files. Total folder ≈1 MB.
- Heavy looks (CSS blur filters on full-frame images, SVG blur filters) are kept to the demos that
  teach them. On low-end devices, the cinematic section is the most expensive one to scroll through.

## Reduced motion and accessibility

- `prefers-reduced-motion` is respected on first visit: demos do not autoplay, they show a
  representative still frame with a Play button. The header **Motion: On / Reduced** toggle
  overrides it — this is a learning tool, so you can always play a demo deliberately.
- Flash-type effects are short and infrequent; urgency examples avoid dark patterns.
- Stages are focusable with an accessible name and keyboard controls; scenes are `aria-hidden`
  (they are visual illustrations — every demo has a full text explanation).
- Pointer-driven behaviour is limited to the reactive-grid demo and is scoped to its stage.

## Honesty notes

- Placeholder brands only (AKSA, SÉRA, FIZZ, KRIUK, KOPI 01, Wallet). The QR code is a random pattern
  that encodes nothing; URLs use placeholder domains.
- Approximations are labelled on their cards: match cut, gooey liquid shape, liquid transition,
  camera orbit (2.5D), dolly zoom (concept), lens flare, exploded view, product turntable, coupon
  tear, glass refraction, fluid-like motion, mesh warp, infinite zoom, pixel sort, and the
  **datamosh-inspired** transition (real datamoshing manipulates video codec frames).
- Fintech copy uses illustrative numbers and an explicit legal-text placeholder.
