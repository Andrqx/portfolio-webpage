"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/content";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b border-border" : ""
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 md:px-10 h-20 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-foreground"
        >
          {profile.name}
        </a>
        <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="font-mono text-xs uppercase tracking-widest border border-border rounded-full px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          Let&apos;s talk
        </a>
      </nav>
    </motion.header>
  );
}
