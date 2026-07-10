"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { computePositionsFlat, type SpiralStyle } from "@/lib/ulam/spiral";
import { sieveOfEratosthenes } from "@/lib/ulam/primes";
import { wasmSieve, wasmSpiralPositions } from "@/lib/wasm/ulam";
import type { ComputeBackend } from "@/lib/wasm/loader";

export type TimingInfo = {
  backend: ComputeBackend;
  sieveMs: number;
  spiralMs: number;
  primeCount: number;
};

type SceneProps = {
  style: SpiralStyle;
  count: number;
  buildup: boolean;
  speed: number;
  replaySignal: number;
  backend: ComputeBackend;
  onProgress?: (revealed: number, primesShown: number) => void;
  onTiming?: (info: TimingInfo) => void;
};

type SpiralData = {
  positions: Float32Array;
  isPrime: Uint8Array;
  primeIdx: Uint32Array;
  compIdx: Uint32Array;
  primeMatrices: Float32Array;
  compMatrices: Float32Array;
};

function buildMatrices(
  style: SpiralStyle,
  positions: Float32Array,
  primeIdx: Uint32Array,
  compIdx: Uint32Array
): { primeMatrices: Float32Array; compMatrices: Float32Array } {
  const dummy = new THREE.Object3D();
  const primeMatrices = new Float32Array(primeIdx.length * 16);
  const compMatrices = new Float32Array(compIdx.length * 16);

  const writePrime = (k: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    primeMatrices.set(dummy.matrix.elements, k * 16);
  };
  const writeComp = (k: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    compMatrices.set(dummy.matrix.elements, k * 16);
  };

  if (style === "square") {
    const pillarH = 2.6;
    const tile = 0.55;
    for (let k = 0; k < primeIdx.length; k++) {
      const i = primeIdx[k];
      const px = positions[i * 3];
      const pz = positions[i * 3 + 2];
      writePrime(k, px, pillarH / 2, pz, 0.55, pillarH, 0.55);
    }
    for (let k = 0; k < compIdx.length; k++) {
      const i = compIdx[k];
      const px = positions[i * 3];
      const pz = positions[i * 3 + 2];
      writeComp(k, px, 0, pz, tile, 0.05, tile);
    }
  } else if (style === "helix") {
    for (let k = 0; k < primeIdx.length; k++) {
      const i = primeIdx[k];
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      const r = Math.hypot(px, pz) || 1;
      const nx = px / r;
      const nz = pz / r;
      const push = 1.2;
      writePrime(k, px + nx * push, py, pz + nz * push, 0.55, 0.55, 0.55);
    }
    for (let k = 0; k < compIdx.length; k++) {
      const i = compIdx[k];
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      writeComp(k, px, py, pz, 0.2, 0.2, 0.2);
    }
  } else {
    const pillarH = 1.8;
    for (let k = 0; k < primeIdx.length; k++) {
      const i = primeIdx[k];
      const px = positions[i * 3];
      const pz = positions[i * 3 + 2];
      writePrime(k, px, pillarH / 2, pz, 0.4, pillarH, 0.4);
    }
    for (let k = 0; k < compIdx.length; k++) {
      const i = compIdx[k];
      const px = positions[i * 3];
      const pz = positions[i * 3 + 2];
      writeComp(k, px, 0, pz, 0.22, 0.05, 0.22);
    }
  }

  return { primeMatrices, compMatrices };
}

function partitionPrimes(isPrime: Uint8Array, count: number): { primeIdx: Uint32Array; compIdx: Uint32Array } {
  let pCount = 0;
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    if (n >= 2 && isPrime[n]) pCount++;
  }
  const primeIdx = new Uint32Array(pCount);
  const compIdx = new Uint32Array(count - pCount);
  let pi = 0;
  let ci = 0;
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    if (n >= 2 && isPrime[n]) primeIdx[pi++] = i;
    else compIdx[ci++] = i;
  }
  return { primeIdx, compIdx };
}

