import { Check, Rocket, Scissors, MapPin, ArrowUpRight } from "lucide-react";
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
    <section id="studio" className="relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-fog-3">
                The studio
              </p>
              <h2 className="text-balance mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Small on purpose.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-fog-2">
                Parse is a software studio in Copenhagen. No investors, no
                roadmap decks. We build things we need, and it turns out other
                people need them too.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass mt-8 inline-flex items-center gap-3 rounded-2xl px-4 py-3">
                <MapPin className="size-5 text-fog-2" />
                <div className="text-sm">
                  <p className="font-medium">Copenhagen, Denmark</p>
                  <p className="text-fog-3">Registered company · DK39296675</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-fog-2 transition hover:bg-white/10 hover:text-fog"
                    >
                      {s.label === "GitHub" ? (
                        <GitHubMark className="size-4" />
                      ) : (
                        <XMark className="size-3.5" />
                      )}
                      {s.handle}
                      <ArrowUpRight className="size-3.5 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <ul className="grid gap-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <li className="glass-card noise group relative flex gap-5 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 transition-colors duration-500 group-hover:border-white/20">
                    <p.icon
                      className={`size-6 text-fog-2 transition-colors duration-500 ${p.accent}`}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-fog-2">{p.body}</p>
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
