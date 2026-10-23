# Web Motion Lab

**An interactive dictionary of motion, interaction and visual effects for modern websites.**

A personal learning laboratory: 50 working demos, each broken down the same way, plus a
vocabulary, a prompt builder and guidance on motion intensity and hierarchy. The goal is to
recognise effects, name them precisely, and write better prompts for AI coding tools.

- Production: <https://bumi-aksara-portfolio.pages.dev/web-motion-lab/>
- Local: <http://localhost:8000/web-motion-lab/> (see [Run locally](#run-locally))

---

## How every effect is described

Each card answers the same questions, so the thinking pattern stays consistent:

| Field | Meaning |
| --- | --- |
| **Trigger** | What starts the motion (mouse, hover, scroll, click, load, time) |
| **Target** | What actually moves |
| **Transform** | Which property changes (translate, scale, rotate, opacity, blur, clip-path…) |
| **Character** | How it feels over time (ease-out, spring, inertia, linear, scrubbed, stagger…) |
| Complexity / Technology | How hard it is and what it is built with |
| What it does / Good for | Plain-language explanation and use cases |
| **Prompt recipe** | A reusable, copyable prompt for AI tools |

Many demos also show a live **readout** (progress, angles, offsets) so you can see the numbers
behind the motion.

## Categories (50 demos)

| # | Category | Demos |
| --- | --- | --- |
| 01 | Cursor & Pointer | Spotlight, Glow, Follower, Trail, Mouse Parallax, 3D Tilt, Magnetic Button, Proximity/Repulsion |
| 02 | Hover Interactions | Hover Lift, Sheen, Image Zoom & Pan, Mask/Clip-path Reveal, Rolling Text, Animated Border |
| 03 | Scroll Motion | Triggered Reveal, Layered Parallax, Scrubbed Animation, Pinned Storytelling, Vertical→Horizontal Gallery, Reactive Marquee, Velocity Skew, Scroll Zoom, Scroll Rotation, Progress Indicator |
| 04 | Typography Motion | Split Text Stagger, Masked Lines, Typewriter, Scramble/Decode, Gradient Text, Kinetic Typography |
| 05 | Image & Media | Ken Burns, Curtain/Wipe Reveal, Image Hover Reveal, Blur-to-Focus |
| 06 | Ambient Motion | Floating/Bobbing, Orbit, Aurora/Mesh Gradient, Morphing Blob, Animated Grain |
| 07 | Microinteractions | Ripple, Icon Morph, Spring Toggle, Accordion |
| 08 | 3D & Perspective | Perspective Card, 3D Layer Stack, 3D Carousel |
| 09 | Advanced / Experimental | Particle Field, RGB Split, Glass/Lens (approximation), WebGL Displacement |

Learning sections after the demos:

- **A · Motion Vocabulary** — 25 terms plus an easing playground (linear, ease-in/out, overshoot, spring, elastic).
- **B · How to Describe Motion** — the Target + Trigger + Transformation + Relationship + Character + Intensity + Fallback formula, bad vs. better prompts, and a live prompt builder.
- **C · Motion Intensity** — Level 1 Subtle, Level 2 Expressive, Level 3 Experimental.
- **D · Signature Motion** — motion hierarchy shown on an interactive wireframe.

## Structure

```text
web-motion-lab/
├── index.html               # All markup: hero, directory, 50 demo stages, learning sections
├── css/
│   ├── styles.css           # Design tokens, layout, header, sidebar, effect cards, reduced-motion rules
│   ├── effects.css          # Demo styles, one block per category, scoped to each stage
│   └── learn.css            # Hero specimens, easing playground, prompt builder, levels, signature
├── js/
│   ├── core.js              # window.Lab: loops, scroll manager, springs, pointer + text helpers, settings
│   ├── cursor-effects.js    # 01 — definitions (content + init) for each effect
│   ├── hover-effects.js     # 02
│   ├── scroll-effects.js    # 03
│   ├── text-effects.js      # 04
│   ├── media-effects.js     # 05
│   ├── ambient-effects.js   # 06
│   ├── micro-effects.js     # 07
│   ├── perspective-effects.js # 08
│   ├── advanced-effects.js  # 09 (Canvas 2D + WebGL)
│   ├── learn.js             # Hero anatomy map, easing, vocabulary filter, prompt builder, signature
│   └── app.js               # Builds the cards, initialises demos, search/filter, controls, copy, scrollspy
├── assets/                  # Lightweight SVG artworks + favicon (no external images)
└── README.md
```

Scripts are plain classic scripts loaded with `defer` in order: `core.js` → category files →
`learn.js` → `app.js`. There is no build step and no ES-module requirement, so the page also
works when opened straight from the file system.

## Technologies

- Semantic HTML, modern CSS (custom properties, `clip-path`, `@property`, `linear()` easing,
  `position: sticky`, 3D transforms, `mask-composite`), vanilla JavaScript.
- Canvas 2D (trail, particles, grain texture) and raw WebGL (displacement shader) without a library.
- `IntersectionObserver`, `ResizeObserver`, `requestAnimationFrame`, passive listeners.

### External dependencies

| Dependency | Why |
| --- | --- |
| Google Fonts: **Geist**, **Geist Mono**, **Instrument Serif** | Typography only. If the fonts fail to load, system fonts are used and everything still works. |

**No JavaScript libraries.** GSAP + ScrollTrigger were considered, but every scroll effect here
(pin, scrub, horizontal gallery, velocity) is built with one shared scroll listener in `core.js`,
which keeps the mechanics visible for learning. The prompt recipes mention GSAP where it is the
common production choice.

## Run locally

From the **repository root** (not from inside `web-motion-lab/`):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/web-motion-lab/>.

Alternatives:

