import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import {
  getAccessibilitySnapshotApiData,
  getReadAloudSessionApiData,
  getStudentRecommendationsApiData,
  getSupportHubApiData,
} from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { AccessibilityExperience } from "./accessibility-experience";

export const dynamic = "force-dynamic";

export default async function AccessibilityPage() {
  const [shell, snapshot, readAloudSession, recommendations, support] = await Promise.all([
    requireStudentAppRouteContext(),
    getAccessibilitySnapshotApiData(),
    getReadAloudSessionApiData("revision-notes"),
    getStudentRecommendationsApiData(),
    getSupportHubApiData(),
  ]);

  return (
    <StudentAppShell
      displayName={shell.displayName}
      supportChips={shell.supportChips}
      showSendSideRail={false}
    >
      <AccessibilityExperience
        snapshot={snapshot}
        readAloudSession={readAloudSession}
        recommendations={recommendations}
        support={support}
      />
    </StudentAppShell>
  );
}
