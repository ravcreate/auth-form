"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // some server stuff before you log out the user
    await signOut()
}
