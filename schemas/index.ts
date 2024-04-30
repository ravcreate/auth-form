import { z } from "zod"
import { UserRole } from "@prisma/client"
import { newPassword } from "@/actions/new-password"

export const SettingsSchema = z
    .object({
        name: z.optional(z.string()),
        isTwoFactorEnabled: z.optional(z.boolean()),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z.optional(z.string().min(6)),
        newPassword: z.optional(z.string().min(6)),
    })
    /** refine is used to compare the old and new password */
    .refine(
        (data) => {
            /**
             *   We're making sure the user enters both fields to
             *   be able to change the password
             */

            /** Checks if a  password exist but a new password doesn't */
            if (data.password && !data.newPassword) {
                return false
            }

            return true
        },
        { message: "New password is required!", path: ["newPassword"] }
    )
    .refine(
        (data) => {
            /** Checks if a new password exist but that an old password doesnt*/
            if (data.newPassword && !data.password) {
                return false
            }

            return true
        },
        {
            message: "Password is required!",
            path: ["password"],
        }
    )

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
})

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    name: z.string().min(1, { message: "Name is required" }),
})
