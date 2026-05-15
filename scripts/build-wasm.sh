#!/usr/bin/env bash
# Build the C++ kernels for the demos into WebAssembly modules.
# Each kernel becomes its own loadable module under public/wasm/.
#
# Requires emcc on PATH. On macOS:  brew install emscripten

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/public/wasm"

if ! command -v emcc >/dev/null 2>&1; then
  echo "error: emcc not found on PATH" >&2
  echo "  install: brew install emscripten" >&2
  echo "  or:      see https://emscripten.org/docs/getting_started/downloads.html" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# build <name> <export_name> <exported_funcs>
build() {
  local name="$1"
  local export_name="$2"
  local exports="$3"
  local src="$ROOT/cpp/${name}.cpp"
  local out="$OUT_DIR/${name}.js"

  echo "→ compiling $src"

  emcc "$src" \
    -O3 \
    -std=c++17 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="$export_name" \
    -s ENVIRONMENT=web \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s EXPORTED_RUNTIME_METHODS='["HEAPU8","HEAPF32"]' \
    -s EXPORTED_FUNCTIONS="$exports" \
    -o "$out"
}

build ulam UlamModule \
  '["_sieve","_square_spiral","_helix_spiral","_sacks_spiral","_malloc","_free"]'

build fourier FourierModule \
  '["_compute_dft","_malloc","_free"]'

echo "→ wrote:"
ls -lh "$OUT_DIR"/ulam.* "$OUT_DIR"/fourier.*
