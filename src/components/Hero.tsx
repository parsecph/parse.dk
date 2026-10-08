import { ArrowDown, ArrowUpRight, MapPin, MousePointerClick } from "lucide-react";
import { products } from "@/data/products";
import { CountUp } from "./ui/CountUp";
import { Magnetic } from "./ui/Magnetic";
import { Reveal } from "./ui/Reveal";
import { SplitWords } from "./ui/SplitWords";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-end px-4 pb-16 pt-28 sm:px-6 lg:items-center lg:pb-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <p className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide text-fog-2">
              <MapPin className="size-3.5 text-fog-3" />
              Made in Copenhagen
            </p>
          </Reveal>

          <h1 className="text-balance group mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
            <SplitWords text="We make software." delay={0.1} />
            <br />
            <SplitWords
              text="Then we ship it."
              delay={0.42}
              whole
              className="shine-text group-hover:[--shine-a:var(--color-sky)] group-hover:[--shine-b:var(--color-fog)] group-hover:[--shine-c:var(--color-coral-2)]"
            />
          </h1>

          <Reveal delay={0.6}>
            <p className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-fog-2 sm:text-xl">
              Parse is a small studio. {products.length} products so far. An AI
              that builds websites. Tools that watch your APIs. A show for
              makers. All made here. All live.
            </p>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#products"
                  className="group inline-flex items-center gap-2 rounded-full bg-fog px-5 py-3 text-sm font-semibold text-ink shadow-[0_12px_40px_-12px_rgba(255,255,255,0.45)] transition hover:bg-white hover:shadow-[0_16px_50px_-12px_rgba(255,255,255,0.7)]"
                >
                  See the products
                  <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://github.com/parsecph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-fog-2 transition hover:border-white/40 hover:text-fog"
                >
                  Follow on GitHub
                  <ArrowUpRight className="size-4 opacity-70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.8}>
            <dl className="mt-12 flex max-w-md gap-12 border-t border-white/10 pt-6">
              <Stat label="Products">
                <CountUp to={products.length} />
              </Stat>
              <Stat label="Based in">CPH</Stat>
            </dl>
          </Reveal>

          <Reveal delay={0.9}>
            <p className="mt-10 hidden items-center gap-2 text-xs text-fog-3 lg:inline-flex">
              <MousePointerClick className="size-3.5" />
              The floating tiles are the products. Hover one. Click it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-fog-3">{label}</dt>
      <dd className="mt-1 font-mono text-2xl font-medium tracking-tight sm:text-3xl">
        {children}
      </dd>
    </div>
  );
}
