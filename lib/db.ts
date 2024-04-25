/*
Required because of Nextjs Hot Reload during development. 
Nextjs will create many instances of prisma and may cause errors.
The solution is to create a singleton and store it in a global var.
*/

import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db
