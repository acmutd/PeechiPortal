"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { SignInForm } from "@/components/signinform";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import loginimg from '@/public/cgi/login.png';
import {app} from "@/app/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already logged in, redirect to admin
        router.push('/admin');
      } else {
        // User is not logged in, show login form
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </ThemeProvider>
    );
  }

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
