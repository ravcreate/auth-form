/**
 *   This class is used to get the verification token.
 *   If one already exist, it will override or create a new one.
 *  @type   {[string]}
 */

/** uuid is used to generate a token */
import { v4 as uuidv4 } from "uuid"
import { getVerificationTokenByEmail } from "@/data/verification-token"
import { db } from "./db"
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    /** Creates the token and generates the expiration date */
    const existingToken = await getPasswordResetTokenByEmail(email)

    /**  Deletes an existing token if it exist */
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        })
    }

    /** Overrides or create a verification token */
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    })

    return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
    /** Creates the token and generates the expiration date */
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getVerificationTokenByEmail(email)
    /**  Deletes an existing token if it exist */
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        })
    }

    /** Overrides or create a verification token */
    const verficationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    })

    return verficationToken
}
