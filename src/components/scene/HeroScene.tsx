"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { LiquidBlob } from "./LiquidBlob";
import { LogoTiles, type Spin } from "./LogoTiles";

const damp = THREE.MathUtils.damp;

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function useReducedMotionRef() {
  const reduced = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onChange = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Pointer anywhere on the page gently turns the cluster. */
function useSpin(enabled: boolean) {
  const target = useRef<Spin>({ x: 0, y: 0 });
  const spin = useRef<Spin>({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.y = ((e.clientX / window.innerWidth) * 2 - 1) * 0.35;
      target.current.x = ((e.clientY / window.innerHeight) * 2 - 1) * 0.18;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return { target, spin };
}

function Cluster({
  targetRef,
  spinRef,
  reduced,
  touch,
  detail,
  labelLayer,
}: {
  targetRef: React.RefObject<Spin>;
  spinRef: React.RefObject<Spin>;
  reduced: React.RefObject<boolean>;
  touch: boolean;
  detail: number;
  labelLayer: React.RefObject<HTMLDivElement>;
}) {
  const root = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  // Scale the whole cluster so it always fits the box it is given.
  const fit = Math.min(1, Math.min(viewport.width, viewport.height) / 6.6);

  useFrame((_, dt) => {
    spinRef.current.x = damp(spinRef.current.x, targetRef.current.x, 2.5, dt);
    spinRef.current.y = damp(spinRef.current.y, targetRef.current.y, 2.5, dt);
    root.current.scale.setScalar(damp(root.current.scale.x, fit, 4, dt));
  });

  return (
    <group ref={root} scale={fit}>
      <LiquidBlob radius={1.1} detail={detail} reduced={reduced} />
      <Suspense fallback={null}>
        <LogoTiles radius={2.45} spinRef={spinRef} reduced={reduced} touch={touch} labelLayer={labelLayer} />
      </Suspense>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.2} color="#f4f4f7" />
      <pointLight position={[-6, -2, 3]} intensity={12} color="#e9e4e2" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="ring" intensity={4} color="#e6eef4" scale={6} position={[-6, 4, -6]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#efe7e4" scale={[8, 3, 1]} position={[6, -3, -4]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" scale={[10, 1, 1]} position={[0, 7, 2]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>
    </>
  );
}

/**
 * The hero's 3D piece. Lives inside the hero box (not fixed), renders only
 * while on screen, and drops resolution if the device struggles.
 */
export default function HeroScene({
  labelLayer,
  active,
}: {
  labelLayer: React.RefObject<HTMLDivElement>;
  active: boolean;
}) {
  const touch = useMedia("(hover: none)");
  const small = useMedia("(max-width: 1023px)");
  const reduced = useReducedMotionRef();
  const { target, spin } = useSpin(!touch);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);
  const detail = useMemo(() => (small || touch ? 28 : 44), [small, touch]);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 34, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr([1, 1.5])}
        flipflops={2}
        onFallback={() => setDpr(1)}
      />
      <Lights />
      <Cluster
        targetRef={target}
        spinRef={spin}
        reduced={reduced}
        touch={touch}
        detail={detail}
        labelLayer={labelLayer}
      />
    </Canvas>
  );
}
