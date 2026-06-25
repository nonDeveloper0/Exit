const EVIDENCE_KEY = "exit2026_evidence";
const UNLOCKED_KEY = "exit2026_unlocked";
const VOTE_KEY = "exit2026_vote";
const TEAM_KEY = "exit2026_team";
const SUBMIT_COUNT_KEY = "exit2026_submit_count";

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

export function getUnlockedEvidence(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(UNLOCKED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function unlockEvidence(id: string): void {
  const current = getUnlockedEvidence();
  if (!current.includes(id)) {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...current, id]));
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

export function getSubmitCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(SUBMIT_COUNT_KEY) ?? "0", 10);
}

export function incrementSubmitCount(): void {
  localStorage.setItem(SUBMIT_COUNT_KEY, String(getSubmitCount() + 1));
}

export function resetAll(): void {
  localStorage.removeItem(EVIDENCE_KEY);
  localStorage.removeItem(UNLOCKED_KEY);
  localStorage.removeItem(VOTE_KEY);
  localStorage.removeItem(TEAM_KEY);
  localStorage.removeItem(SUBMIT_COUNT_KEY);
}
