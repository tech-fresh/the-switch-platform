# The Switch Platform Mark 3.2

## CRITICAL RULE — READ THIS FIRST

Before doing ANY work in this repository — writing code, creating files, editing files, refactoring, anything — you MUST first:

1. Read `AGENTS.md` (this file)
2. Read `HANDOFF.md` for live session state, next steps, and blockers
3. Read `README.md` for product priorities and non-negotiable rules
4. Read `PROJECT_RECOVERY.md` and `RESTORED_CHATS.md` if folder or history context is unclear
5. Read the relevant `src/modules/<module>/README.md` before module work

Never switch between Cursor and Codex without updating `HANDOFF.md` and pushing committed work first.

### Operator rule — every session

**At session start:** tell Cursor or Codex:

```text
Read HANDOFF.md first.
```

Then read `AGENTS.md` and `README.md` priorities before making changes.

**Before each action:** consult `HANDOFF.md`, then `AGENTS.md`, then `README.md` priorities. Do not act until the task still matches live state and build priorities. If the action touches a module, also read `src/modules/<module>/README.md`.

**After each action:** update **Live session state** in `HANDOFF.md` (not only at session end). Append `README.md` Ordered Build Record when routes, modules, or behavior changed. Commit and push when the action produced repo changes, unless a task explicitly requires a local-only commit.

**At session end:** run verification, confirm push, refresh **Live session state** again, and add a **Session log** entry if not already recorded for the final action.

## Source Of Truth

- Active local folder: `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- GitHub: `https://github.com/tech-fresh/the-switch-platform`
- Session handoff: `HANDOFF.md` — read at session start; consult before each action; update after each action and at session end
- Recovery files: `PROJECT_RECOVERY.md`, `RESTORED_CHATS.md`
- Product history: `README.md` (cumulative — append only)
- Agent contract: `AGENTS.md` (this file)
- Cursor-only rules: `.cursor/rules/`
- Older folders (`THE SWITCH`, `THE SWITCH 2`) are not active — do not edit

## Multi-Agent Workflow (Cursor + Codex)

Both **Cursor Agent** and **Codex** work on this single repo. Git is the handoff layer between tools.

**Authoritative session workflow:** `HANDOFF.md` contains the live session state, checklists, standard session prompt, build priorities, architecture gate, tool split, and session log. Read and update it every session.

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Architecture, priorities, session rules, completion standard |
| `HANDOFF.md` | Live session state and handover between Cursor and Codex |
| `README.md` | Cumulative product spec and build record |
| `.cursor/rules/` | Cursor-specific enforcement mirroring `AGENTS.md` (active — 4 rule files) |

### Session start prompt

Tell Cursor or Codex at the start of every session:

```text
Read HANDOFF.md first.
```

Then read `AGENTS.md`, this file's priority order, and the relevant module README.

### Session start

1. Read this file (`AGENTS.md`)
2. Read `HANDOFF.md` → Live session state, What is next, Blockers
3. Read `README.md` → Non-negotiable development rules + Active build priority order
4. Read relevant `src/modules/<module>/README.md`
5. Run `git status` and `git pull origin main` (or checkout active feature branch)
6. Confirm the task maps to **one module** and one build-priority item
7. Paste the standard session prompt from `HANDOFF.md`

### Session end

1. Run `npm run lint && npm run type-check && npm run test`
2. Run `npm run test:smoke` if routes or pages changed
3. Commit and confirm push to GitHub succeeded
4. Update the **Live session state** section in `HANDOFF.md` and add a session log entry
5. Append `README.md` Ordered Build Record if routes, modules, or behavior changed

### Tool split

- **Cursor Agent:** file edits, refactors, UI changes, code navigation, multi-file work, terminal verification
- **Codex:** planning, reviewing, debugging, explaining changes, focused module logic

### Handoff rule

Before switching between Cursor and Codex:

- Update `HANDOFF.md` with what changed, what is next, and any blockers
- Commit and push unless a task explicitly requires a local-only commit
- Never leave uncommitted work when switching tools

