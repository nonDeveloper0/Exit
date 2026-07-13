# EXIT 2026 — 진행 현황

## 작업 시작 (2026-07-13)

- [x] `/phone` 대기 화면을 시계와 `나팀장 개인폰`만 표시하도록 단순화하고, 첨부 레퍼런스를 기준으로 수신전화 One UI 화면을 재구성한다.


## 진행 기록 운영 규칙

- 모든 작업은 시작 시 작업 예정 내용을, 종료 시 완료 내용과 변경 파일을 이 문서에 기록한다.
- 이 업데이트는 별도 사용자 허가를 요청하지 않고 자동으로 수행한다.

## 다른 로컬에서 시작하는 법

```bash
git clone https://github.com/nonDeveloper0/Exit.git
cd Exit
npm install
npm run dev
```

`.env.local` 필요:
```
NEXT_PUBLIC_SUPABASE_URL=https://egnkhewpeyzcwdtstdxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_l7fmKV4M3gSPA0iPEgzghw_THQWVXAH
```

---

## 작업완료

- [x] GitHub 레포지토리 생성
- [x] CLAUDE.md 작성 (행동 지침 + 프로젝트 컨텍스트)
- [x] 기획 문서 작성 (`docs/01_md/`)
- [x] Next.js 초기 세팅 (TypeScript, Tailwind CSS, ESLint, App Router)
- [x] QR 페이지 기본 구조
- [x] 증거 수집 및 보관함 화면
- [x] 용의자 카드 화면
- [x] 최종 투표 화면 (Google Form 연동)
- [x] 엔딩 화면 (반전 공개)
- [x] 증거 데이터 구성 (10종)
- [x] Vercel 배포 설정 (nonDeveloper0/Exit, master 브랜치 자동 배포)
- [x] 동기 공개 시스템: motiveRevealIds 기반 — 지정 증거 수집 시 동기 텍스트 공개
- [x] 투표 잠금: VOTE_UNLOCK_COUNT 이상 증거 수집 시 제출 활성화
- [x] 투표 페이지: 남은 제출 횟수 항상 표시
- [x] 중요 단서 비밀번호 잠금: LOCKED_EVIDENCE에 id:비밀번호 지정
- [x] Supabase 연동: 조별 증거 수집 실시간 공유
  - 같은 조 번호 입력 시 증거 수집함 실시간 공유 (Supabase Realtime)
  - 증거 저장소: localStorage → Supabase `team_evidence_items` 테이블
- [x] **버그 수정**: 비밀번호 잠금 증거 실시간 동기화 안 되는 문제
- [x] **reset 페이지**: Supabase 팀 데이터 + localStorage 동시 삭제, 완료 후 랜딩으로 이동
- [x] 랜딩 페이지 조 입력: A/B/C 드롭다운 → 숫자 직접 입력
  - 조 번호(숫자)가 pairId로 사용됨 — 같은 숫자 입력 시 자동 공유
  - 조 수 확장(4조, 5조 등) 코드 수정 없이 가능
  - 구글 폼 연결 복원: 원래 숫자 조 번호 형식과 일치
- [x] 용의자 5명으로 확장: D(경비원), E(경호실장) 추가
- [x] QR 구조 재설계: 장소 기반 → QR 직접 증거 매핑
  - 장소 4개 (살해 현장, CCTV 관제실, 주차장, 창고), QR 6개
  - QR당 증거 1~2개 직접 연결 (`QR_CODES` 배열)
  - 장소명 변수화: `LOCATIONS` 상수 — 한 곳만 수정하면 전체 반영
  - `Evidence`에서 `qrId` 제거, `QR_LOCATIONS` 제거
- [x] 전체 조 실시간 수사 현황 — 별도 `/ranking` 페이지
  - `useAllTeamsProgress` 훅: 전체 조 증거 수집 수 실시간 조회
  - INSERT → 즉시 카운트 반영, DELETE(reset) → 전체 재조회
  - 수집 개수 내림차순 랭킹 정렬, 1~3위 색상 구분, 내 조 강조
  - BottomNav에 '현황' 탭 추가 (5탭)
- [x] 입장 시 joined 마커 기록 — 증거 0개도 현황에 표시
  - 랜딩 입장 시 `team_evidence_items`에 `type='joined'` upsert
  - 현황 페이지: joined 기록 있는 모든 조를 0개부터 표시
  - reset 시 joined 레코드도 삭제 → 목록 자동 제거
- [x] reset 페이지 관리자 기능 강화
  - Supabase 기록 있는 조 목록 자동 조회
  - 조별 개별 초기화 + 전체 일괄 초기화
  - 내 기기 조 reset 시 localStorage도 함께 삭제
- [x] 잠금 증거 퀴즈 문제 표시
  - `EVIDENCE_QUIZ` 상수 추가 (`data.ts`)
  - 비밀번호 입력창 위에 퀴즈 문제 표시 (`QrPageClient.tsx`)
  - EDIT_GUIDE.md 6-1절 추가
