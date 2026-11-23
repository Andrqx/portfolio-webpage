import Link from "next/link";
import { profile } from "@/data/content";

// Small footer for inner pages. The home page ends with Contact instead.
export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 md:px-10">
      <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="flex gap-6">
          <a href={`mailto:${profile.email}`} className="hover:text-foreground transition-colors">Email</a>
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              {s.label}
            </a>
          ))}
          <Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link>
        </span>
      </div>
    </footer>
  );
}
