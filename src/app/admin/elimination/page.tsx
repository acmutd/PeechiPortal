import { EliminationSystem } from "@/components/elimination-system";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, UserCheck, Users } from "lucide-react";

export default function EliminationPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Peechi Games Elimination Tracker</h1>
            <p className="text-muted-foreground">Track player eliminations and manage game progress</p>
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
                Check-in
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Player Elimination</CardTitle>
            <CardDescription>
              Manage player eliminations by player number. When a player is eliminated,
              they will be marked in the system and tracked by elimination round.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EliminationSystem />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
} 