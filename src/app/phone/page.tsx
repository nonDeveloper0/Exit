"use client";

import { useEffect, useRef, useState } from "react";
import { INCOMING_CALL_AUDIO_URL } from "@/lib/data";
import {
  CALL_RECORDING_AVAILABLE_EVENT,
  getHasLastCallRecording,
  setCallDevice,
} from "@/lib/store";

// 나팀장의 개인폰을 수신 전용 기기로 지정하는 대기 화면.
export default function PhoneDevicePage() {
  const [now, setNow] = useState<string>("");
  const [hasRecording, setHasRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayError, setReplayError] = useState(false);
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCallDevice(true);
    const updateRecordingState = () => setHasRecording(getHasLastCallRecording());
    updateRecordingState();
    window.addEventListener(CALL_RECORDING_AVAILABLE_EVENT, updateRecordingState);
    return () => window.removeEventListener(CALL_RECORDING_AVAILABLE_EVENT, updateRecordingState);
  }, []);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      replayAudioRef.current?.pause();
    };
  }, []);

  async function replayCall() {
    replayAudioRef.current?.pause();
    const audio = new Audio(INCOMING_CALL_AUDIO_URL);
    replayAudioRef.current = audio;
    audio.onended = () => setIsReplaying(false);
    audio.onerror = () => {
      setIsReplaying(false);
      setReplayError(true);
    };

    setReplayError(false);
    setIsReplaying(true);
    try {
      await audio.play();
    } catch {
      setIsReplaying(false);
      setReplayError(true);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_28%,#26384a_0%,#101923_54%,#03070b_100%)] px-6 text-zinc-100">
      <div className="-mt-10 w-full text-center">
        <time className="block text-6xl font-extralight tracking-[-0.06em] text-white/95" dateTime={now}>
          {now}
        </time>
        <p className="mt-4 text-sm font-medium tracking-[0.08em] text-white/55">나팀장 개인폰</p>

        {hasRecording && (
          <div className="mt-12">
            <button
              type="button"
              onClick={replayCall}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-sm active:scale-[0.98]"
            >
              {isReplaying ? "통화내용 재생 중…" : "통화내용 다시 듣기"}
            </button>
            {replayError && <p className="mt-3 text-xs text-red-200">통화내용을 재생하지 못했습니다. 다시 시도해 주세요.</p>}
          </div>
        )}
      </div>
    </div>
  );
}