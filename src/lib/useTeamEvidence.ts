"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase";
import { getTeamInfo } from "./store";
import { markSelfCollect } from "./collectSignal";
import { COMMON_EVIDENCE_IDS, GLOBAL_PAIR_ID } from "./data";

let channelCounter = 0;

export interface InterrogationUse {
  suspectId: string; // evidence_id (용의자 ID)
  teamId: string;    // 사용한 조 (pair_id)
  usedAt: string;    // 사용 시각 (ISO)
}

export function useTeamEvidence() {
  const [ownTeamId] = useState<string | null>(() => {
    const team = getTeamInfo();
    return team ? team.teamNumber.toUpperCase() : null;
  });
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [interrogationEarned, setInterrogationEarned] = useState<string[]>([]);
  const [interrogationUsed, setInterrogationUsed] = useState<InterrogationUse[]>([]);
  const [loading, setLoading] = useState(true);
  const collectedRef = useRef<string[]>([]);
  const unlockedRef = useRef<string[]>([]);
  const interrogationEarnedRef = useRef<string[]>([]);
  collectedRef.current = collected;
  unlockedRef.current = unlocked;
  interrogationEarnedRef.current = interrogationEarned;

  // game_state에서 pairings 구독 → 내 팀의 파트너 ID 추적
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

    const ch = supabase
      .channel(`pairings_watch_${++channelCounter}`)
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
      supabase.removeChannel(ch);
    };
  }, [ownTeamId]);

  // 내 팀 + 파트너 팀 증거 fetch 및 Realtime 구독
  useEffect(() => {
    if (!ownTeamId) {
      setLoading(false);
      return;
    }

    // 항상 공통 단서 저장소(GLOBAL_PAIR_ID)를 함께 구독 → 어느 조가 찾든 전원에 반영
    const teamIds = [ownTeamId, GLOBAL_PAIR_ID];
    if (partnerId && partnerId !== ownTeamId) teamIds.push(partnerId);

    supabase
      .from("team_evidence_items")
      .select("evidence_id, type, pair_id, created_at")
      .in("pair_id", teamIds)
      .in("type", ["collected", "interrogation_used", "interrogation_earned"])
      .then(({ data }) => {
        if (data) {
          setCollected([...new Set(data.filter((r) => r.type === "collected").map((r) => r.evidence_id))]);
          setInterrogationEarned([
            ...new Set(
              data
                .filter((r) => r.type === "interrogation_earned")
                .map((r) => r.evidence_id)
            ),
          ]);
          setInterrogationUsed(
            data
              .filter((r) => r.type === "interrogation_used")
              .map((r) => ({ suspectId: r.evidence_id, teamId: r.pair_id, usedAt: r.created_at }))
          );
        }
        setLoading(false);
      });

    const channels = teamIds.map((tid) =>
      supabase
        .channel(`evidence_${tid}_${++channelCounter}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "team_evidence_items",
            filter: `pair_id=eq.${tid}`,
          },
          (payload) => {
            const item = payload.new as {
              evidence_id: string;
              type: string;
              pair_id: string;
              created_at: string;
            };
            if (item.type === "collected") {
              setCollected((prev) =>
                prev.includes(item.evidence_id) ? prev : [...prev, item.evidence_id]
              );
            } else if (item.type === "interrogation_earned") {
              setInterrogationEarned((prev) =>
                prev.includes(item.evidence_id) ? prev : [...prev, item.evidence_id]
              );
            } else if (item.type === "interrogation_used") {
              setInterrogationUsed((prev) =>
                prev.some((u) => u.suspectId === item.evidence_id && u.teamId === item.pair_id)
                  ? prev
                  : [...prev, { suspectId: item.evidence_id, teamId: item.pair_id, usedAt: item.created_at }]
              );
            }
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [ownTeamId, partnerId]);

  // 증거는 항상 내 팀 ID로 저장
  const collect = useCallback(
    async (id: string) => {
      if (!ownTeamId || collectedRef.current.includes(id)) return;
      // 공통 단서는 전역 저장소에 기록 → 전체 조에 공개 + 전체 공지. 일반 증거는 내 조에 기록.
      const isCommon = COMMON_EVIDENCE_IDS.includes(id);
      const targetPair = isCommon ? GLOBAL_PAIR_ID : ownTeamId;
      if (!isCommon) markSelfCollect(`${ownTeamId}:${id}`);
      setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]));
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: targetPair, evidence_id: id, type: "collected" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [ownTeamId]
  );

  const unlock = useCallback(async (id: string) => {
    if (unlockedRef.current.includes(id)) return;
    setUnlocked((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // 심문권 획득 처리 — 증거 수집과 별개로 용의자 ID를 마커로 저장한다.
  const earnInterrogation = useCallback(
    async (suspectId: string) => {
      if (!ownTeamId || interrogationEarnedRef.current.includes(suspectId)) return;
      setInterrogationEarned((prev) =>
        prev.includes(suspectId) ? prev : [...prev, suspectId]
      );
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: ownTeamId, evidence_id: suspectId, type: "interrogation_earned" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [ownTeamId]
  );

  // 심문권 사용 처리 — 내 조로 기록. 짝 조도 구독 중이므로 함께 사용완료로 반영됨.
  const markInterrogationUsed = useCallback(
    async (suspectId: string) => {
      if (!ownTeamId) return;
      setInterrogationUsed((prev) =>
        prev.some((u) => u.suspectId === suspectId && u.teamId === ownTeamId)
          ? prev
          : [...prev, { suspectId, teamId: ownTeamId, usedAt: new Date().toISOString() }]
      );
      await supabase
        .from("team_evidence_items")
        .upsert(
          { pair_id: ownTeamId, evidence_id: suspectId, type: "interrogation_used" },
          { onConflict: "pair_id,evidence_id,type", ignoreDuplicates: true }
        );
    },
    [ownTeamId]
  );

  return {
    collected,
    unlocked,
    interrogationEarned,
    interrogationUsed,
    loading,
    collect,
    unlock,
    earnInterrogation,
    markInterrogationUsed,
  };
}
