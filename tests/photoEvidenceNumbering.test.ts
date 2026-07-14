import assert from "node:assert/strict";
import test from "node:test";
import { getPhotoEvidenceGroupKey } from "../src/lib/photoEvidenceNumbering.ts";

test("uses the same key for both teams in a pair", () => {
  const pairings = { "1": "4", "4": "1" };
  assert.equal(getPhotoEvidenceGroupKey("1", pairings), "1:4");
  assert.equal(getPhotoEvidenceGroupKey("4", pairings), "1:4");
});

test("keeps an unpaired team in its own number space", () => {
  assert.equal(getPhotoEvidenceGroupKey("2", { "1": "4", "4": "1" }), "2");
});