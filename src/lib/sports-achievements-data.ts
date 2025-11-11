/**
 * Sports-Style Achievements - Career stats presented like an athlete
 */

import type { SportsAchievement, EconomicMetric } from "./polymath-data";

// Sports-style career statistics
export const careerStats = {
  season: "2024-2025",
  overall: {
    gamesPlayed: "Deployments shipped",
    gamesPlayedValue: 30,
    wins: "Features launched",
    winsValue: 15,
    winPercentage: 0.97, // 97% success rate
    averagePoints: "Avg cost savings per project",
    averagePointsValue: "32%",
  },
  offensive: {
    // "Scoring" stats - value creation
    goals: "Major features built",
    goalsValue: 8,
    assists: "Team collaborations",
    assistsValue: 12,
    shotsOnTarget: "PRs merged",
    shotsOnTargetValue: 156,
    accuracy: "Code review approval rate",
    accuracyValue: 0.94,
  },
  defensive: {
    // "Preventing losses" stats - reliability
    cleanSheets: "Incident-free weeks",
    cleanSheetsValue: 48,
    tackles: "Bugs caught in review",
    tacklesValue: 89,
    saves: "Production incidents prevented",
    savesValue: 7,
    blocksPerGame: "Security vulnerabilities fixed",
    blocksPerGameValue: 23,
  },
  advanced: {
    // Advanced metrics
    efficiency: "Lines of code per feature",
    efficiencyValue: "-40%", // Less code for same functionality
    passCompletion: "API reliability",
    passCompletionValue: 0.997, // 99.7% uptime
    possessionTime: "Time in flow state",
    possessionTimeValue: "65%",
    pressureResistance: "Deadline success rate",
    pressureResistanceValue: 0.92,
  }
};

export const sportsAchievements: SportsAchievement[] = [
  {
    id: "ach-001",
    achievement: "MVP Performance (PICT Concepts Hackathon)",
    category: "hackathons",
    stat: "Win Rate",
    statValue: "100%",
    rank: "🥇 Champion",
    date: "2025-01",
    icon: "Trophy",
    comparison: "Like scoring a buzzer-beater to win the championship"
  },
  {
    id: "ach-002",
    achievement: "Global Elite (NASA Space Apps)",
    category: "hackathons",
    stat: "Percentile",
    statValue: "Top 0.1%",
    rank: "🌍 Global Nominee",
    date: "2024-10",
    icon: "Rocket",
    comparison: "Olympic qualifying performance - competing at world stage"
  },
  {
    id: "ach-003",
    achievement: "Triple-Double (Docxster Drive Launch)",
    category: "projects",
    stat: "Impact Areas",
    statValue: "Storage + Search + Sync",
    rank: "⭐ Multi-domain Excellence",
    date: "2024-12",
    icon: "Star",
    comparison: "Basketball triple-double: scoring, rebounding, assists all excelling"
  },
  {
    id: "ach-004",
    achievement: "Cost Cutting Efficiency",
    category: "projects",
    stat: "Cost Reduction",
    statValue: "45%",
    rank: "💰 Economic MVP",
    date: "2024-12",
    icon: "TrendingDown",
    comparison: "Moneyball analytics - achieving more with less"
  },
  {
    id: "ach-005",
    achievement: "Speed Record (Manual Sync Reduction)",
    category: "projects",
    stat: "Efficiency Gain",
    statValue: "60%",
    rank: "⚡ Speed Demon",
    date: "2024-12",
    icon: "Zap",
    comparison: "Usain Bolt moment - shattering previous time records"
  },
  {
    id: "ach-006",
    achievement: "Deployment Streak",
    category: "projects",
    stat: "Successful Deployments",
    statValue: 30,
    rank: "🔥 Hot Streak",
    date: "2024-2025",
    icon: "GitCommit",
    comparison: "30-game hitting streak - consistent performance under pressure"
  },
  {
    id: "ach-007",
    achievement: "Community Leadership",
    category: "contributions",
    stat: "Community Size",
    statValue: "400+",
    rank: "👥 Team Captain",
    date: "2023-2024",
    icon: "Users",
    comparison: "Team captain leading 400+ members - leadership at scale"
  },
  {
    id: "ach-008",
    achievement: "Knowledge Sharing",
    category: "contributions",
    stat: "Talks & Workshops",
    statValue: 18,
    rank: "🎤 Veteran Mentor",
    date: "2023-2024",
    icon: "MessageSquare",
    comparison: "Veteran player mentoring rookies - giving back to the game"
  },
  {
    id: "ach-009",
    achievement: "Problem Solving Marathon",
    category: "learning",
    stat: "Problems Solved",
    statValue: "500+",
    rank: "🧩 Endurance Champion",
    date: "2023-2025",
    icon: "Brain",
    comparison: "Marathon runner - consistent grinding, building endurance"
  },
  {
    id: "ach-010",
    achievement: "GATE Qualification",
    category: "learning",
    stat: "Competitive Exam",
    statValue: "Qualified",
    rank: "📚 Academic All-Star",
    date: "2024-03",
    icon: "GraduationCap",
    comparison: "Making the All-Academic team - excellence in fundamentals"
  },
  {
    id: "ach-011",
    achievement: "Violence Detection Accuracy",
    category: "projects",
    stat: "Model Accuracy",
    statValue: "91%",
    rank: "🎯 Sharpshooter",
    date: "2024",
    icon: "Target",
    comparison: "91% free throw percentage - elite accuracy in critical moments"
  },
  {
    id: "ach-012",
    achievement: "Uptime Performance",
    category: "projects",
    stat: "System Reliability",
    statValue: "99.7%",
    rank: "🛡️ Iron Wall Defense",
    date: "2024-2025",
    icon: "Shield",
    comparison: "Goalkeeper with 99.7% save rate - nearly impenetrable defense"
  },
  {
    id: "ach-013",
    achievement: "Response Time Record",
    category: "projects",
    stat: "Latency Reduction",
    statValue: "12ms (p95)",
    rank: "⏱️ Sprint Champion",
    date: "2025",
    icon: "Timer",
    comparison: "100m dash record - fastest response time in the league"
  },
  {
    id: "ach-014",
    achievement: "Multi-tool Versatility",
    category: "learning",
    stat: "Tech Stack Mastery",
    statValue: "15+ technologies",
    rank: "🎭 Polymath Player",
    date: "2024-2025",
    icon: "Layers",
    comparison: "Decathlete - excelling across multiple disciplines"
  }
];

