import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const project = fileURLToPath(new URL('..', import.meta.url));
const repo = path.resolve(project, '..');
const output = path.join(project, '.pages-preview');
const files = execFileSync('git', ['ls-files', '-z'], { cwd: repo, encoding: 'utf8' }).split('\0').filter(Boolean);
// Only this generated preview directory is replaced. Never touch the portfolio's source.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) {
  if (file.startsWith('humanies-exploration/') || file.endsWith('.DS_Store')) continue;
  const source = path.join(repo, file);
  if (!(await stat(source).catch(() => null))?.isFile()) continue;
  const target = path.join(output, file);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target);
}
await cp(path.join(project, 'deploy'), path.join(output, 'humanies-exploration/deploy'), { recursive: true });
await cp(path.join(project, 'server'), path.join(output, 'humanies-exploration/server'), { recursive: true });
for (const wrapper of ['functions/humanies-exploration/api/weather/[[path]].js', 'functions/humanies-exploration/api/petabencana.js']) {
await mkdir(path.dirname(path.join(output, wrapper)), { recursive: true });
await cp(path.join(repo, wrapper), path.join(output, wrapper));
}
await cp(path.join(repo, '_routes.json'), path.join(output, '_routes.json'));
const routes = JSON.parse(await readFile(path.join(output, '_routes.json'), 'utf8'));
if (routes.include.some(route => !['/humanies-exploration/api/weather', '/humanies-exploration/api/weather/*', '/humanies-exploration/api/petabencana'].includes(route))) throw new Error('Unexpected Functions scope');
await writeFile(path.join(output, '.preview-manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), staticFiles: files.length, source: 'Tracked portfolio static files + current Humanies deploy + actual root Functions configuration' }, null, 2));
console.log(`Pages preview prepared at ${output}. No deploy performed.`);
