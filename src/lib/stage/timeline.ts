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
// about 1.4 screens of scroll with no about paragraphs (1.75 with one). The
// fizzle runs over about 0.7 of that (uChange 0.1 to FIZZLE_DONE), though only
// a few spots show in its first third. It was about 3 with one paragraph until
// the owner asked for less scrolling here again.
const ABOUT_HOLD = 0.25; // screens the about photo holds before it starts to change
// More for each about paragraph, so there is time to read it. HomeStage has
// the text rise at the speed that takes it off the top just as it starts to
// fade out (never under half the scroll speed). With these lengths that is
// about the scroll speed for the heading and one paragraph of about 270
// characters on a 945 px tall laptop, and a little faster on a phone, where
// the same text is taller. Each further paragraph adds 0.4 of a screen
// whatever its length, about the height of a 500 character paragraph on that
// laptop, so a shorter one slows the text a little (one as long as the first:
// about 0.9 of the scroll speed there).
const ABOUT_PER_PARAGRAPH = 0.4;
// The change (uChange 0 to 1) runs from changeStart to contactFull, over
// CHANGE_LEAD + CONTACT_GROW screens; only the sum has an effect. The contact
// photo has fizzled in before the end, at FIZZLE_DONE of the change
// (contactTextIn).
const CHANGE_LEAD = 0.3; // screens from the start of the change to contactStart
const CONTACT_GROW = 0.9; // screens from contactStart to contactFull, the end of the change
const CONTACT_HOLD = 0.5; // then holds, to the end of the page
// The contact photo has fizzled in by this point of the change (SCENE about()
// forces the last few tiles through just before it), and the contact text
// starts to fade in there. The about text fades out over the screens before.
export const FIZZLE_DONE = 0.68;
const CONTACT_TEXT_FADE = 0.3; // screens the contact text takes to fade in
const ABOUT_TEXT_FADE = 0.2; // screens the about text takes to fade out, just before

export type Timeline = {
  /** reel position: 0 = hero card centred, 1..n = project cards, n+1 = about */
  r: number;
  /** 1 = hero card fills the screen */
  zoomA: number;
  /** 1 = about card fills the screen */
  zoomB: number;
  /** 0..1, how much of the screen one full-bleed picture fills (drives the tear bands and the wake's strength; the edge vignette uses zoomB) */
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
  // the about text rises through the pinned picture from below the bottom edge
  const text1In = aboutStart - 0.07;
  const changeStart = aboutStart + ABOUT_HOLD + ABOUT_PER_PARAGRAPH * Math.max(aboutParagraphs, 0);
  const contactStart = changeStart + CHANGE_LEAD;
  const contactFull = contactStart + CONTACT_GROW;
  // the contact text comes in once the contact photo has fizzled in
  const contactTextIn = changeStart + FIZZLE_DONE * (contactFull - changeStart);
  // the about text fades out from here, just before the contact text comes in
  const aboutTextOut = contactTextIn - ABOUT_TEXT_FADE;
  const total = contactFull + CONTACT_HOLD;
  return {
    last,
    aboutStart,
    text1In,
    // Where the #about link lands: a little before half way through the about
    // text's rise, so the text sits a little below the middle of the screen.
    // Half way would centre it (HomeStage picks the speed so it would), but a
    // phone held sideways gets the laptop-sized text in under 400 px of height,
    // and there a centred block puts the heading under the header.
    aboutRead: text1In + 0.42 * (aboutTextOut - text1In),
    changeStart,
    contactStart,
    aboutTextOut,
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
