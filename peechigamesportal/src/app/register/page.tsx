import Image from "next/image";
import { SignUpForm } from "@/components/signupform";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import type { NextPage } from "next";
import Link from 'next/link';
import leftart from "@/public/cgi/leftart.png";
import rightart from "@/public/cgi/rightart.png";

import acmPinkShapeLogo from '@/public/cgi/acm-pink-logo.png'
import peechiGamesLogoText from '@/public/cgi/peechiGamesLogo.png';
import acmPinkLogo from "@/public/cgi/acm-white 1.png"
import profile from '@/public/cgi/profile.png'

export default function RegisterPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>

<div className="flex flex-row justify-between mx-16">
          <Link href="https://acmutd.co" target="_blank" rel="noopener noreferrer" className="mt-8">
            <Image src={acmPinkLogo} alt="ACM Logo" height={40} />
          </Link>
          <Link href="/" className="mt-10 font-semibold text-l">
            <Image src={peechiGamesLogoText} alt="ACM Logo" height={40} />
          </Link>
          <div className="flex mr-4">
            <Image src={profile} alt="PeechiProfile" width={40} height={40} className="mt-8"/>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-transparent border-t-white mt-12 ml-4"/>
          </div>
        </div>

    <div className="relative w-full max-w-6xl mx-auto px-4 pb-16 justify-between">
      <div className="hidden lg:block absolute left-[-5%] top-1/2 transform -translate-y-1/2">
        <Image src={leftart} alt="Decorative left art" width={130} height={400} />
      </div>
      <div className="hidden lg:block absolute right-[-5%] top-1/2 transform -translate-y-1/2">
        <Image src={rightart} alt="Decorative right art" width={130} height={400} />
      </div>
      <Card className="w-full max-w-2xl mx-auto mt-16">
        <CardHeader>
          <CardTitle><strong>Would You Like to Play?</strong></CardTitle>
          <CardDescription>Multipurpose Field. 04/04. 2:00 PM. Arrive Early.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>

    <div className="border-gray-700 border-t-2 mt-16 flex justify-center py-8">
          <Link href="https://acmutd.co" target="_blank" rel="noopener noreferrer" className="mx-8">
            <Image src={acmPinkShapeLogo} alt="ACM Logo" height={40} />
          </Link>
        </div>
    </ThemeProvider>
  );

}
