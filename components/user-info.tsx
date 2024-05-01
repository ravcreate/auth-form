import { ExtendedUser } from "@/next-auth"
import { Card, CardContent, CardHeader } from "./ui/card"

interface UserInfoProps {
    user?: ExtendedUser
    label: string
}

interface UserInfoBlockProps {
    title: string
    info: string | undefined | null
}

const UserInfoBlock = ({ title, info }: UserInfoBlockProps) => {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">{title}</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {info}
            </p>
        </div>
    )
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <UserInfoBlock title="ID" info={user?.id} />
                <UserInfoBlock title="Name" info={user?.name} />
                <UserInfoBlock title="Email" info={user?.email} />
                <UserInfoBlock title="Role" info={user?.role} />
                <UserInfoBlock
                    title="Two Factor Authetication"
                    info={user?.isTwoFactorEnabled ? "ON" : "OFF"}
                />
            </CardContent>
        </Card>
    )
}
