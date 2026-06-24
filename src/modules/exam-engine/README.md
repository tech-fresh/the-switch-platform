# Exam Engine Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Exam Engine Module

Service entry: `src/modules/exam-engine/service.ts`

**Route model (Final Phase C-2):** `/exams` lobby stays inside `StudentAppShell`; active papers use focus mode (`focus=1` or `questionId` with `examId`) with no study rail. Helpers: `src/lib/exams/focus-mode.ts`.
