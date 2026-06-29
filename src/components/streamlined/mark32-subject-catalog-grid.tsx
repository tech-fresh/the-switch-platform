import Link from "next/link";

import type { Subject } from "@/modules/subjects/types";
import { resolveSubjectToneById } from "@/lib/subjects/tone";

function getToneRingClass(tone: ReturnType<typeof resolveSubjectToneById>): string {
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
      return "border-violet-200 text-violet-900";
  }
}

function getToneBarClass(tone: ReturnType<typeof resolveSubjectToneById>): string {
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
      return "bg-violet-700";
  }
}

interface Mark32SubjectCatalogGridProps {
  subjects: Subject[];
  selectedSubjectId?: string;
  onboardingSubjectIds?: string[];
}

export function Mark32SubjectCatalogGrid({
  subjects,
  selectedSubjectId,
  onboardingSubjectIds = [],
}: Mark32SubjectCatalogGridProps) {
  if (!subjects.length) {
    return null;
  }

  return (
    <section aria-label="Subject catalog">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Your subjects</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">Pick a subject to revise</h2>
        </div>
        <p className="text-sm text-stone-600">{subjects.length} enrolled</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const tone = resolveSubjectToneById(subject.subjectId);
          const isSelected = subject.subjectId === selectedSubjectId;
          const isOnboarding = onboardingSubjectIds.includes(subject.subjectId);
          const href = `/subjects?subjectId=${encodeURIComponent(subject.subjectId)}`;

          return (
            <Link
              key={subject.subjectId}
              href={href}
              className={`border bg-white p-5 shadow-sm transition hover:border-violet-400 hover:bg-stone-50 ${
                isSelected ? "border-violet-600 ring-2 ring-violet-100" : "border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-stone-950">{subject.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {subject.qualificationType} · {subject.topicCount} topics
                  </p>
                  {isOnboarding ? (
                    <span className="mt-2 inline-flex bg-violet-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">
                      Your subject
                    </span>
                  ) : null}
                </div>
                <div
                  className={`grid size-16 shrink-0 place-items-center rounded-full border-[6px] bg-white text-sm font-semibold ${getToneRingClass(tone)}`}
                >
                  {subject.examReadinessScore}%
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${getToneBarClass(tone)}`}
                  style={{ width: `${subject.examReadinessScore}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">Next: {subject.nextTopicToRevise}</p>
              <p className="mt-3 text-sm font-semibold text-violet-600">Study</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
