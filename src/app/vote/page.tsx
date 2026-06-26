"use client";

import { useState, useEffect } from "react";
import { SUSPECTS, VOTE_UNLOCK_COUNT } from "@/lib/data";
import { getVote, castVote, getTeamInfo } from "@/lib/store";
import { useTeamEvidence } from "@/lib/useTeamEvidence";
import { useGameState } from "@/lib/useGameState";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSclsS9dAFGB2YgYNMNYd8NVQ5tBbdUBYwUF9tWosu5patyHXg/formResponse";

async function submitToGoogleForm(teamNumber: string, leaderName: string, suspect: string) {
  await fetch(FORM_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "entry.197462467": teamNumber,
      "entry.1747885092": leaderName,
      "entry.795452093": suspect,
    }).toString(),
  });
}

export default function VotePage() {
  const { collected } = useTeamEvidence();
  const { vote_round, loaded: gameStateLoaded } = useGameState();
  const [selectedR1, setSelectedR1] = useState<string | null>(null);
  const [selectedR2, setSelectedR2] = useState<string | null>(null);
  const [submittedR1, setSubmittedR1] = useState(false);
  const [submittedR2, setSubmittedR2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [team, setTeam] = useState<{ teamNumber: string; leaderName: string } | null>(null);

  useEffect(() => {
    setTeam(getTeamInfo());
    const v1 = getVote(1);
    const v2 = getVote(2);
    if (v1) { setSelectedR1(v1); setSubmittedR1(true); }
    if (v2) { setSelectedR2(v2); setSubmittedR2(true); }
  }, []);

  const collectedCount = collected.length;
  const voteLocked = VOTE_UNLOCK_COUNT > 0 && collectedCount < VOTE_UNLOCK_COUNT;

  if (!gameStateLoaded) return null;

  if (vote_round === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4">
        <div className="space-y-1 text-center">
          <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Deduction</div>
          <h1 className="text-2xl font-bold text-zinc-100">추리 제출</h1>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center space-y-3 w-full max-w-sm">
          <div className="w-3 h-3 rounded-full bg-zinc-600 mx-auto animate-pulse" />
          <p className="text-base font-semibold text-zinc-300">아직 투표가 열리지 않았습니다</p>
          <p className="text-sm text-zinc-500">운영진의 안내에 따라 조금만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  const isRound1 = vote_round === 1;
  const selected = isRound1 ? selectedR1 : selectedR2;
  const submitted = isRound1 ? submittedR1 : submittedR2;
  const setSelected = isRound1 ? setSelectedR1 : setSelectedR2;
  const setSubmitted = isRound1
    ? (v: boolean) => setSubmittedR1(v)
    : (v: boolean) => setSubmittedR2(v);

  const roundLabel = isRound1 ? "중간 추리" : "최종 추리";
  const roundLabelEn = isRound1 ? "Mid Deduction" : "Final Deduction";

  async function handleSubmit() {
    if (!selected || !team) return;
    setSubmitting(true);
    try {
      await submitToGoogleForm(team.teamNumber, team.leaderName, selected);
    } catch {
      // no-cors 응답은 읽을 수 없으나 제출은 정상 처리됨
    }
    castVote(vote_round as 1 | 2, selected);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    const votedSuspect = SUSPECTS.find((s) => s.id === selected);
    return (
      <div className="flex flex-col gap-4 p-4 pt-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
            {roundLabelEn} — 완료
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">{roundLabel} 완료</h1>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-2">
          <p className="text-sm text-zinc-400">{team?.teamNumber}조의 {isRound1 ? "중간" : "최종"} 선택</p>
          <p className="text-5xl font-black text-emerald-400">{selected}</p>
          <p className="text-base font-semibold text-zinc-200">{votedSuspect?.role}</p>
          <p className="text-xs text-zinc-500 pt-1">조장: {team?.leaderName}</p>
        </div>

        <p className="text-sm text-zinc-500 text-center">
          {isRound1
            ? "최종 투표가 열리면 다시 선택할 수 있습니다."
            : "모든 조의 추리가 끝나면 진실이 공개됩니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          {roundLabelEn}
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">{roundLabel}</h1>
        <p className="text-sm text-zinc-500">범인은 누구인가? 조의 {isRound1 ? "중간" : "최종"} 결론을 선택하세요.</p>
        {team && (
          <p className="text-xs text-zinc-600 font-mono">{team.teamNumber}조 · {team.leaderName}</p>
        )}
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

      {voteLocked && (
        <p className="text-sm text-amber-500/80 text-center rounded-lg border border-amber-500/20 bg-amber-500/5 py-3 px-4">
          증거 {collectedCount}/{VOTE_UNLOCK_COUNT}개 수집됨 — 추리 제출까지 {VOTE_UNLOCK_COUNT - collectedCount}개 더 필요합니다
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || submitting || voteLocked}
        className={`w-full rounded-lg py-4 text-base font-bold transition-all active:scale-[0.98] ${
          selected && !submitting && !voteLocked
            ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        {submitting
          ? "제출 중..."
          : voteLocked
          ? `증거 ${VOTE_UNLOCK_COUNT - collectedCount}개 추가 수집 시 제출 가능`
          : selected
          ? `용의자 ${selected} — ${isRound1 ? "중간" : "최종"} 추리 제출`
          : "용의자를 선택하세요"}
      </button>

      <p className="text-xs text-zinc-600 text-center">
        {isRound1
          ? "중간 추리입니다. 최종 투표가 열리면 다시 선택할 수 있습니다."
          : "최종 추리입니다. 신중하게 판단하여 제출하세요."}
      </p>
    </div>
  );
}
