const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { NextRequest } = require('next/server');

// Exercise the actual route without starting a server or contacting an external service.
const filename = path.resolve('src/app/api/contact/route.ts');
const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const route = new Module(filename, module);
route.filename = filename;
route.paths = module.paths;
route._compile(code, filename);
const { POST } = route.exports;
const valid = { name: 'Test', email: 'test@example.com', message: 'Pesan pengujian', website: '' };
const run = (body, origin = 'http://localhost:3000') => POST(new NextRequest('http://localhost:3000/api/contact', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) }));

(async () => {
  const priorURL = process.env.CONTACT_WEBHOOK_URL;
  const priorFetch = global.fetch;
  try {
    delete process.env.CONTACT_WEBHOOK_URL;
    const fallback = await run(valid);
    assert.equal(fallback.status, 200); assert.equal((await fallback.json()).mode, 'email');
    assert.equal((await run({ ...valid, email: 'bad' })).status, 400);
    assert.equal((await run({ ...valid, name: ' ' })).status, 400);
    assert.equal((await run({ ...valid, message: 'x'.repeat(3001) })).status, 400);
    assert.equal((await run({ ...valid, website: 'spam' })).status, 400);
    assert.equal((await run(valid, 'https://untrusted.example')).status, 403);
    assert.equal((await run('{broken')).status, 400);
    assert.equal((await run('x'.repeat(16001))).status, 413);
    process.env.CONTACT_WEBHOOK_URL = 'https://receiver.example/form';
    global.fetch = async (url, options) => {
      assert.equal(url, 'https://receiver.example/form');
      assert.deepEqual(JSON.parse(options.body), { name: valid.name, email: valid.email, message: valid.message });
      return new Response(null, { status: 204 });
    };
    assert.equal((await (await run(valid)).json()).mode, 'sent');
    global.fetch = async () => new Response(null, { status: 500 });
    assert.equal((await run(valid)).status, 502);
    console.log('PASS: 10 contact route checks. No external messages sent.');
  } finally {
    global.fetch = priorFetch;
    if (priorURL === undefined) delete process.env.CONTACT_WEBHOOK_URL; else process.env.CONTACT_WEBHOOK_URL = priorURL;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
