"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCurrentUser } from "@/hooks/user-current-user"
import { settings } from "@/actions/settings"
import { useSession } from "next-auth/react"
import { UserRole } from "@prisma/client"
import { SettingsSchema } from "@/schemas"

import { useTransition, useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
    FormControl,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"

const SettingsPage = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const { update } = useSession()
    const [isPending, startTransition] = useTransition()

    let user = useCurrentUser()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        },
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            /** settings action will return either success or error */
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    }

                    if (data.success) {
                        update()
                        setSuccess(data.success)
                    }
                })
                .catch(() => setError("Somethiing went wrong!"))
        })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            {user?.isOAuth === false && (
                                <>
                                    <FormFieldItem
                                        control={form.control}
                                        name="name"
                                        label="Name"
                                        placeholder="John Doe"
                                        disabled={isPending}
                                    />
                                    <FormFieldItem
                                        control={form.control}
                                        name="email"
                                        label="Email"
                                        placeholder="john.doe@example.com"
                                        disabled={isPending}
                                    />
                                    <FormFieldItem
                                        control={form.control}
                                        name="password"
                                        label="Password"
                                        placeholder="******"
                                        disabled={isPending}
                                    />
                                    <FormFieldItem
                                        control={form.control}
                                        name="newPassword"
                                        label="New Password"
                                        placeholder="******"
                                        disabled={isPending}
                                    />
                                </>
                            )}
                            <FormFieldSelectItem
                                control={form.control}
                                disabled={isPending}
                            />
                            <FormField
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>
                                                Two Factor Authentication
                                            </FormLabel>
                                            <FormDescription>
                                                Enable two factor authentication
                                                for your account
                                            </FormDescription>
                                        </div>
                                        Field Value: {field.value}
                                        <FormControl>
                                            <Switch
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button disabled={isPending} type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

/**
 *  Form Field Items
 *
 *
 */
interface FormFieldItemProps {
    control: any
    name: string
    label: string
    placeholder: string
    disabled: boolean
}

const FormFieldItem = ({
    control,
    name,
    label,
    placeholder,
    disabled,
}: FormFieldItemProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 *  Form Field Select Items
 *
 *
 */
interface FormFieldSelectItemProps {
    control: any
    disabled: boolean
}

const FormFieldSelectItem = ({
    control,
    disabled,
}: FormFieldSelectItemProps) => {
    return (
        <FormField
            control={control}
            name="role"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                        disabled={disabled}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={UserRole.ADMIN}>
                                Admin
                            </SelectItem>
                            <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default SettingsPage
