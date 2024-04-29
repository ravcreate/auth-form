import { db } from "@/lib/db"

/**
 *  Gets the Verification Token by Token
 *  @async
 *  @function getVerificationTokenByToken
 *  @param {string} token
 *  @returns {string | null } verificationToken
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
 *  Gets the Verification Token by Email
 *  @async
 *  @function getVerificationTokenByEmail
 *  @param {string} token
 *  @returns {string | null } verificationToken
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
