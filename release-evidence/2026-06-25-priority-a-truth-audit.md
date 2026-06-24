# Priority A truth audit — 25 June 2026

Live host: https://theswitchplatform.com  
Workspace branch: `main`

## Purpose

Record the first strict real-auth audit run after the launch-verification bypass was hardened.

This file is **not** the final canonical completion bundle. It is an interim truth-audit record showing:

- strict real-auth tooling is now in place
- launch-verification bypass is rejected in strict mode
- the current local live student cookie does **not** authenticate a real session

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

## Current honest status

- `A-2` complete in code and enforced by runtime checks
- `A-5` complete on Fly production: persistence recovery proved against `/data`
- `A-7` complete in core repo truth surfaces
- `A-1` still open pending a fresh real production OIDC session cookie and recorded evidence

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

1. Refresh `SWITCH_LIVE_STUDENT_COOKIE` from a real Microsoft/OIDC sign-in on production.
2. Re-run:

```bash
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-oidc-proof
SWITCH_LAUNCH_VERIFICATION_SECRET= npm run verify:live-walkthrough:real-auth
```

3. If both pass, store that output in the canonical final release-evidence bundle and continue A-3 to A-8 closeout.
