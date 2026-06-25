import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EXIT SEASON1",
  description: "NS건설 공사 현장 살인사건 특별 수사",
  openGraph: {
    title: "EXIT SEASON1",
    description: "NS건설 공사 현장 살인사건 특별 수사",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 pb-16">
        <div className="max-w-md mx-auto min-h-full">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
