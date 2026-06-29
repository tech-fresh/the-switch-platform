# Cursor Agent Prompt — The Switch Platform MVP (Mark 3.2)

## Full-Stack Build Handoff · theswitchplatform.com

> **Ingested:** 29 June 2026  
> **Purpose:** product and UX vision reference for Mark 3.2 — screens, features, gamification, accessibility, and landing-page story  
> **Read with:** [`UI-UX-MASTERPLAN.md`](./UI-UX-MASTERPLAN.md) · [`MVP-USABILITY-LAUNCH-READINESS-PLAN.md`](../ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md) Area 9 · [`PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md)

---

## How agents must use this file (read before coding)

This document is the **Mark 3.2 product vision**. The **live repository is already built, deployed, and launch-closed** on a different but equivalent stack. Agents must **extend and align** — not greenfield-replace — unless the operator explicitly reopens architecture.

### Live repo truth (authoritative)

| Topic | This handoff says | Live repo today | Agent rule |
|-------|-------------------|-----------------|------------|
| **Deployment** | Vercel | **Fly.io** — https://theswitchplatform.com | Keep Fly + `fly.toml`; do not move to Vercel without operator gate |
| **Database** | Supabase + Prisma | **SQLite on `/data`** volume + module persistence | Extend existing stores; no Prisma migration without operator gate |
| **Auth** | Clerk / NextAuth credentials | **OIDC** (Google/Microsoft) + allowlists | Keep `src/modules/auth/`; do not swap auth stack silently |
| **Frontend** | Next.js 14 | **Next.js 15** App Router + TypeScript | Match existing `src/app` patterns |
| **Styling** | Purple `#4B3FE8` + left sidebar | **Study Atelier** stone/teal + **top study rail** | Adopt Mark 3.2 **layout zones and copy** first; purple/sidebar only with operator + doc update |
| **State** | Zustand | Module services + API + persistence | No page-only business logic |
| **Charts** | Recharts | Power Grid / dashboard metrics via modules | Add Recharts only where it maps to real module data |
| **Routes** | `/learn`, `/practice`, `/power-grid`, `/planner` | `/subjects`, `/assessments`, `/progress`, planner API | **Map features to existing routes** (see route table below) |

### Route mapping (prompt → live)

| Prompt route | Live route / module | Status |
|--------------|---------------------|--------|
| Dashboard `/` (signed in) | `/dashboard` | Mark 3.2 hero zones shipped (Area 9 **7/10**) |
| Subjects | `/subjects` | Live — extend UI |
| Learn | `/subjects` + subject experience | Content in catalog/modules |
| Practice | `/assessments` | Timed Assessment module |
| Exams | `/exams` | Exam Engine + focus mode |
| Progress | `/progress` | Power Grid summary |
| Planner | `/progress` + weekly planner API | Live |
| Power Grid | `/progress` | Live — extend journey UI |
| Support | `/support` | Public marketing hub |
| Sign-in / sign-up | `/login` + `/onboarding` | OIDC + 8-step onboarding |
| Landing `/` | `/` | Calmer marketing homepage live |

### Area 9 alignment (MVP usability plan)

| Step | This handoff covers | Area 9 status |
|------|---------------------|---------------|
| Dashboard zones | Continue learning, Next exam, Today's goal, subjects, weakest topics, Power Grid widget | **Complete** on `/dashboard` |
| Sidebar + purple design system | Full spec below | **Not started** — conflicts with Study Atelier rail unless operator approves rebrand |
| Recharts sparklines / radial charts | Dashboard + Progress pages | **Not started** |
| XP/streak/level logic as specified | Partial via Power Grid + planner | **Partial** — extend in modules, not duplicate in UI |
| Landing page full marketing spec | Partial on `/` | **Partial** |
| Supabase seed + demo user | N/A — use live OIDC + onboarding | **Use live auth path** |

**Do not** treat the Quality Checklist below as a command to delete working Fly/OIDC/SQLite proof. Map each item to **extend** existing behavior.

### Session read order

1. [`HANDOFF.md`](../../HANDOFF.md)  
2. [`AGENTS.md`](../../AGENTS.md)  
3. [`PLATFORM-GUIDE.md`](../../PLATFORM-GUIDE.md)  
4. [`docs/ideas/FINAL-PHASE-PLAN.md`](../ideas/FINAL-PHASE-PLAN.md)  
5. **This file** (vision) + [`UI-UX-MASTERPLAN.md`](./UI-UX-MASTERPLAN.md) (implementation constraints)

---

## OBJECTIVE

Build the complete, production-ready MVP of **The Switch Platform** — a GCSE revision web app — exactly matching the Mark 3.2 design spec. This is a real, wired-up product with working auth, data persistence, and all core features functional. Every screen, component, and interaction described below must be coded and connected. No placeholders, no lorem ipsum, no mock data that doesn't persist.

**Repo note (29 June 2026):** the objective above is largely **met on Fly production**. Remaining work is **Mark 3.2 visual parity**, route polish, and gamification UX — tracked in Area 9 steps 9.8–9.9 and this handoff's Quality Checklist mapped to live verification.

---

## TECH STACK

```
Frontend:   Next.js 14 (App Router) + TypeScript
Styling:    Tailwind CSS v3 + custom CSS variables
Auth:       Clerk (or NextAuth with credentials)
Database:   Supabase (PostgreSQL) with Prisma ORM
State:      Zustand for client state
Animations: Framer Motion
Icons:      Lucide React
Charts:     Recharts
Deployment: Vercel
Domain:     theswitchplatform.com
```

**Live stack override:** Next.js 15 · Tailwind · OIDC · SQLite on Fly · module services · deploy via `fly deploy -a the-switch-platform`.

---

## DESIGN SYSTEM — IMPLEMENT EXACTLY

### Colors
```css
--color-primary:     #4B3FE8;   /* Switch Purple — primary buttons, active nav, badges */
--color-primary-dark:#3730C4;   /* Hover states */
--color-accent:      #F97316;   /* Orange — Continue buttons, highlights */
--color-accent-alt:  #22C55E;   /* Green — Science, success states */
--color-bolt:        #EAB308;   /* Yellow — Power Grid lightning bolt */
--color-bg:          #F8F8FC;   /* App background */
--color-card:        #FFFFFF;   /* Card surfaces */
--color-text:        #1A1A2E;   /* Primary text */
--color-text-muted:  #64748B;   /* Secondary text */
--color-border:      #E2E8F0;   /* Dividers */
--color-danger:      #EF4444;   /* Weakest topic indicators */
```

**Implementation note:** until operator approves a purple rebrand, implement Mark 3.2 **layout and component structure** using Study Atelier tokens in `globals.css` and `brand-tokens.ts`. Reference mock: `/mockups/vibrant-dashboard`.

### Typography
```
Display:  'Plus Jakarta Sans' (700/800) — headings, level names
Body:     'Inter' (400/500/600) — all UI text
Mono:     'JetBrains Mono' — XP counters, progress numbers
```

### Logo
- Lightning bolt icon in a rounded-square purple gradient background (#4B3FE8 → #7C3AED)
- "THE SWITCH PLATFORM" wordmark in bold, uppercase, purple
- Tagline: "Unlock Potential. Build Confidence. Achieve More."

---

## DATABASE SCHEMA (Supabase / Prisma)

> **Reference only.** Live persistence uses SQLite collection stores and module-specific services under `src/lib/persistence/` and `src/modules/*/service.ts`. Map entities below to existing modules — do not introduce Prisma unless the operator reopens storage architecture.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatar        String?
  level         Int       @default(1)
  xp            Int       @default(0)
  xpToNextLevel Int       @default(1200)
  streak        Int       @default(0)
  lastActiveAt  DateTime  @default(now())
  dailyGoal     Int       @default(65)
  dailyProgress Int       @default(0)
  subjects      UserSubject[]
  sessions      PracticeSession[]
  examAttempts  ExamAttempt[]
  plannerItems  PlannerItem[]
  createdAt     DateTime  @default(now())
}

model Subject {
  id          String    @id @default(cuid())
  name        String
  icon        String
  color       String
  topics      Topic[]
  exams       Exam[]
  userSubjects UserSubject[]
}

model Topic {
  id          String    @id @default(cuid())
  subjectId   String
  subject     Subject   @relation(fields: [subjectId], references: [id])
  name        String
  content     String
  videoUrl    String?
  questions   Question[]
  userTopics  UserTopic[]
}

model UserSubject {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  subjectId       String
  subject         Subject   @relation(fields: [subjectId], references: [id])
  overallProgress Int       @default(0)
  predictedGrade  Int       @default(4)
  targetGrade     Int       @default(7)
  userTopics      UserTopic[]
}

model UserTopic {
  id              String    @id @default(cuid())
  userSubjectId   String
  userSubject     UserSubject @relation(fields: [userSubjectId], references: [id])
  topicId         String
  topic           Topic     @relation(fields: [topicId], references: [id])
  masteryScore    Int       @default(0)
  questionsAnswered Int     @default(0)
  correctAnswers  Int       @default(0)
  lastPracticed   DateTime?
}

model Question {
  id          String    @id @default(cuid())
  topicId     String
  topic       Topic     @relation(fields: [topicId], references: [id])
  type        String
  prompt      String
  options     Json?
  answer      String
  markScheme  String
  marks       Int       @default(1)
  difficulty  Int       @default(2)
}

model Exam {
  id          String    @id @default(cuid())
  subjectId   String
  subject     Subject   @relation(fields: [subjectId], references: [id])
  board       String
  paper       String
  year        Int
  duration    Int
  totalMarks  Int
  questions   ExamQuestion[]
  attempts    ExamAttempt[]
}

model ExamAttempt {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  examId      String
  exam        Exam      @relation(fields: [examId], references: [id])
  score       Int
  totalMarks  Int
  timeTaken   Int
  answers     Json
  completedAt DateTime  @default(now())
}

model PracticeSession {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  topicId     String
  questionsAttempted Int
  correctAnswers     Int
  xpEarned    Int
  duration    Int
  completedAt DateTime  @default(now())
}

model PlannerItem {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  title       String
  type        String
  scheduledAt DateTime
  duration    Int
  completed   Boolean   @default(false)
  subjectId   String?
}
```

---

## APP STRUCTURE

```
/app
  /(auth)
    /sign-in
    /sign-up
  /(dashboard)
    /layout.tsx
    /page.tsx
    /subjects/page.tsx
    /subjects/[id]/page.tsx
    /learn/page.tsx
    /learn/[topicId]/page.tsx
    /practice/page.tsx
    /practice/[topicId]/page.tsx
    /exams/page.tsx
    /exams/[examId]/page.tsx
    /exams/[examId]/attempt/page.tsx
    /progress/page.tsx
    /planner/page.tsx
    /power-grid/page.tsx
    /support/page.tsx
  /api
    /auth/[...nextauth]
    /user/route.ts
    /subjects/route.ts
    /topics/[id]/route.ts
    /practice/submit/route.ts
    /exams/[id]/submit/route.ts
    /progress/route.ts
    /planner/route.ts
    /power-grid/route.ts
```

**Live mapping:** see route table in “How agents must use this file” above. Prefer extending `src/app/*` and `src/app/api/*` over duplicating parallel trees.

---

## LAYOUT — SIDEBAR + TOP NAV

### Left Sidebar (desktop, 240px wide, collapsible to 64px on mobile)
- Logo at top
- Nav: Home, Subjects, Learn, Practice, Exams, Progress, Planner, Power Grid, Support
- Active state: filled purple background pill, white text
- Bottom: user avatar, name, level badge, XP bar, level name

**Live today:** `StudentAppShell` uses **top study rail** + mobile bottom dock — see [`MOCK-IDEA-BUILD-REFERENCE.md`](../MOCK-IDEA-BUILD-REFERENCE.md). Sidebar layout is a **future operator gate** (conflicts with “no Seneca sidebar clone” rule unless docs updated together).

### Top Bar
- "Good morning, [Name]! ⚡" greeting (dynamic time-based)
- Streak badge: 🔥 "7 day streak"
- User avatar + dropdown (profile, settings, sign out)

**Live today:** greeting + weekly study-day count + Power Grid badge in `StudentAppShell`; full streak system — extend in Power Grid module.

---

## PAGE 1: DASHBOARD (Home)

### Continue Learning Card · Next Exam Card · Today's Goal Card
### Your Subjects Grid · Weakest Topics Panel · Power Grid Widget

**Live today:** `Mark32HeroRow`, `Mark32SubjectGrid`, `Mark32WeakestTopics` on `/dashboard`. Remaining: Recharts sparklines, predicted/target grade columns, Framer Motion stagger.

---

## PAGE 2: SUBJECTS

Grid of enrolled subjects with progress ring, grade info, Study CTA.

**Live today:** `/subjects` — extend toward spec.

---

## PAGE 3: LEARN (Topic Browser)

Topic list, content, video, accordion, Start Practice CTA.

**Live today:** subject experience + catalog — extend toward spec.

---

## PAGE 4: PRACTICE (Timed Assessment)

Setup, active session, results with XP.

**Live today:** `/assessments` + Timed Assessment module + Saved Progress.

---

## PAGE 5: EXAMS (Full GCSE Papers)

Browser, attempt (fullscreen, timer, flag, submit), results.

**Live today:** `/exams` + Exam Engine + focus mode + Saved Progress.

---

## PAGE 6: PROGRESS

Stats, subject radial charts, weakest topics table, activity chart.

**Live today:** `/progress` + Power Grid — add Recharts when wired to module data.

---

## PAGE 7: PLANNER

Calendar, add session modal, upcoming list.

**Live today:** weekly planner module + `PlannerPromptCard` — extend UI toward calendar spec.

---

## PAGE 8: POWER GRID (Gamification)

9-level journey, XP bar, rewards, badges.

**Live today:** Power Grid levels in `src/modules/power-grid/` — extend journey visualization on `/progress`.

---

## PAGE 9: SUPPORT

FAQ, contact form, accessibility settings entry.

**Live today:** `/support` hub + `/accessibility` module.

---

## ACCESSIBILITY FEATURES (Global)

| Setting | Implementation |
|---|---|
| Extra Time | Exam timer multiplier |
| Text to Speech | Web Speech API / Read Aloud module |
| Reader Mode | CSS + accessibility runtime |
| Colour Overlays | `data-switch-colour-scheme` in `globals.css` |
| Large Text | Accessibility runtime attributes |
| Keyboard Navigation | Focus rings, skip links |

**Live today:** `/accessibility` + SEND chips — extend toward full matrix above.

---

## POWER GRID LEVEL LOGIC

```typescript
const LEVELS = [
  { level: 1, name: "Ignition",       xpRequired: 0 },
  { level: 2, name: "Powered Up",     xpRequired: 500 },
  { level: 3, name: "Current Flow",   xpRequired: 1200 },
  { level: 4, name: "Voltage Rising", xpRequired: 2000 },
  { level: 5, name: "Full Circuit",   xpRequired: 3200 },
  { level: 6, name: "High Voltage",   xpRequired: 5000 },
  { level: 7, name: "Grid Master",    xpRequired: 7500 },
  { level: 8, name: "Power Station",  xpRequired: 11000 },
  { level: 9, name: "Switch Legend",  xpRequired: 16000 },
]

const XP_REWARDS = {
  correctAnswer:      5,
  practiceComplete:  20,
  perfectPractice:   50,
  examComplete:     100,
  dailyStreak:       30,
  topicMastered:    150,
}
```

**Live today:** `PowerGridLevel` names match; numeric XP thresholds may differ — align in `power-grid` service with operator approval.

---

## STREAK SYSTEM

Track `lastActiveAt`; increment on daily activity; show in top bar; award XP.

**Live today:** partial via planner study-day count — extend in modules.

---

## SEEDED DATA

```
Subjects: Maths, English Language, Science
Demo user with Level 4, 860 XP, 7-day streak, subject progress
```

**Live today:** `mvp-content-catalog.json` + OIDC sign-in — no hardcoded demo password in repo.

---

## ANIMATIONS & MICRO-INTERACTIONS

Sidebar pill slide, card fade-up, XP bar spring, level-up overlay, +XP toast, chart mount animations, streak pulse, timer color transition, Power Grid node pulse.

**Live today:** minimal — add via Framer Motion incrementally on Area 9 steps 9.8–9.9.

---

## MOBILE RESPONSIVE

Bottom tab bar, stacked cards, full-screen exam, 44px touch targets.

**Live today:** `StudentAppShell` mobile dock — align item count with spec.

---

## ENVIRONMENT VARIABLES NEEDED

```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://theswitchplatform.com
...
```

**Live today:** see `.env.local` examples and Fly secrets — OIDC, SQLite `/data`, governance vars per `PLATFORM-GUIDE.md`.

---

## LANDING PAGE (unauthenticated root)

Hero, feature rows, Power Grid section, mission, accessibility, roadmap (MVP / v4 / Future), footer.

**Live today:** `/` via `DashboardHome` mode `home` — extend toward full marketing spec.

---

## QUALITY CHECKLIST (verify before done)

Map to **live verification** where possible:

| Checklist item | Live verification / module |
|----------------|------------------------------|
| All 9 pages render | `npm run test:smoke` + manual route pass |
| Auth flow | OIDC on `/login`; `verify:live-oidc-proof` |
| Practice saves + XP | Timed Assessment + Saved Progress modules |
| Exam timer + auto-submit | Exam Engine |
| Level/XP in sidebar | Power Grid + dashboard shell |
| Streak on daily activity | Extend Power Grid / planner |
| Planner events | `weekly-planner` module |
| Progress charts | `/progress` + future Recharts |
| Accessibility persists | `/accessibility` + runtime attrs |
| Mobile 375px | manual + shell tests |
| Recharts animate | when added |
| Demo user populated dashboard | real OIDC + onboarding |
| Light mode only | `globals.css` |
| Deployed to production | **Fly** — `fly deploy -a the-switch-platform` |

- [ ] All 9 pages render without errors
- [ ] Auth flow works: sign up → dashboard, sign in → dashboard, sign out → landing
- [ ] Practice session saves to DB and awards XP
- [ ] Exam timer works and auto-submits
- [ ] Level/XP updates reflect immediately in sidebar and Power Grid page
- [ ] Streak increments on daily activity
- [ ] Planner events save and appear on calendar
- [ ] Progress page charts pull real data from DB
- [ ] Accessibility settings persist across sessions
- [ ] Mobile layout works on 375px viewport
- [ ] All Recharts animate on mount
- [ ] Seeded demo user logs in and shows full populated dashboard
- [ ] Dark mode not required for MVP (light only)
- [ ] Deployed to production with theswitchplatform.com domain

---

## START ORDER FOR AGENT

**Greenfield order (original prompt):**

1. Init Next.js 14 project with TypeScript + Tailwind
2. Set up Supabase project + Prisma schema + run migrations
3. Configure auth (NextAuth or Clerk)
4. Build Layout (sidebar + topnav)
5. Build Dashboard with mock data
6. Wire Dashboard to real DB
7. Build Subjects, Learn, Practice
8. Build Exams
9. Build Progress, Planner, Power Grid, Support
10. Build Landing page
11. Run seed script
12. Full QA pass
13. Deploy to Vercel

**Live repo order (use this instead):**

1. Read HANDOFF → AGENTS → PLATFORM-GUIDE → this file → UI-UX-MASTERPLAN
2. Complete Area 9 steps **9.8** (extend Mark 3.2 to remaining student routes) and **9.9** (visual consistency audit)
3. Map each page section above to existing module + route
4. Add purple brand / sidebar / Recharts / Framer only with operator approval and doc sync
5. `npm run lint && npm run type-check && npm run test && npm run test:smoke`
6. `fly deploy -a the-switch-platform`
7. Update HANDOFF, AGENTS, README build record

---

*Built for theswitchplatform.com · GCSE students deserve better revision tools.*
