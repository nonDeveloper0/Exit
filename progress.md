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

## 구조 확정 사항

- **조 입력**: 조 번호(숫자) 직접 입력 — 같은 숫자 입력 시 증거 보관함 실시간 공유
- **조 확장**: 코드 수정 없이 가능 (숫자 자유 입력)
- **실시간 동기화**: Supabase Realtime — 한 쪽이 수집하면 상대방 화면에 즉시 반영
- **unlock 로컬 전용**: 비밀번호 잠금 해제 상태는 Supabase에 저장하지 않음
- **reset 범위**: 현재 로그인된 조의 Supabase 데이터 + 기기 localStorage
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

### 기능
- [ ] 전체 조 실시간 수집 현황 표시
  - Supabase에서 pair_id 필터 없이 전체 조회 → 조별 수집 개수 집계
  - Realtime 구독도 전체 테이블로 확장 (현재는 자기 조만 구독)
  - 표시 위치: 수사본부(`/home`) 또는 별도 현황 페이지

### 데이터 (이벤트 전 필수)
- [ ] 중요 단서 비밀번호 확정 (`data.ts` → `LOCKED_EVIDENCE`)
- [ ] 용의자 동기 공개 트리거 확정 (`data.ts` → `motiveRevealIds`)

### 배포 전 제거
- [ ] `/reset` 페이지 삭제 (`src/app/reset/page.tsx`) — 테스트용, 실제 이벤트 배포 시 제거
