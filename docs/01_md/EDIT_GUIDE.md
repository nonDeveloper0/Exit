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
},
```

**이미지 추가 방법:**
1. 이미지 파일을 `public/` 폴더에 넣는다 (예: `public/cctv.png`)
2. 해당 evidence에 `imageUrl: "/cctv.png"` 추가

---

## 2. 장소명 수정

**파일:** `src/lib/data.ts` → 상단 `LOCATIONS` 상수

```ts
export const LOCATIONS = {
  L1: "살해 현장",    // ← 여기만 바꾸면 해당 장소 QR 페이지 전체에 반영
  L2: "CCTV 관제실",
  L3: "주차장",
  L4: "창고",
} as const;
```

---

## 3. QR ↔ 증거 연결 변경

**파일:** `src/lib/data.ts` → `QR_CODES` 배열

```ts
export const QR_CODES: QrCode[] = [
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E01"] },
  { id: "p7n3q8", location: LOCATIONS.L1, evidenceIds: ["E09", "E02"] },
  { id: "h6t4c3", location: LOCATIONS.L2, evidenceIds: ["E03", "E04"] },
  { id: "b2r5w1", location: LOCATIONS.L3, evidenceIds: ["E05", "E06"] },
  { id: "m1d7k5", location: LOCATIONS.L4, evidenceIds: ["E07", "E08"] },
  { id: "n4v8z3", location: LOCATIONS.L4, evidenceIds: ["E10"] },
];
```

- `evidenceIds` 배열에 증거 ID를 1~2개 넣는다
- `id`(slug)는 절대 변경 금지 — QR 코드 URL과 연결됨

---

## 4. 용의자 정보 수정

**파일:** `src/lib/data.ts`

```ts
{
  id: "A",                         // 변경 금지
  codename: "용의자 A",            // ← 코드명
  role: "노동자 대표",              // ← 직책
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
