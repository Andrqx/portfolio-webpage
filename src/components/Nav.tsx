"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  // Section anchors only work as bare hashes on the homepage itself —
  // from any other page (e.g. a project detail page) they need to route
  // back to "/" first.
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
        <Link
          href={sectionHref("#contact")}
          className="font-mono text-xs uppercase tracking-widest border border-border rounded-full px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          Let&apos;s talk
        </Link>
      </nav>
    </motion.header>
  );
}
