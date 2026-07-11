"use client";

// 수신전화 연출 — 범용 useBroadcastEvent 위의 얇은 래퍼.
// 공통 뼈대는 useBroadcastEvent.ts 참고. 콘텐츠 상수는 data.ts.
import { INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE } from "./data";
import {
  clearBroadcastHandled,
  markBroadcastHandled,
  useBroadcastEvent,
} from "./useBroadcastEvent";

export function useIncomingCall() {
  return useBroadcastEvent(INCOMING_CALL_EVENT_ID, INCOMING_CALL_EVENT_TYPE);
}

export function markIncomingCallHandled(eventId: string) {
  markBroadcastHandled(INCOMING_CALL_EVENT_TYPE, INCOMING_CALL_EVENT_ID, eventId);
}

export function clearIncomingCallHandled() {
  clearBroadcastHandled(INCOMING_CALL_EVENT_TYPE, INCOMING_CALL_EVENT_ID);
}
