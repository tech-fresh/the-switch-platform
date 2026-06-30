# Mark 4 UI/UX Implementation Plan

> **Status:** active operator-requested planning lane  
> **Created:** 2026-06-30  
> **Purpose:** turn the attached **The Switch Platform UI/UX Master Guide (MVP) — Mark 4.0** into a repo-safe implementation plan for the live website

Plain English: this plan does **not** replace the current app or reopen closed launch work. It translates the Mark 4.0 design direction into concrete website changes that fit the live Fly / OIDC / SQLite / module-service architecture.

## 1. Guardrails

1. **Do not greenfield-rebuild the platform.** Extend the live repo and existing routes.
2. **Do not reopen closed launch lanes A-D.** Mark 4 is a new product-improvement lane, not a launch-truth reset.
3. **Keep the current auth and persistence architecture.** OIDC (Google/Microsoft) + allowlists + SQLite on Fly remain the live stack.
4. **Keep the current MVP route set unless the operator explicitly expands it.** Existing live routes remain authoritative.
5. **Keep onboarding at 8 steps.** The attached guide's onboarding language must map to the locked MVP onboarding flow.
6. **Business logic stays in modules and APIs.** UI improvements do not move logic into page components.
7. **Study Atelier / Mark 3.2 tokens remain the current implementation base.** Mark 4 may refine the system, but not silently replace it with a conflicting purple/sidebar system.

## 2. Reconciliation With The Attached Mark 4.0 Guide

### Can adopt directly

- Five-item primary student navigation: `Dashboard`, `Subjects`, `Exams`, `Progress`, `Profile`
- Mission Control dashboard model
- One primary action per screen
- Subject-led study structure
- Stronger topic-flow consistency
- Power Grid visibility through the student journey
- Reusable component-only discipline
- Premium, calm, motivating visual direction

### Must be adapted to the live repo

- `Sign Up`
  Live app uses `/login` + OIDC + onboarding, not a separate email-password signup product
- `Email` auth
  Not current live auth; do not add without explicit operator approval
- Public routes `Pricing`, `About`, `Contact`
  Not current canonical MVP public IA; treat as optional future marketing expansion unless explicitly approved
- Admin surfaces `Users`, `Reports`
  Current admin exists, but this must map to real existing admin capabilities rather than inventing a larger SaaS admin
- Brand colour guidance
  Must map to current Study Atelier / Mark 3.2 tokens unless the operator explicitly approves a rebrand pass

### Must not be implemented as written

- Any instruction that implies replacing Fly with Vercel
- Any instruction that implies replacing OIDC with Clerk or credentials auth
- Any instruction that implies replacing SQLite / module persistence with Supabase / Prisma
- Any instruction that implies replacing the top study rail with a fixed left sidebar

## 3. Mark 4 Scope For This Website

### Onboarding and dashboard creation

- Keep onboarding as the required first-time setup after sign-in
- Keep the flow at 8 steps, but make the captured setup more explicitly feel like building the student dashboard
- Plan the first-sign-up setup around these dashboard-creation inputs:
  - school
  - year group
  - qualification
  - exam board
  - subjects
  - accessibility
  - goals
  - dashboard ready handoff
- Important implementation constraint:
  these must map into the existing locked onboarding flow rather than becoming a separate signup product
- Important MVP constraint:
  `Exam Board` is not yet a fully active locked MVP field in the live flow, so it must be treated as planned onboarding scope to be introduced carefully within the existing qualification, subject, and exam architecture
- Important UX rule:
  the student should understand that these questions are what creates their personalised dashboard, not just account administration

### Public marketing

- Refine `/`
- Review whether `/how-it-works`, `/support`, and `/login` need closer visual and IA alignment
- Keep public pages simple, premium, and conversion-oriented

### Student experience