### Branch rule

- Default branch: `main`
- Use `feature/<module>-<short-description>` only when specifically requested
- Do not create branches unless asked

### Safety rule

Do not delete rules, routes, modules, or documentation unless the user clearly asks for removal.

## Architecture

- Modular MVP
- Website first
- Future mobile app
- API first

## Core MVP

1. Dashboard
2. Power Grid
3. Timed Assessments
4. Exam Engine
5. Saved Progress
6. Recommendations
7. Accessibility
8. Read Aloud
9. Access Arrangements
10. Guided sign-up and onboarding

## Development Rules

- Keep modules independent.
- Do not mix exam logic with progress logic.
- Do not mix saved progress with content logic.
- Keep Read Aloud separate from revision and quiz logic.
- All student progress must auto-save.
- Full GCSE exams use official durations.
- Manual assessments cannot exceed official durations.
- Mobile-first UI.
- Accessibility-first design.
- Build for future mobile app migration.
- No business logic should live only in the website frontend.
- Use an API layer between frontend experiences and backend services.
- Preserve a language-ready structure even before translation is implemented.
- Treat CMS/Admin as a placeholder module during MVP unless explicitly prioritised.
- Keep Access Arrangements independent from Exam Engine, Timed Assessment, Saved Progress, Read Aloud, and Accessibility modules.
- Full GCSE Exam Mode must support future access arrangements.
- Timed Assessments must support future access arrangements.
- Read Aloud must integrate with Access Arrangements.
- Accessibility settings must integrate with Access Arrangements.
- Saved Progress must store active access arrangement settings.
- Do not build complex SEND UI until explicitly prioritised.
- Do not build AI support until explicitly prioritised.
- Do not build school administration tools until explicitly prioritised.
- Access Arrangements API contracts must be framework-neutral until the app stack is chosen.
- Website and future mobile clients must consume Access Arrangements through the API layer, not duplicate the rules.
- Guided sign-up must capture learner stage, school context, qualification path, and subject setup before the personalised dashboard is treated as ready.
- Guardian invite and age-or-consent checks must remain part of the onboarding architecture for school-age learners.
- Guided sign-up should explicitly ask whether the learner wants accessibility support or access help as part of first-time setup.
- Qualification and subject setup must cover both GCSE and iGCSE routes where supported by the platform.
- SEND-related support should flow through accessibility, access arrangements, and support content without forcing a complex SEND UI during MVP.
- School selection should be driven by maintained UK school-source links rather than an unmanaged static list.
- Onboarding choices must feed dashboard, planner, saved progress, and recommendation setup through shared API and module boundaries.

## Build Priority

1. Exam Engine
2. Power Grid
3. Saved Progress
4. Read Aloud
5. Dashboard
6. Timed Assessments
7. Full GCSE Exams
8. Results
9. Recommendations
10. Accessibility
11. Access Arrangements foundation

## Design System Index

- Primary design entry point: `src/app/globals.css`
- Tailwind theme config: `tailwind.config.ts`
- Global shell and runtime styling hooks: `src/app/layout.tsx`
- Homepage reference: `src/app/page.tsx`
- Dashboard reference: `src/components/dashboard-home.tsx`
- App-preview reference: `src/components/app-preview-showcase.tsx`
- Accessibility interaction reference: `src/app/accessibility/accessibility-experience.tsx`
- Exam flow reference: `src/app/exams/exam-experience.tsx`
- Assessment flow reference: `src/app/assessments/assessment-experience.tsx`
- Admin/CMS operational UI reference: `src/app/admin/page.tsx`
- Shared interaction components: `src/components/account-auth-controls.tsx`, `src/components/saved-progress-status-controls.tsx`, `src/components/cms-workflow-controls.tsx`

## Design System Rules

