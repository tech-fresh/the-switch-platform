# The Switch Platform

## Mark 3.2 Final MVP Blueprint

Version: 3.2

Status: MVP Development

Owner: Lloyd

Project Type:
GCSE Revision, Progress Tracking and Exam Readiness Platform

## Current Repository Status

This repository now includes the initial Mark 3.2 scaffold:

- Next.js App Router project setup
- TypeScript configuration
- Tailwind CSS configuration
- `src` directory structure
- Module-first architecture placeholders
- Access Arrangements contracts, services, and integration types
- Placeholder app routes for early navigation and build validation

This is a contracts-first foundation build.

It does not yet include:

- Dashboard functionality
- Assessment workflows
- Exam workflows
- Saved progress persistence
- Power Grid calculations
- Production UI implementation

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run the TypeScript check:

```bash
npm run type-check
```

Create a production build:

```bash
npm run build
```

## Current App Routes

- `/`
- `/dashboard`
- `/subjects`
- `/assessments`
- `/exams`
- `/progress`
- `/accessibility`
- `/admin`

These routes are placeholders only and exist to validate the app scaffold.

## Current Folder Structure

```text
src/
  app/
    dashboard/
    subjects/
    assessments/
    exams/
    progress/
    accessibility/
    admin/
  modules/
    auth/
    subjects/
    topics/
    revision/
    quiz/
    timed-assessment/
    exam-engine/
    past-papers/
    power-grid/
    saved-progress/
    recommendations/
    accessibility/
    read-aloud/
    access-arrangements/
    language/
    cms/
  components/
  lib/
  data/
  types/
```

Each module currently includes:

- `types.ts`
- `service.ts`
- `README.md`

## Project Vision

The Switch is a GCSE revision platform designed to help students:

- Learn
- Practise
- Track progress
- Improve
- Become exam ready

The platform must be:

- Mobile first
- SEND friendly
- Accessible
- Modular
- Scalable
- API first
- Web first
- Future app ready

## Core Purpose

Students should always know:

- Where am I?
- How am I doing?
- What should I revise next?
- Am I exam ready?

## Modular MVP Strategy

Every major feature is isolated into its own module.

Modules can:

- Be upgraded independently
- Become premium later
- Be reused in future products
- Be reused in future mobile apps

## Website First Strategy

The Switch launches as a website first.

Requirements:

- Mobile responsive
- Tablet responsive
- Desktop responsive

## App Transition Strategy

```text
Frontend
  -> API Layer
  -> Backend Services
  -> Database

Future Mobile App
  -> Same API Layer
  -> Same Backend
  -> Same Database
```

No business logic should live only in the website frontend.

## Core MVP Modules

1. Dashboard
2. Power Grid Progress
3. Timed Assessments
4. Full GCSE Exam Engine
5. Saved Progress
6. Recommendations
7. Accessibility
8. Read Aloud
9. Language Ready Structure
10. CMS/Admin Placeholder
11. Access Arrangements

## Project Modules

- Authentication
- Subjects
- Topics
- Revision
- Quiz
- Timed Assessment
- Exam Engine
- Past Papers
- Power Grid
- Saved Progress
- Recommendations
- Accessibility
- Read Aloud
- Access Arrangements
- Language
- CMS/Admin

## Launch Subjects

- GCSE Mathematics
- GCSE English Language
- GCSE Combined Science
- Biology
- Chemistry
- Physics

## Power Grid

Levels:

1. Ignition
2. Powered Up
3. Current Flow
4. Voltage Rising
5. Full Circuit
6. High Voltage
7. Grid Master
8. Power Station
9. Switch Legend

Progress Trends:

- Improving: Green arrow
- Stable: Yellow arrow
- Declining: Red arrow

## Exam Engine

Supports:

- AQA
- Edexcel
- OCR
- Eduqas
- WJEC
- CCEA
- Cambridge IGCSE
- Edexcel International GCSE
- OxfordAQA International GCSE

Qualification Types:

- GCSE
- IGCSE
- FunctionalSkills
- EntryLevel
- Level1
- Level2

Exam Tiers:

- FOUNDATION
- HIGHER

Exam Modes:

- Full GCSE Exam
  - Uses official duration
  - Student cannot modify duration
  - Supports future access arrangements
- Manual Timed Assessment
  - Student chooses duration
  - Cannot exceed official duration
  - Supports future access arrangements

## Saved Progress

Stores:

- Current question
- Selected answers
- Written answers
- Notes
- Bookmarks
- Timer state
- Time remaining
- Assessment state
- Exam state
- Active access arrangement settings
- Last activity

## Read Aloud Module

Supports:

- Revision notes
- Questions
- Answers
- Worked examples
- Worked solutions
- Feedback
- Recommendations

Controls:

- Play
- Pause
- Resume
- Stop
- Speed control
- Voice selection

Technology:

- Browser SpeechSynthesis API
- Access Arrangements integration for reader and text-to-speech support

## Accessibility

Required:

- Read Aloud
- Focus Mode
- Text Size Controls
- High Contrast Mode
- Dyslexia Friendly Font
- Line Spacing
- Reduced Distraction Mode
- Access Arrangements integration

## Access Arrangements

The platform architecture must support SEND and exam access arrangements without requiring every SEND feature to be built in the MVP.

Access Arrangement Values:

- EXTRA_TIME_25
- EXTRA_TIME_50
- READER
- SCRIBE
- REST_BREAKS
- COLOURED_OVERLAY
- SEPARATE_ROOM
- TEXT_TO_SPEECH
- LARGE_PRINT

Access Arrangements must integrate with:

- Exam Engine
- Timed Assessment
- Saved Progress
- Read Aloud
- Accessibility

Architecture rules:

- Do not build complex SEND UI during the foundation phase.
- Do not build AI support during the foundation phase.
- Do not build school administration tools during the foundation phase.
- Build module data structures, services, contracts, and integration points first.
- Keep future mobile apps able to reuse these services through APIs.

## Revision Content Structure

1. Explain Simply
2. Standard Explanation
3. Detailed Explanation
4. Worked Examples
5. Common Mistakes
6. Practice Questions
7. Timed Assessment
8. Past Paper Questions
9. Mark Scheme
10. Exam Technique

## API First Strategy

Future APIs:

- Progress API
- Assessment API
- Exam API
- Recommendation API
- Content API
- Accessibility API
- Read Aloud API
- Language API
- Access Arrangements API

Access Arrangements API contracts:

- GET /access-profile/:userId
- PUT /access-profile/:userId
- POST /access-arrangements/apply/assessment
- POST /access-arrangements/apply/exam

## Future Features

Phase 2:

- Interactive Flashcards
- Revision Planner
- Teacher Dashboard
- School Dashboard

Phase 3:

- AI Tutor
- AI Study Coach
- Predicted Grades
- Advanced Analytics

## Success Criteria

A student can:

- Open Dashboard
- View Power Grid
- Complete Timed Assessment
- Complete Full GCSE Exam
- Use Read Aloud
- Save Progress
- Resume Work
- View Results
- Receive Recommendations
- Understand what to revise next
