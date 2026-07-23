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
  imageUrl?: string; // 용의자 사진/실루엣. public/에 파일 넣고 "/파일명" 지정. 없으면 기본 실루엣 표시
}

// 최종 추리 제출에 필요한 최소 증거  수 (0 = 제한 없음)
export const VOTE_UNLOCK_COUNT = 0;

// 비밀번호로 잠긴 증거 목록. { 증거ID: "비밀번호" } 형태로 지정.
export const LOCKED_EVIDENCE: Record<string, string> = {
  E15: "poison kill",
  E01: "1234",
};

// 잠긴 증거 퀴즈 문제. { 증거ID: "문제" } 형태로 지정. 없으면 기본 안내 문구 표시.
export const EVIDENCE_QUIZ: Record<string, string> = {
  E15: "부검표의 독성 반응을 일으킨 살해 방식 두 단어를 영어로 입력하세요.",
  E01: "퀴즈 문제를 여기에 입력하세요.",
};

// 공통 단서: 어느 조든 처음 찾으면 전체 조에 공개되고 전체 공지 토스트가 뜬다.
// 여기에 증거 ID를 넣으면 그 증거는 "조별 증거"가 아니라 "전역 공유 증거"로 동작한다.
export const COMMON_EVIDENCE_IDS: string[] = ["E10"];

// 공통 단서를 저장하는 가상의 조 ID (실제 조 번호와 겹치지 않아야 함)
export const GLOBAL_PAIR_ID = "__global";

// 사진 증거(폴라로이드) 방식
// 참가자가 물리 단서를 직접 촬영해 업로드한다. Supabase Storage 'evidence-photos' + photo_evidence 테이블.
export const PHOTO_BUCKET = "evidence-photos";

// 업로드 시 "관련 인물" 태그 드롭다운. 미지정은 UI에서 빈 문자열("")로 처리하고 DB에는 null로 저장한다.
export const PHOTO_TAGS: { value: string; label: string }[] = [
  { value: "A", label: "나사장" },
  { value: "B", label: "채소장" },
  { value: "C", label: "나팀장" },
  { value: "D", label: "이대리" },
  { value: "E", label: "김사원" },
  { value: "PARK", label: "박실장 (피해자)" },
];

export function photoTagLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return PHOTO_TAGS.find((tag) => tag.value === value)?.label ?? null;
}

// 사진 보드·라이트박스·관리자 화면에서 재사용하는 인물 태그의 고정 파스텔 톤.
export function photoTagTone(value: string | null | undefined): string {
  switch (value) {
    case "A":
      return "bg-amber-200 text-amber-950";
    case "B":
      return "bg-emerald-200 text-emerald-950";
    case "C":
      return "bg-blue-200 text-blue-950";
    case "D":
      return "bg-violet-200 text-violet-950";
    case "E":
      return "bg-rose-200 text-rose-950";
    case "PARK":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-zinc-700 text-zinc-300";
  }
}

// 업로드 시 "관련 장소" 태그 드롭다운. 미지정은 UI에서 빈 문자열("")로 처리하고 DB에는 null로 저장한다.
export const PHOTO_LOCATION_TAGS: { value: string; label: string }[] = [
  { value: "WAREHOUSE", label: "자재 물류창고" },
  { value: "NA_CEO_OFFICE", label: "나사장 사무실" },
  { value: "NA_TEAM_LEADER_OFFICE", label: "나팀장 사무실" },
  { value: "CHAE_MANAGER_LAB", label: "채소장 연구실" },
];

export function photoLocationTagLabel(value: string | null | undefined): string | null {
  const unspecifiedLabel = PHOTO_LOCATION_TAGS.find((tag) => tag.value === "")?.label ?? null;
  if (!value) return unspecifiedLabel;
  return PHOTO_LOCATION_TAGS.find((tag) => tag.value === value)?.label ?? null;
}

