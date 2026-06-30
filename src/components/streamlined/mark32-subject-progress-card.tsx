import Link from "next/link";

import { mark32Ui } from "@/components/streamlined/mark32-ui";
import { SubjectToneChip, subjectToneBlockClasses } from "@/components/subject-tone-chip";
import { resolveCatalogSubjectByLabel, resolveSubjectToneById, resolveSubjectToneByLabel } from "@/lib/subjects/tone";
import type { PowerGridSubjectProgress, PowerGridTrend } from "@/modules/power-grid/types";

interface Mark32SubjectProgressCardProps {
  subject: PowerGridSubjectProgress;
}

function getTrendTone(trend: PowerGridTrend): string {
  if (trend === "improving") {
    return "text-emerald-700";
  }

  if (trend === "stable") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

function ProgressBar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const width = Math.max(4, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs text-stone-600">
        <span>{label}</span>
        <span className="font-semibold text-stone-950">
          {value}
          {max === 100 ? "%" : ` / ${max}`}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function Mark32SubjectProgressCard({ subject }: Mark32SubjectProgressCardProps) {
  const catalogSubject = subject.subjectId
    ? { subjectId: subject.subjectId, name: subject.subject }
    : resolveCatalogSubjectByLabel(subject.subject);
  const tone = catalogSubject?.subjectId
    ? resolveSubjectToneById(catalogSubject.subjectId)
    : resolveSubjectToneByLabel(subject.subject);

  return (
    <article className={`${mark32Ui.cardHover} flex flex-col gap-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <SubjectToneChip label={subject.subject} tone={tone} />
            <span
              className={`border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${subjectToneBlockClasses(tone)}`}
            >
              {subject.level}
            </span>
          </div>
          <p className={`text-sm font-medium capitalize ${getTrendTone(subject.trend)}`}>{subject.trend}</p>
        </div>
        <p className="max-w-xs text-right text-sm leading-6 text-stone-600">{subject.recommendedFocus}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProgressBar label="Readiness" value={subject.readinessScore} />
        <ProgressBar label="Completion" value={subject.completionScore} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
          {subject.activeSessionCount} active · {subject.completedSessionCount} completed
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={subject.subjectHref ?? "/subjects"} className={mark32Ui.primaryBtn}>
            Continue subject
          </Link>
          {subject.resumeHref ? (
            <Link href={subject.resumeHref} className={mark32Ui.secondaryBtn}>
              Resume
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
