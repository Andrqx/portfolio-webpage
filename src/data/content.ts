export const profile = {
  name: "Andrew Evans",
  role: "Mechanical Engineer",
  tagline: "I build machines that perform.",
  bio: "I'm a mechanical engineering student at McMaster University, currently leading the chassis and composites program for Mac Formula Electric while working across manufacturing, defense mobility systems, and infrastructure. I like problems where structural performance, weight, and manufacturability all pull in different directions — and where the fix has to survive contact with a dyno, a torsion rig, or a shop floor. Open to co-op opportunities from September 2026 through September 2027.",
  location: "Hamilton, ON, Canada",
  email: "evansa25@mcmaster.ca",
  socials: [{ label: "LinkedIn", href: "https://linkedin.com/in/your-username" }],
};

export const skills = [
  "SolidWorks",
  "Ansys FEA",
  "Siemens NX",
  "GD&T",
  "DFM",
  "Composite Design",
  "Root Cause Analysis",
  "Power BI",
  "Excel / VBA",
  "Manufacturing",
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
    title: "Carbon Fiber Monocoque & Chassis",
    description:
      "Led design and manufacturing of the chassis subsystems for Mac Formula Electric's 20-engineer team, driving a 20% weight reduction while validating the FE model against physical torsional stiffness testing to within 8% error.",
    tags: ["SolidWorks", "Composite Design", "Ansys FEA"],
    year: "2025",
  },
  {
    title: "Firewall Redesign for Manufacturability",
    description:
      "Optimized the vehicle's firewall design for manufacturability, cutting weight by 31% using SolidWorks modeling and Ansys FEA simulations to validate the new design against structural requirements.",
    tags: ["SolidWorks", "Ansys FEA", "DFM"],
    year: "2024",
  },
  {
    title: "Damper Line Part Buffer Cart",
    description:
      "Designed, material-selected, and fabricated a part buffer cart that decouples a robotic station from downstream assembly on a new damper production line, protecting cycle times during robot downtime.",
    tags: ["Manufacturing", "Tooling Design", "DFM"],
    year: "2026",
  },
  {
    title: "Bilge Adapter & Weight Verification Tool",
    description:
      "Supported bilge adapter design in Siemens NX for water evacuation testing and built an automated weight verification tool that integrates real part data for precise vehicle mass compliance.",
    tags: ["Siemens NX", "GD&T", "Excel / VBA"],
    year: "2025",
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
    role: "Ride Dynamics Manufacturing Intern",
    org: "Multimatic",
    period: "May 2026 — Present",
    description:
      "Ran cycle time studies and designed custom tooling for a new damper line, performed root cause failure analysis on dyno-failed dampers, and built a part buffer cart to protect line cycle times during robot downtime.",
  },
  {
    role: "Chassis Lead Engineer",
    org: "Mac Formula Electric",
    period: "June 2025 — Present",
    description:
      "Leading the carbon fiber monocoque and chassis subsystems for a 20-engineer team, driving a 20% chassis weight reduction while mentoring members in SolidWorks and composite design.",
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
    role: "Chassis Engineer",
    org: "Mac Formula Electric",
    period: "Feb 2024 — June 2025",
    description:
      "Optimized the vehicle's firewall design for manufacturability, achieving a 31% weight reduction using SolidWorks and Ansys FEA simulations to validate the new design.",
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
