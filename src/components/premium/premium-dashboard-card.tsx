import type { ReactNode } from "react";

import { premiumUi } from "@/components/premium/premium-ui";

interface PremiumDashboardCardProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  accent?: "purple" | "blue" | "green" | "amber";
  className?: string;
}

const ACCENT_EYEBROW: Record<NonNullable<PremiumDashboardCardProps["accent"]>, string> = {
  purple: "text-[#6C4EFF]",
  blue: "text-[#00BFFF]",
  green: "text-[#22C55E]",
  amber: "text-[#F59E0B]",
};

export function PremiumDashboardCard({
  eyebrow,
  title,
  children,
  accent = "purple",
  className = "",
}: PremiumDashboardCardProps) {
  return (
    <article className={`${premiumUi.card} ${className}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${ACCENT_EYEBROW[accent]}`}>{eyebrow}</p>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-white">{title}</h2>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
