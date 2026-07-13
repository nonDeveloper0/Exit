# DATA SCHEMA

## Evidence
```ts
{
  id: string;          // "E01" ~ "E16" (+ 수신전화 "CALL01"). E16은 노트북 디바이스 수집(QR 없음)
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
  codename: string;                        // "용의자 A" (카드 상단 라벨)
  name: string;                            // 이름, 예: "나사장" (카드 큰 제목)
  role: string;                            // 직책 (데이터용, 카드 미표시)
  motive: string;                          // 실제 동기 (motiveRevealIds 충족 시 공개)
  motiveRevealIds: string[];               // 이 증거들을 모두 수집해야 motive 표시 (빈 배열 = 항상 숨김)
  relatedEvidenceIds: string[];            // 관련 단서 (용의자당 고유 3개), 카드에 목록 표시
  interrogationTriggerId?: string;         // 이 증거 수집 시 심문권 획득 (미지정 = 심문권 UI 숨김)
  description: string;                     // 상세 설명
  motiveLevel: "높음" | "중간" | "낮음" | "불명";
}
```

## QrCode
```ts
{
  id: string;          // 6자 opaque slug (예: "x4k9m2") — QR 코드 URL에 사용
  location: string;    // 장소명 — LOCATIONS 상수 값 사용
  evidenceIds: string[]; // 구버전 QR 증거 매핑 보존용. 현재 참가자 UI에서는 직접 수집에 사용하지 않음
}
```

## PhotoItem / `photo_evidence`
```ts
{
  id: string;          // uuid
  pairId: string;      // 조 번호. 짝 조가 있으면 함께 조회
  imageUrl: string;    // Supabase Storage 공개 URL
  caption: string | null;    // 20자 이내
  suspectTag: string | null; // "A"|"B"|"C"|"D"|"E"|"PARK"|null
  createdAt: string;
}
```

## InterrogationQuiz
```ts
{
  suspectId: string; // "A" | "B" | "C" | "D" | "E"
  question: string;
  answer: string;
}
```

## LOCATIONS 상수
```ts
export const LOCATIONS = {
  L1: "자재 물류창고", // 사건 현장
  L2: "나사장 집무실",
  L3: "나팀장 사무실",
  L4: "채소장 연구실",
} as const;
```

---

## Supabase 테이블: `team_evidence_items`

증거 수집 상태를 조 단위로 저장. 같은 조는 실시간으로 공유됨.

```sql
CREATE TABLE team_evidence_items (
  pair_id     TEXT NOT NULL,           -- 조 번호 (숫자 문자열, 예: "1", "2")
  evidence_id TEXT NOT NULL,           -- 증거 ID: "E01" ~, "_joined"(입장 마커), 또는 심문권은 용의자 ID("A"~"E")
  type        TEXT NOT NULL,           -- "collected" | "joined" | "interrogation_earned" | "interrogation_used" | "incoming_call"
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (pair_id, evidence_id, type)
);
```

- `type='joined'`, `evidence_id='_joined'`: 입장 시 기록되는 마커. 현황 페이지에서 증거 0개인 조도 표시하기 위해 사용.
- `type='interrogation_earned'`, `evidence_id=용의자 ID`: QR 문제 정답으로 해당 용의자 심문권을 획득했다는 마커. 조 전체·짝 조가 공유하며 랭킹 집계에서는 제외됨.
- `type='interrogation_used'`, `evidence_id=용의자 ID`: 해당 용의자 심문권을 사용(소모)했다는 마커. 조 전체·짝 조가 공유하며 랭킹 집계에서는 제외됨.
- `pair_id='__global'`: 공통 단서(`COMMON_EVIDENCE_IDS`) 저장소. 어느 조가 찾든 이 가상 조에 기록되고, 모든 조가 이 pair_id를 함께 구독해 전체 공개된다. 랭킹/관리자 조 목록에서는 제외됨.
- `pair_id=대상 조 번호`, `evidence_id='_incoming_call'`, `type='incoming_call'`: 수신전화 연출 활성 마커. 공기계에서 전화를 받으면 이 `pair_id` 조에 `CALL01`이 수집되고, 마커를 삭제하면 전화가 종료된다.

## Supabase 테이블: `photo_evidence`

사진 증거(폴라로이드) 보드의 메타데이터. 실제 이미지 파일은 Storage `evidence-photos` 버킷에 저장된다.

```sql
CREATE TABLE photo_evidence (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id     TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  suspect_tag TEXT,
  status      TEXT NOT NULL DEFAULT 'ok', -- ok | rejected
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

기존 테이블에는 아래 SQL을 한 번 실행한다.

```sql
ALTER TABLE photo_evidence
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ok';
```

- `pair_id`: 업로드한 조 번호. `game_state.pairings`에 짝 조가 있으면 두 조의 사진을 함께 조회한다.
- `image_url`: public 버킷 `evidence-photos`의 공개 URL.
- `caption`: UI에서 20자까지 입력 가능. 빈 값은 `null`.
- `suspect_tag`: `PHOTO_TAGS`의 value. `A`~`E`는 용의자 파일의 관련 사진으로 표시되고, `PARK`는 피해자 태그 전용이다.
- `status`: 기본값 `ok`는 보드와 사진 랭킹에 포함된다. 스탭이 스팸을 `rejected`로 바꾸면 사진은 보드에 제외됨으로 남지만 랭킹에서는 빠진다.
- Realtime INSERT/UPDATE/DELETE를 구독해 같은 조와 짝 조 기기에 즉시 반영한다. 수사 현황 랭킹은 `status='ok'` 사진 행 수를 기준으로 한다.

## Supabase 테이블: `game_state`

게임 진행 상태를 담는 단일 행 (`id = 'singleton'`). Realtime 구독으로 전 참가자에 전파.

```sql
CREATE TABLE game_state (
  id          TEXT PRIMARY KEY,         -- 항상 "singleton"
  vote_round  INTEGER NOT NULL DEFAULT 0, -- 0=닫힘, 2=최종 투표 열림
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
| `exit2026_vote_final` | 최종 투표에서 선택한 용의자 ID (예: `"C"`, 1회 제출) |
| `exit2026_incoming_call_handled` | 처리한 수신전화 이벤트의 `created_at` 값. 같은 전화가 반복 표시되지 않도록 기기별 저장 |
| `exit2026_call_device` | `/phone`에서 지정한 수신 전용 기기 여부 (`1`이면 활성) |
## Admin evidence release marker

관리자 `/admin`의 `모든 단서 개방`은 별도 테이블이나 컬럼 없이 `team_evidence_items` 전역 마커를 사용한다.

- `pair_id='__global'`
- `type='admin_open_all_snapshot'`
- `evidence_id='_open_all_evidence_snapshot:{encoded-json}'`

`encoded-json`은 전체 개방 직전 이미 전역 공개되어 있던 evidence id 배열이다. `이전 상태로 되돌리기`는 이 스냅샷에 없던 전역 `type='collected'` 단서만 삭제한다. `단서 전체 초기화`는 모든 조의 `type='collected'` evidence id와 이 스냅샷 마커를 함께 삭제한다.
