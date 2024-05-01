import { useSession } from "next-auth/react"

/**
 * Gets only the user data from the session
 *  @function useCurrentUser
 *   @returns {JSON} user data in JSON format
 */
export const useCurrentUser = () => {
    const session = useSession()

    return session?.data?.user
}
