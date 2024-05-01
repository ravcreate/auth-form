import { db } from "@/lib/db"

/**
 *  Gets the Two Factor Token Confirmation by user id
 *  @async
 *  @function getTwoFactorConfirmationByUserId
 *  @param {string} userId
 *  @returns {{id:string, userId: string, user: Object} | null} twoFactorConfirmation
 */
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique(
            {
                where: { userId },
            }
        )

        return twoFactorConfirmation
    } catch (error) {
        return null
    }
}