- Deepen the Mission Control dashboard
- Strengthen consistency across `/subjects`, `/exams`, `/progress`, `/results`, `/saved-progress`, `/recommendations`, `/accessibility`, `/account`
- Make subject pages feel like the true revision home
- Make exams and progress more visual and easier to scan

### Topic learning flow

- Standardize the topic experience around:
  `Learn` → `Worked Example` → `Practice` → `Exam Questions`
- Use the same interaction pattern across subjects

### Power Grid and progress

- Keep Power Grid visible and meaningful
- Make progress more visual than tabular
- Tie progression, readiness, and next-step guidance together more tightly

### Accessibility and clarity

- Reinforce WCAG-minded focus states, contrast, motion restraint, and screen-reader clarity
- Keep accessibility controls practical and easy to find

## 4. Implementation Phases

### Phase 1 — IA and route audit

**Goal:** confirm that every current page has one purpose, one primary action, and no duplicated decision-making.

Tasks:

- Audit public routes: `/`, `/how-it-works`, `/support`, `/login`
- Audit student routes: `/dashboard`, `/subjects`, `/exams`, `/progress`, `/saved-progress`, `/results`, `/recommendations`, `/accessibility`, `/account`
- For each route, record:
  - primary user goal
  - primary CTA
  - duplicate or competing UI
  - mobile pain points
  - accessibility concerns

Deliverable:

- Route-by-route UX audit with issues ranked by importance

### Phase 2 — Shared design system hardening

**Goal:** make Mark 4 a reusable system, not a one-off screen polish pass.

Tasks:

- Formalize shared tokens in:
  - `globals.css`
  - `src/components/streamlined/mark32-ui.ts`
- Standardize reusable components for:
  - buttons
  - cards
  - page headers
  - subject cards
  - exam cards
  - quote cards
  - stat cards
  - badges
  - alerts
- Remove remaining route-level styling drift

Deliverable:

- Clean shared component inventory for the current MVP routes

### Phase 3 — Dashboard Mark 4 pass

**Goal:** make `/dashboard` fully satisfy the Mission Control brief.

Tasks:

- Keep only the most important dashboard decisions above the fold:
  - Welcome
  - Daily quote
  - Continue learning
  - Next exam
  - Today's goal
  - Power Grid
  - Weakest topic
- Reduce repeated stats or duplicate cards
- Tighten CTA clarity so the student instantly knows where to go next
- Expand the curated quote library toward the guide's long-term target using the existing motivation module

Deliverable:

- Finalized dashboard hierarchy and daily-quote system direction

### Phase 4 — Subject and topic flow pass

**Goal:** turn `/subjects` into the clear home for revision.

Tasks:

- Make subject pages consistently show:
  - Continue learning
  - Progress
  - Topics
  - Mock exam
- Define a standard topic-page structure for future implementation:
  - Learn
  - Worked Example
  - Practice
  - Exam Questions
- Ensure every subject follows the same interaction pattern

Deliverable:

- Subject-page structure spec mapped to current data and routes

### Phase 5 — Exams and progress visualization pass

**Goal:** make `/exams` and `/progress` more visual, more scannable, and more motivating.

Tasks:

- Refine exam lobby scanability:
  - subject
  - board
  - tier
  - paper
  - time
  - start / continue action
- Improve progress visualization with charts or visual summaries only where real module data supports them
- Keep Power Grid visible across the learning journey
- Prefer visual summaries over dense tables

Deliverable:

- Mark 4 visual pass for exams and progress surfaces

### Phase 6 — Onboarding dashboard-creation pass

**Goal:** make first-time setup feel like a premium Seneca-style dashboard creation journey without breaking the locked MVP onboarding architecture.

Tasks:

- Audit `/onboarding` against the same Mark 4 rules:
  - one clear purpose
  - one clear next action
  - low cognitive load
  - premium but calm presentation
- Reframe onboarding copy around dashboard creation:
  - your school
  - your year group
  - your qualification
  - your exam board
  - your subjects
  - your accessibility needs
  - your goals
  - your dashboard being ready