- Read `src/app/globals.css` before changing global visual behavior.
- Reuse existing stone, sky, emerald, amber, teal, and rose utility patterns before introducing new colours.
- Preserve the current product language: practical, academic, operational, accessibility-first.
- Keep layouts mobile-first and readable before adding density for larger screens.
- Respect accessibility runtime attributes in `html` and `body` for colour scheme, contrast, focus mode, reduced distraction, dyslexia font, font size, and line spacing.
- Prefer extending existing page and component patterns instead of inventing a disconnected visual system.
- Use shared components when interaction patterns repeat.
- Do not add frontend-only logic that bypasses module or API boundaries.
- Treat `tailwind.config.ts` as minimal until explicitly expanded; most live design rules currently live in page/component Tailwind classes and `globals.css`.

## Design Intelligence Workflow

- For UI work, inspect in this order: `src/app/globals.css`, `src/app/layout.tsx`, relevant page in `src/app`, supporting component in `src/components`, then related module/API files if behavior is involved.
- When adding a new screen, model spacing, typography, border treatment, and status colours on the nearest existing route instead of starting from scratch.
- When changing accessibility-related UI, check both `src/app/accessibility/accessibility-experience.tsx` and `src/components/accessibility-runtime.tsx`.
- When changing exam or assessment UI, follow the patterns already established in `src/app/exams/exam-experience.tsx` and `src/app/assessments/assessment-experience.tsx`.
- When changing admin or workflow UI, follow the operational card, status, and queue patterns in `src/app/admin/page.tsx`.

## UI Change Checklist

- Read `src/app/globals.css` first if the change affects layout, colour, typography, focus, or accessibility behavior.
- Read `src/app/layout.tsx` if the change touches global shell or runtime presentation.
- Open the closest existing reference route before designing a new pattern.
- Reuse existing Tailwind utility combinations before introducing new visual treatments.
- Keep the layout mobile-first before refining tablet or desktop behavior.
- Check whether the UI change depends on an API route or module service before adding frontend logic.
- Preserve accessibility behavior for contrast, focus visibility, reduced distraction, dyslexia font, and line spacing.
- Keep status colours and card treatments consistent with existing product screens.

## Additional Repository Guidance

### Project Context

