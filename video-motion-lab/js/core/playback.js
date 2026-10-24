/* =========================================================================
   Video Motion Lab — playback
   One requestAnimationFrame loop drives every *running* player. A player
   runs only when it is playing AND visible AND the tab is in the
   foreground, so off-screen demos cost nothing.

   Player = stage (scene + safe zone + label HUD) + transport (play, pause,
   restart, replay, frame step, scrubber, time, speed) + mini timeline.
   ========================================================================= */
(function () {
  'use strict';
  const VML = window.VML;
  const { settings, onSetting, fmtTime, esc, Scene, pick, safeZoneHTML, clamp } = VML;

  /* ---------- scheduler ---------- */
  const running = new Set();
  let raf = 0, last = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    running.forEach((p) => p.advance(dt));
    raf = running.size ? requestAnimationFrame(frame) : 0;
  }
  function schedule(p, on) {
    if (on) {
      running.add(p);
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    } else running.delete(p);
  }
  document.addEventListener('visibilitychange', () => VML.players.forEach((p) => p.sync()));

  /* ---------- shared viewport observers ---------- */
  const near = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.__player && e.target.__player.mount()), { rootMargin: '700px 0px' });
  const seen = new IntersectionObserver((es) => es.forEach((e) => e.target.__player && e.target.__player.setVisible(e.isIntersecting)), { rootMargin: '40px 0px', threshold: 0.12 });

  const SPEEDS = ['0.5', '1', '1.5', '2'];
  const STEP = 1 / 30;
  const END_HOLD = 0.9; // seconds the last frame is held before a loop restarts
  const ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor"/></svg>',
    restart: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3h1.5v10H2.5zM9 3.6v8.8L4.6 8zM14 3.6v8.8L9.6 8z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.8 8a5.2 5.2 0 1 0 1.6-3.8"/><path d="M2.6 1.8v3h3"/></svg>',
    back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 3h1.5v10H3.2zM12.5 3.4v9.2L5.8 8z" fill="currentColor"/></svg>',
    fwd: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.4v9.2L10.2 8zM11.3 3h1.5v10h-1.5z" fill="currentColor"/></svg>',
  };

  const players = new Set();
  let suspendCards = false;

  class Player {
    /* opts: { mode: 'card' | 'study', autoplay } */
    constructor(def, host, opts = {}) {
      this.def = def;
      this.mode = opts.mode || 'card';
      this.autoplay = opts.autoplay !== false;
      this.v = def.variants ? def.variants[0][0] : null;
      this.t = 0;
      this.playing = false;
      this.visible = false;
      this.userPaused = false;
      this.hold = 0;
      this.speedOverride = null;
      this.scene = null;
      this.everPlayed = false;
      this.build(host);
      players.add(this);
      this.unsub = onSetting((k) => this.onSetting(k));
      if (this.mode === 'study') { this.mount(); this.setVisible(true); }
      else { near.observe(this.stage); seen.observe(this.stage); }
    }

    get speed() { return parseFloat(this.speedOverride || settings.speed); }
    get format() { return this.def.fixed || settings.format; }

    /* ---------- DOM ---------- */
    build(host) {
      const def = this.def;
      const root = (this.root = document.createElement('div'));
      root.className = 'player player--' + this.mode;
      const variants = def.variants
        ? `<div class="variants" role="group" aria-label="Variant">${def.variants.map(([id, label], i) =>
            `<button type="button" data-v="${esc(id)}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('')}</div>`
        : '';
      root.innerHTML = `
        <div class="well">
          <div class="stage" tabindex="0" role="img" aria-label="${esc(def.name)} — motion preview. Space plays or pauses, arrow keys step, R replays."
               ${def.fixed ? `data-fixed="${def.fixed}"` : ''}>
            <div class="scene" aria-hidden="true"></div>
            <div class="safe" aria-hidden="true"></div>
            <div class="hud" aria-hidden="true"></div>
            <button class="stage__cover" type="button" tabindex="-1" aria-hidden="true">${ICON.play}<span>Play</span></button>
          </div>
          ${def.fixed ? `<span class="well__fixed" title="This study uses a fixed format">Fixed ${def.fixed}</span>` : ''}
        </div>
        ${variants}
        <div class="transport">
          <div class="transport__btns">
            <button type="button" class="tbtn tbtn--main" data-a="toggle" aria-label="Play">${ICON.play}</button>
            <button type="button" class="tbtn" data-a="restart" aria-label="Restart (jump to start)" title="Restart">${ICON.restart}</button>
            <button type="button" class="tbtn" data-a="back" aria-label="Step back one frame" title="Frame back">${ICON.back}</button>
            <button type="button" class="tbtn" data-a="fwd" aria-label="Step forward one frame" title="Frame forward">${ICON.fwd}</button>
            <button type="button" class="tbtn" data-a="replay" aria-label="Replay from start" title="Replay">${ICON.replay}</button>
          </div>
          <input class="scrub" type="range" min="0" max="1000" step="1" value="0" aria-label="Scrub timeline" />
          <span class="tcode"><b>00:00.00</b><i>/ 00:00.00</i></span>
          <button type="button" class="tbtn tbtn--speed" data-a="speed" aria-label="Playback speed">1×</button>
        </div>
        <div class="tl" aria-label="Timeline"></div>`;
      host.appendChild(root);
      this.stage = root.querySelector('.stage');
      this.stage.__player = this;
      this.sceneEl = root.querySelector('.scene');
      this.safeEl = root.querySelector('.safe');
      this.hudEl = root.querySelector('.hud');
      this.scrub = root.querySelector('.scrub');
      this.tcode = root.querySelector('.tcode b');
      this.tdur = root.querySelector('.tcode i');
      this.btnMain = root.querySelector('[data-a="toggle"]');
      this.btnSpeed = root.querySelector('[data-a="speed"]');
      this.tlEl = root.querySelector('.tl');
      this.cover = root.querySelector('.stage__cover');
      this.updateSpeedLabel();
      this.updateSafe();
      this.bind();
    }

    bind() {
      const root = this.root;
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-a]');
        if (b && root.contains(b)) {
          const a = b.dataset.a;
          if (a === 'toggle') this.toggle();
          else if (a === 'restart') { this.pause(true); this.seek(0); }
          else if (a === 'replay') this.replay();
          else if (a === 'back') { this.pause(true); this.seek(this.t - STEP); }
          else if (a === 'fwd') { this.pause(true); this.seek(this.t + STEP); }
          else if (a === 'speed') this.cycleSpeed();
          return;
        }
        const vb = e.target.closest('[data-v]');
        if (vb && root.contains(vb)) this.setVariant(vb.dataset.v);
      });
      this.cover.addEventListener('click', () => this.play(true));
      this.stage.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); this.toggle(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); this.pause(true); this.seek(this.t + (e.shiftKey ? 0.5 : STEP)); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); this.pause(true); this.seek(this.t - (e.shiftKey ? 0.5 : STEP)); }
        else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); this.replay(); }
        else if (e.key === 'Home') { e.preventDefault(); this.seek(0); }
      });
      // Scrubbing pauses (like an editor) and stays paused until Play.
      const s = this.scrub;
      s.addEventListener('pointerdown', () => this.pause(true));
      s.addEventListener('input', () => { this.pause(true); this.seek((s.value / 1000) * this.dur); });
      // Timeline lanes are scrubbable too.
      let dragging = false;
      const seekFromLane = (e) => {
        const lane = this.tlEl.querySelector('.tl__ruler .tl__lane');
        if (!lane) return;
        const r = lane.getBoundingClientRect();
        this.seek(clamp((e.clientX - r.left) / r.width) * this.dur);
      };
      this.tlEl.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.tl__lane')) return;
        dragging = true;
        this.pause(true);
        this.tlEl.setPointerCapture(e.pointerId);
        seekFromLane(e);
      });
      this.tlEl.addEventListener('pointermove', (e) => dragging && seekFromLane(e));
      const end = () => { dragging = false; };
      this.tlEl.addEventListener('pointerup', end);
      this.tlEl.addEventListener('pointercancel', end);
    }

    buildTimeline() {
      const tl = this.scene.tl;
      const dur = this.dur;
      const tracks = tl.list.filter((t) => !t.hidden);
      this.tlEl.hidden = tracks.length === 0;
      const step = dur > 9 ? 2 : dur > 2.6 ? 1 : 0.5;
      let ticks = '';
      for (let s = 0; s <= dur + 1e-6; s += step) {
        ticks += `<span class="tl__tick" style="left:${(s / dur) * 100}%">${Number.isInteger(s) ? s + 's' : s.toFixed(1)}</span>`;
      }
      const rows = tracks.map((tr) => {
        const left = (tr.start / dur) * 100;
        const width = (tr.span / dur) * 100;
        let inner = '';
        if (tr.n > 1) {
          for (let i = 0; i < tr.n; i++) {
            inner += `<i class="tl__sub" style="left:${((i * tr.each) / tr.span) * 100}%;width:${(tr.dur / tr.span) * 100}%"></i>`;
          }
        }
        const cls = tr.dur === 0 ? 'tl__mark' : 'tl__bar';
        return `<div class="tl__row" data-k="${esc(tr.key)}"><span class="tl__label" title="${esc(tr.label)}">${esc(tr.label)}</span>
          <div class="tl__lane"><span class="${cls} k-${tr.kind}" style="left:${left}%;width:${tr.dur === 0 ? 0 : Math.max(width, 0.6)}%">${inner}</span></div></div>`;
      }).join('');
      this.tlEl.innerHTML = `<div class="tl__row tl__ruler"><span class="tl__label">${tracks.length} events</span><div class="tl__lane">${ticks}</div></div>
        <div class="tl__rows">${rows}</div><div class="tl__headwrap"><div class="tl__head"></div></div>`;
      this.rowEls = [...this.tlEl.querySelectorAll('.tl__rows .tl__row')].map((el) => ({ el, tr: tl.map[el.dataset.k], on: false }));
      this.tlEl.classList.toggle('tl--dense', tracks.length > 7);
    }

    /* ---------- lifecycle ---------- */
    mount() {
      if (this.scene) return;
      this.root.classList.add('is-mounted');
      this.scene = new Scene(this.def, this.sceneEl, this.v);
      this.dur = this.scene.dur;
      this.tdur.textContent = '/ ' + fmtTime(this.dur);
      this.buildTimeline();
      this.ro = new ResizeObserver(() => { if (this.scene) { this.scene.measure(); this.render(); } });
      this.ro.observe(this.sceneEl);
      if (VML.reduced || !this.autoplay) {
        const poster = pick(this.def.poster, this.v, this.def);
        this.t = poster != null ? poster : this.dur * 0.62;
      }
      this.render();
    }

    setVisible(v) {
      this.visible = v;
      if (v) {
        this.mount();
        if (!this.everPlayed && this.autoplay && !VML.reduced && !this.userPaused) { this.everPlayed = true; this.play(); return; }
      }
      this.sync();
    }

    sync() {
      const blocked = this.mode === 'card' && suspendCards;
      const run = this.playing && this.visible && !document.hidden && !blocked && !!this.scene;
      schedule(this, run);
      this.root.classList.toggle('is-playing', this.playing);
      this.btnMain.innerHTML = this.playing ? ICON.pause : ICON.play;
      this.btnMain.setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
      this.cover.hidden = this.playing || !(VML.reduced && !this.everPlayed);
    }

    play(user) {
      if (!this.scene) this.mount();
      if (user) { this.userPaused = false; this.everPlayed = true; }
      if (this.t >= this.dur - 1e-3) this.t = 0;
      this.hold = 0;
      this.playing = true;
      this.sync();
    }
    pause(user) {
      if (user) this.userPaused = true;
      this.playing = false;
      this.sync();
    }
    toggle() { this.playing ? this.pause(true) : this.play(true); }
    replay() { this.everPlayed = true; this.userPaused = false; this.seek(0); this.play(true); }
    seek(t) {
      if (!this.scene) this.mount();
      this.t = clamp(t, 0, this.dur);
      this.hold = 0;
      this.render();
    }

    advance(dt) {
      if (this.hold > 0) {
        this.hold -= dt;
        if (this.hold <= 0) { this.t = 0; this.render(); }
        return;
      }
      this.t += dt * this.speed;
      if (this.t >= this.dur) {
        this.t = this.dur;
        this.render();
        if (settings.loop === 'on' && !this.def.noLoop) this.hold = END_HOLD;
        else this.pause();
        return;
      }
      this.render();
    }

    render() {
      if (!this.scene) return;
      const t = this.t;
      this.scene.render(t);
      const f = this.dur ? t / this.dur : 0;
      this.scrub.value = Math.round(f * 1000);
      this.scrub.style.setProperty('--sp', f);
      this.tcode.textContent = fmtTime(t);
      this.tlEl.style.setProperty('--ph', f);
      let labels = null;
      const showLabels = settings.labels === 'on';
      if (this.rowEls) {
        for (const row of this.rowEls) {
          const tr = row.tr;
          const on = tr.dur === 0 ? t >= tr.start && t < tr.start + 0.12 : t >= tr.start && t <= tr.end;
          if (on !== row.on) { row.on = on; row.el.classList.toggle('is-on', on); }
          if (on && showLabels) (labels = labels || []).push(tr);
        }
      }
      if (showLabels) {
        const key = labels ? labels.map((l) => l.key).join('|') : '';
        if (key !== this.hudKey) {
          this.hudKey = key;
          this.hudEl.innerHTML = labels ? labels.slice(0, 5).map((l) => `<span class="k-${l.kind}">${esc(l.label)}</span>`).join('') : '';
        }
      }
    }

    /* ---------- settings ---------- */
    onSetting(k) {
      if (k === 'speed') { this.speedOverride = null; this.updateSpeedLabel(); }
      if (k === 'format' || k === 'safe') this.updateSafe();
      if (k === 'labels') { this.hudKey = null; this.hudEl.innerHTML = ''; this.render(); }
      if (k === 'motion') {
        if (VML.reduced) { this.pause(); }
        else if (this.visible && !this.userPaused) this.play();
        this.sync();
      }
      if (k === 'bg' || k === 'format') requestAnimationFrame(() => this.render());
    }
    cycleSpeed() {
      const cur = String(this.speed);
      this.speedOverride = SPEEDS[(SPEEDS.indexOf(cur) + 1) % SPEEDS.length];
      this.updateSpeedLabel();
    }
    updateSpeedLabel() {
      this.btnSpeed.textContent = this.speed + '×';
      this.btnSpeed.classList.toggle('is-custom', !!this.speedOverride);
    }
    updateSafe() {
      const on = settings.safe === 'on';
      this.safeEl.hidden = !on;
      this.safeEl.dataset.fmt = this.format;
      if (on) this.safeEl.innerHTML = safeZoneHTML(this.format);
    }
    setVariant(v) {
      if (v === this.v) return;
      this.v = v;
      this.root.querySelectorAll('[data-v]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
      if (this.scene) {
        this.scene.setVariant(v);
        this.dur = this.scene.dur;
        this.tdur.textContent = '/ ' + fmtTime(this.dur);
        this.buildTimeline();
        this.hudKey = null;
      }
      if (this.onVariant) this.onVariant(v);
      this.replay();
    }

    destroy() {
      schedule(this, false);
      players.delete(this);
      if (this.unsub) this.unsub();
      if (this.ro) this.ro.disconnect();
      near.unobserve(this.stage);
      seen.unobserve(this.stage);
      if (this.scene) this.scene.destroy();
      this.root.remove();
    }
  }

  function suspend(on) {
    suspendCards = on;
    players.forEach((p) => p.sync());
  }

  Object.assign(VML, { Player, players, suspendCards: suspend, ICON });
})();
