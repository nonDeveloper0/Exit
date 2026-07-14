# 사진 증거 태그 편집 및 용의자 필터 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 증거함 사진의 관련 인물 태그를 공유 구성원이 수정하고 용의자별로 필터링할 수 있게 한다.

**Architecture:** 필터 판정은 순수 함수로 분리하고 Node 기본 테스트로 검증한다. `usePhotoEvidence`는 Supabase 태그 갱신만 담당하며, `/evidence`는 필터 칩과 라이트박스 편집 시트로 이를 사용한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Node.js built-in test runner, ESLint.

## Global Constraints

- UTF-8(BOM 없음)과 LF를 유지한다.
- `photo_evidence.suspect_tag`만 갱신하며 Storage 재업로드와 DB 마이그레이션은 하지 않는다.
- 같은 조와 짝 조 구성원은 사진 태그를 함께 수정할 수 있다.
- 필터 선택은 화면 로컬 상태로만 유지한다.

---

### Task 1: 필터 함수와 테스트

**Files:**
- Create: `src/lib/photoEvidenceFilter.ts`
- Create: `tests/photoEvidenceFilter.test.ts`
- Modify: `package.json`

**Interfaces:** `filterPhotoEvidence<T extends { suspectTag: string | null }>(photos: T[], filter: "all" | "untagged" | string): T[]`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { filterPhotoEvidence } from "../src/lib/photoEvidenceFilter";

const photos = [{ id: "a", suspectTag: "A" }, { id: "b", suspectTag: null }];
test("filters a suspect", () => assert.deepEqual(filterPhotoEvidence(photos, "A").map((p) => p.id), ["a"]));
test("filters untagged photos", () => assert.deepEqual(filterPhotoEvidence(photos, "untagged").map((p) => p.id), ["b"]));
test("keeps all photos", () => assert.equal(filterPhotoEvidence(photos, "all").length, 2));
```

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/photoEvidenceFilter.test.ts`

Expected: FAIL because the imported module does not exist.

- [ ] **Step 3: Implement the minimum function**

```ts
export type PhotoFilter = "all" | "untagged" | string;
export function filterPhotoEvidence<T extends { suspectTag: string | null }>(photos: T[], filter: PhotoFilter): T[] {
  if (filter === "all") return photos;
  if (filter === "untagged") return photos.filter((photo) => !photo.suspectTag);
  return photos.filter((photo) => photo.suspectTag === filter);
}
```

- [ ] **Step 4: Verify GREEN and add test command**

Add `"test": "node --experimental-strip-types --test tests/**/*.test.ts"` to `package.json` then run `npm test`.

- [ ] **Step 5: Commit**

Run: `git add package.json src/lib/photoEvidenceFilter.ts tests/photoEvidenceFilter.test.ts && git commit -m "test: cover photo evidence filtering"`

### Task 2: Shared tag update hook and evidence screen

**Files:**
- Modify: `src/lib/usePhotoEvidence.ts`
- Modify: `src/app/evidence/page.tsx`
- Modify: `progress.md`

**Interfaces:** `usePhotoEvidence()` returns `updatePhotoTag(photoId: string, suspectTag: string): Promise<void>` and `updatingPhotoId: string | null`.

- [ ] **Step 1: Make the evidence screen reference the missing API (RED)**

```ts
const { updatePhotoTag, updatingPhotoId } = usePhotoEvidence();
await updatePhotoTag(lightboxPhoto.id, editedSuspectTag);
```

Run: `npm run lint`

Expected: FAIL because the hook does not return this API.

- [ ] **Step 2: Implement the hook API (GREEN)**

```ts
const [updatingPhotoId, setUpdatingPhotoId] = useState<string | null>(null);
const updatePhotoTag = useCallback(async (photoId: string, suspectTag: string) => {
  setUpdatingPhotoId(photoId);
  try {
    const { error } = await supabase.from("photo_evidence").update({ suspect_tag: suspectTag || null }).eq("id", photoId);
    if (error) throw error;
  } finally { setUpdatingPhotoId(null); }
}, []);
```

Return both values. Keep the existing UPDATE Realtime subscription as the state authority.

- [ ] **Step 3: Add filter and edit UX**

Use `PhotoFilter` and `filterPhotoEvidence` to render `전체`, every `PHOTO_TAGS` item, and `미지정` chips above the board. Show a no-results message when the active filter has no matches. Replace the lightbox URL state with the selected `PhotoItem`; add a `관련 인물 수정` button that opens a select with current tag, `미지정`, save, and cancel. Disable save/cancel during its update and display an error without closing on failure.

- [ ] **Step 4: Verify and record work**

Run: `npm test && npm run lint && npm run build`

Expected: tests pass, lint has no new errors, and production build succeeds.

Record the finished work and files in `progress.md`.

- [ ] **Step 5: Commit**

Run: `git add src/lib/usePhotoEvidence.ts src/app/evidence/page.tsx progress.md && git commit -m "feat: edit and filter photo evidence tags"`

### Task 3: Final validation and push

**Files:** Verify only the Task 1-2 files.

- [ ] **Step 1: Inspect scope**

Run: `git status --short`

Expected: the unrelated untracked image `docs/03_src/01_Images/20260713_130012.png` remains untouched.

- [ ] **Step 2: Re-run verification**

Run: `npm test && npm run lint && npm run build`

Expected: every command exits 0.

- [ ] **Step 3: Push**

Run: `git push origin master`

Expected: remote `master` receives the documentation and feature commits.
