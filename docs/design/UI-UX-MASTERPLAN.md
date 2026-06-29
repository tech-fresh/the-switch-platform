# UI / UX Masterplan — Mark 3.2 Streamlined Light Mode

> **Status:** authoritative UI direction for live student and marketing surfaces  
> **Created:** 2026-06-29  
> **Live target:** https://theswitchplatform.com  
> **Build reference:** [`docs/MOCK-IDEA-BUILD-REFERENCE.md`](../MOCK-IDEA-BUILD-REFERENCE.md) · tokens in `src/components/mock-idea/brand-tokens.ts`

Plain English: Mark 3.2 is a **calmer light-mode** study experience. One clear next step, fewer competing blocks, all MVP modules still reachable. This masterplan maps the Mark 3.2 infographic layout to the **Study Atelier** palette (stone / teal) and the repo’s **top study rail** — not a purple sidebar clone.

---

## Non-negotiable rules

1. **Preserve every MVP route and module** — onboarding, exams, assessments, saved progress, results, recommendations, accessibility, planner, support, account, admin.
2. **Use Study Atelier tokens** — `bg-stone-100`, `bg-teal-800` CTAs, subject tone chips from `src/lib/subjects/tone.ts`.
3. **Top horizontal study rail** for signed-in nav (`STUDENT_NAV_ITEMS`) — do not replace with a fixed left icon sidebar.
4. **Business logic stays in modules** — dashboard UI reads `getDashboardHomeData()` only; no scoring in components.
5. **Light mode default** — `globals.css` stone background; accessibility overlays remain opt-in on `/accessibility`.

---

## Information architecture (Mark 3.2)

### Public homepage `/`

| Zone | Purpose | Implementation |
|------|---------|----------------|
| Hero | Mark 3.2 headline + CTAs | `HomeMarketingContent` — "Get started free" / "See how it works" |
| Trust trio | Students / parents / schools | Three tone cards below hero |
| Features | Why Switch + key features + Power Grid + mission + accessibility + roadmap | `Mark32MarketingSections` |
| Study routes | Jump into practice | Top 3 study route cards |

### Signed-in routes (Mark 3.2 shared components)

| Route | Mark 3.2 components |
|-------|---------------------|
| `/dashboard` | `Mark32HeroRow`, `Mark32SubjectGrid`, `Mark32WeakestTopics` |
| `/subjects` | `Mark32SubjectCatalogGrid`, `Mark32PageHeader` |
| `/progress` | `Mark32PowerGridJourney`, `Mark32PageHeader` |
| `/assessments` | `Mark32PageHeader` |
| `/exams` (lobby) | `Mark32PageHeader` |
| `/recommendations` | `Mark32PageHeader`, `Mark32StatCard` |
| `/results` | `Mark32PageHeader` |
| `/saved-progress` | `Mark32PageHeader` |
| `/accessibility` | `Mark32PageHeader` |
| `/account` | `Mark32PageHeader`, `Mark32StatCard` |
| `/support` | `Mark32PageHeader` (public marketing chrome) |

### Signed-in dashboard `/dashboard`

| Zone | Mark 3.2 label | Data source | Component |
|------|----------------|-------------|-----------|
| Greeting rail | Good morning + streak | `displayName`, weekly planner completions | `StudentAppShell` |
| Hero row | Continue learning | Saved progress continuity | `Mark32HeroRow` |
| Hero row | Next exam | First active / next exam session | `Mark32HeroRow` |
| Hero row | Today’s goal | Weekly planner completion % | `Mark32HeroRow` |
| Hero row | Power Grid progress | `summary.overallLevel`, readiness score | `Mark32HeroRow` |
| Main grid | Your subjects | `focusCards` + readiness rings | `Mark32SubjectGrid` |
| Side panel | Weakest topics | `focusCards` sorted by readiness | `Mark32WeakestTopics` |
| Below fold | Quick routes, planner, focus, resume, SEND | Existing `DashboardHome` sections | unchanged |

All below-fold sections **stay** so no MVP capability is removed — Mark 3.2 adds clarity above the fold.

---

## Visual tokens

| Element | Class / token |
|---------|----------------|
| Page background | `bg-stone-100` |
| Card surface | `border border-stone-200 bg-white shadow-sm` |
| Primary CTA | `bg-teal-800 hover:bg-teal-900 text-white` |
| Secondary CTA | `border border-stone-300 bg-white hover:border-teal-400` |
| Eyebrow | `text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700` |
| Progress ring track | `border-stone-200` |
| Progress ring fill | subject tone or `teal-700` |

---

## MVP feature preservation checklist

- [x] 8-step onboarding → dashboard gate  
- [x] Exam Engine + focus mode  
- [x] Timed assessments  
- [x] Saved progress / resume  
- [x] Power Grid on `/progress`  
- [x] Weekly planner + dismiss  
- [x] Accessibility + SEND signposting  
- [x] Support hub  
- [x] Results + recommendations  
- [x] Account + auth allowlist panel  

---

## Deployment

Production host: **Fly.io** (`fly.toml`, volume `/data`). After UI changes:

```bash
npm run lint && npm run type-check && npm run test
fly deploy -a the-switch-platform
```

Evidence: append README Ordered Build Record; sync `HANDOFF.md` and `AGENTS.md`.

---

## Related docs

- [`HANDOFF.md`](../../HANDOFF.md) — live session state  
- [`PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md) → Design system  
- [`docs/design/MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md`](./MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md) — full Mark 3.2 product vision + live-repo mapping  
- [`docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md`](../ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md)  
- Preview mockups: `/streamlined-mockup`, `/mockups/vibrant-dashboard` (layout reference only)
