// Shared loader for the Emscripten-built kernels in /public/wasm. The glue JS
// is injected as a <script> tag (instead of being imported) so Next/Turbopack
// never tries to bundle the generated code; the module factory it defines on
// `window` is then invoked with `locateFile` pointed at the matching .wasm.

/** Which implementation computed a demo's data: the wasm kernel or the JS fallback. */
export type ComputeBackend = "wasm" | "js";

type FactoryOptions = { locateFile?: (path: string) => string };
type ModuleFactory<M> = (opts?: FactoryOptions) => Promise<M>;

export type WasmLoaderConfig = {
  /** URL of the Emscripten glue script, e.g. "/wasm/fourier.js". */
  scriptUrl: string;
  /** URL of the wasm binary the glue should fetch, e.g. "/wasm/fourier.wasm". */
  wasmUrl: string;
  /** Name of the module factory the glue script defines on `window`. */
  globalFactory: string;
  /** data-* attribute (kebab-case, without the "data-" prefix) used to mark the injected script tag. */
  scriptDataAttr: string;
  /** Prefix for error messages, e.g. "fourier wasm". */
  label: string;
};

/**
 * Returns a memoized `getModule` function: the script is injected and the
 * factory invoked at most once, and every caller shares the same module
 * instance.
 */
export function createWasmLoader<M>(config: WasmLoaderConfig): () => Promise<M> {
  const { scriptUrl, wasmUrl, globalFactory, scriptDataAttr, label } = config;

  let modulePromise: Promise<M> | null = null;
  let scriptPromise: Promise<void> | null = null;

  function loadScript(): Promise<void> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error(`${label}: window is not available`));
    }
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[data-${scriptDataAttr}="1"]`
      );
      if (existing) {
        resolve();
        return;
      }
      const tag = document.createElement("script");
      tag.src = scriptUrl;
      tag.async = true;
      tag.setAttribute(`data-${scriptDataAttr}`, "1");
      tag.onload = () => resolve();
      tag.onerror = () =>
        reject(new Error(`failed to load ${scriptUrl} — did you run npm run build:wasm?`));
      document.head.appendChild(tag);
    });
    return scriptPromise;
  }

  return function getModule(): Promise<M> {
    if (modulePromise) return modulePromise;
    modulePromise = (async () => {
      await loadScript();
      const factory = (window as unknown as Record<string, ModuleFactory<M>>)[
        globalFactory
      ];
      if (typeof factory !== "function") {
        throw new Error(`${label}: global ${globalFactory} not found after script load`);
      }
      return factory({ locateFile: (f) => (f.endsWith(".wasm") ? wasmUrl : f) });
    })();
    return modulePromise;
  };
}
