"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

/** Thin gradient line across the top that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-fog/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      style={{ scaleX }}
    />
  );
}

/** A soft light that follows the pointer. Hidden on touch devices. */
export function CursorGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });
  const left = useTransform(sx, (v) => v - 260);
  const top = useTransform(sy, (v) => v - 260);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[5] size-[520px] rounded-full opacity-70 mix-blend-screen motion-reduce:hidden"
      style={{
        left,
        top,
        background:
          "radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(120,216,255,0.04) 45%, transparent 70%)",
      }}
    />
  );
}
