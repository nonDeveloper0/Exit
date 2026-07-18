export function getPairTeamKey(firstTeamId: string, secondTeamId: string): string {
  return [firstTeamId.trim().toUpperCase(), secondTeamId.trim().toUpperCase()].sort().join(":");
}

// 짝 조 중 순번(1 또는 2). 숫자 조 번호가 작은 쪽이 1, 큰 쪽이 2다.
export function pairTeamIndex(teamId: string, partnerId: string): 1 | 2 {
  const a = Number(teamId);
  const b = Number(partnerId);
  if (Number.isFinite(a) && Number.isFinite(b) && a !== b) return a < b ? 1 : 2;
  // 비숫자 조 번호는 사전순으로 안정적으로 나눈다.
  return teamId.trim().toUpperCase() <= partnerId.trim().toUpperCase() ? 1 : 2;
}

// index를 주면 "분홍1"처럼 순번을 붙이고, 없으면 기존 "분홍 팀" 형식을 유지한다.
export function formatPairTeamName(teamName: string, index?: 1 | 2): string {
  const base = teamName.trim().replace(/\s*팀$/, "");
  return index ? `${base}${index}` : `${base} 팀`;
}

export function getPairTeamTone(teamName: string): string {
  const normalized = teamName.replace(/\s/g, "");
  if (normalized.includes("노랑")) return "border-yellow-400/50 bg-yellow-400/15 text-yellow-100";
  if (normalized.includes("파랑")) return "border-blue-400/50 bg-blue-400/15 text-blue-100";
  if (normalized.includes("분홍")) return "border-pink-400/50 bg-pink-400/15 text-pink-100";
  return "border-amber-400/40 bg-amber-400/10 text-amber-200";
}
