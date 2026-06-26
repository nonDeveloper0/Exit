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

| 팀 | 공간 | 공유 |
|----|------|------|
| A팀 | A-1 공간, A-2 공간 | 증거 수집함 실시간 공유 |
| B팀 | B-1 공간, B-2 공간 | 증거 수집함 실시간 공유 |
| C팀 | C-1 공간, C-2 공간 | 증거 수집함 실시간 공유 |

각 팀의 조장 두 명이 같은 팀 ID(A/B/C)를 입력하면 증거 수집함이 자동으로 연동됩니다.

## 주요 문서

- `docs/01_md/01_GDD.md` — 게임 디자인 문서
- `docs/01_md/EDIT_GUIDE.md` — 콘텐츠 직접 수정 가이드
- `progress.md` — 작업 진행 현황 (gitignore)
