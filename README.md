# Portfolio Webpage

Personal portfolio site built with Next.js, TypeScript, Tailwind CSS, and a hand-written WebGL2 stage that draws the home page, with the hero as dots.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating content

Everything you'd normally change lives in [`src/data/content.ts`](src/data/content.ts):

| What | Where in `content.ts` |
|---|---|
| Name, school, email, LinkedIn | `profile` |
| Hero photo (or a cutout or clip) and one-line intro | `hero` |
| About me paragraphs | `about` |
| Line on the right of the hero (empty for now) | `hero.line` |
| Cards on the work reel | `orgs` (order = card order) |
| Roles shown on each card and org page | `experience` (matched to `orgs` by `name`) |
| Project pages under each org | `projects` (matched to `orgs` by `team`) |
| Full screen pictures behind About and Contact | `scenes.about`, `scenes.contact` |
| Section headings and the contact line | `homeCopy` |

### Swapping in your own hero photo or clip

The hero is a whole photo, background and all, drawn as dots across the screen. The current one is you on a patio at night with the city behind you (the original is kept as `assets-src/hero-night-original.webp`). The prepare script widens it by 10% on each side: the photo stays untouched in the middle, and the two added strips continue the colours along its left and right edges, blurred more the farther out, like the same scene out of focus. Nothing new is made up and nothing in the photo is copied into the strips. On a laptop the photo then fills the middle 80% of the screen and shows a little under half its height (it is taller than wide, so a laptop shows a band across it); a phone shows its full height and about 60% of its width, and a tablet held upright about all of its width, so the strips do not show there. The hero has no dark fade at the screen's edges, unlike the about and contact photos. The Rock of Cashel photo used before is `assets-src/hero-scene-cashel.jpg`; its `face` and `focus` values are in a comment above `hero` in `content.ts`. The hero holds still, and every few seconds it glitches: blocks jump sideways, short streaks pull off the right edge of your face, and now and then a tear band rolls through.

To change the photo:

1. Any photo of you works, upright or landscape. A photo narrower than 2:1 gets the blurred strips (`HERO_SIDE_FILL` in the script sets how wide each one is; `0` keeps the photo as it is). Phones crop the sides, so keep your face clear of the edges.
2. Save it as `assets-src/hero-scene.webp`, `.jpg` or `.png` (keep only one of them).
3. Run `node scripts/prepare-home-assets.mjs hero`. It writes `public/images/home/hero.jpg` without the photo's metadata (location included), at most 1600 on its longer side (the current one is 1500x1600). When it widens the photo it prints where the real photo sits in `hero.jpg`: copy that into `hero.span` in `content.ts` (so screens narrower than the photo never show the blurred strips), and it prints how to convert numbers measured on the photo for step 4. For a photo it did not widen, leave `hero.span` out.
4. In `content.ts`, set `hero.face` to where your head is in `hero.jpg`: `x`, `y` are the centre of your face (between the eyes and the nose), `rx` is half the width of your face, `ry` is half the height from the top of your hair (or hat) to your chin. All are fractions of the picture, measured from the top left. They place the glitch streaks and keep your head in view when a screen crops the photo.
5. Set `hero.focus` to the part of the photo that should stay in view when a screen crops it, as `[x, y]` from 0 to 1 (like CSS `object-position`). On very wide or very narrow screens the crop only moves as far as it must to keep your head in view, so a low `y` keeps the top of the photo on ordinary screens without cutting off your face on ultra-wide ones.
6. Set `hero.textSide` to the side your face is not on (`"left"` or `"right"`), so your name does not cover it on laptops and phones held sideways. Phones held upright put the name at the bottom left.

When `hero.figure` ends in `.jpg` it is drawn as a whole photo. A `.png` or `.webp` with a transparent background is drawn as a cutout of you over a grey lavender grid instead: shoot waist up against one plain colour you are not wearing, save it as `assets-src/hero-original.png`, run `node scripts/prepare-home-assets.mjs hero-cutout` (it removes the backdrop and writes `public/images/home/hero.webp`), and point `hero.figure` at `/images/home/hero.webp`.

A real clip will always look better than the still. Put a short looping mp4 or webm in `public/` and point `hero.figure` at it:

