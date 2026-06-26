# Mock Idea · AI Ideas Bank

> **Purpose:** Copy-paste ideas, plans, prompts, and patterns for Cursor, Codex, and other agents.  
> **Build reference:** [`MOCK-IDEA-BUILD-REFERENCE.md`](./MOCK-IDEA-BUILD-REFERENCE.md)  
> **Visual mockups:** [`SENECA-STYLE-ONBOARDING-MOCKUP.md`](./SENECA-STYLE-ONBOARDING-MOCKUP.md)  
> **Live gallery:** https://theswitchplatform.com/mock-idea-preview

Plain English: this file holds the **plan** and **reusable copy** for Mock Idea · Study Atelier. Agents should read this when asked to extend onboarding, dashboard layout, marketing shell, or SEND/access surfaces — then copy blocks from here instead of reinventing.

> **Active plan:** [`ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) — full completion roadmap  
> **Historical plans:** [`docs/ideas/`](./ideas/README.md)

---

## Non-negotiable — onboarding stays (2026-06-24)

**Operator decision:** Do **not** merge, skip, or shorten the 8-step onboarding flow as part of website streamlining.

Onboarding **creates the student dashboard**:

- Captures qualification, year, school, subjects, support/SEND choices, guardian, consent
- On complete: seeds access profile, builds dashboard setup summary and support chips
- Gates `/dashboard` until complete

Full plan: [`docs/ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) · Onboarding data-flow: [`docs/ideas/STREAMLINE-WEBSITE-PLAN.md`](./ideas/STREAMLINE-WEBSITE-PLAN.md) § Product decision.

Streamlining applies to **homepage and signed-in chrome** (duplicate mockups, repeated metrics/support) — **not** `/onboarding`.

---

## How agents should use this file

1. Read `HANDOFF.md` first (live state).
2. Read this file for **plan + copy blocks**.
3. Read `MOCK-IDEA-BUILD-REFERENCE.md` for tokens, files, and checklists.
4. Reuse `src/components/mock-idea/*` — do not duplicate layout logic.
5. Copy session prompts and code snippets from sections below.

---

## Master plan — layout (Study Atelier)

### Phase 1 — Public marketing shell (done)

| Item | Route | Component | Status |
|------|-------|-----------|--------|
| Header with gradient strip | `/` | `marketing-site-header.tsx` | Shipped |
| Dark footer + SEND swatches | `/` | `marketing-site-footer.tsx` | Shipped |
| Stone mesh hero background | `/` | `dashboard-home.tsx` `mode="home"` | Shipped |
| Visual gallery | `/mock-idea-preview` | `mock-idea-showcase.tsx` | Shipped |

### Phase 2 — Signed-in student shell (done)

| Item | Route | Component | Status |
|------|-------|-----------|--------|
| Top study rail (H P L S A +) | `/dashboard` | `student-app-shell.tsx` | Shipped |
| Welcome strip + support chips | `/dashboard` | `student-app-shell.tsx` | Shipped |
| Desktop SEND swatch column | `/dashboard` xl+ | `student-app-shell.tsx` | Shipped |
| Mobile bottom letter dock | `/dashboard` | `student-app-shell.tsx` | Shipped |
| Planner bento panel | `/dashboard` | `planner-prompt-card.tsx` | Shipped |
| Access & SEND rail | `/dashboard` | `send-support-rail.tsx` | Shipped |
| Live dashboard cards below | `/dashboard` | `dashboard-home.tsx` | Shipped |

### Phase 3 — Extend layout to other student routes — **historical; later shipped under Priority C**

