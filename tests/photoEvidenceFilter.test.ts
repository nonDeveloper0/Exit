import assert from "node:assert/strict";
import test from "node:test";
import { filterPhotoEvidence } from "../src/lib/photoEvidenceFilter.ts";

const photos = [{ id: "a", suspectTag: "A" }, { id: "b", suspectTag: null }];

test("filters a suspect", () =>
  assert.deepEqual(
    filterPhotoEvidence(photos, "A").map((photo) => photo.id),
    ["a"]
  )
);

test("filters untagged photos", () =>
  assert.deepEqual(
    filterPhotoEvidence(photos, "untagged").map((photo) => photo.id),
    ["b"]
  )
);
