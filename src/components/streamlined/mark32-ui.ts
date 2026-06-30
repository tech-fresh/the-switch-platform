/** Shared Mark 3.2 UI class tokens — use across all live routes for visual consistency. */
export const mark32Ui = {
  pageBg: "bg-stone-100 text-slate-950",
  publicMain: "min-h-screen bg-stone-100 text-slate-950",
  contentWrap: "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8",
  card: "rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6",
  cardMuted: "rounded-3xl border border-stone-200 bg-stone-50/80 p-5 shadow-sm sm:p-6",
  cardHover:
    "rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md",
  statCard: "rounded-2xl border border-stone-200 bg-white p-4 shadow-sm",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700",
  eyebrowSm: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-700",
  heading: "text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl",
  body: "text-sm leading-6 text-slate-600 sm:text-base",
  primaryBtn:
    "inline-flex items-center justify-center rounded-2xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-900",
  secondaryBtn:
    "inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-900 hover:border-sky-300 hover:bg-sky-50",
  linkAccent: "text-sm font-bold text-teal-800 hover:text-teal-950",
  divider: "border-b border-stone-200 pb-6",
} as const;
