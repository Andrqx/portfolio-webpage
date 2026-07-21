import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-10 py-8">
      <div className="mx-auto max-w-6xl flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Built with Next.js &amp; Framer Motion</span>
      </div>
    </footer>
  );
}