- Keep the existing 8-step structure, but map the requested fields into that structure cleanly:
  - `School`
  - `Year Group`
  - `Qualification`
  - `Exam Board`
  - `Subjects`
  - `Accessibility`
  - `Goals`
  - final `Dashboard Ready` confirmation state
- Make `Exam Board` a planned onboarding addition only where it is supported by real subject/exam architecture
- Ensure onboarding continues to provision the dashboard rather than duplicating setup later on `/dashboard`
- Keep business logic in:
  - `src/modules/onboarding/service.ts`
  - `src/modules/onboarding/types.ts`
  - onboarding API routes and persistence

Deliverable:

- Mark 4 onboarding plan mapped to the live 8-step architecture, with explicit dashboard-creation fields and implementation constraints

### Phase 7 — Public marketing refinement

**Goal:** bring the homepage and public conversion path up to the same product quality as the student experience.

Tasks:

- Rework homepage sections around:
  - hero
  - benefits
  - subjects
  - how it works
  - student success / proof
  - FAQ
  - footer
- Keep the primary CTA focused: `Start Learning Free`
- Review `/login` so it feels like part of the same premium product journey

Deliverable:

- Cleaner public IA and stronger conversion path without inventing non-MVP pages by default

### Phase 8 — Accessibility and QA hardening

**Goal:** make Mark 4 changes safe, accessible, and production-ready.

Tasks:

- Keyboard navigation review
- Focus-state audit
- Colour contrast audit
- Mobile and tablet review
- Motion restraint review
- Regression tests for changed routes
- Smoke verification after meaningful route changes

Deliverable:

- Release-ready Mark 4 passes with verification evidence

## 5. Recommended Build Order

1. Route audit and issue list
2. Shared tokens and reusable component cleanup
3. Dashboard final hierarchy pass
4. Subject experience and topic-flow structure
5. Exams and progress visual refinement
6. Onboarding dashboard-creation refinement
7. Public marketing refinement
8. Accessibility and QA hardening

## 6. Architecture Blueprint For Full Implementation

Mark 4 must follow the same architectural flow already enforced in the repo:

```text
route/page -> UI component -> module service -> API route -> persistence/runtime
```

### UI layer

- `src/app/*`
  Thin route entry points and page composition only
- `src/components/*`
  Reusable UI primitives and shared product surfaces
- `src/components/streamlined/*`
  Mark 3.2 / Mark 4 shared student and marketing components

### Service layer

- `src/modules/dashboard/*`
  Dashboard summaries, continuity, home data
- `src/modules/subjects/*`
  Subject and topic-oriented learning structure
- `src/modules/exam-engine/*`
  Full paper logic and exam lobby behavior
- `src/modules/timed-assessment/*`
  Checkpoint and timed-practice logic
- `src/modules/power-grid/*`
  Progression, readiness, level, and journey summaries
- `src/modules/saved-progress/*`
  Resume, continuity, autosave state
- `src/modules/results/*`
  Review surfaces and score summaries
- `src/modules/recommendations/*`
  Support-aware next-step guidance
- `src/modules/accessibility/*`
  Student support settings and carry-over
- `src/modules/motivation/*`
  Daily quote library, curation, metadata, and future expansion
- `src/modules/support/*`
  Support hub content and signposting rules
- `src/modules/auth/*`
  OIDC login state, account overview, access path, allowlist behavior
- `src/modules/onboarding/*`
  First-time learner setup, dashboard provisioning, and onboarding completion rules

### API layer

- Existing route handlers under `src/app/api/*`
- Add new APIs only when a module truly needs them
- No page-local data mutations for Mark 4 UI work

### Persistence/runtime layer

- `src/lib/persistence/*`
- Existing runtime and backup discipline remain unchanged
- New data only enters persistence when there is a real product need, not for cosmetic UI state unless it affects continuity

