# EXIT 2026 — 진행 현황

## 작업 완료 (2026-07-16)

- [x] 수사본부 진행표·수사 방법 문구 및 증거함 장소별 사진 수 표시를 커밋해 `origin/master`로 푸시한다.
  - 수정 파일: `src/app/home/page.tsx`, `src/app/evidence/page.tsx`, `progress.md`

## 작업 완료 (2026-07-16)

- [x] 수사본부 수사 방법 1번을 `현장의 단서를 사진으로 촬영하여 증거함에 기록한다`로 수정했다.
  - 검증: `npx eslint src/app/home/page.tsx` 통과, `git diff --check` 통과.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

## 작업 완료 (2026-07-16)

- [x] 증거함의 장소 탭마다 해당 장소에 업로드된 사진 수를 `(1)` 형식으로 표시한다.
  - 사진 업로드·장소 수정·실시간 동기화에 따라 각 탭의 수량도 자동 갱신된다.
  - 검증: `npx eslint src/app/evidence/page.tsx` 통과, `npm test` 10개 통과, `git diff --check` 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `progress.md`

## 작업 완료 (2026-07-16)

- [x] 수사본부에 장소별 조 배치와 진행 순서를 보여 주는 시간대별 위치표를 추가했다.
  - 제공된 장소 순서와 1~6조 배치, 단서 공유·심문·클로징 순서를 유지하고 모바일 가로 스크롤을 지원한다.
  - 검증: `npx eslint src/app/home/page.tsx` 통과, `git diff --check` 통과.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

## 작업 완료 (2026-07-16)

- [x] 수사본부 피해자 직책 및 수사 방법 수정분을 커밋해 `origin/master`로 푸시한다.
  - 수정 파일: `src/app/home/page.tsx`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

## 작업 완료 (2026-07-15)

- [x] 수사본부 피해자 직책을 물류창고 관리자로 수정하고, 수사 방법의 사진별 관련 인물 태그 단계를 제거했다.
  - 검증: `npx eslint src/app/home/page.tsx` 통과, `git diff --check` 통과.
  - 수정 파일: `src/app/home/page.tsx`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 로컬 Git 저장소를 원격 `origin/master` 최신 상태로 확인·갱신했다.
  - `git pull --ff-only origin master` 결과: 이미 최신 상태.
  - 수정 파일: `progress.md`

## 작업 시작 (2026-07-15)

- [x] /phone에서 수락한 마지막 통화 내용을 다시 들을 수 있게 한다.
  - 통화 수락 시 기기별 녹음 보관 상태를 저장하고, /phone 대기 화면에 통화내용 다시 듣기 버튼을 표시한다.
  - 수정 파일: src/lib/store.ts, src/components/IncomingCallOverlay.tsx, src/app/phone/page.tsx, docs/01_md/EDIT_GUIDE.md, progress.md
## 작업 시작 (2026-07-15)

- [x] 수신전화 음성 M4A 적용 및 /phone PWA 구성을 커밋해 origin/master로 푸시한다.
  - 수정 파일: docs/03_src/02_Sound/탐정대사_소라.m4a, public/audio/탐정대사_소라.m4a, src/lib/data.ts, src/app/phone/layout.tsx, public/phone.webmanifest, public/phone-icon-192.png, public/phone-icon-512.png, docs/01_md/EDIT_GUIDE.md, progress.md

## 작업 시작 (2026-07-15)

- [x] /phone을 홈 화면에 설치 가능한 PWA로 구성했다.
  - /phone 전용 웹 매니페스트와 192·512px 홈 아이콘, iOS 독립 앱 메타데이터를 추가했다.
  - 설치한 앱은 주소창 없는 독립 창으로 /phone에서 시작하며, 범위도 해당 경로로 제한된다.
  - 수정 파일: src/app/phone/layout.tsx, public/phone.webmanifest, public/phone-icon-192.png, public/phone-icon-512.png, docs/01_md/EDIT_GUIDE.md, progress.md

## 작업 시작 (2026-07-15)

- [x] 탐정대사_소라.m4a를 수신전화 및 CALL01 음성 증거 재생 파일로 반영했다.
  - 제공 M4A(AAC, 32초)를 public/audio/탐정대사_소라.m4a에 배치하고, 공통 음성 URL을 해당 파일로 변경했다.
  - 수정 파일: public/audio/탐정대사_소라.m4a, src/lib/data.ts, progress.md

## 작업 시작 (2026-07-15)

- [x] 수사본부에서 현재 제공하지 않는 관련 인물 태그 안내를 제거했다.
  - 사진 증거 안내와 수사 방법 목록에서 태그 관련 문구를 삭제했다.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 수사본부의 사진 증거 현황과 단서 안내 표기를 간결하게 수정했다.
  - `팀 사진 증거`를 `팀 사진 증거수집 현황`으로, `물리 단서`를 `단서`로 변경했다.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 수사본부 사건 장소를 `B-4 구역`으로 수정했다.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 증거함의 사진 업로드 안내 문구를 두 줄로 나눴다.
  - `사건과 관련된 단서 사진만 업로드하세요.`와 `팀당 최대 30장만 등록할 수 있습니다.`를 각각 한 줄로 표시한다.
  - 검증: 대상 린트 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 팀당 사진 증거 업로드를 최대 30장으로 제한하고, 업로드 안내 문구를 추가했다. Supabase SQL Editor에서 DB 트리거 적용까지 완료했다.
  - 증거함에서 내 조 사진 수를 `현재/30장`으로 표시하고, 한도 도달 시 촬영 버튼을 비활성화한다. QR 스캐너는 계속 사용할 수 있다.
  - 안내 문구: `사건과 관련된 단서 사진만 업로드하세요. 팀당 최대 30장까지 등록할 수 있습니다.`
  - 업로드 전 재확인과 DB 트리거 SQL을 함께 추가해 같은 조의 동시 업로드도 30장을 넘기지 않도록 했다. DB 트리거는 `docs/01_md/07_DATA_SCHEMA.md`의 SQL을 Supabase SQL Editor에서 실행해야 적용된다.
  - 검증: 대상 린트 통과, `npm test` 10개 통과.
  - 수정 파일: `src/lib/photoUploadLimit.ts`, `src/lib/usePhotoEvidence.ts`, `src/app/evidence/page.tsx`, `docs/01_md/07_DATA_SCHEMA.md`, `tests/photoUploadLimit.test.ts`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] QR 심문권 E11~E15의 표시 장소를 현장 배치에 맞게 수정했다.
  - E11=자재 물류창고, E12=나팀장 사무실, E13=나사장 집무실, E14=자재 물류창고, E15=채소장 연구실.
  - QR 주소와 심문권 연결은 유지하고, QR 배치 문서와 회귀 테스트를 함께 갱신했다.
  - 검증: 대상 린트 통과, `npm test` 9개 통과.
  - 수정 파일: `src/lib/data.ts`, `tests/qrLocation.test.ts`, `docs/01_md/04_EVIDENCE.md`, `docs/01_md/05_QR_MAP.md`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 김은비·김라멕·김민채·정므엘·김민석·신소라·이준혁·이호승·박준수에게 조와 무관한 고정 조장 권한을 부여했다.
  - 고정 명단의 이름으로 입장하면 기존 조장 지정 여부와 무관하게 조장 전용 기능을 사용할 수 있다.
  - 수정 파일: `src/lib/staffRole.ts`, `src/lib/useRole.ts`, `src/app/admin/page.tsx`, `tests/staffRole.test.ts`, `progress.md`

## 작업 시작 (2026-07-15)

- [x] 첫 접속 화면의 이름 입력 안내 문구를 `본명을 입력하세요`로 변경했다.
  - 수정 파일: `src/app/page.tsx`, `progress.md`

## 작업 시작 (2026-07-13)

- [x] `/phone` 대기 화면을 시계와 `나팀장 개인폰`만 표시하도록 단순화하고, 첨부 레퍼런스를 기준으로 수신전화 One UI 화면을 재구성한다.