// Season-by-season breakdown (like athlete career progression)
export const seasonStats = [
  {
    season: "2024-2025 (Pro Season 1)",
    team: "Docxster AI",
    role: "Associate Software Engineer",
    highlights: [
      "Rookie of the Year candidate - immediate impact",
      "30+ production deployments (games played)",
      "45% cost reduction achievement",
      "Built 3 major systems from scratch",
      "Team-high 99.7% reliability rating"
    ],
    stats: {
      features: 8,
      deployments: 30,
      impact: "45% cost savings",
      reliability: "99.7% uptime"
    }
  },
  {
    season: "2023-2024 (College/Amateur)",
    team: "University of Pune + Side Projects",
    role: "Student Developer",
    highlights: [
      "NASA Space Apps Global Nominee (Olympic qualifier equivalent)",
      "PICT Hackathon Champion",
      "Led 400+ member developer community",
      "500+ competitive programming problems",
      "18 technical talks delivered"
    ],
    stats: {
      hackathonWins: 2,
      communitySize: 400,
      problemsSolved: 500,
      talksGiven: 18
    }
  },
  {
    season: "2023 (Internship)",
    team: "Gaatha",
    role: "R&D Intern",
    highlights: [
      "First professional experience (drafted to minors)",
      "15% performance improvement on production site",
      "Geo-targeted system serving 10k+ users",
      "WordPress optimization and custom development"
    ],
    stats: {
      performanceGain: "15%",
      usersServed: "10k+",
      systemsBuilt: 2
    }
  }
];

