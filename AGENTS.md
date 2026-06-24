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
| **`HANDOFF.md`** | **Read first** — live state, plain-English story, **dual-agent map**, **MVP at a glance** |
| **`AGENTS.md`** | This entry point — synced with HANDOFF |
| **`PLATFORM-GUIDE.md`** | Rules, architecture, modules, 22-item launch list, MVP modules |
| **`README.md`** | Cumulative product spec, **MVP at a glance**, Ordered Build Record (append only) |
| **`docs/ideas/`** | Plans — streamline, onboarding stays |
| **`src/modules/onboarding/README.md`** | Onboarding MVP scope |
| **`docs/MOCK-IDEA-BUILD-REFERENCE.md`** | UI build-from reference |
| **`.cursor/rules/`** | Cursor enforcement |

**Dual-agent handoff:** `HANDOFF.md` → **Dual-agent document system** — never switch tools without updating it.

## Dual-agent usage (Cursor + Codex)

| | Cursor Agent | Codex |
|--|--------------|-------|
| **Use for** | UI, API, tests, git, multi-file edits | Planning, review, debugging, service logic |
| **Read first** | `HANDOFF.md` | `HANDOFF.md` |
| **Update before switch** | Live session state + session log | Same |
| **Full map** | `HANDOFF.md` → Dual-agent document system | Same |

```mermaid
flowchart LR
  H["HANDOFF.md\nbaton"] --> C["Cursor"]
  H --> X["Codex"]
  C --> H
  X --> H
```

## MVP at a glance

**Authoritative sync:** `HANDOFF.md` → **MVP at a glance**. Full history: `README.md` → Mark 3.2 Product Spec / Blueprint.

| Area | MVP today |
|------|-----------|
| **Live** | https://theswitchplatform.com — launch **complete** (22 items) |
| **Modules** | Exam Engine, Power Grid, Saved Progress, Read Aloud, Dashboard, Timed Assessments, Full GCSE Exams, Results, Recommendations, Accessibility, Access Arrangements, Onboarding |
| **Subjects** | GCSE Maths, English Language, Combined Science; iGCSE Maths |
| **Onboarding** | 8 steps → builds dashboard; secondary school; GCSE (England) + iGCSE; Wales/NI **later** |
| **Polish lane** | Calmer `/` and `/dashboard`; Study Atelier UI — `docs/MOCK-IDEA-BUILD-REFERENCE.md` |

---

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