> **Historical note:** this used to point to `FINAL-PHASE-PLAN.md` as `FP-1 Shell rollout`. That work is now shipped under Priority C.  
> **Current active plan:** [`FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) → open Priority B and D items.

| Route | Priority | Notes |
|-------|----------|-------|
| `/subjects` | High | Same study rail; subject list in main column |
| `/assessments` | High | Practice flow under shell |
| `/progress` | High | Planner destination from bento CTA |
| `/accessibility` | Medium | SEND settings; keep module API boundary |
| `/support` | Medium | Signposting-only; no counselling UI |
| `/results` | Medium | Slim shell; performance summary |
| `/saved-progress` | Low | Continue/resume under shell |

**Rule:** wrap page content in `StudentAppShell`; do not rebuild nav per page.

### Phase 4 — Planner integration — **historical; later shipped under Priority C**

> **Historical note:** this used to point to `FINAL-PHASE-PLAN.md` as `FP-2 Planner integration`. That work is now shipped under Priority C.

| Item | Description |
|------|-------------|
| Weekly planner block | Dashboard bento links to `/progress`; auto-pull from exams, assessments, saved progress via API |
| Dismiss persistence | Store planner prompt dismissed state in saved progress or account settings |
| Subject colour chips | Planner events use subject tone colours (teal, emerald, amber, sky) |

### Phase 5 — Polish — **historical archive**

> **Historical note:** this used to point to `FINAL-PHASE-PLAN.md` as `FP-3–FP-5`. The active plan is now the full audit/quality roadmap, not a polish-only tracker.

| Item | Description |
|------|-------------|
| Extend shell to `/subjects`, `/assessments`, `/progress` | Consistent study rail everywhere |
| Parent/teacher onboarding variants | Separate card flows if product prioritises |
| i18n-ready labels | Keep copy in constants; avoid hard-coded strings in many files |
| Website streamlining | See [`docs/ideas/FINAL-PHASE-PLAN.md`](./ideas/FINAL-PHASE-PLAN.md) for current remaining work; onboarding stays excluded |

**Do not plan:** merging onboarding steps 5–6 or removing the dashboard gate unless operator overrides in `HANDOFF.md`.

---

## Master plan — onboarding (8 steps)

### Flow overview

```mermaid
flowchart TD
  A[Sign in] --> B{Onboarding complete?}
  B -->|no| C[/onboarding]
  B -->|yes| D[/dashboard]
  C --> S0[Account type]
  S0 --> S1[Qualification]
  S1 --> S2[Profile / year]
  S2 --> S3[School]
  S3 --> S4[Subjects]
  S4 --> S5[Support / SEND / Access]
  S5 --> S6[Guardian optional]
  S6 --> S7[Consent]
  S7 --> D
  S5 --> P[provisionMvpAccessSetupFromOnboarding]
  P --> D
```

### Step plan (copy for UI titles)

| # | Key | Screen title (copy) | Subtitle (copy) | Primary button |
|---|-----|---------------------|-----------------|----------------|
| 0 | `account-type` | Select your Switch account type | Choose the role that best matches how you will use the platform. | Continue |
| 1 | `qualification` | What are you studying for this year? | **MVP:** GCSE (England) or iGCSE. Wales and Northern Ireland — coming later (signposted, not selectable). | Continue |
| 2 | `profile` | Great to meet you, {firstName}! | Which profile matches your vibe? | Continue |
| 3 | `school` | Which **secondary school** do you go to? | England only in MVP; official England school lookup link. | Continue |
| 4 | `subjects` | Which {qualification} subjects are you studying? | Pick MVP subjects from the live catalog — same list as Subjects page. | Let's go! |
| 5 | `support` | Accessibility, access arrangements, and SEND support | Optional choices — you can change these later in Account and Accessibility. | Continue |
| 6 | `guardian` | Invite a parent or guardian | Optional — skip if you are setting up on your own. | Continue |
| 7 | `consent` | Almost there! | Confirm age or consent, then we will open your dashboard. | Open my dashboard |

### Step 5 — support choices (copy from module)

Use labels from `MVP_SUPPORT_CHOICES` in `src/modules/onboarding/service.ts`:

| Key | Label | Module label |
|-----|-------|--------------|
| `wantsAccessibilitySupport` | Accessibility support | Accessibility module |
| `wantsAccessArrangementHelp` | Exam access arrangements | Access Arrangements foundation |
| `sendSupportPathVisible` | SEND and support signposting | Support Hub |

### Onboarding completion behaviour

- API: `PUT /api/onboarding/profile` with `complete: true`
- Service: `completeOnboarding()` in `onboarding/service.ts`
- **MVP qualification routes:** `gcse-england`, `igcse` only — Wales/NI in `deferredQualificationPaths`
- **School step:** secondary school name, `schoolPhase: "secondary"`, England nation only
- Module README: `src/modules/onboarding/README.md`
- Seeds: `provisionMvpAccessSetupFromOnboarding()` when accessibility/access flags set
- Redirect: `/dashboard`
- Gate: incomplete learners hitting `/dashboard` redirect to `/onboarding`

### Onboarding UI shell (copy)

- Top banner: `Mock Idea guided setup · The Switch Platform`
- Background: `bg-stone-100`
- Progress: teal → emerald gradient bar
- Desktop: numbered step rail (left)
- Buttons: teal primary, bordered back

---

## Copy-paste — agent session prompts

### Standard Mock Idea UI session

```text
Read HANDOFF.md first.
Read docs/MOCK-IDEA-AI-IDEAS.md and docs/MOCK-IDEA-BUILD-REFERENCE.md.
Build UI to match Mock Idea · Study Atelier.
Reuse src/components/mock-idea/* and brand-tokens.ts.
Keep business logic in modules and API routes.
Do not copy Seneca layout (no narrow icon sidebar).
```

### Onboarding-only session

```text
Read HANDOFF.md first.
Read docs/MOCK-IDEA-AI-IDEAS.md § Master plan — onboarding.
Work only in src/modules/onboarding/ and src/app/onboarding/.
Use OnboardingShell — do not replace step order without updating service.ts.
Step 5 must wire Accessibility, Access Arrangements foundation, and Support Hub.
```

### Extend student shell session

```text
Read HANDOFF.md first.
Read docs/MOCK-IDEA-AI-IDEAS.md § Phase 3 — extend layout.
Wrap the target route in StudentAppShell from src/components/mock-idea/student-app-shell.tsx.
Do not duplicate nav items — import STUDENT_NAV_ITEMS from brand-tokens.ts.
```

---

## Copy-paste — brand strings

```text
Brand name: Mock Idea
Tagline: Study Atelier · powered by The Switch Platform
Logo glyph: ◆
Onboarding banner: Mock Idea guided setup · The Switch Platform
Dashboard greeting: Good morning / Good afternoon / Good evening, {firstName}
Dashboard subline: Study Pulse active · planner and access tools ready below
Planner headline: Your study plan, built around you
Planner bullets:
  - Built around your onboarding subjects and qualification path
  - Links exams, timed practice, and saved progress through the API layer
  - Respects accessibility choices and access arrangement signposting
SEND rail title: Your MVP support setup
SEND rail eyebrow: Access & SEND signposting
Footer note: Creative layout study for The Switch Platform — not a copy of any third-party product.
```

---

## Copy-paste — signed-in page wrapper

```tsx
import { StudentAppShell } from "@/components/mock-idea/student-app-shell";

export default function ExampleStudentPage({
  displayName,
  supportChips,
}: {
  displayName?: string;
  supportChips?: string[];
}) {
  return (
    <StudentAppShell displayName={displayName} supportChips={supportChips ?? []}>
      <div className="space-y-6">
        {/* page content — stone cards, teal CTAs */}
      </div>
    </StudentAppShell>
  );
}
```

---

## Copy-paste — public page wrapper

```tsx
import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";

