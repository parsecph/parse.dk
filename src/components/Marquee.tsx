import { products } from "@/data/products";
import { LogoBadge } from "./ui/LogoBadge";

export function Marquee() {
  const items = [...products, ...products];
  return (
    <section aria-label="All products" className="relative mt-16 border-y border-line py-5 lg:mt-8">
      <div className="mask-fade-x overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-10 pr-10 hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <li key={`${p.id}-${i}`}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={i >= products.length}
                tabIndex={i >= products.length ? -1 : 0}
                className="group flex items-center gap-2.5 text-sm text-fog-3 transition hover:text-fog"
              >
                <LogoBadge product={p} size="xs" />
                <span className="font-medium">{p.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
