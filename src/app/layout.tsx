import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import AnimationOverlay from "@/components/AnimationOverlay";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const moderna = localFont({
  src: '../../public/fonts/MODERNA_.woff2', 
  variable: '--font-moderna'
})

const sunday = localFont({
  src: '../../public/fonts/SundayMasthead-Regular.woff2', 
  variable: '--font-sunday'
})


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
        className={`${geistSans.variable} ${geistMono.variable} ${moderna.variable} ${sunday.variable} antialiased min-h-screen flex flex-col`}
      >
        <AnimationOverlay />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
