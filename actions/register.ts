/*
This is the eqivalent of CRUD actions.
ex:  express action

app.get('/', (req, res) => {
    res.send("GET Request Called")
})

*/

"use server"

import { z } from "zod"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"

import { RegisterSchema } from "@/schemas"

const salt = 10

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, salt)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // !Always store hashed password!
    },
  })

  // TODO: Send verification token email

  return {
    success: "Account Created!",
  }
}
