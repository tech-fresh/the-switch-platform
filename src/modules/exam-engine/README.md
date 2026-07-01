# Exam Engine Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Exam Engine Module

Service entry: `src/modules/exam-engine/service.ts`

**Route model (Final Phase C-2):** `/exams` lobby stays inside `StudentAppShell`; active papers use focus mode (`focus=1` or `questionId` with `examId`) with no study rail. Helpers: `src/lib/exams/focus-mode.ts`.

## Seeded full papers (MVP)

| Subject | Boards | Seed file / ids |
|---------|--------|-----------------|
| Mathematics | AQA, Edexcel, Cambridge IGCSE | `service.ts` blueprints |
| English Language | Edexcel | `service.ts` blueprints |
| **Combined Science** | **AQA, Edexcel** | `seeded-combined-science-papers.ts` → `aqa-combined-science-paper-1`, `edexcel-combined-science-paper-1` |

Combined Science papers cover biology, chemistry, and physics in one timed paper per board. Onboarding learners who select `gcse-combined-science` receive board-matched science papers via `personalization.ts` — no maths fallback.
