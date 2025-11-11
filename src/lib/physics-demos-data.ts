/**
 * Physics Playground - Interactive demonstrations
 */

import type { PhysicsDemo } from "./polymath-data";

export const physicsDemos: PhysicsDemo[] = [
  {
    id: "demo-gravity",
    title: "Gravity Simulator",
    description: "Interactive N-body gravity simulation showing how objects attract each other based on mass and distance.",
    concept: "Newton's Law of Universal Gravitation: F = G(m1*m2)/r²",
    difficulty: "beginner",
    codingAnalogy: "Like dependency graphs - objects (dependencies) pull on each other, creating complex interactions. A single heavy object (core library) influences many smaller ones.",
    interactive: true,
    tags: ["gravity", "forces", "simulation", "newton"]
  },
  {
    id: "demo-wave-interference",
    title: "Wave Interference",
    description: "Visualize constructive and destructive interference patterns when waves overlap.",
    concept: "Superposition Principle: When two waves meet, their amplitudes add together",
    difficulty: "intermediate",
    codingAnalogy: "Similar to event streams merging - when multiple events occur simultaneously, their effects combine. Can cause race conditions (interference) if not handled properly.",
    interactive: true,
    tags: ["waves", "interference", "optics", "sound"]
  },
  {
    id: "demo-projectile",
    title: "Projectile Motion",
    description: "Explore parabolic motion by adjusting initial velocity and launch angle. See how gravity affects trajectory.",
    concept: "Kinematic equations: horizontal (constant velocity) + vertical (constant acceleration)",
    difficulty: "beginner",
    codingAnalogy: "Like request/response cycles - horizontal motion (time) is constant, vertical motion (data processing) has acceleration (growing load). Peak height = max memory usage.",
    interactive: true,
    tags: ["kinematics", "motion", "trajectory"]
  },
  {
    id: "demo-pendulum",
    title: "Double Pendulum Chaos",
    description: "Watch how tiny changes in starting position lead to wildly different outcomes - demonstrating chaos theory.",
    concept: "Deterministic chaos: sensitive dependence on initial conditions",
    difficulty: "advanced",
    codingAnalogy: "Perfect metaphor for floating-point errors and distributed systems. Tiny differences compound exponentially. Why testing edge cases matters!",
    interactive: true,
    tags: ["chaos", "nonlinear", "dynamics"]
  },
  {
    id: "demo-doppler",
    title: "Doppler Effect",
    description: "Hear and see how frequency changes when a sound source moves relative to you.",
    concept: "Frequency shift due to relative motion: f' = f(v ± v₀)/(v ± vₛ)",
    difficulty: "intermediate",
    codingAnalogy: "Like sampling rate in data streaming - if source (producer) moves faster than observer (consumer), messages bunch up (higher frequency). If slower, they spread out.",
    interactive: true,
    tags: ["waves", "sound", "frequency", "doppler"]
  },
  {
    id: "demo-springs",
    title: "Hooke's Law Springs",
    description: "Experiment with spring systems - series, parallel, and coupled oscillations.",
    concept: "Hooke's Law: F = -kx (force proportional to displacement)",
    difficulty: "beginner",
    codingAnalogy: "Like rate limiting and back-pressure - system pushes back proportionally to load. Spring constant k = how aggressive your rate limiter is.",
    interactive: true,
    tags: ["springs", "oscillation", "elastic", "hooke"]
  },
  {
    id: "demo-relativity",
    title: "Time Dilation",
    description: "See how time slows down at high speeds (special relativity) using a twin paradox scenario.",
    concept: "Time dilation: t' = t/√(1 - v²/c²)",
    difficulty: "advanced",
    codingAnalogy: "Network latency! Different 'reference frames' (servers) experience time differently based on their 'velocity' (load). Clocks drift between distributed systems.",
    interactive: true,
    tags: ["relativity", "time", "einstein", "spacetime"]
  },
  {
    id: "demo-quantum-tunnel",
    title: "Quantum Tunneling",
    description: "Visualize how particles can 'teleport' through energy barriers - the quantum effect affecting modern CPUs.",
    concept: "Wave function penetration through classically forbidden regions",
    difficulty: "advanced",
    codingAnalogy: "Like buffer overflows or privilege escalation - particles escaping confinement they 'shouldn't' be able to. In chips, electrons tunnel through insulation.",
    interactive: true,
    tags: ["quantum", "tunneling", "wave-function"]
  },
  {
    id: "demo-entropy",
    title: "Entropy & Disorder",
    description: "Watch ordered systems become disordered over time - the arrow of time from thermodynamics.",
    concept: "Second Law of Thermodynamics: entropy always increases in closed systems",
    difficulty: "intermediate",
    codingAnalogy: "Technical debt! Without active maintenance (energy input), code inevitably becomes more disordered. You can't 'unspaghettify' code without work.",
    interactive: true,
    tags: ["thermodynamics", "entropy", "disorder"]
  },
  {
    id: "demo-electric-field",
    title: "Electric Field Lines",
    description: "Visualize electric fields around charged particles - positive and negative charges attracting and repelling.",
    concept: "Coulomb's Law: F = kq₁q₂/r²",
    difficulty: "beginner",
    codingAnalogy: "Like API endpoints and clients - endpoints (charges) create 'fields' of influence. Clients (test charges) follow field lines to find endpoints. Load balancers distribute charge.",
    interactive: true,
    tags: ["electricity", "fields", "coulomb", "charges"]
  },
  {
    id: "demo-refraction",
    title: "Light Refraction",
    description: "See how light bends when passing between materials (air, water, glass) - why objects underwater appear displaced.",
    concept: "Snell's Law: n₁sin(θ₁) = n₂sin(θ₂)",
    difficulty: "intermediate",
    codingAnalogy: "Like data transformation between layers - payload 'bends' (transforms) when crossing boundaries. API contracts ensure proper 'angle of incidence'.",
    interactive: true,
    tags: ["optics", "light", "refraction", "snell"]
  },
  {
    id: "demo-circuits",
    title: "Circuit Builder",
    description: "Build simple circuits with batteries, resistors, and LEDs. Calculate voltage, current, and power.",
    concept: "Ohm's Law: V = IR, and Kirchhoff's Laws for circuits",
    difficulty: "beginner",
    codingAnalogy: "Direct analogy! Voltage = API calls, Current = throughput, Resistance = latency. Series circuits = synchronous calls, Parallel = concurrent execution.",
    interactive: true,
    tags: ["electricity", "circuits", "ohm", "current"]
  }
];

