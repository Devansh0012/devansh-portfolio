export type SpiralStyle = "square" | "helix" | "sacks";

type SpiralPoint = { x: number; y: number; z: number };

function squareUlamPositions(count: number, spacing = 1): SpiralPoint[] {
  const out: SpiralPoint[] = new Array(count);
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let segmentLength = 1;
  let stepsInSegment = 0;
  let segmentPassed = 0;

  for (let i = 0; i < count; i++) {
    out[i] = { x: x * spacing, y: 0, z: y * spacing };
    x += dx;
    y += dy;
    stepsInSegment++;
    if (stepsInSegment === segmentLength) {
      stepsInSegment = 0;
      const newDx = -dy;
      const newDy = dx;
      dx = newDx;
      dy = newDy;
      segmentPassed++;
      if (segmentPassed === 2) {
        segmentPassed = 0;
        segmentLength++;
      }
    }
  }
  return out;
}

function helixPositions(
  count: number,
  perTurn = 40,
  radius = 12,
  pitch = 0.45
): SpiralPoint[] {
  const out: SpiralPoint[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / perTurn;
    const angle = 2 * Math.PI * t;
    out[i] = {
      x: Math.cos(angle) * radius,
      y: t * pitch * perTurn * 0.05,
      z: Math.sin(angle) * radius,
    };
  }
  return out;
}

function sacksPositions(count: number, scale = 0.6): SpiralPoint[] {
  const out: SpiralPoint[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    const r = Math.sqrt(n) * scale;
    const angle = 2 * Math.PI * Math.sqrt(n);
    out[i] = { x: Math.cos(angle) * r, y: 0, z: Math.sin(angle) * r };
  }
  return out;
}

function computePositions(
  style: SpiralStyle,
  count: number
): SpiralPoint[] {
  switch (style) {
    case "square":
      return squareUlamPositions(count, 1);
    case "helix":
      return helixPositions(count, 48, 14, 0.5);
    case "sacks":
      return sacksPositions(count, 0.55);
  }
}

/** Flat (x, y, z) per index — matches the layout the WASM kernel writes. */
export function computePositionsFlat(
  style: SpiralStyle,
  count: number
): Float32Array {
  const out = new Float32Array(count * 3);
  const pts = computePositions(style, count);
  for (let i = 0; i < count; i++) {
    out[i * 3 + 0] = pts[i].x;
    out[i * 3 + 1] = pts[i].y;
    out[i * 3 + 2] = pts[i].z;
  }
  return out;
}
