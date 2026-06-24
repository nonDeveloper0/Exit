"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Evidence, QrLocation } from "@/lib/data";
import { getCollectedEvidence, collectEvidence } from "@/lib/store";

interface Props {
  location: QrLocation;
  evidence: Evidence[];
}

export default function QrPageClient({ location, evidence }: Props) {
  const [collected, setCollected] = useState<string[]>([]);

  useEffect(() => {
    setCollected(getCollectedEvidence());
  }, []);

  function handleCollect(id: string) {
    collectEvidence(id);
    setCollected(getCollectedEvidence());
  }

  const hasEvidence = evidence.length > 0;

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Back link */}
      <Link
        href="/home"
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors w-fit"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        수사본부
      </Link>

      {/* Location header */}
      <div className="space-y-1">
        <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          {location.id}
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">{location.name}</h1>
        <p className="text-sm text-zinc-500">{location.description}</p>
      </div>

      {/* Location image */}
      {location.imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-800">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Evidence list */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          수집 가능한 증거
        </h2>

        {hasEvidence ? (
          <div className="space-y-3">
            {evidence.map((e) => {
              const isCollected = collected.includes(e.id);
              return (
                <div
                  key={e.id}
                  className={`rounded-lg border p-4 space-y-3 transition-colors ${
                    isCollected
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">{e.id}</span>
                        {isCollected && (
                          <span className="text-xs text-emerald-400 font-medium">✓ 수집 완료</span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-zinc-100">{e.title}</h3>
                    </div>
                    {isCollected ? (
                      <div className="shrink-0 rounded bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        완료
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCollect(e.id)}
                        className="shrink-0 rounded bg-amber-400 px-4 py-1.5 text-xs font-bold text-zinc-900 hover:bg-amber-300 active:scale-95 transition-all"
                      >
                        수집
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    {e.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center space-y-1">
            <p className="text-sm text-zinc-500">이 구역에서는 수집 가능한 증거가 없습니다.</p>
            <p className="text-xs text-zinc-600">주변을 더 살펴보세요.</p>
          </div>
        )}
      </div>

      {/* Navigation hint */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 flex items-center justify-between">
        <span className="text-xs text-zinc-500">증거를 모두 수집했나요?</span>
        <Link
          href="/evidence"
          className="text-xs text-amber-400 hover:text-amber-300 font-medium"
        >
          증거함 확인 →
        </Link>
      </div>
    </div>
  );
}
