import assert from "node:assert/strict";
import test from "node:test";

import { getMockExamPapers } from "../src/modules/exam-engine/service.ts";
import {
  filterExamPapersForOnboardingProfile,
  getDefaultExamBoard,
  listOnboardingExamBoardOptions,
} from "../src/modules/onboarding/exam-availability.ts";

test("onboarding exam board options stay truthful to seeded exam content", () => {
  assert.deepEqual(listOnboardingExamBoardOptions("gcse-england"), ["AQA", "Edexcel"]);
  assert.deepEqual(listOnboardingExamBoardOptions("igcse"), ["Cambridge IGCSE"]);
  assert.equal(getDefaultExamBoard("gcse-england"), "AQA");
});

test("onboarding exam filtering keeps usable papers for typical GCSE maths setup", () => {
  const papers = getMockExamPapers();
  const visible = filterExamPapersForOnboardingProfile(papers, {
    qualificationPath: "gcse-england",
    examBoard: "AQA",
    selectedSubjectIds: ["gcse-maths"],
  });

  assert.ok(visible.length > 0);
  assert.ok(visible.every((paper) => paper.qualificationType === "GCSE" && paper.board === "AQA"));
  assert.ok(visible.some((paper) => paper.subject === "Mathematics"));
});

test("onboarding exam filtering falls back when a subject has no seeded paper yet", () => {
  const papers = getMockExamPapers();
  const visible = filterExamPapersForOnboardingProfile(papers, {
    qualificationPath: "gcse-england",
    examBoard: "AQA",
    selectedSubjectIds: ["gcse-combined-science"],
  });

  assert.ok(visible.length > 0);
  assert.ok(visible.every((paper) => paper.qualificationType === "GCSE" && paper.board === "AQA"));
});

test("onboarding exam filtering exposes iGCSE Cambridge maths papers", () => {
  const papers = getMockExamPapers();
  const visible = filterExamPapersForOnboardingProfile(papers, {
    qualificationPath: "igcse",
    examBoard: "Cambridge IGCSE",
    selectedSubjectIds: ["igcse-maths"],
  });

  assert.equal(visible.length, 1);
  assert.equal(visible[0]?.examId, "cambridge-igcse-maths-paper-1");
});
