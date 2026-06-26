"use client";

import { useState, useEffect, useCallback } from "react";
import { resetAll, getTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";

interface TeamRow {
  pairId: string;
  count: number;
}

export default function ResetPage() {
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [myPairId, setMyPairId] = useState<string | null>(null);

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
        <h1 className="text-2xl font-bold text-zinc-100">조별 초기화</h1>
        <p className="text-sm text-zinc-500">
          Supabase 증거 수집 기록을 조별로 삭제합니다.
          내 기기 조와 일치하면 투표 기록도 함께 삭제됩니다.
        </p>
      </div>

      {/* Team list */}
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

      {/* Reset all */}
      <div className="border-t border-zinc-800 pt-4">
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
