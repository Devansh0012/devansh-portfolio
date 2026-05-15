// Loads the Emscripten-built Ulam kernels from /public/wasm/ulam.js and exposes
// a typed API. Pure browser code — the loader injects a <script> tag, so we
// avoid forcing Next/Turbopack to bundle the generated glue.
//
// All compute happens via caller-allocated buffers in WASM linear memory; we
// view that memory directly through HEAPU8 / HEAPF32, then .slice() the result
// out so the caller owns a detached typed array.

import type { SpiralStyle } from "@/lib/ulam/spiral";

type UlamWasmModule = {
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  _sieve: (out: number, n: number) => void;
  _square_spiral: (out: number, count: number, spacing: number) => void;
  _helix_spiral: (
    out: number,
    count: number,
    perTurn: number,
    radius: number,
    pitch: number
  ) => void;
  _sacks_spiral: (out: number, count: number, scale: number) => void;
  HEAPU8: Uint8Array;
  HEAPF32: Float32Array;
};

type FactoryOptions = { locateFile?: (path: string) => string };
type ModuleFactory = (opts?: FactoryOptions) => Promise<UlamWasmModule>;

const SCRIPT_URL = "/wasm/ulam.js";
const WASM_URL = "/wasm/ulam.wasm";
const GLOBAL_FACTORY = "UlamModule";

let modulePromise: Promise<UlamWasmModule> | null = null;
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("ulam wasm: window is not available"));
  }
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-ulam-wasm="1"]`
    );
    if (existing) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = SCRIPT_URL;
    tag.async = true;
    tag.dataset.ulamWasm = "1";
    tag.onload = () => resolve();
    tag.onerror = () =>
      reject(new Error(`failed to load ${SCRIPT_URL} — did you run npm run build:wasm?`));
    document.head.appendChild(tag);
  });
  return scriptPromise;
}

export async function getUlamModule(): Promise<UlamWasmModule> {
  if (modulePromise) return modulePromise;
  modulePromise = (async () => {
    await loadScript();
    const factory = (window as unknown as Record<string, ModuleFactory>)[
      GLOBAL_FACTORY
    ];
    if (typeof factory !== "function") {
      throw new Error(`ulam wasm: global ${GLOBAL_FACTORY} not found after script load`);
    }
    return factory({ locateFile: (f) => (f.endsWith(".wasm") ? WASM_URL : f) });
  })();
  return modulePromise;
}

/** Run the C++ sieve and return a copy owned by the caller. */
export async function wasmSieve(n: number): Promise<Uint8Array> {
  const mod = await getUlamModule();
  const len = n + 1;
  const ptr = mod._malloc(len);
  if (!ptr) throw new Error("ulam wasm: malloc failed");
  try {
    mod._sieve(ptr, n);
    return new Uint8Array(mod.HEAPU8.buffer, ptr, len).slice();
  } finally {
    mod._free(ptr);
  }
}

export type SpiralPositions = Float32Array;

/** Returns `count * 3` floats (x, y, z) for the requested spiral style. */
export async function wasmSpiralPositions(
  style: SpiralStyle,
  count: number
): Promise<SpiralPositions> {
  const mod = await getUlamModule();
  const floats = count * 3;
  const bytes = floats * 4;
  const ptr = mod._malloc(bytes);
  if (!ptr) throw new Error("ulam wasm: malloc failed");
  try {
    const floatPtr = ptr / 4;
    if (style === "square") {
      mod._square_spiral(ptr, count, 1.0);
    } else if (style === "helix") {
      mod._helix_spiral(ptr, count, 48.0, 14.0, 0.5);
    } else {
      mod._sacks_spiral(ptr, count, 0.55);
    }
    return new Float32Array(mod.HEAPF32.buffer, floatPtr * 4, floats).slice();
  } finally {
    mod._free(ptr);
  }
}
