// GLSL for the home page stage. Four programs:
//   FLOW  - a small ping-pong buffer holding the pointer's wake: how hard each
//           spot was stirred, which way, and how long ago
//   HERO  - the hero picture, one texel per dot
//   SCENE - the whole page at screen resolution (it samples HERO for the hero card)
//   POST  - dots for the hero, CRT treatment and tears, and the wake, which
//           bends the picture where the pointer has passed
// Written from scratch for this site. See docs/reference/notes.md for what
// each piece is modelled on.

import { FIZZLE_DONE } from "./timeline";

/** Reel geometry. Shared with stage.ts so the hero buffer gets the card's exact shape. */
/** Strength of the CRT barrel lens in POST. stage.ts passes the pointer through the same lens. */
export const LENS_K = 0.05;

export const REEL = {
  TANF: 0.4663, // tan(25 deg): 50 degree vertical field of view
  DIST: 3.0, // camera to the centred card
  DRUM: 3.15, // drum radius. DRUM * DPHI sets how far a card travels per screen of scroll.
  TILT: 0.36, // drum axis tilt in radians. This is what makes the travel diagonal.
  CARD: 0.586, // card half height at the corners over half the screen (it reads as 69% with the bulge)
  CARD_ASPECT: 1.61,
} as const;

const f = (n: number) => n.toFixed(4);

const COMMON = /* glsl */ `
float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
vec2 rotv(vec2 v, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}
`;

// The pointer's wake, shared by FLOW and POST. A (0..1) is how hard a spot was
// stirred, age is seconds since it was last stirred. It is the same over the
// hero, the about photo and the contact photo. Unlike the reference's photo
// wake (docs/reference/notes.md), nothing comes off the page: POST bends the
// picture itself, so the wake always shows the colours under it.
//   flare - a fresh wake catches the light for a moment (time constant 0.1 s)
//   warp  - the picture is pushed along the path, bulges and wobbles, then
//           settles back (time constant 0.3 s, a tenth is left at 0.7 s)
// To make the wake last longer, these are not the only settings: WAKE_SPAN
// must stay above the last envelope's end, FLOW_FRAG's drain of A starts at
// age 0.6 s, and stage.ts WAKE_LIFE must outlast it all, because POST drops
// the whole wake at once when stage.ts turns it off.
const WAKE = /* glsl */ `
const float WAKE_SPAN = 1.5;
float wakeFlare(float A, float age) { return A * exp(-age / 0.1); }
float wakeWarp(float A, float age) { return A * exp(-age / 0.3); }
`;

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const FLOW_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uMouse;      // pointer now, scene uv, y up
uniform vec2 uPrevMouse;  // pointer last frame
uniform vec2 uDir;        // the way it travelled, aspect corrected, unit length
uniform float uMoved;     // how far it travelled this frame, in screen heights
uniform float uAspect;
uniform float uDt;
uniform float uRadius;    // half width of the wake, in screen heights
uniform float uGain;
uniform float uSeed;
uniform float uLsb;       // one step of the storage: 0 for half floats, 1/255 for 8 bit
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
${WAKE}

// xy: which way the spot was pushed, z: how hard (A), w: its age over WAKE_SPAN
void main() {
  vec4 p = texture(uPrev, vUv);
  vec2 push = (p.xy - 0.5) * 2.0 * exp(-uDt / 0.45);
  // A fades slowly on its own (from a full pass it takes about two seconds);
  // once a spot's response is over, what is left drains away fast (below)
  float A = max(0.0, p.z * exp(-uDt / 0.9) - uDt * 0.12);
  // 8 bit storage would round the small steps away and leave A and push stuck
  // above zero, so round them at random instead: on average they keep fading
  A = max(0.0, A + (h2(gl_FragCoord.xy + uSeed + 31.7) - 0.5) * uLsb);
  push += (h2(gl_FragCoord.xy + uSeed + 57.3) - 0.5) * 2.0 * uLsb;
  // age counts up, dithered the same way so it advances at the right rate
  float age = p.w * WAKE_SPAN + uDt + (h2(gl_FragCoord.xy + uSeed) - 0.5) * (WAKE_SPAN / 255.0);
  // Stamp along the whole segment the pointer covered this frame, so a fast
  // flick leaves one continuous wake. The amount follows the distance moved,
  // not the speed, so a slow drag stirs as much as a flick, as in the reference.
  vec2 a = vec2(uPrevMouse.x * uAspect, uPrevMouse.y);
  vec2 b = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 q = vec2(vUv.x * uAspect, vUv.y);
  vec2 ab = b - a;
  float h = clamp(dot(q - a, ab) / max(dot(ab, ab), 1e-9), 0.0, 1.0);
  vec2 d = q - (a + ab * h);
  float w = exp(-dot(d, d) / (uRadius * uRadius));
  float add = w * uMoved * uGain;
  // What is left of a spot whose response is over drains away, so a later pass
  // nearby does not set the old trail off again. Not under a moving stamp,
  // which would eat what it is putting down.
  float stirring = uMoved > 0.0 ? smoothstep(0.0, 0.05, w) : 0.0;
  A *= mix(1.0, exp(-uDt / 0.15), smoothstep(0.6, 0.8, p.w * WAKE_SPAN) * (1.0 - stirring));
  A = min(1.0, A + add);
  // limited by its length, not each component, so a diagonal stroke drags as
  // far as a straight one, and along its own direction
  push += uDir * min(1.0, add * 3.0);
  push /= max(1.0, length(push));
  // Freshly stirred spots start their response again, but only level with or
  // ahead of the pointer. The trailing half of the stamp would otherwise keep
  // restarting the clock of spots the pointer has already passed, and a slow
  // drag would leave a trail that lingers. Measured from the segment's start,
  // so spots in the middle of a long flick still restart.
  float along = dot(q - a, ab) * inversesqrt(max(dot(ab, ab), 1e-12));
  age = mix(age, 0.0, clamp(add * 8.0, 0.0, 1.0) * smoothstep(-uRadius, 0.0, along));
  o = vec4(push * 0.5 + 0.5, A, clamp(age / WAKE_SPAN, 0.0, 1.0));
}`;

// ------------------------------------------------------------------ hero --

// The generated mannequin is only compiled when there is no picture (or it
// fails to load): its ray march more than triples the compile time.
export const heroFrag = (mannequin: boolean) => /* glsl */ `#version 300 es
${mannequin ? "#define MANNEQUIN" : ""}
precision highp float;
in vec2 vUv;
out vec4 o;

