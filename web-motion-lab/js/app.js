/* =========================================================================
   Web Motion Lab — app shell
   Loaded last. Turns each effect definition into a learning card around
   its demo stage, then wires navigation, search, controls and copy buttons.
   ========================================================================= */
(function () {
  'use strict';

  const CATEGORY_NAMES = {
    cursor: 'Cursor & Pointer', hover: 'Hover Interactions', scroll: 'Scroll Motion',
    typography: 'Typography Motion', media: 'Image & Media', ambient: 'Ambient Motion',
    micro: 'Microinteractions', perspective: '3D & Perspective', advanced: 'Advanced / Experimental',
  };
  const TRIGGER_LABELS = { mouse: 'Mouse', hover: 'Hover', scroll: 'Scroll', click: 'Click', load: 'Load', time: 'Time' };
  const LEVEL_LABELS = { 1: 'L1 · Subtle', 2: 'L2 · Expressive', 3: 'L3 · Experimental' };
  const ICON_POINTER = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 2.5 12.5 7 8.3 8.3 7 12.5Z" stroke-linejoin="round"/></svg>';
  const ICON_REPLAY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"/></svg>';
  const ICON_COPY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const announcer = document.createElement('div');
  announcer.className = 'visually-hidden';
  announcer.setAttribute('aria-live', 'polite');
  document.body.appendChild(announcer);
  const announce = (msg) => { announcer.textContent = ''; requestAnimationFrame(() => { announcer.textContent = msg; }); };

  /* ---------- 1. Build effect cards ---------- */
  const cards = [];
  const defsById = new Map(Lab.effects.map((d) => [d.id, d]));
  let number = 0;

  document.querySelectorAll('article.effect[data-effect]').forEach((article) => {
    const def = defsById.get(article.dataset.effect);
    const stage = article.querySelector('.stage');
    if (!def || !stage) { console.warn('[motion-lab] missing definition or stage for', article.dataset.effect); return; }
    number += 1;
    const num = String(number).padStart(2, '0');

    const head = document.createElement('header');
    head.className = 'effect__head';
    head.innerHTML = `
      <span class="effect__index">${num}</span>
      <div class="effect__titles">
        <h3 class="effect__name"><a href="#${def.id}">${esc(def.name)}</a></h3>
        ${def.aliases && def.aliases.length ? `<p class="effect__aliases">Also called: ${def.aliases.map(esc).join(' · ')}</p>` : ''}
      </div>
      <div class="effect__tags">
        ${def.triggers.map((t) => `<span class="tag" data-trigger="${t}">${TRIGGER_LABELS[t]}</span>`).join('')}
        <span class="tag tag--level">${LEVEL_LABELS[def.level] || ''}</span>
      </div>`;

    const demo = document.createElement('div');
    demo.className = 'demo';
    demo.innerHTML = `
      <div class="demo__bar">
        <span class="demo__label">Try it</span>
        <span class="demo__hint">${esc(def.hint || '')}</span>
        ${def.pointer ? `<span class="badge-pointer">${ICON_POINTER}Best experienced with a pointer</span>` : ''}
      </div>`;
    stage.replaceWith(demo);
    demo.appendChild(stage);
    if (def.reducedNote) stage.insertAdjacentHTML('beforeend', `<span class="reduced-note" aria-hidden="true">${esc(def.reducedNote)}</span>`);

    const a = def.anatomy;
    const dots = [1, 2, 3].map((i) => `<i class="${i <= def.complexity ? 'on' : ''}"></i>`).join('');
    const info = document.createElement('div');
    info.className = 'effect__info';
    info.innerHTML = `
      <dl class="anatomy">
        <div class="anatomy__row anatomy__row--trigger"><dt>Trigger</dt><dd>${esc(a.trigger)}</dd></div>
        <div class="anatomy__row anatomy__row--target"><dt>Target</dt><dd>${esc(a.target)}</dd></div>
        <div class="anatomy__row anatomy__row--transform"><dt>Transform</dt><dd>${esc(a.transform)}</dd></div>
        <div class="anatomy__row anatomy__row--character"><dt>Character</dt><dd>${esc(a.character)}</dd></div>
        <div class="anatomy__row anatomy__row--complexity"><dt>Complexity</dt><dd><span class="dots" aria-hidden="true">${dots}</span>${['', 'Low', 'Medium', 'High'][def.complexity]}</dd></div>
        <div class="anatomy__row anatomy__row--tech"><dt>Technology</dt><dd>${esc(def.tech)}</dd></div>
      </dl>
      <div class="effect__copy">
        <h4>What it does</h4>
        <p>${esc(def.does)}</p>
        <h4>Good for</h4>
        <ul class="good-for">${def.goodFor.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      </div>
      ${def.note ? `<p class="effect__note">${esc(def.note)}</p>` : ''}`;

    const grid = document.createElement('div');
    grid.className = 'effect__grid';
    article.prepend(head);
    head.after(grid);
    grid.append(demo, info);

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.innerHTML = `
      <div class="prompt__head">
        <span class="prompt__title">Prompt recipe</span>
        <button class="btn btn--small" type="button" data-copy>${ICON_COPY}<span>Copy prompt</span></button>
      </div>
      <p class="prompt__text">${esc(def.prompt)}</p>`;
    article.appendChild(prompt);

    const searchText = [def.name, ...(def.aliases || []), def.does, a.trigger, a.target, a.transform, a.character, def.tech, ...def.goodFor, CATEGORY_NAMES[def.category], ...def.triggers]
      .join(' ').toLowerCase();
    cards.push({ def, article, stage, demo, searchText, instance: null });
  });

  /* ---------- 2. Initialise demos (isolated: one failure never breaks the page) ---------- */
  cards.forEach((card) => {
    try {
      card.instance = card.def.init(card.stage, card) || null;
    } catch (err) {
      console.error(`[motion-lab] ${card.def.id} failed to initialise`, err);
      card.stage.insertAdjacentHTML('beforeend', '<p class="stage-caption">This demo could not start in your browser.</p>');
    }
    if (card.instance && typeof card.instance.replay === 'function') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--small';
      btn.innerHTML = `${ICON_REPLAY}<span>Replay</span>`;
      btn.setAttribute('aria-label', `Replay ${card.def.name}`);
      btn.addEventListener('click', () => card.instance.replay());
      card.demo.querySelector('.demo__bar').appendChild(btn);
    }
  });

  // CSS loops inside off-screen stages are paused via .is-active (see styles.css).
  document.querySelectorAll('.stage').forEach((stage) => {
    Lab.onVisible(stage, (visible) => stage.classList.toggle('is-active', visible));
  });

  /* ---------- 3. Copy prompt buttons (also used by the learning sections) ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  }
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const source = btn.dataset.copy
      ? document.getElementById(btn.dataset.copy)
      : btn.closest('.prompt, [data-copy-scope]').querySelector('.prompt__text, [data-copy-text]');
    if (!source) return;
    const label = btn.querySelector('span') || btn;
    const original = btn.dataset.label || label.textContent;
    btn.dataset.label = original;
    const ok = await copyText(source.textContent.trim());
    label.textContent = ok ? 'Copied' : 'Press ⌘/Ctrl+C';
    btn.classList.toggle('is-done', ok);
    announce(ok ? 'Prompt copied to clipboard' : 'Copy failed — select the text manually');
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => { label.textContent = original; btn.classList.remove('is-done'); }, 1600);
  });
  Lab.copyText = copyText;

  /* ---------- 4. Global controls ---------- */
  const syncControls = () => {
    document.querySelectorAll('.seg[data-setting]').forEach((seg) => {
      const current = Lab.state[seg.dataset.setting];
      seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === current)));
    });
  };
  document.querySelectorAll('.seg[data-setting]').forEach((seg) => {
    seg.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-value]');
      if (!btn) return;
      if (seg.dataset.setting === 'motion') Lab.setMotion(btn.dataset.value);
      else Lab.setIntensity(btn.dataset.value);
      announce(`${seg.dataset.setting === 'motion' ? 'Motion' : 'Intensity'}: ${btn.textContent}`);
    });
  });
  Lab.onChange(syncControls);
  syncControls();

  document.getElementById('replay-visible').addEventListener('click', () => {
    let count = 0;
    cards.forEach((c) => {
      if (c.instance && c.instance.replay && c.stage.classList.contains('is-active') && !c.article.hidden) { c.instance.replay(); count++; }
    });
    announce(count ? `Replayed ${count} demo${count > 1 ? 's' : ''}` : 'No replayable demos on screen');
  });

  const controlsToggle = document.querySelector('.controls-toggle');
  const controls = document.getElementById('lab-controls');
  const setControlsOpen = (open) => {
    controls.classList.toggle('is-open', open);
    controlsToggle.setAttribute('aria-expanded', String(open));
  };
  controlsToggle.addEventListener('click', () => setControlsOpen(!controls.classList.contains('is-open')));
  document.addEventListener('click', (e) => {
    if (controls.classList.contains('is-open') && !e.target.closest('#lab-controls, .controls-toggle')) setControlsOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setControlsOpen(false); });

  /* ---------- 5. Search + trigger filter ---------- */
  const searchInput = document.getElementById('effect-search');
  const chips = [...document.querySelectorAll('#trigger-filter .chip')];
  const status = document.getElementById('filter-status');
  const emptyState = document.getElementById('empty-state');
  const categories = [...document.querySelectorAll('.category')];

  function applyFilter() {
    const terms = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const triggers = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.trigger);
    let shown = 0;
    cards.forEach((card) => {
      const matchText = terms.every((t) => card.searchText.includes(t));
      const matchTrigger = !triggers.length || triggers.some((t) => card.def.triggers.includes(t));
      card.article.hidden = !(matchText && matchTrigger);
      if (!card.article.hidden) shown++;
    });
    categories.forEach((section) => {
      const visible = section.querySelectorAll('article.effect:not([hidden])').length;
      section.classList.toggle('is-empty', visible === 0);
      const count = document.querySelector(`[data-count="${section.dataset.category}"]`);
      if (count) count.textContent = visible;
      const link = document.querySelector(`.nav__link[href="#${section.id}"]`);
      if (link) link.classList.toggle('is-empty', visible === 0);
    });
    const filtering = terms.length || triggers.length;
    status.textContent = filtering ? `${shown} of ${cards.length} effects shown` : '';
    emptyState.hidden = shown > 0;
    Lab.refreshScroll();
  }
  searchInput.addEventListener('input', applyFilter);
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
    applyFilter();
  }));
  applyFilter();

  const sidebar = document.querySelector('.sidebar');
  const filterToggle = document.querySelector('.sidebar__toggle');
  filterToggle.addEventListener('click', () => {
    const open = !sidebar.classList.contains('is-filtering');
    sidebar.classList.toggle('is-filtering', open);
    filterToggle.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
  });

  /* ---------- 6. Scrollspy for the directory ---------- */
  const navLinks = [...document.querySelectorAll('.nav__link')];
  const nav = document.querySelector('.nav');
  const spyTargets = navLinks.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const current = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('is-current', current);
        if (current) {
          link.setAttribute('aria-current', 'true');
          // Keep the active chip visible in the mobile bar without moving the page.
          if (nav.scrollWidth > nav.clientWidth) {
            const delta = link.getBoundingClientRect().left - nav.getBoundingClientRect().left;
            nav.scrollTo({ left: nav.scrollLeft + delta - 16, behavior: Lab.reduced ? 'auto' : 'smooth' });
          }
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  spyTargets.forEach((t) => spy.observe(t));
  navLinks.forEach((link) => link.addEventListener('click', () => {
    sidebar.classList.remove('is-filtering');
    filterToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- 7. Page chrome motion ---------- */
  const progressBar = document.querySelector('.page-progress');
  Lab.onScroll(null, ({ progress }) => progressBar.style.setProperty('--page-progress', progress.toFixed(4)));

  let heroIndex = 0;
  document.querySelectorAll('.hero__split').forEach((el) => { heroIndex += Lab.split(el, 'chars', heroIndex).length; });
  const hero = document.querySelector('.hero');
  const heroBg = hero.querySelector('.hero__bg');
  if (Lab.fine) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      heroBg.style.setProperty('--hx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      heroBg.style.setProperty('--hy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  Lab.cards = cards;
})();
