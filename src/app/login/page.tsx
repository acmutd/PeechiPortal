import Image from "next/image";
import { SignInForm } from "@/components/signinform";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import loginimg from '@/public/cgi/login.png';
import type { NextPage } from "next";
import AnimationOverlay from "@/components/AnimationOverlay";
import {app} from "@/app/firebase"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div>
        <div className="w-full py-4 flex justify-center">
            <Image
            src={loginimg}
            alt="Event Logo"
            width={ 150}
            height={ 100}
              className="rounded-lg shadow-2xl"
            priority
            />
        </div>
        <Card className="w-full max-w-md mx-auto mt-16">
          <CardHeader>
            <CardTitle><strong>Sign In</strong></CardTitle>
            <CardDescription>Send a Slack Message to Michael or Mercedes for Help</CardDescription>
          </CardHeader>
          <CardContent>
              <SignInForm />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
