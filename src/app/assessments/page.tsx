import { AssessmentExperience } from "./assessment-experience";
import {
  getMockTimedAssessmentAttemptSeed,
  getMockTimedAssessments,
} from "@/modules/timed-assessment/service";

export default async function AssessmentsPage() {
  const assessments = getMockTimedAssessments();
  const attemptEntries = await Promise.all(
    assessments.map(async (assessment) => {
      const durations = Array.from(
        new Set([
          Math.min(15, assessment.officialDurationMinutes),
          Math.min(30, assessment.officialDurationMinutes),
          assessment.officialDurationMinutes,
        ]),
      ).sort((left, right) => left - right);

      const seeds = await Promise.all(
        durations.map(async (duration) => [
          String(duration),
          await getMockTimedAssessmentAttemptSeed(assessment.assessmentId, {
            selectedDurationMinutes: duration,
          }),
        ] as const),
      );

      return [assessment.assessmentId, Object.fromEntries(seeds)] as const;
    }),
  );

  return (
    <AssessmentExperience
      assessments={assessments}
      attemptSeeds={Object.fromEntries(attemptEntries)}
    />
  );
}
