import Image from "next/image";
import type { Project } from "@/data/content";
import { basePath } from "@/lib/basePath";
import { ActionLink } from "./primitives";

type CaseStudy = NonNullable<Project["caseStudy"]>;

/**
 * Big case study card: the animation full width, then title, summary and the
 * link. The link is stretched over the whole card, so a click anywhere opens
 * the case study while screen readers still get one short link.
 */
export default function CaseStudyFeature({
  caseStudy,
  href,
  headingId,
  className = "",
}: {
  caseStudy: CaseStudy;
  href: string;
  headingId: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden border border-border bg-foreground/[0.02] transition-colors hover:border-foreground/40 ${className}`}
    >
      <div className="overflow-hidden border-b border-border bg-foreground/[0.03]">
        {/* width and height only reserve space while the GIF loads, so the
            page below does not jump. They are the pixel size of
            fe-stress-animation.gif. w-full h-auto sets the real size, and once
            loaded the picture keeps its own aspect ratio, so another file
            still shows correctly. Animated GIFs are served as is (images are
            unoptimized for the static export). */}
        <Image
          src={`${basePath}${caseStudy.image}`}
          alt={caseStudy.imageAlt}
          width={1156}
          height={410}
          sizes="(min-width: 1024px) 64rem, 100vw"
          unoptimized
          loading="eager"
          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-12 md:gap-10 md:p-8">
        <h3
          id={headingId}
          className="font-dot text-[clamp(1.75rem,4.5vw,3rem)] font-black uppercase leading-[0.95] md:col-span-6"
        >
          {caseStudy.title}
        </h3>
        <div className="md:col-span-6">
          <p className="text-base leading-relaxed text-foreground/80 md:text-lg">{caseStudy.summary}</p>
          <ActionLink href={href} variant="primary" className="mt-8 after:absolute after:inset-0">
            Read the case study
          </ActionLink>
        </div>
      </div>
    </div>
  );
}
