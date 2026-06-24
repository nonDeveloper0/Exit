"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SUSPECTS, type Suspect } from "@/lib/data";
import { getCollectedEvidence } from "@/lib/store";

const SUSPECT_AVATAR_CLASS = "bg-zinc-700 text-zinc-300";

function getDisplayMotive(s: Suspect, collected: string[]): string {
  if (s.motiveRevealIds.length > 0 && s.motiveRevealIds.every((id) => collected.includes(id))) {
    return s.motive;
  }
  return "불명확 — 조사 중";
}

export default function SuspectsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [collected, setCollected] = useState<string[]>([]);

  useEffect(() => {
    setCollected(getCollectedEvidence());
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Suspect Files
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">용의자 파일</h1>
        <p className="text-sm text-zinc-500">총 {SUSPECTS.length}명의 용의자</p>
      </div>

      <div className="space-y-3">
        {SUSPECTS.map((s) => {
          const isExpanded = expanded === s.id;

          return (
            <div
              key={s.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : s.id)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-zinc-500">{s.codename}</span>
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100">{s.role}</h2>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${SUSPECT_AVATAR_CLASS}`}
                  >
                    {s.id}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {isExpanded ? "접기" : "파일 열기"}
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 text-zinc-500 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-800 p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3">
                      <span className="text-zinc-500 w-12 shrink-0 font-mono text-xs pt-0.5">
                        역할
                      </span>
                      <span className="text-zinc-300">{s.role}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-zinc-500 w-12 shrink-0 font-mono text-xs pt-0.5">
                        동기
                      </span>
                      <span className="text-zinc-300">{getDisplayMotive(s, collected)}</span>
                    </div>
                  </div>
                  <div className="rounded bg-zinc-800 p-3">
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                      {s.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center space-y-2">
        <p className="text-xs text-zinc-500">증거를 충분히 검토한 뒤 최종 추리를 제출하세요.</p>
        <Link
          href="/vote"
          className="inline-block text-sm text-amber-400 hover:text-amber-300 font-medium"
        >
          최종 추리 제출 →
        </Link>
      </div>
    </div>
  );
}
