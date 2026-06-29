/** Mark 3.2 — The Switch Platform brand tokens (purple sidebar + Study Atelier accents). */
export const MOCK_IDEA_BRAND = {
  name: "THE SWITCH PLATFORM",
  shortName: "The Switch Platform",
  tagline: "Unlock Potential. Build Confidence. Achieve More.",
  logoGlyph: "⚡",
  subtitle: "GCSE Revision · Timed Practice · Progress · Exam Ready.",
  purple: {
    sidebar: "#12005f",
    primary: "#4B3FE8",
    primaryDark: "#3730C4",
    deep: "#140062",
    surface: "#f7f8ff",
  },
} as const;

/** MVP accessibility colour schemes — signposting only until learner chooses in /accessibility. */
export const SEND_COLOUR_CHIPS = [
  {
    id: "cream",
    label: "Cream overlay",
    swatch: "#f6f0dc",
    className: "border-amber-200/80 bg-[#f6f0dc] text-amber-950",
    href: "/accessibility",
  },
  {
    id: "blue",
    label: "Blue overlay",
    swatch: "#eaf4ff",
    className: "border-sky-300/80 bg-[#eaf4ff] text-sky-950",
    href: "/accessibility",
  },
  {
    id: "yellow",
    label: "Yellow overlay",
    swatch: "#fff8c4",
    className: "border-yellow-300/80 bg-[#fff8c4] text-yellow-950",
    href: "/accessibility",
  },
  {
    id: "high-contrast",
    label: "High contrast",
    swatch: "#000000",
    className: "border-stone-600 bg-black text-white",
    href: "/accessibility",
  },
] as const;

export type NavAccent = "violet" | "emerald" | "amber" | "sky" | "rose" | "teal";

export const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", short: "⌂", accent: "violet" as const },
  { href: "/subjects", label: "Subjects", short: "▦", accent: "violet" as const },
  { href: "/subjects", label: "Learn", short: "📖", accent: "sky" as const, navKey: "learn" },
  { href: "/assessments", label: "Practice", short: "✎", accent: "emerald" as const },
  { href: "/exams", label: "Exams", short: "◷", accent: "violet" as const },
  { href: "/progress", label: "Progress", short: "▥", accent: "sky" as const },
  { href: "/progress", label: "Planner", short: "📅", accent: "amber" as const, navKey: "planner" },
  { href: "/progress", label: "Power Grid", short: "⚡", accent: "violet" as const, navKey: "power-grid" },
  { href: "/support", label: "Support", short: "?", accent: "rose" as const },
] as const;

export const MOBILE_NAV_ITEMS = [
  STUDENT_NAV_ITEMS[0],
  STUDENT_NAV_ITEMS[2],
  STUDENT_NAV_ITEMS[3],
  STUDENT_NAV_ITEMS[4],
  STUDENT_NAV_ITEMS[5],
] as const;

export const MARKETING_NAV = [
  { href: "/dashboard", label: "For Students", primary: true },
  { href: "/how-it-works", label: "Resources", primary: false },
  { href: "/support", label: "For Parents", primary: false },
  { href: "/admin", label: "For Schools", primary: false },
] as const;

export function isNavItemActive(
  pathname: string,
  item: (typeof STUDENT_NAV_ITEMS)[number],
): boolean {
  if (item.href === "/subjects" && item.label === "Learn") {
    return pathname === "/subjects" || pathname.startsWith("/subjects/");
  }

  if (item.href === "/progress") {
    return pathname === "/progress" || pathname.startsWith("/progress/");
  }

  if (item.href === "/subjects" && item.label === "Subjects") {
    return pathname === "/subjects";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function navAccentClasses(accent: NavAccent, active: boolean): string {
  if (!active) {
    return "text-violet-100 hover:bg-white/10 hover:text-white";
  }

  return "bg-white text-violet-700 shadow-lg";
}

export function badgeAccentClasses(accent: NavAccent): string {
  const map: Record<NavAccent, string> = {
    violet: "bg-violet-600 text-white",
    teal: "bg-violet-600 text-white",
    emerald: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
    sky: "bg-sky-600 text-white",
    rose: "bg-rose-600 text-white",
  };

  return map[accent];
}
