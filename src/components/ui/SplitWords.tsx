"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals a line with a soft rise and blur. Word by word by default; pass
 * `whole` for gradient text, where animated descendants would break
 * `background-clip: text`.
 */
export function SplitWords({
  text,
  delay = 0,
  className = "",
  whole = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  whole?: boolean;
}) {
  if (whole) {
    return (
      <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span
          className={`inline-block ${className}`}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay, ease }}
        >
          {text}
        </motion.span>
      </span>
    );
  }

  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            aria-hidden
            className="inline-block"
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: delay + i * 0.09, ease }}
          >
            {word}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