// Economic Impact Metrics (presented as franchise value)
export const economicImpactMetrics: EconomicMetric[] = [
  {
    id: "metric-cost-savings",
    label: "Total Cost Savings Generated",
    value: 45,
    unit: "percentage",
    trend: "down", // down is good for costs!
    changePercent: 45,
    description: "Document processing cost reduction through optimized ML pipeline",
    visualType: "gauge"
  },
  {
    id: "metric-efficiency",
    label: "Manual Work Reduction",
    value: 60,
    unit: "percentage",
    trend: "down",
    changePercent: 60,
    description: "Sync effort eliminated through automated real-time service agent",
    visualType: "gauge"
  },
  {
    id: "metric-reliability",
    label: "System Uptime",
    value: 99.7,
    unit: "percentage",
    trend: "up",
    changePercent: 2.3,
    description: "Production system reliability across all deployed services",
    visualType: "gauge"
  },
  {
    id: "metric-requests",
    label: "Daily Requests Handled",
    value: 10000,
    unit: "requests",
    trend: "up",
    changePercent: 120,
    description: "Scale of systems kept resilient and performant",
    visualType: "line"
  },
  {
    id: "metric-latency",
    label: "P95 Response Time",
    value: 12,
    unit: "milliseconds",
    trend: "down",
    changePercent: 67,
    description: "Flag evaluation pipeline optimization achievement",
    visualType: "line"
  },
  {
    id: "metric-users",
    label: "Users Impacted",
    value: 10000,
    unit: "users",
    trend: "up",
    changePercent: 150,
    description: "Combined reach across all projects and platforms",
    visualType: "bar"
  },
  {
    id: "metric-code-efficiency",
    label: "Code Efficiency",
    value: -40,
    unit: "percentage",
    trend: "down",
    changePercent: 40,
    description: "Less code for same functionality - improved maintainability",
    visualType: "bar"
  },
  {
    id: "metric-deployments",
    label: "Deployment Frequency",
    value: 30,
    unit: "deployments",
    trend: "up",
    changePercent: 200,
    description: "Rapid iteration and delivery velocity",
    visualType: "bar"
  }
];

// Hall of Fame Moments (Career highlights)
export const hallOfFameMoments = [
  {
    year: 2025,
    month: 1,
    title: "PICT Concepts Championship",
    description: "Won hackathon with innovative solution - rookie year MVP performance",
    significance: "critical",
    icon: "Trophy"
  },
  {
    year: 2024,
    month: 10,
    title: "NASA Global Nominee",
    description: "Selected among top 0.1% globally - world championship qualification",
    significance: "critical",
    icon: "Rocket"
  },
  {
    year: 2024,
    month: 12,
    title: "45% Cost Reduction Achievement",
    description: "Optimized document processing pipeline - record-breaking efficiency",
    significance: "high",
    icon: "TrendingDown"
  },
  {
    year: 2024,
    month: 12,
    title: "Docxster Drive Launch",
    description: "Architected and shipped major platform - triple-double performance",
    significance: "high",
    icon: "Cloud"
  }
];

// Helper functions
export function getAchievementsByCategory(category: SportsAchievement['category']) {
  return sportsAchievements.filter(ach => ach.category === category);
}

export function getTopAchievements(count: number = 5) {
  return sportsAchievements.slice(0, count);
}

export function calculateOverallRating(): number {
  // Calculate overall "player rating" based on various metrics
  const baseRating = 75; // Starting point

  // Bonus points
  const hackathonBonus = getAchievementsByCategory('hackathons').length * 5;
  const projectBonus = getAchievementsByCategory('projects').length * 3;
  const communityBonus = getAchievementsByCategory('contributions').length * 2;
  const learningBonus = getAchievementsByCategory('learning').length * 2;

  const total = baseRating + hackathonBonus + projectBonus + communityBonus + learningBonus;

  // Cap at 99 (like FIFA/NBA ratings)
  return Math.min(99, total);
}

export function getPlayerCard() {
  return {
    name: "Devansh Dubey",
    position: "Full-Stack Engineer",
    overallRating: calculateOverallRating(),
    attributes: {
      pace: 92, // Deployment speed, iteration velocity
      shooting: 88, // Accuracy, bug-free code
      passing: 85, // Communication, collaboration
      dribbling: 90, // Problem-solving, debugging
      defending: 87, // Code review, security, reliability
      physical: 83, // Handling pressure, deadline performance
    },
    specialties: [
      "System Design",
      "Cloud Architecture",
      "Performance Optimization",
      "Real-time Systems"
    ],
    weakFoot: "4-star", // Versatility across tech stack
    skillMoves: "5-star", // Technical creativity
  };
}
