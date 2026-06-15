# Access Arrangements Module

The Access Arrangements module provides the Mark 3.2 architecture foundation for SEND and exam access arrangements.

It does not build complex SEND UI, AI support, or school administration tools. It defines reusable data models, service contracts, and integration points so the MVP can stay simple while future website, API, and mobile app features can reuse the same access arrangement logic.

## Scope

This module supports:

- Exam Engine integration
- Timed Assessment integration
- Saved Progress snapshots
- Read Aloud configuration
- Accessibility preference configuration
- Future API reuse

## Access Arrangement Values

- `EXTRA_TIME_25`
- `EXTRA_TIME_50`
- `READER`
- `SCRIBE`
- `REST_BREAKS`
- `COLOURED_OVERLAY`
- `SEPARATE_ROOM`
- `TEXT_TO_SPEECH`
- `LARGE_PRINT`

## Qualification Types

- `GCSE`
- `IGCSE`
- `FunctionalSkills`
- `EntryLevel`
- `Level1`
- `Level2`

## Exam Tiers

- `FOUNDATION`
- `HIGHER`

## Exam Boards

- `AQA`
- `Edexcel`
- `OCR`
- `Eduqas`
- `WJEC`
- `CCEA`
- `Cambridge IGCSE`
- `Edexcel International GCSE`
- `OxfordAQA International GCSE`

## Service Functions

- `calculateExamDurationWithAccessArrangements()`
- `getStudentAccessProfile()`
- `updateStudentAccessProfile()`
- `applyAccessArrangementsToAssessment()`
- `applyAccessArrangementsToExam()`

## API Contracts

The module is framework-neutral. Future web and mobile apps should call an API layer that uses these contracts:

- `GET /access-profile/:userId`
- `PUT /access-profile/:userId`
- `POST /access-arrangements/apply/assessment`
- `POST /access-arrangements/apply/exam`

Contract types live in `contracts.ts` and should be reused by route handlers, clients, and tests.

## Integration Points

### Exam Engine

Full GCSE Exam Mode should pass official exam duration, qualification type, board, tier, exam id, and user id into `applyAccessArrangementsToExam()`.

The Exam Engine remains responsible for exam rules. This module only returns adjusted duration, rest break capability, Read Aloud settings, accessibility settings, and a Saved Progress snapshot.

API integration should use `ExamEngineAccessArrangementContract`.

### Timed Assessments

Manual Timed Assessment should pass selected duration and maximum official duration into `applyAccessArrangementsToAssessment()`.

The selected duration is capped at the official maximum before access arrangements are applied.

API integration should use `TimedAssessmentAccessArrangementContract`.

### Saved Progress

Saved Progress should store the `savedProgressSnapshot` returned by this module alongside assessment or exam state.

The snapshot records the active arrangements and preferences at the time progress was saved.

API integration should use `SavedProgressAccessArrangementContract`.

### Read Aloud

Read Aloud should use the returned `readAloud` configuration.

`READER` and `TEXT_TO_SPEECH` arrangements enable Read Aloud through the access arrangement source. Student preference can also enable text to speech without a formal access arrangement.

API integration should use `ReadAloudAccessArrangementContract`.

### Accessibility

Accessibility should use the returned `accessibility` preferences to apply font size, colour scheme, line spacing, focus mode, high contrast mode, large print, and reduced distraction settings.

API integration should use `AccessibilityAccessArrangementContract`.

## Future SEND Features Enabled

- Formal access profile management
- API-backed access arrangement storage
- Parent, teacher, or school approval workflows
- Rest break timer controls
- Separate room metadata
- Scribe workflows
- Coloured overlay themes
- Large print exam rendering
- Reader/Text-to-Speech entitlement checks
- Audit trail for access arrangement changes
- Mobile app reuse of the same access arrangement services
