import { ParticipantManagement } from "@/components/participant-management";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthProvider";
import Image from "next/image";
import Link from "next/link";

import backgroundImage from "@/public/cgi/bg.png";
import acmWhiteLogo from "@/public/cgi/acm-white-logo.png";
import instagramIcon from "@/public/cgi/logo_instagram.png";
import linkedinIcon from "@/public/cgi/logo_linkedin.png";
import youtubeIcon from "@/public/cgi/logo_youtube.png";

export default function AdminDashboard() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-black">

          {/* Background */}
          <div
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, black 100%), url(${backgroundImage.src})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">

            {/* Header */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex justify-between items-center pt-8 flex-shrink-0">
                <Link href="https://acmutd.co" target="_blank">
                  <Image src={acmWhiteLogo} alt="ACM Logo" className="h-5 md:h-7 w-auto" />
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                  <Link href="https://www.instagram.com/acmutd/" target="_blank">
                    <Image src={instagramIcon} alt="Instagram" className="h-5 md:h-6 w-auto" />
                  </Link>
                  <Link href="https://www.linkedin.com/company/acmutd" target="_blank">
                    <Image src={linkedinIcon} alt="LinkedIn" className="h-5 md:h-6 w-auto" />
                  </Link>
                  <Link href="https://www.youtube.com/@acmutdallas4256" target="_blank">
                    <Image src={youtubeIcon} alt="YouTube" className="h-5 md:h-6 w-auto" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content */}
            <main className="flex-1 flex items-start justify-center px-4 md:px-8 py-8">
              <div className="w-full max-w-5xl">
                <ParticipantManagement />
              </div>
            </main>

            {/* Footer */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-auto">
              <div className="w-full border-t border-white/20 pt-8 pb-12 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center">
                <Link href="https://acmutd.co" target="_blank">
                  <Image src={acmWhiteLogo} alt="ACM Logo" className="h-6 md:h-7 w-auto" />
                </Link>

                <div className="flex items-center gap-6">
                  <Link href="https://www.instagram.com/acmutd/" target="_blank">
                    <Image src={instagramIcon} alt="Instagram" className="h-6 w-auto" />
                  </Link>
                  <Link href="https://www.linkedin.com/company/acmutd" target="_blank">
                    <Image src={linkedinIcon} alt="LinkedIn" className="h-6 w-auto" />
                  </Link>
                  <Link href="https://www.youtube.com/@acmutdallas4256" target="_blank">
                    <Image src={youtubeIcon} alt="YouTube" className="h-6 w-auto" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