- [x] 관리자 패널 (/admin) — PIN 인증 + 게임 진행 제어
  - `/reset` → `/admin` 페이지 이름 변경
  - PIN(0000) 게이트: sessionStorage 유지, 탭 닫으면 재인증
  - 게임 상태 제어: 투표 열기/닫기, 엔딩 공개/숨기기 (Supabase `game_state` 테이블)
  - `/vote`: vote_open false면 잠김 UI, Realtime으로 즉시 해제
  - `GameStateRedirect`: ending_open 활성화 시 전 참가자 기기 자동 /ending 이동
  - 버그 수정: PinGate 키패드 버튼 ref 수정, 채널 이름 인스턴스별 고유화
  - 신규 파일: `src/lib/useGameState.ts`, `src/components/GameStateRedirect.tsx`
  - 수정 파일: `src/app/layout.tsx`, `src/app/admin/page.tsx`, `src/app/vote/page.tsx`
- [x] 잠금 증거 비밀번호 해제 시 자동 수집
  - 기존: 비밀번호 해제 후 '수집' 버튼 별도 클릭 필요
  - 변경: 비밀번호 정답 입력 즉시 자동 수집, 잠금 증거에 '수집' 버튼 미표시
  - 수정 파일: `src/app/qr/[id]/QrPageClient.tsx`
- [x] 증거 음성 힌트 재생 기능
  - `Evidence`에 `audioUrl?: string` 필드 추가
  - 음성 파일: `public/audio/` 폴더에 업로드 후 `audioUrl: "/audio/파일명"` 등록
  - 재생 중 다른 증거 재생 시 자동 정지
  - 수정 파일: `src/lib/data.ts`, `src/app/qr/[id]/QrPageClient.tsx`
- [x] 증거 영상 힌트 재생 기능
  - `Evidence`에 `videoUrl?: string` 필드 추가
  - 영상 파일: `public/video/` 폴더에 업로드 후 `videoUrl: "/video/파일명"` 등록
  - 버튼 클릭 시 카드 안에 인라인 플레이어 펼침/닫기 토글
  - 수정 파일: `src/lib/data.ts`, `src/app/qr/[id]/QrPageClient.tsx`
- [x] CLAUDE.md — 새 기능 구현 시 EDIT_GUIDE.md 업데이트 규칙 추가
- [x] 관리자 패널 — 조 매핑 (짝짓기) 기능
  - 관리자가 두 조를 짝으로 지정하면 서로 증거 실시간 공유
  - `game_state.pairings` JSONB 컬럼 추가 (Supabase SQL: ALTER TABLE)
  - `useTeamEvidence`: 자기 팀 + 파트너 팀 동시 구독, 매핑 변경 즉시 반영
  - `/admin` 조 매핑 섹션: 짝 추가/해제 UI, Supabase에 실시간 저장
  - 수정 파일: `src/lib/useTeamEvidence.ts`, `src/app/admin/page.tsx`
- [x] 수사 현황 — 매핑된 조 묶어서 표시 (1조 + 3조)
  - `useAllTeamsProgress`: pairings 구독, 짝 팀 증거 합집합으로 count 계산
  - 랭킹 페이지: `groups` 단위 렌더링, 내 팀 포함 시 (나) 강조
  - 매핑 변경 즉시 반영 (Supabase Realtime)
  - 수정 파일: `src/lib/useAllTeamsProgress.ts`, `src/app/ranking/page.tsx`
- [x] 문서 최신화 — ARCHITECTURE/README/DATA_SCHEMA/DEV_SPEC/UI_SPEC를 현재 코드에 맞춤
  - Supabase 중심 구조, 라우트 9개, vote_round/pairings, localStorage 키 등 반영
- [x] 사용자 편의 기능 3종
  - 용의자 관련 단서 연결: `Suspect.relatedEvidenceIds` 추가, 용의자 파일에 관련 단서 표시 (수집=제목 공개 / 미수집=🔒)
  - 증거 수집 토스트: 같은 조 다른 기기가 수집 시 상단 알림, 내 수집은 억제 (`collectSignal.ts`)
  - 수집 피드백: 카드 팝 애니메이션 + 진동(안드로이드; iOS는 애니메이션만)
  - 신규 파일: `src/lib/collectSignal.ts`, `src/components/TeamEvidenceToast.tsx`
  - 수정 파일: `src/lib/data.ts`, `src/app/suspects/page.tsx`, `src/lib/useTeamEvidence.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/qr/[id]/QrPageClient.tsx`
- [x] 용의자 관련 단서 → 증거함 딥링크
  - 용의자 파일에서 수집한 관련 단서 클릭 시 `/evidence?focus=E0X`로 이동
  - 증거함: focus 단서 자동 펼침 + 스크롤 + 앰버 링 강조(1.6초), useSearchParams는 Suspense로 래핑
  - 수정 파일: `src/app/suspects/page.tsx`, `src/app/evidence/page.tsx`
