"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Fixed, full-viewport WebGL layer that sits behind every section.
 * The CSS gradients underneath double as the no-WebGL fallback.
 */
export function SceneBackdrop() {
  const labelLayer = useRef<HTMLDivElement>(null!);
  return (
    <>
      {/* Tile labels render here so they sit above the page content. */}
      <div
        ref={labelLayer}
        className="pointer-events-none fixed inset-0 z-20"
      />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute -top-1/4 left-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(120,216,255,0.16),transparent)] blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgba(238,114,89,0.14),transparent)] blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.12),transparent)] blur-3xl" />
        <Scene labelLayer={labelLayer} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,7,0.15),rgba(5,5,7,0)_30%,rgba(5,5,7,0)_70%,rgba(5,5,7,0.6))]" />
      </div>
    </>
  );
}
