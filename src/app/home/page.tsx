"use client";

import { useState } from "react";
import { EVIDENCE, QR_CODES } from "@/lib/data";
import { useTeamEvidence } from "@/lib/useTeamEvidence";

export default function MainPage() {
  const { collected } = useTeamEvidence();

  const progress = EVIDENCE.length > 0 ? (collected.length / EVIDENCE.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          Special Investigation Unit
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 leading-tight">
          NS건설
          <br />
          공사 현장 살인사건
        </h1>
        <p className="text-sm text-zinc-500">수사본부 • 2026</p>
      </div>

      {/* Case Brief */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
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
            <span>NS건설 공사 현장 B2 구역</span>
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
          <span className="text-sm font-medium text-zinc-300">증거 수집 현황</span>
          <span className="text-sm font-mono text-amber-400 font-bold">
            {collected.length} / {EVIDENCE.length}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500">QR 코드를 스캔해 현장 곳곳의 증거를 수집하세요.</p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-amber-400">수사 방법</h2>
        <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
          <li>각 장소에 있는 QR 코드를 스캔한다</li>
          <li>해당 구역의 증거를 수집한다</li>
          <li>용의자 파일을 검토한다</li>
          <li>범인을 선택하고 최종 추리를 제출한다</li>
        </ol>
      </div>

      {/* QR Map */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">QR 수집 현황</h2>
        <div className="grid grid-cols-6 gap-2">
          {QR_CODES.map((qr, index) => {
            const qrEvidence = EVIDENCE.filter((e) => qr.evidenceIds.includes(e.id));
            const hasCollected = qrEvidence.some((e) => collected.includes(e.id));
            const allCollected = qrEvidence.every((e) => collected.includes(e.id));

            return (
              <div
                key={qr.id}
                className={`rounded border p-3 flex flex-col items-center gap-1 ${
                  allCollected
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : hasCollected
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <span className="text-xs font-mono text-zinc-500">QR{index + 1}</span>
                {allCollected ? (
                  <span className="text-xs text-emerald-400">✓</span>
                ) : hasCollected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
