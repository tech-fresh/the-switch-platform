import Link from "next/link";

interface ColourChip {
  label: string;
  value: string;
}

interface ColourwaySample {
  id: string;
  title: string;
  mood: string;
  summary: string;
  surfaceClass: string;
  panelClass: string;
  heroClass: string;
  headingClass: string;
  bodyClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  navActiveClass: string;
  navIdleClass: string;
  cardClass: string;
  cardAccentClass: string;
  chips: ColourChip[];
}

const colourwaySamples: ColourwaySample[] = [
  {
    id: "midnight-signal",
    title: "Midnight Signal",
    mood: "Premium, focused, current live direction",
    summary:
      "Deep navy with electric violet and bright blue. Strongest fit if we want the current Power Grid energy to stay front and centre.",
    surfaceClass: "bg-[#08111f] text-white",
    panelClass: "border border-white/10 bg-[#0f1a2b]/95 shadow-[0_30px_80px_rgba(2,6,23,0.45)]",
    heroClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(107,78,255,0.42),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(0,191,255,0.22),_transparent_34%),linear-gradient(180deg,_#08111f,_#111c30)]",
    headingClass: "text-white",
    bodyClass: "text-slate-300",
    primaryButtonClass:
      "bg-gradient-to-r from-[#6C4EFF] to-[#00BFFF] text-white shadow-[0_18px_45px_rgba(108,78,255,0.35)]",
    secondaryButtonClass: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    navActiveClass: "border border-[#6C4EFF]/40 bg-[#6C4EFF]/18 text-white",
    navIdleClass: "border border-transparent bg-white/0 text-slate-300",
    cardClass: "border border-white/10 bg-[#121d31] text-white",
    cardAccentClass: "bg-[#6C4EFF]",
    chips: [
      { label: "Base", value: "#08111F" },
      { label: "Panel", value: "#121D31" },
      { label: "Primary", value: "#6C4EFF" },
      { label: "Accent", value: "#00BFFF" },
    ],
  },
  {
    id: "stone-teal-studio",
    title: "Stone + Teal Studio",
    mood: "Calm, editorial, trustworthy",
    summary:
      "Warm stone surfaces with deep teal actions. Best fit if we want the homepage to feel more premium-study and less app-store neon.",
    surfaceClass: "bg-[#f4efe6] text-[#163038]",
    panelClass: "border border-[#d7cec0] bg-[#fbf7f0] shadow-[0_24px_70px_rgba(117,94,66,0.12)]",
    heroClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,_#fbf7f0,_#efe7da)]",
    headingClass: "text-[#163038]",
    bodyClass: "text-[#52646a]",
    primaryButtonClass:
      "bg-[#0f766e] text-white shadow-[0_16px_40px_rgba(15,118,110,0.22)]",
    secondaryButtonClass: "border border-[#c9beb0] bg-white text-[#163038] hover:bg-[#f7f2ea]",
    navActiveClass: "border border-[#0f766e]/25 bg-[#0f766e]/10 text-[#0f766e]",
    navIdleClass: "border border-transparent bg-transparent text-[#52646a]",
    cardClass: "border border-[#ded5c7] bg-white text-[#163038]",
    cardAccentClass: "bg-[#0f766e]",
    chips: [
      { label: "Base", value: "#F4EFE6" },
      { label: "Panel", value: "#FBF7F0" },
      { label: "Primary", value: "#0F766E" },
      { label: "Accent", value: "#F59E0B" },
    ],
  },
  {
    id: "ember-graphite",
    title: "Ember Graphite",
    mood: "Bold, sporty, exam-pressure energy",
    summary:
      "Charcoal graphite with ember coral and soft apricot. This one feels sharper and more high-performance for revision sprints and exam mode.",
    surfaceClass: "bg-[#151312] text-[#fff7f3]",
    panelClass: "border border-white/10 bg-[#201b19] shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
    heroClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.30),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.18),_transparent_30%),linear-gradient(180deg,_#151312,_#241d1a)]",
    headingClass: "text-[#fff7f3]",
    bodyClass: "text-[#d8c3bb]",
    primaryButtonClass:
      "bg-gradient-to-r from-[#ea580c] to-[#fb923c] text-white shadow-[0_16px_40px_rgba(234,88,12,0.28)]",
    secondaryButtonClass: "border border-white/12 bg-white/5 text-[#fff7f3] hover:bg-white/10",
    navActiveClass: "border border-[#fb923c]/30 bg-[#fb923c]/12 text-[#fff7f3]",
    navIdleClass: "border border-transparent bg-transparent text-[#d8c3bb]",
    cardClass: "border border-white/10 bg-[#241d1a] text-[#fff7f3]",
    cardAccentClass: "bg-[#fb923c]",
    chips: [
      { label: "Base", value: "#151312" },
      { label: "Panel", value: "#241D1A" },
      { label: "Primary", value: "#EA580C" },
      { label: "Accent", value: "#FB923C" },
    ],
  },
  {
    id: "forest-paper",
    title: "Forest Paper",
    mood: "Academic, mature, quietly confident",
    summary:
      "Soft paper tones with evergreen and brass. Best suited if we want to lean into trust, progress, and a more bookish revision aesthetic.",
    surfaceClass: "bg-[#eef1e7] text-[#1e312a]",
    panelClass: "border border-[#d5dccf] bg-[#f7f8f3] shadow-[0_22px_60px_rgba(47,69,55,0.10)]",
    heroClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(22,101,52,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(180,138,56,0.14),_transparent_28%),linear-gradient(180deg,_#f7f8f3,_#e8ecdf)]",
    headingClass: "text-[#1e312a]",
    bodyClass: "text-[#5f7167]",
    primaryButtonClass:
      "bg-[#166534] text-white shadow-[0_14px_36px_rgba(22,101,52,0.22)]",
    secondaryButtonClass: "border border-[#ccd5c7] bg-white text-[#1e312a] hover:bg-[#f2f5ed]",
    navActiveClass: "border border-[#166534]/25 bg-[#166534]/10 text-[#166534]",
    navIdleClass: "border border-transparent bg-transparent text-[#5f7167]",
    cardClass: "border border-[#d5dccf] bg-white text-[#1e312a]",
    cardAccentClass: "bg-[#b48a38]",
    chips: [
      { label: "Base", value: "#EEF1E7" },
      { label: "Panel", value: "#F7F8F3" },
      { label: "Primary", value: "#166534" },
      { label: "Accent", value: "#B48A38" },
    ],
  },
];

