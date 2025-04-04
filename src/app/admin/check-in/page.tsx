import { CheckInSystem } from "@/components/check-in-system";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Users, FileSpreadsheet } from "lucide-react";
import { AuthProvider } from "@/context/AuthProvider";

export default function CheckInPage() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Peechi Games Check-In</h1>
              <p className="text-muted-foreground">Check in participants and assign player numbers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/elimination">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Eliminations
                </Link>
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Participant Check-In</CardTitle>
              <CardDescription>
                Search for participants by name or email, then check them in. 
                Player numbers are automatically assigned in sequential order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckInSystem />
            </CardContent>
          </Card>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
} 