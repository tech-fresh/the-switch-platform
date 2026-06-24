import Link from "next/link";

import { MARKETING_NAV, MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  return (
    <header className="relative z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-600 via-amber-400 to-emerald-500" />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center bg-stone-950 text-base font-bold text-teal-300">
            {MOCK_IDEA_BRAND.logoGlyph}
          </span>
          <div>
            <p className="text-base font-semibold tracking-tight text-stone-950">{MOCK_IDEA_BRAND.name}</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Study Atelier mock</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/support"
            className="hidden px-3 py-2 font-medium text-stone-700 hover:text-teal-800 sm:inline"
          >
            Join class
          </Link>
          <Link
            href={isAuthenticated ? "/account" : "/login?reauth=1"}
            className="px-3 py-2 font-medium text-stone-700 hover:text-teal-800"
          >
            {isAuthenticated ? "Account" : "Log in"}
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
            className="bg-teal-800 px-4 py-2.5 font-semibold text-white shadow-md shadow-teal-900/20 hover:bg-teal-900"
          >
            {isAuthenticated ? "Dashboard" : "Sign up"}
          </Link>
        </div>
      </div>
    </header>
  );
}
