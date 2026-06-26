# EXIT 2026 — Architecture

## Overview

이벤트용 모바일 웹앱. 참가자 80명이 QR 코드를 스캔해 증거를 수집하고 범인을 투표하는 크라임씬 게임.

- Framework: Next.js 15 (App Router, TypeScript)
- Hosting: Vercel
- State: localStorage (서버 없음, 순수 클라이언트)

---

## Route Structure

```
/                   → 랜딩 페이지 (조 번호 + 조장 이름 입력, 애니메이션 배경)
/home               → 수사본부 메인 (사건 개요, 증거 수집 현황, QR 구역 지도)
/evidence           → 증거함 (수집된 증거 목록)
/suspects           → 용의자 파일 (A, B, C 카드)
/vote               → 최종 추리 (용의자 선택 → Google Form, 최대 2회)
/ending             → 엔딩 화면 (모세 반전 공개)
/qr/[slug]          → QR 증거 수집 페이지 (6자 opaque slug, 총 8개)
/reset              → 데이터 초기화 (운영용)
```

---

## Component Structure

```
src/
├── app/
│   ├── layout.tsx              — 루트 레이아웃 (BottomNav 포함, max-w-md 컨테이너)
│   ├── globals.css             — Tailwind + 커스텀 애니메이션 (blob, grid-overlay, text-glow)
│   ├── page.tsx                — 랜딩 페이지 (Client Component, 조/이름 입력)
│   ├── home/page.tsx           — 수사본부 메인 (Client Component)
│   ├── evidence/page.tsx       — 증거함
│   ├── suspects/page.tsx       — 용의자 파일
│   ├── vote/page.tsx           — 최종 추리
│   ├── ending/page.tsx         — 엔딩
│   ├── qr/[id]/
│   │   ├── page.tsx            — QR 라우트 핸들러 (Server, data fetch)
│   │   └── QrPageClient.tsx    — QR 증거 수집 UI (Client Component)
│   └── reset/page.tsx          — 초기화
└── components/
│   └── BottomNav.tsx           — 하단 내비게이션 (/, 즉 랜딩에서는 숨김)
└── lib/
    ├── data.ts                 — 정적 데이터 (EVIDENCE, SUSPECTS, QR_LOCATIONS)
    └── store.ts                — localStorage 헬퍼 (증거 수집, 투표, 초기화)
```

---

## Data Layer

모든 데이터는 `src/lib/data.ts`에 하드코딩된 상수. 서버/DB 없음.

| 상수 | 타입 | 내용 |
|------|------|------|
| `EVIDENCE` | `Evidence[]` | 증거 10종 (id, title, description, qrId, imageUrl?) |
| `SUSPECTS` | `Suspect[]` | 용의자 3인 (A, B, C) |
| `QR_LOCATIONS` | `QrLocation[]` | QR 장소 8개 (id: 6자 opaque slug) |

---

## State Management

`src/lib/store.ts` — localStorage 직접 사용. Zustand/Context 없음.

| 키 | 값 | 설명 |
|----|-----|------|
| `exit2026_evidence` | `string[]` (JSON) | 수집된 증거 id 배열 |
| `exit2026_vote` | `string` | 선택한 용의자 id |
| `exit2026_team` | `JSON` | 조 번호 + 조장 이름 (랜딩에서 저장) |
| `exit2026_submit_count` | `string` | 투표 제출 횟수 (최대 2회) |

---

## Navigation

- **BottomNav**: 수사본부(`/home`), 증거함(`/evidence`), 용의자(`/suspects`), 최종추리(`/vote`)
- 랜딩(`/`)에서는 BottomNav 숨김
- QR 페이지에서 뒤로가기 → `/home`

---

## Key Design Decisions

- **No server, no auth**: 이벤트 특성상 단순함 우선. localStorage로 조별 독립 상태 유지.
- **App Router Server/Client 분리**: 데이터 fetch(QR route)는 Server Component, 상호작용(증거 수집)은 Client Component.
- **max-w-md 고정**: 80인 이벤트용 모바일 최적화. 데스크탑 레이아웃 불필요.
