import Link from "next/link";

import { MOCK_IDEA_BRAND, SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";
import { SwitchBrandLogo } from "@/components/switch-brand-logo";
import { getPublicRouteHref } from "@/lib/public-route";

interface MarketingSiteFooterProps {
  isAuthenticated?: boolean;
}

export function MarketingSiteFooter({ isAuthenticated = false }: MarketingSiteFooterProps) {
  return (
    <footer className="relative mt-12 border-t border-[#ddd3c6] bg-[#17322e] text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <SwitchBrandLogo href="/" size="md" onDark />
            <p className="max-w-sm text-sm leading-7 text-[#d7d3cb]">{MOCK_IDEA_BRAND.tagline}</p>
            <p className="text-sm font-semibold text-white">theswitchplatform.com</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfc9c2]">For learners</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#e8e2d9]">
              <li><Link className="hover:text-white" href={getPublicRouteHref("/dashboard", isAuthenticated)}>Student dashboard</Link></li>
              <li><Link className="hover:text-white" href={getPublicRouteHref("/subjects", isAuthenticated)}>Subjects</Link></li>
              <li><Link className="hover:text-white" href={getPublicRouteHref("/onboarding", isAuthenticated)}>Guided setup</Link></li>
              <li><Link className="hover:text-white" href={getPublicRouteHref("/exams", isAuthenticated)}>Full GCSE exams</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfc9c2]">Access &amp; SEND</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#e8e2d9]">
              <li><Link className="hover:text-white" href={getPublicRouteHref("/accessibility", isAuthenticated)}>Accessibility settings</Link></li>
              <li><Link className="hover:text-white" href="/support">Support hub</Link></li>
              <li><Link className="hover:text-white" href="/how-it-works">How it works</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfc9c2]">Schools</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#e8e2d9]">
              <li><Link className="hover:text-white" href={getPublicRouteHref("/admin", isAuthenticated)}>For schools</Link></li>
              <li><Link className="hover:text-white" href="/login?reauth=1">Log in</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-[#2e4a45] pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfc9c2]">SEND colour overlays</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {SEND_COLOUR_CHIPS.map((chip) => (
                <Link
                  key={chip.id}
                  href={getPublicRouteHref(chip.href, isAuthenticated)}
                  className="group flex items-center gap-2 text-sm text-[#d7d3cb] hover:text-white"
                >
                  <span
                    className="size-9 rounded-lg border-2 border-[#40635d] shadow-lg transition group-hover:scale-105"
                    style={{ backgroundColor: chip.swatch }}
                    aria-hidden
                  />
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-[#0f766e] px-6 py-5 text-center text-white shadow-sm">
            <p className="text-lg font-black">Start learning with clarity.</p>
            <p className="text-sm font-semibold text-teal-50/90">One clear next step, better progress, calmer study.</p>
          </div>
        </div>

        <p className="mt-8 text-xs text-[#a7b4ae]">
          © {new Date().getFullYear()} The Switch Platform · GCSE &amp; iGCSE revision
        </p>
      </div>
    </footer>
  );
}
