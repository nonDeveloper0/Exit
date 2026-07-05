"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SUSPECTS, EVIDENCE, type Suspect } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";
import { getTeamInfo } from "@/lib/store";

const SUSPECT_AVATAR_CLASS = "bg-zinc-700 text-zinc-300";

function getDisplayMotive(s: Suspect, collected: string[]): string {
  if (s.motiveRevealIds.length > 0 && s.motiveRevealIds.every((id) => collected.includes(id))) {
    return s.motive;
  }
  return "불명확 — 조사 중";
}

function formatUsedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function SuspectsPage() {
  const { collected, interrogationUsed, markInterrogationUsed } = useTeamEvidence();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [confirmUseId, setConfirmUseId] = useState<string | null>(null);

  useEffect(() => {
    setTeamNumber(getTeamInfo()?.teamNumber ?? null);
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
          const interrogationEarned = s.interrogationTriggerId
            ? collected.includes(s.interrogationTriggerId)
            : false;
          const interrogationUse = interrogationUsed.find((u) => u.suspectId === s.id);
          const interrogationDone = !!interrogationUse;

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
                    <h2 className="text-lg font-bold text-zinc-100">{s.name}</h2>
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

                  {s.relatedEvidenceIds.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-zinc-500 font-mono text-xs">
                        관련 단서 ({s.relatedEvidenceIds.filter((id) => collected.includes(id)).length}/
                        {s.relatedEvidenceIds.length})
                      </span>
                      <div className="space-y-1.5">
                        {s.relatedEvidenceIds.map((id) => {
                          const isCollected = collected.includes(id);
                          const ev = EVIDENCE.find((e) => e.id === id);
                          if (isCollected) {
                            return (
                              <Link
                                key={id}
                                href={`/evidence?focus=${id}`}
                                className="flex items-center gap-2 rounded px-3 py-2 text-xs bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
                              >
                                <span>🔎</span>
                                <span className="font-medium">{ev?.title ?? id}</span>
                                <span className="ml-auto text-amber-400/50 font-mono">증거함 →</span>
                              </Link>
                            );
                          }
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-2 rounded px-3 py-2 text-xs bg-zinc-800/60 text-zinc-600"
                            >
                              <span>🔒</span>
                              <span>미확보 단서</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {s.interrogationTriggerId && (
                    <div className="space-y-1.5">
                      <span className="text-zinc-500 font-mono text-xs">심문권</span>
                      {!interrogationEarned ? (
                        <div className="flex items-center gap-2 rounded px-3 py-3 text-xs bg-zinc-800/60 text-zinc-600">
                          <span>🔒</span>
                          <span>특정 단서를 찾으면 이 용의자의 심문권을 얻습니다</span>
                        </div>
                      ) : interrogationDone ? (
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-3 text-zinc-500">
                          <span className="text-lg">✅</span>
                          <div>
                            <p className="text-sm font-bold text-zinc-300">
                              {interrogationUse &&
                                `${formatUsedTime(interrogationUse.usedAt)} ${interrogationUse.teamId}조 사용완료`}
                            </p>
                            <p className="text-xs">이미 사용된 심문권입니다 (정상)</p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-mono text-red-300/70 tracking-widest uppercase">
                                Interrogation Pass
                              </p>
                              <p className="text-lg font-black text-red-200">🎫 심문권</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-zinc-100">{s.name}</p>
                              <p className="text-xs font-mono text-zinc-400">
                                {s.codename} · {teamNumber ? `${teamNumber}조` : "-"}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-red-200/70">
                            용의자(배우)에게 이 화면을 제시하세요. 배우가 사용 처리하면 다시 사용할 수 없습니다.
                          </p>
                          {confirmUseId === s.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  markInterrogationUsed(s.id);
                                  setConfirmUseId(null);
                                }}
                                className="flex-1 rounded bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400 transition-colors"
                              >
                                사용 처리 (되돌릴 수 없음)
                              </button>
                              <button
                                onClick={() => setConfirmUseId(null)}
                                className="rounded border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:bg-zinc-700 transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmUseId(s.id)}
                              className="w-full rounded bg-red-500/90 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                            >
                              심문 사용 (배우 전용)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center space-y-2">
        <p className="text-xs text-zinc-500">증거를 충분히 검토한 뒤 범인을 지목하세요.</p>
        <Link
          href="/vote"
          className="inline-block text-sm text-amber-400 hover:text-amber-300 font-medium"
        >
          범인 지목하기 →
        </Link>
      </div>
    </div>
  );
}
