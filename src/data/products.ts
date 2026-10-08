export type Category = "Build" | "APIs" | "AI" | "Makers" | "Life";

export type Accent = "coral" | "sky" | "violet" | "mint" | "gold";

export interface Product {
  id: string;
  name: string;
  url: string;
  host: string;
  /** One line. The whole pitch. */
  tagline: string;
  /** One more sentence, plain words. */
  blurb: string;
  /** Path under /public to the product's own logo (highest-res available). */
  logo: string;
  /** Set when the logo is a full-bleed app icon that should fill its tile. */
  logoBleed?: boolean;
  category: Category;
  accent: Accent;
  featured?: boolean;
}

type ProductInput = Omit<Product, "logo"> & { logo?: string };

const productInputs: ProductInput[] = [
  {
    id: "pageai",
    logoBleed: true,
    name: "Page AI",
    url: "https://pageai.pro",
    host: "pageai.pro",
    tagline: "Say what you want. Get a website.",
    blurb: "One prompt in. A finished site out. Edit anything, then publish.",
    category: "Build",
    accent: "coral",
    featured: true,
  },
  {
    id: "cadscene",
    logoBleed: true,
    name: "CadScene",
    url: "https://cadscene.com",
    host: "cadscene.com",
    tagline: "Your drawing, rendered like a photo.",
    blurb: "A sketch, a prompt or a 3D view in. Photoreal architecture renders out. Minutes, not days.",
    category: "Build",
    accent: "sky",
    featured: true,
  },
  {
    id: "pageui",
    logoBleed: true,
    name: "Page UI",
    url: "https://pageui.dev",
    host: "pageui.dev",
    tagline: "Landing page parts. Copy, paste, launch.",
    blurb: "Free, open source React components for pages that look finished on day one.",
    category: "Build",
    accent: "violet",
  },
  {
    id: "clobbr",
    logoBleed: true,
    name: "Clobbr",
    url: "https://clobbr.app",
    host: "clobbr.app",
    tagline: "See how fast your API really is.",
    blurb: "Load and speed tests from your desktop or the command line.",
    category: "APIs",
    accent: "mint",
  },
  {
    id: "crontap",
    logoBleed: true,
    name: "Crontap",
    url: "https://crontap.com",
    host: "crontap.com",
    tagline: "Call any API on a schedule.",
    blurb: "Set it once. It runs every minute, hour or month. You get notified.",
    category: "APIs",
    accent: "sky",
  },
  {
    id: "hunted",
    logoBleed: true,
    name: "Hunted.space",
    url: "https://hunted.space",
    host: "hunted.space",
    tagline: "Watch Product Hunt launches, live.",
    blurb: "Every launch, every vote, as it happens. Spot what is taking off.",
    category: "Makers",
    accent: "coral",
  },
  {
    id: "morningmakershow",
    name: "Morning Maker Show",
    url: "https://morningmakershow.com",
    host: "morningmakershow.com",
    tagline: "A show for people who make things.",
    blurb: "Honest talks with indie makers. On YouTube and wherever you get podcasts.",
    category: "Makers",
    accent: "gold",
  },
  {
    id: "rarebigdeal",
    logoBleed: true,
    name: "Rare Big Deal",
    url: "https://rarebigdeal.com",
    host: "rarebigdeal.com",
    tagline: "Great software. Rare prices.",
    blurb: "Limited-time deals on Mac, iOS, AI and web apps. No noise, just the good ones.",
    category: "Makers",
    accent: "violet",
  },
  {
    id: "mrrartpro",
    name: "MRR Art Pro",
    url: "https://mrrartpro.com",
    host: "mrrartpro.com",
    tagline: "Turn your numbers into ASCII charts.",
    blurb: "Paste your revenue. Get a chart made of text you can post anywhere.",
    category: "Makers",
    accent: "mint",
  },
  {
    id: "crontool",
    logoBleed: true,
    name: "CronTool",
    url: "https://crontool.cc",
    host: "crontool.cc",
    tagline: "Cron, in plain English.",
    blurb: "Build and check cron expressions. See exactly when they will run.",
    category: "APIs",
    accent: "gold",
  },
  {
    id: "apihustle",
    name: "Apihustle",
    url: "https://apihustle.com",
    host: "apihustle.com",
    tagline: "Your backend, on schedule.",
    blurb: "Schedule it. Monitor it. Load-test it. One account, one small team behind it all.",
    category: "APIs",
    accent: "coral",
  },
  {
    id: "saventify",
    logoBleed: true,
    name: "Saventify",
    url: "https://saventify.com",
    host: "saventify.com",
    tagline: "Wedding invitations that count the guests.",
    blurb: "Beautiful digital invites. RSVPs collected for you, in one place.",
    category: "Life",
    accent: "coral",
  },
  {
    id: "llmboss",
    logoBleed: true,
    name: "LLM Boss",
    url: "https://llm-boss.com",
    host: "llm-boss.com",
    tagline: "Which AI is best? See the numbers.",
    blurb: "Frontier models, side by side, on the benchmarks that matter.",
    category: "AI",
    accent: "violet",
    featured: true,
  },
  {
    id: "ralphloop",
    logoBleed: true,
    name: "Ralph Loop",
    url: "https://ralphloop.sh",
    host: "ralphloop.sh",
    tagline: "An AI that codes while you sleep.",
    blurb: "Give it a goal. It keeps working, for hours or days, until it is done.",
    category: "AI",
    accent: "sky",
    featured: true,
  },
  {
    id: "shipixen",
    name: "Shipixen",
    url: "https://shipixen.com",
    host: "shipixen.com",
    tagline: "A Next.js app, ready in minutes.",
    blurb: "Pick what you need. Download a clean boilerplate. Start building.",
    category: "Build",
    accent: "mint",
    featured: true,
  },
];

export const products: Product[] = productInputs.map((p) => ({
  ...p,
  logo: p.logo ?? `/logos/${p.id}.webp`,
}));

export const categories: { id: Category; label: string; line: string }[] = [
  { id: "Build", label: "Build", line: "Sites, pages and renders." },
  { id: "APIs", label: "APIs", line: "Test, schedule, understand." },
  { id: "AI", label: "AI", line: "Agents and benchmarks." },
  { id: "Makers", label: "Makers", line: "Launches, deals and a show." },
  { id: "Life", label: "Life", line: "Because weddings need RSVPs." },
];

export const accentHex: Record<Accent, string> = {
  coral: "#ee7259",
  sky: "#78d8ff",
  violet: "#a78bfa",
  mint: "#6ee7b7",
  gold: "#fbbf24",
};

export const socials = [
  { label: "GitHub", handle: "parsecph", url: "https://github.com/parsecph" },
  { label: "X", handle: "@shipixen", url: "https://twitter.com/shipixen" },
  { label: "X", handle: "@apihustletools", url: "https://twitter.com/apihustletools" },
  { label: "X", handle: "@clobbrapp", url: "https://twitter.com/clobbrapp" },
  { label: "X", handle: "@crontapp", url: "https://twitter.com/crontapp" },
];
