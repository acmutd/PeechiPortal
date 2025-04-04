import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, FileSpreadsheet } from "lucide-react";

export default function AdminDashboard() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Peechi Games Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage participants, track eliminations, and monitor game progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                Check-in System
              </CardTitle>
              <CardDescription>
                Register participants on event day and assign player numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check in registered participants as they arrive at the event. Each participant will be assigned a sequential player number.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/check-in">
                  Open Check-in
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-500" />
                Elimination Tracker
              </CardTitle>
              <CardDescription>
                Track eliminated players throughout the game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mark participants as eliminated, track elimination rounds, and see real-time statistics of remaining players.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/elimination">
                  Track Eliminations
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                Email List
              </CardTitle>
              <CardDescription>
                View all registered participant emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access a list of all registered participant emails for communication and record-keeping.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/emails">
                  View Emails
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </ThemeProvider>
  );
} 