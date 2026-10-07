import { products } from "@/data/products";
import { IconBadge } from "./ui/IconBadge";

export function Marquee() {
  const items = [...products, ...products];
  return (
    <section aria-label="All products" className="relative py-6">
      <div className="mask-fade-x overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-3 pr-3 hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <li key={`${p.id}-${i}`}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={i >= products.length}
                tabIndex={i >= products.length ? -1 : 0}
                className="glass flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm text-fog-2 transition hover:bg-white/10 hover:text-fog"
              >
                <IconBadge icon={p.icon} accent={p.accent} size="sm" />
                <span className="font-medium text-fog">{p.name}</span>
                <span className="hidden text-fog-3 sm:inline">{p.host}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