- Name: `the-switch-platform`
- Root: `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- Type: Next.js web app with internal API layer and modular service backend
- Stack: TypeScript, React 19, Next.js 15 App Router, Tailwind CSS 3, Node.js, npm
- Status: MVP in progress, not fully built, partially seed-driven, not production-complete

### Repository Map

- `src/app`: website pages and layouts
- `src/app/api`: API layer used by the website and future clients
- `src/modules`: core business logic by feature
- `src/lib`: shared server, repository, API, and persistence utilities
- `src/components`: UI components
- `src/data`: seeded catalog and support data
- `tests`: Node test suite
- `scripts`: smoke, release, and persistence tooling

### Key Files To Read Early

- `HANDOFF.md`: live session state, next steps, standard session prompt
- `README.md`: product spec, build history, known gaps
- `package.json`: scripts, dependencies, runtime commands
- `tsconfig.json`: TypeScript config and aliases
- `next.config.ts`: framework config
- `src/app/layout.tsx`: global shell and accessibility runtime
- `src/app/page.tsx`: homepage entry
- `src/lib/api/server.ts`: page-to-internal-API bridge
- `src/lib/server/api.ts`: route wrappers and error handling
- `src/lib/persistence/runtime.ts`: persistence mode and storage paths
- `src/modules/exam-engine/service.ts`: highest-priority exam logic
- `src/modules/saved-progress/service.ts`: autosave and progress logic
- `src/modules/power-grid/service.ts`: progress and action summary logic
- `src/modules/auth/provider.ts`: auth provider and env logic
- `src/modules/cms/backend.ts`: CMS runtime and writeability status
- `src/data/mvp-content-catalog.json`: main seeded content source

### Session Start Rule

Before doing any work in this repository:

1. Read `AGENTS.md`, `HANDOFF.md`, and `README.md` priority order.
2. Read any relevant `src/modules/<module>/README.md`.
3. Check `git status` and whether local work still needs to be committed or pushed.
4. Stay consistent with the existing codebase structure, naming, and architecture.

### Codex Working Assumptions

- Assume incomplete until file-level verification proves otherwise.
- Read existing module and service files before changing behavior.
- Preserve module boundaries.
- Do not present preview or provisional paths as production-ready.
- Prioritize highest-priority modules first when completing features.

### Ignore During Routine Edits

- `node_modules/`, `.git/`, `.next/`, `dist/`, `build/`, `__pycache__/`, `venv/`, lockfiles

### Git Decision Rule

- Treat git state review as critical before making implementation decisions.
- Before changing code, check the current branch, `git status`, and whether local work still needs to be committed or pushed.
- Before reporting work complete, verify the intended commit is present locally and confirm the branch has been pushed to GitHub successfully.
- Keep the repo-managed `.githooks/post-commit` hook enabled through local `core.hooksPath` so tracked branches push to GitHub automatically after commits unless a task explicitly requires a local-only commit.
- Treat broken git authentication, stale GitHub CLI tokens, failed auto-push hooks, and failed manual pushes as priority blockers for completion reporting.
- If a push fails because git or GitHub auth is unhealthy, actively diagnose and repair the auth path in the same session instead of waiting for a separate user prompt.
- Prefer fixing GitHub auth through the current configured remote, `gh auth` status and re-auth flow, or other non-destructive credential repairs before declaring the repo push path blocked.
- Do not leave a task described as pushed or fully wrapped if the intended commit is still local-only because auth was not repaired.
- Treat automatic git update and push completion as part of the required end-to-end task closeout path whenever the user expects the work to be updated on GitHub.
- Do not make the user run manual git commands as the default solution for routine push completion.
- If an external browser or device approval is required for GitHub auth, keep the user ask as short as possible, then continue the repair and push flow immediately after approval.

### Current Pushed Baseline

- Treat the current pushed project baseline as including the full audit and launch completion plan, final-path and local preview auth documentation, Netlify deploy config, onboarding and school-source documentation, later qualification expansion notes, launch script environment loading, timed-assessment normalization hardening, persistence-script test coverage, the repo-managed auto-push hook, the README/AGENTS git workflow rules, `HANDOFF.md`, and `.cursor/rules/`.
- Do not describe those pushed items as planned-only if they already exist in code or documentation on `main`.
- Do not describe the platform as fully live or fully complete unless the `Final Path Mark 2` live-environment requirements are actually finished.

### Completion Standard

- Complete each task fully before moving on.
- If an error or bug is found during the task, fix it before calling the work complete.
- Do not consider a task done until the changed area builds, runs, and works correctly end to end for the current repo standard.

### Project Alignment

- Never deviate from the established project structure, code patterns, naming conventions, or architecture without explicit instruction.
- If something looks inconsistent with the current codebase, stop and check the existing files before introducing a new pattern.
- Match what already exists whenever possible.

### No Assumptions

- Never assume a requirement, pattern, or behavior if it is not supported by `AGENTS.md`, `README.md`, the relevant code, or the current prompt.
- If a requirement is genuinely unclear and risky, clarify instead of guessing.

### No Partial Fixes

- Fix the root cause, not just the visible symptom.
- If one fix causes another issue in scope, carry that fix through before stopping.
- Leave the touched area in a better state than you found it.

### Consistency Checks Before Finishing

Before marking a task complete, verify:

1. No TypeScript errors in the changed work.
2. No lint errors in the changed work.
3. No broken imports.
4. Everything touched still works with the rest of the codebase.
5. No unnecessary new patterns were introduced.

### Scope Control

- Only change what the task asks for.
- Do not silently refactor, rename, or restructure unrelated areas.
- If you notice something broken outside scope, flag it separately unless it directly blocks the requested task.

### Self Check Before Finishing

1. Does this fully solve what was asked?
2. Does it follow existing project patterns?
3. Is anything broken that was working before?
4. Is there any remaining 1% needed to make it truly complete?

## Final Path Mark 2

Use this section as the named completion path after `Final Path Mark 1`.

- `Final Path Mark 1` means the repository-side closeout work, scripts, governance paths, and documentation are in place.
- `Final Path Mark 2` means the real deployed environment has been proven end to end and the final live approval has been recorded.

Authoritative rule:

- The following `Full End-to-End Completion List` is the only list to use when judging true 100% completion for this repository.
- Use this same list in this chat, in later chats, and in any future completion discussion for this repository.
- Do not replace it with a shorter substitute list.
- Short summaries are allowed only if they clearly point back to this list as the source of truth.

### Full End-to-End Completion List

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
22. Confirm system-wide truth matches.
   Ensure `README.md`, the admin launch view, runtime state, and recorded release evidence all match exactly.

Completion rule:

- Only when all 22 items above are done should the platform be described as fully complete, fully live, and 100% end to end.

Recommended final live command order:

1. `npm run verify:launch-status`
2. `npm run verify:persistence-health`
3. `npm run verify:live-readiness`
4. `npm run verify:persistence-recovery`
5. `npm run verify:live-walkthrough`
6. `npm run verify:launch-signoff`
7. `npm run verify:launch-complete`

Completion language rule:

- If `Final Path Mark 1` is done but `Final Path Mark 2` is not, describe the platform as near-launch.
- Only describe the platform as fully complete when both marks are complete.

### 2026-06-21 truth-match guardrail

- Treat `npm run verify:live-truth-match` as part of the real launch proof path for item 22.
- The website now uses `/login` as the unified sign-in front door for students and admin; treat home **Log in**, auth callback errors, and signed-out protected-route redirects as part of item 2 live sign-in proof.
- Do not let manual governance records overrule a bad deployed runtime.
- If the deployed admin persistence API reports provisional storage, local-json, memory, or an ephemeral serverless path such as `/tmp/.codex-data`, keep item 22 open and describe the platform as near-launch.
- The admin runtime surface and governance API should reflect the active deployed persistence truth, not just the last manually recorded approval note.

### Final Path Mark 2 operator note from the June 21, 2026 live run

- In `oidc` mode, there is no separate built-in live admin account record to create inside the product.
- Treat live admin access as email-allowlist driven through `SWITCH_AUTH_ADMIN_EMAILS`.
- If the same live user should access editorial and admin surfaces, also include that same email in `SWITCH_AUTH_EDITOR_EMAILS`.
- Treat placeholder `SWITCH_LIVE_STUDENT_COOKIE` and `SWITCH_LIVE_ADMIN_COOKIE` values as incomplete for `Full End-to-End Completion List` item 14 even if manual live sign-in already works in the browser.
- The walkthrough runtime still requires real deployed `switch_auth_session=...` cookie values for both student and admin proof paths.
- The June 21, 2026 recorded live state was: `verify:live-readiness` passed, `verify:persistence-recovery` passed, `verify:live-walkthrough` failed on authenticated `/assessments` returning `500`, and `verify:launch-complete` failed downstream because walkthrough was still failing.
- Until that walkthrough and its dependent final steps pass, continue to describe the platform as `near-launch`.

### Final Path Mark 2 later June 21, 2026 evidence update

- A later June 21, 2026 live run then passed `verify:live-walkthrough`, `verify:launch-signoff`, and `verify:launch-complete`.
- Permanent command-output evidence for that later run is now stored in `release-evidence/2026-06-21-final-path-mark-2-local-live-check.md`.
- The placeholder sign-off owner names were later replaced in the local evidence path with `TF Solutions`, and the sign-off commands were rerun successfully.
- The final explicit item 22 truth-match check then found a remaining deployed-runtime mismatch: the live admin persistence API still reported `local-json` under `/tmp/.codex-data`, and the deployed governance overview still showed seeded `watch` review state.
- Do not overstate this as final true `100% completion` while that deployed admin/runtime mismatch still exists, even though the local live-check evidence bundle is stronger now.
- Use the evidence file as the current source of truth for what was actually captured in the later successful live run.

### Final Path Mark 2 later June 21, 2026 deployed-runtime repair update

- A later June 21, 2026 repair run moved the deployed persistence API onto `sqlite` with `storageBackend: vercel-blob`, `dataDirectory: vercel-blob://switch-live-data`, and `isEphemeralStorage: false`.
- The repo now includes a narrow `SWITCH_LAUNCH_VERIFICATION_SECRET` path for automated protected-route launch checks. Use it to verify deployed truth without replacing the main auth model.
- The blob-backed sqlite reader now checks metadata before attempting a byte read and prefers the real `BLOB_READ_WRITE_TOKEN` path before the fallback OIDC path, so the repo-side persistence wrapper is no longer the first unverified assumption in the deployed failure path.
- Do not treat that verification secret as a substitute for ordinary student or admin sign-in. It is a launch-automation path only.
- A direct production Blob SDK probe later confirmed the remaining blocker is platform-side: signed reads for `switch-live-data/switch-live.sqlite` fail with `BlobStoreSuspendedError`, even though the control plane still returns blob metadata.
- Even after the durable persistence repair, keep the platform label at `near-launch` until that suspended live Blob store is unsuspended or replaced with another real shared durable store, the deployed `dashboard`, `account`, `results`, `/api/dashboard/home`, and `/api/results/overview` routes stop failing under live verification, and the final walkthrough, sign-off, launch-complete, permanent evidence, and item 22 truth-match can all be rerun cleanly.

