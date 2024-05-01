import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"

import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"

/**
 *   You can pass custom fields in session token and tokens
 *
 *   async session({ token, session }) {
 *    console.log({ sessionToken: token, session })
 *       if (session.user) session.user.customField = token.customField
 *    return session
 *    },
 *
 *   async jwt({ token }) {
 *    console.log({ token })
 *    token.customField = "test"
 *    return token
 *      },
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    /** Pages are custom pages for when for redirecting users */
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    /** Events allow you to do side effects after a user has logged in */
    events: {
        /**
         *   We can declare side effect functions here
         *   that gets called automatically
         */
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                /**
                 *   Stores a new date when a user logs in.
                 *   We could also use a boolean instead, but a date allows us
                 *   to reverify after a certain amount of time
                 */
                data: { emailVerified: new Date() },
            })
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            /** Allow OAuth without email verification */
            if (account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id!)

            /**  Prevent sign in without email verificatiion */
            if (!existingUser?.emailVerified) return false

            /** 2FA Enabled Check */
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id)

                if (!twoFactorConfirmation) return false

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id },
                })
            }

            return true
        },
        async session({ token, session }) {
            /**
             *	The session uses the values fro the JWT Token
             *   Any upate to the JWT token must also be
             *   passed here
             */
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            if (session.user) {
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean
            }

            /**
             *   Need to also manually assign the values when the user
             *   updates their settings so that the other compnents
             *  will also recognize the change
             */
            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email!
                session.user.isOAuth = token.isOAuth as boolean
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token
            const existingUser = await getUserById(token.sub)

            /**
             *   Extending the user data because these properties may not exist
             *   Also when the user updates their info, we have to also after manually
             *   update their token for the other components to recognize the update.
             */
            if (!existingUser) return token
            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOAuth = !!existingAccount // !! turns it into a boolean
            token.name = existingUser.name
            token.email = existingUser.email
            token.role = existingUser.role
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})
