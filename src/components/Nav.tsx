import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GitHubMark } from "./ui/BrandMarks";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium"
        >
          <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white/90">
            <Image
              src="/parse-logo.svg"
              alt=""
              width={22}
              height={23}
              unoptimized
              priority
            />
          </span>
          Parse
          <span className="hidden text-fog-3 sm:inline">Copenhagen</span>
        </a>

        <nav className="glass flex items-center gap-1 rounded-full p-1 text-sm">
          <a
            href="#products"
            className="rounded-full px-3.5 py-1.5 text-fog-2 transition hover:bg-white/10 hover:text-fog"
          >
            Products
          </a>
          <a
            href="#studio"
            className="hidden rounded-full px-3.5 py-1.5 text-fog-2 transition hover:bg-white/10 hover:text-fog sm:inline"
          >
            Studio
          </a>
          <a
            href="https://github.com/parsecph"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-fog px-3.5 py-1.5 font-medium text-ink transition hover:bg-white"
          >
            <GitHubMark className="size-4" />
            GitHub
            <ArrowUpRight className="size-3.5 opacity-60" />
          </a>
        </nav>
      </div>
    </header>
  );
}
