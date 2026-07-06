# Architecture Principles — Connected Learning System (Documentation Only)

> **Status:** long-term product architecture guidance  
> **Updated:** 2026-07-06  
> **Scope:** Mark 3.2 / Mark 4 MVP — extend existing systems; do not replace them

These principles were identified during a Seneca-inspired architecture comparison. They are **Switch-native** product rules for future implementation. **No code in this document.**

**Non-negotiable preservation:** Fly deployment · OIDC auth · SQLite persistence · 8-step onboarding · module/service/API architecture · existing Power Grid XP mechanics.

---

## 8. Modular architecture (foundation — always enforce)

Business logic belongs inside modules. Never inside page components. Pages remain thin.

```text
Route → Page → Module → API → Persistence
```

Never place in UI pages or route components:

- Power Grid calculations
- Recommendation ranking logic
- Exam or assessment scoring
- XP or progression calculations
- Recall Strength / memory calculations
- Saved Progress normalization

UI reads module outputs via API only. This gate is unchanged from `PLATFORM-GUIDE.md`.

---

## 1. Connected Website Principle

The entire website operates as **one connected learning system**.

Every page must naturally lead the learner to the **next logical action**. There should never be a dead end.

Every signed-in route should end with **one primary CTA**. Secondary actions stay visually quieter.

### Standard next-action vocabulary

Use consistent labels where module data supports them:

| Next action | Typical source module |
|-------------|----------------------|
| Continue Learning | Saved Progress · Dashboard |
| Resume Saved Work | Saved Progress |
| Practise Weak Topic | Power Grid · Recommendations |
| Start Timed Assessment | Timed Assessment |
| Start Exam Paper | Exam Engine |
| Review Mistakes | Results |
| Improve Power Grid | Power Grid · `/progress` |
| Return to Dashboard | Dashboard |

### Route rule

If a student finishes a task on any signed-in route, the page must answer: **“What should I do next?”** with a single dominant link — not a wall of equal cards.

Recovery routes (`StudentRouteRecovery`) remain the exception for degraded data states.

---

## 2. Recall Strength System (future — document only)

Research and design a **Switch-branded** learning-memory system inspired by spaced repetition. **Do not use Seneca terminology.**

### Working name: **Recall Strength**

Recall Strength is the platform’s model for how well a learner remembers a topic over time — separate from one-off quiz scores and separate from Seneca’s naming.

**Switch-branded naming options** (not yet canonical — see [`07_RECOMMENDATION_ADDENDUM.md`](./07_RECOMMENDATION_ADDENDUM.md)): Switch Strength, Recharge Time, Power Boost Review, Circuit Check. Operator picks one term set before implementation.

### Requirements (future implementation)

| Requirement | Notes |
|-------------|-------|
| Fits inside Power Grid | Surfaces on `/progress` and subject cards; feeds XP/voltage presentation where appropriate |
| Improves revision scheduling | Works with Weekly Planner and recommendation timing |
| Tracks confidence / mastery | Per-topic signal alongside readiness score |
| Resurfaces weaker topics | Automatic weak-topic prompts on Dashboard and Recommendations |
| Works with Recommendations | Ranking input — not a separate silo |
| Integrates with Saved Progress | Resume state informs “last practised” and decay |

### Explicitly not in MVP today

- No new persistence schema in this documentation pass
- No new API routes
- No UI beyond existing readiness / weak-topic signals

Future work lives in **`src/modules/recommendations/`** and **`src/modules/power-grid/`** with a dedicated Recall Strength module or sub-service only after operator approval.

---

## 3. Power Grid as the main progression engine

Power Grid is the **central motivation system** — the student’s visual journey through the platform.

Everything feeds into Power Grid:

- Lessons and topic content
- Quizzes
- Timed assessments
- Full exams
- Saved progress (continuity and completion)
- Recommendations (next steps completed)
- Mastery and readiness signals
- Recall Strength (future)
- Revision streaks

Presentation today: six milestone ranks + internal Power Levels from existing `xpTotal` (`src/lib/power-grid/rank-presentation.ts`). Backend XP rules remain authoritative in `src/modules/power-grid/service.ts`.

Power Grid must stay visible across Dashboard, sidebar, `/progress`, and subject flows — not only on the progress route.

