"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTeamInfo } from "@/lib/store";
import { EVIDENCE, GLOBAL_PAIR_ID } from "@/lib/data";
import { consumeSelfCollect } from "@/lib/collectSignal";

interface Toast {
  key: number;
  text: string;
  variant: "team" | "global";
}

let toastKey = 0;
let channelCounter = 0;

// 같은 조 다른 기기가 수집하면 조 알림, 공통 단서가 처음 발견되면 전체 공지.
export default function TeamEvidenceToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const team = getTeamInfo();
    if (!team) return;
    const teamId = team.teamNumber.toUpperCase();

    function pushToast(text: string, variant: Toast["variant"], ttl: number) {
      const key = ++toastKey;
      setToasts((prev) => [...prev, { key, text, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== key));
      }, ttl);
    }

    // 내 조 증거 수집 알림 (내 기기 수집은 억제)
    const teamChannel = supabase
      .channel(`evidence_toast_${++channelCounter}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_evidence_items",
          filter: `pair_id=eq.${teamId}`,
        },
        (payload) => {
          const item = payload.new as { pair_id: string; evidence_id: string; type: string };
          if (item.type !== "collected") return;
          if (consumeSelfCollect(`${item.pair_id}:${item.evidence_id}`)) return;
          const title = EVIDENCE.find((e) => e.id === item.evidence_id)?.title;
          if (!title) return;
          pushToast(`조원이 '${title}' 단서를 확보했습니다`, "team", 3500);
        }
      )
      .subscribe();

    // 공통 단서 전체 공지 (전 참가자에게 1회)
    const globalChannel = supabase
      .channel(`evidence_global_toast_${++channelCounter}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_evidence_items",
          filter: `pair_id=eq.${GLOBAL_PAIR_ID}`,
        },
        (payload) => {
          const item = payload.new as { evidence_id: string; type: string };
          if (item.type !== "collected") return;
          const title = EVIDENCE.find((e) => e.id === item.evidence_id)?.title;
          if (!title) return;
          pushToast(`공통 단서 '${title}'가 전체 공개되었습니다`, "global", 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamChannel);
      supabase.removeChannel(globalChannel);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((t) =>
        t.variant === "global" ? (
          <div
            key={t.key}
            className="w-full rounded-lg border border-red-400/50 bg-red-950/95 px-4 py-3 shadow-lg backdrop-blur animate-toast-in"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🚨</span>
              <span className="text-sm text-red-100 font-bold">{t.text}</span>
            </div>
          </div>
        ) : (
          <div
            key={t.key}
            className="w-full rounded-lg border border-amber-400/40 bg-zinc-900/95 px-4 py-3 shadow-lg backdrop-blur animate-toast-in"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🔎</span>
              <span className="text-sm text-amber-200 font-medium">{t.text}</span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
