"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import {
  imageDataToBinary,
  loadImageToCanvas,
  traceLargestContour,
} from "@/lib/fourier/contourTrace";
import type { Point } from "@/lib/fourier/pathSampling";

type Props = {
  onCommit: (points: Point[]) => void;
};

export default function ImageUpload({ onCommit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [threshold, setThreshold] = useState(128);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastImageRef = useRef<{ data: ImageData; w: number; h: number } | null>(null);

  const trace = (data: ImageData, w: number, h: number, t: number) => {
    const bin = imageDataToBinary(data, t);
    const points = traceLargestContour(bin, w, h);
    if (points.length < 8) {
      setError(
        "Couldn't find a contour — try a different threshold or a higher-contrast image.",
      );
      return;
    }
    setError(null);
    onCommit(points);
  };

  const handleFile = async (file: File) => {
    setError(null);
    setFilename(file.name);
    try {
      const { imageData, width, height } = await loadImageToCanvas(file, 400);
      lastImageRef.current = { data: imageData, w: width, h: height };
      trace(imageData, width, height, threshold);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image");
    }
  };

  const onThresholdChange = (v: number) => {
    setThreshold(v);
    const cached = lastImageRef.current;
    if (cached) trace(cached.data, cached.w, cached.h, v);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
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
        <ImageIcon className="h-5 w-5 text-cyan-400" />
        <span>Click to upload image</span>
        <span className="text-[11px] text-neutral-500">
          High-contrast logos / silhouettes work best
        </span>
      </button>
      {filename && (
        <p className="text-xs text-neutral-400">
          Loaded: <span className="text-white">{filename}</span>
        </p>
      )}
      <div>
        <label className="text-xs text-neutral-400 mb-1 flex justify-between">
          <span>Threshold</span>
          <span className="text-neutral-500">{threshold}</span>
        </label>
        <input
          type="range"
          min={20}
          max={235}
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
