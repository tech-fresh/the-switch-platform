import { AccessibilityExperience } from "./accessibility-experience";
import {
  getAccessibilitySnapshotApiData,
  getReadAloudSessionApiData,
  getStudentRecommendationsApiData,
} from "@/lib/api/server";

export default async function AccessibilityPage() {
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
