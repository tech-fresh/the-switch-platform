import Link from "next/link";

import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";

export function MarketingSiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              {MOCK_IDEA_BRAND.name.toUpperCase()}
            </p>
            <p className="max-w-sm text-sm leading-6 text-slate-600">{MOCK_IDEA_BRAND.tagline}</p>
            <p className="text-xs text-slate-500">
              Not a copy of any third-party product — a Switch MVP layout study with SEND-first colour
              signposting.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">For learners</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link className="hover:text-indigo-700" href="/dashboard">
                  Student dashboard
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/subjects">
                  Subjects
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/onboarding">
                  Guided setup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Access &amp; SEND
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link className="hover:text-indigo-700" href="/accessibility">
                  Accessibility settings
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/support">
                  Support hub signposting
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/how-it-works">
                  Access arrangements guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Schools</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link className="hover:text-indigo-700" href="/admin">
                  For schools
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/how-it-works">
                  Resources
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" href="/login?reauth=1">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            MVP SEND colour overlays
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEND_COLOUR_CHIPS.map((chip) => (
              <Link
                key={chip.id}
                href={chip.href}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${chip.className}`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} Mock Idea layout on The Switch Platform · GCSE &amp; iGCSE MVP
          </p>
        </div>
      </div>
    </footer>
  );
}
