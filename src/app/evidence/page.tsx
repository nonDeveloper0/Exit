"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { EVIDENCE, INCOMING_CALL_EVIDENCE_ID } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";

function EvidenceContent() {
  const { collected } = useTeamEvidence();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const focusedRef = useRef<string | null>(null);

  // 용의자 페이지에서 넘어온 focus 단서를 펼치고 스크롤 + 강조
  useEffect(() => {
    if (!focusId || focusedRef.current === focusId || !collected.includes(focusId)) return;
    focusedRef.current = focusId;
    setExpanded(focusId);
    setHighlightId(focusId);
    document
      .getElementById(`evidence-${focusId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setHighlightId(null), 1600);
    return () => clearTimeout(t);
  }, [focusId, collected]);

  const progress = EVIDENCE.length > 0 ? (collected.length / EVIDENCE.length) * 100 : 0;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function getDisplayId(id: string) {
    if (id === INCOMING_CALL_EVIDENCE_ID) return "CALL";
    return id.replace("E", "");
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function loadAudio(id: string, audioUrl: string) {
    if (audioRef.current && activeAudioId === id) return audioRef.current;

    audioRef.current?.pause();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setActiveAudioId(id);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setActiveAudioId(null);
      setCurrentTime(0);
      setDuration(0);
    };

    return audio;
  }

  function handleAudioPlay(id: string, audioUrl: string) {
    const audio = loadAudio(id, audioUrl);
    void audio.play().catch(() => setIsPlaying(false));
  }

  function handleAudioPause() {
    audioRef.current?.pause();
  }

  function handleAudioReset() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }

  function handleAudioSeek(value: string) {
    const nextTime = Number(value);
    if (!Number.isFinite(nextTime)) return;
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
    setCurrentTime(nextTime);
  }

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
              id={`evidence-${e.id}`}
              className={`scroll-mt-20 rounded-lg border transition-all ${
                highlightId === e.id ? "ring-2 ring-amber-400 " : ""
              }${
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
                    {getDisplayId(e.id)}
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
                <div className="px-3 pb-3 border-t border-zinc-800 pt-3 space-y-2">
                  {e.imageUrl && (
                    <button
                      onClick={() => setLightbox(e.imageUrl!)}
                      className="relative w-full aspect-video rounded overflow-hidden block"
                    >
                      <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 hover:opacity-100 text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
                          눌러서 크게 보기
                        </span>
                      </div>
                    </button>
                  )}
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    {e.description}
                  </p>
                  {e.audioUrl && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          통화녹음 내역
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {formatTime(activeAudioId === e.id ? currentTime : 0)} /{" "}
                          {formatTime(activeAudioId === e.id ? duration : 0)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={activeAudioId === e.id && duration > 0 ? duration : 1}
                        step="0.1"
                        value={activeAudioId === e.id ? Math.min(currentTime, duration || 1) : 0}
                        onChange={(event) => handleAudioSeek(event.target.value)}
                        disabled={activeAudioId !== e.id || duration <= 0}
                        className="w-full accent-emerald-400"
                        aria-label="통화녹음 재생 위치"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAudioPlay(e.id, e.audioUrl!)}
                          disabled={activeAudioId === e.id && isPlaying}
                          className="flex h-10 w-11 items-center justify-center rounded border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 transition-colors disabled:opacity-40"
                          aria-label="통화녹음 재생"
                          title="재생"
                        >
                          <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-current" />
                        </button>
                        <button
                          type="button"
                          onClick={handleAudioPause}
                          disabled={activeAudioId !== e.id || !isPlaying}
                          className="flex h-10 w-11 items-center justify-center gap-1 rounded border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors disabled:opacity-40"
                          aria-label="통화녹음 일시정지"
                          title="일시정지"
                        >
                          <span className="h-4 w-1.5 rounded-sm bg-current" />
                          <span className="h-4 w-1.5 rounded-sm bg-current" />
                        </button>
                        <button
                          type="button"
                          onClick={handleAudioReset}
                          disabled={activeAudioId !== e.id}
                          className="flex h-10 w-11 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors disabled:opacity-40"
                          aria-label="통화녹음 정지 후 처음으로"
                          title="정지"
                        >
                          <span className="h-4 w-4 rounded-[2px] bg-current" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-md">
            <Image
              src={lightbox}
              alt="증거 이미지"
              width={800}
              height={600}
              className="w-full h-auto rounded object-contain"
            />
            <p className="text-center text-xs text-zinc-500 mt-2">탭하면 닫힘</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvidencePage() {
  return (
    <Suspense>
      <EvidenceContent />
    </Suspense>
  );
}
