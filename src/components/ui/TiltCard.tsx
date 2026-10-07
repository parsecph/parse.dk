"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, type ReactNode } from "react";

/**
 * A pointer-tracking 3D card. Children can use `translateZ` to float above the surface.
 * Falls back to a static card on touch devices and when motion is reduced.
 */
export function TiltCard({
  children,
  className = "",
  href,
  glow = "#78d8ff",
  maxTilt = 10,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  glow?: string;
  maxTilt?: number;
  ariaLabel?: string;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sh = useSpring(hover, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(sx, [0, 1], [0, 100]);
  const glareY = useTransform(sy, [0, 1], [0, 100]);
  const glareOpacity = useTransform(sh, [0, 1], [0, 1]);
  const lift = useTransform(sh, [0, 1], [0, -6]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, ${glow}33, transparent 45%)`;
  const border = useMotionTemplate`radial-gradient(360px circle at ${glareX}% ${glareY}%, ${glow}aa, rgba(255,255,255,0.08) 60%)`;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      if (e.pointerType === "touch") return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    },
    [px, py],
  );

  const onLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  }, [px, py, hover]);

  return (
    <div className="perspective-1200 h-full">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerEnter={() => hover.set(1)}
        onPointerLeave={onLeave}
        onFocus={() => hover.set(1)}
        onBlur={onLeave}
        style={{ rotateX, rotateY, y: lift }}
        className={`preserve-3d group relative block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-sky/70 motion-reduce:transform-none ${className}`}
      >
        {/* animated border */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-70"
          style={{
            background: border,
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 1,
          }}
        />
        {/* surface */}
        <div className="glass noise absolute inset-0 rounded-[inherit]" />
        {/* glare */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare, opacity: glareOpacity }}
        />
        <div className="preserve-3d relative h-full">{children}</div>
      </motion.a>
    </div>
  );
}
