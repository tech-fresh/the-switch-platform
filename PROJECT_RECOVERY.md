# THE SWITCH 3 Project Recovery Note

This file records what was found while restoring information for the active
project workspace, `THE SWITCH 3`.

## Source Of Truth

The active `THE SWITCH 3` project is:

`/Users/lloydnwagbara/Documents/THE SWITCH 3`

This folder contains the current website-first MVP, source code, README, Git
history, modules, routes, data files, and preview assets.

The connected GitHub remote is:

`https://github.com/tech-fresh/the-switch-platform.git`

## Multi-Agent Workflow Files

Both **Cursor Agent** and **Codex** must use this folder only.

| File | Purpose |
|------|---------|
| `AGENTS.md` | Architecture, priorities, completion standard |
| `HANDOFF.md` | Live session handoff between tools |
| `README.md` | Cumulative product spec and build record |
| `.cursor/rules/` | Cursor-specific enforcement (active — 4 rule files) |

Read `HANDOFF.md` at session start — tell the agent **Read HANDOFF.md first**.
Update the **Live session state** section in `HANDOFF.md` at session end before switching tools.

## Other Folders Found

The following related folders were found during recovery:

- `/Users/lloydnwagbara/Documents/THE SWITCH` — empty `.git` only; do not use
- `/Users/lloydnwagbara/Documents/THE SWITCH 2` — superseded; do not use
- `/Users/lloydnwagbara/Documents/THE SWITCH 3` — **active source-of-truth folder**
- `/Users/lloydnwagbara/Documents/Codex/2026-06-05/i-am-building-the-switch-platform`

The older `/Users/lloydnwagbara/Documents/THE SWITCH` folder currently contains
only an empty `.git` directory. No checked-out files, branches, or commits were
visible there during recovery.

The Codex folder from June 5 did not contain project files in its `work` or
`outputs` folders during recovery.

## Current Git History In THE SWITCH 3

The current project has a visible commit history from June 5 to June 7. Recent
commits include:

- `5b86e21` Add website walkthrough and reorder README updates
- `f992efa` Update README priorities and launch checklist
- `19a7278` Fix README structure and preserve main overview
- `9ab2085` Build API-first MVP flows and fresh exam attempts
- `a9f6822` Expand README with cumulative MVP record
- `94c52ce` Add README preview and mockup visuals
- `a1c88fc` Add content catalog module and preview mockups
- `d6cdb2b` Align MVP support architecture with trusted signposting
- `ebe2634` Add JSON topic content package architecture
- `9d7f096` Expand MVP architecture and content sourcing
- `49a9bdd` Initial scaffold for Mark 3.2 MVP

After fetching from GitHub, local `main` and `origin/main` matched exactly.
There were no missing local or remote commits between them.

## Restored Product Information Present

The active project currently includes the Mark 3.2 MVP architecture:

- Dashboard
- Power Grid
- Timed Assessments
- Exam Engine
- Saved Progress
- Recommendations
- Accessibility
- Read Aloud
- Access Arrangements foundation

The current README is the main cumulative build record. It includes:

- product vision
- architecture direction
- development rules
- build priority order
- ordered build record
- routes
- API routes
- modules
- preview assets
- project explanation for future development

## Current Student-Facing Routes

- `/`
- `/account`
- `/dashboard`
- `/how-it-works`
- `/subjects`
- `/assessments`
- `/exams`
- `/progress`
- `/saved-progress`
- `/support`
- `/recommendations`
- `/accessibility`
- `/results`
- `/admin`

## Current Modules

- `auth`
- `language`
- `content`
- `support`
- `dashboard`
- `website-guide`
- `subjects`
- `topics`
- `revision`
- `quiz`
- `accessibility`
- `read-aloud`
- `recommendations`
- `timed-assessment`
- `exam-engine`
- `saved-progress`
- `access-arrangements`
- `power-grid`
- `results`
- `cms`
- `past-papers`

## Important Note

Previous Codex chat text was not visible as recoverable project files. The app
only showed the current active thread for this workspace. The durable project
information that could be restored is the codebase, README record, Git history,
module structure, and local project files inside `THE SWITCH 3`.

The recoverable chat record has been written to:

`RESTORED_CHATS.md`

The project was also verified with:

`npm run build`

The production build completed successfully.
