import assert from "node:assert/strict";
import test from "node:test";
import { STAFF_LEADER_NAMES, isStaffLeaderName } from "../src/lib/staffRole.ts";

test("grants fixed leader access to the fifteen staff names", () => {
  assert.equal(STAFF_LEADER_NAMES.length, 15);
  for (const name of STAFF_LEADER_NAMES) assert.equal(isStaffLeaderName(name), true);
});

test("does not grant fixed leader access to other names", () => {
  assert.equal(isStaffLeaderName("참가자"), false);
  assert.equal(isStaffLeaderName(" 김은비 "), true);
});

test("grants leader access to staff names added by an administrator", () => {
  assert.equal(isStaffLeaderName("추가스탭", ["추가스탭"]), true);
  assert.equal(isStaffLeaderName(" 추가스탭 ", ["추가스탭"]), true);
  assert.equal(isStaffLeaderName("참가자", ["추가스탭"]), false);
});
