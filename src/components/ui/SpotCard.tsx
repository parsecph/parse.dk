"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useCallback, type ReactNode } from "react";

/**
 * A flat panel that lights up under the pointer: a soft white highlight
 * inside and a thin accent rim at the edge nearest the cursor.
 */
export function SpotCard({
  children,
  href,
  accent = "#78d8ff",
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  href: string;
  accent?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const hover = useMotionValue(0);
  const sh = useSpring(hover, { stiffness: 200, damping: 24 });

  const highlight = useMotionTemplate`radial-gradient(460px circle at ${mx}px ${my}px, rgba(255,255,255,0.11), transparent 60%)`;
  const rim = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, ${accent}, transparent 70%)`;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      if (e.pointerType === "touch") return;
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [mx, my],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onPointerMove={onMove}
      onPointerEnter={() => hover.set(1)}
      onPointerLeave={() => hover.set(0)}
      onFocus={() => hover.set(1)}
      onBlur={() => hover.set(0)}
      className={`panel group relative block overflow-hidden rounded-2xl outline-none transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/15 focus-visible:ring-2 focus-visible:ring-fog/40 motion-reduce:transform-none ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: highlight, opacity: sh }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit]"
        style={{
          background: rim,
          opacity: sh,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <div className="relative h-full">{children}</div>
    </a>
  );
}
