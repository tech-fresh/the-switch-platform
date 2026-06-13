import { AccessibilityExperience } from "./accessibility-experience";
import {
  getAccessibilitySnapshotApiData,
  getReadAloudSessionApiData,
  getStudentRecommendationsApiData,
} from "@/lib/api/server";
import { requireAuthenticatedRequestSession } from "@/modules/auth/request";

export default async function AccessibilityPage() {
  await requireAuthenticatedRequestSession();
  const [snapshot, readAloudSession, recommendations] = await Promise.all([
    getAccessibilitySnapshotApiData(),
    getReadAloudSessionApiData("revision-notes"),
    getStudentRecommendationsApiData(),
  ]);

  return (
    <AccessibilityExperience
      snapshot={snapshot}
      readAloudSession={readAloudSession}
      recommendations={recommendations}
    />
  );
}
