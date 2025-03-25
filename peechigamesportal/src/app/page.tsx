import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ThemeProvider } from "@/components/theme-provider";
import landercard from '@/public/cgi/landercard.png';
import landercardback from '@/public/cgi/landercardback.png';
import logofull from '@/public/cgi/logofull.png';
import landerfoot from '@/public/cgi/landerfoot.png';
import Link from 'next/link';

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col bg-black">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full py-12 flex justify-center">
            <Image
            src={logofull}
            alt="Event Logo"
            width={ 600}
            height={ 450}
              className="rounded-lg shadow-2xl"
            priority
          />
            </div>
          <div className="w-full h-px bg-gray-700"></div>
          <div className="w-full bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-white text-center">What are the Peechi Games?</h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2">
                <div className="flex flex-col items-center">
                <p className="mt-2 text-sm text-gray-400 m-4">Additional Information on Back</p>
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  orientation="vertical"
                  className="w-full max-w-xs"
                >
                  <CarouselContent className="-mt-1 h-[250px]">
                    <CarouselItem key={1}>
                      <div className="cursor-grab hover:cursor-grabbing">
                        <Image
                      src={landercard}
                      alt="Lander Card"
                      width={500}
                      height={300}
                      className="rounded-lg shadow-xl"
                      />
                      </div>
                    </CarouselItem>
                    <CarouselItem key={2}>
                      <div className="cursor-grab hover:cursor-grabbing">
                        <Image
                          src={landercardback}
                          alt="Lander Card"
                          width={500}
                          height={300}
                      className="rounded-lg shadow-xl"
                      />
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
                </div>
                </div>
                <div className="md:w-1/2">
                  <p className="text-gray-300 mb-4 text-center">
                    The Peechi Games are the first event of their kind in UT Dallas History.
                  </p>
                  <p className="text-gray-300 mb-4 text-center">
                  Understanding the many financial needs of our schools' students, we have decided to host a competition of sorts, with the winner taking home a substantial cash prize. Losers will not be so lucky. 
                  </p>
                  <p className="text-gray-300 mb-4 text-center">
                  In our benevolence, we have determined that a flat cash prize is insufficient for this event. Instead, <strong> for each competitor who shows up on the day of the competition, we will increase the prize pool by one dollar. </strong> If <strong>146</strong> competitors attend, the pool will be <strong>$146</strong>. If <strong>500</strong> attend, it will be <strong>$500</strong>.
                  </p>
                  <p className="text-gray-200 mb-4 text-center text-lg">
                    <strong>We look forward to your participation</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full py-12">
            <h2 className="text-4xl font-bold mb-8 text-white text-center">How do I join?</h2>
            <Card className="max-w-2xl mx-auto bg-gray-800 text-white">
              <CardContent className="p-6">
                <p className="text-lg mb-4 text-center text-red-500">
                  Due to the event's nature, <strong>only</strong> in-person sign-ups will be held.
                </p>
                <p className="mb-4 text-center">
                  We will have booths on campus from the <strong>25th</strong> through the <strong>28th</strong> of March.
                </p>
                <p className="text-lg font-semibold text-center text-pink-700">
                  Go there, and speak with our representatives to join The Games.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-3xl justify-center mx-auto">
        <Link href="https://acmutd.co" target="_blank" rel="noopener noreferrer">
          <Image
            src={landerfoot}
            alt="Lander Footer"
            layout="responsive"
            className="w-3xl"
          />
        </Link>
        </div>
      </div>
    </ThemeProvider>
  );
}