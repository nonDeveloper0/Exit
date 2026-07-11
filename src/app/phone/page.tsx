"use client";

import { useEffect, useState } from "react";
import { getIsCallDevice, setCallDevice } from "@/lib/store";

// 수신전화 전용 기기(공기계) 대기 화면.
// 이 URL을 여는 기기를 "전화 받는 기기"로 지정한다. 관리자가 전화를 걸면
// 이 기기에만 IncomingCallOverlay가 뜬다. 다른 참가자 기기에는 전화가 오지 않는다.
export default function PhoneDevicePage() {
  const [isDevice, setIsDevice] = useState(false);
  const [now, setNow] = useState<string>("");

  // 접속하면 이 기기를 수신 전용으로 지정
  useEffect(() => {
    setCallDevice(true);
    setIsDevice(getIsCallDevice());
  }, []);

  // 대기 화면 시계
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

  function toggle() {
    const next = !getIsCallDevice();
    setCallDevice(next);
    setIsDevice(next);
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[radial-gradient(circle_at_50%_20%,rgba(30,41,59,0.9),#020617_70%)] text-zinc-100">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl font-light tracking-tight text-zinc-100">{now}</div>
        <p className="mt-3 text-sm text-zinc-400">피해자의 휴대폰</p>

        <div
          className={`mt-10 rounded-full border px-4 py-2 text-xs font-mono tracking-wider ${
            isDevice
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
              : "border-zinc-700 bg-zinc-900 text-zinc-500"
          }`}
        >
          {isDevice ? "● 수신 대기 중" : "○ 수신 꺼짐"}
        </div>
      </div>

      <div className="px-8 pb-12 text-center">
        <p className="mb-4 text-xs leading-relaxed text-zinc-500">
          이 기기에만 전화가 옵니다. 관리자 화면에서 &lsquo;전화 걸기&rsquo;를 누르면
          이 화면 위로 수신 화면이 뜹니다.
        </p>
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 active:scale-95"
        >
          {isDevice ? "수신 해제" : "수신 켜기"}
        </button>
      </div>
    </div>
  );
}
