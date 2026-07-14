"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { INTERROGATION_QUIZZES, SUSPECTS } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";
import { getSuspectNotes, getTeamInfo, saveSuspectNote } from "@/lib/store";

function SuspectSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="32" cy="27" r="14" />
      <path d="M6 80c0-15 11.6-25 26-25s26 10 26 25z" />
    </svg>
  );
}

function formatUsedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function SuspectsPage() {
  const { interrogationEarned, interrogationUsed, markInterrogationUsed } = useTeamEvidence();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [teamNumber, setTeamNumber] = useState<string | null>(null);
  const [confirmUseId, setConfirmUseId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    setTeamNumber(getTeamInfo()?.teamNumber ?? null);
    setNotes(getSuspectNotes());
  }, []);

  function handleNoteChange(suspectId: string, value: string) {
    setNotes((previous) => ({ ...previous, [suspectId]: value }));
    saveSuspectNote(suspectId, value);
    setSavedId(suspectId);
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400">Suspect Files</div>
        <h1 className="text-2xl font-bold text-zinc-100">용의자 파일</h1>
        <p className="text-sm text-zinc-500">심문권과 수사 메모를 확인하세요.</p>
      </div>

      <div className="space-y-3">
        {SUSPECTS.map((suspect) => {
          const isExpanded = expanded === suspect.id;
          const hasQuiz = Object.values(INTERROGATION_QUIZZES).some(
            (quiz) => quiz.suspectId === suspect.id
          );
          const earned = interrogationEarned.includes(suspect.id);
          const interrogationUse = interrogationUsed.find((item) => item.suspectId === suspect.id);

          return (
            <div key={suspect.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : suspect.id)}
                className="flex w-full items-stretch gap-3 p-3 text-left"
                aria-expanded={isExpanded}
              >
                <div className="relative min-h-[92px] w-[68px] shrink-0 self-stretch overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 [background-image:repeating-linear-gradient(0deg,transparent,transparent_11px,rgba(255,255,255,0.05)_11px,rgba(255,255,255,0.05)_12px)]">
                  {suspect.imageUrl ? (
                    <Image src={suspect.imageUrl} alt={suspect.name} fill sizes="68px" className="object-cover object-top" />
                  ) : (
                    <SuspectSilhouette className="absolute bottom-0 left-1/2 h-[72px] w-[58px] -translate-x-1/2 text-zinc-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute left-0 top-0 rounded-br-md bg-amber-500 px-1.5 py-0.5 text-[11px] font-black leading-none text-zinc-950">
                    {suspect.id}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">{suspect.codename}</span>
                  <h2 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{suspect.name}</h2>
                  <span className="mt-1 inline-flex w-fit items-center rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] font-mono tracking-wider text-zinc-500">
                    CASE FILE
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-zinc-500">
                    <span>{isExpanded ? "접기" : "파일 열기"}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-4 border-t border-zinc-800 p-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono text-zinc-500">심문권</span>
                    {!hasQuiz ? (
                      <div className="flex items-center gap-2 rounded bg-zinc-800/60 px-3 py-3 text-xs text-zinc-500">
                        <span>🔒</span>
                        <span>QR 문제 연결 대기 중</span>
                      </div>
                    ) : !earned ? (
                      <div className="flex items-center gap-2 rounded bg-zinc-800/60 px-3 py-3 text-xs text-zinc-600">
                        <span>🔒</span>
                        <span>해당 QR 문제를 풀면 이 용의자의 심문권을 얻습니다.</span>
                      </div>
                    ) : interrogationUse ? (
                      <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-3 text-zinc-500">
                        <span className="text-lg">✅</span>
                        <div>
                          <p className="text-sm font-bold text-zinc-300">{formatUsedTime(interrogationUse.usedAt)} {interrogationUse.teamId}조 사용완료</p>
                          <p className="text-xs">이미 사용된 심문권입니다.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-widest text-red-300/70">Interrogation Pass</p>
                            <p className="text-lg font-black text-red-200">🎫 심문권</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-zinc-100">{suspect.name}</p>
                            <p className="text-xs font-mono text-zinc-400">{suspect.codename} · {teamNumber ? `${teamNumber}조` : "-"}</p>
                          </div>
                        </div>
                        <p className="text-xs text-red-200/70">용의자(배우)에게 이 화면을 제시하세요. 배우가 사용 처리하면 다시 사용할 수 없습니다.</p>
                        {confirmUseId === suspect.id ? (
                          <div className="flex gap-2">
                            <button type="button" onClick={() => { markInterrogationUsed(suspect.id); setConfirmUseId(null); }} className="flex-1 rounded bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400">
                              사용 처리 (되돌릴 수 없음)
                            </button>
                            <button type="button" onClick={() => setConfirmUseId(null)} className="rounded border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:bg-zinc-700">
                              취소
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setConfirmUseId(suspect.id)} className="w-full rounded bg-red-500/90 py-2.5 text-sm font-bold text-white hover:bg-red-500">
                            심문 사용 (배우 전용)
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500">수사 노트</span>
                      {savedId === suspect.id && <span className="text-[10px] text-emerald-400/80">✓ 이 기기에 저장됨</span>}
                    </div>
                    <textarea
                      value={notes[suspect.id] ?? ""}
                      onChange={(event) => handleNoteChange(suspect.id, event.target.value)}
                      placeholder="이 용의자에 대한 메모를 남기세요…"
                      rows={3}
                      className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none"
                    />
                    <p className="text-[10px] text-zinc-600">메모는 이 기기에만 저장됩니다.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
        <p className="text-xs text-zinc-500">증거를 충분히 검토한 뒤 범인을 지목하세요.</p>
        <Link href="/vote" className="inline-block text-sm font-medium text-amber-400 hover:text-amber-300">범인 지목하기 →</Link>
      </div>
    </div>
  );
}
