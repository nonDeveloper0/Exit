"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { INCOMING_CALL_AUDIO_URL, INCOMING_CALL_EVIDENCE_ID } from "@/lib/data";
import { markIncomingCallHandled, useIncomingCall } from "@/lib/useIncomingCall";
import { getIsCallDevice } from "@/lib/store";
import { armAudioUnlock, startRingtone, stopRingtone } from "@/lib/ringtone";
import { supabase } from "@/lib/supabase";

type CallScreen = "incoming" | "calling" | "ended";

export default function IncomingCallOverlay() {
  const { active, eventId, targetTeamId, loaded } = useIncomingCall();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [screen, setScreen] = useState<CallScreen>("incoming");
  const [seconds, setSeconds] = useState(0);
  const [audioError, setAudioError] = useState(false);

  // 밀어서 받기 슬라이더
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  // 전화는 수신 전용 기기(공기계, /phone에서 지정)에만 뜬다.
  const canShow = pathname !== "/admin" && pathname !== "/ending" && getIsCallDevice();
  const visible = loaded && active && canShow && !!eventId;

  useEffect(() => {
    if (!visible) {
      setScreen("incoming");
      setSeconds(0);
      setAudioError(false);
      setDragX(0);
      setDragging(false);
      draggingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      audioRef.current?.pause();
      audioRef.current = null;
    }
  }, [visible]);

  const KNOB = 48; // 노브 지름(px) — 트랙 패딩(p-2=8px) 양쪽 제외
  function getMaxX() {
    const track = trackRef.current;
    if (!track) return 0;
    return track.clientWidth - KNOB - 16;
  }

  function onKnobDown(e: React.PointerEvent) {
    draggingRef.current = true;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = dragX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onKnobMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const maxX = getMaxX();
    const next = Math.min(Math.max(dragStartOffset.current + (e.clientX - dragStartX.current), 0), maxX);
    setDragX(next);
  }

  function onKnobUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const maxX = getMaxX();
    if (maxX > 0 && dragX >= maxX * 0.85) {
      setDragX(maxX);
      accept();
    } else {
      setDragX(0);
    }
  }

  useEffect(() => {
    armAudioUnlock();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioRef.current?.pause();
      stopRingtone();
    };
  }, []);

  // 수신 화면이 떠 있는 동안 벨소리·진동 (받기/거절/이탈 시 정지)
  useEffect(() => {
    if (visible && screen === "incoming") {
      startRingtone();
      return () => stopRingtone();
    }
  }, [visible, screen]);

  function markHandled() {
    if (eventId) markIncomingCallHandled(eventId);
  }

  function decline() {
    markHandled();
    setScreen("ended");
  }

  async function accept() {
    stopRingtone();
    markHandled();
    if (targetTeamId) {
      void supabase.from("team_evidence_items").upsert(
        {
          pair_id: targetTeamId,
          evidence_id: INCOMING_CALL_EVIDENCE_ID,
          type: "collected",
        },
        { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
      );
    }
    setAudioError(false);
    setScreen("calling");
    setSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);

    const audio = new Audio(INCOMING_CALL_AUDIO_URL);
    audioRef.current = audio;
    audio.onended = endCall;
    audio.onerror = () => setAudioError(true);

    try {
      await audio.play();
    } catch {
      setAudioError(true);
    }
  }

  function endCall() {
    if (timerRef.current) clearInterval(timerRef.current);
    audioRef.current?.pause();
    audioRef.current = null;
    setScreen("ended");
  }

  function close() {
    markHandled();
    if (timerRef.current) clearInterval(timerRef.current);
    audioRef.current?.pause();
    audioRef.current = null;
    setScreen("ended");
  }

  if (!visible || screen === "ended") return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-zinc-100">
      {screen === "incoming" ? (
        <div className="flex min-h-full flex-col bg-[radial-gradient(circle_at_50%_18%,rgba(127,29,29,0.55),rgba(9,9,11,0.95)_48%,#020617_100%)]">
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 text-xs font-mono tracking-[0.32em] text-red-200/80">INCOMING CALL</div>
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-red-200/25 bg-red-950/50 shadow-[0_0_0_18px_rgba(239,68,68,0.08)] animate-call-pulse">
              <span className="text-4xl font-mono text-red-100">TEL</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">발신번호 표시제한</h1>
            <p className="mt-2 text-sm text-zinc-400">피해자의 휴대폰</p>
            <p className="mt-8 text-xs font-mono tracking-widest text-zinc-500">전화 수신 중</p>
          </div>

          <div className="px-8 pb-14">
            <div
              ref={trackRef}
              className="relative flex h-16 items-center rounded-full border border-emerald-400/20 bg-zinc-900/80 p-2"
            >
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-emerald-200/70 animate-slide-hint"
                style={{ opacity: dragX > 8 ? 0 : undefined }}
              >
                밀어서 받기 →
              </span>
              <button
                type="button"
                onPointerDown={onKnobDown}
                onPointerMove={onKnobMove}
                onPointerUp={onKnobUp}
                onPointerCancel={onKnobUp}
                style={{ transform: `translateX(${dragX}px)` }}
                className={`relative z-10 flex h-12 w-12 touch-none select-none items-center justify-center rounded-full bg-emerald-500 text-sm font-black tracking-wider text-white shadow-lg ${
                  dragging ? "" : "transition-transform duration-200"
                }`}
                aria-label="밀어서 전화 받기"
              >
                받기
              </button>
            </div>
            <button
              type="button"
              onClick={decline}
              className="mt-6 w-full text-center text-sm text-zinc-500 active:text-zinc-300"
              aria-label="전화 거절"
            >
              거절
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-full flex-col bg-[linear-gradient(180deg,#111827,#020617)]">
          <div className="flex flex-col items-center gap-3 px-8 pt-14 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg font-mono text-zinc-300">
              TEL
            </div>
            <h1 className="text-xl font-bold text-zinc-100">발신번호 표시제한</h1>
            <p className="text-sm font-mono text-emerald-400">{mm}:{ss}</p>
          </div>

          <div className="flex flex-1 items-center justify-center gap-1 px-10" aria-hidden="true">
            {Array.from({ length: 13 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-b from-sky-300 to-indigo-400 animate-call-wave"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>

          <div className="px-6 pb-10">
            {audioError && (
              <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                오디오를 재생하지 못했습니다. 다시 받기를 눌러 주세요.
              </p>
            )}
            <button
              type="button"
              onClick={endCall}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white active:scale-95"
              aria-label="통화 종료"
            >
              X
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-300"
            >
              통화 화면 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
