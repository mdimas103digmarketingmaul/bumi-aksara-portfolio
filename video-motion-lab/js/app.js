/* =========================================================================
   Video Motion Lab — app shell
   Builds navigation, sections and demo cards from the registry, then wires
   global controls, search/filter, tabs, prompt copy, Study mode and
   scrollspy. Demo files only call VML.demo({...}); everything you see
   around a stage is generated here, so every card follows one structure.
   ========================================================================= */
(function () {
  'use strict';
  const VML = window.VML;
  const { demos, settings, setSetting, onSetting, esc, Player, resolveTracks, pick } = VML;

  /* ---------- sections ---------- */
  const SECTIONS = [
    { id: 'fundamentals', num: '01', title: 'Motion <em>Fundamentals</em>', intro: 'The grammar every other category is built from: <b>how things enter, move and leave</b>, and the classic animation principles (anticipation, overshoot, follow-through, arcs) that make motion feel physical instead of mechanical.' },
    { id: 'easing', num: '02', title: 'Easing <em>&amp; Physics</em>', intro: 'Easing is the <b>speed profile</b> of a movement — same start, same end, same duration, completely different feeling. Compare curves side by side, then see how springs, inertia and friction map to real physics.' },
    { id: 'typography', num: '03', title: 'Typography <em>Motion</em>', intro: 'Text is the backbone of social video: most viewers watch muted. These techniques decide <b>reading order, rhythm and emphasis</b>. Watch how masks, staggers and swaps keep text legible while still moving.' },
    { id: 'image', num: '04', title: 'Image <em>&amp; Photography</em>', intro: 'Bringing still photography to life. Slow moves (Ken Burns, push-in, pan) add time; reveals (mask, wipe, split, slices) add structure; punches and match cuts add energy.' },
    { id: 'shape', num: '05', title: 'Shape <em>&amp; Graphic Elements</em>', intro: 'Supporting graphics: lines that draw, shapes that morph, bursts that punctuate. Their job is usually <b>secondary</b> — to lead the eye or mark a moment, not to steal it.' },
    { id: 'camera', num: '06', title: 'Camera <em>&amp; Composition</em>', intro: 'Virtual camera moves on a 2.5D layered scene. The key lesson: <b>depth comes from layers moving at different rates</b>. Compare a pan (rotation) with a truck (travel) and you will see why.' },
    { id: 'transitions', num: '07', title: 'Scene <em>Transitions</em>', intro: 'Every demo here cuts from the same <b>Scene A</b> to the same <b>Scene B</b>, so the only difference you see is the transition itself. Timeline: hold A → transition → hold B.' },
    { id: 'product', num: '08', title: 'Product <em>&amp; UI Motion</em>', intro: 'Patterns for app promos and product marketing: device entrances, screen scrolls, taps, callouts and premium product reveals. Generic mock UI only — swap in your own screens.' },
    { id: 'data', num: '09', title: 'Data <em>&amp; Infographics</em>', intro: 'Numbers people remember. Motion should <b>explain the data</b>: counters land on the final value, charts grow from a shared baseline, and steps appear in reading order.' },
    { id: 'brand', num: '10', title: 'Logo <em>&amp; Brand Motion</em>', intro: 'Logo stings and brand moments using a placeholder mark (“AKSA”: sun + peak + horizon). Short is the rule — most logo motion lives in <b>1–2 seconds</b>.' },
    { id: 'hooks', num: '11', title: 'Social Media <em>Hooks</em>', intro: 'Openers for Reels, TikTok and Shorts. The first frame must already work as a still, and something must change within the <b>first second</b>. Turn on Safe Zone to see where platform UI sits.' },
    { id: 'promo', num: '12', title: 'Promo <em>&amp; Advertising</em>', intro: 'Reusable ad patterns: badges, discounts, price reveals, benefits and social proof. Urgency here is <b>honest and tasteful</b> — no fake timers or dark patterns.' },
    { id: 'cta', num: '13', title: 'CTA <em>&amp; End Cards</em>', intro: 'The last seconds decide what the viewer does next. A CTA needs <b>one clear action</b>, enough hold time to read, and small, purposeful motion that points at it.' },
    { id: 'cinematic', num: '14', title: 'Cinematic <em>Effects</em>', intro: 'Finishing layers that add texture and mood. Each one sits on the same base shot so you can judge it honestly. Most look best at <b>low intensity</b> — if you notice the effect first, it is too strong.' },
    { id: 'advanced', num: '15', title: 'Advanced <em>/ Experimental</em>', intro: 'Canvas and WebGL techniques, kept light and stable. Shader demos share one WebGL context and start only when scrolled into view. Approximations are labelled as such.' },
    { id: 'recipes', num: '16', title: 'Motion <em>Recipes</em>', intro: 'Complete mini compositions that combine many techniques into one scene. Study the timeline: <b>hierarchy, overlap and holds</b> are what turn separate effects into a piece of video.' },
    { id: 'principles', num: 'A', learn: true, title: 'Motion <em>Principles</em>', intro: 'Sixteen principles that explain <b>why</b> a motion feels right. Each comparison shows a weak version and a better version of the same content.' },
    { id: 'timing', num: 'B', learn: true, title: 'How Fast Should <em>Motion Be?</em>', intro: 'Durations are relative to distance, size and purpose. The ranges below are a starting point, not a law: a large element travelling across a 9:16 frame needs more time than a button pulse.' },
    { id: 'hierarchy', num: 'C', learn: true, title: 'Motion <em>Hierarchy</em>', intro: '<b>More motion does not automatically mean better motion.</b> Give the strongest move to one hero element, and let everything else support it.' },
    { id: 'personalities', num: 'D', learn: true, title: 'Motion <em>Personalities</em>', intro: 'The same layout can feel premium, energetic, playful, corporate, cinematic, tech or editorial depending only on timing, easing and amplitude. Switch the variants on one composition.' },
    { id: 'social', num: 'E', learn: true, title: 'Social Media <em>Motion Guide</em>', intro: 'How short-form video is structured in time, and where platform UI covers your frame.' },
    { id: 'rhythm', num: 'F', learn: true, title: 'Music, Rhythm <em>&amp; Pacing</em>', intro: 'No audio files here — the beat is drawn on the timeline so you can see how cuts, scale hits and flashes land <b>on</b>, <b>off</b> and <b>between</b> beats. Plus speed ramps, holds and visual rhythm.' },
    { id: 'gsap', num: 'G', learn: true, title: 'Timeline <em>Thinking</em>', intro: 'Every demo in this lab is a timeline. This section maps the vocabulary — duration, delay, position, overlap, stagger, easing — to <code>gsap.timeline()</code>, the most common production tool for this work.' },
    { id: 'builder', num: 'H', learn: true, title: 'Motion <em>Prompt Builder</em>', intro: 'Describe a motion composition precisely and get a reusable prompt for Claude Code (or any AI coding tool).' },
  ];
  VML.SECTIONS = SECTIONS;
  const FILTERS = [['text', 'Text'], ['image', 'Image'], ['object', 'Object'], ['camera', 'Camera'], ['transition', 'Transition'], ['ui', 'UI'], ['brand', 'Brand'], ['social', 'Social'], ['advanced', 'Advanced']];

  const blocks = VML.blocks; // filled by learning modules via VML.block()

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ARROW = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3.5 8.5l5-5M4.5 3.5h4v4"/></svg>';

  const toastEl = $('.toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1600);
  }
  VML.toast = toast;

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      ta.remove();
    }
    if (btn) {
      const old = btn.innerHTML;
      btn.classList.add('copied');
      btn.textContent = 'Copied ✓';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = old; }, 1400);
    }
    toast('Prompt copied to clipboard');
  }
  VML.copyText = copyText;

  /* ---------- content builders shared by cards and Study mode ---------- */
  const ANATOMY = ['Trigger', 'Target', 'Transformation', 'Timing', 'Easing', 'Sequence'];
  function anatomyHTML(def) {
    const a = def.anatomy || [];
    return `<dl class="anatomy">${ANATOMY.map((k, i) => `<dt>${k}</dt><dd>${esc(a[i] || '—')}</dd>`).join('')}</dl>`;
  }
  function useHTML(def) {
    const good = Array.isArray(def.good) ? def.good : [def.good];
    return `<div class="use"><h4>Good for</h4><ul>${good.filter(Boolean).map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      <h4 class="avoid">Avoid when</h4><p>${esc(def.avoid || '—')}</p></div>`;
  }
  const fmtS = (s) => s.toFixed(2).replace(/\.?0+$/, '') || '0';
  function recipeHTML(def, v) {
    const tl = resolveTracks(pick(def.tracks, v, def) || []);
    const dur = pick(def.dur, v, def) || Math.max(1, tl.end + 0.8);
    const rows = tl.list.filter((t) => !t.hidden).map((t) => {
      const win = t.dur === 0 ? `@ ${fmtS(t.start)}s` : `${fmtS(t.start)}–${fmtS(t.end)}s`;
      const extra = t.n > 1 ? ` · ${t.n}× stagger ${Math.round(t.each * 1000)}ms` : '';
      return `<tr><td class="k-${t.kind}"><i></i>${esc(t.label)}</td><td class="mono">${win}</td><td class="mono">${t.dur === 0 ? 'marker' : esc(t.easeName) + extra}</td><td class="mono">${t.pos ? esc(t.pos) : '—'}</td></tr>`;
    }).join('');
    return `<table class="recipe"><thead><tr><th>Event</th><th>Window</th><th>Ease</th><th>Position</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="recipe-foot">Total ${fmtS(dur)}s · position uses GSAP syntax (<b>&lt;</b> with previous, <b>-=</b> overlap, <b>+=</b> gap)</p>`;
  }
  function promptText(def, v) {
    const p = pick(def.prompt, v, def);
    if (p) return p;
    const a = def.anatomy || [];
    return `Create a "${def.name}" motion: ${def.what || ''} Target: ${a[1] || 'the main element'}. Transformation: ${a[2] || ''}. Timing: ${a[3] || ''}. Easing: ${a[4] || ''}.`;
  }
  function promptHTML(def, v) {
    return `<div class="prompt"><pre>${esc(promptText(def, v))}</pre><button type="button" class="btn btn--small" data-copy>Copy prompt</button></div>`;
  }
  function charsHTML(def) {
    return (def.char || []).map((c) => `<span class="chip">${esc(c)}</span>`).join('');
  }
  function noteHTML(def) {
    return def.note ? `<p class="card__note"><b>Note ·</b> ${esc(def.note)}</p>` : '';
  }

  /* ---------- page build ---------- */
  const main = $('#sections');
  const navList = $('#nav');
  const mobileSelect = $('#mobile-cat');
  const cards = [];
  let order = [];

  function buildSections() {
    let html = '';
    SECTIONS.forEach((s) => {
      const list = demos.filter((d) => d.cat === s.id);
      s.count = list.length;
      html += `<section class="section${s.learn ? ' section--learn' : ''}" id="${s.id}" aria-labelledby="h-${s.id}" data-sec="${s.id}">
        <header class="section__head">
          <div><span class="section__num">${s.learn ? 'Learn · ' + s.num : s.num + ' / 16'}</span><h2 class="section__title" id="h-${s.id}">${s.title}</h2></div>
          <div><p class="section__intro">${s.intro}</p>${list.length ? `<p class="section__meta">${list.length} interactive ${list.length === 1 ? 'example' : 'examples'}</p>` : ''}</div>
        </header>
        <div class="blocks" data-blocks="${s.id}"></div>
        ${list.length ? `<div class="grid" data-grid="${s.id}"></div>` : ''}
      </section>`;
    });
    main.innerHTML = html;

    SECTIONS.forEach((s) => {
      const host = $(`[data-blocks="${s.id}"]`);
      (blocks[s.id] || []).forEach((b) => {
        const wrap = document.createElement('div');
        wrap.className = 'block';
        wrap.innerHTML = typeof b.html === 'function' ? b.html() : b.html;
        host.appendChild(wrap);
        if (b.init) b.init(wrap);
      });
      const grid = $(`[data-grid="${s.id}"]`);
      if (!grid) return;
      demos.filter((d) => d.cat === s.id).forEach((def, i) => {
        def.num = (s.learn ? s.num : s.num) + '.' + String(i + 1).padStart(2, '0');
        def.section = s;
        grid.appendChild(buildCard(def));
      });
    });
    order = cards.map((c) => c.def);

    const navItem = (s) => `<li><a href="#${s.id}" data-nav="${s.id}"><span class="nav__num">${s.num}</span><span>${s.title.replace(/<[^>]+>/g, '')}</span><span class="nav__count" data-count="${s.id}">${s.count || ''}</span></a></li>`;
    navList.innerHTML = SECTIONS.filter((s) => !s.learn).map(navItem).join('');
    $('#nav-learn').innerHTML = SECTIONS.filter((s) => s.learn).map(navItem).join('');
    mobileSelect.innerHTML = SECTIONS.map((s) => `<option value="${s.id}">${s.num} · ${s.title.replace(/<[^>]+>/g, '').replace('&amp;', '&')}</option>`).join('');
  }

  function buildCard(def) {
    const card = document.createElement('article');
    card.className = 'card' + (def.wide ? ' card--wide' : '');
    card.id = 'd-' + def.id;
    card.innerHTML = `
      <header class="card__head">
        <span class="card__num">${def.num}</span>
        <div class="card__titles"><h3 class="card__name">${esc(def.name)}</h3>${def.aka.length ? `<p class="card__aka">aka ${def.aka.map(esc).join(' · ')}</p>` : ''}</div>
        <button type="button" class="card__study" data-study aria-label="Study ${esc(def.name)} in focus mode">Study ${ARROW}</button>
      </header>
      <div class="card__player"></div>
      <p class="card__what">${esc(def.what || '')}</p>
      <div class="card__chars">${charsHTML(def)}</div>
      ${noteHTML(def)}
      <div class="tabs" role="tablist" aria-label="${esc(def.name)} details">
        <button type="button" role="tab" aria-selected="true" data-tab="anatomy">Anatomy</button>
        <button type="button" role="tab" aria-selected="false" data-tab="use">Use</button>
        <button type="button" role="tab" aria-selected="false" data-tab="timing">Timing recipe</button>
        <button type="button" role="tab" aria-selected="false" data-tab="prompt">Prompt</button>
      </div>
      <div class="tabpanel" role="tabpanel" data-panel="anatomy">${anatomyHTML(def)}</div>
      <div class="tabpanel" role="tabpanel" data-panel="use" hidden>${useHTML(def)}</div>
      <div class="tabpanel" role="tabpanel" data-panel="timing" hidden></div>
      <div class="tabpanel" role="tabpanel" data-panel="prompt" hidden></div>`;
    const player = new Player(def, $('.card__player', card), { mode: 'card' });
    const refresh = (v) => {
      $('[data-panel="timing"]', card).innerHTML = recipeHTML(def, v);
      $('[data-panel="prompt"]', card).innerHTML = promptHTML(def, v);
    };
    refresh(player.v);
    player.onVariant = refresh;
    card.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        $$('[data-tab]', card).forEach((b) => b.setAttribute('aria-selected', String(b === tab)));
        $$('[data-panel]', card).forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
        return;
      }
      if (e.target.closest('[data-copy]')) copyText(promptText(def, player.v), e.target.closest('[data-copy]'));
      if (e.target.closest('[data-study]')) openStudy(def, player.v);
    });
    const hay = [def.name, ...def.aka, ...def.tags, ...(def.char || []), def.what, def.section.title, ...(def.variants || []).map((v) => v[1]), ...(def.keywords || [])].join(' ').toLowerCase().replace(/<[^>]+>/g, '');
    cards.push({ def, card, player, hay });
    return card;
  }

  /* ---------- search + filter ---------- */
  let query = '';
  let filter = null;
  function applyFilter() {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    const counts = {};
    let total = 0;
    cards.forEach((c) => {
      const okTag = !filter || c.def.tags.includes(filter);
      const okQ = terms.every((t) => c.hay.includes(t));
      const show = okTag && okQ;
      c.card.hidden = !show;
      if (show) { counts[c.def.cat] = (counts[c.def.cat] || 0) + 1; total++; }
    });
    const active = !!(terms.length || filter);
    SECTIONS.forEach((s) => {
      const sec = document.getElementById(s.id);
      const n = counts[s.id] || 0;
      sec.hidden = active && n === 0;
      const badge = $(`[data-count="${s.id}"]`);
      if (badge) badge.textContent = s.count ? (active ? n + '/' + s.count : s.count) : '';
      const a = $(`[data-nav="${s.id}"]`);
      if (a) a.classList.toggle('is-empty', active && n === 0);
    });
    $('.no-results').classList.toggle('is-on', active && total === 0);
    $('#result-count').textContent = active ? `${total} of ${cards.length} demos` : `${cards.length} demos`;
  }
  function bindSearch() {
    $$('input[data-search]').forEach((input) => {
      input.addEventListener('input', () => {
        query = input.value;
        $$('input[data-search]').forEach((o) => { if (o !== input) o.value = input.value; });
        applyFilter();
      });
    });
    const filterHTML = `<button type="button" class="chip" data-filter="" aria-pressed="true">All</button>` +
      FILTERS.map(([id, label]) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="false">${label}</button>`).join('');
    $$('[data-filters]').forEach((el) => { el.innerHTML = filterHTML; });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      const val = b.dataset.filter || null;
      filter = filter === val ? null : val;
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String((x.dataset.filter || null) === filter)));
      applyFilter();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        const input = window.innerWidth > 900 ? $('.sidebar input[data-search]') : $('.mobile-nav input[data-search]');
        input && input.focus();
      }
    });
    $('.no-results button').addEventListener('click', () => {
      query = ''; filter = null;
      $$('input[data-search]').forEach((i) => { i.value = ''; });
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(!x.dataset.filter)));
      applyFilter();
    });
  }

  /* ---------- global controls ---------- */
  function bindControls() {
    $$('.gcontrols [data-setting]').forEach((group) => {
      const key = group.dataset.setting;
      const sync = () => $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === settings[key])));
      sync();
      group.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-value]');
        if (b) setSetting(key, b.dataset.value);
      });
      onSetting((k) => { if (k === key) sync(); });
    });
    const visible = () => [...VML.players].filter((p) => p.mode === 'card' && p.visible);
    $('#play-visible').addEventListener('click', () => visible().forEach((p) => p.play(true)));
    $('#pause-all').addEventListener('click', () => VML.players.forEach((p) => p.pause(true)));
    $('#replay-visible').addEventListener('click', () => visible().forEach((p) => p.replay()));
    const toggle = $('.controls-toggle');
    const panel = $('.gcontrols');
    toggle.addEventListener('click', () => {
      const open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    onSetting((k, v) => {
      if (k === 'motion') toast(v === 'reduced' ? 'Reduced motion: demos wait for Play' : 'Motion on: visible demos autoplay');
      if (k === 'format') toast('Format ' + v);
    });
  }

  /* ---------- Study (focus) mode ---------- */
  const dialog = $('#study');
  let studyPlayer = null;
  let studyDef = null;
  function openStudy(def, variant) {
    studyDef = def;
    if (studyPlayer) { studyPlayer.destroy(); studyPlayer = null; }
    $('.study__num', dialog).textContent = def.num + ' · ' + def.section.title.replace(/<[^>]+>/g, '').replace('&amp;', '&');
    $('.study__name', dialog).textContent = def.name;
    const info = $('.study__info', dialog);
    const fill = (v) => {
      info.innerHTML = `
        ${def.aka.length ? `<div class="study__sec"><h3>Aliases</h3><p>${def.aka.map(esc).join(' · ')}</p></div>` : ''}
        <div class="study__sec"><h3>What it does</h3><p>${esc(def.what || '')}</p></div>
        ${def.char.length ? `<div class="study__sec"><h3>Visual character</h3><div class="card__chars">${charsHTML(def)}</div></div>` : ''}
        ${def.note ? `<div class="study__sec">${noteHTML(def)}</div>` : ''}
        <div class="study__sec"><h3>Motion anatomy</h3>${anatomyHTML(def)}</div>
        <div class="study__sec">${useHTML(def)}</div>
        <div class="study__sec"><h3>Timing recipe</h3>${recipeHTML(def, v)}</div>
        <div class="study__sec"><h3>Prompt recipe</h3>${promptHTML(def, v)}</div>`;
    };
    if (!dialog.open) {
      VML.suspendCards(true);
      dialog.showModal();
    }
    studyPlayer = new Player(def, $('.study__player', dialog), { mode: 'study' });
    if (variant && variant !== studyPlayer.v) studyPlayer.setVariant(variant);
    fill(studyPlayer.v);
    studyPlayer.onVariant = fill;
    info.scrollTop = 0;
    requestAnimationFrame(() => studyPlayer.stage.focus({ preventScroll: true }));
    history.replaceState(null, '', '#d-' + def.id);
  }
  function closeStudy() {
    if (studyPlayer) { studyPlayer.destroy(); studyPlayer = null; }
    VML.suspendCards(false);
    if (studyDef) {
      const card = document.getElementById('d-' + studyDef.id);
      const btn = card && $('[data-study]', card);
      if (btn) btn.focus({ preventScroll: true });
    }
  }
  function stepStudy(dir) {
    const list = cards.filter((c) => !c.card.hidden).map((c) => c.def);
    const i = list.indexOf(studyDef);
    const next = list[(i + dir + list.length) % list.length];
    if (next) openStudy(next);
  }
  function bindStudy() {
    dialog.addEventListener('close', closeStudy);
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
      if (e.target.closest('[data-close]')) dialog.close();
      if (e.target.closest('[data-prev]')) stepStudy(-1);
      if (e.target.closest('[data-next]')) stepStudy(1);
      const cp = e.target.closest('[data-copy]');
      if (cp && studyDef) copyText(promptText(studyDef, studyPlayer && studyPlayer.v), cp);
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === ']' || e.key === 'PageDown') { e.preventDefault(); stepStudy(1); }
      if (e.key === '[' || e.key === 'PageUp') { e.preventDefault(); stepStudy(-1); }
    });
  }

  /* ---------- scrollspy ---------- */
  function bindSpy() {
    const links = {};
    $$('[data-nav]').forEach((a) => { links[a.dataset.nav] = a; });
    let current = null;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        if (id === current) return;
        current = id;
        Object.values(links).forEach((a) => a.classList.toggle('is-active', a === links[id]));
        if (mobileSelect.value !== id) mobileSelect.value = id;
        const a = links[id];
        if (a && window.innerWidth > 900) {
          const side = $('.sidebar');
          const r = a.getBoundingClientRect(), sr = side.getBoundingClientRect();
          if (r.top < sr.top + 60 || r.bottom > sr.bottom - 20) side.scrollTo({ top: side.scrollTop + r.top - sr.top - 120, behavior: 'auto' });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    SECTIONS.forEach((s) => io.observe(document.getElementById(s.id)));
    mobileSelect.addEventListener('change', () => {
      document.getElementById(mobileSelect.value).scrollIntoView({ behavior: VML.reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- hero ---------- */
  function buildHero() {
    const n = demos.length;
    const recipes = demos.filter((d) => d.cat === 'recipes').length;
    const named = demos.reduce((sum, d) => sum + Math.max(1, d.covers || (d.variants ? d.variants.length : 1)), 0);
    $('#stat-demos').textContent = n;
    $('#stat-techniques').textContent = named + '+';
    $('#stat-recipes').textContent = recipes;
    const feature = VML.byId['recipe-premium-product'] || demos.find((d) => d.cat === 'recipes') || demos[0];
    if (feature) {
      const hp = new Player(feature, $('#hero-player'), { mode: 'card' });
      hp.root.classList.add('player--hero');
      $('#hero-feature-link').href = '#d-' + feature.id;
      $('#hero-feature-link').textContent = feature.name;
    }
  }

  function init() {
    buildSections();
    bindSearch();
    bindControls();
    bindStudy();
    bindSpy();
    buildHero();
    applyFilter();
    if (location.hash.startsWith('#d-')) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    }
    document.documentElement.classList.add('is-ready');
  }
  init();
})();
