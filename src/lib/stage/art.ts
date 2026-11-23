// Canvas drawn textures for the stage: the reel cards, and stand-in pictures
// for any slot in content.ts that has no image yet.

export type CardArt = {
  index: string; // "01"
  /** the big name */
  name: string;
  /** line under the name, e.g. "Manufacturing Engineering | Ride Dynamics" */
  title: string;
  /** smaller line under the title */
  period: string;
  /** optional photo behind everything */
  image: string | null;
  /** which part of the photo to keep when cropping, [x, y] from 0 to 1 */
  focus: [number, number];
  /** optional logo file drawn in place of the name */
  logo: string | null;
  /** false when the photo already carries the company's name */
  showName: boolean;
  tone: "dark" | "light" | "accent" | "blue";
};

export const CARD_W = 1280;
export const CARD_H = 800;

const TONES: Record<CardArt["tone"], { bg: string; fg: string; sub: string }> = {
  dark: { bg: "#0b0c0f", fg: "#f2f1ec", sub: "#9aa0a8" },
  light: { bg: "#c9ccd1", fg: "#0b0c0f", sub: "#4a4e55" },
  accent: { bg: "#ff4b1f", fg: "#0b0c0f", sub: "#3a1206" },
  blue: { bg: "#1746ff", fg: "#f2f1ec", sub: "#c3ceff" },
};

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  focus: [number, number] = [0.5, 0.5],
) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) * focus[0], (h - dh) * focus[1], dw, dh);
}

// Average brightness of a canvas, 0 to 1, from a tiny copy of it.
function meanLuma(src: HTMLCanvasElement) {
  const cv = document.createElement("canvas");
  cv.width = 32;
  cv.height = 20;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, 32, 20);
  const d = ctx.getImageData(0, 0, 32, 20).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  return sum / (d.length / 4) / 255;
}

function blank() {
  const cv = document.createElement("canvas");
  cv.width = CARD_W;
  cv.height = CARD_H;
  return { cv, ctx: cv.getContext("2d")! };
}

