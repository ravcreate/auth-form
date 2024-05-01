"use server"

import { z } from "zod"
import { SettingsSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import bcrypt from "bcryptjs"

/**
 *	Attempts to updates the users info and returns message
 *  @async
 * @function settings
 *  @param {Object} values
 */
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    /** Checks for a current user  */
    const user = await currentUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    /** Checks to see if user is in the database */
    const dbUser = await getUserById(user.id!)
    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    /** Checks to see if user is using OAuth */
    if (user.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }

    /** Checks to see if user is updating to a diffferent email */
    if (values.email && values.email !== user.email) {
        /**
         *   Checks to see if the updated email is already in use
         *   and that we are no that user
         */
        const existingUser = await getUserByEmail(values.email)
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" }
        }

        /** Generates a new verification email if previous conditions are met */
        const verificationToken = await generateVerificationToken(values.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: "Verification email sent!" }
    }

    /** Checks to see if password and new  password field matches and password exist in db  */
    if (values.password && values.newPassword && dbUser.password) {
        /** Compares the current password with the existing one in db */
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        )

        if (!passwordsMatch) {
            return { error: "Incorrect Password!" }
        }

        /** Hashes the new password and stores it for the update */
        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = hashedPassword
        values.newPassword = undefined
    }

    /**
     *   Updates the user's data with all the values
     */
    await db.user.update({
        where: {
            id: dbUser.id,
        },
        data: {
            ...values,
        },
    })

    return {
        success: "Settings Updated!",
    }
}
