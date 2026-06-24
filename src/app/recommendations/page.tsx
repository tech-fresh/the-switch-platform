import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { getRecommendationsPageApiData, getSupportHubApiData } from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { RecommendationsExperience } from "./recommendations-experience";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const [shell, data, support] = await Promise.all([
    requireStudentAppRouteContext(),
    getRecommendationsPageApiData(),
    getSupportHubApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <RecommendationsExperience data={data} support={support} />
    </StudentAppShell>
  );
}
