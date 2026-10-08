"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * A box in the hero that hosts the 3D cluster. It scrolls with the page like
 * any other element and stops rendering as soon as it leaves the viewport.
 */
export function HeroVisual({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null!);
  const labelLayer = useRef<HTMLDivElement>(null!);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "80px 0px" },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative ${className}`}>
      {/* A quiet pool of light behind the cluster; also the no-WebGL fallback. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-2xl"
      />
      <HeroScene labelLayer={labelLayer} active={active} />
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 z-20" />
    </div>
  );
}
