# Auth Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Auth Module

Service entry: `src/modules/auth/service.ts`

**Email allowlist (admin vs student):** one Google/Microsoft sign-in for everyone. Operator emails are listed in `SWITCH_AUTH_ADMIN_EMAILS` and `SWITCH_AUTH_EDITOR_EMAILS`. Role mapping lives in `allowlist-service.ts`; account and admin surfaces show the allowlist via `AuthAccessPathPanel`. Admin sign-in path: `/login?intent=admin&returnTo=/admin`.
