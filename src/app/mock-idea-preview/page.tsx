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
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Visual gallery</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mock Idea — everything added</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
          Study Atelier creative direction: top study rail, bento planner panel, SEND colour swatches, access
          signposting, marketing header/footer, and onboarding step rail. Not a Seneca copy.
        </p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <MockIdeaShowcase dashboardData={dashboardData} displayName="Lloyd" />
      </div>
    </main>
  );
}
