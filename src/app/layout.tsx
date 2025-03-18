import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const _geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "monopo-saigon",
  description: "We Integrate collaborate, and challenge. We are digital natives embracing the creative freedom to produce solutions that connect, communicate, and inspire.",
  openGraph: {
    title: "monopo saigon | Tokyo-born digitally-driven creative studio",
    description: "We Integrate collaborate, and challenge. We are digital natives embracing the creative freedom to produce solutions that connect, communicate, and inspire.",
    images: [{ url: "images/saigon-web-ogp.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "monopo saigon | Tokyo-born digitally-driven creative studio",
    description: "We Integrate collaborate, and challenge. We are digital natives embracing the creative freedom to produce solutions that connect, communicate, and inspire.",
    images: ["/saigon-web-ogp.jpg"],
  },
  icons: {
    icon: "C:/infinity-live/src/app/LOGO copy.jpg",
  },
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
