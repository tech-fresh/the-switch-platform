import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const STUDENT_SHELL_ROUTE_FILES = [
  "src/app/subjects/page.tsx",
  "src/app/assessments/page.tsx",
  "src/app/progress/page.tsx",
  "src/app/results/page.tsx",
  "src/app/saved-progress/page.tsx",
  "src/app/recommendations/page.tsx",
  "src/app/account/page.tsx",
  "src/app/accessibility/page.tsx",
  "src/app/exams/page.tsx",
  "src/app/exams/exams-recovery.tsx",
  "src/components/dashboard-home.tsx",
];

test("signed-in student routes keep StudentAppShell coverage", () => {
  for (const relativePath of STUDENT_SHELL_ROUTE_FILES) {
    const source = readFileSync(path.join(repoRoot, relativePath), "utf8");

    assert.match(
      source,
      /StudentAppShell/,
      `${relativePath} should render StudentAppShell for signed-in student workflows`,
    );
  }
});

test("exams route keeps lobby shell and focus-mode exception", () => {
  const examsPage = readFileSync(path.join(repoRoot, "src/app/exams/page.tsx"), "utf8");
  const focusMode = readFileSync(path.join(repoRoot, "src/lib/exams/focus-mode.ts"), "utf8");

  assert.match(examsPage, /isExamFocusMode/);
  assert.match(examsPage, /StudentAppShell/);
  assert.match(focusMode, /lobby uses StudentAppShell/);
});
