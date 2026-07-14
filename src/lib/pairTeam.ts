export function getPairTeamKey(firstTeamId: string, secondTeamId: string): string {
  return [firstTeamId.trim().toUpperCase(), secondTeamId.trim().toUpperCase()].sort().join(":");
}

export function formatPairTeamName(teamName: string): string {
  return `${teamName.trim().replace(/\s*팀$/, "")} 팀`;
}

export function getPairTeamTone(teamName: string): string {
  const normalized = teamName.replace(/\s/g, "");
  if (normalized.includes("노랑")) return "border-yellow-400/50 bg-yellow-400/15 text-yellow-100";
  if (normalized.includes("파랑")) return "border-blue-400/50 bg-blue-400/15 text-blue-100";
  if (normalized.includes("분홍")) return "border-pink-400/50 bg-pink-400/15 text-pink-100";
  return "border-amber-400/40 bg-amber-400/10 text-amber-200";
}
