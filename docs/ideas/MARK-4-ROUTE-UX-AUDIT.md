# Mark 4 Route UX Audit

> **Status:** active execution document  
> **Created:** 2026-06-30  
> **Purpose:** first implementation step for Mark 4 — audit the highest-priority live routes before further UI changes land

Plain English: this is the first practical punch list for Mark 4. It identifies what each route is trying to do, where the current UX still falls short, and which files should be changed first.

## Audit rules

Each route is reviewed against the Mark 4 goals:

- one clear purpose
- one clear primary action
- low cognitive load
- strong mobile behavior
- premium but calm presentation
- no duplicate information
- accessibility-minded interaction

## Priority scale

- `P1` blocks clarity or creates competing decisions on an important route
- `P2` meaningfully weakens flow, consistency, or focus
- `P3` polish improvement that should follow the bigger fixes

## 1. `/dashboard`

### Current purpose

Mission Control for the signed-in student: what to do next, how they are doing, and where to continue.

### Intended primary action

Continue the next best study step.

### What is working

- Mission Control framing now exists
- Hero row gives strong summary signals
- Daily quote is more editorial and premium than before
- Continuity path is clearly surfaced

### Current issues

- `P1` There are still too many medium-priority sections competing below the fold.
  Quick routes, planner, focus cards, recent sessions, and SEND support all compete visually after the main action.
- `P1` The route still contains multiple “next step” style surfaces.
  Hero row, continue-learning card, quick routes, and focus cards all partially answer the same question.
- `P2` The homepage mode and dashboard mode still live in one large file, which makes future cleanup harder.
- `P2` Marketing/homepage styling inside the same component tree still carries older violet-heavy visual language.
- `P3` Some dashboard subcomponents still use mixed tone logic rather than a fully unified route-card system.

### First implementation moves

1. Reduce duplicate decision surfaces below the fold.
2. Keep only one dominant “continue” path and one supporting alternative path.
3. Split home marketing and signed-in dashboard composition into clearer subcomponents.
4. Normalize route-card patterns.

### Primary files

- `src/components/dashboard-home.tsx`
- `src/components/mock-idea/student-app-shell.tsx`
- `src/components/streamlined/mark32-hero-row.tsx`
- `src/components/streamlined/mark32-daily-quote.tsx`
- `src/components/streamlined/mark32-weakest-topics.tsx`

## 2. `/subjects`

### Current purpose

The student’s subject home for revision and practice.

### Intended primary action

Select a topic and continue into learning/practice from the subject flow.

### What is working

- Subject-led practice direction is now explicit
- Subject catalog is clearer than before
- Topic detail is rich and grounded in real data

### Current issues

- `P1` The route asks the user to make too many decisions at once.
  Subject selection, topic selection, revision reading, quiz info, exam context, and action buttons are all visible too early.
- `P1` It does not yet fully embody the Mark 4 subject model:
  `Continue Learning`, `Progress`, `Topics`, `Mock Exam`.
- `P2` Older violet selection styles still appear in parts of the subject/topic controls.
- `P2` Topic content hierarchy is more descriptive than guided.
  It is not yet clearly structured as `Learn -> Worked Example -> Practice -> Exam Questions`.
- `P3` Supporting metrics can feel heavier than the immediate learning task.

### First implementation moves

1. Reframe the page around a subject home structure.
2. Reduce simultaneous controls and introduce stronger section sequencing.
3. Replace remaining legacy selection patterns with the shared Mark 4 control system.
4. Define the topic-flow skeleton for all subjects.

### Primary files

- `src/app/subjects/subject-experience.tsx`
- `src/components/streamlined/mark32-subject-catalog-grid.tsx`
- `src/modules/subjects/*`
- related topic/revision/quiz modules

## 3. `/exams`

### Current purpose

Choose, resume, or review full exam papers.

### Intended primary action

Start or continue the right exam paper.

### What is working

- Cards are readable
- Focus mode is explained
- Resume logic is already present

### Current issues

- `P1` The lobby does not yet match the intended Mark 4 exam-center flow:
  `Subject -> Board -> Tier -> Paper -> Time -> Start Exam`.
- `P2` The route is clear, but still a little flat.
  It is more of a card list than a deliberate exam selection journey.
- `P2` Progress and status are present, but not yet visually strong enough to guide choice quickly.
- `P3` Saved progress is linked as a side action, but the relationship between resume and fresh start could be clearer.

### First implementation moves

1. Introduce a clearer staged selection model without breaking the existing exam engine.
2. Improve exam-card scanability and visual hierarchy.
3. Distinguish fresh-start, continue, and review states more clearly.

### Primary files

- `src/app/exams/exam-lobby-experience.tsx`
- `src/app/exams/exam-experience.tsx`
- `src/modules/exam-engine/*`

## 4. `/progress`

### Current purpose

Show progress, readiness, planner status, and subject-level next steps.

### Intended primary action

Open the next best study route based on current progress.

### What is working

- Power Grid is visible
- Planner and readiness are tied to real data
- Subject-level actions are already connected

### Current issues

- `P1` The page is still too text-heavy for a progress route.
  There are many explanatory panels and detail blocks competing with the visual story.
- `P1` The page lacks a single dominant visual progression summary beyond the Power Grid section.
- `P2` Subject cards are informative but dense.
  Recommended focus, activity counts, readiness, completion, and access snapshots all land at once.
