# MODULE CATALOG — 구현 가능 기능 모듈 목록 (Codex 핸드오프용)

> 이 앱은 **"관리자가 이벤트를 쏘면 → Supabase Realtime으로 전 기기에 도달 → 오버레이/화면이 반응"**
> 하는 구조다. 수신전화(`useIncomingCall`)는 이 패턴의 첫 사례일 뿐이고, 같은 뼈대로 여러 연출을
> 찍어낼 수 있다. 이 문서는 그 후보 모듈을 카탈로그화해 **골라서 구현**하기 쉽게 만든 핸드오프다.
>
> - 상위 방향: `10_DESIGN_UPDATE.md` (오프라인 헌팅 중심), `11_DEVICE_UI_PLAN.md` (디제틱 기기 연출)
> - 구현 상태: `progress.md` (**작업 전 반드시 먼저 읽기** — CLAUDE.md 규칙)

---

## 1. 재사용 중인 공통 뼈대 (= "모듈화"의 핵심)

새 연출은 대부분 아래 인프라를 조합하는 것으로 끝난다. 신규 테이블/컬럼은 되도록 만들지 않는다.

| 인프라 | 역할 | 현재 재사용처 | 코드 위치 |
|---|---|---|---|
| `team_evidence_items` (`pair_id`, `evidence_id`, `type`, `created_at`) | 만능 이벤트/마커 저장소 | 수집·심문·수신전화·joined | Supabase 테이블 |
| Supabase Realtime 구독 | 전 기기 즉시 전파 | 모든 실시간 기능 | `src/lib/supabase.ts` |
| `__global` 마커(`GLOBAL_PAIR_ID`) + 전역 오버레이 | 전체 대상 연출 | 수신전화·공통단서 공지 | `src/lib/data.ts`, `src/app/layout.tsx` |
| `/admin` 트리거 | 운영자가 이벤트 발행 | 투표/엔딩/전화 | `src/app/admin/page.tsx` |
| `game_state` (+`pairings` JSONB) | 게임 상태·페이로드 | 상태 제어(투표 열림/엔딩/짝조) | `src/lib/useGameState.ts` |
| `useTeamEvidence().collect` | 조 보관함에 증거 등록(조·짝조 공유) | 수집·음성메시지 | `src/lib/useTeamEvidence.ts` |

### 딱 하나의 제약 — payload(자유 텍스트) 컬럼이 없다

`team_evidence_items`는 `(pair_id, evidence_id, type, created_at)`만 있고 **자유 텍스트 컬럼이 없다.**

- **콘텐츠가 고정**인 연출(전화·음성·정해진 문자) → `data.ts`에 코드로 넣으면 됨 → 🟢
- **매번 내용이 바뀌는 것**(속보 문구를 admin이 그때그때 입력) → JSONB `payload` 컬럼 1개 추가가 깔끔 → 🟡/🔴
- 이 비용이 아래 목록의 난이도에 반영돼 있다.

---

## 2. 구현 가능 모듈 목록

난이도: 🟢 인프라 거의 그대로 · 🟡 중간(약간의 신규) · 🔴 신규 설계 · ✅ 이미 구현/기획됨

### A. 관리자 트리거 연출 (수신전화 계열 — 전역 마커 + 오버레이)
| 모듈 | 설명 | 재사용 | 난이도 |
|---|---|---|---|
| 📱 문자/메신저 수신 | 협박 문자·익명 제보 톡. 전화의 텍스트판 | 전역마커 + 오버레이 | 🟢 |
| 🚨 재난문자/긴급경보 | 전체화면 경보 컷인(사이렌+진동) | 전역마커 + 오버레이 | 🟢 |
| ⚡ 정전/글리치 연출 | 화면 깜빡임·노이즈 | 순수 CSS+타이머 (DB 불필요 가능) | 🟢 |
| 📢 속보/긴급 브리핑 배너 | 놓쳐도 다시 열면 뜸 + 홈 아카이브 | ✅기획(`11_..§2`). **payload 필요** | 🟡 |
| 📺 방송/앵커 컷인 | 뉴스 자막 오버레이 | 전역마커 + 오버레이 | 🟡 |
| 📹 CCTV 라이브 컷인 | 특정 순간 CCTV 영상 강제 재생 | 전역마커 + `videoUrl` | 🟡 |

### B. 단서 전달·열람
| 모듈 | 설명 | 재사용 | 난이도 |
|---|---|---|---|
| 🔊 음성 메시지 수집 | 전화 받으면 조 보관함에 등록 | ✅기획(`11_..§4-B`) | — |
| 🎞 영상 증거 인라인 플레이어 | 카드 안에서 재생 | ✅구현됨(`videoUrl`) | — |
| 🔍 이미지 줌/돋보기 | 사진 속 숨은 디테일 확대 | 기존 라이트박스 확장 | 🟡 |
| 📄 문서 뷰어(마스킹) | 장부·서류 일부 가림 → 해제 시 공개 | 신규 컴포넌트 | 🟡 |
| 🎧 오디오 조작 힌트 | 역재생/노이즈 제거해야 들리는 단서 | 신규 오디오 처리 | 🔴 |

### C. 잠금·퍼즐 (디제틱 기기)
| 모듈 | 설명 | 재사용 | 난이도 |
|---|---|---|---|
| 🔢 키패드/다이얼 잠금 | 금고·도어락 스킨 | `LOCKED_EVIDENCE` 패턴 확장 | 🟢 |
| 💻 조별 비번 발급 퍼즐 | 노트북 잠금용 신분증 | ✅기획(`11_..`) | 🟡 |
| 📞 발신(전화 걸기) | 특정 번호 입력 시 반응(음성/단서) | 키패드 + `data.ts` | 🟡 |
| 🖐 패턴/지문 잠금 스킨 | 잠금 연출 | 신규 컴포넌트 | 🟡 |
| 🗺 좌표/지도 입력 | 위치 맞히기 | 신규 설계 | 🔴 |

