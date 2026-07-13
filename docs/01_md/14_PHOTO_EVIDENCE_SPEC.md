# 14. 사진 증거(폴라로이드) + QR 심문권 퀴즈 — 구현 지시서 (Codex용)

작성일: 2026-07-14 / 상태: **구현 대기 (코드 미작성)**

이 문서는 Codex가 그대로 따라 구현하기 위한 지시서다. 결정은 모두 확정됐다. 임의 해석·기능 추가 금지. 불명확하면 멈추고 질문.

---

## 0. 한 줄 요약

증거 "수집" 방식을 **QR 스캔 → 참가자가 물리 단서를 직접 사진 촬영·업로드(폴라로이드)** 로 바꾼다. QR은 폐기하지 않고 **심문권 획득용 퀴즈**로 용도 변경한다. 기존 지정 증거(E01~E16) 시스템은 **삭제하지 말고 보존**(진입점만 차단).

---

## 1. 확정된 결정사항 (사용자 승인 완료)

1. **증거 수집 = 직접 촬영 사진(폴라로이드)**
   - 카메라 버튼 클릭 → 폰 **기본 카메라 앱** 실행 → 촬영 → 업로드. (`<input type="file" accept="image/*" capture="environment">` 방식. getUserMedia 실시간 카메라 아님.)
   - 폴라로이드 UI: 흰 프레임 + 사진 + 아래 **캡션 20자 이내**(`maxLength={20}`).
2. **하이브리드 — 관련 인물 태그 드롭다운(6명 + 미지정)**
   - 업로드 시 어느 인물 관련인지 선택. 값: `A 나사장 / B 채소장 / C 나팀장 / D 이대리 / E 김사원 / PARK 박실장(피해자)`, 그리고 **미지정**(빈 값).
   - 용의자 파일(`/suspects`)에서 해당 인물로 태그된 사진만 필터해 표시.
3. **QR = 심문권 획득 퀴즈로 용도 변경**
   - QR 스캔 → 문제 출제 → 정답 입력 시 **해당 용의자 심문권 획득**. (더 이상 증거 수집 아님.)
   - 현재는 **채소장(B)만** 연결(QR 슬러그 `w3n5k7`, 정답 `poison kill`). 나머지 A·C·D·E는 데이터만 나중에 추가.
4. **공유 범위 = 조별 공유 보드(현재와 동일)** — 같은 조 번호 + 짝 조 실시간 공유. 기존 구독 패턴 재사용.
5. **기존 지정 증거 시스템(E01~E16) 보존**
   - 관련 데이터/로직은 **삭제 금지**. `EVIDENCE`/`QR_CODES` 배열을 통째로 주석 처리하면 import하는 파일에서 **빌드가 깨지므로 배열은 그대로 둔다.** 대신 **진입점(홈 안내문구·증거함 표시·QR 증거 수집 UI)만** 사진/심문권 방식으로 교체한다.

---

## 2. Supabase (이미 세팅 완료 — 참고용)

아래는 이미 실행됨. 코드가 기대하는 스키마이므로 참고만 하고 재실행하지 말 것.

```sql
create table photo_evidence (
  id uuid primary key default gen_random_uuid(),
  pair_id text not null,        -- 조 번호(대문자). 공유 키
  image_url text not null,      -- Storage 공개 URL
  caption text,                 -- 20자 이내, null 허용
  suspect_tag text,             -- 'A'|'B'|'C'|'D'|'E'|'PARK'|null
  created_at timestamptz default now()
);
-- RLS: anon 읽기/쓰기 허용, Realtime 발행 등록됨
-- Storage 버킷: 'evidence-photos' (public read, anon upload)
```

### 2-1. 추가 실행 필요 — 스탭 점검용 status 컬럼 (⚠️ 아직 미실행)

랭킹을 사진 개수로 매기므로 스탭이 스팸 사진을 걸러낼 수 있어야 한다(§11). 소프트 제외용 컬럼을 추가한다. Supabase SQL Editor에서 **한 번 실행**:

