import routesDefinition from "./canonical-mvp-routes.json";

export type MvpRouteAccess = "public" | "student";

export interface CanonicalMvpRoute {
  path: string;
  label: string;
  access: "public" | "student";
  requiresAuth: boolean;
  signedOutMarker?: string;
  studentShellWhenSignedIn?: boolean;
  signedInMarker?: string;
}

export interface CanonicalMvpRoutesDefinition {
  routes: CanonicalMvpRoute[];
  allowedClickTargets: string[];
  recoveryDefaultActions: string[];
}

export const CANONICAL_MVP_ROUTES_DEFINITION =
  routesDefinition as CanonicalMvpRoutesDefinition;

export const CANONICAL_MVP_ROUTES = CANONICAL_MVP_ROUTES_DEFINITION.routes;

export const CANONICAL_MVP_PATHS = new Set(
  CANONICAL_MVP_ROUTES.map((route) => route.path),
);

export const ALLOWED_MVP_CLICK_TARGETS = new Set(
  CANONICAL_MVP_ROUTES_DEFINITION.allowedClickTargets,
);

/** Strip query/hash and reject external URLs. */
export function getClickTargetPathname(href: string): string | null {
  const trimmed = href.trim();

  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return null;
  }

  if (trimmed.startsWith("//")) {
    return null;
  }

  const withoutHash = trimmed.split("#")[0] ?? trimmed;
  const pathname = (withoutHash.split("?")[0] ?? withoutHash).trim();

  if (!pathname.startsWith("/")) {
    return null;
  }

  return pathname;
}

export function isAllowedMvpClickTarget(href: string): boolean {
  const pathname = getClickTargetPathname(href);

  if (!pathname) {
    return href.trim().startsWith("#");
  }

  return ALLOWED_MVP_CLICK_TARGETS.has(pathname);
}

export function assertAllowedMvpClickTarget(href: string, context: string): void {
  if (!isAllowedMvpClickTarget(href)) {
    throw new Error(`Disallowed MVP click target "${href}" in ${context}.`);
  }
}

export function getCanonicalRoute(path: string): CanonicalMvpRoute | undefined {
  return CANONICAL_MVP_ROUTES.find((route) => route.path === path);
}

export const STUDENT_SHELL_ROUTE_PATHS = CANONICAL_MVP_ROUTES.filter(
  (route) => route.studentShellWhenSignedIn,
).map((route) => route.path);

export const PUBLIC_MARKETING_ROUTE_PATHS = CANONICAL_MVP_ROUTES.filter(
  (route) => !route.studentShellWhenSignedIn,
).map((route) => route.path);
