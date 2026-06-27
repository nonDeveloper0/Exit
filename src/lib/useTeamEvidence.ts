"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";

let channelCounter = 0;

export function useTeamEvidence() {
  const [ownTeamId] = useState<string | null>(() => {
    const team = getTeamInfo();
    return team ? team.teamNumber.toUpperCase() : null;
  });
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const collectedRef = useRef<string[]>([]);
  const unlockedRef = useRef<string[]>([]);
  collectedRef.current = collected;
  unlockedRef.current = unlocked;

  // game_state에서 pairings 구독 → 내 팀의 파트너 ID 추적
  useEffect(() => {
    if (!ownTeamId) return;

    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        const pairings = (data as { pairings?: Record<string, string> } | null)?.pairings ?? {};
        setPartnerId(pairings[ownTeamId] ?? null);
      });

    const ch = supabase
      .channel(`pairings_watch_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const pairings =
            (payload.new as { pairings?: Record<string, string> }).pairings ?? {};
          setPartnerId(pairings[ownTeamId] ?? null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [ownTeamId]);

  // 내 팀 + 파트너 팀 증거 fetch 및 Realtime 구독
  useEffect(() => {
    if (!ownTeamId) {
      setLoading(false);
      return;
    }

    const teamIds = [ownTeamId];
    if (partnerId && partnerId !== ownTeamId) teamIds.push(partnerId);

    supabase
      .from("team_evidence_items")
      .select("evidence_id")
      .in("pair_id", teamIds)
      .eq("type", "collected")
      .then(({ data }) => {
        if (data) {
          const ids = [...new Set(data.map((r) => r.evidence_id))];
          setCollected(ids);
        }
        setLoading(false);
      });

    const channels = teamIds.map((tid) =>
      supabase
        .channel(`evidence_${tid}_${++channelCounter}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "team_evidence_items",
            filter: `pair_id=eq.${tid}`,
          },
          (payload) => {
            const item = payload.new as { evidence_id: string; type: string };
            if (item.type === "collected") {
              setCollected((prev) =>
                prev.includes(item.evidence_id) ? prev : [...prev, item.evidence_id]
              );
            }
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [ownTeamId, partnerId]);

  // 증거는 항상 내 팀 ID로 저장
  const collect = useCallback(
    async (id: string) => {
      if (!ownTeamId || collectedRef.current.includes(id)) return;
      setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]));
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: ownTeamId, evidence_id: id, type: "collected" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [ownTeamId]
  );

  const unlock = useCallback(async (id: string) => {
    if (unlockedRef.current.includes(id)) return;
    setUnlocked((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  return { collected, unlocked, loading, collect, unlock };
}
