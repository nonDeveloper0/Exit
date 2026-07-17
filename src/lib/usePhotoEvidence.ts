"use client";

import { useCallback, useEffect, useState } from "react";
import { PHOTO_BUCKET } from "./data";
import { compressImage } from "./image";
import { getPhotoEvidenceGroupKey } from "./photoEvidenceNumbering";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";
import { hasReachedPhotoLimit } from "./photoUploadLimit";

export interface PhotoItem {
  id: string;
  pairId: string;
  imageUrl: string;
  caption: string | null;
  suspectTag: string | null;
  locationTag: string | null;
  evidenceNumber: number;
  status: string;
  createdAt: string;
}

interface Row {
  id: string;
  pair_id: string;
  image_url: string;
  caption: string | null;
  suspect_tag: string | null;
  location_tag: string | null;
  evidence_number: number;
  status: string | null;
  created_at: string;
}

const SELECT_COLS =
  "id, pair_id, image_url, caption, suspect_tag, location_tag, evidence_number, status, created_at";
let channelCounter = 0;

function mapRow(row: Row): PhotoItem {
  return {
    id: row.id,
    pairId: row.pair_id,
    imageUrl: row.image_url,
    caption: row.caption,
    suspectTag: row.suspect_tag,
    locationTag: row.location_tag,
    evidenceNumber: row.evidence_number,
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
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updatingPhotoId, setUpdatingPhotoId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  useEffect(() => {
    if (!ownTeamId) return;

    supabase
      .from("game_state")
      .select("pairings")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        const pairings = (data as { pairings?: Record<string, string> } | null)?.pairings ?? {};
        setPairings(pairings);
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
          setPairings(pairings);
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
    async (file: File, caption: string, locationTag: string) => {
      if (!ownTeamId) return;

      setUploading(true);
      let path: string | null = null;
      try {
        const { count, error: countError } = await supabase
          .from("photo_evidence")
          .select("id", { count: "exact", head: true })
          .eq("pair_id", ownTeamId);
        if (countError) throw countError;
        if (hasReachedPhotoLimit(count ?? 0)) {
          throw new Error("조당 사진은 최대 30장까지 업로드할 수 있습니다.");
        }

        const blob = await compressImage(file);
        path = `${ownTeamId}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
        const evidenceGroupKey = getPhotoEvidenceGroupKey(ownTeamId, pairings);
        const { data: evidenceNumber, error: numberError } = await supabase.rpc(
          "allocate_photo_evidence_number",
          { p_group_key: evidenceGroupKey }
        );
        if (numberError || typeof evidenceNumber !== "number") {
          throw numberError ?? new Error("사진 번호 발급 실패");
        }

        const { data: inserted, error: insertError } = await supabase
          .from("photo_evidence")
          .insert({
            pair_id: ownTeamId,
            image_url: publicData.publicUrl,
            caption: caption.trim() || null,
            location_tag: locationTag || null,
            evidence_group_key: evidenceGroupKey,
            evidence_number: evidenceNumber,
          })
          .select(SELECT_COLS)
          .single();

        if (insertError) throw insertError;

        if (inserted) {
          const row = mapRow(inserted as Row);
          setPhotos((prev) => (prev.some((photo) => photo.id === row.id) ? prev : [row, ...prev]));
        }
      } catch (error) {
        if (path) await supabase.storage.from(PHOTO_BUCKET).remove([path]);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [ownTeamId, pairings]
  );

  const updatePhotoMetadata = useCallback(
    async (id: string, caption: string, locationTag: string) => {
      setUpdatingPhotoId(id);
      try {
        const { error } = await supabase
          .from("photo_evidence")
          .update({
            caption: caption.trim() || null,
            location_tag: locationTag || null,
          })
          .eq("id", id);

        if (error) throw error;
      } finally {
        setUpdatingPhotoId(null);
      }
    },
    []
  );

  const deletePhoto = useCallback(async (photo: PhotoItem) => {
    setDeletingPhotoId(photo.id);
    try {
      // image_url(공개 URL)에서 Storage 경로(`{pairId}/{파일명}`)를 추출해 파일 먼저 제거
      const marker = `/${PHOTO_BUCKET}/`;
      const markerIndex = photo.imageUrl.indexOf(marker);
      if (markerIndex !== -1) {
        const path = decodeURIComponent(photo.imageUrl.slice(markerIndex + marker.length).split("?")[0]);
        await supabase.storage.from(PHOTO_BUCKET).remove([path]);
      }
      const { error } = await supabase.from("photo_evidence").delete().eq("id", photo.id);
      if (error) throw error;
      setPhotos((prev) => prev.filter((item) => item.id !== photo.id));
    } finally {
      setDeletingPhotoId(null);
    }
  }, []);

  const ownPhotoCount = ownTeamId ? photos.filter((photo) => photo.pairId === ownTeamId).length : 0;
  return { photos, loading, uploading, uploadPhoto, updatePhotoMetadata, updatingPhotoId, deletePhoto, deletingPhotoId, ownTeamId, ownPhotoCount, photoLimitReached: hasReachedPhotoLimit(ownPhotoCount) };
}
