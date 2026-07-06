# Session Handoff — The Switch Platform

> **Purpose:** This file is the live handover note between **Cursor Agent** and **Codex**.
> Read it at the start of every session. Update it at the end of every session.
> Do not delete session history — add new entries at the top of the Session Log.

## Operator rule — every session

**Session start:** tell Cursor or Codex:

```text
Read HANDOFF.md first.
```

**Session end:** update the **Live session state** section below before stopping or switching tools.

**Operator completion rule:** when the operator says to complete something, treat that as an instruction to finish the full requested scope end to end. Do not stop at a foundation, scaffold, partial pass, or planning-only layer unless the operator explicitly asks for a phased delivery.

## Before each action — consult first

Before **every** action — code, docs, commands, git, planning, or review — consult in order:

1. This file (`HANDOFF.md`) → Live session state, What is next, Blockers
2. **`docs/ideas/FINAL-PHASE-PLAN.md`** → current MVP completion record and deferred-scope reference
3. `PLATFORM-GUIDE.md` → Rules, architecture, modules, launch checklist
4. `README.md` → Relevant sections only (build record, launch notes)

Do not start until the action still matches live state and build priorities.

If the action touches a module, also read `src/modules/<module>/README.md`.

## After each action — update HANDOFF and AGENTS (non-negotiable)

After **every** completed action — not only at session end:

1. Refresh **`HANDOFF.md`** → **Live session state** (What was just completed, What is next, Blockers, Verification last run)
2. Refresh **`AGENTS.md`** → **Operator and agent sync**, **MVP at a glance**, and completion records so they match HANDOFF. **Required every time live state or project story changes** — no exceptions.
3. Add or refresh a **Session log** entry in this file when the action materially changed repo state, blockers, or next steps
4. Append **`README.md`** Ordered Build Record when routes, modules, or behavior changed

Commit and push when the action produced repo changes, unless a task explicitly requires a local-only commit.

## Efficiency quick reference (read this every session)

| Step | Action |
|------|--------|
| Before each task | Read `HANDOFF.md` → **`docs/MVP-OPERATOR-TRUTH.md`** → **`docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md`** → `PLATFORM-GUIDE.md` → README **sections only** (when needed) |
| During task | One module, one priority, match architecture gate |
| After each task | Update **HANDOFF** Live session state + **AGENTS** operator sync (non-negotiable) |
| End of session | Verification, commit, push, session log, README build record if behavior changed |

**Live site:** https://theswitchplatform.com (Fly.io production). Re-check docs vs live: `npm run verify:live-truth-match`.

## Golden rule

**Never switch between Cursor and Codex without updating `HANDOFF.md` and `AGENTS.md` first.**

Commit and push to GitHub before switching tools unless a task explicitly requires a local-only commit.

---

## Live session state

Update this section every session.

### Current state

- **Active folder:** `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- **GitHub repo:** `https://github.com/tech-fresh/the-switch-platform`
- **Current branch:** `cursor/fix-live-onboarding-cold-start`
- **Last updated by:** Cursor Agent
- **Last updated:** 2026-07-06 (`11_UI_UX_MASTER_GUIDE.md` + Phase 7 homepage)

### Active task

- **Priority item #:** Supportive live verification hardening
- **Module:** launch scripts / repo entry docs
- **Status:** `verify:live-onboarding` cold-start fix committed on branch; docs synced; merge to `main` pending
- **Branch:** `cursor/fix-live-onboarding-cold-start`

### Current readiness truth

- **Historical production closeout:** `100%` for the 26 June 2026 Fly production closeout evidence only. That number records the completed 22-item launch checklist and Priority A canonical proof in `release-evidence/2026-06-26-priority-a-canonical-closeout.md`.
- **Current branch readiness (5 July 2026):** `100%` after the refreshed real-auth production proof and canonical closeout rerun. `verify:check-live-cookies`, `verify:live-truth-match`, `verify:live-walkthrough:real-auth`, and `verify:priority-a-closeout` all passed with fresh production cookies.
- **Current branch-readiness rule:** older `100%` references are historical completion records, not an automatic claim about the present working tree.

### Priority C — COMPLETE (24 June 2026)

**Authoritative status:** Priorities **A**, **B**, **C**, and **D** are **closed** for the current MVP. Priority **E** is deferred scope unless the operator explicitly reopens another lane.

| Item | Status | Evidence |
|------|--------|----------|
| **C-1** Shell rollout | **Complete** | `StudentAppShell` on results, saved-progress, recommendations, accessibility, account (signed in) |
| **C-2** Exams focus mode | **Complete** | Lobby in shell; active paper `focus=1` — `src/lib/exams/focus-mode.ts` |
| **C-3** Support route model | **Complete** | Public marketing hub — `PublicMarketingPage` on `/support` |
| **C-4** Marketing chrome | **Complete** | `/`, `/how-it-works`, `/login`, `/support` |
| **C-5** Planner dismiss | **Complete** | `/api/dashboard/ui-preferences` |
| **C-6** Weekly planner | **Complete** | `src/modules/weekly-planner/` + `/api/planner/week` |
| **C-7** Subject tones | **Complete** | `src/lib/subjects/tone.ts` |
| **C-8** Account/auth UX | **Complete** | Account in shell when signed in; login on marketing chrome |
| **C-9** Accessibility route | **Complete** | Shell aligned (C-1) |
| **C-10** Recovery pass | **Complete** | `StudentRouteRecovery` shared component |

**Architecture gate (must hold):** route → thin page → module service → API → persistence. Weekly planner, UI preferences, and exam focus mode all follow this — no page-only business logic.

**Synced in:** `AGENTS.md` → Priority C completion record · `README.md` → Ordered Build Record · `docs/ideas/FINAL-PHASE-PLAN.md` → execution checklist.

### What was just completed

