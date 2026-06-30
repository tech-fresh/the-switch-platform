# Onboarding Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Onboarding Module

Owns guided sign-up and first-time learner setup for **Full End-to-End Completion List item 3**.

Service entry: `src/modules/onboarding/service.ts`  
UI route: `/onboarding` → `src/app/onboarding/onboarding-experience.tsx`

Plain English: onboarding **creates the student dashboard**. Do not shorten or skip steps without an operator override in `HANDOFF.md`. Active plan: [`docs/ideas/FINAL-PHASE-PLAN.md`](../../../docs/ideas/FINAL-PHASE-PLAN.md).

---

## MVP scope (current)

### Qualification routes — selectable now

| Route ID | Label | Subjects from catalog |
|----------|-------|------------------------|
| `gcse-england` | GCSE (England) | Maths, English Language, Combined Science |
| `igcse` | iGCSE | iGCSE Mathematics |

### Qualification routes — coming later (signposted in UI, not selectable)

| Route ID | Label | Status |
|----------|-------|--------|
| `gcse-wales` | GCSE (Wales) | Coming later |
| `gcse-northern-ireland` | GCSE (Northern Ireland) | Coming later |

Constants: `MVP_ONBOARDING_QUALIFICATION_PATHS`, `DEFERRED_ONBOARDING_QUALIFICATION_PATHS` in `service.ts`.

### School capture — secondary only

- Step 3 asks for **secondary school name** (`schoolPhase: "secondary"` on profile).
- **Nation picker (MVP):** UK-wide — `England`, `Scotland`, `Wales`, `Northern Ireland`.
- Official lookup links are clickable inside onboarding:
  [Get Information about Schools](https://www.get-information-schools.service.gov.uk/),
  [Find a school (Scotland)](https://education.gov.scot/parentzone/find-a-school/),
  [My Local School (Wales)](https://mylocalschool.gov.wales/),
  [EA school finder](https://www.eani.org.uk/).
- Wales and Northern Ireland qualification routes still ship in a **later release** — do not re-enable those qualification choices without updating this README and `HANDOFF.md`.

School lookup is now UK-wide, but onboarding still relies on maintained official source-entry points rather than an unmanaged internal school database.

---

## Eight steps (fixed order)

| # | Key | Purpose |
|---|-----|---------|
| 0 | `account-type` | Student / parent / teacher |
| 1 | `qualification` | GCSE (England) or iGCSE — Wales/NI deferred |
| 2 | `profile` | Year group persona |
| 3 | `school` | **Secondary school** name + UK nation picker + official finder links |
| 4 | `subjects` | MVP catalog subjects for chosen route |
| 5 | `support` | Accessibility, access arrangements, SEND signposting |
| 6 | `guardian` | Optional guardian email |
| 7 | `consent` | Age/consent → open dashboard |

On complete: `PUT /api/onboarding/profile` with `complete: true` → `provisionMvpAccessSetupFromOnboarding()` → redirect `/dashboard`.

Incomplete learners hitting `/dashboard` are redirected to `/onboarding`.

---

## Dashboard connection

| Onboarding field | Consumed by |
|------------------|-------------|
| `qualificationPath`, `yearGroup`, `selectedSubjectIds` | `buildDashboardSetupSummary()` |
| Support flags (step 5) | `buildOnboardingSupportSummary()` → dashboard chips + `SendSupportRail` |
| `schoolName`, `schoolPhase`, `schoolNation` | Profile context; future planner/school features |
| Complete profile | Dashboard gate + personalised home |

Dashboard module reads onboarding via `getOnboardingOverview()` — **do not re-ask** the same setup on the dashboard UI.

## Mark 4 planned refinement — Phase 6 complete (30 June 2026)

Phase 6 shipped locally:

- Dashboard-creation framing across all 8 onboarding steps
- `studyGoal` capture on the year-group step
- `examBoard` capture on the board-and-subjects step (seeded boards only)
- Dashboard-ready confirmation on the final step
- `/api/exams/papers` filtered by onboarding profile so Exams stays usable after setup

Implementation constraints that still hold:

- School
- Year Group
- Qualification
- Exam Board
- Subjects
- Accessibility
- Goals
- Dashboard Ready handoff

Implementation constraints:

1. Keep the onboarding flow at 8 steps.
2. Map these inputs into the existing live onboarding architecture rather than creating a separate signup product.
3. `Exam Board` is planned scope, but is **not yet** a fully active locked MVP onboarding field; it must only be introduced where it truthfully fits the current qualification, subject, and exam architecture.
4. The final onboarding state should more clearly communicate that the student's dashboard is now ready.

Current exam-board truth for this planned field:

- Platform exam-board type supports:
  `AQA`, `Edexcel`, `OCR`, `Eduqas`, `WJEC`, `CCEA`, `Cambridge IGCSE`, `Edexcel International GCSE`, `OxfordAQA International GCSE`
- Current seeded exam content in the repo uses:
  `AQA`, `Edexcel`, `Cambridge IGCSE`
- Planned first-class onboarding board menu should be:
  `AQA`, `Pearson Edexcel`, `OCR`, and `Eduqas` for GCSE;
  `Edexcel International GCSE` and `Cambridge IGCSE` for iGCSE
- `WJEC`, `CCEA`, and `OxfordAQA International GCSE` may remain modelled in types, but should stay out of the first-class onboarding menu until matching content pathways are intentionally live
- Access-arrangements planning must keep the governance split explicit:
  JCQ wording for national GCSE boards; Cambridge International wording for Cambridge IGCSE pathways

Planned behavior:

- the learner chooses an exam board during onboarding
- that board choice helps determine which exam content and paper pathways they receive
- that board choice also determines which access-arrangements guidance copy and support signposting they see
- implementation must remain truthful to the exam content that actually exists in the live repo

---

## Agent rules

1. Read `HANDOFF.md` first, then this README.
2. Do not remove Wales/NI from types — they are **deferred**, not deleted.
3. Do not add Wales/NI as selectable routes without operator sign-off and README/HANDOFF update.
4. School step must keep **secondary school** wording and UK official school-finder links during MVP.
5. Business logic stays in `service.ts`; `/onboarding` UI stays thin.

---

## Verification

```bash
npm run test -- tests/onboarding-service.test.mjs
npm run verify:live-onboarding
```

### Live proof classes (appended 26 June 2026)

| Command | Evidence class | Priority letter |
|---------|----------------|-----------------|
| Browser onboarding on production | Strict real-auth **A-4** | Recorded in `release-evidence/2026-06-25-priority-a-truth-audit.md` |
| `npm run verify:live-onboarding` | API-assisted / synthetic only (requires `SWITCH_LAUNCH_VERIFICATION_SECRET`) | Supportive regression — **not** strict A-4; runs outside `verify:priority-a-closeout` strict chain |
| `npm run verify:priority-a-closeout` | Strict real-auth A-6 + A-8 | Latest: `release-evidence/2026-06-26-priority-a-canonical-closeout.md` |
