"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Evidence, LOCKED_EVIDENCE, EVIDENCE_QUIZ } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";

interface Props {
  qrId: string;
  location: string;
  evidence: Evidence[];
}

export default function QrPageClient({ qrId, location, evidence }: Props) {
  const { collected, unlocked, collect, unlock } = useTeamEvidence();
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [videoOpenId, setVideoOpenId] = useState<string | null>(null);

  function handlePlay(e: Evidence) {
    if (!e.audioUrl) return;
    if (playingId === e.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(e.audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingId(e.id);
    audio.onended = () => setPlayingId(null);
  }

  async function handleCollect(id: string) {
    await collect(id);
  }

  async function handlePasswordSubmit(e: Evidence) {
    const input = (passwords[e.id] ?? "").trim();
    const correct = LOCKED_EVIDENCE[e.id];
    if (input === correct) {
      await unlock(e.id);
      setWrongIds((prev) => prev.filter((id) => id !== e.id));
      await handleCollect(e.id);
    } else {
      setWrongIds((prev) => (prev.includes(e.id) ? prev : [...prev, e.id]));
    }
  }

  const hasEvidence = evidence.length > 0;

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Back link */}
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

      {/* QR header */}
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          {qrId}
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">{location}</h1>
      </div>


      {/* Evidence list */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          수집 가능한 증거
        </h2>

        {hasEvidence ? (
          <div className="space-y-3">
            {evidence.map((e) => {
              const isCollected = collected.includes(e.id);
              const isLocked = e.id in LOCKED_EVIDENCE;
              const isUnlocked = unlocked.includes(e.id);
              const isWrong = wrongIds.includes(e.id);
              const showLockUI = isLocked && !isUnlocked && !isCollected;

              return (
                <div
                  key={e.id}
                  className={`rounded-lg border p-4 space-y-3 transition-colors ${
                    isCollected
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : showLockUI
                      ? "border-zinc-700 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">{e.id}</span>
                        {isCollected && (
                          <span className="text-xs text-emerald-400 font-medium">✓ 수집 완료</span>
                        )}
                        {showLockUI && (
                          <span className="text-xs text-amber-500 font-medium">🔒 잠김</span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-zinc-100">{e.title}</h3>
                    </div>
                    {isCollected ? (
                      <div className="shrink-0 rounded bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        완료
                      </div>
                    ) : !showLockUI && !isLocked ? (
                      <button
                        onClick={() => handleCollect(e.id)}
                        className="shrink-0 rounded bg-amber-400 px-4 py-1.5 text-xs font-bold text-zinc-900 hover:bg-amber-300 active:scale-95 transition-all"
                      >
                        수집
                      </button>
                    ) : null}
                  </div>

                  {showLockUI && (
                    <div className="space-y-2">
                      {EVIDENCE_QUIZ[e.id] ? (
                        <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                          {EVIDENCE_QUIZ[e.id]}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500">비밀번호를 입력하면 단서가 공개됩니다.</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={passwords[e.id] ?? ""}
                          onChange={(ev) =>
                            setPasswords((prev) => ({ ...prev, [e.id]: ev.target.value }))
                          }
                          onKeyDown={(ev) => ev.key === "Enter" && handlePasswordSubmit(e)}
                          placeholder="비밀번호"
                          className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handlePasswordSubmit(e)}
                          className="shrink-0 rounded bg-amber-400 px-4 py-1.5 text-xs font-bold text-zinc-900 hover:bg-amber-300 active:scale-95 transition-all"
                        >
                          확인
                        </button>
                      </div>
                      {isWrong && (
                        <p className="text-xs text-red-400">비밀번호가 틀렸습니다.</p>
                      )}
                    </div>
                  )}

                  {!showLockUI && (
                    <>
                      {e.imageUrl && (
                        <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                          <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
                        </div>
                      )}
                      <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                        {e.description}
                      </p>
                      {e.videoUrl && (
                        <div className="space-y-2">
                          <button
                            onClick={() => setVideoOpenId(videoOpenId === e.id ? null : e.id)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                              videoOpenId === e.id
                                ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                            }`}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            {videoOpenId === e.id ? "영상 닫기" : "영상 힌트 보기"}
                          </button>
                          {videoOpenId === e.id && (
                            <video
                              src={e.videoUrl}
                              controls
                              playsInline
                              className="w-full rounded-lg"
                            />
                          )}
                        </div>
                      )}
                      {e.audioUrl && (
                        <button
                          onClick={() => handlePlay(e)}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                            playingId === e.id
                              ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                              : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                          }`}
                        >
                          {playingId === e.id ? (
                            <>
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                              </svg>
                              재생 중
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              음성 힌트 재생
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center space-y-1">
            <p className="text-sm text-zinc-500">이 구역에서는 수집 가능한 증거가 없습니다.</p>
            <p className="text-xs text-zinc-600">주변을 더 살펴보세요.</p>
          </div>
        )}
      </div>

      {/* Navigation hint */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 flex items-center justify-between">
        <span className="text-xs text-zinc-500">증거를 모두 수집했나요?</span>
        <Link
          href="/evidence"
          className="text-xs text-amber-400 hover:text-amber-300 font-medium"
        >
          증거함 확인 →
        </Link>
      </div>
    </div>
  );
}
