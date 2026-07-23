export const profile = {
  name: "Andrew Evans",
  role: "Mechanical Engineer",
  tagline: "I build machines that perform.",
  bio: "Hey! I'm Andrew, I've completed my 3rd year of mechanical engineering and I'm off on my year for co-op. I'm available to work from Sept 2026-2027. I'd love to chat about my experiences, just reach out!",
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
};

export const projects: Project[] = [
  {
    slug: "carbon-fiber-monocoque-chassis",
    title: "Carbon Fiber Monocoque & Chassis",
    team: "FSAE",
    period: "June 2025 — Present",
    description:
      "Leading the carbon fiber monocoque and chassis subsystems for a 20-engineer team, driving a 20% weight reduction while validating structural performance.",
    detail: [
      "As Chassis Lead Engineer for Mac Formula Electric, I own the carbon fiber monocoque and chassis subsystems for a 20-engineer team — from composite layup strategy through structural validation.",
      "This cycle's redesign cut chassis weight by 20% while preserving the majority of structural integrity, and I mentored team members in SolidWorks and composite design along the way.",
      "Working with the capstone team, we validated the chassis FE model against physical torsional stiffness testing, achieving within 8% simulation-to-test error using measured composite material data.",
    ],
    tags: ["SolidWorks", "Ansys ACP", "Ansys FEA"],
  },
  {
    slug: "firewall-dfm-redesign",
    title: "Firewall Redesign for Manufacturability",
    team: "FSAE",
    period: "Feb 2024 — June 2025",
    description:
      "Optimized the vehicle's firewall design for manufacturability, cutting weight by 31% using SolidWorks and Ansys FEA.",
    detail: [
      "As Chassis Engineer, I optimized the vehicle's firewall design for manufacturability (DFM), identifying opportunities to simplify geometry and reduce material without compromising protection.",
      "Using SolidWorks for modeling and Ansys FEA to validate the new design against structural requirements, the redesign achieved a 31% weight reduction.",
    ],
    tags: ["SolidWorks", "Ansys FEA", "DFM"],
  },
  {
    slug: "damper-line-cycle-time-tooling",
    title: "Damper Line Cycle Time & Custom Tooling",
    team: "Multimatic",
    period: "May 2026 — Present",
    description:
      "Ran cycle time studies and designed custom tooling for a new second-generation damper line for GM light duty trucks.",
    detail: [
      "Ahead of a new second-generation damper line launch for GM light duty trucks, I ran cycle time studies and designed custom tooling to support the assembly process.",
      "I also reported control faults found in BOS Systems' assembly machines, helping the line launch with fewer surprises.",
    ],
    tags: ["Manufacturing", "Tooling Design", "Cycle Time Studies"],
  },
  {
    slug: "dyno-failure-root-cause-analysis",
    title: "Dyno Failure Root Cause Analysis",
    team: "Multimatic",
    period: "May 2026 — Present",
    description:
      "Performed root cause failure analysis on 5 dampers that failed dyno validation during pre-production testing.",
    detail: [
      "Five dampers failed dyno validation during pre-production testing. I measured critical dimensions and tolerances across each unit to isolate the components driving failure.",
      "That analysis informed the corrective action taken before the line moved forward, reducing the risk of the same failure recurring at volume.",
    ],
    tags: ["Root Cause Analysis", "GD&T", "Manufacturing"],
  },
  {
    slug: "damper-line-part-buffer-cart",
    title: "Damper Line Part Buffer Cart",
    team: "Multimatic",
    period: "May 2026 — Present",
    description:
      "Designed, material-selected, and fabricated a part buffer cart that protects cycle times during robot downtime.",
    detail: [
      "To protect the damper line from robot downtime, I designed, material-selected, and fabricated a part buffer cart that decouples the upstream robotic station from downstream manual assembly.",
      "The cart stores surplus parts so the line can keep flowing even when the upstream robot goes down, sustaining cycle times instead of stalling the whole line.",
    ],
    tags: ["Manufacturing", "Tooling Design", "DFM"],
  },
  {
    slug: "hull-assembly-design-solutions",
    title: "Hull Assembly Design Solutions",
    team: "General Dynamics",
    period: "May 2025 — Aug 2025",
    description:
      "Resolved high-priority assembly issues by engineering design solutions in Siemens NX.",
    detail: [
      "I resolved high-priority assembly issues by engineering design solutions in Siemens NX, collaborating across Hull Additions, Propulsion, and manufacturing teams.",
      "The goal on every fix was the same: an integrated, production-ready solution — not a patch that just moved the problem downstream.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "bilge-adapter-design",
    title: "Bilge Adapter Design for Water Evacuation Testing",
    team: "General Dynamics",
    period: "May 2025 — Aug 2025",
    description:
      "Aided bilge adapter design in Siemens NX for water evacuation testing, applying GD&T and verifying prototype testing.",
    detail: [
      "I supported bilge adapter design in Siemens NX for water evacuation testing, applying GD&T to keep the design within tolerance across manufacturing and assembly.",
      "I also verified the design through prototype testing, confirming it performed as intended before sign-off.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "automated-weight-verification-tool",
    title: "Automated Weight Verification Tool",
    team: "General Dynamics",
    period: "May 2025 — Aug 2025",
    description:
      "Built an automated weight verification tool that integrated real part data into Excel for precise mass roll-ups.",
    detail: [
      "I built an automated weight verification tool that pulled real part data directly into Excel, enabling precise mobility assembly mass roll-ups.",
      "This improved the accuracy of vehicle weight compliance reporting and cut down the manual effort needed to keep it up to date.",
    ],
    tags: ["Excel / VBA", "GD&T"],
  },
  {
    slug: "gear-oil-durability-test-sow",
    title: "Gear Oil Durability Test Specification",
    team: "General Dynamics",
    period: "May 2025 — Aug 2025",
    description:
      "Authored a Statement of Work specifying ASME and ISO durability tests to validate new gear oils.",
    detail: [
      "I authored a Statement of Work specifying ASME and ISO durability tests to validate new gear oils being considered for mobility systems.",
      "The test plan directly addressed known failure risks — seal wear and carbon buildup — to make sure any new oil met performance requirements before it reached the field.",
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
    period: "June 2026 — Present",
    description:
      "Just joined the powertrain electromechanical subteam and ramping up — moving from three years on chassis and composites into the systems that put power to the wheels.",
  },
  {
    role: "Ride Dynamics Manufacturing Intern",
    org: "Multimatic",
    period: "May 2026 — Present",
    description:
      "Ran cycle time studies and designed custom tooling for a new damper line, performed root cause failure analysis on dyno-failed dampers, and built a part buffer cart to protect line cycle times during robot downtime.",
  },
  {
    role: "Chassis Lead Engineer",
    org: "Mac Formula Electric",
    period: "June 2025 — June 2026",
    description:
      "Led the carbon fiber monocoque and chassis subsystems for a 20-engineer team, driving a 20% chassis weight reduction while mentoring members in SolidWorks and composite design.",
  },
  {
    role: "Mobility Systems Design Engineer Intern",
    org: "General Dynamics",
    period: "May 2025 — Aug 2025",
    description:
      "Resolved high-priority assembly issues in Siemens NX, built an automated weight verification tool for vehicle mass roll-ups, and authored a Statement of Work specifying durability tests for new gear oils.",
  },
  {
    role: "Project Engineering Intern",
    org: "Town of Ajax",
    period: "May 2024 — Aug 2024",
    description:
      "Reduced costs by 14% on a $3M infrastructure budget through resource calibration and cost-saving analysis, and conducted quality inspections against engineering drawings and standards.",
  },
  {
    role: "Data Analytics Intern",
    org: "Nokia",
    period: "July 2022 — Aug 2022",
    description:
      "Built interactive Power BI dashboards visualizing key network performance indicators and automated Excel reporting, cutting manual processing time by 40%.",
  },
  {
    role: "B.Eng. Mechanical Engineering",
    org: "McMaster University",
    period: "Expected May 2028",
    description:
      "Chassis lead for Mac Formula Electric, McMaster's Formula SAE Electric racing team.",
  },
];
