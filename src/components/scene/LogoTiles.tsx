"use client";

import { Html, RoundedBox, useCursor, useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { accentHex, products, type Product } from "@/data/products";

const damp = THREE.MathUtils.damp;

let roundedMask: THREE.CanvasTexture | null = null;
/** Shared alpha mask that rounds the corners of full-bleed logo planes. */
function getRoundedMask() {
  if (roundedMask) return roundedMask;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();
  roundedMask = new THREE.CanvasTexture(canvas);
  return roundedMask;
}

const logoVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Logos rest as pure luminance and are mixed back to colour on interaction.
const logoFragment = /* glsl */ `
uniform sampler2D map;
uniform sampler2D alphaMap;
uniform float uUseMask;
uniform float uSat;
uniform float uDim;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(map, vUv);
  float a = c.a * mix(1.0, texture2D(alphaMap, vUv).r, uUseMask);
  float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 rgb = mix(vec3(l) * uDim, c.rgb, uSat);
  gl_FragColor = vec4(rgb, a);
  #include <colorspace_fragment>
}
`;

/** Evenly spread points on a sphere (Fibonacci lattice). */
function spherePoint(i: number, n: number, r: number) {
  const y = 1 - (i / (n - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return new THREE.Vector3(Math.cos(theta) * rad * r, y * r * 0.8, Math.sin(theta) * rad * r);
}

export type Spin = { y: number; x: number };

function Tile({
  product,
  base,
  index,
  spinRef,
  reduced,
  touch,
  selected,
  onSelect,
  labelLayer,
}: {
  product: Product;
  base: THREE.Vector3;
  index: number;
  spinRef: React.RefObject<Spin>;
  reduced: React.RefObject<boolean>;
  touch: boolean;
  selected: boolean;
  onSelect: (id: string | null) => void;
  labelLayer: React.RefObject<HTMLDivElement>;
}) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const logoFront = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null!);
  const [hovered, setHovered] = useState(false);
  const lit = hovered || selected;
  useCursor(hovered);

  const texture = useTexture(product.logo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });
  const logoSize = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const w = img?.width ?? 1;
    const h = img?.height ?? 1;
    const max = product.logoBleed ? 0.84 : 0.56;
    return w >= h ? [max, (max * h) / w] : [(max * w) / h, max];
  }, [texture, product.logoBleed]);
  const mask = useMemo(() => (product.logoBleed ? getRoundedMask() : null), [product.logoBleed]);

  const logoMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          alphaMap: { value: mask },
          uUseMask: { value: mask ? 1 : 0 },
          uSat: { value: 0 },
          uDim: { value: product.logoBleed ? 0.75 : 0.9 },
        },
        vertexShader: logoVertex,
        fragmentShader: logoFragment,
        transparent: true,
      }),
    [texture, mask, product.logoBleed],
  );

  const glowColor = useMemo(() => new THREE.Color(accentHex[product.accent]), [product.accent]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const slow = reduced.current ? 0.1 : 1;
    const { x: sx, y: sy } = spinRef.current;

    scratch.copy(base);
    scratch.applyAxisAngle(X_AXIS, sx);
    scratch.applyAxisAngle(Y_AXIS, t * 0.05 * slow + sy);
    scratch.y += Math.sin(t * 0.6 * slow + index * 1.3) * 0.05;
    group.current.position.copy(scratch);

    const targetScale = lit ? 1.18 : 1;
    group.current.scale.setScalar(damp(group.current.scale.x, targetScale, 8, dt));

    // Face the camera with a lazy wobble; hold still while lit.
    const ry = lit ? 0 : Math.sin(t * 0.4 * slow + index) * 0.35;
    const rx = lit ? 0 : Math.cos(t * 0.3 * slow + index * 1.7) * 0.18;
    inner.current.rotation.y = damp(inner.current.rotation.y, ry, 6, dt);
    inner.current.rotation.x = damp(inner.current.rotation.x, rx, 6, dt);

    const sat = logoFront.current.material.uniforms.uSat as { value: number };
    sat.value = damp(sat.value, lit ? 1 : 0, lit ? 8 : 3, dt);
    bodyRef.current.emissiveIntensity = damp(bodyRef.current.emissiveIntensity, lit ? 0.22 : 0, 7, dt);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };
  const onOut = () => setHovered(false);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Without hover, the first tap lights the tile up; the second opens it.
    if (touch && !selected) {
      onSelect(product.id);
      return;
    }
    window.open(product.url, "_blank", "noopener,noreferrer");
  };

  return (
    <group ref={group}>
      <group ref={inner}>
        <RoundedBox
          args={[0.98, 0.98, 0.14]}
          radius={0.2}
          smoothness={4}
          onPointerOver={onOver}
          onPointerOut={onOut}
          onClick={onClick}
        >
          <meshPhysicalMaterial
            ref={bodyRef}
            color="#15151c"
            roughness={0.3}
            metalness={0.4}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
            emissive={glowColor}
            emissiveIntensity={0}
            envMapIntensity={1.1}
          />
        </RoundedBox>

        {[1, -1].map((side) => (
          <mesh
            key={side}
            ref={side === 1 ? logoFront : undefined}
            position-z={side * 0.076}
            rotation-y={side === 1 ? 0 : Math.PI}
            material={logoMaterial}
          >
            <planeGeometry args={[logoSize[0], logoSize[1]]} />
          </mesh>
        ))}

        {lit && (
          <Html
            center
            position={[0, -0.82, 0]}
            portal={labelLayer}
            zIndexRange={[30, 20]}
            style={{ pointerEvents: "none" }}
          >
            <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-ink/90 px-3 py-1.5 text-xs text-fog shadow-lg">
              <span
                className="size-1.5 rounded-full"
                style={{ background: accentHex[product.accent] }}
              />
              <span className="font-medium">{product.name}</span>
              <span className="text-fog-3">{touch && selected ? "Tap again to open" : product.host}</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const scratch = new THREE.Vector3();

export function LogoTiles({
  radius = 2.5,
  spinRef,
  reduced,
  touch,
  labelLayer,
}: {
  radius?: number;
  spinRef: React.RefObject<Spin>;
  reduced: React.RefObject<boolean>;
  touch: boolean;
  labelLayer: React.RefObject<HTMLDivElement>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const bases = useMemo(
    () => products.map((_, i) => spherePoint(i, products.length, radius)),
    [radius],
  );

  return (
    <group onPointerMissed={() => setSelected(null)}>
      {products.map((p, i) => (
        <Tile
          key={p.id}
          product={p}
          base={bases[i]}
          index={i}
          spinRef={spinRef}
          reduced={reduced}
          touch={touch}
          selected={selected === p.id}
          onSelect={setSelected}
          labelLayer={labelLayer}
        />
      ))}
    </group>
  );
}