```sql
alter table photo_evidence add column status text not null default 'ok';
-- 'ok'      = 정상(랭킹 카운트·보드 노출)
-- 'rejected'= 스탭이 제외(랭킹 미집계, 보드에 흐리게 '제외됨')
```
anon이 UPDATE(status 변경)를 할 수 있도록 RLS가 열려 있어야 한다. 기존 `for all` 정책이면 그대로 동작. (아니면 update 정책만 추가.)

---

## 3. 데이터 모델 변경 — `src/lib/data.ts`

### 3-1. 추가 (기존 `GLOBAL_PAIR_ID` 정의 아래에 삽입)

```ts
// ── 사진 증거(폴라로이드) 방식 ─────────────────────────────────────────
// 참가자가 물리 단서를 직접 촬영해 업로드한다. Supabase Storage 'evidence-photos' + photo_evidence 테이블.
export const PHOTO_BUCKET = "evidence-photos";

// 업로드 시 "관련 인물" 태그 드롭다운(6명). 값이 photo_evidence.suspect_tag 에 저장된다.
// 미지정은 UI에서 빈 문자열("")로 처리하고 DB에는 null로 저장한다.
export const PHOTO_TAGS: { value: string; label: string }[] = [
  { value: "A", label: "나사장" },
  { value: "B", label: "채소장" },
  { value: "C", label: "나팀장" },
  { value: "D", label: "이대리" },
  { value: "E", label: "김사원" },
  { value: "PARK", label: "박실장 (피해자)" },
];

export function photoTagLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return PHOTO_TAGS.find((t) => t.value === value)?.label ?? null;
}
```

### 3-2. 추가 (파일 맨 끝 `QR_CODES` 아래에 삽입)

```ts
// ── QR 심문권 퀴즈 ────────────────────────────────────────────────────
// (구버전: QR = 증거 수집. 사진 방식 전환으로 QR은 이제 '심문권 획득용 퀴즈'다.)
// QR을 찍으면 문제가 뜨고, 정답을 맞히면 해당 용의자 심문권을 획득한다.
// key = QR 슬러그(QR_CODES.id), value = { 대상 용의자, 문제, 정답 }.
export interface InterrogationQuiz {
  suspectId: string;
  question: string;
  answer: string;
}

export const INTERROGATION_QUIZZES: Record<string, InterrogationQuiz> = {
  // 채소장(B) — 기존 E15 퀴즈 재사용
  w3n5k7: {
    suspectId: "B",
    question: "부검표의 독성 반응을 일으킨 살해 방식 두 단어를 영어로 입력하세요.",
    answer: "poison kill",
  },
  // 나머지 용의자(A·C·D·E)는 QR·문제 확정 후 여기에 추가.
};
```

### 3-3. 건드리지 말 것

`EVIDENCE`, `QR_CODES`, `LOCKED_EVIDENCE`, `EVIDENCE_QUIZ`, `SUSPECTS`, `COMMON_EVIDENCE_IDS` 등 **기존 export는 그대로 유지**한다. `Suspect.interrogationTriggerId` 필드도 유지(주석만 갱신 가능). 삭제 금지.

---

## 4. 새 파일 ① — `src/lib/image.ts` (클라이언트 이미지 압축)

목적: 업로드 전 사진 용량을 줄인다(스토리지·전송량 대비, 장당 ~200KB 목표). 캔버스로 리사이즈 + JPEG 재인코딩.
기본값 **1080px / 0.72** — 폴라로이드 표시엔 충분하고 용량은 절반 수준. (동시 업로더는 조당 1명=6~8명뿐이라 폭주 위험은 낮음. 압축은 스토리지·전송량 절감이 주목적.)

```ts
// 촬영 이미지를 긴 변 maxSize 이하로 리사이즈하고 JPEG로 재인코딩한다.
// imageOrientation: "from-image" 로 EXIF 회전 반영(iOS 세로/가로 틀어짐 방지).
export async function compressImage(
  file: File,
  maxSize = 1080,
  quality = 0.72
): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  let { width, height } = bitmap;
  if (width >= height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 컨텍스트를 만들 수 없습니다.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("이미지 압축 실패"))),
      "image/jpeg",
      quality
    )
  );
}
```

