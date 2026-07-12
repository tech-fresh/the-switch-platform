import test from "node:test";
import assert from "node:assert/strict";

import {
  createAuthFlowToken,
  createSessionToken,
  isSameAuthFlowState,
  readAuthFlowToken,
  readSessionToken,
} from "../src/modules/auth/session-token.ts";

test("signed auth session tokens round-trip", () => {
  const secret = "test-secret";
  const session = {
    sessionId: "session-123",
    provider: "google",
    signedInAt: "2026-06-12T12:00:00.000Z",
    expiresAt: "2099-06-12T12:00:00.000Z",
    status: "authenticated",
    user: {
      userId: "user-123",
      firstName: "Maya",
      lastName: "Okafor",
      displayName: "Maya Okafor",
      email: "maya@example.com",
      yearGroup: "Year 11",
      targetQualifications: ["GCSE Mathematics"],
      roles: ["student"],
    },
  };

  const token = createSessionToken(session, secret);
  const parsed = readSessionToken(token, secret);

  assert.deepEqual(parsed, session);
});

test("signed auth session tokens reject tampering", () => {
  const secret = "test-secret";
  const session = {
    sessionId: "session-123",
    provider: "google",
    signedInAt: "2026-06-12T12:00:00.000Z",
    expiresAt: "2099-06-12T12:00:00.000Z",
    status: "authenticated",
    user: {
      userId: "user-123",
      firstName: "Maya",
      lastName: "Okafor",
      displayName: "Maya Okafor",
      email: "maya@example.com",
      yearGroup: "Year 11",
      targetQualifications: ["GCSE Mathematics"],
      roles: ["student"],
    },
  };

  const token = createSessionToken(session, secret);
  const separatorIndex = token.lastIndexOf(".");
  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const tamperedSignature = `${signature.slice(0, -1)}${signature.slice(-1) === "A" ? "B" : "A"}`;
  const tampered = `${payload}.${tamperedSignature}`;

  assert.equal(readSessionToken(tampered, secret), null);
});

test("auth flow tokens round-trip", () => {
  const secret = "test-secret";
  const flowState = {
    provider: "google",
    state: "state-123",
    codeVerifier: "verifier-123",
    returnTo: "/account",
    createdAt: "2026-06-12T12:00:00.000Z",
    expiresAt: "2099-06-12T12:10:00.000Z",
  };

  const token = createAuthFlowToken(flowState, secret);
  const parsed = readAuthFlowToken(token, secret);

  assert.deepEqual(parsed, flowState);
});

test("auth flow state equality matches identical signed payloads", () => {
  const flowState = {
    provider: "google",
    state: "state-123",
    codeVerifier: "verifier-123",
    returnTo: "/account",
    createdAt: "2026-06-12T12:00:00.000Z",
    expiresAt: "2099-06-12T12:10:00.000Z",
  };

  assert.equal(isSameAuthFlowState(flowState, { ...flowState }), true);
  assert.equal(isSameAuthFlowState(flowState, { ...flowState, returnTo: "/dashboard" }), false);
});
