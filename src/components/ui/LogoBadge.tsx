import Image from "next/image";
import { accentHex, type Product } from "@/data/products";

const sizes = {
  sm: { box: "size-9 rounded-xl", pad: "p-1.5", px: 36 },
  md: { box: "size-14 rounded-2xl", pad: "p-2.5", px: 56 },
  lg: { box: "size-24 rounded-[26px]", pad: "p-4", px: 96 },
} as const;

/**
 * The product's own logo on a neutral glass tile. Rests in near-monochrome;
 * colour and the accent rim arrive when the parent `group` is hovered.
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
  const hex = accentHex[product.accent];
  const s = sizes[size];
  const bleed = product.logoBleed;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden ${s.box} ${bleed ? "" : s.pad} ${className}`}
      style={{
        background:
          "linear-gradient(160deg, #1c1c25 0%, #101016 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.5), 0 14px 30px -14px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.07)",
      }}
    >
      <Image
        src={product.logo}
        alt={`${product.name} logo`}
        width={s.px}
        height={s.px}
        unoptimized
        className={`logo-rest relative size-full group-hover:scale-110 ${
          bleed ? "rounded-[inherit] object-cover" : "object-contain group-hover:-rotate-3"
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(120% 70% at 30% 0%, rgba(255,255,255,.14), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${hex} 60%, transparent), 0 10px 30px -10px ${hex}99`,
        }}
      />
    </div>
  );
}