## Changes 1.0

Use this section as the current website mockup direction until a newer named change set replaces it.

### Changes 1.0 intent

- Streamline the website so it feels launch-ready, calmer, and easier to use.
- Keep the dashboard as the operational home for the student experience.
- Add planner-led structure without making the product feel crowded.
- Add weekly reports and FAQ/support surfaces as part of the main website direction.

### Changes 1.0 main website direction

- Keep the main student navigation focused on:
  - `Dashboard`
  - `Subjects`
  - `Practice`
  - `Progress`
  - `Planner`
- Keep `Account` and `Support` available but visually secondary to the main student workflow.
- Avoid large numbers of equal-weight dashboard cards.
- Prefer one strong primary action area, one planner area, one continue area, and one slim performance summary area.

### Changes 1.0 dashboard direction

- The dashboard should act as the working student home screen.
- The planner should be visible on the dashboard in weekly form, inspired by the provided weekly planner references.
- The planner should not dominate the full dashboard width unless explicitly prioritised later.
- The best current direction is:
  - hero greeting and daily focus
  - `Next Best Step`
  - integrated weekly planner
  - `Continue where you left off`
  - slim `Study Pulse` or `Power Grid` summary
- Prefer lists, rails, chips, and slim summaries over many large stacked cards.

### Changes 1.0 planner rules

