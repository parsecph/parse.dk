import { ArrowUpRight } from "lucide-react";
import { accentHex, products } from "@/data/products";
import { LogoBadge } from "./ui/LogoBadge";
import { Reveal } from "./ui/Reveal";
import { SpotCard } from "./ui/SpotCard";

const spotlightIds = ["pageai", "ralphloop", "shipixen"] as const;

export function Spotlight() {
  const picks = spotlightIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm text-fog-3">Start here</p>
          <h2 className="text-balance mt-2 max-w-xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            Three things to try first.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {picks.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <SpotCard
                href={p.url}
                accent={accentHex[p.accent]}
                ariaLabel={`${p.name} — ${p.tagline}`}
                className="h-full"
              >
                <div className="flex h-full flex-col p-6">
                  <LogoBadge product={p} size="lg" />
                  <div className="mt-10 flex items-center gap-2 text-sm text-fog-3">
                    <span className="font-medium text-fog">{p.name}</span>
                    <span className="text-fog-3/60">·</span>
                    <span>{p.host}</span>
                  </div>
                  <h3 className="text-balance mt-2 text-xl font-medium tracking-tight">
                    {p.tagline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog-2">{p.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-fog-2 transition group-hover:text-fog">
                    Open
                    <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
