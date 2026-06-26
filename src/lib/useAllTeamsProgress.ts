"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { EVIDENCE } from "./data";

export function useAllTeamsProgress() {
  const [teams, setTeams] = useState<Record<string, number>>({});

  const fetchAll = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("pair_id, type");
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((r) => {
        if (!(r.pair_id in counts)) counts[r.pair_id] = 0;
        if (r.type === "collected") counts[r.pair_id]++;
      });
      setTeams(counts);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("all_teams_progress")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "team_evidence_items" },
        (payload) => {
          const item = payload.new as { pair_id: string; type: string };
          if (item.type === "joined") {
            setTeams((prev) =>
              item.pair_id in prev ? prev : { ...prev, [item.pair_id]: 0 }
            );
          } else if (item.type === "collected") {
            setTeams((prev) => ({
              ...prev,
              [item.pair_id]: (prev[item.pair_id] || 0) + 1,
            }));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "team_evidence_items" },
        () => {
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const total = EVIDENCE.length;
  const sorted = Object.entries(teams).sort((a, b) => b[1] - a[1]);

  return { sorted, total };
}
