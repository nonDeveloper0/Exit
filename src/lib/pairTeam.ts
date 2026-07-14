export function getPairTeamKey(firstTeamId: string, secondTeamId: string): string {
  return [firstTeamId.trim().toUpperCase(), secondTeamId.trim().toUpperCase()].sort().join(":");
}