- **Dual-agent handoff** → [`HANDOFF.md` → Dual-agent document system](./HANDOFF.md#dual-agent-document-system-cursor--codex)
- **MVP at a glance** → [`HANDOFF.md` → MVP at a glance](./HANDOFF.md#mvp-at-a-glance-operators--agents)
- Launch checklist → **`PLATFORM-GUIDE.md` → Full End-to-End Completion List** (full 22 items also below)
- Module docs → **`PLATFORM-GUIDE.md` → Module reference**
- Live state → **`HANDOFF.md` → Live session state**
- Build history → **`README.md` → Ordered Build Record**
- UI / onboarding plans → **`docs/ideas/`** · **`docs/MOCK-IDEA-BUILD-REFERENCE.md`**

---

## Operator and agent sync (plain English)

**Authoritative live detail:** `HANDOFF.md` → **Live session state** + **Plain-English — what the project is doing**.

This block stays aligned with `README.md` → **Operator and agent sync**. Do not drift.

| Question | Answer |
|----------|--------|
| Is the platform live? | Yes — https://theswitchplatform.com (Fly). All **22** launch checklist items **complete**. |
| What are we doing now? | **Post-launch polish** — calmer website, focused dashboard, **onboarding unchanged in length**. |
| Lane A — onboarding | **8 steps stay.** They **build the student dashboard**. Secondary school + **GCSE (England)** / **iGCSE** only; Wales/NI **coming later**. |
| Lane B — website | **Declutter only** — no duplicate mockups on `/` or `/dashboard`. Gallery routes keep rich previews. |
| What is next? | Study shell on more routes; Wales/NI when operator prioritises. See `docs/ideas/STREAMLINE-WEBSITE-PLAN.md`. |

```mermaid
flowchart LR
  H["HANDOFF.md\nread first"] --> P["PLATFORM-GUIDE.md\nrules"]
  P --> R["README sections\nwhen needed"]
```

---

## Full End-to-End Completion List (final — do not replace)

**Preservation rule:** This is the **final** launch checklist for this repository. **Do not replace, shorten, or delete** these 22 items. Do not overwrite earlier records in `README.md` or session logs in `HANDOFF.md`. Allowed updates only: mark an item complete or reopen it with date and evidence; append operator notes. Keep this list aligned with the copies in `README.md`, `HANDOFF.md`, and `PLATFORM-GUIDE.md`.

`Final Path Mark 1` = repo, scripts, governance surfaces in place.  
`Final Path Mark 2` = real deployed environment proven end to end with recorded approval.

Do not describe the platform as fully complete unless every item below is complete in the real target environment:

1. Configure the real live auth environment.
   Set `SWITCH_AUTH_MODE=oidc`, `SWITCH_AUTH_SECRET`, `SWITCH_AUTH_BASE_URL`, and one complete live OIDC provider block.
2. Prove the real deployed sign-in flow.
   Verify sign-in, callback, session creation, sign-out, and protected-route access in the live environment.
3. Prove the real deployed sign-up and onboarding flow.
   Verify welcome, learner-role selection, school and year-group capture, qualification-path capture, subject selection across GCSE and iGCSE where supported, accessibility-question capture, SEND and access-arrangement path visibility, guardian invite path, age-or-consent confirmation, UK school-source lookup behaviour, and first dashboard provisioning based on the learner's selected setup in the live environment.
4. Configure the real live persistence environment.
   Set `SWITCH_PERSISTENCE_DRIVER=sqlite` and `SWITCH_DATA_DIRECTORY` to the intended shared live student-data setup.
5. Prove live student-data continuity.
   Verify saved progress, results, account-linked settings, and session continuity across real usage.
6. Prove backup, restore, and recovery.
   Run live backup, restore, and recovery checks for the student-data path.
7. Configure the live CMS and editorial runtime.
   Set `SWITCH_CMS_BACKEND_MODE=live` and confirm the intended writable editorial operating mode.
8. Prove the live editorial workflow.
   Verify review, approval, publish, rollback, and blocked-content handling through the real operating path.
9. Configure live governance recording.
   Set `SWITCH_RECORD_GOVERNANCE=1` and `SWITCH_GOVERNANCE_ENVIRONMENT` for the target release environment.
10. Provide named launch ownership.
   Set `SWITCH_LAUNCH_APPROVER` and `SWITCH_LAUNCH_STOP_AUTHORITY`.
11. Provide governance review notes.
   Set `SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE`, `SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE`, and `SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE`.
12. Provide governance sign-off notes.
   Set `SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE`, `SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE`, `SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE`, `SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE`, and `SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE`.
13. Configure the live base URL.
   Set `SWITCH_LIVE_BASE_URL` to the deployed platform URL.
14. Provide live route test access.
   For cookie or OIDC live auth, set `SWITCH_LIVE_STUDENT_COOKIE` and `SWITCH_LIVE_ADMIN_COOKIE`. For `external-header` live auth, set the matching live student and live admin identity environment values required by the walkthrough runtime.
15. Run live launch status verification.
   Execute `npm run verify:launch-status` and confirm the report shows the intended release environment inputs, command order, and any remaining live-only gaps truthfully before the final run starts.
16. Run live readiness verification.
   Execute `npm run verify:live-readiness`.
17. Run live persistence recovery verification.
   Execute `npm run verify:persistence-recovery`.
18. Run the final live walkthrough.
   Execute `npm run verify:live-walkthrough` across dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin.
19. Run the final governance sign-off.
   Execute `npm run verify:launch-signoff`.
20. Run the final launch completion sequence.
   Execute `npm run verify:launch-complete`.
21. Store the release evidence permanently.
   Keep the outputs from launch-status, readiness, recovery, walkthrough, sign-off, and launch-complete as the permanent release record.
22. Confirm system-wide truth matches. **Completed — 23 June 2026 (Fly production)**
   Ensure `README.md`, the admin launch view, runtime state, and recorded release evidence all match exactly.
   Plain-English: the notes, admin screen, and live website all tell the same story — no hidden mismatch.

**Completion rule:** Only when all 22 items above are done should the platform be described as fully complete, fully live, and 100% end to end.

**As of 23 June 2026:** all 22 items are complete on Fly production at https://theswitchplatform.com. Evidence: `release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md`.

Re-check item 22 anytime:

```bash
npm run verify:live-truth-match
```

---

## Item 3 completion record (23 June 2026)

- **Status: COMPLETE** on https://theswitchplatform.com
- **Proof:** `npm run verify:live-onboarding` passed
- **Evidence:** `release-evidence/2026-06-23-final-path-mark-2-item-3-complete.md`
- **UI mockup (visual):** `docs/SENECA-STYLE-ONBOARDING-MOCKUP.md`
- **UI build reference (code from here):** `docs/MOCK-IDEA-BUILD-REFERENCE.md`
- **AI ideas bank (plans + copy):** `docs/MOCK-IDEA-AI-IDEAS.md`
- **Streamline + onboarding plan:** `docs/ideas/STREAMLINE-WEBSITE-PLAN.md`

## Item 3 notes (appended — do not delete)

| Date | Note |
|------|------|
| 23 June 2026 | Shipped: `/onboarding`, API, dashboard gate. Live proof passed — see completion record above. |
| 24 June 2026 | **MVP scope locked:** onboarding **stays** (8 steps); secondary school; **GCSE (England)** + **iGCSE**; Wales/NI **coming later**. Module doc: `src/modules/onboarding/README.md`. |
