import Link from "next/link";

import { MARKETING_NAV, MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  const loginHref = isAuthenticated ? "/account" : "/login?reauth=1";
  const primaryHref = isAuthenticated ? "/dashboard" : "/login?reauth=1";
  const loginLabel = isAuthenticated ? "Account" : "Log in";
  const primaryLabel = isAuthenticated ? "Dashboard" : "Sign up";

  return (
    <header className="relative z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-600 via-amber-400 to-emerald-500" />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center bg-stone-950 text-base font-bold text-teal-300">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-stone-950">
                  {MOCK_IDEA_BRAND.name}
                </p>
                <p className="hidden text-[10px] uppercase tracking-[0.24em] text-stone-500 sm:block">
                  Study Atelier mock
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 text-sm">
              <Link
                href="/support"
                className="hidden px-3 py-2 font-medium text-stone-700 hover:text-teal-800 sm:inline"
              >
                Join class
              </Link>
              <Link
                href={loginHref}
                className="border border-stone-300 bg-white px-3 py-2 font-semibold text-stone-800 hover:border-teal-400 hover:text-teal-900"
              >
                {loginLabel}
              </Link>
              <Link
                href={primaryHref}
                className="bg-teal-800 px-4 py-2.5 font-semibold text-white shadow-md shadow-teal-900/20 hover:bg-teal-900"
              >
                {primaryLabel}
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3 md:border-t-0 md:pt-0">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition ${
                  item.primary
                    ? "border border-teal-200 bg-teal-50 text-teal-900"
                    : "text-stone-700 hover:bg-stone-50"
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
