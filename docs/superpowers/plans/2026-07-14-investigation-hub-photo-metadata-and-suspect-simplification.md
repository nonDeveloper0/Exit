# 수사본부·사진 메타데이터·용의자 화면 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 수사 현황을 수사본부로 통합하고, 고화질·인물/장소·번호 메타데이터 사진과 심문권 중심 용의자 화면을 제공한다.

**Architecture:** `useAllTeamsProgress`의 기존 실시간 그룹 데이터를 `/home`에서 재사용한다. 사진 행의 새 메타데이터는 Supabase migration으로 추가하고 `usePhotoEvidence`가 조회·삽입·수정·Realtime 갱신한다. 증거함은 같은 훅 API로 인물 필터와 인물·장소 편집을 제공한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Node 22 built-in test runner, ESLint.

## Global Constraints

- 모든 텍스트 파일은 UTF-8(BOM 없음)과 LF를 사용한다.
- 새 사진만 2048px/JPEG 0.90으로 압축하며 기존 Storage 파일을 재처리하지 않는다.
- `evidence_number`는 전역 단조 증가·영구 번호다.
- 장소는 표시·수정만 하고 증거함 필터에는 넣지 않는다.
- 관련 없는 `docs/03_src/01_Images/20260713_130012.png`는 수정·커밋하지 않는다.

---

### Task 1: 데이터베이스 migration과 공유 타입

**Files:**
- Modify: `docs/01_md/07_DATA_SCHEMA.md`
- Modify: `src/lib/data.ts`
- Modify: `src/lib/usePhotoEvidence.ts`

**Interfaces:** `PHOTO_LOCATION_TAGS`, `photoLocationTagLabel(value)`, `PhotoItem.locationTag`, `PhotoItem.evidenceNumber`.

- [ ] **Step 1: Apply this SQL in Supabase SQL Editor**

```sql
ALTER TABLE photo_evidence ADD COLUMN IF NOT EXISTS location_tag TEXT;
ALTER TABLE photo_evidence ADD COLUMN IF NOT EXISTS evidence_number BIGINT;
CREATE SEQUENCE IF NOT EXISTS photo_evidence_number_seq;
WITH numbered AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC, id ASC) AS number
  FROM photo_evidence WHERE evidence_number IS NULL
)
UPDATE photo_evidence p SET evidence_number = numbered.number FROM numbered WHERE p.id = numbered.id;
SELECT setval('photo_evidence_number_seq', COALESCE((SELECT max(evidence_number) FROM photo_evidence), 0) + 1, false);
ALTER TABLE photo_evidence ALTER COLUMN evidence_number SET DEFAULT nextval('photo_evidence_number_seq');
ALTER TABLE photo_evidence ALTER COLUMN evidence_number SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS photo_evidence_evidence_number_key ON photo_evidence (evidence_number);
```

- [ ] **Step 2: Extend app data contracts**

Add the five exact location options to `PHOTO_LOCATION_TAGS`; map `location_tag` and `evidence_number` in `Row`, `PhotoItem`, and `SELECT_COLS`. Insert `location_tag` during upload.

- [ ] **Step 3: Verify migration data from the app**

Run: `npm run lint`

Expected: no TypeScript or ESLint errors from the added fields.

- [ ] **Step 4: Document schema and commit**

Document the migration, null=미지정 behaviour, and permanent-number semantics in `07_DATA_SCHEMA.md`.

Run: `git add src/lib/data.ts src/lib/usePhotoEvidence.ts docs/01_md/07_DATA_SCHEMA.md && git commit -m "feat: add photo location and evidence numbers"`

### Task 2: Filter test and high-quality image compression

**Files:**
- Create: `src/lib/photoEvidenceFilter.ts`
- Create: `tests/photoEvidenceFilter.test.ts`
- Modify: `package.json`
- Modify: `src/lib/image.ts`

