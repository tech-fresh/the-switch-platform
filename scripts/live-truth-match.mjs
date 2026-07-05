import "./load-script-env.mjs";

import { assert, fetchJson } from "./launch-utils.mjs";
import { getLiveWalkthroughConfig } from "./live-walkthrough-utils.mjs";

delete process.env.SWITCH_LAUNCH_VERIFICATION_SECRET;

function findById(items, key, value) {
  return Array.isArray(items) ? items.find((item) => item?.[key] === value) ?? null : null;
}

const expectedAuthMode = (process.env.SWITCH_AUTH_MODE ?? "oidc").trim();
const expectedAuthBaseUrl = process.env.SWITCH_AUTH_BASE_URL?.trim() ?? "";
const expectedPersistenceDriver = (process.env.SWITCH_PERSISTENCE_DRIVER ?? "local-json").trim();
const expectedDataDirectory = process.env.SWITCH_DATA_DIRECTORY?.trim() ?? "";
const expectedCmsBackendMode = (process.env.SWITCH_CMS_BACKEND_MODE ?? "live").trim();

const { baseUrl, adminHeaders } = getLiveWalkthroughConfig(process.env, {
  walkthroughMode: "real-auth",
});

assert(
  expectedPersistenceDriver === "sqlite",
  "Live truth-match requires SWITCH_PERSISTENCE_DRIVER=sqlite.",
);
assert(
  expectedDataDirectory,
  "Live truth-match requires SWITCH_DATA_DIRECTORY so the deployed runtime can be compared to the intended shared live path.",
);

const persistenceResponse = await fetchJson(`${baseUrl}/api/persistence/runtime`, {
  headers: adminHeaders,
});
assert(
  persistenceResponse.response.ok,
  `Expected authenticated /api/persistence/runtime to return 200, received ${persistenceResponse.response.status}.`,
);

const persistence = persistenceResponse.json?.persistence;
assert(persistence, "Live truth-match failed: /api/persistence/runtime returned no persistence payload.");
assert(
  persistence.driver === expectedPersistenceDriver,
  `Live truth-match failed: expected persistence driver ${expectedPersistenceDriver}, received ${persistence.driver}.`,
);
assert(
  persistence.dataDirectory === expectedDataDirectory,
  `Live truth-match failed: expected persistence path ${expectedDataDirectory}, received ${persistence.dataDirectory}.`,
);
assert(
  persistence.isPrototypePersistence === false,
  "Live truth-match failed: deployed persistence is still marked prototype or recovery-incomplete.",
);
assert(
  persistence.isEphemeralStorage === false,
  "Live truth-match failed: deployed persistence is still using ephemeral serverless storage.",
);
assert(
  persistence.recoveryReady === true,
  "Live truth-match failed: deployed persistence recovery is not ready.",
);

const governanceResponse = await fetchJson(`${baseUrl}/api/governance/overview`, {
  headers: adminHeaders,
});
assert(
  governanceResponse.response.ok,
  `Expected authenticated /api/governance/overview to return 200, received ${governanceResponse.response.status}.`,
);

const governance = governanceResponse.json?.governance;
assert(governance, "Live truth-match failed: /api/governance/overview returned no governance payload.");
assert(
  governance.overallStatus === "ready",
  `Live truth-match failed: governance overall status is ${governance.overallStatus}, not ready.`,
);

const persistenceCheck = findById(
  governance.environmentChecks,
  "checkId",
  "environment-persistence-path",
);
assert(
  persistenceCheck?.status === "ready",
  "Live truth-match failed: environment-persistence-path is not ready in governance.",
);

const authModeCheck = findById(governance.environmentChecks, "checkId", "environment-auth-mode");
assert(
  authModeCheck?.status === "ready",
  "Live truth-match failed: environment-auth-mode is not ready in governance.",
);
assert(
  Boolean(authModeCheck?.detail),
  "Live truth-match failed: environment-auth-mode is missing its recorded governance detail.",
);

const cmsCheck = findById(governance.environmentChecks, "checkId", "environment-cms-mode");
assert(
  cmsCheck?.status === "ready",
  "Live truth-match failed: environment-cms-mode is not ready in governance.",
);
assert(
  expectedCmsBackendMode !== "read-only",
  "Live truth-match requires SWITCH_CMS_BACKEND_MODE to stay on a writable path.",
);

if (expectedAuthMode === "oidc") {
  const authBaseUrlCheck = findById(
    governance.environmentChecks,
    "checkId",
    "environment-auth-base-url",
  );
  assert(
    authBaseUrlCheck?.status === "ready",
    "Live truth-match failed: environment-auth-base-url is not ready in governance.",
  );
  assert(
    Boolean(authBaseUrlCheck?.detail),
    "Live truth-match failed: environment-auth-base-url is missing its recorded governance detail.",
  );
}

for (const evidenceId of [
  "evidence-persistence-sqlite",
  "evidence-persistence-recovery",
  "evidence-environment-base-url",
  "evidence-final-live-proof",
]) {
  const record = findById(governance.evidenceRecords, "evidenceId", evidenceId);
  assert(
    record?.status === "recorded",
    `Live truth-match failed: ${evidenceId} is not recorded in governance evidence.`,
  );
}

const releaseSignoff = findById(
  governance.signOffChecks,
  "checkId",
  "signoff-release-approval",
);
assert(
  releaseSignoff?.status === "ready",
  "Live truth-match failed: final release approval sign-off is not ready.",
);

console.log("Live truth-match passed:");
console.log(`- Persistence driver checked: ${persistence.driver}`);
console.log(`- Persistence path checked: ${persistence.dataDirectory}`);
console.log(`- Governance overall status: ${governance.overallStatus}`);
console.log("- Admin runtime and governance evidence now reflect the same live launch state.");
