import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"

import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"

/**
 *   You can pass custom fields in session token and tokens
 *
 *    async session({ token, session }) {
 *        console.log({ sessionToken: token, session })
 *         if (session.user) session.user.customField = token.customField
 *         return session
 *      },
 *
 *    async jwt({ token }) {
 *        console.log({ token })
 *        token.customField = "test"
 *        return token
 *   },
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    /** Pages are custom pages for when for redirecting users*/
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    /** Events allow you to do side effects after a user has logged in */
    events: {
        /** We can declare side effect functions here
         *  that gets called automatically
         */
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                /** Stores a new date when a user logs in.
                 *  We could also use a boolean instead, but a date allows us
                 *  to reverify after a certain amount of time
                 */
                data: { emailVerified: new Date() },
            })
        },
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token
            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token
            token.role = existingUser.role
            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})
