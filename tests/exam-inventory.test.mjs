import assert from "node:assert/strict";
import test from "node:test";

import {
  filterExamPapersByInventory,
  getExamInventorySummary,
  listExamInventoryEntries,
  listExamInventoryPapers,
  listLiveExamBoardsForQualificationPath,
  listStudentVisibleExamPapers,
  validateExamInventory,
} from "../src/modules/exam-inventory/service.ts";
import { getMockExamPapers } from "../src/modules/exam-engine/service.ts";

test("exam inventory registers launch, year 10, and bridge papers in one source of truth", () => {
  const entries = listExamInventoryEntries();

  assert.equal(entries.length, 9);
  assert.equal(entries.filter((entry) => entry.launchScope === "launch-mvp").length, 6);
  assert.equal(entries.filter((entry) => entry.launchScope === "year-10-progression").length, 2);
  assert.equal(entries.filter((entry) => entry.launchScope === "gcse-bridge").length, 1);
});

test("onboarding board options can be driven from live inventory only", () => {
  assert.deepEqual(listLiveExamBoardsForQualificationPath("gcse-england"), ["AQA", "Edexcel"]);
  assert.deepEqual(listLiveExamBoardsForQualificationPath("igcse"), ["Cambridge IGCSE"]);
});

test("student-visible paper list is filtered by inventory live state", () => {
  const papers = listStudentVisibleExamPapers();

  assert.equal(papers.length, 9);
  assert.ok(papers.every((paper) => paper.examId));

  const filtered = filterExamPapersByInventory(getMockExamPapers(), {
    qualificationPath: "gcse-england",
    board: "AQA",
    studentVisibleOnly: true,
    status: "live",
  });

  assert.ok(filtered.length >= 2);
  assert.ok(filtered.every((paper) => paper.board === "AQA"));
});

test("operator inventory summary exposes coverage counts and no current live gaps", () => {
  const summary = getExamInventorySummary();

  assert.equal(summary.liveEntries, 9);
  assert.equal(summary.studentVisibleEntries, 9);
  assert.equal(summary.coverageGaps.length, 0);
  assert.ok(summary.bySubject.some((group) => group.key === "gcse-combined-science" && group.live === 2));
});

test("inventory validation passes and inventory papers stay mappable to runtime papers", () => {
  const validation = validateExamInventory();
  const papers = listExamInventoryPapers();

  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
  assert.equal(papers.length, 9);
  assert.ok(papers.every((paper) => paper.inventory.examId === paper.examId));
});
