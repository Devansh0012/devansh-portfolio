"use client";

import { useEffect, useRef } from "react";
import type { FourierCoefficient } from "@/lib/fourier/dft";
import { evaluateAt } from "@/lib/fourier/dft";
import type { Point } from "@/lib/fourier/pathSampling";

type Props = {
  coefficients: FourierCoefficient[];
  ghostPath: Point[];
  numEpicycles: number;
  speed: number;
  playing: boolean;
  resetSignal: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  onTick?: (info: { t: number; activeIndex: number }) => void;
  onComplete?: () => void;
};

const TRACE_RESOLUTION = 2000;

export default function FourierCanvas({
  coefficients,
  ghostPath,
  numEpicycles,
  speed,
  playing,
  resetSignal,
  centerX,
  centerY,
  width,
  height,
  onTick,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const limitRef = useRef(numEpicycles);
  const coeffsRef = useRef(coefficients);
  const ghostRef = useRef(ghostPath);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const fullTraceRef = useRef<Point[]>([]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    limitRef.current = numEpicycles;
  }, [numEpicycles]);
  useEffect(() => {
    coeffsRef.current = coefficients;
    tRef.current = 0;
    completedRef.current = false;
  }, [coefficients]);
  useEffect(() => {
    ghostRef.current = ghostPath;
  }, [ghostPath]);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    tRef.current = 0;
    lastFrameRef.current = null;
    completedRef.current = false;
  }, [resetSignal]);

  // Precompute the full reconstructed curve at high resolution. This makes
  // the trace frame-rate-independent (looks smooth at any speed) and also
  // moves the per-frame cost from O(N·K) to O(K).
  useEffect(() => {
    if (coefficients.length === 0) {
      fullTraceRef.current = [];
      return;
    }
    const limit = Math.min(numEpicycles, coefficients.length);
    const trace: Point[] = new Array(TRACE_RESOLUTION + 1);
    for (let i = 0; i <= TRACE_RESOLUTION; i++) {
      const t = i / TRACE_RESOLUTION;
      const { tip } = evaluateAt(coefficients, t, centerX, centerY, limit);
      trace[i] = tip;
    }
    fullTraceRef.current = trace;
  }, [coefficients, numEpicycles, centerX, centerY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    let raf = 0;

    const loop = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const dt = (now - last) / 1000;
      lastFrameRef.current = now;

      if (
        playingRef.current &&
        coeffsRef.current.length > 0 &&
        !completedRef.current
      ) {
        const next = tRef.current + dt * speedRef.current;
        if (next >= 1) {
          tRef.current = 1;
          completedRef.current = true;
          onCompleteRef.current?.();
        } else {
          tRef.current = next;
        }
      }

      ctx.fillStyle = "rgba(10, 10, 10, 1)";
      ctx.fillRect(0, 0, width, height);

      const ghost = ghostRef.current;
      if (ghost.length > 1) {
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ghost[0].x + centerX, ghost[0].y + centerY);
        for (let i = 1; i < ghost.length; i++) {
          ctx.lineTo(ghost[i].x + centerX, ghost[i].y + centerY);
        }
        ctx.stroke();
      }

      const coeffs = coeffsRef.current;
      if (coeffs.length === 0) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const { tip, epicycles } = evaluateAt(
        coeffs,
        tRef.current,
        centerX,
        centerY,
        limitRef.current,
      );

      let activeIndex = 0;
      let activeMag = 0;
      for (let i = 0; i < epicycles.length; i++) {
        const ep = epicycles[i];
        const dx = ep.endX - ep.startX;
        const dy = ep.endY - ep.startY;
        const mag = Math.hypot(dx, dy);
        if (mag > activeMag) {
          activeMag = mag;
          activeIndex = i;
        }

        ctx.strokeStyle =
          i === 0 ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ep.startX, ep.startY, ep.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.moveTo(ep.startX, ep.startY);
        ctx.lineTo(ep.endX, ep.endY);
        ctx.stroke();
      }

      const fullTrace = fullTraceRef.current;
      if (fullTrace.length > 1) {
        const endIdx = Math.min(
          fullTrace.length,
          Math.max(2, Math.floor(tRef.current * (fullTrace.length - 1)) + 1),
        );
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(fullTrace[0].x, fullTrace[0].y);
        for (let i = 1; i < endIdx; i++) {
          ctx.lineTo(fullTrace[i].x, fullTrace[i].y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (onTickRef.current) {
        onTickRef.current({ t: tRef.current, activeIndex });
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [width, height, centerX, centerY]);

  return <canvas ref={canvasRef} className="rounded-lg border border-white/10" />;
}
