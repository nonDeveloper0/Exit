# 17. 조장/조원 권한 · 공유 수사노트 · 사진 장소 탭 기획서

작성일: 2026-07-14 / 상태: **기획 확정, 구현 전**

이 문서는 세 가지 변경의 구현 지시서다. Codex/Claude 어느 도구가 작업하든 이 문서를 정본으로 삼는다.

1. **공유 수사노트** — 기기 저장이던 수사 노트를 조 전체 실시간 공유로 전환, 작성자 이름 표시
2. **사진 장소 탭** — 증거함의 인물 필터 아이콘을 장소 탭으로 교체, 선택한 탭 장소로 사진 업로드
3. **조장/조원 권한** — 전원 조원으로 접속, 조장은 관리자가 지정. 조장만 투표·심문권 사용·사진 업로드

---

## 0. 확정된 결정 (사용자 답변)

| 항목 | 결정 |
|------|------|
| 조장 전용 기능 | **최종 투표(범인 지목) + 심문권 사용 + 사진 업로드** |
| 조원 권한 | 위 3가지 불가. **용의자 탭에서 메모 추가만** 가능(열람은 전부 가능) |
| 조장 지정 방법 | `/admin`에서 **조 번호 + 이름**으로 지정 |
| 기본 권한 | 접속 시 전원 **조원** |
| 사진 촬영 인물 태그 | **제거** — 촬영 시 캡션만, 장소는 선택된 탭으로 자동 |
| 수사노트 공유 방식 | **작성자별 메모 목록** (한 용의자에 여러 명이 각자 메모 추가, 이름 표시, 조 전체 실시간 공유) |

---

## 1. 조장/조원 권한

### 1-1. 신원(이름)의 의미 변경

현재 랜딩(`src/app/page.tsx`)은 `조 번호 + 조장 이름`을 받는다. 이제 **전원이 조원으로 접속**하고 조장은 관리자가 따로 지정하므로, 이 입력란은 **각 참가자 본인의 이름**으로 의미가 바뀐다.

- 랜딩 라벨 `조장 이름` → `이름`, placeholder도 `이름 입력`으로.
- 저장 구조를 `{ teamNumber, leaderName }` → `{ teamNumber, name }`으로 이름 변경(**필드명 rename**).
- 조장 판별은 저장된 `name`과 관리자가 지정한 조장 이름의 일치로 한다. **이름이 정확히 같아야** 조장으로 인식되므로, 운영 시 관리자는 참가자가 입력한 것과 동일한 이름으로 지정해야 한다(주의사항 참고).

### 1-2. 조장 저장소 — `game_state.leaders`

기존 `game_state.pairings`(JSONB)와 동일한 패턴으로 `leaders`(JSONB)를 추가한다. 조당 조장 1명.

```
leaders = { "1": "홍길동", "2": "김철수", ... }   // 조 번호(문자) → 조장 이름
```

- 판별식: `leaders[myTeamNumber] === myName` → 이 기기는 조장.
- `pairings`처럼 Realtime UPDATE로 전 기기에 즉시 반영.

### 1-3. 권한 훅 — `src/lib/useRole.ts` (신규)

```
useRole(): { isLeader: boolean; name: string | null; teamNumber: string | null; loaded: boolean }
```

- `getTeamInfo()`로 `teamNumber`, `name`을 읽는다.
- `game_state.leaders`를 조회 + Realtime UPDATE 구독(채널 카운터 방식은 `useTeamEvidence`/`usePhotoEvidence`와 동일).
- `isLeader = leaders[teamNumber] === name`.
- `loaded`는 최초 조회 완료 여부(권한 판단 전 잠깐의 깜빡임/오차 방지용).

### 1-4. 권한 게이팅

| 화면 | 동작 | 조원 | 조장 |
|------|------|------|------|
| `/vote` | 최종 추리 제출 | 잠금 안내 표시, 제출 버튼 비활성 | 제출 가능 |
| `/suspects` | 심문권 `사용 처리` | 버튼 숨김/비활성 + "조장만 사용" 안내 | 사용 가능 |
| `/suspects` | 수사노트 메모 추가 | **가능** | 가능 |
| `/evidence` | 현장 증거 촬영/업로드 | 버튼 비활성 + "조장만 업로드" 안내 | 가능 |
| `/evidence` | 사진 열람·필터(장소 탭) | 가능 | 가능 |