- [x] 공통 단서 — 전체 공개 + 전체 공지
  - `COMMON_EVIDENCE_IDS`에 지정한 증거는 조별이 아니라 전역 공유 증거로 동작
  - 어느 조든 처음 수집하면: 전체 조 증거함에 공개 + 전 참가자 빨간 전체 공지 토스트
  - 저장: `pair_id='__global'` (모든 조가 구독). 첫 발견 1회 공지는 DB 유니크 제약으로 보장
  - 랭킹/관리자 조 목록에서 `__global` 제외, 랭킹 카운트엔 공통 단서를 각 조에 합산
  - EDIT_GUIDE 6-2절 추가
  - 수정 파일: `src/lib/data.ts`, `src/lib/useTeamEvidence.ts`, `src/components/TeamEvidenceToast.tsx`, `src/lib/useAllTeamsProgress.ts`, `src/app/admin/page.tsx`
- [x] 단서 15종 — 용의자별 고유 3개씩 배정
  - 증거 5종 추가 (E11~E15): 이중 장부(B), 내부고발 문건(E), 경호팀 무전(E), 해고 통보서(D), 임금 체불 내역(D)
  - 각 용의자 `relatedEvidenceIds`를 고유 3개로 재배정 (기존 공유 E02·E09 제거) — A/B/C/D/E 모두 3개씩, 총 15개
  - 신규 5종을 기존 QR에 연결 (QR3에 E12·E13, QR4에 E14·E15, QR5에 E11) — 물리 배치는 운영자 조정 필요
  - 수정 파일: `src/lib/data.ts`, `docs/01_md/04_EVIDENCE.md`
- [x] 용의자 이름 추가 (나사장/채소장/나팀장/이대리/김사원)
  - `Suspect`에 `name` 필드 추가. `codename`("용의자 A")은 상단 라벨로 유지, 큰 제목을 `role` → `name`으로 교체
  - 용의자 카드 펼침 뷰의 "역할" 줄 삭제 (role은 데이터로만 유지, 카드 미표시)
  - 투표 화면도 일관성 위해 큰 라벨 role → name (선택 목록 + 제출 완료 화면)
  - 수정 파일: `src/lib/data.ts`, `src/app/suspects/page.tsx`, `src/app/vote/page.tsx`, 문서 3종
- [x] 최종투표 1회 제출만 유지
  - 어드민: 최종 투표 열기 / 닫기 2버튼
  - 앱 레벨 상태를 `voteOpen`(boolean)로 단순화. DB 컬럼 `vote_round`는 유지(마이그레이션 불필요), 열림=2·닫힘=0만 사용
  - localStorage 투표 키: `exit2026_vote_final`
  - 투표 페이지: "최종 추리" 단일 흐름 + "한 번만 제출" 안내
  - 수정 파일: `src/lib/store.ts`, `src/lib/useGameState.ts`, `src/app/admin/page.tsx`, `src/app/vote/page.tsx`, 문서 4종
- [x] 용의자 심문권 기능
  - `Suspect.interrogationTriggerId` 추가 — 지정 증거 수집 시 해당 용의자 심문권 획득 (현재 전부 undefined 휴면, QR 확정 후 지정)
  - 획득: 조 전체 공유(수집 목록 합집합), 짝 조도 함께 획득
  - 제시: 용의자 카드 관련 단서 아래 심문권 티켓(용의자·조 번호) → 배우가 `심문 사용`(확인 1단계) → 사용완료·버튼 비활성
  - 사용완료에 사용 시각·사용한 조 표시 (예: `11:04 1조 사용완료`) — 오류 오해 방지
  - 1회 소모 상태는 `team_evidence_items`의 `type='interrogation_used'`(evidence_id=용의자ID)로 저장. 조/짝 조 공유, 랭킹 미집계, reset 시 자동 삭제 (DB 스키마 변경 불필요)
  - 수정 파일: `src/lib/data.ts`, `src/lib/useTeamEvidence.ts`, `src/app/suspects/page.tsx`, 문서 4종(EDIT_GUIDE 5-2절 추가)
- [x] 장소명 변경 + QR 15개 재배치
  - `LOCATIONS`: 자재 물류창고(사건현장)/나사장 집무실/나팀장 사무실/채소장 연구실
  - `QR_CODES`: 6개 → 15개. 자재 물류창고 6 + 각 방 3. 증거 1종당 QR 1개
  - 매핑: 나사장 집무실=A(E04·E07·E08), 나팀장 사무실=C(E03·E06·E10), 채소장 연구실=B(E01·E09·E11), 자재 물류창고=D·E(E05·E14·E15·E02·E12·E13)
  - 새 slug 9개 생성(†) — 인쇄 QR과 일치/교체 필요
  - 수정 파일: `src/lib/data.ts`, `docs/01_md/05_QR_MAP.md`, `progress.md`
