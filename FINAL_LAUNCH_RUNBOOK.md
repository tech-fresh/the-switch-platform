# Final Launch Runbook

This file is the operator checklist for the live-only part of `Final Path Mark 1`.

Use it after the repo-side code work is complete.

Do not mark the platform fully complete until every required item below is done in the real deployed environment.

## Current Truth

- Code-side closeout is complete in the repo.
- Live-only closeout is still required.
- The remaining live-only items are:
  - real live environment proof
  - final live route walkthrough
  - final trust and release sign-off

## Before You Start

1. Confirm the target environment name you will record in governance.
2. Confirm the real launch approver.
3. Confirm the real stop-release authority.
4. Confirm which live auth mode is active:
   - `oidc`
   - `external-header`
5. Confirm you have the real live credentials or trusted headers required for that mode.

## Quick Status

Run:

```bash
npm run verify:launch-status
```

Use this to see:

- code-complete closeout items
- remaining live-only items
- missing launch inputs
- the final command order

## Live Input Checklist

Fill these before the final run:

### Core live runtime

- `SWITCH_AUTH_MODE`
- `SWITCH_AUTH_SECRET`
- `SWITCH_PERSISTENCE_DRIVER=sqlite`
- `SWITCH_DATA_DIRECTORY`
- `SWITCH_CMS_BACKEND_MODE=live`
- `SWITCH_LIVE_BASE_URL`
- `SWITCH_RECORD_GOVERNANCE=1`
- `SWITCH_GOVERNANCE_ENVIRONMENT`

### Final approval inputs

- `SWITCH_LAUNCH_APPROVER`
- `SWITCH_LAUNCH_STOP_AUTHORITY`
- `SWITCH_GOVERNANCE_PRIVACY_REVIEW_NOTE`
- `SWITCH_GOVERNANCE_SAFEGUARDING_REVIEW_NOTE`
- `SWITCH_GOVERNANCE_RELEASE_REVIEW_NOTE`
- `SWITCH_GOVERNANCE_PRIVACY_SIGNOFF_NOTE`
- `SWITCH_GOVERNANCE_SAFEGUARDING_SIGNOFF_NOTE`
- `SWITCH_GOVERNANCE_ALERTS_SIGNOFF_NOTE`
- `SWITCH_GOVERNANCE_INCIDENT_SIGNOFF_NOTE`
- `SWITCH_GOVERNANCE_RELEASE_SIGNOFF_NOTE`

### If live auth mode is `oidc`

- `SWITCH_AUTH_BASE_URL`
- one full OIDC provider block
- `SWITCH_LIVE_STUDENT_COOKIE`
- `SWITCH_LIVE_ADMIN_COOKIE`

### If live auth mode is `external-header`

- `SWITCH_EXTERNAL_AUTH_HEADER_SECRET`
- `SWITCH_LIVE_STUDENT_USER_ID`
- `SWITCH_LIVE_STUDENT_DISPLAY_NAME`
- `SWITCH_LIVE_STUDENT_EMAIL`
- `SWITCH_LIVE_ADMIN_USER_ID`
- `SWITCH_LIVE_ADMIN_DISPLAY_NAME`
- `SWITCH_LIVE_ADMIN_EMAIL`

## Dry Run

Run:

```bash
SWITCH_LAUNCH_COMPLETE_DRY_RUN=1 npm run verify:launch-complete
```

Expected result:

- command order is shown
- preflight readiness is shown
- missing inputs are listed clearly if anything is missing

Do not continue until the dry run is clean or the missing inputs are understood.

## Final Live Sequence

Run these in order, or use the orchestration command:

```bash
npm run verify:blob-health
npm run verify:live-readiness
npm run verify:persistence-recovery
npm run verify:live-walkthrough
npm run verify:launch-signoff
npm run verify:live-truth-match
```

Or:

```bash
npm run verify:launch-complete
```

## If Vercel Blob Is Suspended

When `npm run verify:blob-health` reports `suspended`:

1. Open the Vercel project Storage / Blob settings for the live store backing `SWITCH_DATA_DIRECTORY`.
2. Unsuspend the store **or** create a replacement store and update:
   - `BLOB_READ_WRITE_TOKEN`
   - `SWITCH_DATA_DIRECTORY` (for example `vercel-blob://switch-live-data`)
3. Seed or restore the sqlite file:
   - `npm run persistence:migrate-to-sqlite` for a fresh seed, or
   - `npm run persistence:restore-from-backup` when a valid backup exists
4. Rerun the full final live sequence above.

Do not describe the platform as fully complete while Blob byte reads still fail.

## Free alternative hosts (no Blob)

If Vercel Blob cannot be restored, deploy the same repo to a host with **persistent disk** and set:

```bash
SWITCH_PERSISTENCE_DRIVER=sqlite
SWITCH_DATA_DIRECTORY=/var/data
```

Render and Fly.io are documented in `README.md` → **Free-tier launch workaround plan**. No repo code change required for filesystem sqlite.

## Evidence To Confirm

### 1. Live environment proof

Confirm and record:

- real sign-in mode is active
- live sign-in secret is active
- callback base URL is correct
- protected routes behave correctly
- live persistence path is correct
- live CMS mode is writable

### 2. Live persistence proof

Confirm and record:

- backup path exists
- recovery check passes
- student data path is the intended live path
- restore behavior is proven where required by the release process

### 3. Live route walkthrough proof

Confirm and record:

- `/dashboard`
- `/subjects`
- `/assessments`
- `/exams`
- `/saved-progress`
- `/results`
- `/account`
- `/support`
- `/admin`

Also confirm:

- student continuity
- role protection
- editorial control visibility
- blocked content handling where applicable

### 4. Final trust and approval proof

Confirm and record:

- privacy and retention review
- safeguarding and support review
- release approval review
- privacy sign-off
- safeguarding sign-off
- alerts and recovery sign-off
- incident ownership sign-off
- final release approval sign-off

## Completion Rule

The platform is only fully complete when all of these are true at the same time:

1. README, admin launch view, and launch status tell the same story.
2. Real sign-in is the deployed release path.
3. Preview sign-in is not being used as launch proof.
4. Student data runs on the intended live setup.
5. Backup, restore, and recovery are proven for live student data.
6. Editorial review and publishing run through the real live workflow.
7. Content and paper update paths are real operating paths.
8. Launch governance reflects real evidence and real sign-off.
9. Release automation proves local confidence and live readiness honestly.
10. The live environment has passed the full final route walkthrough.
11. Privacy, safeguarding, support, ownership, and release approval are all confirmed live.

If any one of those is still missing, the platform stays `near-launch`, not `fully complete`.
