# PUZZLE DESIGN — QR 없는 '문제 풀이형' 단서

> "단서가 모두 QR은 아니다. 문제를 풀면 정답으로 단서를 얻는 형식"을 어떻게 구현할지 정리한 문서.
> 2026-07-13 기준 1차 구현 완료: `/solve` 전역 정답 입력으로 QR 없이 단서를 수집할 수 있다.

## 현재 구현

- `LOCKED_EVIDENCE[id]` = 정답, `EVIDENCE_QUIZ[id]` = 문제 텍스트 (`src/lib/data.ts`)
- `PUZZLES` = QR 없이 풀 수 있는 문제 데이터 (`src/lib/data.ts`)
- `/solve`에서 정답 입력 → `findPuzzleByAnswer()` 판정 → `reward.type === "evidence"`면 `collect(evidenceId)`
- 기존 QR 잠금 단서는 유지된다. 같은 정답/문제를 `PUZZLES`에 등록하면 QR 없이도 수집 가능하다.

## 요구사항

- QR 없이도 접근 가능한 '문제 풀이형' 단서가 필요.
- 접근 방식: **전역 정답 입력창** 1차 구현 완료. `showInList: true` 문제는 `/solve`에 문제 문구도 표시.
- 보상: **단서(증거) 수집** / **다음 QR·장소 힌트 공개** — 둘 다 가능해야 함.

## 제안: 문제를 하나의 데이터로 통일

접근 2 × 보상 2 = 4조합을 **하나의 `Puzzle` 데이터**로 정의하면, 4가지가 전부
"같은 데이터를 다르게 소비"하는 것으로 정리됨 → 어느 쪽으로 가도 재작업 없음.

```ts
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

- **전역 입력창**: `/solve`에서 `PUZZLES` 전체의 `answer` 매칭. 문제 텍스트는 안 써도 됨(문제는 현장 인쇄물에 있음).
- **앱 내 목록**: `/solve`에서 `showInList: true`인 것만 `question`과 함께 렌더링.
- 데이터는 하나, 소비하는 UI만 추가 → 지금 뭘 만들든 나중에 버릴 게 없음.

## 구현 상태

- [x] Phase 1: `PUZZLES` 데이터 + 전역 정답 입력창 `/solve`
- [x] `showInList` 문제 목록 표시
- [ ] 힌트 보상의 조 동기화

## 남은 결정 / 주의

- [ ] **힌트 보상은 현재 설계상 조 동기화 안 됨** (`unlock`처럼 로컬). 한 명이 힌트를 봐도
      같은 조 다른 폰엔 안 뜸. 증거 보상은 `collect()`라 동기화됨. 힌트도 조 전체에
      띄우려면 Supabase 저장 추가 필요 — 필요 시 별도 논의.
- [x] 기존 `LOCKED_EVIDENCE`/`EVIDENCE_QUIZ`(QR 게이트)와 병존. 필요한 항목만 `PUZZLES`에 같이 등록.
- [ ] `11_DEVICE_UI_PLAN.md`의 "노트북 조별 비번 발급 퍼즐"과 이 시스템을 합칠지 검토
      (조마다 다른 값을 발급하는 로직은 이 `Puzzle` 모델의 확장 필요).