1. Framing: landscape, waist up, centred, a hand's width of space above your head. Lock the camera on a tripod or a shelf at chest height.
2. Background: black or very dark and unlit. Wear something that is not black so your shoulders do not key out.
3. Light: one lamp or window to one side, slightly in front of you. No light on the background.
4. Action: slowly turn your head from one shoulder to the other and back, about 8 seconds for the full sweep. End in the pose you started in so the loop does not jump.
5. Export: 6 to 10 seconds, 1280x720, 24 or 30 fps, no audio, under about 3 MB.

For a clip, anything darker than `hero.keyLow` is treated as background. If parts of you disappear, lower it. If the background shows through, raise it.

### Reel cards

Each card shows the org's name in large dot type, then `title` and `period` from `orgs`. The name assembles out of dots as the card rolls to the centre. The reel's ground behind the cards is dark grey with a faint grid (fine lines, a heavier one every fourth, small crosses where those meet); its colour and line strengths are in `reelBg` in `src/lib/stage/shaders.ts`.

- To use an official logo instead of the name set in type, put the file in `public/` (SVG or PNG with a transparent background) and set `logo` on that org. Check the company's brand guidelines first. Most do not allow a logo to be recoloured or animated.
- To put a photo behind a card, put the original in `assets-src/` as `card-<slug>.jpg`, `.png` or `.webp`, add a line for it at the bottom of `scripts/prepare-home-assets.mjs`, run the script, and set `image` to `/images/home/card-<slug>.jpg`. The card measures how bright the photo is and dims it just enough for the white name to read.
- `imageFocus` picks which part of the photo stays in view when the card crops it, as `[x, y]` from 0 to 1.
- If the photo already shows the company's name (the Nokia one does), set `showName: false` so it is not written twice.

### About and contact pictures

`scenes.about` is the team photo behind "About me", the team at the racetrack (from `assets-src/about-team.jpg`). The FSAE card and its experience page use the team photo with the Canadian flag (`card-fsae.jpg`, from `assets-src/card-fsae.webp`). As you scroll on, the contact picture fizzles in over it: it breaks out at random spots around the screen and spreads tile by tile, with a crackle of static along the edges, until it fills the screen.

The section opens with a large "About me" heading, followed by the paragraphs in `about` in `content.ts` (one short paragraph now, written from the bio on the old site and the experience list). With that one paragraph the contact text is in about three screens of scrolling after the team photo fills the screen; with only the heading it would be about two and a quarter. Each paragraph makes the section 0.8 of a screen longer, enough to read a paragraph of about 350 characters on a laptop before the contact section comes in. Longer text still works: it scrolls past faster, and it always fades out before the contact text appears. The lengths are at the top of `src/lib/stage/timeline.ts`.

`scenes.contact` is the full screen picture behind the contact section. The current one is the lavender field under a blue sky in `assets-src/contact-lavender-sky.webp`, prepared by the same script (`node scripts/prepare-home-assets.mjs contact` runs only that step). `scenes.contactAnchor` says which part stays in view on screens that crop it.

The originals in `assets-src/` are kept out of `public/` so they are never deployed.

## Structure

- `src/app/page.tsx`: home page. Reads `content.ts` and hands everything to the stage.
- `src/components/home/HomeStage.tsx`: the home page text (real DOM) and the scroll wiring.
- `src/lib/stage/stage.ts`: the WebGL2 renderer. One canvas, four passes per frame: the pointer's wake, the hero (small, drawn as dots), scene (full resolution), screen. It also times the hero's glitches and the rolling tear bands. The wake bends the picture where the pointer passes: the pixels are pushed along the path, bulge and wobble, then settle back, always in the colours already under the pointer. It is the same over the hero, the about photo and the contact photo. Its size is `WAKE_R` in `stage.ts`, and how far it pushes is in the wake block of the screen shader (`POST_FRAG` in `shaders.ts`). How long it lasts is set by the `WAKE` block in `shaders.ts`; to make it last longer, read the note above that block first, because `WAKE_LIFE` in `stage.ts` has to grow with it or the trail is cut off.
- `src/lib/stage/shaders.ts`: the shaders (hero, reel, the about photo fizzling into the contact picture, the pointer's wake, dots, CRT treatment).
- `src/lib/stage/timeline.ts`: what happens at which scroll position.
- `src/lib/stage/art.ts`: draws the reel cards and the stand-in pictures.
- `scripts/prepare-home-assets.mjs`: turns the originals in `assets-src/` into the hero photo, the about and contact pictures and the card photos (and a hero cutout, when you ask for that step by name).
- `src/app/experience/[slug]`: one page per org card.
- `src/app/work/[slug]`: one page per project, plus the chassis FE case study.
