/**
 * Polymath Data - Foundational types and data for multi-domain content
 * Covers: History, Economics, Physics, Sports, Tech, General Knowledge
 */

// ==================== Type Definitions ====================

export type FactCategory =
  | "history"
  | "economics"
  | "physics"
  | "sports"
  | "technology"
  | "general";

export type PolymathFact = {
  id: string;
  category: FactCategory;
  title: string;
  description: string;
  date?: string; // For "On This Day" facts
  source?: string;
  tags: string[];
  relatedInterests: FactCategory[];
};

export type HistoricalEvent = {
  id: string;
  year: number;
  month?: number;
  day?: number;
  title: string;
  description: string;
  category: "tech" | "history" | "personal" | "science" | "economics";
  significance: "low" | "medium" | "high" | "critical";
  icon?: string;
  link?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: FactCategory;
  description: string;
  coverUrl?: string;
  status: "read" | "reading" | "want-to-read";
  rating?: number; // 1-5
  notes?: string;
  keyTakeaways: string[];
  amazonLink?: string;
};

export type TriviaQuestion = {
  id: string;
  category: FactCategory;
  difficulty: "easy" | "medium" | "hard" | "expert";
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  points: number;
  tags: string[];
};

export type KnowledgeNode = {
  id: string;
  label: string;
  category: FactCategory;
  description: string;
  icon: string;
  color: string;
  connections: string[]; // IDs of connected nodes
  facts: string[]; // IDs of related facts
  position?: { x: number; y: number }; // For graph layout
};

export type PhysicsDemo = {
  id: string;
  title: string;
  description: string;
  concept: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  codingAnalogy?: string;
  interactive: boolean;
  tags: string[];
};

export type EconomicMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  changePercent?: number;
  description: string;
  visualType: "line" | "bar" | "pie" | "gauge";
};

export type SportsAchievement = {
  id: string;
  achievement: string;
  category: "hackathons" | "projects" | "contributions" | "learning";
  stat: string;
  statValue: number | string;
  rank?: string;
  date: string;
  icon: string;
  comparison?: string; // Sports analogy
};

// ==================== Polymath Facts Database ====================

