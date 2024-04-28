"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)

    /** Checks to see if the token exist */
    if (!existingToken) {
        return { error: "Token does not exist." }
    }

    /**  Checks to see if token has expired */
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Token has expired." }
    }

    /**  Checks to see if the user exist */
    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return { error: "Email does not exist." }
    }

    /** Updates the Database to show that the email 
    has been verified and stores a new email */
    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email },
    })

    /** Deletes the existing verification token because its no longer needed */
    await db.verificationToken.delete({
        where: { id: existingToken.id },
    })

    return { success: "Email verified!" }
}
