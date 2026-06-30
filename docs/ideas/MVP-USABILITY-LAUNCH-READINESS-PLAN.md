# MVP Usability Launch Readiness Plan

**Linked initiative:** **The Switch Platform v4 UI/UX Redesign** — **complete**

> **Status:** operator-requested execution plan
> **Created:** 2026-06-29
> **Purpose:** define the remaining development work needed to make the current MVP feel fully usable, fully clickable, and operationally launch-ready in real-life use
> **Scope:** this does **not** reopen Priority A truth closeout; it focuses on practical product readiness, route usability, and end-to-end MVP resilience

Plain English: the platform is already live and documented as complete, but there is still a difference between "passes launch proof" and "feels fully reliable for everyday student use." This plan turns the current audit findings into one practical development track.

## Related redesign track

**The Switch Platform v4 UI/UX Redesign** is now the active design-and-usability layer for this plan.

Use that name when referring to the ongoing work to:

- improve route-to-route usability
- make the MVP feel more polished and modern
- tighten the dashboard, homepage, and study flows
- remove clutter while keeping the core MVP architecture intact

Status: **complete — 30 June 2026.** All Areas 1–9 closed. Operator truth: [`docs/MVP-OPERATOR-TRUTH.md`](../MVP-OPERATOR-TRUTH.md).

## Plan name

**MVP Usability Launch Readiness Plan**

## Success standard

This plan is complete when:

1. every core MVP route opens cleanly from a fresh local boot and the live site
2. every major student path is clickable end to end without dead ends or confusing fallback states
3. the main rehearsal commands prove build, boot, signed-in route access, exam flow, assessment flow, save/resume flow, results flow, and account flow
4. local development, local production rehearsal, and Fly production all tell the same runtime story
5. docs, scripts, and product surfaces all describe the current MVP honestly and consistently

## Area 1 — Boot and Runtime Stability

### Goal

Make the app boot reliably from a fresh checkout in both local and Fly-style production rehearsal.

### Development work

1. Keep the local non-Fly `/data` fallback explicit and tested.
2. Stabilize the local production rehearsal path so `build -> start -> smoke` works repeatedly.
3. Remove remaining startup race conditions in rehearsal scripts.
4. Make local runtime warnings clearer when the app falls back from Fly volume assumptions.
5. Add one command that proves "fresh checkout boots and serves the MVP."

### Done when

- `npm run build`, `npm run type-check`, `npm run test`, `npm run test:smoke`, and `npm run test:e2e` run cleanly in the intended order
- a fresh local production boot does not 500 on `/`, `/dashboard`, `/account`, or `/api/dashboard/home`

### Progress — 29 June 2026

| Step | Status | Evidence |
|------|--------|----------|
| Route type + rehearsal dist alignment | **Complete** | `scripts/type-check.mjs`, `scripts/prepare-next-build.mjs`, `.next-rehearsal` pipeline |
| Stronger local server readiness probes | **Complete** | `scripts/launch-utils.mjs` probes `/`, `/api/auth/providers`, `/api/account/overview`, `/api/dashboard/home` |
| Direct verification order | **Complete** | `npm run lint`, `npm run type-check`, `npm run build`, `npm run test`, `npm run test:smoke`, `npm run test:e2e` all passed |
| One-command local readiness wrapper | **Complete** | `npm run verify:local-launch-readiness` — core order passes end to end (30 June 2026) |

**Area 1 summary:** `5 / 5` steps complete — boot and runtime stability lane closed for MVP.

**Verification:** `npm run verify:local-launch-readiness` after a fresh checkout or rehearsal reset.

## Area 2 — Route-to-Route Clickability

### Goal

### Development work

1. Define the canonical clickable route map:
   - `/`
   - `/dashboard`
   - `/subjects`
   - `/assessments`
   - `/exams`
   - `/saved-progress`
   - `/results`
   - `/recommendations`
   - `/progress`
   - `/accessibility`
   - `/account`
   - `/support`
   - `/how-it-works`
