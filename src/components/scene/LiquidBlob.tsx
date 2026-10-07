"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { blobDisplacement, simplex3d } from "./shaders";
import type { ScrollState } from "./use-scroll-progress";

const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;
const smooth = (t: number) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

type Pointer = { x: number; y: number };

interface Uniforms {
  uTime: { value: number };
  uHit: { value: THREE.Vector3 };
  uHitStrength: { value: number };
  uAmp: { value: number };
}

/**
 * A sphere turned to liquid in the vertex shader. Normals are rebuilt from
 * neighbouring displaced points so lighting and iridescence stay correct.
 * Hovering pokes a dent and sends a ripple across the surface.
 */
export function LiquidBlob({
  scroll,
  pointer,
  reduced,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<Pointer>;
  reduced: React.RefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>>(null!);
  const { viewport, camera } = useThree();
  const portrait = viewport.aspect < 1;
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const burst = useRef(0);

  const material = useMemo(() => {
    const uniforms: Uniforms = {
      uTime: { value: 0 },
      uHit: { value: new THREE.Vector3(0, 0, 1) },
      uHitStrength: { value: 0 },
      uAmp: { value: 1 },
    };
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0c0c13"),
      roughness: 0.16,
      metalness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 1,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [140, 600],
      envMapIntensity: 1.8,
      sheen: 0.4,
      sheenColor: new THREE.Color("#78d8ff"),
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>\n${simplex3d}\n${blobDisplacement}`,
        )
        .replace(
          "#include <beginnormal_vertex>",
          `
          vec3 blobN = normalize(position);
          vec3 blobT = normalize(cross(blobN, abs(blobN.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
          vec3 blobB = cross(blobN, blobT);
          float blobEps = 0.035;
          vec3 blobP0 = blobPoint(position);
          vec3 blobP1 = blobPoint(position + blobT * blobEps);
          vec3 blobP2 = blobPoint(position + blobB * blobEps);
          vec3 objectNormal = normalize(cross(blobP1 - blobP0, blobP2 - blobP0));
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif
          `,
        )
        .replace("#include <begin_vertex>", "vec3 transformed = blobP0;");
    };
    m.customProgramCacheKey = () => "parse-liquid-blob";
    m.userData.uniforms = uniforms;
    return m;
  }, []);

  useEffect(() => {
    const onDown = () => (burst.current = 1);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useFrame((state, dt) => {
    const uniforms = mesh.current.material.userData.uniforms as Uniforms;
    const t = state.clock.elapsedTime;
    const { vh } = scroll.current;
    const k = smooth(vh / 1.4);
    const slow = reduced.current ? 0.2 : 1;

    uniforms.uTime.value = t * slow;
    uniforms.uAmp.value = reduced.current ? 0.6 : 1;

    const restX = portrait ? 0 : 2.1;
    const restY = portrait ? 2.3 : 0.1;
    const restZ = portrait ? -0.6 : 0;
    const restScale = portrait ? 0.5 : 1;

    const targetX = lerp(restX, portrait ? 0.9 : 3.2, k);
    const targetY = lerp(restY, portrait ? 2.1 : -0.3, k);
    const targetZ = lerp(restZ, portrait ? -3 : -3.6, k);
    const targetScale = lerp(restScale, portrait ? 0.45 : 0.85, k);

    group.current.position.x = damp(group.current.position.x, targetX, 3, dt);
    group.current.position.y = damp(group.current.position.y, targetY, 3, dt);
    group.current.position.z = damp(group.current.position.z, targetZ, 3, dt);
    const s = damp(group.current.scale.x, targetScale, 3, dt);
    group.current.scale.setScalar(s);

    mesh.current.rotation.y = t * 0.12 * slow + vh * 0.8;
    mesh.current.rotation.x = Math.sin(t * 0.2) * 0.2 * slow + vh * 0.4;

    // Pointer -> surface hit
    ndc.set(pointer.current.x, pointer.current.y);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(mesh.current, false)[0];
    let target = 0;
    if (hit) {
      const local = mesh.current.worldToLocal(hit.point.clone());
      uniforms.uHit.value.lerp(local, 1 - Math.exp(-dt * 10));
      target = 1;
    }
    burst.current = damp(burst.current, 0, 4, dt);
    uniforms.uHitStrength.value = damp(
      uniforms.uHitStrength.value,
      target + burst.current * 0.9,
      hit ? 6 : 2.5,
      dt,
    );
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} material={material}>
        <icosahedronGeometry args={[1.55, 96]} />
      </mesh>
    </group>
  );
}
