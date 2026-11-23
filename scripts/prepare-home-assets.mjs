// Turns the original photos in assets-src/ into the files the home page loads.
//
//   node scripts/prepare-home-assets.mjs            (everything but hero-cutout)
//   node scripts/prepare-home-assets.mjs contact    (only the steps named: hero, about, cards, contact, hero-cutout)
//
// Hero:    assets-src/hero-scene.webp (or .jpg, .png) -> public/images/home/hero.jpg
//          A whole photo, background and all, drawn as dots across the screen.
//          It is widened by 10% on each side with a blurred continuation of
//          its own edges (HERO_SIDE_FILL, extendScene), so a laptop shows a
//          little more of it; the script prints how to convert hero.face.
//          The current one is the photo on a patio at night (the original is
//          also kept as assets-src/hero-night-original.webp). The Rock of
//          Cashel one used before is assets-src/hero-scene-cashel.jpg (edited:
//          green grass, a blue sky with a few clouds; untouched original
//          assets-src/hero-cashel-original.jpg).
// Cutout:  assets-src/hero-original.png  ->  public/images/home/hero.webp
//          (the hero-cutout step, only when named) The flat backdrop is removed
//          (anything the same colour as the image border, connected to the
//          border) so the page draws its own grid behind you. Shoot against one
//          plain colour that you are not wearing. Point hero.figure at hero.webp.
// Contact: assets-src/contact-lavender-sky.webp -> public/images/home/contact.jpg
//          The whole frame, never enlarged.
// About:   assets-src/about-team.jpg      ->  public/images/home/about-team.jpg
//          (the team at the racetrack, in front of the stands)
// Cards:   assets-src/card-<slug>.*       ->  public/images/home/card-<slug>.jpg
//          (card-fsae is the team with the Canadian flag and car 101)
//          Small pictures are upscaled here with a proper filter, which looks
//          better than letting the browser stretch them.
//
// The originals stay out of /public on purpose, so they are never deployed.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => path.join(root, "assets-src", f);
const out = (f) => path.join(root, "public/images/home", f);
fs.mkdirSync(out(""), { recursive: true });

// ------------------------------------------------------------------ hero --

async function hero(file) {
  const { data, info } = await sharp(src(file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

  // backdrop colour = median of the top edge and the upper halves of the side edges
  const samples = [];
  for (let x = 0; x < w; x += 4) samples.push(px(x + 2 * w));
  for (let y = 0; y < h / 2; y += 4) samples.push(px(y * w + 2), px(y * w + w - 3));
  const med = (k) => samples.map((s) => s[k]).sort((a, b) => a - b)[samples.length >> 1];
  const bg = [med(0), med(1), med(2)];

  const dist = (i) => Math.hypot(data[i * 3] - bg[0], data[i * 3 + 1] - bg[1], data[i * 3 + 2] - bg[2]);
  const TOL = 34;

  // flood fill from the border, so backdrop-coloured pixels inside the figure survive
  const isBg = new Uint8Array(w * h);
  const stack = [];
  const push = (i) => {
    if (!isBg[i] && dist(i) < TOL) {
      isBg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) push(x);
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }

  // soften and pull the edge in by about a pixel to drop the coloured fringe
  const hard = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) hard[i] = isBg[i] ? 0 : 255;
  const soft = await sharp(hard, { raw: { width: w, height: h, channels: 1 } })
    .blur(1.6)
    .extractChannel(0)
    .raw()
    .toBuffer();
  if (soft.length !== w * h) throw new Error(`mask came back as ${soft.length} bytes, expected ${w * h}`);

  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const a = Math.min(1, Math.max(0, (soft[i] / 255 - 0.55) / 0.4));
    // remove backdrop colour mixed into edge pixels
    const k = a > 0.02 ? (1 - a) / Math.max(a, 0.25) : 0;
    for (let c = 0; c < 3; c++) {
      const v = data[i * 3 + c];
      rgba[i * 4 + c] = Math.min(255, Math.max(0, v + (v - bg[c]) * k * 0.6));
    }
    rgba[i * 4 + 3] = Math.round(a * 255);
  }

  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .resize({ height: 1280 })
    .webp({ quality: 88, alphaQuality: 92 })
    .toFile(out("hero.webp"));
  console.log(`hero.webp  backdrop rgb(${bg.join(", ")})  from ${w}x${h}`);
}

