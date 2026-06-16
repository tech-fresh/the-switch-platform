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

Do not describe the platform as fully complete unless all of the following are true in the real target environment:

1. The intended live sign-in path has been proven with callback, session, sign-out, and protected-route evidence.
2. The live student-data path has been proven for saved progress, results, account-linked settings, backup, restore, and recovery.
3. The live editorial workflow is the real review, approval, publish, rollback, and blocked-content path.
4. The final live route walkthrough has passed across dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin.
5. Governance evidence has been recorded for auth, persistence, editorial mode, smoke checks, and walkthrough outcomes.
6. Privacy, safeguarding, support, incident ownership, and release approval have named real owners recorded against the environment.
7. The final launch command sequence has been run and stored as the permanent release record.
8. `README.md`, the admin launch view, runtime truth, and release evidence all match each other.

Recommended final live command order:

1. `npm run verify:live-readiness`
2. `npm run verify:persistence-recovery`
3. `npm run verify:live-walkthrough`
4. `npm run verify:launch-signoff`
5. `npm run verify:launch-complete`

Completion language rule:

- If `Final Path Mark 1` is done but `Final Path Mark 2` is not, describe the platform as near-launch.
- Only describe the platform as fully complete when both marks are complete.

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
