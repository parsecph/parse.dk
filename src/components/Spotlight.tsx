import { ArrowUpRight } from "lucide-react";
import { accentHex, products } from "@/data/products";
import { IconBadge } from "./ui/IconBadge";
import { Reveal } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";

const spotlightIds = ["pageai", "ralphloop", "shipixen"] as const;

export function Spotlight() {
  const picks = spotlightIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky">
            Start here
          </p>
          <h2 className="text-balance mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Three things to try first.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {picks.map((p, i) => {
            const hex = accentHex[p.accent];
            return (
              <Reveal key={p.id} delay={i * 0.08} className="h-full">
                <TiltCard
                  href={p.url}
                  glow={hex}
                  maxTilt={8}
                  ariaLabel={`${p.name} — ${p.tagline}`}
                  className="min-h-[26rem]"
                >
                  <div className="flex h-full flex-col p-7">
                    <div className="relative flex h-44 items-center justify-center">
                      <div
                        aria-hidden
                        className="absolute size-40 rounded-full blur-3xl"
                        style={{ background: `${hex}55` }}
                      />
                      <div
                        aria-hidden
                        className="absolute size-36 rounded-[34px] border border-white/10 bg-white/[0.03]"
                        style={{ transform: "translateZ(10px) rotate(8deg)" }}
                      />
                      <div
                        aria-hidden
                        className="absolute size-28 rounded-[28px] border border-white/10 bg-white/[0.04]"
                        style={{ transform: "translateZ(30px) rotate(-6deg)" }}
                      />
                      <IconBadge
                        icon={p.icon}
                        accent={p.accent}
                        size="lg"
                        className="animate-float"
                      />
                    </div>

                    <div
                      className="mt-auto"
                      style={{ transform: "translateZ(24px)" }}
                    >
                      <div className="flex items-center gap-2 text-sm text-fog-3">
                        <span className="font-medium text-fog">{p.name}</span>
                        <span>·</span>
                        <span>{p.host}</span>
                      </div>
                      <h3 className="text-balance mt-2 text-2xl font-semibold tracking-tight">
                        {p.tagline}
                      </h3>
                      <p className="mt-2 text-fog-2">{p.blurb}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fog">
                        Open {p.host}
                        <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
