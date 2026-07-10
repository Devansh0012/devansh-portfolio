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
  link?: string;
};

export type Education = {
  degree: string;
  institution: string;
  university: string;
  graduation: string;
  highlights: string[];
};

export type Demo = {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  tech: string[];
};

export const heroHighlights: Metric[] = [
  { label: "Engineering Focus", value: "AI Infrastructure", sublabel: "Gateways, protocols, and distributed systems" },
  { label: "NASA Space Apps", value: "Global Nominee", sublabel: "Lead developer" },
  { label: "GATE", value: "Qualified", sublabel: "GATE 2024" },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    items: ["Go", "TypeScript", "Python", "Java", "C++", "JavaScript", "SQL"],
  },
  {
    title: "Backend & Frameworks",
    items: ["Fastify", "Fiber", "FastAPI", "Flask", "Django", "Next.js", "React"],
  },
  {
    title: "AI Gateway & Protocols",
    items: ["MCP", "OAuth 2.1", "OpenID Connect", "AWS Bedrock", "Google Vertex AI"],
  },
  {
    title: "Cloud, Data & Infrastructure",
    items: ["Kubernetes", "Docker", "Helm", "Cloudflare", "Nginx", "Postgres", "Redis", "MySQL"],
  },
];

export const education: Education[] = [
  {
    degree: "B.E. in Information Technology",
    institution: "K.K. Wagh Institute of Engineering Education & Research",
    university: "Savitribai Phule Pune University",
    graduation: "2025",
    highlights: ["GATE 2024 qualified", "First Class with Distinction", "President of Developer Community"],
  },
];

