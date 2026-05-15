# C++ kernels (compiled to WebAssembly)

Hot paths for some demos are written in C++ and compiled to WebAssembly via
Emscripten. The TS wrapper in `src/lib/wasm/` loads the resulting modules and
calls them from React.

## Layout

```
cpp/
  ulam.cpp         # sieve + spiral coordinate generators for /demos/ulam-spiral
scripts/
  build-wasm.sh    # emcc invocation; outputs public/wasm/ulam.{js,wasm}
public/wasm/       # committed build artifacts (served as static assets)
src/lib/wasm/      # TS wrappers that load + call each module
```

## Build

Requires Emscripten. On macOS: `brew install emscripten`.

```sh
npm run build:wasm
```

This runs `scripts/build-wasm.sh` which produces:
- `public/wasm/ulam.js` — Emscripten glue (loader)
- `public/wasm/ulam.wasm` — compiled binary

Both artifacts are committed so Vercel doesn't need Emscripten to deploy. Re-run
the script after editing any `cpp/*.cpp` and commit the diff.

## Adding a new kernel

1. Drop a new `cpp/foo.cpp` with `EMSCRIPTEN_KEEPALIVE`-tagged C-linkage exports.
2. Add an emcc invocation to `scripts/build-wasm.sh` (or split into per-kernel scripts).
3. Write a TS wrapper in `src/lib/wasm/foo.ts` mirroring the pattern in `ulam.ts`.