- [x] 조장 권한 분리 기획 폐기 — 조원/조장 구분 없이 모든 기기가 능동 기능(수집/투표/심문) 사용하는 기존 방식 유지. 기획 문서(`09_LEADER_ROLE_PLAN.md`) 삭제. (조장 이름 입력 기능은 그대로 유지)
- [x] 수신전화 연출 구현
  - `/admin`에서 전화 걸기/전화 종료 제어
  - `team_evidence_items` 전역 마커(`__global` + `_incoming_call` + `incoming_call`)로 활성 상태 저장 — DB 스키마 변경 없음
  - 참가자 화면 전역 오버레이: 수신전화 UI → `받기` 탭 시 `public/audio/incoming-call.mp3` 재생
  - `/admin`, `/ending`, 랜딩에서는 전화 오버레이 미표시
  - 처리한 전화는 기기별 localStorage에 기록, 관리자가 다시 전화 걸면 새 이벤트로 재표시
  - 신규 파일: `src/components/IncomingCallOverlay.tsx`, `src/lib/useIncomingCall.ts`, `public/audio/incoming-call.mp3`
  - 수정 파일: `src/app/admin/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/data.ts`, 문서 3종
- [x] 수신전화 받기 UX → 밀어서 받기 슬라이더
  - 첫 화면 `받기` 버튼(탭) → 밀어서 받기(노브 85% 이상 끌면 연결, 탭만으론 안 받아짐). pointer 이벤트 터치/마우스 공용, `거절`은 하단 텍스트로 유지
  - 수정 파일: `src/components/IncomingCallOverlay.tsx`, `src/app/globals.css`(`slide-hint`)
- [x] 범용 연출 훅 `useBroadcastEvent` 추출 — 모듈화 뼈대
  - `useIncomingCall`(전화 전용)을 `(evidenceId, type)` 마커 기반 범용 훅으로 일반화 → A그룹(문자/경보/방송) 재사용 기반
  - `useIncomingCall`은 범용 훅 위 얇은 래퍼로 재구성. 기존 3개 export 시그니처 유지 → 소비처(`IncomingCallOverlay`, `/admin`) 무변경
  - 신규 파일: `src/lib/useBroadcastEvent.ts` / 수정: `src/lib/useIncomingCall.ts`, `docs/01_md/12_MODULE_CATALOG.md`(§3)
- [x] 용의자 카드 디자인 개선 — 머그샷(수배 사진) 스타일 + 실루엣/이미지
  - 밋밋한 아바타 원(글자) → 세로 머그샷 틀: 이미지 있으면 사진, 없으면 기본 흉상 실루엣(SVG)
  - 신체측정 눈금 배경 + 하단 그라데이션 + 좌상단 앰버 ID 배지 + "CASE FILE" 태그로 사건파일 느낌
  - `Suspect`에 `imageUrl?` 필드 추가 — `public/`에 파일 넣고 `imageUrl: "/파일명"` 지정 (없으면 실루엣)
  - 수정 파일: `src/lib/data.ts`, `src/app/suspects/page.tsx`, `docs/01_md/EDIT_GUIDE.md`(4절)
- [x] 수신전화 "음성 메시지" 증거 수집
  - `CALL01` 증거 추가: 전화 오디오 샘플(`public/audio/incoming-call.mp3`)을 `audioUrl`로 등록
  - 참가자가 밀어서 전화를 받는 즉시 해당 조 보관함에 자동 수집. 거절/미응답은 수집하지 않음
  - 랭킹 집계와 랭킹 total에서는 `CALL01` 제외, 증거함에서는 다시 듣기 재사용
  - 수정 파일: `src/lib/data.ts`, `src/components/IncomingCallOverlay.tsx`, `src/lib/useAllTeamsProgress.ts`
- [x] 수신전화 벨소리 + 진동 (받기 전 수신 화면)
  - 수신 화면이 뜬 동안 Web Audio로 합성한 전화벨을 반복 재생(받기/거절/이탈 시 정지)
  - 진동은 `navigator.vibrate` — Android만 동작, iOS Safari는 웹 제약으로 무시
  - **제약**: 자동재생 정책상 첫 사용자 터치에서 AudioContext 언락 필요(`armAudioUnlock`) + 앱이 화면에 떠 있을 때만 울림. 백그라운드/화면잠금은 불가
  - 신규 파일: `src/lib/ringtone.ts` / 수정: `src/components/IncomingCallOverlay.tsx`, `docs/01_md/EDIT_GUIDE.md`(1-4절)

## 구조 확정 사항

- **조 입력**: 조 번호(숫자) 직접 입력 — 같은 숫자 입력 시 증거 보관함 실시간 공유
- **조 확장**: 코드 수정 없이 가능 (숫자 자유 입력)
- **실시간 동기화**: Supabase Realtime — 한 쪽이 수집하면 상대방 화면에 즉시 반영
- **unlock 로컬 전용**: 비밀번호 잠금 해제 상태는 Supabase에 저장하지 않음
- **reset 범위**: 관리자가 조별 선택 또는 전체 일괄. 해당 조 Supabase 데이터 삭제. 현재 기기 조면 localStorage도 삭제
- **QR 구조**: QR_CODES 배열에서 slug → 장소(LOCATIONS 변수) + 증거 ID 목록 관리

### QR 배치 현황 (총 15개, 증거 1종당 QR 1개)

> ⚠️ 항상 `src/lib/data.ts`의 `QR_CODES` 배열이 정본. 아래 표는 그 스냅샷.

