export interface Evidence {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Suspect {
  id: string;
  codename: string;
  role: string;
  motive: string;
  motiveRevealIds: string[]; // 이 증거들을 모두 수집하면 motive 공개
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

// 장소 이름 — 수정 시 여기서만 변경
export const LOCATIONS = {
  L1: "살해 현장",
  L2: "CCTV 관제실",
  L3: "주차장",
  L4: "창고",
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
];

export const SUSPECTS: Suspect[] = [
  {
    id: "A",
    codename: "용의자 A",
    role: "노동자 대표",
    motive: "반복적인 폭행과 착취에 대한 복수",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E07", "E08"])
    description:
      "현장 노동자들의 리더. 피해자에게 수차례 부당한 폭행과 징계를 받아왔다. 사건 당일 현장에 있었음을 인정했다.",
    motiveLevel: "높음",
  },
  {
    id: "B",
    codename: "용의자 B",
    role: "현장 소장",
    motive: "비리 은폐",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E02", "E06"])
    description:
      "공사 현장의 실질적 책임자. 피해자와 수년간 부당 거래를 해온 것으로 알려져 있다. 사건 관련 서류를 사전에 은폐한 정황이 있다.",
    motiveLevel: "중간",
  },
  {
    id: "C",
    codename: "용의자 C",
    role: "회장 아들",
    motive: "불명확 — 조사 중", // TODO: 동기 확정 후 교체
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E10"])
    description:
      "회장의 아들이라는 것 외에 신원 대부분이 비공개. 사건 당일 현장에 있었으며, 사건 직후 잠적. 연락 두절.",
    motiveLevel: "불명",
  },
  {
    id: "D",
    codename: "용의자 D",
    role: "경비원",
    motive: "해고 통보와 임금 체불에 대한 원한",
    motiveRevealIds: [],
    description:
      "공사 현장 정문 담당 경비원. 사건 당일 야간 근무 중이었으며 현장 출입을 직접 통제하는 위치에 있었다. 피해자로부터 수개월간 임금을 받지 못했고, 사건 이틀 전 일방적인 해고를 통보받은 것으로 확인됐다.",
    motiveLevel: "중간",
  },
  {
    id: "E",
    codename: "용의자 E",
    role: "경호실장",
    motive: "피해자의 내부 고발 차단 — 조직 비리 은폐",
    motiveRevealIds: [],
    description:
      "회장 직속 경호실장. 현장 CCTV 관리 권한을 보유하고 있으며, 삭제된 영상 구간의 접근 이력이 그의 계정에서 발견됐다. 사건 당일 행적에 대해 일관성 없는 진술을 반복하고 있다.",
    motiveLevel: "높음",
  },
];

export const QR_CODES: QrCode[] = [
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E01"] },
  { id: "p7n3q8", location: LOCATIONS.L1, evidenceIds: ["E09", "E02"] },
  { id: "h6t4c3", location: LOCATIONS.L2, evidenceIds: ["E03", "E04"] },
  { id: "b2r5w1", location: LOCATIONS.L3, evidenceIds: ["E05", "E06"] },
  { id: "m1d7k5", location: LOCATIONS.L4, evidenceIds: ["E07", "E08"] },
  { id: "n4v8z3", location: LOCATIONS.L4, evidenceIds: ["E10"] },
];
