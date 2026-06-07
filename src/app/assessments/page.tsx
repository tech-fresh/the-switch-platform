import { AssessmentExperience } from "./assessment-experience";
import {
  getTimedAssessmentDefinitionsApiData,
  getTimedAssessmentSeedApiData,
} from "@/lib/api/server";

interface AssessmentsPageProps {
  searchParams?: Promise<{
    assessmentId?: string;
    durationMinutes?: string;
  }>;
}

export default async function AssessmentsPage({ searchParams }: AssessmentsPageProps) {
  const assessments = await getTimedAssessmentDefinitionsApiData();
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
          await getTimedAssessmentSeedApiData(assessment.assessmentId, duration),
        ] as const),
      );

      return [assessment.assessmentId, Object.fromEntries(seeds)] as const;
    }),
  );
  const attemptSeeds = Object.fromEntries(attemptEntries);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialAssessmentId =
    resolvedSearchParams?.assessmentId && attemptSeeds[resolvedSearchParams.assessmentId]
      ? resolvedSearchParams.assessmentId
      : assessments[0]?.assessmentId;

  return (
    <AssessmentExperience
      assessments={assessments}
      attemptSeeds={attemptSeeds}
      initialAssessmentId={initialAssessmentId}
      initialDurationKey={resolvedSearchParams?.durationMinutes}
    />
  );
}
