/** Shared Mark 3.2 UI class tokens — use across all live routes for visual consistency. */
export const mark32Ui = {
  pageBg: "bg-[#f7f8ff] text-slate-950",
  publicMain: "min-h-screen bg-[#f7f8ff] text-slate-950",
  contentWrap: "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8",
  card: "rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6",
  cardMuted: "rounded-3xl border border-violet-100 bg-violet-50/40 p-5 shadow-sm sm:p-6",
  cardHover:
    "rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md",
  statCard: "rounded-2xl border border-violet-100 bg-white p-4 shadow-sm",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700",
  eyebrowSm: "text-xs font-semibold uppercase tracking-[0.2em] text-violet-700",
  heading: "text-2xl font-black tracking-tight text-slate-950 sm:text-3xl",
  body: "text-sm leading-6 text-slate-600 sm:text-base",
  primaryBtn:
    "inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200/50 hover:bg-violet-700",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-900 hover:bg-violet-50",
  linkAccent: "text-sm font-bold text-violet-700 hover:text-violet-900",
  divider: "border-b border-violet-100 pb-6",
} as const;
