# 16. 관리자 패널 정리 — 모든 단서 개방 제거, 사진 초기화로 전환, 타이머 제거 (Codex용 지시서)

작성일: 2026-07-14 / 상태: **구현 대기 (코드 미작성)**

이 문서는 Codex가 그대로 따라 구현하기 위한 지시서다. 원본 코드 스니펫과 교체본을 그대로 옮기면 된다. 임의 해석·기능 추가 금지.

---

## 0. 한 줄 요약

`/admin`에서 **"모든 단서 개방"(전체 공개+되돌리기) 기능을 완전히 삭제**하고, 그 자리의 "단서 전체 초기화" 버튼을 **"사진 전체 삭제"** 로 전환한다. 또한 **"조별 초기화"/"전체 조 초기화"도 해당 조의 사진을 함께 삭제**하도록 확장한다. **"제한 시간 타이머" 기능은 관리자 UI + 참가자 오버레이까지 통째로 제거**한다.

---

## 1. 확정된 결정사항 (사용자 승인 완료)

1. **"모든 단서 개방"(및 "이전 상태로 되돌리기") 기능 삭제.** 스냅샷 로직·상태·핸들러 전부 제거. (git 히스토리에 남으므로 복원 필요하면 거기서 꺼내 쓰면 된다 — 코드에 주석으로 남기지 않는다.)
2. **"사진 초기화" 범위 = 전체 삭제 + 조별 삭제 모두.**
   - 기존 "단서 전체 초기화" 버튼(확인 문구 `초기화` 입력 게이트 UX는 그대로 재사용) → **모든 조의 사진을 삭제**하는 "사진 전체 삭제"로 전환.
   - 기존 "조별 초기화"(개별 조 `초기화` 버튼)와 "전체 조 초기화" 버튼도 각각 **해당 조 / 전체 조의 사진을 함께 삭제**하도록 확장.
3. **"삭제"의 의미 = Storage 파일 + DB 행 둘 다 완전 삭제.** `photo_evidence` 테이블 행만 지우면 실제 이미지 파일이 Storage 버킷(`evidence-photos`)에 고아로 남으므로, 반드시 **Storage 파일도 함께 제거**한다(§4 참고).
4. **"제한 시간 타이머" 기능 완전 제거** — `/admin`의 카운트다운 타이머 카드, 참가자 화면 상단 배너(`TimerOverlay`), 관련 상수·경보음 함수까지 전부 삭제.

---

## 2. 변경 대상 파일

- `src/app/admin/page.tsx` (핵심, 아래 §3에 상세)
- `src/app/layout.tsx` (TimerOverlay 제거)
- `src/components/TimerOverlay.tsx` (파일 삭제)
- `src/lib/ringtone.ts` (`playAlarm`/`stopAlarm` 관련 블록 제거)
- `src/lib/data.ts` (`TIMER_EVENT_ID`/`TIMER_EVENT_TYPE` 제거)

---

## 3. `src/app/admin/page.tsx` 변경 (순서대로 적용)

### 3-1. import 정리

원본:
```ts
import { EVIDENCE, GLOBAL_PAIR_ID, INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE, photoTagLabel, TIMER_EVENT_ID, TIMER_EVENT_TYPE } from "@/lib/data";
import { clearIncomingCallHandled } from "@/lib/useIncomingCall";
import { useBroadcastEvent } from "@/lib/useBroadcastEvent";
```
교체:
```ts
import { GLOBAL_PAIR_ID, INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE, PHOTO_BUCKET, photoTagLabel } from "@/lib/data";
import { clearIncomingCallHandled } from "@/lib/useIncomingCall";
```
- `EVIDENCE`: 이 파일에서 더 이상 아무 데도 안 쓰므로 삭제.
- `TIMER_EVENT_ID`, `TIMER_EVENT_TYPE`, `useBroadcastEvent` import: 타이머 전용이었으므로 삭제(파일 전체에서 `useBroadcastEvent`는 타이머에만 쓰였다 — 다른 용도 없음, 확인됨).
- `PHOTO_BUCKET`: 사진 삭제 헬�1(§3-6)에서 Storage 접근에 필요해 새로 추가.

