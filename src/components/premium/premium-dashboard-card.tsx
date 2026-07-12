import type { ReactNode } from "react";

import { premiumUi } from "@/components/premium/premium-ui";

interface PremiumDashboardCardProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  accent?: "teal" | "blue" | "green" | "amber";
  className?: string;
}

const ACCENT_EYEBROW: Record<NonNullable<PremiumDashboardCardProps["accent"]>, string> = {
  teal: "text-[#0f766e]",
  blue: "text-[#0f766e]",
  green: "text-[#3f7d5c]",
  amber: "text-[#b48a38]",
};

export function PremiumDashboardCard({
  eyebrow,
  title,
  children,
  accent = "teal",
  className = "",
}: PremiumDashboardCardProps) {
  return (
    <article className={`${premiumUi.card} ${className}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${ACCENT_EYEBROW[accent]}`}>{eyebrow}</p>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-[#163038]">{title}</h2>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
