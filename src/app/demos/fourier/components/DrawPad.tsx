"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Check } from "lucide-react";
import type { Point } from "@/lib/fourier/pathSampling";

type Props = {
  onCommit: (points: Point[]) => void;
};

export default function DrawPad({ onCommit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  const [hasPath, setHasPath] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    pointsRef.current = [getPoint(e)];

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const p = getPoint(e);
    const last = pointsRef.current[pointsRef.current.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 1.5) return;
    pointsRef.current.push(p);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
    if (pointsRef.current.length > 4) {
      const first = pointsRef.current[0];
      pointsRef.current.push({ x: first.x, y: first.y });
      setHasPath(true);
    }
  };

  const clear = () => {
    pointsRef.current = [];
    setHasPath(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const commit = () => {
    if (pointsRef.current.length > 4) onCommit(pointsRef.current);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          className="w-full h-64 touch-none cursor-crosshair"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300 hover:bg-white/10 transition-colors"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear
        </button>
        <button
          type="button"
          onClick={commit}
          disabled={!hasPath}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check className="h-3.5 w-3.5" />
          Use this drawing
        </button>
        <p className="ml-auto text-xs text-neutral-500">
          Draw a closed shape — release to confirm
        </p>
      </div>
    </div>
  );
}
