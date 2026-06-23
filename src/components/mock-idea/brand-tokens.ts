/** Mock Idea — Seneca-inspired layout with Switch MVP + SEND colour tokens. */
export const MOCK_IDEA_BRAND = {
  name: "Mock Idea",
  tagline: "Study home · powered by The Switch Platform",
  logoGlyph: "✦",
} as const;

/** MVP accessibility colour schemes used for SEND-friendly signposting chips. */
export const SEND_COLOUR_CHIPS = [
  {
    id: "cream",
    label: "Cream overlay",
    className: "border-amber-200 bg-[#f6f0dc] text-amber-950",
    href: "/accessibility",
  },
  {
    id: "blue",
    label: "Blue overlay",
    className: "border-sky-300 bg-[#eaf4ff] text-sky-950",
    href: "/accessibility",
  },
  {
    id: "yellow",
    label: "Yellow overlay",
    className: "border-yellow-300 bg-[#fff8c4] text-yellow-950",
    href: "/accessibility",
  },
  {
    id: "high-contrast",
    label: "High contrast",
    className: "border-white bg-black text-white",
    href: "/accessibility",
  },
] as const;

export const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "🏠", accent: "sky" as const },
  { href: "/assessments", label: "Practice", icon: "📝", accent: "sky" as const },
  { href: "/progress", label: "Planner", icon: "📅", accent: "sky" as const },
  { href: "/subjects", label: "Subjects", icon: "📚", accent: "violet" as const },
  { href: "/accessibility", label: "Access", icon: "♿", accent: "amber" as const },
  { href: "/support", label: "SEND help", icon: "🧭", accent: "rose" as const },
] as const;
