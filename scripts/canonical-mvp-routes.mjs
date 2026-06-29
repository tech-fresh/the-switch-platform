import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routesJsonPath = path.join(repoRoot, "src/lib/routes/canonical-mvp-routes.json");

/** @type {import("../src/lib/routes/canonical-mvp-routes.ts").CanonicalMvpRoutesDefinition} */
export const CANONICAL_MVP_ROUTES_DEFINITION = JSON.parse(readFileSync(routesJsonPath, "utf8"));

export const CANONICAL_MVP_ROUTES = CANONICAL_MVP_ROUTES_DEFINITION.routes;

export const CANONICAL_MVP_PATHS = new Set(CANONICAL_MVP_ROUTES.map((route) => route.path));

export const ALLOWED_MVP_CLICK_TARGETS = new Set(CANONICAL_MVP_ROUTES_DEFINITION.allowedClickTargets);

export const STUDENT_SHELL_ROUTE_PATHS = CANONICAL_MVP_ROUTES.filter(
  (route) => route.studentShellWhenSignedIn,
).map((route) => route.path);

export const PUBLIC_SIGNED_OUT_ROUTE_PATHS = CANONICAL_MVP_ROUTES.filter(
  (route) => !route.requiresAuth,
).map((route) => route.path);

export async function assertSignedOutRouteBehavior(baseUrl, route, fetchImpl = fetch) {
  const response = await fetchImpl(`${baseUrl}${route.path}`, {
    redirect: "manual",
  });

  if (route.requiresAuth) {
    const location = response.headers.get("location") ?? "";

    if (response.status < 300 || response.status >= 400) {
      throw new Error(`Expected signed-out ${route.path} to redirect, received ${response.status}.`);
    }

    if (!location.includes("/login")) {
      throw new Error(`Expected signed-out ${route.path} to redirect to /login, received ${location}.`);
    }

    return;
  }

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Expected ${route.path} to return 200 when signed out, received ${response.status}.`);
  }

  if (!body.includes(route.signedOutMarker)) {
    throw new Error(`Expected ${route.path} to include launch marker "${route.signedOutMarker}".`);
  }
}

export function getClickTargetPathname(href) {
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

export function isAllowedMvpClickTarget(href) {
  const pathname = getClickTargetPathname(href);

  if (!pathname) {
    return href.trim().startsWith("#");
  }

  return ALLOWED_MVP_CLICK_TARGETS.has(pathname);
}

export function assertAllowedMvpClickTarget(href, context) {
  if (!isAllowedMvpClickTarget(href)) {
    throw new Error(`Disallowed MVP click target "${href}" in ${context}.`);
  }
}