### D. 조 협력·상호작용
| 모듈 | 설명 | 재사용 | 난이도 |
|---|---|---|---|
| 🎫 심문권 | 특정 단서 획득 시 지급 | ✅구현됨(`interrogationTriggerId`) | — |
| 🔗 짝 조 협력(레시피+주기율표) | 두 조만 증거 공유 | ✅기획 + `pairings` | 🟡 |
| ⏱ 카운트다운 타이머 | 종료 압박, admin 시작/정지 | `game_state` | 🟢 |
| 💬 조 간 쪽지/정보 거래 | 조끼리 정보 주고받기 | 신규 설계 | 🔴 |

### E. 진행·메타
| 모듈 | 설명 | 재사용 | 난이도 |
|---|---|---|---|
| 💡 힌트 요청 시스템 | 막히면 요청 → admin 승인 시 공개 | `game_state` + 신규 | 🟡 |
| 🏁 엔딩 분기 | 최종 투표 결과별 다른 엔딩 화면 | 기존 엔딩 확장 | 🟡 |

---

## 3. 범용화 패턴 — `useBroadcastEvent` (✅ 구현됨)

**파일: `src/lib/useBroadcastEvent.ts`.** **(evidenceId, type) 마커 1개 = 연출 1개** 형태의 범용 훅으로,
위 **A그룹(문자/경보/방송 등)** 을 이 훅 + 오버레이 컴포넌트만 갈아끼워 찍어낼 수 있다.
`useIncomingCall`은 이 훅 위의 얇은 래퍼로 재구성돼 있다(전화도 같은 뼈대 사용).

**export:**

```ts
useBroadcastEvent(evidenceId, type)  // → { active, eventId, loaded, markHandled }
markBroadcastHandled(type, evidenceId, eventId)  // 처리 기록(기기별 localStorage)
clearBroadcastHandled(type, evidenceId)          // 재발행 시 처리 기록 초기화
broadcastHandledKey(type, evidenceId)            // localStorage 키 헬퍼
```

각 연출 소비는 이렇게 얇아진다:

```tsx
// 문자 수신 연출 예시
const { active, loaded, eventId, markHandled } = useBroadcastEvent("_sms_1", "sms");
// active면 <SmsOverlay onClose={markHandled} /> 렌더
```

- `data.ts`엔 `SMS_EVENTS = [{ id, type, sender, body }]` 같은 **콘텐츠 테이블**만 추가.
- `/admin`엔 "문자 보내기" 버튼 하나 추가(= 해당 `(evidence_id, type)` 마커 upsert / 종료 시 delete).

> 참고: `useIncomingCall`(`src/lib/useIncomingCall.ts`)이 이 훅 위 래퍼의 실제 예시다.
> 기존 3개 export(`useIncomingCall`, `markIncomingCallHandled`, `clearIncomingCallHandled`)는
> 시그니처 그대로 유지돼 소비처(`IncomingCallOverlay.tsx`, `/admin`)는 변경되지 않았다.

---

## 4. 새 "관리자 트리거 연출" 추가 레시피 (🟢 고정 콘텐츠 기준)

payload 컬럼 없이 콘텐츠가 코드에 고정된 연출(전화·문자·경보)을 새로 만들 때 순서:

1. **`data.ts`** — 이벤트 상수 정의: `evidence_id`(예: `"_sms_1"`)와 `type`(예: `"sms"`), 필요한 콘텐츠 필드.
2. **훅** — `useBroadcastEvent(evidenceId, type)` 구독(또는 3장 미구현 시 `useIncomingCall` 복제).
3. **오버레이** — `src/components/XxxOverlay.tsx` 신규. `active`면 렌더, 사용자 제스처(탭/슬라이드)로
   오디오/애니메이션 재생 → 종료 시 `markHandled()`.
4. **`src/app/layout.tsx`** — 전역 오버레이로 마운트. **단, `/admin`·`/ending`·랜딩에선 미표시** (기존 규칙).
5. **`/admin`** — 발행/종료 버튼: `team_evidence_items`에 `(pair_id=__global, evidence_id, type)` upsert/delete.
6. **처리 기록** — 기기별 `localStorage`에 처리한 `created_at` 저장 → 다시 발행하면 새 이벤트로 재표시.

> 오디오 자동재생 차단·백그라운드 정지 때문에 **"전 기기 동시 재생"은 폐기**됐다(`11_..§1`).
> 각 기기가 **앱을 열고 제스처를 줄 때** 재생되는 게 정상 동작이다.

---

## 5. Codex 작업 시 주의

- **`progress.md` 먼저 읽기.** 이미 구현/기획된 항목(✅)을 다시 만들지 말 것.
- 새 기능 구현 시 **`progress.md`와, 운영자 편집 대상이면 `docs/01_md/EDIT_GUIDE.md`도 갱신** (CLAUDE.md 규칙).
- 콘텐츠 문구(문자 본문·음성 대본 등)는 **단서팀 자료**다. Codex는 자리채움으로 넣고 교체하도록 남길 것.
- 신규 DB 컬럼(payload 등)이 필요하면 **먼저 제안**하고 진행 — 스키마 변경은 되도록 피한다.
