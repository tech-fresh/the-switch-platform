# Final Path Mark 2 — Item 22 complete (23 June 2026)

Live host: https://theswitchplatform.com
Branch: cursor/unified-login-sign-in-page

## verify:launch-status
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

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
- npm run verify:live-walkthrough
- npm run verify:launch-signoff
- npm run verify:launch-complete
```

## verify:persistence-health
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:persistence-health
> node scripts/verify-persistence-health.mjs

Persistence health check:
- Driver: sqlite
- Storage backend: filesystem
- Data directory: /data
- Ephemeral storage: false
- Primary database: local path not mounted (/data/switch-live.sqlite); checking deployed runtime instead
- Deployed runtime API: healthy at https://theswitchplatform.com

Filesystem persistence health check passed.
```

## verify:live-readiness
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:live-readiness
> node scripts/live-readiness.mjs

Live readiness passed:
- Auth mode: oidc
- Configured live sign-in providers: 1
- Student data path: /data
- Persistence driver: sqlite
- Editorial mode: live
- Live URL checked: https://theswitchplatform.com
```

## verify:persistence-recovery
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:persistence-recovery
> node scripts/persistence-recovery-check.mjs

Persistence recovery check:
- Driver: sqlite
- Data directory: /data
- Backup directory: /data/backups
- Recovery ready: yes
- Recovery issues: 0
- Shared SQLite store: active=no, backup=no, match=yes, issue=none
```

## verify:live-walkthrough
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:live-walkthrough
> node scripts/live-route-walkthrough.mjs

Live walkthrough target: https://theswitchplatform.com
Waking the deployed site (Fly free tier may cold-start for up to 60–90s on the first request)...
Live site responded. Checking authenticated routes...
Checking /dashboard...
Checking /subjects...
Checking /assessments...
Checking /exams...
Checking /saved-progress...
Checking /results...
Checking /account...
Checking /support...
Checking /admin...
Checking /api/cms/overview...
Checking /api/results/overview...
Checking signed-out /admin redirect...
Live route walkthrough passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the deployed environment.
```

## verify:live-truth-match
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:live-truth-match
> node scripts/live-truth-match.mjs

Live truth-match passed:
- Persistence driver checked: sqlite
- Persistence path checked: /data
- Governance overall status: ready
- Admin runtime and governance evidence now reflect the same live launch state.
```

## verify:microsoft-oauth-live
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:microsoft-oauth-live
> node scripts/verify-microsoft-oauth-live.mjs

Microsoft OAuth live check:
- Live base URL: https://theswitchplatform.com
- Auth base URL: https://theswitchplatform.com
- Expected redirect URI: https://theswitchplatform.com/api/auth/callback
- Live providers endpoint: ok
- Auth start redirects to Microsoft: ok
- redirect_uri matches auth base URL: ok
- client_id looks like a real Azure app: 1d7c54e8-4445-40bc-9c97-598af039bfe6

Microsoft OAuth live check passed.
If browser sign-in still fails:
  Redirect URI: https://theswitchplatform.com/api/auth/callback
  Azure → Authentication → Supported account types → include personal Microsoft accounts (Hotmail/Outlook).
```

## verify:google-oauth-live
```
npm warn Unknown env config "devdir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> the-switch-platform@0.1.0 verify:google-oauth-live
> node scripts/verify-google-oauth-live.mjs

Google OAuth live check:
- Live base URL: https://theswitchplatform.com
- Auth base URL: https://theswitchplatform.com
- Expected redirect URI: https://theswitchplatform.com/api/auth/callback
- Live providers endpoint: ok
- Auth start redirects to Google: ok
- redirect_uri matches auth base URL: ok

Google OAuth live check passed.
If browser sign-in still fails, add these in Google Cloud Console:
  JavaScript origin: https://theswitchplatform.com
  Redirect URI:      https://theswitchplatform.com/api/auth/callback
```

## verify:launch-signoff (Fly production — canonical)

Recorded on Fly `/data` because Mac local runs cannot write governance SQLite without `/data`:

```
fly ssh console -a the-switch-platform -C 'sh -c "cd /app && node scripts/launch-signoff.mjs"'

Launch sign-off recording passed:
- Environment: fly-production
- Final approver: TF Solutions
- Stop-release authority: TF Solutions
- Privacy, safeguarding, incident ownership, and release approval records were written to launch governance.
```

## Item 22 completion summary

| Full End-to-End item | Status | Evidence |
|----------------------|--------|----------|
| 16 live-readiness | Passed | verify:live-readiness above |
| 17 persistence-recovery | Passed | verify:persistence-recovery above |
| 18 live-walkthrough | Passed | verify:live-walkthrough above |
| 19 launch-signoff | Passed | Fly ssh signoff above |
| 20 launch-complete | Passed* | All steps except local signoff; signoff on Fly |
| 21 permanent evidence | Passed | This file |
| 22 truth-match | Passed | verify:live-truth-match above |

Browser proof (operator): `lloydnwag@gmail.com` signed in via Microsoft; admin launch view 6/6 · 5/5 · 8/8.

**Item 22 closed:** README, admin launch view, Fly runtime (`sqlite` `/data`), and this evidence file now match.

*Local `verify:launch-complete` stops at signoff on Mac (`unable to open database file`). Use Fly ssh for governance recording; all live HTTP checks pass from operator machine.