const sampleStats = [
  { label: "Students onboarded", value: "12.4k" },
  { label: "Average weekly streak", value: "4.8 days" },
  { label: "Exam papers completed", value: "38k" },
] as const;

const sampleCards = [
  {
    eyebrow: "Mission control",
    title: "Continue algebra revision",
    body: "Resume a saved GCSE Maths session with weak-topic guidance and the next best quiz ready.",
  },
  {
    eyebrow: "Power Grid",
    title: "Power Mode rank unlocked",
    body: "Show XP, readiness, and the next milestone in a way that still feels premium, not game-cluttered.",
  },
  {
    eyebrow: "Exam readiness",
    title: "AQA Paper 1 this week",
    body: "Highlight the next paper, timing, and the one key action without turning the page into a dashboard wall.",
  },
] as const;

function ColourChipSwatch({ chip }: { chip: ColourChip }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-3 backdrop-blur-sm">
      <div className="h-14 rounded-xl border border-black/10" style={{ backgroundColor: chip.value }} />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-current/60">{chip.label}</p>
      <p className="mt-1 text-sm font-semibold">{chip.value}</p>
    </div>
  );
}

function ColourwayCard({ sample }: { sample: ColourwaySample }) {
  return (
    <section className={`rounded-[2rem] p-3 ${sample.surfaceClass}`}>
      <div className={`overflow-hidden rounded-[1.6rem] ${sample.panelClass}`}>
        <div className={`p-6 sm:p-8 ${sample.heroClass}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-current/60">{sample.mood}</p>
              <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${sample.headingClass}`}>
                {sample.title}
              </h2>
              <p className={`mt-3 max-w-2xl text-sm leading-7 sm:text-base ${sample.bodyClass}`}>{sample.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/login?reauth=1"
                className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition ${sample.primaryButtonClass}`}
              >
                Start learning free
              </Link>
              <Link
                href="/how-it-works"
                className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition ${sample.secondaryButtonClass}`}
              >
                See journey
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Dashboard", "Subjects", "Exams", "Progress", "Profile"].map((item, index) => (
              <div
                key={`${sample.id}-${item}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0 ? sample.navActiveClass : sample.navIdleClass
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
            <div className={`rounded-[1.5rem] p-5 ${sample.cardClass}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-current/60">Homepage hero</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Switch On Your GCSE Revision</h3>
              <p className={`mt-3 max-w-xl text-sm leading-7 ${sample.bodyClass}`}>
                The same structure, copy hierarchy, and CTA logic can hold across multiple directions. What changes
                here is the tone: sharper, calmer, warmer, or more academic.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {sampleStats.map((stat) => (
                  <div key={`${sample.id}-${stat.label}`} className="rounded-2xl border border-current/10 bg-black/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-current/55">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[1.5rem] p-5 ${sample.cardClass}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-current/60">Palette</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {sample.chips.map((chip) => (
                  <ColourChipSwatch key={`${sample.id}-${chip.label}`} chip={chip} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
          {sampleCards.map((card) => (
            <article key={`${sample.id}-${card.title}`} className={`rounded-[1.4rem] p-5 ${sample.cardClass}`}>
              <div className={`h-1.5 w-16 rounded-full ${sample.cardAccentClass}`} />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-current/60">
                {card.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">{card.title}</h3>
              <p className={`mt-3 text-sm leading-7 ${sample.bodyClass}`}>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WebsiteColourwaysShowcase() {
  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-700">Website colour studies</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Colour-way samples for The Switch
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
          Same product structure, four different visual directions. These are meant to help us choose the mood for the
          public website and signed-in shell before we harden more tokens across the live routes.
        </p>
      </section>

      {colourwaySamples.map((sample) => (
        <ColourwayCard key={sample.id} sample={sample} />
      ))}
    </div>
  );
}
