/**
 *   This file will be used to invoke the middleware because Prisma doesn't work on the edge.
 *   You can use Prisma Acclerrate as an alternative if you dont want to separate out the
 *   config.
 */

import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./data/user"
import bcrypt from "bcryptjs"

import { LoginSchema } from "@/schemas"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }
      },
    }),
  ],
} satisfies NextAuthConfig
