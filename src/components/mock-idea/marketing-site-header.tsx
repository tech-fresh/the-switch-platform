import Link from "next/link";

import { MARKETING_NAV } from "@/components/mock-idea/brand-tokens";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { premiumUi } from "@/components/premium/premium-ui";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  const loginHref = isAuthenticated ? "/account" : "/login?reauth=1";
  const primaryHref = isAuthenticated ? "/dashboard" : "/login?reauth=1";
  const loginLabel = isAuthenticated ? "Account" : "Log in";
  const primaryLabel = isAuthenticated ? "Dashboard" : "Start Revising";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0F17]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SwitchBrandLogo href="/" size="md" onDark />

            <div className="flex shrink-0 items-center gap-2 text-sm">
              <Link href="/how-it-works" className="hidden px-3 py-2 font-medium text-[#9CA3AF] hover:text-white sm:inline">
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

          <nav className="flex flex-wrap items-center gap-1 border-t border-white/10 pt-3 md:border-t-0 md:pt-0">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  item.primary
                    ? "border border-[#6C4EFF]/40 bg-[#6C4EFF]/15 text-white"
                    : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
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
