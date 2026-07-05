# EXIT 2026 — Architecture

## Overview

이벤트용 모바일 웹앱. 참가자 80명이 QR 코드를 스캔해 증거를 수집하고 범인을 투표하는 크라임씬 게임.

- Framework: Next.js 16 (App Router, TypeScript)
- Styling: Tailwind CSS v4
- DB / Realtime: Supabase (조별 증거 실시간 공유, 게임 진행 상태 제어)
- Hosting: Vercel (nonDeveloper0/Exit, master 브랜치 자동 배포)
- State: Supabase(공유 상태) + localStorage(기기별 상태)

---

## Route Structure

```
/                   → 랜딩 (조 번호 숫자 + 조장 이름 입력, 애니메이션 배경, 입장 시 joined 마커 기록)
/home               → 수사본부 메인 (사건 개요, 증거 수집 진행률, QR 수집 현황)
/evidence           → 증거함 (수집된 증거 목록, 조 공유 실시간 반영)
/suspects           → 용의자 파일 (A, B, C, D, E 카드)
/vote               → 최종 추리 (용의자 선택 → Google Form, 1회 제출)
/ranking            → 수사 현황 (전체 조 실시간 랭킹, 매핑된 조는 묶어서 표시)
/ending             → 엔딩 (모세 반전 공개)
/qr/[id]            → QR 증거 수집 페이지 (6자 opaque slug, 총 6개)
/admin              → 관리자 패널 (PIN 인증 → 투표/엔딩 제어, 조 매핑, 조별/전체 초기화)
```

---

## Component Structure

```
src/
├── app/
│   ├── layout.tsx              — 루트 레이아웃 (BottomNav, GameStateRedirect, max-w-md 컨테이너)
│   ├── globals.css             — Tailwind + 커스텀 애니메이션 (blob, grid-overlay, text-glow)
│   ├── page.tsx                — 랜딩 페이지 (Client Component, 조/이름 입력 + joined 기록)
│   ├── home/page.tsx           — 수사본부 메인 (Client Component)
│   ├── evidence/page.tsx       — 증거함
│   ├── suspects/page.tsx       — 용의자 파일 (5인)
│   ├── vote/page.tsx           — 최종 추리 (1회 제출)
│   ├── ranking/page.tsx        — 수사 현황 랭킹
│   ├── ending/page.tsx         — 엔딩
│   ├── qr/[id]/
│   │   ├── page.tsx            — QR 라우트 핸들러 (Server, data fetch)
│   │   └── QrPageClient.tsx    — QR 증거 수집 UI (Client Component, 잠금 해제/음성·영상 힌트)
│   └── admin/page.tsx          — 관리자 패널 (PIN 게이트 + 게임 제어)
├── components/
│   ├── BottomNav.tsx           — 하단 5탭 내비게이션 (/, /ending에서는 숨김)
│   └── GameStateRedirect.tsx   — ending_open 활성화 시 전 참가자 기기 자동 /ending 이동
└── lib/
    ├── data.ts                 — 정적 데이터 (EVIDENCE, SUSPECTS, QR_CODES, LOCATIONS 등)
    ├── store.ts                — localStorage 헬퍼 (조 정보, 투표 기록)
    ├── supabase.ts             — Supabase 클라이언트
    ├── useTeamEvidence.ts      — 내 조 + 매핑된 파트너 조 증거 실시간 구독/수집
    ├── useGameState.ts         — voteOpen / ending_open 구독
    └── useAllTeamsProgress.ts  — 전체 조 진행 현황 + 매핑 그룹화 (랭킹)
```

---

## Data Layer

정적 게임 데이터는 `src/lib/data.ts`에 하드코딩된 상수. 참가자 진행 상태는 Supabase에 저장.

| 상수 | 타입 | 내용 |
|------|------|------|
| `EVIDENCE` | `Evidence[]` | 증거 10종 (id, title, description, imageUrl?, audioUrl?, videoUrl?) |
| `SUSPECTS` | `Suspect[]` | 용의자 5인 (A~E, motiveRevealIds로 동기 공개 트리거) |
| `QR_CODES` | `QrCode[]` | QR 6개 (id: 6자 opaque slug → location + evidenceIds) |
| `LOCATIONS` | `object` | 장소명 4개 (한 곳만 수정하면 전체 반영) |
| `LOCKED_EVIDENCE` | `Record<string,string>` | 비밀번호 잠금 증거 { 증거ID: 비밀번호 } |
| `EVIDENCE_QUIZ` | `Record<string,string>` | 잠금 증거 퀴즈 문제 |
| `VOTE_UNLOCK_COUNT` | `number` | 투표 제출에 필요한 최소 증거 수 (0 = 제한 없음) |

---

## State Management

### Supabase (공유 상태, Realtime)

| 테이블 | 키 | 설명 |
|--------|-----|------|
| `team_evidence_items` | `(pair_id, evidence_id, type)` | 조별 증거 수집. type = `collected` \| `joined` (`_joined` 마커는 증거 0개 조 표시용) |
| `game_state` | `id = "singleton"` | 게임 진행 상태 단일 행 |

`game_state` 컬럼: `vote_round`(0=닫힘 / 2=최종 투표 열림 — 중간 투표는 폐지되어 1은 미사용), `ending_open`(boolean), `pairings`(JSONB, 조 짝짓기 `{ "1": "3", "3": "1" }`).

### localStorage (기기별 상태)

`src/lib/store.ts` — Zustand/Context 없이 localStorage 직접 사용.

| 키 | 값 | 설명 |
|----|-----|------|
| `exit2026_team` | `JSON` | 조 번호 + 조장 이름 (랜딩에서 저장) |
| `exit2026_vote_final` | `string` | 최종 투표에서 선택한 용의자 id (1회 제출) |

### sessionStorage

관리자 PIN 인증 상태 (탭 단위, 탭 닫으면 재인증).

---

## Realtime Sync

Supabase Realtime `postgres_changes` 구독으로 실시간 동기화.

- **증거 공유**: 같은 조 번호(또는 매핑된 파트너 조)의 증거 수집이 즉시 상대 기기에 반영 (`useTeamEvidence`).
- **조 매핑(pairings)**: 관리자가 두 조를 짝지으면 서로 증거 합집합을 공유하고, 랭킹에서 묶여 표시.
- **게임 제어**: 관리자가 투표를 열거나 엔딩을 공개하면 전 참가자 기기에 즉시 전파 (`useGameState`, `GameStateRedirect`).
- **잠금 해제 상태는 공유 안 됨**: 비밀번호 해제는 로컬 전용, 수집 여부만 공유.

---

## Navigation

- **BottomNav (5탭)**: 수사본부(`/home`), 증거함(`/evidence`), 용의자(`/suspects`), 현황(`/ranking`), 최종추리(`/vote`)
- 랜딩(`/`)과 엔딩(`/ending`)에서는 BottomNav 숨김
- QR 페이지에서 뒤로가기 → `/home`

---

## Key Design Decisions

- **조 = 숫자 직접 입력**: 같은 숫자를 입력한 기기끼리 증거 공유. 조 수 확장 시 코드 수정 불필요.
- **App Router Server/Client 분리**: 데이터 fetch(QR route)는 Server Component, 상호작용은 Client Component.
- **No auth**: 이벤트 특성상 인증 없음. 관리자만 PIN 게이트로 보호, Supabase RLS 비활성화.
- **max-w-md 고정**: 80인 이벤트용 모바일 최적화. 데스크탑 레이아웃 불필요.
