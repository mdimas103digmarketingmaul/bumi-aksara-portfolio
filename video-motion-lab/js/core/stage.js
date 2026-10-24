/* =========================================================================
   Video Motion Lab — demo registry + scene runtime
   VML.demo(def) registers a demo. VML.Scene mounts one demo into a stage
   and gives its render(t, c) a context object `c`:

     c.p.key     eased progress (0…1) of track `key` at the current time
     c.r.key     linear progress of the track
     c.st(key,i) eased progress of item i of a staggered track
     c.at(s,d,e) eased progress of an ad-hoc window (not shown on the timeline)
     c.$.name    first element with data-r="name";  c.$$.name → all of them
     c.set(el,o) write transform / opacity / filter from a plain object
     c.canvas(el) size a <canvas> to the stage (DPR capped) → { g, w, h }
     c.W, c.H    scene size in px; c.u = 1% of the shorter side, in px
     c.v         current variant id;  c.data → scratch space for init()
   ========================================================================= */
(function () {
  'use strict';
  const VML = window.VML;
  const { resolveTracks, computeProgress, seg, ease, settings } = VML;

  /* ---------- registry ---------- */
  const demos = [];
  const byId = {};
  function demo(def) {
    if (byId[def.id]) { console.warn('[VML] duplicate demo id', def.id); return; }
    const d = Object.assign({ tags: [], aka: [], char: [], good: [], variants: null, fixed: null, wide: false }, def);
    demos.push(d);
    byId[d.id] = d;
    return d;
  }
  /* Learning sections can add rich content blocks above their demo grid. */
  const blocks = {};
  const block = (sectionId, html, init) => { (blocks[sectionId] = blocks[sectionId] || []).push({ html, init }); };

  /* Resolve fields that may depend on the current variant. */
  const pick = (val, v, d) => (typeof val === 'function' ? val(v, d) : val);

  /* ---------- transform writer ---------- */
  const T_KEYS = ['x', 'y', 'z', 'xw', 'yh', 'xp', 'yp', 's', 'sx', 'sy', 'r', 'rx', 'ry', 'skx', 'sky'];
  const F_KEYS = ['blur', 'bright', 'sat', 'hue', 'contrast', 'gray'];
  function writeStyle(el, o, u) {
    if (!el) return;
    let hasT = false, hasF = false;
    for (const k in o) { if (!hasT && T_KEYS.includes(k)) hasT = true; if (!hasF && F_KEYS.includes(k)) hasF = true; }
    if (hasT) {
      let tf = '';
      if (o.x || o.y || o.z) tf += `translate3d(${o.x || 0}cqmin,${o.y || 0}cqmin,${o.z || 0}cqmin) `;
      if (o.xw || o.yh) tf += `translate(${o.xw || 0}cqw,${o.yh || 0}cqh) `;
      if (o.xp || o.yp) tf += `translate(${o.xp || 0}%,${o.yp || 0}%) `;
      if (o.rx) tf += `rotateX(${o.rx}deg) `;
      if (o.ry) tf += `rotateY(${o.ry}deg) `;
      if (o.r) tf += `rotate(${o.r}deg) `;
      if (o.skx || o.sky) tf += `skew(${o.skx || 0}deg,${o.sky || 0}deg) `;
      const sx = o.sx != null ? o.sx : o.s != null ? o.s : 1;
      const sy = o.sy != null ? o.sy : o.s != null ? o.s : 1;
      if (sx !== 1 || sy !== 1) tf += `scale(${sx},${sy})`;
      el.style.transform = tf || 'none';
    }
    if (o.o != null) el.style.opacity = o.o < 0.001 ? 0 : o.o > 0.999 ? 1 : o.o;
    if (hasF) {
      let f = '';
      if (o.blur) f += `blur(${(o.blur * u).toFixed(2)}px) `;
      if (o.bright != null && o.bright !== 1) f += `brightness(${o.bright}) `;
      if (o.sat != null && o.sat !== 1) f += `saturate(${o.sat}) `;
      if (o.contrast != null && o.contrast !== 1) f += `contrast(${o.contrast}) `;
      if (o.hue) f += `hue-rotate(${o.hue}deg) `;
      if (o.gray) f += `grayscale(${o.gray}) `;
      el.style.filter = f || 'none';
    }
    if (o.clip != null) { el.style.clipPath = o.clip; el.style.webkitClipPath = o.clip; }
    if (o.dash != null) el.style.strokeDashoffset = o.dash;
    if (o.vars) for (const k in o.vars) el.style.setProperty(k, o.vars[k]);
    if (o.css) Object.assign(el.style, o.css);
  }

  /* ---------- canvas sizing ---------- */
  const DPR_CAP = 1.5;
  function fitCanvas(cv, info) {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, info.cap || DPR_CAP);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    info.w = w; info.h = h; info.dpr = dpr;
    if (info.g && info.g.setTransform) info.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return info;
  }

  /* ---------- scene: one mounted demo instance ---------- */
  class Scene {
    constructor(def, el, variant) {
      this.def = def;
      this.el = el;
      this.v = variant;
      this.canvases = [];
      this.destroyed = false;
      this.build();
    }
    build() {
      const { def, el } = this;
      const v = this.v;
      this.tl = resolveTracks(pick(def.tracks, v, def) || []);
      const d = pick(def.dur, v, def);
      this.dur = d || Math.max(1, this.tl.end + 0.8);
      el.className = 'scene ' + (pick(def.cls, v, def) || '');
      el.innerHTML = pick(def.html, v, def) || '';
      const $ = {}, $$ = {};
      el.querySelectorAll('[data-r]').forEach((n) => {
        const k = n.dataset.r;
        if (!$[k]) $[k] = n;
        ($$[k] = $$[k] || []).push(n);
      });
      const self = this;
      const c = (this.ctx = {
        t: 0, dur: this.dur, p: {}, r: {}, tl: this.tl, $, $$, v, root: el, data: {},
        W: el.clientWidth || 1, H: el.clientHeight || 1, u: 1,
        get reduced() { return VML.reduced; },
        st(key, i, e) {
          const tr = self.tl.map[key];
          if (!tr) return 0;
          return (e ? ease(e) : tr.ease)(seg(c.t, tr.start + i * tr.each, tr.dur));
        },
        at(start, dur, e) { return ease(e || 'out')(seg(c.t, start, dur)); },
        /* Rate of change of a track's eased progress (1 = linear speed). Drives stretch / motion blur. */
        speed(key) {
          const tr = self.tl.map[key];
          if (!tr || tr.dur <= 0) return 0;
          const r = seg(c.t, tr.start, tr.dur);
          if (r <= 0 || r >= 1) return 0;
          const h = 0.008;
          return (tr.ease(Math.min(1, r + h)) - tr.ease(Math.max(0, r - h))) / (Math.min(1, r + h) - Math.max(0, r - h));
        },
        set(n, o) { writeStyle(n, o, c.u); },
        setAll(list, fn) { if (list) list.forEach((n, i) => writeStyle(n, fn(i, n), c.u)); },
        canvas(cv, opts = {}) {
          const info = { cv, g: opts.webgl ? null : cv.getContext('2d'), cap: opts.cap };
          self.canvases.push(info);
          return fitCanvas(cv, info);
        },
      });
      this.measure();
      if (def.init) {
        try { def.init(c); } catch (err) { console.error('[VML] init failed:', def.id, err); }
      }
    }
    measure() {
      const c = this.ctx;
      c.W = this.el.clientWidth || c.W;
      c.H = this.el.clientHeight || c.H;
      c.u = Math.min(c.W, c.H) / 100;
      this.canvases.forEach((info) => fitCanvas(info.cv, info));
      if (this.def.resize) this.def.resize(c);
    }
    render(t) {
      if (this.destroyed) return;
      const c = this.ctx;
      c.t = t;
      computeProgress(this.tl, t, c.p, c.r);
      try { this.def.render(t, c); } catch (err) {
        if (!this.errored) { console.error('[VML] render failed:', this.def.id, err); this.errored = true; }
      }
    }
    setVariant(v) {
      if (this.def.destroy) this.def.destroy(this.ctx);
      this.canvases = [];
      this.v = v;
      this.build();
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      if (this.def.destroy) { try { this.def.destroy(this.ctx); } catch (e) { /* ignore */ } }
      this.el.innerHTML = '';
      this.canvases = [];
    }
  }

  /* ---------- safe-zone overlay ----------
     Approximate guides only. Platform UIs change and differ per device, so
     the numbers are rounded, conservative teaching values, not specs. */
  function safeZoneHTML(format) {
    if (format === '9:16') {
      return `<div class="sz sz--top"><span>Top UI risk · account, tabs, title</span></div>
        <div class="sz sz--bottom"><span>Caption · CTA · audio risk</span></div>
        <div class="sz sz--side"><span>Actions</span></div>
        <div class="sz-safe"><span>Center safe content</span></div>
        <div class="sz-tag">Approximate social UI safe zone</div>`;
    }
    if (format === '16:9') {
      return `<div class="sz-frame sz-frame--action"><span>Action-safe ≈ 93%</span></div>
        <div class="sz-frame sz-frame--title"><span>Title-safe ≈ 90%</span></div>
        <div class="sz sz--player"><span>Player controls · captions</span></div>
        <div class="sz-tag">Approximate player safe zone</div>`;
    }
    return `<div class="sz-frame sz-frame--title"><span>Title-safe ≈ 90%</span></div>
      <div class="sz-center-guide"><span>Keep key content central · grid previews crop edges</span></div>
      <div class="sz sz--feed"><span>Caption overlay (carousel/ads)</span></div>
      <div class="sz-tag">Approximate feed safe zone</div>`;
  }

  Object.assign(VML, { demos, byId, demo, block, blocks, pick, Scene, writeStyle, fitCanvas, safeZoneHTML });
})();
