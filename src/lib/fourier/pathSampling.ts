import type { Complex } from "./dft";

export type Point = { x: number; y: number };

export function resamplePath(points: Point[], targetCount: number): Point[] {
  if (points.length < 2 || targetCount < 2) return points.slice();

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy));
  }
  const total = cumulative[cumulative.length - 1];
  if (total === 0) return [points[0]];

  const step = total / targetCount;
  const result: Point[] = [];
  let segIndex = 0;

  for (let i = 0; i < targetCount; i++) {
    const target = i * step;
    while (
      segIndex < cumulative.length - 2 &&
      cumulative[segIndex + 1] < target
    ) {
      segIndex++;
    }
    const segStart = cumulative[segIndex];
    const segEnd = cumulative[segIndex + 1] ?? segStart + 1;
    const segLen = segEnd - segStart || 1;
    const t = (target - segStart) / segLen;
    const a = points[segIndex];
    const b = points[segIndex + 1] ?? a;
    result.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });
  }
  return result;
}

export function normalizeForCanvas(
  points: Point[],
  width: number,
  height: number,
  padding = 60,
): Point[] {
  if (points.length === 0) return points;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
    sumX += p.x;
    sumY += p.y;
  }
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scale = Math.min(availW / w, availH / h);
  const cx = sumX / points.length;
  const cy = sumY / points.length;
  // Center the path at the origin so the DFT's c_0 ≈ 0 and the trace doesn't
  // get a large DC bias when an epicycle chain is built starting from the
  // canvas centre. The renderer translates by (centerX, centerY) at draw time.
  return points.map((p) => ({
    x: (p.x - cx) * scale,
    y: (p.y - cy) * scale,
  }));
}

export function pointsToComplex(points: Point[]): Complex[] {
  return points.map((p) => ({ re: p.x, im: p.y }));
}
