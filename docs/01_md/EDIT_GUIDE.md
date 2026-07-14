# EXIT SEASON1 — 직접 수정 가이드

수정할 일이 생겼을 때 어느 파일의 어느 부분을 고치면 되는지 정리한 문서입니다.

---

## 1. 증거 내용 수정 (제목, 설명, 이미지)

**파일:** `src/lib/data.ts`

```ts
{
  id: "E01",
  title: "목격자 진술",              // ← 증거 제목
  description: "당일 밤 현장 인근...", // ← 증거 설명
  imageUrl: "/evidence.png",          // ← 이미지 (없으면 이 줄 삭제)
  audioUrl: "/audio/E01.mp3",         // ← 음성 힌트 (없으면 이 줄 삭제)c
},
```

**이미지 추가 방법:**
1. 이미지 파일을 `public/` 폴더에 넣는다 (예: `public/cctv.png`)
2. 해당 evidence에 `imageUrl: "/cctv.png"` 추가

---

## 1-1. 증거 음성 힌트 추가

**파일:** `src/lib/data.ts` + `public/audio/` 폴더

**음성 파일 등록 방법:**
1. 음성 파일을 `public/audio/` 폴더에 넣는다 (예: `public/audio/E01.mp3`)
2. 해당 evidence에 `audioUrl: "/audio/E01.mp3"` 추가

```ts
{
  id: "E01",
  title: "목격자 진술",
  description: "당일 밤 현장 인근...",
  audioUrl: "/audio/E01.mp3",   // ← 이 줄 추가
},
```

- `audioUrl`이 없는 증거 → 재생 버튼 자체가 표시되지 않음
- 재생 중 다른 증거의 재생 버튼을 누르면 이전 것이 자동으로 정지됨
- 잠긴 증거는 비밀번호 해제 후에만 재생 버튼이 보임
- 지원 포맷: `.mp3`, `.m4a`, `.wav` (모바일 호환성 기준 `.mp3` 권장)

---

## 1-2. 증거 영상 힌트 추가

**파일:** `src/lib/data.ts` + `public/video/` 폴더

**영상 파일 등록 방법:**
1. 영상 파일을 `public/video/` 폴더에 넣는다 (예: `public/video/E03.mp4`)
2. 해당 evidence에 `videoUrl: "/video/E03.mp4"` 추가

```ts
{
  id: "E03",
  title: "통화기록",
  description: "사건 당일 피해자와 C 사이의...",
  videoUrl: "/video/E03.mp4",   // ← 이 줄 추가
},
```

- `videoUrl`이 없는 증거 → "영상 힌트 보기" 버튼 자체가 표시되지 않음
- 버튼을 누르면 카드 안에 영상 플레이어가 펼쳐지고, 다시 누르면 닫힘
- 잠긴 증거는 비밀번호 해제 후에만 영상 버튼이 보임
- 지원 포맷: `.mp4` 권장 (모바일 Safari 호환성 기준)
- 음성 힌트(`audioUrl`)와 영상 힌트(`videoUrl`) 동시에 등록 가능

---

## 1-3. 수신전화 화면 발신자 정보 수정

**파일:** `src/components/IncomingCallOverlay.tsx`

수신 화면과 통화 중 화면에 표시되는 이름/번호는 파일 상단 상수에서 수정한다.

```ts
const CALLER_NAME = "박미리";
const CALLER_NUMBER = "010-9876-2345";
const CALLER_INITIALS = "미리";
```

- `CALLER_NAME`: 크게 표시되는 발신자 이름
- `CALLER_NUMBER`: 이름 아래에 표시되는 번호
- `CALLER_INITIALS`: 원형 프로필 안에 표시되는 짧은 글자

---
## 1-3. 수신전화 음성 메시지 증거 수정

**파일:** `src/lib/data.ts` + `public/audio/` 폴더

수신전화를 걸 때 관리자가 입력한 조에 자동 수집되는 증거는 `CALL01`입니다.

```ts
export const INCOMING_CALL_AUDIO_URL = "/audio/incoming-call.mp3";
export const INCOMING_CALL_EVIDENCE_ID = "CALL01";
export const RANKING_EXCLUDED_EVIDENCE_IDS: string[] = [INCOMING_CALL_EVIDENCE_ID];
```

- 오디오를 교체할 때는 새 파일을 `public/audio/`에 넣고 `INCOMING_CALL_AUDIO_URL`만 변경
- 제목/설명은 `EVIDENCE` 배열의 `CALL01` 항목에서 수정
- `CALL01`은 증거함에는 보이지만 랭킹 점수와 랭킹 total에서는 제외됨
- 전화는 **수신 전용 기기(공기계)** 에만 온다(→ 1-5). 공기계의 로그인 여부와 무관하게 관리자가 전화 발행 시 입력한 조에 `CALL01`이 수집된다.

---

## 1-4. 수신전화 벨소리 / 진동 조정

