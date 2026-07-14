import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("places live team-photo status on headquarters and removes the ranking route", () => {
  const home = read("src/app/home/page.tsx");
  const navigation = read("src/components/BottomNav.tsx");

  assert.match(home, /useAllTeamsProgress/);
  assert.match(home, /getTeamInfo/);
  assert.match(home, /groups\.map/);
  assert.match(home, /\(나\)/);
  assert.match(home, /사진 \{group\.count\}장/);
  assert.match(home, /아직 수집 중인 조가 없습니다/);
  assert.match(home, /실시간 업데이트 중/);
  assert.doesNotMatch(navigation, /\/ranking/);
  assert.equal(existsSync(join(root, "src/app/ranking/page.tsx")), false);
});