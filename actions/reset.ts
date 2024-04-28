"use server"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

import { z } from "zod"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    /** Checks to see if the data matches the type */
    const validatedFields = ResetSchema.safeParse(values)

    /**  Checks to see if the */
    if (!validatedFields.success) {
        return { error: "Invalid email!" }
    }

    const { email } = validatedFields.data
    const existingUser = await getUserByEmail(email)

    /** Checks to see if User exists */
    if (!existingUser) return { error: "Email not found!" }

    /** Creates a validation token to verfication */
    const passwordResetToken = await generatePasswordResetToken(email)

    /** sends the email to the user along with a token */
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: "Reset email sent!" }
}
