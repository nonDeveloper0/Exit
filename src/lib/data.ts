export interface Evidence {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface Suspect {
  id: string;
  codename: string;
  name: string;
  role: string;
  motive: string;
  motiveRevealIds: string[]; // 이 증거들을 모두 수집하면 motive 공개
  relatedEvidenceIds: string[]; // 이 용의자와 관련된 단서 (용의자 파일에 표시)
  interrogationTriggerId?: string; // 이 증거를 수집하면 이 용의자의 '심문권' 획득 (QR 확정 후 지정)
  description: string;
  motiveLevel: "높음" | "중간" | "낮음" | "불명";
}

// 최종 추리 제출에 필요한 최소 증거  수 (0 = 제한 없음)
export const VOTE_UNLOCK_COUNT = 1;

// 비밀번호로 잠긴 증거 목록. { 증거ID: "비밀번호" } 형태로 지정.
export const LOCKED_EVIDENCE: Record<string, string> = {
  E01: "1234",
};

// 잠긴 증거 퀴즈 문제. { 증거ID: "문제" } 형태로 지정. 없으면 기본 안내 문구 표시.
export const EVIDENCE_QUIZ: Record<string, string> = {
  E01: "퀴즈 문제를 여기에 입력하세요.",
};

// 공통 단서: 어느 조든 처음 찾으면 전체 조에 공개되고 전체 공지 토스트가 뜬다.
// 여기에 증거 ID를 넣으면 그 증거는 "조별 증거"가 아니라 "전역 공유 증거"로 동작한다.
export const COMMON_EVIDENCE_IDS: string[] = ["E10"];

// 공통 단서를 저장하는 가상의 조 ID (실제 조 번호와 겹치지 않아야 함)
export const GLOBAL_PAIR_ID = "__global";

// 수신전화 연출 이벤트. team_evidence_items에 이 행이 있으면 전 참가자에게 전화 UI가 표시된다.
export const INCOMING_CALL_EVENT_ID = "_incoming_call";
export const INCOMING_CALL_EVENT_TYPE = "incoming_call";
export const INCOMING_CALL_AUDIO_URL = "/audio/incoming-call.mp3";

// 장소 이름 — 수정 시 여기서만 변경
export const LOCATIONS = {
  L1: "자재 물류창고", // 사건 현장
  L2: "나사장 집무실",
  L3: "나팀장 사무실",
  L4: "채소장 연구실",
} as const;

export interface QrCode {
  id: string;
  location: string;
  evidenceIds: string[];
}
  
export const EVIDENCE: Evidence[] = [
  {
    id: "E01",
    title: "목격자 진술",
    description: "당일 밤 현장 인근에서 '두 사람이 격렬히 다투는 것'을 목격했다는 진술.",
    imageUrl: "/03_evidence.png",
  },
  {
    id: "E02",
    title: "CCTV 일부 영상",
    description: "살인 당일 오후 10시~11시 구간. 특정 구간 30분이 삭제된 것이 확인됨.",
  },
  {
    id: "E03",
    title: "통화기록",
    description: "사건 당일 피해자와 C 사이의 3분간 통화 내역 확인됨. 내용 불명.",
  },
  {
    id: "E04",
    title: "문자내역",
    description: "사건 전날 피해자가 A에게 보낸 문자. '다시는 반항하지 마라'는 내용 포함.",
  },
  {
    id: "E05",
    title: "혈흔 사진",
    description: "현장 주변에서 발견된 혈흔. 피해자의 혈액형과 일치하며, 격렬한 저항의 흔적이 보인다.",
    imageUrl: "/02_blood.png",
  },
  {
    id: "E06",
    title: "인사기록",
    description: "C의 입사 서류. 출생지, 이전 주소, 학력 항목이 공란으로 처리됨.",
  },
  {
    id: "E07",
    title: "징계문서",
    description: "피해자가 노동자 A를 부당 징계한 문서. 폭행 은폐 정황이 드러남.",
  },
  {
    id: "E08",
    title: "병원기록",
    description: "지난 6개월간 현장 노동자 9명이 외상으로 치료받은 기록. 사유: '작업 중 사고'.",
  },
  {
    id: "E09",
    title: "현장출입기록",
    description: "사건 당일 오후 9시 이후 출입자: A, B, C. 퇴장 기록 없음.",
  },
  {
    id: "E10",
    title: "비밀문서",
    description: "C가 회장에게 보낸 서한 일부. '더 이상 두고 볼 수 없습니다'라는 문구만 해독 가능.",
  },
  {
    id: "E11",
    title: "이중 장부",
    description: "현장 자재 대금이 이중으로 기록된 장부. B와 피해자 사이 수년간의 비자금 거래 정황이 드러난다.",
  },
  {
    id: "E12",
    title: "내부고발 문건",
    description: "피해자가 외부에 넘기려던 조직 비리 자료. E가 이 문건의 존재를 사전에 파악하고 있었던 정황이 확인됨.",
  },
  {
    id: "E13",
    title: "경호팀 무전 기록",
    description: "사건 당일 밤, E가 경호팀에 '뒷정리'를 지시한 무전 기록. 지시 직후 해당 시간대 통신이 일괄 삭제됐다.",
  },
  {
    id: "E14",
    title: "해고 통보서",
    description: "사건 이틀 전 피해자 명의로 D에게 전달된 일방적 해고 통보서. 사유란은 공란으로 처리됐다.",
  },
  {
    id: "E15",
    title: "임금 체불 내역",
    description: "D의 지난 수개월치 임금이 미지급된 내역과 야간 근무일지. 사건 당일에도 정문 근무가 기록돼 있다.",
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: "A",
    codename: "용의자 A",
    name: "나사장",
    role: "노동자 대표",
    motive: "반복적인 폭행과 착취에 대한 복수",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E07", "E08"])
    relatedEvidenceIds: ["E04", "E07", "E08"],
    interrogationTriggerId: undefined, // TODO: QR 확정 후 심문권 트리거 증거 ID 지정
    description:
      "현장 노동자들의 리더. 피해자에게 수차례 부당한 폭행과 징계를 받아왔다. 사건 당일 현장에 있었음을 인정했다.",
    motiveLevel: "높음",
  },
  {
    id: "B",
    codename: "용의자 B",
    name: "채소장",
    role: "현장 소장",
    motive: "비리 은폐",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E02", "E06"])
    relatedEvidenceIds: ["E01", "E09", "E11"],
    interrogationTriggerId: undefined, // TODO: QR 확정 후 심문권 트리거 증거 ID 지정
    description:
      "공사 현장의 실질적 책임자. 피해자와 수년간 부당 거래를 해온 것으로 알려져 있다. 사건 관련 서류를 사전에 은폐한 정황이 있다.",
    motiveLevel: "중간",
  },
  {
    id: "C",
    codename: "용의자 C",
    name: "나팀장",
    role: "회장 아들",
    motive: "불명확 — 조사 중", // TODO: 동기 확정 후 교체
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E10"])
    relatedEvidenceIds: ["E03", "E06", "E10"],
    interrogationTriggerId: undefined, // TODO: QR 확정 후 심문권 트리거 증거 ID 지정
    description:
      "회장의 아들이라는 것 외에 신원 대부분이 비공개. 사건 당일 현장에 있었으며, 사건 직후 잠적. 연락 두절.",
    motiveLevel: "불명",
  },
  {
    id: "D",
    codename: "용의자 D",
    name: "이대리",
    role: "경비원",
    motive: "해고 통보와 임금 체불에 대한 원한",
    motiveRevealIds: [],
    relatedEvidenceIds: ["E05", "E14", "E15"],
    interrogationTriggerId: undefined, // TODO: QR 확정 후 심문권 트리거 증거 ID 지정
    description:
      "공사 현장 정문 담당 경비원. 사건 당일 야간 근무 중이었으며 현장 출입을 직접 통제하는 위치에 있었다. 피해자로부터 수개월간 임금을 받지 못했고, 사건 이틀 전 일방적인 해고를 통보받은 것으로 확인됐다.",
    motiveLevel: "중간",
  },
  {
    id: "E",
    codename: "용의자 E",
    name: "김사원",
    role: "경호실장",
    motive: "피해자의 내부 고발 차단 — 조직 비리 은폐",
    motiveRevealIds: [],
    relatedEvidenceIds: ["E02", "E12", "E13"],
    interrogationTriggerId: undefined, // TODO: QR 확정 후 심문권 트리거 증거 ID 지정
    description:
      "회장 직속 경호실장. 현장 CCTV 관리 권한을 보유하고 있으며, 삭제된 영상 구간의 접근 이력이 그의 계정에서 발견됐다. 사건 당일 행적에 대해 일관성 없는 진술을 반복하고 있다.",
    motiveLevel: "높음",
  },
];

// QR 총 15개 = 자재 물류창고 6개 + 나사장 집무실/나팀장 사무실/채소장 연구실 각 3개
// 증거 1개당 QR 1개. 방(용의자) = 그 용의자의 관련 단서 3개, 자재 물류창고 = 나머지(D·E) 6개.
// ※ 아래 slug 중 c8v3k1~w3n5k7(9개)는 새로 생성한 값 — 실제 인쇄 QR과 일치시키거나 원하는 값으로 교체하세요.
export const QR_CODES: QrCode[] = [
  // 자재 물류창고 (사건 현장) — 6개
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E02"] },
  { id: "p7n3q8", location: LOCATIONS.L1, evidenceIds: ["E12"] },
  { id: "c8v3k1", location: LOCATIONS.L1, evidenceIds: ["E13"] },
  { id: "d2m9x4", location: LOCATIONS.L1, evidenceIds: ["E05"] },
  { id: "f5r7t2", location: LOCATIONS.L1, evidenceIds: ["E14"] },
  { id: "g1h6n8", location: LOCATIONS.L1, evidenceIds: ["E15"] },
  // 나사장 집무실 (용의자 A) — 3개
  { id: "h6t4c3", location: LOCATIONS.L2, evidenceIds: ["E04"] },
  { id: "j4w2b5", location: LOCATIONS.L2, evidenceIds: ["E07"] },
  { id: "k9p3z6", location: LOCATIONS.L2, evidenceIds: ["E08"] },
  // 나팀장 사무실 (용의자 C) — 3개
  { id: "b2r5w1", location: LOCATIONS.L3, evidenceIds: ["E03"] },
  { id: "q7s1d3", location: LOCATIONS.L3, evidenceIds: ["E06"] },
  { id: "t6y8m2", location: LOCATIONS.L3, evidenceIds: ["E10"] },
  // 채소장 연구실 (용의자 B) — 3개
  { id: "m1d7k5", location: LOCATIONS.L4, evidenceIds: ["E01"] },
  { id: "n4v8z3", location: LOCATIONS.L4, evidenceIds: ["E09"] },
  { id: "w3n5k7", location: LOCATIONS.L4, evidenceIds: ["E11"] },
];
