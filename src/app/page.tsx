"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Code2, Brain, Sparkles, ChevronDown } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { LucideIcon } from "lucide-react";

// Animated 3D Background Scene
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  useEffect(() => {
    if (!pointsRef.current) return;

    const animate = () => {
      if (pointsRef.current) {
        pointsRef.current.rotation.x += 0.0005;
        pointsRef.current.rotation.y += 0.0003;
      }
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  // Create particle positions representing code/data flow
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 15 + Math.random() * 10;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [particleCount]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating geometric shapes representing concepts
function FloatingConcepts() {
  return (
    <>
      {/* Physics - Atom-like structure */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[-4, 2, -3]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Economics - Interconnected nodes */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere args={[0.4, 32, 32]} position={[4, -1, -2]}>
          <MeshDistortMaterial
            color="#10b981"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* History - Ancient geometry */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.2}>
        <Sphere args={[0.45, 32, 32]} position={[-3, -2, -4]}>
          <MeshDistortMaterial
            color="#f59e0b"
            attach="material"
            distort={0.5}
            speed={1}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Sports - Dynamic energy */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.5}>
        <Sphere args={[0.35, 32, 32]} position={[3, 2, -3]}>
          <MeshDistortMaterial
            color="#ef4444"
            attach="material"
            distort={0.6}
            speed={3}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>
    </>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <ParticleField />
      <FloatingConcepts />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

// Animated text component
function AnimatedTitle() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Devansh Dubey";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <h1 className="text-glow relative z-10 text-6xl font-bold leading-tight text-slate-100 md:text-7xl lg:text-8xl">
      {displayedText}
      <span className="animate-pulse">|</span>
    </h1>
  );
}

// Physics-inspired stats
function PhysicsStats() {
  const stats = [
    { label: "Code Velocity", value: "∞", unit: "commits/s", color: "text-blue-400" },
    { label: "Knowledge Mass", value: "∑", unit: "domains", color: "text-violet-400" },
    { label: "Impact Force", value: "F=ma", unit: "projects", color: "text-emerald-400" },
  ];

  return (
    <div className="relative z-10 mt-12 grid gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card group overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:border-blue-500/50"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="flex flex-col items-center">
            <div className={`text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
            <div className="text-sm font-medium text-slate-300">{stat.label}</div>
            <div className="mt-1 text-xs text-slate-500">{stat.unit}</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}

// Mode cards with physics concepts
function ModeCard({
  title,
  description,
  href,
  icon: Icon,
  physics,
  delay
}: {
  title: string;
  description: string;
  href: Route;
  icon: LucideIcon;
  physics: string;
  delay: number;
}) {
  return (
    <Link
      href={{ pathname: href }}
      className="glass-card group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <Icon className="h-8 w-8 text-blue-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-xs font-mono text-slate-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {physics}
          </span>
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-slate-100">{title}</h2>
        <p className="mb-6 text-slate-300">{description}</p>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition-all duration-300 group-hover:gap-4 group-hover:text-blue-200">
          Explore
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 group-hover:border-blue-500/50" />
    </Link>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Scene3D />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <div
          className="transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
            <Code2 className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Associate Software Engineer</span>
          </div>

          {/* Animated Title */}
          <AnimatedTitle />

          {/* Tagline */}
          <p className="mt-6 max-w-2xl text-xl text-slate-300">
            Building resilient systems at the intersection of{" "}
            <span className="font-semibold text-blue-400">physics</span>,{" "}
            <span className="font-semibold text-violet-400">code</span>, and{" "}
            <span className="font-semibold text-emerald-400">impact</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/recruiter"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>

            <Link
              href="/explorer"
              className="group rounded-full border border-slate-500/30 bg-slate-900/50 px-8 py-4 font-semibold backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:bg-slate-800/50"
            >
              <span className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Explore Polymath Journey
              </span>
            </Link>
          </div>

          {/* Physics Stats */}
          <PhysicsStats />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-slate-500">Scroll to explore</span>
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </div>
      </section>

      {/* Modes Section */}
      <section className="relative z-10 bg-gradient-to-b from-transparent to-slate-950 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-slate-100">Choose Your Path</h2>
            <p className="mt-4 text-slate-400">Each mode reveals a different dimension of engineering</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ModeCard
              title="Recruiter Mode"
              description="Impact metrics, team leadership, and production case studies"
              href="/recruiter"
              icon={Code2}
              physics="F = ma (Force = Impact)"
              delay={0}
            />

            <ModeCard
              title="Engineer Mode"
              description="System architecture, technical deep dives, and live demos"
              href="/engineer"
              icon={Sparkles}
              physics="E = mc² (Energy = Innovation)"
              delay={200}
            />

            <ModeCard
              title="Explorer Mode"
              description="Physics, history, economics - where knowledge converges"
              href="/explorer"
              icon={Brain}
              physics="∑ = Synthesis (Knowledge Sum)"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-slate-950 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card relative overflow-hidden rounded-3xl p-12 text-center">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-4xl font-semibold text-slate-100">
                Let&apos;s Build Something Extraordinary
              </h2>
              <p className="mt-4 text-xl text-slate-300">
                Open to collaborations, opportunities, and innovative projects
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-6 py-3 font-semibold text-blue-300 backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/30 hover:scale-105 border border-blue-500/30"
                >
                  Join Community
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="mailto:work@devanshdubey.com"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 bg-slate-900/50 px-6 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:border-slate-400 hover:bg-slate-800/50"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
