"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetAll, getTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function ResetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const team = getTeamInfo();
    if (team) {
      await supabase
        .from("team_evidence_items")
        .delete()
        .eq("pair_id", team.teamNumber.toUpperCase());
    }
    resetAll();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase">Dev Only</div>
        <h1 className="text-2xl font-bold text-zinc-100">초기화</h1>
        <p className="text-sm text-zinc-500">
          이 팀의 증거 수집 기록(Supabase) 및 투표 기록(기기)을 모두 삭제합니다.
        </p>
      </div>

      <button
        onClick={handleReset}
        disabled={loading}
        className={`w-full rounded-lg py-4 text-base font-bold transition-all active:scale-[0.98] ${
          loading
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            : "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
        }`}
      >
        {loading ? "삭제 중..." : "전체 초기화"}
      </button>
    </div>
  );
}
