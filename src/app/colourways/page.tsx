import Link from "next/link";

import { WebsiteColourwaysShowcase } from "@/components/mock-idea/website-colourways-showcase";

export const dynamic = "force-static";

export default function ColourwaysPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Visual comparison</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Website colourways</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
              Side-by-side visual studies for the marketing shell and student-facing surfaces.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/mock-idea-preview"
              className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
            >
              Back to gallery
            </Link>
            <Link
              href="/login?reauth=1"
              className="border border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-950 hover:bg-white"
            >
              Open login
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <WebsiteColourwaysShowcase />
      </div>
    </main>
  );
}
