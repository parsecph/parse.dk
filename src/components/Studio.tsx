import { Check, Rocket, Scissors, ArrowUpRight } from "lucide-react";
import { socials } from "@/data/products";
import { GitHubMark, XMark } from "./ui/BrandMarks";
import { Reveal } from "./ui/Reveal";

const principles = [
  {
    icon: Rocket,
    title: "Ship it.",
    body: "An idea is worth nothing until someone can use it. We put things out early, then make them better.",
    accent: "group-hover:text-coral",
  },
  {
    icon: Scissors,
    title: "Cut it down.",
    body: "Every product does one thing. We remove until only the useful part is left.",
    accent: "group-hover:text-sky",
  },
  {
    icon: Check,
    title: "Make it work.",
    body: "Fast, honest, no tricks. If it says it does something, it does.",
    accent: "group-hover:text-mint",
  },
];

export function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-24 border-t border-line px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-sm text-fog-3">The studio</p>
              <h2 className="text-balance mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                Small on purpose.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-fog-2">
                Parse is a software studio in Copenhagen. No investors, no
                roadmap decks. We build things we need, and it turns out other
                people need them too.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-8 grid max-w-sm grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="text-fog-3">Based in</dt>
                  <dd className="mt-1 font-medium">Copenhagen, Denmark</dd>
                </div>
                <div>
                  <dt className="text-fog-3">Company</dt>
                  <dd className="mt-1 font-mono text-xs font-medium">DK39296675</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="panel inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-fog-2 transition hover:border-white/15 hover:text-fog"
                    >
                      {s.label === "GitHub" ? (
                        <GitHubMark className="size-3.5" />
                      ) : (
                        <XMark className="size-3" />
                      )}
                      {s.handle}
                      <ArrowUpRight className="size-3 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <li className="group flex gap-5 py-6">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] transition-colors duration-500 group-hover:border-white/15">
                    <p.icon className={`size-[18px] text-fog-2 transition-colors duration-500 ${p.accent}`} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
                    <p className="mt-1 leading-relaxed text-fog-2">{p.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