uniform vec2 uRes;
uniform float uAsp;        // card width over height right now
uniform float uTime;
uniform vec2 uTilt;        // smoothed mouse, -1..1
uniform float uHeroMode;   // 0 generated figure, 1 photo or video
uniform sampler2D uHero;
uniform float uHeroAsp;
uniform float uHeroAlpha;  // 1 when the picture carries its own transparency (a cutout)
uniform float uHeroScene;  // 1 when the picture is a whole photo with its background, filling the card
uniform vec2 uFocus;       // for a whole photo: the part that stays in view when it is cropped, 0..1 from the top left
uniform float uCardDots;   // the card's height on screen right now, in dots
uniform vec2 uSpan;        // for a widened photo: where the real photo sits across the picture (0..1); 0, 1 otherwise
uniform vec2 uKey;         // luma key range for footage shot on a dark backdrop
uniform vec4 uFace;        // head centre x, y and half sizes, in picture coordinates from the top left
uniform float uGlitch;     // 0..1, a burst of glitches every few seconds, set by the stage
${COMMON}

// ---- generated mannequin, used until a real picture is set ----

#ifdef MANNEQUIN
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdEll(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
float sdCaps(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float bust(vec3 p, float yaw) {
  vec3 b = p;
  b.xz = rotv(b.xz, yaw * 0.25);
  float breathe = 1.0 + 0.012 * sin(uTime * 1.3);
  float torso = sdEll(b - vec3(0.0, -1.25, 0.0), vec3(0.78, 0.62, 0.36 * breathe));
  float sh = sdCaps(b, vec3(-0.60, -0.82, 0.0), vec3(0.60, -0.82, 0.0), 0.26);
  float d = smin(torso, sh, 0.25);
  vec3 a = b;
  a.x = abs(a.x);
  float arm = sdCaps(a, vec3(0.74, -0.86, 0.0), vec3(0.84, -1.75, 0.04), 0.17);
  d = smin(d, arm, 0.12);
  float neck = sdCaps(b, vec3(0.0, -0.78, -0.02), vec3(0.0, -0.25, 0.0), 0.17);
  d = smin(d, neck, 0.12);

  vec3 h = p - vec3(0.0, 0.12, 0.0);
  h.xz = rotv(h.xz, yaw);
  h.yz = rotv(h.yz, 0.05 * sin(uTime * 0.5));
  float skull = sdEll(h - vec3(0.0, 0.07, -0.04), vec3(0.325, 0.40, 0.39));
  float jaw = sdEll(h - vec3(0.0, -0.19, 0.05), vec3(0.245, 0.27, 0.29));
  float head = smin(skull, jaw, 0.15);
  float nose = sdEll(h - vec3(0.0, -0.05, 0.36), vec3(0.055, 0.11, 0.09));
  head = smin(head, nose, 0.06);
  float brow = sdEll(h - vec3(0.0, 0.10, 0.31), vec3(0.23, 0.045, 0.07));
  head = smin(head, brow, 0.10);
  float cheek = sdEll(vec3(abs(h.x), h.yz) - vec3(0.15, -0.09, 0.27), vec3(0.09, 0.08, 0.07));
  head = smin(head, cheek, 0.10);
  vec3 e = h;
  e.x = abs(e.x);
  float ear = sdEll(e - vec3(0.34, -0.02, -0.03), vec3(0.05, 0.10, 0.07));
  head = smin(head, ear, 0.04);
  return smin(d, head, 0.06);
}
#endif

float outline(vec2 q) {
  float head = (length((q - vec2(0.0, 0.10)) / vec2(0.40, 0.47)) - 1.0) * 0.40;
  vec2 b = abs(q - vec2(0.0, -1.50)) - vec2(0.70, 0.62);
  float body = length(max(b, 0.0)) + min(max(b.x, b.y), 0.0) - 0.30;
  float neck = max(abs(q.x) - 0.19, abs(q.y + 0.5) - 0.4);
  return min(head, min(body, neck));
}

const vec2 FIG_OFF = vec2(0.0, 0.14);
const float FIG_SCALE = 0.80;

// ---- real picture ----

// Card position (x across in card heights, y up, both centred) to picture
// coordinates from the top left. The picture is fitted by height, sits on the
// bottom edge, and the head is centred.
vec2 toPicture(vec2 q) {
  return vec2(uFace.x + q.x / (2.0 * uHeroAsp), 1.0 - (q.y + 1.0) * 0.5);
}

// the mip for the size the card is drawn at, as for a whole photo (sceneLod)
float pictureLod() {
  return max(0.0, log2(float(textureSize(uHero, 0).y) / min(uRes.y, uCardDots)) - 0.6);
}

float pictureMask(vec4 t) {
  return uHeroAlpha > 0.5 ? t.a : smoothstep(uKey.x, uKey.y, luma(t.rgb));
}

vec4 picture(vec2 p, float lod) {
  if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return vec4(0.0);
  return textureLod(uHero, vec2(p.x, 1.0 - p.y), lod);
}

// Signed distance to the figure's outline, roughly in card heights. Negative inside.
float figureDist(vec2 q) {
  if (uHeroMode > 0.5) {
    float m = pictureMask(picture(toPicture(q), 5.5));
    return (0.5 - m) * 0.5;
  }
  return outline((q - FIG_OFF) / FIG_SCALE) * FIG_SCALE;
}

// Grid whose cells split in two, three times, as they get close to the figure.
// Cells are taller than wide (72 x 120 px on a 945 px screen, like the
// reference). Returns vertical and horizontal line coverage separately.
vec2 gridLines(vec2 q, float px) {
  vec2 size = vec2(0.1524, 0.2540);
  for (int i = 0; i < 3; i++) {
    vec2 c = (floor(q / size) + 0.5) * size;
    float d = figureDist(c);
    if (d > size.x * 0.6 || d < -size.y * 2.0) break;
    size *= 0.5;
  }
  vec2 g = abs(fract(q / size - 0.5) - 0.5) * size;
  return 1.0 - smoothstep(vec2(px * 0.45), vec2(px * 0.65), g);
}

// ---- whole photo (a scene, not a cutout) ----

// The photo covers the card. Where it has to be cropped, uFocus picks the part
// that stays in view, like CSS object-position. Card position as in toPicture.
vec2 visibleScene() {
  return uAsp > uHeroAsp ? vec2(1.0, uHeroAsp / uAsp) : vec2(uAsp / uHeroAsp, 1.0);
}
vec2 toScene(vec2 q) {
  vec2 vis = visibleScene();
  vec2 c = vec2(q.x / uAsp * 0.5 + 0.5, 0.5 - q.y * 0.5);
  // The crop's top left. On a very wide or very narrow screen it moves as
  // little as needed to keep the head in view, from a little above the top of
  // the head to a little below the chin; where both cannot fit, the chin wins.
  // max and min, not clamp: the bounds cross when the head does not fit.
  vec2 off = (1.0 - vis) * uFocus;
  off = max(uFace.xy + uFace.zw * 1.6 - vis, min(off, uFace.xy - uFace.zw * vec2(1.6, 1.3)));
  off = clamp(off, vec2(0.0), 1.0 - vis);
  // A widened photo: keep the crop on the real photo when it fits there, so
  // the blurred sides only show on screens wider than the photo, and then
  // evenly on both sides.
  float w = uSpan.y - uSpan.x;
  off.x = vis.x <= w ? clamp(off.x, uSpan.x, uSpan.y - vis.x) : 0.5 * (uSpan.x + uSpan.y - vis.x);
  return off + c * vis;
}
// The mip for the size the card is drawn at: about one photo sample per dot.
// While the card is small on the reel a dot covers several buffer texels.
float sceneLod() {
  return max(0.0, log2(float(textureSize(uHero, 0).y) * visibleScene().y / min(uRes.y, uCardDots)) - 0.6);
}
bool inFace(vec2 p) {
  return length((p - uFace.xy) / uFace.zw) < 1.0;
}
// The photo holds still (the owner asked for no breathing); only the
// glitches move it.
vec3 stillScene(vec2 p, float lod) {
  // a glitch can push a sample past the edge; stay on the photo
  vec3 c = picture(clamp(p, vec2(0.0005), vec2(0.9995)), lod).rgb;
  // a touch cooler and softer in colour, to sit with the rest of the page
  return mix(c, vec3(luma(c)) * vec3(0.9, 0.95, 1.05), 0.12);
}

// The still cutout. It holds still (no breathing, as for a whole photo) and is
// relit by one lamp to the side. p is in picture coordinates. Mask in .a.
vec4 stillFigure(vec2 p, float lod) {
  vec2 src = p;
  vec4 t = picture(src, lod);

  // relight: one lamp to the side, fixed in the room
  vec2 h = (src - uFace.xy) / vec2(uFace.z * 1.36, uFace.w);
  float dome = sqrt(max(0.0, 1.0 - dot(h, h)));
  float inHead = smoothstep(0.0, 0.25, dome);
  vec3 nHead = normalize(vec3(h.x, -h.y, dome + 0.35));
  float bx = clamp((src.x - uFace.x) / (uFace.z * 2.9), -1.0, 1.0);
  vec3 nBody = normalize(vec3(bx, 0.15, sqrt(1.0 - bx * bx) + 0.2));
  vec3 n = normalize(mix(nBody, nHead, inHead));
  vec3 L = normalize(vec3(0.86, 0.22, 0.46));
  float lit = smoothstep(-0.35, 0.80, dot(n, L));
  float lum = luma(t.rgb);
  vec3 c = mix(t.rgb, vec3(lum) * vec3(0.84, 0.88, 1.04), 0.38);
  return vec4(c * mix(0.235, 1.085, lit) + vec3(0.0375, 0.03, 0.07) * (1.0 - lit) * inHead, t.a);
}

void main() {
  vec2 l = vUv * 2.0 - 1.0;
  vec2 q = vec2(l.x * uAsp, l.y);
  float px = 2.0 / uRes.y;

  // backdrop: dark grey lavender, brightest behind the head
  float fall = smoothstep(0.15, 1.7, length((q - vec2(0.0, 0.25)) * vec2(0.62, 1.0)));
  vec3 col = mix(vec3(0.25, 0.235, 0.32), vec3(0.045, 0.04, 0.065), fall);

  float mask = 0.0;
  vec3 fig = vec3(0.0);

  if (uHeroMode > 0.5 && uHeroScene > 0.5) {
    // a whole photo: it fills the card, so there is no backdrop or grid
    vec2 p = toScene(q);
    float lod = sceneLod();
    // jumps and streaks are a share of the card's width, whatever the photo's
    // shape (a wide photo on a phone would otherwise make them huge)
    float span = visibleScene().x;
    // glitches, as for a cutout: in each burst a few blocks jump sideways
    vec2 blk = floor(vec2(vUv.x * 9.0, vUv.y * uRes.y / 6.0));
    float bh = h2(blk + vec2(floor(uTime * 14.0) * 0.731, 3.0));
    p.x += step(1.0 - 0.12 * uGlitch, bh) * (h2(blk + 5.1) - 0.5) * 0.10 * span;
    fig = stillScene(p, lod);
    mask = 1.0;
    // On a few rows at a time the right edge of the face is dragged outward into
    // a short streak, more during a burst (rows from the eyes to the chin).
    float row = floor(vUv.y * uRes.y);
    float slot = floor(uTime * 8.0);
    bool headRow = p.y > uFace.y - uFace.w * 0.5 && p.y < uFace.y + uFace.w * 1.1 && p.x > uFace.x;
    if (headRow && !inFace(p) && h2(vec2(row * 0.37, slot)) > 0.955 - 0.08 * uGlitch) {
      float len = (0.02 + 0.07 * h2(vec2(row, slot + 3.0))) * span;
      for (int k = 1; k <= 6; k++) {
        vec2 s = p - vec2(len * float(k) / 6.0, 0.0);
        if (inFace(s)) {
          fig = stillScene(s, lod) * (1.0 - 0.09 * float(k));
          break;
        }
      }
    }
  } else if (uHeroMode > 0.5) {
    vec2 p = toPicture(q);
    float lod = pictureLod();
    if (uHeroAlpha > 0.5) {
      // Glitches, as on the reference figure. In each burst a few blocks jump
      // sideways for a frame or two.
      vec2 blk = floor(vec2(vUv.x * 9.0, vUv.y * uRes.y / 6.0));
      float bh = h2(blk + vec2(floor(uTime * 14.0) * 0.731, 3.0));
      p.x += step(1.0 - 0.12 * uGlitch, bh) * (h2(blk + 5.1) - 0.5) * 0.10;
      vec4 f = stillFigure(p, lod);
      fig = f.rgb;
      mask = f.a;
      // On a few rows at a time the lit edge of the head (the side toward the
      // lamp) is dragged outward into a short bright streak, more during a burst.
      float row = floor(vUv.y * uRes.y);
      float slot = floor(uTime * 8.0);
      // rows from the eyes to the chin, as on the reference (not the hair)
      bool headRow = p.y > uFace.y - uFace.w * 0.5 && p.y < uFace.y + uFace.w * 1.1 && p.x > uFace.x;
      if (mask < 0.5 && headRow && h2(vec2(row * 0.37, slot)) > 0.955 - 0.08 * uGlitch) {
        float len = 0.02 + 0.07 * h2(vec2(row, slot + 3.0));
        for (int k = 1; k <= 6; k++) {
          vec4 g = stillFigure(p - vec2(len * float(k) / 6.0, 0.0), lod);
          if (g.a > 0.5) {
            fig = g.rgb * (1.0 - 0.09 * float(k));
            mask = 0.9;
            break;
          }
        }
      }
    } else {
      // footage on a dark backdrop: it moves by itself
      vec4 t = picture(p, lod);
      float lum = luma(t.rgb);
      mask = pictureMask(t);
      fig = mix(vec3(lum) * vec3(0.84, 0.88, 1.04), t.rgb, 0.45) * 1.1;
    }
  } else {
#ifdef MANNEQUIN
    vec2 b = (q - uTilt * vec2(0.035, 0.02) - FIG_OFF) / FIG_SCALE;
    if (outline(b) < 0.2) {
      float yaw = 0.6 * sin(uTime * 0.33) + 0.1 * sin(uTime * 0.9);
      vec3 ro = vec3(b, 1.6);
      float t = 0.0;
      bool hit = false;
      for (int i = 0; i < 40; i++) {
        float d = bust(ro + vec3(0.0, 0.0, -t), yaw);
        if (d < 0.003) { hit = true; break; }
        t += d;
        if (t > 3.2) break;
      }
      if (hit) {
        vec3 pos = ro + vec3(0.0, 0.0, -t);
        vec2 k = vec2(1.0, -1.0) * 0.004;
        vec3 n = normalize(
          k.xyy * bust(pos + k.xyy, yaw) + k.yyx * bust(pos + k.yyx, yaw) +
          k.yxy * bust(pos + k.yxy, yaw) + k.xxx * bust(pos + k.xxx, yaw));
        vec3 L = normalize(vec3(0.95, 0.18, 0.22));
        float dif = pow(max(dot(n, L), 0.0), 1.9);
        float rim = pow(1.0 - max(n.z, 0.0), 3.0) * max(dot(n, normalize(vec3(-0.8, 0.2, -0.2))), 0.0);
        fig = vec3(0.70, 0.74, 0.96) * dif * 1.35 + vec3(0.14, 0.12, 0.30) * rim * 0.45 + vec3(0.03, 0.03, 0.05);
        fig *= mix(1.0, 0.16, smoothstep(-0.60, -0.74, pos.y));
        mask = 1.0;
      }
    }
#endif
  }

  // The grid is only for a cutout or the generated figure. A whole photo
  // covers it, and until the photo has loaded the card is just the backdrop.
  if (uHeroScene < 0.5) {
    vec2 g = gridLines(q, px);
    col += max(g.x * 0.15, g.y * 0.10) * (1.0 - mask);
  }
  o = vec4(mix(col, fig, mask), 1.0);
}`;

// ----------------------------------------------------------------- scene --

export const SCENE_FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
out vec4 o;

uniform vec2 uRes;
uniform float uAspect;
uniform float uTime;
uniform float uR;
uniform float uZoomA;
uniform float uZoomB;
uniform float uAbout;
uniform float uAboutOn;
uniform float uChange;  // 0..1, the about photo changing into the contact photo
uniform float uAboutText; // 1 while the about text is up, 0 once it has faded out
uniform float uMotion;  // 0 when the visitor asked for reduced motion
uniform float uCardCount;
uniform float uCardLod;
uniform float uSceneLod;
uniform float uContactLod;
uniform vec2 uTilt;

uniform sampler2D uHeroLayer;
uniform sampler2DArray uCards;
uniform float uCardAsp;
uniform sampler2D uSceneA;
uniform float uSceneAAsp;
uniform sampler2D uContactTex;
uniform float uContactAsp;
uniform float uContactAnchor;
uniform float uTexel;     // CSS px per scene texel (1, more on very wide screens and slow machines)

const float TANF = ${f(REEL.TANF)};
const float DIST = ${f(REEL.DIST)};
const float DRUM = ${f(REEL.DRUM)};
const float TILT = ${f(REEL.TILT)};
const float CARD = ${f(REEL.CARD)};
const float CARD_ASPECT = ${f(REEL.CARD_ASPECT)};
const float DONE = ${f(FIZZLE_DONE)}; // the contact photo has fizzled in by this uChange

// Written to the alpha channel: 0 where POST breaks the picture into dots (the
// hero card), 0.75 on the reel's ground and its name cards, which the pointer's
// wake leaves alone, and 1 on the photos. The reel and the photos stay at full
// resolution.
float gFine = 1.0;
${COMMON}

// uv inside a box of aspect boxAsp, mapped so a texture of aspect texAsp covers
// it. ay picks what stays in view when the height is cropped: 0 bottom, 1 top.
vec2 coverAt(vec2 uv, float boxAsp, float texAsp, float ay) {
  vec2 s = boxAsp > texAsp ? vec2(1.0, texAsp / boxAsp) : vec2(boxAsp / texAsp, 1.0);
  return vec2((uv.x - 0.5) * s.x + 0.5, (uv.y - ay) * s.y + ay);
}
vec2 coverUv(vec2 uv, float boxAsp, float texAsp) { return coverAt(uv, boxAsp, texAsp, 0.5); }

// ---- about ----

vec3 gradeScene(vec3 c) {
  c = pow(c, vec3(1.25)) * 1.45;
  return mix(vec3(luma(c)), c, 1.15) * vec3(0.80, 0.90, 1.0);
}

vec3 sceneA(vec2 uv, float asp, float lod) {
  vec2 u = (uv - 0.5) / (1.0 + 0.22 * uAbout) + 0.5;
  // it does not follow the pointer: the only thing the pointer does over a
  // picture is the wake, the same on every section
  return gradeScene(textureLod(uSceneA, coverUv(u, asp, uSceneAAsp), lod).rgb);
}

// The contact photo covering the screen.
vec3 sceneC(vec2 uv, float lod) {
  return textureLod(uContactTex, coverAt(uv, uAspect, uContactAsp, uContactAnchor), lod).rgb;
}

// About into contact. As uChange runs from 0 to 1 the contact photo fizzles in
// over the team photo: it breaks out at random spots around the screen, each
// spot spreading tile by tile with a crackle of static along its edge, until
// the spots meet and the contact photo fills the screen. It is complete at
// DONE (FIZZLE_DONE in timeline.ts), which is where the contact text starts to
// fade in (marks().contactTextIn).
vec3 about(vec2 uv) {
  float ch = uChange;
  float prog = smoothstep(0.1, 0.8, ch);
  // how much of this pixel is the contact photo
  float isC = 0.0;
  vec3 c;
  if (prog <= 0.0) {
    c = sceneA(uv, uAspect, uSceneLod);
  } else if (ch >= DONE) {
    c = sceneC(uv, uContactLod);
    isC = 1.0;
  } else if (uMotion < 0.5) {
    // reduced motion: a plain cross fade, over by the same point
    isC = smoothstep(0.1, DONE, ch);
    c = mix(sceneA(uv, uAspect, uSceneLod), sceneC(uv, uContactLod), isC);
  } else {
    // tiles about 7 px across, in screen heights
    const float TILES = 135.0;
    vec2 q = vec2(uv.x * uAspect, uv.y);
    vec2 cid = floor(q * TILES);
    vec2 tc = (cid + 0.5) / TILES;
    // One spot in each cell of a coarse grid, at a random place, starting at a
    // random time and spreading outward. A tile changes when the first spot
    // reaches it.
    const float CELL = 0.24;
    vec2 cc = floor(tc / CELL);
    float arrive = 9.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 k = cc + vec2(float(i), float(j));
        vec2 seed = (k + 0.15 + 0.7 * vec2(h2(k + 0.37), h2(k + 7.71))) * CELL;
        arrive = min(arrive, h2(k + 3.3) + length(tc - seed) * 1.4);
      }
    }
    // a ragged, fizzing edge
    arrive += (h2(cid) - 0.5) * 0.12;
    // The clock eases in, because the first spot to reach a tile is usually an
    // early one: a few spots at first, about half the screen half way through.
    float fp = clamp((pow(prog, 1.4) - arrive) / 0.12, 0.0, 1.0);
    // every tile is through by DONE, whatever the spots did (by then the spots
    // have covered all but a few stragglers)
    fp = max(fp, smoothstep(DONE - 0.06, DONE, ch));
    if (fp <= 0.0) c = sceneA(uv, uAspect, uSceneLod);
    else if (fp >= 1.0) {
      c = sceneC(uv, uContactLod);
      isC = 1.0;
    } else {
      // Static along the edge: each tile flickers between the two photos, now
      // and then a bright speck, too fast to follow, and a fine dark seam
      // around it, so the edge reads as pixels.
      float tick = floor(uTime * 24.0);
      isC = h2(cid + tick * 0.173) < fp ? 1.0 : 0.0;
      c = isC > 0.5 ? sceneC(uv, uContactLod) : sceneA(uv, uAspect, uSceneLod);
      float speck = step(0.9, h2(cid * 1.7 + tick)) * (1.0 - fp);
      c = mix(c, vec3(0.92, 0.95, 1.0), speck * 0.85);
      vec2 cf = fract(q * TILES) - 0.5;
      c *= 1.0 - 0.55 * step(0.4, max(abs(cf.x), abs(cf.y))) * (1.0 - fp);
    }
  }
  // dim the left side while the about text is up (the same value fades the
  // text itself out in HomeStage, so the two end together)
  float dim = smoothstep(0.0, 0.08, uAbout) * uAboutText;
  c *= mix(1.0, 0.75 + 0.25 * smoothstep(0.0, 0.45, uv.x), dim);
  // once the contact photo is in, dim a band behind the headline so it reads,
  // in step with the contact text fading in
  float by = (uv.y - 0.5) / 0.17;
  float band = exp(-by * by) * smoothstep(DONE - 0.02, DONE + 0.15, ch);
  return c * (1.0 - 0.34 * band);
}

// ---- reel ----

// The reel's ground: dark grey with a faint technical grid. Fine lines, a
// heavier line every fourth, and small crosses where the heavier lines meet;
// a little lighter toward the middle. The cells are a share of the screen's
// height (a whole number of texels, so every line is one crisp texel), and the
// lines are fainter where texels are larger or the cells small, so the grid
// weighs about the same on every screen and quality step.
vec3 reelBg(vec2 p) {
  vec2 px = vUv * uRes - 0.5;           // texel centres on whole numbers, from the bottom left
  float cell = max(6.0, floor(uRes.y / 36.0 + 0.5));   // about 26 px on a 945 px tall screen
  vec2 g = px / cell;
  // distance to the nearest fine and heavy line, in texels
  vec2 dMinor = abs(fract(g + 0.5) - 0.5) * cell;
  vec2 dMajor = abs(fract(g * 0.25 + 0.5) - 0.5) * cell * 4.0;
  float minor = 1.0 - smoothstep(0.3, 1.0, min(dMinor.x, dMinor.y));
  float major = 1.0 - smoothstep(0.3, 1.0, min(dMajor.x, dMajor.y));
  // the crosses' arms are a third of a cell long either way
  float arm = cell * 0.33;
  float crossX = (1.0 - smoothstep(0.4, 1.2, dMajor.y)) * step(dMajor.x, arm);
  float crossY = (1.0 - smoothstep(0.4, 1.2, dMajor.x)) * step(dMajor.y, arm);
  float marks = min(1.0, crossX + crossY);
  float weight = clamp(cell * uTexel / 26.0, 0.4, 1.0) / uTexel;
  vec2 v = p * vec2(0.55, 0.85);
  vec3 c = vec3(0.118, 0.122, 0.133) * (1.1 - 0.22 * dot(v, v));
  return c + vec3(0.78, 0.84, 0.92) * (0.035 * minor + 0.032 * major + 0.06 * marks) * weight;
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// One name card: a still base layer and an animated mark layer (premultiplied).
// The mark is cut into small blocks. Away from the centre of the reel each
// block is displaced, so the name is a cloud of dots. As the card arrives the
// blocks lock home one by one. It is driven by scroll, so it plays backwards
// when you scroll back. Time only moves the light sweep and a faint shimmer.
vec3 nameCard(vec2 uv, float i) {
  float layer = (i - 1.0) * 2.0;
  vec3 base = textureLod(uCards, vec3(uv, layer), uCardLod).rgb;
  float side = i - uR;
  float arrive = 1.0 - smoothstep(0.10, 0.60, abs(side));
  vec2 block = floor(uv * vec2(128.0, 80.0));
  float rnd = h2(block);
  float home = smoothstep(rnd * 0.7, rnd * 0.7 + 0.3, arrive);
  vec2 off = (vec2(h2(block + 3.1), h2(block + 7.7)) - 0.5) * vec2(0.50, 0.36) * (1.0 - home);
  off.x += (1.0 - home) * 0.22 * sign(side);
  vec2 muv = uv + off;
  vec4 mk = textureLod(uCards, vec3(muv, layer + 1.0), uCardLod);

  // a short extrusion behind the mark that leans with the mouse
  vec2 ex = vec2(0.0032, -0.0050) - uTilt * 0.0028;
  float depth = 0.0;
  vec3 ink = vec3(0.0);
  for (int k = 1; k <= 4; k++) {
    vec4 t = textureLod(uCards, vec3(muv - ex * float(k), layer + 1.0), uCardLod);
    float w = t.a * (1.0 - 0.17 * float(k));
    if (w > depth) { depth = w; ink = t.rgb / max(t.a, 0.001); }
  }
  vec3 col = mix(base, mix(base, ink, 0.34), depth * home);

  float sweepX = fract(uTime * 0.16 + i * 0.37) * 2.4 - 0.7;
  // squared by hand: pow() of a negative number is undefined in GLSL (NaN on Metal)
  float sw = (uv.x + (uv.y - 0.5) * 0.35 - sweepX) / 0.07;
  float sweep = exp(-sw * sw);
  float shimmer = 0.95 + 0.05 * sin(uTime * 2.3 + block.y * 0.7 + block.x * 0.13);
  float a = mk.a * home;
  vec3 face = mk.rgb * home * shimmer + vec3(0.55) * sweep * a;
  return col * (1.0 - a) + face;
}

const float DPHI = 0.73;                // tip per reel step, radians (41.8 deg)
const float SINK = 0.85;                // depth lost one step away from centre
const float YAW3 = 0.06;                // extra yaw at one step
const float SPIN4 = 0.37;               // extra in-plane turn at one step (grows as off^4)
const vec2 BULGE = vec2(0.055, 0.087);  // pillow bow: side edges, top and bottom edges
const float CORNER = 0.012;             // corner radius over (DIST * TANF), about 6 px on a 945 px screen

// Each card is a rigid panel. Stepping one card away it tips about a tilted
// axis, sinks back and turns a little in its own plane, so a centred card has
// thin wedges for neighbours. Only the hero (first) and about (last) cards zoom.
vec3 reel(vec2 p) {
  gFine = 0.75;
  vec3 bg = reelBg(p);
  float last = uCardCount + 1.0, base = floor(uR + 0.5), scr = DIST * TANF;
  float hhN = CARD * scr;
  float hwN = min(hhN * CARD_ASPECT, 0.84 * scr * uAspect);
  hhN = min(hhN, hwN / CARD_ASPECT);
  vec3 rd = vec3(p.x * TANF * uAspect, p.y * TANF, -1.0);
  vec2 ax = vec2(cos(TILT), sin(TILT));
  float bestT = 1e9, hi = -1.0, hasp = 1.0, cov = 0.0, hyW = 1.0;
  vec2 hl = vec2(0.0);
  for (int j = -1; j <= 1; j++) {
    float i = base + float(j);
    if (i < 0.0 || i > last) continue;
    float off = i - uR, o2 = off * off;
    float z = i < 0.5 ? uZoomA : (i > last - 0.5 ? uZoomB : 0.0);
    // card frame: tip by DPHI * off about the drum axis (ax, 0)
    float c = cos(DPHI * off), sn = sin(DPHI * off);
    vec3 n = vec3(ax.y * sn, -ax.x * sn, c);
    vec3 u = vec3(c + ax.x * ax.x * (1.0 - c), ax.x * ax.y * (1.0 - c), -ax.y * sn);
    vec3 v = vec3(ax.x * ax.y * (1.0 - c), c + ax.y * ax.y * (1.0 - c), ax.x * sn);
    float cy = cos(YAW3 * o2 * off), sy = sin(YAW3 * o2 * off);
    n = vec3(n.x * cy + n.z * sy, n.y, n.z * cy - n.x * sy);
    u = vec3(u.x * cy + u.z * sy, u.y, u.z * cy - u.x * sy);
    v = vec3(v.x * cy + v.z * sy, v.y, v.z * cy - v.x * sy);
    float cg = cos(SPIN4 * o2 * o2), sg = sin(SPIN4 * o2 * o2);
    vec3 u2 = u * cg + v * sg;
    v = v * cg - u * sg;
    u = u2;
    float sk = sin(1.5708 * clamp(off, -1.0, 1.0));
    vec3 ctr = vec3(DRUM * sn * ax.y, -DRUM * sn * ax.x, -DIST - SINK * sk * sk);
    float dn = dot(rd, n);
    if (dn >= 0.0) continue;
    float t = dot(ctr, n) / dn;
    if (t <= 0.0 || t >= bestT) continue;
    vec3 q = rd * t - ctr;
    vec2 hs = vec2(mix(hwN, scr * uAspect * 1.001, z), mix(hhN, scr * 1.001, z));
    vec2 l = vec2(dot(q, u), dot(q, v)) / hs;
    // pillow: the outline and the picture bulge together
    l *= 1.0 - BULGE * (1.0 - z) * (1.0 - min(l.yx * l.yx, 1.5));
    float d = sdRoundBox(l * hs, hs, CORNER * scr * (1.0 - z));
    float aa = 2.0 * t * TANF / uRes.y;
    if (d > aa) continue;
    bestT = t; hi = i; hl = l; hasp = hs.x / hs.y; hyW = hs.y;
    cov = clamp(0.5 - 0.5 * d / aa, 0.0, 1.0);
  }
  if (hi < 0.0) return bg;
  vec3 col;
  if (hi < 0.5) {
    col = textureLod(uHeroLayer, hl * 0.5 + 0.5, 0.0).rgb;
    if (cov > 0.5) gFine = 0.0;
  } else if (hi > last - 0.5) {
    if (cov > 0.5) gFine = 1.0;
    // pick the mip for the size the about card is drawn at, so the photo does not sparkle
    float rowsA = float(textureSize(uSceneA, 0).y) * min(1.0, uSceneAAsp / hasp);
    float cardPx = hyW / (bestT * TANF) * uRes.y;
    col = sceneA(hl * 0.5 + 0.5, hasp, max(uSceneLod, log2(rowsA / max(cardPx, 1.0)) - 0.5));
  } else {
    col = nameCard(coverUv(hl * 0.5 + 0.5, hasp, uCardAsp), hi);
  }
  // the reference cards are unlit: no darkening as they tip away
  return mix(bg, col, cov);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec3 col = uAboutOn > 0.5 ? about(vUv) : reel(p);
  o = vec4(col, gFine);
}`;

// ------------------------------------------------------------------ post --

export const POST_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;

uniform sampler2D uScene;
uniform sampler2D uFlow;
uniform vec2 uGrid;     // scene size in texels
uniform vec2 uPx;       // canvas size in device pixels
uniform vec2 uCss;      // canvas size in CSS pixels
uniform float uDot;     // hero dot size in scene texels
uniform float uTime;
uniform float uTear;    // 0..1 from scroll speed
uniform float uMotion;  // 0 when the visitor asked for reduced motion
uniform vec2 uMouse;
uniform float uMouseE;
uniform float uVig;     // 0 on the reel and the hero, 1 when the about or contact photo fills the screen
uniform float uWakeOn;
uniform float uWakeStrength; // 0 on the reel, 1 where a picture fills the screen
uniform float uWakeR;   // the wake's half width (WAKE_R), CSS px
uniform vec3 uRoll;     // a band that rolls through the picture: centre (0..1, y up), strength, kind (0 tear, 1 ripple)
uniform float uRollH;   // its half height, CSS px

float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
${WAKE}
// smooth value noise, for the wake's liquid wobble
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), u.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), u.x), u.y);
}

