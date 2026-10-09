/* MammaRoti — vanilla JavaScript; tidak memerlukan build atau API. */
'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const config = window.MAMMA_CONFIG || { email: 'contact@mammaroti.id', socials: {} };
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const products = {
  buns: [
    ['Rich Chocolate','Pilihan cokelat untuk menemani jeda manismu.'],
    ['Vanilla Banana','Perpaduan vanilla dan pisang untuk kamu yang suka rasa lembut.'],
    ['Vanilla Pandan','Vanilla bertemu aroma pandan dalam satu bun.'],
    ['Vanilla Strawberry','Vanilla dengan sentuhan rasa stroberi.'],
    ['Vanilla Butter','Pilihan sederhana dengan karakter vanilla dan butter.'],
    ['Choco Almond','Cokelat dan almond untuk selingan harimu.'],
    ['Chocolate & Cheese','Dua favorit, cokelat dan keju, dalam satu pilihan.'],
    ['Cheese','Rasa keju untuk pecinta pilihan gurih.']
  ],
  coffee: [
    ['Kopi Gula Aren','Kopi dengan karakter manis gula aren.'],
    ['Kopi Susu Butterscotch','Kopi susu dengan sentuhan rasa butterscotch.'],
    ['Kopi Salted Caramel','Kopi dengan perpaduan rasa caramel dan sentuhan asin.'],
    ['Kopi Hazelnut','Kopi dengan karakter rasa hazelnut.']
  ],
  noncoffee: [
    ['Mango Tropical','Pilihan rasa mangga untuk suasana yang lebih segar.'],
    ['Lemon Tea','Teh dengan karakter rasa lemon.'],
    ['Chocolate','Pilihan cokelat untuk teman menikmati bun.'],
    ['Matcha Latte','Pilihan matcha latte untuk jeda harimu.']
  ]
};
const categoryLabels = {buns:'Buns',coffee:'Coffee',noncoffee:'Non-Coffee'};
let currentCategory='buns';
const dialog=$('#detail-dialog');
let previousFocus;
function openDetail(content){
  previousFocus=document.activeElement;
  $('#dialog-content').innerHTML=content;
  dialog.showModal();
  document.body.style.overflow='hidden';
  $('.dialog-close').focus();
}
function closeDetail(){dialog.close();}
$('.dialog-close').addEventListener('click',closeDetail);
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDetail();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';if(previousFocus?.isConnected)previousFocus.focus();});
dialog.addEventListener('click',event=>{if(event.target.closest('[data-close-dialog]'))closeDetail();});
function renderProducts(category){
  currentCategory=category;
  const image=category==='buns'?'bun':'coffee';
  $('#product-grid').innerHTML=products[category].map(([name],index)=>`<button class="product-card" type="button" data-product="${index}" aria-label="Lihat detail ${escapeHTML(name)}"><span class="number">${String(index+1).padStart(2,'0')} / ${categoryLabels[category].toUpperCase()}</span><img src="assets/images/${image}.webp" alt="${category==='buns'?'Ilustrasi bun MammaRoti':'Ilustrasi minuman MammaRoti'}" width="300" height="220" loading="lazy"><h3>${escapeHTML(name)}</h3><span class="card-plus" aria-hidden="true">+</span></button>`).join('');
  $('#menu-count').textContent=`${products[category].length} pilihan ${categoryLabels[category].toLowerCase()}`;
  $$('[data-category]').forEach(button=>{const active=button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
$$('[data-category]').forEach(button=>button.addEventListener('click',()=>renderProducts(button.dataset.category)));
$('#product-grid').addEventListener('click',event=>{
  const button=event.target.closest('[data-product]');if(!button)return;
  const [name,description]=products[currentCategory][Number(button.dataset.product)];
  openDetail(`<img class="dialog-photo" src="assets/images/${currentCategory==='buns'?'bun':'coffee'}.webp" alt="Ilustrasi ${categoryLabels[currentCategory]} MammaRoti"><span class="section-kicker">${categoryLabels[currentCategory]}</span><h2 id="dialog-title">${escapeHTML(name)}</h2><p>${escapeHTML(description)}</p><p class="menu-note">Foto merupakan ilustrasi penyajian. Tanyakan harga, ketersediaan, komposisi, dan informasi alergen kepada outlet.</p><a class="button dark" href="#outlet" data-close-dialog>Temukan outlet</a>`);
});
renderProducts('buns');
const doughData={original:{image:'original-custard',name:'The original<br>little joy.',alt:'Original coffeebun dengan isian custard',fillings:['Vanilla Custard','Cheese Custard','Chocolate Custard','Banana Custard']},taro:{image:'taro-custard',name:'A little purple.<br>A lot of joy.',alt:'Taro coffeebun dengan isian custard',fillings:['Vanilla Custard','Taro Custard','Raspberry Custard']}};
$$('[data-dough]').forEach(button=>button.addEventListener('click',()=>{
  const variant=button.dataset.dough,data=doughData[variant];
  $('#dough').classList.toggle('taro',variant==='taro');
  $$('[data-dough]').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  const img=$('#dough-image');img.src=`assets/images/${data.image}.webp`;img.alt=data.alt;img.classList.remove('change');void img.offsetWidth;img.classList.add('change');
  $('#dough-name').innerHTML=data.name;$('#fillings').innerHTML=data.fillings.map(f=>`<li>${f}</li>`).join('');
}));
const regions=[
 ['Jakarta',['Jakarta Pusat','Jakarta Barat','Jakarta Selatan','Jakarta Timur','Jakarta Utara']],
 ['Banten',['Serang']],['Tangerang',['Tangerang Selatan','Tangerang Kota']],
 ['Jawa Tengah',['Demak','Solo']],['Jawa Barat',['Kab. Bandung','Kota Bandung','Subang','Bogor','Bekasi','Mall Indramayu']],
 ['Jawa Timur',['Malang','Sidoarjo','Surabaya','Madura']],['Sumatera',['Dumai','Jambi','Padang Sidempuan']],
 ['Kalimantan',['IKN','Balikpapan','Banjarmasin']],['Sulawesi',['Morowali']],['Kep. Bangka',['Sungailiat','Pangkal Pinang']]
];
const exclusive=[
 ['Soekarno-Hatta International Airport',['Terminal 3 Domestic','Terminal 2 E Arrival','Terminal 2 F Shelter Damri','Terminal 2 F Arrival']],
 ['Kereta Api Indonesia',['St. Pasar Senen','St. Jatinegara']],
 ['Syamsudinnoor International Airport',['Terminal Keberangkatan','Terminal Kedatangan','Ruang Tunggu Keberangkatan']],
 ['I Gusti Ngurah Rai Airport',['International','Domestic']]
];
function mapsURL(region,city){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`MammaRoti ${city} ${region}`)}`;}
function cardMarkup([region,cities]){return `<article class="store-card"><h3>${escapeHTML(region)}</h3><ul>${cities.map(city=>`<li><a href="${mapsURL(region,city)}" target="_blank" rel="noopener noreferrer" aria-label="Cari MammaRoti ${escapeHTML(city)} ${escapeHTML(region)} di Google Maps, tab baru">${escapeHTML(city)}</a></li>`).join('')}</ul></article>`;}
function normalize(value){return value.toLowerCase().replace(/jateng/g,'jawa tengah').replace(/jabar/g,'jawa barat').replace(/jatim/g,'jawa timur').trim();}
function searchGroups(groups,query){return groups.map(([region,cities])=>[region,normalize(region).includes(query)?cities:cities.filter(city=>normalize(city).includes(query))]).filter(([,cities])=>cities.length);}
function renderStores(){
  const query=normalize($('#store-search').value),r=searchGroups(regions,query),e=searchGroups(exclusive,query);
  $('#store-grid').innerHTML=r.length?r.map(cardMarkup).join(''):`<p class="no-results">${query?'Wilayah tidak ditemukan. Coba nama kota lain atau lihat lokasi eksklusif di bawah.':'Belum ada lokasi.'}</p>`;
  $('#exclusive-grid').innerHTML=e.length?e.map(cardMarkup).join(''):'<p class="no-results">Tidak ada lokasi eksklusif yang cocok.</p>';
  $('#store-count').textContent=query?`${r.length} wilayah dan ${e.length} lokasi eksklusif cocok dengan pencarian.`:`${regions.length} wilayah · ${exclusive.length} lokasi eksklusif`;
  $('#clear-search').hidden=!query;
}
$('#store-search').addEventListener('input',renderStores);
$('#clear-search').addEventListener('click',()=>{$('#store-search').value='';renderStores();$('#store-search').focus();});
$$('[data-city]').forEach(link=>link.addEventListener('click',()=>{$('#store-search').value=link.dataset.city;renderStores();}));
renderStores();
const stories=[
 {label:'MAMMA’S MENU',title:'Kenalan dengan si renyah favoritmu.',image:'split-bun',intro:'Di balik setiap gigitan, ada momen kecil yang menyenangkan.',body:'Coffeebun punya dua sisi yang saling melengkapi: bagian luar yang renyah dan roti yang lembut di dalam. Di MammaRoti, kamu bisa menjelajahi dua pilihan adonan, Original dan Taro, dengan beberapa pilihan custard. Mulai dari rasa yang paling familiar, lalu temukan favorit barumu.'},
 {label:'PICK YOUR MOOD',title:'Original atau Taro? Ikuti mood kamu.',image:'taro-custard',intro:'Dua karakter berbeda untuk setiap suasana.',body:'Tim Original bisa menjelajahi Vanilla Custard, Cheese Custard, Chocolate Custard, dan Banana Custard. Kalau ingin berganti suasana, ada Taro dengan pilihan Vanilla Custard, Taro Custard, dan Raspberry Custard. Jelajahi pilihan adonan di halaman ini, lalu tanyakan ketersediaannya di outlet tujuanmu.'},
 {label:'EVERYDAY PAIRING',title:'Bun dan minuman. Pasangan satu jeda.',image:'coffee',intro:'Waktu sebentar pun bisa terasa lebih menyenangkan.',body:'Bun favoritmu bisa ditemani pilihan kopi seperti Kopi Gula Aren dan Kopi Hazelnut. Ingin selain kopi? Jelajahi Mango Tropical, Lemon Tea, Chocolate, atau Matcha Latte. Menu dapat berbeda antar-outlet, jadi tanyakan dulu pilihan yang tersedia saat berkunjung.'}
];
$('#story-grid').innerHTML=stories.map((s,i)=>`<button type="button" class="story-card" data-story="${i}" aria-label="Baca ${escapeHTML(s.title)}"><div class="story-image"><img src="assets/images/${s.image}.webp" alt="" width="360" height="260" loading="lazy"></div><span>${s.label}</span><h3>${s.title}</h3><p>Baca cerita <span aria-hidden="true">+</span></p></button>`).join('');
$('#story-grid').addEventListener('click',event=>{const button=event.target.closest('[data-story]');if(!button)return;const s=stories[Number(button.dataset.story)];openDetail(`<img class="dialog-photo" src="assets/images/${s.image}.webp" alt=""><span class="section-kicker">${s.label}</span><h2 id="dialog-title">${s.title}</h2><p><strong>${s.intro}</strong></p><p>${s.body}</p><a href="#menu" class="button dark" data-close-dialog>Jelajahi menu</a>`);});
const navToggle=$('.nav-toggle');
function closeNav(){navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Buka menu');$('#navigation').classList.remove('open');}
navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')!=='true';navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');$('#navigation').classList.toggle('open',open);});
$$('#navigation a').forEach(link=>link.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navToggle.getAttribute('aria-expanded')==='true'){closeNav();navToggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeNav();});
$('#year').textContent=new Date().getFullYear();
$$('a[href^="mailto:"]').forEach(link=>{const subject=link.id==='partner-link'?'?subject='+encodeURIComponent('Informasi Kemitraan MammaRoti'):'';link.href='mailto:'+config.email+subject;if(link.textContent.includes('@'))link.textContent=config.email;});
for(const [name,url] of Object.entries(config.socials||{})){if(!url)continue;try{const safe=new URL(url);if(safe.protocol!=='https:')continue;const a=document.createElement('a');a.href=safe.href;a.textContent=name.charAt(0).toUpperCase()+name.slice(1);a.target='_blank';a.rel='noopener noreferrer';$('#social-links').append(a);}catch{/* Lewati URL tidak valid. */}}
$('#feedback-form').addEventListener('submit',event=>{
  event.preventDefault();if(!event.currentTarget.reportValidity())return;
  const name=$('#name').value.trim(),email=$('#email').value.trim(),message=$('#message').value.trim();
  if(!name||!message){$('#form-status').textContent='Mohon isi nama dan pesan dengan teks yang lengkap.';return;}
  const body=`Halo MammaRoti,\n\n${message}\n\nNama: ${name}\nEmail: ${email}`;
  $('#prepared-message').value=body;$('#email-fallback').hidden=false;
  $('#form-status').textContent=`Draf siap. Lanjutkan pengiriman di aplikasi email. Jika tidak terbuka, salin pesan di bawah dan kirim ke ${config.email}.`;
  window.location.href=`mailto:${config.email}?subject=${encodeURIComponent('Kritik & Saran — '+name)}&body=${encodeURIComponent(body)}`;
});
$('#copy-message').addEventListener('click',async()=>{const text=$('#prepared-message');try{await navigator.clipboard.writeText(text.value);$('#form-status').textContent='Pesan disalin. Tempel di email dan kirim ke '+config.email+'.';}catch{text.focus();text.select();$('#form-status').textContent='Teks dipilih. Tekan Ctrl+C atau Command+C untuk menyalin.';}});
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.1});$$('.reveal').forEach(el=>observer.observe(el));}
