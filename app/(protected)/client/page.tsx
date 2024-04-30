"use client"

import { UserInfo } from "@/components/user-info"
import { useCurrentUser } from "@/hooks/user-current-user"

const ClientPage = () => {
    const user = useCurrentUser()

    return <UserInfo label="😊Client Component" user={user} />
}

export default ClientPage
