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

## Before each action — consult first

Before **every** action — code, docs, commands, git, planning, or review — consult in order:

1. This file (`HANDOFF.md`) → Live session state, What is next, Blockers
2. `AGENTS.md` → Architecture, session rules, completion standard
3. `README.md` → Non-negotiable development rules + Active build priority order

Do not start until the action still matches live state and build priorities.

If the action touches a module, also read `src/modules/<module>/README.md`.

## After each action — update this file

After **every** completed action — not only at session end:

1. Refresh **Live session state** below (What was just completed, What is next, Blockers, Verification last run)
2. Add or refresh a **Session log** entry when the action materially changed repo state, blockers, or next steps
3. Append `README.md` Ordered Build Record when routes, modules, or behavior changed

Commit and push when the action produced repo changes, unless a task explicitly requires a local-only commit.

## Efficiency quick reference (read this every session)

| Step | Action |
|------|--------|
| Before each task | Read `HANDOFF.md` → `AGENTS.md` → README **sections only** (not whole README unless needed) |
| During task | One module, one priority, match architecture gate |
| After each task | Update Live session state below (short bullets) |
| End of session | Verification, commit, push, session log entry, README build record if behavior changed |

**Launch fix right now:** Custom domain **https://theswitchplatform.com** → point DNS to Fly (see below). OAuth redirect likely already set for this domain from Vercel.

## Golden rule

**Never switch between Cursor and Codex without updating this file first.**

Commit and push to GitHub before switching tools unless a task explicitly requires a local-only commit.

---

## Live session state

Update this section every session.

### Current state

- **Active folder:** `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- **GitHub repo:** `https://github.com/tech-fresh/the-switch-platform`
- **Current branch:** `cursor/unified-login-sign-in-page`
- **Last updated by:** Cursor
- **Last updated:** 2026-06-23
- **Platform label:** `near-launch` — `/login` live; Microsoft terminal provisioning documented; Fly deploy green

### Active task

- **Priority item #:** auth — Microsoft Azure real client ID on Fly
- **Module:** auth / deploy
- **Status:** Code + docs complete; operator must finish `az login` with M365 dev tenant admin, then `npm run provision:microsoft-oauth-live:apply`
- **Branch:** `cursor/unified-login-sign-in-page`

### What was just completed

- Terminal provision script: `scripts/provision-microsoft-oauth-live.sh` (+ `npm run provision:microsoft-oauth-live` / `:apply`)
- Verify script now rejects placeholder `client_id=your-client-id` on live redirects
- Docs updated: personal Hotmail/Outlook account type, M365 Developer tenant vs personal Hotmail login
- Azure CLI install path documented (`brew install azure-cli`)

### What is next

1. `az login --use-device-code --allow-no-subscriptions` with **admin@tenant.onmicrosoft.com** (M365 Developer welcome email — not Hotmail alone)
2. `npm run provision:microsoft-oauth-live:apply` — creates Azure app, sets Fly secrets, runs verify
3. Manual browser test: https://theswitchplatform.com/login → **Continue with Microsoft**
4. Merge `cursor/unified-login-sign-in-page` to `main` (PR #4)

### Blockers

- **Fly still has placeholder `SWITCH_OIDC_MICROSOFT_CLIENT_ID=your-client-id`** until provision script completes
- **Azure CLI login:** portal/Hotmail sign-in is not enough; need M365 Developer **tenant admin** account for `az ad app create`

### Verification last run

- [x] `npm run build` (local + Fly image)
- [x] `fly deploy -a the-switch-platform`
- [x] `npm run verify:google-oauth-live`
- [ ] `npm run verify:microsoft-oauth-live` (fails until real Azure client ID on Fly)
- [x] Live `/login` and `/login/microsoft-guide` return 200

---

## Source of truth

| Item | Value |
|------|-------|
| Active local folder | `/Users/lloydnwagbara/Documents/THE SWITCH 3` |
| GitHub remote | `https://github.com/tech-fresh/the-switch-platform` |
| Do not use | `/Users/lloydnwagbara/Documents/THE SWITCH` or `THE SWITCH 2` |
| Agent rules | `AGENTS.md` |
| Product history | `README.md` (cumulative — append only) |
| Recovery notes | `PROJECT_RECOVERY.md`, `RESTORED_CHATS.md` |
| Session handoff | `HANDOFF.md` (this file) |
| Cursor-only rules | `.cursor/rules/` (active — 4 rule files) |

---

## Document map

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Architecture, priorities, session rules, completion standard, design system |
| `HANDOFF.md` | Live session state and handover between Cursor and Codex |
| `README.md` | Cumulative product spec, build record, launch notes |
| `.cursor/rules/` | Cursor-specific enforcement mirroring `AGENTS.md` |

---

## Workflow diagram

```mermaid
flowchart LR
    A["AGENTS.md + README priorities"] --> B["Cursor Agent"]
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
3. Read `AGENTS.md` → Session rules, architecture, and completion standard
4. Read `README.md` → Non-negotiable development rules + Active build priority order
5. Read `PROJECT_RECOVERY.md` if folder or history context is unclear
6. Read the relevant `src/modules/<module>/README.md`
7. Run `git status` and `git pull origin main` (or checkout the active feature branch)
8. Confirm the task maps to **one module** and one build-priority item
9. Paste the standard session prompt below into the active tool

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

## Final Path Mark 2 — live state (June 21, 2026)

**Authoritative completion list:** `AGENTS.md` → Full End-to-End Completion List (22 items).

| Area | Status |
|------|--------|
| Repo-side durable persistence + launch verification | Done — commit `1168e4f` on `main` |
| Deployed persistence API surface | Reports durable Blob-backed sqlite |
| Production Blob byte reads | **Blocked** — store suspended |
| Protected live routes (`/dashboard`, etc.) | **Failing** — 500 under walkthrough |
| Item 22 truth-match | **Open** |
| Honest platform label | `near-launch` |

**Remaining blocker (platform-side, not repo):** the Vercel Blob store backing `vercel-blob://switch-live-data` is suspended. Metadata may still resolve, but signed reads for `switch-live-data/switch-live.sqlite` fail with `BlobStoreSuspendedError`.

**Repo-side closeout tooling now includes:** `npm run verify:blob-health` as the first command in the final live sequence. Run it against the live environment before walkthrough, sign-off, and truth-match.

**Do not describe the platform as fully complete, fully live, or 100% end-to-end** until item 22 passes and the full verification chain reruns cleanly after the Blob store is restored or replaced.

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
</think>



Read
