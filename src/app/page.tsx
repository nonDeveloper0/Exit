"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTeamInfo, saveTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";

// 참가 조 목록. 조 개수가 바뀌면 이 배열만 수정한다.
const TEAM_NUMBERS = ["1", "2", "3", "4", "5", "6"];
const TEAM_CHANGE_PIN = process.env.NEXT_PUBLIC_TEAM_CHANGE_PIN ?? "9999";

export default function LandingPage() {
  const router = useRouter();
  const [teamNumber, setTeamNumber] = useState("");
  const [name, setName] = useState("");
  const [savedTeam, setSavedTeam] = useState<{ teamNumber: string; name: string } | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [changePin, setChangePin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    const team = getTeamInfo();
    if (team) {
      if (TEAM_NUMBERS.includes(team.teamNumber)) setTeamNumber(team.teamNumber);
      setName(team.name);
      if (TEAM_NUMBERS.includes(team.teamNumber)) setSavedTeam(team);
    }
  }, []);

  function unlockChangeForm() {
    if (changePin !== TEAM_CHANGE_PIN) {
      setPinError("운영자 PIN이 일치하지 않습니다.");
      return;
    }
    setPinError("");
    setChangePin("");
    setIsChanging(true);
  }

  async function handleEnter() {
    if (!TEAM_NUMBERS.includes(teamNumber) || !name.trim()) return;
    const pairId = teamNumber;
    saveTeamInfo(pairId, name.trim());
    setSavedTeam({ teamNumber: pairId, name: name.trim() });
    await supabase
      .from("team_evidence_items")
      .upsert(
        { pair_id: pairId, evidence_id: "_joined", type: "joined" },
        { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
      );
    router.push("/home");
  }

  const canEnter = TEAM_NUMBERS.includes(teamNumber) && name.trim().length > 0;
  const isLocked = savedTeam !== null && !isChanging;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950">
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
      <div className="relative z-10 flex shrink-0 flex-col items-center justify-center gap-3 pt-8 pb-4 text-center sm:pt-14">
        <p className="text-xs font-mono text-amber-400/60 tracking-[0.45em] uppercase">
          2026 Summer Camp
        </p>
        <h1 className="text-7xl font-black leading-none tracking-tighter text-white text-glow-amber sm:text-[88px]">
          EXIT
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-zinc-700" />
          <span className="text-xs font-mono text-zinc-500 tracking-[0.35em] uppercase">Season 1</span>
          <div className="h-px w-10 bg-zinc-700" />
        </div>
      </div>

      {/* Team setup */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-3 overflow-y-auto px-6 py-3">
        {isLocked && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4">
            <p className="text-xs font-mono tracking-wider text-amber-300">현재 입장 정보</p>
            <p className="mt-1 text-lg font-bold text-zinc-100">{savedTeam.teamNumber}조 · {savedTeam.name || "이름 미입력"}</p>
          </div>
        )}
        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 tracking-wider uppercase">조 번호</p>
          <select
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            disabled={isLocked}
            className={`w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm focus:border-amber-400/50 focus:outline-none transition-colors ${
              teamNumber ? "text-zinc-100" : "text-zinc-600"
            }`}
          >
            <option value="" disabled>
              조 번호를 선택하세요
            </option>
            {TEAM_NUMBERS.map((n) => (
              <option key={n} value={n} className="text-zinc-100">
                {n}조
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 tracking-wider uppercase">이름</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            disabled={isLocked}
            placeholder="본명을 입력하세요"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {isLocked && (
        <div className="relative z-10 px-6 pb-3">
          <details className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3">
            <summary className="cursor-pointer text-sm font-medium text-zinc-300">조 또는 이름을 변경해야 하나요?</summary>
            <p className="mt-2 text-xs leading-5 text-zinc-500">Staff 확인 후 PIN을 입력하면 입장 정보를 변경할 수 있습니다.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="password"
                value={changePin}
                onChange={(event) => setChangePin(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && unlockChangeForm()}
                placeholder="운영자 PIN"
                className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none"
              />
              <button type="button" onClick={unlockChangeForm} className="rounded border border-amber-400/50 px-3 py-2 text-sm font-bold text-amber-300">확인</button>
            </div>
            {pinError && <p className="mt-2 text-xs text-red-300">{pinError}</p>}
          </details>
        </div>
      )}

      {/* Enter button */}
      <div className="relative z-10 shrink-0 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={handleEnter}
          disabled={!canEnter}
          className={`w-full py-4 text-center font-bold text-base rounded-lg tracking-widest uppercase transition-all active:scale-[0.98] ${
            canEnter
              ? "bg-amber-400 text-zinc-950"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {isChanging ? "변경 후 입장하기" : "입장하기"}
        </button>
      </div>
    </div>
  );
}
