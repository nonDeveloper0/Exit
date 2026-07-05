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
  audioUrl: "/audio/E01.mp3",         // ← 음성 힌트 (없으면 이 줄 삭제)
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

## 4. 용의자 정보 수정

**파일:** `src/lib/data.ts`

```ts
{
  id: "A",                         // 변경 금지
  codename: "용의자 A",            // ← 코드명 (카드 상단 작은 라벨)
  name: "나사장",                  // ← 이름 (카드 큰 제목으로 표시)
  role: "노동자 대표",              // ← 직책 (데이터용. 카드에는 미표시)
  motive: "반복적인 폭행과 착취에 대한 복수",  // ← 동기 한 줄
  description: "현장 노동자들의 리더...",      // ← 상세 설명
  motiveLevel: "높음",             // ← "높음" | "중간" | "낮음" | "불명"
},
```

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

## 5-2. 용의자 심문권 트리거

**파일:** `src/lib/data.ts` → `SUSPECTS` 배열의 `interrogationTriggerId`

각 용의자에 `interrogationTriggerId`(증거 ID 1개)를 지정하면, 그 증거를 수집한 조는 용의자 파일(`/suspects`)에서 해당 용의자의 **심문권**을 얻는다.

```ts
// 예시: E16을 수집하면 A의 심문권 획득
{ id: "A", interrogationTriggerId: "E16", ... }

// 미지정(휴면): 심문권 UI가 아예 표시되지 않음
{ id: "B", interrogationTriggerId: undefined, ... }
```

- **획득**: 지정 증거를 수집하면 즉시 (조 전체 공유. 짝지은 조도 함께 획득)
- **제시**: 용의자 카드를 펼치면 관련 단서 아래에 빨간 심문권 티켓이 뜬다 → 배우에게 화면 제시
- **사용(1회 소모)**: 배우가 `심문 사용` → 확인 → `사용 완료`로 바뀌고 버튼 비활성. **짝지은 조도 함께 사용완료**로 전환된다. 사용완료에는 **사용 시각·사용한 조**가 표시된다 (예: `11:04 1조 사용완료`) — 오해 방지용
- 트리거 증거는 QR에 연결돼 있어야 수집 가능하다(3절 `QR_CODES` 참고). 트리거용 새 증거를 추가한 뒤 여기에 그 ID를 넣으면 된다
- 사용 상태는 Supabase `team_evidence_items`의 `type='interrogation_used'` 행으로 저장되며, 조 초기화(`/admin`) 시 함께 삭제된다

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
| 장소 | `<span>NS건설 공사 현장 B2 구역</span>` |
| 용의자 | `<span>A, B, C, D, E — 5인</span>` |
| 사건 요약 | `노동자를 폭행하던 피해자와 몸싸움이...` |

---

## 8. 엔딩 텍스트 수정

**파일:** `src/app/ending/page.tsx`

- 모세 정체 공개 텍스트: `C의 진짜 이름은 모세입니다.` 부분
- 이야기 대조표: `["NS건설 공사 현장", "고대 이집트"]` 배열 수정
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

## 10. 투표 제출 횟수 변경 (현재 2회)

**파일:** `src/app/vote/page.tsx`

```ts
{submitCount < 2 ? (   // ← 2를 원하는 횟수로 변경
```

---

## 11. 페이지 타이틀 / 공유 미리보기 수정

**파일:** `src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  title: "EXIT SEASON1",
  description: "NS건설 공사 현장 살인사건 특별 수사",
};
```

---

## 수정 후 배포 방법

코드 수정 후 Claude Code에게 아래처럼 요청하면 됩니다:

```
git add + commit + push 해줘
```

push하면 Vercel이 자동으로 배포합니다.
