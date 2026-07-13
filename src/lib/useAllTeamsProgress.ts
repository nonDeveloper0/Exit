"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface TeamGroup {
  label: string;
  teamIds: string[];
  count: number;
}

interface PhotoCountRow {
  pair_id: string;
  status: string | null;
}

let channelCounter = 0;

export function useAllTeamsProgress() {
  const [photoCount, setPhotoCount] = useState<Record<string, number>>({});
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set());
  const [pairings, setPairings] = useState<Record<string, string>>({});

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase.from("photo_evidence").select("pair_id, status");
    if (!data) return;

    const counts: Record<string, number> = {};
    (data as PhotoCountRow[]).forEach((photo) => {
      if ((photo.status ?? "ok") === "ok") {
        counts[photo.pair_id] = (counts[photo.pair_id] ?? 0) + 1;
      }
    });
    setPhotoCount(counts);
  }, []);

  const fetchJoinedTeams = useCallback(async () => {
    const { data } = await supabase
      .from("team_evidence_items")
      .select("pair_id")
      .eq("type", "joined");
    if (data) setJoinedTeams(new Set(data.map((item) => item.pair_id as string)));
  }, []);

  useEffect(() => {
    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => setPairings((data?.pairings as Record<string, string>) ?? {}));

    const channel = supabase
      .channel(`pairings_ranking_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          setPairings((payload.new as { pairings?: Record<string, string> }).pairings ?? {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    void fetchPhotos();
    void fetchJoinedTeams();

    const channel = supabase
      .channel(`all_teams_photo_progress_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photo_evidence" },
        (payload) => {
          const photo = payload.new as PhotoCountRow;
          if ((photo.status ?? "ok") !== "ok") return;
          setPhotoCount((prev) => ({
            ...prev,
            [photo.pair_id]: (prev[photo.pair_id] ?? 0) + 1,
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "photo_evidence" },
        (payload) => {
          const previous = payload.old as PhotoCountRow;
          const next = payload.new as PhotoCountRow;
          if (!previous.pair_id) {
            void fetchPhotos();
            return;
          }
          const wasIncluded = (previous.status ?? "ok") === "ok";
          const isIncluded = (next.status ?? "ok") === "ok";
          if (wasIncluded === isIncluded) return;
          setPhotoCount((prev) => ({
            ...prev,
            [next.pair_id]: Math.max(0, (prev[next.pair_id] ?? 0) + (isIncluded ? 1 : -1)),
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photo_evidence" },
        () => void fetchPhotos()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "team_evidence_items" },
        (payload) => {
          const item = payload.new as { pair_id: string; type: string };
          if (item.type === "joined") {
            setJoinedTeams((prev) => new Set([...prev, item.pair_id]));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "team_evidence_items" },
        () => void fetchJoinedTeams()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJoinedTeams, fetchPhotos]);

  const teamIds = new Set([...joinedTeams, ...Object.keys(photoCount)]);
  const groups: TeamGroup[] = [];
  const seenTeams = new Set<string>();
  const processedPairs = new Set<string>();

  for (const [a, b] of Object.entries(pairings)) {
    const key = [a, b].sort().join("-");
    if (processedPairs.has(key) || (!teamIds.has(a) && !teamIds.has(b))) continue;
    processedPairs.add(key);
    seenTeams.add(a);
    seenTeams.add(b);
    groups.push({
      label: `${a}조 + ${b}조`,
      teamIds: [a, b],
      count: (photoCount[a] ?? 0) + (photoCount[b] ?? 0),
    });
  }

  for (const teamId of teamIds) {
    if (!seenTeams.has(teamId)) {
      groups.push({ label: `${teamId}조`, teamIds: [teamId], count: photoCount[teamId] ?? 0 });
    }
  }

  groups.sort((a, b) => b.count - a.count);
  return { groups };
}
