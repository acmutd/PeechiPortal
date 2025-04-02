"use client"

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/app/firebase"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
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
    emailConfirmation: z.string().email({ message: "Invalid email address" }),
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
}).refine((data) => data.email === data.emailConfirmation, {message: "Email addresses do not match", path: ["emailConfirmation"], });

export function SignUpForm(){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [notLoggedInAlert, setNLIAlert] = useState(false)
    const [formData, setFormData] = useState({})


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            emailConfirmation: "",
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Ahjussi" {...field} />
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
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Peechi" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Peechissi@utdallas.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emailConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Confirmation</FormLabel>
                            <FormControl>
                                <Input placeholder="Peechissi@utdallas.edu" {...field} />
                            </FormControl>
                            <FormDescription>
                                Confirm Your Email Address
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            
                <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>School of Study</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your school of study" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="ECS">ECS</SelectItem>
                                        <SelectItem value="JSOM">JSOM</SelectItem>
                                        <SelectItem value="AHT">AHT</SelectItem>
                                        <SelectItem value="NSM">NSM</SelectItem>
                                        <SelectItem value="EPPS">EPPS</SelectItem>
                                        <SelectItem value="IS">IS</SelectItem>
                                        <SelectItem value="BBS">BBS</SelectItem>
                                        <SelectItem value="unaffiliated">Unaffiliated</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormDescription>
                                Your School of Study
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="classification"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class Year</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your class year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Freshman">Freshman</SelectItem>
                                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                                        <SelectItem value="Junior">Junior</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                        <SelectItem value="Graduate">Graduate</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormDescription>
                                Classification by Year
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="optin"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Opt-in for Communications
                                </FormLabel>
                                <FormDescription>
                                    I would like to receive communications from the ACM at UTD about future events like this!
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit"><strong>I Will Be There.</strong></Button>
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