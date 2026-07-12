import Link from "next/link";

import { MARKETING_NAV } from "@/components/mock-idea/brand-tokens";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { premiumUi } from "@/components/premium/premium-ui";
import { getPublicRouteHref } from "@/lib/public-route";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  const loginHref = isAuthenticated ? "/account" : "/login?reauth=1";
  const primaryHref = isAuthenticated ? "/dashboard" : "/login?reauth=1";
  const loginLabel = isAuthenticated ? "Account" : "Log in";
  const primaryLabel = isAuthenticated ? "Dashboard" : "Start Revising";

  return (
    <header className="sticky top-0 z-20 border-b border-[#ddd3c6] bg-[#fbf7f0]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SwitchBrandLogo href="/" size="md" onDark />

            <div className="flex shrink-0 items-center gap-2 text-sm">
              <Link href="/how-it-works" className="hidden px-3 py-2 font-medium text-[#52646a] hover:text-[#163038] sm:inline">
                How it works
              </Link>
              <Link href={loginHref} className={premiumUi.secondaryBtn}>
                {loginLabel}
              </Link>
              <Link href={primaryHref} className={premiumUi.primaryBtn}>
                {primaryLabel}
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 border-t border-[#e3d8cb] pt-3 md:border-t-0 md:pt-0">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={getPublicRouteHref(item.href, isAuthenticated)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  item.primary
                    ? "border border-[#0f766e]/25 bg-[#0f766e]/10 text-[#0f766e]"
                    : "text-[#52646a] hover:bg-[#f4ede2] hover:text-[#163038]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
