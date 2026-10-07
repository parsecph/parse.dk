import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { products } from "@/data/products";
import { Reveal } from "./ui/Reveal";

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
              <MapPin className="size-3.5 text-coral" />
              Made in Copenhagen
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-balance mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              We make software.
              <br />
              <span className="bg-gradient-to-r from-sky via-fog to-coral-2 bg-clip-text text-transparent">
                Then we ship it.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-fog-2 sm:text-xl">
              Parse is a small studio. {products.length} products so far. An AI
              that builds websites. Tools that watch your APIs. A show for
              makers. All made here. All live.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="group inline-flex items-center gap-2 rounded-full bg-fog px-5 py-3 text-sm font-semibold text-ink shadow-[0_10px_40px_-10px_rgba(120,216,255,0.6)] transition hover:bg-white"
              >
                See the products
                <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
              </a>
              <a
                href="https://github.com/parsecph"
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-fog transition hover:bg-white/10"
              >
                Follow on GitHub
                <ArrowUpRight className="size-4 opacity-70" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <Stat value={String(products.length)} label="Products" />
              <Stat value="1" label="Small team" />
              <Stat value="CPH" label="Denmark" />
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-fog-3">{label}</dt>
      <dd className="mt-1 font-mono text-2xl font-medium tracking-tight sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}
