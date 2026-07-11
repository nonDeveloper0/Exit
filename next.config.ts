import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 연출용 정적 화면을 .html 없이 접속 가능하게 (참가자 UI엔 여전히 링크 없음)
  async rewrites() {
    return [
      { source: "/screen/ipad", destination: "/screen/ipad.html" },
      { source: "/screen/laptop", destination: "/screen/laptop.html" },
    ];
  },
};

export default nextConfig;
