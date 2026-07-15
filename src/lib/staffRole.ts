export const STAFF_LEADER_NAMES = [
  "김은비",
  "김라멕",
  "김민채",
  "정므엘",
  "김민석",
  "신소라",
  "이준혁",
  "이호승",
  "박준수",
] as const;

const staffLeaderNameSet = new Set<string>(STAFF_LEADER_NAMES);

export function isStaffLeaderName(name: string | null | undefined) {
  return !!name && staffLeaderNameSet.has(name.trim());
}