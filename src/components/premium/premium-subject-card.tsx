import Link from "next/link";

import { premiumUi } from "@/components/premium/premium-ui";
import { getPublicRouteHref } from "@/lib/public-route";

interface PremiumSubjectCardProps {
  name: string;
  description: string;
  href: string;
  icon: string;
  accent: string;
  isAuthenticated?: boolean;
}

export function PremiumSubjectCard({
  name,
  description,
  href,
  icon,
  accent,
  isAuthenticated = false,
}: PremiumSubjectCardProps) {
  return (
    <Link href={getPublicRouteHref(href, isAuthenticated)} className={`group block ${premiumUi.cardHover}`}>
      <div
        className={`inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-2xl shadow-lg`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight text-white group-hover:text-[#00BFFF]">{name}</h3>
      <p className={`mt-2 ${premiumUi.body}`}>{description}</p>
      <p className="mt-5 text-sm font-bold text-[#6C4EFF] group-hover:text-[#00BFFF]">Explore subject →</p>
    </Link>
  );
}
