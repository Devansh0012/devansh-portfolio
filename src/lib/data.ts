export type SkillCategory = {
  title: string;
  items: string[];
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  achievements: string[];
  tech: string[];
  url?: string;
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  link: string;
  highlight?: string;
};

export type Testimonial = {
  name: string;
  title: string;
  quote: string;
  avatar?: string;
};

export type OpenSource = {
  repo: string;
  description: string;
  contribution: string;
  link: string;
};

export type Metric = {
  label: string;
  value: string;
  sublabel: string;
};

export type TimelineEntry = {
  id: string;
  title: string;
  timestamp: string;
  body: string;
  tags: string[];
};

export const heroHighlights: Metric[] = [
  { label: "Production Deployments", value: "30+", sublabel: "Ship fast, ship safely" },
  { label: "Hackathon Wins", value: "2", sublabel: "Across national events" },
  { label: "Requests / day", value: "10K+", sublabel: "Systems kept resilient" },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    items: ["Python", "Go", "TypeScript", "C++", "SQL"],
  },
  {
    title: "Frameworks",
    items: ["Next.js", "Django", "FastAPI", "React", "Tailwind"],
  },
  {
    title: "Cloud & Infra",
    items: ["AWS", "GCP", "Docker", "Render"],
  },
  {
    title: "Data & Messaging",
    items: ["Postgres", "MongoDB", "Redis", "GraphQL"],
  },
];

export const experiences: Experience[] = [
  {
    company: "Docxster",
    role: "Software Development Engineer",
    start: "Dec 2024",
    end: "Present",
    location: "Bengaluru, India",
    summary:
      "Designing and scaling the automation platform powering hundreds of enterprise workflows.",
    achievements: [
      "Architected and developed Docxster Drive, a cloud storage platform with advanced file management, sharing capabilities.",
      "Built intelligent search engine using Meilisearch and Google OCR achieving full-text search across all file types with typo-tolerance.",
      "Designed multilingual document processing service integrating Google Document AI and Amazon Textract, optimizing structure and cutting processing cost by 45%.",
    ],
    tech: ["Go", "TypeScript", "Python", "Postgres", "Redis", "AWS"],
    url: "https://docxster.com",
  },
  {
    company: "Gaatha - A Tale of Crafts",
    role: "Research and Development Intern",
    start: "Dec 2023",
    end: "Jan 2024",
    location: "Remote",
    summary:
      "Managed wordpress platform and developed custom plugins to enhance site functionality and user engagement.",
    achievements: [
      "Implemented geo-targeted content delivery system, serving personalized experiences to 10k+ monthly users.",
      "Optimized WordPress site performance, achieving 15% faster load times via image compression and lazy loading.",
    ],
    tech: ["WordPress", "PHP", "Google API"],
  },
];

export const projects: Project[] = [
  {
    title: "Violence Detection System",
    description:
      "Developed a system to detect physical violence and alert authorities.",
    tech: ["Python", "Next.js", "MobileNetV2", "S3"],
    link: "https://violence-detection-tan.vercel.app/",
    highlight: "Used Websockets for real-time system integration with webcams and RTSP protocol for modular CCTV cameras.",
  },
  {
    title: "LAN File Sharing App",
    description:
      "Self-hosted tool for instantly broadcasting files within local networks with chunked uploads and live progress.",
    tech: ["Python", "Flask", "WebSockets", "Docker"],
    link: "https://github.com/Devansh0012/LANfile",
  },
  {
    title: "SDG Education Platform",
    description:
      "Built interactive games for personalized learning, selected among top 0.1% globally.",
    tech: ["React.js", "Django", "Tailwind"],
    link: "https://nasa-space-challenge24.vercel.app",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Jishnu NP",
    title: "CTO, Docxster",
    quote:
      "Devansh pairs deep systems intuition with bias for action. He rewired our ingestion pipeline in days and it has held strong for months.",
  },
  {
    name: "Rupali Bora",
    title: "Professor, KKWIEER",
    quote:
      "He communicates complex technical tradeoffs with clarity and ensures teams stay focused on mission outcomes.",
  },
];

// export const openSource: OpenSource[] = [
//   {
//     repo: "open-sauced/pizza",
//     description: "Telemetry collector for OSS maintainers.",
//     contribution: "Implemented deterministic job scheduling and test harness improvements.",
//     link: "https://github.com/open-sauced/pizza",
//   },
//   {
//     repo: "OpenAISpaceApps/mission-control",
//     description: "Toolkit for visualising NASA datasets in real time.",
//     contribution: "Added offline-first caching and improved data lineage visualisations.",
//     link: "https://github.com/OpenAISpaceApps/mission-control",
//   },
// ];

export const timeline: TimelineEntry[] = [
  {
    id: "deploy-0154",
    title: "Deployed rate limiter v3",
    timestamp: "2025-08-14 22:17 UTC",
    body:
      "Refactored the flag evaluation pipeline to cut decision latency to 12ms at p95. Rolled out gradually using feature flags.",
    tags: ["deploy", "backend"],
  },
  {
    id: "incident-042",
    title: "Mitigated webhook storm",
    timestamp: "2025-05-03 04:02 UTC",
    body:
      "Spotted and throttled a rogue partner integration spamming 70k req/min, introduced adaptive back-pressure controls.",
    tags: ["incident", "resilience"],
  },
  {
    id: "talk-nyc",
    title: "Spoke at Serverless NYC",
    timestamp: "2024-11-20 18:30 UTC",
    body:
      "Gave a talk on building observable event-driven systems with Go + OpenTelemetry. Shared battle stories from Docxster.",
    tags: ["talk", "community"],
  },
  {
    id: "ship-playground",
    title: "Shipped chaos engineering playground",
    timestamp: "2024-07-05 09:12 UTC",
    body:
      "Released internal tool to simulate cascading failures. Helped teams rehearse incident response before Black Friday.",
    tags: ["tooling", "platform"],
  },
];

export const communityMetrics: Metric[] = [
  { label: "Developer Community Lead", value: "400+", sublabel: "President of Developer Community" },
  { label: "Talks & Workshops", value: "18", sublabel: "Shared lessons in college" },
  { label: "Problem Solving", value: "500+", sublabel: "Across platforms like GeeksforGeeks and LeetCode" },
];