| slug | 장소 | 증거 |
|------|------|------|
| x4k9m2 | 자재 물류창고 | E07 |
| p7n3q8 | 자재 물류창고 | E08 |
| c8v3k1 | 자재 물류창고 | E09 |
| d2m9x4 | 자재 물류창고 | E10 |
| f5r7t2 | 자재 물류창고 | E11 |
| g1h6n8 | 자재 물류창고 | E12 |
| h6t4c3 | 나사장 집무실 | E01 |
| j4w2b5 | 나사장 집무실 | E02 |
| k9p3z6 | 나사장 집무실 | E03 |
| b2r5w1 | 나팀장 사무실 | E04 |
| q7s1d3 | 나팀장 사무실 | E05 |
| t6y8m2 | 나팀장 사무실 | E06 |
| m1d7k5 | 채소장 연구실 | E13 |
| n4v8z3 | 채소장 연구실 | E14 |
| w3n5k7 | 채소장 연구실 | E15 |

---

## 작업중

- [ ] 단서 기획 (오프라인 헌팅 중심) — 방향 확정, 실제 단서 채우는 중
- [ ] 디제틱 기기 UI 기획 — 방향 확정(`docs/01_md/11_DEVICE_UI_PLAN.md`), 수신전화 연출만 구현 완료
- [ ] 모듈 카탈로그 — 후보 기능 문서화 완료(`docs/01_md/12_MODULE_CATALOG.md`), Codex가 골라 구현 예정


---

## 기획 방향 확정 (2026-07-11)

오프라인 물리 단서 중심으로 전환. 상세 기준: `docs/01_md/10_DESIGN_UPDATE.md`.

- **웹 역할**: 단서 수집(공유 보관함) + 보조 설명 + 방송/진행 제어. **판정·소거 없음** (추리는 참여자 몫)
- **등록 방식**: QR 스캔 + 코드 입력 **병행** — 둘 다 같은 수집 액션
- **용의자 화면**: 중립 라벨(관련 단서 ①②③), 카테고리 라벨 UI 비노출
- **단서 기획 뼈대**: 용의자별 동기/스토리라인/알리바이 3단계 (내부용)
- **조 구도**: 혼합 — 조별 기본 + 짝 조 공유(`pairings`=독극물 레시피) + 전체 공개(`COMMON_EVIDENCE`=방송)
- **재활용**: `pairings`, `COMMON_EVIDENCE`, 심문권 그대로. 아직 코드 구현 전 = 기획 문서만 반영

### 퀴즈/코드 답 입력 방식 (2026-07-13, 1차 구현 완료)

- **QR 경유 유지**: 퀴즈(잠긴 증거)의 답 입력창은 기존처럼 **QR 페이지(`/qr/[slug]`)** 에도 존재. 해당 증거에 연결된 QR로 들어가면 문제+비밀번호 입력창이 뜨고, 정답 입력 시 자동 수집됨 (`LOCKED_EVIDENCE` + `EVIDENCE_QUIZ`).
- **QR 없는 정답 입력 추가**: `/solve` 전역 정답 입력창에서 `PUZZLES.answer`와 일치하는 값을 입력하면 QR 없이도 보상 지급.
- **단서 보상**: `reward.type="evidence"`는 `collect(evidenceId)`로 같은 조 Supabase 증거함에 실시간 반영.
- **힌트 보상**: `reward.type="hint"`는 현재 기기에만 표시. 조 동기화는 아직 안 함.
- **증거함(`/evidence`)은 읽기 전용**: 미수집 증거는 `???` + 버튼 비활성. 여기서는 퀴즈를 풀 수 없음 (참여자 혼동 지점 — 의도된 동작).

### 디제틱 기기 UI 기획 확정 (2026-07-11, 세션 한도로 중단된 논의 정리)

상세: `docs/01_md/11_DEVICE_UI_PLAN.md`. 목업: `docs/02_mockups/device-{laptop,ipad}-demo.html`.

- **전 기기 동시재생 폐기** (모바일 자동재생 차단·백그라운드 정지·iOS 진동/푸시 제약) → 물리 스피커가 주 채널
- **속보 시스템**: admin 발행 → DB+Realtime. 잠긴 기기는 다시 열 때 안 본 속보 자동 표시 + 홈 아카이브 ("동시 도달" 대신 "놓치지 않음")
- **수신전화 연출 확정**: 앱 여는 기기마다 수신전화 UI → "받기" 탭(제스처)으로 오디오 재생 합법화
- **디제틱 기기**: 폰/실물 기기 웹페이지가 "기기 화면인 척". 수집 시점은 기기별로 명시하며, 현재 노트북은 잠금 해제가 아니라 PDF 열람 시 수집
- **나팀장 노트북 = 실물 1대 + 1단 잠금**: 조 번호 드롭다운 + 공통 비밀번호 `980721`. 바탕화면의 지문감식 결과보고서 PDF를 여는 순간 선택한 조 보관함에 E16 저장. 짝 조는 `pairings` 합집합 조회로 단서함에 같이 표시. 세션 위생(N조 배지 + 90초 자동 재잠금)
- **출입관리 아이패드**: 사원번호는 공통이라 신분 불가 → **방문 조 체크인 단계(A안)** 로 조 구분