## 작업 시작 (2026-07-14)

- [x] 수사본부 페어 팀 배지에 팀 이름별 색상을 적용했다.
  - 노랑·파랑·분홍 팀은 각각 노랑·파랑·분홍 배지로 표시하며, 다른 이름은 기본 앰버 색상을 사용한다.
  - 수정 파일: `src/lib/pairTeam.ts`, `src/app/home/page.tsx`, `progress.md`

- [x] 수사본부 페어 팀 이름 표기를 `노랑 팀` 형식으로 간결하게 변경했다.
  - 입력값에 이미 `팀`이 포함되어도 중복 표기하지 않는다.
  - 수정 파일: `src/app/home/page.tsx`, `src/app/admin/page.tsx`, `progress.md`

- [x] 재실행 가능한 Supabase SQL 안내로 보완했다.
  - 기존 `suspect_notes` 정책 또는 Realtime publication이 있어도 오류 없이 넘어가도록 중복 검사를 추가했다.
  - 수정 파일: `docs/01_md/07_DATA_SCHEMA.md`, `progress.md`

- [x] 관리자 조 매핑 시 페어 팀 이름을 지정하고 수사본부에 표시했다.
  - `새 짝 추가`의 왼쪽 입력란에 팀 이름(예: 노랑팀)을 적고 두 조 번호와 함께 `매핑`하면 페어 연결과 팀 이름이 동시에 저장된다. 매핑 해제 시 팀 이름도 함께 삭제된다.
  - 해당 페어 참가자의 수사본부 상단 오른쪽에 `내 팀 · 팀 이름`을 실시간 표시한다.
  - Supabase SQL Editor에서 `docs/01_md/07_DATA_SCHEMA.md`의 `pair_team_names` 컬럼 추가 SQL을 실행해야 한다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/app/admin/page.tsx`, `src/app/home/page.tsx`, `src/lib/pairTeam.ts`, `src/lib/usePairTeamName.ts`, `docs/01_md/07_DATA_SCHEMA.md`, `progress.md`

- [x] 본부 사건 개요의 장소명을 `녹산건설 자재물류창고 B2 구역`으로 명확히 표기하고, 남은 수정 사항 전체를 확인했다.
  - 확인 결과 해당 문구 변경 1건만 남아 있었으며, 공백·줄바꿈 오류가 없음을 확인했다.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

- [x] 관리자 진행 상태 초기화 버튼에 실행 전 확인 창을 추가했다.
  - 심문권 사용 초기화와 최종추리 제출 초기화 모두 대상과 영향을 설명하는 확인 창에서 `초기화 실행`을 한 번 더 눌러야 실행된다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과.
  - 수정 파일: `src/app/admin/page.tsx`, `progress.md`

- [x] 용의자 탭의 미획득 심문권 안내를 QR 유형별로 구분했다.
  - 채소장(E15)은 기존 문제 풀이 안내를 유지하고, 자동 획득 QR(E11~E14)은 `심문권을 찾아 용의자를 심문하세요.`로 표시한다.
  - 수정 파일: `src/app/suspects/page.tsx`, `progress.md`

- [x] 용의자 탭의 심문권 상태를 획득=초록, 사용완료=비활성 회색으로 시각 구분했다.
  - 미사용 심문권과 조장용 `심문 사용` 버튼을 초록색으로 표시하고, 사용 완료 심문권은 회색 비활성 상태로 구분했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과.
  - 수정 파일: `src/app/suspects/page.tsx`, `progress.md`

- [x] 원본 전화 음원과 사건 이미지·QR 이미지 자산을 `docs/03_src`에 커밋·푸시한다.
  - 수정/추가 파일: `docs/03_src/01_Images/**`, `docs/03_src/02_Sound/**`, `progress.md`

- [x] 관리자에 심문권 사용 상태 및 참여자 기기의 최종추리 제출 상태 초기화 기능을 추가했다.
  - `심문권 사용 초기화`는 모든 조의 `interrogation_used` 기록만 삭제해, 이미 획득한 심문권은 유지하면서 다시 사용할 수 있게 한다.
  - `최종추리 제출 초기화`는 전역 Realtime 이벤트로 모든 참가자 기기의 localStorage 제출 상태를 해제한다. 이미 Google Form에 전송된 응답은 삭제할 수 없음을 관리자 화면에 명시했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/app/admin/page.tsx`, `src/app/vote/page.tsx`, `src/lib/data.ts`, `src/lib/store.ts`, `progress.md`

- [x] 자동 심문권 QR을 획득 버튼 방식으로 바꾸고, 심문 사용에 별도 최종 확인 팝업을 추가했다.
  - E11~E14 QR은 문제 없이 `심문권 획득` 버튼을 눌러 진동과 함께 획득한다. 채소장 E15의 정답 퀴즈는 유지한다.
  - 조장이 `심문 사용`을 누르면 용의자명과 되돌릴 수 없음을 안내하는 확인 팝업이 열리고, 여기서 `사용 처리`를 다시 눌러야 실제 사용된다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/app/qr/[id]/QrPageClient.tsx`, `src/app/suspects/page.tsx`, `progress.md`

- [x] 채소장(E15)을 제외한 E11~E14 QR은 문제 입력 없이 진입 즉시 심문권을 획득하도록 변경했다.
  - 김사원(E11)·나팀장(E12)·나사장(E13)·이대리(E14) QR은 접속 즉시 해당 심문권을 저장·표시한다.
  - 채소장(E15)은 기존 정답 입력 퀴즈를 그대로 유지한다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/lib/data.ts`, `src/app/qr/[id]/QrPageClient.tsx`, `progress.md`

- [x] `Galaxy_Bells.mp3`를 수신 대기 벨소리로 교체하고, 전화를 받을 때까지 반복 재생되도록 변경했다.
  - `public/audio/Galaxy_Bells.mp3`에 제공 파일을 배치하고 원본과 SHA-256 해시 일치를 확인했다.
  - 기존 Web Audio 합성 벨소리를 MP3 재생으로 교체했다. 수신 화면이 표시된 동안 반복 재생되고, 받기·거절·화면 이탈 시 정지한다. 첫 사용자 제스처에서 오디오 재생 권한도 미리 해제한다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `public/audio/Galaxy_Bells.mp3`, `src/lib/ringtone.ts`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

- [x] 제공된 `탐정_전화.mp3`를 핸드폰 수신 및 CALL01 음성 증거 재생 파일로 교체했다.
  - `public/audio/incoming-call.mp3`를 제공 파일로 교체했으며, 수신전화와 CALL01은 같은 `INCOMING_CALL_AUDIO_URL`을 사용하므로 코드 변경 없이 함께 적용된다.
  - SHA-256 해시로 원본·배포 파일 일치를 확인했다.
  - 수정 파일: `public/audio/incoming-call.mp3`, `progress.md`

- [x] E11~E15 QR을 용의자별 심문권 획득 퀴즈로 연결했다.
  - 심문권 배정: 김사원=E11, 나팀장=E12, 나사장=E13, 이대리=E14, 채소장=E15.
  - 다섯 QR에 정답 입력형 심문권 퀴즈를 등록했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과.
  - 수정 파일: `src/lib/data.ts`, `progress.md`

- [x] 수사본부 사건 개요의 용의자 표기와 사건 설명을 최신 문구로 갱신한 사용자 수정분을 커밋·푸시한다.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`

- [x] 증거함 장소 탭별 색상과 선택 강조를 적용하고, 선택 장소 업로드 안내를 표시했다.
  - 자재 물류창고=앰버, 나사장 사무실=바이올렛, 나팀장 사무실=스카이, 채소장 연구실=에메랄드의 은은한 색상으로 구분했다. 선택 탭은 같은 색상의 링과 배경 농도로만 강조한다.
  - 탭 아래에 `현장 증거 촬영은 선택된 장소에 업로드됩니다.` 안내를 추가했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `progress.md`

- [x] 조원의 사진 정보 수정 권한을 차단하고, 증거함 장소 탭에서 전체 버튼을 제거했다.
  - 조원은 사진 열람만 가능하며, 라이트박스의 정보 수정 버튼·수정 시트·저장 동작이 모두 조장 전용으로 제한된다.
  - 장소 탭은 자재 물류창고·나사장 사무실·나팀장 사무실·채소장 연구실 4개만 남기고, 기본 탭도 자재 물류창고로 복귀했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `src/lib/photoEvidenceFilter.ts`, `tests/photoEvidenceFilter.test.ts`, `progress.md`

- [x] 증거함 장소 탭에 전체 보기를 추가하고, 다섯 탭이 가로 스크롤 없이 한 줄에 들어가도록 조정했다.
  - 탭 순서는 `전체`·자재 물류창고·나사장 사무실·나팀장 사무실·채소장 연구실이며, 기본 선택도 전체로 변경했다.
  - 5열 그리드와 축소된 탭 글자/여백으로 가로 스크롤 없이 한 줄에 표시된다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 7개 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `src/lib/photoEvidenceFilter.ts`, `tests/photoEvidenceFilter.test.ts`, `progress.md`

- [x] 수사노트를 참가자별·용의자별 1개로 제한하고, 본인 노트 수정 기능을 추가했다.
  - 같은 참가자는 용의자 한 명에 수사노트를 한 개만 새로 작성할 수 있으며, 이미 작성한 경우 새 입력창 대신 안내를 표시한다. 조장/조원 모두 동일하게 적용된다.
  - 본인 메모에는 수정·삭제 버튼을 제공한다. 수정은 인라인 입력창에서 저장/취소할 수 있고, 수정·삭제 후 본인 화면과 조 전체 실시간 목록에 즉시 반영된다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/app/suspects/page.tsx`, `src/lib/useSuspectNotes.ts`, `progress.md`

- [x] 사진 라이트박스·편집 시트가 하단 내비게이션과 겹치지 않도록 레이어와 작은 화면 스크롤을 점검·보정했다.
  - 하단 내비게이션은 `z-50`이며, 사진 업로드 시트·라이트박스·정보 수정 시트를 각각 `z-80`·`z-80`·`z-90`으로 올렸다. QR 스캐너(70), 수신전화(100), 관리자 모달(110 이상)도 모두 내비게이션보다 높은 상태임을 함께 확인했다.
  - 사진 라이트박스는 작은 화면에서 세로 스크롤·safe-area 하단 여백을 지원하도록 보완해 정보 수정 버튼이 화면 밖으로 밀리지 않는다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm run build` 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `progress.md`

- [x] 기존 미지정 사진을 자재 물류창고로 보정하고, 조원 QR 제한·수사노트 삭제/접기·랜딩 버튼 잘림을 수정했다.
  - Supabase `photo_evidence`에서 `location_tag`가 null/빈 값인 기존 사진을 `WAREHOUSE`로 변경했고, 남은 미지정 사진 0건을 확인했다.
  - 조원은 사진 업로드뿐 아니라 QR 스캐너도 사용할 수 없도록 비활성화했다.
  - 수사노트 삭제는 성공 즉시 화면에서도 제거하고 오류를 표시하도록 보완했다. 각 용의자의 수사노트는 기본 접힘이며, 열기/접기 버튼으로 확인한다.
  - 랜딩을 `100dvh`와 safe-area 여백에 맞춰 조정해 작은 모바일 화면에서 입장 버튼이 잘리지 않도록 했다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과, `npm run build` 통과.
  - 수정 파일: `src/app/evidence/page.tsx`, `src/app/suspects/page.tsx`, `src/app/page.tsx`, `src/lib/useSuspectNotes.ts`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

- [x] `17_ROLES_NOTES_LOCATION_SPEC.md` 기준으로 조장/조원 권한, 조별 실시간 수사노트, 사진 장소 탭 업로드를 구현했다.
  - 랜딩의 조장 이름을 참가자 이름으로 바꾸고, `game_state.leaders` 기반 실시간 `useRole` 훅과 관리자 조장 지정/해제를 추가했다. 조장만 최종 투표·심문권 사용·사진 업로드를 할 수 있다.
  - 용의자 수사 노트를 `suspect_notes`의 조별 실시간 작성자 메모 목록으로 전환했다. 본인 메모만 삭제할 수 있고, 조/전체 초기화 때 함께 삭제된다.
  - 증거함을 4개 장소 탭으로 전환하고 해당 탭의 장소로만 사진을 업로드하도록 변경했다. 인물 태그 입력/표시는 제거하고, 사진 정보 수정은 캡션+장소만 지원한다.
  - Supabase SQL Editor에서 `docs/01_md/07_DATA_SCHEMA.md` 상단의 `suspect_notes`·`game_state.leaders` SQL을 배포 전에 한 번 실행해야 한다.
  - 검증: `npm run lint` 오류 0(기존 `useGameState` 경고 1개), `npm test` 6개 통과. `npx.cmd tsc --noEmit`은 기존 삭제된 `/ranking`의 `.next/types` 참조 및 테스트의 `.ts` import 설정 때문에 실패했다.
  - 수정 파일: `src/app/page.tsx`, `src/app/vote/page.tsx`, `src/app/suspects/page.tsx`, `src/app/evidence/page.tsx`, `src/app/admin/page.tsx`, `src/lib/store.ts`, `src/lib/useRole.ts`(신규), `src/lib/useSuspectNotes.ts`(신규), `src/lib/usePhotoEvidence.ts`, `src/lib/photoEvidenceFilter.ts`, `src/lib/data.ts`, `tests/photoEvidenceFilter.test.ts`, `docs/01_md/07_DATA_SCHEMA.md`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
  - `feat: add leader roles and shared notes` 커밋을 `origin/master`에 푸시했다.

- [x] 현재 작업분을 Git 커밋하고 원격 `origin/master`로 푸시한다.`n  - 수정 파일: `progress.md`

- [x] `/home`(수사본부) 하단의 "Live Ranking / 수사 현황" 큰 제목을 페이지 타이틀처럼 보이지 않도록 작은 인라인 라벨로 축소했다. 순위 리스트 기능 자체는 그대로 유지.
  - 수정 파일: `src/app/home/page.tsx`, `progress.md`
- [x] 증거함(`/evidence`)의 "현장 증거 촬영" 버튼을 반으로 나눠 왼쪽은 촬영(기존 기능, 아이콘 세련되게 교체), 오른쪽은 새로운 "QR 스캐너"로 만들었다. QR 스캐너는 `getUserMedia` + `jsQR`로 앱을 벗어나지 않고 카메라를 열어 QR을 인식하고, `QR_CODES`에 등록된 id면 `/qr/[id]`로 자동 이동한다.
  - 새 의존성: `jsqr`
  - 수정/추가 파일: `src/app/evidence/page.tsx`, `src/lib/qrScan.ts`(신규), `src/components/QrScannerModal.tsx`(신규), `package.json`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
- [x] 증거 사진 업로드 시 크롬 모바일이 "메모리가 부족하여 실행하지 못했습니다"로 죽는 문제를 수정했다.
  - 원인: `compressImage()`가 `createImageBitmap(file)`로 원본 고화소 사진을 통째로 디코딩한 뒤 2048px로 축소해, 순간 메모리 사용량이 폭증했다.
  - 조치: `<img>`로 크기만 먼저 가볍게 읽고, `createImageBitmap`에 `resizeWidth`/`resizeHeight`를 넘겨 축소본을 바로 디코딩하도록 변경(원본 풀사이즈 디코딩 회피).
  - 수정 파일: `src/lib/image.ts`, `progress.md`

- [x] 사진 번호를 페어 조 수사 그룹별로 독립 발급하도록 변경했다. 1조·4조처럼 페어인 두 조는 같은 번호 시리즈를 공유하고, 다른 조/페어는 `#1`부터 별도 시작한다.
  - `/admin`의 사진 전체 삭제와 전체 조 초기화는 번호 카운터도 비워 다음 사진이 `#1`이 되며, 조별 초기화는 번호를 유지한다.
  - Supabase RPC·테이블 마이그레이션 SQL을 `07_DATA_SCHEMA.md`에 기록했다. 실제 배포 전 Supabase SQL Editor에서 해당 SQL을 한 번 실행해야 한다.
  - 수정 파일: `src/lib/photoEvidenceNumbering.ts`, `src/lib/usePhotoEvidence.ts`, `src/app/admin/page.tsx`, `tests/photoEvidenceNumbering.test.ts`, `docs/01_md/07_DATA_SCHEMA.md`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
- [x] 진행 기록과 미추적 사진 메타데이터/필터 작업 파일을 검토했다.
  - `photoEvidenceFilter.user-pre-merge.*`는 현재 구현과 중복되는 병합 전 임시 파일이며, 확장자 없는 import로 전체 `npm test`를 실패시킨다.
  - 사진 메타데이터·필터·용의자 단순화 계획의 기능은 현재 코드와 최근 커밋에 반영됐다. 중복 임시 파일을 삭제한 뒤 `npm test` 4개 통과로 확인했다.
- [x] `/screen/phone2` 정적 화면의 브라우저 제목을 `채소장 폰`으로 변경했다. (대화·연락처의 동그리 인물명은 유지)
  - 수정 파일: `public/screen/dongguri_phone_room.html`, `progress.md`
- [x] 용의자 파일을 심문권·개인 메모 중심으로 단순화하고, 사진 인물 태그를 인물별 고정 파스텔 색상으로 통일했다.
  - 태그 톤: A 앰버, B 민트, C 블루, D 라일락, E 로즈, PARK 중립 회색, 미지정 zinc 중립색. 증거함 필터·폴라로이드·라이트박스·관리자 사진 점검에 같은 `photoTagTone()`을 적용했다.
  - 용의자 파일에서는 동기·설명·관련 사진을 제거하고 모든 인물의 심문권 상태와 개인 수사 노트만 표시한다.
  - 수정 파일: `src/lib/data.ts`, `src/app/evidence/page.tsx`, `src/app/admin/page.tsx`, `src/app/suspects/page.tsx`, `tests/photoTagPresentation.test.ts`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
- [x] `/screen/phone2` URL은 유지하고 rewrite의 연결 대상을 `public/screen/dongguri_phone_room.html`로 교체했다.
  - 수정 파일: `next.config.ts`, `progress.md`
- [x] /home에 전체 조 사진 증거 실시간 현황을 통합하고, 하단 `현황` 탭과 /ranking 경로를 제거했다. (아래 완료 기록 참조)
- [x] `docs/01_md/14_PHOTO_EVIDENCE_SPEC.md` 기준으로 증거함을 사진(폴라로이드) 업로드 보드로 전환하고, QR은 심문권 퀴즈 획득 플로우로 변경한다.
- [x] 최신 사진 증거 명세에 맞춰 사진 제외/복원(status), 사진 장수 실시간 랭킹, 관리자 사진 점검 패널을 구현한다.
- [x] `docs/01_md/15_ENDING_REVISION.md` 기준으로 엔딩 화면(`/ending`)의 범인 공개 + 모세 이야기 반전을 걷어내고 "EXIT SEASON 2 / TO BE CONTINUED..." 화면으로 교체한다(기존 코드는 주석 보존, 코드만 변경·문서 정리는 별도).
- [x] `docs/01_md/16_ADMIN_CLEANUP.md` 기준으로 `/admin`의 "모든 단서 개방"(+되돌리기) 기능을 삭제하고, "단서 전체 초기화"/"조별 초기화"/"전체 조 초기화"를 사진(Storage 파일 포함) 삭제로 전환하며, "제한 시간 타이머" 기능(관리자 UI+참가자 오버레이+관련 상수·경보음)을 완전히 제거한다.


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
- [x] 사진 증거(폴라로이드) + QR 심문권 퀴즈 구현 (2026-07-14)
  - `/evidence`: 직접 촬영 파일 입력(`capture="environment"`) → 미리보기 → 캡션 20자 + 관련 인물 태그 → Supabase Storage 업로드 + `photo_evidence` 저장 → 2열 폴라로이드 보드/라이트박스 표시
  - `usePhotoEvidence`: 사진 압축(긴 변 1280px, JPEG 0.8), `evidence-photos` 버킷 업로드, 같은 조 + 짝 조 사진 Realtime 공유
  - `/qr/[id]`: 기존 증거 수집 UI 제거, `INTERROGATION_QUIZZES` 기반 심문권 퀴즈로 전환. 현재 `w3n5k7` → 채소장(B), 정답 `poison kill`
  - `useTeamEvidence`: `interrogation_earned` 마커 추가. 정답 성공 시 용의자 ID 기준 심문권 획득을 조/짝 조 공유
  - `/suspects`: 관련 단서 목록 대신 인물 태그 사진 표시, 심문권 티켓 조건을 QR 퀴즈 획득 마커 기준으로 변경
  - `/home`: 증거 수집 진행률 대신 팀 사진 장수와 새 수사 방법 안내 표시
  - 문서: `EDIT_GUIDE.md`에 사진 태그/QR 퀴즈 운영법 추가, `07_DATA_SCHEMA.md`에 `photo_evidence`와 `interrogation_earned` 반영
  - 검증: `npm run lint` 통과(기존 `useGameState.ts` 경고 1건), Supabase env 주입 후 `npm run build` 통과
  - 신규 파일: `src/lib/image.ts`, `src/lib/usePhotoEvidence.ts`
  - 수정 파일: `src/lib/data.ts`, `src/lib/useTeamEvidence.ts`, `src/app/evidence/page.tsx`, `src/app/qr/[id]/page.tsx`, `src/app/qr/[id]/QrPageClient.tsx`, `src/app/suspects/page.tsx`, `src/app/home/page.tsx`, `src/app/globals.css`, `docs/01_md/EDIT_GUIDE.md`, `docs/01_md/07_DATA_SCHEMA.md`, `progress.md`
- [x] 사진 증거 운영 보강: 제외/복원 + 사진 랭킹 + 관리자 점검 (2026-07-14)
  - `photo_evidence.status`(`ok`/`rejected`)를 사진 훅의 조회·Realtime UPDATE에 반영. 제외 사진은 참가자 보드에 흐리게 `제외됨`으로 유지.
  - 이미지 압축을 긴 변 1080px, JPEG 품질 0.72로 조정하고 사진 그리드/관리자 목록에 lazy loading 적용.
  - `useAllTeamsProgress`를 `status='ok'` 사진 행 수 기반으로 전환. joined 마커의 0장 조 표시와 짝 조 합산은 유지.
  - `/ranking`을 사진 장수 표기로 전환하고, `/admin`에 조 필터·원본 라이트박스·제외/복원 기능을 추가.
  - 문서에 `status` 컬럼과 기존 DB용 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` SQL, 관리자 사진 점검 절차를 기록.
  - 검증: `npm run lint` 통과(기존 `useGameState.ts` 경고 1건), Supabase env 주입 후 `npm run build` 통과.
  - 수정 파일: `src/lib/image.ts`, `src/lib/usePhotoEvidence.ts`, `src/lib/useAllTeamsProgress.ts`, `src/app/evidence/page.tsx`, `src/app/ranking/page.tsx`, `src/app/admin/page.tsx`, `docs/01_md/EDIT_GUIDE.md`, `docs/01_md/07_DATA_SCHEMA.md`, `progress.md`
- [x] 엔딩 시즌 예고 화면 전환 (2026-07-14)
  - `/ending`의 진실 공개 버튼, 범인 공개, 모세 이야기 반전 및 귀환 링크를 제거하고 정적 `EXIT SEASON 2` / `TO BE CONTINUED...` 화면으로 교체.
  - 기존 엔딩 코드는 `src/app/ending/page.tsx` 내부 주석으로 보존. `ending_open` 기반 자동 이동 로직은 변경하지 않음.
  - 검증: `npm run lint` 통과(기존 `useGameState.ts` 경고 1건), Supabase env 주입 후 `npm run build` 통과.
  - 수정 파일: `src/app/ending/page.tsx`, `progress.md`
- [x] 관리자 패널 정리: 사진 삭제 전환 + 타이머 제거 (2026-07-14)
  - `/admin`에서 모든 단서 개방·되돌리기와 제한 시간 타이머를 제거.
  - 사진 전체 삭제, 조별 초기화, 전체 조 초기화가 `photo_evidence` 행과 Storage `evidence-photos` 파일을 함께 삭제하도록 전환.
  - 참가자 `TimerOverlay`, 타이머 상수, 타이머 경보음 함수를 제거하고 운영 가이드의 타이머 안내를 사진 초기화 안내로 교체.
  - 검증: 타이머/단서 개방 식별자가 `src/`에 남지 않음을 확인. `npm run lint` 통과(기존 `useGameState.ts` 경고 1건), Supabase env 주입 후 `npm run build` 통과.
  - 삭제 파일: `src/components/TimerOverlay.tsx`
  - 수정 파일: `src/app/admin/page.tsx`, `src/app/layout.tsx`, `src/lib/data.ts`, `src/lib/ringtone.ts`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
- [x] 검토: 증거 사진 — 미리 찍어둔 사진 갤러리 업로드 허용 여부 (2026-07-14)
  - 결론: 허용하지 않음. 치팅 위험(현장에서 실제로 촬영하지 않은 사진을 증거로 제출) 때문에 `capture="environment"` 강제 촬영 방식을 그대로 유지하기로 결정.
  - 코드 변경 없음.

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

## 기획 변경 확정 (2026-07-14) — 증거 수집: QR → 직접 촬영 사진(폴라로이드)

**핵심 전환:** 증거 "수집"을 QR 스캔에서 **참가자가 물리 단서를 직접 사진 찍어 업로드**하는 방식으로 바꾼다. QR은 폐기하지 않고 **심문권 획득용 퀴즈**로 용도 변경한다. (아직 구현 전 — 방향/스펙만 확정, 이 세션에서 코딩 시작 예정)

### 확정된 결정 (사용자 답변)

1. **증거 수집 = 직접 촬영 사진 (폴라로이드)**
   - 브라우저 카메라 버튼 → 폰 기본 카메라 실행(`<input type="file" accept="image/*" capture="environment">`) → 촬영 사진 업로드
   - 폴라로이드 UI: 흰 프레임 + 사진 + 아래 **캡션 20자 이내**(`maxLength=20`)
   - 업로드 전 클라이언트 압축(canvas, 긴 변 **1080px·JPEG 0.72**, 장당 ~200KB) — 스토리지·전송량 대비
   - **용량 결론**: 조당 사진담당 1명 → 동시 업로더 6~8명뿐. 총 150~400장(50~150MB)로 무료 1GB 여유. 쿨다운/조당 상한은 불필요. 남는 변수는 "보는 쪽" 전송량뿐 → 그리드 작게+탭 시 원본, CDN 캐시로 충분

2. **하이브리드 — 관련 인물 드롭다운 태그**
   - 사진 업로드 시 "어느 인물 관련인지" 드롭다운으로 선택: **6명** = A 나사장 / B 채소장 / C 나팀장 / D 이대리 / E 김사원 / **박실장(피해자, 태그 전용)**
   - 용의자 파일(`/suspects`)에서 `suspect_tag`로 필터 → 그 인물 관련 사진만 표시(하이브리드 연결 유지)
   - (미정: `미지정` 옵션 포함 여부 — 사용자 확인 대기)

3. **QR = 심문권 획득 퀴즈로 용도 변경**
   - QR 스캔 → 웹에서 문제 출제 → 정답 입력 시 **심문권 획득**(더 이상 단서 수집용 아님)
   - 용의자별 심문권 1개씩은 지금처럼 웹에서 획득하는 구조 유지

4. **공유 범위 = 조별 공유 보드 (현재와 동일)**
   - 같은 조 번호 기기끼리 폴라로이드 보드 실시간 공유. 기존 조별 Realtime 구조 재활용. 짝 조 공유도 유지 가능

5. **기존 지정 증거 시스템(E01~E16) = 삭제하지 말고 보존**
   - 관련 로직(잠금 퀴즈·동기 공개·공통단서·용의자-단서 연결)은 주석/비노출로 보존. ⚠️ `EVIDENCE`/`QR_CODES` 배열을 통째로 주석 처리하면 import하는 파일에서 빌드가 깨지므로, **진입점(홈 안내·네비·라우트)만 차단**하고 데이터/로직 코드는 보존

### 사전 준비 (Supabase — 구현 전 필요)

사진 파일 저장용 **Storage 버킷 + 메타 테이블**이 필요하다. Supabase SQL Editor에서 실행:

```sql
create table photo_evidence (
  id uuid primary key default gen_random_uuid(),
  pair_id text not null,
  image_url text not null,
  caption text,            -- 20자 이내
  suspect_tag text,        -- 'A'|'B'|'C'|'D'|'E'|'PARK'|null
  created_at timestamptz default now()
);
alter table photo_evidence enable row level security;
create policy "anon rw" on photo_evidence for all using (true) with check (true);
alter publication supabase_realtime add table photo_evidence;

insert into storage.buckets (id, name, public) values ('evidence-photos','evidence-photos', true);
create policy "anon upload" on storage.objects for insert to anon with check (bucket_id = 'evidence-photos');
create policy "anon read" on storage.objects for select to anon using (bucket_id = 'evidence-photos');
```

### 확인 사항 (모두 확정됨)

- [x] Supabase SQL 실행 — 완료(photo_evidence 테이블 + evidence-photos 버킷)
- [x] 드롭다운에 `미지정` 옵션 포함 — 포함(빈 값)
- [x] 기존 `/evidence`를 폴라로이드 보드로 **완전 교체** — 교체로 확정
- [x] QR 퀴즈 매핑 — 채소장(B)만 QR `w3n5k7`·정답 `poison kill` 연결. A·C·D·E는 데이터만 나중에

6. **실시간 랭킹 = 조별 사진 개수 기준** (확정)
   - 모더레이션: **즉시 카운트 + 사후 제외(soft-reject)**. 사진은 올리면 바로 카운트, 스탭이 `/admin` 사진 점검에서 스팸을 `제외`하면 카운트에서 빠짐(삭제 아님, 복원 가능)
   - 스키마 추가 필요(⚠️ 아직 미실행): `alter table photo_evidence add column status text not null default 'ok';`
   - `useAllTeamsProgress`를 `photo_evidence` 개수 집계로 전환(0장 조는 joined 마커로 계속 표시, 짝 조 합산 유지). `/admin`에 사진 점검 패널(제외/복원) 신설

### 구현 지시서 (Codex에게 위임)

- **직접 구현하지 않고 지시서만 작성**하기로 함. 코드 작성은 Codex가 수행.
- 지시서: `docs/01_md/14_PHOTO_EVIDENCE_SPEC.md` — 파일별 변경·참조 구현·수용 기준까지 명시(랭킹 사진화 + 스탭 점검 포함).
- 요지: 새 파일 `src/lib/image.ts`(압축)·`src/lib/usePhotoEvidence.ts`(조별 사진 공유 훅), `useTeamEvidence.ts`에 `interrogation_earned` 상태/`earnInterrogation` 추가, `/evidence` 폴라로이드 보드 교체, QR(`page.tsx`+`QrPageClient.tsx`) 심문권 퀴즈로 교체, `useAllTeamsProgress`·`/ranking` 사진 개수 집계 전환, `/admin` 사진 점검 패널 신설, `/suspects`·`/home` 안내 최신화. 기존 `EVIDENCE`/`QR_CODES` 데이터는 보존.

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

- [x] 조장/조원 권한 · 공유 수사노트 · 사진 장소 탭 — 기획서 작성 (2026-07-14)
  - 사용자 요청 3건을 확정 답변과 함께 구현 기획서로 정리. 아직 구현 전(문서만).
  - 확정: (1) 조장 전용=최종 투표+심문권 사용+사진 업로드, 조원은 용의자 탭 메모 추가만. (2) 촬영 인물 태그 제거, 장소는 상단 탭 선택으로 자동. (3) 수사노트는 작성자별 메모 목록으로 조 전체 실시간 공유.
  - 조장 지정=`/admin`에서 조 번호+이름 → `game_state.leaders` JSONB. 랜딩 `조장 이름`→개인 `이름`으로 의미 변경. 새 테이블 `suspect_notes` 필요.
  - Supabase SQL(테이블 `suspect_notes` + `game_state.leaders` 컬럼) 실행 필요 — 문서에 기재.
  - 신규 파일: `docs/01_md/17_ROLES_NOTES_LOCATION_SPEC.md`
  - 수정 파일: `progress.md`

- [x] 사진 증거 "정보 수정"에서 캡션(20자 메모)도 수정 가능하게 확장 (2026-07-14)
  - 기존: 라이트박스 → 정보 수정 시트가 관련 인물·장소 태그만 수정, 캡션은 "촬영 당시 기록으로 유지" 안내로 잠금
  - 변경: 편집 시트에 업로드와 동일한 증거 설명 입력칸(20자 제한, 글자수 표시)을 추가. 저장 시 캡션·태그를 함께 갱신
  - 훅: `updatePhotoMetadata(id, suspectTag, locationTag)` → `updatePhotoMetadata(id, caption, suspectTag, locationTag)`로 `caption` 파라미터 추가, `photo_evidence.caption`도 업데이트(빈 값은 `null`). Realtime UPDATE 핸들러가 전체 행을 재매핑하므로 같은 조·짝 조에 즉시 반영
  - 검증: `npx eslint` 통과. DB 스키마 변경 불필요(`caption` 컬럼 기존 존재)
  - 수정 파일: `src/lib/usePhotoEvidence.ts`, `src/app/evidence/page.tsx`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

- [x] 홈 화면 "수사 현황 · 증거수집 순위" 비활성화(주석처리) (2026-07-14)
  - `/home` 하단 전체 조 실시간 순위 블록을 JSX 주석으로 비활성화. 관련 훅/import(`useAllTeamsProgress`, `getTeamInfo`, `useEffect/useState`, `myTeamId`)도 함께 주석 처리해 미사용 변수 경고 없이 정리
  - 삭제가 아니라 주석 보존 — 상단 훅/import 주석과 하단 JSX 주석 블록을 함께 해제하면 복원됨. `useAllTeamsProgress.ts`는 그대로 둠
  - "팀 사진 증거"·"수사 방법" 등 나머지 홈 섹션은 유지
  - 수정 파일: `src/app/home/page.tsx`

- [x] 인앱 QR 스캐너 카메라 재시작 버그 수정 (2026-07-14)
  - `QrScannerModal`의 카메라 `useEffect`가 부모의 인라인 `onClose`(매 렌더 새 함수)에 의존 → evidence 페이지 실시간 갱신 리렌더마다 카메라가 껐다 켜짐(깜빡임·인식 지연)
  - `onClose`를 ref로 고정하고 effect 의존성을 `[open, router, stopStream]`으로 축소 → 카메라는 open 토글에만 반응
  - 수정 파일: `src/components/QrScannerModal.tsx`

- [x] 인앱 QR 스캐너 "등록되지 않은 QR" 진단·보강 (2026-07-14)
  - 증상: 기본 카메라로는 배포 URL(`.../qr/x4k9m2`)로 접속되는데 인앱 스캐너만 "등록되지 않은 QR" 표시
  - 확인: `resolveQrPath`는 소문자 등록 id URL을 정상 변환함(node 재현 테스트). 실패 케이스는 대문자 id 또는 미등록 id뿐
  - 보강: `resolveQrPath`를 대소문자 무시로 매칭하고 등록된 정규 id로 이동(인쇄 QR 대문자 대응). 에러 메시지에 디코드된 원문을 표시해 실패 원인(어떤 값이 왜 미등록인지)이 바로 보이게 함
  - 수정 파일: `src/lib/qrScan.ts`, `src/components/QrScannerModal.tsx`

- [x] phone2·phone3 첫 화면 뒤로가기 유출 보강 (갤럭시 One UI 예측형 뒤로가기) (2026-07-14)
  - 증상: 설치 PWA 첫 화면에서 제스처 뒤로가기 시 앱을 벗어남(갤럭시). 원인은 더미 히스토리를 1겹만 쌓아 히스토리가 얕을 때 One UI가 "앱 종료"로 판단
  - 조치: 더미 히스토리를 5겹 쌓고 popstate마다 2겹씩 재충전해 항상 여유분 유지. `dongguri_phone_room.html`·`flower_phone_call_log.html` 동일 적용
  - ⚠️ 웹 코드만으로 100% 차단은 불가 — 확실한 잠금은 안드로이드 '앱 고정(Screen Pinning)' + 3버튼 내비 권장(운영 대책)
  - 수정 파일: `public/screen/dongguri_phone_room.html`, `public/screen/flower_phone_call_log.html`

- [x] phone2·phone3 디바이스 화면 PWA 전환 — 홈화면 설치 → 전체화면 (2026-07-14)
  - `/screen/phone2`(dongguri_phone_room.html)·`/screen/phone3`(flower_phone_call_log.html)을 설치형 PWA로 전환. 홈 화면 추가 시 브라우저 UI 없이 `display: fullscreen`으로 실행(안드로이드는 상단 상태바까지 숨김 → 목업의 가짜 상태바만 노출). iOS는 상태바 완전 숨김 불가라 겹칠 수 있음 → 프롭은 안드로이드 권장(문서화)
  - 각 폰 별도 매니페스트로 `start_url`/`scope`를 `/screen/phone2`·`/screen/phone3`로 분리 → 홈 화면에 앱 아이콘 2개로 각각 설치됨
  - 아이콘: sharp로 SVG→PNG 생성(192/512=안드로이드, 180=iOS). phone2=카카오톡풍 노란 말풍선, phone3=초록 전화 수화기 — 실제 앱 아이콘처럼
  - 신규 파일: `public/screen/phone2.webmanifest`, `public/screen/phone3.webmanifest`, `public/screen/icons/phone{2,3}-{180,192,512}.png`, `scripts/gen-phone-icons.mjs`(아이콘 생성기)
  - 수정 파일: `public/screen/dongguri_phone_room.html`, `public/screen/flower_phone_call_log.html`(head에 manifest·apple 메타·viewport-fit 추가), `docs/01_md/EDIT_GUIDE.md`(12장 PWA 설치 절 추가), `progress.md`

- [x] phone2 시작 화면 재배치 + 상단 목업 배너 제거 + 실수 문서화 (2026-07-13)
  - 상단 목업 안내 바(`.demo-banner`) CSS·엘리먼트 삭제. `.screen`의 `padding-top: 26px` 주석을 "상단 상태바/노치 여백"으로 갱신(값 유지)
  - 시작 화면: 시계·조 선택 드롭다운을 아래(`justify-content: flex-end`)에서 위로 이동. 시계는 `#start .lock-clock { top: 16% }`(살짝 위쪽), 조 선택 패널은 `#start .start-panel { top: 50%; transform: translate(-50%,-50%) }`(세로 중앙). `#start`는 `.screen`의 `inset:0`로 화면을 채우므로 자식 absolute 배치가 안전
  - 재발 방지 문서화(사용자 요청): `docs/01_md/EDIT_GUIDE.md` phone2 절에 "⚠️ 레이아웃 함정" 메모 추가 — (1) `.screen`과 겹치는 클래스에 `position` 금지(높이 0 붕괴), (2) 세로 잘림처럼 보여도 원인이 뷰포트 높이가 아닐 수 있음 + svh 인앱 폴백, (3) 배경은 자식을 못 덮음
  - 검증: headless 렌더로 시작 화면 확인(배너 없음, 시계 상단·패널 중앙)
  - 수정 파일: `public/screen/phone2.html`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

- [x] phone2 홈/시작 화면 붕괴 — 진짜 원인(.wallpaper position 충돌) 수정 (2026-07-13)
  - 위 `svh`/`--app-h` 수정 후에도 홈 화면 하단 독이 여전히 안 보임 → 진짜 원인은 뷰포트 높이가 아니라 CSS `position` 충돌이었음
  - `#home`/`#start`는 `class="screen wallpaper"`. `.screen{position:absolute;inset:0}`과 `.wallpaper{position:relative}`가 명시도가 같아 뒤에 온 `.wallpaper`가 이겨 `position:relative`가 적용됨. 그러면 화면이 body를 못 채우고, 자식(상태바·페이지닷·독)이 전부 `absolute`라 in-flow 콘텐츠가 없어 **화면 높이가 0으로 붕괴** → 독이 화면 밖으로 밀려 안 보이고 바닥은 body 검정만 노출
  - 해결: `.wallpaper`에서 `position:relative` 제거(배경은 `.screen`의 absolute 박스에 그대로 그려짐). 재발 방지 주석 추가. `--app-h` 높이 수정은 앱 화면(전화/메시지)의 보이는 영역 정확도용으로 유지
  - 검증: headless 렌더 측정 — 독 `16→484`, 4번째 아이콘 우측 `431`(<484)로 4개 모두 정상 배치. 아이콘은 고정 52px + 간격만 신축이라 뷰포트 ≥240px면 안 잘림(모든 폰 통과). 배경 그라데이션은 원인 아님(background는 자식보다 항상 아래)
  - 수정 파일: `public/screen/phone2.html`, `progress.md`

- [x] phone2 목업 하단 잘림 재수정 — 인앱 브라우저 대응 (2026-07-13)
  - 증상: `/screen/phone2` 홈 화면 하단 독(4개 아이콘)/시작 패널이 화면 밖으로 밀려 안 보이고 바닥이 검게 보임
  - 원인: 직전 수정(`svh`)이 `svh` 미지원 브라우저(카카오톡·인스타 등 인앱 브라우저)에서 `100vh`(주소창 포함 큰 뷰포트)로 폴백돼 여전히 잘림. body 높이 > 실제 보이는 영역이라 `absolute` 자식(독/패널)이 밑으로 밀림
  - 해결: JS로 `visualViewport.height`(폴백 `innerHeight`)를 `--app-h` 픽셀 값으로 고정, `resize`/`orientationchange`/`visualViewport resize`에 갱신. CSS는 `height: var(--app-h, 100svh)`로 JS 실행 전엔 svh 폴백. svh/dvh 지원 여부와 무관하게 모든 브라우저에서 보이는 영역에 정확히 맞춤
  - 수정 파일: `public/screen/phone2.html`, `progress.md`

- [x] 채소장 폰(`phone2.html`) 실기기 확인 후 레이아웃/시인성 수정 (2026-07-13)
  - 시작 화면: 조 번호 선택 패널이 시계에 너무 붙어 보이던 문제 — `margin-top:auto` 방식 대신 `justify-content:flex-end` + 고정 `gap(14vh)`로 교체해 항상 일정한 간격을 보장하고 화면 아래쪽에 균형있게 배치
  - 홈 화면: 독(dock) 아이콘이 **아예 안 보이던 실제 원인** — `.app-glyph::before`(유리광택 오버레이)가 z-index 미지정 상태라 아이콘 SVG보다 위에 그려지면서 아이콘을 완전히 가리고 있었음. 오버레이 `z-index:0`, 아이콘 SVG `z-index:1`로 명시해 확실히 위로 오도록 수정 — 근본 수정
  - 곁들여 배경 그라데이션도 좀 더 밝은 톤으로 조정하고 독 배경/테두리 불투명도를 올려 대비를 개선(가독성 보강용, 근본 원인은 아니었음)
  - 수정 파일: `public/screen/phone2.html`

- [x] 채소장 폰(`phone2.html`) 홈 화면 — 실기기 참고 이미지 기준 4버튼 구성으로 단순화 (2026-07-13)
  - 참고: `docs/03_src/01_Images/홈화면 UI.png` (실제 갤럭시 홈 화면 스크린샷)
  - 앱 아이콘 그리드(전화·메시지·카메라·갤러리·캘린더·설정 6개) 전체 삭제, 독(dock)에 **전화·문자·인터넷·카메라 4개만** 남김
  - 전화·문자는 그대로 동작. **인터넷·카메라는 아예 비활성화**(클릭 핸들러 없음, `tabindex="-1"`, 살짝 어둡게 표시)
  - 설정(⚙️) 아이콘도 홈 화면에서 제거 — 수동 진입 경로 없이 **기존 90초 무입력 자동 세션 종료만으로** 다음 조 전환 처리(사용자 확인 완료)
  - 배경화면을 참고 이미지처럼 절제된 다크 톤(짙은 네이비/블랙 + 은은한 빛 번짐)으로 교체, 상단에 점(...)+페이지 인디케이터 점 2개 추가
  - 인터넷 아이콘 신규 추가(지구본 모양 SVG), 카메라 아이콘은 빨간 계열로 재도색
  - 이제 안 쓰는 `#appSettings` 화면·CSS(`.settings-body`/`.session-card`/`.end-session-btn`)와 `.home-area` 그리드 CSS, `ic-gal`/`ic-cal`/`ic-set` 심볼, `sessionLabel` JS 참조 모두 정리
  - 수정 파일: `public/screen/phone2.html`

- [x] 디바이스 목업 3종 — 뒤로가기 방지에 2차 안전장치 + 갤럭시 실기기 한계 문서화 (2026-07-13)
  - 실기기(갤럭시, 크롬) 테스트 결과: 안드로이드 크롬의 "제스처 뒤로가기(예측형)"는 기존 `pushState`+`popstate` 트릭을 우회하고 그대로 사이트를 벗어남 — 크롬/안드로이드 자체 한계, 웹페이지 코드만으로 100% 차단 불가
  - 2차 안전장치로 `beforeunload` 추가: 트릭이 뚫려 실제로 페이지를 떠나려 하면 브라우저 기본 확인창이라도 뜨게 함
  - 행사 운영 대책: 프롭 기기(공기계)는 안드로이드 설정에서 제스처 내비게이션 대신 **3버튼 내비게이션**으로 바꿔두면 스와이프 우회 자체가 사라져 안정적으로 막힘 — `EDIT_GUIDE.md`에 권장 사항 명시
  - 수정 파일: `public/screen/phone2.html`, `public/screen/laptop.html`, `public/screen/ipad.html`, `docs/01_md/EDIT_GUIDE.md`(12절)

- [x] 채소장 폰(`phone2.html`) 홈 화면 UI 최신화 (2026-07-13)
  - 문제: 홈 화면이 이모지 아이콘 + 밋밋한 그라데이션이라 실제 스마트폰처럼 안 느껴짐
  - 배경: 다층 radial-gradient(빛 번짐 + 컬러 오브 3개) + 비네트로 요즘 폰 기본 배경화면 느낌의 깊이감 추가
  - 상단: 다이나믹 아일랜드(알약 모양 노치) 추가, 상태바를 신호/와이파이 SVG 아이콘 + 배터리 퍼센트(%) 표기로 교체
  - 앱 아이콘: 이모지(📞💬📷 등) → 전용 SVG 심볼(`<symbol id="ic-*">`)로 교체, squircle 모양 + 유리광택(하이라이트) + 그림자로 입체감 부여
  - 하단: 제스처 내비게이션 홈 인디케이터(얇은 흰 알약바) 추가, 독(dock) 블러/그림자 강화
  - 폰트: `Segoe UI` 우선순위 → `-apple-system/Roboto` 계열로 교체(모바일 OS 폰트 스택)
  - 수정 파일: `public/screen/phone2.html`

- [x] 디바이스 목업 3종 — 모바일 뒤로가기로 화면 이탈 방지 (2026-07-13)
  - 문제: `phone2.html`(채소장 폰) 등에서 모바일 브라우저 뒤로가기 버튼/스와이프를 누르면 화면을 벗어나 몰입이 깨짐
  - 조치: `history.pushState` + `popstate` 리스너로 히스토리를 계속 되채워 뒤로가기를 무력화(같은 화면에 그대로 남음)
  - `public/screen/phone2.html`, `laptop.html`, `ipad.html` 세 화면 모두 동일하게 적용
  - 수정 파일: `public/screen/phone2.html`, `public/screen/laptop.html`, `public/screen/ipad.html`, `docs/01_md/EDIT_GUIDE.md`(12절)

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

- [x] phone2 하단 독·버튼이 모바일 브라우저에서 잘려 안 보이는 문제 수정 (2026-07-13)
  - 배포(`ns-exit.vercel.app`)는 최신 커밋과 동일함을 확인 — 배포 문제 아니었음(z-index 수정 커밋 `9d1f899`는 이미 반영돼 있었음)
  - 실제 원인: `.screen`이 `position:absolute; inset:0`인데 `body`에 `position`이 지정 안 돼(static) 기준(containing block)이 실제 보이는 화면이 아니라 모바일 브라우저의 "큰 뷰포트"(주소창 숨김 기준 높이)로 잡힘 → 주소창이 떠 있는 실제 화면보다 콘텐츠가 더 길게 계산되고 `overflow:hidden`이라 스크롤도 안 돼 하단(독·시작화면 패널)이 화면 밖으로 밀려나 안 보였음
  - `body`에 `position: relative`를 주고, `html, body` 높이를 실제 보장되는 최소 뷰포트 단위(`100svh`, `100vh` 폴백)로 명시해 `.screen`의 기준을 실제 보이는 영역으로 고정
  - ⚠️ Chrome 확장 미연결로 실기기 렌더링은 직접 확인 필요. `laptop.html`/`ipad.html`도 동일한 `.screen{position:absolute;inset:0}` + body static 구조라 같은 증상 가능성 있음 — 보고되면 동일하게 고칠 것
  - 수정 파일: `public/screen/phone2.html`, `progress.md`

- [x] 수사본부·사진 메타데이터·용의자 화면 개편 완료 (2026-07-14): SQL migration 적용 후 장소·영구 번호·인물 필터/편집·수사본부 통합·용의자 심문/메모 단순화를 반영했다. 중복 임시 `photoEvidenceFilter.user-pre-merge.*` 파일을 삭제했고 전체 `npm test` 4개 통과를 확인했다.

- [x] 수사본부에 전체 조 사진 증거 실시간 현황 통합 (2026-07-14)
  - `/home`의 수사 방법 카드 바로 아래로 기존 랭킹 UI를 이동했다: 1~3위 색상, 내 조 `(나)` 강조, 사진 장수, 빈 상태, 실시간 상태를 보존했다.
  - `getTeamInfo`는 내 조 강조용 로컬 상태에만 사용하고, 전체 목록은 `useAllTeamsProgress().groups`를 사용한다.
  - 하단 네비게이션의 `현황` 항목과 `/ranking` 페이지를 제거했다.
  - 검증: `npm test` 통과(3개), `npm run lint` 오류 0/기존 경고 1개. `npm run build`는 TypeScript 컴파일을 통과했다. 이후 /admin 사전 렌더링은 이 worktree에 Supabase 환경 변수가 없어 실패했다.
  - 수정 파일: `src/app/home/page.tsx`, `src/components/BottomNav.tsx`, `src/app/ranking/page.tsx`(삭제), `tests/investigationHub.test.ts`, `progress.md`

- [x] `/screen/phone3` 추가 + phone2·phone3 뒤로가기 방지 스니펫 보강 (2026-07-14)
  - 미커밋 상태로 있던 `public/screen/flower_phone_call_log.html`(홈+최근 통화 목록 폰 화면)을 `next.config.ts` rewrite로 연결: `/screen/phone3` → `flower_phone_call_log.html`
  - `laptop.html`/`ipad.html`에는 있지만 현재 phone2 대상(`dongguri_phone_room.html`)·신규 phone3에는 빠져 있던 뒤로가기 방지 스니펫(`history.pushState` + `popstate` 재작성 + `beforeunload`)을 두 파일에 동일하게 추가
  - `EDIT_GUIDE.md` 12절에 phone3 파일/URL·뒤로가기 방지 대상 화면 목록을 갱신(소유자 미확정 초안임을 표기)
  - 수정 파일: `next.config.ts`, `public/screen/dongguri_phone_room.html`, `public/screen/flower_phone_call_log.html`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`

- [x] 증거함 인물 필터를 아이콘 버튼으로 단순화 + 용의자 카드에서 머그샷/CASE FILE 제거 (2026-07-14)
  - `/evidence`: 전체·인물별(색상)·미지정 버튼이 나열되던 필터 줄을 필터 아이콘 버튼 하나로 교체. 누르면 같은 옵션(전체/인물별 색상 태그/미지정)이 드롭다운으로 뜨고 선택 시 닫힘. 필터가 "전체"가 아니면 아이콘이 앰버로 강조 표시됨. 필터 로직(`activeFilter` 값, `filterPhotoEvidence`)은 변경 없음.
  - `/suspects`: 카드에서 머그샷(이미지/실루엣)과 "CASE FILE" 배지를 제거하고 심문권·수사 노트만 표시. 접기/열기 아코디언도 함께 제거해 항상 펼친 상태로 표시(심문권 획득 여부를 탭 없이 바로 확인할 수 있도록 — 사용자가 필요성 여부를 위임해 이 방향으로 결정).
  - `EDIT_GUIDE.md` "4. 용의자 정보 수정"의 `imageUrl`/머그샷 안내를 제거하고, 카드에는 코드명·이름·심문권·수사 노트만 렌더링됨을 명시.
  - 검증: `npm run lint`(두 파일 오류 없음, 기존 무관 경고만), `npx tsc --noEmit`(두 파일 오류 없음), `npm test` 6개 통과. 로컬 dev 서버(`localhost:3000`) SSR 응답으로 "CASE FILE"/"파일 열기" 제거, "심문권"/"수사 노트" 유지, 필터 아이콘 aria-label 렌더링을 확인. Chrome 확장 미연결로 실제 클릭 상호작용은 눈으로 확인 못함.
  - 수정 파일: `src/app/evidence/page.tsx`, `src/app/suspects/page.tsx`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
## 작업 완료 (2026-07-15)

- [x] 사진 업로드 한도를 조별 30장으로 명확히 했다. 짝 조여도 한도를 공유하지 않아, 예를 들어 1조와 4조는 각각 30장씩 총 60장까지 등록할 수 있다.
  - 증거함에 조별 한도와 짝 조 미공유 안내를 표시하고, 업로드 오류·상수·DB 트리거 메시지를 조 기준으로 갱신했다.
  - 검증: `npm test` 10개 통과, `npm run build` 통과.
  - 수정 파일: `src/lib/photoUploadLimit.ts`, `src/lib/usePhotoEvidence.ts`, `src/app/evidence/page.tsx`, `tests/photoUploadLimit.test.ts`, `docs/01_md/07_DATA_SCHEMA.md`, `docs/01_md/EDIT_GUIDE.md`, `progress.md`
