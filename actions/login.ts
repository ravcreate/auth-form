"use server"

import { z } from "zod"
import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    /** Validate the login data through zod first*/
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    /**  Spread the data if its validated successfully by zod*/
    const { email, password } = validatedFields.data

    /** Checks to see if user exist */
    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    /** If the user has not verified their email,
     *  then generate a verification token
     * and send a confirmation email.
     */
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        )

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: "Confirmation email sent!" }
    }

    /** Attempt to sign in and redirect to a default page */
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        /** Checks if its an AuthError */
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!", success: "" }
                default:
                    return { error: "Something went wrong!", success: "" }
            }
        }
        /** Nextjs requires you to throw an error */
        throw error
    }

    return { success: "Logged In" }
}
