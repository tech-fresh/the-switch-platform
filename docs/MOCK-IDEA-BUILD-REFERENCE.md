# Mock Idea · Study Atelier — Build Reference

> **AI ideas bank (plans + copy blocks):** [`MOCK-IDEA-AI-IDEAS.md`](./MOCK-IDEA-AI-IDEAS.md)  
> **Active plan:** [`ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) — full completion roadmap for remaining repo, product, and quality work  
> **Historical:** [`ideas/STREAMLINE-WEBSITE-PLAN.md`](./ideas/STREAMLINE-WEBSITE-PLAN.md) (phases 1–2 complete)  
> **Use this file when building UI like the Mock Idea direction.**  
> **Visual mockups:** [`SENECA-STYLE-ONBOARDING-MOCKUP.md`](./SENECA-STYLE-ONBOARDING-MOCKUP.md)  
> **Live gallery:** https://theswitchplatform.com/mock-idea-preview  
> **Shipped:** 2026-06-24 · commit `02ab881`

Plain English: **Mock Idea · Study Atelier** is the saved design direction for The Switch student experience. Open this file first when adding pages, shells, or marketing surfaces so the build stays consistent — bento panels, top study rail, stone/teal palette, MVP SEND swatches, and access signposting.

---

## Quick start (operators and agents)

1. Read `HANDOFF.md` and `docs/ideas/FINAL-PHASE-PLAN.md`.
2. Open the live gallery: `/mock-idea-preview`.
3. Import tokens from `src/components/mock-idea/brand-tokens.ts` — do not hard-code colours elsewhere.
4. Reuse existing shell components before inventing new layout patterns.
5. Keep business logic in modules/API — UI components stay thin.

**Session prompt:**

```text
Read HANDOFF.md first.
Read docs/ideas/FINAL-PHASE-PLAN.md for the next open Priority B, D, or E item.
Read docs/MOCK-IDEA-BUILD-REFERENCE.md for UI patterns.
Build UI to match Mock Idea · Study Atelier.
Reuse src/components/mock-idea/* and brand-tokens.ts.
```

---

## Design principles

### Do

- Use **stone/teal/emerald/amber** Switch palette (matches `globals.css` and dashboard cards).
- Use **top horizontal study rail** for signed-in navigation (letter badges H, P, L, S, A, +).
- Use **bento split panels** for planner and SEND surfaces (not centred modals).
- Use **dark stone footer** with SEND **swatch squares** on public pages.
- Link SEND chips to `/accessibility` only — signposting, not auto-applied overlays.
- Link access arrangements to `/how-it-works` and Support Hub to `/support`.
- Wrap signed-in dashboard content in `StudentAppShell`.
- Wrap public homepage in `MarketingSiteHeader` + `MarketingSiteFooter`.
- **Keep onboarding as the dashboard factory** — 8 steps, gate on `/dashboard`; see [`ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) and [`ideas/STREAMLINE-WEBSITE-PLAN.md`](./ideas/STREAMLINE-WEBSITE-PLAN.md) § onboarding stays.

### Do not

- Do not copy Seneca: no narrow left icon sidebar, no `#eef6ff` pale-blue clone, no sunburst logo.
- Do not use emoji icon stacks as primary nav (letter badges instead).
- Do not put business logic only in page components.
- Do not mix access arrangement rules into dashboard or onboarding services — link to modules.
- Do not auto-apply SEND colour overlays from chips; learner chooses in Accessibility.
- Do not merge, skip, or shorten onboarding steps when streamlining the website — onboarding **creates** the personalised student dashboard.

---

## Brand tokens

Source of truth: `src/components/mock-idea/brand-tokens.ts`

| Token | Value |
|-------|-------|
| Name | Mock Idea |
| Tagline | Study Atelier · powered by The Switch Platform |
| Logo glyph | `◆` |
| Page background | `bg-stone-100` / `#f5f5f4` |
| Primary CTA | `bg-teal-800 hover:bg-teal-900` |
| Marketing footer | `bg-stone-950` |
| Eyebrow label | `text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700` |

Import pattern:

```tsx
import {
  MOCK_IDEA_BRAND,
  SEND_COLOUR_CHIPS,
  STUDENT_NAV_ITEMS,
  MARKETING_NAV,
  navAccentClasses,
  badgeAccentClasses,
} from "@/components/mock-idea/brand-tokens";
```

---

## MVP SEND colour overlays

Must match `src/app/globals.css` runtime attributes (`data-switch-colour-scheme`).

| ID | Hex | Tailwind signposting class | Route |
|----|-----|---------------------------|-------|
| cream | `#f6f0dc` | `bg-[#f6f0dc] text-amber-950` | `/accessibility` |
| blue | `#eaf4ff` | `bg-[#eaf4ff] text-sky-950` | `/accessibility` |
| yellow | `#fff8c4` | `bg-[#fff8c4] text-yellow-950` | `/accessibility` |
| high-contrast | `#000000` | `bg-black text-white` | `/accessibility` |

Use `SEND_COLOUR_CHIPS` array for chips, swatches, and footer links. Always include all four on public footer and SEND rail.

---

## Component map

| Component | Path | Use when |
|-----------|------|----------|
| `brand-tokens.ts` | `src/components/mock-idea/` | Any Mock Idea surface — import tokens/nav |
| `MarketingSiteHeader` | `mock-idea/marketing-site-header.tsx` | Public pages (`/`, marketing) |
| `MarketingSiteFooter` | `mock-idea/marketing-site-footer.tsx` | Public pages — includes SEND swatches |
| `StudentAppShell` | `mock-idea/student-app-shell.tsx` | Signed-in student layout (`/dashboard`) |
| `PlannerPromptCard` | `mock-idea/planner-prompt-card.tsx` | Dashboard top — dismissible bento planner |
| `SendSupportRail` | `mock-idea/send-support-rail.tsx` | Dashboard — access/SEND + onboarding chips |
| `MockIdeaShowcase` | `mock-idea/mock-idea-showcase.tsx` | Gallery page sections only |
| `OnboardingShell` | `onboarding/onboarding-shell.tsx` | All `/onboarding` steps |
| `DashboardHome` | `dashboard-home.tsx` | `/` and `/dashboard` — wires shells |

Re-export: `src/components/marketing-site-header.tsx` → `mock-idea/marketing-site-header.tsx`

---

## Route wiring

```
/                          dashboard-home.tsx  mode="home"
                             ├ MarketingSiteHeader
                             ├ hero + preview cards
                             └ MarketingSiteFooter

/dashboard                 dashboard-home.tsx  mode="dashboard"
                             └ StudentAppShell
                                  ├ PlannerPromptCard
                                  ├ SendSupportRail (supportSnapshotSummary, supportPreferenceChips)
                                  └ existing dashboard cards

/onboarding                onboarding-experience.tsx
                             └ OnboardingShell (8 steps)
                                  → PUT /api/onboarding/profile
                                  → onboarding/service.ts

/mock-idea-preview         mock-idea-preview/page.tsx
                             └ MockIdeaShowcase (visual reference gallery)
```

---

## Build a new signed-in page (checklist)

1. Add route under `src/app/<route>/page.tsx`.
2. Fetch data via module service + API — not inline in the page.
3. If the page is part of the student workflow, wrap content:

```tsx
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";

export default function MyPage() {
  return (
    <StudentAppShell displayName="Student" supportChips={[]}>
      {/* page content — use stone/white cards, teal CTAs */}
    </StudentAppShell>
  );
}
```

4. Use card pattern: `border border-stone-200 bg-white p-5 shadow-sm`.
5. Primary button: `bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white`.
6. Secondary button: `border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800`.
7. SEND CTA variant: `border border-amber-300 bg-[#fff8c4] text-amber-950`.

---

## Build a new public/marketing page (checklist)

1. Add route under `src/app/<route>/page.tsx`.
2. Wrap with header + footer:

```tsx
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";

export default function MyPublicPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <MarketingSiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{/* content */}</div>
      <MarketingSiteFooter />
    </main>
  );
}
```

3. Hero gradient (optional): teal/amber radial on stone — see `dashboard-home.tsx` homepage.

---

## Onboarding build reference

**8 steps** (order fixed in `src/modules/onboarding/service.ts`):

**MVP qualification routes:** GCSE (England) and iGCSE only. GCSE (Wales) and GCSE (Northern Ireland) are signposted as **Coming later** — see `src/modules/onboarding/README.md`.

| # | Key | Continue label | Module links |
|---|-----|----------------|--------------|
| 0 | account-type | Continue | — |
| 1 | qualification | Continue | — |
| 2 | profile | Continue | — |
| 3 | school | Continue | **Secondary school** — England only (MVP); Wales/NI later |
| 4 | subjects | Let's go! | `listStudentVisibleContentSubjects()` |
| 5 | support | Continue | Accessibility, Access Arrangements, Support Hub |
| 6 | guardian | Continue | Guardian invite (optional) |
| 7 | consent | Open my dashboard | → `/dashboard` |

**Step 5 must include:**

- Accessibility support → `/accessibility`
- Exam access arrangements → Access Arrangements foundation
- SEND signposting → Support Hub (`/support`)

On complete: `provisionMvpAccessSetupFromOnboarding()` seeds access profile; dashboard shows `supportPreferenceChips`.

**Onboarding → dashboard contract (do not break):**

| Onboarding output | Dashboard consumer |
|-------------------|-------------------|
| `selectedSubjectIds`, qualification, year | `buildDashboardSetupSummary()` → setup copy, subject focus |
| Support flags (step 5) | `buildOnboardingSupportSummary()` → chips + `SendSupportRail` |
| `complete: true` | Access profile provision; `/dashboard` gate opens |
| Incomplete profile | Redirect to `/onboarding` from `/dashboard` |

See [`ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) for the current remaining-work roadmap and [`ideas/STREAMLINE-WEBSITE-PLAN.md`](./ideas/STREAMLINE-WEBSITE-PLAN.md) for the onboarding data-flow diagram.

**Shell styling:**

- Banner: `bg-stone-950` + `text-teal-300` uppercase strip
- Desktop: numbered step rail (current = teal, done = emerald)
- Progress bar: `bg-gradient-to-r from-teal-600 to-emerald-500`
- Buttons: `OnboardingBackButton` / `OnboardingContinueButton` in `onboarding-shell.tsx`

---

## Dashboard build reference

**Prerequisite:** learner must complete **8-step onboarding** before `/dashboard` loads (except guest preview on `/`).

**Order of blocks** (signed-in, top to bottom):

1. `PlannerPromptCard` — dismissible bento; links `/progress`, `/accessibility`, `/support`
2. `SendSupportRail` — props: `summary`, `chips` from dashboard view model (sourced from onboarding + accessibility modules)
3. Recommended-now strip, metrics, route grid, sessions, subject focus (`dashboard-home.tsx` `mode="dashboard"`)

**StudentAppShell props:**

| Prop | Type | Source |
|------|------|--------|
| `displayName` | `string?` | Auth session name |
| `supportChips` | `string[]?` | `dashboardData.supportPreferenceChips` (from onboarding profile) |
| `showSendSideRail` | `boolean?` | Default `true`; set `false` on `/dashboard` when `SendSupportRail` is shown |
| `children` | `ReactNode` | Page content |

**Responsive behaviour:**

- Desktop (lg+): top study rail + right SEND swatch column (xl+)
- Mobile: horizontal scroll pills + bottom letter dock (H P L S A)

---

## Tailwind patterns (copy-paste)

**Eyebrow:**

```html
<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Section label</p>
```

**Page title:**

```html
<h1 class="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">Title</h1>
```

**Bento card:**

```html
<article class="overflow-hidden border border-stone-200 bg-white shadow-lg shadow-stone-200/60">
  <div class="grid md:grid-cols-2">...</div>
</article>
```

**Teal panel (planner left side):**

```html
<div class="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 p-6 text-white">...</div>
```

**Ambient mesh background:**

```html
<div class="pointer-events-none fixed inset-0 -z-10">
  <div class="absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
  <div class="absolute right-0 top-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
</div>
```

---

## Access & SEND integration rules

| Surface | What to show | Must not |
|---------|--------------|----------|
| Onboarding step 5 | Checkboxes + module labels | Implement arrangement logic in UI |
| SendSupportRail | Chips from onboarding + module links | Pretend to be counselling/AI support |
| Footer | SEND swatch links | Auto-set `html` colour scheme |
| PlannerPromptCard | Yellow SEND CTA button | Block dashboard if SEND not chosen |
| StudentAppShell | Access settings link | Store access rules in shell |

Modules (do not duplicate logic in UI):

- `src/modules/accessibility/`
- `src/modules/access-arrangements/`
- `src/modules/support/` (Support Hub signposting)

---

## Visual layout diagrams

### Marketing header + footer

See mockups in [`SENECA-STYLE-ONBOARDING-MOCKUP.md`](./SENECA-STYLE-ONBOARDING-MOCKUP.md) § Mockup 1–2.

### Signed-in shell

See same file § Mockup 3–4, or live `/mock-idea-preview` § Mockup 2.

### Onboarding

See same file § Mockup 5.

---

## Verification before merge

```bash
npm run lint && npm run type-check && npm run test
```

Manual checks:

- [ ] `/mock-idea-preview` loads all four gallery sections
- [ ] `/dashboard` shows study rail, planner bento, SEND rail when signed in
- [ ] `/` shows marketing header + dark footer + SEND swatches
- [ ] `/onboarding` shows stone banner + step rail (desktop)
- [ ] SEND chips link to `/accessibility` only
- [ ] No Seneca-style narrow icon sidebar introduced

---

## File index (complete)

```
docs/
  ideas/
    README.md                        ← ideas folder index
    FINAL-PHASE-PLAN.md            ← **active** — full completion roadmap for remaining work
    STREAMLINE-WEBSITE-PLAN.md     ← historical; phases 1–2 complete
  MOCK-IDEA-BUILD-REFERENCE.md     ← this file (build from here)
  MOCK-IDEA-AI-IDEAS.md              ← copy blocks + phase plans
  SENECA-STYLE-ONBOARDING-MOCKUP.md ← visual mockups + diagrams

src/components/mock-idea/
  brand-tokens.ts
  marketing-site-header.tsx
  marketing-site-footer.tsx
  student-app-shell.tsx
  planner-prompt-card.tsx
  send-support-rail.tsx
  mock-idea-showcase.tsx

src/app/mock-idea-preview/page.tsx
src/components/marketing-site-header.tsx   (re-export)
src/components/dashboard-home.tsx
src/components/onboarding/onboarding-shell.tsx
src/app/onboarding/onboarding-experience.tsx
src/modules/onboarding/service.ts
```

---

## Related platform docs

| Doc | Purpose |
|-----|---------|
| `AGENTS.md` | Architecture, module boundaries, design system index |
| `HANDOFF.md` | Live session state |
| `README.md` | Product spec + Ordered Build Record |
| `src/app/globals.css` | SEND runtime colour schemes |
| `release-evidence/2026-06-23-final-path-mark-2-item-3-complete.md` | Onboarding live proof |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-24 | Created build reference; Study Atelier shipped with `/mock-idea-preview` |
| 2026-06-24 | Onboarding-stays decision; onboarding→dashboard contract; linked `docs/ideas/` |
| 2026-06-24 | Active plan: `docs/ideas/FINAL-PHASE-PLAN.md`; prior phases complete |
