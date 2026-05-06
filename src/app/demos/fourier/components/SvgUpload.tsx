"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { samplePointsFromSvg } from "@/lib/fourier/svgPath";
import type { Point } from "@/lib/fourier/pathSampling";

type Props = {
  onCommit: (points: Point[]) => void;
};

export default function SvgUpload({ onCommit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setFilename(file.name);
    try {
      const text = await file.text();
      const points = samplePointsFromSvg(text, 800);
      if (points.length < 8) {
        setError("SVG didn't yield enough points to trace.");
        return;
      }
      onCommit(points);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse SVG");
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-10 text-sm text-neutral-300 hover:bg-white/10 hover:border-white/25 transition-colors"
      >
        <Upload className="h-5 w-5 text-cyan-400" />
        <span>Click to upload SVG</span>
        <span className="text-[11px] text-neutral-500">
          Single-path silhouettes work best
        </span>
      </button>
      {filename && (
        <p className="text-xs text-neutral-400">
          Loaded: <span className="text-white">{filename}</span>
        </p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
