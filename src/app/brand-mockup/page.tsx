import Link from "next/link";

import { BrandLogoMockup } from "@/components/mock-idea/brand-logo-mockup";

export const dynamic = "force-dynamic";

export default function BrandMockupPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Brand mockup</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">New site logo — placement gallery</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
              Study Atelier mockups for the official brain → lightbulb toggle. Matches{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">docs/design/UI-UX-MASTERPLAN.md</code>{" "}
              stone/teal surfaces and the live <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">SwitchBrandLogo</code>{" "}
              component.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/mock-idea-preview"
              className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
            >
              Visual gallery
            </Link>
            <Link
              href="/streamlined-mockup"
              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-white"
            >
              Streamlined mockup
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <BrandLogoMockup />
      </div>
    </main>
  );
}
