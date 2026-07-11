"use client";

// 관리자 트리거 전역 연출의 범용 뼈대.
// (evidenceId, type) 마커 하나 = 연출 하나. team_evidence_items의 __global 행을 구독한다.
// 수신전화(useIncomingCall)가 이 훅 위에 재구성돼 있고, 문자/경보/방송 등도 이 훅으로 찍어낸다.
// 자세한 사용법: docs/01_md/12_MODULE_CATALOG.md §3~4

import { useEffect, useRef, useState } from "react";
import { GLOBAL_PAIR_ID } from "./data";
import { supabase } from "./supabase";

interface BroadcastState {
  active: boolean;
  eventId: string | null; // created_at — 새 발행마다 갱신
  loaded: boolean;
}

let channelCounter = 0;

export function broadcastHandledKey(type: string, evidenceId: string) {
  return `exit2026_bc_${type}_${evidenceId}`;
}

export function markBroadcastHandled(type: string, evidenceId: string, eventId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(broadcastHandledKey(type, evidenceId), eventId);
}

export function clearBroadcastHandled(type: string, evidenceId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(broadcastHandledKey(type, evidenceId));
}

export function useBroadcastEvent(evidenceId: string, type: string) {
  const [state, setState] = useState<BroadcastState>({
    active: false,
    eventId: null,
    loaded: false,
  });
  const channelName = useRef(`bc_${type}_${++channelCounter}`).current;

  useEffect(() => {
    let mounted = true;

    function applyEvent(createdAt: string | null) {
      if (!mounted) return;
      const handled =
        typeof window === "undefined"
          ? null
          : localStorage.getItem(broadcastHandledKey(type, evidenceId));
      setState({
        active: !!createdAt && handled !== createdAt,
        eventId: createdAt,
        loaded: true,
      });
    }

    supabase
      .from("team_evidence_items")
      .select("created_at")
      .eq("pair_id", GLOBAL_PAIR_ID)
      .eq("evidence_id", evidenceId)
      .eq("type", type)
      .maybeSingle()
      .then(({ data }) => applyEvent(data?.created_at ?? null));

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_evidence_items",
          filter: `pair_id=eq.${GLOBAL_PAIR_ID}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { evidence_id?: string; type?: string };
            if (oldRow.evidence_id === evidenceId && oldRow.type === type) {
              applyEvent(null);
            }
            return;
          }

          const newRow = payload.new as { evidence_id?: string; type?: string; created_at?: string };
          if (newRow.evidence_id !== evidenceId || newRow.type !== type) return;
          applyEvent(newRow.created_at ?? null);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [channelName, evidenceId, type]);

  function markHandled() {
    if (state.eventId) markBroadcastHandled(type, evidenceId, state.eventId);
  }

  return { ...state, markHandled };
}
