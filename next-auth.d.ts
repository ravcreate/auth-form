import NextAuth, { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

/** Extending the user with more properties */
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}
