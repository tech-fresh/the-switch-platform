/** Stone + Teal Studio UI tokens — calm, editorial revision palette. */
export const premiumUi = {
  pageBg: "bg-[#f4efe6] text-[#163038]",
  publicMain: "min-h-screen bg-[#f4efe6] text-[#163038]",
  shellBg: "bg-[#f4efe6] text-[#163038]",
  sidebarBg: "border-r border-[#d9d0c4] bg-[#fbf7f0]/95 backdrop-blur-xl",
  contentWrap: "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8",
  card: "rounded-2xl border border-[#ddd3c6] bg-white p-5 shadow-[0_22px_60px_rgba(117,94,66,0.10)] sm:p-6",
  cardHover:
    "rounded-2xl border border-[#ddd3c6] bg-white p-5 shadow-[0_22px_60px_rgba(117,94,66,0.10)] transition hover:border-[#0f766e]/35 hover:shadow-[0_18px_42px_rgba(15,118,110,0.12)] sm:p-6",
  cardMuted: "rounded-2xl border border-[#e6ddd0] bg-[#f7f2ea] p-5 sm:p-6",
  statCard: "rounded-xl border border-[#e3d8cb] bg-[#fffdfa] p-4 shadow-sm",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f7b77]",
  eyebrowAccent: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f766e]",
  heading: "text-2xl font-bold tracking-tight text-[#163038] sm:text-3xl",
  headingHero: "text-4xl font-black tracking-tight text-[#163038] sm:text-5xl lg:text-6xl",
  body: "text-sm leading-7 text-[#52646a] sm:text-base",
  primaryBtn:
    "inline-flex items-center justify-center rounded-2xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_40px_rgba(15,118,110,0.20)] transition hover:bg-[#0b5f59]",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-2xl border border-[#d3c7b9] bg-white px-5 py-3 text-sm font-bold text-[#163038] transition hover:border-[#0f766e]/35 hover:bg-[#f7f2ea]",
  linkAccent: "text-sm font-bold text-[#0f766e] hover:text-[#b48a38]",
  divider: "border-b border-[#dfd5c8] pb-6",
  gradientHero:
    "relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(180,138,56,0.12),_transparent_28%),linear-gradient(180deg,_#fbf7f0,_#efe7da)]",
  progressTrack: "h-2 overflow-hidden rounded-full bg-[#ddd3c6]",
  progressFill: "h-full rounded-full bg-gradient-to-r from-[#0f766e] to-[#b48a38]",
  navActive: "border border-[#0f766e]/25 bg-[#0f766e]/10 text-[#0f766e]",
  navIdle: "text-[#52646a] hover:bg-[#f4ede2] hover:text-[#163038] border border-transparent",
} as const;

export const PREMIUM_SUBJECTS = [
  {
    id: "maths",
    name: "Maths",
    description: "Number, algebra, geometry, and statistics with exam-board matched papers.",
    href: "/subjects?subjectId=gcse-maths",
    icon: "📐",
    accent: "from-[#0f766e] to-[#14b8a6]",
  },
  {
    id: "english",
    name: "English Language",
    description: "Reading, writing, and language skills with clear topic progression.",
    href: "/subjects?subjectId=gcse-english-language",
    icon: "📖",
    accent: "from-[#b48a38] to-[#d97706]",
  },
  {
    id: "science",
    name: "Combined Science",
    description: "Biology, chemistry, and physics in one structured GCSE route.",
    href: "/subjects?subjectId=gcse-combined-science",
    icon: "🔬",
    accent: "from-[#3f7d5c] to-[#16a34a]",
  },
] as const;

export const PREMIUM_PLATFORM_FEATURES = [
  { title: "Exam Mode", detail: "Full GCSE papers with focus mode, timer, and mark-scheme review.", href: "/exams", icon: "📝" },
  { title: "Timed Practice", detail: "Exam-style timing with autosave and access support built in.", href: "/assessments", icon: "⏱️" },
  { title: "Saved Progress", detail: "Pick up exactly where you left off across every study route.", href: "/saved-progress", icon: "💾" },
  { title: "Accessibility", detail: "Read aloud, extra time, overlays, and reader mode persist everywhere.", href: "/accessibility", icon: "🎛️" },
] as const;
