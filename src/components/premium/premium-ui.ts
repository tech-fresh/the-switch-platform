/** Premium dark UI tokens — Stripe / Linear inspired GCSE revision platform. */
export const premiumUi = {
  pageBg: "bg-[#0B0F17] text-white",
  publicMain: "min-h-screen bg-[#0B0F17] text-white",
  shellBg: "bg-[#0B0F17] text-white",
  sidebarBg: "border-r border-white/10 bg-[#0B0F17]/95 backdrop-blur-xl",
  contentWrap: "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8",
  card: "rounded-2xl border border-white/10 bg-[#121826] p-5 shadow-lg shadow-black/25 sm:p-6",
  cardHover:
    "rounded-2xl border border-white/10 bg-[#121826] p-5 shadow-lg shadow-black/25 transition hover:border-[#6C4EFF]/40 hover:shadow-[#6C4EFF]/10 sm:p-6",
  cardMuted: "rounded-2xl border border-white/5 bg-[#0F1420] p-5 sm:p-6",
  statCard: "rounded-xl border border-white/10 bg-[#121826] p-4 shadow-md",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9CA3AF]",
  eyebrowAccent: "text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6C4EFF]",
  heading: "text-2xl font-bold tracking-tight text-white sm:text-3xl",
  headingHero: "text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl",
  body: "text-sm leading-7 text-[#9CA3AF] sm:text-base",
  primaryBtn:
    "inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#6C4EFF] to-[#5B3FE8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#6C4EFF]/25 transition hover:opacity-90",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-[#00BFFF]/40 hover:bg-white/10",
  linkAccent: "text-sm font-bold text-[#00BFFF] hover:text-[#6C4EFF]",
  divider: "border-b border-white/10 pb-6",
  gradientHero:
    "relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(108,78,255,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(0,191,255,0.2),_transparent_35%),linear-gradient(180deg,_#0B0F17,_#121826)]",
  progressTrack: "h-2 overflow-hidden rounded-full bg-white/10",
  progressFill: "h-full rounded-full bg-gradient-to-r from-[#6C4EFF] to-[#00BFFF]",
  navActive: "bg-[#6C4EFF]/20 text-white border border-[#6C4EFF]/40",
  navIdle: "text-[#9CA3AF] hover:bg-white/5 hover:text-white border border-transparent",
} as const;

export const PREMIUM_SUBJECTS = [
  {
    id: "maths",
    name: "Maths",
    description: "Number, algebra, geometry, and statistics with exam-board matched papers.",
    href: "/subjects?subjectId=gcse-maths",
    icon: "📐",
    accent: "from-[#6C4EFF] to-[#00BFFF]",
  },
  {
    id: "english",
    name: "English Language",
    description: "Reading, writing, and language skills with clear topic progression.",
    href: "/subjects?subjectId=gcse-english-language",
    icon: "📖",
    accent: "from-[#F59E0B] to-[#EF4444]",
  },
  {
    id: "science",
    name: "Combined Science",
    description: "Biology, chemistry, and physics in one structured GCSE route.",
    href: "/subjects?subjectId=gcse-combined-science",
    icon: "🔬",
    accent: "from-[#22C55E] to-[#00BFFF]",
  },
] as const;

export const PREMIUM_PLATFORM_FEATURES = [
  { title: "Exam Mode", detail: "Full GCSE papers with focus mode, timer, and mark-scheme review.", href: "/exams", icon: "📝" },
  { title: "Timed Practice", detail: "Exam-style timing with autosave and access support built in.", href: "/assessments", icon: "⏱️" },
  { title: "Saved Progress", detail: "Pick up exactly where you left off across every study route.", href: "/saved-progress", icon: "💾" },
  { title: "Accessibility", detail: "Read aloud, extra time, overlays, and reader mode persist everywhere.", href: "/accessibility", icon: "🎛️" },
] as const;
