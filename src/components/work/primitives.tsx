import Link from "next/link";
import type { ReactNode } from "react";

// Shared bits for the experience and project pages. Server components only.

/** Small mono label: eyebrows, dates, section names. */
export const labelClass = "font-mono text-[11px] uppercase tracking-[0.2em] text-muted";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${labelClass} group/back inline-flex items-center gap-2 py-2 transition-colors hover:text-foreground`}
    >
      <span aria-hidden="true" className="transition-transform duration-300 group-hover/back:-translate-x-1">
        ←
      </span>
      {children}
    </Link>
  );
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
      {children}
    </h2>
  );
}

export function Tags({ tags, className = "" }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/**
 * Text link with a trailing arrow. "primary" is a boxed button for the one
 * action that matters on a block, "quiet" is an underlined line of mono text.
 */
export function ActionLink({
  href,
  children,
  variant = "quiet",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
  className?: string;
}) {
  const look =
    variant === "primary"
      ? "border border-foreground px-5 py-3.5 text-foreground hover:bg-foreground hover:text-background"
      : "border-b border-foreground/30 pb-1.5 text-foreground hover:border-accent hover:text-accent";
  return (
    <Link
      href={href}
      className={`group/cta inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${look} ${className}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">
        →
      </span>
    </Link>
  );
}