- Use a weekly planner first, with optional monthly toggle.
- Keep event blocks rounded, soft, and colour-coded by study type or subject.
- Auto-linked study items should eventually come from exams, timed assessments, saved progress, and subject tasks through the API layer.
- Do not let the planner visually replace the exam engine, timed assessment, or saved progress modules.
- Treat the planner as the organising layer above the modules, not as a duplicate logic system.

### Changes 1.0 weekly reports direction

- Add a `Weekly Reports` page or section to summarise:
  - study time
  - assignments or practice completion
  - average score
  - focus areas by subject
- The weekly reports direction should be inspired by the provided report reference, but cleaner and more premium.
- The page should work for students first and also feel parent-readable.
- Use subject filter chips and weekly/monthly toggles only when they stay visually light.
- Avoid overcrowding the reports screen with too many chart types at once.

### Changes 1.0 FAQ/support direction

- Add a dedicated FAQ/support page with large rounded accordion rows.
- The FAQ direction should be inspired by the provided FAQ reference but aligned to The Switch visual language.
- Keep FAQ pages calm, spacious, and readable.
- Prefer a short intro, a clean accordion list, and one clear support CTA.
- Support content should remain signposting-first and should not pretend to be counselling or AI wellbeing support.

### Changes 1.0 page set to use for mockups and future design planning