- **VS Code Live Server**: right-click `web-motion-lab/index.html` → *Open with Live Server*,
  then open `http://127.0.0.1:5500/web-motion-lab/` (the port Live Server reports).
- Opening `index.html` directly also works, because scripts are not ES modules. A local server
  is still recommended so clipboard copy behaves like production.

## Deployment (Cloudflare Pages)

The repository root is deployed as static files, with no build command. Any folder with an
`index.html` is served at its path, so this lab is available at `/web-motion-lab/` with **no
configuration changes**. `/web-motion-lab` (no trailing slash) redirects to the slash version,
the same as the other project folders. All asset paths are relative (`css/…`, `js/…`,
`assets/…`), so the lab works on localhost, inside the subdirectory, and in production.

The page sets `<meta name="robots" content="noindex">` because it is a personal learning space,
not part of the portfolio's public content. Remove that tag if you want it indexed.

## Adding a new effect

1. **Markup**: add an article to the right category section in `index.html`. Only the stage is
   needed, because `app.js` builds the title, anatomy, text and prompt around it:

   ```html
   <article class="effect" id="my-effect" data-effect="my-effect">
     <div class="stage my-effect"> …demo elements… </div>
   </article>
   ```

   Add `effect--wide` to the article for demos that need the full width (scroll demos).

2. **Styles**: add a scoped block to `css/effects.css` (`.my-effect …`). Use `var(--k)` to make
   distances follow the global intensity control.

3. **Definition + behaviour**: add a `Lab.define({...})` call to the matching category file:

   ```js
   Lab.define({
     id: 'my-effect', category: 'hover', name: 'My Effect', aliases: ['Other name'],
     triggers: ['hover'],            // mouse | hover | scroll | click | load | time
     level: 1, complexity: 1,        // 1–3
     pointer: false,                 // true shows "Best experienced with a pointer"
     reducedNote: 'Static in reduced mode', // optional badge under reduced motion
     hint: 'What to try',
     anatomy: { trigger: '…', target: '…', transform: '…', character: '…' },
     tech: '…', does: '…', goodFor: ['…'], prompt: '…',
     note: 'Optional honesty note (e.g. approximations)',
     init(stage) {
       // attach listeners to `stage` only; use Lab.loop / Lab.onScroll for animation
       return { replay() { /* optional: adds a Replay button */ } };
     },
   });
   ```

Numbering, the sidebar counts, search and trigger filtering pick up the new effect
automatically.

### Core helpers (`window.Lab`)

| Helper | Use it for |
| --- | --- |
| `Lab.loop(stage, tick, { continuous })` | rAF loop that only runs while the stage is visible and the tab is active. Non-continuous loops sleep when `tick` returns `false`; call `.wake()` on input. |
| `Lab.onScroll(el, fn, { mode })` | Scroll-linked progress from one shared listener. `mode: 'pin'` gives sticky-section progress; `el = null` gives page progress. |
| `Lab.pointer(el, { move, enter, leave, down })` | Pointer events scoped to an element, with local and normalised (−1…1) coordinates. |
| `Lab.spring()`, `Lab.damp()`, `Lab.lerp()`, `Lab.clamp()`, `Lab.map()` | Motion maths (frame-rate independent). |
| `Lab.split(el, 'chars' \| 'words')` | Accessible text splitting (visually-hidden copy + `aria-hidden` spans). |
| `Lab.scramble()`, `Lab.magnet()` | Reusable text decode and magnetic pull. |
| `Lab.onEnter()`, `Lab.whenNear()`, `Lab.onVisible()` | Viewport triggers, lazy start, visibility. |
| `Lab.reduced`, `Lab.k`, `Lab.onChange()` | Read the global Motion / Intensity settings and react to changes. |

## Performance notes

- Effects animate `transform`, `opacity` and occasionally `filter`/`clip-path`. Layout properties
  are avoided (the accordion uses `grid-template-rows: 0fr → 1fr`).
- Every rAF loop is tied to its stage: it stops when the stage leaves the viewport or the tab is
  hidden, and interaction loops sleep once their springs settle.
- CSS loops inside off-screen stages are paused via `.stage:not(.is-active)`.
- One passive scroll listener drives every scroll effect, throttled to one update per frame.
- Canvas and WebGL demos start lazily when you scroll near them, cap `devicePixelRatio`, and skip
  work when off-screen. Images are lightweight SVGs with `loading="lazy"`.
- Blend modes and backdrop filters are used sparingly. The grain overlay uses alpha speckles
  instead of `mix-blend-mode` so it stays cheap to composite.

## Reduced motion and accessibility

- The lab respects `prefers-reduced-motion` on first visit. The header **Motion: On / Reduced**
  toggle overrides it (saved in `localStorage`), so you can still study animations deliberately.
- Under *Reduced*, CSS animations and transitions resolve instantly, ambient loops render a still
  frame, scroll-linked effects show static or final states, the horizontal gallery becomes a native
  swipe carousel, and affected demos show a small badge explaining what changed.
- Hover effects also respond to `:focus-visible`; demos with keyboard needs support it (carousel
  arrows, accordion, switches with `role="switch"`, icon buttons with `aria-pressed`/labels).
- Split or scrambled text keeps a real text copy for screen readers. Decorative layers are
  `aria-hidden`.
- Pointer-only demos are labelled **“Best experienced with a pointer”** and have tap fallbacks on
  touch devices. Listeners are scoped to stages, so custom cursors never affect the rest of the page.
- A skip link, visible focus rings and high-contrast text on a dark palette are built in.

## Honesty notes

- **#49 Glass / Refraction** is an approximation (a magnified clone plus highlights). Real
  refraction bends each light ray per pixel and requires a shader.
- **#50 Displacement** is a real displacement shader, simplified: the map is procedural noise and
  the image is a canvas-drawn texture.
