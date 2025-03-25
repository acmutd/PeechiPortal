import Image from "next/image";
import { SignUpForm } from "@/components/signupform";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import type { NextPage } from "next";
import leftart from "@/public/cgi/leftart.png";
import rightart from "@/public/cgi/rightart.png";

export default function RegisterPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
    </ThemeProvider>
  );

}
