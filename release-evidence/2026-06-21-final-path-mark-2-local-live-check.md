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

- the recorded sign-off output still used placeholder owner values for final approver and stop-release authority
- the platform should not yet be described as true 100% complete until named real-world ownership and full system-wide truth matching are confirmed
- the admin runtime view previously shown in the live site still needs to be checked against the final runtime and evidence state so item 22 can be called complete honestly

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

## Current Honest Status After This Evidence Run

- Live walkthrough proof is now recorded.
- Launch completion sequence is now recorded.
- Permanent repo-side evidence storage is now present in this file.
- Real owner placeholders still need replacement before true final live approval can be described as complete.
- README, admin runtime view, runtime state, and recorded evidence still need one final explicit truth-match check before the platform can be described as fully complete and 100% end to end.