- Homepage
- Dashboard with integrated planner
- Weekly Reports
- Subjects
- Practice
- FAQ / Support

### Changes 1.0 onboarding direction

- The product should include a guided sign-up and onboarding flow inspired by the supplied mobile signup references.
- The intended onboarding journey should include:
  - welcome and role entry
  - progressive step-based onboarding
  - school and year-group capture
  - qualification-path selection
  - subject selection
  - accessibility support question
  - SEND, access-arrangement, and support-path question flow
  - optional guardian invite
  - age-or-consent confirmation
  - first dashboard build after onboarding completion
- The website version can simplify the visuals, but it should preserve the same journey shape and data capture intent.
- Onboarding outcomes should shape the first dashboard, planner defaults, subject surfaces, and recommendation setup.
- The first dashboard should be built from what the learner picked during onboarding rather than starting as a generic one-size-fits-all home screen.
- Qualification, subject, accessibility, and support selections should directly shape dashboard content, planner defaults, saved progress setup, and recommendations.
- Use maintained UK school-source entry points when planning school lookup:
  - England: `https://www.get-information-schools.service.gov.uk/`
  - Scotland: `https://education.gov.scot/parentzone/find-a-school/`
  - Wales: `https://mylocalschool.gov.wales/`
  - Northern Ireland: `https://www.eani.org.uk/`

### Changes 1.0 later qualification expansion direction

- This is a later expansion note only and should not be added to the current active MVP list or active build-priority order unless explicitly reprioritised.
- Future qualification expansion should be handled by qualification family rather than treating every nation as one GCSE content bucket.
- Planned later-direction categories:
  - England GCSE
  - Wales GCSE
  - Northern Ireland GCSE
  - broader iGCSE coverage
  - Scotland as a separate qualification family
  - Republic of Ireland as a separate qualification family
- Rules for this later expansion:
  - do not describe Scottish qualification content as GCSE content
  - do not describe Republic of Ireland qualification content as GCSE content
  - keep nation and qualification selection explicit in onboarding and account setup
  - let dashboard, planner, recommendations, and content access adapt from the selected qualification route
  - only move these later-direction categories into active delivery when the current MVP and launch path can support the added content, routing, and quality-control load

### Changes 1.0 style directions approved for exploration

- `Launch Fit`
  - the cleanest and most balanced direction
  - best default for launch planning
- `Premium Editorial`
  - more mature and brand-led
  - suitable if a stronger trust and premium tone is wanted
- `App-First Planner`
  - stronger planner and habit-building identity
  - suitable only if the product should lean more heavily into planning behaviour

### Changes 1.0 recommendation

- Treat `Launch Fit` as the current best default direction.
- Keep planner, weekly reports, and FAQ in the product direction, but do not let them overload the first-screen dashboard experience.
- Use mockups to validate page hierarchy before implementing new UI patterns.

## Tooling Note

- The Codex-side `vercel-plugin` has been installed for this working environment.
- Treat Vercel as the primary current deployment platform during this session unless the user explicitly changes platform direction.
- Keep Google OIDC as the preferred auth-provider direction for `Full End-to-End Completion List` item 1 unless the user explicitly reprioritises auth strategy.
- Do not overwrite existing deployment or auth notes when adding newer guidance; append new Vercel-related notes cumulatively.

## Efficiency learning notes (operators and agents)

Plain English goal: **small live state, big stable rules, deep history only when needed.**

### What each file is for

- **`HANDOFF.md`** — the dashboard. What is active right now, what blocked, what is next. Always read first. Always update after each task.
- **`AGENTS.md`** — the rulebook. Architecture, priorities, completion standard, launch lists. Read when starting work or when unsure how to finish properly.
- **`README.md`** — the project diary and product spec. Cumulative history. Read the **Active build priority order**, **Free-tier launch workaround plan**, and relevant build-record entries — not the entire file every time.

