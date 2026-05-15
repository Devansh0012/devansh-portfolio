// Loads the Emscripten-built Fourier kernel from /public/wasm/fourier.js and
// exposes a typed DFT API that returns the same shape as src/lib/fourier/dft.ts.

import type { Complex, FourierCoefficient } from "@/lib/fourier/dft";

type FourierWasmModule = {
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  _compute_dft: (inPtr: number, outPtr: number, n: number) => void;
  HEAPF32: Float32Array;
};

type FactoryOptions = { locateFile?: (path: string) => string };
type ModuleFactory = (opts?: FactoryOptions) => Promise<FourierWasmModule>;

const SCRIPT_URL = "/wasm/fourier.js";
const WASM_URL = "/wasm/fourier.wasm";
const GLOBAL_FACTORY = "FourierModule";

let modulePromise: Promise<FourierWasmModule> | null = null;
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("fourier wasm: window is not available"));
  }
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-fourier-wasm="1"]`
    );
    if (existing) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = SCRIPT_URL;
    tag.async = true;
    tag.dataset.fourierWasm = "1";
    tag.onload = () => resolve();
    tag.onerror = () =>
      reject(new Error(`failed to load ${SCRIPT_URL} — did you run npm run build:wasm?`));
    document.head.appendChild(tag);
  });
  return scriptPromise;
}

async function getFourierModule(): Promise<FourierWasmModule> {
  if (modulePromise) return modulePromise;
  modulePromise = (async () => {
    await loadScript();
    const factory = (window as unknown as Record<string, ModuleFactory>)[
      GLOBAL_FACTORY
    ];
    if (typeof factory !== "function") {
      throw new Error(`fourier wasm: global ${GLOBAL_FACTORY} not found after script load`);
    }
    return factory({ locateFile: (f) => (f.endsWith(".wasm") ? WASM_URL : f) });
  })();
  return modulePromise;
}

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