export default function ExamplePublicPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <MarketingSiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{/* content */}</div>
      <MarketingSiteFooter />
    </main>
  );
}
```

---

## Copy-paste — dashboard top blocks

```tsx
import { PlannerPromptCard } from "@/components/mock-idea/planner-prompt-card";
import { SendSupportRail } from "@/components/mock-idea/send-support-rail";

// Inside dashboard mode, before main cards:
<div className="mb-6 space-y-4">
  <PlannerPromptCard />
  <SendSupportRail
    summary={data.supportSnapshotSummary}
    chips={data.supportPreferenceChips}
  />
</div>
```

---

## Copy-paste — SEND colour chip loop

```tsx
import { SEND_COLOUR_CHIPS } from "@/components/mock-idea/brand-tokens";
import Link from "next/link";

{SEND_COLOUR_CHIPS.map((chip) => (
  <Link
    key={chip.id}
    href={chip.href}
    className={`rounded-xl border px-3 py-2 text-xs font-semibold ${chip.className}`}
  >
    {chip.label}
  </Link>
))}
```

---

## Copy-paste — study nav item loop

```tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  STUDENT_NAV_ITEMS,
  navAccentClasses,
  badgeAccentClasses,
} from "@/components/mock-idea/brand-tokens";

const pathname = usePathname();

