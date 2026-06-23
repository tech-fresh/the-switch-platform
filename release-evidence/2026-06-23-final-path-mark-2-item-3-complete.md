# Final Path Mark 2 — Item 3 complete (23 June 2026)

Live host: https://theswitchplatform.com  
Branch: `main`  
Commits: Seneca onboarding UI (`129f39e`, `27d3522`) + live proof tooling (this session)

Plain English: a new learner can sign in, complete the Seneca-style guided setup at `/onboarding`, and reach a personalised dashboard. Automated live proof recorded below.

## Item 3 checklist (Full End-to-End Completion List)

| Requirement | Live proof |
|-------------|------------|
| Welcome / account type (student, parent, teacher) | Step 0 — account-type cards on `/onboarding` |
| Qualification path (GCSE + iGCSE) | API options include `gcse-england` and `igcse` |
| Profile / year group | Step 2 — personalised “Great to meet you” + year persona |
| School + UK school-source links | Step 3 — England, Scotland, Wales, NI sources in API |
| Subject selection | Step 4 — multi-select grid; ≥1 subject required |
| Accessibility question | Step 5 — `wantsAccessibilitySupport` captured |
| SEND / access-arrangement visibility | Step 5 — `sendSupportPathVisible` captured |
| Guardian invite (optional) | Step 6 — guardian email field |
| Age or consent confirmation | Step 7 — required before completion |
| First dashboard from learner setup | `/dashboard` opens with `recommendedAction` reflecting Year 11 + GCSE |

## verify:live-onboarding

```
> the-switch-platform@0.1.0 verify:live-onboarding
> node scripts/verify-live-onboarding.mjs

Live onboarding proof target: https://theswitchplatform.com
Proof learner user id: onboarding-live-proof-1782257138564
Checking signed-out /onboarding redirect...
Checking fresh learner onboarding overview...
Checking Seneca-style onboarding page...
Completing onboarding via API (mirrors guided setup steps)...
Checking completed onboarding overview...
Checking personalised dashboard access...
Checking completed onboarding route redirect...
Live onboarding proof passed:
- Signed-out route protection on /onboarding
- Account type, qualification (GCSE + iGCSE), profile/year, school + UK sources
- Subject selection, accessibility/SEND flags, guardian invite, age/consent
- Dashboard gate opens with personalised home after completion
```

Command: `npm run verify:live-onboarding`

## verify:live-walkthrough (post onboarding gate)

```
> the-switch-platform@0.1.0 verify:live-walkthrough
> node scripts/live-route-walkthrough.mjs

Live walkthrough target: https://theswitchplatform.com
Live site responded. Checking authenticated routes...
Walkthrough student onboarding is complete. Checking routes...
Checking /dashboard...
Checking /subjects...
Checking /assessments...
Checking /exams...
Checking /saved-progress...
Checking /results...
Checking /account...
Checking /support...
Checking /admin...
Live route walkthrough passed: dashboard, subjects, assessments, exams, saved progress, results, account, support, and admin all behaved correctly in the deployed environment.
```

Command: `npm run verify:live-walkthrough`

## verify:live-truth-match

```
> the-switch-platform@0.1.0 verify:live-truth-match
> node scripts/live-truth-match.mjs

Live truth-match passed:
- Persistence driver checked: sqlite
- Persistence path checked: /data
- Governance overall status: ready
- Admin runtime and governance evidence now reflect the same live launch state.
```

Command: `npm run verify:live-truth-match`

## Status

**Item 3: COMPLETE** on https://theswitchplatform.com (Fly.io, sqlite `/data`)

Re-check anytime:

```bash
npm run verify:live-onboarding
npm run verify:live-walkthrough
npm run verify:live-truth-match
```

## Related docs

- UI mockup: `docs/SENECA-STYLE-ONBOARDING-MOCKUP.md`
- Module: `src/modules/onboarding/`
