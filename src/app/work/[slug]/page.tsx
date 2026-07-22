import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile, projects, teams } from "@/data/content";

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
    title: `${project.title} — ${profile.name}`,
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

  return (
    <>
      <Nav />
      <main className="pt-40 pb-32 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#work"
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            ← Back to work
          </Link>

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-8 mb-4">
            {team?.label} — {project.period}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-10">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-12">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-widest border border-border rounded-full px-3 py-1 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-6">
            {project.detail.map((paragraph, i) => (
              <p key={i} className="text-lg text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
