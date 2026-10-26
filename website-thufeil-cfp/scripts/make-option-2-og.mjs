// Generates public/option-2/og-image.jpg (1200×630) in the option-2 visual language.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;
const portrait = await sharp(path.join(root, 'src/assets/profile/thufeil-portrait.png')).resize({ height: 540 }).toBuffer();
const { width: pw } = await sharp(portrait).metadata();

const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="62%" cy="78%" r="55%">
      <stop offset="0" stop-color="#344280" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#080c1a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#080c1a"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="600" y="330" text-anchor="middle" font-family="Helvetica Neue" font-stretch="condensed" font-weight="900" font-size="330" letter-spacing="-4" fill="#f3efe6">THUFEIL</text>
</svg>`;
const front = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#080c1a" stop-opacity="0"/>
      <stop offset="1" stop-color="#080c1a" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#s)"/>
  <circle cx="64" cy="62" r="5" fill="#f7c21b"/>
  <text x="80" y="68" font-family="Helvetica Neue" font-size="18" font-weight="600" letter-spacing="3" fill="#f7c21b">GEN-Z FINANCIAL PLANNER</text>
  <text x="1136" y="68" text-anchor="end" font-family="Helvetica Neue" font-size="18" fill="#f3efe6" fill-opacity="0.7">Perencana keuangan syariah · CFP® · AWPs®</text>
  <text x="58" y="566" font-family="Helvetica Neue" font-stretch="condensed" font-weight="900" font-size="54" fill="#f7c21b">M. TYANSAH, CFP®</text>
  <text x="60" y="600" font-family="Helvetica Neue" font-size="20" fill="#f3efe6">Teman ngobrol soal uang, tanpa judging.</text>
  <rect x="860" y="548" width="282" height="54" rx="27" fill="#f7c21b"/>
  <text x="1001" y="582" text-anchor="middle" font-family="Helvetica Neue" font-size="19" font-weight="600" fill="#0a0e1c">Konsultasi gratis 30 menit</text>
</svg>`;

await sharp(Buffer.from(bg))
  .composite([
    { input: portrait, left: Math.round(W / 2 - pw / 2 + 60), top: H - 540 },
    { input: Buffer.from(front), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(path.join(root, 'public/option-2/og-image.jpg'));
console.log('public/option-2/og-image.jpg written');