**파일:** `src/lib/ringtone.ts`

수신 화면이 뜨면 "받기" 전까지 벨소리(코드로 합성)가 울리고, Android는 진동도 온다.

- **제약:** 벨소리는 참가자가 앱을 **한 번이라도 터치한 뒤 + 앱이 화면에 떠 있을 때만** 울린다(모바일 자동재생 정책). 백그라운드/화면잠금 상태면 안 울림. **진동은 Android만 되고 iPhone은 웹 제약으로 항상 무시된다.**
- **음량:** `scheduleRing`의 `gain.gain ... (0.25 ...)`에서 `0.25`를 키우거나 줄인다(0~1).
- **울림 간격:** `startRingtone`의 `setInterval(cycle, 3000)` — 3000ms = 1초 울림 + 2초 쉼. 숫자를 줄이면 더 자주 울린다.
- **진동 패턴:** `navigator.vibrate?.([500, 200, 500])` — `[진동ms, 멈춤ms, 진동ms]`. 진동을 빼려면 이 줄을 삭제.
- **벨 음색:** `scheduleRing`의 `480 / 440`(Hz) 값 조정.

---

## 1-5. 수신 전용 기기(공기계) 지정

**파일:** `src/app/phone/page.tsx`, `src/components/IncomingCallOverlay.tsx`, `src/lib/store.ts`

전화는 **모든 참가자 기기가 아니라, 지정한 공기계 1대에만** 온다.

- **지정 방법:** 공기계 브라우저로 **`/phone`** 에 접속한다. 접속하는 순간 그 기기가 "수신 전용 기기"로 지정되고(로컬 저장), "● 수신 대기 중" 표시가 뜬다.
- **동작:** 이후 관리자 화면에서 `전화 걸기`를 누르면 이 기기 화면 위로 수신 화면(밀어서 받기)이 뜬다. 다른 참가자 기기에는 아무것도 뜨지 않는다.
- **해제:** `/phone` 화면 하단 `수신 해제` 버튼을 누르면 그 기기는 더 이상 전화를 받지 않는다. (다른 기기를 공기계로 쓰려면 그 기기에서 `/phone`을 열면 됨 — 여러 대 지정도 가능)
- **저장 위치:** 기기별 `localStorage` 플래그 `exit2026_call_device`. 조 로그인과 무관하며, 참가자 초기화(reset)에 영향받지 않는다.
- 관리자에서 `전화 걸기`를 누른 뒤 전화를 찾은 조 번호를 입력하고 `확인`한다.
- 공기계에서 전화를 받으면 관리자가 지정한 조에 `CALL01`이 수집된다. 공기계에 조 로그인을 할 필요는 없다.
- `전화 종료`를 누르면 현재 수신전화 이벤트가 종료된다.

---

## 1-6. 사진 증거(폴라로이드) 설정

**파일:** `src/lib/data.ts`, `src/lib/usePhotoEvidence.ts`

현재 참가자용 증거함(`/evidence`)은 E01~E16 목록이 아니라 **직접 촬영 사진 보드**입니다.

- 저장 테이블: Supabase `photo_evidence`
- 이미지 저장소: Supabase Storage `evidence-photos` 버킷
- 업로드 전 압축: `src/lib/image.ts`에서 긴 변 1080px, JPEG 품질 0.72
- 캡션 제한: `/evidence`의 입력칸 `maxLength={20}`

관련 인물 태그 목록은 `PHOTO_TAGS`에서 수정합니다.

```ts
export const PHOTO_TAGS = [
  { value: "A", label: "나사장" },
  { value: "B", label: "채소장" },
  { value: "C", label: "나팀장" },
  { value: "D", label: "이대리" },
  { value: "E", label: "김사원" },
  { value: "PARK", label: "박실장 (피해자)" },
];
```

- `value`는 DB `photo_evidence.suspect_tag`에 저장되는 값입니다.
- `A`~`E`는 용의자 파일(`/suspects`)에서 해당 용의자 관련 사진으로 필터됩니다.
- `PARK`는 피해자 태그 전용입니다. 용의자 카드에는 표시되지 않습니다.
- 미지정은 UI의 첫 옵션이며 빈 문자열로 선택되고 DB에는 `null`로 저장됩니다.
- 태그 색상은 `photoTagTone()`에서 고정합니다. 나사장(A)은 파스텔 앰버, 채소장(B)은 파스텔 민트, 나팀장(C)은 파스텔 블루, 이대리(D)는 파스텔 라일락, 김사원(E)은 파스텔 로즈, 박실장(PARK)은 중립 회색, 미지정은 zinc 중립색입니다. 증거함 필터·폴라로이드·라이트박스·관리자 사진 점검은 이 함수를 함께 사용해야 합니다.

