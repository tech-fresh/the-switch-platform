/** Mock Idea — creative Study Atelier direction on The Switch Platform (not Seneca). */
export const MOCK_IDEA_BRAND = {
  name: "Mock Idea",
  tagline: "Study Atelier · powered by The Switch Platform",
  logoGlyph: "◆",
  creativeNote:
    "Bento layouts, stone/teal palette, top study rail — deliberately not a narrow icon sidebar clone.",
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

export type NavAccent = "teal" | "emerald" | "amber" | "sky" | "rose";

export const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", short: "H", accent: "teal" as const },
  { href: "/assessments", label: "Practice", short: "P", accent: "emerald" as const },
  { href: "/progress", label: "Planner", short: "L", accent: "sky" as const },
  { href: "/subjects", label: "Subjects", short: "S", accent: "amber" as const },
  { href: "/accessibility", label: "Access", short: "A", accent: "rose" as const },
  { href: "/support", label: "SEND help", short: "+", accent: "rose" as const },
] as const;

export const MARKETING_NAV = [
  { href: "/dashboard", label: "For Students", primary: true },
  { href: "/how-it-works", label: "Resources", primary: false },
  { href: "/support", label: "For Parents", primary: false },
  { href: "/admin", label: "For Schools", primary: false },
] as const;

export function navAccentClasses(accent: NavAccent, active: boolean): string {
  if (!active) {
    return "border-transparent text-stone-600 hover:border-stone-200 hover:bg-white/90 hover:text-stone-900";
  }

  const map: Record<NavAccent, string> = {
    teal: "border-teal-300 bg-teal-50 text-teal-900 shadow-sm shadow-teal-100/80",
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-100/80",
    amber: "border-amber-300 bg-amber-50 text-amber-950 shadow-sm shadow-amber-100/80",
    sky: "border-sky-300 bg-sky-50 text-sky-900 shadow-sm shadow-sky-100/80",
    rose: "border-rose-300 bg-rose-50 text-rose-900 shadow-sm shadow-rose-100/80",
  };

  return map[accent];
}

export function badgeAccentClasses(accent: NavAccent): string {
  const map: Record<NavAccent, string> = {
    teal: "bg-teal-700 text-white",
    emerald: "bg-emerald-700 text-white",
    amber: "bg-amber-600 text-white",
    sky: "bg-sky-700 text-white",
    rose: "bg-rose-700 text-white",
  };

  return map[accent];
}
