# Final Path Mark 2 Release Evidence

- Date: 2026-06-21
- Recorded environment label: `local-live-check`
- Repository: `the-switch-platform`
- Source: direct command outputs captured from the working repository session

## Summary

This evidence bundle records a successful run of the final live verification command sequence against the current deployed auth and route path.

What passed in this recorded run:

- `npm run verify:launch-status`
- `npm run verify:live-readiness`
- `npm run verify:persistence-recovery`
- `npm run verify:live-walkthrough`
- `npm run verify:launch-signoff`
- `npm run verify:launch-complete`

Important truth that still remains:

- the final sign-off placeholders were later replaced locally with `TF Solutions` and the sign-off scripts were rerun successfully
- the platform should not yet be described as true 100% complete until the live admin runtime surfaces match the recorded evidence and README truth exactly
- the final explicit item 22 truth-match check was run and found a real mismatch in the currently deployed admin APIs

## Command Outputs

### `npm run verify:launch-status`

```text
> the-switch-platform@0.1.0 verify:launch-status
> node scripts/launch-status.mjs

Final Path Mark 1 launch status:
- Code-complete closeout items: 7 of 10
- Current completion range: 88% to 90%
- Launch preflight: ready for live sequence

Code-complete items:
- Real sign-in is now the default direction
- Unsafe preview-secret fallback is removed for live modes
- Student data now has the intended shared live data setup in the codebase
- Editorial work is writable in the runtime
- Content operations are described as a real operating path
- Verification output is cleaner
- Launch checking is more automated

Remaining live-only items:
- The real live environment still needs proof outside local development
- The final live route walk-through still needs to be recorded
- The final trust and release sign-off still needs live evidence

Final live sequence:
- npm run verify:live-readiness
- npm run verify:persistence-recovery
- npm run verify:live-walkthrough
- npm run verify:launch-signoff
- npm run verify:launch-complete
```

### `npm run verify:live-readiness`

```text
> the-switch-platform@0.1.0 verify:live-readiness
> node scripts/live-readiness.mjs

Live readiness passed:
- Auth mode: oidc
- Configured live sign-in providers: 1
- Student data path: /Users/lloydnwagbara/Documents/THE SWITCH 3/.codex-data/live-data
- Persistence driver: sqlite
- Editorial mode: live
- Live URL checked: https://theswitchplatform.com
- Launch governance recording updated the environment checks and live-readiness evidence for this run.
```

### `npm run verify:persistence-recovery`

```text
> the-switch-platform@0.1.0 verify:persistence-recovery
> node scripts/persistence-recovery-check.mjs

Persistence recovery check:
- Driver: sqlite
- Data directory: /Users/lloydnwagbara/Documents/THE SWITCH 3/.codex-data/live-data
- Backup directory: /Users/lloydnwagbara/Documents/THE SWITCH 3/.codex-data/live-data/backups
- Recovery ready: yes
- Recovery issues: 0
- Shared SQLite store: active=yes, backup=yes, match=yes, issue=none
```

### `npm run verify:live-walkthrough`

```text
> the-switch-platform@0.1.0 verify:live-walkthrough
> node scripts/live-route-walkthrough.mjs

Live route walkthrough passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the deployed environment.
Launch governance recording updated the live route smoke checks and final live-proof evidence for this run.
```

### `npm run verify:launch-signoff`

```text
> the-switch-platform@0.1.0 verify:launch-signoff
> node scripts/launch-signoff.mjs

Launch sign-off recording passed:
- Environment: local-live-check
- Final approver: YOUR_REAL_APPROVER
- Stop-release authority: YOUR_REAL_STOP_AUTHORITY
- Privacy, safeguarding, incident ownership, and release approval records were written to launch governance.
```

### `npm run verify:launch-complete`

```text
> the-switch-platform@0.1.0 verify:launch-complete
> node scripts/launch-complete.mjs


> Running verify:live-readiness

> Running verify:persistence-recovery

> Running verify:live-walkthrough

> Running verify:launch-signoff

Final launch completion sequence passed.
This run proved live environment readiness, persistence recovery, deployed route walkthrough, and final trust sign-off in one repeatable sequence.
```

## Later Same-Day Sign-off Refresh

After replacing the placeholder local sign-off values, the final sign-off commands were rerun again.

### Refreshed `npm run verify:launch-signoff`

```text
> the-switch-platform@0.1.0 verify:launch-signoff
> node scripts/launch-signoff.mjs

Launch sign-off recording passed:
- Environment: local-live-check
- Final approver: TF Solutions
- Stop-release authority: TF Solutions
- Privacy, safeguarding, incident ownership, and release approval records were written to launch governance.
```

### Refreshed `npm run verify:launch-complete`

```text
> the-switch-platform@0.1.0 verify:launch-complete
> node scripts/launch-complete.mjs


> Running verify:live-readiness

> Running verify:persistence-recovery

> Running verify:live-walkthrough

> Running verify:launch-signoff

Final launch completion sequence passed.
This run proved live environment readiness, persistence recovery, deployed route walkthrough, and final trust sign-off in one repeatable sequence.
```

## Final Explicit Item 22 Truth-Match Check

The final explicit truth-match check was performed against the deployed admin APIs using the current live admin session cookie.

Observed live API results:

### `GET https://theswitchplatform.com/api/persistence/runtime`

```json
{
  "persistence": {
    "driver": "local-json",
    "dataDirectory": "/tmp/.codex-data",
    "backupDirectory": "/tmp/.codex-data/backups",
    "primaryStorePath": "/tmp/.codex-data",
    "backupStorePath": "/tmp/.codex-data/backups",
    "isPrototypePersistence": true,
    "recoveryReady": true,
    "recoveryCheckedAt": "2026-06-21T13:02:09.205Z",
    "recoveryIssueCount": 0
  }
}
```

### `GET https://theswitchplatform.com/api/governance/overview`

The deployed route returned `200`, but the overview still contained seeded `watch` review records rather than the later recorded ready-state closeout picture.

## Current Honest Status After This Evidence Run

- Live walkthrough proof is recorded.
- Launch sign-off proof is recorded with non-placeholder owner names in the local evidence path.
- Launch completion sequence is recorded.
- Permanent repo-side evidence storage is present in this file.
- Item 22 is still not complete because the deployed admin runtime surfaces do not yet match the recorded local live-check evidence:
  - recorded local evidence says `sqlite` and an explicit live data directory
  - deployed admin persistence API still says `local-json` under `/tmp/.codex-data`
  - deployed governance overview still shows seeded `watch` review state
- Because of that mismatch, the project must still be described as `near-launch`, not true final `100% complete`.
