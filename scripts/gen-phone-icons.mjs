// PWA 홈화면 아이콘 생성기 (일회성). sharp로 SVG→PNG 래스터화.
// 사용: node scripts/gen-phone-icons.mjs  →  public/screen/icons/*.png
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const svgs = {
  // phone2: 채소장 폰(카카오톡 채팅) → 카카오 느낌의 노란 배경 + 갈색 말풍선
  phone2: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="115" fill="#FEE500"/>
  <g fill="#371D1E">
    <ellipse cx="256" cy="248" rx="140" ry="112"/>
    <path d="M182 404 L206 330 L258 356 Z"/>
  </g>
</svg>`,
  // phone3: 통화기록(전화 앱) → 초록 배경 + 흰색 수화기(Material call glyph)
  phone3: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="115" fill="#34C759"/>
  <g transform="translate(128,128) scale(10.6667)" fill="#FFFFFF">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </g>
</svg>`,
};

const sizes = [512, 192, 180];

mkdirSync("public/screen/icons", { recursive: true });

for (const [name, svg] of Object.entries(svgs)) {
  for (const s of sizes) {
    const out = `public/screen/icons/${name}-${s}.png`;
    await sharp(Buffer.from(svg)).resize(s, s).png().toFile(out);
    console.log("wrote", out);
  }
}
