import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

export interface GameState {
  vote_round: 0 | 1 | 2;
  ending_open: boolean;
}

let channelCounter = 0;

export function useGameState() {
  const [state, setState] = useState<GameState>({ vote_round: 0, ending_open: false });
  const [loaded, setLoaded] = useState(false);
  const channelName = useRef(`game_state_${++channelCounter}`).current;

  useEffect(() => {
    supabase
      .from("game_state")
      .select("vote_round, ending_open")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        if (data) setState({ vote_round: data.vote_round as 0 | 1 | 2, ending_open: data.ending_open });
        setLoaded(true);
      });

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const r = payload.new as { vote_round: 0 | 1 | 2; ending_open: boolean };
          setState({ vote_round: r.vote_round, ending_open: r.ending_open });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { ...state, loaded };
}
