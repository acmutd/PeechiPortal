'use client'

import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { User, Mail, Lock } from "lucide-react";

import backgroundImage from '@/public/cgi/bg.png';
import acmWhiteLogo from '@/public/cgi/acm-white-logo.png';
import instagramIcon from '@/public/cgi/logo_instagram.png';
import linkedinIcon from '@/public/cgi/logo_linkedin.png';
import youtubeIcon from '@/public/cgi/logo_youtube.png';

export default function RegisterPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-black">
        
        {/* Background */}
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, black 100%), url(${backgroundImage.src})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
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
                <Link href="https://www.instagram.com/acmutd/" target="_blank"><Image src={instagramIcon} alt="Instagram" className="h-5 md:h-6 w-auto" /></Link>
                <Link href="https://www.linkedin.com/company/acmutd" target="_blank"><Image src={linkedinIcon} alt="LinkedIn" className="h-5 md:h-6 w-auto" /></Link>
                <Link href="https://www.youtube.com/@acmutdallas4256" target="_blank"><Image src={youtubeIcon} alt="YouTube" className="h-5 md:h-6 w-auto" /></Link>

                <Link href="/register">
                  <div className="border border-white md:border-2 bg-transparent px-2 md:px-3 py-1 md:py-2 rounded-lg flex items-center justify-center">
                    <span className="text-white uppercase text-[10px] md:text-[15px] font-sunday font-normal">REGISTER</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content ie Register Card */}
          <div className="flex-grow flex flex-col justify-center py-12 px-4 md:px-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-start">
              
                  <Card className="w-full max-w-xl bg-black/30 border-white/10 shadow-2xl overflow-hidden">                
                  <CardContent className="pt-12 pb-10 px-6 md:px-12">
                  
                  <h1 className="font-moderna text-[60px] md:text-[100px] lg:text-[120px] font-normal leading-none uppercase text-white tracking-tighter mb-12">
                    REGISTER
                  </h1>

                  {/* Form */}
                  <form className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                      <div className="flex items-center gap-4 flex-1 border-b border-white pb-2">
                        <User className="text-white w-6 h-6 opacity-70" />
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          className="bg-transparent border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40"
                        />
                      </div>
                      <div className="flex items-center gap-4 flex-1 border-b border-white pb-2">
                        <User className="text-white w-6 h-6 opacity-70" />
                        <input 
                          type="text" 
                          placeholder="Last Name" 
                          className="bg-transparent border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full border-b border-white pb-2">
                      <Mail className="text-white w-6 h-6 opacity-70" />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="bg-transparent border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40"
                      />
                    </div>

                    <div className="flex items-center gap-4 w-full border-b border-white pb-2">
                      <Lock className="text-white w-6 h-6 opacity-70" />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        className="bg-transparent border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40"
                      />
                    </div>

                  <button 
                    type="submit" 
                    className="w-full mt-4 py-2 rounded-lg font-sunday text-white uppercase text-2xl transition-all cursor-pointer"
                    style={{ backgroundColor: '#E84784' }}
                  >
                    Register
                  </button>

                    <p className="w-full text-center font-gcmolecule text-white text-lg lowercase -mt-4 opacity-80">
                      rock, paper, scissors?
                    </p>     

                    <div className="mt-8 mb-6">
                      <p className="font-sunday text-white text-3xl uppercase tracking-wider mb-3">
                        LOOKING FOR OTHER EVENTS?
                      </p>                      
                      <div className="flex gap-3">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            className="h-25 w-40 bg-[#989898] rounded-lg border border-white/5 shadow-inner"
                          />
                        ))}
                      </div>
                    </div>

                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-auto">
            <div className="w-full border-t border-white/20 pt-8 pb-12 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center">
              <Link href="https://acmutd.co" target="_blank">
                <Image src={acmWhiteLogo} alt="ACM Logo" className="h-6 md:h-7 w-auto" />
              </Link>

              <div className="flex items-center gap-6">
                <Link href="https://www.instagram.com/acmutd/" target="_blank"><Image src={instagramIcon} alt="Instagram" className="h-6 w-auto" /></Link>
                <Link href="https://www.linkedin.com/company/acmutd" target="_blank"><Image src={linkedinIcon} alt="LinkedIn" className="h-6 w-auto" /></Link>
                <Link href="https://www.youtube.com/@acmutdallas4256" target="_blank"><Image src={youtubeIcon} alt="YouTube" className="h-6 w-auto" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
