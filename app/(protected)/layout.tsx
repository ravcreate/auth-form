import { Navbar } from "./_components/navbar"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

interface ProtectedLayoutProps {
    children: React.ReactNode
    session?: Session | null
}

const ProtectedLayout = ({ children, session }: ProtectedLayoutProps) => {
    return (
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <Navbar />
            <SessionProvider session={session}> {children}</SessionProvider>
        </div>
    )
}
export default ProtectedLayout
