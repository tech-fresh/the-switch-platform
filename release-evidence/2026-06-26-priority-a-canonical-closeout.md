# Priority A canonical closeout — 2026-06-26

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

- Generated: 2026-06-26T01:14:54.726Z
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
- admin: ok (lloydnwag@gmail.com, roles=admin,student)
Live auth cookies are valid for real-auth closeout.

npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

## verify:launch-status

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
- npm run verify:persistence-health
- npm run verify:live-readiness
- npm run verify:persistence-recovery
- npm run verify:live-oidc-proof
- npm run verify:live-walkthrough:real-auth
- npm run verify:launch-signoff
- npm run verify:launch-complete

npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
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

npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
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

npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

## Onboarding proof note

The strict canonical closeout relies on the browser-authenticated **A-4** evidence recorded in `release-evidence/2026-06-25-priority-a-truth-audit.md`.

`npm run verify:live-onboarding` is kept as useful API-assisted regression coverage for the onboarding module, but it is **not** counted as part of the strict real-auth closeout chain.


## verify:live-onboarding (API-assisted regression — not strict A-4)

Evidence class: synthetic/API-assisted only (launch-verification headers + API profile updates).

```text
> the-switch-platform@0.1.0 verify:live-onboarding
> node scripts/verify-live-onboarding.mjs

Live onboarding regression target: https://theswitchplatform.com
Proof learner user id: onboarding-live-proof-1782436542360
Checking signed-out /onboarding redirect...
Checking fresh learner onboarding overview...
Checking Seneca-style onboarding page...
Completing onboarding via API (mirrors guided setup steps)...
Checking completed onboarding overview...
Checking personalised dashboard access...
Checking completed onboarding route redirect...
Live onboarding regression check passed:
- Signed-out route protection on /onboarding
- Account type, qualification (GCSE + iGCSE), profile/year, school + UK sources
- Subject selection, accessibility/SEND flags, guardian invite, age/consent
- Dashboard gate opens with personalised home after completion

npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
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

