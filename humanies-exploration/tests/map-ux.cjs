const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/Users/alami/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH || '/Users/alami/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
 let quakeRequests=0;
 await page.route('**/TEWS/*.json',r=>{quakeRequests++; return r.fulfill({json:{Infogempa:{gempa:[{DateTime:new Date(Date.now()-3600000).toISOString(),Coordinates:'-6.8,107.6',Magnitude:'5.0',Kedalaman:'10 km',Wilayah:'TEST ONLY'}]}}})});
 await page.route('**/api/weather**',r=>r.fulfill({contentType:'application/xml',headers:{'X-BMKG-Fetched-At':new Date().toISOString()},body:'<rss><channel/></rss>'}));
 await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8788/humanies-exploration/',{waitUntil:'domcontentloaded'});
 await page.locator('#watch').scrollIntoViewIfNeeded();await page.locator('.marker--active-response').waitFor();await page.waitForTimeout(600);
 const anchor=()=>page.locator('.marker--active-response').evaluate(e=>e.parentElement.style.transform);
 const initial=await anchor();
 for(const name of ['Humanies','Earthquakes','Weather Warnings','All']){await page.getByRole('button',{name,exact:true}).click();await page.waitForTimeout(100);assert.equal(await anchor(),initial,'filters must preserve camera');}
 await page.getByRole('button',{name:'Humanies',exact:true}).click();await page.locator('.situation--active-response').click();await page.waitForTimeout(200);
 const selected=await anchor();assert.notEqual(selected,initial,'selection moves camera');
 await page.evaluate(()=>{window.savedMarker=document.querySelector('.marker--active-response').parentElement});
 const beforeRequests=quakeRequests;
 const refreshed=page.waitForResponse(r=>r.url().includes('TEWS'));await page.clock.fastForward(10*60*1000+1000);await refreshed;
 await new Promise(resolve=>setTimeout(resolve,500));assert(quakeRequests>beforeRequests,'background fetch ran');
 assert.equal(await anchor(),selected,'background data does not move camera');
 assert(await page.evaluate(()=>window.savedMarker===document.querySelector('.marker--active-response').parentElement),'background update retains marker DOM');
 assert.equal(await page.locator('.marker--active-response').count(),1,'no duplicate markers');
 await page.getByRole('button',{name:'Reset View — Indonesia',exact:true}).click();await page.waitForTimeout(200);
 assert.equal(await page.locator('.drawer.is-open').count(),0);assert.equal(await anchor(),initial,'reset restores initial Indonesia frame');
 const searchBefore=await page.getByRole('searchbox').boundingBox();
 await page.locator('.stage__list').evaluate(e=>e.scrollTop=e.scrollHeight);
 const searchAfter=await page.getByRole('searchbox').boundingBox();assert.equal(searchAfter.y,searchBefore.y,'list scroll keeps search and filters fixed');
 const reset=await page.getByRole('button',{name:'Reset View — Indonesia',exact:true}).boundingBox();assert(reset.width>=100,'reset label fits');
 await page.screenshot({path:'/tmp/humanies-iteration4-desktop.png'});
 for(const width of [820,390,360]){await page.setViewportSize({width,height:844});await page.waitForTimeout(300);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width)}
 await page.getByRole('searchbox').fill('Medan');await page.locator('.situation--active-response').click();await page.waitForTimeout(300);assert(await page.locator('.drawer.is-open').isVisible());
 assert(await page.locator('.drawer__scroll').evaluate(e=>e.scrollHeight>e.clientHeight),'drawer content can scroll');
 await page.screenshot({path:'/tmp/humanies-iteration4-mobile.png'});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: initial/reset Indonesia, stable filter/background camera, marker identity, independent sidebar scroll, readable reset, tablet/mobile layout and drawer');
})().catch(e=>{console.error(e);process.exit(1)});
