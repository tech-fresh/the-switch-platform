# 09 — Seneca Architecture Comparison

> **Status:** documentation-only architecture guidance (no implementation)  
> **Updated:** 2026-07-06  
> **Purpose:** capture product-architecture principles inspired by leading revision platforms, adapted for The Switch Mark 3.2 / Mark 4 MVP

Plain English: this folder records **how the platform should feel connected** — not a feature spec and not a Seneca clone. Principles here extend the live Fly / OIDC / SQLite / module architecture. They do **not** replace auth, persistence, onboarding, or existing modules.

---

## Read order

1. **[`ARCHITECTURE-PRINCIPLES.md`](./ARCHITECTURE-PRINCIPLES.md)** — authoritative eight principles (start here)
2. [`../11_UI_UX_MASTER_GUIDE.md`](../11_UI_UX_MASTER_GUIDE.md) — UI expression of journey rules
3. [`../../PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md) → Connected learning architecture
4. [`../../ideas/MARK-4-UI-UX-IMPLEMENTATION-PLAN.md`](../../ideas/MARK-4-UI-UX-IMPLEMENTATION-PLAN.md) — phased execution

---

## What this is not

- Not a request to copy Seneca layout, branding, or terminology
- Not a greenfield rebuild or auth/persistence change
- Not implemented code — future sessions implement against these principles inside existing modules

---

## Principle index

| # | Principle | Summary |
|---|-----------|---------|
| 1 | Connected Website | Every route leads to the next logical action — no dead ends |
| 2 | Recall Strength | Switch-branded memory/mastery system (documented future scope) |
| 3 | Power Grid engine | Central motivation — all activity feeds progression |
| 4 | Learning Loop Standard | Learn → Question → Feedback → Progress → Next → Power Grid → Recommendation |
| 5 | Dashboard Simplification | Four primary dashboard signals only above the fold |
| 6 | Recommendations brain | Decision engine ranking future navigation |
| 7 | Saved Progress glue | Continuity service linking every study route |
| 8 | Modular Architecture | Business logic in modules only — thin pages |

---

## Agent rule

At session start, after `HANDOFF.md`, read **`ARCHITECTURE-PRINCIPLES.md`** before UI or module work that touches learner journeys, dashboard hierarchy, recommendations, or progression presentation.