### How to stay efficient (fewer tokens, less repetition)

1. **Before each action:** `HANDOFF.md` → `AGENTS.md` → only the **README sections** the handoff points to.
2. **During work:** one module, one priority item, one branch of tasks.
3. **After each action:** update `HANDOFF.md` Live session state in **short bullets** (what done, what next, blockers).
4. **README build record:** append **once per session or major milestone**, not after every single file edit.
5. **Do not** mark the platform 100% complete until `AGENTS.md` Full End-to-End Completion List item 22 passes in the real environment.

### Launch persistence — learning note

Student data on production must live in **one shared durable place**. Vercel Blob (`vercel-blob://...`) is the current production path. If Blob is suspended, protected routes fail even when auth tokens are correct. See **README.md → Free-tier launch workaround plan** for fix order: unsuspend/recreate Blob first, then disk host, then future Turso adapter.

## Documentation Rule

- Keep workspace references aligned on `THE SWITCH 3` across `AGENTS.md`, `README.md`, `HANDOFF.md`, `PROJECT_RECOVERY.md`, and `RESTORED_CHATS.md`.
- When a source-of-truth or recovery path is mentioned, name `THE SWITCH 3` explicitly and use `/Users/lloydnwagbara/Documents/THE SWITCH 3` as the active folder path.
- Treat `HANDOFF.md` as the live session handoff file between Cursor and Codex.
- At session start, tell the agent: **Read HANDOFF.md first**.
- Before each action, consult `HANDOFF.md`, `AGENTS.md`, and `README.md` priorities.
- After each action, update the **Live session state** section in `HANDOFF.md`.
- At session end, update **Live session state** again if anything changed since the last action update.
- Treat `.cursor/rules/` as active Cursor enforcement — not optional setup.
- When adding new project truth, recovery notes, deployment notes, architecture notes, auth notes, or completion notes, append them to `README.md` and `AGENTS.md`.
- Do not overwrite earlier records unless the earlier content is genuinely wrong or obsolete and the replacement is stated explicitly.
- Prefer cumulative history over replacement history.
- When a feature or launch issue is explained, add a plain-English explanation as well as any technical note.
- When a workflow is hard to follow, add a simple diagram in `README.md` if it helps the next session or operator understand the path faster.

## Current Auth Learning Note

- The live auth path and the preview auth path can look similar in the account UI, so future sessions should verify the active runtime mode before claiming the real sign-in path is complete.
- A signed-in preview session can still show a provider label such as `google`, but that does not by itself prove a real external Google identity round-trip happened.
- The real live auth goal is: deployed runtime in `oidc` mode, full provider block present, redirect callback succeeds, session is created, sign-out works, and protected routes behave correctly.
- Microsoft support is now a first-class live path alongside Google when the full `SWITCH_OIDC_MICROSOFT_*` block is configured.
- Use `npm run setup:microsoft-oauth-live` and `npm run verify:microsoft-oauth-live` for operator setup and proof.
- Plain-English operator guide: `docs/MICROSOFT_OAUTH_LIVE.md` and in-product route `/login/microsoft-guide`.
- In live `oidc` mode, admin access is currently derived from mapped roles on the signed-in email address, with `SWITCH_AUTH_ADMIN_EMAILS` and `SWITCH_AUTH_EDITOR_EMAILS` acting as the current role-allowlist boundary.
- Prefer one main sign-in path with role-based admin access over two disconnected student/admin login systems unless the user explicitly reprioritises the auth architecture.
- If a future task introduces a true email-and-password admin login, treat it as a separate auth hardening deliverable rather than a small UI tweak.
- Do not describe a password-first admin path as complete unless it includes secure password hashing, account recovery, role-protected admin routing, abuse protection, and tests proving both valid admin access and blocked student access.
