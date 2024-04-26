/**
 *   This is the eqivalent of CRUD actions.
 *   ex:  express action
 *
 *   app.get('/', (req, res) => {
 *       res.send("GET Request Called")
 *   })
 */

"use server"

import { z } from "zod"
import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: "" }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    /** Checks if its an AuthError */
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!", success: "" }
        default:
          return { error: "Something went wrong!", success: "" }
      }
    }
    /** Nextjs requires you to throw an error */
    throw error
  }

  return { error: "", success: "Logged In" }
}
