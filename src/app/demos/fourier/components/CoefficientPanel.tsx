"use client";

import { useEffect, useRef } from "react";
import type { FourierCoefficient } from "@/lib/fourier/dft";

type Props = {
  coefficients: FourierCoefficient[];
  numEpicycles: number;
  activeIndex: number;
  t: number;
};

export default function CoefficientPanel({
  coefficients,
  numEpicycles,
  activeIndex,
  t,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLDivElement>(
      `[data-coeff-index="${activeIndex}"]`,
    );
    if (el && listRef.current) {
      const parent = listRef.current;
      const parentRect = parent.getBoundingClientRect();
      const childRect = el.getBoundingClientRect();
      if (childRect.top < parentRect.top || childRect.bottom > parentRect.bottom) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  if (coefficients.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-neutral-500">
        Coefficients will appear once you provide an input.
      </div>
    );
  }

  const visible = coefficients.slice(0, numEpicycles);
  const total = visible.reduce((s, c) => s + c.amp, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-3 py-2 border-b border-white/10 text-xs text-neutral-400 flex justify-between">
        <span>
          Showing top <span className="text-white">{visible.length}</span> of{" "}
          {coefficients.length} coefficients
        </span>
        <span>
          t = <span className="text-cyan-300 tabular-nums">{t.toFixed(3)}</span>
        </span>
      </div>
      <div className="px-3 py-2 border-b border-white/10 text-[11px] text-neutral-500 font-mono">
        z(t) = Σ c_k · exp(2πi·k·t)
      </div>
      <div ref={listRef} className="max-h-80 overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <thead className="bg-black/40 sticky top-0">
            <tr className="text-neutral-500">
              <th className="text-left px-3 py-2 font-normal">k</th>
              <th className="text-right px-3 py-2 font-normal">freq</th>
              <th className="text-right px-3 py-2 font-normal">|c_k|</th>
              <th className="text-right px-3 py-2 font-normal">arg(c_k)°</th>
              <th className="text-right px-3 py-2 font-normal">share</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c, i) => {
              const isActive = i === activeIndex;
              const phaseDeg = (c.phase * 180) / Math.PI;
              const share = total === 0 ? 0 : (c.amp / total) * 100;
              return (
                <tr
                  key={`${c.k}-${i}`}
                  data-coeff-index={i}
                  className={
                    isActive
                      ? "bg-cyan-400/15 text-cyan-200"
                      : "text-neutral-300 hover:bg-white/5"
                  }
                >
                  <td className="px-3 py-1.5">{i}</td>
                  <td className="text-right px-3 py-1.5 tabular-nums">
                    {c.freq}
                  </td>
                  <td className="text-right px-3 py-1.5 tabular-nums">
                    {c.amp.toFixed(2)}
                  </td>
                  <td className="text-right px-3 py-1.5 tabular-nums">
                    {phaseDeg.toFixed(1)}
                  </td>
                  <td className="text-right px-3 py-1.5 tabular-nums text-neutral-500">
                    {share.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
