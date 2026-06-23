# The Switch Platform Mark 3.2 — Agent Entry Point

## CRITICAL RULE — READ THIS FIRST

Before doing ANY work in this repository:

1. Read **`HANDOFF.md`** for live session state, next steps, and blockers
2. Read **`PLATFORM-GUIDE.md`** — the single consolidated guide (rules, architecture, modules, launch checklist)
3. Read **`README.md`** sections only when the handoff points to them (build record, launch notes)
4. Read **`PROJECT_RECOVERY.md`** and **`RESTORED_CHATS.md`** if folder or history context is unclear
5. For module work, open the matching section in **`PLATFORM-GUIDE.md` → Module reference**

Never switch between Cursor and Codex without updating **`HANDOFF.md`** and pushing committed work first.

### Operator rule — every session

**At session start:** tell Cursor or Codex:

```text
Read HANDOFF.md first.
```

Then read **`PLATFORM-GUIDE.md`** before making changes.

**Before each action:** consult **`HANDOFF.md`**, then **`PLATFORM-GUIDE.md`**, then relevant **`README.md`** section.

**After each action:** update **`HANDOFF.md`** Live session state. Append **`README.md`** Ordered Build Record when behavior changed.

**At session end:** run verification, confirm push, refresh **`HANDOFF.md`**.

## Document map

| Document | Purpose |
|----------|---------|
| **`HANDOFF.md`** | Live session state — read first every session |
| **`PLATFORM-GUIDE.md`** | **Single merged guide** — AGENTS rules + all module READMEs + 22-item launch list |
| **`AGENTS.md`** | This entry point |
| **`README.md`** | Cumulative product history and Ordered Build Record (append only) |
| **`.cursor/rules/`** | Cursor enforcement |

## Where the full content lives

All of the following are now in **`PLATFORM-GUIDE.md`** (one file):

- Session rules and multi-agent workflow
- Architecture and development rules
- Build priority order
- Design system index and UI checklist
- **Full End-to-End Completion List** (22 items — authoritative)
- Launch verification commands
- All module README content (Exam Engine, Power Grid, Saved Progress, Auth, CMS, etc.)
- Auth and live sign-in operator notes
- Changes 1.0 product direction
- Completion standard

Module folders still contain short **`README.md`** stubs that link back to **`PLATFORM-GUIDE.md`**.

## Source of truth

- Active folder: `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- GitHub: `https://github.com/tech-fresh/the-switch-platform`
- Live site: `https://theswitchplatform.com`
- Do not use `THE SWITCH` or `THE SWITCH 2`

## Quick links

- Launch checklist → **`PLATFORM-GUIDE.md` → Full End-to-End Completion List**
- Module docs → **`PLATFORM-GUIDE.md` → Module reference**
- Live state → **`HANDOFF.md`**
- Build history → **`README.md` → Ordered Build Record**
