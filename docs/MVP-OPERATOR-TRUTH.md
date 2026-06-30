# MVP Operator Truth

Plain English: this page separates **three different kinds of “done”** so operators and agents do not mix up launch proof, practical usability hardening, and future expansion ideas.

Read order every session:

1. [`HANDOFF.md`](../HANDOFF.md) — live session state
2. **This file** — which lane is which
3. [`docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md`](./ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md) — usability area evidence
4. [`PLATFORM-GUIDE.md`](../PLATFORM-GUIDE.md) — rules, modules, launch checklist

---

## Three lanes — do not mix them

| Lane | What it means | Status | Where proof lives |
| --- | --- | --- | --- |
| **1. Truthful launch completion (Priority A–D)** | All 22 launch items proved on Fly production with canonical closeout evidence | **Complete — 26 June 2026** | `release-evidence/2026-06-26-priority-a-canonical-closeout.md` · `npm run verify:priority-a-closeout` |
| **2. MVP usability hardening (Areas 1–9)** | Make the live MVP feel fully clickable, rehearse-able, and operator-friendly without reopening A–D truth | **Complete — 30 June 2026** | [`MVP-USABILITY-LAUNCH-READINESS-PLAN.md`](./ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md) · [`LOCAL-LAUNCH-REHEARSAL.md`](./LOCAL-LAUNCH-REHEARSAL.md) |
| **3. Deferred expansion (Priority E)** | Wales/NI GCSE, parent/teacher onboarding, admin restyle, and other operator-gated ideas | **Deferred only** | [`FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) → Priority E |

**Rule:** Priority A closeout evidence is **not** reopened by usability rehearsal scripts. Usability scripts (`verify:local-launch-readiness`, `test:route-clickability`, etc.) prove practical product readiness on preview/local runtime — not a replacement for live OIDC closeout.

---

## Lane 1 — Truthful launch completion

**Closed.** Do not describe the platform as incomplete on launch truth unless new production evidence breaks the 26 June 2026 closeout.

| Check | Command / evidence |
| --- | --- |
| Canonical closeout bundle | `npm run verify:priority-a-closeout` |
| Admin + README + live site alignment | `npm run verify:live-truth-match` |
| Browser-authenticated onboarding (A-4) | `release-evidence/2026-06-25-priority-a-truth-audit.md` |
| API-assisted onboarding regression only | `npm run verify:live-onboarding` (**not** strict A-4) |

---

## Lane 2 — MVP usability hardening

**Closed — 30 June 2026.** All nine areas in the usability plan are complete.

| Area | Summary | Key verification |
| --- | --- | --- |
| **1** Boot and runtime stability | `.next-rehearsal` pipeline, readiness probes, one-command wrapper | `npm run verify:local-launch-readiness` |
| **2** Route clickability | Canonical route map, CTA contracts, click-through rehearsal | `npm run test:route-clickability` |
| **3** Exams and assessments | Lobby, focus mode, autosave, submit, recovery | `npm run test:exam-assessment-rehearsal` |
| **4** Saved progress continuity | Dashboard/results/saved-progress alignment | `npm run test:continuity-rehearsal` |
| **5** Auth and account | Student/admin paths, sign-out lockout | `npm run test:auth-account-rehearsal` |
| **6** Support and recovery | Support hub, accessibility signposting, empty states | `npm run test:support-recovery-rehearsal` |
| **7** Rehearsal tooling | Documented core order, stabilized launch-utils | `docs/LOCAL-LAUNCH-REHEARSAL.md` |
| **8** Docs and operator truth | This page + aligned entry-point docs | `tests/mvp-operator-truth.test.mjs` |
| **9** Mark 3.2 UI/UX redesign | Dashboard zones, shell, Fly production | `docs/design/UI-UX-MASTERPLAN.md` |

**Core local rehearsal order:**

```bash
npm run verify:local-launch-readiness
```

Full step list → [`LOCAL-LAUNCH-REHEARSAL.md`](./LOCAL-LAUNCH-REHEARSAL.md).

---

## Lane 3 — Deferred expansion (Priority E)

**Not current MVP incompleteness.** Only reopen when the operator explicitly requests expansion beyond the closed MVP.

Examples: Wales/NI GCSE paths, parent/teacher onboarding lanes, admin visual restyle, architecture experiments (Supabase/Vercel greenfield).

Track in [`FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) → Priority E.

---

## What operators should do next

1. **Deploy latest usability work to Fly** when ready: `fly auth login` → `npm run deploy:fly`
2. **Re-run local rehearsal** after meaningful changes: `npm run verify:local-launch-readiness`
3. **Refresh live cookies** before production closeout reruns: `/account/live-cookie-guide`
4. **Re-run Priority A closeout** only for new releases that need fresh evidence: `npm run verify:priority-a-closeout`

---

## Doc map (keep aligned)

| Document | Role |
| --- | --- |
| `HANDOFF.md` | Live baton — what just finished, what is next |
| `AGENTS.md` | Agent front door — syncs with HANDOFF |
| `PLATFORM-GUIDE.md` | Rules, modules, 22-item launch list |
| `README.md` | Product history + Ordered Build Record (append only) |
| `MVP-USABILITY-LAUNCH-READINESS-PLAN.md` | Usability area checklist and evidence |
| `LOCAL-LAUNCH-REHEARSAL.md` | Local verification order |
| `FINAL-PHASE-PLAN.md` | A–D closeout record + deferred Priority E |