// 수신전화 연출 이벤트. pair_id에는 CALL01을 수집할 대상 조 번호가 들어간다.
export const INCOMING_CALL_EVENT_ID = "_incoming_call";
export const INCOMING_CALL_EVENT_TYPE = "incoming_call";
export const INCOMING_CALL_AUDIO_URL = "/audio/탐정대사_소라.m4a";
export const INCOMING_CALL_EVIDENCE_ID = "CALL01";
// 전화 연출 초기화 브로드캐스트. 수신 전용 기기(/phone)의 통화 재생 상태를 원격으로 리셋한다.
export const CALL_RESET_EVENT_ID = "_call_reset";
export const CALL_RESET_EVENT_TYPE = "call_reset";
export const RANKING_EXCLUDED_EVIDENCE_IDS: string[] = [INCOMING_CALL_EVIDENCE_ID];

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
    id: INCOMING_CALL_EVIDENCE_ID,
    title: "통화녹음 내역",
    description: "발신번호 표시제한 전화에서 녹음된 통화 내역. 증거함에서 다시 들을 수 있다.",
    audioUrl: INCOMING_CALL_AUDIO_URL,
  },
  {
    id: "E01",
    title: "감사패",
    description: "나사장 집무실에 놓인 오래된 감사패. 뒷면에 비밀장부 파일을 여는 데 쓰일 만한 숫자 흔적이 남아 있다.",
    imageUrl: "/03_evidence.png",
  },
  {
    id: "E02",
    title: "협박메시지",
    description: "박실장이 나사장에게 보낸 메시지 일부. 내부 감사 전까지 돈과 서류를 정리하라는 압박이 담겨 있다.",
  },
  {
    id: "E03",
    title: "비밀장부",
    description: "자재 대금과 실제 입출고 수량이 맞지 않는 장부. 박실장과 회사 윗선이 함께 숨긴 항목이 표시돼 있다.",
  },
  {
    id: "E04",
    title: "이동동선",
    description: "사건 당일 저녁 나팀장의 사내 이동 기록. 김사원 퇴근 직후 물류창고 방향으로 이동한 흔적이 남아 있다.",
  },
  {
    id: "E05",
    title: "삭제된 출입기록",
    description: "물류창고 출입 로그 일부가 삭제된 파일. 삭제 시각과 계정 정보가 온전히 지워지지 않았다.",
    imageUrl: "/02_blood.png",
  },
  {
    id: "E06",
    title: "미완성 메모",
    description: "나팀장 책상에서 발견된 찢긴 메모. '김사원', '더는 방치할 수 없음', '직접 확인'이라는 단어만 남아 있다.",
  },
  {
    id: "E07",
    title: "약봉투",
    description: "이대리 이름으로 조제된 신경안정제 봉투. 사건 당일 저녁 약국 결제 시각이 함께 확인된다.",
  },
  {
    id: "E08",
    title: "카톡 대화",
    description: "이대리가 채소장에게 보낸 메시지. 박실장이 김사원을 폭행했고 자신은 더 이상 못 보겠다는 내용이 포함돼 있다.",
  },
  {
    id: "E09",
    title: "파쇄문서",
    description: "복구된 파쇄 문서 조각. 물류팀 비리와 관련된 비밀유지각서 일부로 보이며 이대리 서명이 남아 있다.",
  },
  {
    id: "E10",
    title: "폭행녹음",
    description: "김사원 휴대폰에 남아 있던 녹음 파일. 박실장의 폭언과 물리적 충돌음이 짧게 기록돼 있다.",
  },
  {
    id: "E11",
    title: "택시영수증",
    description: "김사원 지갑에서 발견된 택시 영수증. 퇴근 이후 회사 밖으로 이동한 시각과 목적지가 찍혀 있다.",
  },
  {
    id: "E12",
    title: "형제사진",
    description: "오래된 가족사진. 김사원과 나팀장이 형제로 보이는 정황이 있으나, 회사 기록에는 두 사람의 관계가 남아 있지 않다.",
  },
  {
    id: "E13",
    title: "채소장 다이어리",
    description: "채소장의 개인 다이어리. 김사원을 걱정하는 문장과 박실장에게 강한 분노를 느낀 흔적이 함께 적혀 있다.",
  },
  {
    id: "E14",
    title: "독극물 재고표",
    description: "위험물 보관함 재고표. 사건 직후 특정 약품 수량이 맞지 않고, 수정된 흔적이 남아 있다.",
  },
  {
    id: "E15",
    title: "부검표",
    description: "박실장의 사망 관련 검시 메모. 외상과 독성 반응이 함께 기록되어 사망 경위를 다시 따져볼 필요가 있다.",
  },
  {
    id: "E16",
    title: "지문감식 결과보고서",
    description: "물류창고 현장 흉기와 주변에서 채취한 지문 감식 결과. 피해자 외 미상의 지문이 검출됐고, 사내 등록 지문과 대조에서 일치 항목이 확인됐다. (나사장 노트북에서 열람)",
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: "A",
    codename: "용의자 A",
    name: "나사장",
    role: "녹산건설 대표",
    motive: "협박 차단과 회사 보호",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E07", "E08"])
    relatedEvidenceIds: ["E01", "E02", "E03"],
    interrogationTriggerId: "E13",
    description:
      "녹산건설 대표. 박실장의 자재 횡령과 장부 조작을 알고도 묵인해 왔다. 내부 감사가 다가오자 회사 이미지와 자신의 책임을 지키려 했다는 의심을 받는다.",
    motiveLevel: "높음",
  },
  {
    id: "B",
    codename: "용의자 B",
    name: "채소장",
    role: "위험물관리사",
    motive: "김사원 보호와 현장 조작 의혹",
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E02", "E06"])
    relatedEvidenceIds: ["E13", "E14", "E15"],
    interrogationTriggerId: "E15", // E15 정답 입력 시 채소장 심문권 획득
    description:
      "위험물관리사. 김사원과 가까운 사이이며 독극물 취급 권한을 갖고 있다. 사건 이후 현장에 접근했고, 박실장의 사망 원인을 흐리게 만들 수 있는 위치에 있었다.",
    motiveLevel: "높음",
  },
  {
    id: "C",
    codename: "용의자 C",
    name: "나팀장",
    role: "전략기획실 팀장",
    motive: "김사원 보호와 박실장 비리 응징", // TODO: 동기 확정 후 교체
    motiveRevealIds: [], // TODO: 동기 공개 트리거 증거 ID 입력 (예: ["E10"])
    relatedEvidenceIds: ["E04", "E05", "E06"],
    interrogationTriggerId: "E12",
    description:
      "전략기획실 팀장. 정의감이 강하고 박실장의 비리를 오래 의심해 왔다. 김사원과의 관계를 회사에 숨기고 있었으며, 사건 당일 물류창고에 들어간 정황이 있다.",
    motiveLevel: "중간",
  },
  {
    id: "D",
    codename: "용의자 D",
    name: "이대리",
    role: "물류팀 대리",
    motive: "비리 공범 관계와 폭행 방조 부담",
    motiveRevealIds: [],
    relatedEvidenceIds: ["E07", "E08", "E09"],
    interrogationTriggerId: "E14",
    description:
      "물류팀 대리. 박실장의 장부 조작을 가까이서 도운 인물로, 사건 당일 김사원 폭행 장면을 보고도 창고를 떠났다. 이후 약국에 다녀온 기록이 있어 행적 확인이 필요하다.",
    motiveLevel: "중간",
  },
  {
    id: "E",
    codename: "용의자 E",
    name: "김사원",
    role: "물류팀 사원",
    motive: "지속적인 폭행 피해와 허위장부 지시 거부",
    motiveRevealIds: [],
    relatedEvidenceIds: ["E10", "E11", "E12"],
    interrogationTriggerId: "E11",
    description:
      "물류팀 사원. 박실장에게 지속적으로 폭행을 당했고, 사건 당일 허위장부 작업 지시를 거부했다. 퇴근 후 행적은 일부 확인되지만 나팀장과의 숨겨진 관계가 사건의 핵심 변수로 남아 있다.",
    motiveLevel: "높음",
  },
];