사진 점검은 관리자(`/admin`)의 **사진 점검**에서 합니다. 조별 필터로 사진을 찾고, 스팸 사진은 `제외`를 누릅니다. 제외 사진은 삭제되지 않으며 참가자 보드에는 `제외됨`으로 표시되고 사진 랭킹에서만 빠집니다. 잘못 제외한 사진은 같은 자리에서 `복원`하면 즉시 원래 상태로 돌아옵니다.

사진 제외/복원 기능을 사용하려면 Supabase SQL Editor에서 아래 SQL을 한 번 실행해야 합니다.

```sql
ALTER TABLE photo_evidence
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ok';
```

---

## 2. 장소명 수정

**파일:** `src/lib/data.ts` → 상단 `LOCATIONS` 상수

```ts
export const LOCATIONS = {
  L1: "자재 물류창고", // ← 여기만 바꾸면 해당 장소 QR 페이지 전체에 반영 (사건 현장)
  L2: "나사장 집무실",
  L3: "나팀장 사무실",
  L4: "채소장 연구실",
} as const;
```

---

## 3. QR ↔ 증거 연결 변경

**파일:** `src/lib/data.ts` → `QR_CODES` 배열

```ts
// 총 15개: 자재 물류창고 6 + 나사장 집무실/나팀장 사무실/채소장 연구실 각 3. 증거 1종당 QR 1개
export const QR_CODES: QrCode[] = [
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E02"] },
  { id: "h6t4c3", location: LOCATIONS.L2, evidenceIds: ["E04"] },
  { id: "b2r5w1", location: LOCATIONS.L3, evidenceIds: ["E03"] },
  { id: "m1d7k5", location: LOCATIONS.L4, evidenceIds: ["E01"] },
  // ... 전체 15개는 05_QR_MAP.md 표 참고
];
```

- `evidenceIds` 배열에 증거 ID를 넣는다 (현재는 QR당 1개, 여러 개도 가능)
- `id`(slug)는 인쇄된 QR 코드 URL과 일치해야 함 — 확정 후 변경 금지
- 05_QR_MAP.md의 † 표시 slug 9개는 새로 생성한 값 → 인쇄 QR과 일치시키거나 교체할 것

---

## 3-1. 증거함 인앱 QR 스캐너

**파일:** `src/lib/qrScan.ts`, `src/components/QrScannerModal.tsx`

증거함(`/evidence`)의 "QR 스캐너" 버튼은 폰 기본 카메라 앱으로 나가지 않고, 앱 안에서 바로 카메라를 열어(`getUserMedia` + `jsQR`) QR을 인식한다. 인식된 QR 원문(전체 URL 또는 slug)은 `resolveQrPath()`가 `QR_CODES`(위 3번 항목)에 등록된 id인지 확인한 뒤 `/qr/[id]`로 이동시킨다.

- `QR_CODES`에 없는 id를 스캔하면 "등록되지 않은 QR입니다" 안내만 뜨고 이동하지 않는다 — 즉 3번 항목에서 QR을 추가/변경하면 스캐너도 자동으로 인식한다(별도 수정 불필요).
- 카메라 권한을 거부하거나 카메라가 없는 기기는 화면에 에러 메시지만 표시되고 앱은 정상 동작한다.
- 카카오톡 등 인앱 브라우저로 사이트를 열면 iOS에서 카메라 권한 자체가 막힐 수 있다 — 참가자에게는 항상 기본 브라우저(Safari/Chrome)로 열도록 안내할 것.

---

## 4. 용의자 정보 수정

**파일:** `src/lib/data.ts`

```ts
{
  id: "A",                         // 변경 금지
  codename: "용의자 A",            // ← 코드명 (카드 상단 작은 라벨)
  name: "나사장",                  // ← 이름 (카드 큰 제목으로 표시)
  role: "노동자 대표",              // ← 직책 (데이터용. 카드에는 미표시)
  motive: "반복적인 폭행과 착취에 대한 복수",  // ← 동기 한 줄(데이터용. 카드에는 미표시)
  description: "현장 노동자들의 리더...",      // ← 상세 설명(데이터용. 카드에는 미표시)
  motiveLevel: "높음",             // ← "높음" | "중간" | "낮음" | "불명"(데이터용. 카드에는 미표시)
},
```

- `/suspects` 카드는 현재 코드명·이름과 **심문권·수사 노트**만 표시한다. `imageUrl`(머그샷)·`motive`·`description` 등은 데이터로는 유지되지만 카드에 렌더링되지 않는다.

---

## 5. 용의자 동기 공개 트리거

**파일:** `src/lib/data.ts` → `SUSPECTS` 배열

각 용의자의 `motiveRevealIds` 배열에 트리거 증거 ID를 입력한다.
해당 증거를 **모두** 수집했을 때 동기 텍스트가 공개된다.

```ts
// 예시: E07, E08을 모두 수집해야 A의 동기 공개
{ id: "A", motiveRevealIds: ["E07", "E08"], motive: "반복적인 폭행과 착취에 대한 복수", ... }

// 예시: E10 하나만 수집해도 C의 동기 공개
{ id: "C", motiveRevealIds: ["E10"], motive: "...", ... }
```