---

## 4. Learning Loop Standard

All learning content should follow the **same loop**. Avoid long textbook pages. Prioritise active learning.

```text
Learn
  ↓
Question
  ↓
Immediate Feedback
  ↓
Progress Update
  ↓
Next Question OR Next Topic
  ↓
Power Grid Update
  ↓
Recommendation
```

### Implementation mapping (live repo)

| Loop stage | Current home |
|------------|--------------|
| Learn | `/subjects` topic content |
| Question | `PremiumQuizCard` · quiz API |
| Immediate Feedback | `/api/quiz/attempts/[topicId]` |
| Progress Update | Power Grid · Saved Progress |
| Next step | Recommendations · Dashboard `nextBestAction` |
| Power Grid Update | `power-grid/service.ts` |
| Recommendation | `recommendations/service.ts` |

Future topic pages should move toward: Learn → Worked Example → Practice → Exam Questions (Mark 4 Phase 4) without breaking this loop.

---

## 5. Dashboard Simplification Rule

The signed-in dashboard must stay **uncluttered**.

### Primary above-the-fold signals only

1. **Continue Learning**
2. **Weak Topic**
3. **Next Exam Task**
4. **Power Grid Progress**

Everything else is **secondary**: planner, quote, route cards, SEND rail, recent sessions, marketing cross-links.

Avoid equal-weight cards competing for attention. The student should instantly know what to do next.

Mark 4 audit note: below-fold duplicate “next step” surfaces remain a P1 cleanup item (`docs/ideas/MARK-4-ROUTE-UX-AUDIT.md` → `/dashboard`).

---

## 6. Recommendations as the brain

Recommendations should become the platform’s **decision engine** — ranking what the learner should do next across the entire website.

### Future ranking inputs

| Signal | Source |
|--------|--------|
| Onboarding choices | `onboarding` profile |
| Qualification · exam board | Onboarding · specification engine |
| Saved work | Saved Progress |
| Weakest topics | Power Grid |
| Confidence / mastery | Power Grid · quiz progress |
| Recall Strength | Future module |
| Exam proximity | Exam inventory · planner |
| Power Grid status | Power Grid summary |
| Recent activity | Dashboard · saved sessions |
| Revision streak | Weekly planner · motivation |
| Accessibility settings | Accessibility module |

Recommendations drive navigation: Dashboard CTAs, subject entry, post-quiz next steps, and recovery fallbacks should prefer **`recommendations/service.ts`** outputs over ad-hoc page logic.

---

## 7. Saved Progress as the glue

Saved Progress is the **central continuity service** — nothing should feel disconnected.

```text
Dashboard → Subjects → Lessons → Practice → Timed Assessments
    → Exam Engine → Results → Power Grid → Recommendations → Dashboard
```

Students must always be able to **resume where they left off**.

Saved Progress connects:

- Active exam and assessment attempts
- Autosave snapshots and access arrangement settings
- Resume pointers on Dashboard and Power Grid `nextBestAction`
- Results handoff after submit (no rollback into live attempts)

Do not duplicate continuity logic in page components — consume Saved Progress via module API.

---

## Verification checklist for future work

Before merging journey or progression changes, confirm:

- [ ] One primary CTA per signed-in route terminus
- [ ] No new business logic in `src/app/**/page.tsx` or experience components
- [ ] Power Grid updated or read from module — not recalculated in UI
- [ ] Recommendations or Power Grid supply next-step href — not hard-coded duplicates
- [ ] Saved Progress remains the resume source of truth
- [ ] Dashboard hero respects four-signal simplification rule
- [ ] Learning loop stages identifiable on topic/quiz flows

---

## Related documents

| Document | Role |
|----------|------|
| [`README.md`](./README.md) | Folder index |
| [`../11_UI_UX_MASTER_GUIDE.md`](../11_UI_UX_MASTER_GUIDE.md) | UI journey expression |
| [`../../PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md) | Module reference + architecture gate |
| [`../../ideas/MARK-4-ROUTE-UX-AUDIT.md`](../../ideas/MARK-4-ROUTE-UX-AUDIT.md) | Route-level punch list |
| [`../../HANDOFF.md`](../../HANDOFF.md) | Live session state |
