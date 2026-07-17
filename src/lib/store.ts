const VOTE_KEY = "exit2026_vote_final";
const TEAM_KEY = "exit2026_team";
const CALL_DEVICE_KEY = "exit2026_call_device";
const LAST_CALL_RECORDING_KEY = "exit2026_last_call_recording";
export const CALL_RECORDING_AVAILABLE_EVENT = "exit2026-call-recording-available";
const SUSPECT_NOTES_KEY = "exit2026_suspect_notes";

// 수신전화 전용 기기(공기계) 지정 여부. 이 플래그가 켜진 기기에만 전화 오버레이가 뜬다.
export function getIsCallDevice(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CALL_DEVICE_KEY) === "1";
}

export function setCallDevice(on: boolean): void {
  if (on) localStorage.setItem(CALL_DEVICE_KEY, "1");
  else localStorage.removeItem(CALL_DEVICE_KEY);
}
export function getHasLastCallRecording(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LAST_CALL_RECORDING_KEY) === "1";
}

export function setHasLastCallRecording(on: boolean): void {
  if (typeof window === "undefined") return;
  if (on) localStorage.setItem(LAST_CALL_RECORDING_KEY, "1");
  else localStorage.removeItem(LAST_CALL_RECORDING_KEY);
  window.dispatchEvent(new Event(CALL_RECORDING_AVAILABLE_EVENT));
}

export function getTeamInfo(): { teamNumber: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(TEAM_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { teamNumber?: string; name?: string; leaderName?: string };
    if (!parsed.teamNumber) return null;
    return { teamNumber: parsed.teamNumber, name: parsed.name ?? parsed.leaderName ?? "" };
  } catch {
    return null;
  }
}

export function saveTeamInfo(teamNumber: string, name: string): void {
  localStorage.setItem(TEAM_KEY, JSON.stringify({ teamNumber, name }));
}

export function resetAll(): void {
  localStorage.removeItem(VOTE_KEY);
  localStorage.removeItem(TEAM_KEY);
  localStorage.removeItem(SUSPECT_NOTES_KEY);
  // 이전 버전 localStorage 키 정리
  localStorage.removeItem("exit2026_vote_r1");
  localStorage.removeItem("exit2026_vote_r2");
  localStorage.removeItem("exit2026_vote");
  localStorage.removeItem("exit2026_submit_count");
  localStorage.removeItem("exit2026_evidence");
  localStorage.removeItem("exit2026_unlocked");
}
