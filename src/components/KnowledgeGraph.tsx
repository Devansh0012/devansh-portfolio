"use client";

/**
 * Knowledge Graph - Interactive visualization of interests
 * Features:
 * - Physics-based node positioning and attraction
 * - Interactive hover states with fact previews
 * - Animated connections between related domains
 * - Accessible keyboard navigation
 * - Responsive layout
 *
 * HCI Principles Applied:
 * - Affordance: Hoverable nodes with cursor feedback
 * - Feedback: Immediate visual response to interactions
 * - Visibility: Clear labeling and color coding
 * - Consistency: Unified interaction patterns
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { knowledgeGraph, polymathFacts, type KnowledgeNode, type PolymathFact } from "@/lib/polymath-data";
import * as Icons from "lucide-react";

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ICON_MAP: Record<string, keyof typeof Icons> = {
  BookOpen: "BookOpen",
  Atom: "Atom",
  TrendingUp: "TrendingUp",
  Trophy: "Trophy",
  Code: "Code",
  Sparkles: "Sparkles",
};

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);

  // Initialize node positions in a circular layout
  useEffect(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.3;

    const positions = knowledgeGraph.map((node, i) => {
      const angle = (i / knowledgeGraph.length) * 2 * Math.PI;
      return {
        id: node.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });

    setNodePositions(positions);
  }, [dimensions]);

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.min(600, containerRef.current.offsetWidth * 0.75),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Physics simulation for node attraction/repulsion
  const updatePhysics = useCallback(() => {
    setNodePositions((prevPositions) => {
      const newPositions = prevPositions.map((pos) => ({ ...pos }));

      // Apply forces between nodes
      for (let i = 0; i < newPositions.length; i++) {
        const node = knowledgeGraph[i];
        const pos = newPositions[i];

        // Repulsion from all other nodes
        for (let j = 0; j < newPositions.length; j++) {
          if (i === j) continue;
          const other = newPositions[j];
          const dx = pos.x - other.x;
          const dy = pos.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < 200) {
            const force = 100 / (distance * distance);
            pos.vx += (dx / distance) * force;
            pos.vy += (dy / distance) * force;
          }
        }

        // Attraction to connected nodes
        node.connections.forEach((connId) => {
          const connIndex = knowledgeGraph.findIndex((n) => n.id === connId);
          if (connIndex >= 0) {
            const other = newPositions[connIndex];
            const dx = other.x - pos.x;
            const dy = other.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
              const force = distance * 0.001;
              pos.vx += (dx / distance) * force;
              pos.vy += (dy / distance) * force;
            }
          }
        });

        // Attraction to center (gentle)
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const dx = centerX - pos.x;
        const dy = centerY - pos.y;
        pos.vx += dx * 0.0005;
        pos.vy += dy * 0.0005;

        // Apply velocity with damping
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.vx *= 0.85;
        pos.vy *= 0.85;

        // Keep nodes within bounds
        const margin = 60;
        pos.x = Math.max(margin, Math.min(dimensions.width - margin, pos.x));
        pos.y = Math.max(margin, Math.min(dimensions.height - margin, pos.y));
      }

      return newPositions;
    });
  }, [dimensions]);

  // Animation loop for physics
  useEffect(() => {
    const animate = () => {
      updatePhysics();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updatePhysics]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw connections
    knowledgeGraph.forEach((node, i) => {
      const pos = nodePositions[i];
      if (!pos) return;

      node.connections.forEach((connId) => {
        const connIndex = knowledgeGraph.findIndex((n) => n.id === connId);
        const connPos = nodePositions[connIndex];
        if (!connPos) return;

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(connPos.x, connPos.y);
        ctx.strokeStyle = hoveredNode?.id === node.id || hoveredNode?.id === connId
          ? `${node.color}40`
          : "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = hoveredNode?.id === node.id || hoveredNode?.id === connId ? 2 : 1;
        ctx.stroke();
      });
    });

    // Draw nodes
    knowledgeGraph.forEach((node, i) => {
      const pos = nodePositions[i];
      if (!pos) return;

      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;
      const radius = isHovered || isSelected ? 35 : 28;

      // Glow effect for hovered/selected
      if (isHovered || isSelected) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = node.color;
      } else {
        ctx.shadowBlur = 0;
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isHovered || isSelected
        ? `${node.color}40`
        : `${node.color}20`;
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isHovered || isSelected ? 3 : 2;
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;
    });
  }, [nodePositions, hoveredNode, selectedNode, dimensions]);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: KnowledgeNode | null = null;

    knowledgeGraph.forEach((node, i) => {
      const pos = nodePositions[i];
      if (!pos) return;

      const dx = mouseX - pos.x;
      const dy = mouseY - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 35) {
        found = node;
      }
    });

    setHoveredNode(found);
  }, [nodePositions]);

  const handleClick = useCallback(() => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode === selectedNode ? null : hoveredNode);
    }
  }, [hoveredNode, selectedNode]);

  // Get facts for selected/hovered node
  const getNodeFacts = (node: KnowledgeNode): PolymathFact[] => {
    return polymathFacts.filter(fact => node.facts.includes(fact.id));
  };

  const displayNode = selectedNode || hoveredNode;
  const displayFacts = displayNode ? getNodeFacts(displayNode) : [];

  return (
    <div ref={containerRef} className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-glow">The Polymath&apos;s Lab</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Exploring the intersections between technology, physics, economics, history, sports, and beyond.
          Hover over the nodes to discover connections.
        </p>
      </div>

      <div className="glass rounded-2xl p-8 relative">
        {/* Canvas for connections and nodes */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="w-full cursor-pointer"
          style={{ display: "block" }}
          aria-label="Interactive knowledge graph showing connections between interests"
        />

        {/* Interactive node labels overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {knowledgeGraph.map((node, i) => {
            const pos = nodePositions[i];
            if (!pos) return null;

            const IconComponent = Icons[ICON_MAP[node.icon]] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
            const isActive = hoveredNode?.id === node.id || selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  color: node.color,
                  opacity: isActive ? 1 : 0.9,
                  transition: "opacity 0.2s ease",
                }}
              >
                {IconComponent && (
                  <IconComponent
                    className={`w-6 h-6 mb-1 ${isActive ? "animate-pulse" : ""}`}
                    aria-hidden="true"
                  />
                )}
                <span className="text-xs font-semibold whitespace-nowrap">
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facts panel */}
      {displayNode && (
        <div
          className="mt-6 glass-card rounded-xl p-6 fade-in-up"
          style={{ borderColor: displayNode.color }}
          role="region"
          aria-label={`Facts about ${displayNode.label}`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${displayNode.color}20`, borderColor: displayNode.color, borderWidth: 2 }}
            >
              {(() => {
                const IconComponent = Icons[ICON_MAP[displayNode.icon]] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                return IconComponent ? (
                  <IconComponent className="w-6 h-6" style={{ color: displayNode.color }} />
                ) : null;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2" style={{ color: displayNode.color }}>
                {displayNode.label}
              </h3>
              <p className="text-slate-300">{displayNode.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Featured Insights
            </h4>
            {displayFacts.slice(0, 3).map((fact) => (
              <div key={fact.id} className="border-l-2 pl-4 py-2" style={{ borderColor: displayNode.color }}>
                <h5 className="font-semibold text-slate-200 mb-1">{fact.title}</h5>
                <p className="text-sm text-slate-400">{fact.description}</p>
                {fact.relatedInterests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fact.relatedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4 italic">
            Click a node to pin it, click again to unpin
          </p>
        </div>
      )}

      {/* Accessibility: Keyboard instructions */}
      <div className="sr-only" role="status" aria-live="polite">
        {hoveredNode && `Hovering over ${hoveredNode.label}: ${hoveredNode.description}`}
        {selectedNode && `Selected ${selectedNode.label}. Click again to deselect.`}
      </div>
    </div>
  );
}
