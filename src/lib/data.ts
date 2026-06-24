export interface Evidence {
  id: string;
  title: string;
  description: string;
  qrId: string;
  imageUrl?: string;
}

export interface Suspect {
  id: string;
  codename: string;
  role: string;
  motive: string;
  description: string;
  motiveLevel: "높음" | "중간" | "낮음" | "불명";
}

export interface QrLocation {
  id: string;
  name: string;
  description: string;
}

export const EVIDENCE: Evidence[] = [
  {
    id: "E01",
    title: "목격자 진술",
    description: "당일 밤 현장 인근에서 '두 사람이 격렬히 다투는 것'을 목격했다는 진술.",
    qrId: "x4k9m2",
    imageUrl: "/03_evidence.png",
  },
  {
    id: "E02",
    title: "CCTV 일부 영상",
    description: "살인 당일 오후 10시~11시 구간. 특정 구간 30분이 삭제된 것이 확인됨.",
    qrId: "p7n3q8",
  },
  {
    id: "E03",
    title: "통화기록",
    description: "사건 당일 피해자와 C(M) 사이의 3분간 통화 내역 확인됨. 내용 불명.",
    qrId: "h6t4c3",
  },
  {
    id: "E04",
    title: "문자내역",
    description: "사건 전날 피해자가 A에게 보낸 문자. '다시는 반항하지 마라'는 내용 포함.",
    qrId: "h6t4c3",
  },
  {
    id: "E05",
    title: "혈흔 사진",
    description: "현장 주변에서 발견된 혈흔. 피해자의 혈액형과 일치하며, 격렬한 저항의 흔적이 보인다.",
    qrId: "j8f2v9",
    imageUrl: "/02_blood.png",
  },
  {
    id: "E06",
    title: "인사기록",
    description: "C의 입사 서류. 출생지, 이전 주소, 학력 항목이 공란으로 처리됨.",
    qrId: "b2r5w1",
  },
  {
    id: "E07",
    title: "징계문서",
    description: "피해자가 노동자 A를 부당 징계한 문서. 폭행 은폐 정황이 드러남.",
    qrId: "b2r5w1",
  },
  {
    id: "E08",
    title: "병원기록",
    description: "지난 6개월간 현장 노동자 9명이 외상으로 치료받은 기록. 사유: '작업 중 사고'.",
    qrId: "j8f2v9",
  },
  {
    id: "E09",
    title: "현장출입기록",
    description: "사건 당일 오후 9시 이후 출입자: A, B, C(M). 퇴장 기록 없음.",
    qrId: "x4k9m2",
  },
  {
    id: "E10",
    title: "비밀문서",
    description: "C(M)가 회장에게 보낸 서한 일부. '더 이상 두고 볼 수 없습니다'라는 문구만 해독 가능.",
    qrId: "m1d7k5",
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: "A",
    codename: "용의자 A",
    role: "노동자 대표",
    motive: "반복적인 폭행과 착취에 대한 복수",
    description:
      "현장 노동자들의 리더. 피해자에게 수차례 부당한 폭행과 징계를 받아왔다. 사건 당일 현장에 있었음을 인정했다.",
    motiveLevel: "높음",
  },
  {
    id: "B",
    codename: "용의자 B",
    role: "현장 소장",
    motive: "비리 은폐",
    description:
      "공사 현장의 실질적 책임자. 피해자와 수년간 부당 거래를 해온 것으로 알려져 있다. 사건 관련 서류를 사전에 은폐한 정황이 있다.",
    motiveLevel: "중간",
  },
  {
    id: "C",
    codename: "용의자 C",
    role: "회장 아들 (M)",
    motive: "불명확 — 조사 중",
    description:
      "회장의 아들이라는 것 외에 신원 대부분이 비공개. 사건 당일 현장에 있었으며, 사건 직후 잠적. 연락 두절.",
    motiveLevel: "불명",
  },
];

export const QR_LOCATIONS: QrLocation[] = [
  {
    id: "x4k9m2",
    name: "살해 현장",
    description: "피해자가 발견된 공사장 B2 구역. 격렬한 다툼의 흔적이 남아있다.",
  },
  {
    id: "p7n3q8",
    name: "CCTV 관제실",
    description: "현장 내 영상 감시 시스템 관리실. 일부 영상이 삭제된 것이 확인됨.",
  },
  {
    id: "b2r5w1",
    name: "기록보관실",
    description: "인사 및 징계 관련 서류 보관소. 최근 파일 일부가 이동된 흔적이 있다.",
  },
  {
    id: "h6t4c3",
    name: "통신분석실",
    description: "디지털 포렌식 분석 공간. 압수된 휴대폰 기록이 복원 중이다.",
  },
  {
    id: "j8f2v9",
    name: "목격자 진술실",
    description: "목격자 청취 공간. 진술의 일관성 여부를 분석 중이다.",
  },
  {
    id: "m1d7k5",
    name: "비밀문서실",
    description: "회장실 산하 기밀 보관소. 잠금장치가 강제 개방된 흔적이 있다.",
  },
  {
    id: "q3s9p4",
    name: "주차장",
    description: "현장 외부 주차장. 당일 차량 이동 기록이 부분 복원됨.",
  },
  {
    id: "w7b6n2",
    name: "창고",
    description: "공구 및 자재 보관 창고. 범행에 사용된 도구가 있을 수 있다.",
  },
];
