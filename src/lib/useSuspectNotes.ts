"use client";

import { useCallback, useEffect, useState } from "react";
import { getTeamInfo } from "./store";
import { supabase } from "./supabase";

export interface SuspectNote { id: string; suspectId: string; authorName: string; body: string; createdAt: string; }
interface Row { id: string; suspect_id: string; author_name: string; body: string; created_at: string; }
const mapRow = (row: Row): SuspectNote => ({ id: row.id, suspectId: row.suspect_id, authorName: row.author_name, body: row.body, createdAt: row.created_at });

export function useSuspectNotes() {
  const [team] = useState(() => getTeamInfo());
  const [notes, setNotes] = useState<Record<string, SuspectNote[]>>({});
  const [loading, setLoading] = useState(true);
  const append = useCallback((note: SuspectNote) => setNotes((prev) => ({ ...prev, [note.suspectId]: [...(prev[note.suspectId] ?? []), note] })), []);
  useEffect(() => {
    if (!team) { setLoading(false); return; }
    supabase.from("suspect_notes").select("id, suspect_id, author_name, body, created_at").eq("pair_id", team.teamNumber).order("created_at").then(({ data }) => {
      const next: Record<string, SuspectNote[]> = {};
      for (const row of (data ?? []) as Row[]) { const note = mapRow(row); (next[note.suspectId] ??= []).push(note); }
      setNotes(next); setLoading(false);
    });
    const channel = supabase.channel(`suspect_notes_${team.teamNumber}`).on("postgres_changes", { event: "*", schema: "public", table: "suspect_notes", filter: `pair_id=eq.${team.teamNumber}` }, (payload) => {
      if (payload.eventType === "INSERT") append(mapRow(payload.new as Row));
      if (payload.eventType === "DELETE") { const id = (payload.old as { id: string }).id; setNotes((prev) => Object.fromEntries(Object.entries(prev).map(([key, items]) => [key, items.filter((item) => item.id !== id)]))); }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [team, append]);
  const addNote = useCallback(async (suspectId: string, body: string) => {
    if (!team || !body.trim()) return;
    const { error } = await supabase.from("suspect_notes").insert({ pair_id: team.teamNumber, suspect_id: suspectId, author_name: team.name.trim(), body: body.trim() });
    if (error) throw error;
  }, [team]);
  const deleteNote = useCallback(async (id: string) => { await supabase.from("suspect_notes").delete().eq("id", id); }, []);
  return { notes, loading, addNote, deleteNote, name: team?.name.trim() ?? "" };
}