---

## 5. 새 파일 ② — `src/lib/usePhotoEvidence.ts` (조별 사진 공유 훅)

기존 `useTeamEvidence.ts`의 pairings/구독 패턴을 그대로 참고해 사진 테이블용으로 만든다.

동작 명세:
- `ownTeamId` = `getTeamInfo().teamNumber.toUpperCase()`.
- `game_state.pairings` 구독으로 `partnerId` 추적(useTeamEvidence와 동일).
- `photo_evidence`에서 `pair_id IN [own, partner]` 행을 `created_at desc`로 조회.
- 각 pair_id별 Realtime `INSERT`/`DELETE` 구독으로 실시간 반영.
- `uploadPhoto(file, caption, suspectTag)`: 압축 → Storage 업로드 → 행 insert → 로컬 상태 즉시 반영.

참조 구현:

```ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";
import { PHOTO_BUCKET } from "./data";
import { compressImage } from "./image";

export interface PhotoItem {
  id: string;
  pairId: string;
  imageUrl: string;
  caption: string | null;
  suspectTag: string | null;
  createdAt: string;
}

interface Row {
  id: string;
  pair_id: string;
  image_url: string;
  caption: string | null;
  suspect_tag: string | null;
  created_at: string;
}

function mapRow(r: Row): PhotoItem {
  return {
    id: r.id,
    pairId: r.pair_id,
    imageUrl: r.image_url,
    caption: r.caption,
    suspectTag: r.suspect_tag,
    createdAt: r.created_at,
  };
}

let channelCounter = 0;
const SELECT_COLS = "id, pair_id, image_url, caption, suspect_tag, created_at";

export function usePhotoEvidence() {
  const [ownTeamId] = useState<string | null>(() => {
    const t = getTeamInfo();
    return t ? t.teamNumber.toUpperCase() : null;
  });
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // pairings 구독 → 파트너 추적
  useEffect(() => {
    if (!ownTeamId) return;
    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        const pairings =
          (data as { pairings?: Record<string, string> } | null)?.pairings ?? {};
        setPartnerId(pairings[ownTeamId] ?? null);
      });
    const ch = supabase
      .channel(`photo_pairings_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const pairings =
            (payload.new as { pairings?: Record<string, string> }).pairings ?? {};
          setPartnerId(pairings[ownTeamId] ?? null);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [ownTeamId]);

  // 사진 fetch + Realtime 구독
  useEffect(() => {
    if (!ownTeamId) {
      setLoading(false);
      return;
    }
    const teamIds = [ownTeamId];
    if (partnerId && partnerId !== ownTeamId) teamIds.push(partnerId);

    supabase
      .from("photo_evidence")
      .select(SELECT_COLS)
      .in("pair_id", teamIds)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPhotos((data as Row[]).map(mapRow));
        setLoading(false);
      });

    const channels = teamIds.map((tid) =>
      supabase
        .channel(`photos_${tid}_${++channelCounter}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "photo_evidence", filter: `pair_id=eq.${tid}` },
          (payload) => {
            const row = mapRow(payload.new as Row);
            setPhotos((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "photo_evidence", filter: `pair_id=eq.${tid}` },
          (payload) => {
            const oldId = (payload.old as { id?: string }).id;
            if (oldId) setPhotos((prev) => prev.filter((p) => p.id !== oldId));
          }
        )
        .subscribe()
    );
    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [ownTeamId, partnerId]);

  const uploadPhoto = useCallback(
    async (file: File, caption: string, suspectTag: string) => {
      if (!ownTeamId) return;
      setUploading(true);
      try {
        const blob = await compressImage(file);
        const path = `${ownTeamId}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
        const { data: inserted, error: insErr } = await supabase
          .from("photo_evidence")
          .insert({
            pair_id: ownTeamId,
            image_url: pub.publicUrl,
            caption: caption.trim() || null,
            suspect_tag: suspectTag || null,
          })
          .select(SELECT_COLS)
          .single();
        if (insErr) throw insErr;
        if (inserted) {
          const row = mapRow(inserted as Row);
          setPhotos((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
        }
      } finally {
        setUploading(false);
      }
    },
    [ownTeamId]
  );

  return { photos, loading, uploading, uploadPhoto, ownTeamId };
}
```

주의: 업로드 실패 시(권한/네트워크) `try/finally`로 `uploading`은 반드시 해제. 에러는 호출부에서 잡아 사용자에게 "업로드 실패, 다시 시도" 토스트/문구로 노출.

### 5-1. status(제외) 반영 — 위 참조 구현에 반영할 것

스탭 점검(§11)을 위해 `photo_evidence.status`를 다룬다. 위 훅에 다음을 반영:
- `PhotoItem`에 `status: string` 추가, `SELECT_COLS`에 `status` 추가, `mapRow`에 `status: r.status ?? "ok"` 추가.
- 각 pair_id 채널에 **UPDATE** 구독 추가 → status 변경 시 해당 사진 갱신:
  ```ts
  .on("postgres_changes",
    { event: "UPDATE", schema: "public", table: "photo_evidence", filter: `pair_id=eq.${tid}` },
    (payload) => {
      const row = mapRow(payload.new as Row);
      setPhotos((prev) => prev.map((p) => (p.id === row.id ? row : p)));
    })
  ```
- 참가자 보드(§7)는 `status === "rejected"` 사진을 **숨기지 말고 흐리게 + "제외됨" 배지**로 표시(왜 개수가 줄었는지 알 수 있게). 원치 않으면 숨김도 가능 — 기본은 흐리게.

---

## 6. `src/lib/useTeamEvidence.ts` 변경 — 심문권 "획득" 상태 추가

지금은 심문권 획득 여부를 `collected.includes(interrogationTriggerId)`(증거 수집 여부)로 판정한다. 증거 수집이 사라지므로, **획득을 별도 상태로 저장**한다. 기존 `interrogation_used`(사용 소모)와 별개.

변경점:
1. 새 타입 마커 `type='interrogation_earned'`, `evidence_id = 용의자ID`, `pair_id = 조`.
2. 상태 `interrogationEarned: string[]`(용의자 ID 목록) 추가.
3. fetch의 `.in("type", ["collected", "interrogation_used"])` → `["collected", "interrogation_used", "interrogation_earned"]`로 확장하고, 결과에서 `interrogation_earned` 행의 `evidence_id`를 모아 `setInterrogationEarned`.
4. Realtime INSERT 핸들러에 `interrogation_earned` 분기 추가(중복 방지 append).
5. 새 함수 `earnInterrogation(suspectId)`:
```ts
const earnInterrogation = useCallback(async (suspectId: string) => {
  if (!ownTeamId || interrogationEarnedRef.current.includes(suspectId)) return;
  setInterrogationEarned((prev) => (prev.includes(suspectId) ? prev : [...prev, suspectId]));
  await supabase.from("team_evidence_items").upsert(
    { pair_id: ownTeamId, evidence_id: suspectId, type: "interrogation_earned" },
    { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
  );
}, [ownTeamId]);
```
   (`collectedRef`처럼 `interrogationEarnedRef`를 두어 최신값 참조.)
6. 반환 객체에 `interrogationEarned`, `earnInterrogation` 추가. **기존 반환값·시그니처는 유지**(소비처 무변경).

> 참고: `team_evidence_items`의 유니크 제약이 `(pair_id, evidence_id, type)`이면 위 upsert가 그대로 동작한다. 만약 제약이 없으면 INSERT 중복이 생길 수 있으니, 그때만 사용자와 상의해 제약을 추가한다(임의 스키마 변경 금지).

---

## 7. `/evidence` → 폴라로이드 보드로 교체 — `src/app/evidence/page.tsx`

기존 파일 전체를 폴라로이드 보드로 **교체**한다. (기존 코드는 git 히스토리에 남으니 파일 내 주석 보존 불필요. 단 `useTeamEvidence` 기반 증거함 로직은 이 파일에서만 제거.)

요구 동작:
1. 상단 헤더: `Evidence Vault` / `증거 보관함` (기존 톤 유지, dark 테마).
2. **촬영 버튼**(크게): 클릭 시 숨겨진 `<input type="file" accept="image/*" capture="environment" hidden>` 클릭. `onChange`로 파일 획득 → `URL.createObjectURL`로 미리보기.
3. **업로드 확인 모달/시트**: 미리보기 이미지 + 캡션 입력(`maxLength={20}`, 남은 글자수 표시) + 관련 인물 `<select>`(첫 옵션 `미지정` value="", 이어서 `PHOTO_TAGS`) + `[업로드]`/`[취소]`.
   - 업로드 중 `uploading`이면 버튼 비활성 + 스피너/`업로드 중…`.
   - 성공 시 모달 닫고 미리보기 URL revoke, 입력 초기화.
   - 실패 시 모달 유지 + 에러 문구.
4. **폴라로이드 그리드**(2열): 각 카드 = 흰 배경 프레임, 상단 사진(정사각 `aspect-square`, `object-cover`), 하단 캡션(손글씨 느낌 폰트, 없으면 흐린 `— 기록 없음 —`), 태그 있으면 작은 칩(`photoTagLabel`).
   - 사진은 원격 Supabase URL이라 **`next/image` 대신 일반 `<img>` 사용**(remotePatterns 설정 불필요). eslint `no-img-element`는 경고 수준이라 빌드 통과. 필요 시 해당 줄에 `// eslint-disable-next-line @next/next/no-img-element`.
   - **전송량 절감**: 그리드 썸네일은 작게 표시하고(`loading="lazy"` 권장), 원본은 **탭했을 때 라이트박스에서만** 전체 로드. 카드 탭 → 라이트박스(전체 이미지, 탭하면 닫힘) — 기존 evidence 라이트박스 스타일 재사용 가능. (파일은 압축본 1장만 사용; 별도 썸네일 생성 불필요.)
5. **빈 상태**: 사진 0장이면 "아직 촬영한 증거가 없습니다. 현장을 사진으로 남기세요." 안내.
6. 로딩 중이면 스켈레톤/`불러오는 중…`.

폴라로이드 캡션 폰트는 `globals.css`에 유틸 하나 추가 가능(예: `.font-hand { font-family: "Segoe Script", "Comic Sans MS", cursive; }`). 없으면 기본 폰트로도 무방.

---

## 8. QR 심문권 퀴즈 — `src/app/qr/[id]/page.tsx` + `QrPageClient.tsx`

### 8-1. `page.tsx`(서버 컴포넌트)
- `QR_CODES`로 슬러그 유효성 검사는 유지(없으면 `notFound()`). 인쇄된 QR이 계속 resolve되어야 함.
- `INTERROGATION_QUIZZES[id]`를 찾아 클라이언트로 전달. 증거(`EVIDENCE.filter…`)는 더 이상 넘기지 않아도 됨.
```ts
import { QR_CODES, INTERROGATION_QUIZZES, SUSPECTS } from "@/lib/data";
// ...
const qr = QR_CODES.find((q) => q.id === id);
if (!qr) notFound();
const quiz = INTERROGATION_QUIZZES[id] ?? null;
const suspect = quiz ? SUSPECTS.find((s) => s.id === quiz.suspectId) ?? null : null;
return <QrPageClient qrId={qr.id} location={qr.location} quiz={quiz} suspectName={suspect?.name ?? null} />;
```

### 8-2. `QrPageClient.tsx`(교체)
Props: `{ qrId, location, quiz: InterrogationQuiz | null, suspectName: string | null }`. `useTeamEvidence`에서 `interrogationEarned`, `earnInterrogation` 사용.

동작:
- `quiz`가 없으면: "이 지점에는 아직 등록된 문제가 없습니다." 안내(구버전 증거 수집 UI 제거).
- `quiz`가 있으면:
  - 이미 `interrogationEarned.includes(quiz.suspectId)`면 "이미 심문권을 획득했습니다" 완료 카드.
  - 아니면 문제(`quiz.question`) + 정답 입력창 + `확인`. 정답 비교는 기존 `normalizeAnswer`(공백 제거·소문자) 재사용.
  - 정답이면 `await earnInterrogation(quiz.suspectId)` → 진동(`navigator.vibrate?.(30)`) + "🎫 {suspectName} 심문권 획득!" 성공 표시.
  - 오답이면 "정답이 아닙니다" 표시.
- 하단 링크는 `/suspects`("용의자 파일에서 심문권 확인 →")로.
- 기존 오디오/비디오/이미지 힌트 렌더는 이 화면에서 **제거**(심문권 퀴즈에는 불필요).

---

## 9. `src/app/suspects/page.tsx` 변경

1. `usePhotoEvidence` 추가로 `photos` 가져오기. `useTeamEvidence`에서 `interrogationEarned`, (기존)`interrogationUsed`, `markInterrogationUsed` 사용.
2. **심문권 획득 판정 교체**:
   - 기존: `const interrogationEarned = s.interrogationTriggerId ? collected.includes(s.interrogationTriggerId) : false;`
   - 변경: `const earned = interrogationEarned.includes(s.id);` 로 판정. 티켓/잠금/사용완료 UI는 그대로 두되 조건만 `earned` 기반으로.
   - 잠김 안내 문구: "특정 단서를 찾으면…" → "해당 QR 문제를 풀면 이 용의자의 심문권을 얻습니다."
   - 심문권 섹션 노출 조건도 `s.interrogationTriggerId` 대신 **`INTERROGATION_QUIZZES`에 이 용의자를 대상으로 하는 퀴즈가 있는지**로 바꾸는 게 정확하다. 헬퍼: `const hasQuiz = Object.values(INTERROGATION_QUIZZES).some((q) => q.suspectId === s.id);` → `hasQuiz`일 때만 심문권 섹션 표시. (현재는 B만 노출됨.)
3. **관련 단서(E-증거) 섹션 → 관련 사진 섹션으로 교체**:
   - 기존 `relatedEvidenceIds` 기반 블록은 증거 수집이 사라져 항상 🔒로만 보이므로 **주석 처리(보존)** 하고, 대신 `photos.filter((p) => p.suspectTag === s.id)`를 썸네일 그리드로 표시("관련 사진 N장"). 사진 없으면 "이 인물로 태그된 사진이 없습니다."
   - 썸네일 탭 → 라이트박스(선택).
4. 수사 노트(textarea) 등 나머지는 그대로 유지.

---

## 10. `src/app/home/page.tsx` 변경 (진입 안내 최신화)

- "증거 수집 현황 {collected}/{EVIDENCE.length}" 진행바 → **팀 사진 장수** 기준으로 변경하거나, 혼동되면 진행바 자체를 제거하고 간단한 안내로 대체. (권장: `usePhotoEvidence().photos.length` 장수 표시.)
- "수사 방법" 안내문구 교체:
  1. 현장의 물리 단서를 **사진으로 촬영해 증거함에 올린다**.
  2. 사진마다 **관련 인물**을 태그한다.
  3. QR을 찍어 **문제를 풀면 용의자 심문권**을 얻는다.
  4. 범인을 선택하고 최종 추리를 제출한다.
- "장소별 단서 현황" 블록은 증거 수집 기반이라 의미가 사라짐 → **주석 처리(보존)** 하거나 제거. (권장: 주석 처리.)

---

## 11. 실시간 랭킹(사진 개수) + 스탭 사진 점검

**확정:** 랭킹은 **조별 사진 장수** 기준. 모더레이션은 **"즉시 카운트 + 사후 제외(soft-reject)"** — 사진은 올리는 즉시 카운트되고, 스탭이 `/admin`에서 스팸을 `제외`하면 카운트에서 빠진다(삭제 아님, 복원 가능).

### 11-1. `src/lib/useAllTeamsProgress.ts` 변경 (사진 개수 집계로 전환)

핵심: 카운트 소스를 `team_evidence_items`(collected 증거) → `photo_evidence`(status='ok' 사진 개수)로 바꾼다. 단, **0장인 조도 목록에 뜨도록** 입장 마커(`team_evidence_items.type='joined'`)는 계속 사용한다. 짝 조 그룹화(`pairings`) 로직은 유지.

- 사진 개수는 **행 개수**다(증거 ID 집합이 아님). 짝 조 그룹 count = 두 조 각각의 사진 개수 **합**. 전역 공통 단서(`__global`) 개념은 사진엔 없음.
- 상태: `photoCount: Record<string, number>`(조→사진수), `joinedTeams: Set<string>`(입장한 조), `pairings` 유지.
- 초기 조회 2건:
  ```ts
  // 조별 사진 개수 (status='ok'만)
  const { data: photos } = await supabase
    .from("photo_evidence").select("pair_id, status");
  // 입장한 조 (0장도 표시)
  const { data: joins } = await supabase
    .from("team_evidence_items").select("pair_id, type").eq("type", "joined");
  ```
  `photoCount[pair_id]` = status가 'ok'인 행 수. `joinedTeams` = joins의 pair_id 집합.
- Realtime 구독:
  - `photo_evidence` INSERT(status='ok') → 해당 조 count +1
  - `photo_evidence` UPDATE → status가 ok↔rejected로 바뀌면 해당 조 count ±1 (payload.old/new 비교; old가 안 오면 아래 DELETE처럼 전체 재조회로 폴백)
  - `photo_evidence` DELETE → 해당 조 count 재계산(간단히 전체 재조회 허용)
  - `team_evidence_items` INSERT(type='joined') → `joinedTeams`에 추가
  - `game_state` UPDATE → pairings 갱신(기존 유지)
- 그룹 생성: 기존 짝 조 묶기 로직 재사용하되, **조 목록의 소스**를 `joinedTeams ∪ Object.keys(photoCount)`로, **count**를 `photoCount[team] ?? 0`으로. 짝이면 두 조 합.
- 반환 `total`: 사진엔 정답 총량이 없으므로 `total`은 제거하거나 의미 재정의. `/ranking`이 `total`을 쓰면 "가장 많이 모은 조 수" 등으로 대체하거나 표기 삭제.
- `EVIDENCE`, `RANKING_EXCLUDED_EVIDENCE_IDS`, `GLOBAL_PAIR_ID` 관련 import는 사진 집계에선 불필요 → 정리(단 파일 밖 상수 삭제 금지, import만 제거).

### 11-2. `src/app/ranking/page.tsx` 조정

- `count` 단위 표기를 "단서 N" → **"사진 N장"** 으로. 그룹 렌더링·1~3위 색상·내 조 강조 로직은 그대로.
- `total` 표기를 쓰고 있으면 위 변경에 맞춰 문구 조정/삭제.

### 11-3. `/admin` 사진 점검 패널 (신규 섹션)

기존 `/admin`(PIN 게이트)에 **"사진 점검"** 섹션을 기존 섹션 컨벤션대로 추가:
- 전체 조 사진을 `photo_evidence`에서 조회(최신순), **조별 필터** 드롭다운 제공.
- 카드마다: 썸네일(작게 표시 + `loading="lazy"`, 탭 시에만 원본 라이트박스 로드 — 전체 조를 한 번에 원본으로 받지 않게), 조 번호, 캡션, 태그 라벨(`photoTagLabel`), 촬영 시각.
- status='ok' 카드엔 `제외` 버튼 → `update({status:'rejected'}).eq('id', id)`. status='rejected' 카드엔 흐린 표시 + `복원` 버튼 → `status:'ok'`.
- Realtime로 다른 스탭·참가자 화면과 동기화(훅의 UPDATE 구독이 처리).
- 실수 방지: `제외`는 1탭으로 즉시(복원 가능하므로 확인 단계 불필요). **영구 삭제 버튼은 넣지 않는다**(감사 로그 보존).

### 11-4. 기타

- 하단 네비 `증거함(/evidence)` 라벨·경로 유지(내용만 폴라로이드 보드로 바뀜). 변경 불필요.

---

## 12. 보존 규칙 (중요)

- `data.ts`의 `EVIDENCE`, `QR_CODES`, `LOCKED_EVIDENCE`, `EVIDENCE_QUIZ`, `COMMON_EVIDENCE_IDS`, `Suspect.interrogationTriggerId` **삭제 금지**. 다른 파일에서 import 중이라 빌드가 깨진다.
- UI에서 안 쓰게 된 옛 블록은 **주석 처리로 보존**(삭제 X). 단 `/evidence`, `QrPageClient`처럼 통째로 교체하는 파일은 예외(git에 남음).
- 임의 스키마 변경·기능 추가 금지. 유니크 제약 등 확신 안 서면 멈추고 질문.

---

## 13. 인코딩·스타일 규칙 (프로젝트 공통)

- 모든 파일 **UTF-8(BOM 없음) + LF**. PowerShell 리다이렉트로 한글 파일 쓰지 말 것.
- 기존 다크(zinc/amber) 톤·Tailwind 관습에 맞출 것. 새 추상화·설정 옵션 금지(요청된 것만).
- `npm run lint`, `npm run build` 통과 필수(기존 경고 2건은 허용).

---

## 14. 수용 기준 (구현 완료 판정)

- [ ] `/evidence`에서 카메라 버튼 → 폰 기본 카메라 실행 → 촬영 후 캡션(20자 제한)·인물 태그(미지정 포함) 입력 → 업로드 → 폴라로이드로 즉시 표시.
- [ ] 같은 조 번호(및 짝 조) 다른 기기에서 실시간으로 같은 폴라로이드가 보임.
- [ ] 캡션은 20자를 넘길 수 없음(`maxLength`), 태그 라벨이 폴라로이드에 표시됨.
- [ ] `/suspects`에서 각 용의자의 태그된 사진이 보임(예: B로 태그한 사진이 채소장 파일에).
- [ ] QR `w3n5k7` 접속 → 문제 표시 → `poison kill` 입력 → 채소장(B) 심문권 획득 → `/suspects`의 채소장 심문권 티켓 활성화(조/짝 조 공유).
- [ ] 심문권 없는 QR 슬러그 접속 시 "등록된 문제가 없습니다" 안내.
- [ ] `/ranking`이 **조별 사진 장수** 기준으로 실시간 갱신되고, 0장 조도 표시됨(짝 조 합산 유지).
- [ ] `/admin` 사진 점검에서 스팸 사진 `제외` → 랭킹 카운트 즉시 감소 + 참가자 보드에 "제외됨" 표시. `복원` 시 원복.
- [ ] 기존 `EVIDENCE`/`QR_CODES` 등 데이터는 유지되고 빌드가 깨지지 않음.
- [ ] `npm run build` 통과.

---

## 15. 작업 후 문서 업데이트 지시

- `progress.md` "작업완료"에 구현 내역·변경 파일 기록(CLAUDE.md 규칙).
- `docs/01_md/EDIT_GUIDE.md`에 운영자용 항목 추가: (a) 인물 태그 목록(`PHOTO_TAGS`) 수정법, (b) QR↔용의자 심문권 퀴즈(`INTERROGATION_QUIZZES`)에 A·C·D·E 추가하는 법(슬러그·문제·정답 예시), (c) 사진이 저장되는 Supabase 위치(`photo_evidence` + `evidence-photos` 버킷), (d) **스탭 사진 점검 사용법**(`/admin` 사진 점검에서 스팸 `제외`/`복원`, 제외 시 랭킹에서 빠짐).
- `07_DATA_SCHEMA.md`에 `photo_evidence` 테이블(`status` 컬럼 포함)과 `interrogation_earned` 마커 추가. 랭킹 집계 소스가 사진 개수로 바뀐 점 명시.