export const polymathFacts: PolymathFact[] = [
  // History
  {
    id: "hist-001",
    category: "history",
    title: "First Computer Bug",
    description: "On September 9, 1947, Grace Hopper found an actual moth causing issues in the Harvard Mark II computer, coining the term 'debugging'.",
    date: "09-09",
    source: "Naval History and Heritage Command",
    tags: ["computing", "debugging", "pioneers"],
    relatedInterests: ["technology"],
  },
  {
    id: "hist-002",
    category: "history",
    title: "ARPANET Birth",
    description: "On October 29, 1969, the first message was sent over ARPANET between UCLA and Stanford, marking the birth of the internet. The message was 'LO' - they were trying to send 'LOGIN' but the system crashed.",
    date: "10-29",
    tags: ["internet", "networking", "innovation"],
    relatedInterests: ["technology"],
  },
  {
    id: "hist-003",
    category: "history",
    title: "Linux Announcement",
    description: "On August 25, 1991, Linus Torvalds announced Linux as 'just a hobby, won't be big and professional'. Today, Linux powers 96.3% of the world's top 1 million servers.",
    date: "08-25",
    tags: ["open-source", "linux", "operating-systems"],
    relatedInterests: ["technology"],
  },

  // Physics
  {
    id: "phys-001",
    category: "physics",
    title: "Quantum Tunneling in CPUs",
    description: "Modern CPUs use transistors so small (~5nm) that quantum tunneling becomes a problem - electrons can 'teleport' through insulating barriers, causing current leakage. Engineers must account for quantum mechanics in chip design.",
    tags: ["quantum", "semiconductors", "computing"],
    relatedInterests: ["technology"],
  },
  {
    id: "phys-002",
    category: "physics",
    title: "Speed of Light Limits Internet",
    description: "The speed of light creates a hard limit on network latency. Even with perfect fiber optics, a signal from New York to Sydney takes at least 106ms due to the 15,989 km distance. This is why CDNs exist.",
    tags: ["networking", "latency", "physics-limits"],
    relatedInterests: ["technology"],
  },
  {
    id: "phys-003",
    category: "physics",
    title: "Cosmic Rays Flip Bits",
    description: "High-energy particles from space can flip bits in computer memory, causing random errors. This is why spacecraft and data centers use ECC memory. In 2003, a cosmic ray caused a voting machine error in Belgium.",
    tags: ["reliability", "hardware", "space"],
    relatedInterests: ["technology"],
  },
  {
    id: "phys-004",
    category: "physics",
    title: "Entropy and Disk Drives",
    description: "Hard drives produce heat when writing data - a fundamental consequence of the second law of thermodynamics. Erasing 1 bit theoretically requires at least kT ln(2) energy, where k is Boltzmann's constant and T is temperature.",
    tags: ["thermodynamics", "storage", "energy"],
    relatedInterests: ["technology"],
  },

  // Economics
  {
    id: "econ-001",
    category: "economics",
    title: "Cost of Technical Debt",
    description: "Studies show that technical debt costs companies 20-40% of their technology budget. For every $1 spent on development, organizations spend $4 fixing issues - a 4:1 'debt interest rate'.",
    tags: ["technical-debt", "productivity", "cost"],
    relatedInterests: ["technology"],
  },
  {
    id: "econ-002",
    category: "economics",
    title: "Open Source Economic Impact",
    description: "The economic value of open source software is estimated at over $400 billion. If companies had to build all OSS from scratch, it would cost 3.5 times more than current development spending.",
    tags: ["open-source", "value", "economics"],
    relatedInterests: ["technology"],
  },
  {
    id: "econ-003",
    category: "economics",
    title: "Cloud Computing ROI",
    description: "Companies save an average of 15% on IT costs by moving to cloud. However, 'cloud waste' (unused resources) accounts for 30% of cloud spend - equivalent to $17.6 billion annually in unused AWS, Azure, and GCP resources.",
    tags: ["cloud", "efficiency", "waste"],
    relatedInterests: ["technology"],
  },
  {
    id: "econ-004",
    category: "economics",
    title: "Opportunity Cost of Downtime",
    description: "For large e-commerce sites, one minute of downtime can cost $9,000 on average. Amazon's Prime Day 2018 crash cost an estimated $100 million in lost sales in just 63 minutes.",
    tags: ["reliability", "sla", "revenue"],
    relatedInterests: ["technology"],
  },

  // Sports
  {
    id: "sport-001",
    category: "sports",
    title: "Cricket Physics",
    description: "A fast bowler's delivery can reach 160 km/h (99 mph). The ball experiences Magnus effect - the same aerodynamic principle that makes airplane wings generate lift - to achieve swing bowling.",
    tags: ["cricket", "aerodynamics", "physics"],
    relatedInterests: ["physics"],
  },
  {
    id: "sport-002",
    category: "sports",
    title: "Sports Analytics Revolution",
    description: "Modern cricket teams use ML models to predict optimal field placements. RCB's 2023 season used AI to analyze 10 years of IPL data, improving bowling strategy efficiency by 23%.",
    tags: ["analytics", "machine-learning", "cricket"],
    relatedInterests: ["technology"],
  },
  {
    id: "sport-003",
    category: "sports",
    title: "Reaction Time Limits",
    description: "Olympic sprinters' reaction times average 0.15-0.2 seconds. Anything faster than 0.1s is considered a false start because human neural transmission can't be that fast - similar to how we optimize for perceived performance in UX.",
    tags: ["performance", "human-limits", "optimization"],
    relatedInterests: ["physics", "technology"],
  },

  // Technology
  {
    id: "tech-001",
    category: "technology",
    title: "Database CAP Theorem",
    description: "Eric Brewer's CAP theorem (2000) proves you can only have 2 of 3: Consistency, Availability, Partition tolerance. This fundamental trade-off shapes modern distributed systems architecture.",
    tags: ["databases", "distributed-systems", "theory"],
    relatedInterests: ["technology"],
  },
  {
    id: "tech-002",
    category: "technology",
    title: "Microservices Economics",
    description: "Amazon found that teams smaller than 'two pizzas can feed' (8-10 people) are 2x more productive. This insight drove their microservices architecture - small teams owning small services.",
    tags: ["architecture", "team-size", "productivity"],
    relatedInterests: ["economics"],
  },
  {
    id: "tech-003",
    category: "technology",
    title: "Git's Directed Acyclic Graph",
    description: "Git uses a DAG (Directed Acyclic Graph) to represent commit history. This graph theory structure enables distributed version control and makes operations like merge and rebase mathematically elegant.",
    tags: ["git", "data-structures", "algorithms"],
    relatedInterests: ["technology"],
  },

  // General Knowledge
  {
    id: "gen-001",
    category: "general",
    title: "Rubber Duck Debugging Origin",
    description: "The technique comes from a story in 'The Pragmatic Programmer' where a programmer carried a rubber duck and debugged code by explaining it line-by-line to the duck. The act of articulation often reveals the solution.",
    tags: ["debugging", "problem-solving", "techniques"],
    relatedInterests: ["technology"],
  },
  {
    id: "gen-002",
    category: "general",
    title: "Moore's Law Economics",
    description: "Gordon Moore predicted transistor count doubling every 2 years. This held for 50 years but is now slowing. The cost of a new chip fab has grown from $1B (2000) to $20B (2024) - exponential complexity cost.",
    tags: ["semiconductors", "scaling", "cost"],
    relatedInterests: ["economics", "technology"],
  },
  {
    id: "gen-003",
    category: "general",
    title: "Hofstadter's Law",
    description: "It always takes longer than you expect, even when you take into account Hofstadter's Law. This recursive definition perfectly captures software estimation challenges.",
    tags: ["estimation", "project-management", "humor"],
    relatedInterests: ["technology"],
  },
];

