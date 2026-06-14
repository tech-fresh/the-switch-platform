import test from "node:test";
import assert from "node:assert/strict";

test("operations events receive default ids and timestamps", async () => {
  const { buildOperationsEvent } = await import("../src/lib/server/operations-event.ts");

  const event = buildOperationsEvent({
    domain: "saved-progress",
    action: "status-updated",
    status: "success",
    userId: "learner-1",
    entityId: "saved-1",
    detail: "Saved progress updated safely.",
  });

  assert.equal(event.domain, "saved-progress");
  assert.equal(event.action, "status-updated");
  assert.equal(event.status, "success");
  assert.ok(event.eventId.startsWith("ops-"));
  assert.ok(event.occurredAt.includes("T"));
});

test("operations events can be logged at the correct console level", async () => {
  const { buildOperationsEvent, recordOperationsEvent } = await import(
    "../src/lib/server/operations-event.ts"
  );
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const seen = [];

  console.info = (message) => seen.push(["info", message]);
  console.warn = (message) => seen.push(["warn", message]);
  console.error = (message) => seen.push(["error", message]);

  try {
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "auth",
        action: "session-created",
        status: "success",
        detail: "Auth session created.",
      }),
    );
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "editorial",
        action: "workflow-update-blocked",
        status: "warning",
        detail: "Editorial write blocked.",
      }),
    );
    recordOperationsEvent(
      buildOperationsEvent({
        domain: "exam",
        action: "session-submit-failed",
        status: "failure",
        detail: "Exam submit failed.",
      }),
    );
  } finally {
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }

  assert.equal(seen[0][0], "info");
  assert.equal(seen[1][0], "warn");
  assert.equal(seen[2][0], "error");
  assert.equal(String(seen[2][1]).includes("session-submit-failed"), true);
});
