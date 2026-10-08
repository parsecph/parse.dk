import { products } from "@/data/products";
import { LogoBadge } from "./ui/LogoBadge";

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
                className="glass group flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm text-fog-2 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-fog"
              >
                <LogoBadge product={p} size="sm" />
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
