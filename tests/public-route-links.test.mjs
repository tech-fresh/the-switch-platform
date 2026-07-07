import assert from "node:assert/strict";
import test from "node:test";

test("guest marketing links go straight to login for protected student routes", async () => {
  const { getPublicRouteHref } = await import("../src/lib/public-route.ts");

  assert.equal(
    getPublicRouteHref("/dashboard", false),
    "/login?returnTo=%2Fdashboard&reauth=1",
  );
  assert.equal(
    getPublicRouteHref("/subjects?subjectId=gcse-maths", false),
    "/login?returnTo=%2Fsubjects%3FsubjectId%3Dgcse-maths&reauth=1",
  );
  assert.equal(
    getPublicRouteHref("/progress", false),
    "/login?returnTo=%2Fprogress&reauth=1",
  );
});

test("guest marketing links keep public destinations unchanged and route admin through admin intent", async () => {
  const { getPublicRouteHref } = await import("../src/lib/public-route.ts");

  assert.equal(getPublicRouteHref("/support", false), "/support");
  assert.equal(getPublicRouteHref("/how-it-works", false), "/how-it-works");
  assert.equal(
    getPublicRouteHref("/admin", false),
    "/login?returnTo=%2Fadmin&intent=admin",
  );
});

test("authenticated users keep direct internal destinations", async () => {
  const { getPublicRouteHref } = await import("../src/lib/public-route.ts");

  assert.equal(getPublicRouteHref("/dashboard", true), "/dashboard");
  assert.equal(getPublicRouteHref("/admin", true), "/admin");
});
