"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { accentHex, type Product } from "@/data/products";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * A box in the hero that hosts the 3D cluster. It scrolls with the page like
 * any other element and stops rendering as soon as it leaves the viewport.
 * On touch devices the selected tile is named in a line under the box.
 */
export function HeroVisual({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null!);
  const labelLayer = useRef<HTMLDivElement>(null!);
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "80px 0px" },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className={className}>
      <div ref={box} className="relative h-full">
        {/* A quiet pool of light behind the cluster; also the no-WebGL fallback. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-2xl"
        />
        <HeroScene labelLayer={labelLayer} active={active} onSelect={setSelected} />
        <div ref={labelLayer} className="pointer-events-none absolute inset-0 z-20" />
      </div>

      <p className="mt-3 flex min-h-5 items-center justify-center gap-2 text-center text-xs text-fog-3 lg:hidden">
        {selected ? (
          <>
            <span
              className="size-1.5 rounded-full"
              style={{ background: accentHex[selected.accent] }}
            />
            <span className="font-medium text-fog">{selected.name}</span>
            <span>{selected.host}</span>
            <span className="text-fog-3/70">· Tap again to open</span>
          </>
        ) : (
          "Tap a tile to see what it is. Tap again to open it."
        )}
      </p>
    </div>
  );
}
