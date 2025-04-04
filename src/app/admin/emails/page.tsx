import { EmailList } from "@/components/email-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthProvider";

export default function EmailsPage() {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                <div className="container mx-auto py-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle>Registered Participants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EmailList />
                        </CardContent>
                    </Card>
                </div>
            </ThemeProvider>
        </AuthProvider>
    );
} 