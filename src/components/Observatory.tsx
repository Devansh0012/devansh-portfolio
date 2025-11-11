"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Star, Sparkles, Code } from "lucide-react";
import { projects } from "@/lib/data";

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
}

interface Constellation {
  project: typeof projects[0];
  x: number;
  y: number;
  connections: number[];
}

export default function Observatory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [hoveredProject, setHoveredProject] = useState<typeof projects[0] | null>(null);
  const starsRef = useRef<Star[]>([]);
  const constellationsRef = useRef<Constellation[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize background stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          brightness: Math.random(),
          twinkleSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    }

    // Initialize project constellations
    if (constellationsRef.current.length === 0) {
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      projects.forEach((project, i) => {
        const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
        constellationsRef.current.push({
          project,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          connections: i < projects.length - 1 ? [i + 1] : [0],
        });
      });
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;

      // Clear with dark sky
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling background stars
      starsRef.current.forEach((star) => {
        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0) {
          star.twinkleSpeed *= -1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.brightness))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw constellation connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.lineWidth = 1;
      constellationsRef.current.forEach((constellation) => {
        constellation.connections.forEach((targetIdx) => {
          const target = constellationsRef.current[targetIdx];
          ctx.beginPath();
          ctx.moveTo(constellation.x, constellation.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw project nodes (stars)
      constellationsRef.current.forEach((constellation) => {
        const isHovered = hoveredProject === constellation.project;
        const isSelected = selectedProject === constellation.project;

        // Outer glow
        const glowSize = isHovered || isSelected ? 40 : 30;
        const gradient = ctx.createRadialGradient(
          constellation.x,
          constellation.y,
          0,
          constellation.x,
          constellation.y,
          glowSize
        );
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(constellation.x, constellation.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core star
        const coreSize = isHovered || isSelected ? 8 : 6;
        ctx.fillStyle = isSelected ? "#fbbf24" : "#3b82f6";
        ctx.beginPath();
        ctx.arc(constellation.x, constellation.y, coreSize, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect for hovered/selected
        if (isHovered || isSelected) {
          const pulseRadius = coreSize + Math.sin(time * 0.05) * 2;
          ctx.strokeStyle = isSelected ? "#fbbf24" : "#3b82f6";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(constellation.x, constellation.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      time++;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredProject, selectedProject]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on a constellation
    for (const constellation of constellationsRef.current) {
      const dist = Math.sqrt((x - constellation.x) ** 2 + (y - constellation.y) ** 2);
      if (dist < 20) {
        setSelectedProject(constellation.project);
        return;
      }
    }

    setSelectedProject(null);
  };

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const constellation of constellationsRef.current) {
      const dist = Math.sqrt((x - constellation.x) ** 2 + (y - constellation.y) ** 2);
      if (dist < 20) {
        setHoveredProject(constellation.project);
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredProject(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-400" />
          <h2 className="text-4xl font-bold text-slate-100">Project Observatory</h2>
        </div>
        <p className="mx-auto max-w-2xl text-slate-300">
          Navigate the constellation of projects. Click on stars to explore technical details,
          architecture decisions, and lessons learned.
        </p>
      </div>

      {/* Interactive Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          className="h-[500px] w-full cursor-crosshair rounded-lg border border-slate-700 bg-slate-950"
        />
        
        {/* Hover Tooltip */}
        {hoveredProject && !selectedProject && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-blue-500/30 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-medium text-blue-400">{hoveredProject.title}</p>
          </div>
        )}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="glass-card rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-sm">
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-4 text-xs text-slate-400 hover:text-slate-300"
          >
            ← Back to Observatory
          </button>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-bold text-amber-100">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                {selectedProject.title}
              </h3>
              <p className="text-slate-300">{selectedProject.description}</p>
            </div>

            {selectedProject.highlight && (
              <div className="rounded-lg bg-blue-950/30 p-4 border border-blue-500/20">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-400">
                  Technical Highlight
                </div>
                <p className="text-sm text-blue-300">{selectedProject.highlight}</p>
              </div>
            )}

            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.link && (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/30 border border-amber-500/30"
              >
                <ExternalLink className="h-4 w-4" />
                View Project
              </a>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-lg border border-slate-700/50 bg-slate-900/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-slate-400">Project Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
            <span className="text-xs text-slate-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-blue-400/30"></div>
            <span className="text-xs text-slate-400">Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
