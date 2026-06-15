import { AccessibilityExperience } from "./accessibility-experience";
import {
  getAccessibilitySnapshotApiData,
  getReadAloudSessionApiData,
  getStudentRecommendationsApiData,
  getSupportHubApiData,
} from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export const dynamic = "force-dynamic";

export default async function AccessibilityPage() {
  await requireAuthenticatedRequestSession();
  const [snapshot, readAloudSession, recommendations, support] = await Promise.all([
    getAccessibilitySnapshotApiData(),
    getReadAloudSessionApiData("revision-notes"),
    getStudentRecommendationsApiData(),
    getSupportHubApiData(),
  ]);

  return (
    <AccessibilityExperience
      snapshot={snapshot}
      readAloudSession={readAloudSession}
      recommendations={recommendations}
      support={support}
    />
  );
}
