/*
This is the eqivalent of CRUD actions.
ex:  express action
app.get('/', (req, res) => {
    res.send("GET Request Called")
})
*/

"use server"

import { z } from "zod"

import { LoginSchema } from "@/schemas"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  return {
    success: "Email Sent!",
  }
}