- 게이팅은 **UI 차단 위주**(이벤트용 앱, 악의적 우회는 고려 대상 아님). `useRole().loaded` 전에는 잠금 상태로 두어 조원이 순간적으로 버튼을 누르는 것을 막는다.
- QR 심문권 **획득**(퀴즈 풀이, `/qr/[id]`)은 조원도 가능(제한 대상은 "사용"뿐).

### 1-5. `/admin` 조장 지정 섹션 (신규)

`조 매핑` 섹션과 동일한 형태로 `조장 지정` 섹션을 추가한다.

- 입력: `조 번호` + `이름` → `지정` 버튼 → `leaders[조번호] = 이름`을 `game_state.update`.
- 현재 지정된 조장 목록 표시(`N조 — 이름`) + `해제` 버튼(`delete leaders[조번호]`).
- 같은 조에 다시 지정하면 덮어쓴다(조당 1명).

---

## 2. 공유 수사노트

### 2-1. 저장소 — `suspect_notes` 테이블 (신규, Supabase SQL 필요)

기기 localStorage 저장(`store.ts`의 `getSuspectNotes`/`saveSuspectNote`)을 폐기하고 Supabase 테이블로 전환한다.

```sql
create table suspect_notes (
  id uuid primary key default gen_random_uuid(),
  pair_id text not null,        -- 조 번호
  suspect_id text not null,     -- 용의자 ID (A~E)
  author_name text not null,    -- 작성자 이름(접속 시 입력한 이름)
  body text not null,           -- 메모 본문
  created_at timestamptz default now()
);
alter table suspect_notes enable row level security;
create policy "anon rw" on suspect_notes for all using (true) with check (true);
alter publication supabase_realtime add table suspect_notes;
```

- **공유 범위 = 조 전체(같은 `pair_id`)**. 짝 조 공유는 하지 않는다(수사노트는 조 내부 논의용). 필요 시 후속으로 확장.
- 조별 초기화/전체 초기화 시 해당 `pair_id`의 `suspect_notes`도 함께 삭제한다(아래 3-5, admin 초기화 로직에 추가).

### 2-2. 훅 — `src/lib/useSuspectNotes.ts` (신규)

```
useSuspectNotes(): {
  notes: Record<suspectId, Note[]>;   // 용의자별 메모 목록(최신순 or 오래된순 택1, 오래된순 권장)
  loading: boolean;
  addNote(suspectId, body): Promise<void>;   // author_name = getTeamInfo().name
  deleteNote(id): Promise<void>;             // 본인 작성분만 삭제(작성자 이름 일치로 판단)
}
interface Note { id; suspectId; authorName; body; createdAt }
```

- 최초 `pair_id = 내 조` 로 조회 + Realtime INSERT/DELETE 구독.
- `addNote`는 빈 문자열 무시(trim). 낙관적 업데이트 후 insert.
- `deleteNote`는 작성자 본인(`authorName === myName`) 메모에만 UI 노출.

### 2-3. `/suspects` 화면

기존 단일 `textarea`(기기 저장) 블록을 **작성자별 메모 목록 + 입력창**으로 교체한다.

- `수사 노트` 영역:
  - 메모 목록: 각 항목에 `작성자 이름` + `본문`(+ 선택적으로 시각). 본인 메모엔 `삭제` 버튼.
  - 하단에 입력창 + `메모 추가` 버튼(모든 참가자 = 조원 포함 사용 가능).
- `store.ts`의 `getSuspectNotes`/`saveSuspectNote` import 제거. 두 함수는 다른 사용처가 없으므로 **제거**(단, `resetAll()`의 `SUSPECT_NOTES_KEY` 삭제 라인은 구버전 기기 청소 목적으로 유지).
- 안내 문구 `메모는 이 기기에만 저장됩니다.` → `메모는 조 전체에 공유됩니다.`

---

## 3. 사진 촬영 — 장소 탭 업로드

### 3-1. 장소 태그 정리 — `src/lib/data.ts`

현재 `PHOTO_LOCATION_TAGS`는 `미지정("")` + 4개 장소다. 탭은 **실제 장소 4개**만 쓴다.

```
WAREHOUSE               자재 물류창고
NA_CEO_OFFICE           나사장 사무실
NA_TEAM_LEADER_OFFICE   나팀장 사무실
CHAE_MANAGER_LAB        채소장 연구실
```

