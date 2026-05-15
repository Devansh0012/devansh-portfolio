#!/usr/bin/env bash
# Build the C++ kernels for the Ulam demo into WebAssembly.
# Output: public/wasm/ulam.js (glue loader) + public/wasm/ulam.wasm (binary)
#
# Requires emcc on PATH. On macOS:  brew install emscripten

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/cpp/ulam.cpp"
OUT_DIR="$ROOT/public/wasm"
OUT_JS="$OUT_DIR/ulam.js"

if ! command -v emcc >/dev/null 2>&1; then
  echo "error: emcc not found on PATH" >&2
  echo "  install: brew install emscripten" >&2
  echo "  or:      see https://emscripten.org/docs/getting_started/downloads.html" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "→ compiling $SRC"

emcc "$SRC" \
  -O3 \
  -std=c++17 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME=UlamModule \
  -s ENVIRONMENT=web \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_RUNTIME_METHODS='["HEAPU8","HEAPF32"]' \
  -s EXPORTED_FUNCTIONS='["_sieve","_square_spiral","_helix_spiral","_sacks_spiral","_malloc","_free"]' \
  -o "$OUT_JS"

echo "→ wrote:"
ls -lh "$OUT_DIR"/ulam.*
