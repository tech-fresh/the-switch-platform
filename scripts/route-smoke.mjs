import process from "node:process";
import { pathToFileURL } from "node:url";
import { CANONICAL_MVP_ROUTES, CANONICAL_MVP_ROUTES_DEFINITION } from "./canonical-mvp-routes.mjs";
import { assert, ensureBuild, fetchJson, fetchText, startNextServer, stopServer } from "./launch-utils.mjs";

const jsonRoutes = [
  ["/api/auth/providers", "providers"],
  ["/api/account/overview", "account"],
  ["/api/dashboard/home", "dashboard"],
];

async function assertSignedOutRouteBehavior(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route.path}`, {
    redirect: "manual",
  });

  if (route.requiresAuth) {
    const location = response.headers.get("location") ?? "";

    assert(
      response.status >= 300 && response.status < 400,
      `Expected signed-out ${route.path} to redirect, received ${response.status}.`,
    );
    assert(
      location.includes("/login"),
      `Expected signed-out ${route.path} to redirect to /login, received ${location}.`,
    );
    return;
  }

  const body = await response.text();

  assert(response.ok, `Expected ${route.path} to return 200 when signed out, received ${response.status}.`);
  assert(
    body.includes(route.signedOutMarker),
    `Expected ${route.path} to include launch marker "${route.signedOutMarker}".`,
  );
}

export async function runRouteSmoke() {
  await ensureBuild();

  const server = await startNextServer({
    SWITCH_AUTH_MODE: "preview-cookie",
    SWITCH_AUTH_SECRET: "launch-smoke-secret",
  });

  try {
    for (const route of CANONICAL_MVP_ROUTES) {
      await assertSignedOutRouteBehavior(server.baseUrl, route);
    }

    for (const route of CANONICAL_MVP_ROUTES_DEFINITION.supplementalSmokeRoutes ?? []) {
      const { response, body } = await fetchText(`${server.baseUrl}${route.path}`);

      assert(response.ok, `Expected ${route.path} to return 200, received ${response.status}.`);
      assert(
        body.includes(route.signedOutMarker),
        `Expected ${route.path} to include launch marker "${route.signedOutMarker}".`,
      );
    }

    for (const [route, key] of jsonRoutes) {
      const { response, json } = await fetchJson(`${server.baseUrl}${route}`);

      assert(response.ok, `Expected ${route} to return 200, received ${response.status}.`);
      assert(json && typeof json === "object" && key in json, `Expected ${route} to include JSON key "${key}".`);
    }

    const adminResponse = await fetch(`${server.baseUrl}/admin`, {
      redirect: "manual",
    });
    const adminLocation = adminResponse.headers.get("location") ?? "";

    assert(
      adminResponse.status >= 300 && adminResponse.status < 400,
      `Expected /admin to protect access when signed out, received ${adminResponse.status}.`,
    );
    assert(
      adminLocation.includes("/login") || adminLocation.includes("/account"),
      "Expected signed-out /admin access to redirect to /login.",
    );

    const cmsOverview = await fetchJson(`${server.baseUrl}/api/cms/overview`);

    assert(
      cmsOverview.response.status === 401,
      `Expected /api/cms/overview to return 401 when signed out, received ${cmsOverview.response.status}.`,
    );

    console.log(
      "Local route smoke passed: canonical MVP pages, public APIs, and signed-out protection are behaving as expected in the rehearsal runtime.",
    );
  } finally {
    await stopServer(server.child);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runRouteSmoke();
}
