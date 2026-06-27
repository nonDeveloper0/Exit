# EXIT 2026 — 진행 현황

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
- [x] 투표 2라운드 분리 — 중간 투표 / 최종 투표 독립 제어
  - Supabase `game_state`에 `vote_round integer` 컬럼 추가 (0=닫힘, 1=중간, 2=최종)
  - 어드민: 기존 토글 → 중간 투표 열기 / 최종 투표 열기 / 닫기 3버튼
  - 각 라운드 제출 결과 localStorage에 독립 저장 (`exit2026_vote_r1`, `exit2026_vote_r2`)
  - 수정 파일: `src/lib/store.ts`, `src/lib/useGameState.ts`, `src/app/admin/page.tsx`, `src/app/vote/page.tsx`
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

## 구조 확정 사항

- **조 입력**: 조 번호(숫자) 직접 입력 — 같은 숫자 입력 시 증거 보관함 실시간 공유
- **조 확장**: 코드 수정 없이 가능 (숫자 자유 입력)
- **실시간 동기화**: Supabase Realtime — 한 쪽이 수집하면 상대방 화면에 즉시 반영
- **unlock 로컬 전용**: 비밀번호 잠금 해제 상태는 Supabase에 저장하지 않음
- **reset 범위**: 관리자가 조별 선택 또는 전체 일괄. 해당 조 Supabase 데이터 삭제. 현재 기기 조면 localStorage도 삭제
- **QR 구조**: QR_CODES 배열에서 slug → 장소(LOCATIONS 변수) + 증거 ID 목록 관리

### QR 배치 현황

| QR | slug | 장소 | 증거 |
|----|------|------|------|
| QR1 | x4k9m2 | 살해 현장 | E01 |
| QR2 | p7n3q8 | 살해 현장 | E09, E02 |
| QR3 | h6t4c3 | CCTV 관제실 | E03, E04 |
| QR4 | b2r5w1 | 주차장 | E05, E06 |
| QR5 | m1d7k5 | 창고 | E07, E08 |
| QR6 | n4v8z3 | 창고 | E10 |

---

## 작업중

- [ ] 없음


---

## 작업필요

### 데이터 (이벤트 전 필수)
- [ ] 중요 단서 비밀번호 확정 (`data.ts` → `LOCKED_EVIDENCE`)
- [ ] 용의자 동기 공개 트리거 확정 (`data.ts` → `motiveRevealIds`)

