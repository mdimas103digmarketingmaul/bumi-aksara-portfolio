/* =========================================================================
   Video Motion Lab — timeline model
   A demo declares its motion as a list of tracks. Each track is one event
   on the timeline (a title entrance, a camera move, a cut, a beat…).

   Track shape (array, positional):
     [key, label, position, duration, ease, extra]

   position follows the GSAP position-parameter vocabulary on purpose, so the
   numbers you read here transfer straight into a gsap.timeline():
     1.2      absolute time in seconds
     '+=0.3'  0.3s after the END of everything so far (gap)
     '-=0.3'  0.3s before the END of everything so far (overlap)
     '<'      same start as the previous track
     '<0.2'   0.2s after the previous track STARTS
     '>'      when the previous track ENDS
     '>-0.1'  0.1s before the previous track ends
   duration 0 makes a marker (a cut, a beat, an impact frame).
   extra: 'kind' string, or { kind, n, each } for a stagger of n items.
   ========================================================================= */
(function () {
  'use strict';
  const { seg, ease } = window.VML;

  const KINDS = ['text', 'image', 'object', 'camera', 'fx', 'ui', 'cta', 'bg', 'beat', 'hold', 'cut'];

  function resolveTracks(list) {
    const out = [];
    const map = {};
    let end = 0;
    let prev = null;
    (list || []).forEach((raw) => {
      const [key, label, pos, dur = 0.5, easeName = 'out', extraRaw] = raw;
      const extra = typeof extraRaw === 'string' ? { kind: extraRaw } : extraRaw || {};
      let start;
      if (typeof pos === 'number') start = pos;
      else if (pos == null || pos === '') start = end;
      else {
        const m = /^(\+=|-=|<|>)?\s*([+-]?\d*\.?\d+)?$/.exec(String(pos).trim());
        const op = m ? m[1] : null;
        const n = m && m[2] ? parseFloat(m[2]) : 0;
        if (op === '+=') start = end + n;
        else if (op === '-=') start = end - n;
        else if (op === '<') start = (prev ? prev.start : 0) + n;
        else if (op === '>') start = (prev ? prev.end : 0) + n;
        else start = n;
      }
      start = Math.max(0, start);
      const each = extra.each || 0;
      const n = extra.n || 1;
      const span = dur + (n - 1) * each;
      const tr = {
        key, label, pos: pos == null ? '' : String(pos), start, dur, span, end: start + span,
        easeName: typeof easeName === 'function' ? (easeName.label || 'custom') : easeName, ease: ease(easeName),
        kind: KINDS.includes(extra.kind) ? extra.kind : guessKind(key, label, dur), n, each,
        hidden: !!extra.hidden,
      };
      out.push(tr);
      map[key] = tr;
      end = Math.max(end, tr.end);
      prev = tr;
    });
    return { list: out, map, end };
  }

  function guessKind(key, label, dur) {
    const s = (key + ' ' + label).toLowerCase();
    if (dur === 0) return /beat|hit|kick/.test(s) ? 'beat' : 'cut';
    if (/hold|pause|read/.test(s)) return 'hold';
    if (/cam|push|pan|tilt|dolly|zoom|orbit|truck|shake/.test(s)) return 'camera';
    if (/cta|button|tap|swipe|download/.test(s)) return 'cta';
    if (/title|head|text|copy|word|line|char|type|caption|label|number|count|price/.test(s)) return 'text';
    if (/photo|image|img|pic|scene/.test(s)) return 'image';
    if (/bg|background|ambient|pattern/.test(s)) return 'bg';
    if (/grain|flash|glitch|blur|fx|light|glow|flare|wipe|mask|transition|cut/.test(s)) return 'fx';
    if (/ui|card|sheet|modal|toggle|phone|screen|notif|app/.test(s)) return 'ui';
    return 'object';
  }

  /* Fill ctx.p (eased) and ctx.r (linear) for time t. Staggered tracks expose
     per-item progress through ctx.st(key, i). */
  function computeProgress(tl, t, p, r) {
    const list = tl.list;
    for (let i = 0; i < list.length; i++) {
      const tr = list[i];
      const raw = seg(t, tr.start, tr.dur);
      r[tr.key] = tr.n > 1 ? seg(t, tr.start, tr.span) : raw;
      p[tr.key] = tr.ease(raw);
    }
  }

  window.VML.resolveTracks = resolveTracks;
  window.VML.computeProgress = computeProgress;
  window.VML.TRACK_KINDS = KINDS;
})();