**Interfaces:** `filterPhotoEvidence<T extends { suspectTag: string | null }>(photos, filter)` where filter is `"all" | "untagged" | string`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { filterPhotoEvidence } from "../src/lib/photoEvidenceFilter.ts";
const photos = [{ id: "a", suspectTag: "A" }, { id: "b", suspectTag: null }];
test("filters a suspect", () => assert.deepEqual(filterPhotoEvidence(photos, "A").map((p) => p.id), ["a"]));
test("filters untagged photos", () => assert.deepEqual(filterPhotoEvidence(photos, "untagged").map((p) => p.id), ["b"]));
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/photoEvidenceFilter.test.ts`

Expected: FAIL because `filterPhotoEvidence` is absent.

- [ ] **Step 3: Implement filter and test command**

Implement the two branch checks for `all`, `untagged`, and matching suspect tag. Add `"test": "node --experimental-strip-types --test tests/*.test.ts"` to `package.json`.

- [ ] **Step 4: Change compressor defaults**

Set `compressImage(file, maxSize = 2048, quality = 0.9)`.

- [ ] **Step 5: Verify GREEN and commit**

Run: `npm test && npm run lint`

Expected: tests pass and lint has no new errors.

Run: `git add package.json tests/photoEvidenceFilter.test.ts src/lib/photoEvidenceFilter.ts src/lib/image.ts && git commit -m "feat: improve photo evidence quality"`

### Task 3: Evidence board metadata, editing, and layout

**Files:**
- Modify: `src/app/evidence/page.tsx`

**Interfaces:** `usePhotoEvidence()` returns `updatePhotoMetadata(id, suspectTag, locationTag): Promise<void>` and `updatingPhotoId`.

- [ ] **Step 1: Make the screen reference the missing update API (RED)**

Run: `npm run lint`

Expected: FAIL after adding `await updatePhotoMetadata(lightboxPhoto.id, editedSuspectTag, editedLocationTag)` before the hook API exists.

- [ ] **Step 2: Implement the hook update API**

Update only `{ suspect_tag: suspectTag || null, location_tag: locationTag || null }`, set/reset `updatingPhotoId` in `finally`, throw Supabase errors, and return the API. Existing UPDATE subscription remains the shared state authority.

- [ ] **Step 3: Build registration and board UI**

Rename all visible caption labels to `증거 설명`; add location selection; display permanent `#${photo.evidenceNumber}` at the polaroid upper-left and person/location chips below the description. Use `"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive` for descriptions.

- [ ] **Step 4: Add filtering and metadata editor**

Render `전체`, each `PHOTO_TAGS` item, and `미지정`; render only `filterPhotoEvidence(photos, activeFilter)`. The lightbox uses the selected `PhotoItem`, shows both labels, and opens an edit sheet with person/location selects, save/cancel, busy state, and retry error.

- [ ] **Step 5: Fix mobile sheet overlap and verify**

Use `max-h-[calc(100dvh-5rem)] overflow-y-auto pb-24` on the sheet and render it with `items-end`; this ensures its controls clear the fixed BottomNav. Run `npm test && npm run lint && npm run build`.

- [ ] **Step 6: Commit**

Run: `git add src/lib/usePhotoEvidence.ts src/app/evidence/page.tsx && git commit -m "feat: edit photo evidence metadata"`

### Task 4: Investigation hub and navigation

**Files:**
- Modify: `src/app/home/page.tsx`
- Modify: `src/components/BottomNav.tsx`
- Delete: `src/app/ranking/page.tsx`

**Interfaces:** `/home` consumes `groups` from `useAllTeamsProgress`; navigation has no `/ranking` item.

- [ ] **Step 1: Move ranking UI**

Copy the group rendering from the deleted ranking page directly below the existing `수사 방법` card in `/home`, including rank colours, `(나)`, photo counts, empty state, and real-time status. Keep `getTeamInfo` local state only for the current-team highlight.

- [ ] **Step 2: Remove the old entrypoints**

Remove the `현황` navigation item and delete the `/ranking` page.

- [ ] **Step 3: Verify and commit**

Run: `npm run lint && npm run build`

Expected: no reference remains to `/ranking` and build succeeds.

Run: `git add src/app/home/page.tsx src/components/BottomNav.tsx src/app/ranking/page.tsx && git commit -m "feat: move investigation status to headquarters"`

### Task 5: Suspect file simplification and documentation

**Files:**
- Modify: `src/app/suspects/page.tsx`
- Modify: `docs/01_md/EDIT_GUIDE.md`
- Modify: `progress.md`

- [ ] **Step 1: Remove unused suspect details**

Delete photo hook, related-photo state/lightbox, motive helper and its collected dependency, description/motive/photo/legacy-evidence UI. Preserve only mugshot/name, interrogation, and notes.

- [ ] **Step 2: Show interrogation for every suspect**

Always render the section. If no quiz targets a suspect, render `🔒 QR 문제 연결 대기 중`; otherwise retain earned/used/usable UI and QR-driven state.

- [ ] **Step 3: Update operational guidance**

Record the new photo quality, location options, SQL migration, permanent numbering, metadata edit, and deferred QR mappings. Record the finished work and files in `progress.md`.

- [ ] **Step 4: Verify and commit**

Run: `npm test && npm run lint && npm run build`

Run: `git add src/app/suspects/page.tsx docs/01_md/EDIT_GUIDE.md progress.md && git commit -m "feat: simplify suspect interrogation files"`

### Task 6: Final verification and push

- [ ] **Step 1: Inspect final scope**

Run: `git status --short && git log --oneline -6`

Expected: only intended source, tests, docs, and feature commits are included; unrelated image remains untracked.

- [ ] **Step 2: Re-run complete verification**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0 apart from documented pre-existing lint warnings.

- [ ] **Step 3: Push after Supabase migration has been applied**

Run: `git push origin master`

Expected: remote master receives all design and feature commits.
