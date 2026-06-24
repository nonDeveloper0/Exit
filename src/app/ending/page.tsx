"use client";

import { useState } from "react";
import Link from "next/link";

export default function EndingPage() {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center gap-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
            수사 종료
          </p>
          <h1 className="text-3xl font-black text-zinc-100">진실의 순간</h1>
          <p className="text-sm text-zinc-500">
            Egypt City 공사장 살인사건의 진실이 밝혀집니다.
          </p>
        </div>

        <button
          onClick={() => setRevealed(true)}
          className="rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold px-10 py-4 text-base transition-all"
        >
          진실 공개
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 pt-10 pb-12">
      {/* Verdict */}
      <div className="text-center space-y-4">
        <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
          최종 수사 결과
        </p>
        <h1 className="text-2xl font-bold text-zinc-100">진범은...</h1>

        <div className="rounded-xl border-2 border-red-500/50 bg-red-500/10 p-6 space-y-2">
          <p className="text-6xl font-black text-red-400">C</p>
          <p className="text-xl font-bold text-zinc-100">회장의 아들 M</p>
          <p className="text-sm text-zinc-500">신원 불명 / 사건 직후 잠적</p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-500 font-mono shrink-0">그런데...</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Moses Reveal */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-amber-400 text-center">M의 진짜 정체</h2>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">
            C(M)의 진짜 이름은{" "}
            <strong className="text-amber-400 text-base">모세</strong>
            입니다.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            노예처럼 착취당하던 히브리 노동자들을 폭행하는 이집트 감독관을 막다가,
            격렬한 싸움 끝에 감독관이 사망했습니다. 모세는 이집트를 떠나 광야로 향했습니다.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            여러분이 방금 수사한 이 사건은,
            <br />
            <span className="text-amber-400">출애굽기에 기록된 모세 이야기</span>
            입니다.
          </p>
        </div>

        {/* Key mapping */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            이야기 대조표
          </h3>
          <div className="space-y-2">
            {[
              ["피해자 (현장 관리자)", "이집트 감독관"],
              ["용의자 A (노동자 대표)", "히브리 노예들"],
              ["용의자 B (현장 소장)", "이집트 관료"],
              ["용의자 C — M", "모세"],
              ["Egypt City 공사장", "고대 이집트"],
            ].map(([left, right]) => (
              <div key={left} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400 flex-1">{left}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-amber-400 flex-1 text-right">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pt-2 space-y-1">
        <p className="text-sm text-zinc-400 leading-relaxed">
          여러분은 지금 모세의 이야기를 살았습니다.
        </p>
        <p className="text-xs text-zinc-600">EXIT 2026</p>
      </div>

      <Link href="/" className="text-center text-xs text-zinc-600 hover:text-zinc-400">
        수사본부로 돌아가기
      </Link>
    </div>
  );
}