// integral of a periodic pulse that is 1 over the last d of every unit cell
float pulseI(float t, float d) { return floor(t) * d + max(fract(t) - (1.0 - d), 0.0); }
// share of one pixel's footprint (w cells wide, centred on t) that falls in the gap
float gapCover(float t, float w, float d) { return (pulseI(t + 0.5 * w, d) - pulseI(t - 0.5 * w, d)) / w; }

// The hero as small blocks. The last third of each cell is a darker gap: dark
// rows between lit cells, vertical stripes in shadow, as in the reference.
// Mean brightness is kept, so the picture does not dim.
vec3 heroDots(vec3 c, vec2 g, vec2 w) {
  const float D = 1.0 / 3.0;
  float lit = smoothstep(0.08, 0.35, dot(c, vec3(0.299, 0.587, 0.114)));
  float gRow = mix(0.95, 0.76, lit);
  float gCol = mix(0.50, 0.87, lit);
  float m = (1.0 - (1.0 - gCol) * gapCover(g.x, w.x, D)) * (1.0 - (1.0 - gRow) * gapCover(g.y, w.y, D));
  float mean = (1.0 - (1.0 - gCol) * D) * (1.0 - (1.0 - gRow) * D);
  return c * m / mean;
}

// Photos and cards: full resolution with a slight horizontal softness, no colour split.
vec3 softPhoto(vec2 at, float dx) {
  vec2 o = vec2(dx, 0.0);
  return 0.5 * texture(uScene, at).rgb + 0.25 * (texture(uScene, at - o).rgb + texture(uScene, at + o).rgb);
}

