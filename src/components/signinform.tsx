"use client"

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
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/app/firebase"

const auth = getAuth(app);

//Dummy Comment for Vercel
const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
});

export function SignInForm(){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setSubmitError(null);
        const { email, password } = values;
        try {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                console.log("Signed in successfully");
                window.confirm("Sign-in successful! You may now register users at /register !");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                window.confirm("Sign-in failed. Please consult your director for login assistance.");
                console.log(errorCode, errorMessage);
                console.error
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            setSubmitError("An error occurred while submitting the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form { ... form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit"><strong>Sign In</strong></Button>
            </form>
        </Form>
    )
}           
