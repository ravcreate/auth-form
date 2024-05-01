import { db } from "@/lib/db"

/**
 *  Gets the Two Factor Token by token
 *  @async
 *  @function getTwoFactorTokenByToken
 *  @param {string} token
 *  @returns {string | null } twoFactorToken
 */
export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token },
        })

        return twoFactorToken
    } catch (error) {
        return null
    }
}

/**
 *  Gets the Two Factor Token by email
 *  @async
 *  @function getTwoFactorTokenByEmail
 *  @param {string} email
 *  @returns {string | null} twoFactorToken
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email },
        })

        return twoFactorToken
    } catch (error) {
        return null
    }
}
