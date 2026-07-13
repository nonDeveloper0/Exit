"use client";

import { useEffect, useState } from "react";
import { setCallDevice } from "@/lib/store";

// 나팀장의 개인폰을 수신 전용 기기로 지정하는 대기 화면.
export default function PhoneDevicePage() {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setCallDevice(true);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_28%,#26384a_0%,#101923_54%,#03070b_100%)] text-zinc-100">
      <div className="-mt-10 text-center">
        <time className="block text-6xl font-extralight tracking-[-0.06em] text-white/95" dateTime={now}>
          {now}
        </time>
        <p className="mt-4 text-sm font-medium tracking-[0.08em] text-white/55">나팀장 개인폰</p>
      </div>
    </div>
  );
}
