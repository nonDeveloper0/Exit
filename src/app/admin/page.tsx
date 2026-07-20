"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { resetAll, getTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useGameState } from "@/lib/useGameState";
import { CALL_RESET_EVENT_ID, CALL_RESET_EVENT_TYPE, GLOBAL_PAIR_ID, INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE, PHOTO_BUCKET, photoLocationTagLabel } from "@/lib/data";
import { clearIncomingCallHandled } from "@/lib/useIncomingCall";
import { getPairTeamKey } from "@/lib/pairTeam";
import { STAFF_LEADER_NAMES } from "@/lib/staffRole";

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
  location_tag: string | null;
  status: string | null;
  created_at: string;
}

type LeaderSettings = Record<string, string | string[]>;

function getAdditionalStaffNames(settings: LeaderSettings): string[] {
  const value = settings.__staff__;
  return Array.isArray(value) ? value.filter((name): name is string => typeof name === "string") : [];
}

function ToggleSection({ title, description, children, defaultOpen = false }: { title: string; description?: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group rounded-lg border border-zinc-800 bg-zinc-950/50" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 marker:content-none">
        <span><span className="block text-sm font-bold text-zinc-200">{title}</span>{description && <span className="mt-0.5 block text-xs text-zinc-600">{description}</span>}</span>
        <span className="rounded border border-zinc-700 px-2 py-1 text-xs font-bold text-zinc-400 group-open:hidden">열기</span>
        <span className="hidden rounded border border-zinc-700 px-2 py-1 text-xs font-bold text-zinc-400 group-open:inline">접기</span>
      </summary>
      <div className="border-t border-zinc-800 p-4">{children}</div>
    </details>
  );
}

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setPin(digits);
    setError(false);
    if (digits.length === 4) {
      if (digits === ADMIN_PASSWORD) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => setPin(""), 600);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-4">
      <div className="space-y-1 text-center">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase">Admin</div>
        <h1 className="text-2xl font-bold text-zinc-100">관리자 인증</h1>
        <p className="text-sm text-zinc-500">4자리 PIN을 입력하세요</p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              error
                ? "border-red-500 bg-red-500"
                : pin.length > i
                ? "border-amber-400 bg-amber-400"
                : "border-zinc-600 bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoFocus
        value={pin}
        onChange={(e) => handleChange(e.target.value)}
        className="opacity-0 absolute w-0 h-0"
        aria-label="PIN 입력"
      />

      {/* Tap to focus trigger */}
      <button
        onClick={() => inputRef.current?.focus()}
        className="text-xs text-zinc-600 border border-zinc-800 rounded px-4 py-2"
      >
        숫자 키패드 열기
      </button>

      {error && (
        <p className="text-sm text-red-400">PIN이 올바르지 않습니다</p>
      )}
    </div>
  );
}

