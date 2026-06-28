import Link from "next/link";

import { buildMockPreviewDashboardData } from "@/components/mock-idea/mock-preview-fallback";
import { StreamlinedSiteMockup } from "@/components/mock-idea/streamlined-site-mockup";
import { getRequestUserId } from "@/modules/auth/request";
import { getDashboardHomeData } from "@/modules/dashboard/service";

export const dynamic = "force-dynamic";

export default async function StreamlinedMockupPage() {
  const userId = await getRequestUserId();
  const dashboardData = await getDashboardHomeData(userId).catch((error) => {
    if (error instanceof Error && error.message.includes("unable to open database file")) {
      return buildMockPreviewDashboardData();
    }

    throw error;
  });

  return (
    <main className="min-h-screen bg-stone-200 px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">
            Website streamline mockup
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Professional, calmer direction</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
            One place to review a less-packed homepage and a decluttered student dashboard using the existing Study
            Atelier visual language.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mock-idea-preview"
            className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
          >
            Mock gallery
          </Link>
          <Link
            href="/dashboard"
            className="bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Live dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <StreamlinedSiteMockup dashboardData={dashboardData} displayName="Lloyd" />
      </div>
    </main>
  );
}
