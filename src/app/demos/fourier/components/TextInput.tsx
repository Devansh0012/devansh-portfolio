"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { textToPath } from "@/lib/fourier/textPath";
import type { Point } from "@/lib/fourier/pathSampling";

type Props = {
  onCommit: (points: Point[]) => void;
};

const FONTS = [
  "Arial, sans-serif",
  "Georgia, serif",
  "Courier New, monospace",
  "Times New Roman, serif",
  "Impact, sans-serif",
];

export default function TextInput({ onCommit }: Props) {
  const [text, setText] = useState("DD");
  const [font, setFont] = useState(FONTS[0]);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    try {
      const points = textToPath(text || "DD", {
        fontSize: 220,
        fontFamily: font,
        fontWeight: "bold",
      });
      if (points.length < 8) {
        setError("Couldn't trace this text — try fewer characters or a bolder font.");
        return;
      }
      onCommit(points);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate path");
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-neutral-400 mb-1 block">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={6}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-400/50 focus:outline-none"
          placeholder="Enter up to 6 characters"
        />
        <p className="mt-1 text-[11px] text-neutral-500">
          Short, bold characters work best. Multi-letter words trace the outermost outline.
        </p>
      </div>
      <div>
        <label className="text-xs text-neutral-400 mb-1 block">Font</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f.split(",")[0]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={generate}
        className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors"
      >
        <Type className="h-3.5 w-3.5" />
        Generate from text
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