// Physics-inspired coding challenges
export const physicsCodeChallenges = [
  {
    id: "challenge-collatz",
    title: "Collatz Conjecture (Chaos Theory)",
    description: "Implement the Collatz sequence - chaotic behavior from simple rules (like double pendulum)",
    difficulty: "medium",
    physicsConnection: "Demonstrates deterministic chaos - simple rules creating complex, unpredictable patterns"
  },
  {
    id: "challenge-gravitysort",
    title: "Gravity Sort Algorithm",
    description: "Implement a sorting algorithm based on gravity - beads falling through rods",
    difficulty: "hard",
    physicsConnection: "Uses physics simulation principles - objects settle based on gravitational force"
  },
  {
    id: "challenge-wave-compression",
    title: "Wave-based Data Compression",
    description: "Compress data using Fourier-like transformations (basis of JPEG, MP3)",
    difficulty: "expert",
    physicsConnection: "Applies wave interference and frequency domain analysis to data compression"
  },
  {
    id: "challenge-particle-swarm",
    title: "Particle Swarm Optimization",
    description: "Solve optimization problems using physics-based particle movement",
    difficulty: "hard",
    physicsConnection: "Uses particle physics principles - velocity, acceleration, and force to find optimal solutions"
  }
];

// Educational explanations for common physics-CS connections
export const physicsCSConnections = [
  {
    concept: "Latency and Speed of Light",
    physics: "Light travels at 299,792 km/s - the universal speed limit",
    computing: "Network latency has hard physical limits. NYC to Sydney = minimum 106ms even with perfect fiber optics.",
    formula: "Time = Distance / Speed of Light",
    example: "This is why CDNs exist - can't beat physics, so we move data closer to users."
  },
  {
    concept: "Quantum Tunneling in Transistors",
    physics: "Particles can pass through energy barriers via wave function penetration",
    computing: "At 5nm scale, electrons tunnel through gate oxide, causing leakage current and power waste.",
    formula: "Probability ∝ exp(-2κd) where d is barrier width",
    example: "Why chip manufacturing is so expensive - fighting quantum effects at nanoscale."
  },
  {
    concept: "Entropy and Information",
    physics: "Disorder always increases in closed systems (2nd Law of Thermodynamics)",
    computing: "Erasing data generates heat. Minimum energy = kT ln(2) per bit (Landauer's principle).",
    formula: "S = k ln(W) - Boltzmann entropy",
    example: "Your SSD gets warm when writing - thermodynamically unavoidable!"
  },
  {
    concept: "Harmonic Oscillators",
    physics: "Springs and pendulums oscillate at natural frequencies",
    computing: "CPU clock cycles, retry exponential backoff, and rate limiting use harmonic principles.",
    formula: "ω = √(k/m) - natural frequency",
    example: "Exponential backoff is damped oscillation - gradually reducing retry frequency."
  },
  {
    concept: "Conservation Laws",
    physics: "Energy, momentum, angular momentum are conserved in closed systems",
    computing: "ACID properties in databases - consistency is conservation. Idempotency ensures operations don't create/destroy state.",
    formula: "ΔE_total = 0 in closed system",
    example: "Database transactions conserve data integrity like physics conserves energy."
  },
  {
    concept: "Relativity and Distributed Systems",
    physics: "No absolute simultaneity - events can be simultaneous in one frame but not another",
    computing: "No global clock in distributed systems. Lamport timestamps and vector clocks handle causality.",
    formula: "Δt' = γ(Δt - vΔx/c²) - relativity of simultaneity",
    example: "CAP theorem's partition tolerance = dealing with 'relativistic' network effects."
  }
];

// Helper functions
export function getDemosByDifficulty(difficulty: PhysicsDemo['difficulty']) {
  return physicsDemos.filter(demo => demo.difficulty === difficulty);
}

export function getBeginnerDemos() {
  return getDemosByDifficulty('beginner');
}

export function getInteractiveDemos() {
  return physicsDemos.filter(demo => demo.interactive);
}

export function getDemoById(id: string) {
  return physicsDemos.find(demo => demo.id === id);
}

export function getRandomDemo() {
  return physicsDemos[Math.floor(Math.random() * physicsDemos.length)];
}

export function searchDemos(query: string) {
  const lowerQuery = query.toLowerCase();
  return physicsDemos.filter(demo =>
    demo.title.toLowerCase().includes(lowerQuery) ||
    demo.description.toLowerCase().includes(lowerQuery) ||
    demo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