### 3-2. 스냅샷 인코딩 헬퍼 + 상수 삭제

원본(파일 상단, `PinGate` 함수 위):
```ts
const ADMIN_PASSWORD = "0000";
const OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE = "admin_open_all_snapshot";
const OPEN_ALL_EVIDENCE_SNAPSHOT_PREFIX = "_open_all_evidence_snapshot:";

interface TeamRow {
  pairId: string;
  count: number;
}

interface AdminPhotoRow {
  id: string;
  pair_id: string;
  image_url: string;
  caption: string | null;
  suspect_tag: string | null;
  status: string | null;
  created_at: string;
}

function encodeOpenAllEvidenceSnapshot(evidenceIds: string[]) {
  return `${OPEN_ALL_EVIDENCE_SNAPSHOT_PREFIX}${encodeURIComponent(JSON.stringify(evidenceIds))}`;
}

function decodeOpenAllEvidenceSnapshot(evidenceId: string) {
  if (!evidenceId.startsWith(OPEN_ALL_EVIDENCE_SNAPSHOT_PREFIX)) return null;

  try {
    const encoded = evidenceId.slice(OPEN_ALL_EVIDENCE_SNAPSHOT_PREFIX.length);
    const parsed = JSON.parse(decodeURIComponent(encoded));
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : null;
  } catch {
    return null;
  }
}
```
교체(스냅샷 상수·인코드·디코드 함수만 삭제, `ADMIN_PASSWORD`·`TeamRow`·`AdminPhotoRow`는 그대로 유지):
```ts
const ADMIN_PASSWORD = "0000";

interface TeamRow {
  pairId: string;
  count: number;
}

interface AdminPhotoRow {
  id: string;
  pair_id: string;
  image_url: string;
  caption: string | null;
  suspect_tag: string | null;
  status: string | null;
  created_at: string;
}
```

### 3-3. `AdminPanel` 상태 변수 정리

원본:
```ts
  const [openingAllEvidence, setOpeningAllEvidence] = useState(false);
  const [rollingBackAllEvidence, setRollingBackAllEvidence] = useState(false);
  const [resettingAllEvidence, setResettingAllEvidence] = useState(false);
  const [openAllEvidenceSnapshot, setOpenAllEvidenceSnapshot] = useState<string[] | null>(null);
  const [showResetEvidenceConfirm, setShowResetEvidenceConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [pairA, setPairA] = useState("");
  const [pairB, setPairB] = useState("");
  const [savingPair, setSavingPair] = useState(false);
  const timerEvent = useBroadcastEvent(TIMER_EVENT_ID, TIMER_EVENT_TYPE);
  const [timerMinutes, setTimerMinutes] = useState("15");
  const [togglingTimer, setTogglingTimer] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
```
교체:
```ts
  const [resettingAllPhotos, setResettingAllPhotos] = useState(false);
  const [showResetPhotosConfirm, setShowResetPhotosConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [pairA, setPairA] = useState("");
  const [pairB, setPairB] = useState("");
  const [savingPair, setSavingPair] = useState(false);
```
- `openingAllEvidence`/`rollingBackAllEvidence`/`openAllEvidenceSnapshot`: 삭제(모든 단서 개방 기능 자체가 없어짐).
- `resettingAllEvidence` → `resettingAllPhotos`로 **이름 변경**(의미가 "증거 초기화"에서 "사진 삭제"로 바뀜). 이 변수를 참조하는 모든 곳(§3-7, §3-9 JSX)도 새 이름으로 맞춰야 함.
- `showResetEvidenceConfirm` → `showResetPhotosConfirm`로 이름 변경. 마찬가지로 참조하는 곳 전부 갱신.
- `resetConfirmText`: 그대로 재사용(같은 "초기화" 입력 확인 UX).
- 타이머 관련 4개(`timerEvent`, `timerMinutes`, `togglingTimer`, `nowMs`) 전부 삭제.

