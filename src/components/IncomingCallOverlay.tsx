"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { INCOMING_CALL_AUDIO_URL } from "@/lib/data";
import { markIncomingCallHandled, useIncomingCall } from "@/lib/useIncomingCall";
import { getIsCallDevice, setHasLastCallRecording } from "@/lib/store";
import { armAudioUnlock, startRingtone, stopRingtone } from "@/lib/ringtone";

type CallScreen = "incoming" | "calling" | "ended";

const CALLER_NAME = "박미리 탐정";
const CALLER_NUMBER = "010-9876-2345";
const CALLER_INITIALS = "미리";

export default function IncomingCallOverlay() {
  const { active, eventId, loaded } = useIncomingCall();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [screen, setScreen] = useState<CallScreen>("incoming");
  const [seconds, setSeconds] = useState(0);
  const [audioError, setAudioError] = useState(false);

  // 전화는 수신 전용 기기(공기계, /phone에서 지정)에만 뜬다.
  const canShow = pathname !== "/admin" && pathname !== "/ending" && getIsCallDevice();
  const visible = loaded && active && canShow && !!eventId;

  useEffect(() => {
    if (!visible) {
      setScreen("incoming");
      setSeconds(0);
      setAudioError(false);
      if (timerRef.current) clearInterval(timerRef.current);
      audioRef.current?.pause();
      audioRef.current = null;
    }
  }, [visible]);

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
    setAudioError(false);
    setHasLastCallRecording(true);
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

          <div className="relative flex items-center justify-between px-14 pb-[max(3rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={accept}
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#16a77a] text-white shadow-[0_3px_10px_rgba(23,133,106,0.32)] active:scale-95"
              aria-label="전화 받기"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7">
                <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.836 1.66l-1.183.516a11.037 11.037 0 006.105 6.105l.516-1.183a1.5 1.5 0 011.66-.836l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={decline}
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#ef5247] text-white shadow-[0_3px_10px_rgba(182,53,50,0.32)] active:scale-95"
              aria-label="전화 거절"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7 rotate-[135deg]">
                <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.836 1.66l-1.183.516a11.037 11.037 0 006.105 6.105l.516-1.183a1.5 1.5 0 011.66-.836l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" />
              </svg>
            </button>
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