{STUDENT_NAV_ITEMS.map((item) => {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      key={item.href}
      href={item.href}
      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold ${navAccentClasses(item.accent, active)}`}
    >
      <span className={`inline-flex size-5 items-center justify-center text-[10px] font-bold ${badgeAccentClasses(item.accent)}`}>
        {item.short}
      </span>
      {item.label}
    </Link>
  );
})}
```

---

## Copy-paste — standard card + buttons

```tsx
{/* Card */}
<section className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700">Eyebrow</p>
  <h2 className="mt-2 text-xl font-semibold text-stone-950">Section title</h2>
  <p className="mt-2 text-sm leading-7 text-stone-600">Body copy.</p>
</section>

{/* Primary CTA */}
<Link href="/progress" className="bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900">
  Create my plan
</Link>

{/* SEND secondary CTA */}
<Link href="/accessibility" className="border border-amber-300 bg-[#fff8c4] px-5 py-2.5 text-sm font-semibold text-amber-950">
  SEND colour options
</Link>

{/* Neutral secondary */}
<Link href="/support" className="border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800 hover:border-teal-400">
  Support hub
</Link>
```

---

## Copy-paste — onboarding step card pattern

```tsx
<button
  type="button"
  className={`w-full border p-4 text-left transition ${
    selected ? "border-teal-500 bg-teal-50" : "border-stone-200 bg-white hover:border-stone-300"
  }`}
>
  <span className="text-sm font-semibold text-stone-950">Option label</span>
  <p className="mt-1 text-sm text-stone-600">Option description.</p>
</button>
```

---

## Layout ideas bank (future — copy when building)

### Idea: Subject rail under study nav

Add a second horizontal scroll row on `/subjects` only — chips for Maths, English Language, Combined Science from onboarding `selectedSubjectIds`. Source from dashboard view model or content catalog API.

### Idea: Planner week bento on dashboard

Replace dashed placeholder with 7-column mini grid (Mon–Sun). Each cell: rounded block, subject colour, linked item from saved progress API. Keep planner logic in dashboard/planner module — UI only renders slots.

### Idea: SEND quick-toggle in shell header

Small dropdown next to “Access settings” listing four overlays — each links to `/accessibility` with query hint, does not auto-apply without module consent.

### Idea: Onboarding progress save indicator

Sticky footer note: “Your answers save automatically” — wired to existing `PUT /api/onboarding/profile` debounce in `onboarding-experience.tsx`.

### Idea: Parent read-only weekly report page

`/weekly-reports` using marketing footer + parent-readable cards — Changes 1.0 direction from AGENTS.md; not MVP priority unless reprioritised.

### Idea: Access arrangement badge on exam cards

When `wantsAccessArrangementHelp` true, show amber chip “Access setup noted” on exam and timed assessment launch cards — read from access profile API, do not duplicate rules in exam UI.

---

## Architecture reminders (do not break)

```text
Flow: route → thin component → module/service.ts → API → persistence

Onboarding logic:     src/modules/onboarding/service.ts
Access profile:       src/modules/access-arrangements/service.ts
Dashboard data:       src/modules/dashboard/service.ts
Accessibility:        src/modules/accessibility/
Support signposting:  src/modules/support/

Do not mix exam logic with progress logic.
Do not mix saved progress with content logic.
Access Arrangements stays independent from Exam Engine and Timed Assessments UI.
SEND chips signpost only — learner applies overlays in Accessibility module.
```

---

## File index for agents

| File | When to open |
|------|--------------|
| `docs/MOCK-IDEA-AI-IDEAS.md` | **This file — plans + copy blocks** |
| `docs/MOCK-IDEA-BUILD-REFERENCE.md` | Tokens, checklists, verification |
| `docs/ideas/FINAL-PHASE-PLAN.md` | **Active** — sole roadmap for remaining work |
| `docs/ideas/STREAMLINE-WEBSITE-PLAN.md` | Historical — phases 1–2 complete; onboarding-stays decision |
| `docs/SENECA-STYLE-ONBOARDING-MOCKUP.md` | ASCII mockups + diagrams |
| `src/components/mock-idea/brand-tokens.ts` | Colours, nav, SEND chips |
| `src/modules/onboarding/service.ts` | Step order + support choices |
| `src/app/onboarding/onboarding-experience.tsx` | Step UI + save |
| `src/components/dashboard-home.tsx` | Home vs dashboard wiring |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-24 | Created AI ideas bank with layout + onboarding master plans |
| 2026-06-24 | Non-negotiable: onboarding stays; linked `docs/ideas/STREAMLINE-WEBSITE-PLAN.md` |
| 2026-06-24 | Active plan moved to `docs/ideas/FINAL-PHASE-PLAN.md`; layout phases 3–5 superseded |
