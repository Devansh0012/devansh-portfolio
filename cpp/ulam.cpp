// Ulam spiral kernels compiled to WebAssembly via Emscripten.
//
// All exports use a flat C ABI with caller-allocated buffers so we never copy
// between WASM linear memory and JS — the TS wrapper just views HEAP* directly.

#include <cmath>
#include <cstdint>
#include <cstring>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

// Fills `out[0..n]` with 1 for primes, 0 otherwise. Caller must allocate n+1 bytes.
EMSCRIPTEN_KEEPALIVE
void sieve(uint8_t* out, int n) {
  if (n < 0) return;
  std::memset(out, 1, static_cast<size_t>(n) + 1);
  out[0] = 0;
  if (n >= 1) out[1] = 0;
  const int limit = static_cast<int>(std::sqrt(static_cast<double>(n)));
  for (int i = 2; i <= limit; i++) {
    if (out[i]) {
      for (int j = i * i; j <= n; j += i) out[j] = 0;
    }
  }
}

// Square Ulam spiral. Writes count * 3 floats (x, y, z) into `out`.
EMSCRIPTEN_KEEPALIVE
void square_spiral(float* out, int count, float spacing) {
  int x = 0, y = 0;
  int dx = 1, dy = 0;
  int segment_length = 1;
  int steps = 0;
  int segments_passed = 0;
  for (int i = 0; i < count; i++) {
    out[i * 3 + 0] = x * spacing;
    out[i * 3 + 1] = 0.0f;
    out[i * 3 + 2] = y * spacing;
    x += dx;
    y += dy;
    steps++;
    if (steps == segment_length) {
      steps = 0;
      const int ndx = -dy;
      const int ndy = dx;
      dx = ndx;
      dy = ndy;
      segments_passed++;
      if (segments_passed == 2) {
        segments_passed = 0;
        segment_length++;
      }
    }
  }
}

// Helix: numbers wrap around a vertical cylinder.
EMSCRIPTEN_KEEPALIVE
void helix_spiral(float* out, int count, float per_turn, float radius, float pitch) {
  const float two_pi = 6.28318530717958647692f;
  for (int i = 0; i < count; i++) {
    const float t = static_cast<float>(i) / per_turn;
    const float angle = two_pi * t;
    out[i * 3 + 0] = std::cos(angle) * radius;
    out[i * 3 + 1] = t * pitch * per_turn * 0.05f;
    out[i * 3 + 2] = std::sin(angle) * radius;
  }
}

// Sacks (Archimedean) spiral.
EMSCRIPTEN_KEEPALIVE
void sacks_spiral(float* out, int count, float scale) {
  const float two_pi = 6.28318530717958647692f;
  for (int i = 0; i < count; i++) {
    const float n = static_cast<float>(i + 1);
    const float root = std::sqrt(n);
    const float r = root * scale;
    const float angle = two_pi * root;
    out[i * 3 + 0] = std::cos(angle) * r;
    out[i * 3 + 1] = 0.0f;
    out[i * 3 + 2] = std::sin(angle) * r;
  }
}

#ifdef __cplusplus
}
#endif
