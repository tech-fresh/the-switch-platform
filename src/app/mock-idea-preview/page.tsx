import Link from "next/link";

import { MockIdeaShowcase } from "@/components/mock-idea/mock-idea-showcase";
import { getDashboardHomeData } from "@/modules/dashboard/service";
import { getRequestUserId } from "@/modules/auth/request";

export const dynamic = "force-dynamic";

export default async function MockIdeaPreviewPage() {
  const userId = await getRequestUserId();
  const dashboardData = await getDashboardHomeData(userId);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Visual gallery</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mock Idea — everything added</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
              Study Atelier creative direction: top study rail, bento planner panel, SEND colour swatches, access
              signposting, marketing header/footer, and onboarding step rail. Not a Seneca copy.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/login?reauth=1"
              className="border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400"
            >
              Log in
            </Link>
            <Link
              href="/login?intent=admin&returnTo=/admin"
              className="border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-900 hover:bg-white"
            >
              Admin sign-in
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <MockIdeaShowcase dashboardData={dashboardData} displayName="Lloyd" />
      </div>
    </main>
  );
}
