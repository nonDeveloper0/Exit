"use client";

import { usePhotoEvidence } from "@/lib/usePhotoEvidence";

export default function MainPage() {
  const { photos } = usePhotoEvidence();

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Special Investigation Unit
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 leading-tight">
          녹산건설
          <br />
          물류창고 살인사건
        </h1>
        <p className="text-sm text-zinc-500">수사본부 • 2026</p>
      </div>

      {/* Case Brief */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-emerald-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            수사 진행 중
          </span>
        </div>
        <div className="space-y-2 text-sm text-zinc-300">
          <div className="flex gap-3">
            <span className="text-zinc-500 shrink-0 w-16 font-mono text-xs pt-0.5">피해자</span>
            <span>현장 관리자 (신원 확인됨)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-zinc-500 shrink-0 w-16 font-mono text-xs pt-0.5">장소</span>
            <span>녹산건설 물류창고 B2 구역</span>
          </div>
          <div className="flex gap-3">
            <span className="text-zinc-500 shrink-0 w-16 font-mono text-xs pt-0.5">용의자</span>
            <span>A, B, C, D, E — 5인</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 border-t border-zinc-800 pt-2">
          노동자를 폭행하던 피해자와 몸싸움이 벌어졌다. 피해자 사망. 범인은 현장을 떠났다.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">팀 사진 증거</span>
          <span className="text-sm font-mono text-amber-400 font-bold">
            {photos.length}장
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          현장의 물리 단서를 촬영해 증거함에 올리고, 관련 인물을 태그하세요.
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-amber-400">수사 방법</h2>
        <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
          <li>현장의 물리 단서를 사진으로 촬영해 증거함에 올린다</li>
          <li>사진마다 관련 인물을 태그한다</li>
          <li>QR을 찍어 문제를 풀면 용의자 심문권을 얻는다</li>
          <li>범인을 선택하고 최종 추리를 제출한다</li>
        </ol>
      </div>

      {/*
        구버전 장소별 단서 현황은 E01~E16 QR 수집 방식 전용이라 사진 증거 방식에서는 비노출한다.
        QR_CODES/EVIDENCE 데이터 자체는 data.ts에 보존한다.
      */}
    </div>
  );
}
