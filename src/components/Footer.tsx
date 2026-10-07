import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { products, socials } from "@/data/products";

export function Footer() {
  return (
    <footer className="relative z-10 px-4 pb-10 pt-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card noise relative rounded-[2rem] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-white/90">
                  <Image
                    src="/parse-logo.svg"
                    alt="Parse logo"
                    width={28}
                    height={29}
                    unoptimized
                  />
                </span>
                <div>
                  <p className="font-semibold leading-tight">Parse</p>
                  <p className="text-sm text-fog-3">Copenhagen</p>
                </div>
              </div>
              <p className="text-balance mt-6 max-w-xs text-2xl font-semibold tracking-tight">
                Fifteen products. More on the way.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-fog-2">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-fog"
                    >
                      {s.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Products">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-fog-3">
                Everything, in one list
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 py-0.5 text-sm text-fog-2 transition hover:text-fog"
                    >
                      <Image
                        src={p.logo}
                        alt=""
                        width={16}
                        height={16}
                        unoptimized
                        className={`size-4 shrink-0 object-contain opacity-80 saturate-0 transition group-hover:opacity-100 group-hover:saturate-100 ${p.logoBleed ? "rounded-[3px]" : ""}`}
                      />
                      <span className="font-medium">{p.name}</span>
                      <span className="truncate text-fog-3">{p.host}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition group-hover:opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-fog-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© Parse Copenhagen. Registered in Denmark, DK39296675.</p>
            <p>Dark mode only. Like it should be.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
