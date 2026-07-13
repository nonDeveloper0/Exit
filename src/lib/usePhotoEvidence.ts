"use client";

import { useCallback, useEffect, useState } from "react";
import { PHOTO_BUCKET } from "./data";
import { compressImage } from "./image";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";

export interface PhotoItem {
  id: string;
  pairId: string;
  imageUrl: string;
  caption: string | null;
  suspectTag: string | null;
  status: string;
  createdAt: string;
}

interface Row {
  id: string;
  pair_id: string;
  image_url: string;
  caption: string | null;
  suspect_tag: string | null;
  status: string | null;
  created_at: string;
}

const SELECT_COLS = "id, pair_id, image_url, caption, suspect_tag, status, created_at";
let channelCounter = 0;

function mapRow(row: Row): PhotoItem {
  return {
    id: row.id,
    pairId: row.pair_id,
    imageUrl: row.image_url,
    caption: row.caption,
    suspectTag: row.suspect_tag,
    status: row.status ?? "ok",
    createdAt: row.created_at,
  };
}

export function usePhotoEvidence() {
  const [ownTeamId] = useState<string | null>(() => {
    const team = getTeamInfo();
    return team ? team.teamNumber.toUpperCase() : null;
  });
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!ownTeamId) return;

    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        const pairings = (data as { pairings?: Record<string, string> } | null)?.pairings ?? {};
        setPartnerId(pairings[ownTeamId] ?? null);
      });

    const channel = supabase
      .channel(`photo_pairings_${++channelCounter}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_state" },
        (payload) => {
          const pairings =
            (payload.new as { pairings?: Record<string, string> }).pairings ?? {};
          setPartnerId(pairings[ownTeamId] ?? null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownTeamId]);

  useEffect(() => {
    if (!ownTeamId) {
      setLoading(false);
      return;
    }

    const teamIds = [ownTeamId];
    if (partnerId && partnerId !== ownTeamId) teamIds.push(partnerId);

    setLoading(true);
    supabase
      .from("photo_evidence")
      .select(SELECT_COLS)
      .in("pair_id", teamIds)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPhotos((data as Row[]).map(mapRow));
        setLoading(false);
      });

    const channels = teamIds.map((teamId) =>
      supabase
        .channel(`photos_${teamId}_${++channelCounter}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "photo_evidence",
            filter: `pair_id=eq.${teamId}`,
          },
          (payload) => {
            const row = mapRow(payload.new as Row);
            setPhotos((prev) => prev.map((photo) => (photo.id === row.id ? row : photo)));
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "photo_evidence",
            filter: `pair_id=eq.${teamId}`,
          },
          (payload) => {
            const row = mapRow(payload.new as Row);
            setPhotos((prev) => (prev.some((photo) => photo.id === row.id) ? prev : [row, ...prev]));
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "photo_evidence",
            filter: `pair_id=eq.${teamId}`,
          },
          (payload) => {
            const oldId = (payload.old as { id?: string }).id;
            if (oldId) {
              setPhotos((prev) => prev.filter((photo) => photo.id !== oldId));
            }
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [ownTeamId, partnerId]);

  const uploadPhoto = useCallback(
    async (file: File, caption: string, suspectTag: string) => {
      if (!ownTeamId) return;

      setUploading(true);
      try {
        const blob = await compressImage(file);
        const path = `${ownTeamId}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
        const { data: inserted, error: insertError } = await supabase
          .from("photo_evidence")
          .insert({
            pair_id: ownTeamId,
            image_url: publicData.publicUrl,
            caption: caption.trim() || null,
            suspect_tag: suspectTag || null,
          })
          .select(SELECT_COLS)
          .single();

        if (insertError) throw insertError;

        if (inserted) {
          const row = mapRow(inserted as Row);
          setPhotos((prev) => (prev.some((photo) => photo.id === row.id) ? prev : [row, ...prev]));
        }
      } finally {
        setUploading(false);
      }
    },
    [ownTeamId]
  );

  return { photos, loading, uploading, uploadPhoto, ownTeamId };
}