- `motiveRevealIds: []` — 아무 증거도 트리거로 지정 안 됨 → 항상 "불명확 — 조사 중"으로 표시

---

## 5-1. 용의자 관련 단서 연결

**파일:** `src/lib/data.ts` → `SUSPECTS` 배열의 `relatedEvidenceIds`

각 용의자의 `relatedEvidenceIds`에 관련 증거 ID를 넣으면, 용의자 파일(`/suspects`)을 펼쳤을 때 "관련 단서" 목록이 표시된다.

```ts
{ id: "A", relatedEvidenceIds: ["E04", "E07", "E08", "E09"], ... }
```

- 수집한 단서 → 제목 공개 (🔎 강조)
- 미수집 단서 → "🔒 미확보 단서"로 표시 (제목은 감춤, 개수만 노출)
- `relatedEvidenceIds: []` — 관련 단서 섹션 자체가 표시되지 않음
- 헤더에 수집 진행 카운트 표시: `관련 단서 (1/3)`

> 현재 용의자별 관련 단서는 고유하게 3개씩 배정돼 있습니다(총 15종). 매핑은 증거 내용 기준 초안이니 필요 시 조정하세요.

---

## 5-2. QR 심문권 퀴즈

**파일:** `src/lib/data.ts` → `INTERROGATION_QUIZZES`

현재 심문권은 증거 수집 트리거가 아니라 **QR 문제 정답**으로 획득합니다.
인쇄된 QR slug는 `QR_CODES`에 남아 있어야 하고, 그중 심문권 문제로 쓸 slug를 `INTERROGATION_QUIZZES`에 등록합니다.

```ts
export const INTERROGATION_QUIZZES = {
  w3n5k7: {
    suspectId: "B",
    question: "부검표의 독성 반응을 일으킨 살해 방식 두 단어를 영어로 입력하세요.",
    answer: "poison kill",
  },
  // 예시: A용 문제 추가
  // h6t4c3: { suspectId: "A", question: "문제 문구", answer: "정답" },
};
```

- key(`w3n5k7`)는 QR URL의 slug이며 `QR_CODES.id`와 일치해야 합니다.
- `suspectId`는 `"A"`~`"E"` 중 하나입니다.
- 정답 비교는 공백 제거 + 소문자 변환으로 처리됩니다. 예: `poison kill`, `PoisonKill`, `poison   kill` 모두 동일.
- 문제 등록이 없는 QR은 "이 지점에는 아직 등록된 문제가 없습니다"만 표시됩니다.
- **획득**: 정답을 맞히면 `team_evidence_items`에 `type='interrogation_earned'`, `evidence_id=용의자ID`로 저장됩니다. 조 전체·짝 조가 공유합니다.
- **제시**: 용의자 카드를 펼치면 관련 단서 아래에 빨간 심문권 티켓이 뜬다 → 배우에게 화면 제시
- **사용(1회 소모)**: 배우가 `심문 사용` → 확인 → `사용 완료`로 바뀌고 버튼 비활성. **짝지은 조도 함께 사용완료**로 전환된다. 사용완료에는 **사용 시각·사용한 조**가 표시된다 (예: `11:04 1조 사용완료`) — 오해 방지용
- `SUSPECTS.interrogationTriggerId` 필드는 구버전 데이터 호환을 위해 보존하지만, 현재 UI의 심문권 노출 여부는 `INTERROGATION_QUIZZES` 기준입니다.
- 사용 상태는 Supabase `team_evidence_items`의 `type='interrogation_used'` 행으로 저장되며, 조 초기화(`/admin`) 시 함께 삭제된다

---

## 5-3. 용의자 수사 노트 (참가자 메모)

**파일:** `src/app/suspects/page.tsx`, `src/lib/store.ts`

용의자 파일(`/suspects`)을 펼치면 맨 아래에 **수사 노트** 입력칸이 있다. 참가자가 용의자별로 메모를 남길 수 있다.

- **저장 위치**: 이 기기의 `localStorage`(`exit2026_suspect_notes` 키, `{ 용의자ID: 메모 }` 형태). 입력 즉시 자동 저장된다.
- **범위**: 개인 메모다. 조별 실시간 공유는 하지 않으며, 같은 조라도 다른 기기와는 공유되지 않는다.
- **초기화**: 랜딩 재입장/`resetAll()` 시 함께 삭제된다. 관리자 단서 초기화(Supabase)에는 영향받지 않는다.
- 별도 설정값은 없다. 문구/행 수를 바꾸려면 `suspects/page.tsx`의 `수사 노트` 블록을 수정한다.

---

## 6. 중요 단서 비밀번호 잠금

**파일:** `src/lib/data.ts` → `LOCKED_EVIDENCE` 객체

```ts
export const LOCKED_EVIDENCE: Record<string, string> = {
  E01: "1234",   // E01은 "1234" 입력 시 수집 가능
};
```

