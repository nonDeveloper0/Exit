# PUZZLE DESIGN — 문제 풀이형 단서

> 2026-07-13: `/solve` 전역 정답 입력 탭을 1차 구현했으나, "문제를 푸는 탭이 따로 있는 게 아니라
> QR을 찍으면 문제가 뜨고 그 문제를 맞히면 단서를 수집하거나 심문권을 얻는" 방식으로 되돌리기로 결정.
> `/solve` 페이지와 `PUZZLES`/`Puzzle` 데이터 모델은 제거했다.

## 확정된 방식

- 문제는 **QR을 찍어야만** 등장한다. QR 없는 별도 진입점은 없다.
- 구현은 기존 QR 잠금 증거 메커니즘 그대로: `LOCKED_EVIDENCE[증거ID]` = 정답, `EVIDENCE_QUIZ[증거ID]` = 문제 문구 (`src/lib/data.ts`).
- `/qr/[slug]` 페이지에서 잠긴 증거는 문제 문구 + 정답 입력창을 보여주고, 정답을 맞히면 자동으로 그 조 증거함에 수집된다.
- **보상 두 가지**:
  - **단서 수집** — 정답을 맞히면 해당 증거가 수집된다 (기본 동작).
  - **심문권 획득** — 그 증거가 어느 용의자의 `interrogationTriggerId`(`SUSPECTS` 배열, EDIT_GUIDE 5-2절)로 지정돼 있으면, 수집과 동시에 그 용의자 심문권도 함께 얻는다. 별도 보상 타입이나 추가 로직은 필요 없다 — 잠금 증거를 심문권 트리거로 지정하기만 하면 된다.

## 폐기한 것

- `/solve` 전역 정답 입력 페이지, 하단 네비 '정답' 탭
- `PUZZLES`/`Puzzle` 데이터 모델, `findPuzzleByAnswer`/`normalizePuzzleAnswer` — `LOCKED_EVIDENCE` + `EVIDENCE_QUIZ`와 내용이 중복되어 정리
- 힌트 전용 보상(`reward.type="hint"`) — 필요해지면 별도로 재설계

## 남은 결정 / 주의

- 문제 문구와 정답은 `EVIDENCE_QUIZ`/`LOCKED_EVIDENCE`에 증거 ID별로 1:1 등록한다 (EDIT_GUIDE 6/6-1절).
- 힌트 텍스트(정답 대신 다음 단서 위치 등을 알려주는 방식)가 필요해지면 그때 별도 데이터 모델을 논의한다.
