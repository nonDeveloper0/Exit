<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 파일 인코딩 규칙 (한글 깨짐 방지)

이 저장소의 모든 텍스트 파일은 **UTF-8 (BOM 없음) + LF** 로 통일한다. 여러 AI 도구(Codex, Claude 등)가 번갈아 작업하므로 이 규칙을 반드시 지킨다.

- 파일을 새로 만들거나 수정할 때는 **에디터/편집 도구**를 사용하고, 항상 UTF-8(BOM 없음)로 저장한다.
- **Windows PowerShell의 리다이렉트로 한글 파일을 쓰지 마라.** `>`, `>>`, `Set-Content` 기본형은 파일을 UTF-16 또는 CP949(ANSI)로 재저장해 한글을 깨뜨린다.
  - 부득이하게 셸로 써야 하면 `Out-File -Encoding utf8`(PowerShell 7 권장, 5.1은 BOM이 붙음) 또는 `[IO.File]::WriteAllText($path,$text,[Text.UTF8Encoding]::new($false))`를 쓴다.
- BOM(`EF BB BF`)을 파일 앞에 붙이지 마라. Next.js/Vercel 표준은 BOM 없는 UTF-8이다.
- 줄바꿈은 LF. `.gitattributes`가 커밋 시 자동 정규화한다.
- 규칙은 저장소의 `.gitattributes`, `.editorconfig`에 고정돼 있다 — 이를 우회하지 마라.
