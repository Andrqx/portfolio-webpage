"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CardArt } from "@/lib/stage/art";
import { Stage, type FrameInfo, type StageAssets } from "@/lib/stage/stage";
import { marks, smooth } from "@/lib/stage/timeline";

export type HomeCard = {
  slug: string;
  name: string;
  /** small tag after the name in the list, e.g. "FSAE" */
  label: string;
  lines: string[];
  art: CardArt;
};

export type HomeProps = {
  name: string;
  /** footer year, worked out on the server so the built page and the browser agree */
  year: number;
  eyebrow: string;
  /** a line on the hero (opposite the name on laptops, or under it with heroSide "right"); empty to show nothing */
  tagline: string;
  /** which side the name sits on over the hero on laptops and wider */
  heroSide: "left" | "right";
  workHeading: string;
  cards: HomeCard[];
  /** lead and body may be empty */
  about: { label: string; lead: string; body: string[] };
  contact: { headline: string; sub: string; email: string; links: { label: string; href: string }[] };
  media: {
    hero: string | null;
    heroKey: [number, number];
    heroFace: { x: number; y: number; rx: number; ry: number };
    /** for a whole photo: which part stays in view when it is cropped, 0..1 from the top left */
    heroFocus: [number, number];
    /** for a widened photo: where the real photo sits across the picture, 0..1 */
    heroSpan: [number, number];
    about: string | null;
    contact: string | null;
    /** 0 bottom, 0.5 middle, 1 top */
    contactAnchor: number;
  };
};

const GLYPHS = "#%&*+=<>/?!01";

// Resolve an element's text left to right out of random glyphs.
function scramble(el: HTMLElement) {
  const text = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = text;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / 700);
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      out += ch === " " || i / text.length < p ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// One step of the scroll timeline in CSS px: the page's 100vh. The #work anchor
// sits exactly 100vh down. On phones this stays put while the browser toolbar
// slides in and out, which window.innerHeight does not.
const screenPx = () => document.getElementById("work")?.offsetTop || window.innerHeight;

