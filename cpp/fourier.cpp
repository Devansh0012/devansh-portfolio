// Naive O(N^2) Discrete Fourier Transform — same algorithm as the JS reference
// in src/lib/fourier/dft.ts, just running in WASM with native trig.
//
// Layout: input is interleaved re/im pairs (2*N floats). Output is interleaved
// re/im pairs (2*N floats) in coefficient-index order (k = 0..N-1). The TS
// wrapper computes amp/phase and sorts by amplitude.

#include <cmath>
#include <cstdint>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
void compute_dft(const float* in, float* out, int N) {
  if (N <= 0) return;
  const double two_pi = 6.283185307179586476925286766559;
  const double inv_n = 1.0 / static_cast<double>(N);

  for (int k = 0; k < N; k++) {
    double re_sum = 0.0;
    double im_sum = 0.0;
    const double base = -two_pi * static_cast<double>(k) * inv_n;
    for (int n = 0; n < N; n++) {
      const double angle = base * static_cast<double>(n);
      const double c = std::cos(angle);
      const double s = std::sin(angle);
      const double pr = static_cast<double>(in[n * 2 + 0]);
      const double pi = static_cast<double>(in[n * 2 + 1]);
      re_sum += pr * c - pi * s;
      im_sum += pr * s + pi * c;
    }
    out[k * 2 + 0] = static_cast<float>(re_sum * inv_n);
    out[k * 2 + 1] = static_cast<float>(im_sum * inv_n);
  }
}

#ifdef __cplusplus
}
#endif
