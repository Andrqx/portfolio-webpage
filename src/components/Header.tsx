import Link from "next/link";
import { profile } from "@/data/content";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="flex items-center justify-between px-4 py-5 md:px-10">
        <Link href="/" className="font-dot text-base font-black uppercase tracking-wider md:text-lg">
          {profile.name}
        </Link>
        <nav className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em] md:gap-8">
          <Link href="/#work" className="hover:opacity-60 transition-opacity">Work</Link>
          <Link href="/#about" className="hover:opacity-60 transition-opacity">About</Link>
          <Link href="/#contact" className="hover:opacity-60 transition-opacity">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
