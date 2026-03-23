'use client'

import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { SignUpForm } from "@/components/signupform";
import { ArrowLeft } from "lucide-react";

import backgroundImage from '@/public/cgi/bg.png';
import acmWhiteLogo from '@/public/cgi/acm-white-logo.png';

export default function RegisterPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 72% 50%, rgba(185, 68, 48, 0.22) 0%, rgba(0,0,0,0) 42%), linear-gradient(to right, rgba(0,0,0,0.92) 8%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.12) 100%), url(${backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-3 py-6 sm:px-6 md:px-8">
          <Card className="w-full max-w-3xl border-white/10 bg-black/45 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-sm">
            <CardContent className="px-6 pb-10 pt-8 sm:px-10 md:px-12 md:pt-10">
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-white/85 transition-colors hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-sunday text-base uppercase tracking-wide">Back</span>
                </Link>
                <Link href="https://acmutd.co" target="_blank">
                  <Image src={acmWhiteLogo} alt="ACM Logo" className="h-5 w-auto opacity-90" />
                </Link>
              </div>

              <h1 className="mb-8 font-moderna text-[56px] font-normal leading-[0.92] tracking-tight text-white sm:text-[82px] md:mb-10 md:text-[112px]">
                REGISTER
              </h1>

              <SignUpForm />

              <p className="mt-8 text-center font-sunday text-xl lowercase text-white/85 sm:text-2xl">
                rock. paper. scissors?
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}
