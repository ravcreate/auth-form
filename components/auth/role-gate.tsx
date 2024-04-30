"use client"

import { UserRole } from "@prisma/client"

import { useCurrentRole } from "@/hooks/user-current-role"
import { FormError } from "../form-error"

interface RoleGateProps {
    children: React.ReactNode
    allowedRole: UserRole
}

/**
 *	Creates a gate that only allows content that is accessible by certain roles
 */
export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole()

    if (role !== allowedRole) {
        return (
            <FormError message="You do not have permission to view this content." />
        )
    }

    return <>{children}</>
}
