# 11 — UI/UX Master Guide (MVP)

> **Status:** authoritative UI/UX reference for The Switch Platform  
> **Updated:** 2026-07-06  
> **Live target:** https://theswitchplatform.com  
> **Supersedes:** fragmented notes in older light-mode masterplan sections — use **this file** first for UI work

Plain English: this guide defines how the product **looks, reads, and flows**. It does not change backend logic, XP calculations, or launch truth. Implementation must extend the live Fly / OIDC / SQLite stack — never greenfield-replace it.

---

## 1. Authority and scope

| Rule | Detail |
|------|--------|
| **This guide wins for UI** | Agents read this before changing student or marketing surfaces |
| **Architecture gate holds** | `route → thin page → module service → API → persistence` |
| **Presentation before architecture** | Prefer UI-layer changes over service/schema changes |
| **MVP routes preserved** | Onboarding, exams, assessments, saved progress, results, recommendations, accessibility, planner, support, account, admin |
| **Mark 4 Phases 1–6** | Complete on `main`; **Phase 7** (public marketing) is active |
| **Connected learning architecture** | [`09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md`](./09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md) — documentation only |

**Code entry points**

| Area | Path |
|------|------|
| Design tokens | `src/components/premium/premium-ui.ts` |
| Legacy re-export | `src/components/streamlined/mark32-ui.ts` |
| Student shell | `src/components/mock-idea/student-app-shell.tsx` |
| Homepage | `src/components/dashboard-home.tsx` → `HomeMarketingContent` |
| Power Grid presentation | `src/lib/power-grid/rank-presentation.ts` |
| Build reference | `docs/MOCK-IDEA-BUILD-REFERENCE.md` |

---

## 2. Design principles

Every screen should satisfy:

1. **One clear purpose** — the student knows why they are on this route  
2. **One primary action** — one dominant CTA; secondary actions are visually quieter  
3. **Low cognitive load** — progressive disclosure; no competing “next step” panels  
4. **Premium but calm** — dark mode, generous spacing, restrained motion  
5. **Mobile-first** — bottom dock on small screens; sidebar on desktop  
6. **Accessibility-minded** — focus rings, contrast, semantic progress bars, keyboard paths  

### Connected learning architecture (UI expression)

These UI rules implement [`ARCHITECTURE-PRINCIPLES.md`](./09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md):

- **No dead ends** — every signed-in route terminus has one primary CTA (Continue Learning, Resume, Practise Weak Topic, Start Exam, Return to Dashboard, etc.)
- **Learning loop** — topic/quiz surfaces follow Learn → Question → Feedback → Progress → Next → Power Grid → Recommendation
- **Dashboard simplification** — hero row prioritises Continue Learning, Weak Topic, Next Exam, Power Grid; below-fold sections are secondary
- **Power Grid visibility** — rank + Power Level on sidebar, dashboard card, and `/progress`
- **Thin pages** — no XP, recommendation, or progression calculations in components; read module/API data only

### Inspiration mapping

| Reference | What we took | Where it lives |
|-----------|--------------|----------------|
| **Stripe** | Premium gradients, trust stats, CTA hierarchy | `PremiumHeroSection`, marketing header |
| **Linear** | Command-centre sidebar, focused dashboard cards | `StudentAppShell` (desktop) |
| **Seneca** | Quiz card, progress bar, instant feedback | `PremiumQuizCard` on `/subjects` |
| **Duolingo** | Streaks, XP motivation, frequent small wins | Power Grid ranks + Power Levels |
| **BBC Bitesize** | Educational hierarchy, age-appropriate structure | Subject cards, topic flow |
| **Save My Exams** | Subject → board → topic navigation | `PremiumExamBoardSelector` |

---

## 3. Colour and typography

### Palette (dark mode default)

| Token | Hex | Usage |
|-------|-----|-------|
| Primary purple | `#6C4EFF` | CTAs, active nav, accents |
| Electric blue | `#00BFFF` | Links, progress highlights |
| Switch green | `#22C55E` | Success, goal completion, completed ranks |
| Amber | `#F59E0B` | Streaks, weak-topic warnings |
| Dark background | `#0B0F17` | Page shell (`globals.css`) |
| Card background | `#121826` | Cards, panels |
| Muted surface | `#0F1420` | Nested panels |
| Body text | `#9CA3AF` | Descriptions, secondary copy |

### Typography

| Role | Pattern |
|------|---------|
| Eyebrow | `text-[11px] font-semibold uppercase tracking-[0.24em]` |
| Page heading | `text-2xl font-bold tracking-tight text-white sm:text-3xl` |
| Hero heading | `text-4xl font-black … sm:text-5xl lg:text-6xl` |
| Body | `text-sm leading-7 text-[#9CA3AF] sm:text-base` |

