import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "나팀장 개인폰",
  description: "녹산건설 물류창고 살인사건 수신 전용 기기",
  manifest: "/phone.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "나팀장 개인폰",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#03070b",
};

export default function PhoneLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}