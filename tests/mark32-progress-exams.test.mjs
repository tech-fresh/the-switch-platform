import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("progress route uses Mark 4 visual summary components", () => {
  const source = readRepoFile("src/app/progress/page.tsx");

  assert.match(source, /Mark32ProgressAtAGlance/);
  assert.match(source, /Mark32SubjectProgressCard/);
  assert.match(source, /Mark32PowerGridJourney/);
  assert.match(source, /Subject progress/);
});

test("exam lobby groups papers by subject and exposes selection path", () => {
  const source = readRepoFile("src/app/exams/exam-lobby-experience.tsx");

  assert.match(source, /Mark32ExamPaperCard/);
  assert.match(source, /groupPapersBySubject/);
  assert.match(source, /Selection path/);
  assert.match(source, /Subject.*Board.*Tier.*Duration.*Start/s);
});

test("exam paper card distinguishes start, continue, and submitted states", () => {
  const source = readRepoFile("src/components/streamlined/mark32-exam-paper-card.tsx");

  assert.match(source, /Not started/);
  assert.match(source, /In progress/);
  assert.match(source, /Submitted/);
  assert.match(source, /Start exam/);
  assert.match(source, /Continue exam/);
  assert.match(source, /Review paper/);
});
