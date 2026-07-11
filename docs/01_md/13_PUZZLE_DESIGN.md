# PUZZLE DESIGN — QR 없는 '문제 풀이형' 단서 (설계 논의, 결정 보류 2026-07-11)

> "단서가 모두 QR은 아니다. 문제를 풀면 정답으로 단서를 얻는 형식"을 어떻게 구현할지 정리한 문서.
> **결정은 나중에.** 이 문서는 방향만 잡아둔 것. 관련: `11_DEVICE_UI_PLAN.md`의 미해결 항목
> "노트북 조별 비번을 발급할 Exit 앱 내 문제(퍼즐) 설계"와 이어짐.

## 현재 구현 (출발점)

- `LOCKED_EVIDENCE[id]` = 정답, `EVIDENCE_QUIZ[id]` = 문제 텍스트 (`src/lib/data.ts`)
- **QR을 찍어 그 증거의 QR 페이지(`/qr/[id]`)에 들어가야** 문제가 보이고, 정답 입력 시 수집
- 즉 **문제가 QR 뒤에 갇혀 있음.** QR 없이 문제만 풀어서 얻는 단서는 지금 구조로 불가.
- 판정: `QrPageClient.tsx`의 `handlePasswordSubmit` → 맞으면 `unlock()` + `collect()`

## 요구사항

- QR 없이도 접근 가능한 '문제 풀이형' 단서가 필요.
- 접근 방식: **전역 정답 입력창** / **앱 내 문제 목록** — 둘 다 열어둠 (미정).
- 보상: **단서(증거) 수집** / **다음 QR·장소 힌트 공개** — 둘 다 가능해야 함.

## 제안: 문제를 하나의 데이터로 통일

접근 2 × 보상 2 = 4조합을 **하나의 `Puzzle` 데이터**로 정의하면, 4가지가 전부
"같은 데이터를 다르게 소비"하는 것으로 정리됨 → 어느 쪽으로 가도 재작업 없음.

```ts
// src/lib/data.ts 에 추가 (제안)
export interface Puzzle {
  id: string;
  question: string;            // 문제 텍스트 (앱 목록에 표시할 때 사용)
  answer: string;              // 정답 (대소문자·공백 무시 비교)
  reward:
    | { type: "evidence"; evidenceId: string }  // → collect() 로 단서 수집 (조 동기화됨)
    | { type: "hint"; text: string };           // → 다음 QR/장소 힌트 텍스트 공개
  showInList?: boolean;        // true면 앱 내 '문제 목록' 페이지에 노출
}

export const PUZZLES: Puzzle[] = [
  { id: "P01", question: "물류창고 벽의 숫자 3개를 더하면?", answer: "17",
    reward: { type: "evidence", evidenceId: "E13" } },
  { id: "P02", question: "박실장의 사물함 비밀번호는?", answer: "0412",
    reward: { type: "hint", text: "채소장 연구실 안쪽 캐비닛을 확인하세요." }, showInList: true },
];
```

정답 판정 로직 1개만 있으면 됨:

```ts
function solve(input: string): Puzzle | null {
  const norm = (s: string) => s.trim().replace(/\s+/g, "").toLowerCase();
  return PUZZLES.find((p) => norm(p.answer) === norm(input)) ?? null;
}
// 맞으면 reward.type 분기: "evidence" → collect(evidenceId), "hint" → 텍스트 표시
```

## 4가지 조합 커버 방식

| | 전역 입력창 | 앱 내 문제 목록 |
|---|---|---|
| **보상=단서** | 정답 타이핑 → `collect()` → 조 동기화 | 문제별 입력 → `collect()` |
| **보상=힌트** | 정답 타이핑 → 힌트 텍스트 표시 | 문제별 입력 → 힌트 표시 |

- **전역 입력창**: `PUZZLES` 전체의 `answer` 매칭. 문제 텍스트는 안 써도 됨(문제는 현장 인쇄물에 있음).
- **앱 내 목록**: `showInList: true`인 것만 `question`과 함께 렌더링.
- 데이터는 하나, 소비하는 UI만 추가 → 지금 뭘 만들든 나중에 버릴 게 없음.

## 권장 순서 (미확정)

1. **Phase 1:** `PUZZLES` 데이터 + 전역 정답 입력창 1개(`/home` 박스 or 전용 `/solve`).
   코드 최소, "QR 없이 문제 풀어 얻는 단서" 요구를 완전히 충족.
2. **Phase 2:** `showInList` 문제를 보여주는 문제 목록 페이지. 데이터 변경 0.

## 남은 결정 / 주의

- [ ] 접근 방식 확정: 전역 입력창 / 문제 목록 / 둘 다
- [ ] 입력창 위치: `/home` 내 박스 vs 별도 `/solve` 페이지
- [ ] **힌트 보상은 현재 설계상 조 동기화 안 됨** (`unlock`처럼 로컬). 한 명이 힌트를 봐도
      같은 조 다른 폰엔 안 뜸. 증거 보상은 `collect()`라 동기화됨. 힌트도 조 전체에
      띄우려면 Supabase 저장 추가 필요 — 필요 시 별도 논의.
- [ ] 기존 `LOCKED_EVIDENCE`/`EVIDENCE_QUIZ`(QR 게이트)와 통합할지, 병존할지 결정.
- [ ] `11_DEVICE_UI_PLAN.md`의 "노트북 조별 비번 발급 퍼즐"과 이 시스템을 합칠지 검토
      (조마다 다른 값을 발급하는 로직은 이 `Puzzle` 모델의 확장 필요).
