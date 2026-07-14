"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { INTERROGATION_QUIZZES, SUSPECTS } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";
import { getSuspectNotes, getTeamInfo, saveSuspectNote } from "@/lib/store";

function formatUsedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function SuspectsPage() {
  const { interrogationEarned, interrogationUsed, markInterrogationUsed } = useTeamEvidence();
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
          const hasQuiz = Object.values(INTERROGATION_QUIZZES).some(
            (quiz) => quiz.suspectId === suspect.id
          );
          const earned = interrogationEarned.includes(suspect.id);
          const interrogationUse = interrogationUsed.find((item) => item.suspectId === suspect.id);

          return (
            <div key={suspect.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="p-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">{suspect.codename}</span>
                <h2 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{suspect.name}</h2>
              </div>

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
