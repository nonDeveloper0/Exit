"use client";

import { useEffect, useRef, useState } from "react";
import { getTeamInfo } from "./store";
import { supabase } from "./supabase";
import { isStaffLeaderName } from "./staffRole";

let channelCounter = 0;

type LeaderSettings = Record<string, string | string[]>;

function readStaffNames(settings: LeaderSettings): string[] {
  const value = settings.__staff__;
  return Array.isArray(value) ? value.filter((name): name is string => typeof name === "string") : [];
}

export function useRole() {
  const [team] = useState(() => getTeamInfo());
  const [leaders, setLeaders] = useState<LeaderSettings>({});
  const [loaded, setLoaded] = useState(false);
  const channelName = useRef(`role_${++channelCounter}`).current;

  useEffect(() => {
    supabase.from("game_state").select("leaders").eq("id", "singleton").single().then(({ data }) => {
      setLeaders((data?.leaders as LeaderSettings | null) ?? {});
      setLoaded(true);
    });
    const channel = supabase.channel(channelName).on(
      "postgres_changes", { event: "UPDATE", schema: "public", table: "game_state" },
      (payload) => setLeaders(((payload.new as { leaders?: LeaderSettings }).leaders) ?? {})
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);

  const name = team?.name.trim() || null;
  const teamNumber = team?.teamNumber ?? null;
  const assignedLeader = teamNumber ? leaders[teamNumber] : null;
  return { isLeader: isStaffLeaderName(name, readStaffNames(leaders)) || !!(name && typeof assignedLeader === "string" && assignedLeader.trim() === name), name, teamNumber, loaded };
}
