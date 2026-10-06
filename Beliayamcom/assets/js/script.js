'use strict';

// Ubah nomor WhatsApp di sini dan tautan fallback pada index.html bila diperlukan.
const WHATSAPP_NUMBER = '6281808051777';
const DEFAULT_MESSAGE = 'Halo Beliayam.com! 👋 Mohon informasinya untuk produk ayam dan harga terbaru.';
const SIZES = ['0,5–0,6', '0,6–0,7', '0,7–0,8', '0,8–0,9', '0,9–1,0', '1,0–1,1'];
// Data katalog. Foto AI merupakan ilustrasi, bukan dokumentasi produk riil.
const PRODUCTS = [
  {id:'partingan',name:'Partingan Ayam',category:'favorit',image:'hero-chicken',description:'Potongan ayam serbaguna untuk berbagai menu harian.'},
  {id:'ampela-ati',name:'Ampela Ati',category:'favorit',image:'ampela-ati',description:'Pilihan untuk sambal goreng, sate, atau lauk berbumbu.'},
  {id:'dada-fillet',name:'Dada Fillet',category:'favorit',image:'dada-fillet',description:'Tanpa tulang, praktis untuk bekal dan aneka olahan.'},
  {id:'kulit',name:'Kulit Ayam',category:'favorit',image:'kulit',description:'Pas untuk kreasi kulit crispy dan camilan gurih.'},
  {id:'sayap',name:'Sayap Ayam',category:'favorit',image:'sayap',description:'Untuk chicken wings, ayam bakar, atau menu gorengan.'},
  {id:'ceker',name:'Ceker Ayam',category:'favorit',image:'ceker',description:'Pelengkap sup, soto, dan kreasi ceker berbumbu.'},
  {id:'paha-bawah',name:'Paha Bawah',category:'favorit',image:'paha-bawah',description:'Potongan praktis untuk ayam goreng dan panggang.'},
  {id:'paha-fillet',name:'Paha Fillet',category:'lainnya',image:'paha-fillet',description:'Paha tanpa tulang untuk teriyaki, sate, dan tumisan.'},
  {id:'paha-atas',name:'Paha Atas',category:'lainnya',image:'paha-atas',description:'Pilihan potongan untuk menu ungkep dan bakaran.'},
  {id:'paha-utuh',name:'Paha Utuh',category:'lainnya',image:'paha-utuh',description:'Bagian paha lengkap untuk hidangan favorit keluarga.'},
  {id:'wingstick',name:'Wingstick',category:'lainnya',image:'wingstick',description:'Pangkal sayap untuk olahan berbumbu dan camilan.'},
  {id:'kepala',name:'Kepala',category:'lainnya',image:'kepala',description:'Pilihan pelengkap untuk menu goreng atau ungkep.'},
  {id:'broiler',name:'Ayam Broiler',category:'broiler',image:'ayam-utuh',description:'Ayam utuh serbaguna untuk kebutuhan rumah dan usaha.',sizes:['0,4–0,5',...SIZES]},
  {id:'pejantan',name:'Ayam Pejantan',category:'pejantan',image:'ayam-utuh',description:'Pilihan untuk kreasi ayam goreng, soto, dan ungkep.',sizes:SIZES},
  {id:'kampung',name:'Ayam Kampung',category:'kampung',image:'ayam-utuh',description:'Untuk hidangan tradisional dan menu spesial keluarga.',sizes:SIZES},
];
const GROUPS = {favorit:'Potongan Ayam',lainnya:'Potongan Lainnya',broiler:'Ayam Broiler',pejantan:'Ayam Pejantan',kampung:'Ayam Kampung'};
const track = document.getElementById('product-track');
const itemsContainer = document.getElementById('order-items');
let itemSequence = 0;
let toastTimer;
function whatsappURL(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }
document.querySelectorAll('.wa-link').forEach(link => { link.href = whatsappURL(DEFAULT_MESSAGE); });
document.getElementById('year').textContent = new Date().getFullYear();
const today = new Date();
const todayString = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
document.getElementById('delivery-date').min = todayString;

function renderProducts(category) {
  track.replaceChildren();
  const matches = PRODUCTS.filter(product => product.category === category);
  matches.forEach(product => {
    const variants = product.sizes || [null];
    variants.forEach(size => {
      const article = document.createElement('article');
      article.className = 'product-card';
      // Only the fixed catalog data above enters this markup; customer input is never injected.
      article.innerHTML = `<div class="product-image"><img src="assets/images/${product.image}.webp" alt="Ilustrasi ${product.name.toLowerCase()}" width="362" height="362" loading="lazy"><span class="product-tag">${size ? size+' kg / ekor' : 'Aneka potongan'}</span></div><div class="product-content"><h3>${product.name}</h3><p>${product.description}</p><p class="product-size">${size ? 'Ukuran '+size+' kg / ekor' : 'Jumlah sesuai kebutuhan'}</p><button type="button" aria-label="Pilih ${product.name}${size ? ' ukuran '+size+' kg' : ''}">Pilih Produk <span aria-hidden="true">+</span></button></div>`;
      article.querySelector('button').addEventListener('click', () => {
        const existingEmpty = [...itemsContainer.children].find(row => !row.querySelector('.item-product').value);
        if (existingEmpty) { existingEmpty.querySelector('.item-product').value = product.id; updateItem(existingEmpty, size); }
        else { addItem(product.id, size); }
        document.getElementById('pesan').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
        showToast(`${product.name}${size ? ' '+size+' kg' : ''} ditambahkan ke form.`);
      });
      track.appendChild(article);
    });
  });
  track.scrollLeft = 0;
  document.getElementById('catalog-status').textContent = `${track.children.length} ${matches[0]?.sizes ? 'pilihan ukuran' : 'pilihan produk'} · Geser untuk lihat lainnya`;
  document.querySelectorAll('[data-category]').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active));
  });
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click',()=>renderProducts(button.dataset.category)));
document.getElementById('previous-products').addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.8,behavior:'smooth'}));
document.getElementById('next-products').addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.8,behavior:'smooth'}));