// Split a name over two lines of similar length when it is long.
function splitName(name: string): string[] {
  const words = name.toUpperCase().split(" ");
  if (words.length < 2 || name.length <= 11) return [name.toUpperCase()];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

// Where the big mark sits on the card. The shader animates this area only.
export const MARK_BOX = { x: 64, y: 150, w: CARD_W - 128, h: 400 };

/**
 * One reel card as two layers. `base` is everything that holds still: tone,
 * drafting marks, index, title and period. `mark` is the big name (or a logo
 * file) on a transparent background, which the shader assembles and lights.
 */
export function drawCard(
  card: CardArt,
  photo: HTMLImageElement | null,
  logo: HTMLImageElement | null,
  dotFont: string,
  monoFont: string,
) {
  const tone = photo ? TONES.dark : TONES[card.tone];
  const base = blank();
  const mark = blank();
  let ctx = base.ctx;

  ctx.fillStyle = tone.bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  if (photo) {
    drawCover(ctx, photo, CARD_W, CARD_H, card.focus);
    // Photos differ a lot in brightness. Measure this one and dim it just
    // enough that white type reads on it, so dark photos are not turned to mud.
    const keep = Math.min(0.92, Math.max(0.34, 0.36 / Math.max(meanLuma(base.cv), 0.01)));
    ctx.fillStyle = `rgba(5, 6, 9, ${(1 - keep).toFixed(3)})`;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    if (card.showName) {
      // a soft shade behind the name
      const r = ctx.createRadialGradient(CARD_W * 0.45, MARK_BOX.y + MARK_BOX.h / 2, 40, CARD_W * 0.45, MARK_BOX.y + MARK_BOX.h / 2, CARD_W * 0.62);
      r.addColorStop(0, "rgba(4, 5, 8, 0.5)");
      r.addColorStop(1, "rgba(4, 5, 8, 0)");
      ctx.fillStyle = r;
      ctx.fillRect(0, 0, CARD_W, CARD_H);
    }
    // and a darker floor under the title
    const g = ctx.createLinearGradient(0, CARD_H * 0.55, 0, CARD_H);
    g.addColorStop(0, "rgba(4, 5, 8, 0)");
    g.addColorStop(1, "rgba(4, 5, 8, 0.85)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }

  // drafting marks
  ctx.strokeStyle = tone.fg;
  ctx.lineWidth = 2;
  ctx.globalAlpha = photo ? 0.08 : 0.11;
  for (let x = 80; x < CARD_W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CARD_H);
    ctx.stroke();
  }
  for (let y = 80; y < CARD_H; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CARD_W, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 3;
  const cx = CARD_W - 150;
  ctx.beginPath();
  ctx.arc(cx, 96, 46, 0, Math.PI * 2);
  ctx.moveTo(cx - 70, 96);
  ctx.lineTo(cx + 70, 96);
  ctx.moveTo(cx, 26);
  ctx.lineTo(cx, 166);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = tone.fg;
  ctx.font = `700 40px ${monoFont}`;
  ctx.fillText(card.index, 64, 100);

  // title block along the bottom
  ctx.globalAlpha = 0.5;
  ctx.fillRect(64, CARD_H - 190, CARD_W - 128, 2);
  ctx.globalAlpha = 1;
  let size = 38;
  do {
    ctx.font = `600 ${size}px ${monoFont}`;
    if (ctx.measureText(card.title.toUpperCase()).width <= CARD_W - 128) break;
    size -= 2;
  } while (size > 22);
  ctx.fillText(card.title.toUpperCase(), 64, CARD_H - 122);
  ctx.fillStyle = tone.sub;
  ctx.font = `500 27px ${monoFont}`;
  ctx.fillText(card.period.toUpperCase(), 64, CARD_H - 70);
  ctx.textAlign = "right";
  ctx.fillText("OPEN  \u2197", CARD_W - 64, CARD_H - 70);
  ctx.textAlign = "left";

  // the mark
  ctx = mark.ctx;
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  if (!card.showName) {
    // the photo already carries the name
  } else if (logo) {
    const s = Math.min(MARK_BOX.w / logo.naturalWidth, (MARK_BOX.h * 0.8) / logo.naturalHeight);
    const w = logo.naturalWidth * s;
    const h = logo.naturalHeight * s;
    ctx.drawImage(logo, MARK_BOX.x, MARK_BOX.y + (MARK_BOX.h - h) / 2, w, h);
  } else {
    const lines = splitName(card.name);
    const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));
    let px = lines.length > 1 ? 196 : 250;
    do {
      ctx.font = `900 ${px}px ${dotFont}`;
      if (ctx.measureText(longest).width <= MARK_BOX.w) break;
      px -= 4;
    } while (px > 60);
    ctx.fillStyle = tone.fg;
    ctx.textBaseline = "alphabetic";
    const lineH = px * 0.92;
    const blockH = lineH * lines.length;
    const top = MARK_BOX.y + (MARK_BOX.h - blockH) / 2;
    lines.forEach((line, k) => ctx.fillText(line, MARK_BOX.x - px * 0.04, top + lineH * (k + 1) - px * 0.14));
  }
  return { base: base.cv, mark: mark.cv };
}

// deterministic pseudo random, so the placeholder looks the same every load
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Stand-in for the contact picture: a lit street at night, drawn from lines
// and glows. Replace it by setting scenes.contact in content.ts.
export function drawNightStreet(w = 1600, h = 900) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  const rand = rng(7);
  const vx = w * 0.5;
  const vy = h * 0.46;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#120303");
  sky.addColorStop(0.5, "#2a0705");
  sky.addColorStop(1, "#090202");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // walls: panels receding to the vanishing point on both sides
  for (const side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      const t0 = i / 9;
      const t1 = (i + 1) / 9;
      const x0 = vx + side * (w * 0.62) * (1 - t0) ** 1.6;
      const x1 = vx + side * (w * 0.62) * (1 - t1) ** 1.6;
      const top0 = vy - (vy + 40) * (1 - t0) ** 1.6;
      const top1 = vy - (vy + 40) * (1 - t1) ** 1.6;
      const bot0 = vy + (h - vy + 40) * (1 - t0) ** 1.6;
      const bot1 = vy + (h - vy + 40) * (1 - t1) ** 1.6;
      const lum = 30 + rand() * 120;
      ctx.fillStyle = `rgb(${Math.round(lum + 60)}, ${Math.round(lum * 0.22)}, ${Math.round(lum * 0.12)})`;
      ctx.beginPath();
      ctx.moveTo(x0, top0);
      ctx.lineTo(x1, top1);
      ctx.lineTo(x1, bot1);
      ctx.lineTo(x0, bot0);
      ctx.closePath();
      ctx.fill();
      // signs and shutters on each panel
      const rows = 3 + Math.floor(rand() * 4);
      for (let r = 0; r < rows; r++) {
        const a = rand();
        const b = a + 0.08 + rand() * 0.14;
        const yA0 = top0 + (bot0 - top0) * a;
        const yA1 = top1 + (bot1 - top1) * a;
        const yB0 = top0 + (bot0 - top0) * b;
        const yB1 = top1 + (bot1 - top1) * b;
        const hot = rand() > 0.55;
        ctx.fillStyle = hot
          ? `rgba(255, ${Math.round(90 + rand() * 120)}, ${Math.round(20 + rand() * 40)}, ${0.5 + rand() * 0.5})`
          : `rgba(20, 4, 3, ${0.4 + rand() * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(x0, yA0);
        ctx.lineTo(x1, yA1);
        ctx.lineTo(x1, yB1);
        ctx.lineTo(x0, yB0);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // wet ground streaks
  for (let i = 0; i < 70; i++) {
    const t = rand();
    const y = vy + (h - vy) * t ** 0.7;
    const half = (w * 0.5 * (y - vy)) / (h - vy);
    ctx.fillStyle = `rgba(255, ${Math.round(60 + rand() * 90)}, 30, ${0.05 + rand() * 0.12})`;
    ctx.fillRect(vx - half * rand(), y, half * (0.3 + rand()), 2 + rand() * 3);
  }

  // lanterns strung toward the vanishing point
  ctx.globalCompositeOperation = "lighter";
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) {
      const t = (i + rand() * 0.4) / 8;
      const k = (1 - t) ** 1.7;
      const x = vx + side * w * 0.44 * k;
      const y = vy - h * 0.34 * k + rand() * 12;
      const r = 10 + 62 * k;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6);
      g.addColorStop(0, "rgba(255, 228, 170, 0.95)");
      g.addColorStop(0.22, "rgba(255, 96, 34, 0.85)");
      g.addColorStop(1, "rgba(255, 30, 0, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const far = ctx.createRadialGradient(vx, vy, 0, vx, vy, h * 0.3);
  far.addColorStop(0, "rgba(255, 190, 120, 0.5)");
  far.addColorStop(1, "rgba(255, 60, 20, 0)");
  ctx.fillStyle = far;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  // darken the middle so the headline reads
  const mid = ctx.createRadialGradient(vx, h * 0.5, 0, vx, h * 0.5, w * 0.34);
  mid.addColorStop(0, "rgba(0,0,0,0.55)");
  mid.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = mid;
  ctx.fillRect(0, 0, w, h);
  return cv;
}

// Stand-in for an about scene with no picture set: a plain corridor of lines.
export function drawCorridor(hue: number, w = 1600, h = 900) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = `hsl(${hue} 30% 6%)`;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = `hsl(${hue} 40% 62%)`;
  ctx.lineWidth = 3;
  const vx = w / 2;
  const vy = h * 0.45;
  for (let i = 0; i < 14; i++) {
    const k = (1 - i / 14) ** 2;
    ctx.globalAlpha = 0.15 + 0.6 * k;
    ctx.strokeRect(vx - w * 0.6 * k, vy - h * 0.6 * k, w * 1.2 * k, h * 1.2 * k);
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + Math.cos(a) * w, vy + Math.sin(a) * w);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return cv;
}
