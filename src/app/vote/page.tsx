"use client";

import { useState, useEffect } from "react";
import { SUSPECTS } from "@/lib/data";
import { getVote, castVote } from "@/lib/store";

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const vote = getVote();
    if (vote) {
      setSelected(vote);
      setSubmitted(true);
    }
  }, []);

  function handleSubmit() {
    if (!selected) return;
    castVote(selected);
    setSubmitted(true);
  }

  if (submitted) {
    const votedSuspect = SUSPECTS.find((s) => s.id === selected);
    return (
      <div className="flex flex-col gap-4 p-4 pt-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
            추리 제출 완료
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">투표 완료</h1>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-2">
          <p className="text-sm text-zinc-400">우리 조의 최종 선택</p>
          <p className="text-5xl font-black text-emerald-400">{selected}</p>
          <p className="text-base font-semibold text-zinc-200">{votedSuspect?.role}</p>
        </div>

        <p className="text-sm text-zinc-500 text-center">
          모든 조의 추리가 끝나면 진실이 공개됩니다.
        </p>

        <button
          onClick={() => {
            setSubmitted(false);
          }}
          className="text-xs text-zinc-600 hover:text-zinc-400 text-center mt-2"
        >
          다시 선택하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Final Deduction
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">최종 추리</h1>
        <p className="text-sm text-zinc-500">범인은 누구인가? 조의 최종 결론을 선택하세요.</p>
      </div>

      <div className="space-y-3">
        {SUSPECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`w-full text-left rounded-lg border p-4 transition-all active:scale-[0.98] ${
              selected === s.id
                ? "border-amber-400 bg-amber-400/10"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selected === s.id ? "border-amber-400 bg-amber-400" : "border-zinc-600"
                }`}
              >
                {selected === s.id && (
                  <div className="w-2 h-2 rounded-full bg-zinc-900" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-mono text-zinc-500">{s.codename}</p>
                <p className="text-base font-bold text-zinc-100">{s.role}</p>
                <p className="text-xs text-zinc-500">{s.motive}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className={`w-full rounded-lg py-4 text-base font-bold transition-all active:scale-[0.98] ${
          selected
            ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        {selected
          ? `용의자 ${selected} — 범인으로 지목`
          : "용의자를 선택하세요"}
      </button>

      <p className="text-xs text-zinc-600 text-center">제출 후에도 수사 종료 전까지 변경 가능합니다</p>
    </div>
  );
}
