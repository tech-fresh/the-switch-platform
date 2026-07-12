import type { ReactNode } from "react";

import { mark32Ui } from "@/components/streamlined/mark32-ui";
import { premiumUi } from "@/components/premium/premium-ui";

interface Mark32StatItem {
  label: string;
  value: string;
  detail?: string;
}

interface Mark32PageHeaderProps {
  eyebrow: string;
  eyebrowTone?: "teal" | "violet" | "sky" | "emerald" | "amber" | "rose";
  title: string;
  description?: string;
  stats?: Mark32StatItem[];
  aside?: ReactNode;
}

function getEyebrowClass(tone: Mark32PageHeaderProps["eyebrowTone"]): string {
  switch (tone) {
    case "sky":
      return "text-[#2B7FFF]";
    case "emerald":
      return "text-[#0F766E]";
    case "amber":
      return "text-[#F59E0B]";
    case "rose":
      return "text-[#EF4444]";
    case "violet":
      return "text-[#7C5A17]";
    case "teal":
    default:
      return "text-[#0F766E]";
  }
}

export function Mark32StatCard({ label, value, detail }: Mark32StatItem) {
  return (
    <div className={mark32Ui.statCard}>
      <p className={premiumUi.eyebrow}>{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      {detail ? <p className={`mt-1 ${premiumUi.body}`}>{detail}</p> : null}
    </div>
  );
}

export function Mark32PageHeader({
  eyebrow,
  eyebrowTone = "teal",
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
          <h1 className={`max-w-3xl ${premiumUi.heading} sm:text-4xl`}>{title}</h1>
          {description ? <p className={`max-w-2xl ${premiumUi.body}`}>{description}</p> : null}
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
