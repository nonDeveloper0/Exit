"use client";

import { useState, useEffect, useCallback } from "react";
import { resetAll, getTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useGameState } from "@/lib/useGameState";

const ADMIN_PASSWORD = "0000";

interface TeamRow {
  pairId: string;
  count: number;
}

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setPin(digits);
    setError(false);
    if (digits.length === 4) {
      if (digits === ADMIN_PASSWORD) {
        sessionStorage.setItem("admin_auth", "1");
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
        onClick={(e) => {
          const input = (e.currentTarget.closest("div")?.querySelector("input")) as HTMLInputElement | null;
          input?.focus();
        }}
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
  const { vote_open, ending_open, loaded } = useGameState();
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [myPairId, setMyPairId] = useState<string | null>(null);
  const [togglingVote, setTogglingVote] = useState(false);
  const [togglingEnding, setTogglingEnding] = useState(false);

  useEffect(() => {
    const team = getTeamInfo();
    if (team) setMyPairId(team.teamNumber);
  }, []);

  const fetchTeams = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("pair_id, evidence_id")
      .eq("type", "collected");

    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((r) => {
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

  async function toggleVote() {
    setTogglingVote(true);
    await supabase
      .from("game_state")
      .update({ vote_open: !vote_open })
      .eq("id", "singleton");
    setTogglingVote(false);
  }

  async function toggleEnding() {
    setTogglingEnding(true);
    await supabase
      .from("game_state")
      .update({ ending_open: !ending_open })
      .eq("id", "singleton");
    setTogglingEnding(false);
  }

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

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase">Admin</div>
        <h1 className="text-2xl font-bold text-zinc-100">관리자</h1>
      </div>

      {/* Game controls */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">게임 진행 제어</h2>

        {!loaded ? (
          <p className="text-sm text-zinc-600 py-2">상태 불러오는 중...</p>
        ) : (
          <>
            {/* Vote toggle */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-zinc-200">최종 투표</p>
                <p className={`text-xs font-mono ${vote_open ? "text-emerald-400" : "text-zinc-500"}`}>
                  {vote_open ? "● 열림" : "○ 닫힘"}
                </p>
              </div>
              <button
                onClick={toggleVote}
                disabled={togglingVote}
                className={`rounded px-5 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  vote_open
                    ? "border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-emerald-500 text-zinc-900 hover:bg-emerald-400"
                }`}
              >
                {togglingVote ? "..." : vote_open ? "투표 닫기" : "투표 열기"}
              </button>
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
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Team reset */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">조별 초기화</h2>
        <p className="text-xs text-zinc-600">
          Supabase 증거 수집 기록을 조별로 삭제합니다.
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
          onClick={handleResetAll}
          disabled={!!loadingId || teams.length === 0}
          className="w-full rounded-lg border border-red-500/40 bg-red-500/10 py-4 text-base font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loadingId === "ALL" ? "전체 삭제 중..." : "전체 조 초기화"}
        </button>
      </div>
    </div>
  );
}

export default function ResetPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminPanel />;
}
