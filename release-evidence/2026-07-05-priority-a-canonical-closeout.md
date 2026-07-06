# Priority A canonical closeout — 2026-07-05

Live host: https://theswitchplatform.com
Workspace: `/Users/lloydnwagbara/Documents/THE SWITCH 3`

## Purpose

This is the **canonical** Priority A release-evidence bundle for **A-6** and **A-8**.

It supersedes partial/interim records for closeout purposes. Historical evidence remains in:

- `release-evidence/2026-06-23-final-path-mark-2-item-22-complete.md` (historical — Mark 2 item 22)
- `release-evidence/2026-06-25-priority-a-truth-audit.md` (interim truth audit — superseded by this file)

## Referenced browser-authenticated proofs (still valid)

From `release-evidence/2026-06-25-priority-a-truth-audit.md`:

- **A-1** real Google OIDC sign-in on production
- **A-3** real sign-out and protected-route lockout
- **A-4** real 8-step learner onboarding through the browser
- **A-5** Fly production persistence recovery on `/data`

## Supportive regression proof kept outside the strict closeout chain

- `npm run verify:live-onboarding` remains a useful API-assisted onboarding regression check.
- It is **not** counted as part of the strict A-4 real-auth proof inside this canonical bundle because it uses launch-verification headers to simulate a fresh learner.

## Run metadata

- Generated: 2026-07-05T22:30:06.529Z
- Strict real-auth closeout steps: `SWITCH_LAUNCH_VERIFICATION_SECRET` blanked
- Fly persistence delegate: `fly ssh console -a the-switch-platform -C "sh -lc 'cd /app && node scripts/persistence-recovery-check.mjs'"`
- Fly sign-off delegate: `fly ssh console -a the-switch-platform -C "sh -lc 'cd /app && node scripts/launch-signoff.mjs'"`


## verify:check-live-cookies

```text
> the-switch-platform@0.1.0 verify:check-live-cookies
> node scripts/check-live-auth-cookies.mjs

Live auth cookie check: https://theswitchplatform.com
Auth mode: oidc
- student: ok (lloydnwag@gmail.com, roles=admin,student)
- admin: ok (theswitchengine@gmail.com, roles=editor,admin,student)
Live auth cookies are valid for real-auth closeout.
```

## verify:launch-status

```text
> the-switch-platform@0.1.0 verify:launch-status
> node scripts/launch-status.mjs

Final Path Mark 1 launch status:
- Code-complete closeout items: 7 of 10
- Current completion range: historical closeout recorded; use the live sequence below to refresh evidence for a new release.
- Launch preflight: ready for live sequence

Code-complete items:
- Real sign-in is now the default direction
- Unsafe preview-secret fallback is removed for live modes
- Student data now has the intended shared live data setup in the codebase
- Editorial work is writable in the runtime
- Content operations are described as a real operating path
- Verification output is cleaner
- Launch checking is more automated

Historical closeout status:
- The 26 June 2026 Fly production closeout is already recorded.
- Use the live sequence below to refresh production evidence after a new deploy or release change.

Final live sequence:
- npm run verify:persistence-health
- npm run verify:live-readiness
- npm run verify:persistence-recovery
- npm run verify:live-oidc-proof
- npm run verify:live-walkthrough:real-auth
- npm run verify:launch-signoff
- npm run verify:launch-complete
```

## verify:launch-complete (full final sequence)

```text
> the-switch-platform@0.1.0 verify:launch-complete
> node scripts/launch-complete.mjs


> Running verify:persistence-health

> Running verify:live-readiness

> Running verify:persistence-recovery

> Running verify:live-walkthrough:real-auth

> Running verify:live-truth-match

> Running verify:launch-signoff

> Running verify:live-oidc-proof

Final launch completion sequence passed.
This run proved live environment readiness, persistence recovery, deployed route walkthrough, and final trust sign-off in one repeatable sequence.
```

## verify:live-truth-match (item 22 / A-8 explicit rerun)

```text
> the-switch-platform@0.1.0 verify:live-truth-match
> node scripts/live-truth-match.mjs

Live truth-match passed:
- Persistence driver checked: sqlite
- Persistence path checked: /data
- Governance overall status: ready
- Admin runtime and governance evidence now reflect the same live launch state.
```

## Onboarding proof note

The strict canonical closeout relies on the browser-authenticated **A-4** evidence recorded in `release-evidence/2026-06-25-priority-a-truth-audit.md`.

`npm run verify:live-onboarding` is kept as useful API-assisted regression coverage for the onboarding module, but it is **not** counted as part of the strict real-auth closeout chain.


## verify:live-onboarding (API-assisted regression — not strict A-4)

Evidence class: synthetic/API-assisted only.

**FAILED** — this does not invalidate A-4 browser proof or the strict closeout above.

```text
verify:live-onboarding (API-assisted regression) failed with exit code 1

> the-switch-platform@0.1.0 verify:live-onboarding
> node scripts/verify-live-onboarding.mjs

Live onboarding regression target: https://theswitchplatform.com
Proof learner user id: onboarding-live-proof-1783290759877
Checking signed-out /onboarding redirect...
Checking fresh learner onboarding overview...
Checking Seneca-style onboarding page...
file:///Users/lloydnwagbara/Documents/THE%20SWITCH%203/scripts/launch-utils.mjs:275
          throw new Error(
                ^

Error: Timed out after 45000ms waiting for https://theswitchplatform.com/onboarding. If Fly auto-stopped the machine, open https://theswitchplatform.com/onboarding in a browser first or run: fly machines start -a the-switch-platform
    at fetchWithRetry (file:///Users/lloydnwagbara/Documents/THE%20SWITCH%203/scripts/launch-utils.mjs:275:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async fetchText (file:///Users/lloydnwagbara/Documents/THE%20SWITCH%203/scripts/launch-utils.mjs:228:20)
    at async file:///Users/lloydnwagbara/Documents/THE%20SWITCH%203/scripts/verify-live-onboarding.mjs:121:24

Node.js v24.16.0
```

## Closeout status

- **A-6** canonical bundle: **COMPLETE**
- **A-8** truth-match rerun: **COMPLETE**

## If cookie check failed

1. Sign in on https://theswitchplatform.com/login (student, then admin).
2. Copy `switch_auth_session` values into `.env.local`.
3. Guide: https://theswitchplatform.com/account/live-cookie-guide
4. Re-run:

```bash
npm run verify:priority-a-closeout
```