---

## 작업필요

### 단서 기획 (방향 확정 후 후속)
- [ ] 나사장 알리바이 단서 (없음 → 신규)
- [ ] 채소장 알리바이 단서 (없음 → 신규)
- [ ] 이대리 동기 단서 (약함 → 보강)
- [ ] 나팀장(진범=모세) 동기/알리바이 — 반전 연결 정리

### 데이터 (이벤트 전 필수)
- [ ] 중요 단서 비밀번호 확정 (`data.ts` → `LOCKED_EVIDENCE`)
- [ ] 용의자 동기 공개 트리거 확정 (`data.ts` → `motiveRevealIds`)
- [ ] **지문감식 결과보고서(E16) 본문 작성 — 현재 비어있음.** 나팀장 노트북 `public/screen/laptop.html`의
  `<article class="pdf-page">`가 제목만 있고 본문은 `내용 준비 중` 상태. 단서팀 확정본으로 채우기.
  (수집 연동·보고서 스타일은 완료, 내용만 필요. 안내: `docs/01_md/EDIT_GUIDE.md` 12장)
## Latest update

- [x] 채소장 휴대폰 디바이스 화면 목업 추가 (`public/screen/phone2.html`, Vercel `/screen/phone2`) (2026-07-13)
  - 새 디제틱 기기: 조 선택(비밀번호 없음) → 홈 화면(전화·메시지·설정 앱) → 전화 앱(최근 통화 목록) / 메시지 앱(대화 목록 + 채팅 화면)
  - 열람 전용 소품 — 증거 수집 연동 없음(노트북 `laptop.html`과 달리 Supabase 미연동)
  - 통화목록·메시지 문구는 채소장 동기(김사원 보호 + 현장 조작 의혹) 기준 초안 — ⚠️ 단서팀 확정 필요
  - 90초 무입력 시 자동 세션 초기화(다음 조 사용 대비), 설정 앱에서 수동 초기화도 가능
  - 신규 파일: `public/screen/phone2.html` / 수정: `next.config.ts`, `docs/01_md/EDIT_GUIDE.md`(12절)
  - 후속: 통화목록에 업무성 통화(안전관리팀·거래처·총무팀·소방안전센터·경영지원팀·스팸의심) 6건 추가해 단서 통화(김사원/나사장/이대리/저장되지 않은 번호) 사이에 자연스럽게 섞음 — 총 12건
  - 롤백: 참고 스크린샷(`KakaoTalk_20260713_151928829.png`) 기준 "오늘" 통화 9건(나팀장·김전무·재무팀장 등)을 이 파일에 잠깐 넣었다가 제거 — 해당 스크린샷은 **다른 폰(채소장 폰이 아님) 증거용**이라 착오였음. 통화목록은 12건 상태로 복귀

- [x] 수신전화 수신 화면 UI — 밀어서 받기 폐기 → 아이콘 원형 버튼 2개로 변경 (2026-07-13)
  - 참고 이미지(One UI 스타일) 기준: 하단 좌측 초록 원형 버튼(받기)·우측 빨간 원형 버튼(거절), 텍스트 라벨 없이 아이콘만
  - 기존 "밀어서 받기" 슬라이더(드래그 제스처) 제거, 탭 한 번으로 받기/거절 가능한 단순 버튼으로 되돌림
  - 거절 아이콘은 받기와 같은 수화기 아이콘을 135도 회전해 통화종료 아이콘으로 표현
  - 사용하지 않게 된 `.animate-slide-hint`/`@keyframes slide-hint` CSS 제거
  - 수정 파일: `src/components/IncomingCallOverlay.tsx`, `src/app/globals.css`
  - ⚠️ Chrome 확장 연결이 안 되어 있어 브라우저 실제 렌더링은 직접 확인 필요

- [x] `/solve` 전역 정답 탭 폐기 → QR 경유 문제 풀이로 통합 (2026-07-13)
  - 기존: `/solve`에서 QR 없이도 `PUZZLES.answer`를 입력해 단서를 수집할 수 있었음
  - 변경: "문제는 QR을 찍어야 뜬다"로 되돌림. `/solve` 페이지, 하단 네비 '정답' 탭, 홈 화면 '정답 입력' 버튼 제거
  - `PUZZLES`/`Puzzle`/`findPuzzleByAnswer`/`normalizePuzzleAnswer`는 기존 `LOCKED_EVIDENCE`+`EVIDENCE_QUIZ`와 중복이라 삭제. QR 페이지(`/qr/[slug]`)의 잠금 증거 퀴즈 플로우만 남김(변경 없음, 그대로 재사용)
  - 잠긴 증거가 어느 용의자의 `interrogationTriggerId`면 정답을 맞히는 즉시 심문권도 함께 획득 — 기존 로직 그대로라 "문제를 맞히면 단서 or 심문권" 요구사항을 추가 코드 없이 충족
  - 삭제 파일: `src/app/solve/page.tsx`
  - 수정 파일: `src/lib/data.ts`, `src/components/BottomNav.tsx`, `src/app/home/page.tsx`, 문서 5종(`13_PUZZLE_DESIGN.md`, `EDIT_GUIDE.md`, `06_UI_SPEC.md`, `07_DATA_SCHEMA.md`, `08_DEV_SPEC.md`)