function SpiralMeshes({
  style,
  count,
  buildup,
  speed,
  replaySignal,
  backend,
  onProgress,
  onTiming,
}: SceneProps) {
  const primeRef = useRef<THREE.InstancedMesh>(null);
  const compRef = useRef<THREE.InstancedMesh>(null);
  const [data, setData] = useState<SpiralData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let positions: Float32Array;
      let isPrime: Uint8Array;
      let actualBackend: ComputeBackend = backend;
      let sieveMs = 0;
      let spiralMs = 0;

      if (backend === "wasm") {
        try {
          const t0 = performance.now();
          isPrime = await wasmSieve(count);
          sieveMs = performance.now() - t0;
          const t1 = performance.now();
          positions = await wasmSpiralPositions(style, count);
          spiralMs = performance.now() - t1;
        } catch (err) {
          console.warn("[ulam] WASM failed, falling back to JS:", err);
          actualBackend = "js";
          const t0 = performance.now();
          isPrime = sieveOfEratosthenes(count);
          sieveMs = performance.now() - t0;
          const t1 = performance.now();
          positions = computePositionsFlat(style, count);
          spiralMs = performance.now() - t1;
        }
      } else {
        const t0 = performance.now();
        isPrime = sieveOfEratosthenes(count);
        sieveMs = performance.now() - t0;
        const t1 = performance.now();
        positions = computePositionsFlat(style, count);
        spiralMs = performance.now() - t1;
      }

      if (cancelled) return;

      const { primeIdx, compIdx } = partitionPrimes(isPrime, count);
      const { primeMatrices, compMatrices } = buildMatrices(
        style,
        positions,
        primeIdx,
        compIdx
      );

      setData({ positions, isPrime, primeIdx, compIdx, primeMatrices, compMatrices });
      onTiming?.({
        backend: actualBackend,
        sieveMs,
        spiralMs,
        primeCount: primeIdx.length,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [style, count, backend, onTiming]);

  useEffect(() => {
    if (!data || !primeRef.current || !compRef.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < data.primeIdx.length; i++) {
      m.fromArray(data.primeMatrices, i * 16);
      primeRef.current.setMatrixAt(i, m);
    }
    for (let i = 0; i < data.compIdx.length; i++) {
      m.fromArray(data.compMatrices, i * 16);
      compRef.current.setMatrixAt(i, m);
    }
    primeRef.current.instanceMatrix.needsUpdate = true;
    compRef.current.instanceMatrix.needsUpdate = true;
  }, [data]);

  const buildState = useRef({ revealed: 0 });

  useEffect(() => {
    buildState.current.revealed = buildup ? 0 : count;
  }, [buildup, count, replaySignal, style, backend, data]);

  useFrame((_, delta) => {
    if (!data) return;
    const target = count;
    if (buildup && buildState.current.revealed < target) {
      buildState.current.revealed = Math.min(
        target,
        buildState.current.revealed + delta * target * speed * 0.5
      );
    } else if (!buildup) {
      buildState.current.revealed = target;
    }
    const revealed = Math.floor(buildState.current.revealed);

    let pCount = 0;
    const primeIdx = data.primeIdx;
    for (let i = 0; i < primeIdx.length; i++) {
      if (primeIdx[i] < revealed) pCount++;
      else break;
    }
    let cCount = 0;
    const compIdx = data.compIdx;
    for (let i = 0; i < compIdx.length; i++) {
      if (compIdx[i] < revealed) cCount++;
      else break;
    }
    if (primeRef.current) primeRef.current.count = pCount;
    if (compRef.current) compRef.current.count = cCount;
    onProgress?.(revealed, pCount);
  });

  const primeGeom = useMemo(() => {
    if (style === "helix") return new THREE.SphereGeometry(0.5, 16, 16);
    return new THREE.BoxGeometry(1, 1, 1);
  }, [style]);

  const compGeom = useMemo(() => {
    if (style === "helix") return new THREE.SphereGeometry(0.5, 8, 8);
    return new THREE.BoxGeometry(1, 1, 1);
  }, [style]);

  useEffect(() => {
    return () => {
      primeGeom.dispose();
      compGeom.dispose();
    };
  }, [primeGeom, compGeom]);

  const primeInstanceCount = data ? Math.max(1, data.primeIdx.length) : 1;
  const compInstanceCount = data ? Math.max(1, data.compIdx.length) : 1;

  return (
    <>
      <instancedMesh
        ref={compRef}
        args={[compGeom, undefined, compInstanceCount]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#1e2a3d"
          emissive="#0a1320"
          emissiveIntensity={0.6}
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>
      <instancedMesh
        ref={primeRef}
        args={[primeGeom, undefined, primeInstanceCount]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          roughness={0.35}
          metalness={0.2}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}

function RotatingGroup({
  children,
  rotationRef,
}: {
  children: React.ReactNode;
  rotationRef: React.RefObject<{ rotX: number; rotY: number; dragging: boolean }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current || !rotationRef.current) return;
    if (!rotationRef.current.dragging) {
      rotationRef.current.rotY += 0.0025;
    }
    groupRef.current.rotation.x = rotationRef.current.rotX;
    groupRef.current.rotation.y = rotationRef.current.rotY;
  });
  return <group ref={groupRef}>{children}</group>;
}

function CameraRig({
  baseDistance,
  zoomRef,
}: {
  baseDistance: number;
  zoomRef: React.RefObject<{ value: number }>;
}) {
  const { camera } = useThree();
  const initial = useRef(true);
  useFrame(() => {
    const z = zoomRef.current?.value ?? 1;
    const target = baseDistance * z;
    if (initial.current) {
      camera.position.set(target * 0.7, target * 0.7, target);
      initial.current = false;
    } else {
      const dir = camera.position.clone().normalize();
      const current = camera.position.length();
      const next = current + (target - current) * 0.12;
      camera.position.copy(dir.multiplyScalar(next));
    }
    camera.lookAt(0, 0, 0);
  });
  useEffect(() => {
    initial.current = true;
  }, [baseDistance]);
  return null;
}

export default function UlamScene(props: SceneProps) {
  const rotationRef = useRef({ rotX: -0.55, rotY: 0.3, dragging: false });
  const lastPointer = useRef({ x: 0, y: 0 });
  const zoomRef = useRef({ value: 1 });

  const handlePointerDown = (e: React.PointerEvent) => {
    rotationRef.current.dragging = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!rotationRef.current.dragging) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    rotationRef.current.rotY += dx * 0.006;
    rotationRef.current.rotX = Math.min(
      Math.PI / 2 - 0.05,
      Math.max(-Math.PI / 2 + 0.05, rotationRef.current.rotX + dy * 0.006)
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    rotationRef.current.dragging = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already be gone (e.g. pointercancel); releasing then throws.
    }
  };

  const dist = useMemo(() => {
    const base = Math.sqrt(props.count) * 1.1 + 12;
    return Math.min(220, base);
  }, [props.count]);

  return (
    <div
      className="relative w-full h-[560px] rounded-lg overflow-hidden bg-[#05070d] border border-white/10 cursor-grab active:cursor-grabbing select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={(e) => {
        zoomRef.current.value = Math.min(
          3,
          Math.max(0.35, zoomRef.current.value + e.deltaY * 0.001)
        );
      }}
    >
      <Canvas
        camera={{ position: [dist * 0.7, dist * 0.7, dist], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#05070d"]} />
        <fog attach="fog" args={["#05070d", dist * 0.7, dist * 2.5]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[20, 30, 10]} intensity={0.6} />
        <pointLight position={[0, 20, 0]} intensity={0.5} color="#22d3ee" />
        <CameraRig baseDistance={dist} zoomRef={zoomRef} />
        <RotatingGroup rotationRef={rotationRef}>
          <SpiralMeshes {...props} />
        </RotatingGroup>
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-neutral-500">
        drag to rotate · scroll to zoom
      </div>
    </div>
  );
}
