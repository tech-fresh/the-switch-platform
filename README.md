# The Switch Platform

## Mark 3.2 MVP

The Switch is a GCSE revision, timed practice, progress tracking, and exam-readiness platform.

This repository is the current website-first MVP foundation. It is being built so a student can:

1. Open a revision or exam route.
2. Start a timed session.
3. Have their work auto-saved.
4. Leave and come back later.
5. See progress and readiness signals in plain language.

The codebase is still using mock data and in-memory persistence, but it now has a real architecture shape and several connected routes instead of only placeholders.

## What Has Been Built So Far

The project now includes:

- A Next.js App Router frontend
- TypeScript across the app and modules
- Tailwind CSS styling
- A modular service-first architecture
- A proper root home screen at `/`
- A student dashboard at `/dashboard`
- A working mock exam experience at `/exams`
- A working mock timed assessment experience at `/assessments`
- A working mock progress view at `/progress`
- Saved progress foundations for exams and timed assessments
- Power Grid progress calculations
- Access arrangements foundations and integration contracts
- Module READMEs that explain ownership and boundaries

## What The Project Looks Like Right Now

### Implemented routes

These routes now have meaningful UI and connected data:

- `/`
- `/dashboard`
- `/exams`
- `/assessments`
- `/progress`

### Placeholder routes

These routes exist in the app structure but are still simple placeholders:

- `/subjects`
- `/accessibility`
- `/admin`

## Simple Architecture Explanation

Think of the project in layers:

```text
Student sees screen
        |
        v
App Route / UI
        |
        v
Shared UI component
        |
        v
Module service
        |
        v
Saved state / calculated result
```

In plain English:

- `src/app` contains route files
- `src/components` contains reusable UI
- `src/modules` contains feature rules and service logic
- the UI asks modules for data
- the UI should not own core business rules

That matters because later:

- a real API layer can call the same module logic
- a future mobile app can reuse the same backend rules
- exam logic stays separate from progress logic
- saved progress stays separate from content rules

## Current Project Flow

### Whole platform flow

```text
Home / Dashboard
       |
       v
Dashboard Module
       |
       +-------------------------+
       |                         |
       v                         v
Exam Engine               Timed Assessment
       |                         |
       +------------+------------+
                    |
                    v
             Saved Progress
                    |
                    v
         Access Arrangement Snapshot
                    |
                    v
               Power Grid
                    |
                    v
         Progress + dashboard signals
```

### Exam flow

```text
/exams
  -> exam-engine/service.ts
  -> access-arrangements/service.ts
  -> saved-progress/service.ts
  -> exam session returned
  -> exam UI renders session
```

What this means:

- exam timing rules belong to the exam engine
- access arrangements can adjust duration
- saved progress can restore a previous session
- the UI only shows the session result

### Timed assessment flow

```text
/assessments
  -> timed-assessment/service.ts
  -> official duration cap enforced
  -> access-arrangements/service.ts
  -> saved-progress/service.ts
  -> assessment attempt returned
  -> assessment UI renders attempt
```

What this means:

- the student can choose a shorter manual duration
- the duration cannot exceed the official cap
- that rule is enforced in the service layer
- the attempt can be restored from saved progress

### Progress flow

```text
Exam session data + Assessment attempt data
                    |
                    v
             power-grid/service.ts
                    |
                    v
       readiness score + trend + next action
                    |
                    v
          /progress, /, and /dashboard
```

What this means:

- progress logic is not mixed into exam logic
- Power Grid translates activity into student-facing signals
- dashboard and home routes consume those signals

## Current Route Breakdown

### `/`

This is now the proper home screen for the platform.

It currently shows:

- platform introduction
- key platform metrics
- route launch cards
- exam session summary cards
- timed assessment summary cards
- subject focus cards
- a recommended next action

This route uses:

- `src/app/page.tsx`
- `src/components/dashboard-home.tsx`
- `src/modules/dashboard/service.ts`

### `/dashboard`

This is now the student dashboard route.

It uses the same dashboard aggregation layer as the home route, but frames the experience as the student home surface.

It currently shows:

- overall readiness
- active sessions
- subject focus
- route launch points
- saved-support snapshot messaging

### `/exams`

This is the first substantial exam workflow route.

It currently shows:

- mock GCSE papers
- paper switching
- question-by-question exam flow
- autosave timestamp feedback
- flagged questions
- completion percentage
- progress map behaviour
- seeded resume state
- access-arrangement-aware duration handling

### `/assessments`

