# 19. 최종추리 제출 서버화 — Codex 인수인계 지시서

**작성 목적:** 최종추리 제출을 localStorage에서 서버(`final_votes`)로 옮기는 작업이 코드까지 완료·푸시된 상태다. 사람은 **Supabase SQL 실행만** 담당하고, 이후 **검증과 후속 작업은 Codex가 진행**한다. 이 문서는 그 인수인계다.

> 인코딩 규칙: 이 저장소의 모든 텍스트 파일은 **UTF-8(BOM 없음) + LF**. Write/Edit 도구로만 저장하고 PowerShell 리다이렉트로 한글 파일을 쓰지 말 것. (CLAUDE.md 참고)

---

## 0. 현재 상태 (시작 전 확인)

- 코드 변경은 이미 커밋·푸시됨. 기준 커밋: **`42afd8c`** (`feat: move final deduction submission to server (final_votes)`).
- 시작 전에 `git pull`로 최신 상태를 받고 `git log --oneline -5`에 위 커밋이 있는지 확인할 것.
- 작업 시작/완료 시 `progress.md`를 자동 갱신할 것 (프로젝트 기본 절차).

---

## 1. 사람이 담당하는 단계 (SQL) — Codex는 실행 여부만 확인

사람이 Supabase 대시보드 → SQL Editor에서 아래를 실행한다. **Codex는 이 SQL을 대신 실행하지 않는다.** 다만 검증 전에 "적용됐는지"를 확인해야 한다.

```sql
create table if not exists final_votes (
  pair_id    text primary key,           -- 조 번호 (예: "1")
  suspect_id text not null,              -- 선택한 용의자 ID ("A"~"E")
  reasoning  text not null default '',   -- 추리 근거
  name       text not null default '',   -- 제출자 이름
  created_at timestamptz not null default now()
);
alter table final_votes enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'final_votes' and policyname = 'anon rw') then
    create policy "anon rw" on final_votes for all using (true) with check (true);
  end if;
end $$;
do $$ begin
  alter publication supabase_realtime add table final_votes;
exception when duplicate_object then null;
end $$;
```

이 SQL의 정본은 `docs/01_md/07_DATA_SCHEMA.md`의 "최종추리 제출 SQL (`final_votes`)" 절에 있다.

**적용 확인:** 사람에게 "SQL 실행 완료" 여부를 확인받는다. (Codex가 직접 DB에 접근할 수 없으면, 아래 검증에서 제출이 성공하는지로 간접 확인한다. 제출 시 `final_votes` insert가 실패하면 `alert("제출 저장에 실패했습니다...")`가 뜨므로, 이 alert가 뜨면 SQL 미적용을 의심할 것.)

---

## 2. 이번 마이그레이션에서 바뀐 것 (맥락)

**동기:** 제출 상태가 localStorage 전역 키(`exit2026_vote_final`) 하나에만 있어서 두 가지 버그가 있었다.
1. 같은 기기에서 조를 바꿔도 이전 조 제출이 "이미 제출됨"으로 남음.
2. "전체 조 초기화"가 참가자 기기의 제출 상태를 못 지움(그래서 VOTE_RESET 브로드캐스트 꼼수로 우회하던 중이었음).

**해결:** 제출을 **조 단위 서버 행(`final_votes`)**으로 저장하도록 이전. 위 두 버그가 구조적으로 사라지고, **추리 근거 텍스트도 서버에 저장**되어 새로고침·기기변경에도 유지된다.

**변경된 파일과 역할:**
- `src/lib/useFinalVote.ts` (신규): `final_votes`에서 내 조 제출을 조회 + Realtime 구독(초기화 즉시 반영) + `submit(suspectId, reasoning)` upsert.
- `src/app/vote/page.tsx`: 로컬 vote/브로드캐스트 제거 → `useFinalVote` 사용. 제출 완료 화면은 서버 값(`vote.suspectId`, `vote.reasoning`)에서 렌더.
- `src/lib/store.ts`: `getVote/castVote/clearVote` 제거(레거시 키 `exit2026_vote_final` 정리는 `resetAll`에 유지).
- `src/app/page.tsx`: 조 전환 시 `clearVote` 호출 제거(서버 조 단위라 불필요).
- `src/app/admin/page.tsx`: `resetFinalVotes`·`handleResetAll`이 `final_votes` 행 삭제로 변경. VOTE_RESET 브로드캐스트 코드/임포트 제거.
- `src/lib/data.ts`: `VOTE_RESET_EVENT_ID/TYPE` 제거.
- `docs/01_md/07_DATA_SCHEMA.md`, `docs/01_md/EDIT_GUIDE.md`(§10): 문서 갱신.

