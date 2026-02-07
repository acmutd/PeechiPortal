'use client'

import Image from "next/image";
import Link from 'next/link';
import { ThemeProvider } from "@/components/theme-provider";

import backgroundImage from '@/public/cgi/bg.png';
import backgroundImageBottom from '@/public/cgi/bg_bottom.png';
import vid_placeholder from '@/public/cgi/video_placeholder.png';
import acmWhiteLogo from '@/public/cgi/acm-white-logo.png';
import instagramIcon from '@/public/cgi/logo_instagram.png';
import linkedinIcon from '@/public/cgi/logo_linkedin.png';
import youtubeIcon from '@/public/cgi/logo_youtube.png';
import triangle from '@/public/cgi/triangle_rightsideup.png';
import triangle_upside from '@/public/cgi/triangle_upsidedown.png';
import prevYearPic1 from '@/public/cgi/prev_year_pic1.png';
import prevYearPic2 from '@/public/cgi/prev_year_pic2.png';
import prevYearPic3 from '@/public/cgi/prev_year_pic3.png';

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
                
        <div 
          className="w-full px-4 md:px-8 relative z-30"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 90%), url(${backgroundImage.src})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center pt-8 px-2 md:px-8">
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
           {/* Peechi Games section */} 
          <div className="mt-32 md:mt-80 pb-10 md:pb-20 w-full flex flex-col items-center text-center"> 
            <h1 className="font-moderna text-[12vw] md:text-[160px] font-normal leading-none uppercase select-none text-transparent bg-clip-text bg-gradient-to-r from-[#FFE9E7] to-[#E84784] tracking-[0.05em]">
              PEECHI GAMES
            </h1>
            
            <div className="w-full max-w-[1100px] flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-0 font-sunday text-[18px] md:text-[28px] font-normal uppercase text-white leading-none mt-8">
              <span className="w-1/2 md:w-auto text-center">April 17th</span>
              <span className="w-1/2 md:w-auto text-center">7 pm to 9 pm</span>
              <span className="w-1/2 md:w-auto text-center">Main Gym</span>
              <span className="w-1/2 md:w-auto text-center">Activity Center</span>
              <Link href="/register" className="w-full md:w-auto text-center mt-4 md:mt-0">
                <span className="text-[#E84784] hover:opacity-80 transition-opacity">Register Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ACM Competition section */}
        <div 
          className="relative w-full -mt-20 md:-mt-32 z-10 flex flex-col"
          style={{
            backgroundImage: `linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%), url(${backgroundImageBottom.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="pt-24 md:pt-40 pb-10 px-4 md:px-8 flex flex-col items-center flex-grow">
            
            <div className="relative w-full max-w-[1200px]">
              <div className="absolute inset-0 w-full h-full hidden md:flex justify-between items-center pointer-events-none opacity-50 lg:opacity-100">
                <div className="relative w-[100px] lg:w-[200px] h-[300px] ml-[-1rem] lg:ml-[-2rem]">
                  <Image src={triangle_upside} alt="upside down" fill className="object-contain" />
                  <Image src={triangle} alt="right side up" fill className="object-contain" />
                </div>
                <div className="relative w-[100px] lg:w-[200px] h-[300px] mr-[-1rem] lg:mr-[-2rem] scale-x-[-1]">
                  <Image src={triangle_upside} alt="upside down" fill className="object-contain" />
                  <Image src={triangle} alt="right side up" fill className="object-contain" />
                </div>
              </div>

              <div className="relative z-20 flex flex-col items-center">
                <h2 className="font-moderna text-[20px] md:text-[32px] text-white uppercase tracking-widest mb-10 md:mb-16">
                  THE ACM Competition
                </h2>

                <div className="w-full max-w-3xl flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-0 items-center font-sunday uppercase text-center">
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[#FF96BE] text-[30px] md:text-[40px]">100</span>
                    <span className="text-[#FF96BE] text-[30px] md:text-[40px] mt-[-10px]">players</span>
                  </div>
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[#E84784] text-[60px] md:text-[80px] flex items-center justify-center">
                      <span className="mr-1">$</span>300
                    </span>
                    <span className="text-[#E84784] text-[60px] md:text-[80px] mt-[-15px]">prize</span>
                  </div>
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[#FF96BE] text-[30px] md:text-[40px]">5</span>
                    <span className="text-[#FF96BE] text-[30px] md:text-[40px] mt-[-10px]">games</span>
                  </div>
                </div>
              </div>
            </div>

          {/* Video; need to replace with actual Video */}
            <div className="w-full mt-20 md:mt-28 max-w-[1500px]">
              <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] overflow-hidden border border-white/10">
                <Image src={vid_placeholder} alt="Video placeholder" fill className="object-cover" />
              </div>
            </div>

            {/* 3 Images + Prev games section */}
            <div className="w-full max-w-[1100px] mt-12 flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8">
              <div className="flex flex-wrap justify-center gap-4">
                {[prevYearPic1, prevYearPic2, prevYearPic3].map((pic, i) => (
                  <div key={i} className="relative w-[140px] h-[90px] sm:w-[200px] sm:h-[130px] md:w-[240px] md:h-[160px]">
                    <Image src={pic} alt={`Past Game ${i+1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col text-center lg:text-left">
                <p className="font-sunday text-white text-[22px] md:text-[28px] leading-tight">
                  Want to see<br />Previous games?
                </p>
                <Link href="#" className="mt-1">
                  <span className="font-sunday text-[#F28EAF] text-[30px] md:text-[52px] hover:underline transition-all">
                    Click here
                  </span>
                </Link>
              </div>
            </div>

          {/* Have a question section */}
            <div className="w-full max-w-[1100px] mt-20 md:mt-28 mb-20 flex flex-col md:flex-row items-center md:items-baseline gap-4 md:gap-6 text-center md:text-left">
              <h2 className="font-moderna text-white text-[32px] sm:text-[48px] md:text-[64px] uppercase whitespace-nowrap">
                HAVE A QUESTION<span className="font-sans">?</span>
              </h2>
              <p className="font-sunday text-white text-[18px] md:text-[24px]">
              Please email <a 
                href="mailto:contact@acmutd.co" 
                className="underline cursor-pointer decoration-[#E84784] underline-offset-4 hover:opacity-80"
              >
                contact@acmutd.co
              </a>
              </p>
            </div>

            {/* Footer */}
            <div className="w-full border-t border-white/20 pt-12 px-2 md:px-8 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center">
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