2. Add scripted verification for homepage cards, dashboard shortcuts, account quick links, and saved-progress resume links.
3. Verify every route has a valid recovery or redirect story when signed out.
4. Verify every signed-in student route has a stable shell, heading, and next-action affordance.
5. Remove or reword any CTA that points to an incomplete or weak route.

### Done when

- every major CTA resolves to a working route
- no primary MVP route lands on a confusing empty shell without guidance

### Progress — 29 June 2026

| Step | Status | Evidence |
|------|--------|----------|
| 2.1 Canonical clickable route map | **Complete** | `src/lib/routes/canonical-mvp-routes.json` + `scripts/canonical-mvp-routes.mjs` |
| 2.2 Homepage + dashboard CTA contract tests | **Complete** | `tests/mvp-route-clickability.test.mjs` — marketing sections, dashboard route cards |
| 2.3 Account quick links + saved-progress resume contracts | **Complete** | same test file — account quick links, `buildSavedProgressHref` |
| 2.4 Signed-out recovery / redirect verification | **Complete** | `assertSignedOutRouteBehavior` in route smoke + clickability scripts |
| 2.5 Signed-in shell + header/recovery affordances | **Complete** | shell route list + `Mark32PageHeader` / `StudentRouteRecovery` audit test |
| 2.6 Runtime click-through rehearsal | **Complete** | `npm run test:route-clickability` — dashboard shortcuts, account links, resume hrefs |

**Area 2 summary:** `6 / 6` steps complete — route-to-route clickability lane closed for MVP.

**Verification:** `npm run test` (121/121), `npm run test:route-clickability` after `npm run build`.

## Area 3 — Exams and Timed Assessments

### Goal

Make the two highest-value learning paths feel dependable: full exams and timed checkpoint practice.

### Development work

1. Prove the exam lobby path from `/exams`.
2. Prove focused exam session entry with `examId` and `questionId`.
3. Prove timed assessment entry from `/assessments`.
4. Prove resume-from-save links for both exams and assessments.
5. Prove submit/review flow updates saved progress and results surfaces.
6. Add clear recovery copy when a requested exam or assessment session is invalid or stale.

### Done when

- a signed-in learner can open, continue, save, resume, and submit both an exam and a timed assessment in rehearsal
- the resulting state appears in saved progress and results without mismatch

### Progress — 29 June 2026

| Step | Status | Evidence |
|------|--------|----------|
| 3.1 Exam lobby from `/exams` | **Complete** | `scripts/mvp-exam-assessment-rehearsal.mjs` |
| 3.2 Focused exam entry (`examId` + `questionId`) | **Complete** | rehearsal + existing `launch-e2e.mjs` |
| 3.3 Timed assessment entry from `/assessments` | **Complete** | rehearsal script + seed API |
| 3.4 Resume-from-save links (exam + assessment) | **Complete** | rehearsal follows saved-progress hrefs |
| 3.5 Submit updates saved progress + results | **Complete** | rehearsal POST submit + overview APIs |
| 3.6 Invalid/stale session recovery copy | **Complete** | `exams-recovery.tsx`, `assessments-recovery.tsx` |

**Area 3 summary:** `6 / 6` steps complete — exams and timed assessments lane closed for MVP.

**Verification:** `npm run test` (127/127), `npm run test:exam-assessment-rehearsal` after `npm run build`.

## Area 4 — Saved Progress, Results, and Continuity

### Goal

Make continuity one of the strongest parts of the MVP rather than just a persistence feature.

### Development work

1. Add route-level continuity checks for saved-progress overview, resume links, results summaries, and dashboard continuity cards.
2. Verify stale or already-submitted sessions never reopen incorrectly.
3. Verify saved progress always points back into a valid route.
4. Improve empty-state guidance so no continuity surface feels broken when a student has no history yet.

### Done when

- continuity works for new, active, and completed states
- every resume card leads somewhere real and appropriate

### Progress

