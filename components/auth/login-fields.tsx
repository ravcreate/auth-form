import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"

interface LoginFieldsProps {
    control: any
    disabled: boolean
}

export const LoginFields: React.FC<LoginFieldsProps> = ({
    control,
    disabled,
}) => {
    return (
        <>
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={disabled}
                                placeholder="john.doe@example.com"
                                type="email"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={disabled}
                                placeholder="******"
                                type="password"
                            />
                        </FormControl>
                        <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="px-0 font-normal ">
                            <Link href="/auth/reset">Forgot passord?</Link>
                        </Button>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
