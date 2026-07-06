import { JourneyNextStepPanel } from "@/components/journey/journey-next-step-panel";
import { ExamExperience } from "./exam-experience";
import { ExamLobbyExperience } from "./exam-lobby-experience";
import { ExamsRecoveryInShell } from "./exams-recovery";
import {
  getExamPapersApiData,
  getExamSessionApiData,
  getJourneyNextActionApiData,
  getReadAloudSessionApiData,
} from "@/lib/api/server";
import { isExamFocusMode } from "@/lib/exams/focus-mode";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";

export const dynamic = "force-dynamic";

interface ExamsPageProps {
  searchParams?: Promise<{
    examId?: string;
    questionId?: string;
    focus?: string;
  }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const focusMode = isExamFocusMode(resolvedSearchParams);

  try {
    const shell = await requireStudentAppRouteContext();
    const [papers, readAloudSession, journey] = await Promise.all([
      getExamPapersApiData(),
      getReadAloudSessionApiData("question"),
      getJourneyNextActionApiData(),
    ]);

    if (papers.length === 0) {
      return (
        <ExamsRecoveryInShell
          title="No exam papers are available right now."
          description="The exam route loaded without any paper definitions. Open saved progress or the dashboard while papers are unavailable."
        />
      );
    }

    const seededEntries = await Promise.all(
      papers.map(async (paper) => [paper.examId, await getExamSessionApiData(paper.examId)] as const),
    );
    const sessionSeeds = Object.fromEntries(seededEntries);
    const initialExamId =
      resolvedSearchParams?.examId && sessionSeeds[resolvedSearchParams.examId]
        ? resolvedSearchParams.examId
        : papers[0]?.examId;

    if (focusMode) {
      if (!initialExamId || !sessionSeeds[initialExamId]) {
        return (
          <ExamsRecoveryInShell
            title="Exam session data is incomplete for the selected paper."
            description="The paper could not be prepared safely for focus mode. Return to the exam lobby or open saved progress."
          />
        );
      }

      return (
        <ExamExperience
          papers={papers}
          sessionSeeds={sessionSeeds}
          readAloudSession={readAloudSession}
          initialExamId={initialExamId}
          initialQuestionId={resolvedSearchParams?.questionId}
          focusMode
        />
      );
    }

    return (
      <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
        <div className="flex flex-col gap-6">
          <JourneyNextStepPanel journey={journey} />
          <ExamLobbyExperience papers={papers} sessionSeeds={sessionSeeds} />
        </div>
      </StudentAppShell>
    );
  } catch {
    return (
      <ExamsRecoveryInShell
        title="The exam route could not finish loading."
        description="A paper or saved exam session failed while preparing the route. Open saved progress or the dashboard instead."
      />
    );
  }
}
