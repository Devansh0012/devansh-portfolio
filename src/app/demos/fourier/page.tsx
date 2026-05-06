"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play, RotateCcw, Pencil, Type, FileImage, Image as ImageIcon } from "lucide-react";
import DrawPad from "./components/DrawPad";
import TextInput from "./components/TextInput";
import SvgUpload from "./components/SvgUpload";
import ImageUpload from "./components/ImageUpload";
import FourierCanvas from "./components/FourierCanvas";
import CoefficientPanel from "./components/CoefficientPanel";
import MathSummary from "./components/MathSummary";
import { computeDFT } from "@/lib/fourier/dft";
import {
  normalizeForCanvas,
  pointsToComplex,
  resamplePath,
  type Point,
} from "@/lib/fourier/pathSampling";

type Tab = "draw" | "text" | "svg" | "image";

const CANVAS_W = 720;
const CANVAS_H = 480;
const SAMPLE_COUNT = 400;

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "draw", label: "Draw", icon: Pencil },
  { id: "text", label: "Text", icon: Type },
  { id: "svg", label: "SVG", icon: FileImage },
  { id: "image", label: "Image", icon: ImageIcon },
];

export default function FourierVisualizer() {
  const [tab, setTab] = useState<Tab>("draw");
  const [normalizedPath, setNormalizedPath] = useState<Point[]>([]);
  const [numEpicycles, setNumEpicycles] = useState(60);
  const [speed, setSpeed] = useState(0.25);
  const [playing, setPlaying] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [tickInfo, setTickInfo] = useState({ t: 0, activeIndex: 0 });
  const [completed, setCompleted] = useState(false);

  const coefficients = useMemo(() => {
    if (normalizedPath.length < 4) return [];
    return computeDFT(pointsToComplex(normalizedPath));
  }, [normalizedPath]);

  const handleCommit = (rawPoints: Point[]) => {
    if (rawPoints.length < 4) return;
    const resampled = resamplePath(rawPoints, SAMPLE_COUNT);
    const normalized = normalizeForCanvas(resampled, CANVAS_W, CANVAS_H, 110);
    setNormalizedPath(normalized);
    setResetSignal((n) => n + 1);
    setCompleted(false);
  };

  const reset = () => {
    setResetSignal((n) => n + 1);
    setCompleted(false);
    setPlaying(true);
  };

  const handleComplete = useCallback(() => setCompleted(true), []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/demos"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Fourier Series Visualizer
              </h1>
              <p className="text-sm text-neutral-400">
                Decompose any shape into rotating epicycles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[360px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-4 border-b border-white/10">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex flex-col items-center gap-1 px-2 py-3 text-xs transition-colors ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300 border-b-2 border-cyan-400"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="p-4">
              {tab === "draw" && <DrawPad onCommit={handleCommit} />}
              {tab === "text" && <TextInput onCommit={handleCommit} />}
              {tab === "svg" && <SvgUpload onCommit={handleCommit} />}
              {tab === "image" && <ImageUpload onCommit={handleCommit} />}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Epicycles</span>
                <span className="text-white tabular-nums">{numEpicycles}</span>
              </div>
              <input
                type="range"
                min={1}
                max={Math.max(1, coefficients.length || 200)}
                value={numEpicycles}
                onChange={(e) => setNumEpicycles(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Speed</span>
                <span className="text-white tabular-nums">
                  {speed.toFixed(2)}×
                </span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1.5}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 transition-colors"
              >
                {playing ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {completed ? "Replay" : "Reset trace"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-neutral-400 space-y-2">
            <p className="text-neutral-300 font-medium">How it works</p>
            <p>
              The shape is sampled into {SAMPLE_COUNT} complex points and run
              through a Discrete Fourier Transform. Each coefficient becomes a
              rotating circle with its own radius (amplitude), frequency, and
              starting angle (phase). Adding them head-to-tail traces the
              original curve.
            </p>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4 flex items-center justify-center">
            <FourierCanvas
              coefficients={coefficients}
              ghostPath={normalizedPath}
              numEpicycles={Math.min(numEpicycles, coefficients.length || 1)}
              speed={speed}
              playing={playing}
              resetSignal={resetSignal}
              centerX={CANVAS_W / 2}
              centerY={CANVAS_H / 2}
              width={CANVAS_W}
              height={CANVAS_H}
              onTick={setTickInfo}
              onComplete={handleComplete}
            />
          </div>
          <CoefficientPanel
            coefficients={coefficients}
            numEpicycles={Math.min(numEpicycles, coefficients.length || 1)}
            activeIndex={tickInfo.activeIndex}
            t={tickInfo.t}
          />
          {completed && (
            <MathSummary
              coefficients={coefficients}
              numEpicycles={Math.min(numEpicycles, coefficients.length || 1)}
              sampleCount={SAMPLE_COUNT}
            />
          )}
        </main>
      </div>
    </div>
  );
}
