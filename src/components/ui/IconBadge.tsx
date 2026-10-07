import type { LucideIcon } from "lucide-react";
import { accentHex, type Accent } from "@/data/products";

export function IconBadge({
  icon: Icon,
  accent,
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  accent: Accent;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hex = accentHex[accent];
  const box = size === "lg" ? "size-20 rounded-[22px]" : size === "sm" ? "size-9 rounded-xl" : "size-14 rounded-2xl";
  const glyph = size === "lg" ? "size-10" : size === "sm" ? "size-5" : "size-7";

  return (
    <div
      className={`relative grid shrink-0 place-items-center ${box} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${hex} 0%, color-mix(in oklab, ${hex} 55%, #000) 100%)`,
        boxShadow: `0 18px 40px -16px ${hex}cc, inset 0 1px 0 rgba(255,255,255,.45), inset 0 -10px 18px rgba(0,0,0,.35)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 0%, rgba(255,255,255,.55), transparent 55%)",
        }}
      />
      <Icon className={`relative ${glyph} text-ink`} strokeWidth={2.2} />
    </div>
  );
}
