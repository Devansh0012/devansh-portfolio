export type Complex = { re: number; im: number };

export type FourierCoefficient = {
  k: number;
  freq: number;
  amp: number;
  phase: number;
  re: number;
  im: number;
};

export function computeDFT(points: Complex[]): FourierCoefficient[] {
  const N = points.length;
  const result: FourierCoefficient[] = [];

  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      re += points[n].re * cos - points[n].im * sin;
      im += points[n].re * sin + points[n].im * cos;
    }
    re /= N;
    im /= N;

    const freq = k <= N / 2 ? k : k - N;
    result.push({
      k,
      freq,
      amp: Math.hypot(re, im),
      phase: Math.atan2(im, re),
      re,
      im,
    });
  }

  return result.sort((a, b) => b.amp - a.amp);
}

export type EpicycleState = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  radius: number;
  freq: number;
  phase: number;
};

export function evaluateAt(
  coefficients: FourierCoefficient[],
  t: number,
  cx: number,
  cy: number,
  limit: number,
): { tip: { x: number; y: number }; epicycles: EpicycleState[] } {
  let x = cx;
  let y = cy;
  const epicycles: EpicycleState[] = [];
  const count = Math.min(limit, coefficients.length);

  for (let i = 0; i < count; i++) {
    const c = coefficients[i];
    const angle = c.freq * 2 * Math.PI * t + c.phase;
    const dx = c.amp * Math.cos(angle);
    const dy = c.amp * Math.sin(angle);
    const nextX = x + dx;
    const nextY = y + dy;
    epicycles.push({
      startX: x,
      startY: y,
      endX: nextX,
      endY: nextY,
      radius: c.amp,
      freq: c.freq,
      phase: c.phase,
    });
    x = nextX;
    y = nextY;
  }

  return { tip: { x, y }, epicycles };
}
