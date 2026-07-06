import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import {
  getJourneyNextActionApiData,
  getRecommendationsPageApiData,
  getSupportHubApiData,
} from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { RecommendationsExperience } from "./recommendations-experience";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const [shell, data, support, journey] = await Promise.all([
    requireStudentAppRouteContext(),
    getRecommendationsPageApiData(),
    getSupportHubApiData(),
    getJourneyNextActionApiData(),
  ]);

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <div className="flex flex-col gap-6">
        <RecommendationsExperience data={data} support={support} />
        <JourneyNextStepPanel journey={journey} />
      </div>
    </StudentAppShell>
  );
}
