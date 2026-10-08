import { ArrowUpRight } from "lucide-react";
import { accentHex, categories, products } from "@/data/products";
import { LogoBadge } from "./ui/LogoBadge";
import { Reveal } from "./ui/Reveal";
import { SpotCard } from "./ui/SpotCard";

export function Products() {
  return (
    <section id="products" className="relative scroll-mt-24 border-t border-line px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm text-fog-3">All {products.length}</p>
          <h2 className="text-balance mt-2 max-w-xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            Everything we have made.
          </h2>
          <p className="mt-3 max-w-md text-fog-2">Click any of them. They are all live.</p>
        </Reveal>

        <div className="mt-12 space-y-14">
          {categories.map((cat) => {
            const items = products.filter((p) => p.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <Reveal>
                  <div className="lg:sticky lg:top-24">
                    <h3 className="text-base font-medium">{cat.label}</h3>
                    <p className="mt-1 text-sm text-fog-3">{cat.line}</p>
                    <p className="mt-3 font-mono text-xs text-fog-3">
                      {String(items.length).padStart(2, "0")}
                    </p>
                  </div>
                </Reveal>

                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 2) * 0.05} className="h-full">
                      <SpotCard
                        href={p.url}
                        accent={accentHex[p.accent]}
                        ariaLabel={`${p.name} — ${p.tagline}`}
                        className="h-full"
                      >
                        <div className="flex h-full gap-4 p-5">
                          <LogoBadge product={p} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{p.name}</h4>
                              <span className="truncate font-mono text-[11px] text-fog-3">{p.host}</span>
                              <ArrowUpRight className="ml-auto size-4 shrink-0 text-fog-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog" />
                            </div>
                            <p className="text-balance mt-1 text-fog-2">{p.tagline}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-fog-3">{p.blurb}</p>
                          </div>
                        </div>
                      </SpotCard>
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
