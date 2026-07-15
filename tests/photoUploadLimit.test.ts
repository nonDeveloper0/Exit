import assert from "node:assert/strict";
import test from "node:test";
import { MAX_PHOTOS_PER_GROUP, hasReachedPhotoLimit, remainingPhotoSlots } from "../src/lib/photoUploadLimit.ts";

test("limits each group to 30 uploaded photos independently", () => {
  assert.equal(MAX_PHOTOS_PER_GROUP, 30);
  assert.equal(hasReachedPhotoLimit(29), false);
  assert.equal(hasReachedPhotoLimit(30), true);
  assert.equal(remainingPhotoSlots(29), 1);
  assert.equal(remainingPhotoSlots(30), 0);
  assert.equal(remainingPhotoSlots(31), 0);
});
