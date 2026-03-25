'use client'

import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { User, Mail, GraduationCap } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/app/firebase';
import { CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Home as HomeIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import backgroundImage from '@/public/cgi/bg.png';
import acmWhiteLogo from '@/public/cgi/acm-white-logo.png';
import instagramIcon from '@/public/cgi/logo_instagram.png';
import linkedinIcon from '@/public/cgi/logo_linkedin.png';
import youtubeIcon from '@/public/cgi/logo_youtube.png';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }).max(50),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters long" }).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  classification: z.enum(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"], { 
    errorMap: () => ({ message: "Please select a valid year" }) 
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      classification: "Freshman",
    },
  });

  const db = getFirestore(app);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { firstName, lastName, email, classification } = values;
      await addDoc(collection(db, "participants"), {
        firstName,
        lastName,
        email,
        classification,
        eliminatedround: 0,
        discordUsername: "n/a",
        signup: new Date(),
        iseliminated: false,
        playernumber: null,
      });
      setIsAlertOpen(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    router.push('/');
  }
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
              <Link href="/">
                <HomeIcon className="h-5 md:h-7 w-auto text-white" />
              </Link>

              <div className="flex items-center gap-2 md:gap-4">
                <Link href="https://www.instagram.com/acmutd/" target="_blank"><Image src={instagramIcon} alt="Instagram" className="h-5 md:h-6 w-auto" /></Link>
                <Link href="https://www.linkedin.com/company/acmutd" target="_blank"><Image src={linkedinIcon} alt="LinkedIn" className="h-5 md:h-6 w-auto" /></Link>
                <Link href="https://www.youtube.com/@acmutdallas4256" target="_blank"><Image src={youtubeIcon} alt="YouTube" className="h-5 md:h-6 w-auto" /></Link>

                {/* <Link href="/register">
                  <div className="border border-white md:border-2 bg-transparent px-2 md:px-3 py-1 md:py-2 rounded-lg flex items-center justify-center">
                    <span className="text-white uppercase text-[10px] md:text-[15px] font-sunday font-normal">REGISTER</span>
                  </div>
                </Link> */}
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
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-4 border-b border-white pb-2">
                          <User className="text-white w-6 h-6 opacity-70" />
                          <input 
                            {...form.register('firstName')}
                            type="text" 
                            placeholder="First Name" 
                            className="bg-none border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40 selection:bg-transparent selection:text-white"
                          />
                        </div>
                        {form.formState.errors.firstName && (
                          <p className="text-pink-300 text-xs mt-1">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-4 border-b border-white pb-2">
                          <User className="text-white w-6 h-6 opacity-70" />
                          <input 
                            {...form.register('lastName')}
                            type="text" 
                            placeholder="Last Name" 
                            className="bg-none border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40 selection:bg-transparent selection:text-white"
                          />
                        </div>
                        {form.formState.errors.lastName && (
                          <p className="text-pink-300 text-xs mt-1">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-4 border-b border-white pb-2">
                        <Mail className="text-white w-6 h-6 opacity-70" />
                        <input 
                          {...form.register('email')}
                          type="email" 
                          placeholder="Email Address" 
                          className="bg-transparent border-none outline-none text-white w-full font-gcmolecule text-xl placeholder:text-white/40 selection:bg-transparent selection:text-white"
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-pink-300 text-xs mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                   <FormField
                    control={form.control}
                    name="classification"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                              <div>
                              <div className="flex items-center gap-4">
                                <GraduationCap className="text-white w-6 h-6 opacity-70" />
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="bg-transparent border-none p-0 text-white opacity-50 font-gcmolecule text-xl focus-visible:ring-0 focus-visible:border-none w-fit">
                                    <SelectValue className="text-white" placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black border-white/20 text-white">
                                    <SelectGroup>
                                      <SelectItem value="Freshman" className="text-white">Freshman</SelectItem>
                                      <SelectItem value="Sophomore" className="text-white">Sophomore</SelectItem>
                                      <SelectItem value="Junior" className="text-white">Junior</SelectItem>
                                      <SelectItem value="Senior" className="text-white">Senior</SelectItem>
                                      <SelectItem value="Graduate" className="text-white">Graduate</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                
                              </div>
                              <div className=" gap-4 border-b border-white pb-2 w-42 "></div>
                              </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        
                    )}
                />
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3 rounded-lg font-sunday text-white uppercase text-2xl transition-all cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: '#E84784' }}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>

                    <p className="w-full text-center font-gcmolecule text-white text-lg lowercase -mt-4 opacity-80">
                      rock, paper, scissors?
                    </p>

                  </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

         <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
  <AlertDialogContent className="bg-black border border-white/20 text-white max-w-sm rounded-2xl p-8 shadow-2xl">
    
    
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
        <CheckCircle className="w-8 h-8 text-white opacity-80" />
      </div>
    </div>

    <AlertDialogHeader className="text-center space-y-2 mb-6">
      <AlertDialogTitle className="font-gcmolecule text-2xl text-white tracking-wide">
        You're Registered
      </AlertDialogTitle>
      <p className="text-white/50 text-sm leading-relaxed">
        Welcome to the games. Good Luck!
      </p>
    </AlertDialogHeader>

    <AlertDialogFooter className="flex justify-center">
      <AlertDialogAction
        onClick={handleAlertClose}
        className="w-full bg-white text-black font-gcmolecule tracking-widest text-sm py-3 rounded-xl hover:bg-white/90 transition-all duration-200"
      >
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>

  </AlertDialogContent>
</AlertDialog>

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
