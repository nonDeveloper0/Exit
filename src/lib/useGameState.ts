import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface GameState {
  vote_open: boolean;
  ending_open: boolean;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({ vote_open: false, ending_open: false });
  const [loaded, setLoaded] = useState(false);

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
      .channel("game_state_changes")
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
