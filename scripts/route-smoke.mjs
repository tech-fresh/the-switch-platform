import { assert, ensureBuild, fetchJson, fetchText, startNextServer, stopServer } from "./launch-utils.mjs";

const publicPages = [
  ["/", "Dashboard"],
  ["/dashboard", "Dashboard"],
  ["/subjects", "Subjects"],
  ["/login", "Welcome back!"],
  ["/account", "Student Account"],
  ["/support", "Support"],
  ["/how-it-works", "Website Guide"],
];

const jsonRoutes = [
  ["/api/auth/providers", "providers"],
  ["/api/account/overview", "account"],
  ["/api/dashboard/home", "dashboard"],
];

await ensureBuild();

const server = await startNextServer({
  SWITCH_AUTH_MODE: "oidc",
  SWITCH_AUTH_SECRET: "launch-smoke-secret",
});

try {
  for (const [route, expectedText] of publicPages) {
    const { response, body } = await fetchText(`${server.baseUrl}${route}`);

    assert(response.ok, `Expected ${route} to return 200, received ${response.status}.`);
    assert(
      body.includes(expectedText),
      `Expected ${route} to include launch marker "${expectedText}".`,
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

  assert(cmsOverview.response.status === 401, `Expected /api/cms/overview to return 401 when signed out, received ${cmsOverview.response.status}.`);

  console.log("Local route smoke passed: public pages, public APIs, and signed-out protection are behaving as expected in the rehearsal runtime.");
} finally {
  await stopServer(server.child);
}
