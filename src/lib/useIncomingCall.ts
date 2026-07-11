"use client";

// 수신전화 연출. pair_id가 CALL01을 받을 대상 조 번호이므로
// 수신 전용 공기계는 모든 조의 incoming_call 마커를 감시한다.
import { useEffect, useRef, useState } from "react";
import { INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE } from "./data";
import {
  broadcastHandledKey,
  clearBroadcastHandled,
  markBroadcastHandled,
} from "./useBroadcastEvent";
import { supabase } from "./supabase";

interface IncomingCallState {
  active: boolean;
  eventId: string | null;
  targetTeamId: string | null;
  loaded: boolean;
}

let channelCounter = 0;

export function useIncomingCall() {
  const [state, setState] = useState<IncomingCallState>({
    active: false,
    eventId: null,
    targetTeamId: null,
    loaded: false,
  });
  const channelName = useRef(`incoming_call_${++channelCounter}`).current;

  useEffect(() => {
    let mounted = true;

    function applyEvent(targetTeamId: string | null, createdAt: string | null) {
      if (!mounted) return;
      const handled =
        typeof window === "undefined"
          ? null
          : localStorage.getItem(
              broadcastHandledKey(INCOMING_CALL_EVENT_TYPE, INCOMING_CALL_EVENT_ID)
            );
      setState({
        active: !!createdAt && handled !== createdAt,
        eventId: createdAt,
        targetTeamId,
        loaded: true,
      });
    }

    supabase
      .from("team_evidence_items")
      .select("pair_id, created_at")
      .eq("evidence_id", INCOMING_CALL_EVENT_ID)
      .eq("type", INCOMING_CALL_EVENT_TYPE)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => applyEvent(data?.pair_id ?? null, data?.created_at ?? null));

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_evidence_items" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { evidence_id?: string; type?: string };
            if (
              oldRow.evidence_id === INCOMING_CALL_EVENT_ID &&
              oldRow.type === INCOMING_CALL_EVENT_TYPE
            ) {
              applyEvent(null, null);
            }
            return;
          }

          const newRow = payload.new as {
            pair_id?: string;
            evidence_id?: string;
            type?: string;
            created_at?: string;
          };
          if (
            newRow.evidence_id !== INCOMING_CALL_EVENT_ID ||
            newRow.type !== INCOMING_CALL_EVENT_TYPE
          ) {
            return;
          }
          applyEvent(newRow.pair_id ?? null, newRow.created_at ?? null);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return state;
}

export function markIncomingCallHandled(eventId: string) {
  markBroadcastHandled(INCOMING_CALL_EVENT_TYPE, INCOMING_CALL_EVENT_ID, eventId);
}

export function clearIncomingCallHandled() {
  clearBroadcastHandled(INCOMING_CALL_EVENT_TYPE, INCOMING_CALL_EVENT_ID);
}