This is the first substantial timed assessment workflow route.

It currently shows:

- timed assessment selection
- duration presets
- official duration caps
- adjusted duration after access arrangements
- current question resume point
- notes and bookmarks summary
- saved progress state

### `/progress`

This route currently proves that Power Grid logic can be kept separate from exam and assessment logic.

It currently shows:

- overall level
- readiness score
- active session counts
- subject-level readiness
- trend indicators
- recommended focus
- next best action

## Current Modules And Their Status

### Modules with real working foundations

#### `dashboard`

Purpose:

- combines data from other modules for home-style routes

Current work done:

- route launch cards
- aggregated metrics
- exam and assessment session summaries
- subject focus summaries

#### `exam-engine`

Purpose:

- owns exam mode rules and official exam timing

Current work done:

- mock GCSE paper definitions
- exam session creation
- seeded responses
- resume hydration from saved progress
- access arrangement aware duration handling

#### `timed-assessment`

Purpose:

- owns manual timed assessment attempt behaviour

Current work done:

- timed assessment definitions
- attempt creation
- duration preset handling
- official duration capping
- access arrangement aware timing
- resume hydration from saved progress

#### `saved-progress`

Purpose:

- owns save and resume state

Current work done:

- saved progress record types
- exam progress payloads
- timed assessment progress payloads
- in-memory repository
- save helpers
- resume helpers
- status tracking
- access arrangement snapshots

#### `power-grid`

Purpose:

- owns progress calculations and level mapping

Current work done:

- Power Grid levels
- trend mapping
- subject progress summaries
- overall readiness scoring
- next-best-action generation

#### `access-arrangements`

Purpose:

- owns access arrangement contracts and adjustment logic

Current work done:

- student access profile model
- duration adjustment logic
- read aloud configuration
- accessibility preference mapping
- saved progress snapshot generation
- framework-neutral API contracts

### Modules that currently exist mostly as boundaries and scaffolding

These modules are present to preserve architecture, but do not yet have substantial product logic in the repo:

- `accessibility`
- `auth`
- `cms`
- `language`
- `past-papers`
- `quiz`
- `read-aloud`
- `recommendations`
- `revision`
- `subjects`
- `topics`

This is intentional. The architecture is being preserved before every feature is fully built.

## Important Files To Understand

If you want to learn the project by reading code, start here:

- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/components/dashboard-home.tsx`
- `src/app/exams/page.tsx`
- `src/app/exams/exam-experience.tsx`
- `src/app/assessments/page.tsx`
- `src/app/assessments/assessment-experience.tsx`
- `src/app/progress/page.tsx`
- `src/modules/dashboard/service.ts`
- `src/modules/exam-engine/service.ts`
- `src/modules/timed-assessment/service.ts`
- `src/modules/saved-progress/service.ts`
- `src/modules/power-grid/service.ts`
- `src/modules/access-arrangements/service.ts`

## Current Folder Structure

```text
src/
  app/
    accessibility/
    admin/
    assessments/
    dashboard/
    exams/
    progress/
    subjects/
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard-home.tsx
  modules/
    access-arrangements/
    accessibility/
    auth/
    cms/
    dashboard/
    exam-engine/
    language/
    past-papers/
    power-grid/
    quiz/
    read-aloud/
    recommendations/
    revision/
    saved-progress/
    subjects/
    timed-assessment/
    topics/
```

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run the type check:

```bash
npm run type-check
```

Build the production version:

```bash
npm run build
```

## What Is Real Versus Mock Right Now

### Real in the codebase

- route structure
- service boundaries
- data types
- module ownership
- autosave data shapes
- readiness calculation flow
- access arrangement adjustment flow
- connected UI routes for dashboard, exams, assessments, and progress

### Still mock or temporary

- exam paper content
- assessment content
- saved progress storage
- student profiles
- route data source
- results engine
- recommendations engine
- accessibility UI
- admin and CMS workflows

## What Still Needs To Be Built

The project is still missing:

- real database persistence
- a real API layer between frontend and backend services
- real authentication
- full subject and topic flows
- recommendations logic
- accessibility settings UI
- read aloud UI and browser integration
- results workflows
- full GCSE exam mode expansion
- future mobile-ready backend delivery layer

## Why The README Is Written This Way

This README is meant to help you learn the project when you open it on GitHub.

It tells you:

- what has already been built
- what is still placeholder-only
- which modules own which rules
- where to read first if you want to understand the code

That way the repository is easier to read as both a product build and a learning project.
