import type { ReactNode } from "react";

import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface Mark32StatItem {
  label: string;
  value: string;
  detail?: string;
}

interface Mark32PageHeaderProps {
  eyebrow: string;
  eyebrowTone?: "violet" | "sky" | "emerald" | "amber" | "rose";
  title: string;
  description?: string;
  stats?: Mark32StatItem[];
  aside?: ReactNode;
}

function getEyebrowClass(tone: Mark32PageHeaderProps["eyebrowTone"]): string {
  switch (tone) {
    case "sky":
      return "text-sky-700";
    case "emerald":
      return "text-emerald-700";
    case "amber":
      return "text-amber-700";
    case "rose":
      return "text-rose-700";
    default:
      return "text-violet-700";
  }
}

export function Mark32StatCard({ label, value, detail }: Mark32StatItem) {
  return (
    <div className={mark32Ui.statCard}>
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-950">{value}</p>
      {detail ? <p className="mt-1 text-sm text-stone-600">{detail}</p> : null}
    </div>
  );
}

export function Mark32PageHeader({
  eyebrow,
  eyebrowTone = "violet",
  title,
  description,
  stats,
  aside,
}: Mark32PageHeaderProps) {
  return (
    <section className={`grid gap-5 lg:grid-cols-[1.4fr_0.9fr] ${mark32Ui.divider}`}>
      <div className="space-y-4">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${getEyebrowClass(eyebrowTone)}`}>
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{description}</p>
          ) : null}
        </div>
      </div>

      {aside ? (
        <div>{aside}</div>
      ) : stats?.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {stats.map((stat) => (
            <Mark32StatCard key={stat.label} {...stat} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
