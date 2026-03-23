"use client"

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Mail, User, GraduationCap } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {app} from "@/app/firebase"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const formSchema = z.object({
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must not exceed 50 characters" }),
    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must not exceed 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    discordUsername: z.string()
        .min(2, { message: "Discord username must be at least 2 characters long" })
        .max(50, { message: "Discord username must not exceed 50 characters" })
        .refine((data) => !data.includes("#") && !data.includes("@"), { message: "Your username included an \"@\" or \"#\", this is no longer supported by Discord. Try again"}),
    school: z.enum(["ECS", "JSOM", "NSM", "EPPS", "IS", "AHT", "BBS", "unaffiliated"], {
        errorMap: () => ({ message: "Please select a valid school" })
    }),
    classification: z.enum(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"], {
        errorMap: () => ({ message: "Please select a valid class" })
    }),
    optin: z.boolean(),
});

export function SignUpForm(){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [notLoggedInAlert, setNLIAlert] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            discordUsername: "n/a",
            school: "ECS",
            classification: "Freshman",
            optin: true,
        },
    })

    const handleAlertClose = () => {
        setIsAlertOpen(false)
        window.location.reload()
    }

    const db = getFirestore();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const { firstName, lastName, email, discordUsername, school, classification, optin} = values;
            const docRef = await addDoc(collection(db, "participants"), {
                firstName,
                lastName,
                email,
                eliminatedround: 0,
                discordUsername,
                school,
                classification,
                optin,
                signup: new Date(),
                iseliminated: false,
                playernumber: null,
                isCheckedIn: false,
            });
            console.log("Document written with ID: ", docRef.id);
            setIsAlertOpen(true)

        // Force page reload if no error occurs
        } catch (error) {
            console.error("Error adding document: ", error);
            setSubmitError("An error occurred while submitting the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
        <Form { ... form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-xl font-sunday text-white/70">
                                <User className="h-4 w-4" />
                                First Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="First Name"
                                    {...field}
                                    className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/70 bg-transparent px-0 text-lg text-white placeholder:text-white/40 focus-visible:ring-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-xl font-sunday text-white/70">
                                <User className="h-4 w-4" />
                                Last Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Last Name"
                                    {...field}
                                    className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/70 bg-transparent px-0 text-lg text-white placeholder:text-white/40 focus-visible:ring-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-xl font-sunday text-white/70">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email Address"
                                        {...field}
                                        className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/70 bg-transparent px-0 text-lg text-white placeholder:text-white/40 focus-visible:ring-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="classification"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-xl font-sunday text-white/70">
                                    <GraduationCap className="h-4 w-4" />
                                    Class Year
                                </FormLabel>
                                <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/70 bg-transparent px-0 text-lg text-white data-[placeholder]:text-white/40 focus:ring-0">
                                        <SelectValue placeholder="Select your class year" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/20 bg-black text-white">
                                        <SelectGroup>
                                            <SelectItem value="Freshman" className="focus:bg-white/10 focus:text-white">Freshman</SelectItem>
                                            <SelectItem value="Sophomore" className="focus:bg-white/10 focus:text-white">Sophomore</SelectItem>
                                            <SelectItem value="Junior" className="focus:bg-white/10 focus:text-white">Junior</SelectItem>
                                            <SelectItem value="Senior" className="focus:bg-white/10 focus:text-white">Senior</SelectItem>
                                            <SelectItem value="Graduate" className="focus:bg-white/10 focus:text-white">Graduate</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {submitError && (
                    <p className="text-sm text-red-300">{submitError}</p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 h-12 w-full rounded-xl border-0 bg-[#e84784] text-xl font-sunday uppercase tracking-wide text-white hover:bg-[#d43c76]"
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </Button>
            </form>
        </Form>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Form Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              We will be in touch. Please return this device to our representative.
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleAlertClose}>Okay</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={notLoggedInAlert} onOpenChange={setNLIAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Form Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              You are not signed in, please do so.
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleAlertClose}>Okay</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}