- [x] 수신전화 발신자 정보 + 최신 갤럭시 스타일 UI 개선 (2026-07-13)
  - 수신전화 표시를 `발신번호 표시제한` → `박미리 / 010-9876-2345`로 변경
  - 수신 화면: One UI 계열처럼 큰 발신자 이름, 번호, 원형 프로필, 하단 거절/밀어서 받기 UI로 재구성
  - 통화 중 화면: 같은 발신자 정보, 통화 시간, 파형, 종료 버튼으로 정리
  - 기존 수신 전용 기기 제한, 벨소리/진동, 밀어서 받기, `CALL01` 자동 수집 로직은 유지
  - 수정 파일: `src/components/IncomingCallOverlay.tsx`, `docs/01_md/EDIT_GUIDE.md`
  - 신규 문서: `docs/superpowers/specs/2026-07-13-incoming-call-galaxy-ui-design.md`, `docs/superpowers/plans/2026-07-13-incoming-call-galaxy-ui.md`
- [x] 용의자별 수사 노트 (참가자 개인 메모) (2026-07-13)
  - 용의자 파일(`/suspects`) 펼침 뷰 맨 아래에 **수사 노트** textarea 추가 — 용의자별로 메모 작성, 입력 즉시 자동 저장
  - 저장은 이 기기 `localStorage`(`exit2026_suspect_notes`, `{용의자ID: 메모}`) — 개인 메모, 조 실시간 공유 안 함
  - `resetAll()` 시 함께 삭제
  - 신규 함수: `src/lib/store.ts`(`getSuspectNotes`/`saveSuspectNote`)
  - 수정 파일: `src/lib/store.ts`, `src/app/suspects/page.tsx`, `docs/01_md/EDIT_GUIDE.md`(5-3절)

- [x] QR 없는 문제 풀이형 단서 수집 (`/solve`) (2026-07-13)
  - `PUZZLES` 데이터 모델 추가: 정답 입력 → 단서 수집 또는 힌트 표시 보상
  - `/solve` 전역 정답 입력 페이지 추가. QR을 찍지 않아도 `PUZZLES.answer`와 일치하면 단서 수집 가능
  - 기존 잠금 단서 E01을 `PUZZLES`에 연결해 QR 페이지와 `/solve` 양쪽에서 풀 수 있게 구성
  - 정답 비교는 앞뒤 공백, 중간 공백, 대소문자 무시
  - 홈 수사 방법 안내와 하단 네비에 `정답` 진입 추가
  - 문서 최신화: `13_PUZZLE_DESIGN`, `EDIT_GUIDE`, `DEV_SPEC`, `UI_SPEC`, `DATA_SCHEMA`, `ARCHITECTURE`
  - 신규 파일: `src/app/solve/page.tsx`
  - 수정 파일: `src/lib/data.ts`, `src/components/BottomNav.tsx`, `src/app/home/page.tsx`, `progress.md`

- [x] 제한 시간 타이머 (관리자 브로드캐스트 카운트다운 + 종료 경보) (2026-07-12)
  - `/admin`에 **제한 시간 타이머** 섹션 추가: 분 입력 + 5/10/15/30 프리셋 → `타이머 시작` / `종료`
  - 시작 시 **모든 참가자 기기 상단에 카운트다운 배너** 표시(1분 이하 빨간색), 0이 되면 각 기기에서 **경보음 약 4초**(Android 진동) + `시간 종료` 표시
  - 동기화: 스키마 변경 없이 기존 전역 마커 재사용 — `team_evidence_items`(`pair_id=__global`, `type='timer'`) 1행의 `created_at`에 **종료 시각(ISO)** 저장. 모든 기기가 `remaining = endsAt - now`로 동일 계산. `종료`는 마커 삭제
  - 구독은 기존 범용 훅 `useBroadcastEvent` 재사용. 경보는 이미 끝난 타이머로 뒤늦게 접속/새로고침한 기기에서 안 울리도록 "실행 중을 본 이벤트"에서만 1회 재생
  - 경보음은 `ringtone.ts`에 Web Audio 합성 `playAlarm` 추가(앱 전역 `armAudioUnlock` 재사용)
  - 신규 파일: `src/components/TimerOverlay.tsx` / 수정: `src/lib/data.ts`(TIMER 상수), `src/lib/ringtone.ts`(`playAlarm`/`stopAlarm`), `src/app/layout.tsx`, `src/app/admin/page.tsx`, `docs/01_md/EDIT_GUIDE.md`(13절)

- [x] 나팀장 노트북 PDF 열기 UX 수정 (2026-07-12)
  - laptop 화면에서 PDF 파일 단일 클릭은 선택만 하고, 더블클릭해야 PDF 창이 열리도록 변경
  - 작업표시줄 PDF 버튼도 단일 클릭 우회가 되지 않도록 더블클릭 열기로 맞춤
  - 수정 파일: `public/screen/laptop.html`, `progress.md`

