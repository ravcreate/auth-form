/** TODO: Change localhost to domain for production */

/** uses Resend to send confirmation emails */
import { Resend } from "resend"
import { string } from "zod"

/** @type {string} */
const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

/**
 *  Send an Email with a 2FA token
 *  @async
 *  @function sentTwoFactorTokenEmail
 *  @param {string} email
 *  @param {string} token
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Here's Your 2FA Token Code",
        html: `<p>Your 2FA code: ${token}</p>`,
    })
}

/**
 *  Generate a link with a token in the url
 *  so that we can use the search params to verify
 *  @async
 *  @function sentPasswordResetEmail
 *  @param {string} email
 *  @param {string} token
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
    /** @type {string} */
    const resetLink = `${domain}/auth/new-password?token=${token}`

    /** sends an email with the reset link */
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    })
}

/**
 *  Generate a link with a  token in the url
 *  so that we can use the search params to verify
 *  @async
 *  @function sentVerificationEmail
 *  @param {string} email
 *  @param {string} token
 */
export const sendVerificationEmail = async (email: string, token: string) => {
    /** @type {string }*/
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    /** sends an email with the confirmation link */
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm </p>`,
    })
}