- 빈 객체 `{}` — 모든 증거 잠금 없음
- 비밀번호는 앞뒤 공백을 무시하고 비교함 (대소문자 구분)
- 잠금 해제 상태는 팀 공유 안 됨 — 수집 여부만 공유됨

---

## 6-1. 잠금 증거 퀴즈 문제 수정

**파일:** `src/lib/data.ts` → `EVIDENCE_QUIZ` 객체

```ts
export const EVIDENCE_QUIZ: Record<string, string> = {
  E01: "퀴즈 문제를 여기에 입력하세요.",
  // E05: "다른 증거에도 퀴즈 추가 가능",
};
```

- `LOCKED_EVIDENCE`에 등록된 증거에만 의미 있음 (잠기지 않은 증거엔 표시 안 됨)
- 해당 증거 ID의 퀴즈가 있으면 → 비밀번호 입력창 위에 퀴즈 문구 표시
- 퀴즈가 없으면 → 기본 안내 문구("비밀번호를 입력하면 단서가 공개됩니다.") 표시
- 퀴즈와 비밀번호는 별개 — 퀴즈 정답이 비밀번호가 되도록 직접 설계할 것
- 별도의 "정답 입력" 탭은 없다 — 문제는 QR을 찍어야 나타나고, QR 화면 안에서 바로 정답을 맞힌다
- 잠긴 증거가 어느 용의자의 `interrogationTriggerId`(5-2절)로 지정돼 있으면, 정답을 맞혀 그 증거를 수집하는 순간 심문권도 함께 획득된다 — 별도 로직 불필요, 트리거 대상 증거를 잠금 증거로 만들면 됨

**예시 세팅:**
```ts
// data.ts

export const LOCKED_EVIDENCE: Record<string, string> = {
  E01: "모세",   // 정답(비밀번호) = "모세"
};

export const EVIDENCE_QUIZ: Record<string, string> = {
  E01: "이집트에서 노예를 이끌고 탈출한 인물의 이름은?",  // 퀴즈 문제
};
```

---

## 6-2. 공통 단서 (전체 공개 + 전체 공지)

**파일:** `src/lib/data.ts` → `COMMON_EVIDENCE_IDS` 배열

여기에 넣은 증거는 **조별 증거가 아니라 전역 공유 증거**로 동작한다.
어느 조든 처음 그 증거를 수집하면:

1. **전체 조**의 증거함에 즉시 공개됨 (모든 참가자가 수집한 것으로 표시)
2. **전 참가자**에게 빨간 전체 공지 토스트가 뜸 (`🚨 공통 단서 'XXX'가 전체 공개되었습니다`)

```ts
export const COMMON_EVIDENCE_IDS: string[] = ["E10"];  // 예시 — 원하는 증거로 교체
```

- 여러 개 지정 가능: `["E10", "E05"]`
- 빈 배열 `[]` — 공통 단서 없음 (모든 증거가 조별 증거로 동작)
- 공지는 **가장 먼저 찾은 1회만** 뜬다 (이후 다른 조가 찾아도 중복 공지 없음)
- 랭킹에서는 공통 단서를 모든 조 점수에 동일하게 합산한다
- 잠금(`LOCKED_EVIDENCE`)과 함께 지정 가능 — 비밀번호를 풀어 처음 수집하는 순간 전체 공개됨
- **초기화:** 관리자 패널의 "전체 조 초기화"를 하면 공통 단서도 함께 잠긴 상태로 되돌아간다 (조별 초기화로는 안 됨)

---

## 7. 사건 개요 수정 (수사본부 메인 화면)

**파일:** `src/app/home/page.tsx`

| 항목 | 위치 |
|------|------|
| 피해자 | `<span>현장 관리자 (신원 확인됨)</span>` |
| 장소 | `<span>녹산건설 자재 물류창고</span>` |
| 용의자 | `<span>A, B, C, D, E — 5인</span>` |
| 사건 요약 | `노동자를 폭행하던 피해자와 몸싸움이...` |

---

## 8. 엔딩 텍스트 수정

**파일:** `src/app/ending/page.tsx`

- 모세 정체 공개 텍스트: `C의 진짜 이름은 모세입니다.` 부분
- 이야기 대조표: `["녹산건설 물류창고", "고대 이집트"]` 배열 수정
- 마무리 멘트: `여러분은 지금 모세의 이야기를 살았습니다.`

---

## 9. 최종 추리 제출 최소 증거 수

**파일:** `src/lib/data.ts` → 상단 상수

```ts
export const VOTE_UNLOCK_COUNT = 0; // ← 이 숫자를 바꾼다
```

- `0` — 제한 없음 (언제든 제출 가능)
- `5` — 증거 5개 이상 수집 시 제출 활성화

---

## 10. 최종 투표 제출 방식

