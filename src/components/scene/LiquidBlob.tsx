"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { blobDisplacement, simplex3d } from "./shaders";

const damp = THREE.MathUtils.damp;

interface Uniforms {
  uTime: { value: number };
  uHit: { value: THREE.Vector3 };
  uHitStrength: { value: number };
  uAmp: { value: number };
}

/**
 * A sphere turned to liquid in the vertex shader. Normals are rebuilt from
 * neighbouring displaced points so lighting stays correct. Dark chrome at
 * rest; the pointer dents it, sends a ripple and brings in iridescence.
 */
export function LiquidBlob({
  radius = 1.1,
  detail = 48,
  reduced,
}: {
  radius?: number;
  detail?: number;
  reduced: React.RefObject<boolean>;
}) {
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>>(null!);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const burst = useRef(0);
  const inside = useRef(false);

  const material = useMemo(() => {
    const uniforms: Uniforms = {
      uTime: { value: 0 },
      uHit: { value: new THREE.Vector3(0, 0, 1) },
      uHitStrength: { value: 0 },
      uAmp: { value: 1 },
    };
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0d0d14"),
      roughness: 0.16,
      metalness: 0.6,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.1,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [140, 600],
      envMapIntensity: 1.6,
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
          float blobEps = 0.05;
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

  // Only react to the pointer while it is really over the canvas; otherwise
  // the default (0, 0) pointer would keep poking the centre forever.
  useEffect(() => {
    const el = gl.domElement;
    const on = () => (inside.current = true);
    const off = () => (inside.current = false);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("pointercancel", off);
    return () => {
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
      el.removeEventListener("pointercancel", off);
    };
  }, [gl]);

  useFrame((state, dt) => {
    const uniforms = mesh.current.material.userData.uniforms as Uniforms;
    const t = state.clock.elapsedTime;
    const slow = reduced.current ? 0.2 : 1;

    uniforms.uTime.value = t * slow;
    uniforms.uAmp.value = reduced.current ? 0.6 : 1;

    mesh.current.rotation.y = t * 0.1 * slow;
    mesh.current.rotation.x = Math.sin(t * 0.17) * 0.15 * slow;

    // Pointer (canvas-relative) -> surface hit
    let hit: THREE.Intersection | undefined;
    if (inside.current) {
      raycaster.setFromCamera(state.pointer, camera);
      hit = raycaster.intersectObject(mesh.current, false)[0];
    }
    let target = 0;
    if (hit) {
      const local = mesh.current.worldToLocal(hit.point.clone());
      uniforms.uHit.value.lerp(local, 1 - Math.exp(-dt * 10));
      target = 1;
    }
    burst.current = damp(burst.current, 0, 4, dt);
    uniforms.uHitStrength.value = damp(
      uniforms.uHitStrength.value,
      target + burst.current * 0.8,
      hit ? 6 : 2.5,
      dt,
    );
    const mat = mesh.current.material;
    mat.iridescence = damp(mat.iridescence, hit ? 1 : 0.1, hit ? 5 : 2, dt);
  });

  return (
    <mesh ref={mesh} material={material}>
      <icosahedronGeometry args={[radius, detail]} />
    </mesh>
  );
}
