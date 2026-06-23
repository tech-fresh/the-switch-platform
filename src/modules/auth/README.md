# Auth Module

Owns authentication contracts and user identity boundaries.

Current foundations in this module:

- cookie-backed auth session model with signed-in and signed-out states
- sign-in option definitions for MVP and future app flows
- account overview service for website and future API/mobile clients
- framework-neutral auth and account API contracts
- provider abstraction so preview auth can later be replaced by a production identity provider without rewriting page contracts
- authenticated request helpers for route and API protection on account-linked product surfaces
- role-aware authorization helpers for editor and admin-protected routes
- a dedicated `/login` route that gives students and admin one Seneca-style sign-in front door before account-linked routes open

## Unified sign-in route

The website now exposes `/login` as the main sign-in entry for both students and admin:

- the home navigation **Log in** button opens `/login`
- configured Google, Microsoft, Apple, and email-magic-link providers render as provider buttons on one card
- successful sign-in returns learners to `/dashboard` by default, or to a safe `returnTo` path when supplied
- signed-out protected routes such as `/admin` redirect to `/login`
- auth callback and start errors return to `/login?authError=...` instead of mixing sign-in errors into the account page

The account page remains the signed-in identity home. It still exposes account metrics, role visibility, and the live cookie guide for launch verification.

## Microsoft sign-in

Microsoft OIDC uses the same auth module path as Google:

- configure the full `SWITCH_OIDC_MICROSOFT_*` block in the runtime environment
- add Azure redirect URI `{SWITCH_AUTH_BASE_URL}/api/auth/callback`
- expose the provider on `/login` automatically when the block is complete
- map Microsoft profile fields such as `mail` and `userPrincipalName` into the shared auth user model

Operator helpers:

- `npm run setup:microsoft-oauth-live`
- `npm run setup:microsoft-oauth-live`
- `npm run provision:microsoft-oauth-live` and `npm run provision:microsoft-oauth-live:apply`
- `npm run verify:microsoft-oauth-live`
- plain-English guide: `docs/MICROSOFT_OAUTH_LIVE.md`
- in-product guide: `/login/microsoft-guide`

The authoritative project completion list requires the live auth environment to be configured before the platform can move toward true 100% completion.

Item 1 is only complete when all of the following are true in the real deployed environment:

- `SWITCH_AUTH_MODE=oidc`
- `SWITCH_AUTH_SECRET` is a real production secret
- `SWITCH_AUTH_BASE_URL` matches the exact deployed app origin used by the callback flow
- at least one OIDC provider block is complete from top to bottom
- the live runtime is using the configured OIDC path instead of preview auth

A provider block only counts as complete when these values are all present together:

- `CLIENT_ID`
- `CLIENT_SECRET`
- `AUTHORIZATION_URL`
- `TOKEN_URL`
- `USERINFO_URL`

This module should treat partial provider blocks as not configured.
