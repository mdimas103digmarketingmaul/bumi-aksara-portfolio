// One-off asset preparation.
// Reads the original files (never modifies them), writes web-ready masters
// into src/assets/ and a social preview image into public/.
//
//   npm run assets                      # default source folder
//   npm run assets -- "/path/to/folder" # custom source folder
//
// The site never reads from the source folder at build time; once this has
// been run, everything it needs lives inside this project.

import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2] ?? path.join(homedir(), 'Downloads', 'Project Website Thufeil');
const out = (...p) => path.join(root, 'src', 'assets', ...p);

if (!existsSync(source)) {
  console.error(`Source folder not found: ${source}`);
  process.exit(1);
}

// The Instagram folder name has a typo in the original download; accept both.
const igDir = ['Postingan Instagram Thufeil', 'Postingan Instaram Thufeil']
  .map((d) => path.join(source, d))
  .find((d) => existsSync(d));

// Testimonial screenshots, in the order they appear on the site.
// Curated so the stories that speak most directly about the experience lead.
const testimonialOrder = [
  'Screenshot at Oct 26 16-32-22.png',
  'Screenshot at Oct 26 16-34-24.png',
  'Screenshot at Oct 26 16-33-08.png',
  'Screenshot at Oct 26 16-34-13.png',
  'Screenshot at Oct 26 16-32-02.png',
  'Screenshot at Oct 26 16-32-13.png',
  'Screenshot at Oct 26 16-32-30.png',
  'Screenshot at Oct 26 16-32-46.png',
  'Screenshot at Oct 26 16-33-54.png',
  'Screenshot at Oct 26 16-33-28.png',
  'Screenshot at Oct 26 16-32-55.png',
  'Screenshot at Oct 26 16-33-44.png',
];

await Promise.all(
  ['profile', 'credentials', 'instagram', 'testimonials'].map((d) => mkdir(out(d), { recursive: true })),
);

// Profile photo: transparent PNG, kept lossless.
await copyFile(path.join(source, 'PhotoProfileThufeil.png'), out('profile', 'thufeil-portrait.png'));

// Certificate: already small (640px); copied untouched so the text stays as sharp as the original.
await copyFile(path.join(source, 'Sertifikat CFP.jpg'), out('credentials', 'sertifikat-cfp.jpg'));

// Instagram posts 1–9, normalised to max 1080px wide.
const igFiles = (await readdir(igDir)).filter((f) => /^\d+\.(jpe?g|png|webp)$/i.test(f));
for (const file of igFiles) {
  const n = String(parseInt(file, 10)).padStart(2, '0');
  await sharp(path.join(igDir, file))
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out('instagram', `post-${n}.jpg`));
}

// Testimonials: multi-MB PNG screenshots → high-quality WebP at native size.
const testimonialDir = path.join(source, 'Testimony');
for (const [i, file] of testimonialOrder.entries()) {
  const n = String(i + 1).padStart(2, '0');
  await sharp(path.join(testimonialDir, file))
    .webp({ quality: 88 })
    .toFile(out('testimonials', `testimoni-${n}.webp`));
}

// Social preview (1200×630).
const W = 1200;
const H = 630;
const portrait = await sharp(path.join(source, 'PhotoProfileThufeil.png'))
  .resize({ height: 560 })
  .toBuffer();
const { width: pw } = await sharp(portrait).metadata();
const panelX = 700;
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F3EEE3"/>
  <rect x="${panelX}" y="120" width="${W - panelX - 64}" height="${H - 120}" fill="#1E5E45"/>
  <rect x="64" y="64" width="40" height="4" fill="#E9B824"/>
  <text x="64" y="112" font-family="Helvetica Neue, Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="3" fill="#4A4F63">GEN-Z FINANCIAL PLANNER</text>
  <text x="64" y="240" font-family="Georgia, serif" font-size="84" fill="#14182B">Thufeil M.</text>
  <text x="64" y="330" font-family="Georgia, serif" font-size="84" fill="#14182B">Tyansah, CFP<tspan font-size="40" dy="-34">®</tspan></text>
  <text x="64" y="430" font-family="Helvetica Neue, Arial, sans-serif" font-size="28" fill="#14182B">Perencana keuangan syariah.</text>
  <text x="64" y="472" font-family="Helvetica Neue, Arial, sans-serif" font-size="28" fill="#14182B">Teman diskusi keuangan tanpa judging.</text>
  <text x="64" y="566" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" fill="#1E5E45">Konsultasi gratis 30 menit</text>
</svg>`;
await mkdir(path.join(root, 'public'), { recursive: true });
await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: Math.round(panelX + (W - panelX - 64 - pw) / 2), top: H - 560 }])
  .jpeg({ quality: 88 })
  .toFile(path.join(root, 'public', 'og-image.jpg'));

console.log('Assets prepared in src/assets and public/og-image.jpg');
