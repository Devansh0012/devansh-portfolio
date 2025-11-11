/**
 * Reading Room - Book recommendations across all interests
 */

import type { Book } from "./polymath-data";

export const books: Book[] = [
  // Technology
  {
    id: "book-tech-001",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "technology",
    description: "The definitive guide to distributed systems, databases, and building reliable, scalable applications.",
    status: "read",
    rating: 5,
    notes: "Changed how I think about system design. Chapter 9 on consistency and consensus is brilliant.",
    keyTakeaways: [
      "Replication vs Partitioning trade-offs",
      "Understanding CAP theorem in practice",
      "Batch and stream processing patterns",
      "Building fault-tolerant distributed systems"
    ],
    amazonLink: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321"
  },
  {
    id: "book-tech-002",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    category: "technology",
    description: "Timeless wisdom on becoming a better programmer through deliberate practice and pragmatic thinking.",
    status: "read",
    rating: 5,
    keyTakeaways: [
      "Don't Repeat Yourself (DRY) principle",
      "Orthogonality in system design",
      "Programming by coincidence vs intention",
      "The importance of rubber duck debugging"
    ],
  },
  {
    id: "book-tech-003",
    title: "System Design Interview",
    author: "Alex Xu",
    category: "technology",
    description: "Practical guide to system design with real-world examples and step-by-step breakdowns.",
    status: "reading",
    rating: 4,
    keyTakeaways: [
      "Framework for approaching design problems",
      "Capacity estimation techniques",
      "Common system design patterns",
      "Trade-offs in distributed systems"
    ],
  },

  // Physics
  {
    id: "book-phys-001",
    title: "Quantum Computing for Everyone",
    author: "Chris Bernhardt",
    category: "physics",
    description: "Accessible introduction to quantum computing without requiring advanced math background.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "Superposition and entanglement explained clearly",
      "How quantum algorithms actually work",
      "Why quantum computers are hard to build",
      "Applications in cryptography and optimization"
    ],
  },
  {
    id: "book-phys-002",
    title: "The Code Breaker",
    author: "Walter Isaacson",
    category: "physics",
    description: "Biography of Jennifer Doudna and the story of CRISPR, showing the intersection of biology, chemistry, and computation.",
    status: "read",
    rating: 5,
    notes: "Fascinating parallel between genetic code and software code. Both are information systems we can now edit.",
    keyTakeaways: [
      "DNA as programmable code",
      "Scientific collaboration and competition",
      "Ethics of genetic engineering",
      "How basic research leads to breakthroughs"
    ],
  },
  {
    id: "book-phys-003",
    title: "Surely You're Joking, Mr. Feynman!",
    author: "Richard Feynman",
    category: "physics",
    description: "Autobiographical anecdotes from legendary physicist Richard Feynman, showcasing curiosity-driven learning.",
    status: "read",
    rating: 5,
    keyTakeaways: [
      "First principles thinking in action",
      "Importance of curiosity and play",
      "Learning by doing and experimentation",
      "Challenger disaster analysis example"
    ],
  },

  // History
  {
    id: "book-hist-001",
    title: "The Innovators",
    author: "Walter Isaacson",
    category: "history",
    description: "History of the digital revolution and the people who created it, from Ada Lovelace to Larry Page.",
    status: "read",
    rating: 5,
    notes: "Shows how innovation is collaborative. No lone genius myth - it's always teams building on previous work.",
    keyTakeaways: [
      "Ada Lovelace invented the concept of programming",
      "Transistor invention changed everything",
      "Open source movement's historical roots",
      "Collaboration drives innovation more than competition"
    ],
  },
  {
    id: "book-hist-002",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "history",
    description: "Sweeping overview of human history from cognitive revolution to AI age.",
    status: "read",
    rating: 5,
    keyTakeaways: [
      "Shared myths enable large-scale cooperation",
      "Agricultural revolution trade-offs",
      "Money and empires as universal languages",
      "Scientific revolution mindset shift"
    ],
  },
  {
    id: "book-hist-003",
    title: "The Second World War",
    author: "Antony Beevor",
    category: "history",
    description: "Comprehensive history of WW2, including the critical role of codebreaking and early computers.",
    status: "want-to-read",
    keyTakeaways: [
      "Enigma codebreaking shortened war by 2 years",
      "Logistics and supply chains determined outcomes",
      "Technology acceleration during wartime",
      "Human cost of technological advancement"
    ],
  },

  // Economics
  {
    id: "book-econ-001",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "economics",
    description: "Nobel laureate's exploration of human decision-making, biases, and the two systems of thought.",
    status: "read",
    rating: 5,
    notes: "Crucial for understanding user behavior and building better products. System 1 vs System 2 thinking applies to UX design.",
    keyTakeaways: [
      "System 1 (fast) vs System 2 (slow) thinking",
      "Availability heuristic and recency bias",
      "Loss aversion in decision-making",
      "Anchoring effect in estimation"
    ],
  },
  {
    id: "book-econ-002",
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "economics",
    description: "How to build sustainable businesses through validated learning and rapid iteration.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "Build-Measure-Learn feedback loop",
      "Minimum Viable Product (MVP) concept",
      "Pivot vs persevere decisions",
      "Actionable metrics vs vanity metrics"
    ],
  },
  {
    id: "book-econ-003",
    title: "Zero to One",
    author: "Peter Thiel",
    category: "economics",
    description: "Notes on startups and building the future through creating something entirely new.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "Going from 0 to 1 vs 1 to n",
      "Monopoly vs competition dynamics",
      "Power law distribution in returns",
      "Definite vs indefinite optimism"
    ],
  },
  {
    id: "book-econ-004",
    title: "Freakonomics",
    author: "Steven Levitt & Stephen Dubner",
    category: "economics",
    description: "Exploring the hidden side of everything through economic thinking and data analysis.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "Incentives drive behavior",
      "Correlation vs causation pitfalls",
      "Information asymmetry effects",
      "Unintended consequences of policies"
    ],
  },

  // Sports
  {
    id: "book-sport-001",
    title: "Moneyball",
    author: "Michael Lewis",
    category: "sports",
    description: "How Oakland A's used data analytics to compete with richer teams - pioneering sports analytics.",
    status: "read",
    rating: 5,
    notes: "Perfect example of using data to challenge conventional wisdom. Same principles apply to A/B testing in tech.",
    keyTakeaways: [
      "Data-driven decision making over intuition",
      "Finding undervalued metrics (on-base %)",
      "Disrupting traditional industries with analytics",
      "Small teams can compete with resources through smarter strategy"
    ],
  },
  {
    id: "book-sport-002",
    title: "The Sports Gene",
    author: "David Epstein",
    category: "sports",
    description: "Science of athletic performance - exploring nature vs nurture in sports excellence.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "10,000-hour rule nuances and limitations",
      "Genetic advantages in different sports",
      "Deliberate practice vs natural talent",
      "Physiological limits of human performance"
    ],
  },
  {
    id: "book-sport-003",
    title: "Range",
    author: "David Epstein",
    category: "sports",
    description: "Why generalists triumph in a specialized world - the value of broad experience.",
    status: "reading",
    rating: 5,
    notes: "Validates being a polymath! Breadth of knowledge often beats narrow specialization in complex problems.",
    keyTakeaways: [
      "Sampling period before specializing",
      "Analogical thinking from diverse experiences",
      "Match quality through experimentation",
      "Generalists excel in wicked learning environments"
    ],
  },

  // General / Interdisciplinary
  {
    id: "book-gen-001",
    title: "Thinking in Systems",
    author: "Donella Meadows",
    category: "general",
    description: "Understanding complex systems - feedback loops, stocks, flows, and leverage points.",
    status: "read",
    rating: 5,
    keyTakeaways: [
      "Systems thinking for complex problems",
      "Feedback loops create behavior patterns",
      "Leverage points for system change",
      "Bounded rationality and system delays"
    ],
  },
  {
    id: "book-gen-002",
    title: "Gödel, Escher, Bach",
    author: "Douglas Hofstadter",
    category: "general",
    description: "Exploration of consciousness, mathematics, art, and music - a polymath masterpiece.",
    status: "reading",
    rating: 5,
    notes: "Mind-bending connections between logic, art, and cognition. Heavy but rewarding.",
    keyTakeaways: [
      "Self-reference and recursion patterns",
      "Strange loops in formal systems",
      "Emergence of meaning from symbols",
      "Limits of formal mathematical systems"
    ],
  },
  {
    id: "book-gen-003",
    title: "The Beginning of Infinity",
    author: "David Deutsch",
    category: "general",
    description: "Explanations that transform the world - connecting physics, philosophy, and knowledge creation.",
    status: "want-to-read",
    keyTakeaways: [
      "Good explanations are hard to vary",
      "Knowledge creation is unbounded",
      "Quantum computing as physics test",
      "Universality in computation and physics"
    ],
  },

  // Additional Technology Books
  {
    id: "book-tech-004",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "technology",
    description: "A handbook of agile software craftsmanship focused on writing readable, maintainable code.",
    status: "read",
    rating: 5,
    notes: "Essential reading for any developer. The principles here have made me a better engineer.",
    keyTakeaways: [
      "Meaningful names matter more than comments",
      "Functions should do one thing well",
      "Code is read 10x more than written",
      "Boy Scout Rule: leave code cleaner than you found it"
    ],
    amazonLink: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882"
  },
  {
    id: "book-tech-005",
    title: "Accelerate",
    author: "Nicole Forsgren, Jez Humble, Gene Kim",
    category: "technology",
    description: "Science-backed research on what makes high-performing technology organizations.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "DORA metrics: deployment frequency, lead time, MTTR, change failure rate",
      "Continuous delivery improves both speed and stability",
      "Trunk-based development outperforms feature branches",
      "Culture and technical practices are equally important"
    ],
    amazonLink: "https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339"
  },
  {
    id: "book-tech-006",
    title: "Release It!",
    author: "Michael Nygard",
    category: "technology",
    description: "Design and deploy production-ready software with patterns for stability and resilience.",
    status: "reading",
    rating: 5,
    notes: "Every production incident I've debugged has a pattern from this book. Circuit breakers saved us multiple times.",
    keyTakeaways: [
      "Circuit breaker pattern for cascading failures",
      "Bulkheads isolate critical resources",
      "Timeouts prevent resource exhaustion",
      "Design for failure, not just success"
    ],
  },

  // Additional Physics Books
  {
    id: "book-phys-004",
    title: "What If?",
    author: "Randall Munroe",
    category: "physics",
    description: "Serious scientific answers to absurd hypothetical questions, with XKCD-style humor.",
    status: "read",
    rating: 5,
    notes: "Makes physics fun and accessible. Great examples of first-principles thinking.",
    keyTakeaways: [
      "Break impossible problems into solvable parts",
      "Fermi estimation for quick approximations",
      "Physics applies to everything (even silly questions)",
      "Scientific thinking is about asking 'what if?'"
    ],
  },
  {
    id: "book-phys-005",
    title: "Seven Brief Lessons on Physics",
    author: "Carlo Rovelli",
    category: "physics",
    description: "Elegant introduction to modern physics covering relativity, quantum mechanics, and cosmology.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "General relativity: spacetime is curved",
      "Quantum mechanics: reality is probabilistic",
      "Loop quantum gravity attempts to unify both",
      "Beauty and simplicity in physical laws"
    ],
  },

  // Additional History Books
  {
    id: "book-hist-004",
    title: "The Soul of A New Machine",
    author: "Tracy Kidder",
    category: "history",
    description: "Pulitzer Prize-winning account of building a computer in the 1970s - captures engineering culture.",
    status: "read",
    rating: 5,
    notes: "Shows how engineering hasn't changed - tight deadlines, ambitious goals, passionate teams.",
    keyTakeaways: [
      "Engineering is fundamentally human",
      "Deadlines create urgency but also burnout",
      "Documentation matters (or lack thereof)",
      "Team dynamics make or break projects"
    ],
  },
  {
    id: "book-hist-005",
    title: "Code: The Hidden Language",
    author: "Charles Petzold",
    category: "history",
    description: "From morse code to microprocessors - how computers work from first principles.",
    status: "read",
    rating: 5,
    keyTakeaways: [
      "Binary at its core is just on/off switches",
      "Layers of abstraction build complexity",
      "Understanding hardware helps write better software",
      "History of computing is surprisingly recent"
    ],
    amazonLink: "https://www.amazon.com/Code-Language-Computer-Hardware-Software/dp/0735611319"
  },

  // Additional Economics Books
  {
    id: "book-econ-005",
    title: "The Innovator's Dilemma",
    author: "Clayton Christensen",
    category: "economics",
    description: "Why successful companies fail - disruptive innovation and the challenge of new technologies.",
    status: "read",
    rating: 5,
    notes: "Explains why incumbents struggle with innovation. Seen this play out at every company I've worked at.",
    keyTakeaways: [
      "Sustaining vs disruptive innovation",
      "Good management can lead to failure",
      "Value networks shape company decisions",
      "Start-ups beat incumbents by changing metrics"
    ],
    amazonLink: "https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation/dp/1633691780"
  },
  {
    id: "book-econ-006",
    title: "High Output Management",
    author: "Andrew Grove",
    category: "economics",
    description: "Intel CEO's guide to management - production principles applied to knowledge work.",
    status: "reading",
    rating: 4,
    keyTakeaways: [
      "Output-oriented approach to management",
      "Leverage: multiply your output through others",
      "Meetings are a medium of managerial work",
      "Performance reviews and OKRs framework"
    ],
  },

  // Additional Sports Books
  {
    id: "book-sport-004",
    title: "Atomic Habits",
    author: "James Clear",
    category: "sports",
    description: "Tiny changes, remarkable results - building good habits and breaking bad ones.",
    status: "read",
    rating: 5,
    notes: "Applied this to coding practice. 1% better every day compounds over time.",
    keyTakeaways: [
      "Habits are compound interest of self-improvement",
      "Focus on systems, not goals",
      "Environment shapes behavior",
      "Four laws: make it obvious, attractive, easy, satisfying"
    ],
    amazonLink: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299"
  },

  // Additional General Books
  {
    id: "book-gen-004",
    title: "The Pragmatic Engineer",
    author: "Gergely Orosz",
    category: "general",
    description: "Insights from senior engineers on navigating tech careers and becoming more effective.",
    status: "reading",
    rating: 5,
    notes: "Career advice I wish I had earlier. Understanding business context makes you a better engineer.",
    keyTakeaways: [
      "Business context matters as much as code",
      "Communication is a core engineering skill",
      "Understand the 'why' behind decisions",
      "Career growth requires deliberate effort"
    ],
  },
  {
    id: "book-gen-005",
    title: "Deep Work",
    author: "Cal Newport",
    category: "general",
    description: "Rules for focused success in a distracted world - cultivating concentration as a skill.",
    status: "read",
    rating: 4,
    keyTakeaways: [
      "Deep work is increasingly rare and valuable",
      "Shallow work is inevitable but should be minimized",
      "Attention is a finite resource to protect",
      "Schedule blocks for uninterrupted focus"
    ],
    amazonLink: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692"
  },
  {
    id: "book-gen-006",
    title: "The Phoenix Project",
    author: "Gene Kim, Kevin Behr, George Spafford",
    category: "general",
    description: "DevOps novel about IT transformation - theory of constraints applied to software delivery.",
    status: "read",
    rating: 5,
    notes: "Reads like a thriller but teaches DevOps principles. Every character feels familiar.",
    keyTakeaways: [
      "Four types of work: business, internal, changes, unplanned",
      "Work-in-progress limits prevent bottlenecks",
      "Flow through the system matters more than local optimization",
      "DevOps is about culture, not just tools"
    ],
    amazonLink: "https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592"
  },
];

// Helper functions
export function getBooksByCategory(category: string) {
  return books.filter(book => book.category === category);
}

export function getBooksByStatus(status: Book['status']) {
  return books.filter(book => book.status === status);
}

export function getCurrentlyReading() {
  return books.filter(book => book.status === 'reading');
}

export function getTopRatedBooks(minRating: number = 5) {
  return books.filter(book => book.rating && book.rating >= minRating);
}

export function getRandomBookRecommendation() {
  return books[Math.floor(Math.random() * books.length)];
}
