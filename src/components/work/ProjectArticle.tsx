import type { Project } from "@/data/content";
import { ActionLink, Tags, labelClass } from "./primitives";

/**
 * One project on an experience page, shown in full: number and dates, title,
 * tags, every detail paragraph, then a link to the case study when there is
 * one, otherwise to the project's own page.
 */
export default function ProjectArticle({ project, index }: { project: Project; index: number }) {
  const titleId = `${project.slug}-title`;
  return (
    <article id={project.slug} aria-labelledby={titleId} className="scroll-mt-24 border-t border-border py-10 md:py-14">
      <div className={`flex items-baseline justify-between gap-6 ${labelClass}`}>
        <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-right">{project.period}</span>
      </div>
      <h3
        id={titleId}
        className="mt-6 font-dot text-[clamp(1.625rem,5vw,3rem)] font-black uppercase leading-[0.95]"
      >
        {project.title}
      </h3>
      <Tags tags={project.tags} className="mt-6" />
      <div className="mt-8 max-w-3xl space-y-5">
        {project.detail.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/80 md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
      {project.caseStudyHref ? (
        <ActionLink href={project.caseStudyHref} variant="primary" className="mt-10">
          Read the full case study
        </ActionLink>
      ) : (
        <ActionLink href={`/work/${project.slug}/`} className="mt-10">
          Open project page
        </ActionLink>
      )}
    </article>
  );
}
