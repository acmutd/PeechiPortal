import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from 'next/image';
import Link from 'next/link';
import "./globals.css";
import solologo from '@/public/cgi/solologo.png';
import acmlogo from '@/public/cgi/acmlogo.png';
import AnimationOverlay from "@/components/AnimationOverlay";
import acmPinkLogo from '@/public/cgi/acm-white 1.png';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peechi Games",
  description: "Be a Part of ACM's Biggest Event Ever!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AnimationOverlay />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
