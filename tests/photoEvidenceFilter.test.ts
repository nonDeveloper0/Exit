import assert from "node:assert/strict";
import test from "node:test";
import { filterPhotoEvidence } from "../src/lib/photoEvidenceFilter.ts";

const photos = [{ id: "a", locationTag: "WAREHOUSE" }, { id: "b", locationTag: "NA_CEO_OFFICE" }];

test("filters a location", () =>
  assert.deepEqual(
    filterPhotoEvidence(photos, "WAREHOUSE").map((photo) => photo.id),
    ["a"]
  )
);

test("returns no photos from another location", () =>
  assert.deepEqual(
    filterPhotoEvidence(photos, "CHAE_MANAGER_LAB").map((photo) => photo.id),
    []
  )
);
