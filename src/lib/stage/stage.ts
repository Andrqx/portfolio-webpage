// The home page stage: one WebGL2 canvas that draws every section.
//
// Per frame:
//   1. FLOW  (240 px wide)      update the pointer's wake
//   2. HERO  (one texel per dot) the hero picture, only while visible
//   3. SCENE (screen resolution) the reel, the about photo turning into the contact photo
//   4. POST  (canvas size)       hero dots, CRT treatment, tears, and the wake distorting the picture
//
// Photos and cards are drawn at full resolution. Only the hero is reduced to
// dots, and it is the one expensive thing, so it gets its own small buffer.
// See docs/reference/notes.md.

import { CARD_H, CARD_W, type CardArt, drawCard, drawCorridor, drawNightStreet, loadImage } from "./art";
import { FLOW_FRAG, heroFrag, LENS_K, POST_FRAG, REEL, SCENE_FRAG, VERT } from "./shaders";
import { clamp01, smooth, type Timeline, timeline, Z_REST } from "./timeline";

export type HeroFace = {
  /** centre of the head in the picture, 0..1 from the top left */
  x: number;
  y: number;
  /** half width of the face and half height of the head, as fractions of picture width and height */
  rx: number;
  ry: number;
};

export type StageAssets = {
  heroMedia: string | null;
  heroKey: [number, number];
  heroFace: HeroFace;
  /** a whole photo (.jpg) fills the hero card; this is the part that stays in view when it is cropped, 0..1 from the top left */
  heroFocus?: [number, number];
  /** for a widened photo: where the real photo sits across the picture, 0..1 */
  heroSpan?: [number, number];
  cards: CardArt[];
  /** paragraphs under the about heading: the about section is longer when there are some */
  aboutParagraphs?: number;
  about: string | null;
  contact: string | null;
  /** which part of the contact picture stays in view when it is cropped: 0 bottom, 0.5 middle, 1 top */
  contactAnchor: number;
  dotFont: string;
  monoFont: string;
  /** CSS px of scroll per timeline step: the page's 100vh. Defaults to innerHeight. */
  scrollUnit?: () => number;
};

export type FrameInfo = { s: number; tl: Timeline };

const MAX_DPR = 1.5;
const MAX_PIXELS = 2.6e6;
const MAX_SCENE_W = 2048;
const FLOW_W = 240; // fine enough that the narrow wake (WAKE_R) stays smooth, about 8 CSS px a texel at 1920
const HERO_DOT_PX = 4; // size of one hero dot in CSS px
const WAKE_R = 0.04; // half width of the wake, in screen heights: a band about a tenth of the screen tall (about 100 px at 945)
const WAKE_LIFE = 1100; // ms POST keeps distorting after the wake was last stamped (it has settled by then)
const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;
const ALPHA_RE = /\.(png|webp)$/i; // a cutout with its own transparency
const SCENE_RE = /\.(jpe?g)$/i; // a whole photo with its background, filling the hero card
const STEPS = [1, 1.5, 2, 3]; // scene texel size multipliers used when frames run slow

type Program = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Target = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Screen uv (0..1, y up) to the scene uv that POST shows there. POST looks at
 * the scene through a barrel lens, so the pointer has to go through the same
 * lens before it is used in scene space, or the wake lands off the cursor.
 */
function lens(x: number, y: number): [number, number] {
  const px = x * 2 - 1;
  const py = y * 2 - 1;
  const f = (1 + LENS_K * (px * px + py * py)) / (1 + 2 * LENS_K);
  return [px * f * 0.5 + 0.5, py * f * 0.5 + 0.5];
}

/**
 * The hero card's shape for a given zoom: width over height, and its height as
 * a share of the screen's (ignoring how it sinks as the reel turns). Mirrors
 * reel() in the scene shader.
 */
function heroCard(z: number, aspect: number) {
  const scr = REEL.DIST * REEL.TANF;
  let hh = REEL.CARD * scr;
  const hw = Math.min(hh * REEL.CARD_ASPECT, 0.84 * scr * aspect);
  hh = Math.min(hh, hw / REEL.CARD_ASPECT);
  const h = mix(hh, scr * 1.001, z);
  return { aspect: mix(hw, scr * aspect * 1.001, z) / h, height: h / scr };
}

export class Stage {
  private gl: WebGL2RenderingContext;
  private flowProg: Program;
  private heroProg: Program;
  private sceneProg: Program;
  private postProg: Program;
  private vao: WebGLVertexArrayObject;
  private quad: WebGLBuffer;

