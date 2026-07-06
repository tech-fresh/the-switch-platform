# Specification Engine Module

Creates the subject-library and board-specific official-specification mapping layer for launch subjects and future expansion.

Service entry: `src/modules/specification-engine/service.ts`
Seed data: `src/data/subjects/mvp-subject-library.json`

## Scope

- MVP student-visible subjects:
  - `gcse-maths`
  - `gcse-english-language`
  - `gcse-combined-science`
  - `igcse-maths`
- Future architecture support:
  - `gcse-biology`
  - `gcse-chemistry`
  - `gcse-physics`

## Current state

- Live-route objective coverage is imported for:
  - `AQA` GCSE Mathematics
  - `Edexcel` GCSE Mathematics
  - `AQA` GCSE English Language
  - `Edexcel` GCSE English Language
  - `AQA` GCSE Combined Science
  - `Edexcel` GCSE Combined Science
  - `Cambridge IGCSE` Mathematics
- Future separate-science architecture is modelled with imported AQA coverage for:
  - `gcse-biology`
  - `gcse-chemistry`
  - `gcse-physics`

## Guardrails

- Combined Science and Separate/Triple Science stay separate routes.
- Official exam-board specifications remain the source of truth for imported objectives.
- Future separate sciences stay modelled but not student-visible until content and inventory are intentionally live.

## Service functions

- `listQualifications()`
- `listExamBoards()`
- `listSubjects()`
- `getSubjectById()`
- `listTopicsBySubject()`
- `listSubtopicsByTopic()`
- `listLearningObjectives()`
- `getLearningObjectiveById()`
- `listScienceAwardTypes()`
- `listCombinedScienceObjectives()`
- `listSeparateScienceObjectives()`
- `validateSubjectLibrary()`
