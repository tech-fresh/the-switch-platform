import { ExamExperience } from "./exam-experience";
import { getMockExamPapers, getMockExamSession } from "@/modules/exam-engine/service";

export default function ExamsPage() {
  const papers = getMockExamPapers();
  const sessionSeeds = Object.fromEntries(
    papers.map((paper) => [paper.examId, getMockExamSession(paper.examId)]),
  );

  return <ExamExperience papers={papers} sessionSeeds={sessionSeeds} />;
}
