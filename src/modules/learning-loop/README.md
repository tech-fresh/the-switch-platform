# Learning Loop

Topic-level learning loop state machine: Learn → Question → Feedback → Progress → Next → Complete.

| File | Role |
|------|------|
| `types.ts` | `LearningLoopStage`, `LearningLoopSession` |
| `contracts.ts` | API request/response shapes |
| `vocabulary.ts` | Stage labels for UI |
| `service.ts` | `getLearningLoopSession`, `advanceLearningLoopStage`, `syncLearningLoopAfterQuiz` |

API: `GET` / `POST` `/api/learning-loop/[topicId]`

Quiz integration: `quiz/service.ts` calls `syncLearningLoopAfterQuiz` after each attempt.

UI: `LearningLoopStepRail` on `/subjects` topic experience.

See [`docs/design/09_SENECA_ARCHITECTURE_COMPARISON/CODEX-FULL-IMPLEMENTATION-PACK.md`](../../../docs/design/09_SENECA_ARCHITECTURE_COMPARISON/CODEX-FULL-IMPLEMENTATION-PACK.md).
