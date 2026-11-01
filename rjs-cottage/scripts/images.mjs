// Image step of prepare-assets.sh. Uses sharp, resolved from SHARP_FROM
// (default: the sibling website-thufeil-cfp project, which already has it installed).
//   node scripts/images.mjs <ext-dir> <testi-dir> <tmp-dir-with-video-stills>
import { createRequire } from 'node:module';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const sharpFrom = process.env.SHARP_FROM ?? resolve(root, '../website-thufeil-cfp/package.json');
const sharp = createRequire(sharpFrom)('sharp');

const [extDir, testiDir, stillsDir] = process.argv.slice(2);
const out = join(root, 'assets');
for (const d of ['images', 'testimonials', 'video']) mkdirSync(join(out, d), { recursive: true });

/** Two responsive sizes per photo: -sm (720 long edge) and -lg (1400 long edge). */
async function photo(src, name, rotate = 0) {
  const base = () => sharp(src).rotate(rotate || undefined);
  await base().resize(1400, 1400, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 74 }).toFile(join(out, 'images', `${name}-lg.webp`));
  await base().resize(720, 720, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(join(out, 'images', `${name}-sm.webp`));
}

// Operator photography — therainvillas.com listing galleries (see assets/SOURCES.md).
const photos = [
  ['u1/00', 'c1-pool-sign'], ['u1/01', 'c1-garden', 90], ['u1/03', 'c1-pool-terrace'],
  ['u1/06', 'c1-bedroom'], ['u1/07', 'c1-billiard'], ['u1/10', 'c1-living'],
  ['u2/00', 'c2-pool-house'], ['u2/02', 'c2-kitchen'], ['u2/03', 'c2-bedroom'],
  ['u2/05', 'c2-living'], ['u2/06', 'c2-lounge'], ['u2/07', 'c2-billiard-terrace'], ['u2/08', 'c2-billiard'],
  ['u3/00', 'c3-living'], ['u3/02', 'c3-pool'], ['u3/03', 'c3-hut'], ['u3/05', 'c3-karaoke'],
  ['u3/07', 'c3-kitchen'], ['u3/09', 'c3-bedroom'], ['u3/10', 'c3-pool-steps'], ['u3/12', 'c3-billiard-view'],
];
for (const [src, name, rot] of photos) await photo(join(extDir, `${src}.webp`), name, rot);

// Stills pulled from the client video (PNG frames written by the shell script).
for (const f of readdirSync(stillsDir).filter((f) => f.startsWith('v-') && f.endsWith('.png') && f !== 'v-forest-pool.png')) {
  const name = f.replace('.png', '');
  await sharp(join(stillsDir, f)).webp({ quality: 78 }).toFile(join(out, 'images', `${name}.webp`));
}
await sharp(join(stillsDir, 'v-forest-pool.png')).webp({ quality: 70 }).toFile(join(out, 'video', 'hero-poster.webp'));

for (const n of [1, 2]) await sharp(join(stillsDir, `poster-tour-${n}.png`)).webp({ quality: 72 }).toFile(join(out, 'video', `tour-cottage-${n}.webp`));

// Testimony screenshots: keep the Story UI, trim only the outer viewer chrome.
const keep = new Set([1, 2, 3, 4, 5, 8]);
const shots = readdirSync(testiDir).filter((f) => f.endsWith('.png')).sort();
for (const [i, f] of shots.entries()) {
  const n = i + 1;
  if (!keep.has(n)) continue;
  const img = sharp(join(testiDir, f));
  const { width, height } = await img.metadata();
  const w = Math.round(width * 0.94), h = Math.round(height * 0.965);
  await sharp(join(testiDir, f))
    .extract({ left: Math.round((width - w) / 2), top: Math.round((height - h) / 2), width: w, height: h })
    .resize(720).webp({ quality: 74 }).toFile(join(out, 'testimonials', `story-${n}.webp`));
}

// Social preview 1200×630.
await sharp(join(extDir, 'u2/00.webp')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(out, 'og-image.jpg'));

console.log('images done');
