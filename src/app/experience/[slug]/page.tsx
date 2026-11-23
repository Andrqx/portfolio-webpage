import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CaseStudyFeature from "@/components/work/CaseStudyFeature";
import ProjectArticle from "@/components/work/ProjectArticle";
import { BackLink, SectionHeading, labelClass } from "@/components/work/primitives";
import { experience, orgs, profile, projects } from "@/data/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return orgs.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = orgs.find((o) => o.slug === slug);
  if (!org) return {};
  return { title: `${org.name} | ${profile.name}`, description: org.summary };
}

export default async function OrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = orgs.find((o) => o.slug === slug);
  if (!org) notFound();

  const roles = experience.filter((e) => e.org === org.name);
  const orgProjects = org.team ? projects.filter((p) => p.team === org.team) : [];
  // Projects with a write up get a big card under the header.
  const featured = orgProjects.flatMap((p) =>
    p.caseStudy ? [{ slug: p.slug, caseStudy: p.caseStudy, href: p.caseStudyHref ?? `/work/${p.slug}/` }] : [],
  );
  // Most pages are just the name and then the projects. pageIntro (FSAE) adds
  // the label, the summary and the roles; an org with no projects listed keeps
  // its roles, so its page is not just a name.
  const intro = org.pageIntro ?? false;
  const showRoles = (intro || orgProjects.length === 0) && roles.length > 0;
  const gap = intro ? "mt-20 md:mt-28" : "mt-14 md:mt-20";

  return (
    <>
      <Header />
      <main className="flex-1 px-4 pb-32 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-5xl">
          {/* the home page has an anchor per card, so this lands back on this one */}
          <BackLink href={`/#work-${org.slug}`}>All work</BackLink>

          <header className="mt-10 md:mt-14">
            {intro && <p className={`${labelClass} mb-4`}>{org.label}</p>}
            <h1 className="font-dot text-[clamp(2.75rem,10vw,9rem)] font-black uppercase leading-[0.85]">{org.name}</h1>
            {intro && <p className="mt-8 max-w-3xl text-lg leading-snug md:text-2xl">{org.summary}</p>}
          </header>

          {/* right under the header so the write up is on the first screen */}
          {featured.map((f) => (
            <section
              key={f.slug}
              aria-labelledby={`case-study-label-${f.slug} case-study-${f.slug}`}
              className="mt-14 md:mt-20"
            >
              <SectionHeading id={`case-study-label-${f.slug}`}>Case study</SectionHeading>
              <CaseStudyFeature
                caseStudy={f.caseStudy}
                href={f.href}
                headingId={`case-study-${f.slug}`}
                className="mt-6"
              />
            </section>
          ))}

          {showRoles && (
            <section aria-labelledby="roles" className={gap}>
              <SectionHeading id="roles">Roles</SectionHeading>
              <ol className={`mt-6 grid gap-x-10 ${roles.length > 1 ? "md:grid-cols-2" : ""}`}>
                {roles.map((r) => (
                  <li key={`${r.role} ${r.period}`} className="border-t border-border py-8">
                    <p className={labelClass}>{r.period}</p>
                    <h3 className="mt-3 text-xl font-bold leading-tight md:text-2xl">{r.role}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{r.description}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {orgProjects.length > 0 && (
            <section aria-labelledby="projects" className={gap}>
              <SectionHeading id="projects">Projects</SectionHeading>
              <ol className="mt-6 border-b border-border">
                {orgProjects.map((p, i) => (
                  <li key={p.slug}>
                    <ProjectArticle project={p} index={i} />
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
