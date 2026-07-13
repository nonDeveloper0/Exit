"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { INCOMING_CALL_AUDIO_URL, INCOMING_CALL_EVIDENCE_ID } from "@/lib/data";
import { markIncomingCallHandled, useIncomingCall } from "@/lib/useIncomingCall";
import { getIsCallDevice } from "@/lib/store";
import { armAudioUnlock, startRingtone, stopRingtone } from "@/lib/ringtone";
import { supabase } from "@/lib/supabase";

type CallScreen = "incoming" | "calling" | "ended";

const CALLER_NAME = "박미리 탐정";
const CALLER_NUMBER = "010-9876-2345";
const CALLER_INITIALS = "미리";

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

  const KNOB = 56; // 노브 지름(px) — 트랙 패딩(p-1.5=6px) 양쪽 제외
  function getMaxX() {
    const track = trackRef.current;
    if (!track) return 0;
    return track.clientWidth - KNOB - 12;
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
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#f7f9ff] text-[#202124]">
      {screen === "incoming" ? (
        <div className="relative flex min-h-full flex-col bg-[radial-gradient(circle_at_22%_48%,rgba(139,198,255,0.62),transparent_40%),radial-gradient(circle_at_84%_78%,rgba(179,139,255,0.72),transparent_48%),linear-gradient(180deg,#fbfcff_0%,#eef5ff_35%,#9cc8ff_68%,#9b88e5_100%)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),transparent)]" />

          <div className="relative flex items-center justify-between px-7 pt-5 text-sm font-semibold text-[#202124]/75">
            <span>12:45</span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-3 rounded-[2px] border border-white/80" />
              <span className="h-2.5 w-4 rounded-[3px] border border-white/80 after:block after:h-full after:w-2.5 after:rounded-[2px] after:bg-white/100" />
            </div>
          </div>

          <div className="relative flex flex-1 flex-col items-center px-8 pt-[11vh] text-center">
            <div className="mb-10 hidden items-center gap-2 text-lg font-medium text-white/90">
              <span className="text-xl">☎</span>
              <span>Incoming call</span>
            </div>

            <h1 className="max-w-full break-keep text-[39px] font-semibold leading-tight tracking-[-0.045em] text-[#202124]">
              {CALLER_NAME}
            </h1>
            <p className="mt-1.5 text-[15px] font-medium tracking-[0.02em] text-[#25262a]">{CALLER_NUMBER}</p>
            <p className="mt-3 hidden rounded-full bg-emerald-400/16 px-3 py-1 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/20">
              저장된 연락처
            </p>

            <div className="mt-7 flex h-[132px] w-[132px] items-center justify-center rounded-full border border-[#8999a6]/35 bg-[radial-gradient(circle_at_42%_28%,#f8fafb_0%,#dfe5e8_57%,#bdc7ce_100%)] text-3xl font-semibold tracking-[-0.1em] text-[#58636c] shadow-[0_4px_14px_rgba(43,67,93,0.12)]">
              {CALLER_INITIALS}
            </div>

            <p className="mt-8 hidden text-sm text-white/52">휴대전화 수신 중</p>
          </div>

          <div className="relative px-10 pb-[max(2.75rem,env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-center justify-between px-5">
              <button
                type="button"
                onClick={decline}
                className="flex flex-col items-center gap-2.5 text-[13px] font-medium text-[#202124]/78 active:scale-95"
                aria-label="전화 거절"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ef5247] text-2xl font-black text-white shadow-[0_3px_8px_rgba(182,53,50,0.28)]">
                  ✕
                </span>
                거절
              </button>

              <div className="hidden flex-col items-center gap-2 text-sm font-medium text-white/72" aria-hidden="true">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12 text-xl text-white/70 ring-1 ring-white/12">
                  ⋯
                </span>
                메시지
              </div>
            </div>

            <div
              ref={trackRef}
              className="relative flex h-[68px] items-center rounded-full bg-white/20 p-1.5 shadow-[inset_0_0_0_1px_rgba(60,72,94,0.10)] backdrop-blur-sm"
            >
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center pl-8 text-sm font-semibold text-[#385d74]/76 animate-slide-hint"
                style={{ opacity: dragX > 8 ? 0 : undefined }}
              >
                밀어서 받기
              </span>
              <button
                type="button"
                onPointerDown={onKnobDown}
                onPointerMove={onKnobMove}
                onPointerUp={onKnobUp}
                onPointerCancel={onKnobUp}
                style={{ transform: `translateX(${dragX}px)` }}
                className={`relative z-10 flex h-14 w-14 touch-none select-none items-center justify-center rounded-full bg-[#16a77a] text-2xl font-black text-white shadow-[0_3px_8px_rgba(23,133,106,0.3)] ${
                  dragging ? "" : "transition-transform duration-200"
                }`}
                aria-label="밀어서 전화 받기"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-full flex-col bg-[linear-gradient(180deg,#eef5ff_0%,#9cc8ff_58%,#9b88e5_100%)]">
          <div className="relative flex items-center justify-between px-7 pt-5 text-sm font-semibold text-[#202124]/75">
            <span>12:45</span>
            <span className="text-xs text-emerald-200/80">통화 연결됨</span>
          </div>

          <div className="flex flex-col items-center px-8 pt-14 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/36 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(213,239,245,0.9))] text-2xl font-bold text-[#1f4f65] shadow-[0_18px_54px_rgba(0,0,0,0.32)]">
              {CALLER_INITIALS}
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-normal text-white">{CALLER_NAME}</h1>
            <p className="mt-1 text-base font-medium text-white/62">{CALLER_NUMBER}</p>
            <p className="mt-4 text-lg font-mono text-emerald-300">{mm}:{ss}</p>
          </div>

          <div className="flex flex-1 items-center justify-center gap-1 px-10" aria-hidden="true">
            {Array.from({ length: 17 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-b from-emerald-200 via-cyan-300 to-sky-400 animate-call-wave"
                style={{ animationDelay: `${i * 0.055}s` }}
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
              className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#ff4b55] text-2xl font-black text-white shadow-[0_14px_34px_rgba(255,75,85,0.38)] active:scale-95"
              aria-label="통화 종료"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-5 w-full rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm font-bold text-white/76 backdrop-blur-sm active:bg-white/12"
            >
              통화 화면 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
