"use client";

import { Html, RoundedBox, useCursor, useTexture } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { accentHex, products, type Product } from "@/data/products";
import type { ScrollState } from "./use-scroll-progress";

const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;
const smooth = (t: number) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

let roundedMask: THREE.CanvasTexture | null = null;
/** Shared alpha mask that rounds the corners of full-bleed logo planes. */
function getRoundedMask() {
  if (roundedMask) return roundedMask;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const r = size * 0.2;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, r);
  ctx.fill();
  roundedMask = new THREE.CanvasTexture(canvas);
  return roundedMask;
}

function cameFromInteractiveDom(e: ThreeEvent<PointerEvent | MouseEvent>) {
  const target = e.nativeEvent.target as Element | null;
  return Boolean(target?.closest?.("a, button, input, textarea, select"));
}

function Tile({
  product,
  index,
  total,
  scroll,
  reduced,
}: {
  product: Product;
  index: number;
  total: number;
  scroll: React.RefObject<ScrollState>;
  reduced: React.RefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;

  const texture = useTexture(product.logo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
  });
  const logoSize = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const w = img?.width ?? 1;
    const h = img?.height ?? 1;
    const max = product.logoBleed ? 0.84 : 0.6;
    return w >= h ? [max, (max * h) / w] : [(max * w) / h, max];
  }, [texture, product.logoBleed]);

  const mask = useMemo(() => (product.logoBleed ? getRoundedMask() : null), [product.logoBleed]);

  const hex = accentHex[product.accent];
  const bodyColor = useMemo(
    () => new THREE.Color(hex).lerp(new THREE.Color("#0b0b10"), 0.72),
    [hex],
  );
  const glowColor = useMemo(() => new THREE.Color(hex), [hex]);

  const baseAngle = (index / total) * Math.PI * 2;
  const lift = useMemo(() => (index % 2 === 0 ? 0.55 : -0.55) + Math.sin(index * 7.3) * 0.25, [index]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { vh, progress } = scroll.current;
    const slow = reduced.current ? 0.1 : 1;
    const spread = smooth(vh / 1.6);
    const radius = portrait
      ? lerp(1.5, 3.3, spread) + progress * 0.6
      : lerp(2.9, 5.6, spread) + progress * 1.2;
    const angle = baseAngle + t * 0.07 * slow + vh * 0.45;

    group.current.position.set(
      Math.cos(angle) * radius,
      lift * (portrait ? 0.5 : 1) + Math.sin(angle * 2 + t * 0.3 * slow) * 0.25 - vh * 0.3 + spread,
      Math.sin(angle) * radius * 0.5 - 1.4,
    );

    const targetScale = (portrait ? 0.68 : 1) * (hovered ? 1.35 : 1);
    const s = damp(group.current.scale.x, targetScale, 8, dt);
    group.current.scale.setScalar(s);

    // Idle: a lazy wobble so logos stay readable. Hover: snap to face the camera.
    const ry = hovered ? 0 : Math.sin(t * 0.45 * slow + index) * 0.5;
    const rx = hovered ? 0 : Math.cos(t * 0.35 * slow + index * 1.7) * 0.22;
    inner.current.rotation.y = damp(inner.current.rotation.y, ry, 8, dt);
    inner.current.rotation.x = damp(inner.current.rotation.x, rx, 8, dt);
    inner.current.rotation.z = damp(inner.current.rotation.z, hovered ? 0 : Math.sin(t * 0.3 + index) * 0.08, 8, dt);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (cameFromInteractiveDom(e)) return;
    e.stopPropagation();
    setHovered(true);
  };
  const onOut = () => setHovered(false);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (cameFromInteractiveDom(e)) return;
    e.stopPropagation();
    window.open(product.url, "_blank", "noopener,noreferrer");
  };

  return (
    <group ref={group}>
      <group ref={inner}>
        <RoundedBox
          args={[0.98, 0.98, 0.16]}
          radius={0.2}
          smoothness={6}
          onPointerOver={onOver}
          onPointerOut={onOut}
          onClick={onClick}
        >
          <meshPhysicalMaterial
            color={bodyColor}
            roughness={0.22}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.35 : 0.08}
            envMapIntensity={1.4}
          />
        </RoundedBox>

        {[1, -1].map((side) => (
          <group key={side} position-z={side * 0.085} rotation-y={side === 1 ? 0 : Math.PI}>
            {product.logoOnLight && (
              <mesh position-z={-0.002}>
                <planeGeometry args={[0.74, 0.74]} />
                <meshBasicMaterial color="#f4f4f7" toneMapped={false} />
              </mesh>
            )}
            <mesh position-z={0.001}>
              <planeGeometry args={[logoSize[0], logoSize[1]]} />
              <meshBasicMaterial
                map={texture}
                alphaMap={mask ?? undefined}
                transparent
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {hovered && (
          <Html center position={[0, -0.85, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <div className="flex -translate-y-1 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-ink/85 px-3 py-1.5 text-xs text-fog shadow-lg backdrop-blur">
              <span className="font-semibold">{product.name}</span>
              <span className="text-fog-3">{product.host} ↗</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

export function LogoTiles({
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
    const k = smooth(scroll.current.vh / 1.6);
    const targetX = portrait ? 0 : lerp(2.1, 0.6, k);
    const targetY = portrait ? lerp(2.2, 0.4, k) : 0;
    group.current.position.x = damp(group.current.position.x, targetX, 3, dt);
    group.current.position.y = damp(group.current.position.y, targetY, 3, dt);
  });

  return (
    <group ref={group}>
      {products.map((p, i) => (
        <Tile key={p.id} product={p} index={i} total={products.length} scroll={scroll} reduced={reduced} />
      ))}
    </group>
  );
}
