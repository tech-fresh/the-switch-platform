import Link from "next/link";

import { MARKETING_NAV, MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  const loginHref = isAuthenticated ? "/account" : "/login?reauth=1";
  const primaryHref = isAuthenticated ? "/dashboard" : "/login?reauth=1";
  const loginLabel = isAuthenticated ? "Account" : "Log in";
  const primaryLabel = isAuthenticated ? "Dashboard" : "Get started free";

  return (
    <header className="relative z-20 border-b border-stone-200 bg-stone-100/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-800 text-xl text-white shadow-sm">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black tracking-tight text-stone-950">
                  {MOCK_IDEA_BRAND.name}
                </p>
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 sm:block">
                  GCSE revision made clearer
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 text-sm">
              <Link
                href="/how-it-works"
                className="hidden px-3 py-2 font-medium text-slate-700 hover:text-teal-900 sm:inline"
              >
                How it works
              </Link>
              <Link
                href={loginHref}
                className="rounded-2xl border border-stone-300 bg-white px-3 py-2 font-semibold text-stone-900 hover:border-teal-300 hover:bg-teal-50"
              >
                {loginLabel}
              </Link>
              <Link
                href={primaryHref}
                className="rounded-2xl bg-teal-800 px-4 py-2.5 font-bold text-white shadow-sm hover:bg-teal-900"
              >
                {primaryLabel}
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 border-t border-stone-200 pt-3 md:border-t-0 md:pt-0">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  item.primary
                    ? "border border-teal-200 bg-teal-50 text-teal-900"
                    : "text-slate-700 hover:bg-white"
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