// Tape noise: rows about 1.25 px tall carry a colour tint that holds for tens
// of pixels, plus fine grain. This, not periodic scanlines, is what gives the
// reference its analogue texture.
vec3 tapeNoise(vec2 fc, float t, float dpr) {
  vec2 q = fc / dpr;
  float ts = mod(floor(t * 30.0), 97.0) * 1.31;
  float rf = q.y / 1.25;
  float r0 = floor(rf);
  vec2 a = vec2(h2(vec2(r0, 1.7 + ts)), h2(vec2(r0, 9.2 + ts)));
  vec2 b = vec2(h2(vec2(r0 + 1.0, 1.7 + ts)), h2(vec2(r0 + 1.0, 9.2 + ts)));
  float u = mix((a.x - 0.5) * cos(q.x * 0.060 + a.y * 6.2832), (b.x - 0.5) * cos(q.x * 0.060 + b.y * 6.2832), fract(rf));
  float v = mix((a.y - 0.5) * cos(q.x * 0.035 + a.x * 6.2832), (b.y - 0.5) * cos(q.x * 0.035 + b.x * 6.2832), fract(rf));
  vec2 gc = floor(q / vec2(3.0, 1.25));
  float gr = h2(gc + vec2(ts, 0.0)) - 0.5;
  float gb = h2(gc + vec2(17.0, ts)) - 0.5;
  vec3 n = vec3(0.085 * v, 0.0, 0.14 * u);
  n.g = -(0.299 * n.r + 0.114 * n.b) / 0.587;
  return n + 0.045 * gr + vec3(0.0, 0.0, 0.05 * gb);
}

