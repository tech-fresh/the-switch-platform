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
