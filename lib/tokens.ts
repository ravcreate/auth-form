/** uuid is used to generate a token */
import { v4 as uuidv4 } from "uuid"

/** You can use either bycryptjs or crypto for hashing */
import crypto from "crypto"

import { getVerificationTokenByEmail } from "@/data/verification-token"
import { db } from "./db"
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"

/**
 *  Generates a Two Factor Token using uuid
 *  @async
 *  @function  generateTwoFactorToken
 *  @param {string} email
 *  @returns {string} twoFactorToken
 */
export const generateTwoFactorToken = async (email: string) => {
    /** creates a new crypto token with random numbers */
    const token = crypto.randomInt(100000, 1000000).toString()

    /** Set token to expire in 5 mins*/
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

    /** Checks for an existing token and deletes if ones exist */
    const existingToken = await getTwoFactorTokenByEmail(email)
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            },
        })
    }

    /** Creates a new token */
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        },
    })
    return twoFactorToken
}

/**
 *  Generates a Password Reset Token
 *  @async
 *  @function  generatePasswordResetToken
 *  @param {string} email
 *  @returns {string} twoFactorToken
 */
export const generatePasswordResetToken = async (email: string) => {
    /** Generate a new uuid token  */
    const token = uuidv4()

    /** Set the token to expire in an hour */
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

/**
 *  Generates a Verification Token
 *  @async
 *  @function  generateVerificationToken
 *  @param {string} email
 *  @returns {string} verificationToken
 */
export const generateVerificationToken = async (email: string) => {
    /** Creates a new  uuid token */
    const token = uuidv4()

    /** Set the token to expire in an hour */
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