현재 최종 투표는 **기기별 1회 제출**로 고정되어 있습니다.
제출 기록은 localStorage의 `exit2026_vote_final` 키에 저장됩니다.

---

## 11. 페이지 타이틀 / 공유 미리보기 수정

**파일:** `src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  title: "EXIT SEASON1",
  description: "녹산건설 물류창고 살인사건 특별 수사",
};
```

---

## 12. 디바이스 연출 화면 (아이패드 / 나팀장 노트북)

연출용 정적 HTML 화면을 참가자 UI에 노출하지 않고 운영자 기기에서만 띄우는 방식입니다.

**파일 위치:** `public/screen/`
- `public/screen/ipad.html` → 출입관리 아이패드 화면
- `public/screen/laptop.html` → 나팀장 노트북(윈도우) 화면
- `public/screen/phone2.html` → 채소장 휴대폰 화면 (홈 화면 + 전화 + 메시지)
- `public/screen/flower_phone_call_log.html` → 휴대폰 화면 (홈 화면 + 최근 통화 목록). `/screen/phone3` rewrite로 연결됨(`next.config.ts`). ⚠️ 통화 목록 인물(나팀장·채소장·이대리·김사원·박실장 등)로 미루어 나사장(용의자 A) 휴대폰으로 추정되나 소유자·문구 모두 확정 전 초안 — 단서팀 확인 필요.

**여는 방법 (운영자 기기에서 URL 직접 입력):**
```
https://(배포주소)/screen/ipad.html
https://(배포주소)/screen/laptop.html
https://(배포주소)/screen/phone2
https://(배포주소)/screen/phone3
```

- 참가자 앱(홈·QR·증거함 등) 어디에도 링크가 없어 **UI로는 도달 불가**.
- 단, `public/`의 정적 파일이라 **URL을 아는 사람은 열 수 있음**(은닉이지 차단 아님).
  실제 잠금은 화면 안의 조 번호 선택 + 공통 비밀번호 입력이 담당.
- URL 추측을 더 어렵게 하려면 파일명을 바꾸면 됨: `public/screen/x7k2-laptop.html`.
- **뒤로가기 방지:** 네 화면(`ipad.html`, `laptop.html`, `dongguri_phone_room.html`, `flower_phone_call_log.html`) 모두 `<script>` 맨 위에 히스토리를 계속 되채우는 코드가 있어, 모바일 브라우저의
  뒤로가기 버튼/스와이프 제스처를 눌러도 화면을 벗어나지 못하고 그대로 남아 있는다(`history.pushState` +
  `popstate` 리스너). 참가자가 실수로 기기 화면에서 이탈해 몰입이 깨지는 걸 막기 위함. 2차 안전장치로
  `beforeunload`도 걸어둬서, 혹시 위 트릭이 뚫려 실제로 페이지를 떠나려 하면 브라우저 기본 "이 사이트에서
  나가시겠습니까?" 확인창이라도 뜬다.
  - ⚠️ **한계:** 안드로이드 크롬의 "제스처 뒤로가기"(화면 가장자리를 스와이프하는 최신 예측형 뒤로가기)는
    위 트릭을 우회하고 그대로 화면을 벗어나는 경우가 있다 — 이건 크롬/안드로이드 자체의 알려진 제약이라
    웹페이지 쪽 코드만으로 100% 막을 수 없다. 물리 버튼(3버튼 내비게이션)이나 브라우저 UI의 ← 버튼은
    문제없이 잘 막힌다.
  - **행사 당일 프롭 기기 설정 권장:** 이 화면을 띄우는 공기계는 안드로이드 설정 → 시스템 → 제스처 →
    시스템 탐색을 **"3버튼 탐색"** 으로 바꿔두면, 스와이프 제스처가 아예 없어져 뒤로가기 방지가 훨씬
    안정적으로 동작한다.

### 홈화면 설치(PWA) — 전체화면 앱처럼 실행

`/screen/phone2`(채소장 폰)와 `/screen/phone3`(전화)는 **홈 화면에 추가**하면 브라우저 주소창 없이 **전체화면**으로 뜨는 PWA로 만들어져 있다. 프롭 폰(공기계)에서 실제 앱처럼 보이게 하는 용도.

**설치 방법 (기기별 1회):**
- 안드로이드 크롬: 해당 URL 접속 → 메뉴(⋮) → **홈 화면에 추가/앱 설치** → 홈 아이콘 실행 시 전체화면(`display: fullscreen`, 상단 상태바까지 숨김).
- 아이폰 사파리: URL 접속 → 공유 → **홈 화면에 추가** → 아이콘 실행 시 사파리 UI 없이 실행. ⚠️ iOS는 웹앱에서 **상단 상태바(시계/배터리)를 완전히 숨길 수 없어** 목업의 가짜 상태바와 겹칠 수 있음(안드로이드는 완전히 숨겨져 문제없음). 프롭은 안드로이드 권장.

