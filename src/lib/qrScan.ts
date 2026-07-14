import { QR_CODES } from "./data";

/**
 * 스캔된 QR 원문(전체 URL 또는 slug)에서 유효한 /qr/[id] 경로를 뽑아낸다.
 * 등록되지 않은 QR_CODES id면 null을 반환한다.
 */
export function resolveQrPath(rawText: string): string | null {
  const text = rawText.trim();
  let candidate = text;

  try {
    candidate = new URL(text).pathname;
  } catch {
    // 절대 URL이 아니면 원문을 그대로 후보로 사용
  }

  const match = candidate.match(/qr\/([a-zA-Z0-9]+)/i);
  const id = (match ? match[1] : candidate.replace(/^\/+/, "")).toLowerCase();

  // 인쇄 QR이 대문자여도 인식하도록 대소문자 무시. 이동 경로는 등록된 정규 id를 사용.
  const qr = QR_CODES.find((qr) => qr.id.toLowerCase() === id);
  return qr ? `/qr/${qr.id}` : null;
}