export default function HomeStage(props: HomeProps) {
  const { cards } = props;
  const n = cards.length;
  // the about section is longer when there are paragraphs to read
  const aboutParagraphs = (props.about.lead ? 1 : 0) + props.about.body.length;
  const m = marks(n, aboutParagraphs);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLAnchorElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [noGl, setNoGl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const dotFont = css.getPropertyValue("--font-doto").trim() || "monospace";
    const monoFont = css.getPropertyValue("--font-geist-mono").trim() || "monospace";

    let lastActive = -1;
    const shown = new WeakMap<HTMLElement, boolean>();
    const layer = (el: HTMLElement | null, o: number, y = 0) => {
      if (!el) return;
      el.style.opacity = o.toFixed(3);
      el.style.transform = y ? `translate3d(0, ${y.toFixed(1)}px, 0)` : "";
      const on = o > 0.5;
      if (on !== (shown.get(el) ?? false)) {
        shown.set(el, on);
        el.dataset.on = on ? "1" : "0";
        if (on && !reduced) el.querySelectorAll<HTMLElement>("[data-scramble]").forEach(scramble);
      }
    };

    // Height of the about text block, so a long one can rise faster. Watched,
    // because it changes when the web fonts arrive, the width changes, or the
    // page is translated.
    const aboutBlock = aboutRef.current?.querySelector<HTMLElement>(".home-text-block") ?? null;
    let aboutBlockH = 0;
    const measureAbout = () => {
      aboutBlockH = aboutBlock?.offsetHeight ?? 0;
    };
    measureAbout();
    const aboutResize = aboutBlock && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureAbout) : null;
    if (aboutBlock) aboutResize?.observe(aboutBlock);

    const onFrame = ({ s, tl }: FrameInfo) => {
      const vh = window.innerHeight;
      layer(heroRef.current, 1 - smooth(0.05, 0.35, s), -s * vh * 0.25);
      const work = smooth(0.35, 0.6, s) * (1 - smooth(n + 0.55, n + 0.8, s));
      layer(workRef.current, work);
      const idx = Math.min(n, Math.max(1, Math.round(tl.r))) - 1;
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      if (openRef.current) {
        // The link sits at the screen centre and does not follow the card, so
        // it is only there while the card is close to the centre; further out
        // it would lie over the next card.
        const centred = work > 0.5 && Math.abs(tl.r - (idx + 1)) < 0.2;
        openRef.current.dataset.on = centred ? "1" : "0";
      }
      // The about text starts below the bottom edge and scrolls up through the
      // pinned picture at half the scroll speed, as on the reference. A block
      // too tall to clear the top that way by the time it fades out (just before
      // the contact text comes in) rises faster, so it never meets the contact
      // text. The canvas dims the picture behind it with the same tl.aboutText.
      const speed = Math.max(0.5, (vh + aboutBlockH) / (Math.max(0.1, m.aboutTextOut - m.text1In) * vh));
      const rise = (e: number) => (e - s) * vh * speed;
      // switched off once the contact picture is full; it has faded out by then
      const visible = (e: number) => (s > e - 0.02 && s < m.contactFull ? 1 : 0);
      layer(aboutRef.current, visible(m.text1In) * tl.aboutText, rise(m.text1In));
      // the contact text comes in once the contact picture has fizzled in
      layer(contactRef.current, smooth(m.contactTextIn, m.contactTextFull, s));
    };

    const assets: StageAssets = {
      heroMedia: props.media.hero,
      heroKey: props.media.heroKey,
      heroFace: props.media.heroFace,
      heroFocus: props.media.heroFocus,
      heroSpan: props.media.heroSpan,
      cards: cards.map((c) => c.art),
      aboutParagraphs,
      about: props.media.about,
      contact: props.media.contact,
      contactAnchor: props.media.contactAnchor,
      dotFont,
      monoFont,
      scrollUnit: screenPx,
    };

    let stage: Stage | null = null;
    let gaveUp = false;
    const showStatic = (err?: unknown) => {
      if (err) console.warn(`Home stage disabled: ${err instanceof Error ? err.message : String(err)}`);
      gaveUp = true;
      queueMicrotask(() => {
        setNoGl(true);
        setReady(true);
      });
    };
    const build = () => {
      try {
        stage = new Stage(canvas, assets, onFrame, () => setReady(true));
      } catch (err) {
        stage = null;
        showStatic(err);
      }
      if (process.env.NODE_ENV !== "production") {
        // lets `__stage.bench()` be called from the console while tuning
        (window as unknown as { __stage?: Stage | null }).__stage = stage;
      }
    };
    build();

    // A GPU reset takes the context away. The stage asks for it back; build a new
    // stage when it returns, or show the plain page if it has not come back soon.
    let restoreTimer = 0;
    const onLost = () => {
      window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(() => {
        stage?.destroy();
        stage = null;
        showStatic("the WebGL context did not come back");
      }, 4000);
    };
    const onRestored = () => {
      window.clearTimeout(restoreTimer);
      if (gaveUp) return;
      stage?.destroy();
      build();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      window.clearTimeout(restoreTimer);
      aboutResize?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      stage?.destroy();
    };
    // The stage is built once. Props come from a server component and only change
    // in development, when content.ts is edited: a new card or paragraph count
    // changes the timeline, so the stage is rebuilt to match the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, aboutParagraphs]);

  // When the plain fallback page takes over, the browser has already tried to
  // scroll to the URL's #section in the tall stage layout. Scroll there again.
  useEffect(() => {
    if (!noGl) return;
    let id = "";
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      /* a malformed hash */
    }
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [noGl]);

  const go = (screens: number) => () => {
    // keyboard focus landed on something in a section that is off screen: go there
    if (noGl) return;
    const unit = screenPx();
    const y = screens * unit;
    if (Math.abs(window.scrollY - y) > unit * 0.4) window.scrollTo({ top: y });
  };

  const card = cards[active] ?? cards[0];

  return (
    <div className={`home ${noGl ? "home--static" : ""}`} data-ready={ready ? "1" : "0"} style={noGl ? undefined : { height: `${(m.total + 1) * 100}vh` }}>
      {/* Section anchors in the tall stage layout. The plain fallback page puts
          the same ids on the sections themselves instead. */}
      {!noGl && (
        <>
          <span id="work" className="home-anchor" style={{ top: "100vh" }} />
          <span id="experience" className="home-anchor" style={{ top: "100vh" }} />
          {/* "All work" on an experience page comes back to that org's card */}
          {cards.map((c, i) => (
            <span key={c.slug} id={`work-${c.slug}`} className="home-anchor" style={{ top: `${(i + 1) * 100}vh` }} />
          ))}
          {/* a little later when there is a paragraph, so the whole blurb is on screen */}
          <span
            id="about"
            className="home-anchor"
            style={{ top: `${(m.aboutStart + 0.6 + 0.4 * Math.min(aboutParagraphs, 1)) * 100}vh` }}
          />
          <span id="contact" className="home-anchor" style={{ top: `${m.total * 100}vh` }} />
        </>
      )}

      <div className="home-stage">
        <canvas ref={canvasRef} aria-hidden="true" />
        <p className="home-loading font-dot" aria-hidden="true">
          Loading
        </p>

        <header className="home-header">
          <Link href="/" className="font-dot text-base font-black uppercase tracking-wider md:text-lg">
            {props.name}
          </Link>
          <nav className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em] md:gap-8">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <div ref={heroRef} className="home-layer home-hero" data-on="1" data-side={props.heroSide} style={{ opacity: 1 }}>
            <div>
              <h1 className="font-dot glow text-4xl font-black uppercase leading-none md:text-[2rem]">{props.name}</h1>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">{`// ${props.eyebrow}`}</p>
            </div>
            {props.tagline && (
              <p className="font-dot glow max-w-[19rem] text-base font-bold uppercase leading-tight md:text-justify md:text-[15px] md:leading-[1.3]">
                {props.tagline}
              </p>
            )}
          </div>

          <section ref={workRef} id={noGl ? "work" : undefined} className="home-layer home-work" data-on="0" aria-label={props.workHeading}>
            <div className="home-work-list" id={noGl ? "experience" : undefined}>
              <h2 className="font-dot text-3xl font-black uppercase leading-none md:text-[1.6rem] 2xl:text-[2rem]" data-scramble>
                {props.workHeading}
              </h2>
              <ol className="mt-3 space-y-0.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                {cards.map((c, i) => (
                  <li key={c.slug} id={noGl ? `work-${c.slug}` : undefined} data-active={i === active ? "1" : "0"}>
                    <Link href={`/experience/${c.slug}/`} onFocus={go(i + 1)}>
                      <span aria-hidden="true">{i === active ? "● " : "  "}</span>[{String(i + 1).padStart(2, "0")}] {c.name}
                    </Link>
                  </li>
                ))}
              </ol>
              {/* the card itself shows the title and dates, so this is for screen readers only */}
              <div className="sr-only" aria-live="polite">
                {card.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <Link ref={openRef} href={`/experience/${card.slug}/`} className="home-open" data-on="0" tabIndex={-1}>
              <span className="sr-only">Open {card.name}</span>
            </Link>
          </section>

          <section ref={aboutRef} id={noGl ? "about" : undefined} className="home-layer home-text" data-on="0" aria-labelledby="about-h">
            <div className="home-text-block">
              {/* as large as the contact headline, so the section reads as "about me" the moment it comes up */}
              <h2 id="about-h" className="font-dot glow text-4xl font-black uppercase leading-none md:text-[2.7rem]" data-scramble>
                {props.about.label}
              </h2>
              {props.about.lead && (
                <p className="mt-5 font-mono text-base font-bold uppercase leading-snug tracking-[0.06em] md:text-xl">{props.about.lead}</p>
              )}
              {props.about.body.map((p) => (
                <p key={p} className="mt-3 font-mono text-sm uppercase leading-snug tracking-[0.06em] opacity-85 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section ref={contactRef} id={noGl ? "contact" : undefined} className="home-layer home-contact" data-on="0" aria-labelledby="contact-h">
            <h2 id="contact-h" className="font-dot glow max-w-3xl text-4xl font-black uppercase leading-[1.25] md:text-[2.7rem]" data-scramble>
              {props.contact.headline}
            </h2>
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] opacity-85 md:text-base">{props.contact.sub}</p>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-sm uppercase tracking-[0.15em] md:mt-[14vh]">
              <li>
                <a href={`mailto:${props.contact.email}`} onFocus={go(m.total)}>
                  &gt; {props.contact.email}
                </a>
              </li>
              {props.contact.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" onFocus={go(m.total)}>
                    &gt; {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="home-foot font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
              © {props.year} {props.name}
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
