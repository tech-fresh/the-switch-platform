import Link from "next/link";

import type { DashboardFocusCard } from "@/modules/dashboard/types";

function getToneRingClass(tone: DashboardFocusCard["tone"]): string {
  switch (tone) {
    case "emerald":
      return "border-emerald-200 text-emerald-900";
    case "amber":
      return "border-amber-200 text-amber-900";
    case "sky":
      return "border-sky-200 text-sky-900";
    case "rose":
      return "border-rose-200 text-rose-900";
    default:
      return "border-[#2D7A72]/25 text-[#134E4A]";
  }
}

function getToneBarClass(tone: DashboardFocusCard["tone"]): string {
  switch (tone) {
    case "emerald":
      return "bg-emerald-600";
    case "amber":
      return "bg-amber-500";
    case "sky":
      return "bg-sky-600";
    case "rose":
      return "bg-rose-600";
    default:
      return "bg-[#0F766E]";
  }
}

interface Mark32SubjectGridProps {
  subjects: DashboardFocusCard[];
}

export function Mark32SubjectGrid({ subjects }: Mark32SubjectGridProps) {
  if (!subjects.length) {
    return (
      <article className="rounded-3xl border border-[#D7D0C7] bg-[#FCFBF8] p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Your subjects</p>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Complete onboarding or start practice to populate subject progress cards.
        </p>
        <Link href="/subjects" className="mt-4 inline-flex rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B5F59]">
          Open subjects
        </Link>
      </article>
    );
  }

  return (
    <section aria-label="Your subjects">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Your subjects</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Progress across your GCSE setup</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.slice(0, 3).map((subject) => {
          const href = subject.subjectId
            ? `/subjects?subjectId=${encodeURIComponent(subject.subjectId)}`
            : "/subjects";

          return (
            <Link
              key={subject.subject}
              href={href}
              className="rounded-3xl border border-[#D7D0C7] bg-[#FCFBF8] p-5 shadow-sm transition hover:border-[#2D7A72]/35 hover:bg-stone-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">{subject.subject}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {subject.level}
                  </p>
                </div>
                <div
                  className={`grid size-16 shrink-0 place-items-center rounded-full border-[6px] bg-white text-sm font-semibold ${getToneRingClass(subject.tone)}`}
                >
                  {subject.readinessScore}%
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${getToneBarClass(subject.tone)}`}
                  style={{ width: `${subject.readinessScore}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{subject.recommendedFocus}</p>
              <p className="mt-3 text-sm font-semibold text-[#0F766E]">Continue</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
