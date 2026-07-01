import assert from "node:assert/strict";
import test from "node:test";

import { getMockExamPapers } from "../src/modules/exam-engine/service.ts";

test("seeded Combined Science full papers exist for AQA and Edexcel", () => {
  const papers = getMockExamPapers();
  const sciencePapers = papers.filter((paper) => paper.subject === "Combined Science");

  assert.equal(sciencePapers.length, 2);

  const aqa = sciencePapers.find((paper) => paper.examId === "aqa-combined-science-paper-1");
  const edexcel = sciencePapers.find((paper) => paper.examId === "edexcel-combined-science-paper-1");

  assert.ok(aqa);
  assert.ok(edexcel);
  assert.equal(aqa?.board, "AQA");
  assert.equal(edexcel?.board, "Edexcel");
  assert.equal(aqa?.questions.length, 4);
  assert.equal(edexcel?.questions.length, 4);
  assert.ok(aqa?.skillsFocus.includes("Cell Biology"));
  assert.ok(edexcel?.skillsFocus.includes("Health and Disease"));
});
