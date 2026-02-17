import { ParticipantManagement } from "@/components/participant-management";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, UserCheck, FileSpreadsheet } from "lucide-react";
import { AuthProvider } from "@/context/AuthProvider";

export default function ParticipantsPage() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Participant Management</h1>
              <p className="text-muted-foreground">View, add, and manage all Peechi Games participants</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/check-in">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check-In
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
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Search, filter, check in, eliminate, and manage all registered participants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParticipantManagement />
            </CardContent>
          </Card>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
