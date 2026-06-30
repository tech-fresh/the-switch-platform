import type { NavAccent } from "@/components/mock-idea/brand-tokens";
import { badgeAccentClasses } from "@/components/mock-idea/brand-tokens";

interface SubjectToneChipProps {
  label: string;
  tone: NavAccent;
}

export function SubjectToneChip({ label, tone }: SubjectToneChipProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center border border-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeAccentClasses(tone)}`}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}

export function subjectToneBlockClasses(tone: NavAccent): string {
  const map: Record<NavAccent, string> = {
    violet: "border-violet-300 bg-violet-50 text-violet-950",
    teal: "border-teal-300 bg-teal-50 text-teal-950",
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-950",
    amber: "border-amber-300 bg-amber-50 text-amber-950",
    sky: "border-sky-300 bg-sky-50 text-sky-950",
    rose: "border-rose-300 bg-rose-50 text-rose-950",
  };

  return map[tone];
}