## 7. Code Workstreams By Route

This is the concrete implementation map for the website.

### `/dashboard`

Primary files:

- `src/components/dashboard-home.tsx`
- `src/components/mock-idea/student-app-shell.tsx`
- `src/components/streamlined/mark32-hero-row.tsx`
- `src/components/streamlined/mark32-daily-quote.tsx`
- `src/components/streamlined/mark32-weakest-topics.tsx`
- `src/modules/dashboard/*`
- `src/modules/motivation/service.ts`

Mark 4 work:

- tighten above-the-fold hierarchy
- remove duplicated supporting blocks
- keep one strongest CTA path
- scale quote library and metadata quality
- improve mobile stacking and spacing

### `/subjects`

Primary files:

- `src/app/subjects/subject-experience.tsx`
- `src/components/streamlined/mark32-subject-catalog-grid.tsx`
- `src/modules/subjects/*`

Mark 4 work:

- make subject overview the main revision home
- standardize subject cards and next actions
- map future topic flow into reusable layout slots

### Topic experience inside subjects

Primary files:

- subject/topic rendering files under `src/app/subjects/*`
- `src/modules/subjects/*`
- supporting content modules

Mark 4 work:

- establish one canonical sequence:
  `Learn` -> `Worked Example` -> `Practice` -> `Exam Questions`
- ensure every subject uses the same progression model

### `/exams`

Primary files:

- `src/app/exams/exam-lobby-experience.tsx`
- `src/app/exams/exam-experience.tsx`
- `src/modules/exam-engine/*`
- `src/lib/exams/focus-mode.ts`

Mark 4 work:

- improve lobby scanability
- strengthen CTA hierarchy
- surface progress and readiness more clearly without polluting focus mode

### `/assessments`

Primary files:

- `src/app/assessments/assessment-experience.tsx`
- `src/modules/timed-assessment/*`

Mark 4 work:

- align checkpoint interface with the subject/topic learning flow
- improve timer, autosave, and completion clarity
- reduce visual density where possible

### `/progress`

Primary files:

- `src/app/progress/page.tsx`
- `src/components/streamlined/mark32-power-grid-journey.tsx`
- `src/components/weekly-planner-grid.tsx`
- `src/modules/power-grid/*`
- `src/modules/weekly-planner/*`

Mark 4 work:

- make progress more visual than descriptive
- tighten relationship between readiness, planner, and Power Grid
- introduce richer visuals only if they are backed by real module data

### `/saved-progress`, `/results`, `/recommendations`

Primary files:

- `src/app/saved-progress/saved-progress-experience.tsx`
- `src/app/results/results-experience.tsx`
- `src/app/recommendations/recommendations-experience.tsx`
- `src/modules/saved-progress/*`
- `src/modules/results/*`
- `src/modules/recommendations/*`

Mark 4 work:

- simplify review decisions
- emphasize continuity and next action
- remove duplicate explanatory content

### `/accessibility` and `/account`

Primary files:

- `src/app/accessibility/accessibility-experience.tsx`
- `src/app/account/account-experience.tsx`
- `src/modules/accessibility/*`
- `src/modules/auth/*`

Mark 4 work:

- keep support tools practical and easy to scan
- improve plain-language explanations
- keep profile/account actions secondary to the main student study journey

### `/onboarding`

Primary files:

- `src/app/onboarding/onboarding-experience.tsx`
- `src/modules/onboarding/service.ts`
- `src/modules/onboarding/types.ts`
- `src/modules/onboarding/contracts.ts`

Mark 4 work:

- keep the 8-step flow
- make onboarding feel like creating a dashboard, not filling in admin details
- explicitly plan for:
  - school
  - year group
  - qualification
  - exam board
  - subjects
  - accessibility
  - goals
  - dashboard ready handoff
- only introduce `Exam Board` where it can truthfully map to current subject and exam architecture

