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
      if (payload.eventType === "UPDATE") {
        const updated = mapRow(payload.new as Row);
        setNotes((prev) => ({ ...prev, [updated.suspectId]: (prev[updated.suspectId] ?? []).map((note) => note.id === updated.id ? updated : note) }));
      }
      if (payload.eventType === "DELETE") { const id = (payload.old as { id: string }).id; setNotes((prev) => Object.fromEntries(Object.entries(prev).map(([key, items]) => [key, items.filter((item) => item.id !== id)]))); }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [team, append]);
  const addNote = useCallback(async (suspectId: string, body: string) => {
    if (!team || !body.trim()) return;
    const { error } = await supabase.from("suspect_notes").insert({ pair_id: team.teamNumber, suspect_id: suspectId, author_name: team.name.trim(), body: body.trim() });
    if (error) throw error;
  }, [team]);
  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase.from("suspect_notes").delete().eq("id", id);
    if (error) throw error;
    // Realtime DELETE는 설정에 따라 이전 행의 id를 보내지 않을 수 있어 즉시 제거한다.
    setNotes((prev) => Object.fromEntries(Object.entries(prev).map(([key, items]) => [key, items.filter((item) => item.id !== id)])));
  }, []);
  const updateNote = useCallback(async (id: string, body: string) => {
    if (!body.trim()) return;
    const { error } = await supabase.from("suspect_notes").update({ body: body.trim() }).eq("id", id);
    if (error) throw error;
    setNotes((prev) => Object.fromEntries(Object.entries(prev).map(([key, items]) => [key, items.map((note) => note.id === id ? { ...note, body: body.trim() } : note)])));
  }, []);
  return { notes, loading, addNote, updateNote, deleteNote, name: team?.name.trim() ?? "" };
}
