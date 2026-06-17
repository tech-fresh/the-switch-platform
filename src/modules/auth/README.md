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

## Full completion item 1

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