- 탭 라벨은 짧게(`자재 물류창고` 등). `자재 물류창고(사건현장)`의 괄호 표기는 탭에선 생략 가능.
- `미지정("")` 옵션은 탭에서 쓰지 않는다(업로드 시 항상 장소가 선택되어 있음). `photoLocationTagLabel` 헬퍼는 유지.

### 3-2. `/evidence` 화면 변경

**(a) 인물 필터 아이콘 → 장소 탭**
- 상단의 `필터` 버튼 + 드롭다운(인물 `PHOTO_TAGS` 기준) 블록을 **가로 장소 탭 4개**로 교체.
- `activeFilter`(인물) → `activeLocation`(장소) 상태로 교체. 기본값은 첫 장소(`WAREHOUSE`).
- 사진 보드는 **선택된 장소의 사진만** 표시.

**(b) 선택 장소로 업로드**
- 촬영 → 미리보기 → **캡션(20자)만 입력** → 업로드. 업로드 시 `locationTag = activeLocation`.
- 업로드 시트에서 `관련 인물`·`관련 장소` 드롭다운(`MetadataSelects`) **제거**.

**(c) 인물 태그 제거**
- 폴라로이드 카드/라이트박스에서 인물 태그(`suspectTag`) 뱃지 표시 제거. 장소 뱃지는 유지 가능(혹은 탭으로 이미 구분되므로 생략).
- `PHOTO_TAGS`, `photoTagLabel`, `photoTagTone` import 제거(evidence 화면 한정). data.ts의 정의 자체는 테스트(`photoTagPresentation.test.ts`)가 참조하므로 **삭제하지 않는다**.

**(d) 촬영 버튼 권한**
- `현장 증거 촬영` 버튼은 `useRole().isLeader`일 때만 활성. 조원은 비활성 + `조장만 업로드할 수 있습니다` 안내.
- `QR 스캐너` 버튼은 제한 없음.

**(e) 정보 수정 시트**
- 인물 태그 select 제거. **캡션 + 장소 select**만 수정 가능(잘못 분류된 사진 이동용). 캡션 수정은 직전 작업(16번 이후)에서 이미 추가됨.

### 3-3. 필터 로직 — `src/lib/photoEvidenceFilter.ts`

인물(`suspectTag`) 기준 → **장소(`locationTag`) 기준**으로 교체.

```
filterPhotoEvidence(photos, location): photos.filter(p => p.locationTag === location)
```

- `all`/`untagged` 분기 제거(탭은 항상 특정 장소). 테스트(`photoEvidenceFilter.test.ts`)도 장소 기준으로 갱신.

### 3-4. 사진 훅 — `src/lib/usePhotoEvidence.ts`

- `uploadPhoto(file, caption, suspectTag, locationTag)` → `uploadPhoto(file, caption, locationTag)`로 **suspectTag 인자 제거**. insert에서 `suspect_tag`는 넣지 않음(null).
- `updatePhotoMetadata(id, caption, suspectTag, locationTag)` → `updatePhotoMetadata(id, caption, locationTag)`로 suspectTag 제거.
- `suspect_tag` 컬럼 자체는 스키마에 남겨둔다(과거 데이터 보존, 마이그레이션 불필요).

### 3-5. `/admin` 사진 점검

- 사진 점검 카드의 인물 태그 뱃지(`photoTagLabel`/`photoTagTone(suspect_tag)`)는 값이 없어지므로 표시가 사라진다. 장소 표기를 넣고 싶으면 `location_tag`로 교체(선택). 필수는 아님.
- 초기화 로직(`handleReset`, `handleResetAll`, `deleteTeamPhotos`)에 **`suspect_notes` 삭제**를 추가한다(조별/전체 초기화 시 노트도 정리).

---

## 4. Supabase 사전 준비 (구현 전 1회 실행)

`Supabase SQL Editor`에서 실행:

```sql
-- (1) 공유 수사노트 테이블
create table suspect_notes (
  id uuid primary key default gen_random_uuid(),
  pair_id text not null,
  suspect_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz default now()
);
alter table suspect_notes enable row level security;
create policy "anon rw" on suspect_notes for all using (true) with check (true);
alter publication supabase_realtime add table suspect_notes;

-- (2) 조장 저장 컬럼
alter table game_state add column if not exists leaders jsonb not null default '{}'::jsonb;
```

---

## 5. 파일별 변경 요약

