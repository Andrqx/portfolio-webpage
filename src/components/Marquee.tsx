import { skills } from "@/data/content";

export default function Marquee() {
  const items = [...skills, ...skills];

  return (
    <div className="relative mt-20 border-y border-border py-6 overflow-hidden">
      <div className="flex w-max animate-marquee gap-12">
        {items.map((skill, i) => (
          <span
            key={i}
            className="font-mono text-sm uppercase tracking-widest text-muted whitespace-nowrap"
          >
            {skill} <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
