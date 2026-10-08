import { ArrowRight, ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { HeroVisual } from "./scene/HeroVisual";
import { Magnetic } from "./ui/Magnetic";
import { Reveal } from "./ui/Reveal";

export function Hero() {
  return (
    <section id="top" className="relative px-4 pt-28 sm:px-6 lg:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6">
        <div className="relative z-10 max-w-xl">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 text-sm text-fog-2">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-mint" />
              {products.length} products. All live. Made in Copenhagen.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-balance mt-6 text-5xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              We make software.
              <br />
              <span className="text-fog-3">Then we ship it.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-balance mt-6 max-w-md text-lg leading-relaxed text-fog-2">
              A small studio that builds its own products. An AI that makes
              websites. Tools that watch your APIs. A show for makers.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.25}>
                <a
                  href="#products"
                  className="group inline-flex h-10 items-center gap-2 rounded-full bg-fog px-4 text-sm font-medium text-ink transition hover:bg-white"
                >
                  See the products
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href="https://github.com/parsecph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-fog-2 transition hover:text-fog"
                >
                  Follow on GitHub
                  <ArrowUpRight className="size-4 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-10 hidden text-xs text-fog-3 lg:block">
              The tiles are the products. Hover one. Click it.
            </p>
          </Reveal>
        </div>

        <HeroVisual className="h-[22rem] sm:h-[26rem] lg:h-[min(44rem,calc(100svh-8rem))]" />
      </div>
      <p className="mx-auto mt-4 max-w-6xl text-center text-xs text-fog-3 lg:hidden">
        Tap a tile to see what it is. Tap again to open it.
      </p>
    </section>
  );
}
