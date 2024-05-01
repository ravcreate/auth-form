"use client"

import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { login } from "@/actions/login"
import { useTransition, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Form } from "@/components/ui/form"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { TwoFactorField } from "./two-factor-field"
import { LoginFields } from "./login-fields"

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked"
            ? "Email already in used with a different provider "
            : ""

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        console.log()

        startTransition(() => {
            login(values, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        form.reset()
                        setError(data.error)
                    }
                    if (data?.success) {
                        form.reset()
                        setSuccess(data.success)
                    }
                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch((error) => setError("Something went wrong."))
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <TwoFactorField
                                control={form.control}
                                disabled={isPending}
                            />
                        )}
                        {!showTwoFactor && (
                            <LoginFields
                                control={form.control}
                                disabled={isPending}
                            />
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
