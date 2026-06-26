import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

export interface GameState {
  vote_open: boolean;
  ending_open: boolean;
}

let channelCounter = 0;

export function useGameState() {
  const [state, setState] = useState<GameState>({ vote_open: false, ending_open: false });
  const [loaded, setLoaded] = useState(false);
  const channelName = useRef(`game_state_${++channelCounter}`).current;

  useEffect(() => {
    supabase
      .from("game_state")
      .select("vote_open, ending_open")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        if (data) setState({ vote_open: data.vote_open, ending_open: data.ending_open });
        setLoaded(true);
      });

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const r = payload.new as { vote_open: boolean; ending_open: boolean };
          setState({ vote_open: r.vote_open, ending_open: r.ending_open });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { ...state, loaded };
}
