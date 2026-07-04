// 내 기기에서 방금 수집한 증거를 표시 → 전역 토스트가 "내 수집"에는 알림을 띄우지 않도록 억제.
// key 형식: `${pairId}:${evidenceId}`

const recent = new Set<string>();

export function markSelfCollect(key: string): void {
  recent.add(key);
  // Realtime 에코가 도착할 시간을 준 뒤 정리
  setTimeout(() => recent.delete(key), 5000);
}

export function consumeSelfCollect(key: string): boolean {
  if (recent.has(key)) {
    recent.delete(key);
    return true;
  }
  return false;
}
