// Loads the Emscripten-built Ulam kernels from /public/wasm/ulam.js and exposes
// a typed API.
//
// All compute happens via caller-allocated buffers in WASM linear memory; we
// view that memory directly through HEAPU8 / HEAPF32, then .slice() the result
// out so the caller owns a detached typed array.

import type { SpiralStyle } from "@/lib/ulam/spiral";
import { createWasmLoader } from "@/lib/wasm/loader";

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

const getUlamModule = createWasmLoader<UlamWasmModule>({
  scriptUrl: "/wasm/ulam.js",
  wasmUrl: "/wasm/ulam.wasm",
  globalFactory: "UlamModule",
  scriptDataAttr: "ulam-wasm",
  label: "ulam wasm",
});

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
