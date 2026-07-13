# 15. 엔딩 화면 개편 — 모세 반전 제거, 시즌2 예고로 교체 (Codex용 지시서)

작성일: 2026-07-14 / 상태: **구현 대기 (코드 미작성)**

이 문서는 Codex가 그대로 따라 구현하기 위한 지시서다. 결정은 모두 확정됐다. 임의 해석·기능 추가 금지.

---

## 0. 한 줄 요약

엔딩 화면(`src/app/ending/page.tsx`)에서 **범인 공개 + 모세 이야기 반전(성경 대조표) 전체를 걷어내고**, 화면에는 **"EXIT SEASON 2 — TO BE CONTINUED..."** 만 표시한다. 진실/반전은 화면이 아니라 **MC가 현장에서 직접 설명**한다.

---

## 1. 확정된 결정사항 (사용자 승인 완료)

1. **전체 교체.** 기존 "진실 공개" 버튼 화면과, 버튼을 누른 뒤 나오던 "범인은 C(회장의 아들 M)" 카드 + "M의 진짜 정체(모세)" 반전 + 성경 대조표까지 **전부 화면에서 제거**한다. 참가자는 화면으로는 아무 반전도 보지 않는다.
2. **기존 코드는 삭제하지 말고 주석 처리해 보존한다.** 특히 "진실 공개" 버튼과 그 이후 로직은 통째로 주석 블록으로 남긴다(추후 복원 가능하도록).
3. **새 화면 문구**: `EXIT SEASON 2` / `TO BE CONTINUED...` — 이 두 줄만 있으면 된다. 범인 정보, 동기, 대조표 등 어떤 스토리 내용도 넣지 않는다.
4. **문서(CLAUDE.md·02_STORY.md·01_GDD.md 등)는 이번엔 건드리지 않는다.** "핵심 반전 = 모세 이야기" 관련 설명은 다른 세션에서 별도로 정리하기로 함. **이번 작업 범위는 `src/app/ending/page.tsx` 코드뿐.**

---

## 2. 변경 대상 파일

`src/app/ending/page.tsx` — 전체 교체.

---

## 3. 참조 구현 (그대로 적용)

기존 파일 전체를, 아래처럼 **주석 블록(기존 로직 보존) + 새 컴포넌트(활성 코드)** 구조로 교체한다.

```tsx
"use client";

// ── 구버전: 범인 공개 + 모세 이야기 반전(성경 대조표) ──────────────────────
// 시즌2 예고 화면으로 교체하며 주석 처리. 진실 공개는 이제 화면이 아니라
// MC가 현장에서 직접 설명한다. 복원이 필요하면 아래 블록을 되살릴 것.
/*
import { useState } from "react";
import Link from "next/link";

export default function EndingPage() {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center gap-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
            수사 종료
          </p>
          <h1 className="text-3xl font-black text-zinc-100">진실의 순간</h1>
          <p className="text-sm text-zinc-500">
            녹산건설 물류창고 살인사건의 진실이 밝혀집니다.
          </p>
        </div>

        <button
          onClick={() => setRevealed(true)}
          className="rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold px-10 py-4 text-base transition-all"
        >
          진실 공개
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 pt-10 pb-12">
      <div className="text-center space-y-4">
        <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
          최종 수사 결과
        </p>
        <h1 className="text-2xl font-bold text-zinc-100">진범은...</h1>

        <div className="rounded-xl border-2 border-red-500/50 bg-red-500/10 p-6 space-y-2">
          <p className="text-6xl font-black text-red-400">C</p>
          <p className="text-xl font-bold text-zinc-100">회장의 아들 M</p>
          <p className="text-sm text-zinc-500">신원 불명 / 사건 직후 잠적</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-500 font-mono shrink-0">그런데...</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-amber-400 text-center">M의 진짜 정체</h2>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">
            C의 진짜 이름은{" "}
            <strong className="text-amber-400 text-base">모세</strong>
            입니다.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            노예처럼 착취당하던 히브리 노동자들을 폭행하는 이집트 감독관을 막다가,
            격렬한 싸움 끝에 감독관이 사망했습니다. 모세는 이집트를 떠나 광야로 향했습니다.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            여러분이 방금 수사한 이 사건은,
            <br />
            <span className="text-amber-400">출애굽기에 기록된 모세 이야기</span>
            입니다.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            이야기 대조표
          </h3>
          <div className="space-y-2">
            {[
              ["피해자 (현장 관리자)", "이집트 감독관"],
              ["용의자 A (노동자 대표)", "히브리 노예들"],
              ["용의자 B (현장 소장)", "이집트 관료"],
              ["용의자 C — M", "모세"],
              ["녹산건설 물류창고", "고대 이집트"],
            ].map(([left, right]) => (
              <div key={left} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400 flex-1">{left}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-amber-400 flex-1 text-right">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pt-2 space-y-1">
        <p className="text-sm text-zinc-400 leading-relaxed">
          여러분은 지금 모세의 이야기를 살았습니다.
        </p>
        <p className="text-xs text-zinc-600">EXIT 2026</p>
      </div>

      <Link href="/" className="text-center text-xs text-zinc-600 hover:text-zinc-400">
        수사본부로 돌아가기
      </Link>
    </div>
  );
}
*/

export default function EndingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center gap-3">
      <h1 className="text-3xl font-black tracking-widest text-zinc-100">
        EXIT SEASON 2
      </h1>
      <p className="text-sm font-mono tracking-widest text-zinc-500 uppercase">
        To be continued...
      </p>
    </div>
  );
}
```

---

## 4. 주의사항

- 새 컴포넌트는 **상태(`useState`) 없음, 버튼 없음, 링크 없음** — 정적 화면 하나만 렌더링. MC가 이 화면을 띄운 채로 구두 설명을 진행하는 용도.
- 주석 블록 안의 `import { useState } from "react";`, `import Link from "next/link";`는 **주석 안에 있으므로 실제 import 문으로 처리되지 않는다.** 새 컴포넌트에 `useState`/`Link`가 필요 없으면 파일 상단에 활성 import로 남기지 말 것(빌드 경고 방지).
- `src/components/GameStateRedirect.tsx`(어드민이 `ending_open` 켜면 전 참가자 기기를 `/ending`으로 이동시키는 로직)는 **변경 불필요** — 라우트(`/ending`)는 그대로 유지되므로 자동 이동은 이 새 화면으로 그대로 연결된다.
- `docs/01_md/EDIT_GUIDE.md`, `02_STORY.md`, `01_GDD.md`, `CLAUDE.md`는 **이번 작업에서 건드리지 않는다** (별도 세션에서 정리 예정).

---

## 5. 수용 기준

- [ ] `/ending` 접속 시 즉시 "EXIT SEASON 2" / "TO BE CONTINUED..." 화면만 보임. 버튼·범인 정보·모세 언급 전혀 없음.
- [ ] 기존 반전 코드는 파일 내에 주석으로 보존되어 있음(삭제되지 않음).
- [ ] 어드민 `ending_open` 트리거 시 참가자 전원이 여전히 `/ending`으로 자동 이동함(기존 동작 유지).
- [ ] `npm run build` 통과.

---

## 6. 작업 후 문서 업데이트 지시

- `progress.md` "작업완료"에 변경 내역 기록(CLAUDE.md 규칙). 이번 작업은 코드만 대상이므로 스토리/기획 문서는 갱신하지 않는다.
