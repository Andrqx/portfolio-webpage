(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,56072,e=>{"use strict";e.i(47167);var t=e.i(43476),o=e.i(71645),a=e.i(22016);let s={dark:{bg:"#0b0c0f",fg:"#f2f1ec",sub:"#9aa0a8"},light:{bg:"#c9ccd1",fg:"#0b0c0f",sub:"#4a4e55"},accent:{bg:"#ff4b1f",fg:"#0b0c0f",sub:"#3a1206"},blue:{bg:"#1746ff",fg:"#f2f1ec",sub:"#c3ceff"}};function i(e){return new Promise((t,o)=>{let a=new Image;a.decoding="async",a.onload=()=>t(a),a.onerror=()=>o(Error(`could not load ${e}`)),a.src=e})}function r(){let e=document.createElement("canvas");return e.width=1280,e.height=800,{cv:e,ctx:e.getContext("2d")}}let l=64,n=150,h=1152,c=400;function u(e,t,o,a,i){let u=t?s.dark:s[e.tone],d=r(),f=r(),m=d.ctx;if(m.fillStyle=u.bg,m.fillRect(0,0,1280,800),t){!function(e,t,o=[.5,.5]){let a=Math.max(1280/t.naturalWidth,800/t.naturalHeight),s=t.naturalWidth*a,i=t.naturalHeight*a;e.drawImage(t,(1280-s)*o[0],(800-i)*o[1],s,i)}(m,t,e.focus);let o=Math.min(.92,Math.max(.34,.36/Math.max(function(e){let t=document.createElement("canvas");t.width=32,t.height=20;let o=t.getContext("2d",{willReadFrequently:!0});o.drawImage(e,0,0,32,20);let a=o.getImageData(0,0,32,20).data,s=0;for(let e=0;e<a.length;e+=4)s+=.299*a[e]+.587*a[e+1]+.114*a[e+2];return s/(a.length/4)/255}(d.cv),.01)));if(m.fillStyle=`rgba(5, 6, 9, ${(1-o).toFixed(3)})`,m.fillRect(0,0,1280,800),e.showName){let e=m.createRadialGradient(576,n+c/2,40,576,n+c/2,793.6);e.addColorStop(0,"rgba(4, 5, 8, 0.5)"),e.addColorStop(1,"rgba(4, 5, 8, 0)"),m.fillStyle=e,m.fillRect(0,0,1280,800)}let a=m.createLinearGradient(0,440.00000000000006,0,800);a.addColorStop(0,"rgba(4, 5, 8, 0)"),a.addColorStop(1,"rgba(4, 5, 8, 0.85)"),m.fillStyle=a,m.fillRect(0,0,1280,800)}m.strokeStyle=u.fg,m.lineWidth=2,m.globalAlpha=t?.08:.11;for(let e=80;e<1280;e+=80)m.beginPath(),m.moveTo(e,0),m.lineTo(e,800),m.stroke();for(let e=80;e<800;e+=80)m.beginPath(),m.moveTo(0,e),m.lineTo(1280,e),m.stroke();m.globalAlpha=.35,m.lineWidth=3;m.beginPath(),m.arc(1130,96,46,0,2*Math.PI),m.moveTo(1060,96),m.lineTo(1200,96),m.moveTo(1130,26),m.lineTo(1130,166),m.stroke(),m.globalAlpha=1,m.textBaseline="alphabetic",m.fillStyle=u.fg,m.font=`700 40px ${i}`,m.fillText(e.index,64,100),m.globalAlpha=.5,m.fillRect(64,610,1152,2),m.globalAlpha=1;let p=38;do{if(m.font=`600 ${p}px ${i}`,m.measureText(e.title.toUpperCase()).width<=1152)break;p-=2}while(p>22)if(m.fillText(e.title.toUpperCase(),64,678),m.fillStyle=u.sub,m.font=`500 27px ${i}`,m.fillText(e.period.toUpperCase(),64,730),m.textAlign="right",m.fillText("OPEN  ↗",1216,730),m.textAlign="left",(m=f.ctx).clearRect(0,0,1280,800),e.showName)if(o){let e=Math.min(h/o.naturalWidth,.8*c/o.naturalHeight),t=o.naturalWidth*e,a=o.naturalHeight*e;m.drawImage(o,l,n+(c-a)/2,t,a)}else{let t=function(e){let t=e.toUpperCase().split(" ");if(t.length<2||e.length<=11)return[e.toUpperCase()];let o=1,a=1/0;for(let e=1;e<t.length;e++){let s=Math.abs(t.slice(0,e).join(" ").length-t.slice(e).join(" ").length);s<a&&(a=s,o=e)}return[t.slice(0,o).join(" "),t.slice(o).join(" ")]}(e.name),o=t.reduce((e,t)=>e.length>=t.length?e:t),s=t.length>1?196:250;do{if(m.font=`900 ${s}px ${a}`,m.measureText(o).width<=h)break;s-=4}while(s>60)m.fillStyle=u.fg,m.textBaseline="alphabetic";let i=.92*s,r=i*t.length,d=n+(c-r)/2;t.forEach((e,t)=>m.fillText(e,l-.04*s,d+i*(t+1)-.14*s))}return{base:d.cv,mark:f.cv}}let d=e=>Math.min(1,Math.max(0,e)),f=(e,t,o)=>{let a=d((o-e)/(t-e));return a*a*(3-2*a)};function m(e,t=0){let o=e+1,a=o+.5+.8*Math.max(t,0),s=a+.5,i=s+1.5,r=a+.68*(i-a);return{last:o,aboutStart:o,text1In:o-.07,changeStart:a,contactStart:s,aboutTextOut:r-.2,contactTextIn:r,contactTextFull:r+.35,contactFull:i,total:i+1.5}}let p=`
float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
vec2 rotv(vec2 v, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}
`,v=`
const float WAKE_SPAN = 1.5;
float wakeFlare(float A, float age) { return A * exp(-age / 0.1); }
float wakeWarp(float A, float age) { return A * exp(-age / 0.3); }
`,x=`#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,g=`#version 300 es
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
${v}

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
}`,b=e=>`#version 300 es
${e?"#define MANNEQUIN":""}
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
${p}

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
}`,w=`#version 300 es
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

