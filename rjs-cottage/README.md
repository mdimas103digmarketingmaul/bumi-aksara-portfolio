# RJS Cottage — website explorations

- **Option 01** (this folder): warm editorial. http://localhost:5190/rjs-cottage/
- **Option 02** (`option-02/`): graphic/Swiss, vanilla JS. http://localhost:5190/rjs-cottage/option-02/ (see `option-02/DESIGN-DIRECTION.md`)

## Option 01

Official-site concept for **RJS Cottage**, three private-pool cottages in Cisarua, Puncak.
Static HTML/CSS/JS with no build step. Cloudflare Pages serves it as-is at `/rjs-cottage/`.

- `RESEARCH.md`: verified facts, sources, conflicts and open questions
- `DESIGN-DIRECTION.md`: concept, art direction, UX decisions, what needs client confirmation
- `assets/SOURCES.md`: origin and rights status of every asset

## Preview

From the repository root:

```bash
python3 -m http.server 5190
# open http://localhost:5190/rjs-cottage/
```

Any static server works. Use one rather than opening `index.html` from disk, so video and fonts load reliably.

## Edit

| What | Where |
|---|---|
| WhatsApp number, prices, capacity (enquiry builder) | `js/main.js`, the `CONFIG` object at the top |
| Copy, prices shown in cottage panels, FAQ | `index.html` |
| Colours, type scale, spacing | `css/style.css`, `:root` tokens |
| Rebuild images, video, fonts and vendor scripts | `EXT_DIR=… FONT_DIR_INSTRUMENT=… bash scripts/prepare-assets.sh` (see script header) |

Before launch, remove `<meta name="robots" content="noindex, nofollow">` and update the canonical/OG URLs in `index.html`.