Import tokens from `premiumUi` — do not invent one-off colours on MVP routes.

---

## 4. Information architecture

### Public routes

| Route | Purpose | Primary CTA |
|-------|---------|-------------|
| `/` | Convert visitors; explain value | **Start Learning Free** → `/login?reauth=1` |
| `/how-it-works` | Explain the study journey | Start revising |
| `/login` | OIDC sign-in | Google / Microsoft |
| `/support` | Safeguarding + help hub | Contact / signposting |

### Signed-in student routes (five-item nav)

| Nav label | Route | Purpose | Primary CTA |
|-----------|-------|---------|-------------|
| Dashboard | `/dashboard` | Mission Control — what to do next | Continue learning |
| Subjects | `/subjects` | Revision home | Open topic / practice |
| Exams | `/exams` | Full paper lobby | Start / continue paper |
| Progress | `/progress` | Power Grid + planner + subject readiness | Open next best step |
| Profile | `/account` | Settings, auth, support prefs | Manage account |

Supporting routes (shell when signed in): `/saved-progress`, `/results`, `/recommendations`, `/accessibility`, `/assessments`.

---

## 5. Navigation

### Desktop — Linear-style sidebar

- Fixed left rail in `StudentAppShell`  
- Logo → nav items → **Power Grid footer** (rank, Power Level, XP bar) → account chip  
- Active item: purple tint + border  

### Mobile

- Sticky top bar with logo + account  
- **Bottom dock** — five primary routes (`MOBILE_NAV_ITEMS`)  
- No duplicate nav patterns on the same breakpoint  

---

## 6. Route specifications

### `/` — Public homepage

| Zone | Content | Component |
|------|---------|-----------|
| Hero | “Switch On Your GCSE Revision” + primary CTA | `PremiumHeroSection` |
| Subjects | Maths, English, Combined Science | `PremiumHomepageSections` |
| Benefits | Why Switch (3 pillars) | `PremiumHomepageMarketing` |
| How it works | 3-step journey | `PremiumHomepageMarketing` |
| Power Grid | Six-rank XP journey explainer | `PremiumPowerGridCard` |
| Features | Exam mode, timed practice, saved progress, accessibility | `PREMIUM_PLATFORM_FEATURES` |
| Study routes | Jump into practice | `StreamlinedRouteCards` |
| FAQ | Common parent/student questions | `PremiumHomepageMarketing` |
| Footer CTA | One sign-in story | `HomeMarketingContent` closing section |

### `/dashboard` — Mission Control

**Dashboard simplification rule** — primary above-the-fold signals only:

1. Continue Learning  
2. Weak Topic  
3. Next Exam Task  
4. Power Grid Progress  

**Below the fold (supporting only)**

- Continue learning card (single dominant path)  
- Planner + focus cards  
- Alternate routes + recent sessions + SEND rail  

**P1 rule:** do not show more than one competing “what should I do next?” hero.

### `/subjects`

- Subject home model: **Continue learning → Progress → Topics → Mock exam**  
- `PremiumQuizCard`, board selector, accessibility toolbar  
- Topic flow target: Learn → Worked example → Practice → Exam questions (phase in per subject data)

### `/progress`

- Full **six-rank Power Grid journey** + internal Power Levels  
- Progress at a glance (readiness, XP, next reward, next rank)  
- Weekly planner + subject progress cards  

### `/exams`

- Lobby in shell; active paper uses focus mode (`focus=1`) without study rail  

---

## 7. Component library

Location: `src/components/premium/`

| Component | Purpose |
|-----------|---------|
| `premium-ui.ts` | Tokens + subject/feature constants |
| `premium-hero-section.tsx` | Homepage hero |
| `premium-subject-card.tsx` | GCSE subject cards |
| `premium-dashboard-card.tsx` | Generic dashboard wrapper |
| `premium-power-grid-card.tsx` | Rank display (from `xpTotal`) |
| `premium-continue-revision-card.tsx` | Continue learning + progress ring |
| `premium-quiz-card.tsx` | Quiz flow |
| `premium-exam-board-selector.tsx` | Board tabs |
| `premium-accessibility-toolbar.tsx` | Study accessibility shortcuts |
| `premium-homepage-sections.tsx` | Subject grid + Power Grid + features |
| `premium-homepage-marketing.tsx` | Benefits, how-it-works, FAQ |
| `power-grid-rank-panel.tsx` | Full rank journey (`/progress`) |

---

## 8. Power Grid — six milestone ranks (presentation only)

XP remains the **primary progression currency**. Ranks are milestone tiers; **Power Levels 1–10** provide frequent motivation within each rank.