### 3-4. 스냅샷 fetch + 구독 `useEffect` 통째로 삭제

원본(약 154~196번째 줄, `fetchOpenAllEvidenceSnapshot` 정의와 그걸 구독하는 `useEffect` 전체):
```ts
  const fetchOpenAllEvidenceSnapshot = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("evidence_id")
      .eq("pair_id", GLOBAL_PAIR_ID)
      .eq("type", OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE)
      .maybeSingle();

    setOpenAllEvidenceSnapshot(data ? decodeOpenAllEvidenceSnapshot(data.evidence_id as string) : null);
  }, []);

  useEffect(() => {
    fetchOpenAllEvidenceSnapshot();

    const channel = supabase
      .channel("admin_open_all_evidence_snapshot")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_evidence_items",
          filter: `pair_id=eq.${GLOBAL_PAIR_ID}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { type?: string };
            if (oldRow.type === OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE) setOpenAllEvidenceSnapshot(null);
            return;
          }

          const newRow = payload.new as { evidence_id?: string; type?: string };
          if (newRow.type === OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE && newRow.evidence_id) {
            setOpenAllEvidenceSnapshot(decodeOpenAllEvidenceSnapshot(newRow.evidence_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOpenAllEvidenceSnapshot]);
```
교체: **블록 전체 삭제.** (바로 아래 `pairings` fetch용 `useEffect`는 그대로 유지.)

### 3-5. 타이머 진행 `useEffect` + `startTimer`/`stopTimer` 통째로 삭제

원본(약 366~403번째 줄):
```ts
  // 타이머 진행 중에는 남은 시간을 매초 갱신
  useEffect(() => {
    if (!timerEvent.active) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timerEvent.active]);

  const timerEndsAt = timerEvent.eventId ? Date.parse(timerEvent.eventId) : null;
  const timerRemaining = timerEndsAt !== null ? Math.max(0, timerEndsAt - nowMs) : 0;
  const timerRunning = timerEvent.active && timerEndsAt !== null;

  async function startTimer() {
    const minutes = parseInt(timerMinutes, 10);
    if (!minutes || minutes <= 0) return;
    setTogglingTimer(true);
    const endsAt = new Date(Date.now() + minutes * 60_000).toISOString();
    await supabase.from("team_evidence_items").upsert(
      {
        pair_id: GLOBAL_PAIR_ID,
        evidence_id: TIMER_EVENT_ID,
        type: TIMER_EVENT_TYPE,
        created_at: endsAt,
      },
      { onConflict: "pair_id,evidence_id,type" }
    );
    setTogglingTimer(false);
  }

  async function stopTimer() {
    setTogglingTimer(true);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("pair_id", GLOBAL_PAIR_ID)
      .eq("evidence_id", TIMER_EVENT_ID)
      .eq("type", TIMER_EVENT_TYPE);
    setTogglingTimer(false);
  }
```
교체: **블록 전체 삭제.**

### 3-6. `openAllEvidence` / `rollbackOpenAllEvidence` 함수 삭제 + 사진 삭제 헬퍼로 교체

원본(약 460~527번째 줄, `openAllEvidence`·`rollbackOpenAllEvidence` 두 함수) → **전체 삭제**하고, 그 자리에 사진 삭제 헬퍼 2개를 새로 추가한다:

```ts
  // 조 하나의 사진을 Storage 파일까지 완전히 삭제한다.
  async function deleteTeamPhotos(pairId: string) {
    const { data: files } = await supabase.storage.from(PHOTO_BUCKET).list(pairId, { limit: 1000 });
    if (files && files.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(files.map((f) => `${pairId}/${f.name}`));
    }
    await supabase.from("photo_evidence").delete().eq("pair_id", pairId);
  }

  // 전체 조 사진을 Storage 파일까지 완전히 삭제한다.
  // 버킷 최상위 폴더 목록(=조 번호들)을 구해 조별 삭제를 반복 호출한다.
  async function deleteAllPhotos() {
    const { data: folders } = await supabase.storage.from(PHOTO_BUCKET).list("", { limit: 1000 });
    for (const folder of folders ?? []) {
      await deleteTeamPhotos(folder.name);
    }
    // 안전망: 위 폴더 목록에 잡히지 않는 행이 남아 있을 경우를 대비해 테이블도 전체 정리
    await supabase.from("photo_evidence").delete().neq("pair_id", "");
  }
```

### 3-7. `resetAllEvidenceItems` → `resetAllPhotos`로 교체

원본:
```ts
  async function resetAllEvidenceItems() {
    if (resetConfirmText.trim() !== "초기화") return;
    setResettingAllEvidence(true);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("type", "collected")
      .in("evidence_id", EVIDENCE.map((e) => e.id));
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("pair_id", GLOBAL_PAIR_ID)
      .eq("type", OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE);
    setOpenAllEvidenceSnapshot(null);
    setShowResetEvidenceConfirm(false);
    setResetConfirmText("");
    resetAll();
    await fetchTeams();
    setResettingAllEvidence(false);
  }
```
교체:
```ts
  async function resetAllPhotos() {
    if (resetConfirmText.trim() !== "초기화") return;
    setResettingAllPhotos(true);
    await deleteAllPhotos();
    setShowResetPhotosConfirm(false);
    setResetConfirmText("");
    await fetchPhotos();
    setResettingAllPhotos(false);
  }
```
> 주의: 기존 함수는 끝에 `resetAll()`(현재 기기의 localStorage — 투표/조 정보/메모 등)을 호출했지만, 이건 "이 기기 자체를 초기화"하는 것과 "전체 조 사진 삭제"는 별개 동작이라 **의도치 않은 부작용**이었다. 새 함수에서는 `resetAll()` 호출을 넣지 않는다. (기기 자체 초기화가 필요하면 조별 초기화에서 자기 조를 누르면 된다 — 아래 §3-8 참고.)

### 3-8. `handleReset` / `handleResetAll`에 사진 삭제 추가

원본:
```ts
  async function handleReset(pairId: string) {
    setLoadingId(pairId);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("pair_id", pairId);
    if (pairId === myPairId) resetAll();
    await fetchTeams();
    setLoadingId(null);
  }

  async function handleResetAll() {
    setLoadingId("ALL");
    await supabase.from("team_evidence_items").delete().neq("pair_id", "");
    resetAll();
    await fetchTeams();
    setLoadingId(null);
  }
```
교체:
```ts
  async function handleReset(pairId: string) {
    setLoadingId(pairId);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("pair_id", pairId);
    await deleteTeamPhotos(pairId);
    if (pairId === myPairId) resetAll();
    await fetchTeams();
    await fetchPhotos();
    setLoadingId(null);
  }

  async function handleResetAll() {
    setLoadingId("ALL");
    await supabase.from("team_evidence_items").delete().neq("pair_id", "");
    await deleteAllPhotos();
    resetAll();
    await fetchTeams();
    await fetchPhotos();
    setLoadingId(null);
  }
```

### 3-9. JSX — "Countdown timer" 카드 삭제

원본(약 731~790번째 줄, `{/* Countdown timer */}`로 시작하는 `<div>` 전체) → **블록 전체 삭제.**

### 3-10. JSX — "Evidence unlock"(모든 단서 개방) 카드 → "사진 전체 삭제" 카드로 교체

원본(약 792~865번째 줄, `{/* Evidence unlock */}`로 시작하는 `<div>` 전체):
```tsx
            {/* Evidence unlock */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-zinc-200">모든 단서 개방</p>
                <p className="text-xs text-zinc-500">
                  전체 참가자에게 증거함의 모든 단서를 즉시 공개합니다.
                </p>
                {openAllEvidenceSnapshot && (
                  <p className="text-xs text-amber-400/80">
                    직전 개방 전 상태가 저장되어 있습니다.
                  </p>
                )}
              </div>
              <button
                onClick={openAllEvidence}
                disabled={openingAllEvidence || rollingBackAllEvidence || resettingAllEvidence}
                className="w-full rounded bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {openingAllEvidence ? "개방 중..." : "모든 단서 개방"}
              </button>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={rollbackOpenAllEvidence}
                  disabled={!openAllEvidenceSnapshot || openingAllEvidence || rollingBackAllEvidence || resettingAllEvidence}
                  className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {rollingBackAllEvidence ? "되돌리는 중..." : "이전 상태로 되돌리기"}
                </button>
                <button
                  onClick={() => {
                    setShowResetEvidenceConfirm(true);
                    setResetConfirmText("");
                  }}
                  disabled={openingAllEvidence || rollingBackAllEvidence || resettingAllEvidence}
                  className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {resettingAllEvidence ? "초기화 중..." : "단서 전체 초기화"}
                </button>
              </div>
              {showResetEvidenceConfirm && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                  <p className="text-xs leading-relaxed text-red-200/80">
                    모든 조의 수집 단서와 전역 공개 단서를 삭제합니다. 실행하려면 아래에 초기화를 입력하세요.
                  </p>
                  <input
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="초기화 입력"
                    disabled={openingAllEvidence || rollingBackAllEvidence || resettingAllEvidence}
                    className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-400 focus:outline-none disabled:opacity-40"
                  />
                  <button
                    onClick={resetAllEvidenceItems}
                    disabled={resetConfirmText.trim() !== "초기화" || openingAllEvidence || rollingBackAllEvidence || resettingAllEvidence}
                    className="w-full rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {resettingAllEvidence ? "초기화 중..." : "초기화 확정"}
                  </button>
                  <button
                    onClick={() => {
                      setShowResetEvidenceConfirm(false);
                      setResetConfirmText("");
                    }}
                    disabled={resettingAllEvidence}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    취소
                  </button>
                </div>
              )}
              <p className="text-[11px] leading-relaxed text-zinc-600">
                되돌리기는 마지막 전체 개방으로 추가된 전역 공개 단서만 제거합니다. 전체 초기화는 모든 조의 수집 단서와 전역 공개 단서를 삭제합니다.
              </p>
            </div>
```
교체:
```tsx
            {/* Photo reset */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-zinc-200">사진 전체 삭제</p>
                <p className="text-xs text-zinc-500">
                  모든 조가 촬영한 사진 증거를 Storage 파일까지 완전히 삭제합니다. 되돌릴 수 없습니다.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowResetPhotosConfirm(true);
                  setResetConfirmText("");
                }}
                disabled={resettingAllPhotos}
                className="w-full rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {resettingAllPhotos ? "삭제 중..." : "사진 전체 삭제"}
              </button>
              {showResetPhotosConfirm && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                  <p className="text-xs leading-relaxed text-red-200/80">
                    모든 조의 사진(Storage 파일 포함)을 영구 삭제합니다. 실행하려면 아래에 초기화를 입력하세요.
                  </p>
                  <input
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="초기화 입력"
                    disabled={resettingAllPhotos}
                    className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-400 focus:outline-none disabled:opacity-40"
                  />
                  <button
                    onClick={resetAllPhotos}
                    disabled={resetConfirmText.trim() !== "초기화" || resettingAllPhotos}
                    className="w-full rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {resettingAllPhotos ? "삭제 중..." : "삭제 확정"}
                  </button>
                  <button
                    onClick={() => {
                      setShowResetPhotosConfirm(false);
                      setResetConfirmText("");
                    }}
                    disabled={resettingAllPhotos}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
```

### 3-11. JSX — "조별 초기화" 섹션 설명 문구 갱신

원본:
```tsx
        <p className="text-xs text-zinc-600">
          Supabase 증거 수집 기록을 조별로 삭제합니다.
          내 기기 조와 일치하면 투표 기록도 함께 삭제됩니다.
        </p>
```
교체:
```tsx
        <p className="text-xs text-zinc-600">
          Supabase 증거 수집 기록과 촬영한 사진을 조별로 삭제합니다.
          내 기기 조와 일치하면 투표 기록도 함께 삭제됩니다.
        </p>
```
버튼 라벨("초기화"/"전체 조 초기화")과 나머지 JSX 구조는 변경 없음 — 동작만 §3-8에서 사진 삭제가 추가됨.

---

## 4. Storage 삭제 방식에 대한 설명 (왜 이렇게 하는지)

- 사진 업로드 시 저장 경로는 `${조번호}/${uuid}.jpg` 형태다(`src/lib/usePhotoEvidence.ts`의 `uploadPhoto` 참고). 즉 **조 번호가 Storage 상의 폴더명**이다.
- `supabase.storage.from(bucket).list(pairId)` 를 호출하면 그 "폴더" 밑의 파일 목록(파일명)을 받을 수 있고, `remove([...])` 로 한 번에 지울 수 있다. `photo_evidence.image_url`(공개 URL)을 문자열 파싱해서 경로를 역산하는 것보다 훨씬 안전하다.
- 전체 삭제(`deleteAllPhotos`)는 버킷 루트(`list("")`)에서 "폴더"(=조 번호) 목록을 얻어 조별 삭제를 반복 호출한다. 조 수가 적어(8개 안팎) `{ limit: 1000 }` 이면 페이지네이션 걱정 없이 한 번에 다 가져온다.
- **DB 행 삭제만으로는 Storage 파일이 안 지워진다** — 반드시 `storage.remove()`를 먼저(또는 함께) 호출해야 한다. 이 지시서의 모든 삭제 함수는 이미 두 단계를 다 포함하고 있으니 순서를 바꾸거나 한쪽만 남기지 말 것.

---

## 5. `src/app/layout.tsx` 변경

원본:
```tsx
import BottomNav from "@/components/BottomNav";
import GameStateRedirect from "@/components/GameStateRedirect";
import TeamEvidenceToast from "@/components/TeamEvidenceToast";
import IncomingCallOverlay from "@/components/IncomingCallOverlay";
import TimerOverlay from "@/components/TimerOverlay";
```
```tsx
        <GameStateRedirect />
        <TeamEvidenceToast />
        <IncomingCallOverlay />
        <TimerOverlay />
```
교체(두 곳 모두 `TimerOverlay` 관련 줄만 삭제):
```tsx
import BottomNav from "@/components/BottomNav";
import GameStateRedirect from "@/components/GameStateRedirect";
import TeamEvidenceToast from "@/components/TeamEvidenceToast";
import IncomingCallOverlay from "@/components/IncomingCallOverlay";
```
```tsx
        <GameStateRedirect />
        <TeamEvidenceToast />
        <IncomingCallOverlay />
```

---

## 6. `src/components/TimerOverlay.tsx` — 파일 삭제

이 컴포넌트는 `layout.tsx`에서만 쓰인다(§5에서 참조 제거됨). 파일 자체를 삭제한다.

---

## 7. `src/lib/ringtone.ts` — 타이머 경보음 블록 삭제

`playAlarm`/`stopAlarm`은 타이머 전용이다(수신전화 벨소리 `startRingtone`/`stopRingtone`과는 별개 함수라 그쪽은 손대지 않는다). 아래 블록(파일 102번째 줄 `// 카운트다운 종료 경보...` 주석부터 파일 끝까지, `alarmTimer`·`scheduleBeep`·`playAlarm`·`stopAlarm` 전부)을 삭제한다:

```ts
// 카운트다운 종료 경보 — "삐빅삐빅" 3연타를 약 4회 반복(약 4초) 후 자동 정지 + 진동.
// 수신 화면과 마찬가지로 armAudioUnlock으로 깨워둔 AudioContext를 사용한다.
let alarmTimer: ReturnType<typeof setInterval> | null = null;

function scheduleBeep(c: AudioContext, freq: number, when: number, dur: number) {
  ...
}

export function playAlarm() {
  ...
}

export function stopAlarm() {
  ...
}
```
파일 상단의 `armAudioUnlock`, `startRingtone`, `stopRingtone`, `scheduleRing` 등 수신전화용 함수는 **그대로 유지**한다.

---

## 8. `src/lib/data.ts` — 타이머 상수 삭제

원본:
```ts
// 제한 시간 타이머. 전역 마커 1행(pair_id=__global)의 created_at에 "종료 시각(ISO)"이 들어간다.
// 모든 기기가 같은 종료 시각을 읽어 remaining = endsAt - now 로 동일하게 카운트다운한다.
export const TIMER_EVENT_ID = "_timer";
export const TIMER_EVENT_TYPE = "timer";
```
교체: **이 4줄(주석 포함) 전체 삭제.** 다른 파일에서 더 이상 참조하지 않는다(§1 grep으로 확인됨).

---

## 9. 확인해야 할 것 (Codex가 직접 grep해서 재확인)

작업 후 아래 식별자가 프로젝트 어디에도 남아있지 않아야 한다(주석 등 텍스트 언급 제외, 실제 코드 참조 기준):
`openAllEvidence`, `rollbackOpenAllEvidence`, `openAllEvidenceSnapshot`, `openingAllEvidence`, `rollingBackAllEvidence`, `OPEN_ALL_EVIDENCE_SNAPSHOT_TYPE`, `OPEN_ALL_EVIDENCE_SNAPSHOT_PREFIX`, `encodeOpenAllEvidenceSnapshot`, `decodeOpenAllEvidenceSnapshot`, `resetAllEvidenceItems`, `showResetEvidenceConfirm`, `resettingAllEvidence`(→`resettingAllPhotos`로 이름 변경 완료됐는지), `TIMER_EVENT_ID`, `TIMER_EVENT_TYPE`, `TimerOverlay`, `playAlarm`, `stopAlarm`, `startTimer`, `stopTimer`, `timerEvent`, `timerMinutes`, `togglingTimer`, `nowMs`, `timerEndsAt`, `timerRemaining`, `timerRunning`.

---

## 10. 수용 기준

- [ ] `/admin`에 "모든 단서 개방"/"이전 상태로 되돌리기" 버튼이 없음.
- [ ] `/admin`에 "제한 시간 타이머" 카드가 없고, 참가자 화면 상단에도 타이머 배너가 뜨지 않음.
- [ ] `/admin`의 "사진 전체 삭제" 버튼 → `초기화` 입력 → 확정 시 **모든 조의 사진이 Supabase Storage(`evidence-photos` 버킷)와 `photo_evidence` 테이블에서 함께 사라짐**. 참가자 폴라로이드 보드에서도 실시간으로 비워짐.
- [ ] "조별 초기화"의 개별 `초기화`, "전체 조 초기화" 버튼도 해당 조(들)의 사진을 Storage까지 함께 삭제함.
- [ ] `npm run lint`, `npm run build` 통과 (미사용 import/변수 없음).

---

## 11. 작업 후 문서 업데이트 지시

- `progress.md` "작업완료"에 변경 내역 기록.
- `docs/01_md/EDIT_GUIDE.md`에서 "모든 단서 개방"/"제한 시간 타이머" 관련 안내 절이 있다면 제거하거나 "폐기됨" 표시. "사진 초기화" 사용법(운영자가 행사 중 조를 재사용할 때 조별 초기화를 누르면 사진도 함께 지워진다는 점) 안내 추가.
