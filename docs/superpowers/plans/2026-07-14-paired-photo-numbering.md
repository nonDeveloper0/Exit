# 페어 조별 사진 번호 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 사진 번호를 페어 조 수사 그룹별로 발급하고, 전체 초기화 때 모든 그룹의 번호를 `#1`부터 다시 시작하게 한다.

**Architecture:** 클라이언트는 현재 조와 페어 조로 안정적인 그룹 키를 만들고 Supabase RPC에서 그 키의 다음 번호를 원자적으로 발급받는다. 사진 행은 그룹 키와 발급 번호를 함께 저장하고, 전체 삭제 두 경로는 사진 삭제 뒤 RPC로 모든 카운터를 비운다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Postgres/Storage/Realtime, Node test runner.

## Global Constraints

- 텍스트 파일은 UTF-8(BOM 없음)과 LF로 저장한다.
- 사진 업로드·관리자 삭제의 기존 Storage/Realtime 동작을 보존한다.
- 전역 번호와 전역 시퀀스는 새 사진 번호 발급에 사용하지 않는다.
- SQL은 Supabase SQL Editor에서 한 번 실행해야 한다.

---

### Task 1: 페어 조 번호 그룹 키와 회귀 테스트

**Files:**
- Create: `src/lib/photoEvidenceNumbering.ts`
- Create: `tests/photoEvidenceNumbering.test.ts`

**Interfaces:**
- Produces: `getPhotoEvidenceGroupKey(teamId: string, pairings: Record<string, string>): string`
- Produces: `getPhotoEvidenceGroupKey` returns a normalized solo key (`teamId`) or pair key (`smallerTeamId:largerTeamId`).

- [x] **Step 1: Write the failing test**

```ts
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
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/photoEvidenceNumbering.test.ts`

Expected: FAIL because `photoEvidenceNumbering.ts` does not exist.

- [x] **Step 3: Write minimal implementation**

```ts
export function getPhotoEvidenceGroupKey(teamId: string, pairings: Record<string, string>) {
  const normalizedTeamId = teamId.toUpperCase();
  const partnerId = pairings[normalizedTeamId]?.toUpperCase();
  if (!partnerId || partnerId === normalizedTeamId) return normalizedTeamId;
  return [normalizedTeamId, partnerId].sort((left, right) => left.localeCompare(right, "en", { numeric: true })).join(":");
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/photoEvidenceNumbering.test.ts`

Expected: PASS with 2 passing tests.

### Task 2: 사진 업로드에 그룹별 원자 번호 발급 적용

**Files:**
- Modify: `src/lib/usePhotoEvidence.ts`

**Interfaces:**
- Consumes: `getPhotoEvidenceGroupKey(teamId, pairings)` from Task 1.
- Consumes: Supabase RPC `allocate_photo_evidence_number(p_group_key text)` returning `bigint`.
- Produces: every newly inserted `photo_evidence` row includes `evidence_group_key` and its allocated `evidence_number`.

- [x] **Step 1: Add pairing state needed for allocation**

Persist the pairing record returned from `game_state` in state alongside `partnerId`, then compute the group key at upload time from `ownTeamId` and that pairing record.

- [x] **Step 2: Allocate before inserting the photo row**

After the Storage upload succeeds and before inserting into `photo_evidence`, call:

```ts
const { data: evidenceNumber, error: numberError } = await supabase.rpc(
  "allocate_photo_evidence_number",
  { p_group_key: groupKey }
);
if (numberError || typeof evidenceNumber !== "number") throw numberError ?? new Error("사진 번호 발급 실패");
```

Include `evidence_group_key: groupKey` and `evidence_number: evidenceNumber` in the insert payload.

- [x] **Step 3: Verify TypeScript/lint compatibility**

Run: `npm run lint`

Expected: no new lint errors in the modified files.

### Task 3: 관리자 전체 초기화에서 번호 카운터 제거

**Files:**
- Modify: `src/app/admin/page.tsx`

**Interfaces:**
- Consumes: Supabase RPC `reset_photo_evidence_number_counters()`.
- Produces: `사진 전체 삭제` 및 `전체 조 초기화`가 기존 사진 삭제 뒤 번호 카운터도 삭제한다.

- [x] **Step 1: Add a focused helper**

```ts
async function resetAllPhotoNumberCounters() {
  const { error } = await supabase.rpc("reset_photo_evidence_number_counters");
  if (error) throw error;
}
```

- [x] **Step 2: Invoke it in both full-reset paths**

Call the helper after `await deleteAllPhotos()` in `resetAllPhotos` and `handleResetAll`. Do not call it from `handleReset(pairId)`.

- [x] **Step 3: Preserve cleanup UI behavior**

Use `try`/`finally` in full-reset handlers so the loading state is cleared if the RPC reports an error; leave the existing confirmation and refresh behavior intact on success.

### Task 4: Supabase migration and operator documentation

**Files:**
- Modify: `docs/01_md/07_DATA_SCHEMA.md`
- Modify: `docs/01_md/EDIT_GUIDE.md`

**Interfaces:**
- Creates: `photo_evidence.evidence_group_key text not null`.
- Creates: `photo_evidence_number_counters(group_key text primary key, last_number bigint not null)`.
- Creates: RPCs `allocate_photo_evidence_number(text)` and `reset_photo_evidence_number_counters()`.

- [x] **Step 1: Document SQL migration**

Document SQL that adds `evidence_group_key`, replaces the global unique number index with `UNIQUE (evidence_group_key, evidence_number)`, creates the counter table, and creates both RPCs. The allocation function must use `INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING last_number` so concurrent uploads never receive the same number.

- [x] **Step 2: Document operator semantics**

State that a current pair shares one number series, unpaired teams have their own, full photo reset and all-team reset reset all series, and individual-team reset does not reset a series.

### Task 5: Full verification and progress record

**Files:**
- Modify: `progress.md`

- [x] **Step 1: Run targeted tests**

Run: `node --experimental-strip-types --test tests/photoEvidenceNumbering.test.ts`

Expected: PASS.

- [x] **Step 2: Run regression suite**

Run: `npm test`

Expected: all test files pass.

- [x] **Step 3: Run lint and production build**

Run: `npm run lint` and `npm run build`.

Expected: each exits successfully with no new errors attributable to this change.

- [x] **Step 4: Record outcome**

Replace the open progress entry with a completed record listing modified files and note that the documented Supabase SQL must be executed for the live database behavior to take effect.