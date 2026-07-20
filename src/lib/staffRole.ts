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
  "천성훈",
  "김수현",
  "강성중",
  "홍민화",
  "이하진",
  "정재덕",
] as const;

const staffLeaderNameSet = new Set<string>(STAFF_LEADER_NAMES);

export function isStaffLeaderName(name: string | null | undefined, additionalNames: string[] = []) {
  if (!name) return false;
  const normalizedName = name.trim();
  return staffLeaderNameSet.has(normalizedName) || additionalNames.some((staffName) => staffName.trim() === normalizedName);
}
