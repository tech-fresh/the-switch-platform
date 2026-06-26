import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  createSessionToken,
  readSessionToken,
} from "../src/modules/auth/session-token.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function buildAuthenticatedSession(overrides = {}) {
  return {
    sessionId: "session-123",
    provider: "google",
    signedInAt: "2026-06-12T12:00:00.000Z",
    expiresAt: "2099-06-12T12:00:00.000Z",
    status: "authenticated",
    user: {
      userId: "student-demo",
      firstName: "Maya",
      lastName: "Okafor",
      displayName: "Maya Okafor",
      email: "maya.okafor@student.switch.local",
      yearGroup: "Year 11",
      targetQualifications: [
        "GCSE Mathematics",
        "GCSE English Language",
        "GCSE Combined Science",
      ],
      roles: ["student"],
    },
    ...overrides,
  };
}

test("getCurrentAuthSession resolves preview-cookie sessions and rejects missing tokens", async () => {
  const previousMode = process.env.SWITCH_AUTH_MODE;
  const previousSecret = process.env.SWITCH_AUTH_SECRET;
  process.env.SWITCH_AUTH_MODE = "preview-cookie";
  process.env.SWITCH_AUTH_SECRET = "preview-secret";

  const { getCurrentAuthSession } = await import(
    `../src/modules/auth/service.ts?test=${Date.now()}-session-lifecycle`
  );

  const missing = await getCurrentAuthSession();
  assert.equal(missing.status, "signed-out");
  assert.equal(missing.reason, "missing-session");

  const invalid = await getCurrentAuthSession({ sessionToken: "not-a-valid-token" });
  assert.equal(invalid.status, "signed-out");
  assert.equal(invalid.reason, "invalid-session");

  const session = buildAuthenticatedSession();
  const token = createSessionToken(session, "preview-secret");
  const resolved = await getCurrentAuthSession({ sessionToken: token });

  assert.equal(resolved.status, "authenticated");
  assert.equal(resolved.user.userId, "student-demo");

  restoreEnv("SWITCH_AUTH_MODE", previousMode);
  restoreEnv("SWITCH_AUTH_SECRET", previousSecret);
});

test("expired session tokens are treated as invalid", () => {
  const secret = "test-secret";
  const expiredSession = buildAuthenticatedSession({
    expiresAt: "2020-01-01T00:00:00.000Z",
  });
  const token = createSessionToken(expiredSession, secret);

  assert.equal(readSessionToken(token, secret), null);
});

test("auth session DELETE route clears the session cookie on sign-out", () => {
  const routeSource = readFileSync(
    path.join(repoRoot, "src/app/api/auth/session/route.ts"),
    "utf8",
  );

  assert.match(routeSource, /export async function DELETE\(\)/);
  assert.match(routeSource, /await clearAuthSession\(\)/);
  assert.match(routeSource, /status: "signed-out"/);
  assert.match(routeSource, /maxAge: 0/);
});

test("protected student routes require an authenticated session", () => {
  const studentRoute = readFileSync(
    path.join(repoRoot, "src/lib/server/student-route.ts"),
    "utf8",
  );
  const authRequest = readFileSync(path.join(repoRoot, "src/modules/auth/request.ts"), "utf8");

  assert.match(studentRoute, /requireAuthenticatedRequestSession/);
  assert.match(authRequest, /if \(session\.status !== "authenticated"\)/);
  assert.match(authRequest, /redirect\(redirectTo\)/);
});