| Step | Status | Evidence |
| --- | --- | --- |
| 4.1 Route-level continuity checks (saved-progress, results, dashboard) | **Complete** | `mvp-continuity-rehearsal.mjs` + `mvp-continuity.test.mjs` |
| 4.2 Submitted sessions never reopen incorrectly | **Complete** | submitted href locks to `/results`; stale PATCH stays submitted |
| 4.3 Saved progress hrefs always resolve to valid routes | **Complete** | `assertAllowedMvpClickTarget` on all session hrefs |
| 4.4 Empty-state guidance for no-history continuity | **Complete** | `start-first-session` → `/exams`; results + saved-progress recovery |

**Area 4 summary:** `4 / 4` steps complete — saved progress continuity lane closed for MVP.

**Verification:** `npm run test` (140/140), `npm run test:continuity-rehearsal` after `npm run build`.

## Area 5 — Auth, Account, and Role Experience

### Goal

Make student and admin access feel intentional, obvious, and stable.

### Development work

1. Keep one canonical student sign-in rehearsal path.
2. Keep one canonical admin access rehearsal path.
3. Verify `/account` as signed out, signed in student, and signed in admin.
4. Verify `/admin` redirects correctly when not allowlisted.
5. Verify sign-out returns the user to a safe route and locks protected surfaces again.

### Done when

- the account route clearly reflects auth state
- admin access only appears when intended
- sign-out and role boundaries are obvious and reliable

### Progress

| Step | Status | Evidence |
| --- | --- | --- |
| 5.1 Canonical student sign-in rehearsal path | **Complete** | `email-magic-link` → `/account` in `mvp-auth-account-rehearsal.mjs` |
| 5.2 Canonical admin access rehearsal path | **Complete** | `google` → `/admin` in `mvp-auth-account-rehearsal.mjs` |
| 5.3 `/account` signed out, student, and admin states | **Complete** | rehearsal + `mvp-auth-account.test.mjs` |
| 5.4 `/admin` redirects when not allowlisted | **Complete** | signed-out + student redirect checks in rehearsal |
| 5.5 Sign-out locks protected surfaces again | **Complete** | DELETE session + `/dashboard` redirect + API 401 |

**Area 5 summary:** `5 / 5` steps complete — auth, account, and role experience lane closed for MVP.

**Verification:** `npm run test` (140/140), `npm run test:auth-account-rehearsal` after `npm run build`.

## Area 6 — Support, Accessibility, and Recovery UX

### Goal

Make the platform feel safe and understandable when students need help, support settings, or recovery guidance.

### Development work

1. Verify `/support` as a stable public route with clear signposting.
2. Verify `/accessibility` is reachable and understandable from dashboard/account flows.
3. Audit every empty state on exams, saved progress, results, and recommendations.
4. Ensure each empty or blocked state offers one useful next click.
5. Add one pass specifically for student recovery language and route fallback quality.

### Done when

- no MVP route strands the learner without a useful next step
- support and accessibility feel like part of the product, not bolt-ons

### Progress — 29 June 2026

| Step | Status | Evidence |
| --- | --- | --- |
| 6.1 `/support` stable public route with signposting | **Complete** | `PublicMarketingPage` on `/support`; rehearsal checks urgent help + route guidance |
| 6.2 `/accessibility` reachable from dashboard/account | **Complete** | dashboard route cards, account quick links, accessibility support hub link |
| 6.3 Empty states audited (exams, saved progress, results, recommendations) | **Complete** | `mvp-support-recovery.test.mjs` — `StudentRouteRecovery` on blocked routes |
| 6.4 Each empty/blocked state offers a useful next click | **Complete** | recovery action hrefs validated against canonical MVP click targets |
| 6.5 Student recovery language and route fallback pass | **Complete** | `mvp-support-recovery-rehearsal.mjs` — support hub, invalid assessment recovery |

**Area 6 summary:** `5 / 5` steps complete — support, accessibility, and recovery UX lane closed for MVP.

**Verification:** `npm run test` (148/148), `npm run test:support-recovery-rehearsal` after `npm run build`.

## Area 7 — Verification and Rehearsal Tooling

### Goal

