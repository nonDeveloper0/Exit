const VOTE_KEY = "exit2026_vote_final";
const TEAM_KEY = "exit2026_team";
const CALL_DEVICE_KEY = "exit2026_call_device";

// 수신전화 전용 기기(공기계) 지정 여부. 이 플래그가 켜진 기기에만 전화 오버레이가 뜬다.
export function getIsCallDevice(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CALL_DEVICE_KEY) === "1";
}

export function setCallDevice(on: boolean): void {
  if (on) localStorage.setItem(CALL_DEVICE_KEY, "1");
  else localStorage.removeItem(CALL_DEVICE_KEY);
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
  localStorage.removeItem(VOTE_KEY);
  localStorage.removeItem(TEAM_KEY);
  // 이전 버전 localStorage 키 정리
  localStorage.removeItem("exit2026_vote_r1");
  localStorage.removeItem("exit2026_vote_r2");
  localStorage.removeItem("exit2026_vote");
  localStorage.removeItem("exit2026_submit_count");
  localStorage.removeItem("exit2026_evidence");
  localStorage.removeItem("exit2026_unlocked");
}
