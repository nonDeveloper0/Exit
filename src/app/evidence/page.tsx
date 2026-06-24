"use client";

import { useEffect, useState } from "react";
import { EVIDENCE } from "@/lib/data";
import { getCollectedEvidence } from "@/lib/store";

export default function EvidencePage() {
  const [collected, setCollected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setCollected(getCollectedEvidence());
  }, []);

  const progress = EVIDENCE.length > 0 ? (collected.length / EVIDENCE.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Evidence Vault
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">증거 보관함</h1>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">수집 현황</span>
          <span className="font-mono text-amber-400 font-bold">
            {collected.length} / {EVIDENCE.length}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {collected.length === EVIDENCE.length && (
          <p className="text-xs text-emerald-400">모든 증거를 수집했습니다. 최종 추리를 제출하세요.</p>
        )}
      </div>

      {/* Evidence list */}
      <div className="space-y-2">
        {EVIDENCE.map((e) => {
          const isCollected = collected.includes(e.id);
          const isExpanded = expanded === e.id;

          return (
            <div
              key={e.id}
              className={`rounded-lg border transition-all ${
                isCollected
                  ? "border-zinc-700 bg-zinc-900"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              <button
                onClick={() => isCollected && setExpanded(isExpanded ? null : e.id)}
                disabled={!isCollected}
                className="w-full text-left p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                      isCollected
                        ? "bg-amber-400/20 text-amber-400"
                        : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {e.id.replace("E", "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isCollected ? "text-zinc-100" : "text-zinc-600"
                      }`}
                    >
                      {isCollected ? e.title : "???"}
                    </p>
                    <p className="text-xs text-zinc-600 font-mono">{e.id}</p>
                  </div>
                  {isCollected ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                  )}
                </div>
              </button>

              {isExpanded && isCollected && (
                <div className="px-3 pb-3 border-t border-zinc-800 pt-3">
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    {e.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
