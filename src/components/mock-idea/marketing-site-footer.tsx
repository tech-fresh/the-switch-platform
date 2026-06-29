import Link from "next/link";

import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";

export function MarketingSiteFooter() {
  return (
    <footer className="relative mt-12 bg-[#12005f] text-violet-100">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-xl font-black text-white">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-violet-500 text-xl">
                {MOCK_IDEA_BRAND.logoGlyph}
              </span>
              {MOCK_IDEA_BRAND.shortName}
            </p>
            <p className="max-w-sm text-sm leading-7 text-violet-200">{MOCK_IDEA_BRAND.tagline}</p>
            <p className="text-sm font-semibold text-white">theswitchplatform.com</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">For learners</p>
            <ul className="mt-4 space-y-2.5 text-sm text-violet-100">
              <li><Link className="hover:text-white" href="/dashboard">Student dashboard</Link></li>
              <li><Link className="hover:text-white" href="/subjects">Subjects</Link></li>
              <li><Link className="hover:text-white" href="/onboarding">Guided setup</Link></li>
              <li><Link className="hover:text-white" href="/exams">Full GCSE exams</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">Access &amp; SEND</p>
            <ul className="mt-4 space-y-2.5 text-sm text-violet-100">
              <li><Link className="hover:text-white" href="/accessibility">Accessibility settings</Link></li>
              <li><Link className="hover:text-white" href="/support">Support hub</Link></li>
              <li><Link className="hover:text-white" href="/how-it-works">How it works</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">Schools</p>
            <ul className="mt-4 space-y-2.5 text-sm text-violet-100">
              <li><Link className="hover:text-white" href="/admin">For schools</Link></li>
              <li><Link className="hover:text-white" href="/login?reauth=1">Log in</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-violet-800 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">SEND colour overlays</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {SEND_COLOUR_CHIPS.map((chip) => (
                <Link
                  key={chip.id}
                  href={chip.href}
                  className="group flex items-center gap-2 text-sm text-violet-200 hover:text-white"
                >
                  <span
                    className="size-9 rounded-lg border-2 border-violet-600 shadow-lg transition group-hover:scale-105"
                    style={{ backgroundColor: chip.swatch }}
                    aria-hidden
                  />
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-violet-600 px-6 py-5 text-center text-white shadow-xl">
            <p className="text-lg font-black">It&apos;s Your Switch.</p>
            <p className="text-sm font-semibold text-violet-100">Take Control. Switch On. Succeed.</p>
          </div>
        </div>

        <p className="mt-8 text-xs text-violet-400">
          © {new Date().getFullYear()} The Switch Platform · GCSE &amp; iGCSE revision
        </p>
      </div>
    </footer>
  );
}
