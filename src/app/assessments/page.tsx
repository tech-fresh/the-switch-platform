import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import {
  getReadAloudSessionApiData,
  getTimedAssessmentDefinitionsApiData,
  getTimedAssessmentSeedApiData,
} from "@/lib/api/server";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

import { AssessmentExperience } from "./assessment-experience";
import { AssessmentsRecoveryInShell } from "./assessments-recovery";

export const dynamic = "force-dynamic";

interface AssessmentsPageProps {
  searchParams?: Promise<{
    assessmentId?: string;
    durationMinutes?: string;
    questionId?: string;
  }>;
}

export default async function AssessmentsPage({ searchParams }: AssessmentsPageProps) {
  const shell = await requireStudentAppRouteContext();
  const [assessments, readAloudSession] = await Promise.all([
    getTimedAssessmentDefinitionsApiData(),
    getReadAloudSessionApiData("question"),
  ]);

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
        durations.map(
          async (duration) =>
            [String(duration), await getTimedAssessmentSeedApiData(assessment.assessmentId, duration)] as const,
        ),
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

  if (resolvedSearchParams?.assessmentId && !attemptSeeds[resolvedSearchParams.assessmentId]) {
    return (
      <AssessmentsRecoveryInShell
        title="Timed assessment data is unavailable for the selected checkpoint."
        description="The checkpoint id in the URL does not match a live practice session. Open the practice lobby or resume from saved progress instead of continuing with stale links."
      />
    );
  }

  if (assessments.length === 0) {
    return (
      <AssessmentsRecoveryInShell
        title="No timed assessments are available right now."
        description="The practice route loaded without checkpoint definitions. Open saved progress or the dashboard while assessments are unavailable."
      />
    );
  }

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <AssessmentExperience
        assessments={assessments}
        attemptSeeds={attemptSeeds}
        readAloudSession={readAloudSession}
        initialAssessmentId={initialAssessmentId}
        initialDurationKey={resolvedSearchParams?.durationMinutes}
        initialQuestionId={resolvedSearchParams?.questionId}
      />
    </StudentAppShell>
  );
}
