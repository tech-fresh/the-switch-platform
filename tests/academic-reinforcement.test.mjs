import test from "node:test";
import assert from "node:assert/strict";

import { buildAcademicReinforcementOverview } from "../src/modules/academic-coverage/reinforcement-service.ts";

const subjects = [
  { subjectId: "gcse-maths", name: "GCSE Mathematics" },
  { subjectId: "gcse-english-language", name: "GCSE English Language" },
];

const topics = [
  { topicId: "algebra", subjectId: "gcse-maths", name: "Algebra" },
  { topicId: "ratio", subjectId: "gcse-maths", name: "Ratio" },
  { topicId: "language-analysis", subjectId: "gcse-english-language", name: "Language Analysis" },
];

const examPapers = [
  { examId: "aqa-maths-paper-1", subject: "Mathematics" },
];

const timedAssessments = [
  { assessmentId: "english-checkpoint", subject: "English Language" },
];

test("reinforcement overview prioritizes the weakest topic across saved evidence", () => {
  const overview = buildAcademicReinforcementOverview({
    records: [
      {
        entityId: "aqa-maths-paper-1-session-001",
        entityType: "exam-session",
        status: "submitted",
        lastActivityAt: "2026-06-13T09:00:00.000Z",
        examProgress: {
          questionSet: [
            { questionId: "q1", topic: "Algebra", correctOptionId: "b" },
            { questionId: "q2", topic: "Ratio", correctOptionId: "c" },
          ],
          questionResponses: [
            { questionId: "q1", selectedOptionId: "a", flagged: true, workingNotes: "retry" },
            { questionId: "q2", flagged: false },
          ],
        },
      },
      {
        entityId: "english-checkpoint-attempt-001",
        entityType: "timed-assessment-attempt",
        status: "in-progress",
        lastActivityAt: "2026-06-13T10:00:00.000Z",
        timedAssessmentProgress: {
          selectedDurationMinutes: 15,
          questionSet: [
            { questionId: "e1", topic: "Language analysis", correctOptionId: "d" },
          ],
          selectedAnswerIds: [],
          notes: { e1: "need evidence quote" },
          bookmarkedQuestionIds: ["e1"],
        },
      },
    ],
    subjects,
    topics,
    examPapers,
    timedAssessments,
  });

  assert.equal(overview.weakestTopic?.topic, "Algebra");
  assert.equal(overview.weakestSubject?.subject, "Mathematics");
  assert.ok(overview.weakestTopic?.href.includes("subjectId=gcse-maths"));
});

test("reinforcement falls back to subject route when no exact topic match exists", () => {
  const overview = buildAcademicReinforcementOverview({
    records: [
      {
        entityId: "english-checkpoint-attempt-002",
        entityType: "timed-assessment-attempt",
        status: "in-progress",
        lastActivityAt: "2026-06-13T10:00:00.000Z",
        timedAssessmentProgress: {
          selectedDurationMinutes: 15,
          questionSet: [
            { questionId: "e1", topic: "Evidence selection", correctOptionId: "d" },
          ],
          selectedAnswerIds: [],
          notes: {},
          bookmarkedQuestionIds: ["e1"],
        },
      },
    ],
    subjects,
    topics,
    examPapers,
    timedAssessments,
  });

  assert.equal(overview.weakestTopic?.topic, "Evidence selection");
  assert.equal(overview.weakestTopic?.href, "/subjects?subjectId=gcse-english-language");
});
