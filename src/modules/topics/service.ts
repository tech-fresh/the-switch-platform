import type { Topic } from "./types";

const mockTopics: Topic[] = [
  {
    topicId: "maths-algebra",
    subjectId: "gcse-maths",
    name: "Algebra",
    summary: "Expressions, equations, rearranging formulae, and sequences.",
    confidenceScore: 58,
    practiceQuestionCount: 12,
    timedAssessmentAvailable: true,
  },
  {
    topicId: "maths-ratio",
    subjectId: "gcse-maths",
    name: "Ratio",
    summary: "Scale factors, proportion, rates, and direct comparison.",
    confidenceScore: 49,
    practiceQuestionCount: 8,
    timedAssessmentAvailable: true,
  },
  {
    topicId: "english-language-analysis",
    subjectId: "gcse-english-language",
    name: "Language Analysis",
    summary: "Selecting quotations and explaining word-level effects clearly.",
    confidenceScore: 63,
    practiceQuestionCount: 10,
    timedAssessmentAvailable: true,
  },
  {
    topicId: "english-structure",
    subjectId: "gcse-english-language",
    name: "Structure",
    summary: "Tracking viewpoint, shifts in focus, and structural impact.",
    confidenceScore: 54,
    practiceQuestionCount: 7,
    timedAssessmentAvailable: true,
  },
  {
    topicId: "science-chemical-changes",
    subjectId: "gcse-combined-science",
    name: "Chemical Changes",
    summary: "Reactivity, electrolysis, and acid-metal reactions.",
    confidenceScore: 42,
    practiceQuestionCount: 11,
    timedAssessmentAvailable: true,
  },
  {
    topicId: "science-energy",
    subjectId: "gcse-combined-science",
    name: "Energy",
    summary: "Stores, transfers, efficiency, and required practical links.",
    confidenceScore: 51,
    practiceQuestionCount: 9,
    timedAssessmentAvailable: false,
  },
];

export function getMockTopicsForSubject(subjectId: string): Topic[] {
  return mockTopics.filter((topic) => topic.subjectId === subjectId);
}

export function getMockTopic(topicId: string): Topic {
  const topic = mockTopics.find((item) => item.topicId === topicId);

  if (!topic) {
    throw new Error(`Unknown mock topic: ${topicId}`);
  }

  return topic;
}
