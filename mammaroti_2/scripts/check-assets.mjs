import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
const references = new Set();
for (const file of files(path.join(root, 'src'))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:["'(])(\/(?:images|icons|logos)\/[^"'`)$\s]+)/g)) references.add(match[1]);
}
const productSource = fs.readFileSync('src/data/products.ts', 'utf8');
for (const match of productSource.matchAll(/"id": "([^"]+)"/g)) references.add(`/images/label-${match[1]}.svg`);
for (const variant of ['original', 'taro']) references.add(`/images/${variant}-dough.webp`);
for (const name of ['halal', 'pengayoman', 'ifbc']) references.add(`/logos/${name}.webp`);
for (const name of ['crunchy', 'melt', 'joy', 'sweet']) references.add(`/icons/arrow-${name}.svg`);
for (const ref of references) assert.ok(fs.existsSync(path.join(root, 'public', ref)), `Missing asset: ${ref}`);
assert.equal([...productSource.matchAll(/"id":/g)].length, 16, '16 products must be present');
const htmlPath = '.next/server/app/index.html';
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const id of ['beranda', 'original', 'taro', 'menu', 'outlet', 'kontak']) assert.ok(html.includes(`id="${id}"`), `Missing section: ${id}`);
  assert.equal((html.match(/class="news-image"/g) || []).length, 5, '5 news placeholders must be present');
}
console.log(`PASS: ${references.size} asset references, 16 products, available pre-rendered section checks.`);
