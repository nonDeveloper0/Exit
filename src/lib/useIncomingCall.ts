"use client";

import { useEffect, useRef, useState } from "react";
import { GLOBAL_PAIR_ID, INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE } from "./data";
import { supabase } from "./supabase";

const HANDLED_KEY = "exit2026_incoming_call_handled";

interface IncomingCallState {
  active: boolean;
  eventId: string | null;
  loaded: boolean;
}

let channelCounter = 0;

function getHandledEventId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HANDLED_KEY);
}

export function markIncomingCallHandled(eventId: string) {
  localStorage.setItem(HANDLED_KEY, eventId);
}

export function clearIncomingCallHandled() {
  localStorage.removeItem(HANDLED_KEY);
}

export function useIncomingCall() {
  const [state, setState] = useState<IncomingCallState>({
    active: false,
    eventId: null,
    loaded: false,
  });
  const channelName = useRef(`incoming_call_${++channelCounter}`).current;

  useEffect(() => {
    let mounted = true;

    function applyEvent(createdAt: string | null) {
      if (!mounted) return;
      const handledEventId = getHandledEventId();
      setState({
        active: !!createdAt && handledEventId !== createdAt,
        eventId: createdAt,
        loaded: true,
      });
    }

    supabase
      .from("team_evidence_items")
      .select("created_at")
      .eq("pair_id", GLOBAL_PAIR_ID)
      .eq("evidence_id", INCOMING_CALL_EVENT_ID)
      .eq("type", INCOMING_CALL_EVENT_TYPE)
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
            if (oldRow.evidence_id === INCOMING_CALL_EVENT_ID && oldRow.type === INCOMING_CALL_EVENT_TYPE) {
              applyEvent(null);
            }
            return;
          }

          const newRow = payload.new as { evidence_id?: string; type?: string; created_at?: string };
          if (newRow.evidence_id !== INCOMING_CALL_EVENT_ID || newRow.type !== INCOMING_CALL_EVENT_TYPE) return;
          applyEvent(newRow.created_at ?? null);
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
