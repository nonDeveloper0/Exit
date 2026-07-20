"use client";

import { useState } from "react";
import { usePhotoEvidence } from "@/lib/usePhotoEvidence";
import { formatPairTeamName, getPairTeamTone } from "@/lib/pairTeam";
import { usePairTeamName } from "@/lib/usePairTeamName";
// [비활성] 수사현황 실시간 순위 관련 import — 복원 시 함께 주석 해제
// import { useEffect, useState } from "react";
// import { useAllTeamsProgress } from "@/lib/useAllTeamsProgress";
// import { getTeamInfo } from "@/lib/store";

export default function MainPage() {
  const { photos } = usePhotoEvidence();
  const pairTeam = usePairTeamName();
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  // [비활성] 수사현황 실시간 순위 — 아래 훅/상태와 하단 JSX 블록을 함께 주석 해제하면 복원됨
  // const { groups } = useAllTeamsProgress();
  // const [myTeamId, setMyTeamId] = useState<string | null>(null);
  //
  // useEffect(() => {
  //   const team = getTeamInfo();
  //   if (team) setMyTeamId(team.teamNumber);
  // }, []);

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">Special Investigation Unit</div>
          {pairTeam && <div className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPairTeamTone(pairTeam.name)}`}>{formatPairTeamName(pairTeam.name, pairTeam.index)}</div>}
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
            <span>박실장 (신원 확인됨)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-zinc-500 shrink-0 w-16 font-mono text-xs pt-0.5">장소</span>
            <span>녹산건설 자재물류창고 B-4 구역</span>
          </div>
          <div className="flex gap-3">
            <span className="text-zinc-500 shrink-0 w-16 font-mono text-xs pt-0.5">용의자</span>
            <span>나사장, 채소장, 나팀장, 이대리, 김사원</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 border-t border-zinc-800 pt-2">
          회사 내부 감사를 하루 앞둔 밤..
          물류창고 관리자인 박실장이 창고에서 숨진 채 발견됐다.
          현장에는 외부인 침입 흔적은 없었고, 사건발생 당시 회사에 있던 사람은 단 다섯 명.
          형사는 이 다섯 사람을 용의자로 특정한다.
        </p>
        <p className="text-xs font-mono font-bold text-amber-400">사망추정시간 20:40-20:50</p>
      </div>

      {/* Timetable */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-zinc-300">진행 시간표</h2>
        <button type="button" onClick={() => setIsTimetableOpen(true)} className="block w-full cursor-zoom-in rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/70" aria-label="진행 시간표 크게 보기">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/타임테이블.png" alt="진행 시간표" className="w-full rounded-lg border border-zinc-800" />
        </button>
        <p className="text-xs text-zinc-500">이미지를 누르면 크게 볼 수 있습니다.</p>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">팀 사진 증거수집 현황</span>
          <span className="text-sm font-mono text-amber-400 font-bold">
            {photos.length}장
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          현장의 단서를 촬영해 증거함에 올리세요.
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-amber-400">수사 방법</h2>
        <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
          <li>현장의 단서를 사진으로 촬영하여 증거함에 기록한다</li>
          <li>QR을 찍어 문제를 풀면 용의자 심문권을 얻는다</li>
          <li>범인을 선택하고 최종 추리를 제출한다</li>
        </ol>
      </div>

      {/* [비활성] 수사현황 실시간 순위 — 복원하려면 이 블록과 상단 훅/import 주석을 함께 해제
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-semibold text-zinc-300">수사 현황 · 증거수집 순위</h2>
        <span className="text-xs text-zinc-600">전체 조 실시간</span>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-sm text-zinc-500">아직 수집 중인 조가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group, index) => {
            const isMe = myTeamId !== null && group.teamIds.includes(myTeamId);
            const rank = index + 1;
            const rankColor =
              rank === 1 ? "text-amber-400" :
              rank === 2 ? "text-zinc-300" :
              rank === 3 ? "text-amber-700" :
              "text-zinc-600";

            return (
              <div
                key={group.label}
                className={`rounded-lg border p-4 space-y-2 ${
                  isMe
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-black w-7 shrink-0 ${rankColor}`}>
                    {rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-bold ${isMe ? "text-amber-400" : "text-zinc-200"}`}>
                        {group.label}{isMe && " (나)"}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        사진 {group.count}장
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-zinc-600">실시간 업데이트 중</span>
      </div>
      */}
      {isTimetableOpen && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label="진행 시간표 크게 보기" onClick={() => setIsTimetableOpen(false)}><div className="relative max-h-full max-w-full" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setIsTimetableOpen(false)} className="absolute -right-2 -top-2 z-10 rounded-full border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-sm font-bold text-zinc-100 shadow-lg" aria-label="시간표 크게 보기 닫기">닫기</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/타임테이블.png" alt="진행 시간표 확대" className="max-h-[90vh] max-w-full rounded-lg border border-zinc-700 object-contain shadow-2xl" />
      </div></div>}
    </div>
  );
}
