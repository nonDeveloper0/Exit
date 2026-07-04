"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTeamInfo } from "@/lib/store";
import { EVIDENCE } from "@/lib/data";
import { consumeSelfCollect } from "@/lib/collectSignal";

interface Toast {
  key: number;
  text: string;
}

let toastKey = 0;
let channelCounter = 0;

// 같은 조 다른 기기가 증거를 수집하면 상단에 알림. 내 기기 수집은 억제됨.
export default function TeamEvidenceToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const team = getTeamInfo();
    if (!team) return;
    const teamId = team.teamNumber.toUpperCase();

    const channel = supabase
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

          const key = ++toastKey;
          setToasts((prev) => [...prev, { key, text: `조원이 '${title}' 단서를 확보했습니다` }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.key !== key));
          }, 3500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="w-full rounded-lg border border-amber-400/40 bg-zinc-900/95 px-4 py-3 shadow-lg backdrop-blur animate-toast-in"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🔎</span>
            <span className="text-sm text-amber-200 font-medium">{t.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
