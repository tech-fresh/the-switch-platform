import test from "node:test";
import assert from "node:assert/strict";

test("daily motivation is stable for the same UTC date", async () => {
  const { getDailyMotivation } = await import("../src/modules/motivation/service.ts");

  const morning = getDailyMotivation(new Date("2026-06-12T08:00:00.000Z"));
  const evening = getDailyMotivation(new Date("2026-06-12T20:30:00.000Z"));

  assert.deepEqual(evening, morning);
});

test("daily motivation changes across different UTC dates", async () => {
  const { getDailyMotivation } = await import("../src/modules/motivation/service.ts");

  const firstDay = getDailyMotivation(new Date("2026-06-12T08:00:00.000Z"));
  const secondDay = getDailyMotivation(new Date("2026-06-13T08:00:00.000Z"));

  assert.notDeepEqual(secondDay, firstDay);
});

test("daily motivation exposes curated attribution metadata", async () => {
  const { getDailyMotivation } = await import("../src/modules/motivation/service.ts");

  const motivation = getDailyMotivation(new Date("2026-06-12T08:00:00.000Z"));

  assert.ok(motivation.speaker);
  assert.ok(motivation.region.includes("·"));
  assert.ok(motivation.occupation);
  assert.ok(motivation.theme);
  assert.ok(motivation.focusLabel);
  assert.ok(motivation.reflection);
});