**아이콘 / 이름 바꾸기:**
- 매니페스트: `public/screen/phone2.webmanifest`, `public/screen/phone3.webmanifest` — `name`(앱 이름), `display`(fullscreen/standalone), 아이콘 경로를 여기서 수정.
- 아이콘 이미지: `public/screen/icons/phone2-*.png`, `phone3-*.png`(192/512=안드로이드, 180=iOS). 디자인은 `scripts/gen-phone-icons.mjs`의 SVG를 고치고 `node scripts/gen-phone-icons.mjs`로 다시 생성.
- HTML `<head>`의 `apple-mobile-web-app-title`(iOS 홈 아이콘 이름)과 `<link rel="manifest">`도 폰별로 연결돼 있음.

**화면 내용 수정:** 위 HTML 파일을 직접 편집. 원본 목업은 `docs/02_mockups/`에 있음.

### 나팀장 노트북(`laptop.html`) 잠금화면 값 수정

잠금 방식: **조 번호 드롭다운 선택 + 공통 암호 입력**. 고른 조 번호가 수집 대상 조가 됩니다.
(예전의 "MOSES+조번호" 개별 암호 방식은 폐기.) 바탕화면에는 **지문감식 결과보고서.pdf** 1개만 있으며,
별도 암호 없이 열면 그 조 보관함에 수집됩니다. **조 선택 + 공통 비밀번호 성공만으로는 수집되지 않고, PDF를 여는 순간 수집됩니다.**

- **공통 암호 변경:** `<script>` 안의 `const UNLOCK_PASSWORD = "980721";` 값을 수정.
- **수집되는 증거 변경:** `const PDF_EVIDENCE_ID = "E16";` — PDF 열람 시 조 보관함에 저장되는 증거 ID(앱 `data.ts` 기준).
- **보고서 내용 작성(⚠️ 현재 비어있음):** `winPdf` 안의 `<article class="pdf-page">`는 제목만 있고 본문은
  비워둔 상태(`내용 준비 중`). **단서팀 확정본으로 채워야 함.** `.pdf-doc-head`/`.pdf-meta`/`.pdf-section`/
  `.pdf-table`/`.pdf-opinion`/`.pdf-sign` 스타일이 이미 준비돼 있어 그대로 마크업만 넣으면 됨.
- **조 개수 변경:** 잠금화면의 `<select id="teamSelect">` 안 `<option>` 목록을 늘리거나 줄임
  (현재 1조~6조). 예: 8조까지면 `<option value="7">7조</option>` `<option value="8">8조</option>` 추가.
- **화면 상단 데모 배너는 제거됨.** 암호/데모 안내가 다시 필요하면 운영 화면이 아닌 별도 목업에서만 노출하세요.
- 잠금 해제 퀴즈 영역은 HTML 주석(`<!-- ... -->`)으로 남겨둠 — 되살리려면 주석만 해제.

**실제 조 보관함 저장 (연동 완료):** PDF를 열면 `supabase-js`(CDN)로
`team_evidence_items`에 `{ pair_id: 선택한 조, evidence_id: E16, type: "collected" }`를 저장합니다.
선택한 조 참가자 폰의 증거함에 실시간 반영됩니다. 조 ID는 앱 등록과 동일한 `"1"`~`"6"` 형식이라
드롭다운 값과 그대로 일치합니다. Supabase 주소/키(`SUPABASE_URL`, `SUPABASE_ANON_KEY`)는
앱과 동일한 공개값이라 보통 건드릴 필요 없습니다.

> ⚠️ **아이패드 화면(`ipad.html`)은 아직 연출용 정적 화면**입니다(수집 연동 없음).
> 노트북(`laptop.html`)만 위와 같이 실제 저장이 연동돼 있습니다.

### 채소장 휴대폰(`phone2.html`)

**잠금 없음** — 조 번호를 선택하고 `시작하기`만 누르면 바로 홈 화면으로 들어간다(비밀번호 없음).
**증거 수집 연동 없음** — 열람 전용 소품이다. 전화/메시지를 읽어도 증거함에는 아무것도 쌓이지 않는다.

