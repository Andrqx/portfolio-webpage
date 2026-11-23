import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CaseStudyFeature from "@/components/work/CaseStudyFeature";
import { ActionLink, BackLink, SectionHeading, Tags, labelClass } from "@/components/work/primitives";
import { orgs, profile, projects, teams } from "@/data/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} | ${profile.name}`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const team = teams.find((t) => t.key === project.team);
  const org = orgs.find((o) => o.team === project.team);

  return (
    <>
      <Header />
      <main className="flex-1 px-4 pb-32 pt-24 md:px-10 md:pt-32">
        <article aria-labelledby="project-title" className="mx-auto max-w-5xl">
          {org ? (
            // lands on this project in the org's list
            <BackLink href={`/experience/${org.slug}/#${project.slug}`}>Back to {org.name}</BackLink>
          ) : (
            <BackLink href="/#work">All work</BackLink>
          )}

          <header className="mt-10 md:mt-14">
            <p className={labelClass}>
              {team?.label ?? project.team} · {project.period}
            </p>
            <h1
              id="project-title"
              className="mt-4 font-dot text-[clamp(1.625rem,7vw,4.5rem)] font-black uppercase leading-[0.9]"
            >
              {project.title}
            </h1>
            <Tags tags={project.tags} className="mt-8" />
          </header>

          <div className="mt-12 max-w-3xl space-y-6 border-t border-border pt-10 md:mt-16">
            {project.detail.map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed text-foreground/80 md:text-xl">
                {paragraph}
              </p>
            ))}
          </div>

          {project.caseStudy && project.caseStudyHref ? (
            <section aria-labelledby="case-study-label case-study-title" className="mt-16 md:mt-24">
              <SectionHeading id="case-study-label">Case study</SectionHeading>
              <CaseStudyFeature
                caseStudy={project.caseStudy}
                href={project.caseStudyHref}
                headingId="case-study-title"
                className="mt-6"
              />
            </section>
          ) : (
            project.caseStudyHref && (
              <ActionLink href={project.caseStudyHref} variant="primary" className="mt-12">
                Read the full case study
              </ActionLink>
            )
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
