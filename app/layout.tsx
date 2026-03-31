import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLI — Your team talks. OLI codes.",
  description:
    "One app that replaces your chat, your tracker, and your backlog — then writes the code. Download OLI for macOS, Windows, and Linux.",
  openGraph: {
    title: "OLI — Your team talks. OLI codes.",
    description:
      "One app that replaces your chat, your tracker, and your backlog — then writes the code.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OLI — Your team talks. OLI codes.",
    description:
      "One app that replaces your chat, your tracker, and your backlog — then writes the code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
