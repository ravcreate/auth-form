import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { generateTwoFactorToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail } from "@/lib/mail"

/**  Checks to see if 2FA is enabled and that the existing user has an email
 *   @async
 *   @function   handleTwoFactorAuth
 *   @param {any?}    existingUser
 *   @param {any?}    code
 *   @returns {Object} {error:string} | {twoFactor:boolean}
 */
export const handleTwoFactorAuth = async (existingUser: any, code?: any) => {
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
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)
        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
        )
        /** Waits for the user to confirm the 2FA token */
        return { twoFactor: true }
    }
}
