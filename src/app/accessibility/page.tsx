import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import {
  getAccessibilitySnapshotApiData,
  getJourneyNextActionApiData,
  getReadAloudSessionApiData,
  getStudentRecommendationsApiData,
  getSupportHubApiData,
} from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { AccessibilityExperience } from "./accessibility-experience";

export const dynamic = "force-dynamic";

export default async function AccessibilityPage() {
  const [shell, snapshot, readAloudSession, recommendations, support, journey] = await Promise.all([
    requireStudentAppRouteContext(),
    getAccessibilitySnapshotApiData(),
    getReadAloudSessionApiData("revision-notes"),
    getStudentRecommendationsApiData(),
    getSupportHubApiData(),
    getJourneyNextActionApiData(),
  ]);

  return (
    <StudentAppShell
      displayName={shell.displayName}
      supportChips={shell.supportChips}
      showSendSideRail={false}
    >
      <div className="flex flex-col gap-6">
        <AccessibilityExperience
          snapshot={snapshot}
          readAloudSession={readAloudSession}
          recommendations={recommendations}
          support={support}
        />
        <JourneyNextStepPanel journey={journey} />
      </div>
    </StudentAppShell>
  );
}
