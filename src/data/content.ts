export const profile = {
  name: "Andrew Evans",
  role: "Mechanical Engineer",
  heroIntro: {
    greeting: "Hey",
    greetingFollowup: "Nice to meet you",
    lines: ["Wanna learn more about me?", "Just scroll down"],
  },
  bio: "Hey! I'm Andrew, a 3rd year mechanical engineering student currently on my work term, available to work Sept 2026 to 2027. I'd love to chat about my experience, so reach out!",
  location: "Toronto, ON, Canada",
  school: "McMaster University",
  gradDate: "May 2028",
  email: "evansa25@mcmaster.ca",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/andrew-evans-255366248/" },
  ],
};

export const skills = [
  "SolidWorks",
  "Ansys FEA",
  "Ansys ACP",
  "Siemens NX",
  "GD&T",
  "DFM",
  "Composite Design",
  "Root Cause Analysis",
  "Power BI",
  "Excel / VBA",
  "Manufacturing",
];

export type TeamKey = "FSAE" | "Multimatic" | "General Dynamics";

export const teams: { key: TeamKey; label: string; org: string }[] = [
  { key: "FSAE", label: "FSAE", org: "Mac Formula Electric" },
  { key: "Multimatic", label: "Multimatic", org: "Multimatic" },
  { key: "General Dynamics", label: "General Dynamics", org: "General Dynamics" },
];

export type Project = {
  slug: string;
  title: string;
  team: TeamKey;
  period: string;
  description: string;
  detail: string[];
  tags: string[];
  caseStudyHref?: string;
};

