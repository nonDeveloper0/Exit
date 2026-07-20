"use client";

import { formatPairTeamName, getPairTeamTone } from "@/lib/pairTeam";
import { usePairTeamName } from "@/lib/usePairTeamName";

export default function PairTeamBadge() {
  const pairTeam = usePairTeamName();

  if (!pairTeam) return null;

  return (
    <div className={`rounded-full border px-3 py-1.5 text-base font-bold leading-none ${getPairTeamTone(pairTeam.name)}`}>
      {formatPairTeamName(pairTeam.name, pairTeam.index)}
    </div>
  );
}
