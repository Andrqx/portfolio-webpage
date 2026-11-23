// Scroll timeline for the home page. One unit of `s` is one viewport height of
// scroll. The canvas and the DOM overlay both read from this, so they can never
// drift apart. The reel's proportions were measured from the reference captures
// (docs/reference/notes.md). The about and contact sections are much shorter
// than the reference's on purpose: the owner asked for less scrolling there.

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// The hero and about cards rest about 8% larger than the project cards.
export const Z_REST = 0.09;
// From the about photo filling the screen to the contact text being in takes
// about 2.2 screens of scroll, of which the fizzle takes about 0.6.
const ABOUT_HOLD = 0.5; // screens the about photo holds before it starts to change
// More for each about paragraph, so there is time to read it. The text rises
// at half the scroll speed when it fits (about 0.4 of a screen of text per
// paragraph); HomeStage makes a longer block rise faster, so it has always
// left the top before the contact text comes in.
const ABOUT_PER_PARAGRAPH = 0.8;
const CHANGE_LEAD = 0.5; // screens from the start of the change to contactStart
const CONTACT_GROW = 1.5; // screens from contactStart until the contact photo has filled in (contactFull)
const CONTACT_HOLD = 1.5; // then holds
// The contact photo has fizzled in by this point of the change (SCENE about()
// forces the last few tiles through just before it), and the contact text
// starts to fade in there. The about text fades out over the screens before.
export const FIZZLE_DONE = 0.68;
const CONTACT_TEXT_FADE = 0.35; // screens the contact text takes to fade in
const ABOUT_TEXT_FADE = 0.2; // screens the about text takes to fade out, just before

export type Timeline = {
  /** reel position: 0 = hero card centred, 1..n = project cards, n+1 = about */
  r: number;
  /** 1 = hero card fills the screen */
  zoomA: number;
  /** 1 = about card fills the screen */
  zoomB: number;
  /** 0..1, how much of the screen one full-bleed picture fills (drives the edge vignette) */
  bleed: number;
  /** 0..1 through the about section, for its slow zoom */
  about: number;
  /** 0..1, the contact photo fizzling in over the about photo (complete at FIZZLE_DONE) */
  change: number;
  /** 1 while the about text is up, falling to 0 as it fades out just before the contact text */
  aboutText: number;
};

/** `aboutParagraphs`: how many paragraphs the about text has under its heading. */
export function marks(cards: number, aboutParagraphs = 0) {
  const last = cards + 1;
  const aboutStart = last;
  const changeStart = aboutStart + ABOUT_HOLD + ABOUT_PER_PARAGRAPH * Math.max(aboutParagraphs, 0);
  const contactStart = changeStart + CHANGE_LEAD;
  const contactFull = contactStart + CONTACT_GROW;
  // the contact text comes in once the contact photo has fizzled in
  const contactTextIn = changeStart + FIZZLE_DONE * (contactFull - changeStart);
  const total = contactFull + CONTACT_HOLD;
  return {
    last,
    aboutStart,
    // the about text rises through the pinned picture from below the bottom edge
    text1In: aboutStart - 0.07,
    changeStart,
    contactStart,
    // the about text fades out from here, just before the contact text comes in
    aboutTextOut: contactTextIn - ABOUT_TEXT_FADE,
    contactTextIn,
    contactTextFull: contactTextIn + CONTACT_TEXT_FADE,
    contactFull,
    total,
  };
}

export function timeline(s: number, cards: number, aboutParagraphs = 0): Timeline {
  const m = marks(cards, aboutParagraphs);
  const a = 1 - smooth(0, 0.55, s);
  const b = 1 - smooth(0, 0.32, m.last - s);
  const zoomA = Z_REST + (1 - Z_REST) * a * a;
  const zoomB = s >= m.last ? 1 : Z_REST + (1 - Z_REST) * b * b;
  return {
    r: Math.min(Math.max(s, 0), m.last),
    zoomA,
    zoomB,
    bleed: clamp01((Math.max(zoomA, zoomB) - Z_REST) / (1 - Z_REST)),
    about: clamp01((s - m.aboutStart) / (m.contactFull - m.aboutStart)),
    change: clamp01((s - m.changeStart) / (m.contactFull - m.changeStart)),
    aboutText: 1 - smooth(m.aboutTextOut, m.contactTextIn, s),
  };
}
