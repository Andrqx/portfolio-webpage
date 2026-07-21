export const profile = {
  name: "Your Name",
  role: "Software Engineer",
  tagline: "I build interfaces that feel alive.",
  bio: "I'm a software engineer who cares about the details most people scroll past — the timing of a transition, the weight of a headline, the moment a page starts to feel like a place instead of a document. This portfolio is a template: replace this bio, swap the projects below, and make it yours.",
  location: "Based in — your city",
  email: "you@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/your-username" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username" },
    { label: "Twitter / X", href: "https://x.com/your-username" },
  ],
};

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "Framer Motion",
  "GraphQL",
  "AWS",
  "Docker",
  "Figma",
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
  year: string;
};

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A short, punchy description of what this project does and the problem it solves. Focus on impact, not just tech.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
    repo: "#",
    year: "2026",
  },
  {
    title: "Project Two",
    description:
      "Another project summary. Mention scale, users, or a specific technical challenge you solved.",
    tags: ["React", "Node.js", "AWS"],
    href: "#",
    repo: "#",
    year: "2025",
  },
  {
    title: "Project Three",
    description:
      "Describe the outcome. Numbers are persuasive: faster load times, more signups, fewer bugs.",
    tags: ["Python", "Docker", "GraphQL"],
    href: "#",
    repo: "#",
    year: "2025",
  },
  {
    title: "Project Four",
    description:
      "A side project or experiment worth showing off. Passion projects reveal a lot about how you think.",
    tags: ["Figma", "Framer Motion"],
    href: "#",
    repo: "#",
    year: "2024",
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer",
    org: "Company Name",
    period: "2024 — Present",
    description:
      "What you owned, what you shipped, and the impact it had. One or two sentences is plenty.",
  },
  {
    role: "Software Engineer Intern",
    org: "Company Name",
    period: "2023 — 2024",
    description:
      "Same idea — concrete, specific, outcome-focused.",
  },
  {
    role: "B.S. Computer Science",
    org: "University Name",
    period: "2020 — 2024",
    description: "Relevant coursework, honors, or activities worth a mention.",
  },
];
