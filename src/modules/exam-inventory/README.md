# Exam Inventory Module

Central source of truth for seeded exam-paper availability, launch scope, and student visibility.

Service entry: `src/modules/exam-inventory/service.ts`
Seed data: `src/data/exam-paper-inventory.json`

## Purpose

- Register every seeded exam paper in one controlled inventory.
- Keep onboarding board options tied to `live` student-visible papers only.
- Keep `/api/exams/papers` and other student surfaces aligned with the same inventory truth.
- Give operators one inventory summary for launch-safe, Year 10, and bridge-paper coverage.

## Rules

- If a paper is not `live` and student-visible in the inventory, student routes should behave as if it does not exist.
- Launch-safe coverage and broader Year 10 / bridge coverage live in the same model.
- Inventory metadata must stay aligned with the seeded paper runtime.
