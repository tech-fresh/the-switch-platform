# Onboarding Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Onboarding Module

Owns guided sign-up and first-time learner setup for **Full End-to-End Completion List item 3**.

Service entry: `src/modules/onboarding/service.ts`  
UI route: `/onboarding` → `src/app/onboarding/onboarding-experience.tsx`

Plain English: onboarding **creates the student dashboard**. Do not shorten or skip steps without an operator override in `HANDOFF.md`. See also [`docs/ideas/STREAMLINE-WEBSITE-PLAN.md`](../../../docs/ideas/STREAMLINE-WEBSITE-PLAN.md).

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
- **Nation picker (MVP):** England only — `MVP_ONBOARDING_SCHOOL_NATIONS`.
- Official lookup: [Get Information about Schools](https://www.get-information-schools.service.gov.uk/) (England).
- Wales and Northern Ireland school/qualification routes ship in a **later release** — UI shows a “Coming later” note; do not re-enable without updating this README and `HANDOFF.md`.

Scotland, Wales, and Northern Ireland **school source links** remain in `SCHOOL_SOURCES` for future use; only England is active in the MVP school step.

---

## Eight steps (fixed order)

| # | Key | Purpose |
|---|-----|---------|
| 0 | `account-type` | Student / parent / teacher |
| 1 | `qualification` | GCSE (England) or iGCSE — Wales/NI deferred |
| 2 | `profile` | Year group persona |
| 3 | `school` | **Secondary school** name + England nation |
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

---

## Agent rules

1. Read `HANDOFF.md` first, then this README.
2. Do not remove Wales/NI from types — they are **deferred**, not deleted.
3. Do not add Wales/NI as selectable routes without operator sign-off and README/HANDOFF update.
4. School step must keep **secondary school** wording and England-only nation picker during MVP.
5. Business logic stays in `service.ts`; `/onboarding` UI stays thin.

---

## Verification

```bash
npm run test -- tests/onboarding-service.test.mjs
npm run verify:live-onboarding
```
