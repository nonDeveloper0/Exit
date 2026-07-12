"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EVIDENCE, findPuzzleByAnswer, PUZZLES, Puzzle } from "@/lib/data";
import { getTeamInfo } from "@/lib/store";
import { useTeamEvidence } from "@/lib/useTeamEvidence";

type SolveStatus =
  | { type: "idle" }
  | { type: "success"; puzzle: Puzzle; message: string }
  | { type: "hint"; puzzle: Puzzle; text: string }
  | { type: "wrong" }
  | { type: "no-team" };

export default function SolvePage() {
  const teamInfo = useMemo(() => getTeamInfo(), []);
  const { collected, collect } = useTeamEvidence();
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<SolveStatus>({ type: "idle" });

  const listedPuzzles = PUZZLES.filter((puzzle) => puzzle.showInList);

  async function handleSubmit() {
    const puzzle = findPuzzleByAnswer(answer);

    if (!puzzle) {
      setStatus({ type: "wrong" });
      return;
    }

    const reward = puzzle.reward;

    if (reward.type === "hint") {
      setStatus({ type: "hint", puzzle, text: reward.text });
      setAnswer("");
      return;
    }

    if (!teamInfo) {
      setStatus({ type: "no-team" });
      return;
    }

    const evidence = EVIDENCE.find((item) => item.id === reward.evidenceId);
    await collect(reward.evidenceId);
    setStatus({
      type: "success",
      puzzle,
      message: evidence ? `${evidence.title} 단서를 수집했습니다.` : "단서를 수집했습니다.",
    });
    setAnswer("");
    navigator.vibrate?.(30);
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <Link
        href="/home"
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors w-fit"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        수사본부
      </Link>

      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Evidence Code
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">정답 입력</h1>
        <p className="text-sm text-zinc-500">
          현장에서 찾은 문제의 정답을 입력하면 QR 없이도 연결된 단서를 수집할 수 있습니다.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
            placeholder="정답 또는 코드"
            className="min-w-0 flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="shrink-0 rounded bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500 active:scale-95 transition-all"
          >
            확인
          </button>
        </div>

        {status.type === "success" && (
          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-sm font-medium text-emerald-300">{status.message}</p>
            {status.puzzle.reward.type === "evidence" &&
              collected.includes(status.puzzle.reward.evidenceId) && (
                <p className="mt-1 text-xs text-emerald-400/80">같은 조 증거함에 반영됩니다.</p>
              )}
          </div>
        )}

        {status.type === "hint" && (
          <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-sm font-medium text-amber-300">{status.text}</p>
          </div>
        )}

        {status.type === "wrong" && (
          <p className="text-xs text-red-400">일치하는 정답이 없습니다.</p>
        )}

        {status.type === "no-team" && (
          <p className="text-xs text-red-400">먼저 조 번호를 입력하고 입장해야 단서를 수집할 수 있습니다.</p>
        )}
      </div>

      {listedPuzzles.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">공개 문제</h2>
          <div className="space-y-2">
            {listedPuzzles.map((puzzle) => {
              const evidenceId =
                puzzle.reward.type === "evidence" ? puzzle.reward.evidenceId : null;
              const isCollected = evidenceId ? collected.includes(evidenceId) : false;

              return (
                <div
                  key={puzzle.id}
                  className={`rounded-lg border p-3 ${
                    isCollected
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-zinc-500">{puzzle.id}</span>
                      <p className="text-sm text-zinc-300 leading-relaxed">{puzzle.question}</p>
                    </div>
                    {isCollected && (
                      <span className="shrink-0 text-xs font-medium text-emerald-400">
                        수집 완료
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
