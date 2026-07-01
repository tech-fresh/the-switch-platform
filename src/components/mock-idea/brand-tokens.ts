/** Mark 3.2 — The Switch Platform brand tokens (Study Atelier light-mode accents). */
export const MOCK_IDEA_BRAND = {
  name: "THE SWITCH PLATFORM",
  shortName: "The Switch Platform",
  tagline: "Unlock Potential. Build Confidence. Achieve More.",
  logoSrc: "/brand/the-switch-logo.png",
  /** @deprecated Use SwitchBrandLogo — kept for legacy mock previews only. */
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
  { href: "/dashboard", label: "Dashboard", short: "⌂", accent: "teal" as const },
  { href: "/subjects", label: "Subjects", short: "▦", accent: "violet" as const },
  { href: "/exams", label: "Exams", short: "◷", accent: "violet" as const },
  { href: "/progress", label: "Progress", short: "▥", accent: "sky" as const },
  { href: "/account", label: "Profile", short: "◌", accent: "amber" as const },
] as const;

export const MOBILE_NAV_ITEMS = [
  STUDENT_NAV_ITEMS[0],
  STUDENT_NAV_ITEMS[1],
  STUDENT_NAV_ITEMS[2],
  STUDENT_NAV_ITEMS[3],
  STUDENT_NAV_ITEMS[4],
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
  if (item.href === "/progress") {
    return pathname === "/progress" || pathname.startsWith("/progress/");
  }

  if (item.href === "/subjects") {
    return pathname === "/subjects";
  }

  if (item.href === "/account") {
    return pathname === "/account" || pathname.startsWith("/account/");
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function navAccentClasses(accent: NavAccent, active: boolean): string {
  if (!active) {
    return "border border-transparent text-stone-600 hover:border-stone-300 hover:bg-white hover:text-stone-950";
  }

  const activeMap: Record<NavAccent, string> = {
    violet: "border-violet-200 bg-violet-50 text-violet-900 shadow-sm",
    teal: "border-teal-200 bg-teal-50 text-teal-900 shadow-sm",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm",
    amber: "border-amber-200 bg-amber-50 text-amber-900 shadow-sm",
    sky: "border-sky-200 bg-sky-50 text-sky-900 shadow-sm",
    rose: "border-rose-200 bg-rose-50 text-rose-900 shadow-sm",
  };

  return activeMap[accent];
}

export function badgeAccentClasses(accent: NavAccent): string {
  const map: Record<NavAccent, string> = {
    violet: "bg-violet-600 text-white",
    teal: "bg-teal-800 text-white",
    emerald: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
    sky: "bg-sky-600 text-white",
    rose: "bg-rose-600 text-white",
  };

  return map[accent];
}
