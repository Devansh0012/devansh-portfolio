// Loads the Emscripten-built Fourier kernel from /public/wasm/fourier.js and
// exposes a typed DFT API that returns the same shape as src/lib/fourier/dft.ts.

import type { Complex, FourierCoefficient } from "@/lib/fourier/dft";
import { createWasmLoader } from "@/lib/wasm/loader";

type FourierWasmModule = {
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  _compute_dft: (inPtr: number, outPtr: number, n: number) => void;
  HEAPF32: Float32Array;
};

const getFourierModule = createWasmLoader<FourierWasmModule>({
  scriptUrl: "/wasm/fourier.js",
  wasmUrl: "/wasm/fourier.wasm",
  globalFactory: "FourierModule",
  scriptDataAttr: "fourier-wasm",
  label: "fourier wasm",
});

/**
 * Runs the C++ DFT and returns the same coefficient shape as `computeDFT` in
 * src/lib/fourier/dft.ts, including the descending-amplitude sort.
 */
export async function wasmComputeDFT(points: Complex[]): Promise<FourierCoefficient[]> {
  const N = points.length;
  if (N === 0) return [];

  const mod = await getFourierModule();
  const floatBytes = 4;
  const inBytes = N * 2 * floatBytes;
  const outBytes = N * 2 * floatBytes;

  const inPtr = mod._malloc(inBytes);
  const outPtr = mod._malloc(outBytes);
  if (!inPtr || !outPtr) {
    if (inPtr) mod._free(inPtr);
    if (outPtr) mod._free(outPtr);
    throw new Error("fourier wasm: malloc failed");
  }

  try {
    const inView = new Float32Array(mod.HEAPF32.buffer, inPtr, N * 2);
    for (let i = 0; i < N; i++) {
      inView[i * 2 + 0] = points[i].re;
      inView[i * 2 + 1] = points[i].im;
    }

    mod._compute_dft(inPtr, outPtr, N);

    const outView = new Float32Array(mod.HEAPF32.buffer, outPtr, N * 2);
    const coeffs: FourierCoefficient[] = new Array(N);
    for (let k = 0; k < N; k++) {
      const re = outView[k * 2 + 0];
      const im = outView[k * 2 + 1];
      const freq = k <= N / 2 ? k : k - N;
      coeffs[k] = {
        k,
        freq,
        amp: Math.hypot(re, im),
        phase: Math.atan2(im, re),
        re,
        im,
      };
    }
    coeffs.sort((a, b) => b.amp - a.amp);
    return coeffs;
  } finally {
    mod._free(inPtr);
    mod._free(outPtr);
  }
}