export const experiences: Experience[] = [
  {
    company: "Palo Alto Networks (Portkey AI)",
    role: "Software Engineer",
    start: "Mar 2026",
    end: "Present",
    location: "Bengaluru, India",
    summary:
      "Joined Portkey AI to build its AI and MCP gateways, and now continue that work at Palo Alto Networks following the acquisition.",
    achievements: [
      "Build and maintain backend services for AI gateway and MCP infrastructure used by production applications.",
      "Develop provider integrations across routing, authentication, configuration, and model lifecycle workflows.",
      "Improve platform reliability through stronger OAuth flows, caching, observability, and protocol interoperability.",
      "Collaborate across gateway, control-plane, and developer-experience surfaces to deliver secure AI infrastructure.",
    ],
    tech: ["TypeScript", "Node.js", "MCP", "OAuth 2.1", "Redis", "Kubernetes", "AWS Bedrock"],
    url: "https://portkey.ai",
  },
  {
    company: "Docxster",
    role: "Associate Software Engineer",
    start: "Dec 2024",
    end: "Mar 2026",
    location: "Bengaluru, India",
    summary:
      "Converted from Software Development Intern to Associate Software Engineer while building document automation systems across backend, ML, and frontend surfaces.",
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
    title: "MCP Gateway Infrastructure",
    description:
      "Backend infrastructure for securely connecting AI applications with enterprise tools through the Model Context Protocol.",
    tech: ["TypeScript", "Node.js", "MCP", "OAuth 2.1", "PKCE", "Redis"],
    link: "https://portkey.ai",
    highlight:
      "Focused on authentication, session management, discovery, and reliable communication between clients and tool servers.",
  },
  {
    title: "AI Gateway Provider Integrations",
    description:
      "Production integrations that provide a consistent gateway interface across major model and cloud providers.",
    tech: ["TypeScript", "AWS Bedrock", "Claude", "Google Vertex AI", "Zod"],
    link: "https://portkey.ai",
    highlight:
      "Worked across routing, authentication, configuration, streaming, and provider-specific compatibility.",
  },
  {
    title: "Gateway Reliability & Authentication",
    description:
      "Reliability and security improvements for authentication, caching, observability, and long-lived gateway sessions.",
    tech: ["MCP", "OAuth 2.1", "Redis", "Node.js", "OpenTelemetry"],
    link: "https://portkey.ai",
    highlight:
      "Designed for interoperability with enterprise identity systems and resilience under production traffic.",
  },
  {
    title: "NASA Space Apps Challenge",
    description:
      "Led development of an interactive education platform selected as a NASA Space Apps Global Nominee.",
    tech: ["React", "Django", "Tailwind CSS", "Product Engineering"],
    link: "https://nasa-space-challenge24.vercel.app",
    highlight: "Served as lead developer and advanced to Global Nominee status.",
  },
  {
    title: "Violence Detection System",
    description:
      "Real-time physical-violence detection and alerting system designed for webcam and modular CCTV feeds.",
    tech: ["PyTorch", "OpenCV", "FastAPI", "React", "WebSockets", "RTSP"],
    link: "https://violence-detection-tan.vercel.app/",
    highlight:
      "Combined ML inference with WebSocket updates and RTSP camera support for real-time monitoring.",
  },
  {
    title: "Document Schema Builder",
    description:
      "AI-powered document processing system that automatically discovers document types, extracts structured data with OCR, and validates schemas before deployment.",
    tech: ["TypeScript", "Fastify", "React", "Gemini AI", "Google Document AI", "Meilisearch"],
    link: "/blog/document-schema-builder",
    highlight: "Processes 30 pages in single batch with intelligent schema merging. Features innovative Test Document workflow for validating field extraction before publishing.",
  },
  {
    title: "Docxster Drive",
    description:
      "Enterprise-grade cloud storage platform with advanced file management, OCR processing, full-text search, and real-time collaboration capabilities.",
    tech: ["TypeScript", "Fastify", "React", "PostgreSQL", "AWS S3", "Meilisearch", "Socket.IO"],
    link: "/blog/docxster-drive-architecture",
    highlight: "Handles 10k+ requests/day with 3-step upload process, automatic OCR indexing, and coordinate-based document annotation. Reduced storage costs by 45% with smart deduplication.",
  },
  {
    title: "File Compressor",
    description:
      "Multi-format compression tool supporting images, videos, audio, and PDFs with quality-based, size-based, and percentage reduction strategies.",
    tech: ["Python", "FastAPI", "React", "TypeScript", "FFmpeg", "Tailwind"],
    link: "https://github.com/Devansh0012/file-compressor",
    highlight: "Drag-and-drop interface with real-time processing feedback. Handles files up to 500MB with automatic cleanup and comprehensive file validation.",
  },
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

export const timeline: TimelineEntry[] = [
  {
    id: "mcp-reliability",
    title: "Strengthened MCP gateway reliability",
    timestamp: "2026",
    body:
      "Improved protocol interoperability, session handling, and error recovery for enterprise tool integrations.",
    tags: ["mcp", "reliability", "backend"],
  },
  {
    id: "oauth-platform",
    title: "Expanded enterprise authentication support",
    timestamp: "2026",
    body:
      "Worked on OAuth-based integrations, token lifecycle management, and compatibility with enterprise identity systems.",
    tags: ["oauth", "security", "platform"],
  },
  {
    id: "provider-integrations",
    title: "Extended AI provider coverage",
    timestamp: "2026",
    body:
      "Built consistent routing, configuration, and streaming behavior across cloud and model providers.",
    tags: ["ai-gateway", "providers", "backend"],
  },
  {
    id: "gateway-observability",
    title: "Improved gateway observability",
    timestamp: "2026",
    body:
      "Added privacy-conscious telemetry and operational signals for debugging and monitoring production traffic.",
    tags: ["observability", "privacy", "platform"],
  },
];

export const communityMetrics: Metric[] = [
  { label: "Developer Community Lead", value: "400+", sublabel: "President of Developer Community" },
  { label: "Talks & Workshops", value: "18", sublabel: "Shared lessons in college" },
  { label: "Problem Solving", value: "500+", sublabel: "Across platforms like GeeksforGeeks and LeetCode" },
];

export const demos: Demo[] = [
  {
    id: "sorting-visualizer",
    title: "Sorting Algorithm Visualizer",
    description: "Watch sorting algorithms come to life with animated visualizations. Compare Bubble Sort, Quick Sort, and Merge Sort performance.",
    category: "Algorithms",
    path: "/demos/sorting",
    tech: ["React", "TypeScript", "Animation"],
  },
  {
    id: "bst-visualizer",
    title: "Binary Search Tree Visualizer",
    description: "Interactive BST operations including insert, delete, and traversals (in-order, pre-order, post-order) with step-by-step visualization.",
    category: "Data Structures",
    path: "/demos/bst",
    tech: ["React", "TypeScript", "SVG"],
  },
  {
    id: "rate-limiter",
    title: "Rate Limiter Simulator",
    description: "Understand rate limiting strategies including Token Bucket, Leaky Bucket, and Fixed Window algorithms with real-time visualization.",
    category: "Systems",
    path: "/demos/rate-limiter",
    tech: ["React", "TypeScript", "Systems Design"],
  },
  {
    id: "fourier-visualizer",
    title: "Fourier Series Visualizer",
    description: "Draw, type, or upload — watch rotating epicycles reconstruct any shape with live DFT coefficients computed in your browser.",
    category: "Math",
    path: "/demos/fourier",
    tech: ["React", "Canvas", "DFT", "TypeScript"],
  },
  {
    id: "ulam-spiral",
    title: "3D Ulam Spiral",
    description: "Plot integers along a square, helix, or Sacks spiral and watch primes light up — revealing the surprising diagonal patterns in prime distribution.",
    category: "Math",
    path: "/demos/ulam-spiral",
    tech: ["React", "Three.js", "R3F", "Number Theory"],
  },
];
