import { db } from "@/lib/db"

/**
 *  Gets the verification token by the token.
 *  @type {[string]}
 */
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        })
        return verificationToken
    } catch (error) {
        return null
    }
}

/**
 *   Gets the verification token by email.
 *   @type {[string]}
 */
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { email },
        })
        return verificationToken
    } catch (error) {
        return null
    }
}