function AdminPanel() {
  const { voteOpen, ending_open, loaded } = useGameState();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [photos, setPhotos] = useState<AdminPhotoRow[]>([]);
  const [photoFilter, setPhotoFilter] = useState("");
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photoUpdatingId, setPhotoUpdatingId] = useState<string | null>(null);
  const [photoLightbox, setPhotoLightbox] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [myPairId, setMyPairId] = useState<string | null>(null);
  const [settingVoteRound, setSettingVoteRound] = useState(false);
  const [togglingEnding, setTogglingEnding] = useState(false);
  const [incomingCallActive, setIncomingCallActive] = useState(false);
  const [showIncomingCallConfirm, setShowIncomingCallConfirm] = useState(false);
  const [togglingIncomingCall, setTogglingIncomingCall] = useState(false);
  const [resettingCall, setResettingCall] = useState(false);
  const [resettingAllPhotos, setResettingAllPhotos] = useState(false);
  const [showResetPhotosConfirm, setShowResetPhotosConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [pairTeamNames, setPairTeamNames] = useState<Record<string, string>>({});
  const [pairA, setPairA] = useState("");
  const [pairB, setPairB] = useState("");
  const [pairTeamName, setPairTeamName] = useState("");
  const [savingPair, setSavingPair] = useState(false);
  const [leaders, setLeaders] = useState<LeaderSettings>({});
  const [leaderTeam, setLeaderTeam] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [resettingInterrogationUses, setResettingInterrogationUses] = useState(false);
  const [resettingInterrogationEarned, setResettingInterrogationEarned] = useState(false);
  const [resettingVotes, setResettingVotes] = useState(false);
  const [pendingProgressReset, setPendingProgressReset] = useState<"interrogation" | "interrogation_earned" | "vote" | null>(null);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);

  useEffect(() => {
    const team = getTeamInfo();
    if (team) setMyPairId(team.teamNumber);
  }, []);

  useEffect(() => {
    supabase
      .from("game_state")
      .select("pairings, pair_team_names, leaders")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        if (data?.pairings) setPairings(data.pairings as Record<string, string>);
        if (data?.pair_team_names) setPairTeamNames(data.pair_team_names as Record<string, string>);
        if (data?.leaders) setLeaders(data.leaders as LeaderSettings);
      });
  }, []);

  useEffect(() => {
    supabase
      .from("team_evidence_items")
      .select("created_at")
      .eq("evidence_id", INCOMING_CALL_EVENT_ID)
      .eq("type", INCOMING_CALL_EVENT_TYPE)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setIncomingCallActive(!!data);
      });

    const channel = supabase
      .channel("admin_incoming_call")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_evidence_items",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { evidence_id?: string; type?: string };
            if (oldRow.evidence_id === INCOMING_CALL_EVENT_ID && oldRow.type === INCOMING_CALL_EVENT_TYPE) {
              setIncomingCallActive(false);
            }
            return;
          }

          const newRow = payload.new as { evidence_id?: string; type?: string };
          if (newRow.evidence_id === INCOMING_CALL_EVENT_ID && newRow.type === INCOMING_CALL_EVENT_TYPE) {
            setIncomingCallActive(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTeams = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("pair_id, evidence_id")
      .eq("type", "collected");

    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((r) => {
        if (r.pair_id === GLOBAL_PAIR_ID) return; // 공통 단서 저장소는 조 목록에서 제외
        counts[r.pair_id] = (counts[r.pair_id] || 0) + 1;
      });
      setTeams(
        Object.entries(counts)
          .map(([pairId, count]) => ({ pairId, count }))
          .sort((a, b) => parseInt(a.pairId) - parseInt(b.pairId))
      );
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const fetchPhotos = useCallback(async () => {
    setPhotosLoading(true);
    const { data } = await supabase
      .from("photo_evidence")
      .select("id, pair_id, image_url, caption, suspect_tag, location_tag, status, created_at")
      .order("created_at", { ascending: false });
    if (data) setPhotos(data as AdminPhotoRow[]);
    setPhotosLoading(false);
  }, []);

  useEffect(() => {
    void fetchPhotos();
    const channel = supabase
      .channel("admin_photo_evidence")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photo_evidence" },
        (payload) => {
          const photo = payload.new as AdminPhotoRow;
          setPhotos((prev) => (prev.some((item) => item.id === photo.id) ? prev : [photo, ...prev]));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "photo_evidence" },
        (payload) => {
          const photo = payload.new as AdminPhotoRow;
          setPhotos((prev) => prev.map((item) => (item.id === photo.id ? photo : item)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photo_evidence" },
        (payload) => {
          const id = (payload.old as { id?: string }).id;
          if (id) setPhotos((prev) => prev.filter((photo) => photo.id !== id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPhotos]);

  async function setPhotoStatus(id: string, status: "ok" | "rejected") {
    setPhotoUpdatingId(id);
    const { error } = await supabase.from("photo_evidence").update({ status }).eq("id", id);
    if (!error) {
      setPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, status } : photo)));
    }
    setPhotoUpdatingId(null);
  }

  // 중복 없는 쌍 목록 (1↔3, 3↔1 중 하나만)
  const currentPairs: [string, string][] = [];
  const seen = new Set<string>();
  for (const [a, b] of Object.entries(pairings)) {
    const key = [a, b].sort().join("-");
    if (!seen.has(key)) {
      seen.add(key);
      currentPairs.push([a, b]);
    }
  }

  async function addPairing() {
    const a = pairA.trim();
    const b = pairB.trim();
    const teamName = pairTeamName.trim();
    if (!a || !b || !teamName || a === b) return;
    setSavingPair(true);
    const newPairings = { ...pairings, [a]: b, [b]: a };
    const newPairTeamNames = { ...pairTeamNames, [getPairTeamKey(a, b)]: teamName };
    await supabase.from("game_state").update({ pairings: newPairings, pair_team_names: newPairTeamNames }).eq("id", "singleton");
    setPairings(newPairings);
    setPairTeamNames(newPairTeamNames);
    setPairA("");
    setPairB("");
    setPairTeamName("");
    setSavingPair(false);
  }

  async function removePairing(a: string, b: string) {
    const newPairings = { ...pairings };
    delete newPairings[a];
    delete newPairings[b];
    const newPairTeamNames = { ...pairTeamNames };
    delete newPairTeamNames[getPairTeamKey(a, b)];
    await supabase.from("game_state").update({ pairings: newPairings, pair_team_names: newPairTeamNames }).eq("id", "singleton");
    setPairings(newPairings);
    setPairTeamNames(newPairTeamNames);
  }

  async function setLeader() {
    const team = leaderTeam.trim(); const name = leaderName.trim();
    if (!team || !name) return;
    const next = { ...leaders, [team]: name };
    await supabase.from("game_state").update({ leaders: next }).eq("id", "singleton");
    setLeaders(next); setLeaderTeam(""); setLeaderName("");
  }

  async function removeLeader(team: string) {
    const next = { ...leaders }; delete next[team];
    await supabase.from("game_state").update({ leaders: next }).eq("id", "singleton");
    setLeaders(next);
  }

  async function addStaffName() {
    const name = staffName.trim();
    if (!name) return;
    const currentStaff = getAdditionalStaffNames(leaders);
    if (STAFF_LEADER_NAMES.includes(name as typeof STAFF_LEADER_NAMES[number]) || currentStaff.includes(name)) {
      setStaffName("");
      return;
    }
    const next = { ...leaders, __staff__: [...currentStaff, name] };
    await supabase.from("game_state").update({ leaders: next }).eq("id", "singleton");
    setLeaders(next);
    setStaffName("");
  }

  async function removeStaffName(name: string) {
    const next = { ...leaders, __staff__: getAdditionalStaffNames(leaders).filter((staffName) => staffName !== name) };
    await supabase.from("game_state").update({ leaders: next }).eq("id", "singleton");
    setLeaders(next);
  }

  async function setVoteOpen(open: boolean) {
    setSettingVoteRound(true);
    await supabase
      .from("game_state")
      .update({ vote_round: open ? 2 : 0 })
      .eq("id", "singleton");
    setSettingVoteRound(false);
  }

  async function resetInterrogationUses() {
    setResettingInterrogationUses(true);
    try {
      await supabase.from("team_evidence_items").delete().eq("type", "interrogation_used");
    } finally {
      setResettingInterrogationUses(false);
    }
  }

  // 심문권 획득 기록을 삭제한다. 획득이 사라지면 사용 기록도 의미가 없으므로 함께 지운다.
  async function resetInterrogationEarned() {
    setResettingInterrogationEarned(true);
    try {
      await supabase.from("team_evidence_items").delete().in("type", ["interrogation_earned", "interrogation_used"]);
    } finally {
      setResettingInterrogationEarned(false);
    }
  }

  async function resetFinalVotes() {
    setResettingVotes(true);
    try {
      await supabase.from("final_votes").delete().neq("pair_id", "");
    } finally {
      setResettingVotes(false);
    }
  }

  function confirmProgressReset() {
    if (pendingProgressReset === "interrogation") void resetInterrogationUses();
    if (pendingProgressReset === "interrogation_earned") void resetInterrogationEarned();
    if (pendingProgressReset === "vote") void resetFinalVotes();
    setPendingProgressReset(null);
  }

  async function toggleEnding() {
    setTogglingEnding(true);
    await supabase
      .from("game_state")
      .update({ ending_open: !ending_open })
      .eq("id", "singleton");
    setTogglingEnding(false);
  }

  async function endIncomingCall() {
    setTogglingIncomingCall(true);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("evidence_id", INCOMING_CALL_EVENT_ID)
      .eq("type", INCOMING_CALL_EVENT_TYPE);
    setIncomingCallActive(false);
    setTogglingIncomingCall(false);
  }

  async function startIncomingCall() {
    setTogglingIncomingCall(true);
    const createdAt = new Date().toISOString();
    clearIncomingCallHandled();
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("evidence_id", INCOMING_CALL_EVENT_ID)
      .eq("type", INCOMING_CALL_EVENT_TYPE);
    await supabase.from("team_evidence_items").insert({
      pair_id: GLOBAL_PAIR_ID,
      evidence_id: INCOMING_CALL_EVENT_ID,
      type: INCOMING_CALL_EVENT_TYPE,
      created_at: createdAt,
    });
    setIncomingCallActive(true);
    setShowIncomingCallConfirm(false);
    setTogglingIncomingCall(false);
  }

  // 수신전화 마커를 지우고, /phone 기기에 통화 재생 상태 초기화 신호를 브로드캐스트한다.
  async function resetCallDramatization() {
    setResettingCall(true);
    try {
      await supabase
        .from("team_evidence_items")
        .delete()
        .eq("evidence_id", INCOMING_CALL_EVENT_ID)
        .eq("type", INCOMING_CALL_EVENT_TYPE);
      await supabase
        .from("team_evidence_items")
        .delete()
        .eq("pair_id", GLOBAL_PAIR_ID)
        .eq("evidence_id", CALL_RESET_EVENT_ID)
        .eq("type", CALL_RESET_EVENT_TYPE);
      await supabase.from("team_evidence_items").insert({
        pair_id: GLOBAL_PAIR_ID,
        evidence_id: CALL_RESET_EVENT_ID,
        type: CALL_RESET_EVENT_TYPE,
        created_at: new Date().toISOString(),
      });
      setIncomingCallActive(false);
    } finally {
      setResettingCall(false);
    }
  }

  async function deleteTeamPhotos(pairId: string) {
    const { data: files } = await supabase.storage.from(PHOTO_BUCKET).list(pairId, { limit: 1000 });
    if (files && files.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(files.map((file) => `${pairId}/${file.name}`));
    }
    await supabase.from("photo_evidence").delete().eq("pair_id", pairId);
  }

  async function deleteAllPhotos() {
    const { data: folders } = await supabase.storage.from(PHOTO_BUCKET).list("", { limit: 1000 });
    for (const folder of folders ?? []) {
      await deleteTeamPhotos(folder.name);
    }
    await supabase.from("photo_evidence").delete().neq("pair_id", "");
  }

  function formatError(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (err && typeof err === "object") {
      const e = err as { message?: string; details?: string; hint?: string; code?: string };
      return [e.message, e.details, e.hint, e.code ? `(${e.code})` : ""].filter(Boolean).join(" ") || JSON.stringify(err);
    }
    return String(err);
  }

  async function resetAllPhotoNumberCounters() {
    const { error } = await supabase.rpc("reset_photo_evidence_number_counters");
    if (error) throw error;
  }

  async function resetAllPhotos() {
    if (resetConfirmText.trim() !== "초기화") return;
    setResettingAllPhotos(true);
    try {
      await deleteAllPhotos();
      await resetAllPhotoNumberCounters();
      setShowResetPhotosConfirm(false);
      setResetConfirmText("");
      await fetchPhotos();
    } catch (err) {
      alert(`사진 삭제/번호 초기화 실패: ${formatError(err)}`);
    } finally {
      setResettingAllPhotos(false);
    }
  }

  async function handleReset(pairId: string) {
    setLoadingId(pairId);
    await supabase
      .from("team_evidence_items")
      .delete()
      .eq("pair_id", pairId);
    await deleteTeamPhotos(pairId);
    await supabase.from("suspect_notes").delete().eq("pair_id", pairId);
    if (pairId === myPairId) resetAll();
    await fetchTeams();
    await fetchPhotos();
    setLoadingId(null);
  }

  async function handleResetAll() {
    setShowResetAllConfirm(false);
    setLoadingId("ALL");
    try {
      await supabase.from("team_evidence_items").delete().neq("pair_id", "");
      await deleteAllPhotos();
      await supabase.from("suspect_notes").delete().neq("pair_id", "");
      await supabase.from("final_votes").delete().neq("pair_id", "");
      await resetAllPhotoNumberCounters();
      resetAll();
      await fetchTeams();
      await fetchPhotos();
    } catch (err) {
      alert(`전체 조 초기화 실패: ${formatError(err)}`);
    } finally {
      setLoadingId(null);
    }
  }

  const photoTeamIds = Array.from(new Set(photos.map((photo) => photo.pair_id))).sort((a, b) =>
    a.localeCompare(b, "ko", { numeric: true })
  );
  const filteredPhotos = photoFilter ? photos.filter((photo) => photo.pair_id === photoFilter) : photos;

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase">Admin</div>
        <h1 className="text-2xl font-bold text-zinc-100">관리자</h1>
      </div>

      {/* Game controls */}
      <div className="space-y-3">
        <ToggleSection title="게임 진행" description="최종 투표, 엔딩, 수신전화 연출" defaultOpen>

        {!loaded ? (
          <p className="text-sm text-zinc-600 py-2">상태 불러오는 중...</p>
        ) : (
          <>
            {/* Final vote control */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-zinc-200">최종 투표</p>
                  <p className={`text-xs font-mono ${voteOpen ? "text-amber-400" : "text-zinc-500"}`}>
                    {voteOpen ? "● 진행 중" : "○ 닫힘"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setVoteOpen(true)}
                  disabled={settingVoteRound || voteOpen}
                  className="flex-1 rounded px-3 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-400 text-zinc-900 hover:bg-amber-300"
                >
                  {settingVoteRound ? "..." : "최종 투표 열기"}
                </button>
                <button
                  onClick={() => setVoteOpen(false)}
                  disabled={settingVoteRound || !voteOpen}
                  className="flex-1 rounded px-3 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  {settingVoteRound ? "..." : "닫기"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => void resetCallDramatization()}
                disabled={togglingIncomingCall || resettingCall}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {resettingCall ? "초기화 중..." : "전화 연출 초기화"}
              </button>
              <p className="text-[10px] leading-relaxed text-zinc-600">전화를 받은 뒤 공기계에 남는 통화 재생 상태를 지우고 대기 화면으로 되돌립니다.</p>
            </div>

            {/* Ending toggle */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-zinc-200">엔딩 공개</p>
                <p className={`text-xs font-mono ${ending_open ? "text-amber-400" : "text-zinc-500"}`}>
                  {ending_open ? "● 공개 중" : "○ 대기 중"}
                </p>
              </div>
              <button
                onClick={toggleEnding}
                disabled={togglingEnding}
                className={`rounded px-5 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  ending_open
                    ? "border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                }`}
              >
                {togglingEnding ? "..." : ending_open ? "엔딩 숨기기" : "엔딩 공개"}
              </button>
            </div>

            {ending_open && (
              <p className="text-xs text-amber-500/70 px-1">
                엔딩이 공개 중입니다 — 모든 참가자 기기가 자동으로 엔딩 화면으로 이동합니다.
              </p>
            )}

            {/* Incoming call */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-zinc-200">수신전화 연출</p>
                  <p className={`text-xs font-mono ${incomingCallActive ? "text-red-400" : "text-zinc-500"}`}>
                    {incomingCallActive ? "● 전화 거는 중" : "○ 대기 중"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    incomingCallActive ? void endIncomingCall() : setShowIncomingCallConfirm(true)
                  }
                  disabled={togglingIncomingCall || resettingCall}
                  className={`rounded px-5 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    incomingCallActive
                      ? "border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-red-500 text-white hover:bg-red-400"
                  }`}
                >
                  {togglingIncomingCall ? "..." : incomingCallActive ? "전화 종료" : "전화 걸기"}
                </button>
              </div>
            </div>

            {incomingCallActive && (
              <p className="text-xs text-red-300/70 px-1">
                공기계에 수신전화 화면이 표시됩니다. (연출 전용 — 증거는 수집되지 않습니다.)
              </p>
            )}
            {showIncomingCallConfirm && (
              <div
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="incoming-call-dialog-title"
              >
                <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-5 shadow-2xl">
                  <h3 id="incoming-call-dialog-title" className="text-lg font-bold text-zinc-100">
                    전화 걸기
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    나팀장 개인폰(공기계)에 수신전화 화면을 띄웁니다. 진행할까요?
                  </p>
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowIncomingCallConfirm(false)}
                      disabled={togglingIncomingCall}
                      className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-bold text-zinc-300 disabled:opacity-40"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => void startIncomingCall()}
                      disabled={togglingIncomingCall}
                      className="flex-1 rounded bg-red-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
                    >
                      {togglingIncomingCall ? "전화 거는 중..." : "확인"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </ToggleSection>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      <ToggleSection title="사진 점검" description="조별 사진 확인 및 랭킹 제외 처리">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">사진 점검</h2>
          <select
            value={photoFilter}
            onChange={(event) => setPhotoFilter(event.target.value)}
            className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none"
            aria-label="사진 조 필터"
          >
            <option value="">전체 조</option>
            {photoTeamIds.map((teamId) => (
              <option key={teamId} value={teamId}>{teamId}조</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-zinc-600">제외한 사진은 보존되며 랭킹에서만 빠집니다.</p>

        {photosLoading ? (
          <p className="py-4 text-center text-sm text-zinc-600">사진 불러오는 중...</p>
        ) : filteredPhotos.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-600">표시할 사진이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {filteredPhotos.map((photo) => {
              const rejected = photo.status === "rejected";
              const locationLabel = photoLocationTagLabel(photo.location_tag);
              return (
                <div
                  key={photo.id}
                  className={`flex gap-3 rounded-lg border p-3 ${
                    rejected ? "border-red-500/30 bg-red-500/5 opacity-65" : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPhotoLightbox(photo.image_url)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-800"
                    aria-label={`${photo.pair_id}조 사진 확대`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image_url}
                      alt={photo.caption ?? "촬영 증거"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-zinc-200">{photo.pair_id}조</span>
                      <span className={`text-[10px] font-bold ${rejected ? "text-red-400" : "text-emerald-400"}`}>
                        {rejected ? "제외됨" : "정상"}
                      </span>
                    </div>
                    <p className="truncate text-xs text-zinc-400">{photo.caption || "기록 없음"}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-600">
                      {locationLabel && <span>{locationLabel}</span>}
                      <span>{new Date(photo.created_at).toLocaleString("ko-KR")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void setPhotoStatus(photo.id, rejected ? "ok" : "rejected")}
                      disabled={photoUpdatingId === photo.id}
                      className={`mt-1 rounded border px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${
                        rejected
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {photoUpdatingId === photo.id ? "처리 중..." : rejected ? "복원" : "제외"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </ToggleSection>

      {photoLightbox && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPhotoLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoLightbox} alt="사진 확대" className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      <ToggleSection title="권한 · 조 구성" description="스탭 권한, 조장 지정, 짝 조 매핑">
      <div className="space-y-3">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">스탭 권한</h2>
        <p className="text-xs text-zinc-600">스탭으로 추가한 이름은 조 번호와 관계없이 조장 권한을 가집니다. 기본 스탭: {STAFF_LEADER_NAMES.join(" · ")}.</p>
        <div className="flex gap-2"><input value={staffName} onChange={(event) => setStaffName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void addStaffName()} placeholder="추가할 스탭 이름" className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100" /><button type="button" onClick={() => void addStaffName()} disabled={!staffName.trim()} className="rounded bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-900 disabled:opacity-40">추가</button></div>
        {getAdditionalStaffNames(leaders).length > 0 && <div className="space-y-2">{getAdditionalStaffNames(leaders).map((name) => <div key={name} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3"><p className="text-sm text-zinc-200">{name}</p><button type="button" onClick={() => void removeStaffName(name)} className="rounded border border-red-500/30 px-3 py-1 text-xs text-red-400">제거</button></div>)}</div>}

        <h2 className="pt-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">조장 지정</h2>
        <p className="text-xs text-zinc-600">조 번호와 참가자 이름이 정확히 일치해야 조장 권한이 활성화됩니다.</p>
        <div className="space-y-2">{Object.entries(leaders).filter(([team, name]) => team !== "__staff__" && typeof name === "string").sort(([a], [b]) => Number(a) - Number(b)).map(([team, name]) => <div key={team} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3"><p className="text-sm text-zinc-200">{team}조 — {name}</p><button type="button" onClick={() => void removeLeader(team)} className="rounded border border-red-500/30 px-3 py-1 text-xs text-red-400">해제</button></div>)}</div>
        <div className="flex gap-2"><input value={leaderTeam} onChange={(event) => setLeaderTeam(event.target.value)} placeholder="조 번호" className="w-20 rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100" /><input value={leaderName} onChange={(event) => setLeaderName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void setLeader()} placeholder="이름" className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100" /><button type="button" onClick={() => void setLeader()} disabled={!leaderTeam.trim() || !leaderName.trim()} className="rounded bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-900 disabled:opacity-40">지정</button></div>
      </div>

      {/* Team pairing */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">조 매핑</h2>
        <p className="text-xs text-zinc-600">짝이 된 두 조는 서로의 증거를 실시간 공유합니다.</p>

        {/* Current pairs */}
        {currentPairs.length > 0 ? (
          <div className="space-y-2">
            {currentPairs.map(([a, b]) => (
              <div
                key={`${a}-${b}`}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3"
              >
                <div><p className="text-sm font-bold text-zinc-200">{a}조 ↔ {b}조</p><p className="mt-0.5 text-xs text-amber-300">팀 이름 · {pairTeamNames[getPairTeamKey(a, b)] ?? "미지정"}</p></div>
                <button
                  onClick={() => removePairing(a, b)}
                  className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 rounded px-3 py-1.5 hover:bg-red-500/20 transition-all"
                >
                  해제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600 py-2">현재 매핑된 조가 없습니다.</p>
        )}

        {/* Add new pair */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <p className="text-xs text-zinc-500">새 짝 추가</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={pairTeamName}
              onChange={(e) => setPairTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPairing()}
              placeholder="팀 이름 (예: 노랑)"
              className="min-w-36 flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              value={pairA}
              onChange={(e) => setPairA(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPairing()}
              placeholder="조 번호"
              className="w-20 rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 text-center focus:outline-none focus:border-amber-400"
            />
            <span className="text-zinc-500 text-sm">↔</span>
            <input
              type="text"
              value={pairB}
              onChange={(e) => setPairB(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPairing()}
              placeholder="조 번호"
              className="w-20 rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 text-center focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={addPairing}
              disabled={savingPair || !pairTeamName.trim() || !pairA.trim() || !pairB.trim() || pairA.trim() === pairB.trim()}
              className="flex-1 rounded bg-amber-400 px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {savingPair ? "..." : "매핑"}
            </button>
          </div>
        </div>
      </div>
      </ToggleSection>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Resets */}
      <ToggleSection title="초기화 · 전체 삭제" description="진행 기록과 증거·사진·메모를 초기화합니다">
      <div className="space-y-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <div className="space-y-0.5"><p className="text-sm font-bold text-zinc-200">진행 상태 초기화</p><p className="text-xs text-zinc-500">심문권의 획득·사용 기록과 최종추리 제출 상태를 각각 초기화합니다.</p></div>
          <button type="button" onClick={() => setPendingProgressReset("interrogation")} disabled={resettingInterrogationUses || resettingInterrogationEarned || resettingVotes} className="w-full rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 disabled:opacity-40">{resettingInterrogationUses ? "초기화 중..." : "심문권 사용 초기화"}</button>
          <button type="button" onClick={() => setPendingProgressReset("interrogation_earned")} disabled={resettingInterrogationUses || resettingInterrogationEarned || resettingVotes} className="w-full rounded border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm font-bold text-red-300 disabled:opacity-40">{resettingInterrogationEarned ? "초기화 중..." : "심문권 획득 초기화"}</button>
          <button type="button" onClick={() => setPendingProgressReset("vote")} disabled={resettingInterrogationUses || resettingInterrogationEarned || resettingVotes} className="w-full rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-200 disabled:opacity-40">{resettingVotes ? "초기화 중..." : "최종추리 제출 초기화"}</button>
        </div>

        {pendingProgressReset && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true" aria-labelledby="progress-reset-confirm-title"><div className="w-full max-w-sm rounded-lg border border-red-500/30 bg-zinc-900 p-5 shadow-2xl"><h2 id="progress-reset-confirm-title" className="text-lg font-bold text-zinc-100">초기화하시겠습니까?</h2><p className="mt-2 text-sm text-zinc-400">{pendingProgressReset === "interrogation" ? "모든 조의 심문권 사용 완료 기록이 삭제됩니다. 이미 획득한 심문권은 다시 사용할 수 있습니다." : pendingProgressReset === "interrogation_earned" ? "모든 조의 심문권 획득 기록이 삭제됩니다(사용 기록 포함). 각 조는 QR 문제를 다시 풀어야 심문권을 재획득합니다." : "모든 참가자 기기의 최종추리 제출 상태가 초기화됩니다. 이미 Google Form에 전송된 응답은 삭제되지 않습니다."}</p><div className="mt-5 flex gap-2"><button type="button" onClick={confirmProgressReset} className="flex-1 rounded bg-red-500 py-2.5 text-sm font-bold text-white">초기화 실행</button><button type="button" onClick={() => setPendingProgressReset(null)} className="rounded border border-zinc-600 px-4 py-2.5 text-sm font-bold text-zinc-300">취소</button></div></div></div>}

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <div className="space-y-0.5"><p className="text-sm font-bold text-zinc-200">사진 전체 삭제</p><p className="text-xs text-zinc-500">모든 조의 사진 증거와 Storage 파일을 영구 삭제합니다.</p></div>
          <button onClick={() => { setShowResetPhotosConfirm(true); setResetConfirmText(""); }} disabled={resettingAllPhotos} className="w-full rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40">{resettingAllPhotos ? "삭제 중..." : "사진 전체 삭제"}</button>
          {showResetPhotosConfirm && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2"><p className="text-xs leading-relaxed text-red-200/80">실행하려면 아래에 초기화를 입력하세요.</p><input value={resetConfirmText} onChange={(e) => setResetConfirmText(e.target.value)} placeholder="초기화 입력" disabled={resettingAllPhotos} className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-400 focus:outline-none disabled:opacity-40" /><button onClick={resetAllPhotos} disabled={resetConfirmText.trim() !== "초기화" || resettingAllPhotos} className="w-full rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40">{resettingAllPhotos ? "삭제 중..." : "삭제 확정"}</button><button onClick={() => { setShowResetPhotosConfirm(false); setResetConfirmText(""); }} disabled={resettingAllPhotos} className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 disabled:opacity-40">취소</button></div>}
        </div>

        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">조별 초기화</h2>
        <p className="text-xs text-zinc-600">
          Supabase 증거 수집 기록과 촬영한 사진을 조별로 삭제합니다.
          내 기기 조와 일치하면 투표 기록도 함께 삭제됩니다.
        </p>

        <div className="space-y-2">
          {teams.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">수집 기록이 없습니다.</p>
          ) : (
            teams.map(({ pairId, count }) => {
              const isMe = pairId === myPairId;
              const isLoading = loadingId === pairId;
              return (
                <div
                  key={pairId}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    isMe ? "border-amber-500/30 bg-amber-500/5" : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className={`text-sm font-bold ${isMe ? "text-amber-400" : "text-zinc-200"}`}>
                      {pairId}조{isMe && " (이 기기)"}
                    </p>
                    <p className="text-xs text-zinc-500">수집된 증거 {count}개</p>
                  </div>
                  <button
                    onClick={() => handleReset(pairId)}
                    disabled={!!loadingId}
                    className="rounded border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? "삭제 중..." : "초기화"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={() => setShowResetAllConfirm(true)}
          disabled={!!loadingId}
          className="w-full rounded-lg border border-red-500/40 bg-red-500/10 py-4 text-base font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loadingId === "ALL" ? "전체 삭제 중..." : "전체 조 초기화"}
        </button>

        {showResetAllConfirm && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true" aria-labelledby="reset-all-confirm-title">
          <div className="w-full max-w-sm rounded-lg border border-red-500/30 bg-zinc-900 p-5 shadow-2xl">
            <h2 id="reset-all-confirm-title" className="text-lg font-bold text-zinc-100">전체 조를 초기화하시겠습니까?</h2>
            <p className="mt-2 text-sm text-zinc-400">
              모든 조의 증거 수집 기록, 촬영한 사진(Storage 파일 포함), 용의자 메모, 사진 번호 카운터가 영구 삭제됩니다. 되돌릴 수 없습니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={handleResetAll} className="flex-1 rounded bg-red-500 py-2.5 text-sm font-bold text-white">전체 초기화 실행</button>
              <button type="button" onClick={() => setShowResetAllConfirm(false)} className="rounded border border-zinc-600 px-4 py-2.5 text-sm font-bold text-zinc-300">취소</button>
            </div>
          </div>
        </div>}
      </div>
      </ToggleSection>
    </div>
  );
}

export default function ResetPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminPanel />;
}