- 홈 화면: 독(dock)에 **전화 · 문자 · 인터넷 · 카메라** 4개만 존재. 전화·문자만 동작하고, **인터넷·카메라는 아예 비활성화**(클릭 핸들러 없음, 살짝 어둡게 표시)
- 홈 화면에 별도 "설정" 아이콘은 없음 — 세션 종료(다음 조 전환)는 **90초 무입력 자동 초기화만** 사용. 수동 진입 경로는 의도적으로 없앰
- **전화 앱**: `최근 기록` 탭에 통화 목록 하드코딩(`.call-row` 반복). `즐겨찾기`/`연락처` 탭은 빈 상태만 표시
- **메시지 앱**: 대화 목록(`#threadList`) → 탭하면 해당 대화(`#chatKim`/`#chatUnknown`/`#chatLee`) 표시. 새 대화 추가 시 목록에 `.thread-row`(`onclick="openThread('id')"`) 하나, 채팅 내용에 `.chat-body`(`id="chat" + Id`) 하나를 세트로 추가하고 `THREAD_NAMES` 객체에 이름도 추가
- ⚠️ **통화목록·메시지 문구는 초안입니다.** 채소장의 동기(김사원 보호 + 현장 조작 의혹)에 맞춰 작성한 임시 문구이며, 단서팀 확정본으로 교체해야 합니다.
- **화면 상단 데모/목업 안내 바는 제거됨** (`.demo-banner` 삭제). 다시 필요하면 운영 화면이 아닌 별도 목업에서만 노출.
- **시작 화면 배치:** 시계는 화면 살짝 위쪽(`#start .lock-clock { top: 16% }`), 조 선택 패널은 세로 중앙(`#start .start-panel { top: 50%; transform: translate(-50%,-50%) }`). 위치만 바꾸려면 이 `top` 값만 조정하면 된다.

#### ⚠️ 레이아웃 함정 — 화면이 통째로 무너지거나 하단 독이 안 보일 때 (실수 방지 메모)

`public/screen/*.html`의 각 화면(`.screen`)은 `position: absolute; inset: 0`으로 **부모(body)를 꽉 채워** 크기를 얻고, 그 위에서 하단 독·홈 인디케이터 등이 `bottom:` 기준으로 배치된다. 여기엔 두 가지 함정이 있었다(둘 다 실제로 밟았음).

1. **`.screen`과 한 요소에 겹쳐 쓰는 다른 클래스에 `position`을 주지 마라.**
   `#home`/`#start`는 `class="screen wallpaper"`처럼 클래스를 겹쳐 쓴다. `.wallpaper`(또는 다른 클래스)에 `position: relative` 등을 지정하면 `.screen`과 명시도가 같아 **CSS에서 나중에 나온 쪽이 이겨** `.screen`의 `position: absolute`를 덮어쓴다. 그러면 화면이 body를 못 채우고, 자식(상태바·독 등)이 전부 `absolute`라 in-flow 콘텐츠가 없어 **화면 높이가 0으로 붕괴** → 하단 독이 화면 밖으로 밀려 안 보이고 바닥엔 검정만 남는다. 배경 같은 스타일은 `position` 없이도 `.screen`의 absolute 박스에 그대로 그려지므로 굳이 `position`을 줄 이유가 없다.
2. **증상이 "세로 잘림"처럼 보여도 원인이 뷰포트 높이가 아닐 수 있다.** 위 붕괴는 "하단이 잘렸다"처럼 보이지만 실제로는 높이 0 붕괴다. **먼저 화면이 body를 실제로 채우는지**(DevTools에서 `.screen`의 계산 높이 = 뷰포트 높이인지) 확인하라. 별개로 모바일 인앱 브라우저(카카오톡 등)는 `svh`/`dvh`를 모를 수 있어 `100svh`가 `100vh`(주소창 포함 큰 뷰포트)로 폴백된다 — 이 파일은 JS로 `visualViewport.height`를 `--app-h`에 고정해 대응한다(`height: var(--app-h, 100svh)`). 새 기기 화면도 이 패턴을 따르라.
- **배경 그라데이션/색은 아이콘을 덮지 못한다.** CSS `background`는 항상 자식 콘텐츠보다 아래에 그려진다. 아이콘이 안 보이면 배경색이 아니라 위 배치 문제를 의심하라.

---

## 13. 관리자 사진 초기화

`/admin`의 **조별 초기화**는 해당 조의 Supabase 증거 수집 기록과 사진 증거를 함께 삭제합니다. 사진은 `photo_evidence` 행뿐 아니라 Storage `evidence-photos` 버킷의 실제 파일까지 영구 삭제됩니다.

- 행사 중 조를 재사용할 때 해당 조의 `초기화`를 누릅니다. 현재 기기 조라면 투표 기록과 개인 메모도 함께 초기화됩니다.
- 모든 조의 사진만 지우려면 **사진 전체 삭제**를 누르고 `초기화`를 입력해 확정합니다. 이 동작은 기기의 조 로그인이나 투표 기록을 초기화하지 않습니다.
  - 사진 번호 카운터도 함께 비워집니다. 이후 모든 조/페어의 첫 새 사진은 #1입니다.
- **전체 조 초기화**는 모든 조의 증거 수집 기록과 사진을 함께 지우고, 현재 기기 로컬 데이터도 초기화합니다.
  - 페어 조는 사진 번호를 하나의 시리즈로 공유하고, 비페어 조는 별도 시리즈를 사용합니다. **조별 초기화**는 페어 상대의 번호 연속성을 지키기 위해 번호를 초기화하지 않습니다.

---

## 수정 후 배포 방법

코드 수정 후 Claude Code에게 아래처럼 요청하면 됩니다:

```
git add + commit + push 해줘
```

push하면 Vercel이 자동으로 배포합니다.
