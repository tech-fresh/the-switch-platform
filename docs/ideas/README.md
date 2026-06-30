# Ideas folder — plans and product decisions

> **Purpose:** Longer-form plans, product decisions, and phased work that agents and operators can pick up without re-debating in chat.  
> **Handoff docs:** [`HANDOFF.md`](../../HANDOFF.md) · [`MOCK-IDEA-AI-IDEAS.md`](../MOCK-IDEA-AI-IDEAS.md) · [`MOCK-IDEA-BUILD-REFERENCE.md`](../MOCK-IDEA-BUILD-REFERENCE.md)

Plain English: this folder holds **plans** — not live session state. Read `HANDOFF.md` first every session; use **`FINAL-PHASE-PLAN.md`** as the current MVP completion record and deferred-scope reference.

---

## Active references (consult these)

| Plan | What it covers |
|------|----------------|
| **[`FINAL-PHASE-PLAN.md`](./FINAL-PHASE-PLAN.md)** | **Current completion record** — MVP closeout complete; Priority **E** is deferred scope only |
| **[`MVP-USABILITY-LAUNCH-READINESS-PLAN.md`](./MVP-USABILITY-LAUNCH-READINESS-PLAN.md)** | **Usability hardening — complete (Areas 1–9)** — route clickability, rehearsal tooling, Mark 3.2 UI |
| **[`../MVP-OPERATOR-TRUTH.md`](../MVP-OPERATOR-TRUTH.md)** | **Three-lane operator map** — Priority A–D truth vs usability vs deferred Priority E |
| **[`../LOCAL-LAUNCH-REHEARSAL.md`](../LOCAL-LAUNCH-REHEARSAL.md)** | **Local verification order** — `npm run verify:local-launch-readiness` |

---

## Completed plans (historical — do not delete)

| Plan | Status |
|------|--------|
| [`STREAMLINE-WEBSITE-PLAN.md`](./STREAMLINE-WEBSITE-PLAN.md) | Phases 1–2 **complete**; phases 3–5 **superseded** by Final Phase |
| Launch 22-item checklist | **Complete** — see `AGENTS.md` / `PLATFORM-GUIDE.md` |

---

## Non-negotiable product decisions (recorded here)

1. **Onboarding stays as shipped** — all 8 steps; it **creates the student dashboard**. See **`HANDOFF.md` → Plain-English**.

2. **Streamlining applies to marketing and dashboard chrome** — not the guided setup flow.

3. **Onboarding MVP (England):** GCSE (England) + iGCSE selectable; Wales/NI **coming later**; step 3 = **secondary school**, England nation only.

---

## When to add a new plan here

- A multi-phase direction that spans more than one module **after** Final Phase is complete
- A product decision that future agents might otherwise undo
- A checklist that complements but should not bloat `MOCK-IDEA-AI-IDEAS.md`

After adding a plan: link it from `MOCK-IDEA-AI-IDEAS.md`, `MOCK-IDEA-BUILD-REFERENCE.md`, and refresh `HANDOFF.md` **What is next**.
