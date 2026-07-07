const AUTHENTICATED_ROUTE_PREFIXES = [
  "/dashboard",
  "/subjects",
  "/assessments",
  "/exams",
  "/saved-progress",
  "/results",
  "/recommendations",
  "/progress",
  "/accessibility",
  "/admin",
  "/onboarding",
] as const;

function isProtectedInternalHref(href: string): boolean {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}?`),
  );
}

export function getLoginHrefForReturnTo(
  href: string,
  intent: "student" | "admin" = "student",
): string {
  const searchParams = new URLSearchParams({
    returnTo: href,
  });

  if (intent === "admin") {
    searchParams.set("intent", "admin");
  } else {
    searchParams.set("reauth", "1");
  }

  return `/login?${searchParams.toString()}`;
}

export function getPublicRouteHref(href: string, isAuthenticated: boolean): string {
  if (isAuthenticated || !href.startsWith("/")) {
    return href;
  }

  if (href === "/admin" || href.startsWith("/admin?")) {
    return getLoginHrefForReturnTo(href, "admin");
  }

  if (isProtectedInternalHref(href)) {
    return getLoginHrefForReturnTo(href);
  }

  return href;
}
