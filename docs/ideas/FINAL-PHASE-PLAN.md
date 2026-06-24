# Final Phase Plan — Full Completion Audit

> **Status:** **ACTIVE** — this is now the single completion plan for the repository
> **Created:** 2026-06-24
> **Purpose:** stop partial closeout; list everything still required for an honest full-completion claim
> **Live site:** https://theswitchplatform.com

Plain English: the repo currently mixes three stories:

- docs that say the platform is fully complete
- evidence that is stronger than before, but not airtight
- product/UI work that is still obviously unfinished

This file replaces the older UI-only Final Phase roadmap with one full audit. It covers:

1. what must be done before the project can honestly be called **fully complete**
2. what product work is still unfinished in the current app
3. what repo/docs/governance cleanup is still needed
4. what is deferred scope rather than a current blocker

Read order every session:

1. [`HANDOFF.md`](../../HANDOFF.md)
2. **This file**
3. [`PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md)
4. relevant `README.md` sections only when needed

---

## Audit verdict

### Current honest status

- **Documented status:** “all 22 items complete”
- **Audit status:** **not yet airtight**
- **Product status:** strong MVP/live platform with remaining finish work

### Why the current claim is not airtight

The repo has real evidence, but the final proof path still has gaps:

- “Live” walkthrough tooling can use `SWITCH_LAUNCH_VERIFICATION_SECRET` to bypass the real OIDC session path.
- Live onboarding proof currently depends on that bypass path.
- Persistence recovery proof depends on where the script is run, not only on the deployed runtime.
- The docs still contain stale and conflicting “near-launch” / “complete” statements.
- The current Final Phase plan only tracked UI polish, so completion-truth work kept getting skipped.

### Completion rule from now on

Do **not** describe the platform as “100% complete”, “fully complete”, or “true final completion” unless **all Priority A items below are done**.

Product polish alone is not enough.

---

## Priority order

```mermaid
flowchart TD
  A["Priority A\nTruthful completion"] --> B["Priority B\nDocs + governance sync"]
  B --> C["Priority C\nStudent product completion"]
  C --> D["Priority D\nQuality + test coverage"]
  D --> E["Priority E\nDeferred scope review"]
```

---

## Priority A — Truthful completion blockers

These are the blockers to an honest full-completion claim. Do these first.

### A-1. Prove real live OIDC sign-in end to end without launch-verification bypass

**Why this is open**

- [`scripts/live-walkthrough-utils.mjs`](../../scripts/live-walkthrough-utils.mjs) prefers launch-verification headers when `SWITCH_LAUNCH_VERIFICATION_SECRET` is present.
- [`src/modules/auth/request.ts`](../../src/modules/auth/request.ts) accepts those headers as an authenticated session before normal auth.

**Required outcome**

- A final proof run must use the real deployed OIDC path, not synthetic launch headers.
- Evidence must show:
  - auth start
  - provider redirect
  - callback
  - session creation
  - protected route access
  - sign-out
  - protected route rejection after sign-out

**Done when**

- There is a date-stamped evidence file showing a real browser-authenticated run against production.
- The final proof path explicitly records that launch-verification bypass was **off**.

### A-2. Add a final live walkthrough mode that forbids launch-verification auth

**Why this is open**

- Current walkthrough tooling can pass even when real auth has not been exercised.

**Required work**

- Add a strict mode for final-path verification:
  - fail if `SWITCH_LAUNCH_VERIFICATION_SECRET` is present
  - require real student/admin cookies for OIDC mode
  - clearly label output as “real live auth proof”

**Done when**

- `verify:live-walkthrough` or a new explicit final-live command cannot silently use synthetic auth for completion evidence.

### A-3. Prove real deployed sign-out, session invalidation, and protected-route lockout

**Why this is open**

- Current local rehearsal covers sign-out better than the production closeout path.
- Current final evidence leans on manual/operator notes rather than a strict production proof chain.

**Required work**

- Capture real production evidence for:
  - authenticated session exists
  - sign-out clears/invalidates it
  - the same user is denied on protected routes afterward

**Done when**

- The release evidence bundle includes this explicitly.

### A-4. Prove a fresh learner completes onboarding through real auth, not synthetic headers

**Why this is open**

- [`scripts/verify-live-onboarding.mjs`](../../scripts/verify-live-onboarding.mjs) requires `SWITCH_LAUNCH_VERIFICATION_SECRET` and drives a synthetic user through API updates.

**Required work**

- Record one real new-learner production proof:
  - sign in
  - incomplete learner redirected into onboarding
  - all 8 steps
  - dashboard unlock
  - returning learner not sent back into onboarding

**Done when**

- Item 3 has real production evidence that does not rely on synthetic auth headers.

### A-5. Prove persistence recovery on the real deployed storage path

**Why this is open**

- [`scripts/persistence-recovery-check.mjs`](../../scripts/persistence-recovery-check.mjs) checks the runtime where the script executes.
- That is useful, but not enough by itself unless the script is run in the true deployed environment or against the true mounted store.

**Required work**

- Run the recovery proof on Fly production or the true production data mount.
- Capture:
  - driver
  - data directory
  - backup directory
  - recovery-ready status
  - restore/recovery result

**Done when**

- The evidence clearly ties the recovery check to the real `/data` path on production.

### A-6. Create one canonical release-evidence bundle for full completion

**Why this is open**

- Evidence is split across multiple files and older contradictory evidence still exists.

**Required work**

- Create one canonical, date-stamped final evidence bundle that includes:
  - launch-status
  - live-readiness
  - persistence-recovery
  - real-auth walkthrough
  - real onboarding proof
  - launch-signoff
  - launch-complete
  - live-truth-match
  - browser/manual notes

**Done when**

- A new single evidence file supersedes earlier partial evidence.
- Older evidence remains in repo but is marked historical/superseded where necessary.

### A-7. Make launch-status and governance surfaces tell the current truth

**Why this is open**

- [`scripts/launch-status.mjs`](../../scripts/launch-status.mjs) still prints “remaining live-only items” as static closeout output.
- Governance service still contains seeded “remaining” closeout language and near-launch framing.

**Required work**

- Decide whether Final Path Mark 2 is truly closed or reopened.
- Align:
  - `launch-status`
  - governance final path summary
  - admin launch view
  - README/HANDOFF/AGENTS/PLATFORM-GUIDE wording

**Done when**

- No core surface says “complete” while another core surface still says “remaining live-only items” or “near-launch”.

### A-8. Re-run item 22 truth-match after A-1 to A-7 are complete

**Required work**

- Run `npm run verify:live-truth-match` again after truth cleanup.

**Done when**

- Item 22 is true in both content and proof, not only in mirrored docs.

---

## Priority B — Repo, docs, and governance sync

These items stop the repo from contradicting itself.

### B-1. Remove stale “still to prove live” notes that conflict with later completion claims

**Examples**

- [`README.md`](../../README.md) still contains older “still to prove live” language near the item 3 section.

**Done when**

- Historical notes are preserved but clearly marked superseded.

### B-2. Remove stale “near-launch” / “not yet complete” wording from active truth surfaces

**Examples**

- `README.md` still contains many historic near-launch statements.
- governance/service copy still contains seeded remaining-work language.

**Required work**

- Keep build history intact.
- Add explicit “historical context” framing where old closeout notes remain.
- Make active summary sections point to the current truth only.

### B-3. Sync the “single active roadmap” references to this full audit

**Why this is open**

- Several docs currently point to `FINAL-PHASE-PLAN.md`, but that file used to be UI-only.

**Required work**

- Ensure all references to the plan now mean full completion, not only redesign polish.

### B-4. Update `HANDOFF.md` live state to reflect audit-first reality

**Required outcome**

- The next session should start from:
  - truthful completion blockers first
  - then product completion

### B-5. Append README build record only when behavior changes, not for audit-only doc work

**Required discipline**

- Preserve build history signal quality.

---

## Priority C — Product completion work

These are real product gaps still visible in the app.

### C-1. Shell rollout on remaining signed-in student routes — **complete (2026-06-24)**

**Shipped**

| Route | Notes |
|-------|--------|
| [`/results`](../../src/app/results/page.tsx) | `StudentAppShell`, slim summary |
| [`/saved-progress`](../../src/app/saved-progress/page.tsx) | `StudentAppShell`, resume list |
| [`/recommendations`](../../src/app/recommendations/page.tsx) | `StudentAppShell` |
| [`/account`](../../src/app/account/page.tsx) | Shell when signed in; standalone layout when signed out |
| [`/accessibility`](../../src/app/accessibility/page.tsx) | `StudentAppShell`, dedicated settings experience |

**Already shipped before C-1:** `/dashboard`, `/subjects`, `/assessments`, `/progress`

**Out of C-1 scope (separate items):** `/exams` (C-2), `/support` (C-3)

**Done when** — signed-in student workflow routes above use shared chrome; exceptions documented in C-2/C-3.

### C-2. Decide the `/exams` shell model

**Current state**

- [`src/app/exams/page.tsx`](../../src/app/exams/page.tsx) uses its own experience/recovery layout.

**Decision required**

- Either:
  - shell the exam lobby only and preserve focus mode during active papers
- Or:
  - document exam focus mode as a deliberate shell exception

**Done when**

- The route is consistent by rule, not by accident.

### C-3. Decide whether `/support` is a public marketing surface or a signed-in student route

**Current state**

- [`src/app/support/page.tsx`](../../src/app/support/page.tsx) is public and standalone.
- Earlier planning blurred “support” between public and student-shell contexts.

**Required work**

- Pick one model:
  - public support hub with marketing chrome
  - signed-in student support route with shell
  - split routes if both are needed

**Done when**

- Support is no longer a mixed concept in plans and UI.

### C-4. Apply marketing header/footer consistently on public routes

**Routes to audit**

- `/`
- `/how-it-works`
- `/login`
- `/support` if kept public

**Required work**

- Shared header
- Shared footer
- consistent CTA hierarchy
- SEND swatches where intended

### C-5. Complete planner persistence

**Current state**

- `PlannerPromptCard` still uses client-only local dismissal behavior.

**Required work**

- Persist dismissal per user.
- Survive refresh and new sessions.
- Store through module/API path, not page-only state.

### C-6. Build a real weekly planner backed by app data

**Required work**

- Week grid driven by saved progress, assessments, and exams.
- Dashboard and `/progress` must agree on planner state.
- Avoid fake decorative planner UI.

### C-7. Use onboarding/catalog subject signals in planner and route summaries

**Required work**

- Subject tone mapping
- no duplicate subject collection
- consistent chip/color logic across dashboard, planner, and recommendations

### C-8. Finish account/auth UX alignment

**Current state**

- `/account` is functionally rich but visually standalone.
- `/login` is cleaner than before, but still separate from the broader public shell system.

**Required work**

- Decide whether `/account` belongs in student shell or in a deliberate account layout.
- Make `/login` visually consistent with the active public-site system.

### C-9. Accessibility route consistency pass

**Current state**

- `/accessibility` uses a dedicated experience.

**Required work**

- Keep the dedicated route if needed, but align it visually and navigationally with the student app system.

### C-10. Recovery and empty-state consistency pass

**Routes to audit**

- `/exams`
- `/progress`
- `/saved-progress`
- content-empty routes

**Required work**

- consistent off-brand fallback cleanup
- same product language for recovery actions
- route-safe next steps

---

## Priority D — Quality, operations, and test coverage

These items reduce hidden risk.

### D-1. Add tests for strict real-auth final proof mode

**Required tests**

- final live verification fails when launch-verification secret is present
- cookie-mode/auth-mode selection is explicit

### D-2. Add tests for real sign-out and protected-route denial assumptions

**Required tests**

- session exists
- sign-out clears it
- protected route no longer works

### D-3. Add tests for planner dismiss persistence

**Required tests**

- dismissal persists across refresh
- persists per user

### D-4. Add tests for shell coverage rules

**Required work**

- Assert the intended route list for `StudentAppShell`
- Catch accidental regression back to standalone pages

### D-5. Content/editorial quality pass

**Why this is still open**

- CMS/service copy still references broader missing-data and product-pass gaps.
- Content/operations surfaces still mention broader coverage limitations.

**Required work**

- Audit route-level copy for:
  - “not yet”
  - “future”
  - placeholder product explanations
- Decide what is acceptable MVP truth vs what needs implementation

### D-6. Admin/governance surface copy pass

**Required work**

- Ensure admin view describes the live system accurately.
- Remove mixed “done” and “remaining” signals unless intentionally historical.

---

## Priority E — Deferred scope (list it, but do not confuse it with current blockers)

These are still real future tasks, but they are **not** blockers to current truthful completion if the scope remains the current MVP.

### E-1. GCSE Wales and Northern Ireland onboarding routes

- currently signposted as “coming later”
- blocked by explicit MVP scope lock

### E-2. Parent and teacher onboarding variants

- visible in role thinking, not yet delivered as full separate journeys

### E-3. Admin restyle to full Study Atelier language

- useful, but not a current launch-truth blocker

### E-4. i18n-ready copy centralisation

- good platform work, not current blocker

### E-5. Broader exam/content coverage beyond current launch subjects

- some ops/content copy still hints at broader future coverage
- treat as scope expansion, not current MVP honesty blocker

---

## File-backed audit notes

Use these references when executing the plan.

### Auth and final proof

- [`scripts/live-walkthrough-utils.mjs`](../../scripts/live-walkthrough-utils.mjs)
- [`scripts/verify-live-onboarding.mjs`](../../scripts/verify-live-onboarding.mjs)
- [`scripts/live-readiness.mjs`](../../scripts/live-readiness.mjs)
- [`scripts/persistence-recovery-check.mjs`](../../scripts/persistence-recovery-check.mjs)
- [`scripts/live-truth-match.mjs`](../../scripts/live-truth-match.mjs)
- [`src/modules/auth/request.ts`](../../src/modules/auth/request.ts)

### Governance and truth surfaces

- [`scripts/launch-status.mjs`](../../scripts/launch-status.mjs)
- [`src/modules/governance/service.ts`](../../src/modules/governance/service.ts)
- [`src/app/admin/page.tsx`](../../src/app/admin/page.tsx)
- [`release-evidence/2026-06-21-final-path-mark-2-local-live-check.md`](../../release-evidence/2026-06-21-final-path-mark-2-local-live-check.md)
- [`release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md`](../../release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md)

### Student routes — shell status

| Route | Status |
|-------|--------|
| `/dashboard`, `/subjects`, `/assessments`, `/progress` | Shipped (prior) |
| `/results`, `/saved-progress`, `/recommendations`, `/account`*, `/accessibility` | **Shipped 2026-06-24** |
| `/exams` | C-2 — **focus mode** (lobby in shell, active paper without shell) |
| `/support` | C-3 — **public marketing hub** via `PublicMarketingPage` |

\* `/account` uses shell when signed in; signed-out keeps standalone layout.

---

## Execution checklist

Mark these only when evidence exists.

### Truthful completion

- [ ] A-1 Real OIDC sign-in proof recorded without synthetic auth
- [x] A-2 Final live verification forbids launch-verification bypass
- [ ] A-3 Real sign-out + route rejection proof recorded
- [ ] A-4 Real fresh-learner onboarding proof recorded
- [ ] A-5 Persistence recovery proven on true production storage path
- [ ] A-6 Canonical final release-evidence bundle created
- [ ] A-7 Launch-status / governance / docs all tell the same truth
- [ ] A-8 Final truth-match rerun and green

### Product completion

- [x] C-1 Remaining student route shell rollout complete (exams/support → C-2/C-3)
- [x] C-2 `/exams` shell/focus rule decided and implemented (lobby in shell; `focus=1` active papers)
- [x] C-3 `/support` route model clarified and implemented (public marketing hub)
- [x] C-4 Public marketing chrome consistent (`/`, `/how-it-works`, `/login`, `/support`)
- [x] C-5 Planner dismiss persistence complete (`/api/dashboard/ui-preferences`)
- [x] C-6 Weekly planner API-backed (`/api/planner/week`; dashboard + `/progress`)
- [x] C-7 Subject tone/data integration complete (`src/lib/subjects/tone.ts`)
- [x] C-8 Account/auth UX aligned (signed-in account in shell; login on marketing chrome)
- [x] C-9 Accessibility route aligned (C-1 shell rollout)
- [x] C-10 Recovery/empty-state consistency pass complete (`StudentRouteRecovery`)

### Quality and sync

- [ ] B-1 stale “still to prove live” notes cleaned up
- [ ] B-2 stale “near-launch” active truth surfaces cleaned up
- [ ] B-3 all roadmap references point to this full audit
- [ ] B-4 handoff state reflects audit-first priority
- [x] D-1 strict real-auth proof tests added
- [ ] D-2 sign-out/session denial tests added
- [x] D-3 planner persistence tests added (`tests/final-phase-product.test.mjs`)
- [ ] D-4 shell coverage tests added
- [ ] D-5 content/editorial quality pass complete
- [ ] D-6 admin/governance copy pass complete

---

## Definition of done

The project can only be called **fully complete** when:

1. every Priority A item is done
2. every Priority C item intended for the current MVP is done or deliberately documented as an exception
3. active truth surfaces no longer contradict each other
4. the release evidence bundle proves the real deployed system, not a synthetic shortcut

Until then, describe the platform more carefully:

- “live”
- “strong MVP”
- “documented as complete, but completion truth is being hardened”

Do **not** collapse that into “100% complete”.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-24 | Rewritten as full completion audit (Priorities A–E) |
| 2026-06-24 | **C-1 complete** — shell on saved-progress, recommendations, account, accessibility |
