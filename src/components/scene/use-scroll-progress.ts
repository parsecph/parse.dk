"use client";

import { useEffect, useRef } from "react";

export interface ScrollState {
  /** 0 at top, 1 at bottom of the document */
  progress: number;
  /** scrollY measured in viewport heights */
  vh: number;
}

/**
 * Scroll position stored in a ref so the render loop can read it
 * every frame without re-rendering React.
 */
export function useScrollProgress() {
  const state = useRef<ScrollState>({ progress: 0, vh: 0 });

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      state.current.progress = Math.min(1, Math.max(0, window.scrollY / max));
      state.current.vh = window.scrollY / Math.max(1, window.innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}
