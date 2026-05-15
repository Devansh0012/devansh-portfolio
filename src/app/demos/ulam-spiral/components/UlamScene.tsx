"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { computePositions, type SpiralStyle } from "@/lib/ulam/spiral";
import { sieveOfEratosthenes } from "@/lib/ulam/primes";

type SceneProps = {
  style: SpiralStyle;
  count: number;
  buildup: boolean;
  speed: number;
  replaySignal: number;
  onProgress?: (revealed: number, primesShown: number) => void;
};

type SpiralStats = {
  positions: { x: number; y: number; z: number }[];
  primeIdx: number[];
  compIdx: number[];
  primeMatrices: THREE.Matrix4[];
  compMatrices: THREE.Matrix4[];
};

function buildScene(style: SpiralStyle, count: number): SpiralStats {
  const positions = computePositions(style, count);
  const isPrime = sieveOfEratosthenes(count);
  const primeIdx: number[] = [];
  const compIdx: number[] = [];
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    if (n >= 2 && isPrime[n]) primeIdx.push(i);
    else compIdx.push(i);
  }

  const dummy = new THREE.Object3D();
  const primeMatrices: THREE.Matrix4[] = new Array(primeIdx.length);
  const compMatrices: THREE.Matrix4[] = new Array(compIdx.length);

  if (style === "square") {
    const pillarH = 2.6;
    const tile = 0.55;
    primeIdx.forEach((i, k) => {
      const p = positions[i];
      dummy.position.set(p.x, pillarH / 2, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(0.55, pillarH, 0.55);
      dummy.updateMatrix();
      primeMatrices[k] = dummy.matrix.clone();
    });
    compIdx.forEach((i, k) => {
      const p = positions[i];
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(tile, 0.05, tile);
      dummy.updateMatrix();
      compMatrices[k] = dummy.matrix.clone();
    });
  } else if (style === "helix") {
    primeIdx.forEach((i, k) => {
      const p = positions[i];
      const r = Math.hypot(p.x, p.z) || 1;
      const nx = p.x / r;
      const nz = p.z / r;
      const push = 1.2;
      dummy.position.set(p.x + nx * push, p.y, p.z + nz * push);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(0.55, 0.55, 0.55);
      dummy.updateMatrix();
      primeMatrices[k] = dummy.matrix.clone();
    });
    compIdx.forEach((i, k) => {
      const p = positions[i];
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(0.2, 0.2, 0.2);
      dummy.updateMatrix();
      compMatrices[k] = dummy.matrix.clone();
    });
  } else {
    // sacks
    const pillarH = 1.8;
    primeIdx.forEach((i, k) => {
      const p = positions[i];
      dummy.position.set(p.x, pillarH / 2, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(0.4, pillarH, 0.4);
      dummy.updateMatrix();
      primeMatrices[k] = dummy.matrix.clone();
    });
    compIdx.forEach((i, k) => {
      const p = positions[i];
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(0.22, 0.05, 0.22);
      dummy.updateMatrix();
      compMatrices[k] = dummy.matrix.clone();
    });
  }

  return { positions, primeIdx, compIdx, primeMatrices, compMatrices };
}

function SpiralMeshes({
  style,
  count,
  buildup,
  speed,
  replaySignal,
  onProgress,
}: SceneProps) {
  const primeRef = useRef<THREE.InstancedMesh>(null);
  const compRef = useRef<THREE.InstancedMesh>(null);

  const stats = useMemo(
    () => buildScene(style, count),
    [style, count]
  );

  useEffect(() => {
    if (!primeRef.current || !compRef.current) return;
    for (let i = 0; i < stats.primeMatrices.length; i++) {
      primeRef.current.setMatrixAt(i, stats.primeMatrices[i]);
    }
    for (let i = 0; i < stats.compMatrices.length; i++) {
      compRef.current.setMatrixAt(i, stats.compMatrices[i]);
    }
    primeRef.current.instanceMatrix.needsUpdate = true;
    compRef.current.instanceMatrix.needsUpdate = true;
  }, [stats]);

  const buildState = useRef({ revealed: 0 });

  useEffect(() => {
    buildState.current.revealed = buildup ? 0 : count;
  }, [buildup, count, replaySignal, style]);

  useFrame((_, delta) => {
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
    const primeIdx = stats.primeIdx;
    for (let i = 0; i < primeIdx.length; i++) {
      if (primeIdx[i] < revealed) pCount++;
      else break;
    }
    let cCount = 0;
    const compIdx = stats.compIdx;
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

  return (
    <>
      <instancedMesh
        ref={compRef}
        args={[compGeom, undefined, Math.max(1, stats.compIdx.length)]}
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
        args={[primeGeom, undefined, Math.max(1, stats.primeIdx.length)]}
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
    } catch {}
  };

  // Camera distance scales with count so the spiral fits.
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
