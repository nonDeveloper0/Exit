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
| type | TEXT | "collected" — Primary Key의 일부 |
| created_at | TIMESTAMPTZ | 수집 시각 |

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
| `/vote` | 최종 투표 (용의자 선택 → Google Form, 최대 2회) |
| `/ending` | 엔딩 (반전 공개 — 모세 이야기) |
| `/reset` | 초기화 (운영용, Supabase + localStorage 삭제 — 배포 전 제거 예정) |

## 상태 저장 위치

| 데이터 | 저장소 |
|--------|--------|
| 증거 수집 | Supabase (조 단위 공유) |
| 조 번호 / 조장 이름 | localStorage (기기별) |
| 투표 내용 | localStorage (기기별) |
| 제출 횟수 | localStorage (기기별) |
