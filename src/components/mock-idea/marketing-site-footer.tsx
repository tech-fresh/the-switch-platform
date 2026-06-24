import Link from "next/link";

import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";

export function MarketingSiteFooter() {
  return (
    <footer className="relative mt-12 bg-stone-950 text-stone-100">
      <div
        className="absolute -top-px left-0 right-0 h-8 bg-stone-100"
        style={{
          clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-xl font-semibold text-white">
              <span className="inline-flex size-10 items-center justify-center bg-teal-500 text-sm font-bold text-stone-950">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              {MOCK_IDEA_BRAND.name}
            </p>
            <p className="max-w-sm text-sm leading-7 text-stone-400">{MOCK_IDEA_BRAND.tagline}</p>
            <p className="text-xs leading-6 text-stone-500">
              Creative layout study for The Switch Platform — bento dashboard, top study rail, SEND colour
              signposting, and access arrangement links. Not a copy of any third-party product.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-400">For learners</p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
              <li>
                <Link className="hover:text-white" href="/dashboard">
                  Student dashboard
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/subjects">
                  Subjects
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/onboarding">
                  Guided setup
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/mock-idea-preview">
                  Visual mockup gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400">
              Access &amp; SEND
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
              <li>
                <Link className="hover:text-white" href="/accessibility">
                  Accessibility settings
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/support">
                  Support hub signposting
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/how-it-works">
                  Access arrangements guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">Schools</p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
              <li>
                <Link className="hover:text-white" href="/admin">
                  For schools
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/how-it-works">
                  Resources
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/login?reauth=1">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            MVP SEND colour overlays
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {SEND_COLOUR_CHIPS.map((chip) => (
              <Link
                key={chip.id}
                href={chip.href}
                className="group flex items-center gap-2 text-sm text-stone-300 hover:text-white"
              >
                <span
                  className="size-9 border-2 border-stone-600 shadow-lg transition group-hover:scale-105 group-hover:border-teal-400"
                  style={{ backgroundColor: chip.swatch }}
                  aria-hidden
                />
                {chip.label}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs text-stone-500">
            © {new Date().getFullYear()} Mock Idea on The Switch Platform · GCSE &amp; iGCSE MVP
          </p>
        </div>
      </div>
    </footer>
  );
}