void main() {
  float dpr = uPx.y / uCss.y;
  // barrel distortion: corners stay put, edges bow outward
  vec2 p = vUv * 2.0 - 1.0;
  const float K = ${f(LENS_K)};
  vec2 uv = p * (1.0 + K * dot(p, p)) / (1.0 + 2.0 * K) * 0.5 + 0.5;

  // Tears. One band about 100 px tall at a random height while scrolling; a
  // band that rolls slowly up or down through the picture every few seconds
  // (a fine comb over the hero, a ripple over photos, as on the reference);
  // and the mouse row while it moves. Every 2 px line in a tear combs sideways.
  float line = floor(vUv.y * uCss.y * 0.5);
  float comb = h2(vec2(line, floor(uTime * 20.0))) - 0.5;
  float bandY = h2(vec2(floor(uTime * 1.6), 4.0));
  // squared by hand: pow() of a negative number is undefined in GLSL (NaN on Metal)
  float bd = (uv.y - bandY) / 0.035;
  float band = exp(-bd * bd) * clamp(uTear, 0.0, 1.0);
  float rd = (vUv.y - uRoll.x) * uCss.y / uRollH;
  float roll = exp(-rd * rd) * uRoll.y * uMotion;
  float nd = (uv.y - uMouse.y) / 0.045;
  // only over a full screen picture, like the wake: the reel stays still
  float near = exp(-nd * nd) * uMouseE * uWakeStrength;
  float edge = smoothstep(0.035, 0.0, uv.y) * 0.35;
  float tearAmt = clamp(band + near + edge + roll, 0.0, 1.0);
  // the mouse row mostly gets streaks (below); it only shifts a little
  float shift = clamp(band + edge + 0.4 * near, 0.0, 1.0);
  uv.x += comb * 0.026 * shift * uMotion;
  float ripple = 0.6 * sin(vUv.y * uCss.y * 0.21 + uTime * 7.0) + 0.4 * sin(vUv.y * uCss.y * 0.05 - uTime * 3.1);
  uv.x += roll * mix(comb * 0.03, ripple * 0.010 + comb * 0.004, uRoll.z);
  // Inside the rolling band the rows also smear sideways. Over the hero every
  // 2 px line gets its own streak, 30 to 160 px long, one way or the other, as
  // on the reference; over photos a short trail.
  float lenL = mix(30.0 + 130.0 * h2(vec2(line, 5.0 + floor(uTime * 20.0))), 8.0, uRoll.z);
  float smear = roll * lenL / uCss.x * mix(comb < 0.0 ? -1.0 : 1.0, 1.0, uRoll.z);

  // The pointer's wake distorts the picture where it passes: the pixels are
  // dragged along the path, bulge out a little at its edges, wobble, and break
  // into small blocks where it is strongest, then settle back. Nothing is
  // painted over the picture and no colour is invented, so everywhere it keeps
  // the picture's own colours. The same over the hero and the photos; off on
  // the reel (strength 0 there, and its pixels are marked while a card is
  // still part zoomed).
  float wk = 0.0;
  float wflash = 0.0;
  float wshade = 1.0;
  // where the hero's dot pattern is drawn: bent with the picture, but not
  // snapped to the blocks below, so a block keeps the dots' own texture
  vec2 dotUv = uv;
  if (uWakeOn > 0.5) {
    vec4 fl = texture(uFlow, uv);
    float A = fl.z * uWakeStrength * uMotion;
    if (A > 0.003) {
      float sa = texture(uScene, uv).a;
      A *= 1.0 - step(0.6, sa) * step(sa, 0.9);
    }
    if (A > 0.003) {
      float age = fl.w * WAKE_SPAN;
      // at most 1 long: FLOW limits it
      vec2 push = (fl.xy - 0.5) * 2.0;
      // strong from the start, so a slow drag shows as much as a flick
      wk = wakeWarp(min(1.0, A * 1.5), age);
      wflash = wakeFlare(A, age);
      // How fast A rises toward the path, per CSS px (so it points inward).
      // Measured from three quarters of a wake half width (uWakeR) on either
      // side, so a stretch rubbed until A tops out at 1 still has a gentle
      // slope at its edge, and a phone, where a flow texel is only a few px,
      // gets the same shape as a desktop.
      vec2 e = max(1.5 / vec2(textureSize(uFlow, 0)), 0.75 * uWakeR / uCss);
      vec2 g = vec2(texture(uFlow, uv + vec2(e.x, 0.0)).z - texture(uFlow, uv - vec2(e.x, 0.0)).z,
                    texture(uFlow, uv + vec2(0.0, e.y)).z - texture(uFlow, uv - vec2(0.0, e.y)).z)
               / (2.0 * e * uCss) * uWakeStrength;
      float gn = length(g);
      vec2 outward = gn > 1e-7 ? -g / gn : vec2(0.0);
      float rim = smoothstep(0.0, 0.2, gn * uWakeR);
      // a liquid wobble: smooth noise that drifts while the wake lives
      vec2 nq = uv * uCss / 26.0 + vec2(uTime * 0.9, -uTime * 0.7);
      vec2 wob = vec2(vnoise(nq), vnoise(nq + vec2(17.3, 9.1))) - 0.5;
      // In CSS px: the drag along the path, the bulge and the wobble. The
      // bulge samples toward the path, which magnifies it. For a spot d from
      // a single pass it moves the sample a little less than 0.9 A d
      // exp(-d^2 / R^2) closer, always less than d, so the two sides never
      // swap. About 9 px for one pass and 12 px where A tops out, on a 945 px
      // tall screen (it grows with the screen's height, like the wake).
      vec2 offPx = push * 26.0 * wk - g * (0.45 * uWakeR * uWakeR) * wakeWarp(1.0, age) + wob * 26.0 * wk;
      uv -= offPx / uCss;
      dotUv = uv;
      // the wake is shaded like a raised ripple, lit from the upper left: a
      // little brighter on one side, a little darker on the other, so it shows
      // even over flat sky (only the picture's own colours, a few per cent)
      wshade = 1.0 + 0.16 * rim * wk * dot(outward, vec2(-0.6, 0.8));
      // small blocks, 4 to 9 px across, where the wake is strongest, finer as it settles
      float steps = floor(wk * 5.0);
      if (steps >= 1.0) {
        float B = 3.0 + steps * 1.25;
        uv = (floor(uv * uCss / B) + 0.5) * B / uCss;
      }
    }
  }

  // footprint of one pixel in hero cells, taken before any branch
  vec2 gc = dotUv * uGrid / uDot;
  vec2 gw = max(vec2(abs(dFdx(gc.x)), abs(dFdy(gc.y))), vec2(1e-4));

  vec3 col;
  // the colour comes from the (possibly snapped) picture position
  vec2 cellUv = (floor(uv * uGrid / uDot) + 0.5) * uDot / uGrid;
  vec4 s = texture(uScene, cellUv);
  bool hero = s.a < 0.5;
  if (hero) {
    // hero: blocks
    vec3 c = s.rgb;
    if (abs(smear) > 1e-5) {
      for (int k = 1; k <= 4; k++) c = max(c, texture(uScene, cellUv - vec2(smear * float(k) * 0.25, 0.0)).rgb * (1.0 - 0.1 * float(k)));
    }
    col = heroDots(c, gc, gw);
  } else {
    col = softPhoto(uv, 0.75 / uCss.x);
    if (abs(smear) > 1e-5) {
      col = max(col, texture(uScene, uv - vec2(smear, 0.0)).rgb * 0.85);
      col = max(col, texture(uScene, uv - vec2(smear * 2.0, 0.0)).rgb * 0.65);
    }
  }
  // a fresh wake catches the light for a moment
  col *= (1.0 + 0.2 * wflash) * wshade;
  float hl = dot(col, vec3(0.299, 0.587, 0.114));  // luma, for keeping whites clean

  // keep whites clean: noise and hum fade out in highlights
  float keep = 1.0 - smoothstep(0.85, 1.0, hl);

  // slow hum bar
  col *= 1.0 + 0.035 * sin(uv.y * 5.0 - uTime * 0.7) * uMotion * keep;

  // vignette: nothing on the reel or the hero, a steep band at the edges when the about or contact photo fills the screen
  vec2 ed = min(vUv, 1.0 - vUv);
  col *= (1.0 - 0.62 * uVig * (1.0 - smoothstep(0.012, 0.085, ed.x)))
       * (1.0 - 0.42 * uVig * (1.0 - smoothstep(0.0, 0.13, ed.y)));

  col += tapeNoise(gl_FragCoord.xy, uTime * uMotion, dpr) * keep;

  // short dashes, 1 px tall, more of them inside a tear band
  float dline = floor(vUv.y * uCss.y);
  float dslot = floor(uTime * 9.0);
  float pick = step(0.9895 - 0.30 * tearAmt, h2(vec2(dline * 3.1, dslot + 9.0)));
  float dx = uv.x - h2(vec2(dline, dslot));
  float len = 0.006 + 0.007 * h2(vec2(dslot, dline));
  // half as bright on the reel's dark ground, so they do not outshine its grid
  float onReel = step(0.6, s.a) * step(s.a, 0.9);
  col += pick * step(0.0, dx) * step(dx, len) * 0.42 * uMotion * (1.0 - 0.5 * onReel);

  o = vec4(col, 1.0);
}`;
