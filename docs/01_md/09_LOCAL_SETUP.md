# 로컬 환경 세팅 가이드

다른 컴퓨터에서 이 프로젝트를 처음 실행하기 위한 단계별 가이드.

---

## 사전 조건

- Git 설치됨 (확인: `git --version`)
- Node.js **미설치** 상태라면 아래 1단계부터 진행

---

## 1단계: Node.js 설치

1. [https://nodejs.org](https://nodejs.org) 접속
2. **LTS** 버전 다운로드 (현재 v20 이상 권장)
3. 설치 후 터미널에서 확인:

```bash
node -v   # v20.x.x 등 출력되면 OK
npm -v    # 10.x.x 등 출력되면 OK
```

---

## 2단계: 프로젝트 클론

```bash
git clone <레포 주소>
cd exit
```

---

## 3단계: 의존성 설치

```bash
npm install
```

`node_modules/` 폴더가 생성되면 완료.

---

## 4단계: 환경변수 설정 (Supabase)

`.env.local` 파일은 git에 포함되지 않으므로 직접 생성해야 한다.

### 4-1. `.env.local` 파일 생성

프로젝트 루트(`package.json`이 있는 폴더)에 `.env.local` 파일을 새로 만든다.

```
exit/
├── .env.local   ← 여기에 생성
├── package.json
├── src/
└── ...
```

### 4-2. Supabase 키 확인하는 법

1. [https://supabase.com](https://supabase.com) 접속 후 로그인
2. 해당 프로젝트(exit) 선택
3. 왼쪽 사이드바 → **Project Settings** (톱니바퀴 아이콘)
4. **Data API** 탭 클릭
5. 아래 두 값을 복사:

| 항목 | 위치 |
|------|------|
| `Project URL` | `https://xxxxxx.supabase.co` 형태 |
| `anon public` 키 | `sb_publishable_...` 형태의 긴 문자열 |

### 4-3. `.env.local` 파일 내용 작성

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
```

- `xxxxxx` 부분을 실제 값으로 교체
- 따옴표(`"`) 없이 그대로 붙여넣기

---

## 5단계: 개발 서버 실행

```bash
npm run dev
```

터미널에 아래 메시지가 뜨면 성공:

```
▲ Next.js 16.x.x
- Local: http://localhost:3000
```

브라우저에서 `http://localhost:3000` 접속.

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| `npm: command not found` | Node.js 미설치 | 1단계 재진행 |
| `Error: supabaseUrl is required` | `.env.local` 없거나 내용 오류 | 4단계 재확인 |
| `Module not found` | `npm install` 안 함 | 3단계 재진행 |
| 페이지는 뜨는데 데이터 없음 | Supabase 키 오류 | 4-2에서 키 재확인 |