function productOptions() {
  return '<option value="">Bantu pilihkan produk</option>' + Object.entries(GROUPS).map(([key,label]) => `<optgroup label="${label}">${PRODUCTS.filter(p=>p.category===key).map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</optgroup>`).join('');
}
function addItem(productId='',size=null) {
  if (itemsContainer.children.length >= 15) { showToast('Maksimal 15 baris. Kebutuhan lain bisa ditulis pada catatan.'); return; }
  const id = ++itemSequence;
  const row = document.createElement('div'); row.className='order-item';
  row.innerHTML = `<div class="item-top"><select class="item-product" aria-label="Produk pesanan ${id}">${productOptions()}</select><button type="button" class="remove-item" aria-label="Hapus produk pesanan ${id}">×</button></div><div class="item-bottom"><div><label for="size-${id}">Ukuran per ekor</label><select class="item-size" id="size-${id}"></select></div><div><label for="qty-${id}">Jumlah</label><input class="item-quantity" id="qty-${id}" type="number" min="0.1" max="10000" step="any" inputmode="decimal" placeholder="Contoh: 5"></div><div><label for="unit-${id}">Satuan</label><select class="item-unit" id="unit-${id}"><option value="kg">kg</option><option value="ekor">ekor</option></select></div></div>`;
  row.querySelector('.item-product').value = productId;
  row.querySelector('.item-product').addEventListener('change',()=>updateItem(row));
  row.querySelector('.remove-item').addEventListener('click',()=>{ row.remove(); if(!itemsContainer.children.length) addItem(); });
  itemsContainer.appendChild(row); updateItem(row,size);
}
function updateItem(row,size=null) {
  const product = PRODUCTS.find(p=>p.id===row.querySelector('.item-product').value);
  const sizeSelect = row.querySelector('.item-size');
  sizeSelect.replaceChildren();
  if (product?.sizes) {
    sizeSelect.disabled=false; sizeSelect.add(new Option('Bantu pilihkan',''));
    product.sizes.forEach(value=>sizeSelect.add(new Option(value+' kg',value)));
    sizeSelect.value=size || ''; row.querySelector('.item-unit').value='ekor';
  } else {
    sizeSelect.add(new Option('Tidak berlaku','')); sizeSelect.disabled=true;
    row.querySelector('.item-unit').value='kg';
  }
}
document.getElementById('add-item').addEventListener('click',()=>addItem());
function showToast(message) {
  const toast=document.getElementById('toast'); toast.textContent=message; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('visible'),3500);
}
document.getElementById('order-form').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  const error=document.getElementById('form-error'); error.hidden=true;
  if(!form.reportValidity()) return;
  const name=form.elements.name.value.trim();
  const location=form.elements.location.value.trim();
  if(!name || !location) { error.textContent='Mohon isi nama dan lokasi pengiriman dengan lengkap.'; error.hidden=false; return; }
  const requestedDate=form.elements.date.value;
  if(requestedDate && requestedDate < todayString) { error.textContent='Pilih tanggal hari ini atau setelahnya.'; error.hidden=false; return; }
  const rows=[...itemsContainer.children].map((row,index)=>{
    const product=PRODUCTS.find(p=>p.id===row.querySelector('.item-product').value);
    const size=row.querySelector('.item-size').value;
    const qty=row.querySelector('.item-quantity').value;
    const unit=row.querySelector('.item-unit').value;
    return `${index+1}. ${product?.name || 'Bantu pilihkan produk'}${size ? ' (ukuran '+size+' kg/ekor)' : ''} — ${qty ? qty+' '+unit : 'jumlah konsultasi dengan admin'}`;
  });
  const date=requestedDate ? new Date(requestedDate+'T12:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : 'Fleksibel / konsultasi';
  const message=['Halo Beliayam.com! 👋','Saya ingin konsultasi pesanan ayam.','',`Nama: ${name}`,`Kebutuhan: ${form.elements.purpose.value}`,`Tanggal dibutuhkan: ${date}`,'','Pilihan produk:',...rows,'',`Lokasi pengiriman: ${location}`,`Catatan: ${form.elements.notes.value.trim() || '-'}`,'','Mohon info stok, harga, ongkir, dan jadwal pengirimannya. Terima kasih!'].join('\n');
  // Opens a draft only; the visitor must press Send in WhatsApp. No data is stored here.
  window.open(whatsappURL(message),'_blank','noopener,noreferrer');
});
const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Buka menu');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Tutup menu':'Buka menu');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
renderProducts('favorit'); addItem();
