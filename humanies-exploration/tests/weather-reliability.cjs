const {chromium}=require(process.env.PLAYWRIGHT_PATH || '/Users/alami/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH || '/Users/alami/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=(process.env.PREVIEW_URL || 'http://127.0.0.1:8788/humanies-exploration/');let mode='valid', expiry=Date.now()+60000;
 const cap=()=>`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2"><identifier>fixture</identifier><sent>${new Date(Date.now()-60000).toISOString()}</sent><status>Actual</status><scope>Public</scope><msgType>Alert</msgType><info><language>id</language><event>TEST ONLY</event><effective>${new Date(Date.now()-60000).toISOString()}</effective><expires>${new Date(expiry).toISOString()}</expires><area><areaDesc>Fixture location</areaDesc></area></info></alert>`;
 await page.route('**/TEWS/*.json',r=>r.fulfill({json:{Infogempa:{gempa:[]}}}));
 await page.route('**/api/weather**',async r=>{
   if(mode==='offline')return r.abort();
   const text=r.request().url().endsWith('_alert.xml')?cap():mode==='empty'?'<rss><channel/></rss>':'<rss><channel><item><link>https://www.bmkg.go.id/alerts/nowcast/id/TEST_alert.xml</link></item></channel></rss>';
   return r.fulfill({contentType:'application/xml',headers:{'X-BMKG-Fetched-At':new Date().toISOString()},body:text});
 });
 const weather=()=>page.getByRole('button',{name:'Weather Warnings',exact:true}).click();
 await page.goto(url,{waitUntil:'domcontentloaded'});await weather();await page.locator('.weather-row').waitFor();assert.equal(await page.locator('.weather-marker').count(),0);
 await page.locator('.weather-row').click();assert.match(await page.locator('.drawer.is-open').innerText(),/Geometri valid tidak tersedia/);
 mode='offline';await page.reload({waitUntil:'domcontentloaded'});await weather();await page.getByText(/Peringatan cuaca BMKG sementara/).waitFor();assert.equal(await page.locator('.weather-row').count(),1);assert.match(await page.locator('.weather-list').innerText(),/Data tersimpan/);
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await weather();await page.getByText(/Peringatan cuaca BMKG sementara/).waitFor();assert.equal(await page.locator('.weather-row').count(),0);
 await page.getByRole('button',{name:'Humanies',exact:true}).click();assert(await page.locator('.situation').count()>0);
 mode='empty';await page.reload({waitUntil:'domcontentloaded'});await weather();await page.getByText('Tidak ada peringatan cuaca aktif yang sesuai filter.').waitFor();
 mode='valid';expiry=Date.now()+8000;await page.reload({waitUntil:'domcontentloaded'});await weather();await page.locator('.weather-row').waitFor();await page.locator('.weather-row').click();
 await page.waitForFunction(()=>!document.querySelector('.weather-row'),{},{timeout:12000});assert.equal(await page.locator('.drawer.is-open').count(),0);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: missing geometry list-only, weather stale cache, offline without cache, Humanies independent, empty, active drawer removed at expiry');
})().catch(e=>{console.error(e);process.exit(1)});
