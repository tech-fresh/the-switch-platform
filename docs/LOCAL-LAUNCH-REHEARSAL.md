# Local Launch Rehearsal

Plain English: this is the one documented order for proving the MVP still boots, serves routes, and rehearses student continuity on a fresh checkout — without reopening Priority A live-truth evidence.

## Core order (one command)

Run the full core chain:

```bash
npm run verify:local-launch-readiness
```

That command runs, in order:

| Step | Command | What it proves |
| --- | --- | --- |
| 1 | `npm run lint` | Core scripts, auth defaults, launch routes, and environment examples are present |
| 2 | `npm run type-check` | Next route types and the TypeScript surface compile cleanly |
| 3 | `npm run build` | The rehearsal dist builds without route or type failures |
| 4 | `npm run test` | Module logic, MVP route contracts, and primary CTA link checks pass |
| 5 | `npm run test:smoke` | Canonical MVP pages, public APIs, and signed-out protection respond without 500s |
| 6 | `npm run test:e2e` | Student routes, exam autosave/resume, admin access, and sign-out behave in preview runtime |

Source of truth for this list: `scripts/local-launch-rehearsal-order.mjs`.

## Direct step-by-step order

When debugging one failing layer, run the same steps individually:

```bash
npm run lint
npm run type-check
npm run build
npm run test
npm run test:smoke
npm run test:e2e
```

## Extended MVP rehearsals

After the core order passes, run these when hardening a release or closing a usability area:

```bash
npm run test:route-clickability
npm run test:exam-assessment-rehearsal
npm run test:continuity-rehearsal
npm run test:auth-account-rehearsal
npm run test:support-recovery-rehearsal
```

Each extended script needs `npm run build` first because they start a local production Next server through `scripts/launch-utils.mjs`.

## Runtime notes

- Rehearsal builds use `.next-rehearsal` via `SWITCH_NEXT_DIST_DIR`.
- Local servers bind to `127.0.0.1` so sandboxed and CI environments do not need host network enumeration.
- Readiness probes wait for `/`, `/api/auth/providers`, `/api/account/overview`, and `/api/dashboard/home` to stop returning 500 before smoke or e2e continue.
- Preview auth uses `SWITCH_AUTH_MODE=preview-cookie` inside the smoke and e2e scripts only.

## Related docs

- `docs/ideas/MVP-USABILITY-LAUNCH-READINESS-PLAN.md` — Area 1 boot stability and Area 7 rehearsal tooling
- `HANDOFF.md` — live session state and blockers
- `PLATFORM-GUIDE.md` — launch verification commands for production truth
