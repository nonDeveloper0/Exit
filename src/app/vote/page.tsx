"use client";

import { useState, useEffect } from "react";
import { SUSPECTS, VOTE_UNLOCK_COUNT } from "@/lib/data";
import { getVote, castVote, getTeamInfo, getSubmitCount, incrementSubmitCount, getCollectedEvidence } from "@/lib/store";

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
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [team, setTeam] = useState<{ teamNumber: string; leaderName: string } | null>(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);

  useEffect(() => {
    const vote = getVote();
    const teamInfo = getTeamInfo();
    if (vote) { setSelected(vote); setSubmitted(true); }
    setTeam(teamInfo);
    setSubmitCount(getSubmitCount());
    setCollectedCount(getCollectedEvidence().length);
  }, []);

  const voteLocked = VOTE_UNLOCK_COUNT > 0 && collectedCount < VOTE_UNLOCK_COUNT;

  async function handleSubmit() {
    if (!selected || !team) return;
    setSubmitting(true);
    try {
      await submitToGoogleForm(team.teamNumber, team.leaderName, selected);
    } catch {
      // no-cors 응답은 읽을 수 없으나 제출은 정상 처리됨
    }
    castVote(selected);
    incrementSubmitCount();
    setSubmitCount((c) => c + 1);
    setSubmitted(true);
    setSubmitting(false);
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
          <p className="text-sm text-zinc-400">{team?.teamNumber}조의 최종 선택</p>
          <p className="text-5xl font-black text-emerald-400">{selected}</p>
          <p className="text-base font-semibold text-zinc-200">{votedSuspect?.role}</p>
          <p className="text-xs text-zinc-500 pt-1">조장: {team?.leaderName}</p>
        </div>

        <p className="text-sm text-zinc-500 text-center">
          모든 조의 추리가 끝나면 진실이 공개됩니다.
        </p>

        {submitCount < 2 ? (
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-zinc-600 hover:text-zinc-400 text-center mt-2"
          >
            다시 선택하기 ({2 - submitCount}회 남음)
          </button>
        ) : (
          <p className="text-xs text-zinc-700 text-center mt-2">제출 횟수를 모두 사용했습니다</p>
        )}
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
          ? `용의자 ${selected} — 범인으로 지목`
          : "용의자를 선택하세요"}
      </button>

      <p className="text-xs text-zinc-600 text-center">정답 제출은 단 2회만 가능합니다.<br/>
        충분한 증거를 수집한 후 신중하게 판단하여 제출하세요</p>
    </div>
  );
}
