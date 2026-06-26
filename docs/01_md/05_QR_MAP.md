# QR MAP

## QR 흐름 (핵심)

```
현장의 QR 스캔
    ↓
해당 QR 페이지 접속 (/qr/[slug])
    ↓
연결된 증거 1~2개 공개
    ↓
수집 버튼 클릭 → Supabase 저장 → 같은 조에 실시간 반영
```

---

## 장소 및 QR 배치

| 장소 | QR | slug | 증거 |
|------|----|------|------|
| 살해 현장 | QR1 | x4k9m2 | E01 목격자 진술 |
| 살해 현장 | QR2 | p7n3q8 | E09 현장출입기록, E02 CCTV 일부 영상 |
| CCTV 관제실 | QR3 | h6t4c3 | E03 통화기록, E04 문자내역 |
| 주차장 | QR4 | b2r5w1 | E05 혈흔 사진, E06 인사기록 |
| 창고 | QR5 | m1d7k5 | E07 징계문서, E08 병원기록 |
| 창고 | QR6 | n4v8z3 | E10 비밀문서 |

> ⚠️ slug를 바꾸면 QR 코드 URL이 깨집니다. 절대 변경하지 마세요.

---

## 장소명 변경 방법

장소명은 `src/lib/data.ts`의 `LOCATIONS` 상수에서 관리합니다.

```ts
export const LOCATIONS = {
  L1: "살해 현장",
  L2: "CCTV 관제실",
  L3: "주차장",
  L4: "창고",
} as const;
```

여기만 수정하면 해당 장소의 모든 QR 페이지 헤더에 자동 반영됩니다.

---

## QR ↔ 증거 연결 변경 방법

`src/lib/data.ts`의 `QR_CODES` 배열에서 `evidenceIds`를 수정합니다.

```ts
export const QR_CODES: QrCode[] = [
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E01"] },
  { id: "p7n3q8", location: LOCATIONS.L1, evidenceIds: ["E09", "E02"] },
  ...
];
```