// The size a photo is shown at: rotate() turns phone photos the right way up
// before they are resized, so widths have to be read after that turn too.
async function shownSize(file) {
  const meta = await sharp(src(file)).metadata();
  return meta.autoOrient ?? { width: meta.width, height: meta.height };
}

// How much the hero photo is widened on each side, as a share of the widened
// image: 0.1 adds 10% on the left and 10% on the right, so on a laptop the
// photo fills the middle 80% of the screen and shows more of its height (an
// upright photo is otherwise cropped to a band). The added sides are a blurred
// continuation of the photo's own edges (see extendScene). Only photos
// narrower than 2:1 are widened, and never past 2:1. Set it to 0 to keep the
// photo exactly as it is.
const HERO_SIDE_FILL = 0.1;

// Extends a photo (raw RGB, pw x ph) to `aspect` by continuing it past its left
// and right edges. Only a thin strip along each edge is used, reflected back
// and forth outward, so nothing in the photo (a person, a sign) is copied into
// the new part. It is blurred more the farther out (sharp at the edge, so there
// is no seam) and keeps the colours of that edge, not darkened, so it reads as
// the same scene out of focus. No new content is made up: every colour comes
// from the photo's own edges. The photo itself is untouched and sits in the
// middle. Returns the new raw image and where the photo is in it.
async function extendScene(photo, pw, ph, aspect) {
  const W = Math.round(ph * aspect);
  if (W <= pw) return { data: photo, width: pw, x0: 0 };
  const x0 = Math.round((W - pw) / 2);
  const reach = Math.max(x0, W - pw - x0);
  // the strip along each edge that is continued: 4% of the photo's width
  const S = Math.max(4, Math.round(pw * 0.04));
  const bounce = (t) => {
    const m = t % (2 * S);
    return m < S ? m : 2 * S - 1 - m;
  };
  const M = Buffer.alloc(W * ph * 3);
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < W; x++) {
      let u = x - x0;
      if (u < 0) u = bounce(-u - 1);
      else if (u >= pw) u = pw - 1 - bounce(u - pw);
      photo.copy(M, (y * W + x) * 3, (y * pw + u) * 3, (y * pw + u) * 3 + 3);
    }
  }
  // blurred copies, from a little to a lot (sizes in px for a 1200 px tall
  // image; at least 240 px, so the smallest stays above sharp's 0.3 minimum)
  const s = Math.max(ph, 240) / 1200;
  const SIG = [1.5, 4, 9, 18, 32, 52].map((v) => v * s);
  const levels = await Promise.all(SIG.map((sig) => sharp(M, { raw: { width: W, height: ph, channels: 3 } }).blur(sig).raw().toBuffer()));
  const lnSig = SIG.map(Math.log);
  // the blur grows from almost none at the photo's edge to a third of the
  // added width at the outside, so a narrow strip is as soft at its edge as a
  // wide one
  const sigOut = Math.min(SIG[SIG.length - 1], Math.max(SIG[1], reach / 3));
  const outBuf = Buffer.from(M);
  for (let x = 0; x < W; x++) {
    const d = x < x0 ? x0 - x : x >= x0 + pw ? x - (x0 + pw) + 1 : 0;
    if (!d) continue;
    const t = d / reach;
    const sig = SIG[0] + (sigOut - SIG[0]) * Math.pow(t, 0.8);
    let i = 0;
    while (i < SIG.length - 2 && sig > SIG[i + 1]) i++;
    const w = Math.min(1, Math.max(0, (Math.log(sig) - lnSig[i]) / (lnSig[i + 1] - lnSig[i])));
    for (let y = 0; y < ph; y++) {
      const k = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) outBuf[k + c] = Math.round(levels[i][k + c] * (1 - w) + levels[i + 1][k + c] * w);
    }
  }
  return { data: outBuf, width: W, x0 };
}