Make the launch-readiness proof repeatable by script, not only by memory or manual checking.

### Development work

1. Stabilize `scripts/launch-utils.mjs`.
2. Keep `test:smoke` focused on route availability and core copy markers.
3. Keep `test:e2e` focused on signed-in MVP route rehearsal and save/resume flows.
4. Add contract checks for primary CTA links.
5. Define one documented verification order for local launch rehearsal.

### Done when

- the rehearsal scripts pass consistently without ad hoc environment tweaking
- the output tells a clear story about MVP readiness

### Progress — 30 June 2026

| Step | Status | Evidence |
| --- | --- | --- |
| 7.1 Stabilize `scripts/launch-utils.mjs` | **Complete** | loopback bind `-H 127.0.0.1`, shared `LOCAL_READINESS_PROBE_ROUTES` |
| 7.2 Keep `test:smoke` focused on route availability | **Complete** | `route-smoke.mjs` uses canonical signed-out route behavior |
| 7.3 Keep `test:e2e` focused on signed-in rehearsal + save/resume | **Complete** | `launch-e2e.mjs` — onboarding, shell routes, exam PATCH, resume href |
| 7.4 Contract checks for primary CTA links | **Complete** | `tests/mvp-launch-tooling.test.mjs` — homepage + dashboard CTAs |
| 7.5 Documented verification order | **Complete** | `docs/LOCAL-LAUNCH-REHEARSAL.md`, `local-launch-rehearsal-order.mjs`, `verify:local-launch-readiness` |

**Area 7 summary:** `5 / 5` steps complete — verification and rehearsal tooling lane closed for MVP.

**Verification:** `npm run verify:local-launch-readiness` (30 June 2026 — full core chain green).

## Area 8 — Docs and Operator Truth

### Goal

Make sure the docs explain the product as it actually behaves now.

### Development work

1. Keep this plan linked from handoff surfaces.
2. Record each launch-readiness fix in README build history.
3. Separate truthful completion evidence, MVP usability hardening, and deferred expansion ideas.
4. Keep AGENTS, HANDOFF, README, and PLATFORM-GUIDE aligned after each meaningful improvement.

### Done when

- a new operator can read the docs and understand both what is already complete and what still needs practical hardening

### Progress — 30 June 2026

| Step | Status | Evidence |
| --- | --- | --- |
| 8.1 Usability plan linked from handoff surfaces | **Complete** | `HANDOFF.md`, `AGENTS.md`, `PLATFORM-GUIDE.md`, `docs/ideas/README.md` |
| 8.2 Launch-readiness fixes in README build history | **Complete** | Ordered Build Record — Areas 1–8 entries |
| 8.3 Three lanes separated in operator truth | **Complete** | `docs/MVP-OPERATOR-TRUTH.md` — A–D truth, usability Areas 1–9, Priority E deferred |
| 8.4 Entry-point docs aligned | **Complete** | `tests/mvp-operator-truth.test.mjs` — HANDOFF, AGENTS, README, PLATFORM-GUIDE, FINAL-PHASE-PLAN |

**Area 8 summary:** `4 / 4` steps complete — docs and operator truth lane closed for MVP.

**Verification:** `npm run test` — `mvp-operator-truth.test.mjs` contract checks.

## Area 9 — The Switch Platform v4 UI/UX Redesign (Mark 3.2 live surfaces)

### Goal

Ship a streamlined light-mode student experience on live routes without removing any MVP capability — clearer above-the-fold dashboard decisions, Study Atelier tokens, and permanent Fly production delivery.

### Development work

1. Author the UI masterplan and map Mark 3.2 layout zones to existing module data.
2. Ship Mark 3.2 dashboard zones on `/dashboard` using real continuity, planner, exam, Power Grid, and focus data.
3. Preserve all existing MVP sections below the fold (quick routes, planner, focus, resume, SEND support).
4. Extend the student shell greeting rail with weekly study-day count and Power Grid level badge.
5. Deploy the redesign to Fly production at https://theswitchplatform.com.
6. Extend the same light-mode patterns to remaining high-traffic student routes without breaking architecture gates.

