const VOTE_R1_KEY = "exit2026_vote_r1";
const VOTE_R2_KEY = "exit2026_vote_r2";
const TEAM_KEY = "exit2026_team";

export function getVote(round: 1 | 2): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(round === 1 ? VOTE_R1_KEY : VOTE_R2_KEY);
}

export function castVote(round: 1 | 2, suspectId: string): void {
  localStorage.setItem(round === 1 ? VOTE_R1_KEY : VOTE_R2_KEY, suspectId);
}

export function getTeamInfo(): { teamNumber: string; leaderName: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(TEAM_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveTeamInfo(teamNumber: string, leaderName: string): void {
  localStorage.setItem(TEAM_KEY, JSON.stringify({ teamNumber, leaderName }));
}

export function resetAll(): void {
  localStorage.removeItem(VOTE_R1_KEY);
  localStorage.removeItem(VOTE_R2_KEY);
  localStorage.removeItem(TEAM_KEY);
  // 이전 버전 localStorage 키 정리
  localStorage.removeItem("exit2026_vote");
  localStorage.removeItem("exit2026_submit_count");
  localStorage.removeItem("exit2026_evidence");
  localStorage.removeItem("exit2026_unlocked");
}