// ==================== Historical Timeline Events ====================

export const historicalTimeline: HistoricalEvent[] = [
  // Personal + Professional
  {
    id: "personal-001",
    year: 2024,
    month: 12,
    title: "Joined Docxster AI",
    description: "Started as Associate Software Engineer, architecting cloud storage and document processing platforms.",
    category: "personal",
    significance: "high",
    icon: "Briefcase",
  },
  {
    id: "personal-002",
    year: 2025,
    month: 1,
    title: "Won PICT Concepts Hackathon",
    description: "Built winning solution demonstrating innovation in software engineering.",
    category: "personal",
    significance: "high",
    icon: "Trophy",
  },
  {
    id: "personal-003",
    year: 2024,
    month: 10,
    title: "NASA Space Apps Global Nominee",
    description: "Selected among top 0.1% globally for SDG education platform with interactive learning.",
    category: "personal",
    significance: "critical",
    icon: "Rocket",
  },
  {
    id: "personal-004",
    year: 2024,
    month: 3,
    title: "Qualified GATE 2024",
    description: "Qualified Graduate Aptitude Test in Engineering, demonstrating strong fundamentals.",
    category: "personal",
    significance: "medium",
    icon: "Award",
  },

  // Technology History
  {
    id: "tech-001",
    year: 1969,
    month: 10,
    day: 29,
    title: "First ARPANET Message",
    description: "First message sent between UCLA and Stanford, birthing the internet. The message was 'LO' - attempting 'LOGIN' when the system crashed.",
    category: "tech",
    significance: "critical",
    icon: "Network",
    link: "https://en.wikipedia.org/wiki/ARPANET",
  },
  {
    id: "tech-002",
    year: 1991,
    month: 8,
    day: 25,
    title: "Linux Announced",
    description: "Linus Torvalds announced Linux to comp.os.minix newsgroup as 'just a hobby'. Today it powers 96.3% of top servers.",
    category: "tech",
    significance: "critical",
    icon: "Server",
  },
  {
    id: "tech-003",
    year: 2006,
    month: 3,
    day: 14,
    title: "AWS S3 Launched",
    description: "Amazon Web Services launched Simple Storage Service, pioneering cloud infrastructure and changing how we build software.",
    category: "tech",
    significance: "critical",
    icon: "Cloud",
  },
  {
    id: "tech-004",
    year: 2015,
    month: 11,
    day: 30,
    title: "TensorFlow Released",
    description: "Google open-sourced TensorFlow, democratizing machine learning and accelerating AI research globally.",
    category: "tech",
    significance: "high",
    icon: "Brain",
  },
  {
    id: "tech-005",
    year: 2013,
    month: 5,
    day: 27,
    title: "React.js Released",
    description: "Facebook open-sourced React, introducing component-based UI paradigm that transformed frontend development.",
    category: "tech",
    significance: "high",
    icon: "Code",
  },

  // Science & Physics
  {
    id: "sci-001",
    year: 1969,
    month: 7,
    day: 20,
    title: "Moon Landing",
    description: "Apollo 11 landed humans on the moon using computers with 64KB RAM - less than a key fob. Margaret Hamilton's software was critical.",
    category: "science",
    significance: "critical",
    icon: "Rocket",
  },
  {
    id: "sci-002",
    year: 2012,
    month: 7,
    day: 4,
    title: "Higgs Boson Discovered",
    description: "CERN announced discovery of Higgs boson using petabytes of data analysis - physics meets big data.",
    category: "science",
    significance: "critical",
    icon: "Atom",
  },
  {
    id: "sci-003",
    year: 1947,
    month: 12,
    day: 23,
    title: "Transistor Invented",
    description: "Bell Labs invented the transistor, the fundamental building block of all modern computing.",
    category: "science",
    significance: "critical",
    icon: "Cpu",
  },

  // Economics
  {
    id: "econ-001",
    year: 2008,
    month: 9,
    day: 15,
    title: "Lehman Brothers Collapse",
    description: "Financial crisis triggered by software models that underestimated risk. A reminder that code can have global economic impact.",
    category: "economics",
    significance: "critical",
    icon: "TrendingDown",
  },
  {
    id: "econ-002",
    year: 2021,
    month: 4,
    day: 14,
    title: "Coinbase IPO",
    description: "Cryptocurrency exchange went public at $86B valuation, validating blockchain technology's economic potential.",
    category: "economics",
    significance: "high",
    icon: "DollarSign",
  },

  // Historical Context
  {
    id: "hist-001",
    year: 1945,
    month: 8,
    day: 6,
    title: "Atomic Age Begins",
    description: "Nuclear fission demonstrated both physics' power and the responsibility of scientists - relevant to AI ethics today.",
    category: "history",
    significance: "critical",
    icon: "Zap",
  },
  {
    id: "hist-002",
    year: 1989,
    month: 11,
    day: 9,
    title: "Berlin Wall Falls",
    description: "End of Cold War enabled global collaboration in science and technology, accelerating innovation.",
    category: "history",
    significance: "critical",
    icon: "Globe",
  },

  // More Tech Milestones
  {
    id: "tech-006",
    year: 2004,
    month: 2,
    day: 4,
    title: "Facebook Launched",
    description: "Mark Zuckerberg launched 'TheFacebook' from Harvard dorm room, revolutionizing social networking and changing how humanity connects.",
    category: "tech",
    significance: "high",
    icon: "Users",
  },
  {
    id: "tech-007",
    year: 2007,
    month: 6,
    day: 29,
    title: "iPhone Released",
    description: "Apple released the first iPhone, combining phone, iPod, and internet device. It redefined mobile computing and spawned the app economy.",
    category: "tech",
    significance: "critical",
    icon: "Smartphone",
  },
  {
    id: "tech-008",
    year: 2008,
    month: 9,
    day: 2,
    title: "Google Chrome Released",
    description: "Google launched Chrome browser with V8 JavaScript engine, making web applications as fast as desktop apps and enabling the modern web.",
    category: "tech",
    significance: "high",
    icon: "Globe",
  },
  {
    id: "tech-009",
    year: 1995,
    month: 5,
    day: 23,
    title: "Java Released",
    description: "Sun Microsystems released Java 1.0 with 'Write Once, Run Anywhere' promise, revolutionizing cross-platform development.",
    category: "tech",
    significance: "critical",
    icon: "Coffee",
  },
  {
    id: "tech-010",
    year: 2009,
    month: 1,
    day: 3,
    title: "Bitcoin Genesis Block",
    description: "Satoshi Nakamoto mined the first Bitcoin block, creating decentralized digital currency and introducing blockchain technology.",
    category: "tech",
    significance: "high",
    icon: "Bitcoin",
  },
  {
    id: "tech-011",
    year: 2011,
    month: 6,
    day: 9,
    title: "Stripe Founded",
    description: "Patrick and John Collison launched Stripe, making online payments accessible to developers with 7 lines of code.",
    category: "tech",
    significance: "medium",
    icon: "CreditCard",
  },
  {
    id: "tech-012",
    year: 2014,
    month: 6,
    day: 12,
    title: "Docker 1.0 Released",
    description: "Docker revolutionized deployment with containerization, making 'works on my machine' obsolete and enabling microservices.",
    category: "tech",
    significance: "high",
    icon: "Package",
  },
  {
    id: "tech-013",
    year: 2016,
    month: 11,
    day: 30,
    title: "ChatGPT's Predecessor Released",
    description: "OpenAI released GPT-1, the first in the series that would eventually lead to ChatGPT and the AI revolution.",
    category: "tech",
    significance: "high",
    icon: "MessageSquare",
  },
  {
    id: "tech-014",
    year: 1998,
    month: 9,
    day: 4,
    title: "Google Founded",
    description: "Larry Page and Sergey Brin incorporated Google in a garage, implementing PageRank algorithm that would organize the world's information.",
    category: "tech",
    significance: "critical",
    icon: "Search",
  },
  {
    id: "tech-015",
    year: 2001,
    month: 10,
    day: 23,
    title: "iPod Released",
    description: "Apple's '1,000 songs in your pocket' changed music consumption forever and set stage for iPhone.",
    category: "tech",
    significance: "high",
    icon: "Music",
  },

  // More Science Milestones
  {
    id: "sci-004",
    year: 1990,
    month: 4,
    day: 24,
    title: "Hubble Space Telescope Launched",
    description: "NASA launched Hubble, providing humanity unprecedented views of the universe and generating petabytes of astronomical data.",
    category: "science",
    significance: "critical",
    icon: "Telescope",
  },
  {
    id: "sci-005",
    year: 2003,
    month: 4,
    day: 14,
    title: "Human Genome Project Completed",
    description: "International team completed mapping all human genes, opening era of personalized medicine and bioinformatics.",
    category: "science",
    significance: "critical",
    icon: "Dna",
  },
  {
    id: "sci-006",
    year: 2019,
    month: 4,
    day: 10,
    title: "First Black Hole Image",
    description: "Event Horizon Telescope collaboration revealed first image of a black hole, processing 5 petabytes of data from 8 telescopes worldwide.",
    category: "science",
    significance: "high",
    icon: "Circle",
  },
  {
    id: "sci-007",
    year: 1953,
    month: 4,
    day: 25,
    title: "DNA Double Helix Discovered",
    description: "Watson and Crick discovered DNA structure, founding molecular biology and enabling genetic engineering.",
    category: "science",
    significance: "critical",
    icon: "Helix",
  },

  // More Economic Events
  {
    id: "econ-003",
    year: 2000,
    month: 3,
    day: 10,
    title: "Dot-com Bubble Peak",
    description: "NASDAQ peaked at 5,048 before crashing 78% by October 2002. Taught Silicon Valley about sustainable business models vs. growth at all costs.",
    category: "economics",
    significance: "high",
    icon: "TrendingDown",
  },
  {
    id: "econ-004",
    year: 2010,
    month: 5,
    day: 6,
    title: "Flash Crash",
    description: "US stock market crashed 9% in minutes due to algorithmic trading, highlighting risks of automated systems and market fragility.",
    category: "economics",
    significance: "high",
    icon: "Zap",
  },
  {
    id: "econ-005",
    year: 2020,
    month: 3,
    day: 11,
    title: "COVID-19 Pandemic Declared",
    description: "WHO declared pandemic, triggering largest remote work experiment in history and accelerating digital transformation by 5 years.",
    category: "economics",
    significance: "critical",
    icon: "Activity",
  },

  // More Personal Milestones
  {
    id: "personal-005",
    year: 2023,
    month: 6,
    title: "Graduated B.Tech Computer Engineering",
    description: "Completed Bachelor of Technology with focus on distributed systems and software architecture.",
    category: "personal",
    significance: "high",
    icon: "GraduationCap",
  },
  {
    id: "personal-006",
    year: 2022,
    month: 8,
    title: "First Open Source Contribution",
    description: "Started contributing to open-source projects, embracing collaborative development and community-driven innovation.",
    category: "personal",
    significance: "medium",
    icon: "GitBranch",
  },
  {
    id: "personal-007",
    year: 2024,
    month: 5,
    title: "Built First Distributed System",
    description: "Architected and deployed first production-grade distributed system handling high throughput document processing.",
    category: "personal",
    significance: "high",
    icon: "Network",
  },
];

