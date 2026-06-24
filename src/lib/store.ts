const EVIDENCE_KEY = "exit2026_evidence";
const VOTE_KEY = "exit2026_vote";
const TEAM_KEY = "exit2026_team";

export function getCollectedEvidence(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(EVIDENCE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function collectEvidence(id: string): void {
  const current = getCollectedEvidence();
  if (!current.includes(id)) {
    localStorage.setItem(EVIDENCE_KEY, JSON.stringify([...current, id]));
  }
}

export function getVote(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VOTE_KEY);
}

export function castVote(suspectId: string): void {
  localStorage.setItem(VOTE_KEY, suspectId);
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
  localStorage.removeItem(EVIDENCE_KEY);
  localStorage.removeItem(VOTE_KEY);
  localStorage.removeItem(TEAM_KEY);
}
