"use client"

import { logout } from "@/actions/logout"
import { useCurrentUser } from "@/hooks/user-current-user"
import { useSession, signOut } from "next-auth/react"

const SettingsPage = () => {
    const user = useCurrentUser()

    const onClick = () => {
        signOut()
        // logout()
    }

    return (
        <div className="bg-white p-10 rounded-xl">
            <button type="submit" onClick={onClick}>
                Sign Out
            </button>
        </div>
    )
}
export default SettingsPage
