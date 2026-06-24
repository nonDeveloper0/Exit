"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTeamInfo, saveTeamInfo } from "@/lib/store";

export default function LandingPage() {
  const router = useRouter();
  const [teamNumber, setTeamNumber] = useState("");
  const [leaderName, setLeaderName] = useState("");

  useEffect(() => {
    const team = getTeamInfo();
    if (team) {
      setTeamNumber(team.teamNumber);
      setLeaderName(team.leaderName);
    }
  }, []);

  function handleEnter() {
    if (!teamNumber || !leaderName.trim()) return;
    saveTeamInfo(teamNumber, leaderName.trim());
    router.push("/home");
  }

  const canEnter = !!teamNumber && leaderName.trim().length > 0;

  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950 flex flex-col">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 420, height: 420,
            background: "#f59e0b", opacity: 0.1, filter: "blur(90px)",
            top: -100, right: -80,
            animation: "blob-one 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 380, height: 380,
            background: "#dc2626", opacity: 0.08, filter: "blur(80px)",
            bottom: 0, left: -80,
            animation: "blob-two 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300, height: 300,
            background: "#7c3aed", opacity: 0.07, filter: "blur(100px)",
            top: "45%", left: "20%",
            animation: "blob-three 13s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 grid-overlay" />
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 pt-14 pb-4 text-center">
        <p className="text-xs font-mono text-amber-400/60 tracking-[0.45em] uppercase">
          2026 Summer Camp
        </p>
        <h1 className="text-[88px] font-black text-white leading-none tracking-tighter text-glow-amber">
          EXIT
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-zinc-700" />
          <span className="text-xs font-mono text-zinc-500 tracking-[0.35em] uppercase">Season 1</span>
          <div className="h-px w-10 bg-zinc-700" />
        </div>
      </div>

      {/* Team setup */}
      <div className="relative z-10 flex flex-col gap-3 px-6 flex-1 justify-center">
        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 tracking-wider uppercase">팀(조) 번호</p>
          <input
            type="text"
            inputMode="numeric"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="조 번호 입력"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 tracking-wider uppercase">조장 이름</p>
          <input
            type="text"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="조장 이름 입력"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Enter button */}
      <div className="relative z-10 px-6 pb-12">
        <button
          onClick={handleEnter}
          disabled={!canEnter}
          className={`w-full py-4 text-center font-bold text-base rounded-lg tracking-widest uppercase transition-all active:scale-[0.98] ${
            canEnter
              ? "bg-amber-400 text-zinc-950"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          입장하기
        </button>
      </div>
    </div>
  );
}
