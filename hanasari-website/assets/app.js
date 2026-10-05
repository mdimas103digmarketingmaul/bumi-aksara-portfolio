(() => {
 'use strict';
 const config = window.HANASARI;
 const $ = (selector, root = document) => root.querySelector(selector);
 const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
 const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money = value => 'Rp' + new Intl.NumberFormat('id-ID').format(value);
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';
 const waURL = (message, source) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Halo Hanasari Catering, saya datang dari website Hanasari.\n\n${message}\n\nSumber: Website Hanasari — ${source}`)}`;
 const bindWA = (root = document) => $$('[data-wa]', root).forEach(link => {
   link.href = waURL(link.dataset.wa, link.dataset.source || 'Website');
   link.target = '_blank'; link.rel = 'noopener noreferrer';
 });
 bindWA();
 const directPlatforms = [['GoFood', config.gofoodUrl], ['GrabFood', config.grabfoodUrl]];
 directPlatforms.forEach(([platform, url]) => {
   if (!url || !/^https:\/\//i.test(url)) return;
   const link = $(`[data-source="${platform}"]`);
   link.href = url; $('small', link).textContent = 'Buka toko & pesan sekarang';
 });
 const navToggle = $('.menu-toggle'), nav = $('#navigasi');
 const closeMenu = () => { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Buka navigasi'); };
 navToggle.addEventListener('click', () => {
   const open = navToggle.getAttribute('aria-expanded') !== 'true';
   navToggle.setAttribute('aria-expanded', String(open));
   navToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
   nav.classList.toggle('is-open', open);
 });
 $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
 document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
 document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); navToggle.focus(); } });
 window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); }, {passive:true});
 const menuTrack = $('#menu-track');
 const categoryLabels = {nasi:'NASI BOX', snack:'SNACK BOX', spesial:'SAJIAN SPESIAL'};
 const placeholder = `<div class="placeholder-visual"><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M10 48h60M15 48a25 25 0 0 1 50 0M35 21a5 5 0 0 1 10 0M11 56h58M25 64h30"/></svg><span>Foto segera hadir</span></div>`;
 menuTrack.innerHTML = config.products.map(item => `<article class="menu-card" data-category="${escapeHTML(item.category)}"><div class="product-image ${item.photo ? 'photo' : ''}">${item.image ? `<img src="assets/images/${escapeHTML(item.image)}" alt="${escapeHTML(item.name)} Hanasari — contoh penyajian" width="450" height="340" loading="lazy">` : placeholder}<span class="product-tag">${escapeHTML(item.tag)}</span></div><div class="product-content"><span class="product-category">${categoryLabels[item.category]}</span><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p><div class="product-bottom"><div class="product-price">${item.price ? money(item.price) : 'Tanya Admin'}<small>${item.price ? 'per box' : 'Harga & pilihan paket'}</small></div><a data-wa="${escapeHTML(`Saya tertarik dengan ${categoryLabels[item.category]} — ${item.name}${item.price ? ` (${money(item.price)}/box di katalog)` : ''}. Boleh minta informasi dan ketersediaannya?`)}" data-source="Menu ${escapeHTML(item.name)}" href="https://wa.me/${config.whatsapp}" aria-label="Tanyakan ${escapeHTML(item.name)} melalui WhatsApp">Pilih menu <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
 bindWA(menuTrack);
 const updateArrows = track => {
   $$(`[data-slide="${track.id}"]`).forEach(button => {
     button.disabled = Number(button.dataset.direction) < 0 ? track.scrollLeft <= 3 : track.scrollLeft + track.clientWidth >= track.scrollWidth - 3;
   });
 };
 const filterMenu = category => {
   $$('.filter').forEach(button => { const selected = button.dataset.filter === category; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
   $$('.menu-card', menuTrack).forEach(card => { card.hidden = category !== 'semua' && card.dataset.category !== category; });
   const count = $$('.menu-card:not([hidden])', menuTrack).length;
   $('#menu-count').textContent = `${count} pilihan ${category === 'semua' ? 'menu' : category === 'spesial' ? 'sajian spesial' : category === 'nasi' ? 'nasi box' : 'snack box'}`;
   menuTrack.scrollLeft = 0;
   requestAnimationFrame(() => updateArrows(menuTrack));
 };
 $$('.filter').forEach(button => button.addEventListener('click', () => filterMenu(button.dataset.filter)));
 $$('[data-filter-link]').forEach(link => link.addEventListener('click', () => filterMenu(link.dataset.filterLink)));
 filterMenu('semua');
 const reviewTrack = $('#review-track');
 reviewTrack.innerHTML = config.reviews.map((review, index) => `<article class="review-card"><div class="stars" aria-label="5 dari 5 bintang">★★★★★</div><blockquote>“${escapeHTML(review.quote)}”</blockquote><div class="review-person"><span class="avatar" aria-hidden="true">${escapeHTML(review.initials)}</span><div><strong>${escapeHTML(review.name)}</strong><small>Ulasan Google · Pelanggan Hanasari</small></div></div><button class="review-proof" data-review="${index}">Lihat tangkapan layar ulasan ↗</button></article>`).join('');
 $$('.card-track').forEach(track => {
   track.addEventListener('scroll', () => updateArrows(track), {passive:true});
   if ('ResizeObserver' in window) new ResizeObserver(() => updateArrows(track)).observe(track);
   track.addEventListener('keydown', event => {
     if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
     event.preventDefault(); track.scrollBy({left:track.clientWidth * .9 * (event.key === 'ArrowRight' ? 1 : -1), behavior:scrollBehavior()});
   });
   requestAnimationFrame(() => updateArrows(track));
 });
 $$('[data-slide]').forEach(button => button.addEventListener('click', () => {
   const track = document.getElementById(button.dataset.slide);
   const firstCard = $('article:not([hidden])', track);
   const distance = firstCard ? firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap) : track.clientWidth;
   track.scrollBy({left:distance * Number(button.dataset.direction), behavior:scrollBehavior()});
 }));
 const dialog = $('#review-dialog');
 let lastReviewButton;
 $$('[data-review]').forEach(button => button.addEventListener('click', () => {
   const review = config.reviews[Number(button.dataset.review)];
   lastReviewButton = button;
   $('#dialog-title').textContent = `Ulasan ${review.name}`;
   $('#dialog-image').src = `assets/testimonials/${review.image}`;
   $('#dialog-image').alt = `Tangkapan layar ulasan asli dari ${review.name}`;
   dialog.showModal(); document.body.classList.add('dialog-open');
 }));
 $('#close-dialog').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {
   const bounds = dialog.getBoundingClientRect();
   if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
 });
 dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (lastReviewButton) lastReviewButton.focus(); });
 const localISODate = date => [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
 const dateInput = $('#tanggal'); dateInput.min = localISODate(new Date());
 $('#inquiry-form').addEventListener('submit', event => {
   event.preventDefault();
   const form = event.currentTarget;
   const nameInput = $('#nama'); nameInput.value = nameInput.value.trim();
   dateInput.min = localISODate(new Date());
   if (!form.reportValidity()) return;
   const values = new FormData(form);
   const date = values.get('tanggal');
   const formattedDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : 'Belum ditentukan';
   const message = [`Saya ingin konsultasi catering:`, `Nama: ${values.get('nama')}`, `Acara: ${values.get('acara')}`, `Tanggal: ${formattedDate}`, `Menu: ${values.get('paket')}`, `Jumlah: ${values.get('porsi') || 'Belum ditentukan'}${values.get('porsi') ? ' porsi / box' : ''}`, `Lokasi: ${String(values.get('lokasi')).trim() || 'Belum ditentukan'}`, `Catatan: ${String(values.get('catatan')).trim() || '-'}`, '', 'Mohon informasi ketersediaan, minimum pesanan, dan total biayanya. Terima kasih.'].join('\n');
   const url = waURL(message, 'Form konsultasi');
   $('#form-fallback').href = url; $('#form-result').hidden = false;
   window.open(url, '_blank', 'noopener,noreferrer');
 });
 $('#year').textContent = new Date().getFullYear();
})();
