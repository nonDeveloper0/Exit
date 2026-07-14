export function getPhotoEvidenceGroupKey(teamId: string, pairings: Record<string, string>): string {
  const normalizedTeamId = teamId.toUpperCase();
  const partnerId = pairings[normalizedTeamId]?.toUpperCase();

  if (!partnerId || partnerId === normalizedTeamId) return normalizedTeamId;

  return [normalizedTeamId, partnerId]
    .sort()
    .join(":");
}