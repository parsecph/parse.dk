import { ArrowUpRight } from "lucide-react";
import { accentHex, categories, products } from "@/data/products";
import { LogoBadge } from "./ui/LogoBadge";
import { Reveal } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";

export function Products() {
  return (
    <section id="products" className="relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-fog-3">
            All {products.length}
          </p>
          <h2 className="text-balance mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Everything we have made.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-fog-2">
            Click any of them. They are all live.
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {categories.map((cat) => {
            const items = products.filter((p) => p.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <Reveal>
                  <div className="mb-6 flex items-baseline gap-3 border-b border-white/10 pb-3">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-fog-3">{cat.line}</p>
                    <span className="ml-auto font-mono text-xs text-fog-3">
                      {String(items.length).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 0.06} className="h-full">
                      <TiltCard
                        href={p.url}
                        glow={accentHex[p.accent]}
                        ariaLabel={`${p.name} — ${p.tagline}`}
                        className="min-h-[15.5rem]"
                      >
                        <div className="flex h-full flex-col p-6">
                          <div
                            className="flex items-start justify-between"
                            style={{ transform: "translateZ(36px)" }}
                          >
                            <LogoBadge product={p} />
                            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-fog-3">
                              {p.host}
                            </span>
                          </div>

                          <div
                            className="mt-auto pt-8 pr-8"
                            style={{ transform: "translateZ(18px)" }}
                          >
                            <h4 className="text-sm font-medium text-fog-3">
                              {p.name}
                            </h4>
                            <p className="text-balance mt-1 text-xl font-semibold leading-snug tracking-tight">
                              {p.tagline}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-fog-2">
                              {p.blurb}
                            </p>
                          </div>

                          <ArrowUpRight className="absolute right-6 bottom-6 size-5 text-fog-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog" />
                        </div>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
