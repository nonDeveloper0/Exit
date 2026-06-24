"use client";

import { useState } from "react";
import { resetAll } from "@/lib/store";

export default function ResetPage() {
  const [done, setDone] = useState(false);

  function handleReset() {
    resetAll();
    setDone(true);
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase">Dev Only</div>
        <h1 className="text-2xl font-bold text-zinc-100">초기화</h1>
        <p className="text-sm text-zinc-500">이 기기의 증거 수집 및 투표 기록을 모두 삭제합니다.</p>
      </div>

      {done ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2">
          <p className="text-base font-bold text-emerald-400">초기화 완료</p>
          <p className="text-sm text-zinc-500">모든 데이터가 삭제됐습니다.</p>
          <button
            onClick={() => setDone(false)}
            className="mt-2 text-xs text-zinc-600 hover:text-zinc-400"
          >
            다시 초기화하기
          </button>
        </div>
      ) : (
        <button
          onClick={handleReset}
          className="w-full rounded-lg bg-red-500/10 border border-red-500/30 py-4 text-base font-bold text-red-400 hover:bg-red-500/20 active:scale-[0.98] transition-all"
        >
          전체 초기화
        </button>
      )}
    </div>
  );
}
