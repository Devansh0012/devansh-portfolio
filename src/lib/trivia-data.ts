/**
 * Trivia Questions - Multi-domain knowledge challenges
 */

import type { TriviaQuestion } from "./polymath-data";

export const triviaQuestions: TriviaQuestion[] = [
  // Technology - Easy
  {
    id: "tech-easy-001",
    category: "technology",
    difficulty: "easy",
    question: "What does 'HTTP' stand for in web development?",
    options: [
      "HyperText Transfer Protocol",
      "High-Tech Transfer Process",
      "HTML Transfer Through Pages",
      "Hyper Terminal Text Protocol"
    ],
    correctAnswer: 0,
    explanation: "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web, defining how messages are formatted and transmitted.",
    points: 10,
    tags: ["networking", "web", "protocols"]
  },
  {
    id: "tech-easy-002",
    category: "technology",
    difficulty: "easy",
    question: "Which data structure uses Last-In-First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctAnswer: 1,
    explanation: "A Stack follows LIFO - the last element added is the first one removed. Think of a stack of plates!",
    points: 10,
    tags: ["data-structures", "algorithms"]
  },

  // Technology - Medium
  {
    id: "tech-med-001",
    category: "technology",
    difficulty: "medium",
    question: "In the CAP theorem, what does 'CAP' stand for?",
    options: [
      "Consistency, Availability, Partition tolerance",
      "Concurrency, Authentication, Performance",
      "Caching, API, Protocols",
      "Containerization, Automation, Parallel processing"
    ],
    correctAnswer: 0,
    explanation: "CAP theorem states you can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (system operational), Partition tolerance (works despite network splits).",
    points: 20,
    tags: ["distributed-systems", "databases", "theory"]
  },
  {
    id: "tech-med-002",
    category: "technology",
    difficulty: "medium",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has O(log n) complexity because it eliminates half the search space in each step.",
    points: 20,
    tags: ["algorithms", "complexity", "search"]
  },
  {
    id: "tech-med-003",
    category: "technology",
    difficulty: "medium",
    question: "Which AWS service is best for hosting a serverless REST API?",
    options: ["EC2", "Lambda + API Gateway", "S3", "RDS"],
    correctAnswer: 1,
    explanation: "Lambda functions combined with API Gateway provide a fully serverless REST API solution with automatic scaling and no server management.",
    points: 20,
    tags: ["aws", "serverless", "cloud"]
  },

  // Technology - Hard
  {
    id: "tech-hard-001",
    category: "technology",
    difficulty: "hard",
    question: "What is the Byzantine Generals Problem in distributed systems?",
    options: [
      "Achieving consensus when some nodes may be faulty or malicious",
      "Load balancing across multiple servers",
      "Handling network latency in geo-distributed systems",
      "Managing database replication lag"
    ],
    correctAnswer: 0,
    explanation: "The Byzantine Generals Problem addresses achieving consensus in distributed systems where some participants may send conflicting information, either due to faults or malicious behavior.",
    points: 30,
    tags: ["distributed-systems", "consensus", "theory"]
  },
  {
    id: "tech-hard-002",
    category: "technology",
    difficulty: "hard",
    question: "In React, why might using index as key in lists cause issues?",
    options: [
      "It causes memory leaks",
      "It breaks reconciliation when items are reordered or deleted",
      "It slows down rendering performance",
      "It prevents component updates"
    ],
    correctAnswer: 1,
    explanation: "Using index as key breaks React's reconciliation algorithm when list items are reordered, inserted, or deleted, causing bugs with component state and performance issues.",
    points: 30,
    tags: ["react", "performance", "best-practices"]
  },

  // Physics - Easy
  {
    id: "phys-easy-001",
    category: "physics",
    difficulty: "easy",
    question: "What is the speed of light in vacuum?",
    options: [
      "300,000 km/s",
      "150,000 km/s",
      "500,000 km/s",
      "186,000 km/s"
    ],
    correctAnswer: 0,
    explanation: "Light travels at approximately 300,000 kilometers per second (or 186,000 miles/second) in vacuum - a fundamental constant of physics that limits information transfer speed.",
    points: 10,
    tags: ["physics", "constants", "light"]
  },
  {
    id: "phys-easy-002",
    category: "physics",
    difficulty: "easy",
    question: "What force keeps planets in orbit around the Sun?",
    options: ["Magnetism", "Gravity", "Centrifugal force", "Nuclear force"],
    correctAnswer: 1,
    explanation: "Gravity is the attractive force between masses that keeps planets orbiting the Sun and satellites orbiting Earth.",
    points: 10,
    tags: ["gravity", "astronomy", "forces"]
  },

  // Physics - Medium
  {
    id: "phys-med-001",
    category: "physics",
    difficulty: "medium",
    question: "Why is quantum tunneling a problem in modern CPUs?",
    options: [
      "It causes overheating",
      "Electrons can pass through insulating barriers, causing current leakage",
      "It reduces clock speed",
      "It corrupts data in RAM"
    ],
    correctAnswer: 1,
    explanation: "At ~5nm transistor sizes, quantum tunneling allows electrons to 'teleport' through insulating barriers, causing unwanted current leakage and power consumption.",
    points: 20,
    tags: ["quantum", "semiconductors", "hardware"]
  },
  {
    id: "phys-med-002",
    category: "physics",
    difficulty: "medium",
    question: "What does the Heisenberg Uncertainty Principle state?",
    options: [
      "Energy cannot be created or destroyed",
      "You cannot simultaneously know exact position and momentum of a particle",
      "Time dilates at high speeds",
      "Matter and energy are interchangeable"
    ],
    correctAnswer: 1,
    explanation: "Heisenberg's principle states that the more precisely you know a particle's position, the less precisely you can know its momentum, and vice versa - a fundamental quantum limitation.",
    points: 20,
    tags: ["quantum", "uncertainty", "theory"]
  },

  // Physics - Hard
  {
    id: "phys-hard-001",
    category: "physics",
    difficulty: "hard",
    question: "What is the theoretical minimum energy required to erase one bit of information?",
    options: [
      "Zero energy",
      "kT ln(2) where k is Boltzmann's constant",
      "1 eV (electron volt)",
      "hν where h is Planck's constant"
    ],
    correctAnswer: 1,
    explanation: "Landauer's principle states that erasing information requires at least kT ln(2) energy dissipation due to thermodynamics, connecting information theory to physics.",
    points: 30,
    tags: ["thermodynamics", "information-theory", "physics"]
  },

  // Economics - Easy
  {
    id: "econ-easy-001",
    category: "economics",
    difficulty: "easy",
    question: "What is 'technical debt' in software development?",
    options: [
      "Money owed to developers",
      "Cost of licenses and tools",
      "Future cost of reworking quick solutions",
      "Budget for cloud infrastructure"
    ],
    correctAnswer: 2,
    explanation: "Technical debt is the implied cost of future rework caused by choosing quick solutions now instead of better approaches that would take longer.",
    points: 10,
    tags: ["software-economics", "technical-debt"]
  },
  {
    id: "econ-easy-002",
    category: "economics",
    difficulty: "easy",
    question: "What does MVP stand for in startup terminology?",
    options: [
      "Most Valuable Player",
      "Minimum Viable Product",
      "Maximum Value Proposition",
      "Multi-Version Platform"
    ],
    correctAnswer: 1,
    explanation: "Minimum Viable Product (MVP) is the simplest version with just enough features to satisfy early customers and validate a product idea.",
    points: 10,
    tags: ["startup", "product", "lean"]
  },

  // Economics - Medium
  {
    id: "econ-med-001",
    category: "economics",
    difficulty: "medium",
    question: "According to studies, what percentage of cloud spend is typically wasted on unused resources?",
    options: ["5-10%", "15-20%", "30-35%", "50-60%"],
    correctAnswer: 2,
    explanation: "Studies show approximately 30-35% of cloud spending is wasted on unused or underutilized resources, representing billions in inefficiency.",
    points: 20,
    tags: ["cloud", "efficiency", "cost"]
  },
  {
    id: "econ-med-002",
    category: "economics",
    difficulty: "medium",
    question: "What is the 'two-pizza team' rule from Amazon?",
    options: [
      "Teams should eat lunch together twice a week",
      "Teams should be small enough to feed with two pizzas (8-10 people)",
      "Projects should be completable in the time it takes to eat two pizzas",
      "Budget should cover two pizza parties per sprint"
    ],
    correctAnswer: 1,
    explanation: "Amazon's two-pizza rule states teams should be small enough that two pizzas can feed them (~8-10 people), as smaller teams are more productive.",
    points: 20,
    tags: ["team-size", "productivity", "amazon"]
  },

  // History - Easy
  {
    id: "hist-easy-001",
    category: "history",
    difficulty: "easy",
    question: "Who is considered the first computer programmer?",
    options: [
      "Alan Turing",
      "Ada Lovelace",
      "Grace Hopper",
      "Charles Babbage"
    ],
    correctAnswer: 1,
    explanation: "Ada Lovelace wrote the first algorithm intended for a machine (Babbage's Analytical Engine) in 1843, making her the first programmer.",
    points: 10,
    tags: ["history", "programming", "pioneers"]
  },
  {
    id: "hist-easy-002",
    category: "history",
    difficulty: "easy",
    question: "What was the first message sent over ARPANET in 1969?",
    options: ["HELLO", "LO (attempting LOGIN)", "TEST", "SEND"],
    correctAnswer: 1,
    explanation: "The first ARPANET message was 'LO' - they were trying to send 'LOGIN' but the system crashed after two letters.",
    points: 10,
    tags: ["arpanet", "internet", "history"]
  },

  // History - Medium
  {
    id: "hist-med-001",
    category: "history",
    difficulty: "medium",
    question: "When did Linus Torvalds announce Linux?",
    options: ["1985", "1991", "1995", "2000"],
    correctAnswer: 1,
    explanation: "Linus announced Linux on August 25, 1991, describing it as 'just a hobby, won't be big and professional'. Today it powers most servers.",
    points: 20,
    tags: ["linux", "open-source", "history"]
  },
  {
    id: "hist-med-002",
    category: "history",
    difficulty: "medium",
    question: "What computer language was used for the Apollo 11 moon landing software?",
    options: ["FORTRAN", "Assembly Language", "COBOL", "C"],
    correctAnswer: 1,
    explanation: "The Apollo Guidance Computer used assembly language. Margaret Hamilton led the team that wrote the critical flight software.",
    points: 20,
    tags: ["space", "apollo", "programming"]
  },

  // Sports - Easy
  {
    id: "sport-easy-001",
    category: "sports",
    difficulty: "easy",
    question: "In cricket, how many players are in a team?",
    options: ["9", "11", "12", "15"],
    correctAnswer: 1,
    explanation: "Cricket teams have 11 players on the field, similar to soccer/football.",
    points: 10,
    tags: ["cricket", "basics", "sports"]
  },
  {
    id: "sport-easy-002",
    category: "sports",
    difficulty: "easy",
    question: "What is the maximum score from one dart in professional darts?",
    options: ["50", "60", "100", "180"],
    correctAnswer: 1,
    explanation: "Triple 20 (the highest single dart score) equals 60 points. Three triple-20s make the maximum single-turn score of 180.",
    points: 10,
    tags: ["darts", "sports", "scoring"]
  },

  // Sports - Medium
  {
    id: "sport-med-001",
    category: "sports",
    difficulty: "medium",
    question: "What does the 'Moneyball' approach in baseball prioritize?",
    options: [
      "Home runs and batting average",
      "On-base percentage and undervalued metrics",
      "Player popularity and merchandise sales",
      "Defensive statistics only"
    ],
    correctAnswer: 1,
    explanation: "Moneyball used data analytics to find undervalued players by focusing on on-base percentage rather than traditional stats, revolutionizing sports analytics.",
    points: 20,
    tags: ["analytics", "baseball", "strategy"]
  },
  {
    id: "sport-med-002",
    category: "sports",
    difficulty: "medium",
    question: "Why is a false start called if an Olympic sprinter reacts faster than 0.1 seconds?",
    options: [
      "It's the rule to prevent cheating",
      "Human neural transmission cannot be that fast",
      "It gives unfair advantage",
      "The starting blocks detect pressure too early"
    ],
    correctAnswer: 1,
    explanation: "Human neural and muscular response to the starting gun cannot physically occur faster than 0.1 seconds, so faster reactions must be anticipation.",
    points: 20,
    tags: ["athletics", "physics", "human-limits"]
  },

  // General Knowledge
  {
    id: "gen-easy-001",
    category: "general",
    difficulty: "easy",
    question: "What does 'DRY' principle mean in programming?",
    options: [
      "Don't Repeat Yourself",
      "Debug Regularly, Yes",
      "Deploy Rapidly Yesterday",
      "Data Replication Yearly"
    ],
    correctAnswer: 0,
    explanation: "DRY (Don't Repeat Yourself) is a principle aimed at reducing repetition of code patterns, promoting reusability and maintainability.",
    points: 10,
    tags: ["programming", "principles", "best-practices"]
  },
  {
    id: "gen-med-001",
    category: "general",
    difficulty: "medium",
    question: "What is Hofstadter's Law?",
    options: [
      "Code always has bugs",
      "It always takes longer than you expect, even when accounting for this law",
      "Complexity doubles every 18 months",
      "Documentation is always outdated"
    ],
    correctAnswer: 1,
    explanation: "Hofstadter's Law is a self-referential observation about time estimation: projects take longer than expected, even when you account for this very law!",
    points: 20,
    tags: ["estimation", "humor", "project-management"]
  },
  {
    id: "gen-hard-001",
    category: "general",
    difficulty: "expert",
    question: "In Gödel's Incompleteness Theorems, what does the first theorem prove?",
    options: [
      "All mathematical systems are complete",
      "Any consistent formal system containing arithmetic has unprovable true statements",
      "Mathematics is inherently contradictory",
      "Computers can solve any mathematical problem"
    ],
    correctAnswer: 1,
    explanation: "Gödel's First Incompleteness Theorem shows that in any consistent formal system capable of arithmetic, there are true statements that cannot be proven within that system.",
    points: 50,
    tags: ["mathematics", "logic", "theory"]
  }
];

// Helper functions
export function getQuestionsByCategory(category: string) {
  return triviaQuestions.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: TriviaQuestion['difficulty']) {
  return triviaQuestions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, category?: string): TriviaQuestion[] {
  const pool = category
    ? triviaQuestions.filter(q => q.category === category)
    : triviaQuestions;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function calculateQuizScore(answers: Record<string, number>): number {
  return Object.entries(answers).reduce((score, [questionId, answerIndex]) => {
    const question = triviaQuestions.find(q => q.id === questionId);
    if (question && answerIndex === question.correctAnswer) {
      return score + question.points;
    }
    return score;
  }, 0);
}

export function getPolymathChallenge(): TriviaQuestion[] {
  // Get 2 questions from each category for a balanced polymath quiz
  const categories: TriviaQuestion['category'][] = ['technology', 'physics', 'economics', 'history', 'sports', 'general'];

  const questions: TriviaQuestion[] = [];
  categories.forEach(category => {
    const categoryQuestions = getQuestionsByCategory(category);
    const selected = categoryQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    questions.push(...selected);
  });

  return questions.sort(() => Math.random() - 0.5);
}
