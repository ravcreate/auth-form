"use server"

import { z } from "zod"
import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"

import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { generateTwoFactorToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail } from "@/lib/mail"

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null
) => {
    /** Validate the login data through zod first*/
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    /**  Spread the data if its validated successfully by zod*/
    const { email, password, code } = validatedFields.data

    /** Checks to see if user exist */
    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    /**
     *   If the user has not verified their email,
     *  then generate a verification token
     *  and send a confirmation email.
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

    /** Handles Two Factor Auth */
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            )

            /** Checks for a token */
            if (!twoFactorToken) {
                return { error: "Invalid code!" }
            }

            /** Checks if token matches */
            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" }
            }

            /** Checks to see if token has expired */
            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if (hasExpired) {
                return { error: "Code expired!" }
            }

            /** Deletes the existing token */
            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id },
            })

            /** Deletes the existing token confirmation */
            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            )
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id },
                })
            }

            /** Creates a new token for the next login attempt */
            await db.twoFactorConfirmation.create({
                data: { userId: existingUser.id },
            })
        } else {
            /** Generated the token and sends the email with the token */
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email
            )
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )
            /** Waits for the user to confirm the 2FA token */
            return { twoFactor: true }
        }
    }

    /** Attempt to sign in and redirect to a default page */
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        /** Checks if its an AuthError */
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        /** Nextjs requires you to throw an error */
        throw error
    }

    return { success: "Logged In" }
}