**주의:** `useBroadcastEvent` 훅 자체는 수신전화/문자/경보 등 다른 연출이 쓰므로 **삭제하지 않았다.** VOTE_RESET 관련만 걷어냄.

---

## 3. Codex가 진행할 일 — 검증 (필수)

앱을 실제로 띄워 아래 시나리오를 검증한다. 각 항목의 기대 결과가 맞는지 확인하고, 어긋나면 원인을 찾아 수정한다. (참고: 최종 투표가 열려 있어야 함 — `/admin`에서 투표 열기, 그리고 제출은 조장만 가능 → `game_state.leaders` 또는 스태프 이름 필요. `src/lib/staffRole.ts`, `src/lib/useRole.ts` 참고.)

- [ ] **제출**: 1조(조장)로 입장 → 용의자 선택 + 근거 입력 → 제출 → "최종 추리 완료" 화면에 선택 용의자·근거·제출자 표시.
- [ ] **영속성(핵심 개선)**: 제출 후 **새로고침** → 여전히 완료 화면이고 **추리 근거가 그대로 보임**(이전엔 새로고침 시 근거가 사라졌음).
- [ ] **조 전환 버그 해소**: 같은 브라우저에서 첫 화면으로 돌아가 **2조로 입장** → 제출 완료가 아니라 **깨끗한 제출 폼**이 떠야 함.
- [ ] **초기화 즉시 반영(핵심 개선)**: 1조 제출 상태에서, 다른 창의 `/admin` → "최종추리 제출 초기화" 클릭 → 참가자 화면이 **새로고침 없이** 제출 폼으로 돌아옴(Realtime DELETE 구독).
- [ ] **전체 조 초기화**: `/admin` → "전체 조 초기화" → 모든 조의 제출이 사라지고, 참가자 화면도 폼으로 복귀.
- [ ] **구글폼 병행 전송**: 제출 시 기존처럼 구글폼으로도 전송되는지(`submitToGoogleForm`) — 매핑/동작 유지 확인.
- [ ] **회귀 없음**: `npx tsc --noEmit`(src 오류 없음), `npm test`(현재 10개 통과), 변경 파일 lint 클린.

검증 중 문제가 있으면 **외과적으로** 수정하고 `progress.md`에 기록. 커밋/푸시는 사용자 요청 시에만.

---

## 4. 보류된 후속 결정 — **사용자 확인 후에만 진행**

아래는 이번 범위에서 의도적으로 미룬 항목이다. 사용자가 "다른 결정사항은 나중에 확인"하겠다고 했으므로, **임의로 구현하지 말고 먼저 물어볼 것.**

1. **관리자 제출 현황 표시**: `final_votes`가 서버에 있으니, `/admin`에서 어느 조가 무엇을 제출했는지 목록으로 보여줄 수 있다. 필요 여부·위치·형식을 사용자에게 확인.
2. **증거/심문권의 새로고침 없는 반영**: 현재 `useTeamEvidence`는 INSERT만 Realtime 구독하고 DELETE는 구독하지 않아, 관리자가 증거·심문권을 초기화하면 **참가자는 새로고침해야** 반영된다(기존 설계, 개별 버튼도 동일). 최종추리처럼 즉시 반영하려면 DELETE 구독 추가가 필요. 할지 여부 확인.
3. **문서 정합성(소소)**: `EDIT_GUIDE.md` §10의 서술형 근거 설명에 "선택 입력(비워도 제출됨)"이 남아 있는데, 현재 코드는 근거를 **필수**로 요구한다(제출 버튼 비활성 조건 `!reasoning.trim()`). 실제 정책이 필수인지 확인 후 문서/코드 중 맞는 쪽으로 정리.

---

## 5. 작업 규칙 (요약)

- 세션 시작 시 `progress.md`를 먼저 읽고 맥락 파악.
- 작업 시작/완료 시 `progress.md` 자동 갱신(무엇을/어느 파일).
- 운영자가 직접 수정하는 기능을 건드리면 `docs/01_md/EDIT_GUIDE.md`도 갱신.
- 변경은 최소·외과적으로. 요청 범위 밖 리팩터링 금지.
- 커밋 메시지 말미: `Co-Authored-By` 규칙은 저장소 관례를 따를 것.
