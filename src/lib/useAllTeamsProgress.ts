"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { EVIDENCE } from "./data";

export interface TeamGroup {
  label: string;     // "1조 + 3조" or "2조"
  teamIds: string[]; // ["1", "3"] or ["2"]
  count: number;     // 짝 팀 합집합 증거 수
}

let channelCounter = 0;

export function useAllTeamsProgress() {
  const [teamEvidence, setTeamEvidence] = useState<Record<string, string[]>>({});
  const [pairings, setPairings] = useState<Record<string, string>>({});

  // game_state 구독 — pairings 변경 시 즉시 반영
  useEffect(() => {
    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        if (data?.pairings) setPairings(data.pairings as Record<string, string>);
      });

    const ch = supabase
      .channel(`pairings_ranking_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const p = (payload.new as { pairings?: Record<string, string> }).pairings ?? {};
          setPairings(p);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const fetchAll = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("pair_id, evidence_id, type");
    if (data) {
      const ev: Record<string, string[]> = {};
      data.forEach((r) => {
        if (!(r.pair_id in ev)) ev[r.pair_id] = [];
        if (r.type === "collected" && !ev[r.pair_id].includes(r.evidence_id)) {
          ev[r.pair_id].push(r.evidence_id);
        }
      });
      setTeamEvidence(ev);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel(`all_teams_progress_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "team_evidence_items" },
        (payload) => {
          const item = payload.new as { pair_id: string; evidence_id: string; type: string };
          if (item.type === "joined") {
            setTeamEvidence((prev) =>
              item.pair_id in prev ? prev : { ...prev, [item.pair_id]: [] }
            );
          } else if (item.type === "collected") {
            setTeamEvidence((prev) => {
              const arr = prev[item.pair_id] ?? [];
              if (arr.includes(item.evidence_id)) return prev;
              return { ...prev, [item.pair_id]: [...arr, item.evidence_id] };
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "team_evidence_items" },
        () => { fetchAll(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  // 매핑된 조는 묶어서 그룹화, 증거는 합집합으로 계산
  const groups: TeamGroup[] = [];
  const seenTeams = new Set<string>();
  const processedPairs = new Set<string>();

  for (const [a, b] of Object.entries(pairings)) {
    const key = [a, b].sort().join("-");
    if (processedPairs.has(key)) continue;
    processedPairs.add(key);

    if (!(a in teamEvidence) && !(b in teamEvidence)) continue;

    seenTeams.add(a);
    seenTeams.add(b);

    const combined = new Set([...(teamEvidence[a] ?? []), ...(teamEvidence[b] ?? [])]);
    groups.push({ label: `${a}조 + ${b}조`, teamIds: [a, b], count: combined.size });
  }

  for (const teamId of Object.keys(teamEvidence)) {
    if (seenTeams.has(teamId)) continue;
    groups.push({ label: `${teamId}조`, teamIds: [teamId], count: teamEvidence[teamId].length });
  }

  groups.sort((a, b) => b.count - a.count);

  return { groups, total: EVIDENCE.length };
}
