"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";

export function useTeamEvidence() {
  const [pairId] = useState<string | null>(() => {
    const team = getTeamInfo();
    return team ? team.teamNumber.toUpperCase() : null;
  });
  const [collected, setCollected] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const collectedRef = useRef<string[]>([]);
  const unlockedRef = useRef<string[]>([]);
  collectedRef.current = collected;
  unlockedRef.current = unlocked;

  useEffect(() => {
    if (!pairId) {
      setLoading(false);
      return;
    }

    supabase
      .from("team_evidence_items")
      .select("evidence_id, type")
      .eq("pair_id", pairId)
      .then(({ data }) => {
        if (data) {
          setCollected(data.filter((r) => r.type === "collected").map((r) => r.evidence_id));
          setUnlocked(data.filter((r) => r.type === "unlocked").map((r) => r.evidence_id));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel(`pair_${pairId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_evidence_items",
          filter: `pair_id=eq.${pairId}`,
        },
        (payload) => {
          const item = payload.new as { evidence_id: string; type: string };
          if (item.type === "collected") {
            setCollected((prev) =>
              prev.includes(item.evidence_id) ? prev : [...prev, item.evidence_id]
            );
          } else if (item.type === "unlocked") {
            setUnlocked((prev) =>
              prev.includes(item.evidence_id) ? prev : [...prev, item.evidence_id]
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pairId]);

  const collect = useCallback(
    async (id: string) => {
      if (!pairId || collectedRef.current.includes(id)) return;
      setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]));
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: pairId, evidence_id: id, type: "collected" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [pairId]
  );

  const unlock = useCallback(
    async (id: string) => {
      if (!pairId || unlockedRef.current.includes(id)) return;
      setUnlocked((prev) => (prev.includes(id) ? prev : [...prev, id]));
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: pairId, evidence_id: id, type: "unlocked" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [pairId]
  );

  return { collected, unlocked, loading, collect, unlock };
}