### Done when

- `docs/design/UI-UX-MASTERPLAN.md` is the authoritative UI spec for live work
- `/dashboard` shows Continue learning, Next exam, Today's goal, Power Grid progress, subject rings, and weakest topics from live data
- production on Fly matches the checked-in Mark 3.2 dashboard and shell changes
- remaining student routes feel equally clickable and polished without losing modules or routes

### Progress — 29 June 2026

| Step | Status | Evidence |
|------|--------|----------|
| 9.1 UI masterplan authored | **Complete** | `docs/design/UI-UX-MASTERPLAN.md` |
| 9.2 Mark 3.2 hero row on `/dashboard` | **Complete** | `src/components/streamlined/mark32-hero-row.tsx` — Continue learning, Next exam, Today's goal, Power Grid progress |
| 9.3 Subject progress + weakest topics | **Complete** | `mark32-subject-grid.tsx`, `mark32-weakest-topics.tsx`, `mark32-dashboard-utils.ts` |
| 9.4 Below-fold MVP sections preserved | **Complete** | `src/components/dashboard-home.tsx` — quick routes, planner, focus, resume, SEND support unchanged |
| 9.5 Student shell greeting rail | **Complete** | `StudentAppShell` — weekly study-day count + Power Grid level badge |
| 9.6 Fly production deploy | **Complete** | `fly deploy -a the-switch-platform` — live at https://theswitchplatform.com |
| 9.7 Docs sync for redesign lane | **Complete** | `HANDOFF.md`, `AGENTS.md`, `README.md`, `PLATFORM-GUIDE.md`, `FINAL-PHASE-PLAN.md` |
| 9.7b Mark 3.2 Cursor Agent build handoff ingested | **Complete** | `docs/design/MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md` — vision + live-repo reconciliation |
| 9.8 Extend Mark 3.2 to other student routes | **Complete** | `/`, `/progress`, `/subjects`, `/assessments`, `/exams` lobby — shared `Mark32*` components |
| 9.9 Full-route visual consistency audit | **Complete** | Shell routes aligned to `Mark32PageHeader` + Study Atelier teal accents |

**Area 9 summary:** `10 / 10` steps complete — Mark 3.2 UI/UX redesign lane closed for MVP.

**Verification (29 June 2026):** `npm run lint`, `npm run type-check`, `npm run test` (109/109 passed).

## Recommended execution order

1. Boot and runtime stability — **complete (5/5 — 30 June 2026)**
2. Verification and rehearsal tooling — **complete (5/5 — 30 June 2026)**
3. Route-to-route clickability — **complete (6/6 — 29 June 2026)**
4. Exams and timed assessments — **complete (6/6 — 29 June 2026)**
5. Saved progress, results, and continuity — **complete (4/4 — 29 June 2026)**
6. Auth, account, and role experience — **complete (5/5 — 29 June 2026)**
7. Support, accessibility, and recovery UX — **complete (5/5 — 29 June 2026)**
8. Docs and operator truth — **complete (4/4 — 30 June 2026)**
9. The Switch Platform v4 UI/UX Redesign (Mark 3.2 live surfaces) — **complete (10/10 — 29 June 2026)**

**Plan summary:** all nine usability areas closed. See [`docs/MVP-OPERATOR-TRUTH.md`](../MVP-OPERATOR-TRUTH.md) for how this relates to Priority A–D closeout and deferred Priority E.

## Definition of "usable and launch ready" for this plan

For this plan, "usable and launch ready" means:

- the app builds
- the app starts
- the main routes open
- the main buttons and cards go somewhere real
- the exam and assessment loops work
- save/resume works
- results and account routes make sense
- support and accessibility are reachable
- signed-out, signed-in, and admin states all behave clearly
- local rehearsal and production truth do not contradict each other

## Operator note

This plan is the practical follow-on to the completed A-D closeout. It should be used for "make the MVP feel fully usable" work, not for reopening completed launch-truth evidence unless a new breakage is discovered.
