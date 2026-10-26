/* Optional development verification; uses an existing Playwright installation.
   PLAYWRIGHT_PATH=/absolute/path/to/playwright node verify.cjs
   BROWSER_PATH=/absolute/path/to/chromium overrides the installed browser. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.VERIFY_OUTPUT || '/tmp/device-motion-verification';
const visualOnly = process.argv.includes('--visual-only');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'no-preference' });
  const errors = [], failedRequests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failedRequests.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`); });
  const checks = [];
  async function check(name, fn) {
    if (visualOnly) return;
    try { await fn(); checks.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
    catch (e) { checks.push({ name, result: 'FAIL', error: e.message }); console.error(`FAIL ${name}: ${e.message}`); }
  }
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/');
  await page.waitForFunction(() => window.MotionLab?.playback?.records.length === 42);
  await page.waitForFunction(() => MotionLab.playback.records[0].visible);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(output, 'desktop.png') });
  await check('42 studies across 10 categories', async () => {
    assert.equal(await page.locator('.motion-card').count(), 42);
    assert.equal(await page.locator('.motion-section').count(), 10);
  });
  await check('Every study animates, pauses, and replays', async () => {
    const ids = await page.locator('.motion-card').evaluateAll(cards => cards.map(c => c.dataset.motion));
    for (const id of ids) {
      const card = page.locator(`#study-${id}`);
      await card.scrollIntoViewIfNeeded();
      await page.waitForFunction(id => MotionLab.playback.records.find(r => r.definition.id === id).visible, id);
      await card.locator('[data-replay]').click();
      await page.waitForTimeout(90);
      const before = await card.evaluate(el => el.getAnimations({ subtree: true }).map(a => a.currentTime));
      assert(before.some(t => t > 0), `${id} did not start`);
      await card.locator('[data-pause]').click();
      await page.waitForTimeout(30);
      const paused = await card.evaluate(el => el.getAnimations({ subtree: true }).map(a => a.currentTime));
      await page.waitForTimeout(90);
      const after = await card.evaluate(el => el.getAnimations({ subtree: true }).map(a => a.currentTime));
      assert.deepEqual(after, paused, `${id} did not pause fully`);
      await card.locator('[data-replay]').click();
      await page.waitForTimeout(60);
      const resumed = await card.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === 'running'));
      assert(resumed, `${id} did not replay`);
    }
  });
  await check('Global Pause freezes all active animations', async () => {
    await page.locator('#pause-all').click();
    const before = await page.evaluate(() => document.getAnimations().map(a => a.currentTime));
    await page.waitForTimeout(120);
    assert.deepEqual(await page.evaluate(() => document.getAnimations().map(a => a.currentTime)), before);
  });
  await check('All speed choices apply to existing and new animations', async () => {
    for (const rate of ['0.5', '1', '1.5']) {
      await page.selectOption('#speed', rate);
      await page.waitForTimeout(50);
      const rates = await page.evaluate(() => MotionLab.playback.records.flatMap(r => (r.handles || []).map(a => a.playbackRate)));
      assert(rates.every(v => v === Number(rate)), `Playback rate ${rate}`);
    }
    await page.selectOption('#speed', '1');
  });
  await check('Play All and Replay All resume visible studies only', async () => {
    await page.locator('#play-all').click();
    await page.locator('#replay-all').click();
    await page.waitForTimeout(100);
    assert(await page.evaluate(() => MotionLab.playback.records.every(r => !r.handles || r.handles.every(a => r.visible ? a.playState === 'running' : a.playState === 'paused'))));
  });
  await check('Screen is masked and actually scrolls', async () => {
    await page.locator('#study-yaw').scrollIntoViewIfNeeded();
    const result = await page.locator('#study-yaw').evaluate(el => {
      const screen = el.querySelector('.mock-site');
      const a = screen.getAnimations()[0]; a.pause();
      a.currentTime = 0; const start = getComputedStyle(screen).transform;
      a.currentTime = 9000; const end = getComputedStyle(screen).transform;
      return { start, end, overflow: getComputedStyle(el.querySelector('.display')).overflow };
    });
    assert.notEqual(result.start, result.end); assert.equal(result.overflow, 'hidden');
  });
  await check('All seven easing curves share distance, duration, and clock', async () => {
    await page.locator('#easing').scrollIntoViewIfNeeded();
    await page.locator('#replay-easing').click();
    await page.waitForTimeout(100);
    const result = await page.evaluate(() => {
      const records = MotionLab.playback.records.filter(r => r.definition.section === 'easing');
      records.forEach(r => MotionLab.playback.initialize(r));
      MotionLab.playback.syncAll();
      return records.map(r => { const a = r.handles[0]; const keys = a.effect.getKeyframes(); return { duration: a.effect.getTiming().duration, start: keys[0].transform, end: keys[120].transform, arrival: keys[120].offset, time: a.currentTime }; });
    });
    assert(result.every(r => r.duration === 4000 && r.start === 'translateX(-60px)' && r.end === 'translateX(60px)' && r.arrival === .6));
    assert(Math.max(...result.map(r => r.time)) - Math.min(...result.map(r => r.time)) < 35);
  });
  await check('Eight effect toggles remove their treatment', async () => {
    await page.locator('#pause-all').click();
    for (const id of ['shadow', 'contact', 'blur', 'glow', 'reflection', 'rim', 'dof', 'vignette']) {
      const card = page.locator(`#study-${id}`); await card.scrollIntoViewIfNeeded();
      await card.evaluate(el => {
        const record = MotionLab.playback.records.find(r => r.card === el);
        MotionLab.playback.initialize(record);
        record.handles.forEach(a => { a.pause(); a.currentTime = a.effect.getTiming().duration * .43; });
      });
      const toggle = card.locator('[data-effect]');
      const enabled = await card.locator('.stage').screenshot();
      await toggle.uncheck(); assert(!(await card.getAttribute('class')).includes('effect-on'));
      if (id === 'blur') assert.equal(await card.locator('.device-primary').evaluate(el => getComputedStyle(el).filter), 'none');
      const disabled = await card.locator('.stage').screenshot();
      assert(!enabled.equals(disabled), `${id}: no visible pixel change when effect toggled`);
      await toggle.check(); assert((await card.getAttribute('class')).includes('effect-on'));
    }
  });
  await check('Camera push has different projection ratios for near and far layers', async () => {
    const ratios = await page.locator('#study-push').evaluate(el => {
      const r = MotionLab.playback.records.find(r => r.card === el);
      MotionLab.playback.initialize(r);
      r.handles.forEach(a => { a.pause(); a.currentTime = 0; });
      const world = r.handles.find(a => a.effect.target.matches('.world'));
      const measure = () => ['.screen-lid', '.depth-frame'].map(s => el.querySelector(s).getBoundingClientRect().width);
      const before = measure();
      world.currentTime = world.effect.getTiming().duration;
      const after = measure();
      return after.map((value, i) => value / before[i]);
    });
    assert(Math.abs(ratios[0] - ratios[1]) > .02, `Depth was flattened: ${ratios}`);
  });
  await check('Loop off finishes once and stays finished across Pause/Play sync', async () => {
    await page.locator('#study-scale-up').scrollIntoViewIfNeeded();
    await page.locator('#loop').uncheck();
    await page.locator('#study-scale-up [data-replay]').click();
    await page.evaluate(() => {
      const r = MotionLab.playback.records.find(r => r.definition.id === 'scale-up');
      r.handles.forEach(a => { a.currentTime = a.effect.getTiming().duration - 50; });
    });
    await page.waitForTimeout(150);
    assert.equal(await page.locator('#study-scale-up').getAttribute('data-state'), 'Finished');
    await page.locator('#pause-all').click();
    await page.locator('#study-scale-down [data-replay]').click();
    const states = await page.evaluate(() => MotionLab.playback.records.find(r => r.definition.id === 'scale-up').handles.map(a => ({ time: a.currentTime, duration: a.effect.getTiming().duration })));
    assert(states.every(a => a.time >= a.duration), 'Finished study restarted without its own replay');
    await page.locator('#loop').check();
  });
  await check('Reduce Motion freezes all animations and honors OS preference', async () => {
    await page.locator('#reduce-motion').check();
    assert(await page.evaluate(() => document.getAnimations().every(a => a.playState !== 'running')));
    assert(await page.locator('#play-all').isDisabled());
    await page.locator('#reduce-motion').uncheck();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('#reduce-motion').checked);
    assert(await page.locator('#reduce-motion').isChecked());
    assert(await page.evaluate(() => document.getAnimations().every(a => a.playState !== 'running')));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => !document.querySelector('#reduce-motion').checked);
  });
  await check('Responsive: 1440, 1024, 768, 390, 320 px without horizontal overflow', async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 950 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      const columns = await page.locator('#basic .cards-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(columns, width <= 600 ? 1 : 2);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: path.join(output, 'mobile.png') });
  });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.locator('#pause-all').click();
  for (const id of ['orientation', 'easing', 'pivot', 'polish', 'combined']) {
    await page.evaluate(id => {
      const rs = MotionLab.playback.records.filter(r => r.definition.section === id);
      rs.forEach(r => { MotionLab.playback.initialize(r); r.handles.forEach(a => { a.pause(); a.currentTime = a.effect.target.matches('.mock-site') ? 0 : a.effect.getTiming().duration * .5; }); });
    }, id);
    await page.locator(`#${id}`).screenshot({ path: path.join(output, `${id}.png`) });
  }
  const bounds = [];
  for (const id of ['yaw', 'pitch', 'move-z', 'push', 'shadow', 'contact', 'reflection', 'combined']) {
    await page.locator(`#study-${id}`).evaluate(el => {
      const r = MotionLab.playback.records.find(r => r.card === el);
      MotionLab.playback.initialize(r);
      r.handles.forEach(a => { a.pause(); a.currentTime = a.effect.target.matches('.mock-site') ? 0 : a.effect.getTiming().duration * .5; });
    });
    await page.locator(`#study-${id}`).screenshot({ path: path.join(output, `card-${id}.png`) });
    bounds.push(await page.locator(`#study-${id}`).evaluate(el => {
      const s = el.querySelector('.stage').getBoundingClientRect();
      return { id: el.id, stage: { width:s.width, height:s.height }, elements: ['.screen-lid', '.deck', '.soft-shadow', '.contact-shadow'].map(selector => {
        const box = el.querySelector(selector).getBoundingClientRect();
        return { selector, x: box.x-s.x, y:box.y-s.y, right:box.right-s.x, bottom:box.bottom-s.y };
      }) };
    }));
  }
  fs.writeFileSync(path.join(output, 'bounds.json'), JSON.stringify(bounds, null, 2));
  await page.setViewportSize({ width:320, height:850 });
  for (const id of ['elastic','move-x','move-z','combined']) {
    const card = page.locator(`#study-${id}`);
    await card.evaluate(el => {
      const r=MotionLab.playback.records.find(r=>r.card===el);
      MotionLab.playback.initialize(r);
      r.handles.forEach(a=>{ a.pause(); a.currentTime=el.dataset.motion==='elastic'?320:a.effect.getTiming().duration*.8; });
    });
    await card.screenshot({path:path.join(output,`mobile-${id}.png`)});
  }
  await check('No console errors or broken asset requests', async () => {
    assert.deepEqual(errors, []); assert.deepEqual(failedRequests, []);
  });
  if (!visualOnly) fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ checks, errors, failedRequests }, null, 2));
  await browser.close();
  if (checks.some(c => c.result === 'FAIL')) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
