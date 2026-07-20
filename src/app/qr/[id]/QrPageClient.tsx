"use client";

import Link from "next/link";
import { useState } from "react";
import type { InterrogationQuiz } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";

interface Props {
  qrId: string;
  location: string;
  quiz: InterrogationQuiz | null;
  suspectName: string | null;
}

function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

export default function QrPageClient({ qrId, location, quiz, suspectName }: Props) {
  const { interrogationEarned, earnInterrogation } = useTeamEvidence();
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const earned = quiz ? interrogationEarned.includes(quiz.suspectId) || success : false;

  async function handleAutoGrant() {
    if (!quiz?.autoGrant || submitting) return;
    setSubmitting(true);
    try {
      await earnInterrogation(quiz.suspectId);
      navigator.vibrate?.(30);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (!quiz || !quiz.answer || submitting) return;

    if (normalizeAnswer(answer) !== normalizeAnswer(quiz.answer)) {
      setWrong(true);
      return;
    }

    setSubmitting(true);
    setWrong(false);
    try {
      await earnInterrogation(quiz.suspectId);
      navigator.vibrate?.(30);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <Link
        href="/home"
        className="flex w-fit items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        수사본부
      </Link>

      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">{qrId}</div>
        <h1 className="text-2xl font-bold text-zinc-100">{location}</h1>
      </div>

      {!quiz ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm font-medium text-zinc-300">이 지점에는 아직 등록된 문제가 없습니다.</p>
          <p className="mt-1 text-xs text-zinc-600">다른 QR을 확인하세요.</p>
        </div>
      ) : earned ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-300">
            Interrogation Pass
          </p>
          <h2 className="mt-2 text-xl font-black text-emerald-100">
            {suspectName ?? quiz.suspectId} 심문권 획득
          </h2>
          <p className="mt-2 text-sm text-emerald-100/70">
            이미 심문권을 획득했습니다. 용의자 파일에서 티켓을 확인하세요.
          </p>
        </div>
      ) : quiz.autoGrant ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 text-center">
          <p className="text-sm font-semibold text-amber-100">이 QR을 확인해 심문권을 획득할 수 있습니다.</p>
          <button type="button" onClick={handleAutoGrant} disabled={submitting} className="mt-4 w-full rounded bg-amber-400 py-3 text-sm font-bold text-zinc-950 disabled:opacity-50">
            {submitting ? "획득 중..." : "심문권 획득"}
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              심문권 퀴즈
            </p>
            <p className="text-base font-semibold leading-relaxed text-zinc-100">
              {quiz.question}
            </p>
            <p className="text-xs text-zinc-500">
              정답을 맞히면 {suspectName ?? quiz.suspectId} 심문권을 얻습니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                placeholder="정답 입력"
                className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="shrink-0 rounded bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition-colors disabled:opacity-50"
              >
                확인
              </button>
            </div>
            {wrong && <p className="text-xs text-red-400">정답이 아닙니다.</p>}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-500">획득한 심문권은 용의자 파일에서 확인합니다.</span>
        <Link
          href="/suspects"
          className="shrink-0 text-xs font-medium text-amber-400 hover:text-amber-300"
        >
          용의자 파일 →
        </Link>
      </div>
    </div>
  );
}
