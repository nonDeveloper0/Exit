import assert from "node:assert/strict";
import test from "node:test";
import { MAX_PHOTOS_PER_TEAM, hasReachedPhotoLimit, remainingPhotoSlots } from "../src/lib/photoUploadLimit.ts";

test("limits each team to 30 uploaded photos", () => {
  assert.equal(MAX_PHOTOS_PER_TEAM, 30);
  assert.equal(hasReachedPhotoLimit(29), false);
  assert.equal(hasReachedPhotoLimit(30), true);
  assert.equal(remainingPhotoSlots(29), 1);
  assert.equal(remainingPhotoSlots(30), 0);
  assert.equal(remainingPhotoSlots(31), 0);
});