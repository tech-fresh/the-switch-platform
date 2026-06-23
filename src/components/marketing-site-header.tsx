import Link from "next/link";

interface MarketingSiteHeaderProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteHeader({ isAuthenticated = false }: MarketingSiteHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sky-700">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            ✦
          </span>
          <span>THE SWITCH</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-700 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg bg-sky-50 px-3 py-2 text-sky-700"
          >
            For Students
          </Link>
          <Link href="/how-it-works" className="rounded-lg px-3 py-2 hover:bg-slate-50">
            How it works
          </Link>
          <Link href="/support" className="rounded-lg px-3 py-2 hover:bg-slate-50">
            Support
          </Link>
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-slate-50">
            For Schools
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          <Link
            href={isAuthenticated ? "/account" : "/login?reauth=1"}
            className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            {isAuthenticated ? "Account" : "Log in"}
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login?reauth=1"}
            className="rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800"
          >
            {isAuthenticated ? "Dashboard" : "Sign up"}
          </Link>
        </div>
      </div>
    </header>
  );
}