// ==================== Knowledge Graph Nodes ====================

export const knowledgeGraph: KnowledgeNode[] = [
  {
    id: "node-history",
    label: "History",
    category: "history",
    description: "Understanding the past to build better futures",
    icon: "BookOpen",
    color: "#d97706", // amber
    connections: ["node-tech", "node-economics"],
    facts: ["hist-001", "hist-002", "hist-003"],
  },
  {
    id: "node-physics",
    label: "Physics",
    category: "physics",
    description: "The fundamental laws governing our digital world",
    icon: "Atom",
    color: "#0ea5e9", // blue
    connections: ["node-tech", "node-sports"],
    facts: ["phys-001", "phys-002", "phys-003", "phys-004"],
  },
  {
    id: "node-economics",
    label: "Economics",
    category: "economics",
    description: "Optimizing resources and understanding value",
    icon: "TrendingUp",
    color: "#10b981", // emerald
    connections: ["node-tech", "node-history"],
    facts: ["econ-001", "econ-002", "econ-003", "econ-004"],
  },
  {
    id: "node-sports",
    label: "Sports",
    category: "sports",
    description: "Performance, strategy, and analytics",
    icon: "Trophy",
    color: "#f59e0b", // orange
    connections: ["node-physics", "node-tech"],
    facts: ["sport-001", "sport-002", "sport-003"],
  },
  {
    id: "node-tech",
    label: "Technology",
    category: "technology",
    description: "Building systems that scale and endure",
    icon: "Code",
    color: "#8b5cf6", // violet
    connections: ["node-physics", "node-economics", "node-history", "node-sports", "node-general"],
    facts: ["tech-001", "tech-002", "tech-003"],
  },
  {
    id: "node-general",
    label: "Synthesis",
    category: "general",
    description: "Where all knowledge intersects",
    icon: "Sparkles",
    color: "#ec4899", // pink
    connections: ["node-tech"],
    facts: ["gen-001", "gen-002", "gen-003"],
  },
];

