"use client";

import { useEffect, useRef, useState } from "react";
import { getTeamInfo } from "./store";
import { supabase } from "./supabase";

let channelCounter = 0;

export function useRole() {
  const [team] = useState(() => getTeamInfo());
  const [leaders, setLeaders] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const channelName = useRef(`role_${++channelCounter}`).current;

  useEffect(() => {
    supabase.from("game_state").select("leaders").eq("id", "singleton").single().then(({ data }) => {
      setLeaders((data?.leaders as Record<string, string> | null) ?? {});
      setLoaded(true);
    });
    const channel = supabase.channel(channelName).on(
      "postgres_changes", { event: "UPDATE", schema: "public", table: "game_state" },
      (payload) => setLeaders(((payload.new as { leaders?: Record<string, string> }).leaders) ?? {})
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);

  const name = team?.name.trim() || null;
  const teamNumber = team?.teamNumber ?? null;
  return { isLeader: !!(name && teamNumber && leaders[teamNumber]?.trim() === name), name, teamNumber, loaded };
}
