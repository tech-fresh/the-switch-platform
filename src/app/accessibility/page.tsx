import { AccessibilityExperience } from "./accessibility-experience";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getReadAloudSession } from "@/modules/read-aloud/service";
import { getStudentRecommendations } from "@/modules/recommendations/service";

export default async function AccessibilityPage() {
  const userId = "student-demo";
  const [snapshot, readAloudSession, recommendations] = await Promise.all([
    getAccessibilitySnapshot(userId),
    getReadAloudSession(userId, "revision-notes"),
    getStudentRecommendations(userId),
  ]);

  return (
    <AccessibilityExperience
      snapshot={snapshot}
      readAloudSession={readAloudSession}
      recommendations={recommendations}
    />
  );
}
