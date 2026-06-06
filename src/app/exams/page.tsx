import { ExamExperience } from "./exam-experience";
import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";

export default async function ExamsPage() {
  const papers = getMockExamPapers();
  const seededEntries = await Promise.all(
    papers.map(async (paper) => [paper.examId, await getMockExamSession(paper.examId)] as const),
  );
  const sessionSeeds = Object.fromEntries(seededEntries);

  return <ExamExperience papers={papers} sessionSeeds={sessionSeeds} />;
}