export const projects: Project[] = [
  {
    slug: "carbon-fiber-monocoque-chassis",
    title: "Carbon Fiber Monocoque & Chassis",
    team: "FSAE",
    period: "June 2025 - Present",
    description:
      "Leading carbon fiber monocoque and chassis design for a 20 engineer team, cutting weight 20% while validating structural performance.",
    detail: [
      "As Chassis Lead Engineer for Mac Formula Electric, I run chassis and monocoque design for a 20 engineer team, from layup strategy through structural validation.",
      "This redesign cut chassis weight 20% while keeping most of the structural integrity, and I mentored teammates in SolidWorks and composite design along the way.",
      "With the capstone team, I validated the chassis FE model against physical torsional stiffness testing, landing within 13.3% of the measured result using our own material data.",
    ],
    tags: ["SolidWorks", "Ansys ACP", "Ansys FEA"],
    caseStudyHref: "/work/chassis-torsional-fe-validation",
  },
  {
    slug: "firewall-dfm-redesign",
    title: "Firewall Redesign for Manufacturability",
    team: "FSAE",
    period: "Feb 2024 - June 2025",
    description:
      "Redesigned the vehicle's firewall for manufacturability, cutting weight 31% using SolidWorks and Ansys FEA.",
    detail: [
      "As Chassis Engineer, I redesigned the firewall for manufacturability (DFM), simplifying the geometry and cutting material without giving up protection.",
      "I modeled it in SolidWorks and validated the new design in Ansys FEA, landing a 31% weight reduction.",
    ],
    tags: ["SolidWorks", "Ansys FEA", "DFM"],
  },
  {
    slug: "damper-line-cycle-time-tooling",
    title: "Damper Line Cycle Time & Custom Tooling",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Ran cycle time studies and designed custom tooling for a new second gen damper line for GM light duty trucks.",
    detail: [
      "Ahead of a new second gen damper line launch for GM light duty trucks, I ran cycle time studies and designed custom tooling for the assembly process.",
      "I also flagged control faults in BOS Systems' assembly machines, so the line launched with fewer surprises.",
    ],
    tags: ["Manufacturing", "Tooling Design", "Cycle Time Studies"],
  },
  {
    slug: "dyno-failure-root-cause-analysis",
    title: "Dyno Failure Root Cause Analysis",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Ran root cause analysis on 5 dampers that failed dyno validation during preproduction testing.",
    detail: [
      "Five dampers failed dyno validation during preproduction testing. I measured critical dimensions and tolerances on each unit to find what was driving the failure.",
      "That analysis shaped the fix before the line moved forward, lowering the risk of it happening again at volume.",
    ],
    tags: ["Root Cause Analysis", "GD&T", "Manufacturing"],
  },
  {
    slug: "damper-line-part-buffer-cart",
    title: "Damper Line Part Buffer Cart",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Designed, selected materials for, and built a part buffer cart that protects cycle times during robot downtime.",
    detail: [
      "To protect the damper line from robot downtime, I designed and built a part buffer cart that decouples the upstream robot station from downstream manual assembly.",
      "The cart stores surplus parts so the line keeps flowing even when the upstream robot goes down, instead of stalling out.",
    ],
    tags: ["Manufacturing", "Tooling Design", "DFM"],
  },
  {
    slug: "hull-assembly-design-solutions",
    title: "Hull Assembly Design Solutions",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Resolved high priority assembly issues with design solutions engineered in Siemens NX.",
    detail: [
      "I resolved high priority assembly issues in Siemens NX, working across Hull Additions, Propulsion, and manufacturing teams.",
      "The goal on every fix was the same: an integrated, production ready solution, not just a patch that pushed the problem downstream.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "bilge-adapter-design",
    title: "Bilge Adapter Design for Water Evacuation Testing",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Supported bilge adapter design in Siemens NX for water evacuation testing, applying GD&T and verifying it through prototype testing.",
    detail: [
      "I supported bilge adapter design in Siemens NX for water evacuation testing, applying GD&T to keep it within tolerance through manufacturing and assembly.",
      "I also verified it through prototype testing to confirm it performed as intended before sign off.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "automated-weight-verification-tool",
    title: "Automated Weight Verification Tool",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Built an automated tool that pulls real part data into Excel for precise weight verification and mass roll ups.",
    detail: [
      "I built an automated tool that pulls real part data into Excel for precise mobility assembly mass roll ups.",
      "This improved the accuracy of vehicle weight compliance reporting and cut the manual effort needed to keep it current.",
    ],
    tags: ["Excel / VBA", "GD&T"],
  },
  {
    slug: "gear-oil-durability-test-sow",
    title: "Gear Oil Durability Test Specification",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Authored a Statement of Work specifying ASME/ISO durability tests for new gear oils.",
    detail: [
      "I authored a Statement of Work specifying ASME/ISO durability tests to validate new gear oils for mobility systems.",
      "The test plan addressed known failure risks, like seal wear and carbon buildup, so any new oil had to meet performance requirements before reaching the field.",
    ],
    tags: ["ASME", "ISO", "Root Cause Analysis"],
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
    role: "Powertrain Electromechanical Member",
    org: "Mac Formula Electric",
    period: "June 2026 - Present",
    description:
      "Just joined the powertrain electromechanical subteam, moving from three years on chassis and composites into the systems that put power down.",
  },
  {
    role: "Ride Dynamics Manufacturing Intern",
    org: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Ran cycle time studies and custom tooling for a new damper line, root caused dyno failed dampers, and built a part buffer cart to protect cycle times during robot downtime.",
  },
  {
    role: "Chassis Lead Engineer",
    org: "Mac Formula Electric",
    period: "June 2025 - June 2026",
    description:
      "Led the carbon fiber monocoque and chassis subsystems for a 20 engineer team, cutting chassis weight 20% while mentoring teammates in SolidWorks and composite design.",
  },
  {
    role: "Mobility Systems Design Engineer Intern",
    org: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Resolved high priority assembly issues in Siemens NX, built an automated weight verification tool for mass roll ups, and wrote a Statement of Work for new gear oil durability tests.",
  },
  {
    role: "Project Engineering Intern",
    org: "Town of Ajax",
    period: "May 2024 - Aug 2024",
    description:
      "Cut costs 14% on a $3M infrastructure budget through resource calibration and cost analysis, and ran quality inspections against engineering drawings and standards.",
  },
  {
    role: "Data Analytics Intern",
    org: "Nokia",
    period: "July 2022 - Aug 2022",
    description:
      "Built interactive Power BI dashboards for key network performance indicators and automated Excel reporting, cutting manual processing time 40%.",
  },
];
