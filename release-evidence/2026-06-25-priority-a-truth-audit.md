# Priority A truth audit — 25 June 2026

Live host: https://theswitchplatform.com  
Workspace branch: `main`

## Purpose

Record the first strict real-auth audit run after the launch-verification bypass was hardened.

This file is **not** the final canonical completion bundle. It is an interim truth-audit record showing:

- strict real-auth tooling is now in place
- launch-verification bypass is rejected in strict mode
- real browser-authenticated production OIDC proof now exists for sign-in, onboarding, and sign-out
- the current local strict-proof env still lacks the fresh student/admin cookies needed for the final reruns

## Strict real-auth guardrail

Commands:

```bash
npm run verify:live-oidc-proof
npm run verify:live-walkthrough:real-auth
```

Result with current `.env.local`:

- both commands failed immediately because `SWITCH_LAUNCH_VERIFICATION_SECRET` was still present
- this is the expected strict-mode behavior

Meaning:

- final proof can no longer silently use launch-verification headers

## Real-auth retry with launch verification secret blanked for the process

Commands:

```bash
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-oidc-proof
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-walkthrough:real-auth
```

Results:

- `verify:live-oidc-proof`
  - passed provider discovery
  - passed auth-start redirect to provider
  - passed direct local session mutation block in `oidc` mode
  - failed at authenticated-session proof because `/api/auth/session` did **not** report an authenticated session
- `verify:live-walkthrough:real-auth`
  - reached the live host in unrestricted mode
  - cannot yet be treated as final proof because the real authenticated cookie path is not currently valid

Meaning:

- the remaining blocker for A-1 is **live auth evidence**, not code-path fallback
- the current production student cookie in local operator env must be refreshed before real-auth proof can be recorded

## Local repo verification

```bash
npm test
npm run lint
```

Result:

- passed

## Real browser-authenticated production proof

Run date: 25 June 2026 (BST)  
Host: https://theswitchplatform.com

### A-1 real OIDC sign-in proof

- Started from `https://theswitchplatform.com/login`
- Triggered real auth start through `Continue with Google`
- Reached the real Google provider account chooser on `accounts.google.com` with `redirect_uri=https://theswitchplatform.com/api/auth/callback`
- Selected the remembered production learner account `theswitchengine@gmail.com`
- Returned to the live site with a signed session
- Confirmed signed session on `/account`:
  - learner: `Theswitchengine`
  - email: `theswitchengine@gmail.com`
  - provider: `google`
  - account copy showed `Signed in via google at 24 Jun, 23:56`
  - protected route `/dashboard` was accessible

Meaning:

- real production OIDC sign-in was exercised without launch-verification headers
- provider redirect and callback-backed session creation were proved through the live browser path

### A-4 real fresh-learner onboarding proof

- Signed-in learner landed on `/onboarding`
- Completed all 8 production onboarding steps through the live browser:
  - account type
  - qualification path
  - learner profile
  - school capture
  - subject selection
  - accessibility / access arrangements / SEND signposting
  - guardian step
  - age or consent confirmation
- Dashboard unlocked after step 8
- Revisit check:
  - after completion, direct navigation attempts to `/onboarding` kept the learner on `/dashboard`

Meaning:

- item 3 is now backed by a real auth path instead of synthetic launch headers

### A-3 real sign-out and lockout proof

- Started from signed-in `/account`
- Clicked the real `Sign out` action
- Verified protected route lockout:
  - direct visit to `/dashboard` redirected to `/login`
  - `/account` rendered a signed-out state with `Log in` and provider sign-in actions instead of the live session summary

Meaning:

- real production sign-out invalidated protected-route access for the learner session

## Current honest status

- `A-1` complete in browser-authenticated production evidence
- `A-2` complete in code and enforced by runtime checks
- `A-3` complete in browser-authenticated production evidence
- `A-4` complete in browser-authenticated production evidence
- `A-5` complete on Fly production: persistence recovery proved against `/data`
- `A-7` complete in core repo truth surfaces
- `A-6` and `A-8` remain open pending fresh cookie-backed strict reruns

## Fly production persistence recovery proof

Command:

```bash
fly ssh console -a the-switch-platform -C "sh -lc 'cd /app && node scripts/persistence-recovery-check.mjs'"
```

Result:

```text
Persistence recovery check:
- Driver: sqlite
- Data directory: /data
- Backup directory: /data/backups
- Recovery ready: yes
- Recovery issues: 0
- Shared SQLite store: active=yes, backup=yes, match=yes, issue=none
```

Meaning:

- the recovery proof is now tied directly to the real Fly production `/data` mount
- A-5 is complete

## Next operator step

1. Refresh `SWITCH_LIVE_STUDENT_COOKIE` from the now-proved real production learner sign-in on production.
2. Refresh `SWITCH_LIVE_ADMIN_COOKIE` from a real production admin sign-in.
3. Re-run:

```bash
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-oidc-proof
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-walkthrough:real-auth
```

4. If both pass, store that output in the canonical final release-evidence bundle, rerun `npm run verify:live-truth-match`, and close A-6/A-8.
