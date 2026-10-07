import Image from "next/image";
import { accentHex, type Product } from "@/data/products";

const sizes = {
  sm: { box: "size-9 rounded-xl", pad: "p-1.5", px: 36 },
  md: { box: "size-14 rounded-2xl", pad: "p-2.5", px: 56 },
  lg: { box: "size-24 rounded-[26px]", pad: "p-4", px: 96 },
} as const;

/** The product's own logo on an accent-tinted glass tile. */
export function LogoBadge({
  product,
  size = "md",
  className = "",
}: {
  product: Product;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const hex = accentHex[product.accent];
  const s = sizes[size];
  const light = product.logoOnLight;
  const bleed = product.logoBleed;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden ${s.box} ${bleed ? "" : s.pad} ${className}`}
      style={{
        background: light
          ? "linear-gradient(160deg, #ffffff 0%, #e9e9ef 100%)"
          : `linear-gradient(160deg, color-mix(in oklab, ${hex} 28%, #121218) 0%, color-mix(in oklab, ${hex} 10%, #0b0b10) 100%)`,
        boxShadow: `0 16px 36px -14px ${hex}aa, inset 0 1px 0 rgba(255,255,255,${light ? 0.9 : 0.18}), inset 0 -1px 0 rgba(0,0,0,.4), 0 0 0 1px color-mix(in oklab, ${hex} 35%, transparent)`,
      }}
    >
      <Image
        src={product.logo}
        alt={`${product.name} logo`}
        width={s.px}
        height={s.px}
        unoptimized
        className={`relative size-full transition-transform duration-500 ease-out group-hover:scale-110 ${
          bleed ? "rounded-[inherit] object-cover" : "object-contain group-hover:-rotate-3"
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(120% 70% at 30% 0%, rgba(255,255,255,.18), transparent 55%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)",
        }}
      />
    </div>
  );
}
