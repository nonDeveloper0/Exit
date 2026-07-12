"use client";

// 제한 시간 카운트다운 배너. 관리자가 /admin에서 타이머를 시작하면
// 전역 마커(useBroadcastEvent)의 created_at(=종료 시각)을 읽어 모든 참가자 기기가
// 동일하게 카운트다운하고, 0이 되면 경보음(playAlarm)이 1회 울린다.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TIMER_EVENT_ID, TIMER_EVENT_TYPE } from "@/lib/data";
import { useBroadcastEvent } from "@/lib/useBroadcastEvent";
import { playAlarm } from "@/lib/ringtone";

export default function TimerOverlay() {
  const { active, eventId, loaded } = useBroadcastEvent(TIMER_EVENT_ID, TIMER_EVENT_TYPE);
  const pathname = usePathname();
  const [now, setNow] = useState(() => Date.now());
  const sawRunningFor = useRef<string | null>(null);
  const alarmedFor = useRef<string | null>(null);

  const endsAt = eventId ? Date.parse(eventId) : null;
  const visible = loaded && active && endsAt !== null && pathname !== "/admin";

  // 표시 중에는 매초 갱신
  useEffect(() => {
    if (!visible) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [visible, eventId]);

  const remaining = endsAt !== null ? Math.max(0, endsAt - now) : 0;
  const finished = visible && remaining <= 0;

  // 종료 시 1회 경보. 단, 실제로 카운트다운이 도는 걸 본 이벤트에서만 울려
  // (이미 끝난 타이머로 뒤늦게 접속/새로고침한 기기가 경보를 울리지 않게 한다)
  useEffect(() => {
    if (!visible || !eventId) return;
    if (remaining > 0) {
      sawRunningFor.current = eventId;
    } else if (sawRunningFor.current === eventId && alarmedFor.current !== eventId) {
      alarmedFor.current = eventId;
      playAlarm();
    }
  }, [visible, eventId, remaining]);

  if (!visible) return null;

  const totalSec = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const urgent = !finished && remaining <= 60_000;

  return (
    <div className="fixed inset-x-0 top-0 z-[90] flex justify-center px-3 pt-2">
      <div
        className={`flex w-full max-w-md items-center justify-between gap-3 rounded-b-xl border px-4 py-2.5 shadow-lg backdrop-blur ${
          finished
            ? "border-red-500/50 bg-red-950/90 text-red-100 animate-pulse"
            : urgent
            ? "border-red-500/40 bg-red-950/85 text-red-100"
            : "border-amber-400/30 bg-zinc-900/90 text-amber-100"
        }`}
      >
        <span className="text-xs font-mono uppercase tracking-widest opacity-80">
          {finished ? "시간 종료" : "남은 시간"}
        </span>
        <span
          className={`font-mono text-2xl font-bold tabular-nums ${
            finished || urgent ? "text-red-300" : "text-amber-300"
          }`}
        >
          {finished ? "00:00" : `${mm}:${ss}`}
        </span>
      </div>
    </div>
  );
}
