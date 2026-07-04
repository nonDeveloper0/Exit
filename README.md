# EXIT 2026 — Season 1

현대판 모세 이야기를 크라임씬 형태로 체험하는 이벤트용 웹 애플리케이션.

## 로컬 실행

```bash
git clone https://github.com/nonDeveloper0/Exit.git
cd Exit
npm install
npm run dev
```

`.env.local` 파일에 Supabase 환경변수 필요:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 기술 스택

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **DB / Realtime**: Supabase
- **Hosting**: Vercel (nonDeveloper0/Exit, master 브랜치 자동 배포)

## 팀 구조

- 조는 **숫자 조 번호**(1조, 2조, …)로 구분하며, 조 수 제한 없이 자유롭게 확장할 수 있습니다.
- 같은 조 번호를 입력한 기기끼리 증거 수집함이 실시간으로 자동 연동됩니다.
- 관리자 패널에서 두 조를 **매핑(짝짓기)**하면 짝지어진 조끼리도 증거를 실시간 공유합니다.

## 주요 문서

- `docs/01_md/01_GDD.md` — 게임 디자인 문서
- `docs/01_md/EDIT_GUIDE.md` — 콘텐츠 직접 수정 가이드
- `ARCHITECTURE.md` — 아키텍처 개요 (라우트, 컴포넌트, 상태 관리)
- `progress.md` — 작업 진행 현황