- `P2` The planner, next action, and autosave health areas are useful but could be sequenced more clearly.
- `P3` The route is strong functionally but not yet premium enough visually for the importance of the feature.

### First implementation moves

1. Make the visual story stronger than the explanatory copy.
2. Compress subject cards and move lower-priority detail behind clearer hierarchy.
3. Tighten planner + next-step relationships.
4. Evaluate whether real data supports richer progress visuals.

### Primary files

- `src/app/progress/page.tsx`
- `src/components/streamlined/mark32-power-grid-journey.tsx`
- `src/components/weekly-planner-grid.tsx`
- `src/modules/power-grid/*`
- `src/modules/weekly-planner/*`

## 5. `/`

### Current purpose

Public homepage and entry into the product.

### Intended primary action

Start learning free.

### What is working

- Core CTA path exists
- Marketing sections cover product value
- Device preview helps communicate the product

### Current issues

- `P1` The homepage still contains older visual language that is less aligned with the current Mark 3.2 / Mark 4 system.
- `P1` Hero, mission, trust trio, and marketing sections do not yet feel fully unified as one premium landing experience.
- `P2` The page is informative, but the conversion narrative can be tighter.
- `P2` Violet-heavy styling still dominates parts of the hero and supporting cards.
- `P3` The page would benefit from stronger proof/credibility sequencing without adding clutter.

### First implementation moves

1. Rebuild the homepage hierarchy around one conversion path.
2. Bring the hero and supporting sections onto the same current design system.
3. Refine the narrative: problem -> benefit -> study routes -> trust -> CTA.

### Primary files

- `src/app/page.tsx`
- `src/components/dashboard-home.tsx`
- `src/components/streamlined/mark32-marketing-sections.tsx`
- `src/components/mock-idea/marketing-site-header.tsx`
- `src/components/mock-idea/marketing-site-footer.tsx`

## 6. `/login`

### Current purpose

Low-friction entry into the platform through live auth.

### Intended primary action

Sign in with the preferred provider and continue into the right destination.

### What is working

- Real auth flow is preserved
- Redirect logic is clean
- Admin intent is supported without a separate auth stack

### Current issues

- `P1` The route currently behaves more like a technical access screen than a premium product entry moment.
- `P2` For standard student login, there is limited warm product framing around what happens immediately after sign-in.
- `P2` Admin intent is supported, but the student and admin stories could be separated more cleanly in presentation.
- `P3` The page could do more to reinforce trust, simplicity, and “dashboard ready” momentum without adding extra form complexity.

### First implementation moves

1. Strengthen the login page as a product-entry surface.
2. Make the student path feel calmer and more guided.
3. Keep admin access present but visually secondary unless explicitly requested.

### Primary files

- `src/app/login/page.tsx`
- `src/components/unified-sign-in-card.tsx`
- `src/components/auth-access-path-panel.tsx`
- `src/components/sign-in-brand-mark.tsx`

## 7. `/onboarding`

### Current purpose

Guide the learner through first-time setup so the platform can create a personalised dashboard.

### Intended primary action

Complete the next onboarding step and reach a dashboard-ready state with no ambiguity about what happens next.

### What is working

- The route already gates dashboard access correctly
- The 8-step flow exists and already provisions the student dashboard
- Qualification, school, subjects, and support are already connected to real onboarding data

### Current issues

- `P1` The route is functionally important, but it is not yet explicitly framed as building the learner's dashboard.
- `P1` The requested dashboard-creation setup needs to be more visible in planning:
  `School`, `Year Group`, `Qualification`, `Exam Board`, `Subjects`, `Accessibility`, `Goals`, `Dashboard Ready`.
- `P2` `Exam Board` is not yet a fully active MVP onboarding field, so it needs careful architectural planning before UI work lands.
- `P2` Some onboarding steps can still feel like profile collection rather than a motivating personalised setup journey.
- `P3` The end-state should feel more clearly like “your dashboard is ready” instead of only a completion gate.

### First implementation moves

1. Keep the 8-step architecture locked.
2. Reframe onboarding copy and sequencing around dashboard creation.
3. Plan where `Exam Board` truthfully belongs in the existing qualification/subject/exam model.
4. Add `Goals` and `Dashboard Ready` language to the onboarding implementation backlog without duplicating dashboard setup later.

### Primary files

- `src/app/onboarding/onboarding-experience.tsx`
- `src/modules/onboarding/service.ts`
- `src/modules/onboarding/types.ts`
- `src/modules/onboarding/contracts.ts`

## Ranked first build batch

Recommended first implementation batch from this audit:

1. `/dashboard` hierarchy reduction and primary-action cleanup
2. `/subjects` structure reset around subject-home + topic-flow sequencing
3. `/` homepage conversion and visual-system alignment
4. `/login` premium entry refinement
5. `/progress` visual compression and progress-story improvement
6. `/exams` selection-flow enhancement
7. `/onboarding` dashboard-creation refinement

## Immediate coding recommendation

Start with:

1. `src/components/dashboard-home.tsx`
2. `src/app/subjects/subject-experience.tsx`
3. `src/components/streamlined/mark32-marketing-sections.tsx`
4. `src/app/login/page.tsx`

These four areas will create the biggest visible Mark 4 shift fastest while staying within the current architecture.