### Public routes `/`, `/how-it-works`, `/support`, `/login`

Primary files:

- `src/app/page.tsx`
- `src/app/how-it-works/page.tsx`
- `src/app/support/page.tsx`
- `src/app/login/*`
- `src/components/mock-idea/marketing-site-header.tsx`
- `src/components/mock-idea/marketing-site-footer.tsx`
- `src/components/streamlined/mark32-marketing-sections.tsx`

Mark 4 work:

- improve conversion clarity
- make public pages feel like the same product as the student experience
- simplify copy and CTA structure
- keep `/login` premium, calm, and low-friction

## 8. Component System Action Plan

The component layer should be hardened in this order:

1. `mark32-ui.ts`
   Normalize cards, buttons, links, eyebrow text, surfaces, and focus styles
2. `Mark32PageHeader`
   Standardize page intros, supporting stats, and optional asides
3. Route cards
   Shared pattern for subject, exam, recommendation, and continuity cards
4. Quote card
   Make daily motivation a first-class reusable surface
5. Progress visuals
   Shared patterns for readiness, level, planner, and status summaries
6. Alerts/recovery
   Keep empty states and recovery guidance visually aligned

## 9. Data And Content Plan

Mark 4 is not only visual. Some work requires content and data improvements.

### Motivation library

- grow the curated quote set over time toward the long-term target
- keep verified attribution
- maintain age-appropriate selection
- preserve geographic and domain diversity

### Subject/topic structure

- ensure subject summaries consistently expose:
  - continue path
  - progress signal
  - topics
  - mock exam path

### Support and accessibility copy

- reduce jargon
- keep urgent-support boundaries clear
- keep educational and safeguarding copy easy for students to understand

## 10. Verification Plan

Every Mark 4 implementation slice should follow this verification rhythm:

### Minimum for component or doc-only planning work

- `npm run lint`
- `npm run type-check`

### Minimum for route UI changes

- `npm run lint`
- `npm run type-check`
- `npm run test`

### Additional when route behavior or navigation changes

- `npm run test:smoke`
- route-specific rehearsal scripts where relevant

### Before deployment of a meaningful Mark 4 batch

- `npm run verify:local-launch-readiness`
- `npm run deploy:fly`

## 11. Delivery Sequence For Complete Implementation

This is the recommended full execution sequence for bringing Mark 4 into the live website:

1. Complete the route-by-route UX audit
2. Convert audit into a ranked implementation backlog
3. Harden shared tokens and reusable components
4. Finalize dashboard Mission Control hierarchy
5. Refine subject experience and topic-flow structure
6. Upgrade exams and progress visualization
7. Clean up continuity routes: saved progress, results, recommendations
8. Refine accessibility and account clarity
9. Refine onboarding dashboard-creation journey
10. Refine public routes and login journey
11. Run accessibility and responsive QA pass
12. Re-run verification suite
13. Deploy to Fly and record the build in docs

## 12. Definition Of Done For A Mark 4 Page

A page is only complete when:

- It has one clear purpose
- It has one primary action
- It uses shared approved components
- It follows the current approved colour and spacing system
- It works on mobile, tablet, and desktop
- It removes duplicate information
- It is accessible and keyboard-usable
- It preserves current MVP behavior
- It is verified with the appropriate repo checks

## 13. Immediate Next Step

**Recommended next execution task:** continue **Phase 7 — public marketing refinement**, then merge the Mark 4 batch and deploy.

**First build batch status (30 June 2026):**

| Route / phase | Status |
|-------|--------|
| `/dashboard` | Complete |
| `/subjects` | Complete |
| `/` | Complete |
| `/login` | Complete |
| `/progress` | Complete |
| `/exams` | Complete |
| Phase 6 `/onboarding` | Complete — dashboard creation, exam board, study goals, exam filtering |

Verification for Phase 6: `npm run lint`, `npm run type-check`, `npm run test` (`172/172`).
