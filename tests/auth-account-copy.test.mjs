import test from "node:test";
import assert from "node:assert/strict";

import { buildSignedOutAccountCopy } from "../src/modules/auth/account-copy.ts";

test("oidc signed-out copy avoids preview wording when a provider is configured", () => {
  const copy = buildSignedOutAccountCopy({
    runtimeMode: "oidc",
    hasConfiguredProductionProviders: true,
    configuredProviderCount: 1,
  });

  assert.equal(copy.signedInLabel, "Signed out");
  assert.equal(copy.accessLevelLabel, "Signed out");
  assert.match(copy.signedOutTitle, /personal study account/i);
  assert.doesNotMatch(copy.signedOutTitle, /preview/i);
  assert.doesNotMatch(copy.signedOutDescription, /preview mode/i);
});

test("preview-cookie signed-out copy keeps preview wording", () => {
  const copy = buildSignedOutAccountCopy({
    runtimeMode: "preview-cookie",
    hasConfiguredProductionProviders: false,
    configuredProviderCount: 0,
  });

  assert.equal(copy.signedInLabel, "Guest preview");
  assert.equal(copy.accessLevelLabel, "Guest preview");
  assert.match(copy.signedOutTitle, /preview/i);
  assert.match(copy.signedOutDescription, /preview mode/i);
});