// A whole photo for the hero, no metadata, at most 1600 on its longer side (the
// hero is drawn as dots, so more would never show) once widened. The source
// can be a .jpg, .png or .webp. See HERO_SIDE_FILL for the widening.
async function heroScene(name) {
  const file = [".jpg", ".jpeg", ".png", ".webp"].map((ext) => name + ext).find((f) => fs.existsSync(src(f)));
  if (!file) throw new Error(`no assets-src/${name}.jpg, .png or .webp`);
  const { width, height } = await shownSize(file);
  const aspect = Math.min(2, width / height / (1 - 2 * HERO_SIDE_FILL));
  if (aspect <= width / height) {
    const k = Math.min(1, 1600 / Math.max(width, height));
    const w = Math.round(width * k);
    await sharp(src(file)).rotate().resize({ width: w, kernel: "lanczos3" }).jpeg({ quality: 86, mozjpeg: true }).toFile(out("hero.jpg"));
    console.log(`hero.jpg  ${file} ${width}x${height} -> ${w}x${Math.round(height * k)}`);
    return;
  }
  const ph = Math.min(height, Math.round(1600 / Math.max(1, aspect)));
  const { data, info } = await sharp(src(file)).rotate().resize({ height: ph, kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const ext = await extendScene(data, info.width, info.height, aspect);
  await sharp(ext.data, { raw: { width: ext.width, height: info.height, channels: 3 } }).jpeg({ quality: 86, mozjpeg: true }).toFile(out("hero.jpg"));
  const a = ext.x0 / ext.width;
  const b = info.width / ext.width;
  console.log(`hero.jpg  ${file} ${width}x${height} -> ${info.width}x${info.height}, extended to ${ext.width}x${info.height}`);
  console.log(`  the photo spans x ${a.toFixed(4)} to ${(a + b).toFixed(4)} of hero.jpg: set hero.span to [${a.toFixed(4)}, ${(a + b).toFixed(4)}].`);
  console.log(`  For hero.face measured on the photo:`);
  console.log(`  x' = ${a.toFixed(4)} + ${b.toFixed(4)} * x,  rx' = ${b.toFixed(4)} * rx  (y and ry stay the same)`);
}

// --------------------------------------------------------------- contact --

// Rows `top` to `bottom` (fractions of the height) of the photo, at most 2400 wide.
async function contact(file, top = 0, bottom = 1) {
  const img = sharp(src(file)).rotate();
  const meta = await sharp(await img.clone().toBuffer()).metadata();
  const y0 = Math.round(meta.height * top);
  const y1 = Math.round(meta.height * bottom);
  const w = Math.min(2400, meta.width);
  await img
    .extract({ left: 0, top: y0, width: meta.width, height: y1 - y0 })
    .resize({ width: w, kernel: "lanczos3" })
    .modulate({ brightness: 0.96, saturation: 1.06 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out("contact.jpg"));
  console.log(`contact.jpg  rows ${y0} to ${y1} of ${meta.height}, ${w} wide`);
}

// A photo for the about scene or a reel card: at least `minW` wide, sharpened a
// little when it had to be enlarged, no metadata.
async function photo(file, out_, minW, maxW) {
  const { width, height } = await shownSize(file);
  const w = Math.min(maxW, Math.max(minW, width));
  let img = sharp(src(file)).rotate().resize({ width: w, kernel: "lanczos3" });
  if (w > width * 1.15) img = img.sharpen({ sigma: 0.8 });
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(out(out_));
  console.log(`${out_}  ${width}x${height} -> ${w} wide`);
}

const steps = {
  hero: () => heroScene("hero-scene"),
  "hero-cutout": () => hero("hero-original.png"),
  about: () => photo("about-team.jpg", "about-team.jpg", 1600, 2000),
  cards: async () => {
    await photo("card-fsae.webp", "card-fsae.jpg", 1280, 1600);
    await photo("card-multimatic.webp", "card-multimatic.jpg", 1280, 1600);
    await photo("card-general-dynamics.png", "card-general-dynamics.jpg", 1280, 1600);
    await photo("card-nokia.png", "card-nokia.jpg", 1280, 1600);
  },
  // a lavender field under a blue sky: the whole frame
  contact: () => contact("contact-lavender-sky.webp"),
};
const only = process.argv.slice(2);
const unknown = only.filter((name) => !(name in steps));
if (unknown.length) throw new Error(`unknown step: ${unknown.join(", ")} (use ${Object.keys(steps).join(", ")})`);
// the cutout only runs when it is asked for by name
const optional = new Set(["hero-cutout"]);
for (const [name, run] of Object.entries(steps)) if (only.length ? only.includes(name) : !optional.has(name)) await run();
