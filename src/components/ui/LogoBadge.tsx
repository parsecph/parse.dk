import Image from "next/image";
import { accentHex, type Product } from "@/data/products";

const sizes = {
  xs: { box: "size-6 rounded-md", pad: "p-1", px: 24 },
  sm: { box: "size-9 rounded-lg", pad: "p-1.5", px: 36 },
  md: { box: "size-11 rounded-xl", pad: "p-2", px: 44 },
  lg: { box: "size-16 rounded-2xl", pad: "p-3", px: 64 },
} as const;

/**
 * The product's own logo on a flat neutral tile. Grey at rest; colour and a
 * thin accent ring arrive when the parent `group` is hovered.
 */
export function LogoBadge({
  product,
  size = "md",
  className = "",
}: {
  product: Product;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];
  const bleed = product.logoBleed;
  const hex = accentHex[product.accent];

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-white/[0.08] bg-white/[0.04] ${s.box} ${bleed ? "" : s.pad} ${className}`}
    >
      <Image
        src={product.logo}
        alt={`${product.name} logo`}
        width={s.px}
        height={s.px}
        unoptimized
        className={`logo-rest relative size-full ${bleed ? "rounded-[inherit] object-cover" : "object-contain"}`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${hex} 55%, transparent)` }}
      />
    </div>
  );
}
