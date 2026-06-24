# Weekly Planner

Module reference: see **`PLATFORM-GUIDE.md` → Module reference** and **`docs/ideas/FINAL-PHASE-PLAN.md` → C-6**.

Builds the student weekly planner from saved progress, exams, timed assessments, and Power Grid signals. Dashboard and `/progress` consume the same summary through `/api/planner/week`.

**Priority C-6 — complete (24 June 2026).** Architecture: `getWeeklyPlannerSummary()` in this module → `/api/planner/week` → `getWeeklyPlannerApiData()` in pages. Do not add planner logic in page components.
