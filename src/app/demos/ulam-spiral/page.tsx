"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Pause, Play, RotateCcw, Grid3x3, Spline, Orbit, Cpu, Code2 } from "lucide-react";
import type { SpiralStyle } from "@/lib/ulam/spiral";
import type { TimingInfo } from "./components/UlamScene";
import type { ComputeBackend } from "@/lib/wasm/loader";

const UlamScene = dynamic(
  () => import("./components/UlamScene"),
  { ssr: false, loading: () => (
    <div className="w-full h-[560px] rounded-lg border border-white/10 bg-[#05070d] flex items-center justify-center text-neutral-500 text-sm">
      Loading 3D scene…
    </div>
  )}
);

type StyleOption = {
  id: SpiralStyle;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STYLES: StyleOption[] = [
  { id: "square", label: "Square", blurb: "Classic Ulam grid", icon: Grid3x3 },
  { id: "helix", label: "Helix", blurb: "Numbers wrap a cylinder", icon: Spline },
  { id: "sacks", label: "Sacks", blurb: "Archimedean spiral", icon: Orbit },
];

export default function UlamSpiralPage() {
  const [style, setStyle] = useState<SpiralStyle>("square");
  const [count, setCount] = useState(2500);
  const [speed, setSpeed] = useState(0.5);
  const [buildup, setBuildup] = useState(true);
  const [replaySignal, setReplaySignal] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [primesShown, setPrimesShown] = useState(0);
  const [backend, setBackend] = useState<ComputeBackend>("wasm");
  const [timing, setTiming] = useState<TimingInfo | null>(null);

  const onProgress = useCallback((r: number, p: number) => {
    setRevealed(r);
    setPrimesShown(p);
  }, []);

  const onTiming = useCallback((info: TimingInfo) => {
    setTiming(info);
  }, []);

  const replay = () => {
    setBuildup(true);
    setReplaySignal((n) => n + 1);
  };

  const showAll = () => {
    setBuildup(false);
    setReplaySignal((n) => n + 1);
  };

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
                3D Ulam Spiral
              </h1>
              <p className="text-sm text-neutral-400">
                Watch primes arrange themselves in 3D
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[340px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/10">
              {STYLES.map(({ id, label, icon: Icon }) => {
                const active = style === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setStyle(id);
                      setReplaySignal((n) => n + 1);
                    }}
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
            <div className="p-4 text-xs text-neutral-400">
              {STYLES.find((s) => s.id === style)?.blurb}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Numbers (N)</span>
                <span className="text-white tabular-nums">{count.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={count}
                onChange={(e) => {
                  setCount(Number(e.target.value));
                  setReplaySignal((n) => n + 1);
                }}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Build speed</span>
                <span className="text-white tabular-nums">{speed.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={replay}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 transition-colors"
              >
                {buildup ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                Replay build
              </button>
              <button
                type="button"
                onClick={showAll}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Show all
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-2 border-b border-white/10">
              {(["wasm", "js"] as const).map((b) => {
                const active = backend === b;
                const Icon = b === "wasm" ? Cpu : Code2;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBackend(b);
                      setReplaySignal((n) => n + 1);
                    }}
                    className={`flex items-center justify-center gap-2 px-2 py-3 text-xs transition-colors ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300 border-b-2 border-cyan-400"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {b === "wasm" ? "C++ / WASM" : "JavaScript"}
                  </button>
                );
              })}
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Active backend</span>
                <span className="text-white tabular-nums">
                  {timing?.backend === "wasm" ? "WASM" : timing?.backend === "js" ? "JS" : "…"}
                  {backend === "wasm" && timing?.backend === "js" && (
                    <span className="text-amber-400 ml-1">(fallback)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Sieve</span>
                <span className="text-white tabular-nums">
                  {timing ? `${timing.sieveMs.toFixed(2)} ms` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Spiral coords</span>
                <span className="text-white tabular-nums">
                  {timing ? `${timing.spiralMs.toFixed(2)} ms` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Primes ≤ N</span>
                <span className="text-cyan-300 tabular-nums">
                  {timing ? timing.primeCount.toLocaleString() : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Revealed</span>
              <span className="text-white tabular-nums">
                {revealed.toLocaleString()} / {count.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Primes shown</span>
              <span className="text-cyan-300 tabular-nums">
                {primesShown.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Prime density</span>
              <span className="text-white tabular-nums">
                {revealed > 0
                  ? `${((primesShown / revealed) * 100).toFixed(1)}%`
                  : "—"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-neutral-400 space-y-2">
            <p className="text-neutral-300 font-medium">What you&apos;re seeing</p>
            <p>
              Each integer from 1 to N is placed along the spiral. Primes pop up
              as glowing cyan markers; composites stay flat as dim tiles.
              Surprisingly, primes cluster along diagonals (square),
              concentric rings (helix), and prime-rich rays (Sacks) — visible
              footprints of prime-rich quadratic polynomials.
            </p>
          </div>
        </aside>

        <main>
          <UlamScene
            style={style}
            count={count}
            buildup={buildup}
            speed={speed}
            replaySignal={replaySignal}
            backend={backend}
            onProgress={onProgress}
            onTiming={onTiming}
          />
        </main>
      </div>
    </div>
  );
}
