"use client";

import { useEffect, useState } from "react";
import { useAllTeamsProgress } from "@/lib/useAllTeamsProgress";
import { getTeamInfo } from "@/lib/store";

export default function RankingPage() {
  const { groups, total } = useAllTeamsProgress();
  const [myTeamId, setMyTeamId] = useState<string | null>(null);

  useEffect(() => {
    const team = getTeamInfo();
    if (team) setMyTeamId(team.teamNumber);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Live Ranking
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">수사 현황</h1>
        <p className="text-sm text-zinc-500">전체 조 증거 수집 실시간 순위</p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-sm text-zinc-500">아직 수집 중인 조가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group, index) => {
            const isMe = myTeamId !== null && group.teamIds.includes(myTeamId);
            const pct = total > 0 ? Math.round((group.count / total) * 100) : 0;
            const rank = index + 1;
            const rankColor =
              rank === 1 ? "text-amber-400" :
              rank === 2 ? "text-zinc-300" :
              rank === 3 ? "text-amber-700" :
              "text-zinc-600";

            return (
              <div
                key={group.label}
                className={`rounded-lg border p-4 space-y-2 ${
                  isMe
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-black w-7 shrink-0 ${rankColor}`}>
                    {rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-bold ${isMe ? "text-amber-400" : "text-zinc-200"}`}>
                        {group.label}{isMe && " (나)"}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {group.count} / {total}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          rank === 1 ? "bg-amber-400" :
                          rank === 2 ? "bg-zinc-400" :
                          rank === 3 ? "bg-amber-800" :
                          isMe ? "bg-amber-600" : "bg-zinc-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-zinc-600">실시간 업데이트 중</span>
      </div>
    </div>
  );
}