| 파일 | 변경 |
|------|------|
| `src/lib/store.ts` | `leaderName` → `name` rename(`getTeamInfo`/`saveTeamInfo`). `getSuspectNotes`/`saveSuspectNote` 제거(`resetAll`의 키 삭제는 유지) |
| `src/app/page.tsx` | 라벨 `조장 이름`→`이름`, 상태/placeholder 갱신 |
| `src/app/vote/page.tsx` | `team.leaderName`→`team.name`. 조원이면 제출 잠금 + 안내. 제출자=조장 |
| `src/lib/useRole.ts` (신규) | `game_state.leaders` 기반 `isLeader` 판별 훅 |
| `src/app/admin/page.tsx` | `조장 지정` 섹션 추가(leaders CRUD). 초기화에 `suspect_notes` 삭제 추가. 사진 점검 인물 태그 정리 |
| `src/lib/useSuspectNotes.ts` (신규) | 조별 공유 노트 조회/구독/추가/삭제 |
| `src/app/suspects/page.tsx` | 노트 textarea → 작성자별 메모 목록+입력. 심문권 `사용`은 조장만 |
| `src/lib/data.ts` | `PHOTO_LOCATION_TAGS`에서 `미지정` 제외한 탭용 목록 정리(라벨 축약) |
| `src/app/evidence/page.tsx` | 인물 필터→장소 탭, 업로드=선택 장소, 인물 태그/드롭다운 제거, 촬영 버튼 조장 전용, 수정 시트 캡션+장소 |
| `src/lib/photoEvidenceFilter.ts` | 인물→장소 기준 필터 |
| `src/lib/usePhotoEvidence.ts` | `uploadPhoto`/`updatePhotoMetadata`에서 suspectTag 인자 제거 |
| `tests/photoEvidenceFilter.test.ts` | 장소 기준으로 갱신 |
| `docs/01_md/07_DATA_SCHEMA.md`, `EDIT_GUIDE.md` | 스키마/운영법 갱신 |

---

## 6. 수용 기준 (Acceptance)

**권한**
- [ ] 접속 직후 전원 조원. 어떤 기기도 조장 전용 기능 사용 불가.
- [ ] `/admin`에서 `3조 + 홍길동` 지정 → 3조에서 이름을 `홍길동`으로 접속한 기기만 조장 기능 활성(Realtime 즉시 반영).
- [ ] 조장 기기: `/vote` 제출, `/suspects` 심문권 사용, `/evidence` 촬영 가능. 조원 기기: 셋 다 잠금, 메모 추가만 가능.
- [ ] `/admin`에서 조장 해제 시 해당 기기 권한 즉시 회수.

**공유 수사노트**
- [ ] 조원 A가 용의자 B에 메모 추가 → 같은 조 다른 기기에 작성자 이름과 함께 즉시 표시.
- [ ] 본인 메모만 삭제 버튼 노출, 삭제 시 조 전체에서 사라짐.
- [ ] 조별/전체 초기화 시 노트도 삭제.

**사진 장소 탭**
- [ ] 증거함 상단이 장소 탭 4개(필터 아이콘 없음). 탭 전환 시 해당 장소 사진만 표시.
- [ ] `나팀장 사무실` 탭 선택 후 촬영·업로드 → 그 사진의 `location_tag`가 `NA_TEAM_LEADER_OFFICE`, 해당 탭에 표시.
- [ ] 업로드 시 인물 선택 없음(캡션만). 카드/라이트박스에 인물 태그 미표시.
- [ ] `npm run lint`, `npm test` 통과, Supabase env 주입 후 `npm run build` 통과.

---

## 7. 미결/주의사항

- **이름 일치 정확도**: 조장 판별이 문자열 완전 일치라 오타/공백 차이로 조장 인식 실패 가능. 대응안(택1, 구현 시 결정): (a) 관리자가 목록에서 선택하도록 접속자 이름을 DB에 수집·제공, (b) 판별 시 `trim()`만 적용하고 운영으로 커버. 기본은 (b) + `trim`.
- **조당 조장 1명** 전제. 복수 조장이 필요하면 `leaders`를 `조번호 → 이름[]`로 확장.
- **노트 짝 조 공유 안 함**(조 내부용). 요청 시 후속 확장.
- 과거 업로드된 `location_tag = null` 사진은 4개 탭 어디에도 안 보임(이벤트 전 데이터라 무시). 필요 시 초기화로 정리.
