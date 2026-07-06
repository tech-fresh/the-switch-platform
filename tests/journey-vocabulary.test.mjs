import test from "node:test";
import assert from "node:assert/strict";
import { getJourneyVocabulary } from "../src/modules/journey/vocabulary.ts";

test("journey vocabulary entries are unique and non-empty", () => {
  const vocabulary = getJourneyVocabulary();
  const ids = vocabulary.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(vocabulary.every((entry) => entry.label.trim().length > 0));
  assert.equal(vocabulary.length, 8);
});
