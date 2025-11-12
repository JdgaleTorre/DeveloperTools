import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/public/globals.css";
import Header from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevTools",
  description: "AI-powered project management for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background dark:bg-background-dark dark:text-text-dark`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
