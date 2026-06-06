import type { Subject } from "./types";

const mockSubjects: Subject[] = [
  {
    subjectId: "gcse-maths",
    name: "GCSE Mathematics",
    qualificationType: "GCSE",
    examBoards: ["AQA", "Edexcel", "OCR"],
    description: "Core number, algebra, geometry, ratio, and statistics revision.",
    topicCount: 8,
    revisionResourceCount: 32,
    examReadinessScore: 56,
    nextTopicToRevise: "Algebra",
  },
  {
    subjectId: "gcse-english-language",
    name: "GCSE English Language",
    qualificationType: "GCSE",
    examBoards: ["Edexcel", "AQA", "Eduqas"],
    description: "Reading, inference, language analysis, structure, and writing craft.",
    topicCount: 6,
    revisionResourceCount: 24,
    examReadinessScore: 61,
    nextTopicToRevise: "Language Analysis",
  },
  {
    subjectId: "gcse-combined-science",
    name: "GCSE Combined Science",
    qualificationType: "GCSE",
    examBoards: ["AQA", "Edexcel", "OCR"],
    description: "Biology, chemistry, and physics concepts through exam-ready checkpoints.",
    topicCount: 9,
    revisionResourceCount: 40,
    examReadinessScore: 47,
    nextTopicToRevise: "Chemical Changes",
  },
];

export function getMockSubjects(): Subject[] {
  return mockSubjects;
}

export function getMockSubject(subjectId: string): Subject {
  const subject = mockSubjects.find((item) => item.subjectId === subjectId);

  if (!subject) {
    throw new Error(`Unknown mock subject: ${subjectId}`);
  }

  return subject;
}
