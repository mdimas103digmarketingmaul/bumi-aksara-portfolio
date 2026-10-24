/* =========================================================================
   Video Motion Lab — one shared WebGL renderer
   Browsers allow only a handful of live WebGL contexts per page. Instead of
   one context per demo, every shader demo renders through this single
   hidden canvas and copies the frame into its own 2D canvas (drawImage).
   The context is created lazily, on the first shader demo that scrolls in.
   ========================================================================= */
(function () {
  'use strict';
  const VML = window.VML;

  const VERT = `attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  /* Shared GLSL helpers prepended to every fragment shader. */
  const HEADER = `precision mediump float;
    varying vec2 v_uv; uniform vec2 u_res; uniform float u_time; uniform float u_p;
    float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
    float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * vnoise(p); p *= 2.02; a *= 0.5; } return v; }
    /* Square texture → cover the canvas, whatever its aspect ratio. */
    vec2 cover(vec2 uv){ float a = u_res.x / u_res.y; if (a > 1.0) uv.y = (uv.y - 0.5) / a + 0.5; else uv.x = (uv.x - 0.5) * a + 0.5; return uv; }
  `;

  let canvas = null, gl = null, buf = null, failed = false;
  const programs = new Map();
  const textures = new Map();

  function ctx() {
    if (gl || failed) return gl;
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) { failed = true; console.warn('[VML] WebGL unavailable — shader demos show a fallback.'); return null; }
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); programs.clear(); textures.clear(); gl = null; });
    return gl;
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(key, frag) {
    if (programs.has(key)) return programs.get(key);
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, HEADER + frag));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const entry = { p, loc: {}, aPos: gl.getAttribLocation(p, 'a_pos') };
    programs.set(key, entry);
    return entry;
  }
  /* Rasterise an image (SVG included) into a square canvas, then upload once. */
  function texture(src, img) {
    if (textures.has(src)) return textures.get(src);
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    c.getContext('2d').drawImage(img, 0, 0, 1024, 1024);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    textures.set(src, t);
    return t;
  }

  /* Render `frag` into the 2D canvas described by `info` ({ g, w, h }).
     uniforms: numbers or [x,y(,z,w)] arrays. images: { u_tex0: {src, img}, … } */
  function draw(info, key, frag, uniforms = {}, images = {}) {
    const g = ctx();
    if (!g) return false;
    let entry;
    try { entry = program(key, frag); } catch (err) {
      console.error('[VML] shader error in', key, err.message);
      programs.set(key, null);
      return false;
    }
    if (!entry) return false;
    // Render at CSS-pixel resolution: shaders are soft, so DPR adds cost, not detail.
    const w = Math.max(1, Math.round(info.w)), h = Math.max(1, Math.round(info.h));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    g.viewport(0, 0, w, h);
    g.useProgram(entry.p);
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.enableVertexAttribArray(entry.aPos);
    g.vertexAttribPointer(entry.aPos, 2, g.FLOAT, false, 0, 0);
    const loc = (n) => (n in entry.loc ? entry.loc[n] : (entry.loc[n] = g.getUniformLocation(entry.p, n)));
    const all = Object.assign({ u_res: [w, h] }, uniforms);
    for (const n in all) {
      const l = loc(n), v = all[n];
      if (l == null) continue;
      if (typeof v === 'number') g.uniform1f(l, v);
      else if (v.length === 2) g.uniform2f(l, v[0], v[1]);
      else if (v.length === 3) g.uniform3f(l, v[0], v[1], v[2]);
      else if (v.length === 4) g.uniform4f(l, v[0], v[1], v[2], v[3]);
    }
    let unit = 0;
    for (const n in images) {
      const im = images[n];
      if (!im || !im.img) continue;
      g.activeTexture(g.TEXTURE0 + unit);
      g.bindTexture(g.TEXTURE_2D, texture(im.src, im.img));
      const l = loc(n);
      if (l != null) g.uniform1i(l, unit);
      unit++;
    }
    g.drawArrays(g.TRIANGLES, 0, 6);
    info.g.clearRect(0, 0, info.w, info.h);
    info.g.drawImage(canvas, 0, 0, info.w, info.h);
    return true;
  }

  VML.GL = { draw, get available() { return !!ctx(); } };
})();
