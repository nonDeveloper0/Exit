# DEV SPEC

Framework: Next.js (App Router)
Language: TypeScript
Hosting: Vercel (nonDeveloper0/Exit, Production Branch: master)
DB / Realtime: Supabase

---

## Supabase 구조

**테이블: `team_evidence_items`**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| pair_id | TEXT | 조 번호 (숫자 문자열, 예: "1", "2") — Primary Key의 일부 |
| evidence_id | TEXT | 증거 ID ("E01" 등) — Primary Key의 일부 |
| type | TEXT | "collected" 또는 "joined" — Primary Key의 일부 |
| created_at | TIMESTAMPTZ | 수집 시각 |

**테이블: `game_state`**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | TEXT | Primary Key, 항상 "singleton" |
| vote_open | BOOLEAN | 최종 투표 활성화 여부 (기본 false) |
| ending_open | BOOLEAN | 엔딩 공개 여부 (기본 false) |
| updated_at | TIMESTAMPTZ | 마지막 변경 시각 |

- 단일 행 (`id = 'singleton'`) 으로 관리
- Realtime 활성화됨 (`supabase_realtime` publication)
- RLS 비활성화 (인증 없는 이벤트용 앱)

**환경변수 (`.env.local`)**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## QR 페이지 흐름

```
/qr/[slug] 접속 (예측 불가능한 6자 slug)
    ↓
QR_CODES에서 slug 조회 → evidenceIds 확인
    ↓
증거 1~2개 공개 + 수집 버튼
    ↓
수집 클릭 → Supabase upsert → 같은 조 기기에 Realtime 전파
```

## 투표 흐름

```
/ 랜딩에서 조 번호(숫자) + 조장 이름 입력 → localStorage 저장
    ↓
/vote 접속 (팀 정보 자동 표시)
    ↓
용의자 선택 (A / B / C / D / E)
    ↓
제출 → Google Form 전송 (entry: 197462467, 1747885092, 795452093)
    ↓
최대 2회 제출 가능 (재제출 시 Google Sheets에 새 행 추가됨)
    ↓
운영자가 Google Sheets에서 조별 최신 행 확인
```

## 페이지 구성

| 경로 | 역할 |
|------|------|
| `/` | 랜딩 (조 번호 숫자 입력 + 조장 이름 입력 → 입장하기) |
| `/home` | 수사본부 (사건 개요, 진행률, QR 수집 현황) |
| `/qr/[slug]` | QR 증거 수집 (slug: 6자 opaque, 1~2개 증거) |
| `/evidence` | 수집한 증거 보관함 |
| `/suspects` | 용의자 카드 (A, B, C, D, E — 5명) |
| `/ranking` | 전체 조 실시간 수사 현황 랭킹 |
| `/vote` | 최종 투표 (용의자 선택 → Google Form, 최대 2회) |
| `/ending` | 엔딩 (반전 공개 — 모세 이야기) |
| `/admin` | 관리자 패널 (PIN 0000) — 게임 진행 제어(투표/엔딩) + 조별 증거 초기화 |

## 상태 저장 위치

| 데이터 | 저장소 |
|--------|--------|
| 증거 수집 | Supabase (조 단위 공유) |
| 조 번호 / 조장 이름 | localStorage (기기별) |
| 투표 내용 | localStorage (기기별) |
| 제출 횟수 | localStorage (기기별) |
| 게임 진행 상태 (투표/엔딩 열림) | Supabase `game_state` (전체 공유, Realtime) |
| 관리자 인증 | sessionStorage (탭 단위, PIN 0000) |
