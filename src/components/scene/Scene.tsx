"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { FluidBackdrop } from "./FluidBackdrop";
import { LiquidBlob } from "./LiquidBlob";
import { LogoTiles } from "./LogoTiles";
import { useScrollProgress, type ScrollState } from "./use-scroll-progress";

const damp = THREE.MathUtils.damp;
const smooth = (t: number) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

type Pointer = { x: number; y: number };

function usePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function useReducedMotion() {
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

function Rig({
  scroll,
  pointer,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<Pointer>;
}) {
  useFrame((state, dt) => {
    const { vh } = scroll.current;
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, pointer.current.x * 0.35, 3, dt);
    cam.position.y = damp(
      cam.position.y,
      pointer.current.y * 0.25 - vh * 0.3,
      3,
      dt,
    );
    cam.position.z = damp(cam.position.z, 9 + smooth(vh / 2) * 1.5, 3, dt);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} />
      <pointLight position={[-6, -2, 3]} intensity={30} color="#ee7259" />
      <pointLight position={[6, 3, -4]} intensity={30} color="#78d8ff" />
      <pointLight position={[0, -6, -2]} intensity={14} color="#a78bfa" />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="ring"
          intensity={6}
          color="#78d8ff"
          scale={6}
          position={[-6, 4, -6]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#ee7259"
          scale={[8, 3, 1]}
          position={[6, -3, -4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffffff"
          scale={[10, 1, 1]}
          position={[0, 7, 2]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={2}
          color="#a78bfa"
          scale={4}
          position={[0, -6, 4]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}

export default function Scene({
  labelLayer,
}: {
  labelLayer: React.RefObject<HTMLDivElement>;
}) {
  const scroll = useScrollProgress();
  const pointer = usePointer();
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      // Listen on <body> so tiles can be hovered/clicked even though the
      // canvas sits behind the page content.
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <color attach="background" args={["#07070b"]} />
      <Lights />
      <Rig scroll={scroll} pointer={pointer} />
      <FluidBackdrop scroll={scroll} pointer={pointer} reduced={reduced} />
      <LiquidBlob scroll={scroll} pointer={pointer} reduced={reduced} />
      <Suspense fallback={null}>
        <LogoTiles scroll={scroll} reduced={reduced} labelLayer={labelLayer} />
      </Suspense>
      <Sparkles
        count={160}
        scale={[22, 14, 12]}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#b4ebff"
      />
      <fog attach="fog" args={["#07070b", 9, 24]} />
    </Canvas>
  );
}
