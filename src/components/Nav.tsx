"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate } from "animejs";
import { useEntranceReveal } from "@/hooks/useEntranceReveal";
import { profile } from "@/data/content";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { ready, flash } = useEntranceReveal(isHome);
  const headerRef = useRef<HTMLElement>(null);
  const playedRef = useRef(false);

  // Section anchors only work as bare hashes on the homepage itself —
  // from any other page (e.g. a project detail page) they need to route
  // back to "/" first.
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready || playedRef.current || !headerRef.current) return;
    playedRef.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      headerRef.current.style.opacity = "1";
      headerRef.current.style.transform = "translateY(0)";
      return;
    }

    animate(headerRef.current, {
      translateY: [-80, 0],
      opacity: [0, 1],
      duration: 600,
      ease: "outExpo",
    });
  }, [ready]);

  return (
    <header
      ref={headerRef}
      style={{ opacity: 0, transform: "translateY(-80px)" }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b border-border" : ""
      } ${flash ? "animate-lightning-flash" : ""}`}
    >
      <nav className="mx-auto max-w-6xl px-6 md:px-10 h-20 flex items-center justify-between">
        <Link
          href={sectionHref("#top")}
          className="font-mono text-sm tracking-tight text-foreground"
        >
          {profile.name}
        </Link>
        <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={sectionHref(link.href)}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Grad. {profile.gradDate}
        </span>
      </nav>
    </header>
  );
}
