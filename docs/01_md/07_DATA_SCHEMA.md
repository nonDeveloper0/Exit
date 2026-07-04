# DATA SCHEMA

## Evidence
```ts
{
  id: string;          // "E01" ~ "E10"
  title: string;       // 증거 이름
  description: string; // 증거 내용
  imageUrl?: string;   // 증거 이미지 경로 (public/ 기준, 예: "/02_blood.png")
  audioUrl?: string;   // 음성 힌트 경로 (public/audio/ 기준, 예: "/audio/E01.mp3")
  videoUrl?: string;   // 영상 힌트 경로 (public/video/ 기준, 예: "/video/E03.mp4")
}
```

## Suspect
```ts
{
  id: string;                              // "A" | "B" | "C" | "D" | "E"
  codename: string;                        // "용의자 A"
  role: string;                            // 직책
  motive: string;                          // 실제 동기 (motiveRevealIds 충족 시 공개)
  motiveRevealIds: string[];               // 이 증거들을 모두 수집해야 motive 표시 (빈 배열 = 항상 숨김)
  description: string;                     // 상세 설명
  motiveLevel: "높음" | "중간" | "낮음" | "불명";
}
```

## QrCode
```ts
{
  id: string;          // 6자 opaque slug (예: "x4k9m2") — QR 코드 URL에 사용
  location: string;    // 장소명 — LOCATIONS 상수 값 사용
  evidenceIds: string[]; // 이 QR로 수집 가능한 증거 ID 목록 (1~2개)
}
```

## LOCATIONS 상수
```ts
export const LOCATIONS = {
  L1: "살해 현장",
  L2: "CCTV 관제실",
  L3: "주차장",
  L4: "창고",
} as const;
```

---

## Supabase 테이블: `team_evidence_items`

증거 수집 상태를 조 단위로 저장. 같은 조는 실시간으로 공유됨.

```sql
CREATE TABLE team_evidence_items (
  pair_id     TEXT NOT NULL,           -- 조 번호 (숫자 문자열, 예: "1", "2")
  evidence_id TEXT NOT NULL,           -- 증거 ID: "E01" ~ "E10", 또는 "_joined" (입장 마커)
  type        TEXT NOT NULL,           -- "collected" | "joined"
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (pair_id, evidence_id, type)
);
```

- `type='joined'`, `evidence_id='_joined'`: 입장 시 기록되는 마커. 현황 페이지에서 증거 0개인 조도 표시하기 위해 사용.

## Supabase 테이블: `game_state`

게임 진행 상태를 담는 단일 행 (`id = 'singleton'`). Realtime 구독으로 전 참가자에 전파.

```sql
CREATE TABLE game_state (
  id          TEXT PRIMARY KEY,         -- 항상 "singleton"
  vote_round  INTEGER NOT NULL DEFAULT 0, -- 0=닫힘, 1=중간 투표, 2=최종 투표
  ending_open BOOLEAN NOT NULL DEFAULT false, -- 엔딩 공개 여부
  pairings    JSONB DEFAULT '{}',       -- 조 매핑 (양방향), 예: {"1":"3","3":"1"}
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

- `pairings`: 관리자가 짝지은 두 조를 서로 가리키도록 양방향 저장. 짝 팀끼리 증거 합집합 공유.

## localStorage 키 (기기별 독립)

| 키 | 저장 내용 |
|----|-----------|
| `exit2026_team` | 조 정보 JSON (예: `{"teamNumber":"1","leaderName":"홍길동"}`) |
| `exit2026_vote_r1` | 중간 투표(1라운드)에서 선택한 용의자 ID (예: `"C"`) |
| `exit2026_vote_r2` | 최종 투표(2라운드)에서 선택한 용의자 ID |
