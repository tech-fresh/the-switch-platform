import { ExamExperience } from "./exam-experience";
import {
  getExamPapersApiData,
  getExamSessionApiData,
  getReadAloudSessionApiData,
} from "@/lib/api/server";

interface ExamsPageProps {
  searchParams?: Promise<{
    examId?: string;
    questionId?: string;
  }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const [papers, readAloudSession] = await Promise.all([
    getExamPapersApiData(),
    getReadAloudSessionApiData("question"),
  ]);
  const seededEntries = await Promise.all(
    papers.map(async (paper) => [paper.examId, await getExamSessionApiData(paper.examId)] as const),
  );
  const sessionSeeds = Object.fromEntries(seededEntries);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialExamId =
    resolvedSearchParams?.examId && sessionSeeds[resolvedSearchParams.examId]
      ? resolvedSearchParams.examId
      : papers[0]?.examId;

  return (
    <ExamExperience
      papers={papers}
      sessionSeeds={sessionSeeds}
      readAloudSession={readAloudSession}
      initialExamId={initialExamId}
      initialQuestionId={resolvedSearchParams?.questionId}
    />
  );
}
