"use client";

import { useEffect, useState } from "react";
import { getPairTeamKey } from "@/lib/pairTeam";
import { getTeamInfo } from "@/lib/store";
import { supabase } from "@/lib/supabase";

type PairingState = {
  pairings?: Record<string, string>;
  pair_team_names?: Record<string, string>;
};

let channelCounter = 0;

export function usePairTeamName() {
  const [teamId] = useState(() => getTeamInfo()?.teamNumber.trim().toUpperCase() ?? null);
  const [pairTeamName, setPairTeamName] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const applyState = (state: PairingState | null) => {
      const partnerId = state?.pairings?.[teamId];
      const teamName = partnerId ? state?.pair_team_names?.[getPairTeamKey(teamId, partnerId)]?.trim() : null;
      setPairTeamName(teamName || null);
    };

    supabase.from("game_state").select("pairings, pair_team_names").eq("id", "singleton").single().then(({ data }) => applyState(data));

    const channel = supabase
      .channel(`pair_team_name_${++channelCounter}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "game_state" }, (payload) => applyState(payload.new as PairingState))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [teamId]);

  return pairTeamName;
}