  private scene: Target | null = null;
  private hero: Target | null = null;
  private flow: [Target, Target] | null = null;
  private flowIdx = 0;

  private texHero: WebGLTexture;
  private texCards: WebGLTexture;
  private texAbout: WebGLTexture;
  private texContact: WebGLTexture;
  private heroAsp = 1;
  private heroMode = 0;
  /** the hero picture failed to load and the generated figure stands in */
  private heroFailed = false;
  private aspAbout = 16 / 9;
  private aspContact = 16 / 9;
  // set when the photos load; the drawn stand-ins for a missing photo are 1600 x 900
  private aboutTexW = 1600;
  private aboutTexH = 900;
  private contactTexW = 1600;
  private contactTexH = 900;
  private video: HTMLVideoElement | null = null;

  private raf = 0;
  private last = 0;
  private time = 0;
  private s = 0;
  private tear = 0;
  private mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, e: 0, tiltX: 0, tiltY: 0 };
  private lastPointer = -1e9;
  /** the pointer is off the page (or the page lost focus): its next move is a jump, not a stroke */
  private away = true;
  /** when the wake was last stamped; POST distorts the picture until it has settled */
  private lastStamp = -1e9;
  private speedBackoff = 20000;
  /** the wake buffer can hold half floats (most WebGL2 devices); otherwise 8 bit */
  private flowFloat = false;
  private seed = 0;
  /** 0..1, a burst of glitches on the hero, every few seconds */
  private glitch = 0;
  private glitchAt = 2;
  /** a tear (over the hero) or a ripple (over photos) that rolls through the picture now and then */
  private band = { y: 0.5, v: 0, a: 0, kind: 0, start: 0, end: 0, next: 2.5 };
  private cssW = 1;
  private cssH = 1;
  private cols = 1;
  private rows = 1;
  private texel = 1;
  private maxDpr = MAX_DPR;
  private step = 0;
  private slow = 0;
  private speedCheckAt = 0;
  private unitPx = 1;
  private lost = false;
  private reduced = false;
  private dirty = true;
  private dead = false;
  private mq: MediaQueryList;

  constructor(
    private canvas: HTMLCanvasElement,
    private assets: StageAssets,
    private onFrame: (f: FrameInfo) => void,
    private onReady: () => void = () => undefined,
  ) {
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false });
    if (!gl) throw new Error("WebGL2 is not available");
    if (gl.isContextLost()) throw new Error("the WebGL context is lost");
    this.gl = gl;
    // either extension lets WebGL2 render to the half float wake buffer
    this.flowFloat = !!(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"));
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    this.flowProg = this.program(FLOW_FRAG, "flow");
    // the generated mannequin is only compiled when there is no hero picture
    this.heroProg = this.program(heroFrag(!assets.heroMedia), "hero");
    this.sceneProg = this.program(SCENE_FRAG, "scene");
    this.postProg = this.program(POST_FRAG, "post");

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    this.quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.texHero = this.solid([0, 0, 0, 0]);
    this.texAbout = this.solid([10, 12, 16, 255]);
    this.texContact = this.solid([14, 10, 8, 255]);
    this.texCards = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texCards);
    const levels = Math.floor(Math.log2(CARD_W)) + 1;
    // two layers per card: the base and the animated mark
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, levels, gl.RGBA8, CARD_W, CARD_H, Math.max(1, assets.cards.length) * 2);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduced = this.mq.matches;
    this.mq.addEventListener("change", this.onMotionPref);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    window.addEventListener("pointerout", this.onPointerOut, { passive: true });
    window.addEventListener("blur", this.onAway);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    canvas.addEventListener("webglcontextlost", this.onLost);

    this.measureUnit();
    this.s = window.scrollY / this.unitPx;
    this.resize();
    void this.loadAssets();
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    this.mq.removeEventListener("change", this.onMotionPref);
    window.removeEventListener("pointermove", this.onPointer);
    window.removeEventListener("pointerout", this.onPointerOut);
    window.removeEventListener("blur", this.onAway);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    if (this.video) {
      this.video.pause();
      this.video.removeAttribute("src");
      this.video.load();
    }
    // Free the GPU objects. Objects made before a context loss belong to the old
    // context, so there is nothing to free after one.
    const gl = this.gl;
    if (this.lost || gl.isContextLost()) return;
    for (const p of [this.flowProg, this.heroProg, this.sceneProg, this.postProg]) gl.deleteProgram(p.prog);
    for (const t of [this.texHero, this.texCards, this.texAbout, this.texContact]) gl.deleteTexture(t);
    this.drop(this.scene);
    this.drop(this.hero);
    this.flow?.forEach((t) => this.drop(t));
    gl.deleteBuffer(this.quad);
    gl.deleteVertexArray(this.vao);
    // On a real unmount React has already taken the canvas out of the page, so
    // nothing can reuse its context: release it now instead of waiting for garbage
    // collection. React's dev-only effect replay keeps the canvas in the page and
    // hands it to the next stage, and a deliberately lost context cannot be used
    // again, so in that case the context is kept.
    if (!this.canvas.isConnected) gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  private timelineAt(s: number) {
    return timeline(s, this.assets.cards.length, this.assets.aboutParagraphs ?? 0);
  }

  /** Dev helper: draw `n` frames back to back and return average milliseconds per frame. */
  bench(n = 40) {
    const gl = this.gl;
    const tl = this.timelineAt(this.s);
    const px = new Uint8Array(4);
    gl.finish();
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
      this.time += 0.016;
      this.draw(tl, 0.016);
    }
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    return {
      ms: (performance.now() - t0) / n,
      canvas: [this.canvas.width, this.canvas.height],
      scene: [this.cols, this.rows],
      hero: this.hero ? [this.hero.w, this.hero.h] : null,
    };
  }

  /**
   * Dev helper: draw frames at scroll position `s` (in screens) without waiting
   * for the browser, optionally moving the mouse through `path` (0..1, y down),
   * and return the last frame as a JPEG data URL.
   */
  capture(s: number, path: [number, number][] = [], time = this.time, encode = true) {
    const m = this.mouse;
    this.s = s;
    this.time = time;
    const tl = this.timelineAt(s);
    const steps = path.length ? path : [[m.tx, 1 - m.ty] as [number, number]];
    for (const [x, y] of steps) {
      const px = m.x;
      const py = m.y;
      m.tx = m.x = x;
      m.ty = m.y = 1 - y;
      m.tiltX = x * 2 - 1;
      m.tiltY = (1 - y) * 2 - 1;
      const moved = Math.hypot((m.x - px) * (this.cssW / this.cssH), m.y - py);
      m.e = path.length ? Math.min(1, moved * 55) : 0;
      this.time += 1 / 60;
      this.updateGlitch(1 / 60);
      this.updateBand(1 / 60, tl);
      this.draw(tl, 1 / 60, px, py);
    }
    this.onFrame({ s, tl });
    return encode ? this.canvas.toDataURL("image/jpeg", 0.88) : "";
  }

  // ------------------------------------------------------------- events --

  private onMotionPref = () => {
    this.reduced = this.mq.matches;
    if (this.reduced) {
      // drop what was mid-animation, so nothing creeps back on later redraws
      this.glitch = 0;
      this.mouse.tiltX = 0;
      this.mouse.tiltY = 0;
    }
    this.dirty = true;
  };
  private onPointer = (e: PointerEvent) => {
    const m = this.mouse;
    m.tx = e.clientX / this.cssW;
    m.ty = 1 - e.clientY / this.cssH;
    // The first move after the pointer comes onto the page, or after the page
    // was in the background, is a jump, not a stroke: go straight there so the
    // wake does not draw a line across. A finger or pen that lifts and lands
    // somewhere else does the same.
    const now = performance.now();
    if (this.away || (e.pointerType !== "mouse" && now - this.lastPointer > 150)) {
      m.x = m.tx;
      m.y = m.ty;
    }
    this.away = false;
    this.lastPointer = now;
    this.dirty = true;
  };
  private onPointerOut = (e: PointerEvent) => {
    // relatedTarget is null when the pointer leaves the window altogether
    if (!e.relatedTarget) this.away = true;
  };
  private onAway = () => {
    this.away = true;
  };
  private onResize = () => {
    this.measureUnit();
    this.resize();
    this.dirty = true;
  };
  private onScroll = () => {
    this.dirty = true;
  };
  private onLost = (e: Event) => {
    // ask for the context back; HomeStage builds a new stage when it returns
    e.preventDefault();
    this.lost = true;
    this.dead = true;
    cancelAnimationFrame(this.raf);
  };

  private measureUnit() {
    this.unitPx = Math.max(1, this.assets.scrollUnit?.() || window.innerHeight);
  }

  // ---------------------------------------------------------------- setup --

  private program(frag: string, name: string, vert = VERT): Program {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(`${name} shader compile failed: ${gl.getShaderInfoLog(sh)}`);
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`${name} program link failed: ${gl.getProgramInfoLog(prog)}`);
    }
    // the linked program keeps what it needs
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    const u: Program["u"] = {};
    const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, u };
  }

  /** The hero picture did not load: rebuild the hero program with the generated mannequin. */
  private useMannequin() {
    if (this.lost || this.gl.isContextLost()) return;
    // drawn as a figure on the grid, even when a whole photo was asked for
    this.heroFailed = true;
    this.gl.deleteProgram(this.heroProg.prog);
    this.heroProg = this.program(heroFrag(true), "hero");
    this.dirty = true;
  }

  private solid(rgba: [number, number, number, number]) {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }

  private upload(tex: WebGLTexture, src: TexImageSource, wrap: number = this.gl.CLAMP_TO_EDGE) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    this.dirty = true;
  }

  private uploadCard(index: number, layers: { base: HTMLCanvasElement; mark: HTMLCanvasElement }) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texCards);
    // premultiplied, so the transparent mark layer filters cleanly at its edges
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    [layers.base, layers.mark].forEach((cv, k) => {
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, index * 2 + k, CARD_W, CARD_H, 1, gl.RGBA, gl.UNSIGNED_BYTE, cv);
    });
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
    this.dirty = true;
  }

  private target(w: number, h: number, clear: [number, number, number, number] = [0, 0, 0, 1], half = false): Target {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (half) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(...clear);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo, tex, w, h };
  }

  private drop(t: Target | null) {
    if (!t) return;
    this.gl.deleteFramebuffer(t.fbo);
    this.gl.deleteTexture(t.tex);
  }

  private resize() {
    const gl = this.gl;
    this.cssW = Math.max(1, this.canvas.clientWidth);
    this.cssH = Math.max(1, this.canvas.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr, Math.sqrt(MAX_PIXELS / (this.cssW * this.cssH)));
    const w = Math.round(this.cssW * dpr);
    const h = Math.round(this.cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    // One scene texel per CSS pixel, so photos and cards are as sharp as the
    // screen. Very wide screens and slow machines get larger texels.
    this.texel = Math.max(1, this.cssW / MAX_SCENE_W) * STEPS[this.step];
    const cols = Math.max(8, Math.round(this.cssW / this.texel));
    const rows = Math.max(8, Math.round(this.cssH / this.texel));
    // each buffer is rebuilt only when its own size changes, so a quality step
    // does not wipe the wake, and a zoom always resizes the hero buffer
    if (!this.scene || cols !== this.cols || rows !== this.rows) {
      this.cols = cols;
      this.rows = rows;
      this.drop(this.scene);
      this.scene = this.target(cols, rows);
    }
    // the hero buffer holds exactly one texel per hero dot at full screen
    const heroW = Math.max(8, Math.round(this.cssW / HERO_DOT_PX));
    const heroH = Math.max(8, Math.round(this.cssH / HERO_DOT_PX));
    if (!this.hero || this.hero.w !== heroW || this.hero.h !== heroH) {
      this.drop(this.hero);
      this.hero = this.target(heroW, heroH);
    }
    // the wake: push (biased by 0.5), how hard, and age (1 = long ago)
    const fh = Math.max(16, Math.round((FLOW_W * this.cssH) / this.cssW));
    if (!this.flow || this.flow[0].h !== fh) {
      if (this.flow) this.flow.forEach((t) => this.drop(t));
      this.flow = [
        this.target(FLOW_W, fh, [0.5, 0.5, 0, 1], this.flowFloat),
        this.target(FLOW_W, fh, [0.5, 0.5, 0, 1], this.flowFloat),
      ];
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private async loadAssets() {
    const a = this.assets;
    const alive = () => !this.dead;
    const pending: Promise<unknown>[] = [];

    // The hero is the first thing anyone sees, so it is asked for first, before
    // the fonts and the other pictures.
    if (a.heroMedia && VIDEO_RE.test(a.heroMedia)) {
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.src = a.heroMedia;
      pending.push(
        new Promise<void>((resolve) => {
          v.addEventListener("loadeddata", () => {
            if (alive()) {
              this.heroAsp = v.videoWidth / Math.max(1, v.videoHeight);
              this.heroMode = 1;
              this.upload(this.texHero, v);
            }
            resolve();
          });
          v.addEventListener("error", () => {
            if (alive()) this.useMannequin();
            resolve();
          });
        }),
      );
      this.video = v;
      v.play().catch(() => undefined);
    } else if (a.heroMedia) {
      pending.push(
        loadImage(a.heroMedia)
          .then((img) => {
            if (!alive()) return;
            this.heroAsp = img.naturalWidth / img.naturalHeight;
            this.heroMode = 1;
            this.upload(this.texHero, img);
          })
          .catch(() => {
            if (alive()) this.useMannequin();
          }),
      );
    }

    // fonts next, so the card type is set in the right faces
    try {
      await Promise.race([
        Promise.all([document.fonts.load(`900 80px ${a.dotFont}`), document.fonts.load(`600 26px ${a.monoFont}`)]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch {
      /* fall through with whatever font is available */
    }
    if (!alive()) return;
    const opt = (src: string | null) => (src ? loadImage(src).catch(() => null) : Promise.resolve(null));
    a.cards.forEach((card, i) => {
      this.uploadCard(i, drawCard(card, null, null, a.dotFont, a.monoFont));
      if (!card.image && !card.logo) return;
      pending.push(
        Promise.all([opt(card.image), opt(card.logo)]).then(([photo, logo]) => {
          if (alive() && (photo || logo)) this.uploadCard(i, drawCard(card, photo, logo, a.dotFont, a.monoFont));
        }),
      );
    });

    const still = async (src: string | null, fallback: () => HTMLCanvasElement) => {
      if (src) {
        try {
          return await loadImage(src);
        } catch {
          /* use the stand-in */
        }
      }
      return fallback();
    };
    const size = (el: HTMLImageElement | HTMLCanvasElement) =>
      el instanceof HTMLImageElement ? [el.naturalWidth, el.naturalHeight] : [el.width, el.height];

    pending.push(
      still(a.about, () => drawCorridor(200)).then((el) => {
        if (!alive()) return;
        const [w, h] = size(el);
        this.aspAbout = w / h;
        this.aboutTexW = w;
        this.aboutTexH = h;
        // mirrored: nothing reads past the photo's edge now, but if a future
        // effect does, it shows a reflection rather than smeared edge pixels
        this.upload(this.texAbout, el, this.gl.MIRRORED_REPEAT);
      }),
      still(a.contact, () => drawNightStreet()).then((el) => {
        if (!alive()) return;
        const [w, h] = size(el);
        this.aspContact = w / h;
        this.contactTexW = w;
        this.contactTexH = h;
        this.upload(this.texContact, el);
      }),
    );

    // tell the page when the first screen is ready, or after 4 s whatever happens
    await Promise.race([Promise.allSettled(pending), new Promise((r) => setTimeout(r, 4000))]);
    if (!alive()) return;
    this.dirty = true;
    this.onReady();
  }

  // ----------------------------------------------------------------- loop --

  private frame = (now: number) => {
    if (this.dead) return;
    this.raf = requestAnimationFrame(this.frame);
    if (document.hidden) {
      this.last = now;
      return;
    }
    // `real` is wall time since the last frame. Scroll and mouse smoothing use it so a
    // throttled tab still lands in the right place. Animation uses the clamped `dt`.
    const real = this.last ? (now - this.last) / 1000 : 0.016;
    const dt = Math.min(0.05, real);
    this.last = now;

    const target = window.scrollY / this.unitPx;
    const prevS = this.s;
    if (this.reduced) this.s = target;
    else {
      // same response as a 0.1 per frame lerp at 60 fps
      this.s += (target - this.s) * (1 - Math.exp(-real * 6.3));
      if (Math.abs(target - this.s) < 0.0004) this.s = target;
    }
    const tl = this.timelineAt(this.s);

    // with reduced motion there is nothing animating, so only draw on change
    if (this.reduced) {
      if (!this.dirty && this.s === prevS) return;
      this.dirty = false;
      this.time = 2.0;
    } else {
      this.time += dt;
      this.watchSpeed(dt);
    }

    const speed = Math.abs(this.s - prevS) / Math.max(real, 0.001);
    // the band comes in fast and lingers about half a second after scrolling stops
    const tt = Math.min(1, speed * 0.22);
    this.tear += (tt - this.tear) * (1 - Math.exp(-real * (tt > this.tear ? 10 : 2.5)));

    const m = this.mouse;
    const px = m.x;
    const py = m.y;
    const k = 1 - Math.exp(-real * 16);
    m.x += (m.tx - m.x) * k;
    m.y += (m.ty - m.y) * k;
    // how far the pointer moved this frame, in screen heights
    const moved = Math.hypot((m.x - px) * (this.cssW / this.cssH), m.y - py);
    const force = this.reduced ? 0 : Math.min(1, moved * 55);
    m.e += (force - m.e) * (1 - Math.exp(-real * 6));
    const kt = 1 - Math.exp(-real * 3);
    m.tiltX += ((this.reduced ? 0 : m.tx * 2 - 1) - m.tiltX) * kt;
    m.tiltY += ((this.reduced ? 0 : m.ty * 2 - 1) - m.tiltY) * kt;
    this.updateGlitch(dt);
    this.updateBand(dt, tl);

    this.syncVideo(tl);
    this.draw(tl, real, px, py);
    this.onFrame({ s: this.s, tl });
  };

  // Every few seconds the hero glitches for a moment: a few blocks jump
  // sideways and more of its lit edge streaks, as on the reference figure.
  private updateGlitch(dt: number) {
    this.glitch *= Math.exp(-dt / 0.2);
    if (this.reduced) {
      this.glitch = 0;
      return;
    }
    const t = this.time;
    // the dev capture helper can wind the clock back
    if (t < this.glitchAt - 10) this.glitchAt = t + 2;
    if (t >= this.glitchAt) {
      this.glitch = 1;
      this.glitchAt = t + 2.2 + Math.random() * 3.5;
    }
  }

  // Every few seconds a band rolls slowly up or down through a full screen
  // picture: a torn, combed band over the hero, a ripple over photos.
  private updateBand(dt: number, tl: Timeline) {
    const b = this.band;
    const t = this.time;
    // the dev capture helper can wind the clock back
    if (t < b.start) Object.assign(b, { start: t, end: t, next: t + 2.5 });
    const onPicture = tl.bleed > 0.6 && !this.reduced;
    if (t >= b.end) {
      b.a = 0;
      if (onPicture && t >= b.next) {
        b.kind = tl.r < 0.5 ? 0 : 1;
        const up = Math.random() < 0.5;
        b.v = ((up ? 1 : -1) * (180 + Math.random() * 120)) / this.cssH;
        b.y = up ? 0.05 + Math.random() * 0.35 : 0.6 + Math.random() * 0.35;
        b.start = t;
        b.end = t + 1.6 + Math.random() * 1.6;
        b.next = b.end + 2.5 + Math.random() * 4;
      }
      return;
    }
    b.y += b.v * dt;
    const life = Math.min(t - b.start, b.end - t);
    b.a = onPicture ? Math.min(1, life / 0.25) * (b.kind ? 0.85 : 1) : 0;
  }

  // If frames are slow for a while, trade resolution for speed: first drop to
  // 1x device pixels, then make the scene texels larger. 33 ms frames are also
  // what a 30 fps cap gives (battery saver, a 30 Hz screen), and smaller buffers
  // cannot beat a cap, so time the GPU first and only step down when it is slow.
  private watchSpeed(dt: number) {
    this.slow = dt > 0.03 ? this.slow + 1 : Math.max(0, this.slow - 2);
    if (this.slow < 90) return;
    this.slow = 0;
    // the device pixel step only helps while the canvas is above 1x
    const dprStep = this.maxDpr > 1 && this.canvas.width > this.cssW * 1.01;
    if (!dprStep && this.step >= STEPS.length - 1) return;
    const now = performance.now();
    if (now < this.speedCheckAt) return;
    const time = this.time;
    const gpuMs = this.bench(6).ms;
    this.time = time;
    if (gpuMs < 12) {
      // the frame rate is capped, not the GPU: keep full quality, and look again
      // later, twice as long each time, so a capped machine is not interrupted
      this.speedCheckAt = now + this.speedBackoff;
      this.speedBackoff = Math.min(this.speedBackoff * 2, 320000);
      return;
    }
    if (dprStep) this.maxDpr = 1;
    else this.step += 1;
    this.resize();
  }

  private syncVideo(tl: Timeline) {
    const v = this.video;
    if (!v || this.heroMode < 1) return;
    const visible = tl.r < 1.3 && !this.reduced;
    if (visible && v.paused) v.play().catch(() => undefined);
    if (!visible && !v.paused) v.pause();
    if (visible && v.readyState >= 2) this.upload(this.texHero, v);
  }

  private draw(tl: Timeline, dt: number, prevX = this.mouse.x, prevY = this.mouse.y) {
    const gl = this.gl;
    if (!this.scene || !this.flow || !this.hero) return;
    const aspect = this.cssW / this.cssH;
    const m = this.mouse;
    const a = this.assets;
    // FLOW and POST work in scene space, which POST shows through its lens
    const [mx, my] = lens(m.x, m.y);
    const [pmx, pmy] = lens(prevX, prevY);
    // The wake only stirs where a picture fills the screen (as on the
    // reference, the reel is left alone). It is the same over every picture. While a
    // card is still part zoomed, POST also skips the reel pixels around it
    // (SCENE marks them).
    const strength = this.reduced ? 0 : smooth(0.35, 0.85, tl.bleed);
    const ddx = (mx - pmx) * aspect;
    const ddy = my - pmy;
    const moved = Math.hypot(ddx, ddy);
    // Jumps (the pointer coming back onto the page) are handled in onPointer.
    // This only guards against something odd like a huge step after a stall; a
    // real flick, even at 20 frames a second, stays well below it.
    const stroke = moved > 1e-6 && moved < Math.max(0.4, dt * 12) ? moved : 0;
    // Only moves fast enough to build a wake count (A loses 0.12 a second, so
    // below about 0.02 screen heights a second nothing can show). The smoothed
    // pointer keeps creeping for half a second after a stop, and this keeps that
    // creep from holding the distortion on. A speed, not a distance per frame,
    // so it means the same at 60 Hz and 240 Hz.
    if (strength > 0 && stroke * strength > 0.018 * dt) this.lastStamp = performance.now();
    // POST distorts the picture until the last stamp has faded
    const wakeOn = strength > 0 && performance.now() - this.lastStamp < WAKE_LIFE;
    gl.bindVertexArray(this.vao);
    const bind = (unit: number, target: number, tex: WebGLTexture, loc: WebGLUniformLocation | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(target, tex);
      gl.uniform1i(loc, unit);
    };

    // 1. the pointer's wake
    const src = this.flow[this.flowIdx];
    const dst = this.flow[1 - this.flowIdx];
    this.flowIdx = 1 - this.flowIdx;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, dst.w, dst.h);
    gl.useProgram(this.flowProg.prog);
    let u = this.flowProg.u;
    bind(0, gl.TEXTURE_2D, src.tex, u.uPrev);
    gl.uniform2f(u.uMouse, mx, my);
    gl.uniform2f(u.uPrevMouse, pmx, pmy);
    gl.uniform2f(u.uDir, stroke ? ddx / moved : 0, stroke ? ddy / moved : 0);
    gl.uniform1f(u.uMoved, stroke);
    gl.uniform1f(u.uAspect, aspect);
    // the full gap, so a wake left before the tab went to the background has
    // aged out when it comes back (the update is exact for any step)
    gl.uniform1f(u.uDt, Math.min(dt, 3));
    gl.uniform1f(u.uRadius, WAKE_R);
    // a straight pass through a spot brings it to about 0.85
    gl.uniform1f(u.uGain, (0.85 / (WAKE_R * Math.sqrt(Math.PI))) * strength);
    this.seed = (this.seed + 7.31) % 1000;
    gl.uniform1f(u.uSeed, this.seed);
    gl.uniform1f(u.uLsb, this.flowFloat ? 0 : 1 / 255);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2. hero figure, only while its card can be seen
    if (tl.r < 1.3) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.hero.fbo);
      gl.viewport(0, 0, this.hero.w, this.hero.h);
      gl.useProgram(this.heroProg.prog);
      u = this.heroProg.u;
      bind(0, gl.TEXTURE_2D, this.texHero, u.uHero);
      gl.uniform2f(u.uRes, this.hero.w, this.hero.h);
      const card = heroCard(tl.zoomA, aspect);
      gl.uniform1f(u.uAsp, card.aspect);
      gl.uniform1f(u.uCardDots, (card.height * this.cssH) / HERO_DOT_PX);
      gl.uniform1f(u.uTime, this.time);
      gl.uniform2f(u.uTilt, m.tiltX, m.tiltY);
      gl.uniform1f(u.uHeroMode, this.heroMode);
      gl.uniform1f(u.uHeroAsp, this.heroAsp);
      gl.uniform1f(u.uHeroAlpha, ALPHA_RE.test(a.heroMedia ?? "") ? 1 : 0);
      gl.uniform1f(u.uHeroScene, !this.heroFailed && SCENE_RE.test(a.heroMedia ?? "") ? 1 : 0);
      gl.uniform2f(u.uFocus, a.heroFocus?.[0] ?? a.heroFace.x, a.heroFocus?.[1] ?? 0.5);
      gl.uniform2f(u.uSpan, a.heroSpan?.[0] ?? 0, a.heroSpan?.[1] ?? 1);
      gl.uniform2f(u.uKey, a.heroKey[0], a.heroKey[1]);
      gl.uniform4f(u.uFace, a.heroFace.x, a.heroFace.y, a.heroFace.rx, a.heroFace.ry);
      gl.uniform1f(u.uGlitch, this.glitch);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // 3. scene at screen resolution
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fbo);
    gl.viewport(0, 0, this.scene.w, this.scene.h);
    gl.useProgram(this.sceneProg.prog);
    u = this.sceneProg.u;
    bind(0, gl.TEXTURE_2D, this.hero.tex, u.uHeroLayer);
    bind(1, gl.TEXTURE_2D_ARRAY, this.texCards, u.uCards);
    bind(2, gl.TEXTURE_2D, this.texAbout, u.uSceneA);
    bind(3, gl.TEXTURE_2D, this.texContact, u.uContactTex);
    gl.uniform2f(u.uRes, this.scene.w, this.scene.h);
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform1f(u.uR, tl.r);
    gl.uniform1f(u.uZoomA, tl.zoomA);
    gl.uniform1f(u.uZoomB, tl.zoomB);
    gl.uniform1f(u.uAbout, tl.about);
    gl.uniform1f(u.uAboutOn, tl.zoomB >= 1 ? 1 : 0);
    // with reduced motion the photos simply cross fade
    gl.uniform1f(u.uChange, tl.change);
    gl.uniform1f(u.uAboutText, tl.aboutText);
    gl.uniform1f(u.uMotion, this.reduced ? 0 : 1);
    gl.uniform1f(u.uCardCount, a.cards.length);
    // The centred card's width as a share of the screen's, as reel() draws it:
    // about 0.53 at 16:9, up to 0.84 on a phone, less on wider screens. Screens
    // up to about 2:1 keep the 0.533 they were tuned at; wider ones stay within
    // 15% of the real share, so fine lines do not shimmer.
    const realShare = Math.min((REEL.CARD * REEL.CARD_ASPECT) / aspect, 0.84);
    const cardShare = Math.max(realShare, Math.min(0.533, realShare * 1.15));
    gl.uniform1f(u.uCardLod, Math.max(0, Math.log2(CARD_W / (cardShare * this.cols)) - 0.25));
    // The photos cover the screen, so whichever side of the photo fits the
    // screen sets its scale (the height, on a phone held upright).
    const coverLod = (w: number, h: number) => Math.max(0, Math.log2(Math.min(w / this.cols, h / this.rows)) - 0.5);
    gl.uniform1f(u.uSceneLod, coverLod(this.aboutTexW, this.aboutTexH));
    gl.uniform1f(u.uContactLod, coverLod(this.contactTexW, this.contactTexH));
    gl.uniform2f(u.uTilt, m.tiltX, m.tiltY);
    gl.uniform1f(u.uCardAsp, CARD_W / CARD_H);
    gl.uniform1f(u.uSceneAAsp, this.aspAbout);
    gl.uniform1f(u.uContactAsp, this.aspContact);
    gl.uniform1f(u.uContactAnchor, a.contactAnchor);
    gl.uniform1f(u.uTexel, this.texel);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 4. dots and CRT treatment, to the screen. The wake bends the picture
    // here: POST reads the scene through the flow buffer's pushes.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.postProg.prog);
    u = this.postProg.u;
    bind(0, gl.TEXTURE_2D, this.scene.tex, u.uScene);
    bind(1, gl.TEXTURE_2D, dst.tex, u.uFlow);
    gl.uniform2f(u.uGrid, this.cols, this.rows);
    gl.uniform2f(u.uPx, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uCss, this.cssW, this.cssH);
    gl.uniform1f(u.uDot, HERO_DOT_PX / this.texel);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform1f(u.uTear, this.tear);
    gl.uniform1f(u.uMotion, this.reduced ? 0 : 1);
    gl.uniform2f(u.uMouse, mx, my);
    gl.uniform1f(u.uMouseE, m.e);
    // the dark band at the screen's edges is only for the about and contact
    // photos; the hero photo has none (the owner asked for its edges to stay
    // the photo's own colours)
    gl.uniform1f(u.uVig, clamp01((tl.zoomB - Z_REST) / (1 - Z_REST)));
    gl.uniform1f(u.uWakeOn, wakeOn ? 1 : 0);
    gl.uniform1f(u.uWakeStrength, strength);
    gl.uniform1f(u.uWakeR, WAKE_R * this.cssH);
    const b = this.band;
    gl.uniform3f(u.uRoll, b.y, b.a, b.kind);
    gl.uniform1f(u.uRollH, b.kind ? 40 : 18);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
