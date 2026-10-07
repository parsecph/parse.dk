"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { accentHex, products, type Shape } from "@/data/products";
import { useScrollProgress, type ScrollState } from "./use-scroll-progress";

const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;
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

/* ------------------------------------------------------------------ */

function HeroKnot({
  scroll,
  pointer,
  reduced,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<Pointer>;
  reduced: React.RefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { vh } = scroll.current;
    const k = smooth(vh / 1.4);
    const speed = reduced.current ? 0.15 : 1;

    // Rest: beside the headline on desktop, above it on phones.
    // Scrolled: drift back and to the right so it never sits under copy.
    const restX = portrait ? 0 : 1.9;
    const restY = portrait ? 2.3 : 0.1;
    const restZ = portrait ? -0.6 : 0;
    const restScale = portrait ? 0.5 : 1;

    const targetX = lerp(restX, portrait ? 0.9 : 3.1, k);
    const targetY =
      lerp(restY, portrait ? 2.1 : -0.3, k) + Math.sin(t * 0.6) * 0.08 * speed;
    const targetZ = lerp(restZ, portrait ? -3 : -3.5, k);
    const targetScale = lerp(restScale, portrait ? 0.45 : 0.85, k);

    group.current.position.x = damp(group.current.position.x, targetX, 3, dt);
    group.current.position.y = damp(group.current.position.y, targetY, 3, dt);
    group.current.position.z = damp(group.current.position.z, targetZ, 3, dt);
    const s = damp(group.current.scale.x, targetScale, 3, dt);
    group.current.scale.setScalar(s);

    mesh.current.rotation.x = t * 0.18 * speed + vh * 0.9;
    mesh.current.rotation.y = t * 0.26 * speed + vh * 1.4;

    group.current.rotation.y = damp(
      group.current.rotation.y,
      pointer.current.x * 0.25,
      4,
      dt,
    );
    group.current.rotation.x = damp(
      group.current.rotation.x,
      -pointer.current.y * 0.18,
      4,
      dt,
    );
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} castShadow>
        <torusKnotGeometry args={[1.25, 0.4, 260, 40, 2, 3]} />
        <meshPhysicalMaterial
          color="#0e0e14"
          roughness={0.18}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.12}
          iridescence={1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[120, 520]}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function ShapeGeometry({ shape }: { shape: Shape }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[0.42, 0.42, 0.42]} />;
    case "torus":
      return <torusGeometry args={[0.22, 0.09, 24, 48]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.3, 0]} />;
    case "capsule":
      return <capsuleGeometry args={[0.14, 0.28, 8, 16]} />;
    default:
      return <icosahedronGeometry args={[0.28, 0]} />;
  }
}

function Orb({
  index,
  total,
  shape,
  color,
  scroll,
  reduced,
}: {
  index: number;
  total: number;
  shape: Shape;
  color: string;
  scroll: React.RefObject<ScrollState>;
  reduced: React.RefObject<boolean>;
}) {
  const ref = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;
  const baseAngle = (index / total) * Math.PI * 2;
  const lift = useMemo(() => Math.sin(index * 12.9898) * 0.9, [index]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { vh, progress } = scroll.current;
    const speed = reduced.current ? 0.1 : 1;
    const spread = smooth(vh / 1.6);
    const radius = portrait
      ? lerp(1.3, 3.2, spread) + progress * 0.6
      : lerp(2.6, 5.2, spread) + progress * 1.2;
    const angle = baseAngle + t * 0.08 * speed + vh * 0.5;
    const wobble = portrait ? 0.2 : 0.35;
    ref.current.position.set(
      Math.cos(angle) * radius,
      lift * (portrait ? 0.5 : 1) +
        Math.sin(angle * 2 + t * 0.4 * speed) * wobble -
        vh * 0.35 +
        spread,
      Math.sin(angle) * radius * 0.55 - 1.5,
    );
    ref.current.scale.setScalar(portrait ? 0.75 : 1);
    ref.current.rotation.x = t * 0.5 * speed + index;
    ref.current.rotation.y = t * 0.35 * speed + index;
  });

  return (
    <group ref={ref}>
      <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.3}>
        <mesh>
          <ShapeGeometry shape={shape} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
}

function OrbRing({
  scroll,
  reduced,
}: {
  scroll: React.RefObject<ScrollState>;
  reduced: React.RefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;
  useFrame((_, dt) => {
    // The ring starts centred on the knot and widens to fill the page.
    const k = smooth(scroll.current.vh / 1.6);
    const targetX = portrait ? 0 : lerp(1.9, 0.6, k);
    const targetY = portrait ? lerp(2.2, 0.4, k) : 0;
    group.current.position.x = damp(group.current.position.x, targetX, 3, dt);
    group.current.position.y = damp(group.current.position.y, targetY, 3, dt);
  });
  return (
    <group ref={group} rotation={[0.55, 0, 0.12]}>
      {products.map((p, i) => (
        <Orb
          key={p.id}
          index={i}
          total={products.length}
          shape={p.shape}
          color={accentHex[p.accent]}
          scroll={scroll}
          reduced={reduced}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

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

export default function Scene() {
  const scroll = useScrollProgress();
  const pointer = usePointer();
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Lights />
      <Rig scroll={scroll} pointer={pointer} />
      <HeroKnot scroll={scroll} pointer={pointer} reduced={reduced} />
      <OrbRing scroll={scroll} reduced={reduced} />
      <Sparkles
        count={180}
        scale={[22, 14, 12]}
        size={2.2}
        speed={0.35}
        opacity={0.55}
        color="#b4ebff"
      />
      <fog attach="fog" args={["#050507", 9, 22]} />
    </Canvas>
  );
}
