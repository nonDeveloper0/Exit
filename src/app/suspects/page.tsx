"use client";

import { useState } from "react";
import { INTERROGATION_QUIZZES, SUSPECTS } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";
import { useRole } from "@/lib/useRole";
import { useSuspectNotes } from "@/lib/useSuspectNotes";

function formatUsedTime(iso: string) { return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }); }

export default function SuspectsPage() {
  const { interrogationEarned, interrogationUsed, markInterrogationUsed } = useTeamEvidence();
  const { isLeader, loaded: roleLoaded } = useRole();
  const { notes, loading, addNote, updateNote, deleteNote, name } = useSuspectNotes();
  const [confirmUseId, setConfirmUseId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [addingId, setAddingId] = useState<string | null>(null);
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [noteError, setNoteError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const confirmingSuspect = confirmUseId ? SUSPECTS.find((suspect) => suspect.id === confirmUseId) ?? null : null;

  async function submitNote(suspectId: string) {
    setAddingId(suspectId);
    setNoteError(null);
    try { await addNote(suspectId, drafts[suspectId] ?? ""); setDrafts((prev) => ({ ...prev, [suspectId]: "" })); }
    catch { setNoteError("메모 저장에 실패했습니다. 잠시 후 다시 시도하세요."); }
    finally { setAddingId(null); }
  }

  async function removeNote(id: string) {
    setNoteError(null);
    try { await deleteNote(id); }
    catch { setNoteError("메모 삭제에 실패했습니다. 네트워크 상태를 확인하세요."); }
  }

  async function saveEditedNote() {
    if (!editingNoteId) return;
    setNoteError(null);
    try { await updateNote(editingNoteId, editBody); setEditingNoteId(null); setEditBody(""); }
    catch { setNoteError("메모 수정에 실패했습니다. 잠시 후 다시 시도하세요."); }
  }

  function confirmInterrogationUse() {
    if (!confirmUseId) return;
    markInterrogationUsed(confirmUseId);
    setConfirmUseId(null);
  }

  return <div className="flex flex-col gap-4 p-4 pt-6">
    <div className="space-y-1"><div className="text-xs font-mono uppercase tracking-widest text-amber-400">Suspect Files</div><h1 className="text-2xl font-bold text-zinc-100">용의자 파일</h1><p className="text-sm text-zinc-500">심문권과 조별 수사 메모를 확인하세요.</p></div>
    <div className="space-y-3">{SUSPECTS.map((suspect) => {
      const quiz = Object.values(INTERROGATION_QUIZZES).find((item) => item.suspectId === suspect.id);
      const hasQuiz = !!quiz;
      const earned = interrogationEarned.includes(suspect.id);
      const interrogationUse = interrogationUsed.find((item) => item.suspectId === suspect.id);
      const ownNote = (notes[suspect.id] ?? []).find((note) => note.authorName === name);
      return <div key={suspect.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="p-3"><span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">{suspect.codename}</span><h2 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{suspect.name}</h2></div>
        <div className="space-y-4 border-t border-zinc-800 p-4">
          <div className="space-y-1.5"><span className="text-xs font-mono text-zinc-500">심문권</span>
            {!hasQuiz ? <div className="rounded bg-zinc-800/60 px-3 py-3 text-xs text-zinc-500">🔒 QR 문제 연결 대기 중</div>
            : !earned ? <div className="rounded bg-zinc-800/60 px-3 py-3 text-xs text-zinc-600">🔒 {quiz.autoGrant ? "심문권을 찾아 용의자를 심문하세요." : "해당 QR 문제를 풀면 이 용의자의 심문권을 얻습니다."}</div>
            : interrogationUse ? <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-3 text-zinc-500"><p className="text-sm font-bold text-zinc-400">✅ {formatUsedTime(interrogationUse.usedAt)} {interrogationUse.teamId}조 사용완료</p><p className="text-xs">사용 완료된 심문권입니다.</p></div>
            : <div className="space-y-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4"><p className="text-lg font-black text-emerald-200">🎫 심문권 획득 · {suspect.name}</p>{quiz.earnedNote && <p className="text-base font-black tracking-wide text-amber-300">{quiz.earnedNote}</p>}<p className="text-xs text-emerald-200/70">용의자에게 이 화면을 제시하세요.</p>
              {!roleLoaded ? <p className="text-xs text-zinc-500">권한 확인 중...</p> : !isLeader ? <p className="rounded bg-zinc-900/60 px-3 py-2 text-xs text-zinc-400">심문권 사용은 조장만 할 수 있습니다.</p> : <button type="button" onClick={() => setConfirmUseId(suspect.id)} className="w-full rounded bg-emerald-500 py-2.5 text-sm font-bold text-white">심문 사용</button>}
            </div>}
          </div>
          <div className="space-y-2"><button type="button" onClick={() => setOpenNotes((prev) => ({ ...prev, [suspect.id]: !prev[suspect.id] }))} aria-expanded={!!openNotes[suspect.id]} className="flex w-full items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-left"><span className="text-xs font-mono text-zinc-400">수사 노트 ({notes[suspect.id]?.length ?? 0})</span><span className="text-xs text-amber-300">{openNotes[suspect.id] ? "접기 ▲" : "열기 ▼"}</span></button><p className="text-[10px] text-zinc-600">조원 누구나 작성할 수 있으며, 페어조와 공유됩니다.</p>
            {openNotes[suspect.id] && <div className="space-y-2">{loading ? <p className="text-xs text-zinc-600">메모 불러오는 중...</p> : (notes[suspect.id] ?? []).map((note) => <div key={note.id} className="rounded border border-zinc-800 bg-zinc-950 p-3"><div className="flex justify-between gap-2"><span className="text-xs font-bold text-amber-300">{note.authorName}</span>{note.authorName === name && <div className="flex gap-3"><button type="button" onClick={() => { setEditingNoteId(note.id); setEditBody(note.body); }} className="text-xs text-amber-300">수정</button><button type="button" onClick={() => void removeNote(note.id)} className="text-xs text-zinc-500">삭제</button></div>}</div>{editingNoteId === note.id ? <div className="mt-2 space-y-2"><textarea value={editBody} onChange={(event) => setEditBody(event.target.value)} rows={3} className="w-full resize-y rounded border border-amber-400/60 bg-zinc-900 p-2 text-sm text-zinc-100 focus:outline-none" /><div className="flex gap-2"><button type="button" onClick={() => void saveEditedNote()} disabled={!editBody.trim()} className="rounded bg-amber-400 px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-40">저장</button><button type="button" onClick={() => { setEditingNoteId(null); setEditBody(""); }} className="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">취소</button></div></div> : <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{note.body}</p>}</div>)}
            {!loading && !ownNote ? <><textarea value={drafts[suspect.id] ?? ""} onChange={(event) => setDrafts((prev) => ({ ...prev, [suspect.id]: event.target.value }))} placeholder="이 용의자에 대한 메모를 남기세요…" rows={3} className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none" /><button type="button" onClick={() => void submitNote(suspect.id)} disabled={!drafts[suspect.id]?.trim() || addingId === suspect.id} className="w-full rounded border border-amber-400/60 py-2 text-sm font-bold text-amber-200 disabled:opacity-40">{addingId === suspect.id ? "추가 중..." : "메모 추가"}</button></> : !loading ? <p className="text-[10px] text-zinc-600">용의자당 본인 수사노트는 1개만 작성할 수 있습니다.</p> : null}</div>}
          </div>
        </div>
      </div>;
    })}</div>
    {confirmingSuspect && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true" aria-labelledby="interrogation-confirm-title"><div className="w-full max-w-sm rounded-lg border border-red-500/30 bg-zinc-900 p-5 shadow-2xl"><h2 id="interrogation-confirm-title" className="text-lg font-bold text-zinc-100">심문권을 사용하시겠습니까?</h2><p className="mt-2 text-sm text-zinc-400">{confirmingSuspect.name} 심문권은 사용 처리 후 되돌릴 수 없습니다.</p><div className="mt-5 flex gap-2"><button type="button" onClick={confirmInterrogationUse} className="flex-1 rounded bg-red-500 py-2.5 text-sm font-bold text-white">사용 처리</button><button type="button" onClick={() => setConfirmUseId(null)} className="rounded border border-zinc-600 px-4 py-2.5 text-sm font-bold text-zinc-300">취소</button></div></div></div>}
    {noteError && <p className="rounded border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-300">{noteError}</p>}
  </div>;
}