- [x] 진행 기록 자동 업데이트 규칙 명문화 (2026-07-12)
  - 작업 시작·종료 시 `progress.md`를 사용자 별도 허가 없이 자동 업데이트하도록 `CLAUDE.md`, `AGENTS.md`, `progress.md`에 명시
  - 수정 파일: `CLAUDE.md`, `AGENTS.md`, `progress.md`

- [x] 수신전화 — 수신 전용 기기(공기계) 1대에만 오도록 변경 (B안, 2026-07-12)
  - 기존: admin `전화 걸기` → 전역 마커라 **모든 참가자 기기가 같이 울림**
  - 변경: 전화 오버레이는 **수신 전용 기기로 지정된 기기에만** 표시. admin 발행 로직(전역)은 그대로, "누가 받느냐"만 제한
  - 지정 방법: 공기계 브라우저로 **`/phone`** 접속 → 그 기기가 수신 전용으로 지정(로컬 플래그 `exit2026_call_device`). `/phone` 하단 `수신 해제`로 끔. 여러 대 지정도 가능
  - `/phone`은 시계 + "● 수신 대기 중" 상태의 대기 화면. 전화가 오면 이 화면 위로 기존 밀어서 받기 오버레이가 뜸
  - 참여자가 숨겨진 공기계를 찾으면 스탭이 `/admin`에서 `전화 걸기` → 대상 조 번호 입력 → `확인` 순서로 발행한다. 공기계에서 받으면 지정 조에 `CALL01`이 수집된다.
  - 공기계 자체는 조 로그인 없이 수신 전용 로컬 플래그만 가진 프롭 폰으로 운용한다.
  - 신규 파일: `src/app/phone/page.tsx` / 수정: `src/lib/store.ts`(`getIsCallDevice`/`setCallDevice`), `src/components/IncomingCallOverlay.tsx`(표시 조건), `src/components/BottomNav.tsx`(`/phone` 네비 숨김), `docs/01_md/EDIT_GUIDE.md`(1-5절)

- [x] 나팀장 노트북 디바이스 화면 구현 (`public/screen/laptop.html`, Vercel `/screen/laptop`)
  - 잠금: 조 번호 드롭다운(1~6조) + 공통 암호 `980721`. 고른 조가 수집 대상. 암호 마스킹(•) + 눈 아이콘 토글
  - 바탕화면에 `지문감식 결과보고서.pdf` 1개만(엑셀·죽은 파일 제거). 암호 없이 열람
  - 조 선택 + 공통 암호 성공만으로는 수집하지 않음. PDF 열람 시 `supabase-js`(CDN)로 `team_evidence_items`에 실제 저장 → 선택한 조 증거함 실시간 반영
  - 짝 조는 별도 중복 저장 없이 `pairings` 기준으로 상대 조 기록을 함께 읽어 단서함에 표시
  - 새 증거 **E16 지문감식 결과보고서** 추가(`data.ts`). ⚠️ **보고서 본문은 비워둠 — 단서팀 확정본 필요**(위 작업필요 참조)
  - 정적 화면을 참가자 UI 미노출로 Vercel 서빙(`public/screen/`, `.html` 없이 접속 rewrite)
  - 수정 파일: `public/screen/laptop.html`, `src/lib/data.ts`, `next.config.ts`, `docs/01_md/EDIT_GUIDE.md`

- [x] 관리자 단서 개방 안전장치 강화
  - `/admin` 전체 단서 개방 전 상태를 `team_evidence_items` 전역 DB 마커(`type='admin_open_all_snapshot'`)로 저장하도록 변경
  - `이전 상태로 되돌리기`: 마지막 전체 개방으로 추가된 전역 공개 단서만 제거
  - `단서 전체 초기화`: 모든 조의 `type='collected'` 단서 기록과 전역 공개 단서, 스냅샷 마커 삭제
  - 실수 방지를 위해 전체 초기화는 입력칸에 `초기화`를 직접 입력해야 실행
  - 수정 파일: `src/app/admin/page.tsx`, `docs/01_md/07_DATA_SCHEMA.md`, `docs/01_md/08_DEV_SPEC.md`, `progress.md`

- [x] `/phone` 최소화 + 수신전화 밝은 One UI 레퍼런스 반영 (2026-07-13)
  - `/phone`: 시계와 `나팀장 개인폰`만 표시. 수신대기·기기 안내·수신 해제 UI 제거(수신 전용 기기 자동 지정은 유지).
  - 수신전화: 발신자 `박미리 탐정 / 010-9876-2345`, 밝은 흰색→하늘색→보라색 그라데이션 및 레퍼런스 기반 원형 프로필·버튼 색상으로 변경.
  - 수신·거절·밀어서 받기·벨소리·진동·CALL01 수집 동작은 유지.
  - 검증: `npm run lint`(오류 0, 기존 경고 2건), `npm run build` 통과.
  - 수정 파일: `src/app/phone/page.tsx`, `src/components/IncomingCallOverlay.tsx`, `progress.md`.
