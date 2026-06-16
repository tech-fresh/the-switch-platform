import test from "node:test";
import assert from "node:assert/strict";

test("governance review patch input uses fallback owner and trims fields", async () => {
  const { parseGovernanceReviewPatchInput } = await import("../src/modules/governance/api.ts");

  const input = parseGovernanceReviewPatchInput(
    {
      status: "ready",
      owner: "  ",
      note: "  Final review completed.  ",
      environment: "  production-eu  ",
    },
    "Launch manager",
  );

  assert.deepEqual(input, {
    status: "ready",
    owner: "Launch manager",
    note: "Final review completed.",
    environment: "production-eu",
  });
});

test("governance sign-off patch input rejects unsupported statuses", async () => {
  const { GovernanceRouteValidationError, parseGovernanceSignOffPatchInput } = await import(
    "../src/modules/governance/api.ts"
  );

  assert.throws(
    () =>
      parseGovernanceSignOffPatchInput(
        {
          status: "recorded",
        },
        "Launch manager",
      ),
    GovernanceRouteValidationError,
  );
});

test("governance evidence patch input trims values and rejects invalid statuses", async () => {
  const { GovernanceRouteValidationError, parseGovernanceEvidencePatchInput } = await import(
    "../src/modules/governance/api.ts"
  );

  const input = parseGovernanceEvidencePatchInput(
    {
      status: "recorded",
      owner: "  Platform lead  ",
      summary: "  Live route walk-through recorded.  ",
      environment: "  staging-eu  ",
    },
    "Fallback owner",
  );

  assert.deepEqual(input, {
    status: "recorded",
    owner: "Platform lead",
    summary: "Live route walk-through recorded.",
    environment: "staging-eu",
  });

  assert.throws(
    () =>
      parseGovernanceEvidencePatchInput(
        {
          status: "ready",
        },
        "Fallback owner",
      ),
    GovernanceRouteValidationError,
  );
});

test("governance environment patch input trims values and validates status", async () => {
  const { GovernanceRouteValidationError, parseGovernanceEnvironmentPatchInput } = await import(
    "../src/modules/governance/api.ts"
  );

  const input = parseGovernanceEnvironmentPatchInput(
    {
      status: "watch",
      owner: "  Platform lead  ",
      detail: "  Callback URL still needs to be verified in production.  ",
      environment: "  production-eu  ",
    },
    "Fallback owner",
  );

  assert.deepEqual(input, {
    status: "watch",
    owner: "Platform lead",
    detail: "Callback URL still needs to be verified in production.",
    environment: "production-eu",
  });

  assert.throws(
    () =>
      parseGovernanceEnvironmentPatchInput(
        {
          status: "recorded",
        },
        "Fallback owner",
      ),
    GovernanceRouteValidationError,
  );
});

test("governance smoke patch input uses fallback owner and validates status", async () => {
  const { GovernanceRouteValidationError, parseGovernanceSmokePatchInput } = await import(
    "../src/modules/governance/api.ts"
  );

  const input = parseGovernanceSmokePatchInput(
    {
      status: "ready",
      owner: " ",
      note: "  Final account and admin route pass completed.  ",
      environment: "  staging-eu  ",
    },
    "Release manager",
  );

  assert.deepEqual(input, {
    status: "ready",
    owner: "Release manager",
    note: "Final account and admin route pass completed.",
    environment: "staging-eu",
  });

  assert.throws(
    () =>
      parseGovernanceSmokePatchInput(
        {
          status: "still-needed",
        },
        "Release manager",
      ),
    GovernanceRouteValidationError,
  );
});
