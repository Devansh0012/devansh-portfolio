"use client";

import { Sigma } from "lucide-react";
import type { FourierCoefficient } from "@/lib/fourier/dft";

type Props = {
  coefficients: FourierCoefficient[];
  numEpicycles: number;
  sampleCount: number;
};

const formatComplex = (re: number, im: number) => {
  const r = re.toFixed(2);
  const i = Math.abs(im).toFixed(2);
  const sign = im >= 0 ? "+" : "−";
  return `${r} ${sign} ${i}i`;
};

const formatTerm = (c: FourierCoefficient) => {
  const k = c.freq;
  const sign = k >= 0 ? "+" : "−";
  const absK = Math.abs(k);
  const exponent = absK === 1 ? `${sign}2πit` : `${sign}${absK}·2πit`;
  return `(${formatComplex(c.re, c.im)})·exp(${exponent})`;
};

export default function MathSummary({
  coefficients,
  numEpicycles,
  sampleCount,
}: Props) {
  if (coefficients.length === 0) return null;

  const visible = coefficients.slice(0, numEpicycles);
  const totalEnergy = coefficients.reduce((s, c) => s + c.amp * c.amp, 0);
  const visibleEnergy = visible.reduce((s, c) => s + c.amp * c.amp, 0);
  const energyPct = totalEnergy === 0 ? 0 : (visibleEnergy / totalEnergy) * 100;
  const dominant = visible.slice(0, 4);
  const fundamental = visible.find((c) => c.freq !== 0) ?? visible[0];

  return (
    <div className="rounded-lg border border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-white/5 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Sigma className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold text-white">
          Reconstruction complete — what just happened?
        </h2>
      </div>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Step 1 — Sampling
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Your shape was resampled into{" "}
          <span className="text-white font-mono">{sampleCount}</span>{" "}
          evenly-spaced points along its arc length. Each point{" "}
          <code className="text-cyan-300 font-mono">(x, y)</code> was treated as a
          complex number{" "}
          <code className="text-cyan-300 font-mono">z = x + iy</code>, turning the
          2D path into a 1D periodic complex signal.
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Step 2 — Discrete Fourier Transform
        </p>
        <div className="rounded-md bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-cyan-200 overflow-x-auto">
          c<sub>k</sub> = (1/N) · Σ<sub>n=0..N−1</sub> z<sub>n</sub> · exp(−2πi · k · n / N)
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">
          For each integer frequency{" "}
          <code className="text-cyan-300 font-mono">k</code>, the DFT computes a
          single complex number{" "}
          <code className="text-cyan-300 font-mono">c_k</code> whose magnitude is
          a circle&apos;s radius and whose argument is its starting phase. With
          N = {sampleCount}, that&apos;s {sampleCount} coefficients — one per
          frequency from −{sampleCount / 2} to +{sampleCount / 2 - 1}.
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Step 3 — Reconstruction
        </p>
        <div className="rounded-md bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-cyan-200 overflow-x-auto">
          z(t) = Σ<sub>k</sub> c<sub>k</sub> · exp(2πi · k · t),&nbsp;&nbsp;t ∈ [0, 1]
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Adding those rotating vectors head-to-tail at speed{" "}
          <code className="text-cyan-300 font-mono">k</code> revolutions per
          second redraws the original curve. Each circle you saw was one term in
          this sum.
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          For your shape
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label="Sample points" value={sampleCount.toString()} />
          <Stat
            label="Coefficients used"
            value={`${visible.length} / ${coefficients.length}`}
          />
          <Stat label="Energy captured" value={`${energyPct.toFixed(1)}%`} />
          <Stat
            label="Dominant frequency"
            value={`k = ${fundamental.freq}`}
          />
          <Stat
            label="Largest radius"
            value={visible[0].amp.toFixed(2)}
          />
          <Stat
            label="Phase of dominant"
            value={`${((fundamental.phase * 180) / Math.PI).toFixed(1)}°`}
          />
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Top {dominant.length} contributing terms
        </p>
        <div className="rounded-md bg-black/40 border border-white/10 px-4 py-3 font-mono text-xs text-neutral-200 leading-relaxed overflow-x-auto">
          z(t) ≈{" "}
          {dominant.map((c, i) => (
            <span key={i}>
              {i > 0 && " + "}
              <span className="text-cyan-300">{formatTerm(c)}</span>
            </span>
          ))}
          {visible.length > dominant.length && (
            <span className="text-neutral-500">
              {" "}
              + … ({visible.length - dominant.length} more terms)
            </span>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Why it works
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Any closed curve in the plane is a periodic complex-valued function.
          The DFT decomposes that function into a basis of pure rotations —
          frequencies that are perfectly orthogonal over one period. Truncating
          the sum keeps the loudest rotations and drops the quiet ones, which is
          why{" "}
          <span className="text-white font-mono">{visible.length}</span> circles
          out of {coefficients.length} already capture{" "}
          <span className="text-white font-mono">{energyPct.toFixed(1)}%</span>{" "}
          of the signal&apos;s energy (Parseval&apos;s theorem). Adding more
          circles refines the high-frequency detail; removing circles smooths
          the curve.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/40 border border-white/10 px-3 py-2">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="text-sm text-white font-mono mt-0.5">{value}</div>
    </div>
  );
}
