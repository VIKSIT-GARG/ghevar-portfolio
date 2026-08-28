import type { Metadata } from "next";
import { Dancing_Script, Quicksand, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "For You ♡ — a little corner just for you",
  description:
    "A dreamy, animated personal corner — sakura petals, soft music, and little letters made with love.",
  keywords: ["For You", "anime", "sakura", "dashboard", "personal"],
  authors: [{ name: "made with love" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dancing.variable} ${quicksand.variable} ${zenMaru.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