const float TANF = 0.4663;
const float DIST = 3.0000;
const float DRUM = 3.1500;
const float TILT = 0.3600;
const float CARD = 0.5860;
const float CARD_ASPECT = 1.6100;
const float DONE = 0.6800; // the contact photo has fizzled in by this uChange

// Written to the alpha channel: 0 where POST breaks the picture into dots (the
// hero card), 0.75 on the reel's ground and its name cards, which the pointer's
// wake leaves alone, and 1 on the photos. The reel and the photos stay at full
// resolution.
float gFine = 1.0;
${p}

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
}`,y=`#version 300 es
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
${v}
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
  const float K = 0.0500;
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
}`,A=/\.(mp4|webm|mov|m4v)$/i,T=/\.(png|webp)$/i,k=/\.(jpe?g)$/i,E=[1,1.5,2,3],R=(e,t,o)=>e+(t-e)*o;function M(e,t){let o=2*e-1,a=2*t-1,s=(1+.05*(o*o+a*a))/1.1;return[o*s*.5+.5,a*s*.5+.5]}class S{canvas;assets;onFrame;onReady;gl;flowProg;heroProg;sceneProg;postProg;vao;quad;scene;hero;flow;flowIdx;texHero;texCards;texAbout;texContact;heroAsp;heroMode;heroFailed;aspAbout;aspContact;aboutTexW;aboutTexH;contactTexW;contactTexH;video;raf;last;time;s;tear;mouse;lastPointer;away;lastStamp;speedBackoff;flowFloat;seed;glitch;glitchAt;band;cssW;cssH;cols;rows;texel;maxDpr;step;slow;speedCheckAt;unitPx;lost;reduced;dirty;dead;mq;constructor(e,t,o,a=()=>void 0){this.canvas=e,this.assets=t,this.onFrame=o,this.onReady=a,this.scene=null,this.hero=null,this.flow=null,this.flowIdx=0,this.heroAsp=1,this.heroMode=0,this.heroFailed=!1,this.aspAbout=16/9,this.aspContact=16/9,this.aboutTexW=1600,this.aboutTexH=900,this.contactTexW=1600,this.contactTexH=900,this.video=null,this.raf=0,this.last=0,this.time=0,this.s=0,this.tear=0,this.mouse={x:.5,y:.5,tx:.5,ty:.5,e:0,tiltX:0,tiltY:0},this.lastPointer=-1e9,this.away=!0,this.lastStamp=-1e9,this.speedBackoff=2e4,this.flowFloat=!1,this.seed=0,this.glitch=0,this.glitchAt=2,this.band={y:.5,v:0,a:0,kind:0,start:0,end:0,next:2.5},this.cssW=1,this.cssH=1,this.cols=1,this.rows=1,this.texel=1,this.maxDpr=1.5,this.step=0,this.slow=0,this.speedCheckAt=0,this.unitPx=1,this.lost=!1,this.reduced=!1,this.dirty=!0,this.dead=!1,this.onMotionPref=()=>{this.reduced=this.mq.matches,this.reduced&&(this.glitch=0,this.mouse.tiltX=0,this.mouse.tiltY=0),this.dirty=!0},this.onPointer=e=>{let t=this.mouse;t.tx=e.clientX/this.cssW,t.ty=1-e.clientY/this.cssH;let o=performance.now();(this.away||"mouse"!==e.pointerType&&o-this.lastPointer>150)&&(t.x=t.tx,t.y=t.ty),this.away=!1,this.lastPointer=o,this.dirty=!0},this.onPointerOut=e=>{e.relatedTarget||(this.away=!0)},this.onAway=()=>{this.away=!0},this.onResize=()=>{this.measureUnit(),this.resize(),this.dirty=!0},this.onScroll=()=>{this.dirty=!0},this.onLost=e=>{e.preventDefault(),this.lost=!0,this.dead=!0,cancelAnimationFrame(this.raf)},this.frame=e=>{if(this.dead)return;if(this.raf=requestAnimationFrame(this.frame),document.hidden){this.last=e;return}let t=this.last?(e-this.last)/1e3:.016,o=Math.min(.05,t);this.last=e;let a=window.scrollY/this.unitPx,s=this.s;this.reduced?this.s=a:(this.s+=(a-this.s)*(1-Math.exp(-(6.3*t))),4e-4>Math.abs(a-this.s)&&(this.s=a));let i=this.timelineAt(this.s);if(this.reduced){if(!this.dirty&&this.s===s)return;this.dirty=!1,this.time=2}else this.time+=o,this.watchSpeed(o);let r=Math.min(1,.22*(Math.abs(this.s-s)/Math.max(t,.001)));this.tear+=(r-this.tear)*(1-Math.exp(-t*(r>this.tear?10:2.5)));let l=this.mouse,n=l.x,h=l.y,c=1-Math.exp(-(16*t));l.x+=(l.tx-l.x)*c,l.y+=(l.ty-l.y)*c;let u=Math.hypot((l.x-n)*(this.cssW/this.cssH),l.y-h),d=this.reduced?0:Math.min(1,55*u);l.e+=(d-l.e)*(1-Math.exp(-(6*t)));let f=1-Math.exp(-(3*t));l.tiltX+=((this.reduced?0:2*l.tx-1)-l.tiltX)*f,l.tiltY+=((this.reduced?0:2*l.ty-1)-l.tiltY)*f,this.updateGlitch(o),this.updateBand(o,i),this.syncVideo(i),this.draw(i,t,n,h),this.onFrame({s:this.s,tl:i})};const s=e.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1});if(!s)throw Error("WebGL2 is not available");if(s.isContextLost())throw Error("the WebGL context is lost");this.gl=s,this.flowFloat=!!(s.getExtension("EXT_color_buffer_float")||s.getExtension("EXT_color_buffer_half_float")),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!0),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.disable(s.DEPTH_TEST),s.disable(s.BLEND),this.flowProg=this.program(g,"flow"),this.heroProg=this.program(b(!t.heroMedia),"hero"),this.sceneProg=this.program(w,"scene"),this.postProg=this.program(y,"post"),this.vao=s.createVertexArray(),s.bindVertexArray(this.vao),this.quad=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.quad),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),s.STATIC_DRAW),s.enableVertexAttribArray(0),s.vertexAttribPointer(0,2,s.FLOAT,!1,0,0),this.texHero=this.solid([0,0,0,0]),this.texAbout=this.solid([10,12,16,255]),this.texContact=this.solid([14,10,8,255]),this.texCards=s.createTexture(),s.bindTexture(s.TEXTURE_2D_ARRAY,this.texCards);const i=Math.floor(Math.log2(1280))+1;s.texStorage3D(s.TEXTURE_2D_ARRAY,i,s.RGBA8,1280,800,2*Math.max(1,t.cards.length)),s.texParameteri(s.TEXTURE_2D_ARRAY,s.TEXTURE_MIN_FILTER,s.LINEAR_MIPMAP_LINEAR),s.texParameteri(s.TEXTURE_2D_ARRAY,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D_ARRAY,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D_ARRAY,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.mq=window.matchMedia("(prefers-reduced-motion: reduce)"),this.reduced=this.mq.matches,this.mq.addEventListener("change",this.onMotionPref),window.addEventListener("pointermove",this.onPointer,{passive:!0}),window.addEventListener("pointerout",this.onPointerOut,{passive:!0}),window.addEventListener("blur",this.onAway),window.addEventListener("resize",this.onResize),window.addEventListener("scroll",this.onScroll,{passive:!0}),e.addEventListener("webglcontextlost",this.onLost),this.measureUnit(),this.s=window.scrollY/this.unitPx,this.resize(),this.loadAssets(),this.raf=requestAnimationFrame(this.frame)}destroy(){this.dead=!0,cancelAnimationFrame(this.raf),this.mq.removeEventListener("change",this.onMotionPref),window.removeEventListener("pointermove",this.onPointer),window.removeEventListener("pointerout",this.onPointerOut),window.removeEventListener("blur",this.onAway),window.removeEventListener("resize",this.onResize),window.removeEventListener("scroll",this.onScroll),this.canvas.removeEventListener("webglcontextlost",this.onLost),this.video&&(this.video.pause(),this.video.removeAttribute("src"),this.video.load());let e=this.gl;if(!(this.lost||e.isContextLost())){for(let t of[this.flowProg,this.heroProg,this.sceneProg,this.postProg])e.deleteProgram(t.prog);for(let t of[this.texHero,this.texCards,this.texAbout,this.texContact])e.deleteTexture(t);this.drop(this.scene),this.drop(this.hero),this.flow?.forEach(e=>this.drop(e)),e.deleteBuffer(this.quad),e.deleteVertexArray(this.vao),this.canvas.isConnected||e.getExtension("WEBGL_lose_context")?.loseContext()}}timelineAt(e){return function(e,t,o=0){let a=m(t,o),s=1-f(0,.55,e),i=1-f(0,.32,a.last-e),r=.09+.91*s*s,l=e>=a.last?1:.09+.91*i*i;return{r:Math.min(Math.max(e,0),a.last),zoomA:r,zoomB:l,bleed:d((Math.max(r,l)-.09)/.91),about:d((e-a.aboutStart)/(a.contactFull-a.aboutStart)),change:d((e-a.changeStart)/(a.contactFull-a.changeStart)),aboutText:1-f(a.aboutTextOut,a.contactTextIn,e)}}(e,this.assets.cards.length,this.assets.aboutParagraphs??0)}bench(e=40){let t=this.gl,o=this.timelineAt(this.s),a=new Uint8Array(4);t.finish();let s=performance.now();for(let t=0;t<e;t++)this.time+=.016,this.draw(o,.016);return t.readPixels(0,0,1,1,t.RGBA,t.UNSIGNED_BYTE,a),{ms:(performance.now()-s)/e,canvas:[this.canvas.width,this.canvas.height],scene:[this.cols,this.rows],hero:this.hero?[this.hero.w,this.hero.h]:null}}capture(e,t=[],o=this.time,a=!0){let s=this.mouse;this.s=e,this.time=o;let i=this.timelineAt(e);for(let[e,o]of t.length?t:[[s.tx,1-s.ty]]){let a=s.x,r=s.y;s.tx=s.x=e,s.ty=s.y=1-o,s.tiltX=2*e-1,s.tiltY=(1-o)*2-1;let l=Math.hypot((s.x-a)*(this.cssW/this.cssH),s.y-r);s.e=t.length?Math.min(1,55*l):0,this.time+=1/60,this.updateGlitch(1/60),this.updateBand(1/60,i),this.draw(i,1/60,a,r)}return this.onFrame({s:e,tl:i}),a?this.canvas.toDataURL("image/jpeg",.88):""}onMotionPref;onPointer;onPointerOut;onAway;onResize;onScroll;onLost;measureUnit(){this.unitPx=Math.max(1,this.assets.scrollUnit?.()||window.innerHeight)}program(e,t,o=x){let a=this.gl,s=(e,o)=>{let s=a.createShader(e);if(a.shaderSource(s,o),a.compileShader(s),!a.getShaderParameter(s,a.COMPILE_STATUS))throw Error(`${t} shader compile failed: ${a.getShaderInfoLog(s)}`);return s},i=a.createProgram(),r=s(a.VERTEX_SHADER,o),l=s(a.FRAGMENT_SHADER,e);if(a.attachShader(i,r),a.attachShader(i,l),a.bindAttribLocation(i,0,"aPos"),a.linkProgram(i),!a.getProgramParameter(i,a.LINK_STATUS))throw Error(`${t} program link failed: ${a.getProgramInfoLog(i)}`);a.deleteShader(r),a.deleteShader(l);let n={},h=a.getProgramParameter(i,a.ACTIVE_UNIFORMS);for(let e=0;e<h;e++){let t=a.getActiveUniform(i,e);t&&(n[t.name]=a.getUniformLocation(i,t.name))}return{prog:i,u:n}}useMannequin(){this.lost||this.gl.isContextLost()||(this.heroFailed=!0,this.gl.deleteProgram(this.heroProg.prog),this.heroProg=this.program(b(!0),"hero"),this.dirty=!0)}solid(e){let t=this.gl,o=t.createTexture();return t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array(e)),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),o}upload(e,t,o=this.gl.CLAMP_TO_EDGE){let a=this.gl;a.bindTexture(a.TEXTURE_2D,e),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,t),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,o),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,o),this.dirty=!0}uploadCard(e,t){let o=this.gl;o.bindTexture(o.TEXTURE_2D_ARRAY,this.texCards),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),[t.base,t.mark].forEach((t,a)=>{o.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,2*e+a,1280,800,1,o.RGBA,o.UNSIGNED_BYTE,t)}),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.generateMipmap(o.TEXTURE_2D_ARRAY),this.dirty=!0}target(e,t,o=[0,0,0,1],a=!1){let s=this.gl,i=s.createTexture();s.bindTexture(s.TEXTURE_2D,i),a?s.texImage2D(s.TEXTURE_2D,0,s.RGBA16F,e,t,0,s.RGBA,s.HALF_FLOAT,null):s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,e,t,0,s.RGBA,s.UNSIGNED_BYTE,null),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);let r=s.createFramebuffer();return s.bindFramebuffer(s.FRAMEBUFFER,r),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,i,0),s.clearColor(...o),s.clear(s.COLOR_BUFFER_BIT),s.bindFramebuffer(s.FRAMEBUFFER,null),{fbo:r,tex:i,w:e,h:t}}drop(e){e&&(this.gl.deleteFramebuffer(e.fbo),this.gl.deleteTexture(e.tex))}resize(){let e=this.gl;this.cssW=Math.max(1,this.canvas.clientWidth),this.cssH=Math.max(1,this.canvas.clientHeight);let t=Math.min(window.devicePixelRatio||1,this.maxDpr,Math.sqrt(26e5/(this.cssW*this.cssH))),o=Math.round(this.cssW*t),a=Math.round(this.cssH*t);(this.canvas.width!==o||this.canvas.height!==a)&&(this.canvas.width=o,this.canvas.height=a),this.texel=Math.max(1,this.cssW/2048)*E[this.step];let s=Math.max(8,Math.round(this.cssW/this.texel)),i=Math.max(8,Math.round(this.cssH/this.texel));this.scene&&s===this.cols&&i===this.rows||(this.cols=s,this.rows=i,this.drop(this.scene),this.scene=this.target(s,i));let r=Math.max(8,Math.round(this.cssW/4)),l=Math.max(8,Math.round(this.cssH/4));this.hero&&this.hero.w===r&&this.hero.h===l||(this.drop(this.hero),this.hero=this.target(r,l));let n=Math.max(16,Math.round(240*this.cssH/this.cssW));this.flow&&this.flow[0].h===n||(this.flow&&this.flow.forEach(e=>this.drop(e)),this.flow=[this.target(240,n,[.5,.5,0,1],this.flowFloat),this.target(240,n,[.5,.5,0,1],this.flowFloat)]),e.bindFramebuffer(e.FRAMEBUFFER,null)}async loadAssets(){let e=this.assets,t=()=>!this.dead,o=[];if(e.heroMedia&&A.test(e.heroMedia)){let a=document.createElement("video");a.muted=!0,a.loop=!0,a.playsInline=!0,a.preload="auto",a.src=e.heroMedia,o.push(new Promise(e=>{a.addEventListener("loadeddata",()=>{t()&&(this.heroAsp=a.videoWidth/Math.max(1,a.videoHeight),this.heroMode=1,this.upload(this.texHero,a)),e()}),a.addEventListener("error",()=>{t()&&this.useMannequin(),e()})})),this.video=a,a.play().catch(()=>void 0)}else e.heroMedia&&o.push(i(e.heroMedia).then(e=>{t()&&(this.heroAsp=e.naturalWidth/e.naturalHeight,this.heroMode=1,this.upload(this.texHero,e))}).catch(()=>{t()&&this.useMannequin()}));try{await Promise.race([Promise.all([document.fonts.load(`900 80px ${e.dotFont}`),document.fonts.load(`600 26px ${e.monoFont}`)]),new Promise(e=>setTimeout(e,2500))])}catch{}if(!t())return;let a=e=>e?i(e).catch(()=>null):Promise.resolve(null);e.cards.forEach((s,i)=>{this.uploadCard(i,u(s,null,null,e.dotFont,e.monoFont)),(s.image||s.logo)&&o.push(Promise.all([a(s.image),a(s.logo)]).then(([o,a])=>{t()&&(o||a)&&this.uploadCard(i,u(s,o,a,e.dotFont,e.monoFont))}))});let s=async(e,t)=>{if(e)try{return await i(e)}catch{}return t()},r=e=>e instanceof HTMLImageElement?[e.naturalWidth,e.naturalHeight]:[e.width,e.height];o.push(s(e.about,()=>(function(e=1600,t=900){let o=document.createElement("canvas");o.width=e,o.height=t;let a=o.getContext("2d");a.fillStyle="hsl(200 30% 6%)",a.fillRect(0,0,e,t),a.strokeStyle="hsl(200 40% 62%)",a.lineWidth=3;let s=e/2,i=.45*t;for(let o=0;o<14;o++){let r=(1-o/14)**2;a.globalAlpha=.15+.6*r,a.strokeRect(s-.6*e*r,i-.6*t*r,1.2*e*r,1.2*t*r)}for(let t=0;t<16;t++){let o=t/16*Math.PI*2;a.globalAlpha=.25,a.beginPath(),a.moveTo(s,i),a.lineTo(s+Math.cos(o)*e,i+Math.sin(o)*e),a.stroke()}return a.globalAlpha=1,o})()).then(e=>{if(!t())return;let[o,a]=r(e);this.aspAbout=o/a,this.aboutTexW=o,this.aboutTexH=a,this.upload(this.texAbout,e,this.gl.MIRRORED_REPEAT)}),s(e.contact,()=>(function(e=1600,t=900){let o,a=document.createElement("canvas");a.width=e,a.height=t;let s=a.getContext("2d"),i=(o=7,()=>(o=Math.imul(o,1664525)+0x3c6ef35f>>>0)/0x100000000),r=.5*e,l=.46*t,n=s.createLinearGradient(0,0,0,t);for(let o of(n.addColorStop(0,"#120303"),n.addColorStop(.5,"#2a0705"),n.addColorStop(1,"#090202"),s.fillStyle=n,s.fillRect(0,0,e,t),[-1,1]))for(let a=0;a<9;a++){let n=a/9,h=(a+1)/9,c=r+.62*e*o*(1-n)**1.6,u=r+.62*e*o*(1-h)**1.6,d=l-(l+40)*(1-n)**1.6,f=l-(l+40)*(1-h)**1.6,m=l+(t-l+40)*(1-n)**1.6,p=l+(t-l+40)*(1-h)**1.6,v=30+120*i();s.fillStyle=`rgb(${Math.round(v+60)}, ${Math.round(.22*v)}, ${Math.round(.12*v)})`,s.beginPath(),s.moveTo(c,d),s.lineTo(u,f),s.lineTo(u,p),s.lineTo(c,m),s.closePath(),s.fill();let x=3+Math.floor(4*i());for(let e=0;e<x;e++){let e=i(),t=e+.08+.14*i(),o=d+(m-d)*e,a=f+(p-f)*e,r=d+(m-d)*t,l=f+(p-f)*t;s.fillStyle=i()>.55?`rgba(255, ${Math.round(90+120*i())}, ${Math.round(20+40*i())}, ${.5+.5*i()})`:`rgba(20, 4, 3, ${.4+.5*i()})`,s.beginPath(),s.moveTo(c,o),s.lineTo(u,a),s.lineTo(u,l),s.lineTo(c,r),s.closePath(),s.fill()}}for(let o=0;o<70;o++){let o=l+(t-l)*i()**.7,a=.5*e*(o-l)/(t-l);s.fillStyle=`rgba(255, ${Math.round(60+90*i())}, 30, ${.05+.12*i()})`,s.fillRect(r-a*i(),o,a*(.3+i()),2+3*i())}for(let o of(s.globalCompositeOperation="lighter",[-1,1]))for(let a=0;a<8;a++){let n=(1-(a+.4*i())/8)**1.7,h=r+o*e*.44*n,c=l-.34*t*n+12*i(),u=10+62*n,d=s.createRadialGradient(h,c,0,h,c,2.6*u);d.addColorStop(0,"rgba(255, 228, 170, 0.95)"),d.addColorStop(.22,"rgba(255, 96, 34, 0.85)"),d.addColorStop(1,"rgba(255, 30, 0, 0)"),s.fillStyle=d,s.beginPath(),s.arc(h,c,2.6*u,0,2*Math.PI),s.fill()}let h=s.createRadialGradient(r,l,0,r,l,.3*t);h.addColorStop(0,"rgba(255, 190, 120, 0.5)"),h.addColorStop(1,"rgba(255, 60, 20, 0)"),s.fillStyle=h,s.fillRect(0,0,e,t),s.globalCompositeOperation="source-over";let c=s.createRadialGradient(r,.5*t,0,r,.5*t,.34*e);return c.addColorStop(0,"rgba(0,0,0,0.55)"),c.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=c,s.fillRect(0,0,e,t),a})()).then(e=>{if(!t())return;let[o,a]=r(e);this.aspContact=o/a,this.contactTexW=o,this.contactTexH=a,this.upload(this.texContact,e)})),await Promise.race([Promise.allSettled(o),new Promise(e=>setTimeout(e,4e3))]),t()&&(this.dirty=!0,this.onReady())}frame;updateGlitch(e){if(this.glitch*=Math.exp(-e/.2),this.reduced){this.glitch=0;return}let t=this.time;t<this.glitchAt-10&&(this.glitchAt=t+2),t>=this.glitchAt&&(this.glitch=1,this.glitchAt=t+2.2+3.5*Math.random())}updateBand(e,t){let o=this.band,a=this.time;a<o.start&&Object.assign(o,{start:a,end:a,next:a+2.5});let s=t.bleed>.6&&!this.reduced;if(a>=o.end){if(o.a=0,s&&a>=o.next){o.kind=t.r<.5?0:1;let e=.5>Math.random();o.v=(e?1:-1)*(180+120*Math.random())/this.cssH,o.y=e?.05+.35*Math.random():.6+.35*Math.random(),o.start=a,o.end=a+1.6+1.6*Math.random(),o.next=o.end+2.5+4*Math.random()}return}o.y+=o.v*e;let i=Math.min(a-o.start,o.end-a);o.a=s?Math.min(1,i/.25)*(o.kind?.85:1):0}watchSpeed(e){if(this.slow=e>.03?this.slow+1:Math.max(0,this.slow-2),this.slow<90)return;this.slow=0;let t=this.maxDpr>1&&this.canvas.width>1.01*this.cssW;if(!t&&this.step>=E.length-1)return;let o=performance.now();if(o<this.speedCheckAt)return;let a=this.time,s=this.bench(6).ms;if(this.time=a,s<12){this.speedCheckAt=o+this.speedBackoff,this.speedBackoff=Math.min(2*this.speedBackoff,32e4);return}t?this.maxDpr=1:this.step+=1,this.resize()}syncVideo(e){let t=this.video;if(!t||this.heroMode<1)return;let o=e.r<1.3&&!this.reduced;o&&t.paused&&t.play().catch(()=>void 0),o||t.paused||t.pause(),o&&t.readyState>=2&&this.upload(this.texHero,t)}draw(e,t,o=this.mouse.x,a=this.mouse.y){let s=this.gl;if(!this.scene||!this.flow||!this.hero)return;let i=this.cssW/this.cssH,r=this.mouse,l=this.assets,[n,h]=M(r.x,r.y),[c,u]=M(o,a),m=this.reduced?0:f(.35,.85,e.bleed),p=(n-c)*i,v=h-u,x=Math.hypot(p,v),g=x>1e-6&&x<Math.max(.4,12*t)?x:0;m>0&&g*m>.018*t&&(this.lastStamp=performance.now());let b=m>0&&performance.now()-this.lastStamp<1100;s.bindVertexArray(this.vao);let w=(e,t,o,a)=>{s.activeTexture(s.TEXTURE0+e),s.bindTexture(t,o),s.uniform1i(a,e)},y=this.flow[this.flowIdx],A=this.flow[1-this.flowIdx];this.flowIdx=1-this.flowIdx,s.bindFramebuffer(s.FRAMEBUFFER,A.fbo),s.viewport(0,0,A.w,A.h),s.useProgram(this.flowProg.prog);let E=this.flowProg.u;if(w(0,s.TEXTURE_2D,y.tex,E.uPrev),s.uniform2f(E.uMouse,n,h),s.uniform2f(E.uPrevMouse,c,u),s.uniform2f(E.uDir,g?p/x:0,g?v/x:0),s.uniform1f(E.uMoved,g),s.uniform1f(E.uAspect,i),s.uniform1f(E.uDt,Math.min(t,3)),s.uniform1f(E.uRadius,.04),s.uniform1f(E.uGain,.85/(.04*Math.sqrt(Math.PI))*m),this.seed=(this.seed+7.31)%1e3,s.uniform1f(E.uSeed,this.seed),s.uniform1f(E.uLsb,this.flowFloat?0:1/255),s.drawArrays(s.TRIANGLES,0,3),e.r<1.3){var S;let t,o,a,n;s.bindFramebuffer(s.FRAMEBUFFER,this.hero.fbo),s.viewport(0,0,this.hero.w,this.hero.h),s.useProgram(this.heroProg.prog),E=this.heroProg.u,w(0,s.TEXTURE_2D,this.texHero,E.uHero),s.uniform2f(E.uRes,this.hero.w,this.hero.h);let h=(S=e.zoomA,a=Math.min(1.61*(o=.586*(t=1.3989)),.84*t*i),n=R(o=Math.min(o,a/1.61),1.001*t,S),{aspect:R(a,t*i*1.001,S)/n,height:n/t});s.uniform1f(E.uAsp,h.aspect),s.uniform1f(E.uCardDots,h.height*this.cssH/4),s.uniform1f(E.uTime,this.time),s.uniform2f(E.uTilt,r.tiltX,r.tiltY),s.uniform1f(E.uHeroMode,this.heroMode),s.uniform1f(E.uHeroAsp,this.heroAsp),s.uniform1f(E.uHeroAlpha,+!!T.test(l.heroMedia??"")),s.uniform1f(E.uHeroScene,!this.heroFailed&&k.test(l.heroMedia??"")?1:0),s.uniform2f(E.uFocus,l.heroFocus?.[0]??l.heroFace.x,l.heroFocus?.[1]??.5),s.uniform2f(E.uSpan,l.heroSpan?.[0]??0,l.heroSpan?.[1]??1),s.uniform2f(E.uKey,l.heroKey[0],l.heroKey[1]),s.uniform4f(E.uFace,l.heroFace.x,l.heroFace.y,l.heroFace.rx,l.heroFace.ry),s.uniform1f(E.uGlitch,this.glitch),s.drawArrays(s.TRIANGLES,0,3)}s.bindFramebuffer(s.FRAMEBUFFER,this.scene.fbo),s.viewport(0,0,this.scene.w,this.scene.h),s.useProgram(this.sceneProg.prog),E=this.sceneProg.u,w(0,s.TEXTURE_2D,this.hero.tex,E.uHeroLayer),w(1,s.TEXTURE_2D_ARRAY,this.texCards,E.uCards),w(2,s.TEXTURE_2D,this.texAbout,E.uSceneA),w(3,s.TEXTURE_2D,this.texContact,E.uContactTex),s.uniform2f(E.uRes,this.scene.w,this.scene.h),s.uniform1f(E.uAspect,i),s.uniform1f(E.uTime,this.time),s.uniform1f(E.uR,e.r),s.uniform1f(E.uZoomA,e.zoomA),s.uniform1f(E.uZoomB,e.zoomB),s.uniform1f(E.uAbout,e.about),s.uniform1f(E.uAboutOn,+(e.zoomB>=1)),s.uniform1f(E.uChange,e.change),s.uniform1f(E.uAboutText,e.aboutText),s.uniform1f(E.uMotion,+!this.reduced),s.uniform1f(E.uCardCount,l.cards.length);let C=Math.min(.94346/i,.84),F=Math.max(C,Math.min(.533,1.15*C));s.uniform1f(E.uCardLod,Math.max(0,Math.log2(1280/(F*this.cols))-.25));let P=(e,t)=>Math.max(0,Math.log2(Math.min(e/this.cols,t/this.rows))-.5);s.uniform1f(E.uSceneLod,P(this.aboutTexW,this.aboutTexH)),s.uniform1f(E.uContactLod,P(this.contactTexW,this.contactTexH)),s.uniform2f(E.uTilt,r.tiltX,r.tiltY),s.uniform1f(E.uCardAsp,1.6),s.uniform1f(E.uSceneAAsp,this.aspAbout),s.uniform1f(E.uContactAsp,this.aspContact),s.uniform1f(E.uContactAnchor,l.contactAnchor),s.uniform1f(E.uTexel,this.texel),s.drawArrays(s.TRIANGLES,0,3),s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,this.canvas.width,this.canvas.height),s.useProgram(this.postProg.prog),E=this.postProg.u,w(0,s.TEXTURE_2D,this.scene.tex,E.uScene),w(1,s.TEXTURE_2D,A.tex,E.uFlow),s.uniform2f(E.uGrid,this.cols,this.rows),s.uniform2f(E.uPx,this.canvas.width,this.canvas.height),s.uniform2f(E.uCss,this.cssW,this.cssH),s.uniform1f(E.uDot,4/this.texel),s.uniform1f(E.uTime,this.time),s.uniform1f(E.uTear,this.tear),s.uniform1f(E.uMotion,+!this.reduced),s.uniform2f(E.uMouse,n,h),s.uniform1f(E.uMouseE,r.e),s.uniform1f(E.uVig,d((e.zoomB-.09)/.91)),s.uniform1f(E.uWakeOn,+!!b),s.uniform1f(E.uWakeStrength,m),s.uniform1f(E.uWakeR,.04*this.cssH);let L=this.band;s.uniform3f(E.uRoll,L.y,L.a,L.kind),s.uniform1f(E.uRollH,L.kind?40:18),s.drawArrays(s.TRIANGLES,0,3)}}let C="#%&*+=<>/?!01";function F(e){let t=e.dataset.text??e.textContent??"";e.dataset.text=t;let o=performance.now(),a=s=>{let i=Math.min(1,(s-o)/700),r="";for(let e=0;e<t.length;e++){let o=t[e];r+=" "===o||e/t.length<i?o:C[Math.floor(Math.random()*C.length)]}e.textContent=r,i<1&&requestAnimationFrame(a)};requestAnimationFrame(a)}let P=()=>document.getElementById("work")?.offsetTop||window.innerHeight;e.s(["default",0,function(e){let{cards:s}=e,i=s.length,r=+!!e.about.lead+e.about.body.length,l=m(i,r),n=(0,o.useRef)(null),h=(0,o.useRef)(null),c=(0,o.useRef)(null),u=(0,o.useRef)(null),d=(0,o.useRef)(null),p=(0,o.useRef)(null),[v,x]=(0,o.useState)(0),[g,b]=(0,o.useState)(!1),[w,y]=(0,o.useState)(!1);(0,o.useEffect)(()=>{let t=n.current;if(!t)return;let o=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=getComputedStyle(document.documentElement),m=a.getPropertyValue("--font-doto").trim()||"monospace",v=a.getPropertyValue("--font-geist-mono").trim()||"monospace",g=-1,w=new WeakMap,A=(e,t,a=0)=>{if(!e)return;e.style.opacity=t.toFixed(3),e.style.transform=a?`translate3d(0, ${a.toFixed(1)}px, 0)`:"";let s=t>.5;s!==(w.get(e)??!1)&&(w.set(e,s),e.dataset.on=s?"1":"0",s&&!o&&e.querySelectorAll("[data-scramble]").forEach(F))},T=d.current?.querySelector(".home-text-block")??null,k=0,E=()=>{k=T?.offsetHeight??0};E();let R=T&&"u">typeof ResizeObserver?new ResizeObserver(E):null;T&&R?.observe(T);let M=({s:e,tl:t})=>{let o=window.innerHeight;A(h.current,1-f(.05,.35,e),-e*o*.25);let a=f(.35,.6,e)*(1-f(i+.55,i+.8,e));A(c.current,a);let s=Math.min(i,Math.max(1,Math.round(t.r)))-1;if(s!==g&&(g=s,x(s)),u.current){let e=a>.5&&.2>Math.abs(t.r-(s+1));u.current.dataset.on=e?"1":"0"}let r=Math.max(.5,(o+k)/(Math.max(.1,l.aboutTextOut-l.text1In)*o));A(d.current,(e>l.text1In-.02&&e<l.contactFull)*t.aboutText,(l.text1In-e)*o*r),A(p.current,f(l.contactTextIn,l.contactTextFull,e))},C={heroMedia:e.media.hero,heroKey:e.media.heroKey,heroFace:e.media.heroFace,heroFocus:e.media.heroFocus,heroSpan:e.media.heroSpan,cards:s.map(e=>e.art),aboutParagraphs:r,about:e.media.about,contact:e.media.contact,contactAnchor:e.media.contactAnchor,dotFont:m,monoFont:v,scrollUnit:P},L=null,_=!1,U=e=>{e&&console.warn(`Home stage disabled: ${e instanceof Error?e.message:String(e)}`),_=!0,queueMicrotask(()=>{b(!0),y(!0)})},D=()=>{try{L=new S(t,C,M,()=>y(!0))}catch(e){L=null,U(e)}};D();let N=0,I=()=>{window.clearTimeout(N),N=window.setTimeout(()=>{L?.destroy(),L=null,U("the WebGL context did not come back")},4e3)},H=()=>{window.clearTimeout(N),_||(L?.destroy(),D())};return t.addEventListener("webglcontextlost",I),t.addEventListener("webglcontextrestored",H),()=>{window.clearTimeout(N),R?.disconnect(),t.removeEventListener("webglcontextlost",I),t.removeEventListener("webglcontextrestored",H),L?.destroy()}},[i,r]),(0,o.useEffect)(()=>{if(!g)return;let e="";try{e=decodeURIComponent(window.location.hash.slice(1))}catch{}e&&document.getElementById(e)?.scrollIntoView()},[g]);let A=e=>()=>{if(g)return;let t=P(),o=e*t;Math.abs(window.scrollY-o)>.4*t&&window.scrollTo({top:o})},T=s[v]??s[0];return(0,t.jsxs)("div",{className:`home ${g?"home--static":""}`,"data-ready":w?"1":"0",style:g?void 0:{height:`${(l.total+1)*100}vh`},children:[!g&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{id:"work",className:"home-anchor",style:{top:"100vh"}}),(0,t.jsx)("span",{id:"experience",className:"home-anchor",style:{top:"100vh"}}),s.map((e,o)=>(0,t.jsx)("span",{id:`work-${e.slug}`,className:"home-anchor",style:{top:`${(o+1)*100}vh`}},e.slug)),(0,t.jsx)("span",{id:"about",className:"home-anchor",style:{top:`${(l.aboutStart+.6+.4*Math.min(r,1))*100}vh`}}),(0,t.jsx)("span",{id:"contact",className:"home-anchor",style:{top:`${100*l.total}vh`}})]}),(0,t.jsxs)("div",{className:"home-stage",children:[(0,t.jsx)("canvas",{ref:n,"aria-hidden":"true"}),(0,t.jsx)("p",{className:"home-loading font-dot","aria-hidden":"true",children:"Loading"}),(0,t.jsxs)("header",{className:"home-header",children:[(0,t.jsx)(a.default,{href:"/",className:"font-dot text-base font-black uppercase tracking-wider md:text-lg",children:e.name}),(0,t.jsxs)("nav",{className:"flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em] md:gap-8",children:[(0,t.jsx)("a",{href:"#work",children:"Work"}),(0,t.jsx)("a",{href:"#about",children:"About"}),(0,t.jsx)("a",{href:"#contact",children:"Contact"})]})]}),(0,t.jsxs)("main",{children:[(0,t.jsxs)("div",{ref:h,className:"home-layer home-hero","data-on":"1","data-side":e.heroSide,style:{opacity:1},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"font-dot glow text-4xl font-black uppercase leading-none md:text-[2rem]",children:e.name}),(0,t.jsx)("p",{className:"mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85",children:`// ${e.eyebrow}`})]}),e.tagline&&(0,t.jsx)("p",{className:"font-dot glow max-w-[19rem] text-base font-bold uppercase leading-tight md:text-justify md:text-[15px] md:leading-[1.3]",children:e.tagline})]}),(0,t.jsxs)("section",{ref:c,id:g?"work":void 0,className:"home-layer home-work","data-on":"0","aria-label":e.workHeading,children:[(0,t.jsxs)("div",{className:"home-work-list",id:g?"experience":void 0,children:[(0,t.jsx)("h2",{className:"font-dot text-3xl font-black uppercase leading-none md:text-[1.6rem] 2xl:text-[2rem]","data-scramble":!0,children:e.workHeading}),(0,t.jsx)("ol",{className:"mt-3 space-y-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",children:s.map((e,o)=>(0,t.jsx)("li",{id:g?`work-${e.slug}`:void 0,"data-active":o===v?"1":"0",children:(0,t.jsxs)(a.default,{href:`/experience/${e.slug}/`,onFocus:A(o+1),children:[(0,t.jsx)("span",{"aria-hidden":"true",children:o===v?"● ":"  "}),"[",String(o+1).padStart(2,"0"),"] ",e.name]})},e.slug))}),(0,t.jsx)("div",{className:"sr-only","aria-live":"polite",children:T.lines.map(e=>(0,t.jsx)("p",{children:e},e))})]}),(0,t.jsx)(a.default,{ref:u,href:`/experience/${T.slug}/`,className:"home-open","data-on":"0",tabIndex:-1,children:(0,t.jsxs)("span",{className:"sr-only",children:["Open ",T.name]})})]}),(0,t.jsx)("section",{ref:d,id:g?"about":void 0,className:"home-layer home-text","data-on":"0","aria-labelledby":"about-h",children:(0,t.jsxs)("div",{className:"home-text-block",children:[(0,t.jsx)("h2",{id:"about-h",className:"font-dot glow text-4xl font-black uppercase leading-none md:text-[2.7rem]","data-scramble":!0,children:e.about.label}),(e.about.lead||e.about.body.length>0)&&(0,t.jsxs)("div",{className:"home-about-panel",children:[e.about.lead&&(0,t.jsx)("p",{className:"font-mono text-base font-bold uppercase leading-snug tracking-[0.06em] md:text-xl",children:e.about.lead}),e.about.body.map((o,a)=>(0,t.jsx)("p",{className:`${a>0||e.about.lead?"mt-3 ":""}font-mono text-sm uppercase leading-snug tracking-[0.06em] opacity-85 md:text-lg`,children:o},o))]})]})}),(0,t.jsxs)("section",{ref:p,id:g?"contact":void 0,className:"home-layer home-contact","data-on":"0","aria-labelledby":"contact-h",children:[(0,t.jsx)("h2",{id:"contact-h",className:"font-dot glow max-w-3xl text-4xl font-black uppercase leading-[1.25] md:text-[2.7rem]","data-scramble":!0,children:e.contact.headline}),(0,t.jsx)("p",{className:"mt-4 font-mono text-sm uppercase tracking-[0.2em] opacity-85 md:text-base",children:e.contact.sub}),(0,t.jsxs)("ul",{className:"mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-sm uppercase tracking-[0.15em] md:mt-[14vh]",children:[(0,t.jsx)("li",{children:(0,t.jsxs)("a",{href:`mailto:${e.contact.email}`,onFocus:A(l.total),children:["> ",e.contact.email]})}),e.contact.links.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)("a",{href:e.href,target:"_blank",rel:"noopener noreferrer",onFocus:A(l.total),children:["> ",e.label]})},e.href))]}),(0,t.jsxs)("p",{className:"home-foot font-mono text-[10px] uppercase tracking-[0.2em] opacity-60",children:["© ",e.year," ",e.name]})]})]})]})]})}],56072)}]);