# The Switch Platform Mark 3.2

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

1. Read `AGENTS.md` at the root and any relevant nested agent override files if they exist.
2. Read `README.md` and any relevant local markdown documentation for the area being changed.
3. Check key configuration files such as `package.json`, `tsconfig.json`, and any relevant framework config.
4. Stay consistent with the existing codebase structure, naming, and architecture.

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

- Treat the current pushed project baseline as including the full audit and launch completion plan, final-path and local preview auth documentation, Netlify deploy config, onboarding and school-source documentation, later qualification expansion notes, launch script environment loading, timed-assessment normalization hardening, persistence-script test coverage, the repo-managed auto-push hook, and the README/AGENTS git workflow rules.
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
2. `npm run verify:live-readiness`
3. `npm run verify:persistence-recovery`
4. `npm run verify:live-walkthrough`
5. `npm run verify:launch-signoff`
6. `npm run verify:launch-complete`

Completion language rule:

- If `Final Path Mark 1` is done but `Final Path Mark 2` is not, describe the platform as near-launch.
- Only describe the platform as fully complete when both marks are complete.

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

## Exact User-Posted Addition

The following block is appended exactly as provided by the user:

```text
# The Switch Platform Mark 3.2

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

## Project Context

- Name: `the-switch-platform`
- Root: `/Users/lloydnwagbara/Documents/THE SWITCH 3`
- Type: Next.js web app with internal API layer and modular service backend
- Stack: TypeScript, React 19, Next.js 15 App Router, Tailwind CSS 3, Node.js, npm
- Status: MVP in progress, not fully built, partially seed-driven, not production-complete
- Build priority: Exam Engine, Power Grid, Saved Progress, Read Aloud, Dashboard, Timed Assessments, Full GCSE Exams, Results, Recommendations, Accessibility, Access Arrangements foundation

## Architecture

- `src/app`: website pages and layouts
- `src/app/api`: API layer used by the website and future clients
- `src/modules`: core business logic by feature
- `src/lib`: shared server, repository, API, and persistence utilities
- `src/components`: UI components
- `src/data`: seeded catalog and support data
- `tests`: Node test suite
- `scripts`: smoke, release, and persistence tooling

## Core Rules

- Keep modules independent
- Do not place business logic only in the frontend
- Use API routes between UI and services
- Saved progress must autosave
- Accessibility-first and mobile-first
- Keep access arrangements framework-neutral and separate from exam logic
- Treat the current system as incomplete unless explicitly verified in code

## Key Files Codex Should Load First

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

## Full Audit Summary

- App structure exists and is modular
- Internal API layer exists
- Major product modules exist
- Seed content exists
- Tests exist and currently pass with `npm test` (`46/46`)
- Project is not fully complete
- No formal DB schema or migration framework found
- No `.env.example` found
- `npm run type-check` is not currently runnable in this workspace because `tsc` is missing
- Some runtime modes are still provisional or preview-only
- Some modules are implemented but still rely on mock or seed data rather than full production-backed flows

## What Is Not Fully Built Yet

- Production-ready auth configuration
- Production-ready persistence configuration
- Formal database schema and migrations
- Fully documented environment setup
- Fully live CMS and editorial publishing path in all runtimes
- Replacement of seeded and mock data with live-backed data sources
- Full end-to-end production verification across high-priority modules

## Files Likely Needed To Complete The Project

- `README.md`
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `src/app/api/**`
- `src/modules/exam-engine/**`
- `src/modules/power-grid/**`
- `src/modules/saved-progress/**`
- `src/modules/read-aloud/**`
- `src/modules/dashboard/**`
- `src/modules/timed-assessment/**`
- `src/modules/results/**`
- `src/modules/recommendations/**`
- `src/modules/accessibility/**`
- `src/modules/access-arrangements/**`
- `src/modules/auth/**`
- `src/modules/content/**`
- `src/modules/cms/**`
- `src/lib/persistence/**`
- `src/lib/server/**`
- `src/data/**`
- `tests/**`
- `scripts/**`
- Missing file to add: `.env.example`
- Missing system to add if moving to DB-backed persistence: formal schema and migration source

## Codex Working Assumptions

- Assume incomplete until file-level verification proves otherwise
- Read existing module and service files before changing behavior
- Preserve module boundaries
- Do not present preview or provisional paths as production-ready
- Prioritize highest-priority modules first when completing features
- Check `src/modules`, `src/app/api`, `src/lib/persistence`, `tests`, and `README.md` first when tracing gaps

## Ignore

- `node_modules/`
- `.git/`
- `.next/`
- `dist/`
- `build/`
- `__pycache__/`
- `venv/`
- lockfiles
## CRITICAL RULE — READ THIS FIRST, ALWAYS

Before doing ANY work in this repository — writing code, creating files,
editing files, refactoring, anything — you MUST first:

1. Check for and read any AGENTS.md
2. # The Switch Platform Mark 3.2

## CRITICAL RULE — READ THIS FIRST, ALWAYS

Before doing ANY work in this repository — writing code, creating files,
editing files, refactoring, anything — you MUST first:

1. Check for and read any AGENTS.md (or AGENTS.override.md) files at the
   project root and in any relevant subdirectories.
2. Check for and read any existing documentation: README.md,Files Likely Needed To Complete The Project list
    and any *.md files in the directory you're working in.
4. stay within consiestant codebase ensure at priority it remains consiestant .
5. Check configuration files (package.json, tsconfig.json, etc.) to
   understand project setup and constraints.

## Completion Standard — NON-NEGOTIABLE

- Every task must be completed to 100% before moving on to the next.
- You cannot move on if anything is broken, incomplete, or partially done.
- If an error or bug is found at any point, stop and fix it immediately
  before continuing — do not defer, skip, or log it for later.
- Do not consider a task done until it builds, runs, and works correctly
  end to end.

## Project Alignment

- Never deviate from the established project structure,CODE, naming conventions,
  or architecture patterns already present in the codebase.
- If something looks inconsistent with the existing structure, stop and
  check AGENTS.md and existing files before proceeding — do not invent
  new patterns.
- When in doubt, match what already exists. Do not introduce new libraries,
  folders, patterns, or conventions without explicit instruction.
## No Assumptions

- Never assume a requirement, pattern, or behaviour — if it is not explicitly
  stated in AGENTS.md,Files Likely Needed To Complete The Project, the codebase, or the current prompt, ask before acting.
- Never guess at intent. Unclear instruction = stop and clarify, not proceed
  and hope.

## No Partial Fixes

- Do not fix symptoms — fix the root cause.
- If fixing one thing breaks another, fix that too before stopping.
- Leave the codebase in a better state than you found it, never worse.

## Consistency Checks — Run Before Every Commit

Before marking any task complete, verify:
1. No TypeScript errors
2. No lint errors
3. No broken imports
4. Everything touched in this task still works with the rest of the codebase
5. No new patterns introduced that don't already exist in the project

## Scope Control

- Only change what the task asks for. Do not refactor, rename, or restructure
  anything outside the scope of the current task.
- If you notice something broken outside the current scope, flag it as a
  separate task — do not silently fix it and do not ignore it.

## Self Check Before Finishing

Before reporting a task as done, ask yourself:
1. Does this fully solve what was asked?
2. Does it follow existing project patterns exactly?
3. Is anything broken that was working before?
4. Is there anything left at 99% that needs that final 1%?
5. if there is something needed add it to agents create prompt when change is needed.
6.
```

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

## Documentation Rule

- When adding new project truth, recovery notes, deployment notes, architecture notes, auth notes, or completion notes, append them to `README.md` and `AGENTS.md`.
- Do not overwrite earlier records unless the earlier content is genuinely wrong or obsolete and the replacement is stated explicitly.
- Prefer cumulative history over replacement history.
- When a feature or launch issue is explained, add a plain-English explanation as well as any technical note.
- When a workflow is hard to follow, add a simple diagram in `README.md` if it helps the next session or operator understand the path faster.

## Current Auth Learning Note

- The live auth path and the preview auth path can look similar in the account UI, so future sessions should verify the active runtime mode before claiming the real sign-in path is complete.
- A signed-in preview session can still show a provider label such as `google`, but that does not by itself prove a real external Google identity round-trip happened.
- The real live auth goal is: deployed runtime in `oidc` mode, full provider block present, redirect callback succeeds, session is created, sign-out works, and protected routes behave correctly.
- Microsoft support has now been added in code alongside Google, Apple, and Email Magic Link provider slots.
- In live `oidc` mode, admin access is currently derived from mapped roles on the signed-in email address, with `SWITCH_AUTH_ADMIN_EMAILS` and `SWITCH_AUTH_EDITOR_EMAILS` acting as the current role-allowlist boundary.
- Prefer one main sign-in path with role-based admin access over two disconnected student/admin login systems unless the user explicitly reprioritises the auth architecture.
- If a future task introduces a true email-and-password admin login, treat it as a separate auth hardening deliverable rather than a small UI tweak.
- Do not describe a password-first admin path as complete unless it includes secure password hashing, account recovery, role-protected admin routing, abuse protection, and tests proving both valid admin access and blocked student access.
