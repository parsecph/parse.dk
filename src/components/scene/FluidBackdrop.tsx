"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { fluidFragment, fluidVertex } from "./shaders";
import type { ScrollState } from "./use-scroll-progress";

type Pointer = { x: number; y: number };

const TRAIL = 8;
const DIST = 24;

/**
 * Full-viewport domain-warped noise field that the pointer stirs.
 * Rendered far behind everything else so the blob and tiles float over it.
 */
export function FluidBackdrop({
  scroll,
  pointer,
  reduced,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<Pointer>;
  reduced: React.RefObject<boolean>;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const dir = useMemo(() => new THREE.Vector3(), []);
  const last = useRef(new THREE.Vector2(-10, -10));
  const sinceDrop = useRef(0);
  const target = useMemo(() => new THREE.Vector2(), []);

  const material = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTrail: {
        value: Array.from({ length: TRAIL }, () => new THREE.Vector2(-10, -10)),
      },
      uTrailAge: { value: new Float32Array(TRAIL).fill(1) },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Color("#07070b") },
      uColA: { value: new THREE.Color("#2a1030") },
      uColB: { value: new THREE.Color("#0b3d52") },
      uColC: { value: new THREE.Color("#5a2a26") },
    };
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: fluidVertex,
      fragmentShader: fluidFragment,
      depthWrite: false,
      depthTest: false,
    });
  }, []);

  useFrame((state, dt) => {
    const uniforms = (mesh.current.material as THREE.ShaderMaterial)
      .uniforms as {
      uTime: { value: number };
      uPointer: { value: THREE.Vector2 };
      uTrail: { value: THREE.Vector2[] };
      uTrailAge: { value: Float32Array };
      uScroll: { value: number };
    };
    const trail = uniforms.uTrail.value;
    const ages = uniforms.uTrailAge.value;
    const slow = reduced.current ? 0.25 : 1;
    uniforms.uTime.value = state.clock.elapsedTime * slow;
    uniforms.uScroll.value = scroll.current.progress;

    const px = pointer.current.x * 0.5 + 0.5;
    const py = pointer.current.y * 0.5 + 0.5;
    uniforms.uPointer.value.lerp(target.set(px, py), 1 - Math.exp(-dt * 6));

    // Drop a trail sample whenever the pointer has moved a little.
    sinceDrop.current += dt;
    const moved = last.current.distanceTo(uniforms.uPointer.value);
    if (moved > 0.015 && sinceDrop.current > 0.05) {
      const v = trail.pop()!;
      v.copy(uniforms.uPointer.value);
      trail.unshift(v);
      for (let i = TRAIL - 1; i > 0; i--) ages[i] = ages[i - 1];
      ages[0] = 0;
      last.current.copy(uniforms.uPointer.value);
      sinceDrop.current = 0;
    }
    for (let i = 0; i < TRAIL; i++) {
      ages[i] = Math.min(1, ages[i] + dt * 0.9);
    }

    // Keep the plane glued to the camera and sized to fill the view.
    const cam = camera as THREE.PerspectiveCamera;
    camera.getWorldDirection(dir);
    mesh.current.position.copy(camera.position).addScaledVector(dir, DIST);
    mesh.current.quaternion.copy(camera.quaternion);
    const h = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    mesh.current.scale.set(h * cam.aspect * 1.08, h * 1.08, 1);
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