// QR 총 15개 = 자재 물류창고 6개 + 나사장 집무실 4개 + 나팀장 사무실 4개 + 채소장 연구실 1개
// ※ 아래 slug 중 c8v3k1~w3n5k7(9개)는 새로 생성한 값 — 실제 인쇄 QR과 일치시키거나 원하는 값으로 교체하세요.
export const QR_CODES: QrCode[] = [
  // 자재 물류창고 (사건 현장) — 6개
  { id: "x4k9m2", location: LOCATIONS.L1, evidenceIds: ["E07"] },
  { id: "p7n3q8", location: LOCATIONS.L1, evidenceIds: ["E08"] },
  { id: "c8v3k1", location: LOCATIONS.L1, evidenceIds: ["E09"] },
  { id: "d2m9x4", location: LOCATIONS.L1, evidenceIds: ["E10"] },
  { id: "f5r7t2", location: LOCATIONS.L1, evidenceIds: ["E11"] },
  { id: "n4v8z3", location: LOCATIONS.L1, evidenceIds: ["E14"] },
  // 나사장 집무실 (용의자 A) — 4개
  { id: "h6t4c3", location: LOCATIONS.L2, evidenceIds: ["E01"] },
  { id: "j4w2b5", location: LOCATIONS.L2, evidenceIds: ["E02"] },
  { id: "k9p3z6", location: LOCATIONS.L2, evidenceIds: ["E03"] },
  { id: "m1d7k5", location: LOCATIONS.L2, evidenceIds: ["E13"] },
  // 나팀장 사무실 (용의자 C) — 4개
  { id: "b2r5w1", location: LOCATIONS.L3, evidenceIds: ["E04"] },
  { id: "q7s1d3", location: LOCATIONS.L3, evidenceIds: ["E05"] },
  { id: "t6y8m2", location: LOCATIONS.L3, evidenceIds: ["E06"] },
  { id: "g1h6n8", location: LOCATIONS.L3, evidenceIds: ["E12"] },
  // 채소장 연구실 (용의자 B) — 1개
  { id: "w3n5k7", location: LOCATIONS.L4, evidenceIds: ["E15"] },
];

// QR 심문권 퀴즈
// 구버전에서는 QR이 증거 수집용이었지만, 사진 방식 전환 후에는 심문권 획득용 퀴즈로 사용한다.
export interface InterrogationQuiz {
  suspectId: string;
  question?: string;
  answer?: string;
  autoGrant?: boolean;
  earnedNote?: string; // 심문권 획득 화면에 함께 표시할 문구 (선택)
}

export const INTERROGATION_QUIZZES: Record<string, InterrogationQuiz> = {
  f5r7t2: {
    suspectId: "E",
    autoGrant: true,
  },
  g1h6n8: {
    suspectId: "C",
    autoGrant: true,
  },
  m1d7k5: {
    suspectId: "A",
    autoGrant: true,
  },
  n4v8z3: {
    suspectId: "D",
    autoGrant: true,
  },
  w3n5k7: {
    suspectId: "B",
    question: "화학용액 조제 및 배합 공정",
    answer: "poison kill",
    earnedNote: "국립과학수사연구원..?",
  },
};