// ==================== Helper Functions ====================

/**
 * Get a random fact from a specific category
 */
export function getRandomFact(category?: FactCategory): PolymathFact {
  const facts = category
    ? polymathFacts.filter(f => f.category === category)
    : polymathFacts;
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Get facts for today's date (for "On This Day" feature)
 */
export function getTodayFacts(): PolymathFact[] {
  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return polymathFacts.filter(fact => fact.date === monthDay);
}

/**
 * Get timeline events sorted by date (newest first)
 */
export function getSortedTimeline(): HistoricalEvent[] {
  return [...historicalTimeline].sort((a, b) => {
    const aDate = new Date(a.year, a.month || 0, a.day || 1);
    const bDate = new Date(b.year, b.month || 0, b.day || 1);
    return bDate.getTime() - aDate.getTime();
  });
}

/**
 * Get facts related to multiple interests (showing connections)
 */
export function getConnectedFacts(categories: FactCategory[]): PolymathFact[] {
  return polymathFacts.filter(fact =>
    categories.includes(fact.category) ||
    fact.relatedInterests.some(interest => categories.includes(interest))
  );
}

/**
 * Calculate polymath score based on activity across domains
 */
export function calculatePolymathScore(
  activities: Record<FactCategory, number>
): number {
  const categories = Object.keys(activities) as FactCategory[];
  const totalActivities = categories.reduce((sum, cat) => sum + activities[cat], 0);
  const diversityBonus = categories.length * 10;
  return totalActivities + diversityBonus;
}