| Rank | Icon | XP threshold (presentation) |
|------|------|----------------------------|
| Switch On | 💡 | 0 |
| Locked In | 🔥 | 150 |
| Level Up | 📈 | 350 |
| Power Mode | ⚡ | 650 |
| Top Performer | 🏆 | 1,000 |
| Switch Legend | 👑 | 1,500 |

**Within each rank, always show where possible:**

- Current rank and Power Level  
- XP earned / XP to next Power Level  
- Progress percentage + bar  
- Next cosmetic reward (copy)  
- Next rank preview  

**Do not change:** XP calculations, APIs, schema, 9-level backend evidence model, tests, save data. Legacy `overallLevel` may appear as secondary “evidence level” copy only.

Implementation: `src/lib/power-grid/rank-presentation.ts`

---

## 9. XP system protection (non-negotiable)

When working on Power Grid UI:

- ✅ Update presentation layer and copy  
- ✅ Map display from existing `xpTotal`  
- ❌ Rebalance XP earning rules  
- ❌ Replace backend level logic with rank thresholds in services  
- ❌ Break existing tests or persistence  

If a change would require a significant rewrite, **keep the backend and adapt the UI**.

---

## 10. Accessibility

- WCAG-minded contrast on dark surfaces (purple/blue on `#0B0F17`)  
- `role="progressbar"` with `aria-valuenow` on all progress bars  
- Focus-visible rings on interactive elements  
- Read aloud, extra time, overlays remain on `/accessibility` — toolbar shortcuts on study routes  
- Marketing icon: **🎛️** (study settings) — not ♿ — for inclusive-feature signposting on homepage cards  
- Motion: prefer CSS transitions; no autoplay distractions  

---

## 11. Marketing homepage — Phase 7 checklist

- [x] Hero with primary CTA **Start Learning Free**  
- [x] Subject cards (GCSE trio)  
- [x] Benefits section (3 pillars)  
- [x] How it works (3 steps)  
- [x] Power Grid explainer (six ranks)  
- [x] Platform features grid  
- [x] FAQ section  
- [x] Footer CTA block  
- [ ] `/how-it-works` visual alignment pass (optional follow-up)  
- [ ] `/login` premium chrome parity (optional follow-up)  

---

## 12. Implementation status

| Area | Status | Notes |
|------|--------|-------|
| Dark premium shell + sidebar | ✅ Shipped | July 2026 |
| Dashboard Mission Control | ✅ Shipped | Mark 4 Phase 3 |
| Subject quiz premium card | ✅ Shipped | `/subjects` |
| Six-rank Power Grid presentation | ✅ Shipped | Presentation layer only |
| Homepage Phase 7 sections | ✅ This pass | Benefits, how-it-works, FAQ |
| Subject home restructure | 🔲 Planned | Mark 4 Phase 4 |
| Topic flow standardization | 🔲 Planned | Learn → Practice → Exam Qs |
| Dashboard below-fold dedup | 🔲 Planned | Mark 4 audit P1 |

---

## 13. Verification after UI changes

```bash
npm run lint && npm run type-check && npm run test
```

For production UI releases: `fly deploy -a the-switch-platform` then spot-check `/`, `/dashboard`, `/progress`, `/subjects`.

Update `HANDOFF.md`, `AGENTS.md`, and README Ordered Build Record when behavior changes.

---

## 14. Related documents

| Document | Role |
|----------|------|
| [`ARCHITECTURE-PRINCIPLES.md`](./09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md) | Connected learning architecture (documentation only) |
| [`UI-UX-MASTERPLAN.md`](./UI-UX-MASTERPLAN.md) | Short pointer → this guide |
| [`MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md`](./MARK-3.2-CURSOR-AGENT-BUILD-HANDOFF.md) | Full product vision |
| [`../ideas/MARK-4-UI-UX-IMPLEMENTATION-PLAN.md`](../ideas/MARK-4-UI-UX-IMPLEMENTATION-PLAN.md) | Phased execution plan |
| [`../ideas/MARK-4-ROUTE-UX-AUDIT.md`](../ideas/MARK-4-ROUTE-UX-AUDIT.md) | Route punch list |
| [`../MOCK-IDEA-BUILD-REFERENCE.md`](../MOCK-IDEA-BUILD-REFERENCE.md) | Component build reference |
| [`HANDOFF.md`](../../HANDOFF.md) | Live session state |

---

## Historical note

The June 2026 **Mark 3.2 light mode** masterplan (stone/teal, top rail only) is retired for live surfaces. Mock routes (`/mock-idea-preview`, `/brand-mockup`, `/streamlined-mockup`) may still show earlier directions for reference.
