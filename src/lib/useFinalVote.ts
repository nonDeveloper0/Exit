"use client";

// 최종추리 제출 상태를 서버(final_votes)에 저장/조회한다.
// 조(pair_id)당 한 행. 제출 여부·선택 용의자·추리 근거가 서버에 남으므로
// 기기를 바꾸거나 새로고침해도 유지되고, 관리자 초기화(행 삭제)는 Realtime으로 즉시 반영된다.

import { useCallback, useEffect, useState } from "react";
import { getTeamInfo } from "./store";
import { supabase } from "./supabase";

export interface FinalVote {
  suspectId: string;
  reasoning: string;
}

interface Row {
  suspect_id: string;
  reasoning: string;
}

let channelCounter = 0;

export function useFinalVote() {
  const [team] = useState(() => getTeamInfo());
  const [vote, setVote] = useState<FinalVote | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!team) {
      setLoaded(true);
      return;
    }
    let mounted = true;

    supabase
      .from("final_votes")
      .select("suspect_id, reasoning")
      .eq("pair_id", team.teamNumber)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        const row = data as Row | null;
        setVote(row ? { suspectId: row.suspect_id, reasoning: row.reasoning } : null);
        setLoaded(true);
      });

    const channel = supabase
      .channel(`final_vote_${team.teamNumber}_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "final_votes", filter: `pair_id=eq.${team.teamNumber}` },
        (payload) => {
          if (!mounted) return;
          if (payload.eventType === "DELETE") {
            setVote(null);
            return;
          }
          const row = payload.new as Row;
          setVote({ suspectId: row.suspect_id, reasoning: row.reasoning });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [team]);

  const submit = useCallback(
    async (suspectId: string, reasoning: string) => {
      if (!team) return;
      const { error } = await supabase.from("final_votes").upsert(
        {
          pair_id: team.teamNumber,
          suspect_id: suspectId,
          reasoning,
          name: team.name.trim(),
          created_at: new Date().toISOString(),
        },
        { onConflict: "pair_id" }
      );
      if (error) throw error;
      setVote({ suspectId, reasoning });
    },
    [team]
  );

  return { vote, loaded, submit };
}
