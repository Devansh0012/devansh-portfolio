"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Atom, Zap, Info } from "lucide-react";
import { physicsDemos } from "@/lib/physics-demos-data";
import type { PhysicsDemo } from "@/lib/polymath-data";

const difficultyConfig = {
  beginner: { color: "emerald", label: "Beginner" },
  intermediate: { color: "amber", label: "Intermediate" },
  advanced: { color: "red", label: "Advanced" },
};

function GravitySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = [
        { x: 300, y: 250, vx: 0, vy: 0, mass: 100, color: "#fbbf24" }, // Sun
        { x: 400, y: 250, vx: 0, vy: 2, mass: 5, color: "#3b82f6" }, // Planet 1
        { x: 200, y: 250, vx: 0, vy: -2, mass: 5, color: "#10b981" }, // Planet 2
        { x: 350, y: 150, vx: 1.5, vy: 0, mass: 3, color: "#ec4899" }, // Moon
      ];
    }

    const G = 0.5; // Gravitational constant

    function animate() {
      if (!ctx || !canvas) return;

      // Clear with trail effect
      ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Calculate forces
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist > 5) {
            const force = (G * particles[i].mass * particles[j].mass) / distSq;
            const fx = (force * dx) / dist;
            const fy = (force * dy) / dist;

            particles[i].vx += fx / particles[i].mass;
            particles[i].vy += fy / particles[i].mass;
            particles[j].vx -= fx / particles[j].mass;
            particles[j].vy -= fy / particles[j].mass;
          }
        }
      }

      // Update positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 10 || p.x > canvas.width - 10) p.vx *= -0.9;
        if (p.y < 10 || p.y > canvas.height - 10) p.vy *= -0.9;
        p.x = Math.max(10, Math.min(canvas.width - 10, p.x));
        p.y = Math.max(10, Math.min(canvas.height - 10, p.y));
      });

      // Draw particles
      particles.forEach((p) => {
        const radius = Math.sqrt(p.mass) * 2;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + "80");
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const reset = () => {
    particlesRef.current = [
      { x: 300, y: 250, vx: 0, vy: 0, mass: 100, color: "#fbbf24" },
      { x: 400, y: 250, vx: 0, vy: 2, mass: 5, color: "#3b82f6" },
      { x: 200, y: 250, vx: 0, vy: -2, mass: 5, color: "#10b981" },
      { x: 350, y: 150, vx: 1.5, vy: 0, mass: 3, color: "#ec4899" },
    ];
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const source1 = { x: 200, y: 200 };
      const source2 = { x: 400, y: 200 };
      const wavelength = 30;
      const amplitude = 20;

      // Draw interference pattern
      for (let x = 0; x < canvas.width; x += 4) {
        for (let y = 0; y < canvas.height; y += 4) {
          const dist1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
          const dist2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);

          const wave1 = Math.sin((dist1 - timeRef.current) / wavelength * Math.PI * 2) * amplitude;
          const wave2 = Math.sin((dist2 - timeRef.current) / wavelength * Math.PI * 2) * amplitude;

          const interference = wave1 + wave2;
          const brightness = Math.abs(interference / (amplitude * 2));

          ctx.fillStyle = `rgba(59, 130, 246, ${brightness})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }

      // Draw sources
      [source1, source2].forEach((source) => {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(source.x, source.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      timeRef.current += 0.5;

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ProjectileMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const animationRef = useRef<number>(0);
  const projectileRef = useRef<{ x: number; y: number; vx: number; vy: number; trail: Array<{x: number; y: number}> } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = 0.3; // gravity

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      if (projectileRef.current) {
        const p = projectileRef.current;

        // Update physics
        p.vy += g;
        p.x += p.vx;
        p.y += p.vy;

        // Add to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 100) p.trail.shift();

        // Draw trail
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        p.trail.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        // Draw projectile
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Check ground collision
        if (p.y >= canvas.height - 28) {
          setIsRunning(false);
        }
      }

      if (isRunning && projectileRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const launch = () => {
    const angleRad = (angle * Math.PI) / 180;
    projectileRef.current = {
      x: 50,
      y: 350,
      vx: velocity * Math.cos(angleRad) * 0.1,
      vy: -velocity * Math.sin(angleRad) * 0.1,
      trail: [],
    };
    setIsRunning(true);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
      />
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Angle: {angle}°</label>
          <input
            type="range"
            min="15"
            max="75"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Initial Velocity: {velocity}</label>
          <input
            type="range"
            min="20"
            max="80"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={launch}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Launch
        </button>
      </div>
    </div>
  );
}

function DoublePendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number>(0);
  const pendulumRef = useRef<{
    angle1: number;
    angle2: number;
    vel1: number;
    vel2: number;
    trail: Array<{x: number; y: number}>;
  }>({
    angle1: Math.PI / 2,
    angle2: Math.PI / 2 + 0.01, // Tiny difference for chaos
    vel1: 0,
    vel2: 0,
    trail: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const L1 = 100; // length of first pendulum
    const L2 = 100; // length of second pendulum
    const M1 = 10; // mass of first bob
    const M2 = 10; // mass of second bob
    const g = 1; // gravity
    const originX = canvas.width / 2;
    const originY = 100;

    function animate() {
      if (!ctx || !canvas) return;

      // Fade effect for trail
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const p = pendulumRef.current;

      // Double pendulum equations (simplified)
      const num1 = -g * (2 * M1 + M2) * Math.sin(p.angle1) - M2 * g * Math.sin(p.angle1 - 2 * p.angle2) - 2 * Math.sin(p.angle1 - p.angle2) * M2 * (p.vel2 * p.vel2 * L2 + p.vel1 * p.vel1 * L1 * Math.cos(p.angle1 - p.angle2));
      const den1 = L1 * (2 * M1 + M2 - M2 * Math.cos(2 * p.angle1 - 2 * p.angle2));
      const acc1 = num1 / den1;

      const num2 = 2 * Math.sin(p.angle1 - p.angle2) * (p.vel1 * p.vel1 * L1 * (M1 + M2) + g * (M1 + M2) * Math.cos(p.angle1) + p.vel2 * p.vel2 * L2 * M2 * Math.cos(p.angle1 - p.angle2));
      const den2 = L2 * (2 * M1 + M2 - M2 * Math.cos(2 * p.angle1 - 2 * p.angle2));
      const acc2 = num2 / den2;

      p.vel1 += acc1;
      p.vel2 += acc2;
      p.angle1 += p.vel1;
      p.angle2 += p.vel2;

      // Damping
      p.vel1 *= 0.999;
      p.vel2 *= 0.999;

      // Calculate positions
      const x1 = originX + L1 * Math.sin(p.angle1);
      const y1 = originY + L1 * Math.cos(p.angle1);
      const x2 = x1 + L2 * Math.sin(p.angle2);
      const y2 = y1 + L2 * Math.cos(p.angle2);

      // Add to trail
      p.trail.push({ x: x2, y: y2 });
      if (p.trail.length > 500) p.trail.shift();

      // Draw trail
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 1;
      ctx.beginPath();
      p.trail.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Draw rods
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw bobs
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw origin
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(originX, originY, 5, 0, Math.PI * 2);
      ctx.fill();

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const reset = () => {
    pendulumRef.current = {
      angle1: Math.PI / 2,
      angle2: Math.PI / 2 + 0.01,
      vel1: 0,
      vel2: 0,
      trail: [],
    };
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

function DopplerEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sourceVelocity, setSourceVelocity] = useState(2);
  const animationRef = useRef<number>(0);
  const sourceRef = useRef({ x: 100, vx: 2, waves: [] as Array<{x: number; radius: number}> });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sourceRef.current.vx = sourceVelocity;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const source = sourceRef.current;
      const y = canvas.height / 2;

      // Move source
      source.x += source.vx;
      if (source.x > canvas.width + 50) source.x = -50;
      if (source.x < -50) source.x = canvas.width + 50;

      // Emit wave every 20 frames
      if (timeRef.current % 20 === 0) {
        source.waves.push({ x: source.x, radius: 0 });
      }

      // Update and draw waves
      source.waves = source.waves.filter(wave => {
        wave.radius += 3;

        if (wave.radius < 200) {
          // Draw wave circle
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - wave.radius / 200})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(wave.x, y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
          return true;
        }
        return false;
      });

      // Draw source
      const gradient = ctx.createRadialGradient(source.x, y, 0, source.x, y, 20);
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(source.x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(source.x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw observer positions
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(450, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px Inter, sans-serif";
      ctx.fillText("Observer", 430, y + 25);

      // Display frequency effect
      const distanceToObserver = Math.abs(source.x - 450);
      const approaching = source.x < 450 && source.vx > 0;
      ctx.fillStyle = approaching ? "#10b981" : "#ef4444";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(
        approaching ? "Higher Frequency (Blue Shift)" : "Lower Frequency (Red Shift)",
        20,
        30
      );

      timeRef.current += 1;

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, sourceVelocity]);

  const reset = () => {
    sourceRef.current = { x: 100, vx: sourceVelocity, waves: [] };
    timeRef.current = 0;
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
      />
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Source Velocity: {sourceVelocity}</label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={sourceVelocity}
            onChange={(e) => setSourceVelocity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoCard({ demo, onLaunch }: { demo: PhysicsDemo; onLaunch: () => void }) {
  const difficulty = difficultyConfig[demo.difficulty as keyof typeof difficultyConfig];

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900/80">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white">
            {demo.title}
          </h3>
          <span className={`rounded-full bg-${difficulty.color}-500/10 px-3 py-1 text-xs text-${difficulty.color}-400 border border-${difficulty.color}-500/20`}>
            {difficulty.label}
          </span>
        </div>
        <p className="text-sm text-slate-300">{demo.description}</p>
      </div>

      {/* Concept */}
      <div className="mb-4 rounded-lg bg-blue-950/30 p-3 border border-blue-500/20">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-400">
          <Atom className="h-3 w-3" />
          Physics Concept
        </div>
        <p className="font-mono text-xs text-blue-300">{demo.concept}</p>
      </div>

      {/* Coding Analogy */}
      <div className="mb-4 rounded-lg bg-amber-950/30 p-3 border border-amber-500/20">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-400">
          <Zap className="h-3 w-3" />
          Coding Analogy
        </div>
        <p className="text-xs italic text-amber-300">{demo.codingAnalogy}</p>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {demo.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-800/50 px-2 py-1 text-xs text-slate-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Launch Button */}
      {demo.interactive && (
        <button
          onClick={onLaunch}
          className="w-full rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
        >
          Launch Interactive Demo
        </button>
      )}
    </div>
  );
}

export default function PhysicsPlayground() {
  const [selectedDemo, setSelectedDemo] = useState<PhysicsDemo | null>(null);
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filteredDemos = physicsDemos.filter(
    (demo) => filter === "all" || demo.difficulty === filter
  );

  const renderSimulation = () => {
    if (!selectedDemo) return null;

    switch (selectedDemo.id) {
      case "demo-gravity":
        return <GravitySimulator />;
      case "demo-wave-interference":
        return <WaveInterference />;
      case "demo-projectile":
        return <ProjectileMotion />;
      case "demo-pendulum":
        return <DoublePendulum />;
      case "demo-doppler":
        return <DopplerEffect />;
      default:
        return (
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-12 text-center">
            <Info className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <p className="text-slate-400">
              This simulation is coming soon. Check back later!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Atom className="h-8 w-8 text-blue-400" />
          <h2 className="text-4xl font-bold text-slate-100">Physics Playground</h2>
        </div>
        <p className="mx-auto max-w-2xl text-slate-300">
          Interactive physics simulations with coding analogies. Explore how physical principles
          mirror software engineering concepts.
        </p>
      </div>

      {/* Active Demo */}
      {selectedDemo && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-blue-100">
              {selectedDemo.title}
            </h3>
            <button
              onClick={() => setSelectedDemo(null)}
              className="text-sm text-slate-400 hover:text-slate-300"
            >
              Close ✕
            </button>
          </div>
          {renderSimulation()}
        </div>
      )}

      {/* Filters */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Filter by Difficulty
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-slate-700 text-slate-100"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
            }`}
          >
            All Demos ({physicsDemos.length})
          </button>
          {Object.entries(difficultyConfig).map(([key, config]) => {
            const count = physicsDemos.filter((d) => d.difficulty === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === key
                    ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Demos Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredDemos.map((demo) => (
          <DemoCard
            key={demo.id}
            demo={demo}
            onLaunch={() => setSelectedDemo(demo)}
          />
        ))}
      </div>
    </div>
  );
}
