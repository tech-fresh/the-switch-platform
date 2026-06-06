# The Switch Platform

## Mark 3.2 MVP

The Switch is a GCSE revision and exam-readiness platform.

The current codebase is a website-first MVP with an API-first structure behind it. The main idea is simple:

1. A student starts an exam or timed assessment.
2. Their work is auto-saved.
3. They can come back later and continue.
4. Their activity feeds progress and readiness summaries.

## What This Repo Does Right Now

The repo has moved beyond placeholders in a few important areas:

- `/exams` now shows a mock exam experience.
- `/assessments` now shows a mock timed assessment experience.
- `/progress` now shows Power Grid readiness data.
- `/dashboard` now pulls data from active modules instead of being blank.
- `saved-progress` now stores exam and timed assessment session state.
- `power-grid` now turns activity into progress summaries.

This is still mock-data driven, but the module boundaries are now much clearer.

## Beginner-Friendly Architecture

Think of the app in 4 layers:

```text
Student taps screen
        |
        v
Route / UI
        |
        v
Module service
        |
        v
Saved data / module result
        |
        v
UI shows updated state
```

In this project:

- `src/app/...` is the website UI.
- `src/modules/...` is where feature logic lives.
- Services inside modules do the real work.
- The UI should ask services for data, not own the core rules itself.

## Current Module Flow

### Exam Engine Flow

```text
/exams page
  -> exam-engine/service.ts
  -> access-arrangements module adjusts official duration
  -> saved-progress/service.ts checks for previous work
  -> exam session is returned to the page
  -> UI renders resume-ready exam state
```

Plain English:

- The exam page does not decide exam timing rules itself.
- The exam engine creates the session.
- Access arrangements can change the allowed duration.
- Saved progress can restore previous answers.
- The page just displays the final result.

### Timed Assessment Flow

```text
/assessments page
  -> timed-assessment/service.ts
  -> duration preset chosen
  -> official cap enforced
  -> access arrangements applied
  -> saved-progress/service.ts restores attempt if it exists
  -> UI shows the attempt
```

Plain English:

- The student can choose a shorter timed assessment.
- The chosen time cannot go over the official limit.
- The service owns that rule, not the page.
- The saved progress module handles resume data.

### Progress Flow

```text
exam sessions + timed assessments
              |
              v
      power-grid/service.ts
              |
              v
 readiness score + trend + next action
              |
              v
        /progress and /dashboard
```

Plain English:

- Progress is calculated in the Power Grid module.
- It reads activity from exam and assessment modules.
- It converts that activity into simple student-facing signals like:
  - readiness score
  - trend
  - what to revise next

## Why The Module Split Matters

This project has strict boundaries on purpose.

- `exam-engine` owns exam logic.
- `timed-assessment` owns manual assessment attempt logic.
- `saved-progress` owns save and resume state.
- `power-grid` owns progress calculations.
- `access-arrangements` owns support adjustments and snapshots.

That means:

- exam logic is not trapped in the frontend
- progress logic is not mixed into exam logic
- save/resume logic is reusable
- a future mobile app can call the same services through an API layer

## Current Routes

- `/`
- `/dashboard`
- `/subjects`
- `/assessments`
- `/exams`
- `/progress`
- `/accessibility`
- `/admin`

The most meaningful routes right now are:

- `/exams`
- `/assessments`
- `/progress`
- `/dashboard`

## Current Folder Structure

```text
src/
  app/
    assessments/
    dashboard/
    exams/
    progress/
  modules/
    access-arrangements/
    exam-engine/
    power-grid/
    saved-progress/
    timed-assessment/
    ...
  components/
  data/
  lib/
```

## What Changed In This Iteration

### 1. Dashboard is now connected

Before:

- dashboard was a placeholder

Now:

- dashboard shows overall level
- dashboard shows readiness score
- dashboard shows active session counts
- dashboard links into exams, assessments, and progress

### 2. Progress is now real enough to demonstrate the architecture

Before:

- progress was a placeholder

Now:

- Power Grid calculates subject summaries
- readiness scores are generated from mock exam and assessment activity
- trend labels are generated
- the system suggests a next revision action

### 3. Saved Progress now has real structure

It now stores:

- entity type
- status
- last activity timestamp
- access arrangement snapshot
- exam progress payload
- timed assessment progress payload

This matters because save/resume is one of the core MVP requirements.

### 4. Timed Assessments now prove rule ownership

The timed assessment module now handles:

- assessment definitions
- selected duration
- official duration caps
- access arrangement-aware adjusted durations
- seeded resume state

### 5. Exam sessions now support resume-aware loading

The exam engine now:

- creates seeded sessions
- applies access arrangements
- checks for saved progress
- rehydrates previous answers if they exist
- saves the current state back through the saved progress module

## One Simple Diagram For The Whole MVP Slice

```text
            +------------------+
            |   Dashboard UI   |
            +--------+---------+
                     |
                     v
     +---------------+----------------+
     |        Power Grid Module       |
     +---------------+----------------+
                     ^
                     |
      +--------------+--------------+
      |                             |
      v                             v
+-------------+             +------------------+
| Exam Engine |             | Timed Assessment |
+------+------+             +---------+--------+
       |                              |
       +--------------+---------------+
                      |
                      v
            +---------+---------+
            |  Saved Progress   |
            +---------+---------+
                      |
                      v
            +---------+---------+
            | Access Snapshots  |
            +-------------------+
```

How to read it:

- Exams and timed assessments create activity.
- Saved Progress stores the student state.
- Power Grid turns that activity into progress signals.
- Dashboard and Progress pages show those signals.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run type checking:

```bash
npm run type-check
```

Build production output:

```bash
npm run build
```

## What Is Still Missing

This repo is not finished. It still needs:

- real database persistence
- a real API layer between frontend and backend services
- proper results workflows
- recommendation logic
- accessibility settings integration beyond the current foundations
- full GCSE exam mode expansion

## How I’ll Keep Future Git Pushes Easier To Learn

When I make future commits for you, I will keep them understandable by:

- using plain-English commit messages
- updating README or module docs when architecture changes
- explaining which module owns which rule
- adding simple diagrams when the flow is easier to see than describe

That way the Git history becomes part of your learning material, not just a list of file changes.