- **Accessibility icon swap (6 July 2026)** — replaced ♿ with 🎛️ on homepage feature cards and benefits (study settings metaphor; avoids wheelchair disability symbol).
- **`11_UI_UX_MASTER_GUIDE.md` + Mark 4 Phase 7 homepage (6 July 2026)** — created canonical UI/UX guide at `docs/design/11_UI_UX_MASTER_GUIDE.md`; slimmed `UI-UX-MASTERPLAN.md` to pointer. Shipped homepage benefits, how-it-works, and FAQ via `PremiumHomepageMarketing`; hero uses six-rank Power Grid from `xpTotal`; primary CTA **Start Learning Free**; fixed remaining light-mode session cards on dashboard. Verification: lint + type-check + test `198/198`.
- **Power Grid six-rank XP presentation (6 July 2026)** — presentation-only layer mapping existing `xpTotal` to six milestone ranks (Switch On → Switch Legend) with internal Power Levels 1–10, progress bars, next reward, and next rank preview. New `src/lib/power-grid/rank-presentation.ts`, `PowerGridRankPanel`, updated dashboard/progress/sidebar/homepage cards. Backend XP calculations, APIs, schema, and 9-level service logic unchanged. Tests: `tests/power-grid-rank-presentation.test.mjs`. Verification: lint + type-check + test `198/198`.
- **Premium website redesign (6 July 2026)** — dark-mode UI inspired by Stripe (homepage), Linear (sidebar dashboard), Seneca (quiz flow), Duolingo (Power Grid/streaks), BBC Bitesize (content hierarchy), Save My Exams (subject/board/topic). New `src/components/premium/` library; updated `/`, `/dashboard`, `StudentAppShell`, `/subjects` quiz UI, `globals.css`, `mark32Ui` tokens. Docs: `UI-UX-MASTERPLAN.md` → Website Redesign Direction. Verification: lint + type-check + test `194/194`.
- **Brand logo mockup gallery (6 July 2026)** — added `/brand-mockup` with `BrandLogoMockup` placement panels (hero, marketing header, sign-in, signed-in shell, footer, size scale, contrast surfaces) using live `SwitchBrandLogo` and `public/brand/the-switch-logo.png`. Linked from `/mock-idea-preview` and Mockup 5 in `mock-idea-showcase.tsx`; streamlined mockup hero now uses the same component. Aligned `docs/design/UI-UX-MASTERPLAN.md` brand token row. Local dev: if Next.js reports missing `.next/server/app/brand-mockup/page.js`, stop dev, `rm -rf .next`, and restart `npm run dev`.
- **Supportive live onboarding cold-start hardening (6 July 2026)** — hardened `verify:live-onboarding` for Fly wake-up: shared `ensureFlyMachineWarmup()` + new `ensureLiveHttpWarmup()`, generous supportive fetch defaults in `scripts/supportive-live-fetch-defaults.mjs`, route-level warm-up retries on signed-out redirect/API/page fetches, closeout env parity in `record-priority-a-closeout.mjs`, and deduplicated warm-up in `live-route-walkthrough.mjs`. Still API-assisted regression only — outside strict A-4. Branch: `cursor/fix-live-onboarding-cold-start` (`620ef21`, `7a1b48e`).
- **Local readiness verification completed (5 July 2026)** — `npm run build` passed, and `npm run verify:local-launch-readiness` passed end to end once re-run outside the sandboxed loopback restriction. The local branch now has a clean verification baseline through lint, type-check, build, contract tests, smoke, and signed-in rehearsal.
- **Fly deploy + live verification pass (5 July 2026)** — `npm run deploy:fly` succeeded, `curl -I https://theswitchplatform.com` returned `HTTP/2 200`, `npm run verify:live-readiness` passed, and `npm run verify:launch-status` was repaired so it now reports the 26 June 2026 closeout as historical evidence instead of stale “remaining live-only items” language when the live preflight is ready.
- **Priority A canonical closeout refreshed with real-auth cookies (5 July 2026)** — fresh `SWITCH_LIVE_STUDENT_COOKIE` and `SWITCH_LIVE_ADMIN_COOKIE` validated successfully, `verify:live-truth-match` passed, `verify:live-walkthrough:real-auth` passed, and `verify:priority-a-closeout` passed end to end. New canonical evidence: `release-evidence/2026-07-05-priority-a-canonical-closeout.md`.
- **Supportive onboarding regression remained non-blocking (5 July 2026)** — `verify:live-onboarding` timed out during a Fly cold-start on `/onboarding` when rerun by the closeout recorder outside the strict chain. The recorder marked it as supportive-only failure and still completed strict A-6/A-8 successfully. **Follow-up fix shipped 6 July 2026** on `cursor/fix-live-onboarding-cold-start`.
- **Preview shell type repair + readiness truth sync (5 July 2026)** — repaired the preview-route shell contract so preview pages can pass `hrefPrefix`, `showUtilityLinks`, and `accountHref` without breaking type-check. Updated the repo entry docs so historical `100% complete` wording now explicitly refers to the completed Fly production closeout / end-completion plan, while the current branch gets its own live readiness percentage based on present verification.
- **Combined Science variation picker added (1 July 2026)** — onboarding step 4 now keeps Combined Science constrained to supported live variants only. When `gcse-combined-science` is selected, the flow persists a board-matched `combinedScienceVariation` instead of leaving the route as a generic science choice. Current live options are `AQA Combined Science: Trilogy` and `Pearson Edexcel GCSE Combined Science`; separate/triple science stays out of the MVP picker.
- **Quiz answers now return right/wrong feedback with explanation (1 July 2026)** — the subject quick-check cards on `/subjects` no longer sit as static multiple-choice content. They now submit real answers through `/api/quiz/attempts/[topicId]`, show whether the learner was right or wrong, display the explanation for the correct answer, and keep per-topic attempt/correct/accuracy totals.
- **Quiz totals now feed Progress and Power Grid voltage (1 July 2026)** — added persisted quiz-progress records plus Power Grid integration so quiz totals now contribute to subject readiness, subject evidence, XP totals, and voltage points on `/progress`. Progress cards and the Power Grid journey now show quiz totals plus XP/voltage summaries instead of ignoring subject quick checks.
- **Preview app navigation fixed (1 July 2026)** — `/mock-idea-preview` now links into a working preview namespace instead of leaving the signed-in app cards as a dead gallery surface. Added `/preview/dashboard`, `/preview/subjects`, `/preview/exams`, `/preview/progress`, and `/preview/account`, wired the shared student shell/components to support preview-prefixed links, and kept app navigation inside preview mode instead of bouncing back into auth-gated routes.
- **Content system deployed to Fly production (1 July 2026)** — fixed the Fly build break caused by the onboarding UI importing the server-heavy inventory service by moving board-option reads onto the client-safe helper `src/modules/exam-inventory/board-options.ts`. Re-ran `npm run type-check`, `npm run build`, and `npm run deploy:fly`; Fly updated machine `7812e3dc1240d8`, and `curl -I https://theswitchplatform.com` returned `HTTP/2 200`.
- **Content system completed end to end (1 July 2026)** — finished the full local scope from the subject-library and inventory plan: added `src/modules/exam-inventory/` with one central seeded-paper inventory, mapped all nine current seeded exam papers into it (launch-safe + Year 10 + bridge), switched onboarding board choices and `/api/exams/papers` to inventory truth, updated dashboard/power-grid/results/recommendations/weekly-planner/saved-progress consumers to use the same live-paper inventory, and added operator-facing inventory visibility plus specification-import visibility on `/admin`.
- **Board-specific specification imports populated (1 July 2026)** — replaced the earlier placeholder-only specification objectives with imported board-specific objective coverage in `src/modules/specification-engine/imports.ts` for the current live routes (`AQA`, `Edexcel`, `Cambridge IGCSE`) plus AQA separate-science future architecture support. Student-visible objectives are now imported/reviewed rather than `official-spec-import-required` placeholders.
- **Completion rule tightened in repo entry docs (1 July 2026)** — updated the operator-facing repo entry points so “complete this” now explicitly means end-to-end completion of the requested scope by default, not a foundation-only or partial implementation unless the operator asks for phased delivery.
- **Specification engine foundation added (1 July 2026)** — created `src/modules/specification-engine/` with a new subject-library service, validators, README, and seed data in `src/data/subjects/mvp-subject-library.json`. The foundation now models the MVP launch subjects, keeps GCSE Combined Science separate from future Separate/Triple Science routes, exposes all supported GCSE / iGCSE exam boards at the specification layer, and marks generated learning objectives as official-spec import scaffolds rather than student-visible curriculum content. Added `tests/specification-engine.test.mjs`.
- **All-exams inventory plan added (1 July 2026)** — added a repo-level paper generation and inventory plan to `README.md` covering full GCSE papers, full iGCSE papers, Year 10 progression papers, bridge papers, and timed checkpoints. The plan now defines the source-of-truth inventory model, lifecycle statuses (`live`, `review`, `planned`, `blocked`, `retired`), website filtering rule, operator inventory view, coverage-test requirements, and future ingestion path for updated external exam sources.
- **Exam-content MVP audit + doc sync (1 July 2026)** — confirmed the live MVP has enough seeded full-paper material for every launch subject route currently offered to learners: `aqa-maths-higher-paper-1`, `edexcel-maths-foundation-paper-1`, `edexcel-english-paper-1`, `aqa-combined-science-paper-1`, `edexcel-combined-science-paper-1`, and `cambridge-igcse-maths-paper-1`. Synced the same truth into `AGENTS.md` and `README.md`: onboarding board choices must stay limited to boards with real seeded papers, and OCR / Eduqas remain deferred until matching exam content exists.
- **Live 502 recovery on Fly (1 July 2026)** — diagnosed the `HTTP 502` outage on https://theswitchplatform.com as a production Next.js out-of-memory crash on the Fly machine (`shared-cpu-1x:512MB`). Increased [`fly.toml`](./fly.toml) VM memory to `1024mb`, redeployed with `npm run deploy:fly`, and confirmed recovery with `curl -I https://theswitchplatform.com` returning `HTTP/2 200`. Live machine `7812e3dc1240d8` now runs as `shared-cpu-1x:1024MB`.
- **Login sign-in layout deployed to Fly (1 July 2026)** — published the simplified provider-first `/login` layout to the live Fly app with `npm run deploy:fly`. Fly release finished healthy on machine `7812e3dc1240d8`; live app served at https://theswitchplatform.com and https://the-switch-platform.fly.dev/.
- **Login sign-in layout simplified (1 July 2026)** — removed the large left-column welcome/promo section from `src/components/unified-sign-in-card.tsx` so `/login` now opens in the simpler provider-first format. Google / Microsoft / email sign-in actions and the help links remain intact. Verification: `npm run type-check`.
- **Combined Science full papers seeded (1 July 2026)** — added `aqa-combined-science-paper-1` and `edexcel-combined-science-paper-1` in `src/modules/exam-engine/seeded-combined-science-papers.ts` (4 questions each, biology/chemistry/physics mix). Onboarding learners who select `gcse-combined-science` now receive dedicated science papers on `/exams` and dashboard — no board-level maths fallback. Tests: `tests/combined-science-exam-papers.test.mjs`; updated `tests/onboarding-exam-availability.test.mjs`.
- **Live onboarding personalization smoke-check (1 July 2026)** — production API-assisted proof on https://theswitchplatform.com after deploy `1036ef0`: completed GCSE England / AQA / maths+English onboarding → `onboardingPersonalization.isActive=true`, dashboard setup summary, 2 filtered exam sessions, subjects API returned only chosen subject ids, exams API returned AQA papers only. Updated `scripts/verify-live-onboarding.mjs` for Mark 4 copy + personalization assertions. Signed-out gate confirmed: `/dashboard` and `/onboarding` redirect to `/login`.
- **Onboarding personalization merged to main (1 July 2026)** — PR https://github.com/tech-fresh/the-switch-platform/pull/9 merged `cursor/onboarding-personalization-watertight` → `main` at `d1bb73d`. Build fix `1036ef0` split client-safe exam board helpers (`exam-board-options.ts`, `qualification-utils.ts`) so Fly webpack build no longer pulls persistence into the onboarding UI bundle.
- **Onboarding → dashboard → exams watertight pass (30 June 2026)** — added `src/modules/onboarding/personalization.ts` as the single source of truth for onboarding-driven content filtering. Dashboard exam/assessment sessions, Power Grid summary, `/api/subjects/experience`, and `/api/assessments/definitions` now all respect completed onboarding profiles (qualification, exam board, selected subjects, study goal). Mission Control shows setup summary, study-goal messaging, exam availability, and a primary-subject CTA. Added `tests/onboarding-personalization-watertight.test.mjs`. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`176/176`).
- **Merge Mark 4 batch to `main` and push (30 June 2026)** — fast-forward merged `cursor/mark32-route-consistency` into `main` at `a7a4e97`; pushed to https://github.com/tech-fresh/the-switch-platform. Default branch `main` now includes Mark 4 dashboard, subjects, homepage, login, progress, exams, and Phase 6 onboarding.
- **Mark 4 Phase 6 onboarding dashboard-creation pass (30 June 2026)** — reframed `/onboarding` as dashboard creation with labelled steps, study-goal capture, exam-board selection (seeded boards only: AQA/Edexcel for GCSE, Cambridge IGCSE for iGCSE), and a dashboard-ready confirmation step. Added `examBoard` + `studyGoal` to onboarding profile types/service, `src/modules/onboarding/exam-availability.ts` to filter `/api/exams/papers` by onboarding setup, and teal Mark 4 shell styling. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`172/172`).
- **Mark 4 progress + exams visual pass (30 June 2026)** — reworked `/progress` with `Mark32ProgressAtAGlance`, compressed `Mark32SubjectProgressCard` grid, and clearer planner/subject hierarchy; reworked `/exams` lobby with subject grouping, selection-path guidance, and `Mark32ExamPaperCard` status badges (not started / in progress / submitted). Added `tests/mark32-progress-exams.test.mjs`. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`167/167`).
- **Onboarding UK school lookup clickability pass (1 July 2026)** — upgraded step 3 of `/onboarding` from an England-only school-source note into a UK-wide clickable school-finder step. Learners can now choose `England`, `Scotland`, `Wales`, or `Northern Ireland`, open the official school finder for that nation directly from the onboarding UI, and then enter their school name. Qualification choices remain locked to `GCSE (England)` and `iGCSE` during the MVP. Added matching onboarding service coverage in `tests/onboarding-service.test.mjs`.
- **Microsoft OIDC provider configured in runtime (30 June 2026)** — ran `scripts/provision-microsoft-oauth-live.sh`, updated the existing Azure app registration redirect/support settings, wrote real `SWITCH_OIDC_MICROSOFT_*` values into `.env.local`, pushed the same secrets to Fly, and passed `npm run verify:microsoft-oauth-live`. Verified that local `/login` now exposes a real `/api/auth/start?provider=microsoft` path instead of the guide-only fallback.
- **Mark 4 onboarding dashboard-creation planning recorded (30 June 2026)** — added onboarding explicitly to the Mark 4 implementation plan and route audit. Planned the first-sign-up dashboard-creation setup around `School`, `Year Group`, `Qualification`, `Exam Board`, `Subjects`, `Accessibility`, `Goals`, and a clearer `Dashboard Ready` handoff, while keeping the live onboarding flow locked at 8 steps. Recorded the same constraint in `src/modules/onboarding/README.md`: `Exam Board` is planned scope, but not yet a fully active MVP onboarding field.
- **Onboarding exam-board source-of-truth docs updated (30 June 2026)** — added explicit README and onboarding module wording that students should choose an exam board during onboarding and that this should define the exam content they receive. Recorded the current truth clearly: platform exam-board type supports `AQA`, `Edexcel`, `OCR`, `Eduqas`, `WJEC`, `CCEA`, `Cambridge IGCSE`, `Edexcel International GCSE`, and `OxfordAQA International GCSE`, while current seeded exam content in the repo uses `AQA`, `Edexcel`, and `Cambridge IGCSE`.
- **Exam-board planning refined for onboarding + access arrangements (30 June 2026)** — tightened the source-of-truth docs so they now distinguish the broader architecture type from the planned first-class onboarding board menu. Recorded the intended learner-facing board set as `AQA`, `Pearson Edexcel`, `OCR`, and `Eduqas` for GCSE plus `Edexcel International GCSE` and `Cambridge IGCSE` for iGCSE, while keeping `WJEC`, `CCEA`, and `OxfordAQA International GCSE` as type-level architecture only until matching content pathways exist. Also recorded the access-arrangements planning split: JCQ wording for national GCSE boards and Cambridge International wording for Cambridge IGCSE pathways.
- **Mark 4 homepage + login second polish pass (30 June 2026)** — unified more of the homepage below-the-fold story into the stone/teal system, added a compact proof strip tied to real progress data, tightened the lower public-value cards, and added a stronger final homepage CTA section. On `/login`, clarified that Google and Microsoft are both part of the normal student sign-in path and made the provider-choice section more explicit without changing the auth flow. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`164/164`).
- **Mark 4 homepage + login implementation pass (30 June 2026)** — upgraded the signed-out product surfaces to feel calmer and more premium without changing MVP scope. The homepage now uses a cleaner stone/teal visual system, tighter hero hierarchy, clearer trust/value cards, and more intentional CTA styling. The login route now uses a stronger two-column sign-in shell with calmer copy, clearer post-sign-in expectations, and polished provider actions while preserving the existing unified auth flow, signed-out route markers, and explicit Microsoft sign-in visibility even when the local preview runtime is missing Microsoft provider config. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`164/164`).
- **Mark 4 dashboard + subjects first implementation pass (30 June 2026)** — reduced dashboard decision overload by consolidating the lower-page routes into a clearer secondary-action area, softened the recent-work / support grouping, and reworked `/subjects` into a stronger revision-home structure with four top-level lanes (`Continue learning`, `Progress`, `Topics`, `Mock exam`) plus a clearer topic sequence (`Learn`, `Worked example`, `Practice`, `Exam questions`). Removed the old internal-feeling “What this route proves” section and replaced it with student-facing next-step guidance. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`164/164`).
- **Mark 4 route UX audit created (30 June 2026)** — completed the first execution step from the Mark 4 plan in `docs/ideas/MARK-4-ROUTE-UX-AUDIT.md`. Audited `/dashboard`, `/subjects`, `/exams`, `/progress`, `/`, and `/login`; recorded route purpose, primary action, UX issues, first implementation moves, and the exact files each route pass should touch. Ranked first build batch: dashboard, subjects, homepage, login, progress, then exams.
- **Mark 4 implementation plan created (30 June 2026)** — translated the attached `The Switch Platform UI/UX Master Guide (MVP) — Mark 4.0` into a repo-safe execution plan in `docs/ideas/MARK-4-UI-UX-IMPLEMENTATION-PLAN.md`. Reconciled conflicts with the live app: keep Fly/OIDC/SQLite, keep the top study rail, keep 8-step onboarding, and treat `Sign Up`, email-password auth, and non-MVP public pages as adapted or deferred rather than silently implementing them. Expanded the plan with architecture flow, route/file ownership, code workstreams, component hardening order, data/content needs, and verification cadence.
- **Mark 3.2 route consistency pass (30 June 2026)** — moved shared Mark 3.2 tokens fully onto the Study Atelier stone/teal system, cleaned remaining violet-heavy student-route surfaces on `/progress`, `/saved-progress`, `/recommendations`, `/results`, `/account`, `/exams`, and `/accessibility`, and aligned supporting components such as the weekly planner, Power Grid journey, planner prompt, SEND rail, and subject catalog cards. Full `npm run lint`, `npm run type-check`, and `npm run test` green (`164/164`).
- **Mark 3.2 mission control dashboard + streamlined navigation (30 June 2026)** — reshaped `StudentAppShell` into a light top-rail shell with the five-item MVP nav (`Dashboard`, `Subjects`, `Exams`, `Progress`, `Profile`), upgraded dashboard motivation into a curated attributed quote card, shifted dashboard emphasis to Mission Control / one-next-step guidance, and moved the practice entry point into `/subjects`. Added `tests/mark32-navigation.test.mjs`; full `npm run lint`, `npm run type-check`, and `npm run test` green (`164/164`).
- **MVP usability Area 8 docs and operator truth (30 June 2026)** — added `docs/MVP-OPERATOR-TRUTH.md` (three-lane map: Priority A–D truth, usability Areas 1–9, deferred Priority E), `tests/mvp-operator-truth.test.mjs`, synced HANDOFF/AGENTS/README/PLATFORM-GUIDE/FINAL-PHASE-PLAN/ideas index; fixed Area 2 header in usability plan. Area 8 **4/4 complete**. **Full usability plan closed.**
- **MVP usability Area 7 verification and rehearsal tooling (30 June 2026)** — stabilized `launch-utils.mjs` (loopback bind, shared readiness probes), refactored smoke/e2e, added `local-launch-rehearsal-order.mjs`, `tests/mvp-launch-tooling.test.mjs`, `docs/LOCAL-LAUNCH-REHEARSAL.md`; `npm run verify:local-launch-readiness` passed end to end. Area 7 **5/5 complete**. Area 1 one-command wrapper also **complete**.
- **MVP usability Area 6 support, accessibility, and recovery UX (29 June 2026)** — added `/support` to account quick links, support hub link on `/accessibility`, support action on assessment recovery, `mvp-support-recovery-rehearsal.mjs`, `tests/mvp-support-recovery.test.mjs`, `npm run test:support-recovery-rehearsal`. Area 6 **5/5 complete**.
- **MVP usability Area 1 runtime rehearsal hardening (29 June 2026)** — aligned the rehearsal pipeline on `.next-rehearsal`, added `prepare-next-build.mjs`, strengthened startup readiness probes for `/`, `/api/auth/providers`, `/api/account/overview`, and `/api/dashboard/home`, and refactored `route-smoke` / `launch-e2e` into reusable functions for scripted launch checks.
- **Area 1 direct verification green (29 June 2026)** — `npm run lint`, `npm run type-check`, `npm run build`, `npm run test`, `npm run test:smoke`, and `npm run test:e2e` all passed after the runtime hardening pass. The new `verify:local-launch-readiness` wrapper exists but still needs one final operator-terminal rerun because the Codex sandbox hit loopback `listen EPERM` during the chained smoke phase.
- **MVP usability Area 5 auth and account (29 June 2026)** — `mvp-auth-account-rehearsal.mjs`, `tests/mvp-auth-account.test.mjs`. Area 5 **5/5 complete**.
- **MVP usability Area 4 saved progress continuity (29 June 2026)** — `mvp-continuity-rehearsal.mjs`, `tests/mvp-continuity.test.mjs`, `start-first-session` routes to `/exams`, results continuity recovery. Area 4 **4/4 complete**.
- **MVP usability Area 3 exams and assessments (29 June 2026)** — `mvp-exam-assessment-rehearsal.mjs`, assessment recovery route, contract tests. Area 3 **6/6 complete**.
- **MVP usability Area 2 route clickability (29 June 2026)** — canonical MVP route map, contract tests, `npm run test:route-clickability`. Area 2 **6/6 complete**.
- **Mark 3.2 styling unification deployed (29 June 2026)** — `mark32Ui` tokens across live routes; commit `2d6a1e4`; Fly deploy succeeded.
- **MVP usability Area 9 progress recorded (29 June 2026)** — added Area 9 to `docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md` with step table (`6/9` complete: masterplan, live dashboard, shell, Fly deploy, docs sync done; route-wide extension open). Synced in `FINAL-PHASE-PLAN.md`, `PLATFORM-GUIDE.md`, and README build record.
- **The Switch Platform v4 UI/UX Redesign added to docs (29 June 2026)** — the active usability hardening lane is now explicitly named in repo docs as **The Switch Platform v4 UI/UX Redesign**, tracked through `docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md` and the UI masterplan.
- **Mark 3.2 streamlined dashboard UI (29 June 2026)** — added `docs/design/UI-UX-MASTERPLAN.md` and live Mark 3.2 zones on `/dashboard` (Continue learning, Next exam, Today's goal, Power Grid progress, subject rings, weakest topics). All existing MVP sections preserved below the fold. Study Atelier light-mode tokens; top study rail unchanged.
- **Mark 3.2 deployed to Fly (29 June 2026)** — `fly deploy -a the-switch-platform` succeeded; permanent production at https://theswitchplatform.com
- **MVP usability launch-readiness plan added (29 June 2026)** — created `docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md` as the named practical follow-on plan for making the current MVP feel fully clickable, usable, and real-world ready without reopening Priority A truth evidence.
- **Streamlined live UI deployed to Fly (29 June 2026)** — `fly deploy -a the-switch-platform` succeeded; live at https://theswitchplatform.com with calmer homepage/dashboard, Exams in study rail, and Fly-only persistence.
- **Fly-only persistence cleanup completed (29 June 2026)** — removed the dormant Vercel Blob adapter, deleted `.vercel` and Netlify deploy artifacts, simplified the persistence/admin/governance runtime back to the mounted-filesystem path used in Fly production, and refreshed `package-lock.json`.
- **Streamlined website mockup added (26 June 2026)** — new route `/streamlined-mockup` shows a calmer homepage direction and a decluttered signed-in dashboard concept using the existing Study Atelier visual language. Entry link added to `/mock-idea-preview`.
- **Priority A onboarding proof split + fresh closeout (26 June 2026)** — re-ran `npm run verify:priority-a-closeout`; all strict real-auth steps green. Fresh canonical evidence: `release-evidence/2026-06-26-priority-a-canonical-closeout.md`. `verify:live-onboarding` is recorded separately as API-assisted/synthetic regression only (not strict A-4). A-4 remains browser-authenticated proof in `release-evidence/2026-06-25-priority-a-truth-audit.md`.
- **Launch-readiness hardening (26 June 2026)** — fixed the checked-in TypeScript blocker in `src/modules/operations/overview.ts` and tightened Priority A closeout wording so strict real-auth evidence no longer implies that `verify:live-onboarding` is part of the strict chain.
- **ChatGPT prompt pack added (26 June 2026)** — added reusable prompt files for external analysis and website streamlining: `docs/CHATGPT-PROJECT-AUDIT-PROMPT.md`, `docs/CHATGPT-WEBSITE-STREAMLINE-PROMPT.md`, and `docs/CHATGPT-PROMPTS-README.md`.
- **Final source-of-truth doc sync (26 June 2026)** — aligned `AGENTS.md`, `HANDOFF.md`, `PLATFORM-GUIDE.md`, `docs/ideas/README.md`, `docs/ideas/STREAMLINE-WEBSITE-PLAN.md`, and the Mock Idea reference docs so the active repo entry points all describe the same closed A–D / deferred E story.
- **Priority D-5 content/editorial quality pass (26 June 2026)** — updated admin, operations, CMS release-check, and subject-route copy so current live surfaces describe the MVP plainly without stale placeholder or pre-launch wording; restored the canonical 25 June Priority A evidence bundle and removed the stray failed 26 June rerun file.
- **Priority D hardening pass (26 June 2026)** — added auth session lifecycle coverage for sign-out/session denial assumptions, added `StudentAppShell` route coverage tests, and aligned launch governance assertions with the completed Priority A closeout/admin wording.
- **Priority B roadmap-reference sync (26 June 2026)** — docs that point to `FINAL-PHASE-PLAN.md` now describe it as the full remaining-work audit instead of the old `FP-*` redesign tracker; historical FP references are kept but labeled as archive context.
- **Priority B stale-note cleanup (26 June 2026)** — active README/admin/governance truth surfaces now say Priority A is complete; older near-launch wording is explicitly marked as historical archive context instead of current live status.
- **Priority A doc sync (26 June 2026)** — aligned `HANDOFF`, `AGENTS`, `README`, `PLATFORM-GUIDE`, `FINAL-PHASE-PLAN`, and `.cursor/rules` so Priority A is **COMPLETE** everywhere; active lane is **Priority B**.
- **Priority A — COMPLETE (26 June 2026)** — `npm run verify:priority-a-closeout` passed end to end. **A-6** canonical evidence bundle and **A-8** truth-match green. Canonical evidence: `release-evidence/2026-06-26-priority-a-canonical-closeout.md`. Fixed `verify-live-onboarding.mjs` dashboard shell assertion (Study Atelier / study home markers).
- **A-6 / A-8 closeout tooling** — `npm run verify:check-live-cookies`, `npm run verify:priority-a-closeout`, Fly-delegated persistence/sign-off in `launch-complete.mjs`.
- **Mock Log in visibility** — marketing header layout fixed so **Log in** is never clipped in the mock gallery; nav always visible on mobile; explicit **Log in** on homepage hero, `/mock-idea-preview` top bar, and signed-out student shell.
- **Auth allowlist showcase** — `allowlist-service.ts`, `AuthAccessPathPanel` on `/login?intent=admin`, `/account`, and `/admin`; shows student vs admin path, masked allowlist entries (admin/editor viewers), and live sign-in record (email, provider, roles, session expiry). Tests: `tests/auth-allowlist.test.mjs`. Admin sign-in URL: `/login?intent=admin&returnTo=/admin`.
- Fresh production student/admin cookies authenticated real Google OIDC sessions on `https://theswitchplatform.com`
- Strict real-auth OIDC proof passed
- Live readiness passed
- Fly production persistence recovery passed again on real `/data`
- Fly production launch sign-off passed
- Strict `npm run verify:live-truth-match` passed after blanking `SWITCH_LAUNCH_VERIFICATION_SECRET` for the process
- `launch-complete`, `live-truth-match`, `verify-live-oidc-proof`, and related helpers were hardened for real-provider selection, Fly runtime `npm`, delegated sign-off, and stricter real-auth sequencing

### What is next

- Commit brand mockup route + gallery links when operator asks (keep separate from unrelated WIP on the working tree)
- Merge `cursor/fix-live-onboarding-cold-start` to `main` and rerun `npm run verify:live-onboarding` from `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- **Future boards (year 1+):** OCR / Eduqas when seeded content exists — do not offer in onboarding until papers exist
- Continue Mark 4 Phase 7 public marketing refinement when ready
- Keep future board expansion wired through the completed inventory/specification path instead of adding direct route-level exceptions
- **Priority E:** **closed for year 1** — Wales/NI routes, parent/teacher onboarding, admin restyle, i18n, broader content expansion remain deferred; operator must explicitly reopen after year 1
- Keep future release reruns synced with `release-evidence/2026-07-05-priority-a-canonical-closeout.md`
- Refresh live cookies again via `/account/live-cookie-guide` only when a future release rerun needs fresh strict real-auth proof

### Completion snapshot

- **Priority A:** `8 / 8` complete
- **Priority B:** `4 / 4` complete
- **Priority C:** `10 / 10` complete
- **Priority D:** `6 / 6` complete
- **Historical production closeout plan:** `28 / 28` complete (`100%`) — this is the recorded Fly production end-completion snapshot, not a blanket claim about any in-progress branch
- **Current branch readiness:** `100%` after the 5 July 2026 refreshed canonical closeout rerun

### Blockers

- No local verification blocker after the 5 July 2026 repair pass
- Live cookies expire periodically — refresh via `/account/live-cookie-guide` before re-running closeout
- No active blocker for the 502 outage after the Fly memory increase

### Verification last run

Fresh rerun on 6 July 2026 (`11_UI_UX_MASTER_GUIDE.md` + Phase 7 homepage):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (`198/198` passed)

Fresh rerun on 6 July 2026 (Power Grid six-rank XP presentation):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (`198/198` passed, includes `power-grid-rank-presentation.test.mjs`)

Fresh rerun on 6 July 2026 (brand logo mockup gallery):

- [x] `npm run type-check`
- [x] `curl http://localhost:3000/brand-mockup` → `200` after clearing stale `.next` dev cache

Fresh rerun on 6 July 2026 (supportive onboarding cold-start hardening):

- [x] `tests/mvp-launch-tooling.test.mjs` (supportive warm-up contract checks)
- [x] `node --check scripts/live-route-walkthrough.mjs`
- [ ] `npm run verify:live-onboarding` (rerun from project root after merge; prior 5 July closeout failure was supportive-only)

Fresh rerun on 5 July 2026 (branch-readiness repair pass):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (192 tests)
- [x] `npm run build`
- [x] `npm run verify:local-launch-readiness` (passed end to end on unsandboxed rerun after sandbox `listen EPERM 127.0.0.1`)
- [x] `npm run deploy:fly`
- [x] `curl -I https://theswitchplatform.com` (`HTTP/2 200`)
- [x] `npm run verify:live-readiness`
- [x] `npm run verify:launch-status` (truthful historical-closeout wording repaired)
- [x] `npm run verify:check-live-cookies` (fresh student/admin cookies valid)
- [x] `verify:live-truth-match`
- [x] `verify:live-walkthrough:real-auth`
- [x] `npm run verify:priority-a-closeout` → `release-evidence/2026-07-05-priority-a-canonical-closeout.md`
- [!] `verify:live-onboarding` failed as supportive API-assisted regression only; strict A-4 browser proof and canonical closeout remain valid

Fresh rerun on 1 July 2026 (content system completion pass):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (189 tests)
- [x] `npm run build`
- [x] `npm run deploy:fly`
- [x] `curl -I https://theswitchplatform.com` (`HTTP/2 200`)

Fresh rerun on 1 July 2026 (preview app navigation pass):

- [x] `npm run type-check`

Fresh rerun on 1 July 2026 (quiz feedback + Power Grid integration):

- [x] `npm run type-check`
- [x] `npm run test` (191 tests)

Fresh rerun on 1 July 2026 (Combined Science variation picker):

- [x] `npm run type-check`
- [x] `npm run test` (192 tests)

Fresh rerun on 1 July 2026 (specification engine foundation):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (184 tests)

Fresh rerun on 1 July 2026 (Combined Science full papers):

- [x] `npm run type-check`
- [x] `npm run test` (178 tests)

Fresh rerun on 1 July 2026 (login sign-in layout simplification):

- [x] `npm run type-check`
- [x] `npm run build`
- [x] `npm run deploy:fly`

Fresh rerun on 1 July 2026 (live 502 recovery):

- [x] `npm run deploy:fly`
- [x] `fly machine list -a the-switch-platform` (`shared-cpu-1x:1024MB`)
- [x] `curl -I https://theswitchplatform.com` (`HTTP/2 200`)

Fresh rerun on 1 July 2026 (merge + build fix on main):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (176 tests)
- [x] `npm run build`
- [x] `npm run deploy:fly` (`1036ef0` on Fly — 1 July 2026)
- [x] Live onboarding personalization smoke-check on https://theswitchplatform.com (API-assisted — 1 July 2026)

Fresh rerun on 30 June 2026 (onboarding personalization watertight pass):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (176 tests)

Fresh rerun on 30 June 2026 (Mark 4 Phase 6 onboarding + exam availability):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (172 tests)

Earlier rerun on 30 June 2026 (Mark 4 progress + exams pass):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (167 tests)

Earlier rerun on 1 July 2026 (onboarding UK school lookup pass):

- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run test` (164 tests)

Earlier 30 June 2026 rehearsal baseline:

- [x] `npm run build`
- [x] `npm run test:support-recovery-rehearsal`
- [x] `npm run verify:local-launch-readiness` — full core chain green (30 June 2026)

Most recent Priority A closeout rerun on 26 June 2026:

- [x] `npm run verify:check-live-cookies`
- [x] `npm run verify:launch-status`
- [x] `npm run verify:live-onboarding` (API-assisted regression — **not** strict A-4)
- [x] `npm run verify:launch-complete` (strict real-auth; `SWITCH_LAUNCH_VERIFICATION_SECRET` blanked)
- [x] `npm run verify:live-truth-match` (A-8)
- [x] `npm run verify:priority-a-closeout` (A-6 canonical bundle → `release-evidence/2026-06-26-priority-a-canonical-closeout.md`)

---

## Plain-English — what the project is doing (operator + agents)

**Read this section with `AGENTS.md` and `README.md` → Operator and agent sync.** All three stay aligned; live task detail is always in **Live session state** above.

### In one sentence

The Switch is a **live GCSE revision platform** (https://theswitchplatform.com). **Priority C** (product finish), **Priority A** (truthful completion), and **Priority D** (quality/tests and copy hardening) are **complete**. Only deferred Priority E scope remains.

### Where we are

| Stage | Plain English | Status |
|-------|---------------|--------|
| **Final Path Mark 2** | All 22 launch items proved on Fly production | **Complete — 26 June 2026** |
| **Priority A — truthful completion** | A-1 through A-8 with canonical evidence bundle | **Complete — 26 June 2026** |
| **Priority C — product finish** | Shell, exams focus mode, planner, marketing chrome, recovery UI | **Complete — 24 June 2026** |
| **Prior polish (Phases 1–2)** | Marketing shell, dashboard declutter, shell on main study routes | **Done** |
| **Final Phase — current MVP** | **Priorities A–D complete** | **Closed** |
| **Optional (FP-6)** | Wales/NI GCSE, parent/teacher onboarding, admin restyle | **Operator gate only** |

### Two lanes — do not mix them

| Lane | What it means | Do |
|------|----------------|-----|
| **A — Onboarding** | 8-step guided setup **creates the student dashboard** (subjects, support, access) | **Keep all 8 steps.** Secondary school + England GCSE/iGCSE only for MVP. Wales/NI signposted “coming later”. |
| **B — Website shell** | Public homepage + signed-in dashboard layout | **Complete** — Priority C shipped 24 June 2026 |

```mermaid
flowchart TD
  subgraph done["Done — launch"]
    D1["22-item checklist"]
    D2["theswitchplatform.com on Fly"]
  end
  subgraph laneA["Lane A — Onboarding stays"]
    A1["Sign in"]
    A2["8 steps incl. secondary school"]
    A3["Personal dashboard"]
    A1 --> A2 --> A3
  end
  subgraph donePolish["Done — prior polish"]
    B1["Calmer homepage"]
    B2["Focused dashboard"]
    B3["Shell: dashboard, subjects, assessments, progress"]
  end
  subgraph doneC["Done — Priority C (24 June 2026)"]
    C1["Shell on all student routes"]
    C2["Exams focus mode"]
    C3["Weekly planner + dismiss"]
    C4["Marketing chrome + recovery"]
  end
  subgraph doneA["Done — Priority A (26 June 2026)"]
    PA1["Real OIDC proof"]
    PA2["Canonical closeout bundle"]
  end
  subgraph doneD["Done — Priority D"]
    D1["Quality and test hardening"]
    D2["Content and admin copy pass"]
  end
  subgraph later["Later — FP-6 operator gate"]
    L1["GCSE Wales + Northern Ireland"]
  end
  done --> laneA
  done --> donePolish
  donePolish --> doneC
  doneC --> doneA
  doneA --> doneD
  doneD --> later
```

### Onboarding MVP (locked 24 June 2026)

| Step | Learner sees | MVP rule |
|------|--------------|----------|
| 1 Qualification | GCSE (England) or iGCSE | Wales + Northern Ireland = **coming later** (visible, not selectable) |
| 3 School | Secondary school name | **UK-wide** nation picker + official school-finder links |
| 8 Consent | Open my dashboard | Incomplete users cannot reach `/dashboard` until finished |

Full detail: `src/modules/onboarding/README.md` · **Active plan:** `docs/ideas/FINAL-PHASE-PLAN.md`

### Doc read order (every session)

```mermaid
flowchart LR
  H["1. HANDOFF.md\nlive state"] --> F["2. FINAL-PHASE-PLAN.md\nactive roadmap"]
  F --> P["3. PLATFORM-GUIDE.md\nrules + modules"]
  P --> R["4. README sections\nwhen handoff points"]
  H --> M["Module README\nif touching one module"]
```

| Doc | You read it for |
|-----|-----------------|
| `HANDOFF.md` | **What is happening now**, next steps, blockers |
| **`docs/ideas/FINAL-PHASE-PLAN.md`** | **Completion record** — current MVP closeout + deferred scope |
| `AGENTS.md` | Agent entry + launch list (same story as here) |
| `README.md` | Product rules + **Ordered Build Record** (history) |
| `PLATFORM-GUIDE.md` | Architecture, modules, 22-item list detail |
| `docs/ideas/` | Plan index — **FINAL-PHASE-PLAN** active; prior plans historical |
| `docs/MOCK-IDEA-*.md` | UI build direction |

---

## Dual-agent document system (Cursor + Codex)

**Plain English:** Two AI tools share one repo. **`HANDOFF.md` is the baton** — whoever finishes must update it before the other starts. The four core markdown files below stay in sync; do not let them drift.

### Who does what

| Tool | Best for | Must read first | Must update before handoff |
|------|----------|-----------------|----------------------------|
| **Cursor Agent** | Multi-file UI, API, tests, terminal, git | `HANDOFF.md` | `HANDOFF.md` Live session state + **`AGENTS.md` sync** + session log |
| **Codex** | Planning, review, debugging, focused service logic | `HANDOFF.md` | Same |

### The four core markdown files — read and write

| File | Read when | Write when | Plain English |
|------|-----------|------------|---------------|
| **`HANDOFF.md`** | **Every session start** | **After every action** + session end | *What is happening right now* — live task, blockers, next step |
| **`AGENTS.md`** | Session start (after HANDOFF) | **After every action** when live state or project story changes — **non-negotiable** | *Front door for agents* — same story as HANDOFF, links inward |
| **`PLATFORM-GUIDE.md`** | Before code or module work | When architecture, modules, or dev rules change | *How to build* — rules, modules, 22-item list detail |
| **`README.md`** | When handoff points (build record, MVP spec) | **Append only** — Ordered Build Record + MVP notes | *Product history* — what we asked for and what shipped (never delete old records) |

**Rule:** If you change the project story (MVP scope, lanes, live status), update **HANDOFF + AGENTS + README operator section + PLATFORM-GUIDE session/MVP notes** in the same session.

```mermaid
flowchart TB
  subgraph operator["You (operator)"]
    O1["Read HANDOFF Live session state"]
  end
  subgraph cursor["Cursor Agent"]
    C1["Code / UI / tests / git"]
    C2["Update HANDOFF"]
  end
  subgraph codex["Codex"]
    X1["Plan / review / service logic"]
    X2["Update HANDOFF"]
  end
  subgraph docs["Four core MD files — stay aligned"]
    H["HANDOFF.md"]
    A["AGENTS.md"]
    P["PLATFORM-GUIDE.md"]
    R["README.md"]
  end
  O1 --> H
  H --> C1
  H --> X1
  C1 --> C2 --> H
  X1 --> X2 --> H
  H --- A
  H --- P
  H --- R
```

### Standard prompt — paste into Cursor or Codex

```text
Project: The Switch Platform Mark 3.2
Root: /Users/lloydnwagbara/Documents/THE SWITCH 3
Live: https://theswitchplatform.com

Read HANDOFF.md first.

Then read in order:
1. HANDOFF.md → Live session state + Plain-English story + MVP at a glance
2. docs/ideas/FINAL-PHASE-PLAN.md → current closeout record and any operator-approved Priority E item
3. AGENTS.md → agent entry
4. PLATFORM-GUIDE.md → rules + modules (section handoff points to)
5. README.md → sections only when handoff points (build record, MVP spec)

Task: [one module only — pick from FINAL-PHASE-PLAN.md]
Priority #: 5 Dashboard (Final Phase)

Rules:
- Dual-agent: update HANDOFF before switching tools; commit + push when done
- Onboarding stays (8 steps) — builds dashboard; England GCSE + iGCSE MVP
- Active plan: docs/ideas/FINAL-PHASE-PLAN.md — prior phases complete
- One module per session; API-first; mobile + accessibility first

On completion:
- npm run lint && npm run type-check && npm run test
- Update HANDOFF Live session state + session log
- Append README Ordered Build Record if behavior changed
- Commit and push
```

---

## MVP at a glance (operators + agents)

**Synced copies:** `AGENTS.md` · `PLATFORM-GUIDE.md` · `README.md` → MVP at a glance. **Full product history** stays in `README.md` → Mark 3.2 Product Spec / Blueprint (append only — do not delete).

### What The Switch is

| | |
|--|--|
| **Product** | GCSE / iGCSE revision, timed practice, exam readiness, progress tracking |
| **Live site** | https://theswitchplatform.com (Fly.io) |
| **Launch status** | Live on Fly; Final Path Mark 2 and Priority A **complete** (26 June 2026) |
| **Current phase** | Priority **B** docs sync · Priority **A** complete (26 June 2026) · Priority **C** complete (24 June 2026) |
| **Launch exam material** | Enough for the live MVP today: 6 seeded full-paper routes — AQA Maths, Edexcel Maths, Edexcel English Language, AQA Combined Science, Edexcel Combined Science, Cambridge iGCSE Maths |

### Core MVP modules (build priority order)

| # | Module | Plain English |
|---|--------|---------------|
| 1 | Exam Engine | Full papers, timing, exam mode |
| 2 | Power Grid | Progress levels and “what to do next” |
| 3 | Saved Progress | Autosave and resume everywhere |
| 4 | Read Aloud | Text-to-speech in student flows |
| 5 | Dashboard | Student home — aggregates modules |
| 6 | Timed Assessments | Shorter timed checkpoints |
| 7 | Full GCSE Exams | Official-duration exam path |
| 8 | Content / editorial | Fact-check before students see content |
| 9 | Results | Performance summaries |
| 10 | Recommendations | Next-step suggestions |
| 11 | Accessibility | Contrast, font, focus, SEND settings |
| 12 | Access Arrangements | Exam support foundation (independent module) |

**Also in MVP:** Guided **onboarding** (8 steps) · **Auth** · **Support Hub** signposting · **CMS/Admin** placeholder

### Launch subjects (student-visible catalog)

| Subject | Qualification |
|---------|---------------|
| Mathematics | GCSE (England) |
| English Language | GCSE (England) |
| Combined Science (biology, chemistry, physics) | GCSE (England) |
| Mathematics | iGCSE |

Wales / Northern Ireland GCSE routes: **coming later** (signposted in onboarding, not selectable).

### Key student routes

| Route | Purpose |
|-------|---------|
| `/` | Public homepage (marketing) |
| `/login` | Sign in (Google / Microsoft) |
| `/onboarding` | 8-step setup — **creates the dashboard** |
| `/dashboard` | Signed-in home (gated until onboarding complete) |
| `/subjects` | Subject and topic revision |
| `/assessments` | Timed assessments |
| `/exams` | Full exam sessions |
| `/progress` | Saved progress / planner destination |
| `/accessibility` | Accessibility + SEND colour settings |
| `/support` | Support Hub (signposting only) |

### Onboarding MVP (locked — do not shorten)

| Step | What learner does |
|------|-------------------|
| 0 | Account type (student / parent / teacher) |
| 1 | Qualification — **GCSE (England)** or **iGCSE** (Wales/NI shown as coming later) |
| 2 | Year group profile |
| 3 | **Secondary school** name — **England** nation only (MVP) |
| 4 | MVP subjects from catalog |
| 5 | Accessibility / access / SEND choices (optional) |
| 6 | Guardian invite (optional) |
| 7 | Consent → **personal dashboard** |

Detail: `src/modules/onboarding/README.md`

### Final Phase status (authoritative)

| Priority | Lane | Status |
|----------|------|--------|
| **A** | Truthful completion (proof gap) | **Active** |
| **B** | Docs / governance sync | Open |
| **C** | Product completion (shell, planner, marketing, recovery) | **Complete — 24 June 2026** |
| **D** | Quality / test coverage | Open |
| **E** | Deferred (operator gate) | Not started |

Detail and checklist → `docs/ideas/FINAL-PHASE-PLAN.md`

### UI direction (post-launch)

| Item | Where |
|------|-------|
| Study Atelier shell | `src/components/mock-idea/` |
| Build reference | `docs/MOCK-IDEA-BUILD-REFERENCE.md` |
| Visual gallery | `/mock-idea-preview` |
| Brand logo mockup | `/brand-mockup` — `brand-logo-mockup.tsx` · entry from gallery |
| Streamline plan (historical) | `docs/ideas/STREAMLINE-WEBSITE-PLAN.md` |
| **Active plan** | **`docs/ideas/FINAL-PHASE-PLAN.md`** |

---

## Source of truth

| Item | Value |
|------|-------|
| Active local folder | `/Users/lloydnwagbara/Documents/THE SWITCH 3` |
| GitHub remote | `https://github.com/tech-fresh/the-switch-platform` |
| Do not use | `/Users/lloydnwagbara/Documents/THE SWITCH` or `THE SWITCH 2` |
| Agent rules | `PLATFORM-GUIDE.md` (via `AGENTS.md` entry point) |
| Product history | `README.md` (cumulative — append only) |
| Recovery notes | `PROJECT_RECOVERY.md`, `RESTORED_CHATS.md` |
| Session handoff | `HANDOFF.md` (this file) |
| Cursor-only rules | `.cursor/rules/` (active — 4 rule files) |

---

## Document map

| Document | Purpose |
|----------|---------|
| `HANDOFF.md` | **Live session state** + plain-English story + **dual-agent map** + **MVP at a glance** (this file) |
| `AGENTS.md` | Agent entry — synced with HANDOFF |
| `README.md` | Product rules + **MVP at a glance** + Ordered Build Record — synced operator section at top |
| `PLATFORM-GUIDE.md` | Rules, modules, full 22-item launch list, operator sync |
| `docs/ideas/` | **Active:** `FINAL-PHASE-PLAN.md` · Historical: `STREAMLINE-WEBSITE-PLAN.md` |
| `src/modules/onboarding/README.md` | Onboarding MVP scope (England GCSE, secondary school) |
| `docs/MOCK-IDEA-BUILD-REFERENCE.md` | UI build-from reference |
| `.cursor/rules/` | Cursor enforcement |

---

## Workflow diagram

```mermaid
flowchart LR
    A["PLATFORM-GUIDE.md + README sections"] --> B["Cursor Agent"]
    A --> C["Codex"]
    B --> D["Feature branch + commit"]
    C --> D
    D --> E["HANDOFF.md update"]
    E --> F["GitHub origin/main"]
    F --> B
    F --> C
```

---

## Session start checklist

Before any code or doc change:

1. Tell the agent: `Read HANDOFF.md first.`
2. Read this file (`HANDOFF.md`) → Live session state + What is next
3. Read **`docs/ideas/FINAL-PHASE-PLAN.md`** → next open Priority **B** or **D** item
4. Read `AGENTS.md` → Session rules, architecture, and completion standard
5. Read `README.md` → Non-negotiable development rules + Active build priority order
6. Read `PROJECT_RECOVERY.md` if folder or history context is unclear
7. Read the relevant `src/modules/<module>/README.md`
8. Run `git status` and `git pull origin main` (or checkout the active feature branch)
9. Confirm the task maps to **one module** and one Final Phase priority item (B, D, or E — not A or C unless reopened)
10. Paste the standard session prompt below into the active tool

---

## Session end checklist

Before stopping or switching tools:

1. Run `npm run lint && npm run type-check && npm run test`
2. Run `npm run test:smoke` if routes or pages changed
3. Run `npm run verify:release` for bigger release or launch-path changes
4. Commit with a clear module-focused message
5. Confirm push to GitHub succeeded
6. Update **Live session state** in this file
7. Add a new **Session log** entry at the top
8. Append to `README.md` Ordered Build Record if routes, modules, or behavior changed

---

## Standard session prompt

Copy into Cursor or Codex at the start of each session:

```text
Project: The Switch Platform Mark 3.2
Root: /Users/lloydnwagbara/Documents/THE SWITCH 3
GitHub: https://github.com/tech-fresh/the-switch-platform

Session start instruction: Read HANDOFF.md first.

Read first:
1. HANDOFF.md
2. AGENTS.md
3. README.md priorities and non-negotiable rules
4. src/modules/<relevant-module>/README.md

Task: [one module only]
This task serves priority #: [number or setup/launch]

Rules:
- Follow build priority order unless explicitly overridden
- One module per session
- API-first: no business logic only in page components
- Use src/lib/server/api.ts wrappers in API routes
- Do not mix exam, progress, content, or access-arrangements logic across modules
- Mobile-first and accessibility-first
- Append README build record if routes/modules/behavior changed

On completion:
- lint, type-check, test
- commit and push
- update HANDOFF.md live session state and session log

Do NOT use THE SWITCH or THE SWITCH 2 folders.
```

---

## Branch and concurrency rules

- Default branch: `main`
- Use `feature/<module>-<short-description>` for focused feature work when requested
- One feature branch per task when branching
- Do not let Cursor and Codex edit the same branch with uncommitted changes
- Commit, push, and update this file before switching tools
- Do not delete rules, routes, modules, or documentation unless explicitly requested

---

## Tool split

| Work type | Preferred tool |
|-----------|----------------|
| Multi-file UI + API + tests | Cursor Agent |
| File edits, refactors, UI changes, code navigation | Cursor Agent |
| Focused module service logic | Codex or Cursor |
| Planning, reviewing, debugging, explaining changes | Codex |
| PRs, repo search, terminal verification | Cursor Agent |
| Design-system UI following Changes 1.0 | Either — follow `AGENTS.md` Design System Index |

---

## Active build priority order

State which priority item each task serves. Do not skip higher-priority work unless explicitly overridden — record the reason here and in the README build record if you do.

1. Exam Engine
2. Power Grid
3. Saved Progress
4. Read Aloud
5. Dashboard
6. Timed Assessments
7. Full GCSE Exams
8. Content Fact-Checking And Editorial Workflow
9. Results
10. Recommendations
11. Accessibility
12. Access Arrangements foundation

Special labels:

- `setup` — project workflow, docs, multi-agent process
- `launch — Final Path Mark 2` — live deployment, auth, persistence, governance verification

---

## Final Path Mark 2 — live state (23 June 2026)

**Authoritative completion list:** this section **and** `AGENTS.md` **and** `README.md` → Full End-to-End Completion List (22 items). Also mirrored in `PLATFORM-GUIDE.md`.

**Preservation rule:** This is the **final** launch checklist. **Do not replace, shorten, or delete** these 22 items. Do not overwrite session log history below — only append status updates and evidence.

Plain-English: this is the full launch checklist. Every line must be green before we call the platform “100% complete.” **All 22 items are now complete** on Fly production.

### Full End-to-End Completion List (22 items — final, do not replace)

1. Configure the real live auth environment (`SWITCH_AUTH_MODE=oidc`, secrets, base URL, one complete OIDC provider block).
2. Prove the real deployed sign-in flow (sign-in, callback, session, sign-out, protected routes).
3. Prove the real deployed sign-up and onboarding flow (welcome through first dashboard provisioning).
4. Configure the real live persistence environment (`SWITCH_PERSISTENCE_DRIVER=sqlite`, `SWITCH_DATA_DIRECTORY`).
5. Prove live student-data continuity (saved progress, results, account settings, sessions).
6. Prove backup, restore, and recovery for the student-data path.
7. Configure the live CMS and editorial runtime (`SWITCH_CMS_BACKEND_MODE=live`).
8. Prove the live editorial workflow (review, approve, publish, rollback, blocked content).
9. Configure live governance recording (`SWITCH_RECORD_GOVERNANCE=1`, environment).
10. Provide named launch ownership (`SWITCH_LAUNCH_APPROVER`, `SWITCH_LAUNCH_STOP_AUTHORITY`).
11. Provide governance review notes (privacy, safeguarding, release).
12. Provide governance sign-off notes (privacy, safeguarding, alerts, incident, release).
13. Configure the live base URL (`SWITCH_LIVE_BASE_URL`).
14. Provide live route test access (student/admin cookies or external-header equivalents).
15. Run `npm run verify:launch-status`.
16. Run `npm run verify:live-readiness`.
17. Run `npm run verify:persistence-recovery`.
18. Run `npm run verify:live-walkthrough`.
19. Run `npm run verify:launch-signoff`.
20. Run `npm run verify:launch-complete`.
21. Store release evidence permanently in `release-evidence/`.
22. Confirm system-wide truth matches — `npm run verify:live-truth-match`. **Completed — 23 June 2026 (Fly production).**

Full item descriptions: see `README.md` → Final Path Mark 2 → Full End-to-End Completion List.

#### Item 3 completion record (23 June 2026)

**Status: COMPLETE** on https://theswitchplatform.com

| Proof | Result |
|-------|--------|
| Browser-authenticated production walkthrough | Recorded in `release-evidence/2026-06-25-priority-a-truth-audit.md` |
| `npm run verify:live-onboarding` | Passed — API-assisted fresh learner simulation → dashboard |
| Evidence file | `release-evidence/2026-06-23-final-path-mark-2-item-3-complete.md` |
| UI mockup (visual) | `docs/SENECA-STYLE-ONBOARDING-MOCKUP.md` |
| UI build reference | `docs/MOCK-IDEA-BUILD-REFERENCE.md` |
| AI ideas bank | `docs/MOCK-IDEA-AI-IDEAS.md` |

#### Item 3 progress note (23 June 2026 — appended)

- Code shipped: `/onboarding`, onboarding API, dashboard gate.
- **Superseded by completion record above** — live proof passed 23 June 2026.
- **Do not replace** the 22-item list — append evidence notes only.

#### Item 3 MVP scope (24 June 2026 — current)

- Onboarding **stays** (8 steps) — it **creates the student dashboard**.
- Step 3: **secondary school**, England nation only (MVP).
- Step 1: **GCSE (England)** + **iGCSE**; Wales/NI **coming later**.
- Module doc: `src/modules/onboarding/README.md` · Active plan: `docs/ideas/FINAL-PHASE-PLAN.md`

| Area | Status |
|------|--------|
| Live auth (Google + Microsoft) | **Done** — browser sign-in proven |
| Live persistence (sqlite `/data` on Fly) | **Done** |
| Governance + launch sign-off | **Done** — TF Solutions recorded |
| Live walkthrough + readiness checks | **Done** |
| Item 22 truth-match | **Completed** — docs, admin view, and live site agree |
| Honest platform label | **`fully complete`** |

**Evidence file:** `release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md`

**Live host:** https://theswitchplatform.com (Fly.io — not Vercel/Netlify for production)

Re-check item 22 anytime:

```bash
npm run verify:live-truth-match
```

```mermaid
flowchart LR
    A["22 checklist items"] --> B["Item 22: truth match"]
    B --> C["All complete"]
    C --> D["fully complete"]
```

---

## Architecture gate

Every change must follow this flow:

```text
UI route (src/app) → thin component → module service (src/modules) → contracts/types → API route (src/app/api) → persistence (src/lib/persistence)
```

Rules:

- Keep modules independent
- No business logic only in `src/app/**/page.tsx`
- API routes use helpers from `src/lib/server/api.ts`
- Do not mix exam logic with progress logic
- Do not mix saved progress with content logic
- Keep Read Aloud separate from revision and quiz logic
- Keep Access Arrangements independent from other modules
- All student progress must auto-save
- Mobile-first UI and accessibility-first design

---

## Module name guide

| If working on… | Module value |
|----------------|--------------|
| Exams | `exam-engine` |
| Progress grid / next steps | `power-grid` |
| Save and resume | `saved-progress` |
| Read aloud | `read-aloud` |
| Home screen | `dashboard` |
| Short timed tests | `timed-assessment` |
| Sign-up / login | `auth` |
| Onboarding | `onboarding` |
| Content / CMS | `cms` or `content` |
| Live launch / deployment | `operations` or `governance` |
| Workflow / docs setup | `project-workflow` |

---

## Status guide

| Status | Meaning |
|--------|---------|
| `not started` | Task identified but work has not begun |
| `in progress` | Actively being worked on |
| `blocked` | Cannot continue until a blocker is resolved |
| `done` | Task complete for this session or slice |

---

## Priority quick reference

| Priority # | Area |
|------------|------|
| 1 | Exam Engine |
| 2 | Power Grid |
| 3 | Saved Progress |
| 4 | Read Aloud |
| 5 | Dashboard |
| 6 | Timed Assessments |
| 7 | Full GCSE Exams |
| 8 | Content Fact-Checking / Editorial |
| 9 | Results |
| 10 | Recommendations |
| 11 | Accessibility |
| 12 | Access Arrangements |

---

## Daily routine

### Start

- [ ] Open `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- [ ] `git pull origin main`
- [ ] Read this file → Active task + What is next + Blockers
- [ ] Read `AGENTS.md` + relevant module README
- [ ] Create or checkout feature branch if needed
- [ ] Paste standard session prompt
- [ ] State which priority # the task serves

### During

- [ ] One module only
- [ ] Match existing codebase patterns
- [ ] UI work: follow `AGENTS.md` Design System Index
- [ ] No cross-module logic mixing

### End

- [ ] `npm run lint && npm run type-check && npm run test`
- [ ] `npm run test:smoke` if routes changed
- [ ] Commit and push to GitHub
- [ ] Update Live session state in this file
- [ ] Add Session log entry
- [ ] Append README build record if product behavior changed

---

## Switching between Cursor and Codex

1. Complete the **Session end checklist**
2. Update **Live session state** — especially What is next and Blockers
3. Add a **Session log** entry naming the tool you are leaving
4. Commit and push
5. Open the other tool on `/Users/lloydnwagbara/Documents/THE SWITCH 3`
6. Run `git pull`
7. Read this file and paste the **Standard session prompt**

---

## Key files to read early

- `AGENTS.md` — rules, priorities, design system, completion standard
- `README.md` — product spec and build history
- `package.json` — scripts and commands
- `src/lib/server/api.ts` — API route wrappers
- `src/lib/persistence/runtime.ts` — persistence mode and storage paths
- `src/modules/exam-engine/service.ts` — highest-priority exam logic
- `src/modules/saved-progress/service.ts` — autosave and progress logic
- `src/modules/power-grid/service.ts` — progress and action summary logic

---

## Completion standard

- Complete each task fully before moving on
- Fix errors found during the task before calling work done
- Do not consider work complete until it builds, runs, and passes the relevant checks
- Verify git push succeeded before reporting completion
- Only change what the task asks for — no silent unrelated refactors

---

## Session log (newest first)

Add a new entry here at the end of every session. Do not delete older entries.

### 2026-07-06 — Cursor — UI master guide, Power Grid presentation, Phase 7 homepage, accessibility icon

- Branch: `cursor/fix-live-onboarding-cold-start`
- Done: `docs/design/11_UI_UX_MASTER_GUIDE.md`; six-rank Power Grid presentation layer; Phase 7 homepage (benefits, FAQ); premium dark redesign; brand mockup; quiz/inventory/specification WIP on branch; accessibility icon ♿ → 🎛️
- Docs: `HANDOFF.md`, `AGENTS.md`, `README.md` Ordered Build Record, `UI-UX-MASTERPLAN.md` pointer
- Verification: lint, type-check, test `198/198`
- Next: merge branch; rerun `verify:live-onboarding`; deploy for live UI

### 2026-07-06 — Cursor — Premium website redesign

- Branch: `cursor/fix-live-onboarding-cold-start` (redesign uncommitted on working tree)
- Module: premium UI / homepage / dashboard / subjects quiz
- Done: dark-mode premium redesign — `src/components/premium/*`, Linear sidebar, Stripe hero, Seneca quiz card, Power Grid sections; updated HANDOFF/AGENTS/README/UI-UX-MASTERPLAN
- Verification: lint, type-check, test `194/194`

### 2026-07-06 — Cursor — Brand logo mockup gallery + doc sync

- Branch: `cursor/fix-live-onboarding-cold-start` (brand mockup files uncommitted on working tree)
- Module: Mock Idea / brand surfaces
- Priority #: Mark 4 Phase 7 public marketing refinement (visual reference)
- Done: added `/brand-mockup` + `BrandLogoMockup` placement gallery; linked from `/mock-idea-preview` and mock-idea showcase; streamlined mockup hero uses `SwitchBrandLogo`; synced `HANDOFF.md`, `AGENTS.md`, `README.md`, `docs/MOCK-IDEA-BUILD-REFERENCE.md`, and `docs/design/UI-UX-MASTERPLAN.md`
- Done: recovered local dev ENOENT on `.next/server/app/brand-mockup/page.js` by clearing `.next` and restarting `npm run dev`
- Verification: `npm run type-check`; `/brand-mockup` → `200` locally
- Next: operator commit when ready; merge cold-start branch; deploy for live `/brand-mockup`

### 2026-07-01 — Codex — Content system completion pass

- Branch: main
- Module: specification-engine + exam-inventory
- Priority #: subject/specification + exam inventory full completion
- Done: added a central exam inventory module and seed file, registered all seeded papers (launch-safe + Year 10 + bridge), switched onboarding board options and `/api/exams/papers` to inventory truth, updated paper-consuming services to use the same live inventory, added `/api/exams/inventory` and `/api/content/specification-library`, surfaced inventory/specification visibility in `/admin`, and replaced student-visible placeholder objectives with imported board-specific objective coverage for live boards plus AQA separate-science future support
- Verification: `npm run lint`, `npm run type-check`, `npm run test` (`189/189` passed)
- Next: return to Mark 4 Phase 7 public marketing refinement or future board expansion through the same inventory/specification path

### 2026-07-01 — Codex — Subject library / specification engine foundation

- Branch: main
- Module: specification-engine
- Priority #: content/editorial foundation aligned with MVP priority #8
- Done: added `src/modules/specification-engine/` with types, service, validators, README, and `src/data/subjects/mvp-subject-library.json`; modelled MVP subject-library scaffolds for GCSE Maths, English Language, Combined Science, and iGCSE Maths; kept Combined Science separate from deferred Biology/Chemistry/Physics routes; added validation and service coverage in `tests/specification-engine.test.mjs`
- Next: connect the specification engine into the central all-exams inventory and future board-aware content import paths
- Blocker: none

### 2026-07-01 — Codex — Completion rule tightened

- Branch: main
- Module: project-workflow
- Priority #: operator instruction handling
- Done: updated repo entry docs so “complete” now means full requested scope end to end by default, not a scaffold, foundation, or partial implementation unless the operator explicitly asks for phased delivery
- Next: apply that stricter completion rule to future build requests
- Blocker: none

### 2026-07-01 — Codex — Onboarding UK school lookup clickability pass

- Done: upgraded onboarding step 3 from an England-only school note to a UK-wide clickable school-finder step with nation cards and official links for England, Scotland, Wales, and Northern Ireland
- Done: kept qualification routing truthful — the selectable study paths remain GCSE (England) and iGCSE even though school lookup is now UK-wide
- Verification: `npm run lint`, `npm run type-check`, `npm run test` (164/164 passed)
- Next: continue Mark 4 ranked batch on `/progress` and `/exams`, then deploy to Fly

### 2026-06-30 — Codex — Mark 4 homepage + login implementation pass

- Done: refreshed `/` and `/login` to a calmer stone/teal product surface with stronger hierarchy, cleaner CTAs, and a more premium unified sign-in shell
- Done: preserved the signed-out login route contract while upgrading the layout, including the unified auth markers used by tests and a visible Microsoft sign-in path on local preview
- Verification: `npm run lint`, `npm run type-check`, `npm run test` (164/164 passed)
- Next: continue Mark 4 ranked batch on `/progress` and `/exams`, then deploy to Fly

### 2026-06-30 — Codex — Microsoft provider env configured

- Done: ran `scripts/provision-microsoft-oauth-live.sh`
- Done: updated `.env.local` with the Microsoft OIDC block and pushed matching secrets to Fly
- Done: `npm run verify:microsoft-oauth-live` passed; localhost `/login` now exposes a real Microsoft auth-start link
- Next: continue Mark 4 ranked batch on `/progress` and `/exams`, then deploy to Fly

### 2026-06-30 — Codex — Mark 4 homepage + login second polish pass

- Done: added a real-data proof strip and stronger closing CTA to `/`, and removed more of the mixed legacy tone language below the hero
- Done: clarified `/login` as a normal Google/Microsoft student entry path while keeping admin access secondary and auth logic unchanged
- Verification: `npm run lint`, `npm run type-check`, `npm run test` (164/164 passed)
- Next: continue Mark 4 ranked batch on `/progress` and `/exams`, then deploy to Fly

### 2026-06-29 — Cursor — Mark 3.2 full-route visual audit (Area 9.9 complete)

- Done: Mark32PageHeader on recommendations, results, saved-progress, accessibility, account, support, live-cookie guide
- Done: Area 9 **10/10** — redesign lane closed; tests 109/109; Fly deploy succeeded
- Next: MVP usability Areas 1–8 as operator prioritises

### 2026-06-29 — Cursor — Mark 3.2 route-wide UI extension (Area 9.8)

- Done: shared Mark32 components + live routes `/`, `/progress`, `/subjects`, `/assessments`, `/exams`
- Done: lint, type-check, test (109/109)
- Next: Area 9 step 9.9 — full-route visual consistency audit; Fly deploy

### 2026-06-29 — Cursor — Mark 3.2 Cursor Agent build handoff ingested

- Done: saved full Mark 3.2 build handoff to `docs/design/MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md` with Fly/OIDC/SQLite reconciliation
- Done: linked from AGENTS, HANDOFF, README, UI-UX-MASTERPLAN, MVP Area 9 (step 9.7b)
- Next: Area 9 steps 9.8–9.9 — extend Mark 3.2 UI to remaining routes per handoff mapping

### 2026-06-29 — Cursor — MVP usability Area 9 progress recorded

- Done: added Area 9 to `docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md` with step table and `6/9` summary
- Done: appended Area 9 progress to `FINAL-PHASE-PLAN.md`, `PLATFORM-GUIDE.md`, `README.md`, `AGENTS.md`, and `HANDOFF.md` (additive only)
- Next: Area 9 steps 9.8–9.9 — extend Mark 3.2 to other student routes; full-route visual audit

### 2026-06-29 — Cursor — Mark 3.2 streamlined dashboard UI

- Done: created `docs/design/UI-UX-MASTERPLAN.md` (Mark 3.2 layout + Study Atelier tokens + MVP preservation rules)
- Done: shipped live Mark 3.2 dashboard zones on `/dashboard` via `src/components/streamlined/*`
- Done: extended `StudentAppShell` with weekly study-day count and Power Grid level badge
- Verification: `npm run lint`, `npm run type-check`, `npm run test` (109/109 passed)
- Done: `fly deploy -a the-switch-platform` — live at https://theswitchplatform.com
- Next: commit/push to GitHub; continue MVP usability plan

### 2026-06-26 — Cursor — Priority A onboarding proof split + fresh closeout

- Done: marked `verify:live-onboarding` explicitly as API-assisted/synthetic regression only (file header + closeout recorder runs it outside the strict chain)
- Done: re-ran full Priority A closeout on clean branch `verify/priority-a-closeout-2026-06-26`; all strict steps green
- Done: fresh canonical evidence `release-evidence/2026-06-26-priority-a-canonical-closeout.md` (includes supportive onboarding regression output labeled **not strict A-4**)
- Done: A-4 real-auth proof remains referenced from `release-evidence/2026-06-25-priority-a-truth-audit.md`
- Verification: `verify:check-live-cookies`, `verify:launch-status`, `verify:launch-complete`, `verify:live-truth-match`, `verify:live-onboarding`, `verify:priority-a-closeout` — all passed
- Next: Priority E deferred scope only if the operator wants expansion beyond the current MVP

### 2026-06-26 — Cursor — Priority A doc sync + push

- Done: synced Priority A **COMPLETE** across `HANDOFF.md`, `AGENTS.md`, `README.md`, `PLATFORM-GUIDE.md`, `docs/ideas/FINAL-PHASE-PLAN.md`, `.cursor/rules/00-source-of-truth.mdc`
- Done: MVP tables and Item 22 records now say Final Path Mark 2 + Priority A closed (26 June 2026); active lane **Priority B**
- Next: Priority B stale-notes cleanup (B-1, B-2)

### 2026-06-25 — Cursor — AGENTS.md sync rule non-negotiable

- Done: after-each-action workflow now requires **HANDOFF + AGENTS + README (when behavior changes)**
- Synced across `AGENTS.md`, `HANDOFF.md`, `README.md`, `PLATFORM-GUIDE.md`, `.cursor/rules/00-source-of-truth.mdc`
- Commit: `01d3664`

### 2026-06-25 — Codex — Priority A audit run + A-7 truth sync

- Done: ran strict real-auth proof commands against production
- Done: verified strict mode rejects `SWITCH_LAUNCH_VERIFICATION_SECRET`
- Done: verified current local production student cookie is stale or otherwise non-authenticating for `/api/auth/session`
- Done: proved persistence recovery on Fly production `/data` via `fly ssh console`
- Done: aligned `PLATFORM-GUIDE`, governance summary, admin launch copy, `launch-complete`, and `live-truth-match` to the same Priority A audit story
- Done: recorded current state in `release-evidence/2026-06-25-priority-a-truth-audit.md`
- Verification: `npm test`, `npm run lint`
- Next: refresh live student cookie, rerun strict proof, then continue A-3 to A-8

### 2026-06-25 — Codex — real browser OIDC proof for A-1/A-3/A-4

- Done: captured real production Google OIDC auth start and provider redirect from `/login`
- Done: re-entered a real student session on production and confirmed signed-in account state at `/account` (`Signed in via google at 24 Jun, 23:56`)
- Done: completed the full 8-step learner onboarding flow on production, unlocked the dashboard, and confirmed `/onboarding` no longer returned step 1 for the completed learner
- Done: signed out on production and confirmed `/dashboard` redirected to `/login` while `/account` rendered the signed-out state
- Done: updated plan/docs/evidence so A-1, A-3, and A-4 are recorded as complete in browser evidence
- Blocker: strict command closeout still needs a fresh `SWITCH_LIVE_STUDENT_COOKIE` and a real `SWITCH_LIVE_ADMIN_COOKIE` copied into `.env.local`
- Next: finish A-6 and A-8 after the two production cookies are refreshed via `/account/live-cookie-guide`

### 2026-06-24 — Cursor — Priority C authoritative closure (docs sync)

- Done: Priority **C** marked **COMPLETE** (C-1–C-10) in HANDOFF, AGENTS, README, PLATFORM-GUIDE, FINAL-PHASE-PLAN
- Done: architecture gate documented — weekly planner, UI preferences, exam focus mode follow route → service → API → persistence
- Rule for agents: **do not reopen Priority C** unless operator requests exception; active lane is **Priority A**
- Next: A-1 production OIDC proof, then A-3–A-8 evidence sync

### 2026-06-24 — Cursor — Priority C product finish shipped

- Done: C-2–C-10 — exams focus mode, support hub, marketing chrome, planner dismiss, weekly planner module, subject tones, recovery UI
- Done: commit `92cc190` pushed to `main`; verification 102/102
- Next: authoritative doc closure across HANDOFF / AGENTS / README

### 2026-06-24 — Codex — A-1/A-2 strict real-auth hardening

- Done: added `verify:live-oidc-proof` for real OIDC proof without launch-verification headers
- Done: added `verify:live-walkthrough:real-auth`; strict walkthrough now fails if `SWITCH_LAUNCH_VERIFICATION_SECRET` is present
- Done: updated `launch-status`, `repo-lint`, and regression tests for the new real-auth verification path
- Verification: `npm test` and `npm run lint` passed
- Next: run the new proof command against production with real live cookies, then continue A-3 to A-8 evidence cleanup

### 2026-06-24 — Codex — Priority A sync alignment

- Done: synced `AGENTS.md`, `HANDOFF.md`, and `README.md` top-level operator story to `docs/ideas/FINAL-PHASE-PLAN.md` as the active full completion audit
- Done: moved “What is next?” from C-2 product polish to **Priority A — truthful completion**
- Done: updated live-session state to reflect the proof-gap audit as the active task
- Next: implement strict real-auth verification path and retire synthetic auth from final-proof claims
- Blocker: none technical; real production proof still needs valid live auth cookies / operator run

### 2026-06-24 — Codex — Full completion audit + Final Phase rewrite

- Done: audited launch scripts, release evidence, route coverage, governance truth surfaces, and active docs
- Done: rewrote `docs/ideas/FINAL-PHASE-PLAN.md` from a UI-only roadmap into a full completion plan
- Done: split remaining work into truthful-launch blockers, docs/governance sync, product completion, quality coverage, and deferred scope
- Next: start Priority A from the new plan — remove synthetic-auth dependence from final live proof, then sync truth surfaces
- Blocker: none technical; main risk is overclaiming completion before real-auth proof is hardened

### 2026-06-24 — Cursor — C-1 student shell rollout complete

- Done: `/saved-progress`, `/recommendations`, `/accessibility`, `/account` (signed-in) in `StudentAppShell`
- Done: C-1 marked complete in FINAL-PHASE-PLAN (exams/support → C-2/C-3)
- Next: C-2 `/exams` shell decision
- Blocker: none

### 2026-06-24 — Cursor — FP-1.1 `/results` StudentAppShell

- Done: `/results` in `StudentAppShell`; `requireStudentAppRouteContext()`; `results-experience.tsx`
- Next: FP-1.2 `/saved-progress`
- Blocker: none

### 2026-06-24 — Cursor — Final Phase plan (sole active roadmap)

- Done: `docs/ideas/FINAL-PHASE-PLAN.md` — FP-1 through FP-6; prior phases marked complete
- Done: HANDOFF, AGENTS, README, PLATFORM-GUIDE, ideas index, MOCK-IDEA refs, STREAMLINE superseded note
- Next: FP-1.1 — `/results` in `StudentAppShell`
- Blocker: none

### 2026-06-24 — Cursor — Phase 2 StudentAppShell rollout

- Done: `/subjects`, `/assessments`, `/progress` wrapped in `StudentAppShell`; `requireStudentAppRouteContext()`
- Done: onboarding subject badges on subjects list; shared auth/onboarding gate
- Next: Phase 3 planner dismiss persistence
- Blocker: none

### 2026-06-24 — Cursor — Git push confirmed (docs on origin/main)

- Done: `origin/main` at `31be1ae` — HANDOFF, AGENTS, PLATFORM-GUIDE, README aligned; working tree clean
- Next: Phase 2 shell rollout
- Blocker: none

### 2026-06-24 — Cursor — Full MD sync (dual-agent + MVP display)

- Done: dual-agent document system in HANDOFF; MVP at a glance in HANDOFF, AGENTS, PLATFORM-GUIDE, README
- Done: standard session prompt; four-file read/write map for Cursor + Codex
- Next: Phase 2 shell rollout
- Blocker: none

### 2026-06-24 — Cursor — HANDOFF + AGENTS + README sync

- Done: plain-English project story in HANDOFF; synced operator blocks in AGENTS + README; fixed stale Item 3 notes
- Next: Phase 2 shell rollout per ideas plan
- Blocker: none

### 2026-06-24 — Cursor — Onboarding secondary school + England GCSE MVP scope

- Done: secondary school step, England-only nation, GCSE (England) + iGCSE only; Wales/NI deferred in UI
- Done: `src/modules/onboarding/README.md`, README, PLATFORM-GUIDE, MOCK-IDEA docs
- Next: shell rollout; Wales/NI when operator prioritises
- Blocker: none

### 2026-06-24 — Cursor — Onboarding stays + ideas folder plan

- Done: operator decision recorded — onboarding stays (8 steps); it builds the student dashboard
- Done: `docs/ideas/STREAMLINE-WEBSITE-PLAN.md` + `docs/ideas/README.md`
- Done: linked from `MOCK-IDEA-AI-IDEAS.md`, `MOCK-IDEA-BUILD-REFERENCE.md`, HANDOFF
- Next: Phase 2 shell rollout per ideas plan
- Blocker: none

### 2026-06-24 — Cursor — Homepage + dashboard declutter (priority #5)

- Done: split `dashboard-home.tsx` into home vs dashboard layouts; removed duplicate preview/mockup sections
- Done: dashboard hides SEND side rail when `SendSupportRail` is shown; trimmed shell and planner copy
- Next: optional shell rollout to `/subjects`, `/assessments`, `/progress`; Fly browser check
- Blocker: none

### 2026-06-23 — Cursor — Item 22 marked complete in end-to-end lists

- Done: item 22 now shows **Completed — 23 June 2026** in `AGENTS.md` and `README.md` Full End-to-End Completion List
- Done: replaced stale June 21 HANDOFF section that still said item 22 was open
- Done: README §58 build record added
- Plain-English: all 22 launch checklist items are done; the last one was “does the paperwork match the live site?” — yes
- PR #4 + PR #5 already on `main`; no code change in this commit

### 2026-06-23 — Cursor — PR #4 merged to main

- Merged: https://github.com/tech-fresh/the-switch-platform/pull/4
- `main` at `18920cc` — unified login, Microsoft OAuth, item 22 evidence
- Live host unchanged: https://theswitchplatform.com (Fly)

### 2026-06-23 — Cursor — Item 22 / Final Path Mark 2 complete

- Branch: cursor/unified-login-sign-in-page
- Done: full live verification bundle, truth-match passed, evidence file stored, item 22 closed
- Evidence: `release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md`
- Next: merge draft PR #4
- Blocker: none

### 2026-06-23 — Cursor — Live Microsoft sign-in + item 22 truth-match (Final Path Mark 2)

- Branch: cursor/unified-login-sign-in-page (draft PR #4)
- Done: browser Microsoft sign-in for lloydnwag@gmail.com (admin+student), Azure app on Fly, sign-in UX fixes, truth-match + walkthrough + OAuth verify green
- Next: merge PR #4 to main
- Blocker: none

Plain-English summary:

- The dashboard is public — you can browse it without signing in. Sign-in happens at `/login` or `/login?reauth=1`.
- Microsoft sign-in is now proven in a real browser session, not just redirect checks.
- Admin launch view matches governance records (6/6 environment, 5/5 sign-off, 8/8 evidence).

```mermaid
flowchart LR
    A["/login?reauth=1"] --> B["Continue with Microsoft"]
    B --> C["Microsoft login"]
    C --> D["/api/auth/callback"]
    D --> E["switch_auth_session cookie"]
    E --> F["/account shows email + roles"]
    F --> G["/admin launch view 6/6 5/5 8/8"]
```

### 2026-06-23 — Cursor — Sign-in UX fix (reauth + mobile links)

- Done: anchor-based Google/Microsoft buttons, `/login?reauth=1` when already signed in, dashboard nav shows Account when authenticated
- Deployed to Fly theswitchplatform.com

### 2026-06-23 — Cursor — Microsoft terminal provision + placeholder client_id docs

- Branch: cursor/unified-login-sign-in-page
- Done: `provision:microsoft-oauth-live` script, verify rejects `your-client-id`, AGENTS/HANDOFF/README mermaid + plain-English updates
- Next: `az login` with M365 dev tenant admin → `npm run provision:microsoft-oauth-live:apply`
- Blocker: Fly secrets still placeholder; Hotmail portal login ≠ Azure CLI tenant login

Plain-English summary for the next operator:

- The Microsoft button on `/login` can look ready while Fly still sends a fake client ID to Microsoft.
- Join M365 Developer Program, sign into Azure CLI with **admin@tenant.onmicrosoft.com**, run the provision script, then browser-test sign-in.

```mermaid
flowchart TD
    A["Join M365 Developer Program"] --> B["Get admin@tenant.onmicrosoft.com"]
    B --> C["az login --use-device-code --allow-no-subscriptions"]
    C --> D["npm run provision:microsoft-oauth-live:apply"]
    D --> E["Azure app + Fly secrets + verify"]
    E --> F["Browser test /login → Continue with Microsoft"]
```

### 2026-06-23 — Cursor — Fly deploy fix + Microsoft live verify

- Branch: cursor/unified-login-sign-in-page
- Done: fixed `/login` TypeScript build error, fly deploy green, Microsoft + Google OAuth live checks passed
- Next: manual Microsoft browser sign-in at /login; merge branch
- Blocker: none

### 2026-06-23 — Cursor — Microsoft sign-in capability

- Branch: cursor/unified-login-sign-in-page
- Module: auth
- Done: Microsoft OIDC mapping, setup/verify scripts, docs/MICROSOFT_OAUTH_LIVE.md, /login/microsoft-guide, login card link
- Next: Azure app registration + Fly secrets + verify:microsoft-oauth-live
- Blocker: operator Azure client ID/secret not yet deployed

### 2026-06-23 — Cursor — Unified `/login` sign-in page + Final Path Mark 2 closeout

- Branch: main
- Module: auth / website shell
- Priority #: launch — Final Path Mark 2 item 2 and item 22
- Done: Seneca-style `/login` route, home **Log in** nav, auth error redirects, HANDOFF/README/AGENTS updates, live truth-match and walkthrough evidence recorded on Fly
- Next: `fly deploy` to publish `/login` on production; smoke `/login` after deploy
- Blocker: none for auth; Fly cold start can slow first local live verify unless site is woken first

### 2026-06-21 — Cursor — Fly.io free-tier deploy (Vercel blocked)

- Branch: main
- Module: operations / deploy
- Priority #: launch — Final Path Mark 2
- Done: Dockerfile, fly.toml, docs/FREE_TIER_DEPLOY.md, verify:persistence-health, bootstrap on first boot
- Next: operator runs fly deploy; OIDC redirect to Fly URL; full verify chain on Fly
- Blocker: Vercel no redeploy tokens + suspended Blob

### 2026-06-21 — Cursor — Free-tier launch plan and efficiency docs

- Branch: main
- Module: operations / project-workflow
- Priority #: launch — Final Path Mark 2
- Done: README free-tier workaround plan; AGENTS/HANDOFF efficiency learning notes; `.env.example` Blob token
- Next: unsuspend/recreate Vercel Blob (tokens done); verify:blob-health; full launch sequence
- Blocker: Blob store suspended (not missing tokens)

### 2026-06-21 — Cursor — Consult-before-act workflow rules

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: added consult-before-each-action and update-HANDOFF-after-each-action rules to AGENTS, README, HANDOFF, and `.cursor/rules/`
- Next: operator unsuspends/replaces Vercel Blob store; rerun full live verification chain
- Blocker: production Blob store suspended

### 2026-06-21 — Cursor — Final Path Mark 2 blob-health closeout tooling

- Branch: main
- Module: operations / governance
- Priority #: launch — Final Path Mark 2
- Done: added verify:blob-health; suspended Blob detection in runtime/governance/admin; updated launch runbook and sequence
- Next: operator unsuspends/replaces Vercel Blob store, then reruns full live verification chain including item 22
- Blocker: production Blob store suspended; `/dashboard` 500 on live walkthrough

### 2026-06-21 — Cursor — Final Path Mark 2 handoff (Blob store blocked)

- Branch: main
- Module: operations / governance
- Priority #: launch — Final Path Mark 2
- Done: aligned HANDOFF live state with `1168e4f` launch repo completion; recorded suspended Blob blocker and item 22 open status; verified local test/lint/type-check/build pass
- Next: operator unsuspends or replaces Vercel Blob store, then reruns full live verification chain; resume Exam Engine (#1) after launch closeout
- Blocker: `BlobStoreSuspendedError` on `switch-live-data/switch-live.sqlite`; `/dashboard` 500 on production walkthrough
- Launch commit: 1168e4f

### 2026-06-21 — Cursor — Exam Engine service test coverage

- Branch: main
- Module: exam-engine
- Priority #: 1 — Exam Engine
- Done: added 8 service-level tests; switched test runner to tsx for `@/` alias resolution; updated module README and build record
- Next: expand Exam Engine coverage (access-arrangement duration, submitted resume, API smoke)
- Commit: d35aa15

### 2026-06-21 — Cursor — Sync HANDOFF live state with Git

- Branch: main
- Module: exam-engine
- Priority #: 1 — Exam Engine
- Done: fixed Last commit drift (530eaf4); set active task to Exam Engine; workflow setup marked complete
- Next: begin Exam Engine work — read `src/modules/exam-engine/README.md`
- Commit: 0bebb80 (substantive); meta sync through 94286b7

### 2026-06-21 — Cursor — Session operating priorities documented

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: added Read HANDOFF.md first + Live session state update rules to AGENTS, README, HANDOFF, PROJECT_RECOVERY
- Next: start priority #1 Exam Engine work
- Commit: 3b001b5

### 2026-06-21 — Cursor — Full multi-agent workflow integration

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: added `.cursor/rules/`, cleaned AGENTS.md duplicates, fixed README build record, updated recovery files
- Next: use HANDOFF.md every session; start priority #1 Exam Engine work
- Commit: 0fb58a8

### 2026-06-21 — Cursor — Commit multi-agent handoff workflow

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: expanded HANDOFF.md, updated AGENTS.md, fixed README duplicates, updated recovery paths
- Next: use HANDOFF.md every session; add `.cursor/rules/`; start priority #1 work
- Commit: df20612

### 2026-06-21 — Cursor — Expanded HANDOFF.md with full workflow

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: expanded HANDOFF.md with checklists, priorities, architecture gate, tool split, session prompt, and daily routine; removed duplicate template content
- Next: commit and push to GitHub; begin using file every session; continue workflow setup
- Commit: not committed yet

### 2026-06-21 — Cursor — First HANDOFF fill-in

- Branch: main
- Module: project-workflow
- Priority #: setup — multi-agent workflow
- Done: created HANDOFF.md and filled placeholders with real values
- Next: expand with full workflow guidance
- Commit: not committed yet
